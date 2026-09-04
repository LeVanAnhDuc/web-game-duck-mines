# Yêu cầu phi chức năng

> **Trả lời:** Ngưỡng nào áp cho **mọi** feature, để không phải nhắc lại từng lần?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-03 · commit —
> **Cập nhật khi:** thêm loại tài nguyên mới · thêm nhóm người dùng · sau sự cố sinh ra ngưỡng mới

<!-- CÁCH ĐIỀN
Đây là file AI BỎ QUA ÂM THẦM nếu nó trống — code vẫn chạy, test vẫn xanh, và
không có cảnh báo nào. Vì vậy nó được điền sẵn bằng các ngưỡng mặc định hợp lý.

VIỆC CỦA BẠN: đọc một lượt, XOÁ dòng không áp dụng, SỬA con số cho khớp dự án,
rồi đổi trạng thái sang 🟢. Giữ nguyên nguyên văn mặc định cũng được, nhưng phải
là lựa chọn có ý thức.

Mỗi dòng phải ĐO ĐƯỢC. Không viết được cách kiểm thì chưa phải yêu cầu:
  Sai:  "API phải nhanh"      Đúng: "p95 < 300ms cho endpoint đọc"
  Sai:  "phải bảo mật"        Đúng: "mọi mutation kiểm quyền ở server"

ID không tái dùng. Bỏ một ngưỡng thì đổi thành ~~(bỏ)~~, không xoá dòng.
Tài liệu thiết kế của feature tham chiếu ID ở dòng `Liên quan:` — KHÔNG chép nội dung sang.
-->

**Hình dạng dự án này quyết định phần lớn bảng dưới:** một trang tĩnh, chạy hoàn toàn
ở client, **không server · không database · không tài khoản · không PII · không gọi
mạng nào sau khi tải trang**. Nên 14 ngưỡng mặc định đã bị đánh `(bỏ)` — chúng nói về
một hệ thống không tồn tại ở đây. Giữ số, không xoá dòng, vì commit và test sau này
vẫn có thể nhắc tới ID cũ.

## Performance

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| ~~NFR-PERF-01~~ | ~~Mọi endpoint trả danh sách đều phân trang~~ **(bỏ)** — không có endpoint | — |
| ~~NFR-PERF-02~~ | ~~p95 < 300ms cho endpoint đọc~~ **(bỏ)** — không có server | — |
| ~~NFR-PERF-03~~ | ~~Không có truy vấn N+1~~ **(bỏ)** — không có datastore | — |
| ~~NFR-PERF-04~~ | ~~Mọi cột filter/sort đều có index~~ **(bỏ)** — không có bảng | — |
| NFR-PERF-05 | Tính reveal cho vùng trống lớn nhất của bàn Khó (30×16) < 16ms | benchmark trong vitest, chạy trên bàn có seed cố định |
| NFR-PERF-06 | Từ lúc chạm đến lúc bàn vẽ xong < 50ms trên bàn Khó | React Profiler, đo ở nước mở vùng lớn nhất |
| NFR-PERF-08 | Âm thanh **không thêm một byte asset nào** — sinh lúc chạy, không file `.mp3`/`.wav`/`.ogg` trong `out/` | `scripts/check-bundle-size.mjs` + `git ls-files` |
| NFR-PERF-07 | First-load JS < 200KB gzip | `scripts/check-bundle-size.mjs`, chạy trong CI. Đo từ **HTML đã xuất** chứ không đọc bảng `next build` — bảng đó đổi theo bản Next, HTML thì là thứ trình duyệt thật sự tải |

## Security

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| ~~NFR-SEC-01~~ | ~~Mọi mutation kiểm quyền ở server~~ **(bỏ)** — không có server, không có dữ liệu của người khác để lộ | — |
| NFR-SEC-02 | Không log gì ra console ở bản production | grep `console.` trong CI |
| ~~NFR-SEC-03~~ | ~~Rate limit endpoint đăng nhập~~ **(bỏ)** — không có đăng nhập | — |
| NFR-SEC-04 | Secret chỉ đọc từ biến môi trường. Không hardcode, không commit | grep + review |
| NFR-SEC-05 | Dependency không có lỗ hổng mức high trở lên | `yarn audit --json \| node scripts/check-audit.mjs`, chạy trong CI. `yarn audit` một mình không diễn đạt được "high trở lên": Yarn 1 trả bitmask gộp mọi mức, nên một lỗ hổng moderate cũng làm đỏ CI |
| ~~NFR-SEC-06~~ | ~~Lỗi trả về client không chứa stack trace~~ **(bỏ)** — không có lỗi từ server | — |

## Accessibility

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| NFR-A11Y-01 | Tương phản chữ thường ≥ 4.5:1, chữ lớn ≥ 3:1, **ở cả light và dark** | script đo, không dùng mắt — xem [ADR-0001](../decisions/0001-design-tokens.md) |
| NFR-A11Y-02 | Mọi hành động thao tác được bằng bàn phím, và focus luôn thấy được. Bàn cờ: mũi tên di chuyển · `Space` mở · `F` cắm cờ · `Enter` chord · `R` bàn mới | e2e |
| NFR-A11Y-03 | Vùng bấm ≥ 44×44px trên thiết bị cảm ứng — **trừ ô bàn cờ**, xem NFR-A11Y-06 | review mockup + e2e |
| NFR-A11Y-04 | Mọi input có label liên kết; mỗi ô bàn cờ có `aria-label` nói rõ vị trí và trạng thái | review |
| NFR-A11Y-05 | Tôn trọng `prefers-reduced-motion`: sóng mở ô tắt hoàn toàn, không giảm một nửa | review CSS + e2e |
| NFR-A11Y-06 | Ô bàn cờ được miễn ngưỡng 44px, **với hai điều kiện**: cạnh ô ≥ 22px, và cơ chế chạm hai pha (đặt ngón để nhắm, nhấc ngón mới là hành động, nhấc ngoài ô thì huỷ) còn hoạt động | e2e ở 375px + thử tay trên máy thật |
| NFR-A11Y-07 | Không dùng màu làm kênh duy nhất — chữ số phân biệt được khi bỏ hết màu; đã mở / chưa mở phân biệt bằng viền, không bằng độ sáng | screenshot ở chế độ grayscale |
| NFR-A11Y-08 | Âm thanh **không bao giờ là kênh duy nhất**. Tắt tiếng thì không mất một mẩu thông tin nào — thua đã có ô đỏ, mìn hiện ra và dialog | chơi hết một ván với tiếng tắt |

## i18n

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| NFR-I18N-01 | Không hardcode chuỗi hiển thị trong code | grep |
| ~~NFR-I18N-02~~ | ~~Thời gian lưu ở UTC~~ **(bỏ)** — thời gian duy nhất trong dự án là *khoảng* (giây đã chơi), không phải *mốc*; múi giờ không liên quan | — |
| ~~NFR-I18N-03~~ | ~~Định dạng số/tiền/ngày theo locale~~ **(bỏ)** — không có tiền, không có ngày; thời gian hiển thị `m:ss` giống nhau ở mọi locale | — |

## Reliability

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| ~~NFR-REL-01~~ | ~~Mọi lệnh gọi ra ngoài có timeout~~ **(bỏ)** — không gọi ra ngoài sau khi tải trang | — |
| ~~NFR-REL-02~~ | ~~Tác vụ ghi quan trọng là idempotent~~ **(bỏ)** — không có tác vụ ghi ra ngoài máy người chơi | — |
| NFR-REL-03 | Không có trạng thái loading vô hạn. `localStorage` không dùng được thì game **vẫn chơi được đầy đủ**, chỉ mất lưu kỷ lục, và nói rõ điều đó bằng một dòng — không dialog, không chặn | test nhánh `localStorage` ném lỗi + thử tay ở chế độ riêng tư |
| NFR-REL-04 | Game chơi được **offline** sau lần tải đầu | thử tay: tải trang, ngắt mạng, reload |

## Data & Privacy

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| ~~NFR-DATA-01~~ | ~~Trường nào là PII được liệt kê rõ~~ **(bỏ)** — xem NFR-DATA-04 | — |
| ~~NFR-DATA-02~~ | ~~Xoá tài khoản thì xoá toàn bộ PII~~ **(bỏ)** — không có tài khoản | — |
| ~~NFR-DATA-03~~ | ~~Có đường khôi phục dữ liệu~~ **(bỏ)** — không có dữ liệu phía server để khôi phục; kỷ lục nằm trên máy người chơi và mất được, đó là đánh đổi có ý thức | — |
| NFR-DATA-04 | Dự án **không thu bất kỳ PII nào**, không analytics, không cookie. `localStorage` chỉ chứa: kỷ lục theo độ khó, độ khó đang chọn, theme, bật/tắt dấu hỏi. Người chơi xoá được toàn bộ bằng một nút trong cài đặt | grep toàn bộ chỗ ghi `localStorage` + review |

**Trường PII trong dự án này:** không có. Xem `NFR-DATA-04`.
