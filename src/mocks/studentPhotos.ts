export interface StudentGalleryPhoto {
  id: string
  studentId: string
  title: string
  name?: string
  date: string
  url: string
  thumbnailUrl: string
  type: 'image' | 'video'
  duration?: string
  month: string // e.g. 'Tháng 4/2026', 'Tháng 5/2026', 'Tháng 3/2026'
  sessionNumber: number
  sessionTitle: string
  sessionDate: string
  sessionTime?: string
  teacherName?: string
  isClassWide?: boolean
}

export const MOCK_STUDENT_PHOTOS: StudentGalleryPhoto[] = [
  // ══════════════════════════════════════════════════════════════════
  // THÁNG 5/2026
  // ══════════════════════════════════════════════════════════════════
  // Buổi 5
  {
    id: 'media-s5-1',
    studentId: 'all',
    title: 'Bảng từ vựng và mẫu câu Unit 5',
    name: 'Bang_Tu_Vung_Unit5.jpg',
    date: '09/05/2026',
    month: 'Tháng 5/2026',
    sessionNumber: 5,
    sessionTitle: 'Reading Strategies & Skimming/Scanning',
    sessionDate: 'Thứ 7, 09/05/2026 (18:00 - 19:30)',
    teacherName: 'Hoàng Thị Mai',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500&auto=format&fit=crop&q=80',
    isClassWide: true,
  },
  {
    id: 'media-s5-2',
    studentId: 'all',
    title: 'Hoạt động thảo luận nhóm sôi nổi nhận sticker',
    name: 'Hoat_Dong_Nhom_Sticker.jpg',
    date: '09/05/2026',
    month: 'Tháng 5/2026',
    sessionNumber: 5,
    sessionTitle: 'Reading Strategies & Skimming/Scanning',
    sessionDate: 'Thứ 7, 09/05/2026 (18:00 - 19:30)',
    teacherName: 'Hoàng Thị Mai',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=80',
    isClassWide: false,
  },
  {
    id: 'media-s5-3',
    studentId: 'all',
    title: 'Video con tự tin thuyết trình đoạn văn ngắn',
    name: 'Video_Thuyet_Trinh_Unit5.mp4',
    date: '09/05/2026',
    month: 'Tháng 5/2026',
    sessionNumber: 5,
    sessionTitle: 'Reading Strategies & Skimming/Scanning',
    sessionDate: 'Thứ 7, 09/05/2026 (18:00 - 19:30)',
    teacherName: 'Hoàng Thị Mai',
    type: 'video',
    duration: '01:45',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80',
    isClassWide: false,
  },

  // Buổi 4
  {
    id: 'media-s4-1',
    studentId: 'all',
    title: 'Bảng phiên âm quốc tế IPA Unit 4',
    name: 'Bang_Phien_Am_IPA_Unit4.jpg',
    date: '07/05/2026',
    month: 'Tháng 5/2026',
    sessionNumber: 4,
    sessionTitle: 'Listening & Pronunciation Practice',
    sessionDate: 'Thứ 5, 07/05/2026 (18:00 - 19:30)',
    teacherName: 'Hoàng Thị Mai',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=80',
    isClassWide: true,
  },
  {
    id: 'media-s4-2',
    studentId: 'all',
    title: 'Video luyện phát âm và ngữ điệu câu hỏi',
    name: 'Thao_Luan_Phien_Am_Lop.mp4',
    date: '07/05/2026',
    month: 'Tháng 5/2026',
    sessionNumber: 4,
    sessionTitle: 'Listening & Pronunciation Practice',
    sessionDate: 'Thứ 5, 07/05/2026 (18:00 - 19:30)',
    teacherName: 'Hoàng Thị Mai',
    type: 'video',
    duration: '02:30',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=80',
    isClassWide: false,
  },

  // Buổi 3
  {
    id: 'media-s3-1',
    studentId: 'all',
    title: 'Góc học tập chăm chỉ và sáng tạo của con',
    name: 'Goc_Hoc_Tap_ThienAn.jpg',
    date: '05/05/2026',
    month: 'Tháng 5/2026',
    sessionNumber: 3,
    sessionTitle: 'Grammar in Use & Sentence Building',
    sessionDate: 'Thứ 3, 05/05/2026 (18:00 - 19:30)',
    teacherName: 'Hoàng Thị Mai',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=80',
    isClassWide: false,
  },

  // ══════════════════════════════════════════════════════════════════
  // THÁNG 4/2026
  // ══════════════════════════════════════════════════════════════════
  // Buổi 8
  {
    id: 'media-s4-m4-1',
    studentId: 'all',
    title: 'Hào hứng tham gia hoạt động khởi động đầu giờ',
    name: 'Khoi_Dong_Dau_Gio.jpg',
    date: '28/04/2026',
    month: 'Tháng 4/2026',
    sessionNumber: 8,
    sessionTitle: 'Review & Recognition: Zoo Animals',
    sessionDate: 'Thứ 3, 28/04/2026 (18:00 - 19:30)',
    teacherName: 'Ms.Chloe',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=80',
    isClassWide: false,
  },
  {
    id: 'media-s4-m4-2',
    studentId: 'all',
    title: 'Video con tự tin phát biểu câu hoàn chỉnh',
    name: 'Video_Phat_Bieu_Cau_Hoi.mp4',
    date: '28/04/2026',
    month: 'Tháng 4/2026',
    sessionNumber: 8,
    sessionTitle: 'Review & Recognition: Zoo Animals',
    sessionDate: 'Thứ 3, 28/04/2026 (18:00 - 19:30)',
    teacherName: 'Ms.Chloe',
    type: 'video',
    duration: '02:05',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
    isClassWide: false,
  },
  {
    id: 'media-s4-m4-3',
    studentId: 'all',
    title: 'Con tập trung hoàn thành bài tập tư duy',
    name: 'Bai_Tap_Tu_Duy_Phonics.jpg',
    date: '24/04/2026',
    month: 'Tháng 4/2026',
    sessionNumber: 7,
    sessionTitle: 'Phonics Letter T & Letter U',
    sessionDate: 'Thứ 6, 24/04/2026 (18:00 - 19:30)',
    teacherName: 'Ms.Chloe',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
    isClassWide: false,
  },
  {
    id: 'media-s4-m4-4',
    studentId: 'all',
    title: 'Thực hành dự án mini: Tạo hình con vật yêu thích',
    name: 'Mini_Project_Animal_Masks.jpg',
    date: '19/04/2026',
    month: 'Tháng 4/2026',
    sessionNumber: 6,
    sessionTitle: 'Mini Project: Animal Masks & Crafts',
    sessionDate: 'Chủ Nhật, 19/04/2026 (09:00 - 10:30)',
    teacherName: 'Ms.Chloe',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&auto=format&fit=crop&q=80',
    isClassWide: true,
  },
  {
    id: 'media-s4-m4-5',
    studentId: 'all',
    title: 'Video thực hành thuyết trình mẫu câu trước lớp',
    name: 'Video_Thuyet_Trinh_Show_Tell.mp4',
    date: '16/04/2026',
    month: 'Tháng 4/2026',
    sessionNumber: 5,
    sessionTitle: 'Speaking Show & Tell: My Favorites',
    sessionDate: 'Thứ 5, 16/04/2026 (18:00 - 19:30)',
    teacherName: 'Ms.Chloe',
    type: 'video',
    duration: '01:55',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=80',
    isClassWide: false,
  },
  {
    id: 'media-s4-m4-6',
    studentId: 'all',
    title: 'Luyện tập phát âm nhóm cùng các bạn',
    name: 'Luyen_Tap_Phat_Am_Nhom.jpg',
    date: '12/04/2026',
    month: 'Tháng 4/2026',
    sessionNumber: 4,
    sessionTitle: 'Group Discussion & Vocabulary',
    sessionDate: 'Chủ Nhật, 12/04/2026 (09:00 - 10:30)',
    teacherName: 'Ms.Chloe',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500&auto=format&fit=crop&q=80',
    isClassWide: false,
  },
  {
    id: 'media-s4-m4-7',
    studentId: 'all',
    title: 'Nhận sticker khen thưởng chuyên cần xuất sắc',
    name: 'Nhan_Sticker_Khen_Thuong.jpg',
    date: '08/04/2026',
    month: 'Tháng 4/2026',
    sessionNumber: 3,
    sessionTitle: 'Interactive Phonics & Games',
    sessionDate: 'Thứ 4, 08/04/2026 (18:00 - 19:30)',
    teacherName: 'Ms.Chloe',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=80',
    isClassWide: false,
  },

  // ══════════════════════════════════════════════════════════════════
  // THÁNG 3/2026
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'media-s3-m3-1',
    studentId: 'all',
    title: 'Thực hành dự án khoa học nhỏ: Vũ trụ quanh ta',
    name: 'Science_Discovery_Space.jpg',
    date: '26/03/2026',
    month: 'Tháng 3/2026',
    sessionNumber: 4,
    sessionTitle: 'Science Discovery: Solar System',
    sessionDate: 'Thứ 5, 26/03/2026 (18:00 - 19:30)',
    teacherName: 'Teacher Mark',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=80',
    isClassWide: true,
  },
  {
    id: 'media-s3-m3-2',
    studentId: 'all',
    title: 'Video thực hành thí nghiệm mô phỏng núi lửa',
    name: 'Video_Thi_Nghiem_Nui_Lua.mp4',
    date: '20/03/2026',
    month: 'Tháng 3/2026',
    sessionNumber: 3,
    sessionTitle: 'Hands-on Experiment & Reporting',
    sessionDate: 'Thứ 6, 20/03/2026 (18:00 - 19:30)',
    teacherName: 'Teacher Mark',
    type: 'video',
    duration: '03:15',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80',
    isClassWide: false,
  },
  {
    id: 'media-s3-m3-3',
    studentId: 'all',
    title: 'Vẽ tranh sắc màu thế giới hoang dã',
    name: 'Ve_Tranh_The_Gioi_Hoang_Da.jpg',
    date: '14/03/2026',
    month: 'Tháng 3/2026',
    sessionNumber: 2,
    sessionTitle: 'Colors & Animals in the Wild',
    sessionDate: 'Thứ 7, 14/03/2026 (18:00 - 19:30)',
    teacherName: 'Teacher Mark',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500&auto=format&fit=crop&q=80',
    isClassWide: false,
  },
]

/**
 * Lấy danh sách ảnh & video trong thư viện của học viên.
 * Luôn trả về danh sách phong phú gồm cả ảnh và video theo các buổi học.
 */
export function getStudentPhotos(studentId?: string, month?: string): StudentGalleryPhoto[] {
  const currentStudentId = studentId || 's18'

  // Sao chép và cá nhân hóa ID theo studentId để lưu trữ độc lập
  const allMedia = MOCK_STUDENT_PHOTOS.map((item) => ({
    ...item,
    studentId: currentStudentId,
  }))

  if (month && month !== 'all') {
    return allMedia.filter((item) => item.month === month)
  }

  return allMedia
}
