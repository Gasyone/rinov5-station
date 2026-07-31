export interface CallScriptResponse {
  id: string
  text: string
  appendNote: string
  objectionHandling?: string
}

export interface ScriptSegment {
  goalTitle: string
  dialogue: string
}

export interface CallScriptStep {
  id: string
  label: string
  segments: ScriptSegment[]
  responses: CallScriptResponse[]
}

export interface CallScript {
  id: string
  title: string
  description: string
  menuId: string
  isEmergency?: boolean
  steps: CallScriptStep[]
}

export const mockCallScripts: CallScript[] = [
  // --- KỊCH BẢN THÔNG THƯỜNG ---
  {
    id: 'booking_test_script',
    title: 'Xác nhận lịch kiểm tra đầu vào',
    description: 'Kịch bản gọi điện xác nhận và dặn dò phụ huynh trước lịch test của học viên',
    menuId: 'booking_test_v2',
    isEmergency: false,
    steps: [
      {
        id: 'step_greeting',
        label: '1. Chào hỏi & Xác nhận',
        segments: [
          {
            goalTitle: 'Mục tiêu: Kết nối & Xưng danh lịch sự',
            dialogue: 'Dạ em chào anh/chị {parentName}, em là {agentName} gọi điện từ phòng Đào tạo của trung tâm Rinov5 ạ.'
          },
          {
            goalTitle: 'Mục tiêu: Đưa ra mục đích cuộc gọi & Hỏi sự tiện lợi',
            dialogue: 'Em xin phép gọi để xác nhận lịch kiểm tra năng lực tiếng Anh đầu vào của bé {studentName} vào lúc {dateTime} tại cơ sở ạ. Không biết anh/chị có tiện trao đổi khoảng 2 phút không ạ?'
          }
        ],
        responses: [
          {
            id: 'greeting_ok',
            text: 'Tiện nghe máy',
            appendNote: 'Phụ huynh tiện trao đổi, xác nhận thông tin cuộc gọi.',
          },
          {
            id: 'greeting_busy',
            text: 'Bận gọi lại sau',
            appendNote: 'Phụ huynh bận lịch, hẹn gọi lại sau.',
            objectionHandling: 'Dạ vâng ạ, vậy em xin phép hẹn gọi lại cho mình vào buổi tối khoảng 19h30 hoặc sáng mai ạ. Chúc anh/chị một ngày làm việc hiệu quả!'
          }
        ]
      },
      {
        id: 'step_confirm',
        label: '2. Thông tin lịch test',
        segments: [
          {
            goalTitle: 'Mục tiêu: Cung cấp thời gian lịch hẹn rõ ràng',
            dialogue: 'Dạ thưa anh/chị, lịch làm bài test của con đã được xếp vào lúc {dateTime}.'
          },
          {
            goalTitle: 'Mục tiêu: Giải thích cấu trúc bài kiểm tra để phụ huynh yên tâm',
            dialogue: 'Bài kiểm tra sẽ gồm 2 phần: Trắc nghiệm ngữ pháp/từ vựng (30 phút) và phỏng vấn trực tiếp với Giáo viên nước ngoài (10-15 phút) để đánh giá phản xạ tự nhiên của con ạ.'
          }
        ],
        responses: [
          {
            id: 'confirm_ok',
            text: 'Đồng ý giờ test',
            appendNote: 'Xác nhận lịch kiểm tra đầu vào đúng giờ.',
            objectionHandling: 'Dạ tuyệt vời ạ. Lịch của con đã được cố định trên hệ thống rồi ạ.'
          },
          {
            id: 'confirm_change_time',
            text: 'Muốn đổi giờ test',
            appendNote: 'Phụ huynh muốn đổi lịch kiểm tra sang khung giờ khác.',
            objectionHandling: 'Dạ được ạ, để em kiểm tra các khung giờ trống khác của Giáo viên rồi đổi lịch cho con nhé. Anh/chị muốn đổi sang buổi sáng hay buổi chiều ạ?'
          }
        ]
      },
      {
        id: 'step_remind',
        label: '3. Dặn dò chuẩn bị',
        segments: [
          {
            goalTitle: 'Mục tiêu: Chuẩn bị tâm lý cho học viên',
            dialogue: 'Để buổi test đạt kết quả chính xác nhất, nhờ anh/chị nhắc con chuẩn bị sẵn tinh thần thoải mái, không cần học tủ hay ôn tập quá áp lực ạ.'
          },
          {
            goalTitle: 'Mục tiêu: Hướng dẫn thời gian đến & Công cụ',
            dialogue: 'Con cần đến sớm trước 10 phút để làm thủ tục nhận phòng test. Bên em sẽ chuẩn bị đầy đủ bút, nháp cho con rồi ạ.'
          }
        ],
        responses: [
          {
            id: 'remind_received',
            text: 'Đã rõ dặn dò',
            appendNote: 'Phụ huynh đã ghi nhận dặn dò trước buổi kiểm tra.',
          },
          {
            id: 'remind_ask_score',
            text: 'Hỏi bao lâu có kết quả',
            appendNote: 'Phụ huynh hỏi về thời gian trả kết quả bài test.',
            objectionHandling: 'Dạ, kết quả chi tiết kèm lộ trình học tập tối ưu từ hội đồng chuyên môn sẽ được gửi tới anh/chị ngay sau buổi phỏng vấn 15 phút ạ.'
          }
        ]
      },
      {
        id: 'step_closing',
        label: '4. Kết thúc & Cảm ơn',
        segments: [
          {
            goalTitle: 'Mục tiêu: Tăng cường dịch vụ hỗ trợ (Bản đồ/Tin nhắn)',
            dialogue: 'Dạ em cảm ơn anh/chị {parentName} rất nhiều. Bên em sẽ gửi tin nhắn SMS/Zalo kèm định vị cơ sở để mình tiện di chuyển ạ.'
          },
          {
            goalTitle: 'Mục tiêu: Chốt lịch hẹn lần cuối & Lời chào thân thiện',
            dialogue: 'Hẹn gặp lại anh/chị và bé {studentName} tại trung tâm vào lúc {dateTime} ạ. Chúc anh/chị một ngày tốt lành!'
          }
        ],
        responses: [
          {
            id: 'close_done',
            text: 'Chào tạm biệt',
            appendNote: 'Hoàn tất xác nhận lịch test. Đã gửi tin nhắn hướng dẫn.',
          }
        ]
      }
    ]
  },
  {
    id: 'trial_class_script',
    title: 'Nhắc lịch học thử & Chuẩn bị',
    description: 'Kịch bản gọi điện nhắc lịch tham gia lớp học thử (Trial) và dặn dò chuẩn bị thiết bị/tinh thần',
    menuId: 'trial_class_v2',
    isEmergency: false,
    steps: [
      {
        id: 'trial_greeting',
        label: '1. Chào hỏi & Nhắc lịch',
        segments: [
          {
            goalTitle: 'Mục tiêu: Chào hỏi & Nêu danh tính',
            dialogue: 'Dạ em chào anh/chị {parentName}, em là {agentName} gọi từ Rinov5 ạ.'
          },
          {
            goalTitle: 'Mục tiêu: Nhắc lịch học thử & Xác nhận đón tiếp',
            dialogue: 'Em xin phép nhắc lịch học thử trải nghiệm lớp tiếng Anh của con {studentName} được diễn ra vào lúc {dateTime} ạ. Không biết anh/chị đã chuẩn bị lịch đưa bé qua lớp chưa ạ?'
          }
        ],
        responses: [
          {
            id: 'trial_greet_ok',
            text: 'Nhớ lịch học',
            appendNote: 'Phụ huynh nhớ lịch học thử của con.',
          },
          {
            id: 'trial_greet_forgot',
            text: 'Quên lịch học',
            appendNote: 'Phụ huynh quên lịch, đã nhắc lại thời gian học.',
            objectionHandling: 'Dạ không sao ạ, buổi học của bé diễn ra vào {dateTime}. Anh/chị lưu lại lịch giúp em nhé, vì lớp trải nghiệm giới hạn sĩ số để đảm bảo chất lượng tốt nhất ạ.'
          }
        ]
      },
      {
        id: 'trial_objections',
        label: '2. Xử lý từ chối đột xuất',
        segments: [
          {
            goalTitle: 'Mục tiêu: Nhấn mạnh giá trị buổi trải nghiệm',
            dialogue: 'Lớp học thử này được thiết kế tương tác thực tế với giáo viên nước ngoài, giúp bé làm quen với phương pháp Active Learning rất hiệu quả.'
          },
          {
            goalTitle: 'Mục tiêu: Đưa ra quà tặng/quản trị để hấp dẫn hơn',
            dialogue: 'Con sẽ được tặng 1 bộ tài liệu độc quyền và đánh giá phản xạ miễn phí khi tham gia trọn vẹn buổi học hôm nay.'
          }
        ],
        responses: [
          {
            id: 'trial_will_attend',
            text: 'Con sẽ đi học',
            appendNote: 'Xác nhận chắc chắn tham gia học thử.',
          },
          {
            id: 'trial_busy_last_min',
            text: 'Bận đột xuất',
            appendNote: 'Phụ huynh báo bận đột xuất giờ chót.',
            objectionHandling: 'Dạ tiếc quá ạ. Nếu vậy em xin phép được bảo lưu suất này và xếp con vào lớp trải nghiệm kế tiếp vào tuần sau nhé ạ. Anh/chị thấy buổi tối thứ 7 hay sáng chủ nhật tuần sau tiện hơn cho con?'
          },
          {
            id: 'trial_kid_unwilling',
            text: 'Bé ngại đi học',
            appendNote: 'Bé rụt rè, chưa muốn đi học thử.',
            objectionHandling: 'Dạ phụ huynh cứ yên tâm ạ. Lớp học thử bên em có các hoạt động game và bài hát cực kỳ vui nhộn. Giáo viên cũng rất tâm lý, giúp các bé rụt rè hòa nhập cực nhanh chỉ sau 5-10 phút đầu thôi ạ!'
          }
        ]
      },
      {
        id: 'trial_remind',
        label: '3. Hướng dẫn chuẩn bị',
        segments: [
          {
            goalTitle: 'Mục tiêu: Làm rõ trang bị dụng cụ học tập',
            dialogue: 'Khi qua trung tâm học thử, con không cần mang theo vở hay bút viết gì đâu ạ, bên em đã chuẩn bị đầy đủ bộ Starter Kit học thử cho con rồi.'
          },
          {
            goalTitle: 'Mục tiêu: Hướng dẫn trang phục',
            dialogue: 'Nhờ anh/chị chuẩn bị cho con trang phục thoải mái để dễ tham gia các hoạt động vận động nhẹ trong lớp nhé ạ.'
          }
        ],
        responses: [
          {
            id: 'trial_remind_ok',
            text: 'Đã rõ chuẩn bị',
            appendNote: 'Phụ huynh đã nắm rõ các hướng dẫn chuẩn bị.',
          }
        ]
      },
      {
        id: 'trial_closing',
        label: '4. Xác nhận điểm đón & Cảm ơn',
        segments: [
          {
            goalTitle: 'Mục tiêu: Nhắc nhở địa chỉ & Thời gian đón tiếp',
            dialogue: 'Dạ vâng, địa chỉ cơ sở của bên em là {branchName}. Anh/chị cứ đưa bé đến trước giờ học 10 phút, bên em sẽ có các bạn lễ tân và giáo vụ đón con ngay tại sảnh chính.'
          },
          {
            goalTitle: 'Mục tiêu: Lời cảm ơn chào kết',
            dialogue: 'Hẹn gặp lại anh/chị và bé {studentName} nhé ạ! Chúc anh/chị một buổi chiều tốt lành.'
          }
        ],
        responses: [
          {
            id: 'trial_close_ok',
            text: 'Chào kết thúc',
            appendNote: 'Hoàn thành gọi nhắc lịch học thử.',
          }
        ]
      }
    ]
  },
  {
    id: 'general_care_script',
    title: 'Chăm sóc định kỳ & Theo dõi học viên',
    description: 'Kịch bản gọi điện chăm sóc học viên định kỳ, lắng nghe phản hồi và tháo gỡ khó khăn trong quá trình học tập',
    menuId: 'students_v2',
    isEmergency: false,
    steps: [
      {
        id: 'general_greet',
        label: '1. Chào hỏi & Mục đích',
        segments: [
          {
            goalTitle: 'Mục tiêu: Chào hỏi cởi mở thân thiện',
            dialogue: 'Dạ em chào anh/chị {parentName}, em là giáo vụ lớp con {studentName} tại Rinov5 ạ.'
          },
          {
            goalTitle: 'Mục tiêu: Nêu mục đích định kỳ gửi lời hỏi thăm',
            dialogue: 'Định kỳ hàng tháng, em gọi điện để lắng nghe ý kiến phản hồi của gia đình mình về tình hình học tập của con, cũng như tương tác của giáo viên ở lớp ạ.'
          }
        ],
        responses: [
          {
            id: 'general_greet_ok',
            text: 'Tiện chia sẻ',
            appendNote: 'Phụ huynh cởi mở chia sẻ phản hồi.',
          }
        ]
      },
      {
        id: 'general_feedback',
        label: '2. Lắng nghe phản hồi',
        segments: [
          {
            goalTitle: 'Mục tiêu: Khơi gợi chia sẻ về thói quen học tập ở nhà',
            dialogue: 'Dạ không biết con về nhà có tự giác làm bài tập trên app không anh/chị?'
          },
          {
            goalTitle: 'Mục tiêu: Khơi gợi cảm xúc của con đối với lớp học',
            dialogue: 'Con có chia sẻ gì về thầy cô hay các bạn ở lớp học của mình không ạ?'
          }
        ],
        responses: [
          {
            id: 'general_fb_good',
            text: 'Khen trung tâm',
            appendNote: 'Phụ huynh khen con tiến bộ, thích đi học, giáo viên nhiệt tình.',
          },
          {
            id: 'general_fb_homework',
            text: 'Con lười làm BTVN',
            appendNote: 'Phụ huynh phản ánh con lười làm bài tập về nhà.',
            objectionHandling: 'Dạ về vấn đề này, để em trao đổi với Giáo viên chủ nhiệm tăng cường nhắc nhở bé đầu giờ học. Đồng thời bên em có nhóm học tập hỗ trợ 1-1 miễn phí vào chiều thứ 5 hàng tuần, em xin phép đăng ký cho bé tham gia để thầy cô kèm cặp con làm bài tập nhé ạ!'
          },
          {
            id: 'general_fb_slow',
            text: 'Con học chưa theo kịp',
            appendNote: 'Phụ huynh lo lắng con học yếu, chưa theo kịp các bạn.',
            objectionHandling: 'Dạ anh/chị đừng lo lắng quá nhé. Bé mới chuyển tiếp lên cấp độ mới nên cần 2-3 tuần đầu để làm quen với nhịp độ. Em sẽ lưu ý bộ phận trợ giảng ngồi kèm sát con trong các buổi học tới và gửi báo cáo tiến độ riêng cho mình sau mỗi buổi học ạ!'
          }
        ]
      },
      {
        id: 'general_closing',
        label: '3. Ghi nhận & Cảm ơn',
        segments: [
          {
            goalTitle: 'Mục tiêu: Cam kết phản hồi lại với giáo viên',
            dialogue: 'Dạ em đã ghi nhận toàn bộ chia sẻ rất quý báu của anh/chị và sẽ phản hồi ngay tới Giáo viên chủ nhiệm để có sự điều chỉnh giúp con học tốt nhất ạ.'
          },
          {
            goalTitle: 'Mục tiêu: Lời cảm ơn chân thành',
            dialogue: 'Cảm ơn anh/chị {parentName} đã dành thời gian trao đổi với em ạ. Em chào anh/chị.'
          }
        ],
        responses: [
          {
            id: 'general_close_done',
            text: 'Chào tạm biệt',
            appendNote: 'Đã tiếp nhận phản hồi định kỳ và chuyển giao cho giáo viên phụ trách.',
          }
        ]
      }
    ]
  },

  // --- KỊCH BẢN KHẨN CẤP (EMERGENCY) ---
  {
    id: 'emg_quality_objection',
    title: 'Khẩn cấp: Khiếu nại chất lượng & đòi hoàn phí',
    description: 'Quy trình xử lý khẩn cấp khi phụ huynh gọi điện hoặc phản ánh gay gắt đòi rút học phí do không hài lòng',
    menuId: 'emergency_quality',
    isEmergency: true,
    steps: [
      {
        id: 'emg_q_step1',
        label: '1. Xoa dịu & Đồng cảm',
        segments: [
          {
            goalTitle: 'Mục tiêu: Lắng nghe hết khiếu nại, tuyệt đối không cướp lời',
            dialogue: 'Dạ em rất hiểu và chia sẻ với sự bức xúc của anh/chị hiện tại ạ. Em thực sự lấy làm tiếc vì trung tâm đã để xảy ra trải nghiệm không tốt này cho gia đình mình.'
          },
          {
            goalTitle: 'Mục tiêu: Nhận trách nhiệm bước đầu và xoa dịu',
            dialogue: 'Em xin ghi nhận toàn bộ phản ánh của anh/chị về tình hình lớp học của bé {studentName}. Em cam kết sẽ trực tiếp làm việc lại với các bộ phận liên quan để làm rõ việc này.'
          }
        ],
        responses: [
          {
            id: 'emg_q_ack',
            text: 'Phụ huynh bớt nóng giận',
            appendNote: 'Đã lắng nghe khiếu nại chất lượng học tập. Phụ huynh đồng ý cho trung tâm kiểm tra lại.',
          },
          {
            id: 'emg_q_angry',
            text: 'Phụ huynh vẫn rất gay gắt',
            appendNote: 'Phụ huynh cực kỳ giận dữ, yêu cầu gặp quản lý cấp cao lập tức.',
            objectionHandling: 'Dạ anh/chị ơi, em xin phép được ghi nhận yêu cầu này và xin lịch hẹn trong vòng tối đa 2 tiếng nữa quản lý chi nhánh của bên em sẽ gọi điện trực tiếp để làm việc và đưa ra phương án giải quyết cụ thể cho anh/chị nhé ạ!'
          }
        ]
      },
      {
        id: 'emg_q_step2',
        label: '2. Đề xuất phương án cứu vãn',
        segments: [
          {
            goalTitle: 'Mục tiêu: Giữ chân học viên qua đề xuất giải pháp thay thế',
            dialogue: 'Dạ để khắc phục ngay tình hình học của con {studentName}, em xin phép được đề xuất chuyển con sang học thử 2 buổi tại lớp thầy/cô {nextLevel} có sĩ số ít hơn và phương pháp phù hợp hơn để con lấy lại hứng thú.'
          },
          {
            goalTitle: 'Mục tiêu: Cam kết hỗ trợ đặc biệt (kèm cặp 1-1)',
            dialogue: 'Bên cạnh đó, trung tâm sẽ cử riêng một bạn Trợ giảng kèm cặp 1-1 miễn phí cho con trong 3 buổi tiếp theo để bổ trợ những phần kiến thức con đang bị hổng ạ.'
          }
        ],
        responses: [
          {
            id: 'emg_q_accept_solution',
            text: 'Đồng ý thử phương án mới',
            appendNote: 'Phụ huynh đồng ý chuyển lớp trải nghiệm mới và nhận hỗ trợ kèm 1-1.',
            objectionHandling: 'Dạ em cảm ơn anh/chị đã cho trung tâm cơ hội được khắc phục sai sót. Em sẽ lên lịch và báo cáo tiến trình học của con sau mỗi buổi ạ!'
          },
          {
            id: 'emg_q_insist_refund',
            text: 'Kiên quyết đòi rút phí',
            appendNote: 'Phụ huynh kiên quyết không đồng ý giải pháp chuyển lớp, đòi hoàn trả tiền.',
            objectionHandling: 'Dạ thưa anh/chị, về thủ tục rút phí, theo quy định vận hành của trung tâm sẽ cần bộ phận kế toán rà soát số buổi con đã học để đối chiếu. Em xin phép gửi thông tin này lên Ban giám đốc phê duyệt và sẽ liên hệ lại báo cáo kết quả cụ thể cho anh/chị vào trước 17h chiều mai ạ.'
          }
        ]
      },
      {
        id: 'emg_q_step3',
        label: '3. Kết thúc & Hẹn lịch',
        segments: [
          {
            goalTitle: 'Mục tiêu: Xác nhận thời gian phản hồi tiếp theo',
            dialogue: 'Em đã lập phiếu xử lý sự cố khẩn cấp và chuyển trực tiếp tới Ban giám đốc chi nhánh. Em xin cam kết sẽ chủ động liên hệ lại gửi thông tin phản hồi cho anh/chị {parentName} trước thời hạn đã hẹn ạ.'
          },
          {
            goalTitle: 'Mục tiêu: Lời cảm ơn và xin lỗi chân thành',
            dialogue: 'Một lần nữa em chân thành xin lỗi anh/chị về sự cố lần này và cảm ơn anh/chị đã phản ánh để bên em hoàn thiện dịch vụ tốt hơn ạ.'
          }
        ],
        responses: [
          {
            id: 'emg_q_close',
            text: 'Gác máy hòa nhã',
            appendNote: 'Hoàn tất bước xử lý ban đầu cuộc gọi khiếu nại gay gắt đòi hoàn phí.',
          }
        ]
      }
    ]
  },
  {
    id: 'emg_safety_incident',
    title: 'Khẩn cấp: Sự cố sức khỏe / An toàn tại trung tâm',
    description: 'Quy trình liên hệ phụ huynh khẩn cấp khi học viên gặp sự cố sức khỏe, chấn thương hoặc va chạm tại trung tâm',
    menuId: 'emergency_safety',
    isEmergency: true,
    steps: [
      {
        id: 'emg_s_step1',
        label: '1. Thông báo tình trạng hiện tại',
        segments: [
          {
            goalTitle: 'Mục tiêu: Thông báo bình tĩnh, rõ ràng, tránh gây hoảng loạn',
            dialogue: 'Dạ em chào anh/chị {parentName}, em là giáo vụ tại trung tâm Rinov5 chi nhánh {branchName} gọi điện thông báo gấp về tình hình của bé {studentName} ạ.'
          },
          {
            goalTitle: 'Mục tiêu: Mô tả ngắn gọn sự cố và biện pháp sơ cứu đang thực hiện',
            dialogue: 'Dạ trong giờ ra chơi con sơ ý bị vấp ngã/nhiệt độ sốt cao đột xuất. Hiện tại con đã được đưa vào phòng y tế của trung tâm. Thầy cô và nhân viên y tế đã thực hiện sơ cứu ban đầu, con đã tỉnh táo và ổn định hơn rồi ạ.'
          }
        ],
        responses: [
          {
            id: 'emg_s_ph_coming',
            text: 'Phụ huynh qua ngay',
            appendNote: 'Phụ huynh đang di chuyển gấp tới trung tâm để đón con.',
          },
          {
            id: 'emg_s_ph_hospital',
            text: 'Yêu cầu đưa đi bệnh viện',
            appendNote: 'Phụ huynh yêu cầu trung tâm chuyển con ra bệnh viện gần nhất ngay lập tức.',
            objectionHandling: 'Dạ vâng ạ, nhân viên y tế và quản lý chi nhánh của trung tâm đang chuẩn bị đưa con di chuyển sang Bệnh viện gần nhất bằng xe cứu thương/taxi. Em xin gửi địa chỉ bệnh viện qua Zalo và cập nhật trạng thái liên tục cho mình nhé!'
          }
        ]
      },
      {
        id: 'emg_s_step2',
        label: '2. Phối hợp giải quyết & Trấn an',
        segments: [
          {
            goalTitle: 'Mục tiêu: Trấn an phụ huynh về sự có mặt của thầy cô',
            dialogue: 'Anh/chị cứ bình tĩnh di chuyển nhé ạ. Tại trung tâm luôn có giáo viên chủ nhiệm và quản lý túc trực ở cạnh để chăm sóc và động viên con liên tục nên anh/chị hoàn toàn yên tâm.'
          },
          {
            goalTitle: 'Mục tiêu: Hướng dẫn điểm đón khi phụ huynh đến',
            dialogue: 'Khi anh/chị đến trung tâm, vui lòng đỗ xe ở sảnh và đi thẳng lên Phòng Y Tế ở tầng lửng, nhân viên bảo vệ đã được thông báo để dẫn anh/chị vào ngay ạ.'
          }
        ],
        responses: [
          {
            id: 'emg_s_ph_arrived',
            text: 'Phụ huynh đã ghi nhận',
            appendNote: 'Phụ huynh ghi nhận hướng dẫn đón con.',
          }
        ]
      }
    ]
  },
  {
    id: 'emg_teacher_absence',
    title: 'Khẩn cấp: Giáo viên nghỉ đột xuất sát giờ học',
    description: 'Quy trình gọi điện thông báo hủy lớp hoặc thay đổi giáo viên sát giờ học do sự cố giáo viên nghỉ đột xuất',
    menuId: 'emergency_teacher',
    isEmergency: true,
    steps: [
      {
        id: 'emg_t_step1',
        label: '1. Thông báo sự cố lớp học',
        segments: [
          {
            goalTitle: 'Mục tiêu: Thông báo lời lỗi chân thành',
            dialogue: 'Dạ em chào anh/chị {parentName}, em gọi điện từ phòng Đào tạo Rinov5 gửi lời xin lỗi chân thành tới gia đình mình ạ.'
          },
          {
            goalTitle: 'Mục tiêu: Nêu sự cố giáo viên nghỉ và đề xuất phương án thay thế',
            dialogue: 'Do thầy/cô giáo phụ trách lớp bé {studentName} hôm nay gặp sự cố sức khỏe đột xuất sát giờ học. Để đảm bảo chất lượng, trung tâm đã sắp xếp thầy/cô {nextLevel} thay thế để dạy buổi học hôm nay / xin phép tạm hoãn buổi học sang lịch học bù để đảm bảo con không bị mất bài ạ.'
          }
        ],
        responses: [
          {
            id: 'emg_t_agree_sub',
            text: 'Đồng ý giáo viên thay thế',
            appendNote: 'Phụ huynh đồng ý cho con học với giáo viên thay thế.',
          },
          {
            id: 'emg_t_cancel_class',
            text: 'Không đồng ý, đòi nghỉ học',
            appendNote: 'Phụ huynh không đồng ý giáo viên thay thế, yêu cầu cho con nghỉ buổi học hôm nay.',
            objectionHandling: 'Dạ em rất hiểu sự bất tiện này của mình. Em xin phép ghi nhận cho bé {studentName} nghỉ buổi hôm nay và sẽ xếp lịch học bù riêng miễn phí 1-1 cho con vào khung giờ thuận tiện nhất của gia đình mình tuần tới nhé ạ.'
          }
        ]
      },
      {
        id: 'emg_t_step2',
        label: '2. Xác nhận lịch học bù & Cảm ơn',
        segments: [
          {
            goalTitle: 'Mục tiêu: Cam kết gửi thông báo bằng văn bản',
            dialogue: 'Chi tiết lịch học bù/thông báo đổi giáo viên em xin phép gửi bằng văn bản qua tin nhắn Zalo kèm bài tập chuẩn bị cho con ngay sau cuộc gọi này ạ.'
          },
          {
            goalTitle: 'Mục tiêu: Cảm ơn sự thông cảm của phụ huynh',
            dialogue: 'Em chân thành cảm ơn sự thông cảm và đồng hành của anh/chị dành cho trung tâm. Chúc anh/chị và con buổi tối vui vẻ ạ.'
          }
        ],
        responses: [
          {
            id: 'emg_t_close',
            text: 'Chào kết thúc',
            appendNote: 'Hoàn tất gọi xử lý sự cố giáo viên vắng mặt đột xuất.',
          }
        ]
      }
    ]
  }
]

export function getScriptByMenuId(menuId: string | null): CallScript {
  if (!menuId) return mockCallScripts[3] // General care script is default
  
  // Normalize menuId
  const normalized = menuId.replace('_v2', '').replace('-v2', '')
  
  if (normalized === 'booking_test') {
    return mockCallScripts[0]
  }
  if (normalized === 'trial_class') {
    return mockCallScripts[1]
  }
  
  // Check direct matches (including emergencies)
  const found = mockCallScripts.find(s => s.menuId === menuId || s.id === menuId)
  if (found) return found
  
  return mockCallScripts[3] // Fallback to General Care
}
