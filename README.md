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
- `supabase/email-templates/` - branded Lumora Motion auth email templates and dashboard setup notes.

## Supabase auth

Email/password and Google auth are powered by Supabase. Add the following values to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Signup confirmation redirects return to the main homepage at `/?auth=confirmed`, where Lumora Motion shows a branded success notice and keeps logged-in users on `/`.

Use `supabase/email-templates/confirmation.html` for the branded confirmation email and follow `supabase/email-templates/README.md` for the Supabase dashboard settings.

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

On Vercel, Lumora Motion checks `/api/render/status`. If `LUMORA_RENDER_BACKEND_URL` is configured, the browser uploads directly to the remote `/render` endpoint so large videos do not pass through Vercel functions. If no backend is configured, the app returns a clear product message instead of attempting local FFmpeg:

`Online video rendering is not available yet. Please run locally or connect a render backend.`

Production backend integration uses:

- `LUMORA_RENDER_BACKEND_URL` - the public URL of the render backend, for example `https://lumora-motion-render.up.railway.app`.
- `LUMORA_PUBLIC_RENDER_URL` - set on the backend if its public URL differs from the request host.
- `LUMORA_ALLOWED_ORIGINS` - comma-separated frontend origins allowed to call the backend, for example `https://lumora-motion.vercel.app,http://localhost:3000`.
- `LUMORA_MAX_UPLOAD_MB` - maximum upload size shown in the frontend, default `250`.
- `DISABLE_LOCAL_RENDER=1` - disables local FFmpeg rendering in any environment.
- `lib/server/render-config.ts` - central render mode detection for local, remote, and disabled deployments.
- `/api/health` - render backend health endpoint with FFmpeg/FFprobe availability.
- `/render` - direct production FFmpeg render endpoint with CORS.

Deploy the backend with the included Dockerfile on Railway or Render. The container installs FFmpeg and runs the same Next.js API routes as a dedicated render worker. For higher-scale production, the next step is direct object storage uploads plus an asynchronous queue-backed worker on Railway, Render, RunPod, or similar infrastructure.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
