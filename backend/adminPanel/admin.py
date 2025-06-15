from django.contrib import admin
from .models import PageVisit

@admin.register(PageVisit)
class PageVisitAdmin(admin.ModelAdmin):
    list_display = ('user', 'session_key', 'path', 'timestamp', 'ip_address', 'referrer')
    list_filter = ('timestamp', 'path')
    search_fields = ('user__username', 'path', 'ip_address', 'user_agent', 'referrer')

