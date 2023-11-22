from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('register', UserRegistration.as_view(),name='register'),
    path('login', UserLoginView.as_view(),name='login'),
    path('upload-image', ImageUploadView.as_view(),name='upload-image'),
    path('view-image', ImageView.as_view(),name='view-image'),
    path('search-view', ImageSearchView.as_view(),name='search-view'),
    path('logout-view', logOutView.as_view(),name='logout'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)