import type { StudentFormState } from './classesBulkFeedbackTypes'

export interface GenerateFeedbackOptions {
  isMath: boolean
  sessionTopic?: string
  classLevel?: string
}

export function generateAIFeedback(
  currentFormState: StudentFormState,
  options: GenerateFeedbackOptions
): string {
  const { isMath, sessionTopic = '', classLevel = '' } = options

  if (isMath) {
    const isFriendly =
      currentFormState.tone === 'friendly' ||
      currentFormState.tone === 'Vui vẻ, hào hứng' ||
      !currentFormState.tone

    const topicLine = `- Luyện tập chủ đề: ${
      sessionTopic || (classLevel ? `${classLevel}` : 'Math Kindi — Phép trừ trong phạm vi 10')
    } 📐`

    // Homework bullet
    let hwBullet = ''
    const app = currentFormState.homeworkApp
    const book = currentFormState.homeworkBook
    const isAppDone = app === 'Hoàn thành' || app === 'Done'
    const isBookDone = book === 'Hoàn thành' || book === 'Done'
    const isAppPartly = app === 'Hoàn thành 1 phần' || app === 'Partly Done'
    const isBookPartly = book === 'Hoàn thành 1 phần' || book === 'Partly Done'
    const isAppNone = app === 'Không có' || app === 'No Homework'
    const isBookNone = book === 'Không có' || book === 'No Homework'
    const isAppNotYet = app === 'Chưa làm' || app === 'Not Yet'
    const isBookNotYet = book === 'Chưa làm' || book === 'Not Yet'

    if (isFriendly) {
      if (isAppDone && isBookDone) {
        hwBullet = `- Con đã hoàn thành xuất sắc bài tập trên ứng dụng và sách bài tập - rất đáng khen! 👑`
      } else if (isAppNone && isBookNone) {
        // No homework
      } else if (isAppDone && isBookPartly) {
        hwBullet = `- Con hoàn thành xuất sắc bài tập trên app và hoàn thành một phần bài tập trong sách - rất đáng khen! 🌟`
      } else if (isAppDone) {
        hwBullet = `- Con đã hoàn thành bài tập trên ứng dụng rất tốt! 🌟`
      } else if (isBookDone) {
        hwBullet = `- Con đã hoàn thành bài tập trong sách rất tốt! 🌟`
      } else if (isAppPartly || isBookPartly) {
        hwBullet = `- Con đã hoàn thành một phần bài tập về nhà. Con cố gắng làm đầy đủ hơn ở buổi học tới nhé! 📝`
      } else if (isAppNotYet || isBookNotYet) {
        hwBullet = `- Con chú ý hoàn thành bài tập về nhà trước buổi học tới nhé! ⏰`
      }
    } else {
      if (isAppDone && isBookDone) {
        hwBullet = `- Học viên hoàn thành đầy đủ bài tập trên ứng dụng và sách bài tập.`
      } else if (isAppNone && isBookNone) {
        // No homework
      } else {
        hwBullet = `- Tình hình làm bài tập: Ứng dụng (${app || 'Chưa làm'}), Sách (${book || 'Chưa làm'}).`
      }
    }

    // Outstanding achievements (Thành tích nổi bật)
    const achievements: string[] = []
    if (hwBullet) achievements.push(hwBullet)

    // 1. Tư duy cơ bản
    const basicVal = currentFormState.mathBasic
    if (basicVal !== undefined) {
      if (basicVal >= 4) {
        achievements.push(
          isFriendly
            ? `- Khả năng quan sát nhanh nhạy, tập trung tốt và ghi nhớ kiến thức rất chắc (${basicVal}/5) 🧠`
            : `- Năng lực tư duy cơ bản (quan sát, tập trung, ghi nhớ) đạt kết quả tốt (${basicVal}/5).`
        )
      } else if (basicVal === 3) {
        achievements.push(
          isFriendly
            ? `- Khả năng quan sát và mức độ tập trung trong giờ đạt yêu cầu (${basicVal}/5) 🧠`
            : `- Năng lực quan sát và khả năng tập trung đạt mức cơ bản (${basicVal}/5).`
        )
      }
    }
    if (currentFormState.mathBasicStrength) {
      achievements.push(
        isFriendly
          ? `- Điểm tốt về tư duy cơ bản: ${currentFormState.mathBasicStrength} ✨`
          : `- Thế mạnh về tư duy cơ bản: ${currentFormState.mathBasicStrength}.`
      )
    }

    // 2. Tư duy logic
    const logicVal = currentFormState.mathLogic
    if (logicVal !== undefined) {
      if (logicVal >= 4) {
        achievements.push(
          isFriendly
            ? `- Phân tích, tổng hợp vấn đề tốt và biết liên hệ thực tiễn nhanh nhạy (${logicVal}/5) 🧩`
            : `- Năng lực tư duy logic, phân tích vấn đề và liên hệ thực tiễn đạt kết quả tốt (${logicVal}/5).`
        )
      } else if (logicVal === 3) {
        achievements.push(
          isFriendly
            ? `- Khả năng phân tích và tổng hợp vấn đề đạt yêu cầu (${logicVal}/5) 🧩`
            : `- Năng lực phân tích và tổng hợp vấn đề đạt mức cơ bản (${logicVal}/5).`
        )
      }
    }
    if (currentFormState.mathLogicStrength) {
      achievements.push(
        isFriendly
          ? `- Điểm tốt về tư duy logic: ${currentFormState.mathLogicStrength} 💡`
          : `- Thế mạnh về tư duy logic: ${currentFormState.mathLogicStrength}.`
      )
    }

    // 3. Tư duy Toán học
    const mathVal = currentFormState.mathMath ?? currentFormState.mathArithmetic
    const mathStrength =
      currentFormState.mathMathStrength || currentFormState.mathArithmeticStrength
    if (mathVal !== undefined) {
      if (mathVal >= 4) {
        achievements.push(
          isFriendly
            ? `- Nắm chắc Số học, Hình học, Đo lường và Thống kê xác suất (${mathVal}/5) 🔢`
            : `- Năng lực tư duy toán học (Số & phép tính, Hình học, Đo lường, Thống kê) đạt kết quả tốt (${mathVal}/5).`
        )
      } else if (mathVal === 3) {
        achievements.push(
          isFriendly
            ? `- Nắm kiến thức số học và hình học đạt yêu cầu (${mathVal}/5) 🔢`
            : `- Kiến thức số học và hình học đạt mức cơ bản (${mathVal}/5).`
        )
      }
    }
    if (mathStrength) {
      achievements.push(
        isFriendly
          ? `- Điểm tốt về tư duy toán học: ${mathStrength} 📐`
          : `- Thế mạnh về tư duy toán học: ${mathStrength}.`
      )
    }

    // 4. Tư duy sáng tạo
    const creativeVal = currentFormState.mathCreative
    if (creativeVal !== undefined) {
      if (creativeVal >= 4) {
        achievements.push(
          isFriendly
            ? `- Khả năng sáng tạo nổi bật, dám nghĩ khác - làm khác khi giải bài (${creativeVal}/5) 💡`
            : `- Thể hiện tư duy sáng tạo khác biệt và linh hoạt trong hướng giải (${creativeVal}/5).`
        )
      } else if (creativeVal === 3) {
        achievements.push(
          isFriendly
            ? `- Có tinh thần tìm tòi cách giải mới đạt yêu cầu (${creativeVal}/5) 💡`
            : `- Khả năng tư duy linh hoạt đạt mức cơ bản (${creativeVal}/5).`
        )
      }
    }
    if (currentFormState.mathCreativeStrength) {
      achievements.push(
        isFriendly
          ? `- Điểm tốt về tư duy sáng tạo: ${currentFormState.mathCreativeStrength} 🌟`
          : `- Thế mạnh về tư duy sáng tạo: ${currentFormState.mathCreativeStrength}.`
      )
    }

    // 5. Tư duy phản biện và giải quyết vấn đề
    const criticalVal = currentFormState.mathCritical ?? currentFormState.evaluation
    const criticalStrength = currentFormState.mathCriticalStrength || currentFormState.strength
    if (criticalVal !== undefined) {
      if (criticalVal >= 4) {
        achievements.push(
          isFriendly
            ? `- Tự tin chia sẻ, bảo vệ ý kiến, thuyết trình tốt và giải quyết vấn đề hiệu quả (${criticalVal}/5) 🎯`
            : `- Năng lực phản biện, thuyết trình và giải quyết vấn đề sáng tạo đạt kết quả tốt (${criticalVal}/5).`
        )
      } else if (criticalVal === 3) {
        achievements.push(
          isFriendly
            ? `- Có tinh thần chia sẻ ý kiến và phối hợp giải quyết bài tập (${criticalVal}/5) 🎯`
            : `- Khả năng trình bày và bảo vệ ý kiến đạt mức cơ bản (${criticalVal}/5).`
        )
      }
    }
    if (criticalStrength) {
      achievements.push(
        isFriendly
          ? `- Điểm tốt về phản biện & giải quyết vấn đề: ${criticalStrength} 🗣️`
          : `- Thế mạnh về phản biện và giải quyết vấn đề: ${criticalStrength}.`
      )
    }

    // Attitude (Thái độ học tập)
    const attVal = currentFormState.attitude || 3
    if (attVal >= 4) {
      achievements.push(
        isFriendly
          ? `- Thái độ học tập tích cực, tập trung nghe giảng và hăng hái phát biểu (${attVal}/5) 🌟`
          : `- Thái độ học tập nghiêm túc, tập trung và tích cực xây dựng bài (${attVal}/5).`
      )
    } else {
      achievements.push(
        isFriendly
          ? `- Con có tinh thần tham gia bài học trong lớp (${attVal}/5) 🌟`
          : `- Học viên có thái độ học tập đạt yêu cầu (${attVal}/5).`
      )
    }

    // Improvements (Mục tiêu cần cải thiện)
    const improvements: string[] = []
    // 1. Basic
    if (basicVal !== undefined && basicVal < 3) {
      improvements.push(
        isFriendly
          ? `- Con cần rèn luyện thêm sự tập trung và khả năng quan sát, ghi nhớ trong giờ (${basicVal}/5) 🎯`
          : `- Cần cải thiện mức độ tập trung, khả năng quan sát và ghi nhớ (${basicVal}/5).`
      )
    }
    if (currentFormState.mathBasicWeakness) {
      improvements.push(
        isFriendly
          ? `- Cần chú ý về tư duy cơ bản: ${currentFormState.mathBasicWeakness} 🎯`
          : `- Phần cần cải thiện về tư duy cơ bản: ${currentFormState.mathBasicWeakness}.`
      )
    }

    // 2. Logic
    if (logicVal !== undefined && logicVal < 3) {
      improvements.push(
        isFriendly
          ? `- Con cần rèn luyện thêm kỹ năng phân tích, xâu chuỗi dữ kiện bài toán (${logicVal}/5) 🎯`
          : `- Cần củng cố thêm kỹ năng phân tích và tổng hợp vấn đề (${logicVal}/5).`
      )
    }
    if (currentFormState.mathLogicWeakness) {
      improvements.push(
        isFriendly
          ? `- Cần chú ý về tư duy logic: ${currentFormState.mathLogicWeakness} 🎯`
          : `- Phần cần cải thiện về tư duy logic: ${currentFormState.mathLogicWeakness}.`
      )
    }

    // 3. Math
    const mathWeakness =
      currentFormState.mathMathWeakness || currentFormState.mathArithmeticWeakness
    if (mathVal !== undefined && mathVal < 3) {
      improvements.push(
        isFriendly
          ? `- Con chú ý rèn luyện thêm các phép tính, nhận diện hình khối và đo lường (${mathVal}/5) 🎯`
          : `- Cần ôn tập và củng cố thêm các mạch kiến thức toán học (${mathVal}/5).`
      )
    }
    if (mathWeakness) {
      improvements.push(
        isFriendly
          ? `- Cần chú ý về tư duy toán học: ${mathWeakness} 🎯`
          : `- Phần cần cải thiện về tư duy toán học: ${mathWeakness}.`
      )
    }

    // 4. Creative
    if (creativeVal !== undefined && creativeVal < 3) {
      improvements.push(
        isFriendly
          ? `- Khuyến khích con tự tin thử nghiệm thêm nhiều cách làm mới mẻ (${creativeVal}/5) 🎯`
          : `- Cần khuyến khích học viên chủ động tìm tòi các cách giải sáng tạo (${creativeVal}/5).`
      )
    }
    if (currentFormState.mathCreativeWeakness) {
      improvements.push(
        isFriendly
          ? `- Cần chú ý về tư duy sáng tạo: ${currentFormState.mathCreativeWeakness} 🎯`
          : `- Phần cần cải thiện về tư duy sáng tạo: ${currentFormState.mathCreativeWeakness}.`
      )
    }

    // 5. Critical & Problem Solving
    const criticalWeakness = currentFormState.mathCriticalWeakness || currentFormState.weakness
    if (criticalVal !== undefined && criticalVal < 3) {
      improvements.push(
        isFriendly
          ? `- Con cần tự tin hơn khi thuyết trình và trình bày, bảo vệ quan điểm (${criticalVal}/5) 🎯`
          : `- Cần rèn luyện thêm kỹ năng thuyết trình và tự tin bảo vệ ý kiến (${criticalVal}/5).`
      )
    }
    if (criticalWeakness) {
      improvements.push(
        isFriendly
          ? `- Cần chú ý về phản biện & GQVĐ: ${criticalWeakness} 🎯`
          : `- Phần cần cải thiện về phản biện và giải quyết vấn đề: ${criticalWeakness}.`
      )
    }

    // Attitude
    if (attVal < 4) {
      improvements.push(
        isFriendly
          ? `- Con chú ý tập trung hơn trong giờ học và tương tác sôi nổi hơn cùng thầy cô (${attVal}/5) ✨`
          : `- Cần tập trung hơn trong giờ học và tăng cường tương tác (${attVal}/5).`
      )
    }
    if (improvements.length === 0) {
      improvements.push(
        isFriendly
          ? `- Tiếp tục phát huy các kỹ năng và tinh thần học tập hiện tại.`
          : `- Duy trì phong độ và tiếp tục phát huy ở các bài học tiếp theo.`
      )
    }

    // Other notes
    const otherNote = currentFormState.otherNotes
      ? `\n\n📌 Ghi chú: ${currentFormState.otherNotes}`
      : ''

    // Reminders
    const reminderLines = [...(currentFormState.reminders || [])]
    if (currentFormState.otherReminder) {
      reminderLines.push(currentFormState.otherReminder)
    }
    const reminderSection =
      reminderLines.length > 0
        ? `\n\n🔔 Nhắc nhở:\n${reminderLines.map((r) => `- ${r}`).join('\n')}`
        : ''

    return `${topicLine}

🏆 Thành tích nổi bật:
${achievements.join('\n')}

🌱 Mục tiêu cần cải thiện:
${improvements.join('\n')}${otherNote}${reminderSection}`
  }

  // English generation logic
  const isFriendly = currentFormState.tone === 'friendly'

  const introLine = isFriendly
    ? `- Luyện tập cấu trúc hỏi đáp: ${sessionTopic} 🧠`
    : `- Học viên đã hoàn thành nội dung bài học: ${sessionTopic}.`

  let hwSuccessBullet = ''
  let hwNeedsWorkBullet = ''
  const app = currentFormState.homeworkApp
  const book = currentFormState.homeworkBook

  if (isFriendly) {
    if (app === 'Done' && book === 'Done') {
      hwSuccessBullet = `- Con đã hoàn thành xuất sắc bài tập trên ứng dụng và sách Workbook – rất đáng khen! 🌟`
    } else if (app === 'No Homework' && book === 'No Homework') {
      // No homework
    } else {
      const appPart =
        app === 'Done'
          ? 'đã làm xong bài tập trên app 🌟'
          : app === 'Partly Done'
            ? 'hoàn thành một phần bài tập trên app 📝'
            : app === 'Not Yet'
              ? 'chưa làm bài tập trên app ❌'
              : 'không có bài tập app'
      const bookPart =
        book === 'Done'
          ? 'đã làm xong sách Workbook ⭐'
          : book === 'Partly Done'
            ? 'hoàn thành một phần sách Workbook 📝'
            : book === 'Not Yet'
              ? 'chưa làm sách Workbook ❌'
              : 'không có bài tập Workbook'

      if (
        app === 'Not Yet' ||
        book === 'Not Yet' ||
        app === 'Partly Done' ||
        book === 'Partly Done'
      ) {
        hwNeedsWorkBullet = `- Về bài tập: Con ${appPart} và ${bookPart}. Con cố gắng hoàn thành đầy đủ hơn ở buổi học tới nhé! 🎯`
      } else {
        hwSuccessBullet = `- Về bài tập: Con ${appPart} và ${bookPart}.`
      }
    }
  } else {
    if (app === 'Done' && book === 'Done') {
      hwSuccessBullet = `- Học viên đã hoàn thành đầy đủ bài tập trên ứng dụng và sách bài tập (Workbook).`
    } else if (app === 'No Homework' && book === 'No Homework') {
      // No homework
    } else {
      const appPart =
        app === 'Done'
          ? 'Hoàn thành'
          : app === 'Partly Done'
            ? 'Hoàn thành một phần'
            : app === 'Not Yet'
              ? 'Chưa hoàn thành'
              : 'Không có'
      const bookPart =
        book === 'Done'
          ? 'Hoàn thành'
          : book === 'Partly Done'
            ? 'Hoàn thành một phần'
            : book === 'Not Yet'
              ? 'Chưa hoàn thành'
              : 'Không có'
      const statusStr = `- Tình hình làm bài tập: Ứng dụng (${appPart}), Sách Workbook (${bookPart}).`
      if (app === 'Not Yet' || book === 'Not Yet') {
        hwNeedsWorkBullet = statusStr
      } else {
        hwSuccessBullet = statusStr
      }
    }
  }

  const strengthsList: string[] = []
  const improvementsList: string[] = []

  // Vocabulary
  const vocVal = currentFormState.vocabulary || 4
  let vocText = isFriendly
    ? `- Con ghi nhớ tốt từ vựng về ngữ âm và bài học (${vocVal}/5) 🧠`
    : `- Khả năng ghi nhớ từ vựng đạt kết quả tốt (${vocVal}/5).`
  if (vocVal < 4) {
    vocText = isFriendly
      ? `- Con cần dành thêm thời gian ôn tập từ vựng để phản xạ nhanh hơn (${vocVal}/5) 🧠`
      : `- Cần củng cố thêm vốn từ vựng (${vocVal}/5).`
  }
  if (currentFormState.vocabGoodNotes) {
    vocText += `\n  + Điểm tốt: ${currentFormState.vocabGoodNotes}`
  }
  if (currentFormState.vocabImproveNotes) {
    vocText += `\n  + Cần lưu ý: ${currentFormState.vocabImproveNotes}`
  }
  if (vocVal >= 4) {
    strengthsList.push(vocText)
  } else {
    improvementsList.push(vocText)
  }

  // Grammar
  const graVal = currentFormState.grammar || 4
  let graText = isFriendly
    ? `- Con sử dụng tốt cấu trúc câu tương tác (${graVal}/5) 🎯`
    : `- Áp dụng cấu trúc ngữ pháp đạt yêu cầu (${graVal}/5).`
  if (graVal < 4) {
    graText = isFriendly
      ? `- Con chú ý hơn khi áp dụng cấu trúc ngữ pháp để tránh lỗi nhỏ (${graVal}/5) 🎯`
      : `- Cần luyện tập thêm các cấu trúc ngữ pháp đã học (${graVal}/5).`
  }
  if (currentFormState.grammarGoodNotes) {
    graText += `\n  + Điểm tốt: ${currentFormState.grammarGoodNotes}`
  }
  if (currentFormState.grammarImproveNotes) {
    graText += `\n  + Cần lưu ý: ${currentFormState.grammarImproveNotes}`
  }
  if (graVal >= 4) {
    strengthsList.push(graText)
  } else {
    improvementsList.push(graText)
  }

  // Speaking
  const speVal = currentFormState.speaking || 4
  let speText = isFriendly
    ? `- Kỹ năng nói trôi chảy, tự tin giao tiếp (${speVal}/5) ✨`
    : `- Kỹ năng nói và tương tác trong giờ học tốt (${speVal}/5).`
  if (speVal < 4) {
    speText = isFriendly
      ? `- Con cố gắng tự tin nói to và rõ ràng hơn nữa khi giao tiếp (${speVal}/5) ✨`
      : `- Cần chủ động tương tác nói nhiều hơn trong giờ học (${speVal}/5).`
  }
  if (currentFormState.speakingGoodNotes) {
    speText += `\n  + Điểm tốt: ${currentFormState.speakingGoodNotes}`
  }
  if (currentFormState.speakingImproveNotes) {
    speText += `\n  + Cần lưu ý: ${currentFormState.speakingImproveNotes}`
  }
  if (speVal >= 4) {
    strengthsList.push(speText)
  } else {
    improvementsList.push(speText)
  }

  // Pronunciation
  const proVal = currentFormState.pronunciation || 4
  let proText = isFriendly
    ? `- Phát âm chuẩn và rõ ràng các âm tiết (${proVal}/5) 🗣️`
    : `- Kỹ năng phát âm từ vựng tương đối chuẩn xác (${proVal}/5).`
  if (proVal < 4) {
    proText = isFriendly
      ? `- Con cần chú ý phát âm rõ các âm đuôi và ngữ điệu câu (${proVal}/5) 🗣️`
      : `- Cần chú ý luyện tập phát âm chuẩn xác hơn (${proVal}/5).`
  }
  if (currentFormState.pronGoodNotes) {
    proText += `\n  + Điểm tốt: ${currentFormState.pronGoodNotes}`
  }
  if (currentFormState.pronImproveNotes) {
    proText += `\n  + Cần lưu ý: ${currentFormState.pronImproveNotes}`
  }
  if (proVal >= 4) {
    strengthsList.push(proText)
  } else {
    improvementsList.push(proText)
  }

  // Attitude
  const attVal = currentFormState.attitude || 4
  if (attVal >= 4) {
    strengthsList.push(
      isFriendly
        ? `- Thái độ học tập tích cực, tập trung nghe giảng và hăng hái phát biểu (${attVal}/5) 🌟`
        : `- Thái độ học tập trong lớp tích cực, chủ động tương tác với giáo viên (${attVal}/5).`
    )
  } else {
    improvementsList.push(
      isFriendly
        ? `- Con cần tập trung hơn trong giờ học và hạn chế làm việc riêng (${attVal}/5) 🎯`
        : `- Cần nâng cao thái độ tự giác và sự tập trung trong giờ học (${attVal}/5).`
    )
  }

  // General Highlights (strength / Điểm nổi bật)
  if (currentFormState.strength) {
    strengthsList.push(
      isFriendly
        ? `- Điểm nổi bật: ${currentFormState.strength} ✨`
        : `- Điểm nổi bật: ${currentFormState.strength}.`
    )
  }

  const strengthBullets = [hwSuccessBullet, ...strengthsList].filter(Boolean).join('\n')
  const strengthSection = strengthBullets
    ? `🏅 Thành tích nổi bật:\n${strengthBullets}`
    : '🏅 Thành tích nổi bật:\n- Học viên hoàn thành tốt các mục tiêu bài học.'

  // General Points to Note (weakness / Điểm cần lưu ý)
  if (currentFormState.weakness) {
    improvementsList.push(
      isFriendly
        ? `- Điểm cần lưu ý: ${currentFormState.weakness} 💡`
        : `- Điểm cần lưu ý: ${currentFormState.weakness}.`
    )
  }

  const improvementBullets = [hwNeedsWorkBullet, ...improvementsList].filter(Boolean).join('\n')

  let otherNoteBullet = ''
  if (currentFormState.otherNotes && !currentFormState.strength && !currentFormState.weakness) {
    otherNoteBullet = isFriendly
      ? `- Ghi chú: ${currentFormState.otherNotes} 📝`
      : `- Ghi chú thêm: ${currentFormState.otherNotes}`
  }

  const improvementSection = [improvementBullets, otherNoteBullet].filter(Boolean).join('\n')
  const finalImprovementSection = improvementSection
    ? `🌱 Mục tiêu cần cải thiện:\n${improvementSection}`
    : '🌱 Mục tiêu cần cải thiện:\n- Tiếp tục phát huy các kỹ năng hiện tại.'

  const reminderLines = [...currentFormState.reminders]
  if (currentFormState.otherReminder) {
    reminderLines.push(currentFormState.otherReminder)
  }
  const reminderText =
    reminderLines.length > 0
      ? `\n\n🔔 Nhắc nhở nhỏ xíu:\n${reminderLines.map((r) => `- ${r}`).join('\n')}`
      : ''

  return `${introLine}

${strengthSection}

${finalImprovementSection}${reminderText}`
}
