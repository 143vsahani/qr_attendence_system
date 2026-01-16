from rest_framework import serializers
from .models import Attendance, User

class AttendanceSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'user', 'date', 'time', 'status']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'qr_code']
