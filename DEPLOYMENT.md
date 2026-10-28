# Supabase, Render, and Vercel setup

The application uses Supabase Auth and PostgreSQL, the existing Spring Boot API
on Render, and the React frontend on Vercel. No Firebase project is required.

## 1. Create a Supabase project

1. Create a project in the Supabase dashboard and save its database password in
   a password manager.
2. In **Authentication → Providers**, enable **Email**.
3. In **Authentication → URL Configuration**, set the Site URL to
   `https://dependencyvulnaribilites.vercel.app` and add that URL and
   `http://localhost:3000/**` to the redirect allow list.
4. In **Authentication → Signing Keys**, use an asymmetric signing key (ES256
   or RS256) so the Spring API can verify access tokens with Supabase's public
   JWKS endpoint.
5. Copy the project URL and the client-side publishable/anon key for Vercel.
   Never use a `service_role` key in the browser or in Vercel's `REACT_APP_*`
   variables.
6. In **Project Settings → Database**, select the Session pooler connection
   details. Use its host, port, database name, and username to form the JDBC
   URL, adding `?sslmode=require`.

The Spring Boot API creates the `dependabot_alerts` table on startup. It stores
alerts with the authenticated Supabase user ID and only returns that user's
alerts.

## 2. Deploy the API on Render

Create a Render Blueprint from this repository using `render.yaml`. Set the
requested private environment variables in Render:

- `SUPABASE_URL`: project URL without a trailing slash
- `SUPABASE_JDBC_URL`: Session pooler JDBC URL with SSL required
- `SUPABASE_DB_USERNAME`: pooler database username
- `SUPABASE_DB_PASSWORD`: database password
- `GITHUB_TOKEN`: optional for public repositories; for private repositories,
  use a GitHub token authorized to read Dependabot alerts
- `CORS_ALLOWED_ORIGINS`: include the Vercel production URL and
  `http://localhost:3000` for local development

Render supplies `PORT`. The API validates Supabase access tokens and listens on
that port. Its health endpoint is `/api/health`.

## 3. Configure and redeploy the Vercel frontend

In the Vercel project's **Settings → Environment Variables**, set these for
Production (and Preview if desired):

- `REACT_APP_SUPABASE_URL`: Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY`: Supabase publishable/anon key (never the
  service-role key)
- `REACT_APP_API_BASE_URL`: the Render API base URL, with no trailing slash

Redeploy after setting the variables. For local development, create an ignored
`.env.local` from `.env.example` and fill in the same frontend variables plus
the backend values required to run Spring Boot locally.

## 4. Verify

1. Open the Vercel URL and create a test account.
2. Confirm the email if Supabase email confirmation is enabled.
3. Sign in, scan a repository, then check Dashboard and Scan History.
4. Confirm Render logs show healthy startup and no database or JWT errors.

Do not commit `.env.local`, database passwords, GitHub tokens, Supabase database
credentials, or service-role keys.
