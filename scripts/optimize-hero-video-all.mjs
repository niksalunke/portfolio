/**
 * Video Optimization Script for Scroll-Scrubbed Hero Video
 * 
 * This creates multiple optimized versions:
 * 1. MP4 (H.264) - Best compatibility, every frame is keyframe
 * 2. WebM (VP9) - Smaller file, good for scroll-scrubbing
 * 
 * Usage: node scripts/optimize-hero-video-all.mjs [input.mp4] [output-base-name]
 */

import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const cwd = process.cwd();
const input = process.argv[2] ?? path.join(cwd, "public", "hero-video.mp4");
const outputBase = process.argv[3] ?? path.join(cwd, "public", "hero-video");

if (!ffmpegPath) {
  console.error("ffmpeg-static binary is unavailable.");
  process.exit(1);
}

if (!fs.existsSync(input)) {
  console.error(`❌ Input video not found: ${input}`);
  process.exit(1);
}

const inputSize = fs.statSync(input).size;
console.log(`📹 Input: ${(inputSize / 1024 / 1024).toFixed(2)} MB\n`);

// Common settings for scroll-scrubbing
const scrollScrubSettings = [
  "-an", // No audio
  "-vf",
  "scale=min(1280\\,iw):-2:flags=lanczos,fps=30", // 720p max, 30fps, lanczos
];

// Keyframe settings: Every frame is a keyframe for instant seeking
const keyframeSettings = [
  "-g", "1",
  "-keyint_min", "1",
  "-force_key_frames", "expr:gte(t,n_forced*1)",
];

const outputs = [
  // MP4 - H.264 Baseline (best compatibility)
  {
    name: "MP4 (H.264 Baseline)",
    ext: "optimized.mp4",
    args: [
      "-c:v", "libx264",
      "-preset", "fast",
      "-crf", "24",
      "-profile:v", "baseline",
      "-level", "4.0",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      ...keyframeSettings,
    ],
  },
  // WebM - VP9 (smaller file, good performance)
  {
    name: "WebM (VP9)",
    ext: "optimized.webm",
    args: [
      "-c:v", "libvpx-vp9",
      "-deadline", "good",
      "-cpu-used", "2",
      "-crf", "31",
      "-b:v", "0", // CBR mode disabled
      "-pix_fmt", "yuv420p",
      ...keyframeSettings,
    ],
  },
];

async function runFFmpeg(args) {
  return new Promise((resolve, reject) => {
    const ff = spawn(ffmpegPath, args, {
      stdio: "inherit",
      windowsHide: true,
    });

    ff.on("error", (error) => {
      reject(new Error(`FFmpeg error: ${error.message}`));
    });

    ff.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`FFmpeg exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

async function optimize() {
  const results = [];

  for (const { name, ext, args } of outputs) {
    const output = `${outputBase}-${ext}`;
    
    console.log(`🔄 Generating: ${name}`);
    console.log(`   Output: ${output}`);
    
    const ffmpegArgs = [
      "-y",
      "-i", input,
      ...scrollScrubSettings,
      ...args,
      output,
    ];

    try {
      await runFFmpeg(ffmpegArgs);
      
      const outSize = fs.statSync(output).size;
      const savings = (((inputSize - outSize) / inputSize) * 100).toFixed(1);
      
      results.push({
        name,
        size: (outSize / 1024 / 1024).toFixed(2),
        savings,
      });
      
      console.log(`✅ ${name}: ${(outSize / 1024 / 1024).toFixed(2)} MB (${savings}% savings)\n`);
    } catch (error) {
      console.error(`❌ ${name} failed:`, error.message);
    }
  }

  // Summary
  console.log("\n📊 Optimization Complete!");
  console.log("═".repeat(50));
  console.log(`Original: ${(inputSize / 1024 / 1024).toFixed(2)} MB`);
  console.log("-".repeat(50));
  
  results.forEach(({ name, size, savings }) => {
    console.log(`${name.padEnd(25)} ${size.padStart(8)} MB  (${savings}% saved)`);
  });
  
  console.log("\n💡 Tips:");
  console.log("   • Use the MP4 version for maximum browser compatibility");
  console.log("   • The WebM version is ~20-30% smaller");
  console.log("   • Every frame is now a keyframe for instant seeking");
  console.log("   • Videos are capped at 720p/30fps for smooth scroll performance\n");
}

optimize().catch((err) => {
  console.error("Optimization failed:", err);
  process.exit(1);
});
