import json
from functools import update_wrapper

from django.conf import settings
from django.contrib.auth import admin as auth_admin
from django.utils.translation import gettext_lazy as _
from django.contrib.admin.sites import AdminSite
from django.urls import reverse

from django.apps import apps
from django.core.exceptions import FieldDoesNotExist, PermissionDenied
from django.http import Http404, JsonResponse
from django.views.generic.list import BaseListView


class OmniSearchModelView(BaseListView):
    paginate_by = 20
    admin_site = None
    to_field_name = 'pk'

    def get(self, request, *args, **kwargs):
        """
        Return a JsonResponse with search results as defined in
        serialize_result(), by default:
        {
            results: [{id: "123" text: "foo"}],
            pagination: {more: true}
        }
        """
        (
            self.term,
            self.model_admin,
        ) = self.process_request(request)

        if not self.has_perm(request):
            raise PermissionDenied

        self.object_list = self.get_queryset()
        context = self.get_context_data()
        return JsonResponse(
            {
                "results": [
                    self.serialize_result(obj, self.to_field_name)
                    for obj in context["object_list"]
                ],
                "pagination": {"more": context["page_obj"].has_next()},
            }
        )

    def serialize_result(self, obj, to_field_name):
        """
        Convert the provided model object to a dictionary that is added to the
        results list.
        """
        return {"id": str(getattr(obj, to_field_name)), "text": str(obj)}

    def get_paginator(self, *args, **kwargs):
        """Use the ModelAdmin's paginator."""
        return self.model_admin.get_paginator(self.request, *args, **kwargs)

    def get_queryset(self):
        """Return queryset based on ModelAdmin.get_search_results()."""
        qs = self.model_admin.get_queryset(self.request)
        qs, search_use_distinct = self.model_admin.get_search_results(
            self.request, qs, self.term
        )
        if search_use_distinct:
            qs = qs.distinct()
        return qs

    def process_request(self, request):
        """
        Validate request integrity, extract and return request parameters.

        Since the subsequent view permission check requires the target model
        admin, which is determined here, raise PermissionDenied if the
        requested app, model or field are malformed.

        Raise Http404 if the target model admin is not configured properly with
        search_fields.
        """
        term = request.GET.get("term", "")
        try:
            app_label = request.GET["app"]
            model_name = request.GET["model"]
        except KeyError as e:
            raise PermissionDenied from e

        # Retrieve objects from parameters.
        try:
            source_model = apps.get_model(app_label, model_name)
        except LookupError as e:
            raise PermissionDenied from e
        try:
            model_admin = self.admin_site._registry[source_model]
        except KeyError as e:
            raise PermissionDenied from e

        # Validate suitability of objects.
        if not model_admin.get_search_fields(request):
            raise Http404(
                "%s must have search_fields for the autocomplete_view."
                % type(model_admin).__qualname__
            )

        return term, model_admin

    def has_perm(self, request, obj=None):
        """Check if user has permission to access the related model."""
        return self.model_admin.has_view_permission(request, obj=obj)


class SiteAdmin(AdminSite):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.register(auth_admin.User, auth_admin.UserAdmin)
        self.register(auth_admin.Group, auth_admin.GroupAdmin)

    def format_model(self, app, model):
        return {
            'app': {
                'name': str(app['name']),
                'label': str(app['app_label']),
                'url': str(app['app_url']),
            },
            'addUrl': str(model['add_url']),
            'adminUrl': str(model['admin_url']),
            'name': str(model['name']),
            'ident': str(model['model']._meta.model_name),
            'objectName': str(model['object_name']),
        }

    def get_omnisearch_context(self, ctx):
        items = []
        for app in ctx['available_apps']:
            for model in app['models']:
                items.append(self.format_model(app, model))
        if len(items) == 0:
            return None
        return { 
            'models': items,
            'placeholder': str(ctx['site_header']),
            'searchUrl': reverse("admin:omnisearch"),
        }

    def omnisearch_view(self, request):
        return OmniSearchModelView.as_view(admin_site=self)(request)

    def each_context(self, request):
        ctx = super().each_context(request)
        ctx['omni_search'] = json.dumps(self.get_omnisearch_context(ctx))
        print(ctx, flush=True)
        return ctx

    def get_urls(self):
        from django.urls import path
        def wrap(view, cacheable=False):
            def wrapper(*args, **kwargs):
                return self.admin_view(view, cacheable)(*args, **kwargs)
            wrapper.admin_site = self
            return update_wrapper(wrapper, view)
        return [
            path("omnisearch/", self.omnisearch_view, name="omnisearch"),
        ] + super().get_urls()

site = SiteAdmin()
