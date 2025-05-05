# Google Auth Setup with Supabase

This guide will help you set up Google OAuth authentication with Supabase for both local development and production.

## Environment Variables

Make sure you have the following environment variables in your `.env` file:

```
# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321  # For local dev
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google OAuth configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
SUPABASE_AUTH_GOOGLE_CLIENT_ID=your-google-client-id  # Same as above
SUPABASE_AUTH_GOOGLE_SECRET=your-google-client-secret

# For local development with self-signed certificates (if using HTTPS locally)
NODE_TLS_REJECT_UNAUTHORIZED=0
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to "APIs & Services" > "Credentials".
4. Click "Create Credentials" and select "OAuth client ID".
5. Select "Web application" as the application type.
6. Add the following Authorized JavaScript origins:
   - `http://localhost:3000` (for local development)
   - `http://127.0.0.1:3000` (alternative local URL)
   - `https://yourdomain.com` (for production)

7. Add the following Authorized redirect URIs:
   - `http://localhost:54321/auth/v1/callback` (for local Supabase)
   - `http://localhost:3000/auth/callback` (for local Next.js app)
   - `https://yourdomain.com/auth/callback` (for production)
   - `https://project-ref.supabase.co/auth/v1/callback` (for production Supabase)

8. Click "Create" and note your Client ID and Client Secret.

## Local Supabase Setup

For local development with Supabase, you need to create a `supabase/config.toml` file with the following content:

```toml
[auth]
site_url = "http://localhost:3000"

# A list of URLs allowed for redirects
additional_redirect_urls = [
  "http://localhost:3000/**",
  "http://127.0.0.1:3000/**",
  "http://localhost:54321/auth/v1/callback",
  "http://localhost:3000/auth/callback"
]

# If enabled, the nonce check will be skipped. Required for local sign in with Google auth.
skip_nonce_check = true

# Configure Google OAuth provider
[auth.external.google]
enabled = true
client_id = "env(SUPABASE_AUTH_GOOGLE_CLIENT_ID)"
secret = "env(SUPABASE_AUTH_GOOGLE_SECRET)"
redirect_uri = "http://localhost:54321/auth/v1/callback"
```

## Common Issues and Solutions

### 1. Redirect Issues

If you're seeing errors related to redirects:
- Ensure all your redirect URLs are properly added to Google Cloud Console
- Make sure `additional_redirect_urls` in your Supabase config includes all relevant URLs
- Use double asterisks (`**`) for wildcard paths in redirect URLs

### 2. Token Exchange Issues

If you're getting errors during token exchange:
- Set `skip_nonce_check = true` in your local Supabase config
- Use `sameSite: 'lax'` for cookies instead of 'strict' in local development
- Ensure your cookies are not set with `secure: true` in local development

### 3. Cookie Issues

In development:
- Use `sameSite: 'lax'` for cookies
- Set `secure: process.env.NODE_ENV === 'production'` to ensure cookies work on HTTP in development

### 4. localhost vs 127.0.0.1

Make sure you consistently use either:
- `http://localhost:3000` or
- `http://127.0.0.1:3000`

Mixing these can cause issues with cookie domains. It's recommended to stick with `localhost` for all configurations.

## Testing

To test if your setup is working:
1. Start your Supabase local instance
2. Start your Next.js application
3. Try signing in with Google
4. Check browser console for any error messages
5. Verify cookies are set properly in the Application tab of developer tools 