from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Blog, Category
from .serializers import BlogSerializer, BlogCreateSerializer, CategorySerializer, BlogUpdateSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly,AllowAny,IsAuthenticated,IsAdminUser
from django.shortcuts import get_object_or_404

class BlogList(APIView):
    """
    APIView for retrieving a list of blog posts.
    - Requires authentication for write operations; read-only access is allowed for unauthenticated users.
    - Retrieves all blog posts ordered by creation date in descending order.
    - Returns serialized blog data in the response.
    """

    permission_classes = [AllowAny]

    def get(self, request, format=None):
        blogs = Blog.objects.all().order_by('-created_at')
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data)

class BlogDetail(APIView):
    """
    Handles retrieving the details of a specific blog post.
    Methods:
        get(request, pk, format=None): Retrieves a blog post by its primary key (pk) 
        and returns its serialized data. Requires authentication for write access.
    """

    permission_classes = [AllowAny]

    def get(self, request, pk, format=None):
        blog = get_object_or_404(Blog, pk=pk)
        serializer = BlogSerializer(blog)
        return Response(serializer.data)

class BlogCreate(APIView):
    """
    Handles the creation of blog posts.
    This view allows authenticated users to create new blog posts. If the request data 
    is valid, a new blog post is created and returned in the response. Otherwise, 
    validation errors are returned.
    Methods:
        post(request, format=None): Processes the creation of a new blog post.
    """

    permission_classes = [IsAdminUser]

    def post(self, request, format=None):
        serializer = BlogCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            blog = serializer.save(author=request.user)
            return Response(BlogSerializer(blog).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BlogUpdate(APIView):
    """
    Handles updating a blog post.
    Methods:
        put(request, pk, format=None):
            Updates a blog post if the authenticated user is the author.
            Returns the updated blog data or an error response.
    """
    
    permission_classes = [IsAdminUser]

    def put(self, request, pk, format=None):
        blog = get_object_or_404(Blog, pk=pk)
        serializer = BlogUpdateSerializer(blog, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(BlogSerializer(blog).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BlogDelete(APIView):
    """
    Handles the deletion of a blog post.
    Allows only the author of the blog post to delete it. If the user is not the author,
    a 403 Forbidden response is returned. On successful deletion, a 204 No Content response is sent.
    Methods:
        delete(request, pk, format=None): Deletes the specified blog post if the user is authorized.
    """

    permission_classes = [IsAdminUser]

    def delete(self, request, pk, format=None):
        blog = get_object_or_404(Blog, pk=pk)

        blog.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class CategoriesView(APIView):
    def get(self, request):
        category = Category.objects.all()

        serializer = CategorySerializer(category, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class CreateCategoryView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = CategorySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)


