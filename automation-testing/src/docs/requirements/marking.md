# MARKING — Cắm cờ, dấu hỏi, chord

Truy vết phía app: FR-03 · FR-04 · FR-06 · US-02 · ADR-0012.

- **REQ-MARKING-01** Chuột phải lên ô chưa mở cắm cờ: ô thành "đã cắm cờ", bộ đếm giảm 1, và menu chuột phải của trình duyệt không mở.
- **REQ-MARKING-02** Khi dấu hỏi tắt (mặc định), chu kỳ là chưa mở → cờ → chưa mở. Khi dấu hỏi bật, chu kỳ là chưa mở → cờ → dấu hỏi → chưa mở; dấu hỏi không tính vào bộ đếm mìn.
- **REQ-MARKING-03** Ô đã cắm cờ được bảo vệ: bấm chuột trái lên nó không mở ô (và không bắt đầu ván). Ô mang dấu hỏi không được bảo vệ: bấm vào thì mở.
- **REQ-MARKING-04** Không cắm cờ được lên ô đã mở.
- **REQ-MARKING-05** Tắt dấu hỏi giữa ván không làm ô nào rơi vào trạng thái không tồn tại: ô đang mang dấu hỏi giữ nguyên tới khi người chơi chạm vào, rồi về chu kỳ hai trạng thái.
- **REQ-MARKING-06** Cắm nhiều cờ hơn số mìn thì bộ đếm xuống âm (`−001`, dấu trừ U+2212), không chặn ở 0.
- **REQ-MARKING-07** Chord: bấm chuột trái (hoặc chuột giữa) lên ô số đã mở có số cờ kề đúng bằng con số mở mọi ô kề chưa cắm cờ; các ô đang cắm cờ giữ nguyên cờ.
- **REQ-MARKING-08** Chord khi số cờ kề ít hơn con số không làm gì: không mở ô nào, không nổ.
- **REQ-MARKING-09** Chord khi đủ số cờ nhưng cắm sai chỗ thì nổ: ván thua, ô mìn bị mở là "mìn đã nổ", cờ sai thành "cờ cắm sai".
