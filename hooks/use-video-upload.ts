import type { DragEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { UploadState } from "@/lib/types";
import { formatFileSize, isAllowedVideoFile } from "@/lib/video";

export function useVideoUpload() {
  const [fileName, setFileName] = useState("lumora-source-reel.mp4");
  const [fileSize, setFileSize] = useState("128.4 MB");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState(68);
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
      return;
    }

    setUploadError("");
    setFileName(file.name);
    setVideoFile(file);
    setFileSize(formatFileSize(file.size));
    setDuration(null);
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
    setFileName("lumora-source-reel.mp4");
    setVideoFile(null);
    setFileSize("128.4 MB");
    setDuration(null);
    setUploadProgress(68);
    setUploadState("ready");
    setUploadError("");
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
    uploadError,
    uploadProgress,
    uploadState,
    videoFile,
    videoUrl
  };
}
