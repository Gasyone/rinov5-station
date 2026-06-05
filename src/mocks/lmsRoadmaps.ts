export interface LMSLessonComponent {
  name: string
  type: 'slide' | 'homework' | 'quiz' | 'audio' | 'video'
  url: string
}

export interface LMSLesson {
  id: string
  lessonNumber: number
  title: string
  description: string
  components: LMSLessonComponent[]
}

export interface LMSSyllabus {
  id: string
  name: string
  totalLessons: number
  lessons: LMSLesson[]
}

export interface LMSRoadmap {
  id: string
  name: string
  syllabi: LMSSyllabus[]
}

// Generate 12 lessons for KET Prep Standard
const generateKetStandardLessons = (): LMSLesson[] => [
  {
    id: 'ket-std-1',
    lessonNumber: 1,
    title: 'Unit 1: Hello & Everyday Vocab',
    description: 'Giới thiệu kỹ năng làm quen cơ bản và vốn từ vựng gia đình.',
    components: [
      { name: 'Slide bài giảng Unit 1', type: 'slide', url: 'https://drive.google.com/file/d/ket-std-1-slide/view' },
      { name: 'Bài tập về nhà Unit 1', type: 'homework', url: 'https://drive.google.com/file/d/ket-std-1-hw/view' },
      { name: 'Listening Audio Unit 1', type: 'audio', url: 'https://drive.google.com/file/d/ket-std-1-audio/view' }
    ]
  },
  {
    id: 'ket-std-2',
    lessonNumber: 2,
    title: 'Unit 2: My Hobbies & Likes',
    description: 'Cấu trúc câu nói về sở thích cá nhân, các danh từ chỉ hoạt động.',
    components: [
      { name: 'Slide bài giảng Unit 2', type: 'slide', url: 'https://drive.google.com/file/d/ket-std-2-slide/view' },
      { name: 'Bài tập về nhà Unit 2', type: 'homework', url: 'https://drive.google.com/file/d/ket-std-2-hw/view' }
    ]
  },
  {
    id: 'ket-std-3',
    lessonNumber: 3,
    title: 'Unit 3: School Life & Subjects',
    description: 'Từ vựng các môn học và cơ sở vật chất ở trường học.',
    components: [
      { name: 'Slide bài giảng Unit 3', type: 'slide', url: 'https://drive.google.com/file/d/ket-std-3-slide/view' },
      { name: 'Bài tập về nhà Unit 3', type: 'homework', url: 'https://drive.google.com/file/d/ket-std-3-hw/view' },
      { name: 'School Vocabulary Quiz', type: 'quiz', url: 'https://lms.rinoedu.com/quiz/ket-std-3-quiz' }
    ]
  },
  {
    id: 'ket-std-4',
    lessonNumber: 4,
    title: 'Unit 4: Town & Places around Me',
    description: 'Chỉ đường, hỏi thăm vị trí các địa danh nổi tiếng.',
    components: [
      { name: 'Slide bài giảng Unit 4', type: 'slide', url: 'https://drive.google.com/file/d/ket-std-4-slide/view' },
      { name: 'Bài tập về nhà Unit 4', type: 'homework', url: 'https://drive.google.com/file/d/ket-std-4-hw/view' }
    ]
  },
  {
    id: 'ket-std-5',
    lessonNumber: 5,
    title: 'Unit 5: Food & Restaurants',
    description: 'Từ vựng món ăn, cách đặt bàn, gọi món và đối thoại giao tiếp cơ bản.',
    components: [
      { name: 'Slide bài giảng Unit 5', type: 'slide', url: 'https://drive.google.com/file/d/ket-std-5-slide/view' },
      { name: 'Bài tập về nhà Unit 5', type: 'homework', url: 'https://drive.google.com/file/d/ket-std-5-hw/view' },
      { name: 'Food Quiz', type: 'quiz', url: 'https://lms.rinoedu.com/quiz/ket-std-5-quiz' }
    ]
  },
  {
    id: 'ket-std-6',
    lessonNumber: 6,
    title: 'Unit 6: Sports & Healthy Life',
    description: 'Từ vựng thể thao, lối sống năng động và nói về sức khỏe.',
    components: [
      { name: 'Slide bài giảng Unit 6', type: 'slide', url: 'https://drive.google.com/file/d/ket-std-6-slide/view' },
      { name: 'Bài tập về nhà Unit 6', type: 'homework', url: 'https://drive.google.com/file/d/ket-std-6-hw/view' },
      { name: 'Video: Sports Guide', type: 'video', url: 'https://drive.google.com/file/d/ket-std-6-video/view' }
    ]
  },
  {
    id: 'ket-std-7',
    lessonNumber: 7,
    title: 'Unit 7: Travel & Holidays',
    description: 'Các phương tiện giao thông, chuẩn bị hành lý và lên kế hoạch đi chơi.',
    components: [
      { name: 'Slide bài giảng Unit 7', type: 'slide', url: 'https://drive.google.com/file/d/ket-std-7-slide/view' },
      { name: 'Bài tập về nhà Unit 7', type: 'homework', url: 'https://drive.google.com/file/d/ket-std-7-hw/view' }
    ]
  },
  {
    id: 'ket-std-8',
    lessonNumber: 8,
    title: 'Unit 8: Animals & Nature',
    description: 'Các loài động vật hoang dã, bảo vệ môi trường sinh thái.',
    components: [
      { name: 'Slide bài giảng Unit 8', type: 'slide', url: 'https://drive.google.com/file/d/ket-std-8-slide/view' },
      { name: 'Bài tập về nhà Unit 8', type: 'homework', url: 'https://drive.google.com/file/d/ket-std-8-hw/view' },
      { name: 'Nature Quiz', type: 'quiz', url: 'https://lms.rinoedu.com/quiz/ket-std-8-quiz' }
    ]
  },
  {
    id: 'ket-std-9',
    lessonNumber: 9,
    title: 'Unit 9: Entertainment & Media',
    description: 'Điện ảnh, âm nhạc, các chương trình tivi và thói quen giải trí.',
    components: [
      { name: 'Slide bài giảng Unit 9', type: 'slide', url: 'https://drive.google.com/file/d/ket-std-9-slide/view' },
      { name: 'Bài tập về nhà Unit 9', type: 'homework', url: 'https://drive.google.com/file/d/ket-std-9-hw/view' }
    ]
  },
  {
    id: 'ket-std-10',
    lessonNumber: 10,
    title: 'Unit 10: Science & Technology',
    description: 'Các thiết bị công nghệ hiện đại, máy tính và thế giới internet.',
    components: [
      { name: 'Slide bài giảng Unit 10', type: 'slide', url: 'https://drive.google.com/file/d/ket-std-10-slide/view' },
      { name: 'Bài tập về nhà Unit 10', type: 'homework', url: 'https://drive.google.com/file/d/ket-std-10-hw/view' }
    ]
  },
  {
    id: 'ket-std-11',
    lessonNumber: 11,
    title: 'KET Practice Test 1',
    description: 'Luyện tập giải đề thi thử KET chuẩn format Cambridge.',
    components: [
      { name: 'Slide KET Test 1', type: 'slide', url: 'https://drive.google.com/file/d/ket-std-11-slide/view' },
      { name: 'Homework KET Test 1', type: 'homework', url: 'https://drive.google.com/file/d/ket-std-11-hw/view' }
    ]
  },
  {
    id: 'ket-std-12',
    lessonNumber: 12,
    title: 'KET Practice Test 2 & Review',
    description: 'Hoàn thiện đề thi thứ hai, nhận xét ưu khuyết điểm của từng kỹ năng.',
    components: [
      { name: 'Slide KET Test 2', type: 'slide', url: 'https://drive.google.com/file/d/ket-std-12-slide/view' },
      { name: 'Homework KET Test 2', type: 'homework', url: 'https://drive.google.com/file/d/ket-std-12-hw/view' }
    ]
  }
]

// Generate KET Prep Fast-Track (advanced items)
const generateKetFastTrackLessons = (): LMSLesson[] => [
  {
    id: 'ket-ft-1',
    lessonNumber: 1,
    title: 'Advanced Unit 1: Social Communication',
    description: 'Từ vựng giao tiếp xã hội tầm cao, cách biểu đạt quan điểm.',
    components: [
      { name: 'Slide Social Comm', type: 'slide', url: 'https://drive.google.com/file/d/ket-ft-1-slide/view' },
      { name: 'Homework Social Comm', type: 'homework', url: 'https://drive.google.com/file/d/ket-ft-1-hw/view' }
    ]
  },
  {
    id: 'ket-ft-2',
    lessonNumber: 2,
    title: 'Advanced Unit 2: Cultural Differences',
    description: 'Đặc trưng văn hóa các nước nói tiếng Anh, so sánh phong tục tập quán.',
    components: [
      { name: 'Slide Cultural Diff', type: 'slide', url: 'https://drive.google.com/file/d/ket-ft-2-slide/view' },
      { name: 'Homework Cultural Diff', type: 'homework', url: 'https://drive.google.com/file/d/ket-ft-2-hw/view' },
      { name: 'Culture Listening Audio', type: 'audio', url: 'https://drive.google.com/file/d/ket-ft-2-audio/view' }
    ]
  },
  {
    id: 'ket-ft-3',
    lessonNumber: 3,
    title: 'Advanced Unit 3: Environmental Issues',
    description: 'Biến đổi khí hậu, tái chế rác thải và năng lượng xanh sạch.',
    components: [
      { name: 'Slide Environment', type: 'slide', url: 'https://drive.google.com/file/d/ket-ft-3-slide/view' },
      { name: 'Homework Environment', type: 'homework', url: 'https://drive.google.com/file/d/ket-ft-3-hw/view' }
    ]
  },
  {
    id: 'ket-ft-4',
    lessonNumber: 4,
    title: 'Advanced Unit 4: Future Jobs & Careers',
    description: 'Nghề nghiệp trong tương lai, mô tả công việc bằng tiếng Anh.',
    components: [
      { name: 'Slide Jobs', type: 'slide', url: 'https://drive.google.com/file/d/ket-ft-4-slide/view' },
      { name: 'Homework Jobs', type: 'homework', url: 'https://drive.google.com/file/d/ket-ft-4-hw/view' }
    ]
  },
  {
    id: 'ket-ft-5',
    lessonNumber: 5,
    title: 'Advanced Unit 5: Travel & Explorations',
    description: 'Những chuyến thám hiểm vĩ đại, thuật ngữ du lịch chuyên sâu.',
    components: [
      { name: 'Slide Travel & Exploration', type: 'slide', url: 'https://drive.google.com/file/d/ket-ft-5-slide/view' },
      { name: 'Homework Travel & Exploration', type: 'homework', url: 'https://drive.google.com/file/d/ket-ft-5-hw/view' }
    ]
  },
  {
    id: 'ket-ft-6',
    lessonNumber: 6,
    title: 'Advanced Unit 6: Arts & Literature',
    description: 'Các trào lưu nghệ thuật nổi tiếng, đọc hiểu văn học cơ bản.',
    components: [
      { name: 'Slide Arts & Lit', type: 'slide', url: 'https://drive.google.com/file/d/ket-ft-6-slide/view' },
      { name: 'Homework Arts & Lit', type: 'homework', url: 'https://drive.google.com/file/d/ket-ft-6-hw/view' }
    ]
  },
  {
    id: 'ket-ft-7',
    lessonNumber: 7,
    title: 'Advanced Unit 7: Health & Medicine',
    description: 'Chăm sóc sức khỏe tinh thần, sơ cứu cơ bản và từ vựng y tế.',
    components: [
      { name: 'Slide Health', type: 'slide', url: 'https://drive.google.com/file/d/ket-ft-7-slide/view' },
      { name: 'Homework Health', type: 'homework', url: 'https://drive.google.com/file/d/ket-ft-7-hw/view' }
    ]
  },
  {
    id: 'ket-ft-8',
    lessonNumber: 8,
    title: 'Advanced Unit 8: Space Exploration',
    description: 'Vũ trụ bao la, hệ mặt trời và hành trình thám hiểm sao Hỏa.',
    components: [
      { name: 'Slide Space', type: 'slide', url: 'https://drive.google.com/file/d/ket-ft-8-slide/view' },
      { name: 'Homework Space', type: 'homework', url: 'https://drive.google.com/file/d/ket-ft-8-hw/view' }
    ]
  },
  {
    id: 'ket-ft-9',
    lessonNumber: 9,
    title: 'Advanced Unit 9: Economy & Shopping',
    description: 'Phương thức thanh toán hiện đại, cung cầu thị trường cơ bản.',
    components: [
      { name: 'Slide Economy', type: 'slide', url: 'https://drive.google.com/file/d/ket-ft-9-slide/view' },
      { name: 'Homework Economy', type: 'homework', url: 'https://drive.google.com/file/d/ket-ft-9-hw/view' }
    ]
  },
  {
    id: 'ket-ft-10',
    lessonNumber: 10,
    title: 'Advanced Unit 10: Global History',
    description: 'Các nền văn minh cổ đại, những phát minh làm thay đổi thế giới.',
    components: [
      { name: 'Slide History', type: 'slide', url: 'https://drive.google.com/file/d/ket-ft-10-slide/view' },
      { name: 'Homework History', type: 'homework', url: 'https://drive.google.com/file/d/ket-ft-10-hw/view' }
    ]
  },
  {
    id: 'ket-ft-11',
    lessonNumber: 11,
    title: 'KET Intensive Practice 1',
    description: 'Giải đề thi thử KET mức độ khó cao để tối ưu điểm số.',
    components: [
      { name: 'Slide KET Intensive 1', type: 'slide', url: 'https://drive.google.com/file/d/ket-ft-11-slide/view' },
      { name: 'Homework KET Intensive 1', type: 'homework', url: 'https://drive.google.com/file/d/ket-ft-11-hw/view' }
    ]
  },
  {
    id: 'ket-ft-12',
    lessonNumber: 12,
    title: 'KET Intensive Practice 2 & Certificate Prep',
    description: 'Chuẩn bị tâm lý thi cử, các mẹo làm bài nhanh để đạt điểm tối đa.',
    components: [
      { name: 'Slide KET Intensive 2', type: 'slide', url: 'https://drive.google.com/file/d/ket-ft-12-slide/view' },
      { name: 'Homework KET Intensive 2', type: 'homework', url: 'https://drive.google.com/file/d/ket-ft-12-hw/view' }
    ]
  }
]

export const mockLMSRoadmaps: LMSRoadmap[] = [
  {
    id: 'rm-ket',
    name: 'Lộ trình KET Prep A2',
    syllabi: [
      {
        id: 'syll-ket-std',
        name: 'Khung giáo trình KET Standard',
        totalLessons: 12,
        lessons: generateKetStandardLessons()
      },
      {
        id: 'syll-ket-ft',
        name: 'Khung giáo trình KET Fast-Track',
        totalLessons: 12,
        lessons: generateKetFastTrackLessons()
      }
    ]
  },
  {
    id: 'rm-ielts-jr',
    name: 'Lộ trình IELTS Junior 1A',
    syllabi: [
      {
        id: 'syll-ielts-fnd',
        name: 'Khung giáo trình IELTS Junior Foundation',
        totalLessons: 12,
        lessons: generateKetStandardLessons().map((l) => ({
          ...l,
          id: `ielts-fnd-${l.lessonNumber}`,
          title: l.title.replace('Unit', 'IELTS Junior Unit')
        }))
      },
      {
        id: 'syll-ielts-int',
        name: 'Khung giáo trình IELTS Junior Intensive',
        totalLessons: 12,
        lessons: generateKetFastTrackLessons().map((l) => ({
          ...l,
          id: `ielts-int-${l.lessonNumber}`,
          title: l.title.replace('Advanced Unit', 'IELTS Junior Advanced Unit')
        }))
      }
    ]
  }
]
