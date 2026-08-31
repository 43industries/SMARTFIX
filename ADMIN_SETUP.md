# SmartFix Admin Setup (Vercel)

Password-protected admin at **`/admin`** for editing site content and viewing contact form messages.

## 1. Create Vercel KV storage

1. Open your [Vercel project](https://vercel.com) for **SMARTFIX**.
2. Go to **Storage** → **Create Database** → **KV**.
3. Link the KV store to this project (Vercel adds `KV_REST_API_URL`, `KV_REST_API_TOKEN`, etc. automatically).

## 2. Set environment variables

In **Project → Settings → Environment Variables**, add for **Production**, **Preview**, and **Development**:

| Variable | Description |
|----------|-------------|
| `ADMIN_PASSWORD` | Shared password for `/admin` login |
| `ADMIN_SESSION_SECRET` | Random secret string (32+ characters) used to sign session cookies |

Example for `ADMIN_SESSION_SECRET` (generate your own):

```
openssl rand -hex 32
```

## 3. Redeploy

After KV and env vars are set, trigger a new deployment (**Deployments → Redeploy** or push to `main`).

## 4. Use the admin panel

1. Visit `https://your-domain.com/admin` (or your `*.vercel.app` URL + `/admin`).
2. Sign in with `ADMIN_PASSWORD`.
3. **Content** tab — edit hero, services, about, contact, hours, footer; click **Save content**.
4. **Messages** tab — view contact form submissions from the public site.

The admin URL is not linked from the public site; bookmark it for private access.

## API routes

| Route | Method | Access |
|-------|--------|--------|
| `/api/content` | GET | Public (site content) |
| `/api/content` | PUT | Admin only |
| `/api/contact` | POST | Public (contact form) |
| `/api/messages` | GET | Admin only |
| `/api/login` | POST | Public |
| `/api/logout` | POST | Public |
| `/api/session` | GET | Public |

## Troubleshooting

- **Login fails immediately** — Check `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` are set and redeploy.
- **Content save / messages fail** — Confirm KV is linked to the project and env vars exist after linking.
- **Contact form errors** — Same as above; messages are stored in KV under key `messages`.
