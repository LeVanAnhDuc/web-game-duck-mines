# SETTINGS — Quyết định

Đi cặp với `docs/requirements/settings.md`.

## Nguồn

Đọc ngày 2026-10-15 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-10, FR-18), `docs/01-product/journeys.md` (US-03 + "Điều gì có thể
  sai"), `docs/02-requirements/nfr.md` (NFR-REL-03, NFR-A11Y-08, NFR-PERF-08, NFR-DATA-04),
  `docs/decisions/0008-one-sound-generated-at-runtime.md`, `docs/specs/ux-persona-findings/design.md` (câu hỏi bỏ bàn
  nhận focus, ghi chú "nước cuối có thể phải đoán"), `README.md` §Features ("Changing board mid-game asks first, and
  only once the clock is actually running", "One sound, and it is off").
- **Code:** `client/src/views/Home/components/SettingsSheet/index.tsx` (`inProgress`, `pending`, focus câu hỏi, Esc,
  scrim), `client/src/game/settings/localSettingsRepository.ts`, `client/src/game/storage/safeStorage.ts` (probe +
  try/catch), `client/src/hooks/useSound.ts`, `client/src/game/audio/explosion.ts` (buffer nhiễu sinh tại chỗ).
- **Test đã gom (gợi ý):** "settings" trong `client/e2e/core-game.spec.ts` — đổi bàn + nhớ qua reload (→ TC-SETTINGS-007),
  hỏi trước khi bỏ bàn (→ TC-SETTINGS-004), tiếng tắt mặc định (→ TC-SETTINGS-010); case theme sang module `theme`, case
  "ships no audio file" sang module `privacy`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** US-03 nói hỏi khi bàn "đã bắt đầu"; cắm cờ trước nước đầu có tính là bắt đầu? → Không. README nói rõ "only once
  the clock is actually running", và đồng hồ chỉ chạy từ nước mở đầu. → TC-SETTINGS-003 (biên).
- **Q2** NFR-DATA-04 "Người chơi xoá được toàn bộ bằng một nút trong cài đặt" — "toàn bộ" là gì? → Toàn bộ **kỷ lục**
  (FR-10 "xoá kỷ lục"; nút tên "Xoá kỷ lục"). Lựa chọn độ khó/theme/công tắc là sở thích, giữ lại. Không coi là bug.
- **Q3** "localStorage không dùng được" giả lập thế nào? → Getter `window.localStorage` ném `SecurityError` — đúng
  hình dạng của chế độ riêng tư / chặn dữ liệu trang. Kiểm "chơi được đầy đủ" bằng mở ô, cắm cờ, đổi độ khó.
- **Q4** "Thắng không được khoe là kỷ lục" khi không lưu được — có trong docs? → NFR-REL-03 "chỉ mất lưu kỷ lục", và code
  (`saveIfBest` trả false khi ghi hỏng) giải thích "it became the new best is a claim about what is stored". Docs không
  cấm điều ngược lại nhưng khẳng định một kỷ lục không lưu được là nói sai → chấp nhận làm requirement.
- **Q5** Âm thanh kiểm thế nào khi headless không có loa? → Đếm `AudioContext` được tạo, `AudioBufferSourceNode.start`
  được gọi và `decodeAudioData` (file) — qua init script bọc API trình duyệt. Không nghe được, nhưng chứng minh được
  "tắt thì không phát", "bật thì phát", "không từ file".

## Tài khoản test

Không có.

## Ngoài phạm vi

- Chất lượng / âm lượng tiếng nổ, và NFR-A11Y-08 "chơi hết một ván với tiếng tắt" — thử tay.
- Theme trong cài đặt: module `theme`. Bàn tuỳ chỉnh trong cài đặt: module `custom-board`.

## Tech debt liên quan

_(không có)_
