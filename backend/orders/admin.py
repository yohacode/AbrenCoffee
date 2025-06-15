from django.contrib import admin
from .models import ShippingAddress, OrderItem, Order

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'session_key', 'status', 'created_at', 'total_price')

class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id','order', 'product','price','quantity')

# ShippingAddress Admin
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'email', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'country', 'created_at')
    search_fields = ('full_name', 'email', 'city', 'country')
    ordering = ('-created_at',)
    
    def full_address(self, obj):
        return obj.full_address()
    full_address.short_description = 'Full Address'

    fieldsets = (
        (None, {
            'fields': ('user', 'session_key', 'full_name', 'email', 'phone_number')
        }),
        ('Address Details', {
            'fields': ('address1', 'address2', 'city', 'street', 'state', 'country', 'zipcode')
        }),
        ('Status', {
            'fields': ('status',)
        }),
    )

admin.site.register(ShippingAddress, ShippingAddressAdmin)


admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(Order, OrderAdmin)