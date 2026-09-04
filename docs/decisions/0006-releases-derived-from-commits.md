# ADR-0006 · Tự suy version và release note từ Conventional Commits, không dùng semantic-release

> **Ngày:** 2026-09-04
> **Trạng thái:** accepted
> **Liên quan:** FR-15 · NFR-SEC-05 · NFR-PERF-07

## 1. Bối cảnh

Repo đã có remote và bốn PR đã merge, nhưng chưa có CI, chưa có release, chưa có
deploy. Dự án cùng workspace `web-app-calculate-badminton` đã có sẵn hai workflow
(`deploy.yml` + `release.yml`) và là tiền lệ hợp lý để kế thừa.

Ràng buộc: **mọi commit trong dự án này đều là Conventional Commits** (quy ước từ
`.claude/CLAUDE.md`), nhưng **PR không gắn label nào**. Và trần chi phí 0₫ nghĩa là
không có gì chạy ngoài GitHub Actions.

## 2. Quyết định

Ba workflow: `ci.yml` (lint · typecheck · unit · audit ‖ build · bundle budget ·
e2e), `deploy.yml` (Pages), `release.yml` (tag + release note).

Version và note **tự suy từ lịch sử commit**, bằng hai script **nằm trong repo** chứ
không nhúng trong YAML:

- `scripts/next-version.sh` — `[skip release]` / `[release major|minor]` ở **subject**
  của HEAD, nếu không thì suy từ prefix commit kể từ tag trước: `!:` hoặc
  `BREAKING CHANGE` → major, `feat:` → minor, còn lại → patch.
- `scripts/release-notes.sh` — gom subject theo prefix thành mục
  (Breaking / What's new / Fixes / …), giữ scope làm nhãn đậm, kèm hash và link
  compare.

Lý do để script ra ngoài YAML: **chạy thử được ở máy** (`scripts/next-version.sh
--explain`). Một cơ chế release chỉ kiểm được bằng cách push lên `main` là cơ chế
không ai kiểm.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| `gh release create --generate-notes` (cách của badminton) | GitHub gom note theo **label của PR**. Repo này không gắn label, nên kết quả là một danh sách phẳng. Thứ repo này **có** là Conventional Commits ở mọi commit — gom theo đó cho ra đúng thông tin, và là thông tin thật sự tồn tại |
| `semantic-release` | Kéo theo ~15 package, một file cấu hình plugin, và một mô hình mà muốn hiểu chuyện gì xảy ra thì phải đọc tài liệu plugin. Toàn bộ thứ ta cần ở đây là 60 dòng shell đọc được trong một lượt |
| `release-please` | Tạo một PR bot sống lâu, phải merge mới ra release. Thêm một bước người phải nhớ, đổi lại một `CHANGELOG.md` mà `docs/` đã bao phủ tốt hơn |
| Tag tay | Sẽ quên. Và version lúc đó phản ánh trí nhớ chứ không phản ánh lịch sử |
| Nhúng shell thẳng vào `release.yml` (cách của badminton) | Không chạy thử được ở máy. Bản đầu của `release-notes.sh` chết ngay dòng đầu vì `set -e` gặp `grep` rỗng — lỗi đó chỉ lộ ra vì script chạy được ở laptop |

## 4. Hệ quả

**Được:**

- Version và note là **hàm của lịch sử git**, không phụ thuộc ai nhớ gắn nhãn.
- Cả hai script chạy được ở máy, nên sửa được mà không cần đẩy commit rác lên `main`.
- Note giữ **scope** của commit (`**core-game**: …`), đọc lướt biết ngay đụng vào đâu.
- Commit không đúng Conventional Commits vẫn được liệt vào mục "Other" chứ **không bị
  nuốt** — release note nuốt commit là release note bắt đầu nói dối.
- CI **thi hành** hai ngưỡng vốn chỉ được ghi: `NFR-SEC-05` (audit) và `NFR-PERF-07`
  (ngân sách JS), mỗi cái một script đo đúng thứ nó nói.

**Mất / phải chấp nhận:**

- Chất lượng note **phụ thuộc chất lượng subject commit**. Subject cẩu thả → note cẩu
  thả, và không có bước người duyệt nào chặn giữa.
- Mỗi lần merge vào `main` đều ra một release. Với dự án một người thì đúng; với nhịp
  merge dày thì sẽ ồn, và lúc đó phải chuyển sang release theo mốc.
- Hai script là **shell**, và shell thì không có test. Chúng được kiểm bằng cách chạy
  tay trên lịch sử thật, không phải bằng CI.
- `deploy.yml` chạy lại `yarn test` thay vì tin `ci.yml` — chậm hơn khoảng một phút,
  đổi lấy việc deploy không bao giờ dựa trên một kết quả xanh mà nó không tự thấy.

**Điều kiện xem lại quyết định này:** có người thứ hai vào dự án và nhịp merge làm
release trở nên ồn · hoặc cần một `CHANGELOG.md` trong repo chứ không chỉ trang
Releases · hoặc hai script shell dài quá mức đọc một lượt được.
