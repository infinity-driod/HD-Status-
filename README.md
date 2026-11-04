# HD Status

Upload a photo or video, get it back on WhatsApp without compression, then forward it to your Status.

The page prepares your files (up to 20 per batch; H.264/AAC MP4 under 16 MB or JPEG under 5 MB each) and gives you one `wa.me` link with a one-time ID. You tap Send once, Meta calls this server's webhook, and the server sends every file back through the WhatsApp Cloud API. WhatsApp has no official API for posting to Status, so the last step (forward > My status) is a manual tap.

Everything below works from a phone browser. In Chrome, turn on **Desktop site** (⋮ menu > Desktop site) for the Meta and GitHub pages.

## 1. Meta (WhatsApp Cloud API)
1. Go to developers.facebook.com > My Apps > Create App > type **Business**.
2. Add the **WhatsApp** product.
3. Open **WhatsApp > API Setup**. Copy the **Phone number ID**, the **temporary access token** and the test number.
4. Under "To", add your own number and enter the code WhatsApp sends you.
5. Go to **App settings > Basic** and copy the **App secret**.

## 2. GitHub
1. Open the zip in **Files by Google** and tap **Extract**.
2. On github.com > New repository. Name it `hd-status` and make it Public.
3. **Add file > Upload files**, select every file from the unzipped folder, and tap Commit.
4. Already uploaded an older version? Upload the new files with the same names to replace them. Render redeploys by itself.

## 3. Render (free hosting)
1. Sign up at render.com. New > **Web Service**, paste your repo URL (or connect GitHub).
2. Render detects the Dockerfile. Pick the **Free** instance.
3. Add these environment variables (see `env.example`):
   `WHATSAPP_TOKEN`, `PHONE_NUMBER_ID`, `WA_BUSINESS_NUMBER` (test number, digits only), `VERIFY_TOKEN` (any random string), `APP_SECRET`, `APP_PASSWORD` (your choice).
4. Deploy. When it's live, copy the URL, like `https://hd-status-xxxx.onrender.com`.

## 4. Connect the webhook
In Meta: **WhatsApp > Configuration > Webhook > Edit**.
- Callback URL: `https://YOUR-RENDER-URL/webhook`
- Verify token: the same `VERIFY_TOKEN`
- Verify and save, then subscribe to **messages**.

## 5. Use it (batch mode)
1. Open your Render URL on your phone. Tap the file box and select up to 20 photos or videos (long-press one, then tap the others).
2. Tap **Prepare files**. Each file is converted in turn, with progress shown.
3. Tap **Open WhatsApp** and press Send once on the pre-filled message.
4. All files arrive in that chat, in order. Long-press one, tap the others, then the forward arrow > **My status**.

## Good to know
- **Free tier sleeps** after 15 minutes idle and takes about a minute to wake. Opening the page first wakes it before you tap Send, so this mostly takes care of itself.
- **Free tier is slow (0.1 CPU).** Videos that are already H.264 are copied instantly. iPhone HEVC videos need converting, which is slow; switch the camera to Settings > Camera > Formats > Most Compatible, or use a paid instance.
- **Token:** the temporary token expires after about 24 hours. For a permanent one: Meta Business Settings > Users > System Users, create one, give it your app with `whatsapp_business_messaging`, generate a token, and replace `WHATSAPP_TOKEN` in Render.
- Never put tokens in GitHub files. Use Render's environment variables only.

## Troubleshooting
| Problem | Fix |
|---|---|
| Nothing comes back after Send | Webhook not verified or not subscribed to `messages`. Check Render logs. |
| Error 131030 in logs | Your number isn't in the recipient list (step 1.4). |
| Webhook returns 401 | `APP_SECRET` doesn't match the app's secret. |
| "Video is too long" | Trim it. Status has its own length limit too. |
| Token errors after a day | Use the permanent system-user token. |
| iPhone photo fails | Switch Camera > Formats to Most Compatible (JPEG). |
