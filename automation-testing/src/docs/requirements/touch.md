# TOUCH — Chơi bằng ngón tay

Truy vết phía app: FR-12 · FR-13 · FR-17 · US-04 · ADR-0004 · ADR-0009 · NFR-A11Y-06.

- **REQ-TOUCH-01** Trên màn cảm ứng, chạm nhanh vào ô là mở ô.
- **REQ-TOUCH-02** Màn cảm ứng có thanh chế độ Mở / Cờ (mặc định Mở); ở chế độ Cờ chạm là cắm cờ, còn chạm vào ô số đã mở vẫn chord.
- **REQ-TOUCH-03** Giữ ngón trên ô: sau khi ngón dừng (ENGAGE_MS) một khung nhắm hiện **phía trên** ngón; giữ tiếp tới FLAG_MS thì cắm cờ mà không cần nhấc, và cú nhấc sau đó không mở ô.
- **REQ-TOUCH-04** Khi đang nhắm, trượt ngón đổi ô mục tiêu; nhấc ngón trên ô nào thì ô đó nhận hành động; nhấc ngón ra ngoài bàn là huỷ (không mở, không cắm cờ).
- **REQ-TOUCH-05** Ngón kéo đi trước khi dừng lại là kéo bàn (pan): bàn trượt theo trong khung của nó và không ô nào mở.
- **REQ-TOUCH-06** Bàn rộng hơn màn hình cuộn trong khung riêng (cả hai chiều khi cần); trang không bao giờ cuộn ngang vì bàn; mỗi ô giữ cạnh ≥ 22px.
- **REQ-TOUCH-07** Thanh chế độ ở đáy không che hàng ô cuối.
- **REQ-TOUCH-08** Khi bàn không vừa chiều đang cầm nhưng sẽ vừa nếu xoay, trang gợi ý "Xoay ngang để thấy cả bàn."; không gợi ý khi bàn đã vừa hoặc khi xoay cũng không vừa.
- **REQ-TOUCH-09** Chạm hai lần nhanh lên bàn không phóng to trang, và kéo trong khung bàn không kéo theo trang (không pull-to-refresh).
