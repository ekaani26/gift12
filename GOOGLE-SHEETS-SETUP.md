# Activate Gift12 form saving

Prepared for Vercel hosting. If this app is hosted elsewhere, adapt `/api/leads.js` to that host before merging. Plain static hosting and `vite preview` do not run this server endpoint.

Destination: the existing **diwlai camp data** spreadsheet. The receiver creates a dedicated **Gift12 Leads** tab on first successful submission and preserves other tabs.

1. In that spreadsheet, open **Extensions > Apps Script**. Paste `google-apps-script/Code.gs` into the script editor and save.
2. Create a random secret of at least 32 characters. Under **Project Settings > Script properties**, set `LEAD_SECRET` to that value and `SPREADSHEET_ID` to the ID from your Google Sheet URL (between `/d/` and `/edit`). Do not put the secret in GitHub or any `VITE_` variable.
3. Choose **Deploy > New deployment > Web app**, execute as **Me**, access **Anyone**. Authorize your account and copy the URL ending in `/exec`. The sheet itself stays private; the receiver checks the secret on every request.
4. In the site's Vercel project, add server environment variables `GOOGLE_SHEETS_WEB_APP_URL` (the `/exec` URL) and `GOOGLE_SHEETS_SECRET` (the same secret). Configure Preview first to test this branch; configure Production before merging and redeploying.
5. Test the preview: submit a clearly labelled test name, verify one row in **Gift12 Leads**, then submit a test phone and verify that the same row is updated. Test a connection failure: the form should keep its values, show an error and allow retry, without unlocking the next screen. Check that repeated submissions in the same flow do not add duplicate rows. Remove only your test row afterward.

The code waits for a confirmed Sheets write before advancing. Retries within the same page instance reuse a submission ID. Reloading starts a new submission; duplicate people are not merged by phone. No lead data is stored in browser persistent storage or server logs. Public forms can still receive spam; configure host-level rate limiting if needed. Apps Script quotas apply.

No live endpoint has been deployed or end-to-end write verified by this code change alone.

References: https://developers.google.com/apps-script/guides/web and https://vercel.com/docs/functions/runtimes/node-js
