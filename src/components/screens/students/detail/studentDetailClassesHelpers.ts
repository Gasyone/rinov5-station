export interface ClassPerformance {
  attendanceRate: string
  attendanceDetail: string
  homeworkSubmissionRate: string
  homeworkDetail: string
  latestScore: {
    testName: string
    score: string
    grade: string
  }
  latestComment: {
    date: string
    teacherName: string
    content: string
  }
  nextMilestone: string
}

export function getClassPerformance(classCode: string): ClassPerformance {
  const code = classCode.toUpperCase()
  if (code.includes('IELTS')) {
    return {
      attendanceRate: '91.7%',
      attendanceDetail: '11/12 buổi đi học (1 buổi vắng phép)',
      homeworkSubmissionRate: '91.7%',
      homeworkDetail: '11/12 bài tập đã nộp',
      latestScore: {
        testName: 'Reading & Writing Progress Test',
        score: '7.0 / 9.0',
        grade: 'Khá',
      },
      latestComment: {
        date: '08/06/2026',
        teacherName: 'Hoàng Thị Giáo Viên',
        content:
          'Học viên Nguyễn An có ý thức học tập rất tốt, phản xạ nói tiếng Anh khá nhanh nhạy. Cần chuẩn bị bài kỹ hơn trước khi lên lớp để tự tin phát triển các ý tưởng dài trong bài nói.',
      },
      nextMilestone: 'Kiểm tra Cuối kỳ (Final Test) - Buổi 24',
    }
  } else if (code.includes('TOEIC')) {
    return {
      attendanceRate: '100%',
      attendanceDetail: '4/4 buổi đi học đầy đủ',
      homeworkSubmissionRate: '100%',
      homeworkDetail: '4/4 bài tập hoàn thành',
      latestScore: {
        testName: 'Pronunciation Assessment',
        score: '8.5 / 10',
        grade: 'Giỏi',
      },
      latestComment: {
        date: '05/06/2026',
        teacherName: 'John Smith',
        content:
          'Very active and enthusiastic in class activities. Good pronunciation and intonation. Keep practicing the ending sounds of complex words.',
      },
      nextMilestone: 'Đánh giá phát âm cuối khóa - Buổi 12',
    }
  } else if (code.includes('TOAN') || code.includes('MATH')) {
    return {
      attendanceRate: '95.2%',
      attendanceDetail: '80/84 buổi đi học (4 buổi nghỉ có phép)',
      homeworkSubmissionRate: '90.5%',
      homeworkDetail: '76/84 bài tập hoàn thành',
      latestScore: {
        testName: 'Kiểm tra Chuyên đề 07 (Logic & Hình học)',
        score: '8.5 / 10',
        grade: 'Giỏi',
      },
      latestComment: {
        date: '18/08/2024',
        teacherName: 'GV_HuiLT20',
        content:
          'Học viên tư duy logic sắc bén, phản xạ giải toán nhanh, làm bài tập đầy đủ và tích cực xây dựng bài trên lớp.',
      },
      nextMilestone: 'Kiểm tra Cuối khóa - Buổi 96',
    }
  } else {
    return {
      attendanceRate: '94.0%',
      attendanceDetail: '22/24 buổi đi học (2 buổi vắng phép)',
      homeworkSubmissionRate: '88.0%',
      homeworkDetail: '21/24 bài tập hoàn thành',
      latestScore: {
        testName: 'Đánh giá định kỳ',
        score: '8.0 / 10',
        grade: 'Khá',
      },
      latestComment: {
        date: '15/06/2026',
        teacherName: 'GV phụ trách',
        content:
          'Học viên có ý thức học tập tốt, đi học đúng giờ và tích cực tham gia các hoạt động tại lớp.',
      },
      nextMilestone: 'Kiểm tra giữa kỳ - Buổi 12',
    }
  }
}

