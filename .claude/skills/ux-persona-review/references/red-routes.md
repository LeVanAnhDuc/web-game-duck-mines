# Red Routes — Duck Mines

> Bản hợp đồng phạm vi cho mọi lượt chạy `ux-persona-review`. Sai ở đây thì mọi báo cáo
> về sau đều lệch.
> **Chốt:** 2026-09-12 · **Nguồn:** `docs/01-product/journeys.md` · `docs/02-requirements/scope.md` · `docs/01-product/overview.md`

## Quy ước của file này

- **Một Red Route là một hành trình, không phải một trang.** Duck Mines chỉ có **đúng
  một trang** (`/`, xuất tĩnh) — mọi thứ khác là sheet, dialog và thanh chế độ. Vì vậy
  `entry` ghi *trạng thái người chơi đang ở*, không ghi URL.
- **`min_steps` đếm thao tác UI, không đếm nước đi suy luận.** Số nước cần dọn một bàn
  phụ thuộc bàn sinh ra, nên nó không làm mẫu số được. Cái đo được là *thao tác thừa*:
  bấm vào chỗ không có phản hồi, mở nhầm sheet, phải quay lui. Mẫu số là số thao tác UI
  tối thiểu để tới `done_when`.
- **`done_when` chỉ nói thứ nhìn thấy trên màn hình.** Không có tên component, không có
  tên hàm — nếu persona phải đọc code mới biết mình xong chưa thì `done_when` viết sai.

## Trạng thái chung

Toàn bộ FR-01..FR-18 ở trạng thái `xong` (`docs/02-requirements/scope.md`,
`docs/04-state/backlog.md` §Đang làm). **Không có Red Route nào `planned`** — mọi route
dưới đây đều `live` và đều vào lượt chạy.

---

## RR-01 · Vào cuộc và kết thúc bàn đầu tiên

- **id:** RR-01
- **name:** Vào cuộc và kết thúc bàn đầu tiên
- **actor:** Người đã biết luật dò mìn, lần đầu vào trang này, ngồi laptop với chuột
- **entry:** Vừa mở trang, chưa bấm gì. Bàn kín ô chưa mở, đồng hồ 0
- **done_when:** Bàn kết thúc — màn hình báo **Dọn sạch bàn** hoặc **Nổ rồi** hiện ra và
  đồng hồ đứng lại. Thua thì mọi mìn hiện ra, ô vừa bấm nổi bật hơn các mìn khác
- **min_steps:** 1 (bấm một ô là đã vào cuộc — không có bước điều hướng hợp lệ nào trước đó)
- **why_red:** Là lý do trang tồn tại, là đường duy nhất dẫn tới mọi route còn lại, và là
  route duy nhất 100% người chơi đi qua
- **status:** live
- **derived_from:** `docs/01-product/journeys.md:18` (US-01) · `docs/02-requirements/scope.md:23`,`:24`,`:27`,`:29`,`:30` (FR-01, FR-02, FR-05, FR-07, FR-08)

## RR-02 · Cắm cờ rồi mở nhanh quanh một con số

- **id:** RR-02
- **name:** Cắm cờ rồi mở nhanh quanh một con số
- **actor:** Người chơi quen tay, dùng chuột, muốn đi nhanh hơn là mở từng ô
- **entry:** Đang giữa một bàn đã mở ra vùng số (nối tiếp RR-01)
- **done_when:** Bộ đếm mìn giảm đúng bằng số cờ vừa cắm, và **một** cú bấm lên ô số mở ra
  cùng lúc toàn bộ ô kề chưa cắm cờ
- **min_steps:** 4 (cắm 3 cờ quanh một ô số 3 · 1 lần chord)
- **why_red:** Chord là "một nửa chiều sâu của game" (`overview.md` §2). Không tìm ra nó
  thì người chơi đang chơi một bản clone bị cắt, và sẽ không quay lại
- **status:** live
- **derived_from:** `docs/01-product/journeys.md:52` (US-02) · `docs/02-requirements/scope.md:25`,`:26`,`:28` (FR-03, FR-04, FR-06)

## RR-03 · Đổi độ khó và tìm kỷ lục của mình

- **id:** RR-03
- **name:** Đổi độ khó và tìm kỷ lục của mình
- **actor:** Người quay lại sau vài bàn, muốn lên mức khó hơn hoặc chỉ muốn xem lần trước
  mình mất bao lâu
- **entry:** Nút **⚙ Cài đặt** trên đầu trang
- **done_when:** Bàn mới hiện ra ở đúng mức vừa chọn — đồng hồ về 0, bộ đếm mìn bằng số mìn
  của mức mới — và người chơi đọc được kỷ lục của **từng** mức ngay trên màn hình đó
- **min_steps:** 2 (mở cài đặt · chọn mức) — cộng 1 nếu bàn đang chạy, vì phải xác nhận bỏ bàn
- **why_red:** Kỷ lục là vòng lặp giữ chân **duy nhất** (không tài khoản, không bảng xếp
  hạng online — `overview.md` §4), và đây là chỗ duy nhất nhìn thấy nó
- **status:** live
- **derived_from:** `docs/01-product/journeys.md:79` (US-03) · `docs/02-requirements/scope.md:32`,`:33` (FR-09, FR-10)

## RR-04 · Chơi bàn Khó bằng ngón trên điện thoại

- **id:** RR-04
- **name:** Chơi bàn Khó bằng ngón trên điện thoại
- **actor:** Người đứng đợi, một tay giữ máy, màn hình ~375px, mạng chậm
- **entry:** Mở trang ở viewport hẹp (375×720 — mốc suite e2e đang dùng), độ khó **Khó**
  (30×16), bàn rộng hơn màn hình
- **done_when:** Cả ba việc cùng làm được: (a) mở đúng ô mình nhắm sau khi đã **trượt ngón
  sửa mục tiêu** ít nhất một lần, (b) cắm được cờ mà không lỡ mở ô, (c) đi tới được phần
  bàn nằm ngoài màn hình. Và **không** có nước đi nào xảy ra ngoài ý muốn trong suốt phiên
- **min_steps:** 3 (1 lần mở ô bằng chạm hai pha · 1 lần cắm cờ · 1 lần kéo bàn)
- **why_red:** Chỉ số thành công **thứ nhất** của sản phẩm nằm nguyên ở đây
  (`overview.md` §6.1: "nếu chỉ số này không đạt thì phần còn lại không quan trọng"). Và
  chạm lệch trong dò mìn không phải bất tiện — nó là mất cả bàn
- **status:** live
- **derived_from:** `docs/01-product/journeys.md:106` (US-04) · `docs/02-requirements/scope.md:35`,`:36`,`:39` (FR-12, FR-13, FR-17) · `docs/02-requirements/nfr.md:63` (NFR-A11Y-06)

## RR-05 · Tự đặt bàn, và biết nó không tính kỷ lục

- **id:** RR-05
- **name:** Tự đặt bàn, và biết nó không tính kỷ lục
- **actor:** Người chơi thấy ba mức có sẵn không hợp — muốn bàn rộng ít mìn, hoặc bàn nhỏ
  dày mìn
- **entry:** **⚙ Cài đặt** → **Tuỳ chỉnh**
- **done_when:** Bàn đúng kích thước vừa nhập hiện ra và chơi được; **và** khi được hỏi
  trước nước đầu tiên, người chơi tự nói được rằng bàn này không ghi kỷ lục
- **min_steps:** 4 (mở cài đặt · chọn Tuỳ chỉnh · nhập cột/hàng/mìn · đóng sheet)
- **why_red:** Đây là chỗ duy nhất trong sản phẩm mà **một Non-Goal phải tự giải thích trên
  UI** (`overview.md` §4: "UI phải nói điều này trước khi người chơi bấm nước đầu, không
  phải sau khi thắng"). Hiểu sai ở đây là thắng xong tưởng mình vừa phá kỷ lục
- **status:** live
- **derived_from:** `docs/01-product/journeys.md:139` (US-05) · `docs/02-requirements/scope.md:38` (FR-16)

## RR-06 · Chơi hết một bàn không dùng chuột

- **id:** RR-06
- **name:** Chơi hết một bàn không dùng chuột
- **actor:** Người dùng bàn phím / trình đọc màn hình, không dùng được trỏ chuột
- **entry:** Mở trang, `Tab` tới bàn cờ
- **done_when:** Di chuyển giữa các ô, mở ô, cắm cờ và kết thúc bàn — **toàn bộ bằng bàn
  phím** — và ở mọi thời điểm biết được con trỏ đang ở ô nào mà không cần đoán
- **min_steps:** 3 (tab vào bàn · di chuyển bằng phím mũi tên · mở ô bằng `Space`)
- **why_red:** FR-11 là một chức năng riêng, không phải hệ quả tự nhiên của việc dùng thẻ
  `button`. Và persona a11y là người **duy nhất** phát hiện được chỉ số thành công thứ hai
  (`overview.md` §6.2 — tám chữ số phân biệt được khi bỏ hết màu) đang hỏng
- **status:** live
- **derived_from:** `docs/02-requirements/scope.md:31` (FR-11) · `docs/02-requirements/nfr.md:59`,`:64` (NFR-A11Y-02, NFR-A11Y-07)

---

## Cố ý KHÔNG phải Red Route

Ghi ra để lần sau không phải tranh luận lại:

| Thứ | Vì sao không |
| --- | --- |
| Công tắc sáng/tối (FR-14) và bật tiếng nổ (FR-18) | Là **lựa chọn một chạm** nằm sẵn trong sheet cài đặt mà RR-03 và RR-05 đã mở ra. Không có hành trình nào dẫn tới chúng ngoài hành trình đó. Chất lượng thị giác của chế độ tối vẫn được chấm — qua lăng kính Visual craft trên ảnh của mọi persona |
| Xoá kỷ lục (FR-10, phần xoá) | Hành động huỷ dữ liệu không hoàn tác được — persona bị cấm chạm vào (xem rào an toàn của agent `ux-persona`) |
| Deploy GitHub Pages (FR-15) | Không có mặt người dùng nào |
| Học luật dò mìn | **Non-Goal dứt khoát** (`overview.md` §4: "không dạy luật, không tutorial, không onboarding"). Persona không biết luật mà lạc là kết quả **đúng**, không phải phát hiện |
