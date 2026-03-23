# BÀI THUYẾT TRÌNH BẢO VỆ ĐỒ ÁN TỐT NGHIỆP

## ĐỀ TÀI: HỆ THỐNG TUYỂN DỤNG THÔNG MINH (SMART RECRUITMENT PLATFORM)

> **Tổng thời gian đọc ước tính: 6–7 phút**  
> Các câu quan trọng được đánh dấu **[NHẤN MẠNH]**

---

## [PHẦN 1 — MỞ ĐẦU] (~1 phút)

Kính thưa quý thầy cô trong Hội đồng,

Em xin phép được bắt đầu phần bảo vệ đồ án tốt nghiệp của mình.

Đề tài mà nhóm em thực hiện có tên là: **"Hệ thống Tuyển dụng Thông minh" — hay còn gọi là Smart Recruitment Platform.**
Đây là một ứng dụng web cho phép ứng viên tìm việc, nhà tuyển dụng đăng tin, và quản trị viên điều hành toàn bộ nền tảng — tất cả trên một hệ thống duy nhất, tập trung và tự động hóa.

---

Thưa quý thầy cô, hiện nay thị trường lao động Việt Nam đang phát triển với tốc độ rất nhanh.
Mỗi năm có hàng triệu lượt tìm kiếm việc làm và hàng trăm nghìn tin tuyển dụng được đăng tải trên nhiều nền tảng khác nhau.

Thế nhưng, hầu hết các quy trình tuyển dụng hiện tại vẫn còn rất thủ công.
Nhà tuyển dụng nhận hồ sơ qua email, lưu trên máy tính cá nhân, không có công cụ quản lý tập trung.
Còn ứng viên thì không biết đơn của mình đang ở đâu trong quy trình — phải chờ điện thoại hoặc email mà đôi khi không bao giờ đến.

**[NHẤN MẠNH] Câu hỏi đặt ra là: Làm thế nào để tự động hóa quy trình tuyển dụng, giúp cả hai phía tiết kiệm thời gian và minh bạch hơn trong từng bước?**

Đó chính là lý do nhóm em xây dựng hệ thống này.

---

## [PHẦN 2 — KIẾN TRÚC HỆ THỐNG & TÍNH NĂNG CHÍNH] (~3 phút)

### 2.1 — Kiến trúc tổng quan: hệ thống hoạt động như thế nào?

Trước khi đi vào tính năng, em xin trình bày ngắn gọn cách hệ thống được xây dựng để quý thầy cô có bức tranh tổng thể.

Hệ thống theo mô hình **Client – Server**, nghĩa là có hai phần tách biệt hoàn toàn:

**Phần giao diện người dùng** — hay còn gọi là Frontend — là những trang web mà người dùng nhìn thấy và thao tác trực tiếp trên trình duyệt.
Nhóm em xây dựng phần này bằng **React** — một thư viện JavaScript rất phổ biến hiện nay, do Facebook phát triển.
React hoạt động theo cơ chế "ứng dụng một trang" — Single Page Application — nghĩa là chỉ tải trang một lần duy nhất khi người dùng mở ứng dụng.
Sau đó, khi chuyển giữa các màn hình, nội dung được cập nhật động ngay trên trình duyệt mà không cần tải lại toàn bộ trang — giúp trải nghiệm mượt mà, nhanh hơn nhiều so với web truyền thống.
Để giao diện đẹp và đồng nhất, nhóm em dùng thêm **Material-UI** — một bộ thư viện thiết kế sẵn các thành phần như nút bấm, bảng dữ liệu, hộp thoại — theo chuẩn Material Design của Google.
Toàn bộ code giao diện được viết bằng **TypeScript** — phiên bản nâng cấp của JavaScript — có tính năng kiểm tra kiểu dữ liệu ngay khi lập trình, giúp phát hiện lỗi sớm trước khi chạy chương trình.

**Phần máy chủ xử lý** — hay Backend — là bộ não của hệ thống, chạy trên máy chủ, nhận yêu cầu từ giao diện, xử lý logic nghiệp vụ và trả về kết quả.
Nhóm em dùng **Node.js** — môi trường chạy JavaScript phía máy chủ — kết hợp với **Express.js** là một framework, tức là một bộ khung lập trình có sẵn, giúp xây dựng các đường dẫn API nhanh chóng và gọn nhẹ mà không phải viết lại từ đầu.
**[NHẤN MẠNH] Lý do chọn Node.js là vì nó xử lý đồng thời nhiều yêu cầu mà không bị chặn — rất phù hợp cho ứng dụng có nhiều người dùng truy cập cùng lúc như hệ thống tuyển dụng.**

Giao diện và máy chủ giao tiếp với nhau qua **REST API** — đây là một chuẩn giao tiếp phổ biến trên Internet, hoạt động theo mô hình yêu cầu và phản hồi: giao diện gửi một yêu cầu lên máy chủ, máy chủ xử lý rồi gửi lại kết quả dạng JSON — định dạng dữ liệu văn bản nhẹ và dễ đọc.

**Cơ sở dữ liệu** được xây dựng trên **MySQL** — hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở, rất ổn định và phổ biến trong doanh nghiệp.
Để làm việc với MySQL dễ hơn trong code, nhóm em dùng **Sequelize** — một thư viện ORM, viết tắt của Object-Relational Mapping.
ORM hoạt động như một lớp trung gian: thay vì viết câu lệnh **SQL** — ngôn ngữ truy vấn dữ liệu truyền thống dùng để đọc, ghi, tìm kiếm trong cơ sở dữ liệu — thủ công, lập trình viên làm việc với các đối tượng trong code, và Sequelize tự động chuyển thành câu SQL tương ứng — vừa giảm lỗi, vừa dễ bảo trì.

---

### 2.2 — Năm tính năng cốt lõi

**Tính năng thứ nhất — Tìm kiếm việc làm thông minh với bộ lọc đa tiêu chí.**

Luồng hoạt động như sau: ứng viên nhập từ khóa hoặc chọn các bộ lọc — địa điểm, loại công việc như toàn thời gian hay bán thời gian, cấp độ kinh nghiệm, lĩnh vực ngành và kỹ năng yêu cầu.
Máy chủ nhận các tiêu chí đó và thực hiện truy vấn đồng thời trên tiêu đề, mô tả và kỹ năng của từng tin tuyển dụng trong cơ sở dữ liệu.
Kết quả trả về được sắp xếp theo thứ tự mới nhất, và hiển thị từng trang để tránh tải quá nhiều dữ liệu một lúc.

**[NHẤN MẠNH] Lợi ích: ứng viên không cần duyệt qua hàng trăm tin — hệ thống tự khoanh vùng những vị trí phù hợp với tiêu chí của họ.**

---

**Tính năng thứ hai — Quản lý hồ sơ CV theo dạng đa file.**

Luồng hoạt động: ứng viên tải CV lên hệ thống dưới dạng file PDF hoặc DOCX, tối đa 5MB mỗi file.
Hệ thống kiểm tra định dạng và dung lượng ngay tại máy chủ trước khi lưu, để đảm bảo chỉ nhận đúng loại file cho phép.
Ứng viên có thể lưu nhiều CV cho các ngành nghề khác nhau và đánh dấu một CV làm hồ sơ chính — CV này sẽ tự động được đính kèm mỗi khi ứng tuyển mà không cần chọn lại.
Quản trị viên có thể duyệt hoặc từ chối hồ sơ nhằm kiểm soát chất lượng nội dung trên toàn nền tảng.

**[NHẤN MẠNH] Lợi ích: ứng viên không còn phải đính kèm file thủ công mỗi lần nộp đơn — hệ thống làm điều đó tự động.**

---

**Tính năng thứ ba — Hệ thống theo dõi đơn ứng tuyển theo luồng trạng thái.**

Đây là tính năng mà nhóm em tâm huyết nhất — thường được gọi là ATS, viết tắt của Applicant Tracking System, tức là hệ thống theo dõi ứng viên.

Luồng hoạt động rất rõ ràng: khi ứng viên bấm nộp đơn, hệ thống tạo một bản ghi ứng tuyển và gán trạng thái ban đầu là "Đã nộp".
Nhà tuyển dụng đăng nhập, xem danh sách đơn, và có thể cập nhật trạng thái lần lượt qua các bước:
**Đã nộp → Đang xem xét → Sơ tuyển → Đang phỏng vấn → Nhận offer** hoặc **Từ chối.**
Mỗi lần trạng thái thay đổi, dữ liệu được lưu ngay vào cơ sở dữ liệu cùng với thời điểm cập nhật.
Nhà tuyển dụng cũng có thể ghi chú nội bộ cho từng ứng viên — ghi chú này chỉ người trong nhóm tuyển dụng mới thấy, ứng viên không thấy được.

**[NHẤN MẠNH] Lợi ích: ứng viên đăng nhập vào tài khoản là biết ngay mình đang ở bước nào — không còn cảnh nộp hồ sơ rồi "bặt vô âm tín" nữa.**

---

**Tính năng thứ tư — Dashboard thống kê tổng quan cho Quản trị viên.**

Quản trị viên có một bảng điều khiển hiển thị toàn bộ trạng thái của hệ thống trong thời gian thực: tổng số người dùng phân theo vai trò, số tin tuyển dụng đang mở, số hồ sơ chờ duyệt, và số đơn ứng tuyển theo từng trạng thái.

Về mặt kỹ thuật, để hiển thị 8 con số thống kê này, nhóm em sử dụng cơ chế **xử lý song song** — tức là máy chủ gửi 8 truy vấn đến cơ sở dữ liệu cùng một lúc thay vì chờ từng cái xong mới làm cái tiếp theo.
Cách làm truyền thống nếu mỗi truy vấn mất 100 miligiây thì 8 truy vấn tuần tự sẽ mất 800 miligiây.
**[NHẤN MẠNH] Với xử lý song song, tổng thời gian chỉ bằng thời gian của truy vấn lâu nhất — tức là vẫn chỉ khoảng 100 miligiây — trang dashboard tải nhanh hơn gần 8 lần.**

---

**Tính năng thứ năm — Hệ thống xác thực và phân quyền bảo mật.**

Luồng xác thực hoạt động như sau: khi người dùng đăng nhập thành công, máy chủ tạo ra một **JWT — JSON Web Token** — đây là một chuỗi ký tự mã hóa đóng vai trò như "thẻ thông hành kỹ thuật số", chứa thông tin về người dùng và hết hạn sau 7 ngày.
Mỗi lần giao diện gửi yêu cầu lên máy chủ, thẻ này được đính kèm tự động vào phần thông tin điều khiển của yêu cầu — tương tự như ghi tên trên phong bì trước khi gửi thư — để máy chủ biết yêu cầu đến từ ai.
Máy chủ kiểm tra chữ ký của thẻ để xác nhận đây là token hợp lệ do hệ thống cấp — không phải do ai giả mạo.

Về mật khẩu, nhóm em dùng thuật toán **bcrypt** để mã hóa một chiều — nghĩa là mật khẩu được băm thành một chuỗi ngẫu nhiên trước khi lưu vào cơ sở dữ liệu, và không thể giải mã ngược lại.
Khi đăng nhập, hệ thống băm mật khẩu người dùng nhập vào rồi so sánh với chuỗi đã lưu — không bao giờ lưu mật khẩu gốc ở bất kỳ đâu.

Về phân quyền, hệ thống chia ba vai trò độc lập: Ứng viên, Nhà tuyển dụng và Quản trị viên.
Mỗi **API endpoint** — tức là mỗi "cửa" chức năng mà giao diện gọi đến, ví dụ cửa đăng nhập, cửa tìm việc, cửa nộp đơn — đều có lớp kiểm tra vai trò trước khi xử lý yêu cầu.
**[NHẤN MẠNH] Kết quả: ứng viên không thể truy cập trang quản trị, nhà tuyển dụng không thể xem hoặc sửa hồ sơ của ứng viên khác — quyền hạn được kiểm soát chặt chẽ ở từng thao tác.**

---

## [PHẦN 3 — KẾT QUẢ ĐẠT ĐƯỢC] (~1–2 phút)

Thưa quý thầy cô, về kết quả cụ thể, nhóm em xin báo cáo như sau.

**[NHẤN MẠNH] Hệ thống hoàn chỉnh với hơn 25.000 dòng code,** được tổ chức theo kiến trúc ba lớp: **Controller – Service – Model.**
Lớp Controller là cổng vào, tiếp nhận yêu cầu từ giao diện và trả kết quả về.
Lớp Service chứa toàn bộ logic nghiệp vụ — kiểm tra điều kiện, tính toán, phối hợp các thành phần.
Lớp Model là nơi định nghĩa cấu trúc dữ liệu và thực hiện truy vấn cơ sở dữ liệu.
Cách phân lớp này giúp code dễ bảo trì, dễ mở rộng, và dễ kiểm thử từng phần độc lập.

Cơ sở dữ liệu gồm **4 bảng chính**: Users lưu thông tin người dùng, Jobs lưu tin tuyển dụng, Resumes lưu hồ sơ CV, và Applications lưu đơn ứng tuyển.
Bảng Applications có ràng buộc duy nhất trên cặp mã công việc và mã ứng viên — ràng buộc này được đặt ở tầng cơ sở dữ liệu, đảm bảo một ứng viên không thể nộp trùng vào cùng một vị trí dù thử bằng bất kỳ cách nào.

Hệ thống có **hơn 30 API endpoints** phục vụ đầy đủ các chức năng.
Toàn bộ các endpoint này được tài liệu hóa tự động qua **Swagger** — một công cụ tạo tài liệu API tương tác ngay trên trình duyệt.
Swagger giống như một cuốn hướng dẫn sử dụng tự cập nhật: khi lập trình viên viết thêm API mới, tài liệu cũng được cập nhật theo ngay lập tức, giúp quá trình kiểm thử và tích hợp nhanh hơn nhiều.

Về kiểm thử, nhóm em viết **hơn 30 test case** theo hai cấp độ.
**Unit test** kiểm tra từng hàm nhỏ lẻ — ví dụ hàm mã hóa mật khẩu có cho kết quả đúng không, hàm tạo token có hoạt động chính xác không.
**Integration test** kiểm tra toàn bộ luồng từ đầu đến cuối — ví dụ gọi API đăng ký, rồi đăng nhập, rồi đăng tin, rồi ứng tuyển — đảm bảo các thành phần khi ghép lại với nhau vẫn hoạt động đúng.

**[NHẤN MẠNH] Hệ thống còn hỗ trợ phân trang:** khi có hàng nghìn tin tuyển dụng, mỗi lần tải chỉ lấy 10 kết quả một lần thay vì tải tất cả cùng một lúc — giúp tốc độ phản hồi ổn định dù dữ liệu tăng lên bao nhiêu.
Kết hợp với **connection pooling** — cơ chế tái sử dụng các kết nối cơ sở dữ liệu thay vì mở kết nối mới cho từng yêu cầu — hệ thống xử lý được nhiều người dùng truy cập đồng thời mà không bị quá tải.

---

## [PHẦN 4 — KẾT LUẬN] (~45 giây)

Thưa quý thầy cô,

Nhóm em đã hoàn thành việc xây dựng một hệ thống tuyển dụng web đầy đủ — từ thiết kế kiến trúc, lập trình giao diện và máy chủ, thiết kế cơ sở dữ liệu, đến kiểm thử và tài liệu hóa toàn bộ API.

**[NHẤN MẠNH] Đóng góp chính của nhóm em là xây dựng được một nền tảng tuyển dụng hoàn chỉnh, bảo mật, và có thể triển khai thực tế — giải quyết trực tiếp bài toán quy trình tuyển dụng còn rời rạc, thủ công trong nhiều doanh nghiệp hiện nay.**

Về hướng phát triển tiếp theo, nhóm em dự kiến tích hợp tính năng gợi ý việc làm dựa trên AI — tức là hệ thống sẽ phân tích nội dung CV của ứng viên và tự động đề xuất những vị trí phù hợp nhất, thay vì để ứng viên phải tự tìm kiếm.
Ngoài ra, nhóm muốn phát triển thêm ứng dụng di động để người dùng có thể tìm việc và theo dõi đơn ứng tuyển mọi lúc mọi nơi.

**[NHẤN MẠNH] Chúng em tin rằng Smart Recruitment Platform không chỉ là một bài tập lập trình — đây là một sản phẩm thực sự có thể được triển khai và tạo ra giá trị thiết thực cho thị trường tuyển dụng Việt Nam.**

Em xin trân trọng cảm ơn quý thầy cô đã lắng nghe. Nhóm em rất mong nhận được câu hỏi và nhận xét từ Hội đồng.

---

> **Ghi chú luyện tập:**
> - Phần 1 (Mở đầu): ~60 giây
> - Phần 2 (Kiến trúc & Tính năng): ~180 giây
> - Phần 3 (Kết quả): ~100 giây
> - Phần 4 (Kết luận): ~45 giây
> - **Tổng cộng: ~6–7 phút**
>
> Các câu **[NHẤN MẠNH]** nên đọc chậm hơn, rõ hơn, và dừng lại 1–2 giây trước và sau câu đó để tạo điểm nhấn.
