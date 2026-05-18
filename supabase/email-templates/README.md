# Lumora Motion Supabase Auth Email Templates

Supabase email templates are configured in the Supabase dashboard, not from this Next.js repo. Use the files in this folder as the source of truth when updating the hosted auth emails.

## Confirm Signup

Dashboard path:

`Supabase project -> Authentication -> Email Templates -> Confirm signup`

Suggested subject:

`Confirm your Lumora Motion studio access`

Template:

Paste the HTML from `confirmation.html`.

Required redirect settings:

- Set the project Site URL to the production homepage, for example `https://lumora-motion.vercel.app`.
- Add local development to Redirect URLs: `http://localhost:3000/**`.
- Add production to Redirect URLs: `https://lumora-motion.vercel.app/**`.
- Keep the template button href as `{{ .ConfirmationURL }}` so Supabase signs the confirmation link correctly.

## Sender branding

Dashboard path:

`Supabase project -> Project Settings -> Auth -> SMTP Settings`

Use custom SMTP for real production branding. Suggested values:

- Sender name: `Lumora Motion`
- Sender email: `hello@your-domain.com` or `no-reply@your-domain.com`
- Reply-to: `support@your-domain.com`

Without custom SMTP, some Supabase sender metadata may still appear in the inbox or message headers.
