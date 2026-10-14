# GAMERESULT — Bug log

## Đang mở

| Bug | Mức | TC | Tóm tắt |
|---|---|---|---|
| [BUG-GAMERESULT-01](#bug-gameresult-01) | Thấp | TC-GAMERESULT-013 | Thắng mà mìn còn lại không tự hiện cờ, bộ đếm không về 000 |

### BUG-GAMERESULT-01

- **TC:** TC-GAMERESULT-013 · **Requirement:** REQ-GAMERESULT-05
- **Bước tái hiện:** mở `./?seed=20260903`, bấm ô 40, mở mọi ô không có mìn mà không cắm cờ nào.
- **Mong đợi:** (`docs/01-product/journeys.md` US-01 "Kết quả mong đợi") "Thắng thì đồng hồ dừng, mọi mìn còn lại tự hiện
  cờ" — các ô mìn thành "đã cắm cờ", bộ đếm `000`.
- **Thực tế:** dialog "Dọn sạch bàn" hiện đúng, nhưng 10 ô mìn vẫn "chưa mở" (không cờ) và bộ đếm vẫn `010`.
  `settle()` trong `client/src/game/core/reducer.ts` trả `board` nguyên trạng khi `isWon`, không có bước cắm cờ cho mìn
  (khác nhánh thua, nơi `revealAllMines` chạy).
- **Ghi chú:** ghi ngày 2026-10-15; không sửa code game trong PR thêm bộ test.

## Đã sửa

_(chưa có)_
