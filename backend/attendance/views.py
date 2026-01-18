from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User, Attendance
from .serializers import AttendanceSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import logging
import uuid
from .utils import generate_qr
import os

logger = logging.getLogger(__name__)


@api_view(['POST'])
def register(request):
    """Register a new user and generate QR code"""
    username = request.data.get("username", "").strip()
    password = request.data.get("password", "").strip()
    role = request.data.get("role", "student").strip()
    
    logger.info(f"Registration attempt: username={username}, role={role}")
    
    if not username or not password:
        return Response(
            {"error": "Username and password required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Generate unique QR code
    qr_code = f"QR-{username.upper()}-{str(uuid.uuid4())[:8]}"
    
    # Create user
    user = User.objects.create_user(
        username=username,
        password=password,
        role=role,
        qr_code=qr_code
    )
    
    # Generate QR image
    os.makedirs("media/qr", exist_ok=True)
    filename = f"media/qr/{user.username}_qr.png"
    generate_qr(qr_code, filename)
    
    logger.info(f"User created: {username}, QR: {qr_code}")
    
    return Response({
        "message": "User registered successfully",
        "user_id": user.id,
        "username": username,
        "qr_code": qr_code
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login(request):
    username = request.data.get("username", "").strip()
    password = request.data.get("password", "").strip()
    
    logger.info(f"Login attempt: username={username}, password_length={len(password)}")
    
    if not username or not password:
        logger.warning("Missing username or password")
        return Response(
            {"error": "Username and password required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Try to authenticate
    user = authenticate(request, username=username, password=password)
    logger.info(f"Authenticate result: {user}")
    
    if user is None:
        logger.warning(f"Authentication failed for: {username}")
        # Try to see if user exists
        try:
            User.objects.get(username=username)
            logger.warning(f"User {username} exists but password incorrect")
        except User.DoesNotExist:
            logger.warning(f"User {username} does not exist")
        
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    logger.info(f"Authentication successful for: {username}")
    
    # Generate tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def home(request):
    return Response({"message": "QR Attendance API"}, status=status.HTTP_200_OK)

@api_view(['POST'])
def mark_attendance(request):
    qr_code = request.data.get("qr_code", "").strip()
    logger.info(f"Mark attendance request: qr_code='{qr_code}'")
    
    if not qr_code:
        logger.warning("QR code is empty")
        return Response({"error": "qr_code required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(qr_code=qr_code)
        logger.info(f"Found user: {user.username} for QR: {qr_code}")
    except User.DoesNotExist:
        logger.warning(f"QR code not found: {qr_code}")
        logger.info(f"Available QR codes: {list(User.objects.values_list('qr_code', flat=True))}")
        return Response({"error": "Invalid QR Code"}, status=status.HTTP_404_NOT_FOUND)

    # Prevent duplicate for same day
    from datetime import date
    exists = Attendance.objects.filter(user=user, date=date.today()).exists()
    if exists:
        logger.info(f"Attendance already marked for {user.username} today")
        return Response({"message": "Attendance already marked for today"}, status=status.HTTP_200_OK)

    Attendance.objects.create(user=user, status="Present")
    logger.info(f"Attendance marked for {user.username}")
    return Response({"message": f"Attendance marked for {user.username}"}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def attendance_report(request):
    user = request.GET.get("user")
    date = request.GET.get("date")

    qs = Attendance.objects.select_related('user')

    if user:
        qs = qs.filter(user__username=user)
    if date:
        qs = qs.filter(date=date)

    serializer = AttendanceSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_user_profile(request):
    """Get current user's profile and QR code"""
    if not request.user.is_authenticated:
        return Response(
            {"error": "Not authenticated"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    user = request.user
    qr_code = user.qr_code
    
    return Response({
        "user_id": user.id,
        "username": user.username,
        "role": user.role,
        "qr_code": qr_code,
    }, status=status.HTTP_200_OK)


# attendance/views.py
from django.http import FileResponse
from .models import User
from .utils import generate_qr
import os

def user_qr(request, user_id):
    user = User.objects.get(id=user_id)
    filename = f"media/qr/{user.username}_qr.png"

    # अगर file exist नहीं करती तो generate करें
    if not os.path.exists(filename):
        generate_qr(user.qr_code, filename)

    return FileResponse(open(filename, 'rb'), content_type='image/png')

