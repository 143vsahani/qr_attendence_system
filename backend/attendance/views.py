from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User, Attendance
from .serializers import AttendanceSerializer


@api_view(['GET'])
def home(request):
    return Response({"message": "QR Attendance API"}, status=status.HTTP_200_OK)

@api_view(['POST'])
def mark_attendance(request):
    qr_code = request.data.get("qr_code")
    if not qr_code:
        return Response({"error": "qr_code required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(qr_code=qr_code)
    except User.DoesNotExist:
        return Response({"error": "Invalid QR Code"}, status=status.HTTP_404_NOT_FOUND)

    # Prevent duplicate for same day
    from datetime import date
    exists = Attendance.objects.filter(user=user, date=date.today()).exists()
    if exists:
        return Response({"message": "Attendance already marked for today"}, status=status.HTTP_200_OK)

    Attendance.objects.create(user=user, status="Present")
    return Response({"message": f"Attendance marked for {user.username}"}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def attendance_report(request):
    qs = Attendance.objects.select_related('user').order_by('-date', '-time')
    serializer = AttendanceSerializer(qs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
