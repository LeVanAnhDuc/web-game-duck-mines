# Rule tạo persona — Duck Mines

> **Chưng ngày 2026-09-12.** Bản này **thay** bản seed offline: đã fetch được năm nguồn
> nền + nghiên cứu riêng cho domain game giải đố dò mìn trên web.
> Đổi rule ở đây thì **phải sinh lại** `personas/` — đó là lý do `--refresh-rules` tồn tại
> và là lý do nó không bao giờ tự chạy.

## Nguồn — fetch được gì, hỏng chỗ nào

| Nguồn | Trạng thái |
| --- | --- |
| NN/g — *Personas: Study Guide* | ✅ fetch được |
| NN/g — *Why Personas Fail* | ✅ fetch được |
| Cooper — goal-directed design, 4 loại persona | ✅ qua Dubberly + ScienceDirect (cooper.com không còn bài gốc) |
| Klement / Intercom — job story | ✅ fetch được |
| GDS — accessibility personas (7 hồ sơ) | ✅ trang chỉ mục + hồ sơ Ashleigh, Chris |
| Travis — Red Routes, `userfocus.co.uk/articles/redroutes.html` | ❌ **HTTP 403**. Thay bằng The Decision Lab, bài này tóm đúng ma trận và năm tiêu chí |

## 1 · Bốn loại persona (Cooper)

| Loại | Nghĩa | Ở Duck Mines |
| --- | --- | --- |
| **primary** | Người mà giao diện được thiết kế **cho**. Tiêu chí sắc của Cooper: primary là người **không thể được phục vụ bằng giao diện thiết kế cho bất kỳ persona nào khác** | Hai người: chơi-bằng-ngón và chơi-bằng-chuột. `overview.md` §3 nói thẳng "hai nhóm ngang nhau, không có nhóm phụ" — nên dàn này có **hai** primary, không phải một |
| **secondary** | Phần lớn mục tiêu đã được đáp ứng khi phục vụ primary, chỉ cần thêm vài thứ | Người dùng bàn phím, người tự đặt bàn, người chơi máy 2-in-1 |
| **served** | Chịu ảnh hưởng nhưng không trực tiếp dùng | **Không có.** Không server, không tài khoản, không ai khác nhìn thấy kết quả của bạn. Đừng bịa một persona loại này cho đủ bộ |
| **negative** | Người sản phẩm **không** nhắm tới. Có mặt để phát hiện đang phục vụ nhầm ai | **Đúng một**: người chưa từng chơi dò mìn. `overview.md` §3–4 loại họ ra bằng chữ ("không phải người mới học luật", "không dạy luật, không tutorial") |

## 2 · Persona bám hành vi, không bám nhân khẩu học

NN/g: bỏ mọi chi tiết **không đổi được một quyết định thiết kế nào**. "Nữ, 28 tuổi, thích
du lịch" không dự đoán được hành vi. Ở sản phẩm này, thứ dự đoán được hành vi là:

- **đã từng bị clone khác làm nổ bàn vì giữ ngón hụt** → sẽ dè dặt, sẽ thử nhả ngón sớm
- **chơi kiểu NF (không cắm cờ bao giờ)** → sẽ **không bao giờ** tìm thấy chord, và đó là
  dữ liệu chứ không phải lỗi của họ
- **quen chuột giữa để chord** → sẽ thử chuột giữa **trước khi** đọc bất kỳ hướng dẫn nào
- **đo mình bằng kỷ lục** → sẽ đi tìm bảng kỷ lục trong vòng một phút đầu

NN/g cũng liệt kê năm cách persona chết, và bốn trong số đó là bệnh tổ chức (làm xong không
ai dùng, làm một mình, không ai hiểu để dùng). Ở đây chỉ có cái thứ năm là rủi ro thật:
**persona sai mục đích** — viết cho marketing rồi đem đi test UX.

## 3 · Job story (Klement / Intercom), không phải user story

Mỗi persona viết được một câu: **khi \_\_\_, tôi muốn \_\_\_, để \_\_\_.**

Câu này là nguyên liệu sinh `goal_in_user_words`. Bắt buộc dùng **từ của người chơi**, cấm
từ của sản phẩm: viết *"tôi cần giết mười phút mà không phải tải app"*, **không** viết
*"tôi muốn dùng tính năng bàn tuỳ chỉnh"*. Persona nghe thấy tên tính năng là persona đã bị
mớm đường đi, và lượt chạy đó mất giá trị.

## 4 · Persona tiếp cận (GDS)

GDS có bảy hồ sơ: Claudia (thị lực kém, phóng to màn hình) · Ashleigh (mù, trình đọc màn
hình) · Ron (người già, nhiều bệnh cùng lúc) · Chris (viêm khớp dạng thấp) · Pawel (tự kỷ)
· Simone (chứng khó đọc) · Saleem (điếc sâu).

Hai hồ sơ có ích nhất cho một **bàn cờ 30×16 ô**:

- **Chris, 53, kế toán trưởng** — viêm khớp dạng thấp **cộng** rối loạn nhận màu. Bỏ chuột,
  **chỉ dùng bàn phím**, mới bắt đầu tập điều khiển bằng giọng. Trúng đúng hai chỗ của sản
  phẩm này: `FR-11` (bàn phím đầy đủ) và `NFR-A11Y-07` (màu không được là kênh duy nhất —
  mà bàn dò mìn thì tám chữ số phân biệt **chủ yếu** bằng màu ở mọi bản clone).
- **Ashleigh, 24, trợ lý hành chính** — mù, dùng trình đọc màn hình, đi bằng `Tab` /
  `Shift+Tab`. **Cố ý không đưa vào dàn:** một lưới 480 ô là thứ trình đọc màn hình không có
  cách nào duyệt tuyến tính cho ra hồn, và sản phẩm chưa từng tuyên bố hỗ trợ. Đưa vào chỉ
  sinh ra một báo cáo "không dùng được" đã biết trước. Ghi ra đây để lần sau không phải cãi
  lại — và để **nếu** có ngày làm chế độ chơi cho trình đọc màn hình thì persona này là
  người đầu tiên được thêm.

Saleem (điếc sâu) được phủ **gián tiếp** bởi `NFR-A11Y-08`: âm thanh không bao giờ là kênh
duy nhất, và mặc định đã tắt. Không cần persona riêng.

## 5 · Red Routes (Travis)

Ma trận hai trục: **bao nhiêu người làm** × **làm thường xuyên tới đâu**. Góc trên-phải là
Red Route. Năm đặc điểm của một Red Route thật: nhiều bước · kết thúc bằng một việc **xong**
· là việc phổ thông (so sánh được với sản phẩm cùng loại) · hướng mục tiêu · trùng lợi ích
của cả người dùng lẫn sản phẩm. Ví dụ kinh điển: thanh toán **là** red route, đăng ký nhận
bản tin **không**.

Sáu Red Route của sản phẩm này đã chốt ở `red-routes.md`. Persona **không** được đọc file
đó — họ chỉ nhận `goal_in_user_words`.

## 6 · Nghiên cứu riêng domain — dò mìn trên web

Phần này là thứ bản seed không có. Nó quyết định persona **mong đợi** điều gì trước khi mở
trang, và vì vậy quyết định họ sẽ thất vọng ở đâu.

**a. Giữ ngón để cắm cờ là vết thương cũ của cả thể loại.** Người chơi mô tả nó là "rất
nguy hiểm": nhả sớm thì **mở ô** (nổ), giữ lâu thì ngón trôi sang ô khác và cắm cờ nhầm
chỗ. Nặng hơn: trình duyệt **cướp** cú giữ ngón (menu chuột phải, bôi đen chữ) trước khi
game kịp nhận. Hệ quả: ít nhất một persona phải mang sẵn **nỗi sợ này** và phải thử nhả
ngón sớm ở lần đầu. Đây đúng là chỗ `FR-12` (chạm hai pha — nhấc ngón mới là hành động)
tuyên bố đã chữa, nên persona đó là người duy nhất kiểm chứng được lời tuyên bố.

**b. Có hẳn một lối chơi "NF" (no-flag) sinh ra để né cơ chế đó.** Người chơi mobile bỏ hẳn
cờ, chỉ chạm ô an toàn, vì như vậy nhanh hơn là vật lộn với giữ ngón. Một persona chơi kiểu
này sẽ **không bao giờ** tìm ra chord — và nếu thanh chế độ Mở/Cờ không tự lộ ra thì họ
cũng không biết là có. Đó là phép thử độ lộ diện, không phải lỗi của họ.

**c. "Nút Flag Mode" là giải pháp quen thuộc của các clone khác.** Người từng chơi clone
khác sẽ **đi tìm một cái nút như thế**. Duck Mines có nó (`FR-12`, thanh dưới). Câu hỏi thật
không phải "có không" mà là "họ có nhận ra trong 30 giây đầu không".

**d. Dân chơi dò mìn là dân suy luận, không phải dân phản xạ.** Động cơ là khoái cảm suy ra
được một ô chắc chắn an toàn, cộng với đua kỷ lục **với chính mình**. Game "êm và thư giãn",
chơi theo nhịp của mình. Hệ quả: persona **không** vội, nhưng persona **rất** khó chịu khi
bị ép đoán.

**e. Và ở đây có một va chạm kỳ vọng đã biết trước.** Nhiều bản hiện đại quảng cáo "100% bàn
giải được, không cần đoán". Duck Mines **cố ý không** làm vậy — Non-Goal đầu tiên trong
`overview.md` §4: "phải đoán ở nước cuối *là* Minesweeper kinh điển". Vậy nên khi persona
kiểu thuần tuý bực vì phải đoán, `ux-expert` **phải ghi nhận là va chạm kỳ vọng rồi dừng ở
đó** — không được nâng thành lỗi. Nó là bằng chứng cho một câu hỏi khác: *UI có nói rõ mình
theo luật gốc không?*

**f. Kiên nhẫn lúc tải trên mạng yếu là con số, không phải cảm giác.** 53% người dùng mobile
bỏ trang nếu quá 3 giây; 46% người chơi web từng bỏ một game vì nó mở quá lâu; một máy 1GB
RAM trên 3G có thể mất hơn 10 giây cho một game web đơn giản. Duck Mines đang ở **112.0 kB**
first-load JS (`backlog.md`, đo 04.09.2026) — persona mạng chậm là người kiểm chứng xem con
số đó có dịch thành trải nghiệm thật không. Đặt `patience_threshold` của persona đó **thấp**,
và tính cả thời gian tải vào ngưỡng.

## 7 · Trường bắt buộc của mỗi file persona

| Trường | Vì sao |
| --- | --- |
| `loại` (Cooper) | primary / secondary / negative — quyết định cách `ux-expert` cân phát hiện |
| bối cảnh, nghề | để lời persona nói nghe như người thật |
| trình độ số | quyết định mức chịu đựng với thuật ngữ |
| **kinh nghiệm dò mìn** | *thêm riêng cho sản phẩm này.* Biết luật / không biết luật là đường phân chia lớn nhất, vì "không dạy luật" là Non-Goal |
| thiết bị + mạng | dịch thẳng thành viewport và network throttle |
| nhu cầu tiếp cận | dàn bắt buộc có ít nhất một người |
| động cơ, nỗi sợ | định hướng cái persona chú ý tới |
| `patience_threshold` | 2–6 bước bế tắc liên tiếp thì bỏ cuộc. Bỏ cuộc là kết quả hợp lệ |
| ngôn ngữ | UI sản phẩm 100% tiếng Việt (`src/lib/strings.ts`) — persona nói tiếng Việt |
| `goal_in_user_words` cho từng Red Route được giao | bằng từ của người chơi, cấm từ của sản phẩm |

## 8 · Kích thước và thành phần dàn

**Sáu người, cố định giữa các lần chạy.** Đẻ persona mới mỗi lần chạy là tự tay phá thứ đắt
nhất skill này tạo ra: khả năng so sánh trước/sau khi sửa.

Bắt buộc trong dàn — dàn hiện tại thoả cả ba:

- ít nhất một persona tiếp cận → **p03** (chỉ bàn phím + rối loạn nhận màu)
- **đúng một** negative persona → **p06** (chưa từng chơi dò mìn)
- ít nhất một người dùng điện thoại trên mạng chậm → **p01** (375px, 4G yếu)

Thêm hai ràng buộc riêng của sản phẩm này:

- **Hai primary, không phải một.** `overview.md` §3 đặt người-chơi-bằng-ngón và
  người-chơi-bằng-chuột **ngang nhau**. Dàn chỉ có một phía là dàn viết sai.
- **Ít nhất một người trên máy vừa có chuột vừa có màn hình chạm** → **p05**. `journeys.md`
  US-04 gọi thẳng đây là chỗ hỏng: nhận sai loại thiết bị rồi **mất hẳn một đường vào**.
  [ADR-0004](../../../../docs/decisions/0004-input-branches-on-pointertype.md) chọn phân
  nhánh theo `pointerType` chứ không theo user-agent chính vì thế — p05 là người kiểm chứng.
