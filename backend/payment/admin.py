from django.contrib import admin
from .models import Payment, Invoice

# Payment Admin
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('user', 'order', 'payment_method', 'status', 'amount', 'transaction_id', 'timestamp')
    list_filter = ('payment_method', 'status', 'timestamp')
    search_fields = ('transaction_id', 'user__email', 'order__full_name')
    ordering = ('-timestamp',)

    fieldsets = (
        (None, {
            'fields': ('user', 'order', 'payment_method', 'status', 'amount', 'transaction_id')
        }),
        
    )


admin.site.register(Payment, PaymentAdmin)
admin.site.register(Invoice)
