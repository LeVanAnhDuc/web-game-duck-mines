# Design System — Minesweeper

> **Đây là nguồn đúng duy nhất cho màu, chữ, khoảng cách.** Mọi mockup và mọi
> dòng CSS lấy giá trị từ file này. Không phát minh token mới trong mockup.
>
> **Không chạy lại `design-bootstrap`.** Output của nó thay đổi theo cách diễn đạt
> brief, nên tái sinh file này là làm token trôi âm thầm — đúng thứ file này ra đời
> để chặn. Quyết định trong đây đổi thì viết ADR mới, sửa tay file này.

**Dự án:** Minesweeper · **Chốt:** 2026-09-03 · **Quyết định:** [ADR-0001](../../decisions/0001-design-tokens.md)

---

## 0. Hướng thiết kế

**"Bảng đo", không phải "đồ chơi".** Minesweeper là một dụng cụ đọc: người chơi đọc
số đếm rồi đánh dấu chỗ nguy hiểm. Nên mặt bàn là mặt một thiết bị đo — chính xác,
im lặng, xám — và **toàn bộ độ mạnh tay của thiết kế dồn vào tám chữ số**.

Mọi thứ ngoài bàn (HUD, sheet cài đặt, dialog) là vỏ máy: xám, không màu, không
bóng đổ trang trí. Nếu một thành phần nào ngoài bàn cờ đang có màu, nó sai.

**Signature element: dải nhiệt của tám chữ số.** Màu số không tuỳ tiện — hue quét
đều một vòng theo chiều tăng nguy hiểm: xanh → lam → lục → ô-liu → hổ phách → cam →
đỏ thẫm → tím. Số 8 là tím: màu "ngoài thang", đúng với việc nó cực hiếm. Người chơi
đọc được "vùng này đang ấm lên" trước khi kịp đọc từng con số.

**Chữ số là kênh chính, màu là kênh phụ.** Ở 22px không ai phân biệt được 8 hue một
cách chắc chắn, và người mù màu thì không bao giờ. Nên chữ số phải tự đọc được, màu
chỉ gia cố. Đây là lý do chọn một typeface có chữ số hình dáng rõ, không phải chọn
một typeface đẹp.

---

## 1. Palette

Hai theme đều là hạng nhất. Token định nghĩa **theo vai trò**, không theo màu cụ
thể — code chỉ đọc `var(--…)`, không bao giờ ghi hex trực tiếp.

### Nền và vỏ

| Token | Light | Dark | Là gì |
| --- | --- | --- | --- |
| `--bg-page` | `#EDF0F3` | `#0E141A` | nền trang |
| `--bg-board` | `#DFE5EA` | `#141D24` | khung bàn, sau các ô |
| `--bg-cell-open` | `#F7F9FB` | `#18222A` | ô đã mở — **phẳng, không viền** |
| `--bg-cell-tile` | `#CBD5DD` | `#26333E` | ô chưa mở — thân viên gạch |
| `--edge-cell-tile` | `#758593` | `#6B8898` | viền viên gạch chưa mở |
| `--fg-default` | `#1B2733` | `#E6EDF3` | chữ thường |
| `--fg-muted` | `#586674` | `#94A3B0` | chữ phụ, nhãn |
| `--ring-focus` | `#1D4ED8` | `#7DA8FF` | vòng focus bàn phím |

### Tám chữ số — dải nhiệt

| Token | Light | trên ô mở | Dark | trên ô mở | Nghĩa |
| --- | --- | --- | --- | --- | --- |
| `--num-1` | `#1D4ED8` | 6.35:1 | `#7DA8FF` | 6.85:1 | xanh — yên |
| `--num-2` | `#0E7490` | 5.08:1 | `#3FC7DE` | 8.02:1 | lam |
| `--num-3` | `#15803D` | 4.75:1 | `#57D07A` | 8.23:1 | lục |
| `--num-4` | `#4A5A08` | 7.22:1 | `#A6CE58` | 8.91:1 | ô-liu |
| `--num-5` | `#A16207` | 4.66:1 | `#E4B443` | 8.38:1 | hổ phách |
| `--num-6` | `#C2410C` | 4.91:1 | `#FF8B57` | 6.98:1 | cam |
| `--num-7` | `#BE123C` | 5.96:1 | `#FF7195` | 6.19:1 | đỏ thẫm |
| `--num-8` | `#9A1BAE` | 6.33:1 | `#E08AE8` | 6.89:1 | tím — ngoài thang |

Tỉ lệ trên là **đo thật** trên `--bg-cell-open` của từng theme, không phải mục tiêu.
Thấp nhất: 4.66:1 (light, số 5) và 6.19:1 (dark, số 7) — đều vượt `NFR-A11Y-01`.

Cặp khó phân biệt nhất, đo bằng ΔE76: light **5 vs 6** ΔE 30.1, dark **3 vs 4**
ΔE 29.7. Đây là giới hạn thật của 8 hue trong một không gian màu, và là lý do chữ số
phải là kênh chính. Đổi bất kỳ giá trị nào trong bảng này thì **đo lại cả hai theme**
trước khi commit.

### Trạng thái ô

| Token | Light | Dark | Ghi chú |
| --- | --- | --- | --- |
| `--fg-flag` | `#9C2A08` | `#FF8B57` | icon cờ, trên thân gạch: 5.13:1 / 5.59:1 |
| `--fg-qmark` | `#3C4A57` | `#AEBECB` | dấu `?`, trên thân gạch: 6.11:1 / 6.78:1 |
| `--fg-mine` | `#1B2733` | `#E6EDF3` | mìn hiện khi thua, trên ô mở: 14.37:1 / 13.66:1 |
| `--bg-mine-boom` | `#B32A20` | `#D4574A` | ô mìn đã nổ, vs ô mở: 6.09:1 / 4.04:1 |
| `--fg-mine-boom` | `#FFFFFF` | `#1B0806` | mìn trên ô nổ: 6.42:1 / 4.85:1 |
| `--fg-flag-wrong` | `#A50F34` | `#FF7195` | gạch chéo lên cờ cắm sai: 5.19:1 / 4.95:1 |

Ô nổ ở light theme là **đỏ thẫm chữ trắng**, ở dark theme là **đỏ sáng chữ tối** —
hai chiều ngược nhau, cùng một mục đích: nó phải là thứ ồn nhất trên bàn, trong ngữ
cảnh của theme đó.

### Phân biệt "đã mở" vs "chưa mở" — không dùng màu

Ép hai trạng thái này chênh 3:1 về độ sáng là bất khả: muốn vậy thì ô đã mở phải tối
đến mức tám màu số không còn đủ 4.5:1. **Nên trạng thái được mã hoá bằng hình:**

- **ô chưa mở** = viên gạch có **viền `--edge-cell-tile` 1px** + nền `--bg-cell-tile`
- **ô đã mở** = **không viền gì cả**, phẳng, liền mặt bàn

WCAG 1.4.11 được đáp ứng qua `--edge-cell-tile` vs `--bg-cell-open`: **3.60:1**
(light) và **4.30:1** (dark). Bỏ viền của ô chưa mở là phá luôn cơ chế này.

---

## 2. Typography

Hai họ, phân biệt rõ. Không dùng Inter, không Plus Jakarta, không Varela Round.

| Vai trò | Họ chữ | Vì sao chính họ này |
| --- | --- | --- |
| **Chữ số bàn cờ + đồng hồ + bộ đếm** | `IBM Plex Mono` | Chữ số `1` có chân đế đầy nên ở 22px không lẫn với `l` hay `|`. Chiều rộng cố định nên đồng hồ không giật khi số đổi, và chữ số trong ô vuông tự canh giữa không cần hack. Đây là chữ số **dữ liệu trong lưới** — dùng mono ở đây là đúng chỗ, khác với dùng mono làm nhãn nhỏ cho ra vẻ kỹ thuật. |
| **Chữ UI, nhãn, tiêu đề, wordmark** | `Archivo` | Grotesque có x-height cao nên đọc được ở 12–14px trong sheet cài đặt. Trục width giãn ra được, dùng cho wordmark để có cảm giác mặt máy đo mà không cần thêm màu hay hình. |

```css
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
```

Fallback bắt buộc, vì font tải chậm không được làm bàn nhảy layout:

```css
--font-ui:   "Archivo", ui-sans-serif, system-ui, sans-serif;
--font-num:  "IBM Plex Mono", ui-monospace, "SFMono-Regular", Menlo, monospace;
```

### Thang chữ

| Token | Cỡ / line-height | Họ · weight | Dùng ở |
| --- | --- | --- | --- |
| `--type-wordmark` | 18px / 1.1, tracking −0.01em | Archivo 600 | tên game ở header |
| `--type-readout` | 20px / 1 | Plex Mono 500, `tabular-nums` | bộ đếm mìn, đồng hồ |
| `--type-heading` | 15px / 1.35 | Archivo 600 | tiêu đề mục trong sheet, tiêu đề dialog |
| `--type-body` | 14px / 1.5 | Archivo 400 | chữ thường, nhãn cài đặt |
| `--type-micro` | 12px / 1.35 | Archivo 500 | nhãn phụ, dòng gợi ý phím |
| `--type-cell` | `0.58 × cạnh ô` / 1 | Plex Mono 600 | chữ số trong ô |

**Chữ hoa toàn phần bị cấm cho nhãn.** Tiêu đề mục trong sheet viết kiểu câu
("Độ khó", không "ĐỘ KHÓ") — chữ hoa tracked-out là dấu hiệu rõ nhất của trang được
sinh máy móc.

---

## 3. Bàn cờ — kích thước và mật độ

| Token | Giá trị | Ghi chú |
| --- | --- | --- |
| `--cell-size` | 22px … 38px | tính theo chiều rộng khả dụng, **kẹp dưới ở 22px** |
| `--cell-gap` | 2px | khe hở, để lộ `--bg-board` |
| `--cell-radius` | 3px | vừa đủ để không phải hình vuông cứng, không thành viên kẹo |
| `--cell-min-numeral` | 16px | dưới cạnh này thì **ẩn chữ số**, ô chỉ còn khối màu |
| `--board-padding` | 8px | viền trong khung bàn |

**Kẹp dưới 22px là ràng buộc chứ không phải gợi ý.** Bàn Khó 30 cột ở 375px mà "vừa
khít chiều rộng" thì mỗi ô 11px, chữ số còn ~6px — không đọc được. Nên bàn Khó trên
màn hẹp **mặc định zoom sao cho ô ≥ 22px và cho pan bằng ngón**, không co lại cho
vừa. Chụm hai ngón để nhìn toàn bàn: khi ô xuống dư dưới `--cell-min-numeral`, chữ số
tắt và bàn thành **bản đồ nhiệt** — dải màu ở mục 1 chính là thứ làm chế độ nhìn tổng
này có nghĩa.

### Khoảng cách chung

| Token | Giá trị |
| --- | --- |
| `--space-1` … `--space-6` | 4 · 8 · 12 · 16 · 24 · 32 px |
| `--tap-min` | 44px — **mọi** control ngoài ô bàn cờ |

---

## 4. Chuyển động — chỉ một khoảnh khắc

Một khoảnh khắc được dàn dựng, không phải hiệu ứng rải khắp nơi.

**Sóng mở ô.** Khi flood fill mở một vùng, các ô sáng lên theo vòng, so le theo
khoảng cách Chebyshev tính từ ô vừa bấm: **12ms mỗi vòng, tổng tối đa 140ms**. Người
chơi thấy *hình dạng* vùng vừa mở ra thay vì thấy nó xuất hiện tức thì. Đây là chuyển
động trả lời hành động và cho thấy cái gì đã đổi — không phải trang trí.

| Token | Giá trị |
| --- | --- |
| `--motion-ring-stagger` | 12ms |
| `--motion-cascade-max` | 140ms |
| `--motion-press` | 90ms ease-out |
| `--motion-ui` | 160ms ease-out |

`prefers-reduced-motion: reduce` → sóng mở ô **tắt hoàn toàn**, mọi ô hiện cùng lúc,
`--motion-ui` về 0ms. Không có ngoại lệ, không giảm một nửa.

**Không dùng:** hover nâng thẻ, fade-slide-up khi cuộn, scale hover trên ô bàn cờ
(bàn dày 480 ô, mỗi transition là một lời hứa với compositor).

---

## 5. Icon — Lucide, không emoji

Emoji làm icon **bị cấm** (ràng buộc từ `ui-ux-pro-max`, không ghi đè được): nó đổi
hình theo hệ điều hành, không nhận `currentColor`, và không canh giữa được trong ô
22px. Dùng `lucide-react`, `strokeWidth` 2, `currentColor`.

| Chỗ | Icon Lucide |
| --- | --- |
| cờ trên ô | `Flag` |
| mìn | `Bomb` |
| dấu hỏi | **không phải icon** — ký tự `?` đặt bằng `--font-num` |
| bộ đếm mìn | `Flag` |
| đồng hồ | `Timer` |
| bàn mới | `RotateCcw` |
| cài đặt | `Settings` |
| sáng / tối | `Sun` / `Moon` |
| cờ cắm sai | `Flag` + gạch chéo `--fg-flag-wrong` vẽ bằng SVG inline |

---

## 6. Component specs

### HUD — một dải liền, không phải ba thẻ

Ba thẻ bo góc cạnh nhau là bộ đồ SaaS-card. HUD ở đây là **một dải `--bg-board` liền
mạch**: hai ô đọc số (bộ đếm mìn bên trái, đồng hồ bên phải) **khoét lõm** vào dải,
và nút bàn mới là thứ **duy nhất nổi lên**.

```
╭──────────────────────────────────────────────╮
│  ▸ 010                ( ↻ )            127 ◂ │   dải liền, 56px cao
╰──────────────────────────────────────────────╯
   readout               nổi              readout
   Plex Mono 20px      44×44px         Plex Mono 20px
```

Bộ đếm mìn âm được (`−3`) — dấu trừ dùng `−` U+2212, không phải hyphen, để chiều rộng
khớp ô mono.

### Ô bàn cờ

```css
.cell            { border-radius: var(--cell-radius); font: var(--type-cell); }
.cell--tile      { background: var(--bg-cell-tile);
                   border: 1px solid var(--edge-cell-tile); cursor: pointer; }
.cell--open      { background: var(--bg-cell-open); border: 0; cursor: default; }
.cell:focus-visible { outline: 2px solid var(--ring-focus); outline-offset: 1px; }
```

Ô đã mở giữ `border: 0` **kể cả khi có số** — viền là tín hiệu "chưa mở", dùng lại nó
cho việc khác là phá cơ chế ở mục 1.

### Sheet cài đặt

Bottom sheet ở mobile (bám đáy, bo trên 16px), dialog giữa ở ≥768px (max-width
440px). Tiêu đề mục kiểu câu, `--type-heading`. Không đường kẻ ngăn giữa mọi mục —
chỉ khoảng trắng `--space-5`; kẻ ngăn chỉ đặt trước mục "Kỷ lục" vì nó là dữ liệu chứ
không phải điều khiển.

### Dialog kết quả

Không confetti, không rung. Thắng: thời gian ở `--type-readout`, và nếu là kỷ lục mới
thì nói thẳng "Nhanh nhất từ trước tới giờ" bằng `--type-body` — không badge, không
màu. Thua: bàn đã tự hiện hết mìn ở phía sau, nên dialog chỉ cần một nút bàn mới.
Cả hai dialog đóng được bằng `Esc` và bằng nút, focus trả về nút bàn mới.

---

## 7. Ràng buộc a11y / UX — **không ghi đè được**

Đây là phần `ui-ux-pro-max` sở hữu. `frontend-design` được đổi màu và font, **không**
được đổi những dòng này.

- [ ] Tương phản chữ ≥ 4.5:1, **cả light và dark** — đo, không ước
- [ ] Focus nhìn thấy được cho mọi thành phần điều hướng bằng bàn phím
- [ ] `prefers-reduced-motion` được tôn trọng
- [ ] Vùng bấm ≥ 44×44px — trừ ô bàn cờ, theo `NFR-A11Y-06`, và **chỉ khi** cơ chế
      chạm hai pha còn hoạt động
- [ ] `cursor: pointer` trên mọi thứ bấm được
- [ ] Chuyển trạng thái có transition 150–300ms, không đổi tức thì (trừ khi
      reduced-motion)
- [ ] Không emoji làm icon — SVG từ Lucide
- [ ] Kiểm ở 375 / 768 / 1024 / 1440px
- [ ] Không cuộn ngang ở 375px — bàn Khó cuộn **trong khung của nó**, không phải cả
      trang
- [ ] Không nội dung bị che sau thanh bám đáy

### Anti-pattern của dự án này

- ❌ **Màu là kênh duy nhất** để phân biệt số, hoặc để phân biệt đã mở / chưa mở
- ❌ **Chữ hoa toàn phần** cho nhãn và tiêu đề mục
- ❌ **Middle dot nối chuỗi meta** (`A · B · C`) trong chữ UI
- ❌ **Bóng đổ xám mềm đồng loạt** dưới mọi khối — HUD là dải liền, không phải thẻ
- ❌ **Màu ở ngoài bàn cờ** — vỏ máy là xám, màu chỉ thuộc về chữ số và ô nổ
- ❌ **Hex viết thẳng trong code** — chỉ đọc qua `var(--…)`

---

## 8. Đã ghi đè gì của step 1

| `ui-ux-pro-max` đề xuất | Chốt lại là | Vì sao |
| --- | --- | --- |
| Style **Claymorphism** (3D mềm, viền 4px, bo 16–24px, "toy-like") | mặt thiết bị đo, bo 3px | Bo 16px trên ô 22px thì ô thành hình tròn. "Toy-like" sai đối tượng: đây là trò suy luận, không phải app trẻ em. Và Claymorphism chỉ hỗ trợ dark mode ở mức "conditional" — brief đòi dark mode hạng nhất. |
| Hồng `#EC4899` + tím `#8B5CF6` + vàng `#F59E0B`, nền `#0F172A` | dải nhiệt 8 màu, vỏ xám trung tính | Palette 3 màu không cấp đủ 8 màu số phân biệt được. Hồng làm primary thì cạnh tranh trực tiếp với số 7 đỏ thẫm — màu quan trọng nhất trên bàn. |
| `Varela Round` + `Nunito Sans` | `Archivo` + `IBM Plex Mono` | Cả hai đều bo tròn mềm, chữ số `1` không có chân đế → lẫn ở 22px. Và không có họ nào cấp `tabular-nums` cho đồng hồ. |
| Pattern **Hero + Testimonials + CTA**, thứ tự Hero → Problem → Solution → Testimonials → CTA | một màn duy nhất, bàn cờ ở giữa | Đây là landing page bán hàng. Sản phẩm này không có landing page, không có gì để bán, và không có testimonial. |
| "Tránh: màu trầm, năng lượng thấp" | vỏ máy **cố ý** trầm | Đảo ngược có chủ ý: vỏ trầm là điều kiện để dải nhiệt của chữ số nổi lên. Mạnh tay đúng một chỗ. |

Giữ nguyên từ step 1, không sửa: toàn bộ mục 7 (a11y/UX), thang khoảng cách 4/8/16/24/32,
và luật "không emoji làm icon".
