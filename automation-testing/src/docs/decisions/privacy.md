# PRIVACY — Quyết định

Đi cặp với `docs/requirements/privacy.md`.

## Nguồn

Đọc ngày 2026-10-15 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/nfr.md` (NFR-DATA-04, NFR-REL-04, NFR-PERF-08, NFR-SEC-02),
  `docs/03-design/architecture.md` §1 ("Sau khi tải xong trang, hệ thống không gọi mạng lần nào nữa"),
  `docs/01-product/overview.md` (Non-Goals, trần chi phí), `docs/decisions/0008-one-sound-generated-at-runtime.md`,
  `docs/decisions/0013-ducker-id-sign-in.md`, `README.md` §Features "Nothing to install, no game account to create".
- **Code:** `client/src/game/storage/safeStorage.ts` (nơi duy nhất chạm `localStorage`, probe xoá ngay),
  `client/src/game/settings/types.ts` (`Settings`), `client/src/game/score/localScoreRepository.ts`,
  `client/src/app/layout.tsx` (`next/font/google`: Archivo + IBM Plex Mono, tự host trong `/_next/static/media/`),
  `client/next.config.ts` (`output: "export"`).
- **Test đã gom (gợi ý):** "ships no audio file at all - NFR-PERF-08" trong `client/e2e/core-game.spec.ts` → TC-PRIVACY-004;
  `client/e2e/ducker-id-flag-off.spec.ts` (không request ra ngoài khi cờ tắt) → module `ducker-id`, phần chung lặp lại ở
  TC-PRIVACY-001 cho một ván đầy đủ.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Không gọi mạng sau khi tải" tính cả request cùng site? → Có. architecture.md viết "không gọi mạng lần nào nữa",
  không chỉ "ra ngoài". App lazily tải một file font `.woff2` (cùng site) ở lần đầu một chữ số được vẽ, sau khi trang đã
  tải xong → **bug** BUG-PRIVACY-01. Hậu quả thật nhỏ (offline thì chữ số dùng font dự phòng; TC-PRIVACY-003 vẫn xanh),
  nên mức Thấp.
- **Q2** NFR-REL-04 "chơi được offline sau lần tải đầu": kiểm bằng ngắt mạng **rồi chơi tiếp**, không phải tải lại offline —
  site tĩnh không có service worker, tải lại khi mất mạng là việc của trình duyệt, docs không hứa điều đó (cách kiểm của
  NFR là thử tay).
- **Q3** NFR-DATA-04 liệt kê 4 thứ trong `localStorage` (kỷ lục, độ khó, theme, dấu hỏi). Sau FR-16 / FR-18 cài đặt có thêm
  bàn tuỳ chỉnh và tiếng — vẫn là sở thích chơi, không phải dữ liệu về người chơi. Danh sách trong NFR cũ hơn code, không
  coi là bug; REQ-PRIVACY-06 ghi đủ 6 trường.
- **Q4** NFR-SEC-02 ("grep `console.` trong CI") kiểm ở đây bằng nghe sự kiện `console` + `pageerror` trong trình duyệt thật.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Dependency audit (NFR-SEC-05) — script `client/scripts/check-audit.mjs` và job `dependency-review`.
- Ngoại lệ mạng khi bật cờ Ducker ID — module `ducker-id`.

## Tech debt liên quan

_(không có)_
