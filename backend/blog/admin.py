from django.contrib import admin
from .models import Blog, Category, Comments, Reactions

class CategoryAdmin(admin.ModelAdmin):
    list_display = ( 'id','name')
    prepopulated_fields = {'id': ('name',)}

class BlogAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at', 'is_published')
    list_filter = ('is_published', 'created_at')
    search_fields = ('title', 'content', 'tags')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    list_editable = ('is_published',)
    fieldsets = (
        (None, {
            'fields': ('title', 'content', 'author', 'image', 'tags', 'category','is_published')
        }),
    )
    readonly_fields = ('created_at', 'updated_at')
    save_on_top = True
    actions = ['make_published', 'make_unpublished']

    def make_published(self, request, queryset):
        queryset.update(is_published=True)
        self.message_user(request, "Selected blogs have been marked as published.")

    make_published.short_description = "Mark selected blogs as published"

    def make_unpublished(self, request, queryset):
        queryset.update(is_published=False)
        self.message_user(request, "Selected blogs have been marked as unpublished.")

admin.site.register(Blog, BlogAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Comments)
admin.site.register(Reactions)
