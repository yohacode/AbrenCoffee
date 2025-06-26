from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Blog, Category, Comments, Reactions
from .serializers import BlogSerializer, BlogCreateSerializer, CategorySerializer, BlogUpdateSerializer,CommentsSerializer, ReactionsSerializer
from rest_framework.permissions import AllowAny,IsAdminUser, IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Count

class BlogList(APIView):
    """
    APIView for retrieving a list of blog posts.
    - Requires authentication for write operations; read-only access is allowed for unauthenticated users.
    - Retrieves all blog posts ordered by creation date in descending order.
    - Returns serialized blog data in the response.
    """

    permission_classes = [AllowAny]

    def get(self, request, format=None):
        category_id = request.GET.get("category_id")
        blogs = Blog.objects.all()
        if category_id:
            blogs = blogs.filter(category__id=category_id)
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
        blog_reactions = Reactions.objects.filter(blog=blog).order_by('created_at')
        reaction_summary = (
            Reactions.objects
            .filter(blog=blog)
            .values('reaction')
            .annotate(count=Count('reaction'))
        )

        blog_comments = Comments.objects.filter(blog=blog).order_by('created_at')
        serializer = BlogSerializer(blog)
        commnetSerializer = CommentsSerializer(blog_comments, many=True)
        reactionsSerializer = ReactionsSerializer(blog_reactions, many=True)
        
        response_data = {
            "blog": serializer.data,
            "comments": commnetSerializer.data,
            "reactions": reactionsSerializer.data,
            "reaction_count": blog_reactions.count(),
            "reaction_summary": reaction_summary,
        }
        return Response(response_data, status=status.HTTP_200_OK) 

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

    def post(self, request):
        serializer = CategorySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)

class CommentCreateView(APIView):
    permission_classes = [AllowAny]  # You can use AllowAny if guests are allowed

    def post(self, request, pk):
        blog = get_object_or_404(Blog, id=pk)
        serializer = CommentsSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save(blog=blog, author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReactionCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        blog = get_object_or_404(Blog, id=pk)

        # ✅ First validate the data
        serializer = ReactionsSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Check if the user already reacted to this blog
        existing_reaction = Reactions.objects.filter(blog=blog, author=request.user).first()
        if existing_reaction:
            # 🔁 Update the reaction type
            existing_reaction.reaction = serializer.validated_data['reaction']
            existing_reaction.save()
            return Response(ReactionsSerializer(existing_reaction).data, status=status.HTTP_200_OK)

        # ✅ If no previous reaction, create a new one
        new_reaction = serializer.save(blog=blog, author=request.user)
        return Response(ReactionsSerializer(new_reaction).data, status=status.HTTP_201_CREATED)
    
class ReactionDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        blog = get_object_or_404(Blog, id=pk)

        reaction = Reactions.objects.filter(blog=blog, author=request.user).first()

        if reaction:
            reaction.delete()
            return Response({"detail": "Reaction removed"}, status=status.HTTP_200_OK)
        return Response({"detail": "No reaction found"}, status=status.HTTP_404_NOT_FOUND)

