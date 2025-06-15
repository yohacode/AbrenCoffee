from django.contrib import admin
from .models import Product, Category, Discount

class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'stock', 'quantity','is_subscription', 'discount', 'image')
    search_fields = ('name',)
    list_filter = ('name',)
    list_per_page = 20

    list_editable = ('price', 'stock','image')
    fieldsets = [
        ('Basic Info', {'fields': ['name', 'price', 'discount', 'is_subscription','stock', 'quantity', 'image','category']}),
    ]

    def has_add_permission(self, request):
        return request.user.is_superuser

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        obj.save()


    
admin.site.register(Product, ProductAdmin)
admin.site.register(Category)
admin.site.register(Discount)

