import type { DragEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { UploadState } from "@/lib/types";
import { formatFileSize, isAllowedVideoFile } from "@/lib/video";
import { detectVideoOrientation } from "@/lib/video-orientation";

type VideoOrientation = "landscape" | "portrait" | "square" | "unknown";

type UploadedVideoMetadata = {
  height: number;
  orientation: VideoOrientation;
  width: number;
};

export function useVideoUpload() {
  const [fileName, setFileName] = useState("No video uploaded");
  const [fileSize, setFileSize] = useState("--");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<UploadedVideoMetadata>({
    height: 0,
    orientation: "unknown",
    width: 0
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>("ready");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (uploadState !== "uploading") return;

    setUploadProgress(8);
    const interval = window.setInterval(() => {
      setUploadProgress((current) => {
        if (current >= 100) {
          window.clearInterval(interval);
          setUploadState("complete");
          return 100;
        }
        return Math.min(100, current + Math.random() * 18 + 6);
      });
    }, 280);

    return () => window.clearInterval(interval);
  }, [uploadState]);

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  function handleVideoFile(file?: File) {
    if (!file) return;

    if (!isAllowedVideoFile(file)) {
      setUploadError("Upload an MP4, MOV, or WebM video.");
      setUploadState("ready");
      setUploadProgress(0);
      return;
    }

    setUploadError("");
    setFileName(file.name);
    setVideoFile(file);
    setFileSize(formatFileSize(file.size));
    setDuration(null);
    setVideoMetadata({ height: 0, orientation: "unknown", width: 0 });
    setUploadState("uploading");
    setVideoUrl((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      return URL.createObjectURL(file);
    });
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleVideoFile(event.dataTransfer.files?.[0]);
  }

  function resetUpload() {
    setVideoUrl((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      return "";
    });
    setFileName("No video uploaded");
    setVideoFile(null);
    setFileSize("--");
    setDuration(null);
    setVideoMetadata({ height: 0, orientation: "unknown", width: 0 });
    setUploadProgress(0);
    setUploadState("ready");
    setUploadError("");
  }

  function handleVideoMetadata(duration: number, width: number, height: number) {
    setDuration(duration);
    setVideoMetadata({
      height,
      orientation: detectVideoOrientation(width, height),
      width
    });
  }

  return {
    duration,
    fileInputRef,
    fileName,
    fileSize,
    handleDrop,
    handleVideoFile,
    isDragging,
    resetUpload,
    setDuration,
    setIsDragging,
    handleVideoMetadata,
    uploadError,
    uploadProgress,
    uploadState,
    videoFile,
    videoMetadata,
    videoUrl
  };
}
