from django.contrib import admin
from .models import CustomUser, Role

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email',  'first_name', 'last_name', 'role', 'is_staff')
    search_fields = ('username', 'email')
    list_filter = (['is_staff'])
    ordering = ('id',)

    fieldsets = (
        (None, {'fields': ('email', 'password','username', 'profile_image','first_name', 'last_name', 'role', 'is_staff')}),
        ('Permissions', {'fields': ('groups', 'user_permissions')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name', 'role', 'is_staff')}
        ),
    )

    exclude = ('last_login',)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Role)


