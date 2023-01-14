from django.contrib.admin.sites import AdminSite
from django.contrib.admin import ModelAdmin
from django.contrib.auth import admin as auth_admin

from djangomni_search.admin import OmniSearchAdminSite

from .models import Unsearchable


class UnsearchableAdmin(ModelAdmin):
    pass


class SiteAdmin(OmniSearchAdminSite, AdminSite):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.register(auth_admin.User, auth_admin.UserAdmin)
        self.register(auth_admin.Group, auth_admin.GroupAdmin)
        self.register(Unsearchable, UnsearchableAdmin)


def return_true(*args, **kwargs):
    return True

auth_admin.UserAdmin.has_view_permission = return_true
auth_admin.GroupAdmin.has_view_permission = return_true

site = SiteAdmin()
