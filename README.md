# QR Attendance System

A full-stack web application for secure attendance tracking using **Django (backend)** and **ReactJS (frontend)**.  
This system uses **JWT authentication** for secure login/logout and **QR code generation & scanning** to automatically mark attendance.

---

## 🚀 Features
- **JWT Authentication**: Secure login, logout, and token refresh.
- **QR Code Generation**: Each user gets a unique QR code.
- **QR Scanner**: ReactJS scanner to automatically mark attendance.
- **Attendance Reports**: Filter by user/date and view in tabular format.
- **Admin Dashboard**: Charts and analytics using Chart.js.
- **Role-based Access**: Admin vs Student dashboards (optional).

---

## 🛠️ Tech Stack
- **Backend**: Django, Django REST Framework, SimpleJWT
- **Frontend**: ReactJS, Axios, Chart.js, react-qr-reader
- **Database**: SQLite / PostgreSQL
- **Other Libraries**: qrcode, pillow

---

## 📦 Installation

### Backend (Django)
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
##frontend
cd frontend
npm install
npm start

qr_attendance_system/
│
├── backend/        # Django backend
│   ├── attendance/ # App with models, views, utils
│   └── ...
│
├── frontend/       # ReactJS frontend
│   ├── src/
│   └── ...
│
└── README.md
#Requirements
Django==5.0.1
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.1
qrcode==7.4.2
Pillow==10.2.0
psycopg2-binary==2.9.9
##for frontend
{
  "name": "qr-attendance-system",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "axios": "^1.6.7",
    "chart.js": "^4.4.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-qr-reader": "^3.0.0",
    "react-chartjs-2": "^5.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}

