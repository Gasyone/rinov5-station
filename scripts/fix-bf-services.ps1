$folder = "c:\Users\Jacky Tran\Documents\Rinov5\docs\business-functions"

# Mapping: file -> lines to fix
$fixes = @{
    "BF-PRD-01-quan-ly-san-pham.md" = @(
        @{Find = '`hybrid` (Các màn hình chính: `ProductListView`, `ProductGroupsView`, `ProductCombosView`, `ProductSettingsView`)'; Replace = 'Kết hợp (Các màn hình chính: Danh sách Sản phẩm, Nhóm Sản phẩm, Combo, Cài đặt Sản phẩm)'}
    )
    "BF-OPS-03-lich-su-kien.md" = @(
        @{Find = '`SessionService` xử lý cập nhật đơn lẻ.'; Replace = 'Dịch vụ quản lý buổi học xử lý cập nhật đơn lẻ.'}
    )
    "BF-OPS-02-lich-hoc.md" = @(
        @{Find = '`ScheduleEngine` xử lý cronjob sinh Session và check conflict real-time.'; Replace = 'Bộ xử lý lịch tự động sinh buổi học và kiểm tra trùng lịch.'}
    )
    "BF-HR-02-quan-ly-quy-thoi-gian.md" = @(
        @{Find = '`ScheduleService`, quản lý bảng `availability`.'; Replace = 'Dịch vụ lịch trình, quản lý dữ liệu khả dụng của nhân sự.'}
    )
    "BF-CLS-05-diem-danh-nhan-xet.md" = @(
        @{Find = '`AttendanceService`.'; Replace = 'Dịch vụ điểm danh.'}
    )
    "BF-CLS-06-nghi-hoc-bao-luu.md" = @(
        @{Find = '`EnrollmentService` xử lý đổi trạng thái và sinh `TransferRecord`.'; Replace = 'Dịch vụ tuyển sinh xử lý đổi trạng thái và tạo bản ghi chuyển lớp.'}
    )
    "BF-CLS-04-quan-ly-giao-vien.md" = @(
        @{Find = '`ClassService` xử lý mapping.'; Replace = 'Dịch vụ lớp học xử lý phân công.'}
    )
    "BF-CLS-02-quan-ly-lop-hoc.md" = @(
        @{Find = '`ClassService`.'; Replace = 'Dịch vụ quản lý lớp học.'}
    )
    "BF-CLS-03-quan-ly-hoc-vien.md" = @(
        @{Find = '`StudentService` tổng hợp data từ `Attendance`, `Grading`, `Enrollment`.'; Replace = 'Dịch vụ học viên tổng hợp dữ liệu từ điểm danh, đánh giá, và tuyển sinh.'}
    )
    "BF-CLS-01-xep-lop.md" = @(
        @{Find = '`EnrollmentService`.'; Replace = 'Dịch vụ xếp lớp.'}
    )
}

foreach ($file in $fixes.Keys) {
    $path = Join-Path $folder $file
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path)
        $updated = $content
        foreach ($fix in $fixes[$file]) {
            $updated = $updated.Replace($fix.Find, $fix.Replace)
        }
        if ($updated -ne $content) {
            [System.IO.File]::WriteAllText($path, $updated)
            Write-Host "Updated: $file"
        }
    }
}
