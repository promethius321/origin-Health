from rest_framework import serializers
from app.models import MyUser,ImageLabel
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model=MyUser
        fields=['email','name','password']
        extra_kwargs={
            'password':{'write_only':True}
        }
    
    def create(self,validate_data):
        return MyUser.objects.create_user(**validate_data)
    
class UserLoginSerializer(serializers.ModelSerializer):
    email=serializers.EmailField(max_length=255)
    class Meta:
        model=MyUser
        fields=['email','password']

class ImageLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model=ImageLabel
        fields=['image','label']