"use client";

import { useScroll, useSpring, useMotionValueEvent, MotionValue } from "framer-motion";
import { useEffect, useRef, ReactNode, useCallback, useState } from "react";

interface ScrollyVideoProps {
  src: string;
  children?: (progress: MotionValue<number>) => ReactNode;
}

export default function ScrollyVideo({ src, children }: ScrollyVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);
  
  // Use optimized version if available
  const optimizedSrc = isVideo && /\.mp4(\?.*)?$/i.test(src) && !/-optimized\.mp4(\?.*)?$/i.test(src)
    ? src.replace(/\.mp4(\?.*)?$/i, "-optimized.mp4$1")
    : null;

  const durationRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const targetTimeRef = useRef(0);
  const lastAppliedTimeRef = useRef(-1);
  const isVideoReadyRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // PERFORMANCE: Lower frame threshold for more responsive updates
  // 60fps = 16.67ms per frame, we allow updates every ~2 frames
  const FRAME_THRESHOLD = 1 / 30;

  // Scroll progress for the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // OPTIMIZED SPRING: Faster response, less damping
  const springScroll = useSpring(scrollYProgress, {
    damping: 24, // Reduced from 32 for snappier response
    stiffness: 200, // Increased from 150 for faster tracking
    mass: 0.15, // Reduced from 0.2 for less inertia
    restDelta: 0.0005, // More precise rest state
  });

  // Video loading and metadata handler
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    const video = videoRef.current;
    
    const onLoadedMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
        targetTimeRef.current = 0;
        lastAppliedTimeRef.current = -1;
        isVideoReadyRef.current = true;
        
        // PERFORMANCE: Preload some frames by briefly playing
        video.currentTime = 0;
        setIsLoaded(true);
      }
    };

    const onCanPlay = () => {
      // Video is ready to play without buffering
      if (!isVideoReadyRef.current) {
        onLoadedMetadata();
      }
    };

    const onError = (e: Event) => {
      console.error("Video error:", e);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onError);
    
    // If metadata already loaded
    if (video.readyState >= 1) {
      onLoadedMetadata();
    }

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isVideo, src]);

  // OPTIMIZED: Video frame update with throttling
  const flushVideoTime = useCallback(() => {
    rafRef.current = null;
    const video = videoRef.current;
    
    if (!video || !isVideoReadyRef.current || durationRef.current <= 0) return;

    const nextTime = Math.max(0, Math.min(durationRef.current, targetTimeRef.current));
    const timeDiff = Math.abs(nextTime - lastAppliedTimeRef.current);

    // PERFORMANCE: Only update if significant change
    if (timeDiff >= FRAME_THRESHOLD) {
      // PERFORMANCE: Disable smooth seeking for instant frame updates
      // This is key for scroll-scrubbed videos
      try {
        video.currentTime = nextTime;
        lastAppliedTimeRef.current = nextTime;
      } catch (e) {
        // Video seeking failed, try again next frame
      }
    }

    // Continue RAF loop only if we haven't converged
    const remainingDiff = Math.abs(targetTimeRef.current - lastAppliedTimeRef.current);
    if (remainingDiff >= FRAME_THRESHOLD && rafRef.current === null) {
      rafRef.current = window.requestAnimationFrame(flushVideoTime);
    }
  }, []);

  // OPTIMIZED: Scroll-based video control
  useMotionValueEvent(springScroll, "change", (latest) => {
    if (!isVideo || !isVideoReadyRef.current || durationRef.current <= 0) return;

    // Clamp value between 0 and 1
    const clampedProgress = Math.max(0, Math.min(1, latest));
    const newTime = clampedProgress * durationRef.current;
    
    // Always update target, RAF will handle the timing
    targetTimeRef.current = newTime;
    
    if (rafRef.current === null) {
      rafRef.current = window.requestAnimationFrame(flushVideoTime);
    }
  });

  return (
    <div ref={containerRef} className="relative h-[360vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {isVideo ? (
          <>
            {/* PERFORMANCE: CSS-only loading placeholder */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black animate-pulse" />
            )}
            <video
              ref={videoRef}
              className={`h-full w-full object-cover transition-opacity duration-500 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              muted
              playsInline
              // PERFORMANCE: Use "auto" for scroll-scrubbed videos
              // Metadata is enough since we're controlling currentTime manually
              preload="auto"
              disablePictureInPicture
              controls={false}
              aria-hidden="true"
              // PERFORMANCE: Hardware acceleration hints
              style={{
                willChange: "transform", // Hint for GPU acceleration
                transform: "translateZ(0)", // Force GPU layer
              }}
            >
              {/* WebM version (smaller, faster) */}
              {optimizedSrc && (
                <source 
                  src={optimizedSrc.replace(".mp4", ".webm")} 
                  type="video/webm" 
                />
              )}
              {/* MP4 optimized version (every frame is keyframe) */}
              {optimizedSrc && (
                <source src={optimizedSrc} type="video/mp4" />
              )}
              {/* Fallback to original */}
              <source src={src} type="video/mp4" />
            </video>
          </>
        ) : (
          <img src={src} alt="Hero background" className="h-full w-full object-cover" />
        )}
        {/* Render children (Overlay) passing the springScroll value */}
        {children && children(springScroll)}
      </div>
    </div>
  );
}
