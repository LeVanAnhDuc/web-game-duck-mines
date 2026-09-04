# ADR-0008 · Đúng một âm thanh, sinh lúc chạy, mặc định tắt

> **Ngày:** 2026-09-04
> **Trạng thái:** accepted
> **Liên quan:** FR-18 · NFR-A11Y-08 · NFR-PERF-08 · NFR-PERF-07
> · supersedes một Non-Goal trong overview.md

## 1. Bối cảnh

Non-Goal cũ: *"Không âm thanh — vì một game chơi lúc đợi xe thì mở tiếng là thứ người
ta tắt ngay."* Người dùng muốn tiếng khi mìn nổ, **và tự đề nghị kèm công tắc tắt**.

Tức lý do của Non-Goal cũ được giải quyết bằng đúng thứ được xin. Đây là trường hợp
Non-Goal nên được **sửa có điều kiện**, không phải bị bác bỏ.

Ràng buộc: `NFR-PERF-07` giữ first-load JS dưới 200KB (hiện 106 kB), và dự án cùng
workspace `web-app-calculate-badminton`… không liên quan, nhưng `web-game-flappy-bird`
có tiền lệ trực tiếp: nó sinh **toàn bộ** hiệu ứng âm thanh lúc chạy bằng WebAudio và
không ship một file audio nào.

## 2. Quyết định

**Một âm duy nhất: tiếng mìn nổ.** Sinh lúc chạy bằng WebAudio — nhiễu trắng qua một
lowpass đang đóng dần, cộng một envelope tắt nhanh. Không file `.mp3`, `.wav`, `.ogg`
nào trong repo hay trong `out/`.

**Mặc định TẮT.** Công tắc nằm trong sheet cài đặt, lựa chọn được nhớ.

`AudioContext` chỉ được tạo ở **lần bật tiếng đầu tiên**, không phải lúc tải trang: tạo
sẵn một context rồi để nó `suspended` là tốn tài nguyên cho một tính năng phần lớn người
chơi không bật.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Ship một file `.mp3` ngắn | Thêm một loại asset mà dự án hiện không có, thêm byte vào `out/`, và thêm một câu hỏi về giấy phép cho một tệp âm thanh tải ở đâu đó về |
| Âm cho cả mở ô và cắm cờ | Kêu **mỗi nước đi**. Vui trong hai phút, mệt sau mười, và biến nhịp chơi nhanh bằng chuột thành tiếng ồn liên tục |
| Thêm âm báo thắng | Không loại vĩnh viễn, nhưng thắng đã có dialog và thời gian; thêm âm ở đây là thêm bề mặt mà chưa có ai xin |
| Mặc định BẬT | Một tiếng nổ bất ngờ trên xe buýt là đúng thứ Non-Goal cũ muốn tránh. Đổi lại: phần lớn người chơi sẽ không bao giờ mở cài đặt nên sẽ không bao giờ nghe — chấp nhận, vì im lặng ngoài ý muốn thì vô hại còn tiếng ồn ngoài ý muốn thì không |
| Tạo `AudioContext` sẵn lúc mount | Trình duyệt chặn phát trước cử chỉ người dùng nên vẫn phải nối lại; và giữ một context sống cho tính năng mặc định tắt là lãng phí thuần |

## 4. Hệ quả

**Được:**

- `NFR-PERF-08` đạt theo cấu tạo: không có asset nào để mà lớn lên.
- `NFR-A11Y-08` đạt theo cấu tạo: thua đã có ô đỏ, mìn hiện ra và dialog. Âm thanh chỉ
  là kênh thứ tư, tắt đi không mất mẩu thông tin nào.
- Không cần `prefers-reduced-motion` tương đương cho âm thanh, vì mặc định đã tắt.

**Mất / phải chấp nhận:**

- **Phần lớn người chơi sẽ không bao giờ nghe thấy nó.** Đây là hệ quả trực tiếp của
  mặc định tắt, và là cái giá đã biết trước khi làm.
- Âm sinh bằng code thì không "hay" bằng một mẫu thu thật. Với một tiếng nổ ngắn thì
  chênh lệch đó nhỏ; với thứ gì phức tạp hơn thì quyết định này sẽ phải xem lại.
- WebAudio không tồn tại trong môi trường test mặc định, nên module phải nhận
  `AudioContext` từ ngoài để test được — nó không được tự gọi `new AudioContext()` ở
  thân module.

**Điều kiện xem lại quyết định này:** có người xin thêm âm thứ hai (lúc đó phải xem lại
cả "mỗi nước đi" lẫn mặc định) · hoặc cần một âm mà code không sinh nổi.
