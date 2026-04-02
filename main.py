from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import pandas as pd
import joblib
import os
from fastapi.middleware.cors import CORSMiddleware

# Inisialisasi Aplikasi
app = FastAPI(
    title="Prediksi Nilai Akademik API",
    description="API untuk memprediksi skor ujian mahasiswa berdasarkan gaya hidup",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Di production, ganti dengan URL Next.js lu
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "model_prediksi.pkl"
FEATURES_PATH = "model_features.pkl"
SCALER_PATH = "scaler.pkl"

# Load Model, Features, dan Scaler
if os.path.exists(MODEL_PATH) and os.path.exists(FEATURES_PATH) and os.path.exists(SCALER_PATH):
    model = joblib.load(MODEL_PATH)
    expected_features = joblib.load(FEATURES_PATH)
    scaler = joblib.load(SCALER_PATH)
else:
    model = None
    expected_features = None
    scaler = None
    print("⚠️ WARNING: File model, features, atau scaler tidak ditemukan!")

# Definisi Skema Input (Pydantic)
class StudentData(BaseModel):
    # Field(...) artinya parameter ini wajib diisi
    age: int = Field(..., example=20)
    gender: str = Field(..., example="Male")
    study_hours_per_day: float = Field(..., example=4.5)
    social_media_hours: float = Field(..., example=2.0)
    netflix_hours: float = Field(..., example=1.5)
    part_time_job: str = Field(..., example="No")
    attendance_percentage: float = Field(..., example=95.0)
    sleep_hours: float = Field(..., example=7.0)
    diet_quality: str = Field(..., example="Good")
    exercise_frequency: str = Field(..., example="Often")
    parental_education_level: str = Field(..., example="Bachelor")
    internet_quality: str = Field(..., example="High")
    mental_health_rating: int = Field(..., example=4)
    extracurricular_participation: str = Field(..., example="Yes")

@app.get("/")
def home():
    return {"message": "API Machine Learning Aktif! Hit endpoint /docs untuk mencoba."}

@app.post("/predict")
def predict_score(data: StudentData):
    if not model or not expected_features or not scaler:
        raise HTTPException(status_code=500, detail="Model Machine Learning belum siap.")
    
    try:
        # Konversi request body JSON menjadi DataFrame Pandas (1 baris)
        input_dict = data.model_dump()
        df_input = pd.DataFrame([input_dict])
        
        # Replikasi Logika Preprocessing dari Jupyter Notebook
        df_input['study_category'] = pd.cut(
            df_input['study_hours_per_day'],
            bins=[0, 3, 6, 10],
            labels=['Low', 'Medium', 'High']
        )
        
        # Lakukan One-Hot Encoding pada input
        df_encoded = pd.get_dummies(df_input)
        
        # ALIGNMENT (Proses Paling Krusial)
        df_final = df_encoded.reindex(columns=expected_features, fill_value=0)
        
        # Scaling input numerik agar sesuai dengan model
        kolom_numerik = ['study_hours_per_day', 'social_media_hours', 'netflix_hours', 'attendance_percentage', 'sleep_hours']
        df_final[kolom_numerik] = scaler.transform(df_final[kolom_numerik])
        
        # Eksekusi Prediksi
        prediction = model.predict(df_final)
        
        # Ambil angka prediksinya dan bulatkan
        predicted_score = round(float(prediction[0]), 2)
        
        # Safeguard: Pastikan nilai tidak keluar jalur (0 - 100)
        predicted_score = max(0.0, min(100.0, predicted_score))
        
        return {
            "status": "success",
            "predicted_score": predicted_score,
            "insights": "Nilai berpotensi turun jika jam tidur kurang dari 6 jam atau Netflix > 3 jam."
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Terjadi kesalahan saat memproses data: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8200)