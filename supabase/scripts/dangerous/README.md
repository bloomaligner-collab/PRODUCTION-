# Dangerous SQL scripts

Scripts in this folder DESTROY production data if run against a live
database. They live here — not in the repo root — so nobody opens the
project in Supabase SQL Editor, sees them in the file tree, and runs
them by accident.

Before executing any script in this folder:

1. Confirm the Supabase project ref in the top-left of the dashboard
   is NOT `cvrmadmzzualqukxxlro` (that's production).
2. Take a fresh backup (Dashboard → Database → Backups → Create).
3. Have a second pair of eyes approve the run.
