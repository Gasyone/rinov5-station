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
  } else {
    return {
      attendanceRate: '—',
      attendanceDetail: 'Chưa có buổi học nào diễn ra',
      homeworkSubmissionRate: '—',
      homeworkDetail: 'Chưa có bài tập nào được giao',
      latestScore: {
        testName: 'Đánh giá đầu vào',
        score: '6.0 / 10',
        grade: 'Trung bình',
      },
      latestComment: {
        date: '15/06/2026',
        teacherName: 'Hệ thống',
        content:
          'Học viên mới được ghép vào lớp học này. Vui lòng theo dõi kết quả ở các buổi học tiếp theo.',
      },
      nextMilestone: 'Kiểm tra giữa kỳ - Buổi 12',
    }
  }
}
