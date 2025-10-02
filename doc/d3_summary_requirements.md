Sau khi làm xong lưu mã code public lên github + deploy code
Gửi mail xác nhận đã làm xong về d3hiring@gmail.com

source code include Readme.md file:

- link deploy code
- hướng dẫn chạy code local
- tech stack: node js + mysql
- thêm cả unit test cho tôi

online interivew:

- giải thích mã code
- giải thích quyết định thiết kế
- sửa lại end point api hoặc làm thêm các endpoint khác

đánh giá code:

- khả năng đọc mà tính sạch của mã
- mã hóa code
- cấu trúc code/ design ( module, khả năng kiểm thử)

api sẽ được auto test
postman collection + swagger đã có sẵn

hệ thống quản lý học sinh bao gồm:
users (Giáo viên + học sinh khác nhau ở type) xác định bằng unique email

Phần authen(login + register + forgot pass) coi như đã được xử lý

APIS:

1.  1 giáo viên được đăng ký cho nhiều học sinh, một học sinh được đăng ký cho nhiều giáo viên

Phần này có cần phân quyền hay không? admin mới được cập nhật
Chỉ có giáo viên mới được đăng ký cho học sinh
Lưu log đăng ký bởi ai, đăng ký của học sinh nào cho giáo viên nào

```curl
Điểm cuối: POST /api/register
Tiêu đề: Content-Type: application/json
Trạng thái phản hồi thành công: HTTP 204
Ví dụ về nội dung yêu cầu:
{
    "teacher": "teacherken@gmail.com"
    "students":
    [
    "studentjon@gmail.com",
    "studenthon@gmail.com"
    ]
}
```

2. Lấy tất cả danh sách học sinh chung với một danh sách giáo viên nhất định
   (tức là lấy danh sách học sinh đã đăng ký với tất cả giáo viên đã cho)

```curl
Endpoint: GET /api/commonstudents
Success response status: HTTP 200
Request example 1: GET /api/commonstudents?teacher=teacherken%40gmail.com
Success response body 1:
{
  "students" :
    [
        "commonstudent1@gmail.com", // danh sách học sinh chung
        "commonstudent2@gmail.com",
        "student_only_under_teacher_ken@gmail.com" // danh sách học sinh riêng đã đăng ký
    ]
}
```

Ví dụ yêu cầu 2:

```curl
GET /api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com
Success response body 1:
{
    "students" :
        [
            "commonstudent1@gmail.com",
            "commonstudent2@gmail.com"
        ]
}
```

3. là một giáo viên tôi muốn đình chỉ một học sinh cụ thể

```curl
Endpoint: POST /api/suspend
Headers: Content-Type: application/json
Success response status: HTTP 204
Request body example:
{
  "student" : "studentmary@gmail.com"
}
```

4. Là một giáo viên, tôi muốn lấy danh sách học sinh có thể nhận được thông báo nhất định.

Một thông báo bao gồm:

giáo viên gửi thông báo và
nội dung của thông báo.

Để nhận thông báo từ ví dụ: 'teacherken@gmail.com', học sinh:

KHÔNG ĐƯỢC bị đình chỉ,
VÀ PHẢI đáp ứng ÍT NHẤT MỘT trong các điều kiện sau:

đã đăng ký với "teacherken@gmail.com"

đã được @đề cập trong thông báo
Danh sách học sinh được lấy không được chứa bất kỳ thông tin trùng lặp/lặp lại nào.

```curl
Endpoint: POST /api/retrievefornotifications
Headers: Content-Type: application/json
Success response status: HTTP 200
Request body example 1:
{
  "teacher":  "teacherken@gmail.com",
  "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
}
Success response body 1:
{
  "recipients":
    [
      "studentbob@gmail.com",
      "studentagnes@gmail.com",
      "studentmiche@gmail.com"
    ]
}
```

Trong ví dụ trên, studentagnes@gmail.com và studentmiche@gmail.com có
thể nhận thông báo từ teacherken@gmail.com,
bất kể họ có đăng ký với teacherken@gmail.com hay không,
vì họ được @đề cập trong văn bản thông báo. Tuy nhiên,
studentbob@gmail.com phải được đăng ký với teacherken@gmail.com.

```curl
Request body example 2:
{
  "teacher":  "teacherken@gmail.com",
  "notification": "Hey everybody"
}
Success response body 2:
{
  "recipients":
    [
      "studentbob@gmail.com"
    ]
}
```

có mã phản hồi HTTP phù hợp
có nội dung phản hồi JSON chứa thông báo lỗi có ý nghĩa:

```curl
{ "message": "Một số thông báo lỗi có ý nghĩa" }
```

======================================================

đang có các bảng dữ liệu như sau:

User (bao gồm giáo viên và học sinh có bị đình chỉ hay không => đình chỉ là xóa mềm)

Check lại xem có cần thêm bảng role để check phân quyền đăng ký của giáo viên không
Hay check theo system admin có quyền cao nhất

hoặc thêm 1 bảng role cho các quyền nhất định của hệ thống
Role + UserRole table

RegisterTechers ( giáo viên đăng ký N : N với học sinh Lưu lại log đăng ký, khi hủy thì xóa mềm)

Notifications (bảng thông báo lưu lại thông báo) gồm các thông tin người tạo người cập nhật thông tin người đính kèm ...
