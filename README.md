# Lumora Motion

Premium futuristic AI SaaS video editing MVP built with Next.js, Tailwind CSS, and a real FFmpeg-backed render/export route.

## Product model

Lumora Motion uses a hybrid subscription + credits model. Plans include monthly credits, and credits are consumed for AI edits, captions, beat sync, premium VFX, and 4K exports.

## Project structure

- `app/` - Next.js routes, metadata, API endpoints, and global styles.
- `components/layout/` - shell elements like navbar, footer, background, and AI activity.
- `components/sections/` - page-level SaaS sections such as hero, features, pricing, dashboard, FAQ, auth, and testimonials.
- `components/studio/` - reusable AI editor workflow components for upload, prompt, processing, credits, and render results.
- `components/ui/` - shared UI primitives.
- `hooks/` - frontend upload and render workflow state.
- `lib/` - constants, pricing/credits data, shared types, and video utilities.
- `lib/server/` - backend-only processing helpers, including the FFmpeg render pipeline.
- `app/api/render/` - video render API and processed video download endpoint.

## Video rendering

The MVP includes a real FFmpeg-backed render route for local development:

- `POST /api/render` accepts a `FormData` payload with `video`, `prompt`, `preset`, `quality`, `trimStart`, and `trimDuration`.
- `GET /api/render/status` reports whether rendering is available as `local`, `remote`, or `disabled`.
- The route streams NDJSON progress/log events back to the client.
- Rendered files are written to `.lumora-motion-renders/` and served from `GET /api/render/[jobId]`.
- Free-plan watermark branding is represented as `Edited with Lumora Motion`.

Install FFmpeg and ensure `ffmpeg`/`ffprobe` are available on `PATH`, or use the local winget FFmpeg install path already supported by the render helper.

## Production rendering

Vercel is not used as the bundled FFmpeg render worker. Video uploads are commonly larger than Vercel Function payload limits, and long CPU-heavy FFmpeg jobs are a better fit for a dedicated render service.

On Vercel, Lumora Motion now returns a clear product message instead of attempting local FFmpeg:

`Online video rendering is not available yet. Please run locally or connect a render backend.`

Future backend integration is prepared with:

- `LUMORA_RENDER_BACKEND_URL` - forwards `/api/render` jobs to a dedicated render server endpoint at `/render`.
- `DISABLE_LOCAL_RENDER=1` - disables local FFmpeg rendering in any environment.
- `lib/server/render-config.ts` - central render mode detection for local, remote, and disabled deployments.

For production-scale uploads, the next backend should use direct object storage uploads plus an asynchronous render job API on Railway, Render, RunPod, or another worker host.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
