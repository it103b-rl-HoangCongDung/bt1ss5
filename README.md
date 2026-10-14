# BÁO CÁO PHÂN TÍCH LỖI VÀ SỬA LỖI CẮT CHUỖI MÃ VẬN ĐƠN DO SAI LỆCH VỊ TRÍ INDEX

> 👤 **Học viên:** Hoàng Công Dũng | **Mã SV:** PTIT-HCM-009
> 🏫 **Môn học:** it103b-rl-HoangCongDung

---

## 📊 Sơ đồ thiết kế hệ thống (Flowchart)

> 💡 *Sơ đồ dưới đây được render tự động trực tiếp trên GitHub bằng Mermaid. Bạn cũng có thể tải file **`bt1.drawio`** trong repository này để mở và chỉnh sửa trực tiếp trên [Draw.io (diagrams.net)](https://app.diagrams.net).* 

```mermaid
graph TD
  Start([Bắt đầu]) --> Scan[Nhận chuỗi thô từ máy quét Kiosk]
  Scan --> Trim[Thực hiện .trim() loại bỏ khoảng trắng thừa]
  Trim --> CheckPrefix{Kiểm tra tiền tố có bắt đầu bằng 'MED-'?}
  CheckPrefix -- Không khớp --> ErrPrefix[Báo lỗi chuỗi sai định dạng tiền tố] --> EndFail([Kết thúc: Từ chối xử lý])
  CheckPrefix -- Khớp --> Uppercase[Chuyển đổi toàn bộ chuỗi sang chữ hoa]
  Uppercase --> ExtractDept[Cắt lấy mã chuyên khoa bằng .slice()]
  ExtractDept --> ExtractNum[Cắt lấy số thứ tự tiếp đón bằng .slice() đúng chỉ mục]
  ExtractNum --> FormatName[Làm sạch và viết hoa tên bệnh nhân]
  FormatName --> Success[In thông tin hoàn tất ra màn hình Kiosk]
  Success --> EndSuccess([Kết thúc: Tiếp đón thành công])
```

---

## Nhiệm vụ 1: Phân tích lỗi & Lập bảng Test Cases (trình bày trong README.md)

Sau khi đọc kỹ mã nguồn hiện tại của Kiosk tự phục vụ tại bệnh viện, mình nhận thấy có 2 lỗi logic nghiêm trọng khiến kết quả trả về bị sai lệch:

Thứ nhất, việc kiểm tra tiền tố 'MED-' được thực hiện trước khi gọi phương thức .trim(). Đối với chuỗi thô '  med-nhi-1024  ', khoảng trắng ở đầu làm cho phương thức startsWith('MED-') trả về giá trị false, đồng thời do chưa chuyển đổi chữ hoa/thường nên hệ thống không nhận diện được chuỗi hợp lệ.

Thứ hai, vị trí index khi cắt chuỗi bằng phương thức .slice() đang bị sai lệch. Cụ thể, chuỗi sau khi dọn khoảng trắng có cấu trúc 'med-nhi-1024'. Vị trí các ký tự như sau: m(0) e(1) d(2) -(3) n(4) h(5) i(6) -(7) 1(8) 0(9) 2(10) 4(11). Dòng lệnh cũ cắt departmentCode từ index 4 đến 7 (lấy 'nhi') là đúng, nhưng appointmentNumber cắt từ 8 đến 12 lại chỉ lấy được '1024' (lỗi tràn cận hoặc thiếu index cuối vì slice kết thúc ở index 12 không bao gồm phần tử 12, thực tế phải cắt từ 8 đến 12 để lấy đủ 4 chữ số, tuy nhiên do chuỗi kết thúc ở index 11 nên slice(8, 12) thực chất chỉ lấy đến hết chuỗi nhưng nếu độ dài thay đổi sẽ bị thiếu hoặc sai lệch ký tự gạch nối nếu tính sai khoảng cách).

- Tính bất biến (Immutability) của chuỗi: Các phương thức như .trim(), .slice(), .toUpperCase() không làm thay đổi chuỗi gốc mà tạo ra chuỗi mới, do đó bắt buộc phải gán vào biến mới hoặc xử lý tuần tự hợp lý.
- Xử lý chuẩn hóa dữ liệu: Cần thực hiện .trim() và .toUpperCase() ngay từ đầu để đồng bộ hóa định dạng trước khi thực hiện các thao tác cắt chuỗi.

## Bảng 02 Test Cases đối chứng

Dưới đây là bảng phân tích test cases đối chứng cho các trường hợp dữ liệu đầu vào khác nhau:

| Trường hợp kiểm thử | Dữ liệu đầu vào | Kết quả sai thực tế | Kết quả đúng mong đợi |
| --- | --- | --- | --- |
| TC 01: Chuỗi có khoảng trắng thừa và chữ thường | rawAppointmentCode = '  med-nhi-1024  ' | Trạng thái hợp lệ: false, Mã chuyên khoa: NHI, Số thứ tự: (bị lệch hoặc thiếu) | Trạng thái hợp lệ: true, Chuyên khoa: NHI, Số thứ tự: 1024, Tên: NGUYỄN VĂN AN |
| TC 02: Chuỗi viết hoa toàn bộ có khoảng cách chuẩn | rawAppointmentCode = 'MED-KHOA-5088' | Kiểm tra tiền tố hoạt động nhưng slice sai vị trí nếu độ dài thay đổi | Trạng thái hợp lệ: true, Chuyên khoa: KHOA, Số thứ tự: 5088, Tên chuẩn hóa hoàn chỉnh |

## Nhiệm vụ 2: Sửa lỗi mã nguồn (solution_ex1.js)

Để khắc phục hoàn toàn các lỗi trên, mình đã viết lại tệp solution_ex1.js theo chuẩn logic nghiệp vụ, đảm bảo xử lý triệt để khoảng trắng, chuẩn hóa chữ hoa và cắt chuỗi chính xác tuyệt đối.

- Thực hiện dọn dẹp khoảng trắng ngay lập tức bằng .trim().
- Chuyển toàn bộ sang chữ hoa bằng .toUpperCase() để kiểm tra tiền tố chính xác.
- Xác định đúng vị trí index cho hàm .slice() dựa trên độ dài thực tế của chuỗi định dạng.

---

## 📁 Danh sách tệp tin nộp bài trong Repository
- 📝 `bt1.docx`: Báo cáo tài liệu phân tích nghiệp vụ hoàn chỉnh.
- 🎨 `bt1.drawio`: File thiết kế sơ đồ chuẩn theo quy định đề bài (mở trực tiếp bằng [Draw.io](https://app.diagrams.net) hoặc Lucidchart).
- 💻 `solution_ex1.js`: Mã nguồn chương trình.
