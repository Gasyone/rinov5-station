export interface SemesterStudentEval {
  // conduct
  conductRating: number
  conductAttendance: 'full' | 'not_full' | ''
  conductPunctual: 'on_time' | 'late' | ''
  conductHw: 'done' | 'not_done' | ''
  conductFocus: 'focus' | 'distracted' | ''
  conductActive: 'active' | 'passive' | ''

  // knowledge
  knowledgeRating: number
  vocabLevel: 'rich' | 'basic' | 'needs_improvement' | ''
  vocabLearned: string
  vocabNotLearned: string
  grammarLevel: 'proficient' | 'basic' | 'needs_improvement' | ''
  grammarLearned: string
  grammarNotLearned: string

  // skills
  skillsRating: number
  listeningReaction: 'good' | 'slow' | ''
  listeningPractice: 'proficient' | 'needs_practice' | ''
  speakingVolume: 'loud' | 'soft' | ''
  speakingPronunciation: 'correct' | 'incorrect' | ''
  speakingFluency: 'fluent' | 'hesitant' | ''
  readingComprehension: 'good' | 'needs_improvement' | ''
  readingDetail: 'good' | 'poor' | ''
  writingSpelling: 'correct' | 'incorrect' | ''
  writingVocab: 'rich' | 'limited' | ''
  writingExpression: 'clear' | 'unclear' | ''
  writingGrammar: 'correct' | 'incorrect' | ''

  // interaction
  interactionRating: number
  interClassActivity: 'active' | 'inactive' | ''
  interFocus: 'attentive' | 'inattentive' | ''
  interContribution: 'voluntary' | 'forced' | ''

  isSubmitted: boolean
  generatedFeedback?: string
  tone?: 'friendly' | 'formal' | 'cheerful'
}

export const DEFAULT_EVAL: SemesterStudentEval = {
  conductRating: 4,
  conductAttendance: 'full',
  conductPunctual: 'on_time',
  conductHw: 'done',
  conductFocus: 'focus',
  conductActive: 'active',

  knowledgeRating: 4,
  vocabLevel: 'rich',
  vocabLearned: '',
  vocabNotLearned: '',
  grammarLevel: 'proficient',
  grammarLearned: '',
  grammarNotLearned: '',

  skillsRating: 4,
  listeningReaction: 'good',
  listeningPractice: 'proficient',
  speakingVolume: 'loud',
  speakingPronunciation: 'correct',
  speakingFluency: 'fluent',
  readingComprehension: 'good',
  readingDetail: 'good',
  writingSpelling: 'correct',
  writingVocab: 'rich',
  writingExpression: 'clear',
  writingGrammar: 'correct',

  interactionRating: 4,
  interClassActivity: 'active',
  interFocus: 'attentive',
  interContribution: 'voluntary',

  isSubmitted: false,
  tone: 'friendly',
  generatedFeedback: '',
}

export const EMPTY_EVAL: SemesterStudentEval = {
  conductRating: 0,
  conductAttendance: '',
  conductPunctual: '',
  conductHw: '',
  conductFocus: '',
  conductActive: '',

  knowledgeRating: 0,
  vocabLevel: '',
  vocabLearned: '',
  vocabNotLearned: '',
  grammarLevel: '',
  grammarLearned: '',
  grammarNotLearned: '',

  skillsRating: 0,
  listeningReaction: '',
  listeningPractice: '',
  speakingVolume: '',
  speakingPronunciation: '',
  speakingFluency: '',
  readingComprehension: '',
  readingDetail: '',
  writingSpelling: '',
  writingVocab: '',
  writingExpression: '',
  writingGrammar: '',

  interactionRating: 0,
  interClassActivity: '',
  interFocus: '',
  interContribution: '',

  isSubmitted: false,
  tone: 'friendly',
  generatedFeedback: '',
}

export function splitStudentName(fullName: string): { english: string; vietnamese: string } {
  const match = fullName.match(/^([^(]+)(?:\(([^)]+)\))?/)
  if (match) {
    const english = match[1].trim()
    const vietnamese = match[2] ? match[2].trim() : ''
    return { english, vietnamese }
  }
  return { english: fullName, vietnamese: '' }
}

export const getAttitudeSummary = (ev?: SemesterStudentEval) => {
  if (!ev) return 'Chưa đánh giá'
  const parts = []
  if (ev.conductAttendance === 'full') parts.push('Đi học đầy đủ')
  else if (ev.conductAttendance === 'not_full') parts.push('Chưa đi học đầy đủ')

  if (ev.conductPunctual === 'on_time') parts.push('Đúng giờ')
  else if (ev.conductPunctual === 'late') parts.push('Đi muộn')

  if (ev.conductHw === 'done') parts.push('Đủ BTVN')
  else if (ev.conductHw === 'not_done') parts.push('Thiếu BTVN')

  return parts.join(', ') || '—'
}

export const getKnowledgeSummary = (ev?: SemesterStudentEval) => {
  if (!ev) return 'Chưa đánh giá'
  const parts = []
  if (ev.vocabLevel === 'rich') parts.push('Từ vựng phong phú')
  else if (ev.vocabLevel === 'basic') parts.push('Từ vựng cơ bản')
  else if (ev.vocabLevel === 'needs_improvement') parts.push('Cần trau dồi từ vựng')

  if (ev.grammarLevel === 'proficient') parts.push('Ngữ pháp thành thạo')
  else if (ev.grammarLevel === 'basic') parts.push('Ngữ pháp cơ bản')
  else if (ev.grammarLevel === 'needs_improvement') parts.push('Cần trau dồi ngữ pháp')

  return parts.join(', ') || '—'
}

export const getSkillsSummary = (ev?: SemesterStudentEval) => {
  if (!ev) return 'Chưa đánh giá'
  const parts = []
  if (ev.listeningReaction === 'good') parts.push('Nghe phản xạ tốt')
  if (ev.speakingVolume === 'loud') parts.push('Nói to rõ')
  if (ev.readingComprehension === 'good') parts.push('Đọc hiểu tốt')
  if (ev.writingSpelling === 'correct') parts.push('Viết đúng chính tả')
  return parts.join(', ') || '—'
}

export const getInteractionSummary = (ev?: SemesterStudentEval) => {
  if (!ev) return 'Chưa đánh giá'
  const parts = []
  if (ev.interClassActivity === 'active') parts.push('Tích cực hoạt động')
  if (ev.interFocus === 'attentive') parts.push('Chăm chú nghe giảng')
  if (ev.interContribution === 'voluntary') parts.push('Chủ động phát biểu')
  return parts.join(', ') || '—'
}

export function generateSemesterFeedback(
  ev: SemesterStudentEval,
  studentName: string,
  isMath: boolean,
  sessionTopic: string
): string {
  if (isMath) {
    const attitude = ev.conductAttendance === 'full' ? 'học tập chăm chỉ, đi học đầy đủ' : 'cần cố gắng đi học đầy đủ hơn'
    const punctuality = ev.conductPunctual === 'on_time' ? 'đúng giờ' : 'còn đi học muộn'
    const hw = ev.conductHw === 'done' ? 'hoàn thành đầy đủ bài tập về nhà' : 'chưa hoàn thành đầy đủ bài tập về nhà'
    const focus = ev.conductFocus === 'focus' ? 'tập trung lắng nghe giảng' : 'còn chưa thực sự tập trung lắng nghe giảng'
    
    return `🤖 Đánh giá kết quả học tập môn Toán:
- Học viên: ${studentName}
- Chủ đề kiểm tra: ${sessionTopic}

🌟 Về thái độ và ý thức học tập:
- Con ${attitude} và tham gia lớp học ${punctuality}.
- Trong giờ học, con ${focus} và ${ev.conductActive === 'active' ? 'sôi nổi tương tác cùng thầy cô' : 'cần tích cực tham gia tương tác hơn'}.
- Tình hình làm bài tập: Con ${hw}.

🚀 Đánh giá năng lực kiến thức:
- Khả năng tiếp thu kiến thức toán học đạt ${ev.knowledgeRating}/5 sao.
- Vốn kiến thức và kỹ năng tư duy: ${ev.vocabLevel === 'rich' ? 'Phong phú và linh hoạt' : ev.vocabLevel === 'basic' ? 'Cơ bản' : 'Cần cố gắng rèn luyện thêm'}.
${ev.vocabLearned ? `- Các dạng toán con đã nắm vững: ${ev.vocabLearned}\n` : ''}${ev.vocabNotLearned ? `- Các phần con cần lưu ý ôn tập lại: ${ev.vocabNotLearned}\n` : ''}
💬 Tương tác lớp học:
- Con ${ev.interClassActivity === 'active' ? 'tích cực tham gia các hoạt động' : 'còn trầm trong các hoạt động'} và ${ev.interContribution === 'voluntary' ? 'chủ động giơ tay phát biểu' : 'cần chủ động phát biểu hơn'}.`
  }

  const isFriendly = ev.tone === 'friendly' || !ev.tone
  
  const intro = isFriendly
    ? `- Kết quả đánh giá cuối kỳ môn Tiếng Anh chủ đề: ${sessionTopic} 🌟`
    : `- Báo cáo kết quả đánh giá cuối kỳ học viên môn Tiếng Anh: ${sessionTopic}.`

  // 1. Conduct
  const conductParts = []
  conductParts.push(ev.conductAttendance === 'full' ? 'đi học đầy đủ' : 'chưa đi học đầy đủ')
  conductParts.push(ev.conductPunctual === 'on_time' ? 'đúng giờ' : 'còn đi muộn')
  conductParts.push(ev.conductHw === 'done' ? 'hoàn thành bài tập đầy đủ' : 'chưa hoàn thành đầy đủ bài tập')
  conductParts.push(ev.conductFocus === 'focus' ? 'tập trung lắng nghe bài giảng' : 'có lúc chưa tập trung')
  conductParts.push(ev.conductActive === 'active' ? 'sôi nổi tương tác' : 'cần được động viên tương tác nhiều hơn')

  const conductText = isFriendly
    ? `🌟 Về thái độ học tập: Con có tinh thần học tập ${ev.conductRating}/5 sao. Con ${conductParts.join(', ')}.`
    : `🌟 Về ý thức và tác phong: Đánh giá thái độ đạt ${ev.conductRating}/5 sao. Học viên ${conductParts.join(', ')}.`

  // 2. Knowledge
  const vocabText = ev.vocabLevel === 'rich'
    ? 'có vốn từ vựng phong phú, sử dụng tốt'
    : ev.vocabLevel === 'basic'
      ? 'vốn từ vựng ở mức cơ bản'
      : 'cần củng cố thêm vốn từ vựng'
  
  const grammarText = ev.grammarLevel === 'proficient'
    ? 'nắm vững cấu trúc ngữ pháp đã học'
    : ev.grammarLevel === 'basic'
      ? 'sử dụng được các cấu trúc cơ bản'
      : 'cần rèn luyện thêm cấu trúc ngữ pháp'

  const knowledgeDetails = []
  if (ev.vocabLearned) knowledgeDetails.push(`- Từ vựng đã nắm vững: ${ev.vocabLearned}`)
  if (ev.vocabNotLearned) knowledgeDetails.push(`- Từ vựng cần ôn lại: ${ev.vocabNotLearned}`)
  if (ev.grammarLearned) knowledgeDetails.push(`- Ngữ pháp đã thạo: ${ev.grammarLearned}`)
  if (ev.grammarNotLearned) knowledgeDetails.push(`- Ngữ pháp cần củng cố: ${ev.grammarNotLearned}`)

  const knowledgeText = `🚀 Về kiến thức (${ev.knowledgeRating}/5 sao):
- Con ${vocabText} và ${grammarText}.
${knowledgeDetails.join('\n')}`

  // 3. Skills
  const listening = `Nghe: ${ev.listeningReaction === 'good' ? 'Phản xạ tốt với câu hỏi' : 'Phản xạ còn chậm'}, ${ev.listeningPractice === 'proficient' ? 'thực hành tốt các bài tập nghe' : 'cần rèn luyện thêm bài nghe'}`
  const speaking = `Nói: Giọng nói ${ev.speakingVolume === 'loud' ? 'to rõ' : 'nhỏ'}, phát âm ${ev.speakingPronunciation === 'correct' ? 'tương đối chuẩn' : 'cần chú ý phát âm cuối'}, diễn đạt ${ev.speakingFluency === 'fluent' ? 'lưu loát' : 'còn ngập ngừng'}`
  const reading = `Đọc: Đọc hiểu ${ev.readingComprehension === 'good' ? 'tốt' : 'còn chậm'}, nắm bắt chi tiết ${ev.readingDetail === 'good' ? 'tốt' : 'chưa tốt'}`
  const writing = `Viết: Viết ${ev.writingSpelling === 'correct' ? 'đúng chính tả' : 'còn sai chính tả'}, từ vựng ${ev.writingVocab === 'rich' ? 'đa dạng' : 'chưa đa dạng'}, diễn đạt ${ev.writingExpression === 'clear' ? 'rõ ràng' : 'chưa rõ ràng'}, ngữ pháp ${ev.writingGrammar === 'correct' ? 'chính xác' : 'còn lỗi'}`

  const skillsText = `✏️ Về các kỹ năng (${ev.skillsRating}/5 sao):
- ${listening}
- ${speaking}
- ${reading}
- ${writing}`

  // 4. Interaction
  const interaction = []
  interaction.push(ev.interClassActivity === 'active' ? 'tích cực tham gia hoạt động lớp' : 'ít tham gia hoạt động')
  interaction.push(ev.interFocus === 'attentive' ? 'chăm chú lắng nghe giáo viên' : 'cần tập trung lắng nghe giảng hơn')
  interaction.push(ev.interContribution === 'voluntary' ? 'chủ động giơ tay phát biểu ý kiến' : 'chưa chủ động phát biểu xây dựng bài')

  const interactionText = `💬 Về tương tác (${ev.interactionRating}/5 sao):
- Học viên ${interaction.join(', ')}.`

  return `${intro}

${conductText}

${knowledgeText}

${skillsText}

${interactionText}`
}
