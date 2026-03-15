# Cấu hình Cloudinary cho upload ảnh sản phẩm

App mobile upload ảnh trực tiếp lên Cloudinary (unsigned upload), nhận URL rồi gửi URL đó cho backend. Cần tạo tài khoản và cấu hình Upload Preset.

## Bước 1: Tạo tài khoản Cloudinary

1. Vào https://cloudinary.com và đăng ký (free tier đủ dùng).
2. Đăng nhập vào **Dashboard**.

## Bước 2: Lấy Cloud Name

1. Trên Dashboard, ở góc trên bên phải hoặc mục **Product & Plan** / **Account Details**.
2. Copy **Cloud name** (ví dụ: `dxxxxxx`).
3. Ghi vào file `mobile/.env`:
   ```
   EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   ```

## Bước 3: Tạo Upload Preset (unsigned – cho mobile)

Upload từ mobile dùng **unsigned** preset để không cần API Secret trên client.

1. Trong Dashboard, vào **Settings** (biểu tượng bánh răng).
2. Chọn tab **Upload**.
3. Kéo xuống mục **Upload presets**.
4. Bấm **Add upload preset**.
5. Cấu hình:
   - **Preset name**: đặt tên (ví dụ: `lopo_product_images`).
   - **Signing Mode**: chọn **Unsigned** (bắt buộc cho upload từ app).
   - **Folder** (tùy chọn): ví dụ `products` để ảnh nằm trong folder đó.
   - Có thể bật **Unique filename** nếu muốn tránh trùng tên.
6. Bấm **Save**.
7. Copy tên preset vừa tạo.
8. Ghi vào `mobile/.env`:
   ```
   EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=lopo_product_images
   ```

## Bước 4: Kiểm tra file .env

Sau khi sửa, `mobile/.env` có dạng:

```
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.251:3000/api
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=lopo_product_images
```

Không commit file `.env` lên git (đã nằm trong `.gitignore`). Restart app (Expo) sau khi đổi `.env`.

## Lưu ý bảo mật

- **Unsigned preset** cho phép bất kỳ ai có preset name upload lên cloud của bạn. Chỉ dùng cho app của bạn, không public preset name trong repo.
- Nếu cần bảo mật hơn: upload qua backend (mobile gửi file → backend upload lên Cloudinary bằng API Key + Secret).
