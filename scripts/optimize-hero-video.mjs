import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const cwd = process.cwd();
const input = process.argv[2] ?? path.join(cwd, "public", "hero-video.mp4");
const output =
  process.argv[3] ?? path.join(cwd, "public", "hero-video-optimized.mp4");

if (!ffmpegPath) {
  console.error("ffmpeg-static binary is unavailable.");
  process.exit(1);
}

if (!fs.existsSync(input)) {
  console.error(`Input video not found: ${input}`);
  process.exit(1);
}

// OPTIMIZED FOR SCROLL-SCRUBBING:
// - ALL frames are keyframes (for instant seeking)
// - Lower resolution (720p max for performance)
// - 30fps (smooth enough, lighter than 60fps)
// - Fast decode profile for better playback
const args = [
  "-y",
  "-i",
  input,
  "-an", // No audio
  "-c:v",
  "libx264",
  "-preset",
  "fast", // Faster preset = larger file but faster decode
  "-crf",
  "24", // Slightly higher CRF = smaller file, minimal quality loss
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  // KEY FOR SCROLL-SCRUBBING: Every frame is a keyframe
  "-g",
  "1", // GOP size of 1 = every frame is a keyframe
  "-keyint_min",
  "1",
  "-force_key_frames",
  "expr:gte(t,n_forced*1)", // Force keyframe every frame
  "-profile:v",
  "baseline", // Baseline profile = faster decode
  "-level",
  "4.0",
  "-vf",
  "scale=min(1280\\,iw):-2:flags=lanczos,fps=30", // 720p max, 30fps, lanczos scaling
  output,
];

console.log(`Optimizing video:\n  in : ${input}\n  out: ${output}`);

const ff = spawn(ffmpegPath, args, {
  stdio: "inherit",
  windowsHide: true,
});

ff.on("error", (error) => {
  console.error("Failed to run ffmpeg:", error.message);
  process.exit(1);
});

ff.on("exit", (code) => {
  if (code !== 0) {
    console.error(`ffmpeg exited with code ${code}`);
    process.exit(code ?? 1);
  }

  const inSize = fs.statSync(input).size;
  const outSize = fs.statSync(output).size;
  const savings = (((inSize - outSize) / inSize) * 100).toFixed(1);

  console.log(`Done. Input: ${inSize} bytes, Output: ${outSize} bytes, Savings: ${savings}%`);
});
