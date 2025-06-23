from django.contrib import admin
from .models import Subscription

class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'provider', 'external_id', 'active', 'created_at')
    search_fields = ('user__email', 'provider', 'external_id')
    list_filter = ('provider', 'active')

# Register your models here.
admin.site.register(Subscription, SubscriptionAdmin)
