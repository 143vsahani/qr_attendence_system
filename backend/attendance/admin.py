from django.contrib import admin

# Register your models here.
# attendance/admin.py
from django.contrib import admin
from .models import User
from .utils import generate_qr

class UserAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        filename = f"media/qr/{obj.username}_qr.png"
        generate_qr(obj.qr_code, filename)

admin.site.register(User, UserAdmin)
