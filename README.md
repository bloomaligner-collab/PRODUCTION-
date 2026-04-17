# Bloom Sync Edge Function — Deployment Guide

## Deploy Steps

### 1. Install Supabase CLI (if not installed)
```bash
npm install -g supabase
```

### 2. Login to Supabase
```bash
supabase login
```

### 3. Link to Cedarwings project
```bash
supabase link --project-ref oaauobugpbcixnbmlakc
```

### 4. Deploy the Edge Function
```bash
supabase functions deploy bloom-sync
```

### 5. Schedule it to run every 5 minutes
Run this SQL in Supabase SQL editor:
```sql
-- Enable pg_cron extension first (in Extensions tab in Supabase dashboard)
SELECT cron.schedule(
  'bloom-sync-every-5min',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://oaauobugpbcixnbmlakc.supabase.co/functions/v1/bloom-sync',
    headers := '{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  )
  $$
);
```

### 6. Test manually
```bash
supabase functions invoke bloom-sync
```

Or via curl:
```bash
curl -X POST https://oaauobugpbcixnbmlakc.supabase.co/functions/v1/bloom-sync \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
