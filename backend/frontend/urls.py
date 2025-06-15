from django.urls import path, re_path
from .views import FrontendView

urlpatterns = [
    path(r'^.*$', FrontendView.as_view(), name='Frontend'),
]
