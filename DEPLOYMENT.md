# دليل النشر والاستضافة الشامل | Deployment Guide

يحتوي هذا المشروع على 4 أركان رئيسية:
1. **الفرونت إيند (Frontend):** React + Vite + TailwindCSS.
2. **الباك إيند (Backend API):** Django REST Framework + Gunicorn.
3. **خدمة الموديل الذكي (Model Service):** FastAPI + PyTorch + Uvicorn (نظام التوصيات).
4. **قاعدة البيانات والكاش (Database & Cache):** SQLite (جاهزة مع 13 ألف فيلم) أو PostgreSQL + Redis.

---

## ❓ هل أستطيع رفع كل شيء على فيرسل (Vercel)؟

### 💡 الإجابة الصريحة والتقنية:
* **الفرونت إيند (React):** **نعم 100%!** فيرسل هو الخيار الأفضل والأسرع عالمياً للفرونت إيند مع شبكة CDN فائقة السرعة وشهادة SSL مجانية.
* **الباك إيند والموديل وقاعدة البيانات:** **لا ينصح بها إطلاقاً على Vercel** للأسباب التالية:
  1. **قاعدة البيانات:** فيرسل يعمل بنظام Serverless ولا يحتوي على قرص تخزين دائم (Persistent Disk). أي تغيير على `db.sqlite3` مثل كتابة تقييم أو إضافة فيلم سيتم مسحه فوراً بمجرد انتهاء الطلب!
  2. **خدمة الموديل (FastAPI ML):** موديل الذكاء الاصطناعي ومكتبات PyTorch تحتاج تحميل في الذاكرة (RAM) بشكل دائم، بينما دوال Vercel لها حد أقصى للذاكرة والوقت (Timeout) وسيتوقف الموديل عن العمل.
  3. **مهام الخلفية (Celery & Redis):** فيرسل لا يدعم تشغيل خدمات الخلفية طويلة الأمد.

---

## 🚀 أفضل خيارين للنشر (موصى بهما)

### 🥇 الخيار الأول: تشغيل الكل بضغطة زر عبر Docker (الأسهل والأقوى)
يمكنك استئجار سيرفر سحابي رخيص (VPS) بسعر 4$ إلى 5$ شهرياً من **Hetzner** أو **DigitalOcean** أو **Contabo** وتشغيل جميع الخدمات الأربعة معاً:

#### خطوات التشغيل عبر Docker Compose:
1. انسخ المشروع إلى السيرفر:
   ```bash
   git clone <your-repo-url>
   cd Group-16-2
   ```

2. قم بتشغيل المنظومة بالكامل بأمر واحد:
   ```bash
   docker compose up --build -d
   ```

3. ستعمل الخدمات بالشكل التالي فوراً:
   * **الموقع (الفرونت إيند):** `http://your-server-ip` أو المنفذ `80` و `5173`.
   * **الباك إيند (Django API):** `http://your-server-ip:8000`.
   * **خدمة الموديل (FastAPI):** `http://your-server-ip:8001`.
   * **قاعدة البيانات والكاش:** تعمل داخلياً تلقائياً مع الحفاظ الكامل على قاعدة بياناتك الحالية.

---

### 🥈 الخيار الثاني: البنية الهجينة (Hybrid Deployment)
وهي الطريقة المفضلة لكبرى الشركات:

#### 1. رفع الفرونت إيند على Vercel:
1. ادخل إلى [Vercel.com](https://vercel.com) وسجّل دخولك.
2. اضغط **Add New Project** واختر مستودع الـ GitHub الخاص بك.
3. حدد مسار المجلد الأساسي (Root Directory): **`frontend`**.
4. في خانة **Environment Variables**، أضف:
   * `VITE_API_BASE_URL` = رابط الباك إيند الخاص بك (مثال: `https://my-backend.railway.app/api/v1`).
5. اضغط **Deploy**. (تم تجهيز ملف `frontend/vercel.json` تلقائياً لمنع أي أخطاء 404 عند التحديث).

#### 2. رفع الباك إيند والموديل على Railway أو Render:
* **منصة Railway ([railway.app](https://railway.app)):**
  1. اضغط **New Project** -> **Deploy from GitHub repo**.
  2. اضغط **Add Service** لمجلد `backend` (سيقرأ `Dockerfile` تلقائياً).
  3. اضغط **Add Service** ثانية لمجلد `model_service` (سيقرأ `Dockerfile` تلقائياً).
  4. أضف Persistent Volume لمجلد الباك إيند لحفظ قاعدة البيانات `db.sqlite3` والميديا.

---

## 🛠️ تفاصيل ملفات الدوكر الجاهزة في المشروع

| الملف | الوظيفة |
| :--- | :--- |
| `docker-compose.yml` | يربط كل من: Frontend + Backend + Model Service + Redis + DB بشبكة واحدة متكاملة |
| `frontend/Dockerfile` | بناء متعدد المراحل (Multi-stage) مع Nginx فائق السرعة وتوجيه تلقائي للـ API |
| `frontend/nginx.conf` | إعدادات Nginx المجهزة لـ SPA والتخزين المؤقت وضغط Gzip وحل مشاكل CORS داخلياً |
| `frontend/vercel.json` | ضبط التوجيه التلقائي (Routing Rewrites) عند النشر على Vercel |
| `backend/Dockerfile` | بيئة Python 3.12 مع Gunicorn وحزم النظام المطلوبة |
| `model_service/Dockerfile` | بيئة Uvicorn و FastApi المجهزة لموديلات التوصيات |
