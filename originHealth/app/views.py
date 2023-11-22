from django.shortcuts import render
from app.models import *
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from app.serializers import UserRegistrationSerializer,UserLoginSerializer,ImageLabelSerializer
from django.contrib.auth import authenticate
from app.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework import status
from rest_framework import generics,filters
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import logout
# from rest_framework.generics import ListAPIView   

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
# Create your views here.
class UserRegistration(APIView):
    def post(self,request):
        serializer=UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user=serializer.save()
            token=get_tokens_for_user(user)
            return Response({'token':token,'msg':"Registration successfully",'is_admin': user.is_admin})    
        return Response(serializer.errors)
    
class UserLoginView(APIView):
    renderer_classes=[UserRenderer]
    def post(self,request):
        serializer=UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email=serializer.data.get('email')
            password=serializer.data.get('password')
            user=authenticate(email=email,password=password)
            if user is not None:
                token=get_tokens_for_user(user)
                return Response({'token':token,'msg':"User login successfully",'is_admin': user.is_admin})
            else:
                return Response({'errors':{'non_field_errors':['Email or Password is not valid']}})
        return Response(serializer.errors)

class ImageView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    pagination_class = PageNumberPagination
    def get(self,request):
        paginator = PageNumberPagination()
        paginator.page_size = 12
        images=ImageLabel.objects.all()
        result_page = paginator.paginate_queryset(images, request)
        serializer=ImageLabelSerializer(result_page,many=True)
        return Response(serializer.data)
class ImageUploadView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAdminUser]
    def post(self,request):
        serializer=ImageLabelSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ImageSearchView(generics.ListAPIView):
    queryset = ImageLabel.objects.all()
    serializer_class = ImageLabelSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['label']

    def get(self, request, *args, **kwargs):
        search_term = request.query_params.get('search', None)
        if search_term:
            queryset = self.filter_queryset(self.get_queryset())
            queryset = queryset.filter(label__icontains=search_term)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        # else:
        #     images=ImageLabel.objects.all()
        #     serializer=ImageLabelSerializer(images,many=True)
        #     return Response(serializer.data)
            
        else:
            return Response({'message': 'Please provide a search term'}, status=400)
class logOutView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]   
    def post(self,request):
        logout(request)
        return Response({'msg':"User logout successfully"})
    