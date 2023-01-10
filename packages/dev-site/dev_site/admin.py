from django.contrib.admin.sites import AdminSite
from django.contrib.auth import admin as auth_admin

from djangomni_search.admin import OmniSearchAdminSite


class SiteAdmin(OmniSearchAdminSite, AdminSite):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.register(auth_admin.User, auth_admin.UserAdmin)
        self.register(auth_admin.Group, auth_admin.GroupAdmin)

site = SiteAdmin()
