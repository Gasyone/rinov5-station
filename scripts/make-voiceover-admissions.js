const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

// Target directory in Gemini artifacts
const destDir = 'C:\\Users\\Jacky Tran\\.gemini\\antigravity\\brain\\b2b3508d-fb20-49a3-8526-190abd6f4a02';

async function downloadTTS(text, filename) {
  console.log(`Downloading TTS for: "${text.substring(0, 40)}..."`);
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch TTS. Status: ${res.status}`);
  }
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(filename, Buffer.from(buffer));
}

async function processFlow(flowName, videoFilename, segments) {
  console.log(`\n========================================`);
  console.log(`Processing ${flowName}...`);
  console.log(`========================================`);
  
  const tmpDir = path.join(__dirname, `../tmp/audio_${flowName}`);
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const filesList = [];
  
  // 1. Download and speed up each segment, adding silence in between
  for (let i = 0; i < segments.length; i++) {
    const { text, delayBefore } = segments[i];
    
    // Create silence file before segment
    if (delayBefore > 0) {
      const silenceFile = path.join(tmpDir, `silence_${i}.mp3`);
      console.log(`Generating silence file: ${delayBefore}s...`);
      execSync(`"${ffmpegPath}" -y -f lavfi -i anullsrc=r=24000:cl=mono -t ${delayBefore} "${silenceFile}"`, { stdio: 'ignore' });
      filesList.push(silenceFile);
    }
    
    // Download raw TTS
    const rawSegFile = path.join(tmpDir, `raw_seg_${i}.mp3`);
    const segFile = path.join(tmpDir, `seg_${i}.mp3`);
    await downloadTTS(text, rawSegFile);
    
    // Speed up TTS to 1.2x for better pacing
    console.log(`Speeding up segment ${i} to 1.2x...`);
    execSync(`"${ffmpegPath}" -y -i "${rawSegFile}" -filter:a "atempo=1.20" "${segFile}"`, { stdio: 'ignore' });
    
    try {
      fs.unlinkSync(rawSegFile);
    } catch (e) {}
    
    filesList.push(segFile);
  }
  
  // Add final silence pad of 4 seconds to prevent audio from ending abruptly
  const endSilenceFile = path.join(tmpDir, `silence_end.mp3`);
  execSync(`"${ffmpegPath}" -y -f lavfi -i anullsrc=r=24000:cl=mono -t 4.0 "${endSilenceFile}"`, { stdio: 'ignore' });
  filesList.push(endSilenceFile);

  // 2. Concat all audio components
  console.log('Creating concatenation list file...');
  const listFile = path.join(tmpDir, 'list.txt');
  const listContent = filesList.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n');
  fs.writeFileSync(listFile, listContent);
  
  const concatAudio = path.join(tmpDir, 'voice_full.mp3');
  console.log('Concatenating audio segments...');
  execSync(`"${ffmpegPath}" -y -f concat -safe 0 -i "${listFile}" -c copy "${concatAudio}"`, { stdio: 'ignore' });

  // 3. Merge with input webm video to produce high-compatibility H.264 MP4
  const inputVideo = path.join(destDir, `${videoFilename}.webm`);
  if (!fs.existsSync(inputVideo)) {
    throw new Error(`Input webm video not found at: ${inputVideo}`);
  }
  
  const outputMp4 = path.join(__dirname, `../videos/${videoFilename}.mp4`);
  const outputDir = path.dirname(outputMp4);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log('Merging video and audio...');
  execSync(`"${ffmpegPath}" -y -i "${inputVideo}" -i "${concatAudio}" -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 128k -map 0:v:0 -map 1:a:0 -shortest "${outputMp4}"`, { stdio: 'ignore' });
  console.log(`Success! Video saved to: ${outputMp4}`);

  // 4. Copy to Gemini artifacts folder
  if (fs.existsSync(destDir)) {
    const destMp4 = path.join(destDir, `${videoFilename}.mp4`);
    fs.copyFileSync(outputMp4, destMp4);
    console.log(`Copied video to artifacts folder: ${destMp4}`);
  }

  // 5. Clean up temporary audio files
  console.log('Cleaning up temporary files...');
  try {
    fs.unlinkSync(listFile);
    for (const f of filesList) {
      if (fs.existsSync(f)) {
        fs.unlinkSync(f);
      }
    }
    fs.unlinkSync(concatAudio);
    fs.rmdirSync(tmpDir);
  } catch (e) {
    console.log('Cleanup warning:', e.message);
  }
}

async function main() {
  if (!ffmpegPath) {
    throw new Error('ffmpeg-static binary not found!');
  }

  // Flow 1: Booking Test Creation & CS/Admin Check-in
  const flow1Segments = [
    { text: "Chào mừng bạn đến với RinoEdu. Sau đây là quy trình đặt lịch test đầu vào và check-in học viên.", delayBefore: 1.5 },
    { text: "Tại phân hệ Kiểm tra Trải nghiệm, nhấn nút Tạo lịch test để bắt đầu.", delayBefore: 4.0 },
    { text: "Điền thông tin học sinh, chọn chương trình, thời gian phỏng vấn, gán giáo viên và nhấn lưu.", delayBefore: 3.5 },
    { text: "Khi học sinh đến cơ sở, CS bấm nút Check-in để xác nhận trạng thái Đã đến của học viên.", delayBefore: 4.5 }
  ];

  // Flow 2: Speaking Evaluation & Report
  const flow2Segments = [
    { text: "Tiếp theo là quy trình giáo viên chấm phỏng vấn Nói và phát hành báo cáo năng lực.", delayBefore: 1.5 },
    { text: "Giáo viên được gán mở màn hình đánh giá của học sinh đã check-in.", delayBefore: 3.5 },
    { text: "Tiến hành chấm điểm Speaking theo tám tiêu chí, tích chọn nhận xét phản xạ Nói và bấm cập nhật.", delayBefore: 4.0 },
    { text: "Hệ thống tự động đồng bộ điểm, sinh báo cáo tổng hợp. Bấm Mở để xem báo cáo năng lực của học viên.", delayBefore: 5.0 }
  ];

  // Flow 3: Trial Session pairing & Exception handling
  const flow3Segments = [
    { text: "Cuối cùng là quy trình ghép lớp học thử và xử lý dời ca hoặc hủy lịch học.", delayBefore: 1.5 },
    { text: "Tại phân hệ Lớp học thử, giáo vụ duyệt chấp thuận ghép lớp đối với các học sinh chờ xếp ca.", delayBefore: 4.0 },
    { text: "Nếu phụ huynh báo bận, nhấn Đổi buổi để chọn ca học mới và lý do dời lịch phù hợp.", delayBefore: 4.5 },
    { text: "Trường hợp hủy lịch trải nghiệm, mở chi tiết và bấm Hủy lịch, chọn lý do để giải phóng ca học trống.", delayBefore: 6.0 }
  ];

  await processFlow('flow1', 'flow1_checkin', flow1Segments);
  await processFlow('flow2', 'flow2_evaluation', flow2Segments);
  await processFlow('flow3', 'flow3_trial_management', flow3Segments);

  console.log('\n========================================');
  console.log('ALL FLOWS PROCESSED SUCCESSFULLY!');
  console.log('========================================');
}

main().catch(err => {
  console.error('Error running main process:', err);
  process.exit(1);
});
