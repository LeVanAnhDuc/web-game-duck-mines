# Duck Mines — UX persona review · 2026-09-12

> 8 phiên · 6 persona · 6 Red Route · chạy trên bản deploy <https://levananhduc.github.io/web-game-duck-mines/> (commit `f9c267f`)
> Công cụ trình duyệt: chrome-devtools-mcp (hạng 2), mỗi phiên một `isolatedContext` riêng — **trừ `p02-RR-01`, phải tụt sang Playwright MCP** vì `chrome-devtools` trả `The browser is already running for ...chrome-profile` ở cả 3 lần thử. Hạng 1 (playwright) **không dùng làm mặc định được** vì thiếu `emulate` — không đặt được viewport mobile/touch lẫn throttle mạng; thiếu hai thứ đó thì p01 (375×720, Slow 4G) và p06 (390×844) âm thầm biến thành persona desktop, tức mất đúng nhóm primary mà sản phẩm tồn tại vì họ.
> Red route chốt ngày: 2026-09-12 · Log thô và 85 ảnh: `.claude/skills/ux-persona-review/runs/2026-09-12/`

## Ấn tượng đầu

| Thước                     | Kết quả                                                                                                                                                                                                                                                                                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Đoán đúng đây là trang gì | **5/6** — chỉ p06 (negative) đoán sai: _"Chắc là trò cào trúng thưởng... y như mấy tấm vé cào"_. Năm người còn lại nhận ra dưới 5 giây mà không đọc chữ nào                                                                                                                                                                                         |
| Dám nhập email            | **2/6** — p01, p04                                                                                                                                                                                                                                                                                                                                  |
| Lý do người không dám     | **Cả 4 người từ chối nói đúng một lý do: không ai đứng tên.** p02 _"không biết ai làm, không có tên tuổi gì"_ · p03 _"không có tên ai đứng ra chịu trách nhiệm"_ · p05 _"kiểu ai đó tự làm"_ · p06 _"chả có tên công ty"_. Không ai nói vì quảng cáo hay vì trông lừa đảo — p06 kết bài vẫn giữ _"nó trông sạch sẽ, tử tế, không có vẻ gì lừa đảo"_ |

**Ba từ trước:** lặp **"quen thuộc/quen tay" 5/6**, **"sạch sẽ/gọn gàng" 5/6**. Từ thứ ba gần như luôn là một biến thể của _thiếu_: **"trống/trống trải" ở 3 persona**, "nhạt" (p05, cả hai phiên), "e dè" (p03), "ô hơi bé" (p01).

**Ba từ sau:** p01 _hụt hẫng · may mà cắm được · chật chội_ — p02 _gọn · chơi được · tiếc_ / _đàng hoàng · hơi ngứa · chưa đủ lý do quay lại_ — p03 _nhẹ nhõm · tự chủ · tiếc_ — p04 _bực mình · tiếc · nhưng vẫn quý_ — p05 _sòng phẳng · gọn · vướng một chỗ_ / _chạm-đã-tay · sòng-phẳng-nửa-vời · tiếc_ — p06 _hụt hẫng · rối · hơi quê_

**Đổi theo hướng:** hai chiều ngược nhau cùng lúc, cả hai đều mạnh.

- **Lên** — năng lực lõi vượt kỳ vọng ban đầu ở 4/6. p05 vào coi thường, ra bằng _"nó có đủ đồ nghề của một bản chơi nghiêm túc, chỉ là nó giấu hơi kỹ"_. p03 đi từ _e dè_ sang _tự chủ_: _"Tôi có quay lại không? Có, và tôi nói câu này không nhiều lần trong một năm."_
- **Xuống** — từ tiêu cực lặp nhiều nhất là **"tiếc", 4/6 persona**. Không ai dùng nó để nói sản phẩm dở; cả bốn dùng nó cho cùng một chuyện: thứ họ cần có thật, nhưng nằm ở chỗ họ không tìm ra hoặc bị lấy mất. p05: _"nó im ắng đúng ở chỗ đáng lẽ phải nói."_ p02: _"trống đúng chỗ tôi cần."_
- **Hai người nói sẽ né mức Khó** sau khi thử — p01 (Android 375px) và p05 (Surface 1280px), hai thiết bị khác nhau.

## Bảng điểm theo Red Route

`min_steps` đếm thao tác UI, không đếm nước đi suy luận — nên cột cuối ghi thêm **số thao tác lãng phí**, thứ `red-routes.md` §Quy ước nói là cái đo được.

| Red Route                                  | Hiệu quả                                                                                                  | Hiệu suất | Lãng phí                          | Hài lòng                                    |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------- | --------- | --------------------------------- | ------------------------------------------- |
| **RR-01** Vào cuộc, kết thúc bàn đầu (p02) | **1/1** thắng 5:08                                                                                        | ~30 / 1   | 2 bấm không phản hồi + 1 quay lui | _tiếc_ · quay lại: **có**                   |
| **RR-02** Cắm cờ rồi mở nhanh (p05)        | **1/1**                                                                                                   | ~32 / 4   | 4 + 2                             | _vướng một chỗ_ · quay lại: **có**          |
| **RR-03** Đổi độ khó, tìm kỷ lục (p02)     | **0/1**                                                                                                   | ~33 / 2–3 | 3 + 2                             | _chưa đủ lý do quay lại_                    |
| **RR-04** Bàn Khó bằng ngón (p01)          | **0/1** — (b) và (c) đạt; (a) **không đo được** (hiện vật công cụ)                                        | 15 / 3    | 2 quay lui                        | _chật chội_ · quay lại nhưng **bỏ mức Khó** |
| **RR-05** Tự đặt bàn (p04)                 | **0/1** — nửa sau đạt trọn vẹn, nửa trước hỏng                                                            | 26 / 4    | 4 lần nhập thất bại + 2           | _nhưng vẫn quý_                             |
| **RR-06** Không dùng chuột (p03)           | **0/1** — mọi mắt xích đạt, chưa hết ván vì **chạm trần hành động của lượt chạy**, không phải vì sản phẩm | 36 / 3    | 1                                 | _tự chủ_ · quay lại: **có**                 |

## Phát hiện

### PH-01 · High · Interaction Design, Trigger words, Form design

**Ở đâu:** RR-03 — sheet Cài đặt § Độ khó, khi đang chơi dở.
**Chuyện gì:** Chọn mức khác lúc bàn đang chạy thì UI **không đổi gì**: chấm radio đứng nguyên, bàn giữ nguyên, không báo, không hỏi. Người chơi tin mình đã đổi, chơi tiếp trên giả định sai, và chết vì nó. "Bàn mới" sau đó vẫn ra mức cũ.
**Dẫn chứng:** p02-RR-03 bước 8 _"Bàn vẫn là bàn khó cũ... Ơ tôi vừa chọn Dễ mà?"_ → nổ. Bước 10 _"cú bấm 'Dễ' của tôi... không được ghi nhận gì hết... Nó im lặng nuốt mất. Đây là chỗ tôi cáu nhất trong cả buổi."_ Ảnh `p02-RR-03-09`, `-10`, `-11`.
**Vấp:** 1/1 người đi route. Không nâng bậc. High vì chặn `done_when` của RR-03 và vì `journeys.md` US-03 đòi "phải xác nhận bỏ bàn" — xác nhận **có tồn tại** nhưng không tới được mắt người dùng.
**Hướng:** Cú bấm phải để lại dấu vết ngay ở chỗ mắt đang nhìn. Đóng sheet mà im lặng vứt lựa chọn là trạng thái không được phép tồn tại.

### PH-02 · High · Form design, Interaction Design

**Ở đâu:** RR-05 — Tuỳ chỉnh, ba ô Cột / Hàng / Mìn.
**Chuyện gì:** Cột và Hàng kẹp giá trị **ngay khi gõ từng chữ số**. Mọi số hai chữ số bắt đầu bằng 1–4 không nhập được: gõ `2` → kéo lên `5`; gõ `4` → `54` → kéo xuống `40`. Ô Mìn **không** bị, nên ba ô trông giống hệt nhau lại hành xử khác nhau.
**Dẫn chứng:** p04-RR-05 bước 4 _"Tôi gõ số hai, rồi số bốn. Mà nó ra bốn mươi."_ Bước 5 _"Nếu tôi mà dạy học sinh kiểu này — em vừa viết chữ cái đầu tiên là cô đã xoá đi sửa — thì em nào cũng khóc."_ Bước 9 _"cùng một bảng, ô Mìn thì gõ được, hai ô Cột với Hàng thì không."_ Ảnh `p04-RR-05-04`, `-05`, `-06`, `-09`.
Số liệu phiên: **"bấm mà không có phản hồi: 0"** — _"Vấn đề không phải là nó im, mà là nó trả lời tôi bằng con số tôi không gõ."_
**Vấp:** 1/1. High vì chặn `done_when` và kết cục là **bỏ cuộc một nửa** sau 4 lần thử.
**Hướng:** _"cho tôi gõ xong cả con số rồi hãy sửa tôi."_ Ba ô cùng hàng phải hành xử cùng kiểu.

### PH-03 · High · Interaction Design, Trigger words

**Ở đâu:** RR-01, RR-02, RR-03, RR-06 — khắp nơi.
**Chuyện gì:** Nhiều thao tác **hợp lệ về hình thức nhưng vô hiệu trong ngữ cảnh**, tất cả phản hồi giống hệt nhau: tuyệt đối không gì. Người chơi không phân biệt được "mình sai" với "trang hỏng".
**Dẫn chứng — bốn chỗ, ba persona, cùng một hình dạng:**

- Chuột giữa không chord được — p02-RR-01 _"bấm xong mà màn hình không nhúc nhích một tí nào thì tôi không biết là mình sai hay là trang hỏng."_ (`p02-RR-01-03`)
- Chuột giữa **có** ăn nhưng không phản hồi lúc nhấn — p02-RR-03 bước 6 _"lúc bấm xuống không có gì nhấp nháy để tôi biết nó nhận."_ (`p02-RR-03-07`)
- **Chế độ Cờ giết chord** — p05-RR-02 bước 6 _"'Ơ, nó chết à? Hay tôi đếm nhầm cờ?' Tôi ngồi đếm lại cờ hai lần, chắc chắn mình đúng, rồi mới hiểu ra: đang ở chế độ Cờ thì chạm lên số không mở được gì hết."_ (`p05-RR-02-05`) → bước 7 giữ ngón trong chế độ Cờ lại cắm thêm cờ vào ô an toàn, _"Mất hai nước cho một thứ chẳng để làm gì"_ → bước 8 _"bật Cờ → cắm cờ → bật Mở → chạm số → bật Cờ lại. **Bốn nhịp thừa cho mỗi lần.**"_ rồi bỏ hẳn cái nút.
- Phím `F` trên ô đã mở — p03-RR-06 bước 7 _"Máy làm đúng. Nhưng nó im lặng hoàn toàn... **im lặng và hỏng là hai thứ trông giống hệt nhau**, và tôi đã thật sự tưởng phím `F` hỏng."_ (`p03-RR-06-07`)
  **Vấp:** **3/6 persona**, xuất hiện ở **4/6 Red Route**. Medium → **nâng High**.
  **Hướng:** Thao tác hợp lệ mà vô hiệu vẫn phải trả về _một_ dấu hiệu phân biệt được với "trang đứng". Riêng chế độ Cờ đang **lấy đi** thứ `overview.md` §2 gọi là "một nửa chiều sâu của game", trong im lặng, ở đúng cái nút to nhất màn hình — p05: _"nó bày ra to nhất màn hình, ai cũng sẽ bấm vào, mà bấm vào là mất luôn mở nhanh — không một chữ nào báo trước."_

### PH-04 · High · LATCH, Interaction Design, ISO 9241-11

**Ở đâu:** RR-04, RR-05, p05-blind — mọi bàn rộng hơn khung nhìn.
**Chuyện gì:** Mất hai thứ cùng lúc, không lấy lại được: **(a)** không mốc vị trí nào trên mặt bàn — sau một lần kéo mọi ô kín giống hệt nhau; **(b)** không tư thế nào nhìn được đồng thời mặt bàn và HUD hoặc thanh Mở/Cờ.
**Dẫn chứng:**

- p01-RR-04 bước 9 _"Kéo xong thì tôi mất phương hướng hoàn toàn: toàn ô xám như nhau, không có số hàng số cột gì để biết mình đang ở đâu."_ Đo được: bàn Khó **734px** trong khung **343px** → **thấy 47% bề ngang**. (`p01-RR-04-09`) Kết bài: _"không đụng mức Khó nữa."_
- p05-blind _"Kéo xuống để thấy đáy bàn thì mất luôn đồng hồ với số mìn ở trên. Ở trên thì mất hai nút Mở/Cờ ở dưới. **Không có lúc nào tôi nhìn được cả bàn lẫn đồng hồ cùng lúc.**"_ (`p05-blind-03`, `-08`) Kết bài: _"tôi sẽ không chơi mức Khó ở đây nữa."_
- p04-RR-05 bước 7 — bàn tuỳ chỉnh 39×30 làm **cả trang** cuộn, không phải riêng khung bàn. (`p04-RR-05-07`)
  **Vấp:** **3/6 persona**. Medium → **nâng High**. Đây là phát hiện duy nhất đánh thẳng vào `overview.md` §6.1.
  **Hướng:** `MASTER.md` §3 cấm co bàn cho vừa, nên hướng nằm ở **mốc vị trí** và **neo HUD**, không ở thu nhỏ ô. `MASTER.md` §7 đã ghi "bàn Khó cuộn trong khung của nó, không phải cả trang" — đúng ở 375px nhưng **sai với bàn tuỳ chỉnh lớn ở 1366px**.

### PH-05 · High · Visual hierarchy, Interaction Design

**Ở đâu:** RR-01, RR-03, p05-blind, p06-blind — bảng kết quả cuối ván.
**Chuyện gì:** Bảng neo **đáy khung nhìn**, cách mặt bàn một khoảng trống lớn; mắt người chơi đang ở trên bàn nên họ không thấy. Khi thấy rồi thì **mọi lối ra đều phá bàn vừa xong**: nút duy nhất là "Bàn mới", `Esc` cũng reset luôn ván. Trong lúc bảng hiện, bánh răng bị chắn nhưng vẫn trông sáng rõ như bấm được.
**Dẫn chứng:**

- p02-RR-01 _"cái bảng nằm tít dưới đáy màn hình, cách cái lưới một khoảng trống to — mắt tôi đang ở trên lưới."_ (`-11`) → bấm bánh răng _"Nó không ăn."_ _"nhìn thì không thấy nó chắn — bánh răng vẫn sáng rõ như bấm được."_ → `Esc` _"Ủa, cái 5:08 của tôi đâu?"_ _"không còn một chữ nào nhắc tới thành tích vừa rồi."_ (`-12`)
- p05-blind bước 8 _"mất một lúc mới hiểu là mình chết rồi — tôi còn chạm thêm mấy cái vào bàn."_ — _"nó chỉ nói 'Nổ rồi'. **Không nói tôi đã đi được 4:47**... cái 'Nổ rồi' trống trơn **nó bạc lắm**."_ (`p05-blind-08`)
- p06-blind _"không thấy dấu X để đóng cái khung đó, chỉ có mỗi một nút."_ — _"Mấy lần phải quay lui: **0 — vì không có chỗ nào để quay lui**."_ (`p06-blind-04`, `-05`)
  **Vấp:** **3/6 persona**. Medium → **nâng High**.
  **Hướng:** Bảng cần nằm nơi mắt đang ở, và cần một lối ra **không** huỷ ván — tách "đóng bảng" khỏi "bắt đầu ván mới". Thời gian đã đi là thứ duy nhất người chơi mang về từ một ván thua, và hiện nó không có mặt ở đó.

### PH-06 · High · Trigger words, Visual hierarchy, Visual craft

**Ở đâu:** RR-06, RR-05, ấn tượng 5 giây của mọi persona desktop — dòng gợi ý dưới bàn cờ.
**Chuyện gì:** Toàn bộ thông tin điều khiển desktop nằm trong **một dòng nhỏ nhất và nhạt nhất trang**, ba cụm dính nhau. Thứ tự đọc đặt **"Chuột"** lên đầu hai lần liên tiếp, nên năm giây đầu của người không dùng chuột đọc ra thành "trang này không dành cho tôi". Cụm bàn phím — đường đi **duy nhất** của persona a11y — nằm cuối.
**Dẫn chứng:**

- p03-RR-06 _"chữ chuột nằm trước, nằm bên trái, đập vào mắt trước... **năm giây đầu tôi đã kịp nghĩ 'lại một trang nữa không dành cho mình'**."_ — _"Thứ quan trọng nhất với tôi đang nằm ở chỗ mờ nhất."_ — _"Nếu dòng chữ đó to bằng một nửa cái đồng hồ thôi, năm giây đầu của tôi đã là 'được đấy'."_ (`p03-RR-06-01`)
- p04-RR-05 _"Tôi không có chuột giữa... 'Vậy là có một chức năng ở đây tôi vĩnh viễn không dùng được à?' **Nó ghi ở đó như thể ai cũng có, nên tôi thấy hơi bị bỏ rơi một chút.**"_ (`p04-RR-05-01`)
  **Vấp:** **2/6 persona**. Medium → **nâng High**.
  **Hướng:** Về câu hỏi "Lan không có nút giữa": chord **có** đường khác — chạm/bấm thẳng lên ô số đã đủ cờ (p05 dùng ở cả hai phiên) — nhưng **không một dòng nào trên UI nói đường đó tồn tại**. Đây mới là lỗ hổng, không phải cái nút giữa.

### PH-07 · Medium · Visual hierarchy, LATCH, Trust & desirability

**Ở đâu:** RR-01, RR-03 — mục "Kỷ lục" dưới đáy sheet Cài đặt.
**Chuyện gì:** Kỷ lục là **vòng lặp giữ chân duy nhất** của sản phẩm, đang nằm ở tầng sâu nhất: sau bánh răng, sau cả bốn mục, bị cắt ngang mép hộp — trong khi màn hình chính để trống gần nửa dưới.
**Dẫn chứng:** p02-RR-03 _"tôi không thấy chữ nào kiểu 'kỷ lục' hay 'lần tốt nhất' ở màn hình đầu"_ · _"Nó đáng ra phải ở ngay ngoài, cạnh cái đồng hồ."_ (`p02-RR-03-04`) p02-RR-01 _"sao phải chui vào tận đây mới thấy?"_ (`p02-RR-01-13` → `-15`) Kết bài _"trang này không cho tôi thấy tôi hôm qua ở đâu... **Thế thì nó là trang chơi một lần.**"_
**Vấp:** 1/6, nhưng ở **2 phiên độc lập**. **Không nâng bậc** đúng luật. Ghi rõ để cân: đây là phát hiện duy nhất mà hệ quả trực tiếp là một persona **primary** trả lời "chắc là không, chưa" cho câu quay lại.
**Hướng:** Nửa dưới màn hình chính là đất sẵn có. Quyết định cần ra: kỷ lục là dữ liệu của cài đặt, hay một phần của màn chơi?

### PH-08 · Medium · Trigger words, Interaction Design

**Ở đâu:** RR-03 — dòng "Dễ: 9×9, 10 mìn" dưới HUD.
**Chuyện gì:** Nằm đúng vị trí, viết đúng nội dung mà một control đổi độ khó sẽ có, nhưng là chữ trơ.
**Dẫn chứng:** p02-RR-03 bước 1 _"Tôi tưởng đó là cái nút đổi độ khó — nó nằm đúng chỗ mà, ai cũng bấm vào đấy... Ơ, thế nó ghi ra làm gì?"_ (`p02-RR-03-02`)
**Vấp:** 1/6. Không nâng bậc.
**Hướng:** Hoặc làm đúng cái việc hình dạng nó hứa, hoặc đừng trông như một nút.

### PH-09 · Medium · Trust & desirability

**Ở đâu:** Toàn trang — ấn tượng 5 giây.
**Chuyện gì:** Không tên người, tên nhóm, hay dòng nào nói ai làm ra nó. **4/6 persona** nêu đúng thiếu sót này, tự phát, ở giây thứ năm. Không ai nêu lý do nào khác. Hai người dùng nó để **định cỡ sản phẩm xuống** trước khi chơi.
**Dẫn chứng:** bốn câu đã trích ở §Ấn tượng đầu. Ảnh `p02-RR-01-01`, `p03-RR-06-01`, `p05-blind-01`, `p06-blind-01` — cả bốn cho thấy nửa dưới màn hình trống hoàn toàn.
**Vấp:** **4/6**. Low → **nâng Medium**.
**Hướng:** Rủi ro thực tế bằng không (trang không xin gì), cái mất là uy tín ban đầu. `overview.md` §5 ràng buộc 0₫ + xuất tĩnh, nên câu trả lời nếu có phải là **chữ**, không phải hạ tầng.

### PH-10 · Medium · Trigger words, Trust & desirability

**Ở đâu:** RR-02 và p05-blind — sheet Cài đặt § Lối chơi.
**Chuyện gì:** UI không nói ở đâu rằng nó theo luật gốc, tức bàn **không** bảo đảm giải được. Người chơi loại "không đoán" đi tìm từ giây thứ mười, không thấy, và biết sự thật sau 4–5 phút bằng cách mất một ván.

> **Ràng buộc đã tuân thủ:** việc phải đoán 6 lần là **va chạm kỳ vọng, không phải lỗi** (`overview.md` §4 Non-Goal đầu tiên). **Không** đề xuất solver, **không** đề xuất bàn no-guess. Phát hiện ở đây chỉ là câu hỏi phái sinh.
> **Dẫn chứng:** p05-blind _"Ơ, không có chỗ bật bàn giải được à?"_ — _"tôi đọc lại mục 'Lối chơi' hai lần cho chắc. Không có... không có ở đâu hết."_ (`p05-blind-02`) → _"bốn phút sau tôi lĩnh đủ hậu quả."_ (`-06`) p05-RR-02 bước 10, phiên khác cùng kết luận _"Với tôi đó là thông tin quan trọng nhất của một trang dò mìn, quan trọng hơn cả mức khó."_ (`p05-RR-02-08`) Hệ quả: _"tôi sẽ không đem thời gian của mình ra so với ai trên trang này."_
> **Đối chứng mạnh nhất nằm trong cùng phiên:** p05 **khen** sản phẩm vì đã làm đúng việc đó ở chỗ khác — ghi chú dưới công tắc âm thanh _"Mặc định tắt. Không có âm nào khác..."_: _"Chuyện nhỏ nhưng tôi thích. **Nó nói thẳng thứ nó không có, thay vì để tôi tự đoán.**"_ Sản phẩm **đã có sẵn thói quen** khai báo thẳng một Non-Goal tại chỗ — ở mục Âm thanh và ở dòng đỏ "Bàn tự đặt không ghi kỷ lục". Nó chỉ chưa làm vậy với Non-Goal đầu tiên và lớn nhất.
> **Vấp:** 1/6, 2 phiên độc lập. Không nâng bậc.
> **Hướng:** Không phải thêm tính năng — là **một câu khai báo**, cùng kiểu với hai câu đã có.

### PH-11 · Medium · Trigger words, Trust & desirability

**Ở đâu:** Wordmark "Duck Mines".
**Chuyện gì:** Chuỗi chữ lớn nhất, đậm nhất màn hình, và với hai persona nó không giải mã được.
**Dẫn chứng:** p03 _"Duck là con vịt thì liên quan gì tới mìn."_ p06 _"Con vịt à? Sao chả thấy con vịt nào."_
**Vấp:** **2/6**. Low → **nâng Medium** theo luật.
**Hướng:** Không ai bỏ cuộc vì cái tên, và cả hai nhận ra trò chơi từ cái lưới chứ không cần tên. Ghi lại vì hai người nói ra, không vì tôi nghĩ nó sai.

### PH-12 · Low · Visual craft, ISO 9241-11

**Ở đâu:** RR-01, RR-03 — số 2 và số 3.
**Chuyện gì:** Người mang sẵn bảng màu gốc (1 xanh dương, 2 xanh lá, 3 đỏ) phải dừng nhìn hai lần ở chỗ 2 và 3 cạnh nhau, và tự biết mình đang chậm — ở đúng trò chơi mà anh đo mình bằng đồng hồ.
**Dẫn chứng:** p02-RR-01 _"nhìn lướt qua nó gần như một màu... tôi biết rõ là mình đang chậm lại."_ (`p02-RR-01-07`) p02-RR-03 bước 7, phiên độc lập, cùng nội dung. (`p02-RR-03-08`)
**Đối chứng quan trọng hơn phát hiện:** p03 là persona **rối loạn nhận màu đỏ-lục** — dễ tổn thương nhất với đúng cặp này — và kết luận ngược: _"Với mắt tôi thì 2 và 3 gần như cùng một màu nâu xám. **Nhưng không sao cả** — nó là chữ số, tôi đọc hình dạng... **Đó là cách làm đúng.**"_
**Vấp:** 1/6, 2 phiên. Không nâng bậc.
**Hướng:** `MASTER.md` §0–§1 **thắng ở đây** và đã trả lời sẵn: chữ số là kênh chính, màu là kênh phụ; `--num-2` đo 5.08:1 và `--num-3` 4.75:1; cặp khó nhất ở light theme là **5 vs 6** (ΔE 30.1), không phải 2 vs 3. Đây **không** phải lệch token mà là va chạm giữa dải nhiệt có chủ ý và thói quen người chơi lâu năm. Nhường là phá signature element và phá luôn §6.2. **Không đề xuất đổi màu.**

## Quan sát thị giác chưa đủ dẫn chứng để thành phát hiện

Không persona nào vấp hay nhắc tới như một trở ngại, nên theo luật chống bịa phải hạ xuống thành quan sát. Ghi ra vì cả hai **vi phạm chính `MASTER.md`**:

- **Emoji làm icon trong sheet Cài đặt** — nhãn "Dấu hỏi ❓ trong chu kỳ cờ" render bằng emoji màu đỏ-hồng giữa một vỏ máy mà §0 quy định là "xám, không màu". Vi phạm §5 _"Emoji làm icon **bị cấm**"_ và §7 _"❌ Màu ở ngoài bàn cờ"_. Thấy ở `p01-RR-04-02`, `p02-RR-01-13`, `p04-RR-05-03`.
- **Middle dot nối chuỗi meta** (`A · B · C`) — §7 anti-pattern. Thấy ở `p01-RR-04-02`, `p04-RR-05-07`.

Ngoài hai chỗ đó, đối chiếu ảnh với `MASTER.md` **khớp** ở mọi điểm quan trọng: HUD là một dải liền với hai ô đọc số khoét lõm (§6); ô đã mở không viền / chưa mở có viền (§1); tiêu đề mục viết kiểu câu (§2); ô mìn nổ đỏ thẫm chữ trắng, ồn nhất bàn; sheet là bottom sheet ở mobile và dialog giữa ở desktop (§6); vòng focus 2px dày, rõ, có offset. Trang chỉn chu, nhất quán giữa 375 / 390 / 1280 / 1366 / 1440px.

## Không phát hiện được gì ở

Ghi ra để lần sau không sửa nhầm chỗ đang đúng.

- **Toàn bộ lõi bàn phím của RR-06** — mọi mắt xích đạt. Vòng focus _"đậm, dày, nhìn thấy ngay... **Đây là thứ quyết định tôi ở lại hay đi, và nó đạt**"_; 4 lần Tab vào tới bàn; mũi tên đi _"đúng từng ô một"_; `Space` mở; `F` cắm cờ, 010 → 009; không bị nhốt; và `Shift+Tab` quay **đúng về ô vừa đứng** — _"Nhiều trang bắt tôi đi lại từ góc trên bên trái mỗi lần quay vào; trang này nhớ chỗ tôi đứng."_
- **Chỉ số thành công §6.2 — số đọc được không cần màu.** Xác nhận bởi đúng người duy nhất xác nhận được (p03, rối loạn nhận màu).
- **Non-Goal "bàn tuỳ chỉnh không ghi kỷ lục" tự giải thích trên UI** — nửa `done_when` mà RR-05 gọi là lý do route tồn tại, **đạt trọn vẹn**, nói **trước** nước đầu, nhắc lại lần hai ngoài màn chính. p04: _"Tôi ghét nhất là trò lừa trẻ con, và trò này không lừa."_
- **Chạm bằng ngón: giữ ngón ra cờ, chạm ô số để chord** — p05 mò ra ở cả hai phiên. _"nó đoán đúng tôi đang chạm bằng ngón, không bắt tôi đổi chế độ"_ · _"không lỡ tay mở nhầm ô khi tôi định cắm cờ — cái đó nhiều trang làm hỏng."_
- **Thanh Mở/Cờ, xét riêng việc nó tồn tại và trạng thái đọc được** — p01 _"Tôi mừng thật sự"_ · _"Rõ ràng, không nhầm được cái nào đang bật."_
- **Đổi độ khó khi KHÔNG có ván đang chạy** — đổi phát ăn ngay, không cần "Áp dụng". _"Cái này tôi thích."_
- **Bàn Khó ở 1440×900** — vừa khít, không phải cuộn. Vấn đề của PH-04 chỉ xuất hiện dưới 1440px hoặc với bàn tuỳ chỉnh lớn.
- **Hiệu năng** — không persona nào phàn nàn, kể cả p01 chạy **Slow 4G** trên 375px. Network sạch: 12/12 và 11/11 request 200/304.
- **Không quảng cáo, không popup, không đòi gì trước** — 5/6 nêu tự phát như điểm cộng, kể cả persona bỏ cuộc.

## Ghi chú về chính lần chạy này

**Ba quan sát bị loại vì là hiện vật công cụ**, đã kiểm chứng lại bằng sự kiện thật và bằng code:

1. _"Bật Cờ mà chạm ô vẫn mở/nổ"_ (p06 bước 6–8, p01 bước 5–6) — `click` của CDP đi vào nhánh chuột vì `onPointerDown` return khi `pointerType === "mouse"` (ADR-0004). Bắn PointerEvent `touch` thật thì ô thành "đã cắm cờ"; chính bước 7 của p01 xác nhận trong phiên. **Hệ quả:** câu _"Đây đúng là cái tôi sợ nhất"_ của p01 **không** được tính, và mệnh đề (a) của RR-04 ghi là **không đo được** thay vì trượt.
2. _"Tab ra khỏi bàn không thấy viền focus"_ (p03 bước 9) — bàn cờ là chặng Tab cuối, focus sang thanh trình duyệt. **Hệ quả:** phần "tiếc" của p03 chỉ còn đúng một lý do (PH-06).
3. _"Vuốt ngang không cuộn bàn"_ (p01 bước 8) — khung bàn dùng cuộn native do compositor xử lý; PointerEvent tổng hợp không kích hoạt được. **Không kết luận được gì về FR-13 từ lượt này.**

**p06 là negative persona.** Việc cô không hiểu trò chơi là **kết quả ĐÚNG** (`overview.md` §4). Không đề xuất onboarding. Chỉ hai thứ không dính luật chơi được lấy từ phiên của cô: PH-05 và PH-09. Ghi thêm cho lần so sánh sau: câu _"nó chỉ làm tôi thấy **mình không thuộc về đây**"_ là **kết quả mong muốn** của một Non-Goal được thi hành đúng, không phải tín hiệu xấu.

**Sự cố kỹ thuật, đã trừ khỏi mọi số đo:** tab bị dựng lại 3 lần (p05-RR-02 bước 4, p03-RR-06 bước 6, p06-blind giữa bước 6–7). Nhận xét đi kèm của p05 — _"mở lại là mất hết"_ — trùng đúng một Non-Goal đã chốt, nên cũng không thành phát hiện.

**Hai tín hiệu console không nâng thành phát hiện** vì không persona nào vấp: 404 `favicon.ico` (p02-RR-01); _"A form field element should have an id or name attribute (count: 6)"_ (p04-RR-05, đúng màn hình ba ô Cột/Hàng/Mìn). Cái thứ hai đáng ngó vì persona a11y **chưa từng đi tới form đó** — đó là lỗ hổng che phủ của lượt chạy, không phải một phát hiện.

**Giới hạn sức mạnh thống kê.** Mỗi Red Route chỉ một persona đi, nên "Hiệu quả" là 1/1 hoặc 0/1 và "trung vị" không có ý nghĩa thống kê. Mọi phát hiện được nâng bậc đều dựa trên **nhiều persona ở nhiều Red Route khác nhau cùng vấp một hình dạng lỗi** (PH-03: 3 người/4 route · PH-04: 3/3 · PH-05: 3/4 · PH-06: 2 · PH-09: 4 · PH-11: 2), không dựa trên số lần lặp trong một route. Ba phát hiện chỉ một persona nhưng lặp ở hai phiên context sạch (PH-07, PH-10, PH-12) đều **giữ nguyên mức**.

**Đề nghị cho lượt sau:** giữ nguyên dàn 6 persona và 6 Red Route. Hai việc cần chuẩn bị để lấp chỗ lượt này không đo được — (1) đường bắn PointerEvent `touch` thật, hoặc thiết bị thật, để RR-04 mệnh đề (a) và FR-13 có số; (2) trần hành động cao hơn cho p03, vì lần này anh dừng khi **đang chơi thuận lợi** chứ không phải vì sản phẩm cản.
