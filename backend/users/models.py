from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.utils import timezone
from django.contrib.auth.models import Group

class Role(models.Model):
    name = models.CharField(("Name"), max_length=50)

    def __str__(self):
        return self.name
    

class CustomUserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("Users must have a username")

        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        
        return self.create_user(username=username, password=password, **extra_fields)

    
class CustomUser(AbstractUser, PermissionsMixin):
    username = models.CharField(("Username"), max_length=50, unique=True)
    email = models.EmailField(unique=True)  # Add email field as unique identifier
    role = models.ForeignKey(Role, verbose_name=("Role"), on_delete=models.CASCADE ,max_length=20, blank=True, null=True)  # Add role field with choices
    phone_number = models.CharField(("Phone Number"), max_length=50, blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    date_joined = models.DateField(auto_now_add=True)
    last_login = models.DateField(auto_now=True, null=True, blank=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        Group,
        related_name='customuser_set',  # avoid clash
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )

    user_permissions = models.ManyToManyField(
        Permission,
        related_name='customuser_permissions',  # avoid clash
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

    USERNAME_FIELD = 'username'  # Set email as the unique identifier for authentication

    objects = CustomUserManager()

    def __str__(self):
        return self.username
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() if self.first_name or self.last_name else self.email
    
    def get_short_name(self):
        return self.first_name if self.first_name else self.email.split('@')[0]
    
    def has_perm(self, perm, obj=None):
        # Grant all permissions if the user is superuser or has the 'admin' role
        if self.is_superuser or (self.role and self.role.name == 'admin'):
            return True
        return super().has_perm(perm, obj)
    
    def has_module_perms(self, app_label):
        if self.is_superuser or (self.role and self.role.name == 'admin'):
            return True
        return super().has_module_perms(app_label)
    
    def save(self, *args, **kwargs):
        if not self.pk:  # Set the date_joined when creating a new user
            self.date_joined = timezone.now()
        super().save(*args, **kwargs)

        if self.role:
            group, _ = Group.objects.get_or_create(name=self.role.name)
            if not self.groups.filter(name=self.role.name).exists():
                self.groups.clear()
                self.groups.add(group)



