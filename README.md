# ankhanhAI – Website tạo bài tập bằng AI (Gemini)

ankhanhAI là một website nhỏ dùng **NodeJS + Express + Gemini API** để tự động tạo câu hỏi trắc nghiệm cho học sinh THPT dựa trên nội dung người dùng nhập.

---

## Nguyên lý hoạt động (TỔNG QUAN)

Luồng hoạt động của hệ thống:

1. Người dùng nhập **tiêu đề, nội dung, số lượng câu hỏi, độ khó** ở frontend
2. Frontend gửi dữ liệu lên backend qua API `/api/ai/generate`
3. Backend tạo **prompt** và gửi sang **Gemini AI** thông qua API
4. Gemini trả về **JSON câu hỏi**
5. Backend trả JSON về frontend
6. Frontend render câu hỏi ra trang kết quả

**AI KHÔNG chạy ở frontend** – mọi xử lý AI đều nằm ở backend.

---

## Cấu trúc thư mục

```
├── index.js                 # File khởi động server Express
├── package.json             # Thông tin project & thư viện
├── .env                     # Biến môi trường (KHÔNG push GitHub)
│
├── routes/
│   └── ai.route.js          # Định nghĩa API /api/ai/generate
│
├── controllers/
│   └── ai.controller.js     # Logic gọi Gemini AI
│
├── public/
│   ├── style.css            # CSS giao diện
│   └── script.js            # JS frontend (fetch API)
│
├── views/
│   ├── index.html           # Trang tạo bài tập
│   └── result.html          # Trang hiển thị câu hỏi AI
```

---

##  Giải thích từng file quan trọng

### 🔹 index.js

* Khởi tạo server Express
* Cấu hình middleware: `cors`, `express.json()`
* Serve file tĩnh (`public`, `views`)
* Gắn router `/api/ai`

```js
app.use(express.static("public"));
app.use(express.static("views"));
app.use("/api/ai", aiRoute);
```

---

### 🔹 routes/ai.route.js

* Khai báo endpoint API:

```js
POST /api/ai/generate
```

* Gọi sang controller xử lý AI

---

### 🔹 controllers/ai.controller.js

 **File QUAN TRỌNG NHẤT**

Nhiệm vụ:

* Nhận dữ liệu từ frontend
* Tạo prompt cho AI
* Gọi Gemini API
* Parse JSON trả về

Ví dụ:

```js
const model = genAI.getGenerativeModel({
  model: "models/gemini-1.5-flash"
});

const result = await model.generateContent(prompt);
```

Nếu file này lỗi → API trả về **500 Internal Server Error**

---

### 🔹 public/script.js

* Xử lý giao diện frontend
* Gửi dữ liệu lên backend bằng `fetch`

```js
fetch("/api/ai/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
});
```

* Lưu kết quả AI vào `localStorage`

---

### 🔹 views/index.html

* Giao diện nhập thông tin bài tập
* Gọi `submitForm()` khi nhấn nút tạo bài tập

---

### 🔹 views/result.html

* Đọc dữ liệu AI từ `localStorage`
* Render câu hỏi ra giao diện

---

## Cấu hình Gemini API (RẤT QUAN TRỌNG)

###  BẮT BUỘC dùng **Google AI Studio**

 Link: [https://aistudio.google.com](https://aistudio.google.com)

Các bước:

1. Tạo API key trong **Google AI Studio**
2. Enable **Generative Language API**
3. Copy API key
4. Tạo file `.env`

```env
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxx
```

 **KHÔNG up file `.env` lên GitHub**

---

##  Các lỗi thường gặp & cách fix

###  Lỗi 500 Internal Server Error

Nguyên nhân:

* API key sai
* Chưa enable Generative Language API
* Model Gemini không tồn tại

 **Luôn check log backend (Render / terminal)**

---

###  Lỗi API_KEY_INVALID

```txt
API key not valid
```

Cách fix:

* Kiểm tra key đúng project chưa
* Key tạo từ Google AI Studio
* Không có khoảng trắng trong `.env`

---

###  Lỗi 404 model not found

```txt
models/gemini-1.0-pro not supported
```

 Model nên dùng:

```txt
models/gemini-1.5-flash
```

 **Luôn đọc doc chính thức**:
[https://ai.google.dev/models/gemini](https://ai.google.dev/models/gemini)

---

###  Frontend không có câu hỏi

Nguyên nhân:

* Backend trả lỗi
* `result.data` không phải array

Fix:

```js
console.log(result);
```

---

##  Ghi nhớ quan trọng

* AI **luôn chạy ở backend**
* Frontend chỉ gọi API
* Khi lỗi → **xem log server trước**
* Gemini đổi model rất nhanh → **luôn đọc AI Studio doc**

---

##  Kết luận

Đây là một project AI nhỏ nhưng đúng kiến trúc thực tế:

* Frontend → Backend → AI API
* Có thể mở rộng thêm:

  * Lưu DB
  * Login
  * Chấm điểm
