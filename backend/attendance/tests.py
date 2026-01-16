from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Attendance


class AttendanceAPITestCase(TestCase):
	def setUp(self):
		self.client = APIClient()
		# create a user with a QR code
		self.user = User.objects.create_user(username='testuser', password='pass')
		self.user.qr_code = 'TESTQR123'
		self.user.save()

	def test_home(self):
		url = reverse('home')
		resp = self.client.get(url)
		self.assertEqual(resp.status_code, status.HTTP_200_OK)
		self.assertIn('QR Attendance', resp.data.get('message', ''))

	def test_mark_attendance_requires_qr(self):
		url = reverse('mark-attendance')
		resp = self.client.post(url, {}, format='json')
		self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

	def test_mark_attendance_and_report(self):
		mark_url = reverse('mark-attendance')
		report_url = reverse('attendance-report')

		# mark attendance
		resp = self.client.post(mark_url, {'qr_code': 'TESTQR123'}, format='json')
		self.assertIn(resp.status_code, (status.HTTP_201_CREATED, status.HTTP_200_OK))

		# report should contain at least one entry
		resp = self.client.get(report_url)
		self.assertEqual(resp.status_code, status.HTTP_200_OK)
		self.assertTrue(isinstance(resp.data, list))
		self.assertGreaterEqual(len(resp.data), 1)
