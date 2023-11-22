from django.contrib import admin
from app.models import *
# Register your models here.
@admin.register(ImageLabel)
class ImageLabelAdmin(admin.ModelAdmin):
    list_display=['label']