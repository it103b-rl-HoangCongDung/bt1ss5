// Dữ liệu thô từ máy quét Kiosk
const rawAppointmentCode = "  med-nhi-1024  ";
const cleanPatientName = "  nguyễn văn an  ";

// Dọn dẹp khoảng trắng và chuẩn hóa chữ hoa toàn bộ chuỗi mã phiếu hẹn
const cleanAppointmentCode = rawAppointmentCode.trim().toUpperCase();

// Kiểm tra tiền tố hợp lệ sau khi đã dọn khoảng trắng và viết hoa
const isCodeValid = cleanAppointmentCode.startsWith("MED-");

// Cắt chuỗi chính xác dựa trên cấu trúc MED-XXXX-YYYY hoặc MED-YYY-XXXX
// Với 'MED-NHI-1024': MED- (index 0-4), NHI (index 4-7), - (index 7), 1024 (index 8-12)
const departmentCode = cleanAppointmentCode.slice(4, 7);
const appointmentNumber = cleanAppointmentCode.slice(8, 12);

// Chuẩn hóa tên bệnh nhân
const formattedPatientName = cleanPatientName.trim().toUpperCase();

// Xuất kết quả kiểm tra ra màn hình console
console.log("Bệnh nhân:", formattedPatientName);
console.log("Chuyên khoa:", departmentCode);
console.log("Số thứ tự tiếp đón:", appointmentNumber);
console.log("Trạng thái hợp lệ:", isCodeValid);