"use client";

import { useState } from "react";
import { Space_Mono } from "next/font/google";

// Import font Space Mono
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function PredictorUI() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ predicted_score?: number; insights?: string; error?: string } | null>(null);

  // Default state diset ke 'mahasiswa rata-rata'
  const [formData, setFormData] = useState({
    age: 20,
    gender: "Male",
    study_hours_per_day: 3.0,
    social_media_hours: 3.0,
    netflix_hours: 2.0,
    part_time_job: "No",
    attendance_percentage: 85.0,
    sleep_hours: 7.0,
    diet_quality: "Average",
    exercise_frequency: "Sometimes",
    parental_education_level: "Bachelor",
    internet_quality: "High",
    mental_health_rating: 3,
    extracurricular_participation: "Yes",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8200/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.detail || "Gagal memprediksi");
      
      setResult(data);
    } catch (err: any) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Helper component untuk Input & Select biar kodenya DRY (Don't Repeat Yourself)
  const InputBlock = ({ label, name, type = "number", min, max, step }: any) => (
    <div className="flex flex-col gap-2">
      <label className="text-yellow-500 font-bold text-sm tracking-widest uppercase">{label}</label>
      <input
        type={type}
        name={name}
        min={min}
        max={max}
        step={step}
        value={formData[name as keyof typeof formData]}
        onChange={handleChange}
        className="bg-black border-2 border-yellow-500 text-yellow-400 p-3 focus:outline-none focus:bg-yellow-500 focus:text-black transition-colors"
        required
      />
    </div>
  );

  const SelectBlock = ({ label, name, options }: any) => (
    <div className="flex flex-col gap-2">
      <label className="text-yellow-500 font-bold text-sm tracking-widest uppercase">{label}</label>
      <select
        name={name}
        value={formData[name as keyof typeof formData]}
        onChange={handleChange}
        className="bg-black border-2 border-yellow-500 text-yellow-400 p-3 focus:outline-none focus:bg-yellow-500 focus:text-black transition-colors appearance-none cursor-pointer"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt} className="bg-black text-yellow-500">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <main className={`min-h-screen bg-black p-4 md:p-8 flex justify-center items-center ${spaceMono.className}`}>
      <div className="w-full max-w-5xl border-4 border-yellow-500 p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(234,179,8,1)] bg-black relative">
        
        {/* Dekorasi Ala UI Retro */}
        <div className="absolute top-0 right-0 bg-yellow-500 text-black px-4 py-1 font-bold text-sm">
          SYS.VER_1.0
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-yellow-500 mb-2 uppercase tracking-tighter">
          &gt; Academic_Oracle
        </h1>
        <p className="text-yellow-500/70 mb-8 max-w-2xl text-sm leading-relaxed">
          Sistem analitik prediktif berbasis Machine Learning. Masukkan parameter gaya hidup di bawah ini untuk mengkalkulasi probabilitas skor ujian akhir.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Demografi & Dasar */}
            <InputBlock label="Age" name="age" min="15" max="50" />
            <SelectBlock label="Gender" name="gender" options={["Male", "Female"]} />
            <SelectBlock label="Parental Edu" name="parental_education_level" options={["High School", "Bachelor", "Master", "Unknown"]} />
            
            {/* Gaya Hidup Utama */}
            <InputBlock label="Study Hours/Day" name="study_hours_per_day" step="0.1" min="0" max="24" />
            <InputBlock label="Sleep Hours" name="sleep_hours" step="0.1" min="0" max="24" />
            <InputBlock label="Attendance (%)" name="attendance_percentage" min="0" max="100" />
            
            {/* Hiburan & Distraksi */}
            <InputBlock label="Social Media (Hrs)" name="social_media_hours" step="0.1" min="0" max="24" />
            <InputBlock label="Netflix (Hrs)" name="netflix_hours" step="0.1" min="0" max="24" />
            
            {/* Kualitas & Aktivitas */}
            <SelectBlock label="Diet Quality" name="diet_quality" options={["Good", "Average", "Poor"]} />
            <SelectBlock label="Exercise" name="exercise_frequency" options={["Often", "Sometimes", "Never"]} />
            <SelectBlock label="Internet Quality" name="internet_quality" options={["High", "Medium", "Low"]} />
            
            {/* Aktivitas Ekstra */}
            <SelectBlock label="Part-Time Job" name="part_time_job" options={["Yes", "No"]} />
            <SelectBlock label="Extracurricular" name="extracurricular_participation" options={["Yes", "No"]} />
            <InputBlock label="Mental Health (1-5)" name="mental_health_rating" min="1" max="5" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-black font-bold text-xl py-4 mt-8 uppercase tracking-widest hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all disabled:opacity-50"
          >
            {loading ? "INITIALIZING PREDICTION..." : "EXECUTE PREDICTION"}
          </button>
        </form>

        {/* Display Hasil Prediksi */}
        {result && (
          <div className="mt-10 border-t-4 border-dashed border-yellow-500/50 pt-8">
            {result.error ? (
              <div className="bg-red-900/50 border border-red-500 text-red-500 p-4">
                [ERROR] {result.error}
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center p-8 border-2 border-yellow-500 bg-yellow-500/10 shadow-[8px_8px_0px_0px_rgba(234,179,8,1)]">
                  <div className="text-yellow-500 text-sm mb-2">ESTIMATED SCORE</div>
                  <div className="text-7xl font-bold text-yellow-500">{result.predicted_score}</div>
                </div>
                <div className="flex-1">
                  <div className="text-yellow-500 font-bold mb-2">&gt; SYSTEM_INSIGHT:</div>
                  <div className="text-yellow-400 leading-relaxed bg-black border border-yellow-500 p-4 font-mono text-sm">
                    {result.insights || "Data telah dianalisis. Tidak ada anomali gaya hidup ekstrem terdeteksi."}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}