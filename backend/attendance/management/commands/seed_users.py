from django.core.management.base import BaseCommand
from attendance.models import User

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        users = [
            ('alice', 'student', 'QR-ALICE-001'),
            ('bob', 'employee', 'QR-BOB-001'),
        ]
        for username, role, qr in users:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'role': role,
                    'qr_code': qr
                }
            )
            if created:
                user.set_password('pass1234')
                user.save()
                self.stdout.write(f'Created user: {username}')
            else:
                self.stdout.write(f'User already exists: {username}')
        self.stdout.write(self.style.SUCCESS('Seeded users'))