# BÀI THUYẾT TRÌNH BẢO VỆ ĐỒ ÁN TỐT NGHIỆP

## ĐỀ TÀI: HỆ THỐNG TUYỂN DỤNG THÔNG MINH (SMART RECRUITMENT PLATFORM)

> **Tổng thời gian đọc ước tính: 5–7 phút**  
> Các câu quan trọng được đánh dấu **[NHẤN MẠNH]**

---

## [PHẦN 1 — MỞ ĐẦU] (~1 phút)

Kính thưa quý thầy cô trong Hội đồng,

Em xin phép được bắt đầu phần bảo vệ đồ án tốt nghiệp của mình.

Đề tài mà em thực hiện có tên là: **"Hệ thống Tuyển dụng Thông minh" — hay còn gọi là Smart Recruitment Platform.**

---

Thưa quý thầy cô, hiện nay thị trường lao động Việt Nam đang phát triển với tốc độ rất nhanh.
Mỗi năm có hàng triệu lượt tìm kiếm việc làm và hàng trăm nghìn tin tuyển dụng được đăng tải trên nhiều nền tảng khác nhau.

Thế nhưng, hầu hết các quy trình tuyển dụng hiện tại vẫn còn rất thủ công.
Nhà tuyển dụng phải xử lý hàng trăm hồ sơ bằng tay, không có công cụ quản lý tập trung.
Còn ứng viên thì khó theo dõi được trạng thái đơn ứng tuyển của mình sau khi đã nộp.

**[NHẤN MẠNH] Câu hỏi đặt ra là: Làm thế nào để tự động hóa quy trình tuyển dụng, giúp cả nhà tuyển dụng lẫn ứng viên tiết kiệm thời gian và làm việc hiệu quả hơn?**

Đó chính là lý do nhóm em chọn xây dựng hệ thống này.

---

## [PHẦN 2 — GIẢI PHÁP & TÍNH NĂNG CHÍNH] (~2–3 phút)

Hệ thống Smart Recruitment Platform mà nhóm em xây dựng là một ứng dụng web đầy đủ, phục vụ ba nhóm người dùng chính: **Ứng viên, Nhà tuyển dụng và Quản trị viên.**

Mỗi nhóm có giao diện và quyền hạn riêng biệt. Em xin trình bày năm tính năng cốt lõi của hệ thống.

---

**Tính năng thứ nhất — Tìm kiếm việc làm thông minh với bộ lọc đa tiêu chí.**

Ứng viên có thể tìm kiếm theo nhiều tiêu chí cùng lúc: địa điểm, loại công việc, cấp độ kinh nghiệm, lĩnh vực ngành nghề, và kỹ năng yêu cầu.
Hệ thống thực hiện tìm kiếm đồng thời trên tiêu đề, mô tả và kỹ năng của tin tuyển dụng.

**[NHẤN MẠNH] Điểm khác biệt so với cách làm truyền thống là ứng viên không cần duyệt qua hàng trăm tin — hệ thống tự lọc và sắp xếp kết quả phù hợp nhất lên đầu.**

---

**Tính năng thứ hai — Quản lý hồ sơ CV theo dạng đa file.**

Ứng viên có thể tải lên nhiều bộ CV khác nhau, định dạng PDF hoặc DOCX, dung lượng tối đa 5MB mỗi file.
Hệ thống cho phép đánh dấu một CV làm hồ sơ chính để tự động đính kèm khi ứng tuyển.

Điều đặc biệt là Admin có thể duyệt hoặc từ chối hồ sơ, đảm bảo chất lượng nội dung trên toàn hệ thống.

---

**Tính năng thứ ba — Quy trình theo dõi đơn ứng tuyển tự động hóa (ATS).**

Đây là tính năng mà nhóm em tâm huyết nhất.

Khi ứng viên nộp đơn, trạng thái sẽ đi theo một luồng chuẩn:
*Đã nộp → Đang xem xét → Sơ tuyển → Đang phỏng vấn → Nhận offer hoặc Từ chối.*

**[NHẤN MẠNH] Ứng viên không còn phải đợi email hay điện thoại — họ đăng nhập vào hệ thống là biết ngay mình đang ở bước nào trong quy trình tuyển dụng.**

Nhà tuyển dụng cũng có thể ghi chú nội bộ cho từng ứng viên mà không để lộ thông tin ra ngoài.

---

**Tính năng thứ tư — Dashboard thống kê cho Quản trị viên.**

Hệ thống cung cấp một bảng điều khiển tổng quan với đầy đủ số liệu thực tế: tổng số người dùng theo vai trò, tổng số tin tuyển dụng đang hoạt động, số hồ sơ đang chờ duyệt, và số đơn ứng tuyển theo từng trạng thái.

Nhóm em thiết kế để tất cả các con số này được tính toán song song, nhờ đó trang dashboard mở ra rất nhanh, không bị chậm dù dữ liệu lớn.

---

**Tính năng thứ năm — Hệ thống xác thực và phân quyền bảo mật.**

Toàn bộ hệ thống sử dụng JWT — JSON Web Token — để xác thực người dùng.
Mật khẩu được mã hóa bằng thuật toán bcrypt với 10 vòng salt, đảm bảo an toàn tuyệt đối, không lưu plaintext bất kỳ đâu.

**[NHẤN MẠNH] Mỗi vai trò chỉ được truy cập đúng phần của mình — ứng viên không thể vào trang quản trị, nhà tuyển dụng không thể sửa hồ sơ của ứng viên khác.**

---

**Về công nghệ, nhóm em đã lựa chọn stack hiện đại và phổ biến nhất hiện nay:**

- **Frontend:** React 19 với TypeScript và Material-UI — giao diện đẹp, responsive, type-safe
- **Backend:** Node.js với Express.js — nhẹ, nhanh, phù hợp cho RESTful API
- **Cơ sở dữ liệu:** MySQL 8.0 với Sequelize ORM — quản lý quan hệ dữ liệu chặt chẽ
- **API Documentation:** Swagger/OpenAPI — toàn bộ API đều có tài liệu tự động, dễ kiểm thử
- **Kiểm thử:** Jest cho backend, Vitest cho frontend — đảm bảo chất lượng code

---

## [PHẦN 3 — KẾT QUẢ & DEMO] (~1–2 phút)

Về kết quả đạt được, nhóm em xin báo cáo một số con số cụ thể.

**[NHẤN MẠNH] Hệ thống hoàn chỉnh với hơn 25.000 dòng code,** bao gồm cả frontend và backend, được tổ chức theo đúng kiến trúc phân lớp: Controller – Service – Model.

Cơ sở dữ liệu gồm **4 bảng chính** với quan hệ chặt chẽ: Users, Jobs, Resumes, Applications.
Trong đó, bảng Applications có ràng buộc unique trên cặp (job_id, user_id) để hoàn toàn ngăn chặn việc một ứng viên nộp đơn trùng lặp vào cùng một vị trí.

Hệ thống có **tổng cộng hơn 30 API endpoints** đầy đủ chức năng, toàn bộ đều được tài liệu hóa tự động qua Swagger tại địa chỉ `/api/docs`.

Về kiểm thử, nhóm em đã viết **hơn 30 test cases** bao gồm unit test và integration test, kiểm tra toàn bộ các luồng nghiệp vụ quan trọng: đăng ký, đăng nhập, đăng tin, ứng tuyển, và quản lý trạng thái.

**[NHẤN MẠNH] Một điểm tối ưu đáng chú ý: trang Admin Dashboard sử dụng `Promise.all()` để truy vấn 8 số liệu thống kê song song thay vì tuần tự, giúp thời gian tải trang giảm đáng kể.**

Hệ thống còn hỗ trợ **phân trang linh hoạt** — mặc định 10 kết quả mỗi trang, tối đa 50 — kết hợp với connection pooling của Sequelize để đảm bảo hiệu năng ổn định ngay cả khi lượng dữ liệu tăng cao.

---

## [PHẦN 4 — KẾT LUẬN] (~30 giây)

Thưa quý thầy cô,

Nhóm em đã hoàn thành việc xây dựng một hệ thống tuyển dụng web đầy đủ, từ thiết kế kiến trúc, lập trình frontend và backend, thiết kế cơ sở dữ liệu, đến kiểm thử và tài liệu hóa.

**[NHẤN MẠNH] Đóng góp chính của nhóm em là xây dựng được một nền tảng tuyển dụng hoàn chỉnh, bảo mật, và có thể triển khai thực tế — giải quyết trực tiếp bài toán quản lý tuyển dụng còn rời rạc, thủ công trong nhiều doanh nghiệp hiện nay.**

Về hướng phát triển tiếp theo, nhóm em dự kiến tích hợp tính năng gợi ý việc làm dựa trên AI — phân tích nội dung CV của ứng viên để tự động đề xuất các vị trí phù hợp nhất.
Ngoài ra, nhóm cũng muốn phát triển thêm ứng dụng di động để tăng khả năng tiếp cận người dùng.

**[NHẤN MẠNH] Chúng em tin rằng Smart Recruitment Platform không chỉ là một bài tập lập trình — đây là một sản phẩm thực sự có thể được triển khai và tạo ra giá trị cho thị trường tuyển dụng Việt Nam.**

Em xin trân trọng cảm ơn quý thầy cô đã lắng nghe. Nhóm em rất mong nhận được câu hỏi và nhận xét từ Hội đồng để hoàn thiện thêm đề tài này.

---

> **Ghi chú luyện tập:**
> - Phần 1 (Mở đầu): ~60 giây
> - Phần 2 (Giải pháp & Tính năng): ~150 giây
> - Phần 3 (Kết quả): ~90 giây
> - Phần 4 (Kết luận): ~30 giây
> - **Tổng cộng: ~5–6 phút**
>
> Các câu **[NHẤN MẠNH]** nên đọc chậm hơn, to hơn một chút và dừng lại 1–2 giây trước và sau câu đó.
