from django.db import models
from users.models import CustomUser

class Category(models.Model):
    name = models.CharField(("Category"), max_length=50)

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
    
class Tag(models.Model):
    name = models.CharField(("Name"), max_length=50)

    def __str__(self):
        return self.name


class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.ForeignKey(Category, verbose_name=("Category"), on_delete=models.CASCADE)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='blogs')
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True, default='blog_images/default.jpg')
    tags = models.ForeignKey(Tag, verbose_name=("Tag"), on_delete=models.CASCADE, null=True, blank=Tag)
    is_published = models.BooleanField(default=False)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Blog'
        verbose_name_plural = 'Blogs'
        
    def __str__(self):
        return self.title

    def get_tags_list(self):
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',') if tag.strip()]
        return []
    
    def get_absolute_url(self):
        return f"/blog/{self.id}/"
    


class Comments(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='comments',blank=True, null=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, blank=True, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def is_guest(self):
        return self.author is None

class Reactions(models.Model):
    type = [
        ('like', 'Like'),
        ('dislike', 'Dislike'),
        ('love', 'Love'),
        ('sad', 'Sad'),
        ('funny', 'Funny'),
        ('angry', 'Angry'),
    ]
    blog = models.ForeignKey(Blog, verbose_name=("Blog"), on_delete=models.CASCADE)
    author = models.ForeignKey(CustomUser, verbose_name=("Author"), on_delete=models.CASCADE, blank=True, null=True)
    reaction = models.CharField(("Reactions"), max_length=50, choices=type, blank=True, null=True)
    created_at = models.DateTimeField(("Created at"), auto_now=False, auto_now_add=True)

    class Meta:
        unique_together = ('author', 'blog')

    def __str__(self):
        return self.author.username if self.author else "Anonymous"

    
