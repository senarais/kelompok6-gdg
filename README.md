# 🔮 Academic : Student Performance Predictor

> Sebuah sistem analitik prediktif *End-to-End* untuk memprediksi probabilitas skor ujian akhir mahasiswa berdasarkan rutinitas dan manajemen gaya hidup (Jam Belajar, *Screen Time*, Kualitas Tidur, Kesehatan Mental, dll).

## 🚀 Latar Belakang
Penurunan nilai akademik seringkali bukan disebabkan oleh kurangnya kemampuan kognitif, melainkan manajemen gaya hidup yang tidak seimbang. Proyek ini bertujuan untuk membantu biro konseling akademik kampus dalam melakukan **langkah preventif** dan memberikan intervensi dini bagi mahasiswa yang berisiko mengalami kegagalan akademik.

## ✨ Fitur Utama
- **Data Science Pipeline**: Pembersihan data, deteksi *outlier* (IQR), *Feature Engineering* (One-Hot Encoding), dan komparasi 5 algoritma *Machine Learning* teratas.
- **High-Accuracy Model**: Diotaki oleh algoritma **Ridge Regression** yang memenangkan fase komparasi dengan tingkat akurasi (R² Score) mencapai **89%**.
- **Robust Backend API**: Dibangun menggunakan **FastAPI** dengan validasi data ketat via `Pydantic` dan `reindex()` *alignment* untuk mencegah *Shape Mismatch*.
- **Brutalist UI Frontend**: Antarmuka pengguna bergaya *retro-futuristik/cyber* (Black & Yellow) menggunakan **Next.js** dan **Tailwind CSS**.

## 🛠️ Tech Stack
- **Data Science & ML**: Python, Pandas, Scikit-Learn, Seaborn, Joblib
- **Backend**: FastAPI, Uvicorn
- **Frontend**: Next.js (App Router), React, Tailwind CSS


---

## 💻 Cara Menjalankan Proyek Lokal

### 1. Setup Backend (FastAPI)
Buka terminal dan arahkan ke direktori `backend/`, lalu jalankan perintah berikut:

\`\`\`bash
# Buat dan aktifkan Virtual Environment
python -m venv venv
source venv/bin/activate  # Untuk Mac/Linux
venv\Scripts\activate     # Untuk Windows

# Install dependencies
pip install fastapi uvicorn pydantic scikit-learn pandas numpy joblib

# Jalankan server API
uvicorn main:app --reload
\`\`\`
*Backend API akan berjalan di `http://localhost:8200` (atau port yang di-set di `main.py`). Dokumentasi API dapat diakses di `/docs`.*

### 2. Setup Frontend (Next.js)
Buka terminal baru, arahkan ke direktori `frontend/`, lalu jalankan:

\`\`\`bash
# Install NPM packages
npm install

# Jalankan development server
npm run dev
\`\`\`
*Buka `http://localhost:3000` di browser untuk mengakses antarmuka Academic Oracle.*

---

## 📡 API Endpoint Reference

### `POST /predict`
Mengirimkan data gaya hidup mahasiswa untuk mendapatkan prediksi nilai.

**Request Body (JSON):**
\`\`\`json
{
  "age": 20,
  "gender": "Male",
  "study_hours_per_day": 4.5,
  "social_media_hours": 2.0,
  "netflix_hours": 1.5,
  "part_time_job": "No",
  "attendance_percentage": 95.0,
  "sleep_hours": 7.0,
  "diet_quality": "Good",
  "exercise_frequency": "Often",
  "parental_education_level": "Bachelor",
  "internet_quality": "High",
  "mental_health_rating": 4,
  "extracurricular_participation": "Yes"
}
\`\`\`

**Success Response:**
\`\`\`json
{
  "status": "success",
  "predicted_score": 92.5,
  "insights": "Nilai berpotensi turun jika jam tidur kurang dari 6 jam atau Netflix > 3 jam."
}
\`\`\`