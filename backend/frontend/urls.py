from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.cache import never_cache
from django.views.generic import TemplateView
from django.urls import re_path

index_view = never_cache(TemplateView.as_view(template_name="index.html"))

urlpatterns = []

# ✅ Only add this at the VERY END
# Make sure `media/`, `static/`, and all API paths are excluded
urlpatterns += [
    re_path(
        r"^(?!adminPage|api|media|static|users|products|orders|payment|adminPanel|blog|cart|subscription|wishlist|paypal).*$",
        index_view
    ),
]

# ✅ This ensures Django serves media during production too
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
