from django.contrib import admin
from .models import WishlistItem

class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'added_at']
    readonly_fields = ['added_at',]


admin.site.register(WishlistItem, WishlistAdmin)
