# MÔ TẢ DỰ ÁN HỆ THỐNG TÌM KIẾM VÀ ĐẶT LỊCH HẸN VỚI CHUYÊN GIA TRỊ LIỆU

## CHƯƠNG 1. Cơ sở lý thuyết

### 1.1. Tổng quan cơ sở dữ liệu

#### 1.1.1. Khái niệm
Cơ sở dữ liệu là một tập hợp có tổ chức các dữ liệu được lưu trữ và truy xuất điện tử. Đây là nơi lưu trữ mọi thông tin cần thiết cho hoạt động của ứng dụng, từ dữ liệu người dùng, hồ sơ chuyên gia trị liệu, lịch hẹn đến tin nhắn và đánh giá. Một hệ thống cơ sở dữ liệu hiệu quả là nền tảng cho hiệu suất, độ tin cậy và khả năng mở rộng của ứng dụng.

#### 1.1.2. Các loại cơ sở dữ liệu
Trong dự án này, chúng tôi tập trung vào cơ sở dữ liệu quan hệ (Relational Database Management System - RDBMS). RDBMS lưu trữ dữ liệu trong các bảng với các hàng và cột, sử dụng SQL để quản lý và truy vấn dữ liệu.
*   **SQLite:** Được sử dụng cho môi trường phát triển cục bộ và thử nghiệm nhờ tính nhẹ, dễ cài đặt và không yêu cầu máy chủ riêng. Dữ liệu được lưu trữ trong một tệp duy nhất.
*   **PostgreSQL:** Được hỗ trợ và khuyến nghị cho môi trường sản xuất nhờ tính mạnh mẽ, khả năng mở rộng, hỗ trợ các tính năng nâng cao và độ tin cậy cao.

#### 1.1.3. Kết luận
Việc lựa chọn RDBMS phù hợp với cấu trúc dữ liệu có quan hệ chặt chẽ giữa các thực thể (người dùng, chuyên gia, lịch hẹn). SQLAlchemy ORM (Object-Relational Mapper) được sử dụng để tương tác với cơ sở dữ liệu, cho phép định nghĩa các mô hình dữ liệu bằng Python và tự động ánh xạ chúng tới các bảng trong cơ sở dữ liệu, đảm bảo tính nhất quán và dễ quản lý.

### 1.2. Công nghệ và ngôn ngữ sử dụng

#### 1.2.X. Các công nghệ và ngôn ngữ sử dụng
Dự án được xây dựng với kiến trúc Microservices (hoặc Monolith chia thành các dịch vụ logic) sử dụng các công nghệ hiện đại cho cả Frontend và Backend:

*   **Ngôn ngữ:** Python (Backend), TypeScript/JavaScript (Frontend).
*   **Kiến trúc Backend:**
    *   **FastAPI:** Framework web hiệu suất cao để xây dựng API.
    *   **SQLAlchemy:** ORM cho Python, dùng để tương tác với cơ sở dữ liệu.
    *   **Uvicorn:** ASGI server dùng để chạy ứng dụng FastAPI.
    *   **Passlib:** Thư viện để băm mật khẩu.
    *   **Python-jose:** Thư viện để xử lý JSON Web Tokens (JWT) cho xác thực.
    *   **Pydantic:** Thư viện kiểm tra và quản lý dữ liệu với Python type hints.
    *   **Requests:** Thư viện HTTP dùng để gọi các API bên ngoài (ví dụ: Nominatim của OpenStreetMap).
    *   **python-dotenv:** Để quản lý các biến môi trường.
    *   **SQLAdmin:** Giao diện quản trị cho SQLAlchemy.
    *   **FastAPI-Mail:** Hỗ trợ gửi email (ví dụ: xác minh tài khoản).
*   **Kiến trúc Frontend:**
    *   **Next.js (React Framework):** Framework React cho ứng dụng web với tính năng SSR (Server-Side Rendering) và SSG (Static Site Generation), Router dựa trên hệ thống tệp.
    *   **React:** Thư viện JavaScript để xây dựng giao diện người dùng.
    *   **Tailwind CSS:** Framework CSS utility-first để xây dựng giao diện nhanh chóng và linh hoạt.
    *   **React Hook Form:** Thư viện để quản lý form hiệu quả trong React.
    *   **Leaflet & React-Leaflet:** Thư viện JavaScript để tạo bản đồ tương tác, tích hợp OpenStreetMap.
    *   **Axios / Fetch API:** Client HTTP để tương tác với Backend API.
*   **Cơ sở dữ liệu:**
    *   **SQLite:** Dùng cho phát triển cục bộ.
    *   **PostgreSQL:** Được cấu hình để sẵn sàng cho môi trường sản xuất.
*   **Kiến trúc chung:** MVVM (Model-View-ViewModel) được áp dụng cho Backend để phân tách trách nhiệm rõ ràng.

## CHƯƠNG 2. Phân tích hệ thống

### 2.1 Mô tả bài toán

#### 2.1.1 Thực trạng
Trong xã hội hiện đại, nhu cầu về hỗ trợ trị liệu tâm lý ngày càng tăng. Tuy nhiên, việc tìm kiếm một chuyên gia trị liệu phù hợp, quản lý lịch hẹn, và giao tiếp an toàn vẫn còn nhiều khó khăn. Bệnh nhân gặp khó khăn trong việc tìm kiếm chuyên gia theo chuyên môn, địa điểm, và thời gian rảnh. Chuyên gia trị liệu cũng cần một nền tảng hiệu quả để quản lý hồ sơ, lịch làm việc và tương tác với bệnh nhân.

#### 2.1.2 Quy trình nghiệp vụ
Hệ thống hỗ trợ các quy trình nghiệp vụ chính sau:
*   **Đăng ký và quản lý hồ sơ:** Người dùng có thể đăng ký với vai trò Bệnh nhân hoặc Chuyên gia trị liệu, xác minh tài khoản và tạo hồ sơ cá nhân/chuyên môn.
*   **Tìm kiếm chuyên gia trị liệu:** Bệnh nhân tìm kiếm chuyên gia theo chuyên môn, địa điểm (sử dụng bản đồ), và thời gian rảnh.
*   **Xem hồ sơ chuyên gia:** Bệnh nhân xem thông tin chi tiết, đánh giá, và lịch làm việc của chuyên gia.
*   **Đặt lịch hẹn:** Bệnh nhân đặt lịch hẹn vào các khung giờ trống của chuyên gia.
*   **Quản lý lịch hẹn:** Cả bệnh nhân và chuyên gia có thể xem, thay đổi trạng thái (xác nhận, hủy, hoàn thành) lịch hẹn.
*   **Đánh giá:** Bệnh nhân có thể để lại đánh giá và xếp hạng cho chuyên gia sau khi hoàn thành buổi trị liệu.
*   **Nhắn tin:** Cả bệnh nhân và chuyên gia có thể giao tiếp trực tiếp qua hệ thống nhắn tin an toàn.
*   **Quản trị hệ thống:** Quản trị viên có thể quản lý người dùng, hồ sơ và các dữ liệu khác.

#### 2.1.3 Mô tả hệ thống
Hệ thống là một ứng dụng web Full-stack, cung cấp một giao diện người dùng trực quan cho bệnh nhân và chuyên gia trị liệu. Backend được xây dựng bằng Python (FastAPI), cung cấp các API RESTful và WebSocket để xử lý logic nghiệp vụ và tương tác với cơ sở dữ liệu. Frontend được xây dựng bằng Next.js (React) và Tailwind CSS, cung cấp giao diện tương tác và tích hợp bản đồ OpenStreetMap để tìm kiếm theo vị trí.

### 2.2 Xây dựng biểu đồ use case

#### 2.2.1 Biểu đồ use case tổng quát
*   **Actors:** Bệnh nhân (Patient), Chuyên gia trị liệu (Therapist), Quản trị viên (Admin), Hệ thống (System).
*   **Các Use Case chính:**
    *   **Quản lý tài khoản:** Đăng ký, Đăng nhập, Quản lý hồ sơ.
    *   **Tìm kiếm và Đặt lịch hẹn:** Tìm kiếm chuyên gia, Xem hồ sơ chuyên gia, Đặt lịch hẹn.
    *   **Quản lý lịch hẹn:** Xem lịch hẹn, Thay đổi trạng thái lịch hẹn.
    *   **Đánh giá:** Gửi đánh giá.
    *   **Giao tiếp:** Gửi tin nhắn.
    *   **Quản lý hệ thống:** Quản lý người dùng và dữ liệu.

#### 2.2.2 Phân rã biểu đồ use case
*   **Bệnh nhân:**
    *   Đăng ký tài khoản bệnh nhân
    *   Hoàn thành hồ sơ bệnh nhân
    *   Tìm kiếm chuyên gia trị liệu (theo chuyên môn, địa điểm)
    *   Xem chi tiết hồ sơ chuyên gia
    *   Đặt lịch hẹn với chuyên gia
    *   Xem và hủy lịch hẹn
    *   Gửi đánh giá cho chuyên gia
    *   Gửi và nhận tin nhắn
*   **Chuyên gia trị liệu:**
    *   Đăng ký tài khoản chuyên gia
    *   Hoàn thành hồ sơ chuyên gia
    *   Quản lý lịch làm việc và khung giờ rảnh
    *   Xem danh sách lịch hẹn
    *   Xác nhận/Hủy lịch hẹn
    *   Xem hồ sơ bệnh nhân
    *   Gửi và nhận tin nhắn
*   **Quản trị viên:**
    *   Đăng nhập vào bảng điều khiển quản trị
    *   Quản lý tài khoản người dùng (bệnh nhân, chuyên gia)
    *   Quản lý các thực thể dữ liệu khác (lịch hẹn, đánh giá)

#### 2.2.3 Xây dựng kịch bản use case
**Kịch bản 1: Bệnh nhân tìm kiếm và đặt lịch hẹn**
1.  **Bệnh nhân** truy cập trang chủ.
2.  **Bệnh nhân** đăng nhập hoặc đăng ký tài khoản mới.
3.  **Bệnh nhân** nhập tiêu chí tìm kiếm (ví dụ: "trầm cảm", "Hà Nội") và/hoặc chọn vị trí trên bản đồ.
4.  **Hệ thống** hiển thị danh sách các chuyên gia phù hợp.
5.  **Bệnh nhân** chọn một chuyên gia để xem hồ sơ chi tiết.
6.  **Hệ thống** hiển thị hồ sơ chuyên gia, bao gồm lịch làm việc trống.
7.  **Bệnh nhân** chọn một khung giờ có sẵn.
8.  **Bệnh nhân** xác nhận đặt lịch hẹn.
9.  **Hệ thống** tạo lịch hẹn với trạng thái PENDING và gửi thông báo cho bệnh nhân và chuyên gia.

**Kịch bản 2: Chuyên gia quản lý lịch làm việc**
1.  **Chuyên gia trị liệu** đăng nhập vào bảng điều khiển.
2.  **Chuyên gia** truy cập phần "Quản lý lịch làm việc".
3.  **Chuyên gia** thêm các khung giờ rảnh mới (ngày, giờ bắt đầu, giờ kết thúc).
4.  **Hệ thống** lưu các khung giờ rảnh và cập nhật trạng thái có sẵn.
5.  **Chuyên gia** có thể xóa các khung giờ rảnh không còn hiệu lực.

### 2.3 Biểu đồ tuần tự (chỉ bao gồm mô tả)

#### 2.3.X. Các biểu đồ tuần tự theo Use Case
*   **Đăng ký người dùng:**
    *   Frontend gửi yêu cầu POST `/users/` với email, mật khẩu, loại người dùng.
    *   Backend nhận yêu cầu, kiểm tra email trùng lặp.
    *   Backend băm mật khẩu, tạo User mới, lưu vào DB, trả về User đã tạo.
    *   Frontend nhận phản hồi, chuyển hướng đến trang đăng nhập.
*   **Đăng nhập:**
    *   Frontend gửi yêu cầu POST `/users/login` với username (email), password.
    *   Backend nhận yêu cầu, kiểm tra email và xác thực mật khẩu.
    *   Backend tạo JWT access token nếu xác thực thành công.
    *   Frontend nhận access token, lưu vào localStorage, sau đó gửi yêu cầu GET `/users/me` để lấy thông tin người dùng.
    *   Backend trả về thông tin User.
    *   Frontend nhận User info, cập nhật AuthContext, chuyển hướng đến dashboard phù hợp.
*   **Tìm kiếm chuyên gia trị liệu:**
    *   Frontend gửi yêu cầu GET `/profile/therapists/search` với các tham số (specialization, location string, hoặc lat/lon, radius).
    *   Backend nhận yêu cầu. Nếu có `location` string, gọi Nominatim API để chuyển đổi thành `lat/lon`.
    *   Backend truy vấn DB để tìm các chuyên gia phù hợp với chuyên môn.
    *   Backend áp dụng thuật toán Haversine để lọc chuyên gia trong bán kính nếu có `lat/lon`.
    *   Backend trả về danh sách chuyên gia.
    *   Frontend nhận và hiển thị danh sách.
*   **Đặt lịch hẹn:**
    *   Frontend gửi yêu cầu POST `/appointments/` với `therapist_id`, `start_time`, `end_time`, kèm JWT của bệnh nhân.
    *   Backend xác thực bệnh nhân.
    *   Backend kiểm tra sự tồn tại của chuyên gia và tính khả dụng của khung giờ.
    *   Backend tạo lịch hẹn mới với trạng thái `PENDING`, lưu vào DB.
    *   Backend trả về thông tin lịch hẹn đã tạo.
*   **Gửi tin nhắn WebSocket:**
    *   Frontend (sau khi đăng nhập) thiết lập kết nối WebSocket tới `/messages/ws?token=<JWT>`.
    *   Backend xác thực token JWT, liên kết WebSocket với `user_id`.
    *   Frontend gửi tin nhắn JSON qua WebSocket bao gồm `receiver_id` và `content`.
    *   Backend nhận tin nhắn, lưu vào DB.
    *   Backend sử dụng `ConnectionManager` để gửi tin nhắn đến `sender_id` và `receiver_id` thông qua các WebSocket đang hoạt động của họ.

## CHƯƠNG 3. Thiết kế cơ sở dữ liệu

### 3.1. Thiết kế dữ liệu
Thiết kế dữ liệu tuân theo nguyên tắc chuẩn hóa (normalization) để giảm thiểu sự trùng lặp và đảm bảo tính toàn vẹn của dữ liệu. Các bảng được thiết kế để lưu trữ các thực thể riêng biệt như Người dùng, Bệnh nhân, Chuyên gia trị liệu, Lịch hẹn, Đánh giá, Tin nhắn và Khung giờ rảnh, với các khóa chính và khóa ngoại để thiết lập mối quan hệ.

### 3.2. Mô hình dữ liệu

#### 3.2.1. Mô hình dữ liệu khái niệm
Các thực thể chính:
*   **User:** Thông tin tài khoản cơ bản (email, mật khẩu băm, loại người dùng).
*   **Patient:** Thông tin chi tiết của bệnh nhân (kế thừa từ User).
*   **Therapist:** Thông tin chi tiết của chuyên gia trị liệu (kế thừa từ User).
*   **VerificationToken:** Token xác minh email.
*   **Availability:** Khung giờ rảnh của chuyên gia.
*   **Appointment:** Thông tin lịch hẹn giữa bệnh nhân và chuyên gia.
*   **Review:** Đánh giá của bệnh nhân về chuyên gia.
*   **Message:** Tin nhắn giữa người dùng.

#### 3.2.2. Mô hình dữ liệu logic
Mô hình dữ liệu logic chi tiết hóa các thực thể khái niệm thành các bảng, định nghĩa các thuộc tính (cột), kiểu dữ liệu và các ràng buộc (khóa chính, khóa ngoại, NOT NULL, UNIQUE).

### 3.3. Đặc tả dữ liệu

#### 3.3.X. Đặc tả các Thực thể
*   **Bảng `users`:**
    *   `id` (Integer, Primary Key): ID duy nhất của người dùng.
    *   `email` (String, Unique, Not Null): Email đăng nhập.
    *   `hashed_password` (String, Not Null): Mật khẩu đã băm.
    *   `verified` (Boolean, Not Null, Default: `False`): Trạng thái xác minh email.
    *   `user_type` (Enum: "PATIENT", "THERAPIST", "ADMIN", Not Null): Vai trò của người dùng.
    *   `created_at` (DateTime, Default: `now()`): Thời gian tạo tài khoản.
    *   `updated_at` (DateTime, On Update: `now()`): Thời gian cập nhật tài khoản.
*   **Bảng `patients`:**
    *   `id` (Integer, Primary Key, Foreign Key to `users.id`): ID bệnh nhân, đồng thời là khóa ngoại.
    *   `full_name` (String, Not Null): Tên đầy đủ.
    *   `date_of_birth` (Date, Nullable): Ngày sinh.
    *   `address` (String, Nullable): Địa chỉ.
    *   `phone_number` (String, Nullable): Số điện thoại.
    *   `profile_picture_url` (String, Nullable): URL ảnh đại diện.
*   **Bảng `therapists`:**
    *   `id` (Integer, Primary Key, Foreign Key to `users.id`): ID chuyên gia, đồng thời là khóa ngoại.
    *   `full_name` (String, Not Null): Tên đầy đủ.
    *   `license_number` (String, Unique, Not Null): Số giấy phép hành nghề.
    *   `specialization` (String, Nullable): Chuyên môn (ví dụ: "Trầm cảm, Lo âu").
    *   `years_of_experience` (Integer, Nullable): Số năm kinh nghiệm.
    *   `office_address` (String, Nullable): Địa chỉ phòng khám.
    *   `latitude` (Float, Nullable): Vĩ độ của phòng khám.
    *   `longitude` (Float, Nullable): Kinh độ của phòng khám.
    *   `phone_number` (String, Nullable): Số điện thoại.
    *   `website` (String, Nullable): Trang web cá nhân/phòng khám.
    *   `availability` (String, Nullable): Thông tin lịch làm việc (dạng JSON).
    *   `profile_picture_url` (String, Nullable): URL ảnh đại diện.
*   **Bảng `verification_tokens`:**
    *   `id` (Integer, Primary Key)
    *   `token` (String, Unique, Not Null)
    *   `user_id` (Integer, Foreign Key to `users.id`, Not Null)
    *   `expires_at` (DateTime, Not Null)
    *   `created_at` (DateTime, Default: `now()`)
*   **Bảng `availabilities`:**
    *   `id` (Integer, Primary Key)
    *   `therapist_id` (Integer, Foreign Key to `users.id`, Not Null)
    *   `start_time` (DateTime, Not Null)
    *   `end_time` (DateTime, Not Null)
    *   `is_available` (Boolean, Not Null)
*   **Bảng `appointments`:**
    *   `id` (Integer, Primary Key)
    *   `patient_id` (Integer, Foreign Key to `users.id`, Not Null)
    *   `therapist_id` (Integer, Foreign Key to `users.id`, Not Null)
    *   `start_time` (DateTime, Not Null)
    *   `end_time` (DateTime, Not Null)
    *   `status` (Enum: "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", Not Null, Default: `PENDING`)
*   **Bảng `reviews`:**
    *   `id` (Integer, Primary Key)
    *   `patient_id` (Integer, Foreign Key to `users.id`, Not Null)
    *   `therapist_id` (Integer, Foreign Key to `users.id`, Not Null)
    *   `rating` (Integer, Not Null, 1-5)
    *   `comment` (Text, Nullable)
    *   `created_at` (DateTime, Default: `now()`)
*   **Bảng `messages`:**
    *   `id` (Integer, Primary Key)
    *   `sender_id` (Integer, Foreign Key to `users.id`, Not Null)
    *   `receiver_id` (Integer, Foreign Key to `users.id`, Not Null)
    *   `content` (Text, Not Null)
    *   `sent_at` (DateTime, Default: `now()`)

### 3.4. Xây dựng mối quan hệ

#### 3.4.X. Mối quan hệ Bảng A - B với từng bảng
*   **`users` - `patients`:** Một-một (One-to-One). Mỗi User có thể có một Patient Profile.
*   **`users` - `therapists`:** Một-một (One-to-One). Mỗi User có thể có một Therapist Profile.
*   **`users` - `verification_tokens`:** Một-nhiều (One-to-Many). Một User có thể có nhiều Verification Tokens.
*   **`users` (Therapist) - `availabilities`:** Một-nhiều (One-to-Many). Một Therapist có nhiều khung giờ rảnh.
*   **`users` (Patient) - `appointments`:** Một-nhiều (One-to-Many). Một Patient có nhiều lịch hẹn.
*   **`users` (Therapist) - `appointments`:** Một-nhiều (One-to-Many). Một Therapist có nhiều lịch hẹn.
*   **`users` (Patient) - `reviews`:** Một-nhiều (One-to-Many). Một Patient có thể gửi nhiều đánh giá.
*   **`users` (Therapist) - `reviews`:** Một-nhiều (One-to-Many). Một Therapist có thể nhận nhiều đánh giá.
*   **`users` (Sender) - `messages`:** Một-nhiều (One-to-Many). Một User có thể gửi nhiều tin nhắn.
*   **`users` (Receiver) - `messages`:** Một-nhiều (One-to-Many). Một User có thể nhận nhiều tin nhắn.

### 3.5. Chi tiết các bảng lưu trữ dữ liệu

#### 3.5.X. các Lưu trữ dữ liệu thực thể
(Xem mục 3.3 để biết chi tiết về các cột, kiểu dữ liệu và ràng buộc của từng bảng: `users`, `patients`, `therapists`, `verification_tokens`, `availabilities`, `appointments`, `reviews`, `messages`).

## CHƯƠNG 4. Cài đặt và triển khai

### 4.1. Cài đặt môi trường

#### 4.1.X. cài đặt môi trường
1.  **Backend (Python):**
    *   Cài đặt Python 3.9+ (đã sử dụng Python 3.13 trong quá trình phát triển).
    *   Tạo môi trường ảo: `python3 -m venv yelp/backend/venv`.
    *   Kích hoạt môi trường ảo: `source yelp/backend/venv/bin/activate`.
    *   Cài đặt các thư viện từ `requirements.txt`: `pip install -r yelp/backend/requirements.txt`.
    *   Tạo tệp `.env` trong `yelp/backend/` với các biến môi trường cần thiết (DATABASE_URL, SECRET_KEY, MAIL_USERNAME, etc.).
    *   Chạy seed data (tùy chọn): `cd yelp && backend/venv/bin/python tests/seed.py`
    *   Khởi chạy Backend: `cd yelp && backend/venv/bin/uvicorn backend.main:app --reload --port 8000 --env-file backend/.env`.
2.  **Frontend (Next.js):**
    *   Cài đặt Node.js và npm.
    *   Truy cập thư mục `yelp/frontend`.
    *   Cài đặt các gói phụ thuộc: `npm install`.
    *   Khởi chạy Frontend: `npm run dev`.
3.  **Cơ sở dữ liệu:**
    *   Hệ thống sẽ tự động tạo cơ sở dữ liệu SQLite (`test.db`) nếu không có cấu hình PostgreSQL.
    *   Để sử dụng PostgreSQL, cấu hình `DATABASE_URL` trong `.env`.

### 4.2. Các hàm, thủ tục
*   **Backend:**
    *   **Băm mật khẩu:** Sử dụng `Hasher` từ `hashing.py`.
    *   **Tạo và xác minh JWT:** Sử dụng các hàm từ `jwt.py`.
    *   **Thuật toán Haversine:** Tính khoảng cách địa lý giữa hai điểm.
    *   **Geocoding:** Chuyển đổi địa chỉ thành tọa độ địa lý (sử dụng Nominatim API).
    *   **Quản lý kết nối WebSocket:** `ConnectionManager` để theo dõi các kết nối client.
    *   **Kiểm tra khởi tạo hệ thống:** `SetupViewModel.check_is_initialized()`.
*   **Frontend:**
    *   **api client:** Wrapper cho `fetch` để quản lý các yêu cầu HTTP (gắn JWT, xử lý lỗi).
    *   **AuthContext:** Context React để quản lý trạng thái đăng nhập/đăng xuất và thông tin người dùng.
    *   **Xử lý Form:** Sử dụng `react-hook-form` để quản lý trạng thái và xác thực form.
    *   **Bản đồ tương tác:** `react-leaflet` hooks và components để hiển thị bản đồ, marker, và xử lý sự kiện click/tìm kiếm.

### 4.3. Các API chính

#### 4.3.X. Các API
Các API chính của hệ thống bao gồm:
*   **Xác thực và Người dùng:**
    *   `POST /users/`: Đăng ký người dùng mới (Bệnh nhân/Chuyên gia).
    *   `POST /users/login`: Đăng nhập, trả về JWT access token.
    *   `GET /users/me`: Lấy thông tin người dùng hiện tại.
*   **Hồ sơ:**
    *   `POST /profile/patient`: Tạo hồ sơ bệnh nhân.
    *   `PUT /profile/patient`: Cập nhật hồ sơ bệnh nhân.
    *   `POST /profile/therapist`: Tạo hồ sơ chuyên gia.
    *   `PUT /profile/therapist`: Cập nhật hồ sơ chuyên gia.
    *   `GET /profile/therapists/search`: Tìm kiếm chuyên gia (theo chuyên môn, vị trí).
    *   `GET /profile/therapist/{therapist_id}`: Lấy chi tiết hồ sơ chuyên gia.
    *   `GET /profile/me`: Lấy hồ sơ của người dùng hiện tại (bệnh nhân hoặc chuyên gia).
*   **Lịch hẹn:**
    *   `POST /appointments/`: Đặt lịch hẹn mới.
    *   `GET /appointments/`: Lấy danh sách lịch hẹn của người dùng hiện tại.
    *   `PATCH /appointments/{appointment_id}`: Cập nhật trạng thái lịch hẹn.
*   **Khung giờ rảnh:**
    *   `POST /availability/`: Thêm khung giờ rảnh cho chuyên gia.
    *   `GET /availability/?therapist_id={id}`: Lấy khung giờ rảnh của chuyên gia.
    *   `DELETE /availability/{availability_id}`: Xóa khung giờ rảnh.
*   **Đánh giá:**
    *   `POST /reviews/`: Gửi đánh giá mới.
    *   `GET /reviews/{therapist_id}`: Lấy danh sách đánh giá của chuyên gia.
*   **Tin nhắn:**
    *   `POST /messages/`: Gửi tin nhắn.
    *   `GET /messages/connected_users`: Lấy danh sách người dùng đã nhắn tin.
    *   `GET /messages/{user_id}`: Lấy lịch sử tin nhắn với một người dùng cụ thể.
    *   `WS /messages/ws`: WebSocket để giao tiếp thời gian thực.
*   **Khởi tạo hệ thống:**
    *   `GET /setup/status`: Kiểm tra trạng thái khởi tạo hệ thống.
    *   `POST /setup/`: Tạo tài khoản quản trị viên đầu tiên.

## CHƯƠNG 5. Kết luận

### 5.1 Kết quả đạt được
Dự án đã xây dựng thành công một ứng dụng web đầy đủ tính năng, kết nối bệnh nhân và chuyên gia trị liệu. Các kết quả chính bao gồm:
*   **Kiến trúc Backend MVVM rõ ràng:** Phân tách logic nghiệp vụ vào các ViewModel, giúp mã dễ bảo trì và mở rộng.
*   **Hệ thống xác thực và ủy quyền mạnh mẽ:** Sử dụng JWT cho việc đăng nhập và bảo vệ các tuyến API.
*   **Chức năng tìm kiếm nâng cao:** Bệnh nhân có thể tìm kiếm chuyên gia theo chuyên môn và đặc biệt là theo vị trí địa lý, với khả năng nhập địa chỉ hoặc chọn trực tiếp trên bản đồ OpenStreetMap.
*   **Quản lý hồ sơ và lịch hẹn linh hoạt:** Cả hai loại người dùng đều có thể quản lý thông tin cá nhân/chuyên môn, lịch làm việc và các lịch hẹn.
*   **Giao tiếp thời gian thực:** Tích hợp WebSocket cho phép nhắn tin trực tiếp giữa bệnh nhân và chuyên gia.
*   **Quy trình khởi tạo hệ thống:** Đảm bảo hệ thống được thiết lập đúng cách với tài khoản quản trị viên ban đầu.
*   **Giao diện người dùng hiện đại:** Xây dựng bằng Next.js và Tailwind CSS, cung cấp trải nghiệm người dùng mượt mà và trực quan.
*   **Khả năng mở rộng:** Thiết kế module cho phép dễ dàng thêm các tính năng mới.

### 5.2 Hạn chế
Mặc dù đã hoàn thành các tính năng cốt lõi, dự án vẫn còn một số hạn chế:
*   **Tin nhắn WebSocket:** Hiện tại chỉ là chức năng cơ bản, cần được củng cố để đảm bảo khả năng mở rộng và độ tin cậy trong môi trường sản xuất.
*   **Xử lý lỗi toàn diện:** Một số trường hợp lỗi đặc biệt hoặc xác thực đầu vào nâng cao chưa được xử lý triệt để ở cả Frontend và Backend.
*   **Quản trị viên:** Bảng điều khiển quản trị viên (`SQLAdmin`) được cung cấp, nhưng giao diện frontend cho quản trị viên chưa được phát triển.
*   **Tối ưu hiệu suất:** Việc tìm kiếm chuyên gia theo khoảng cách hiện đang lọc trên tất cả chuyên gia, cần tối ưu hóa ở mức cơ sở dữ liệu cho các tập dữ liệu lớn.
*   **Tính năng bổ sung:** Thiếu các tính năng như thông báo đẩy, tích hợp thanh toán, v.v.

### 5.3 Hướng phát triển
Để phát triển hệ thống trong tương lai, các hướng sau có thể được xem xét:
*   **Tích hợp cuộc gọi video/âm thanh:** Thêm chức năng gọi điện trực tiếp giữa bệnh nhân và chuyên gia.
*   **Cổng thanh toán:** Tích hợp các dịch vụ thanh toán trực tuyến cho các buổi trị liệu.
*   **Hệ thống thông báo:** Phát triển một hệ thống thông báo đầy đủ (email, trong ứng dụng, đẩy) cho các sự kiện như lịch hẹn mới, tin nhắn, đánh giá.
*   **Bộ lọc tìm kiếm nâng cao:** Thêm các tiêu chí tìm kiếm chi tiết hơn (ví dụ: giới tính chuyên gia, ngôn ngữ, phí dịch vụ).
*   **Dashboard cho quản trị viên:** Phát triển một giao diện frontend riêng cho quản trị viên để quản lý toàn bộ hệ thống một cách trực quan.
*   **Ứng dụng di động:** Phát triển ứng dụng di động native hoặc cross-platform.
*   **Cải thiện tính năng tin nhắn:** Tích hợp các tính năng chat phong phú hơn (gửi tệp, biểu tượng cảm xúc, v.v.).
*   **Tối ưu hóa tìm kiếm địa lý:** Sử dụng các chỉ mục không gian (spatial indexes) trong cơ sở dữ liệu để cải thiện hiệu suất tìm kiếm dựa trên vị trí.

---
