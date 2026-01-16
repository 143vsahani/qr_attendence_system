from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    role = models.CharField(max_length=50, choices=[
        ('student', 'Student'),
        ('employee', 'Employee'),
        ('admin', 'Admin')
    ])
    qr_code = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.username

class Attendance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="Present")

    class Meta:
        unique_together = ('user', 'date')  # prevent duplicate daily entries

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.status}"
