import qrcode

def generate_qr(data, filename):
    img = qrcode.make(data)
    img.save(filename)
    return filename



from .models import User
from .utils import generate_qr

def create_user_qr(user_id):
    user = User.objects.get(id=user_id)
    filename = f"{user.username}_qr.png"
    return generate_qr(user.qr_code, filename)



