# frontend/urls.py
from django.urls import re_path
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache

# Serve React index.html
index_view = never_cache(TemplateView.as_view(template_name="index.html"))

urlpatterns = [
    re_path(r"^(?!adminPage|api|users|products|orders|payment|adminPanel|blog|cart|subscription|wishlist|paypal).*$", index_view),
]

