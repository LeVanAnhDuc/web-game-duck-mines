# DUCKERID — Đăng nhập Ducker ID tuỳ chọn (sau cờ tính năng)

Truy vết phía app: FR-19 · US-06 · ADR-0013 · invariant #10 · NFR-DATA-04 · NFR-A11Y-03.

- **REQ-DUCKERID-01** Cờ tắt hoặc thiếu biến (bản deploy): không nút đăng nhập, không menu tài khoản, không đọc URL (`?code=` để nguyên), không chạm `sessionStorage`, không request ra ngoài site.
- **REQ-DUCKERID-02** Cờ bật: bấm "Đăng nhập" đi qua Ducker ID và quay về đúng màn hình — tham số như `?seed=` còn nguyên, URL sạch (không `code` / `state` / `error`), nút tài khoản hiện; không lỗi hydration.
- **REQ-DUCKERID-03** Menu tài khoản hiện tên, email, liên kết "Mở hồ sơ Ducker ID" tới trang hồ sơ trên issuer, và "Đăng xuất"; Esc đóng menu và trả focus về nút tài khoản.
- **REQ-DUCKERID-04** Đăng xuất đưa nút "Đăng nhập" trở lại và đặt focus vào nó.
- **REQ-DUCKERID-05** Đăng nhập không đổi gì về cách chơi: đã đăng nhập vẫn mở ô, cắm cờ như thường.
- **REQ-DUCKERID-06** Hồ sơ chỉ nằm trong bộ nhớ: không ghi xuống `localStorage` / `sessionStorage`, khoá `ducker.pkce` bị xoá khi quay về, và tải lại trang là chưa đăng nhập.
- **REQ-DUCKERID-07** Từ chối ở Ducker ID, hoặc `state` bị sửa, thì về chưa đăng nhập, URL sạch, không báo lỗi; `state` sai thì không bao giờ gọi tới token endpoint.
- **REQ-DUCKERID-08** Issuer không trả lời thì sau tối đa 15 giây về lại chưa đăng nhập.
- **REQ-DUCKERID-09** `sessionStorage` bị chặn thì bấm "Đăng nhập" không đưa đi đâu cả (không kẹt ở callback), nút vẫn dùng được.
- **REQ-DUCKERID-10** Nút đăng nhập nằm trước nút sáng/tối, vùng bấm ≥ 44px, không đè nút bên cạnh; header chưa đăng nhập vừa 320px không cuộn ngang; menu tài khoản luôn nằm trọn trong màn hình và mở ra không làm header nhảy.
