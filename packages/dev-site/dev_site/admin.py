from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib.admin.sites import AdminSite
from django.contrib.admin import ModelAdmin
from django.contrib.auth import admin as auth_admin
from django.urls import path, reverse
from django.utils.html import format_html
from django.views.generic.detail import DetailView

from djangomni_search.admin import OmniSearchAdminSite

from .models import Unsearchable, WithDetail


# This model should not appear in the search
class UnsearchableAdmin(ModelAdmin):
    pass


class WithDetailDetailView(PermissionRequiredMixin, DetailView):
    permission_required = 'dev_site.view_withdetail'
    template_name = 'admin/withdetail/detail.html'
    model = WithDetail
    admin_site = None

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['original'] = self.object
        context['change'] = True
        context = context | self.admin_site.each_context(self.request)
        return context


# This model should be searchable and should redirect to the admin detail page
class WithDetailAdmin(ModelAdmin):
    search_fields = ('name',)
    list_display = ('detail_link', 'name')

    def get_detail_route_name(self):
        app_name = self.model._meta.app_label
        model_name = self.model._meta.model_name
        return f"{app_name}_{model_name}_detail"

    def get_detail_route_target(self):
        return f'{self.admin_site.name}:{self.get_detail_route_name()}'

    def get_urls(self):
        return [
            path(
                '<pk>/detail',
                self.admin_site.admin_view(
                    WithDetailDetailView.as_view(
                        admin_site=self.admin_site,
                        extra_context={
                            'opts': self.model._meta,
                        },
                    )),
                name=self.get_detail_route_name(),
            ),
            *super().get_urls(),
        ]

    def detail_link(self, obj):
        url = reverse(f'{self.get_detail_route_target()}', args=[obj.pk])
        return format_html(f'<a href="{url}">{obj.pk}</a>')


class SiteAdmin(OmniSearchAdminSite, AdminSite):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.register(auth_admin.User, auth_admin.UserAdmin)
        self.register(auth_admin.Group, auth_admin.GroupAdmin)
        self.register(Unsearchable, UnsearchableAdmin)
        self.register(WithDetail, WithDetailAdmin)


def return_true(*args, **kwargs):
    return True

auth_admin.GroupAdmin.has_view_permission = return_true
auth_admin.UserAdmin.has_view_permission = return_true
UnsearchableAdmin.has_view_permission = return_true
WithDetailAdmin.has_view_permission = return_true

site = SiteAdmin()
