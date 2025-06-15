from django.db import models
from users.models import CustomUser

class PageVisit(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    session_key = models.CharField(max_length=40, blank=True, null=True)
    path = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    referrer = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'{self.user} visited {self.path} at {self.timestamp}'
    

