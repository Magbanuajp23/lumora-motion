import type { DragEvent, RefObject } from "react";
import { Film, Upload, Video } from "lucide-react";
import type { UploadState } from "@/lib/types";
import { formatDuration } from "@/lib/video";
import { brand } from "@/lib/lumora-motion-data";

export function UploadPanel(props: {
  fileName: string;
  fileSize: string;
  duration: number | null;
  videoUrl: string;
  uploadProgress: number;
  uploadState: UploadState;
  uploadError: string;
  isDragging: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  onDrop: (event: DragEvent<HTMLLabelElement>) => void;
  onDragEnter: (event: DragEvent<HTMLLabelElement>) => void;
  onDragOver: (event: DragEvent<HTMLLabelElement>) => void;
  onDragLeave: () => void;
  onFile: (file?: File) => void;
  onDuration: (duration: number) => void;
  onClear: () => void;
}) {
  return (
    <div className="glass-panel min-w-0 rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Source video</p>
          <h2 className="mt-1 font-[var(--font-space)] text-2xl font-bold text-white">Upload footage</h2>
        </div>
        <Film className="h-6 w-6 text-plasma" aria-hidden="true" />
      </div>
      <label
        onDragEnter={props.onDragEnter}
        onDragOver={props.onDragOver}
        onDragLeave={props.onDragLeave}
        onDrop={props.onDrop}
        className={`upload-zone group mt-6 flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-8 text-center transition duration-300 hover:-translate-y-1 hover:shadow-glow ${
          props.isDragging ? "border-signal bg-signal/[0.12] shadow-glow" : "border-plasma/40 bg-plasma/[0.06] hover:border-plasma hover:bg-plasma/[0.11]"
        }`}
      >
        {props.videoUrl ? (
          <video src={props.videoUrl} className="h-auto max-h-64 w-full max-w-full rounded-xl border border-white/10 object-cover shadow-2xl shadow-black/30" controls muted playsInline onLoadedMetadata={(event) => props.onDuration(event.currentTarget.duration)} />
        ) : (
          <>
            <span className="relative grid h-16 w-16 place-items-center rounded-2xl border border-plasma/30 bg-black/30 text-plasma transition duration-300 group-hover:scale-105">
              <Upload className="h-8 w-8" aria-hidden="true" />
            </span>
            <span className="mt-5 text-lg font-bold text-white">Drop footage into the timeline</span>
            <span className="mt-2 max-w-xs text-sm leading-6 text-slate-400">MP4, MOV, or WebM. {brand.name} detects scenes, pacing, dialogue, and visual style automatically.</span>
          </>
        )}
        <input ref={props.fileInputRef} type="file" accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm" className="sr-only" onChange={(event) => props.onFile(event.target.files?.[0])} />
      </label>
      <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-slate-300">
        <div className="flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2">
            <Video className="h-4 w-4 shrink-0 text-plasma" aria-hidden="true" />
            <span className="truncate">{props.fileName}</span>
          </span>
          <span className={`rounded-md px-2 py-1 text-xs font-semibold ${props.uploadState === "uploading" ? "bg-plasma/10 text-plasma" : "bg-signal/10 text-signal"}`}>
            {props.uploadState === "uploading" ? "uploading" : "ready"}
          </span>
        </div>
        <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
          <span>{props.fileSize}</span>
          <span className="sm:text-right">Duration {formatDuration(props.duration)}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-plasma to-signal animate-bar-shimmer transition-all duration-300" style={{ width: `${props.uploadProgress}%` }} />
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={() => props.fileInputRef.current?.click()} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] text-sm font-semibold text-white transition duration-300 hover:border-plasma/40 hover:bg-plasma/10">
            <Upload className="h-4 w-4" aria-hidden="true" />
            Choose video
          </button>
          {props.videoUrl ? (
            <button type="button" onClick={props.onClear} className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-white/10 bg-black/20 text-sm font-semibold text-slate-300 transition duration-300 hover:border-white/25 hover:bg-white/[0.06]">
              Clear upload
            </button>
          ) : null}
        </div>
        {props.uploadError ? <p className="mt-3 text-sm text-rose-300">{props.uploadError}</p> : null}
      </div>
    </div>
  );
}
