import { toast } from 'sonner'
import type { SessionMediaItem, RosterStudentOption, UploadingMediaItem } from './classesSessionMediaTypes'
import { MAX_IMAGE_DOC_SIZE_BYTES, MAX_VIDEO_SIZE_BYTES } from './classesSessionMediaTypes'

/**
 * Generates initial realistic mock media items for a specific class session
 * when no session-specific media exists yet.
 */
export function generateInitialSessionMedia(
  sessionNumber: number,
  sessionId: string | undefined,
  rosterStudents: RosterStudentOption[]
): SessionMediaItem[] {
  const targetId = sessionId || `ses-${sessionNumber}`
  const st1 = rosterStudents[0]?.id || 'st-1'
  const st2 = rosterStudents[1]?.id || 'st-2'

  return [
    {
      id: `m-seed-${sessionNumber}-1`,
      sessionId: targetId,
      sessionNumber: sessionNumber,
      sessionTitle: `Nội dung buổi học ${sessionNumber}`,
      sessionDate: '09/05/2026',
      sessionTime: '18:00 - 19:30',
      name: `Hoat_dong_nhom_buoi_${sessionNumber}.jpg`,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
      size: '2.4 MB',
      uploadedBy: 'Cô Mai',
      uploadedAt: '19:35 09/05/2026',
      taggedStudentIds: [st1, st2],
    },
    {
      id: `m-seed-${sessionNumber}-2`,
      sessionId: targetId,
      sessionNumber: sessionNumber,
      sessionTitle: `Nội dung buổi học ${sessionNumber}`,
      sessionDate: '09/05/2026',
      sessionTime: '18:00 - 19:30',
      name: `Thuyet_trinh_speaking_clip.mp4`,
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      size: '18.5 MB',
      duration: '01:45',
      uploadedBy: 'Cô Mai',
      uploadedAt: '19:42 09/05/2026',
      taggedStudentIds: [st1],
    },
    {
      id: `m-seed-${sessionNumber}-3`,
      sessionId: targetId,
      sessionNumber: sessionNumber,
      sessionTitle: `Nội dung buổi học ${sessionNumber}`,
      sessionDate: '09/05/2026',
      sessionTime: '18:00 - 19:30',
      name: `Bai_tap_on_tap_buoi_${sessionNumber}.pdf`,
      type: 'doc',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      size: '3.2 MB',
      uploadedBy: 'Cô Mai',
      uploadedAt: '19:48 09/05/2026',
      taggedStudentIds: [],
    },
    {
      id: `m-seed-${sessionNumber}-4`,
      sessionId: targetId,
      sessionNumber: sessionNumber,
      sessionTitle: `Nội dung buổi học ${sessionNumber}`,
      sessionDate: '09/05/2026',
      sessionTime: '18:00 - 19:30',
      name: `Bang_tong_ket_nhom_worksheet.png`,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      size: '1.9 MB',
      uploadedBy: 'Cô Mai',
      uploadedAt: '19:50 09/05/2026',
      taggedStudentIds: [],
    },
  ]
}

/**
 * Validates selected upload files and converts valid files to UploadingMediaItem array.
 */
export function createUploadMediaItems(
  files: File[],
  targetSessionId: string,
  targetSessionNum: number
): UploadingMediaItem[] {
  const validUploads: UploadingMediaItem[] = []

  for (const file of files) {
    const isImg = file.type.startsWith('image/')
    const isVid = file.type.startsWith('video/')
    const isDoc =
      file.type.startsWith('application/pdf') ||
      file.type.includes('word') ||
      file.name.endsWith('.pdf') ||
      file.name.endsWith('.doc') ||
      file.name.endsWith('.docx')

    if (!isImg && !isVid && !isDoc) {
      toast.error(`Định dạng tệp "${file.name}" không được hỗ trợ. Vui lòng chỉ tải tệp ảnh, video hoặc tài liệu!`)
      continue
    }

    if ((isImg || isDoc) && file.size > MAX_IMAGE_DOC_SIZE_BYTES) {
      toast.error(`Tệp "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)} MB) vượt quá dung lượng tối đa 25MB cho ảnh/tài liệu!`)
      continue
    }

    if (isVid && file.size > MAX_VIDEO_SIZE_BYTES) {
      toast.error(`Tệp video "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)} MB) vượt quá dung lượng tối đa 100MB cho video!`)
      continue
    }

    const uploadId = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    validUploads.push({
      id: uploadId,
      sessionId: targetSessionId,
      sessionNumber: targetSessionNum,
      sessionTitle: 'Nội dung buổi học',
      sessionDate: '09/05/2026',
      sessionTime: '18:00 - 19:30',
      name: file.name,
      type: isVid ? 'video' : isImg ? 'image' : 'doc',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      totalBytes: file.size,
      loadedBytes: Math.round(file.size * 0.12),
      progress: 12,
      rawFile: file,
    })
  }

  return validUploads
}
