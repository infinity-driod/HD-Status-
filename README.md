# Status Compressor V2

Shrinks a video so WhatsApp leaves it nearly untouched when you post it to Status, and cuts long clips into 30-second parts. Everything runs in your phone's browser. Nothing is uploaded and no server is needed.

## Files
- `index.html`: the whole app.
- `version.json`: the current version number. The app reads this to know when an update exists.
- `README.md`: this guide.

## Put it online (GitHub Pages, from your phone)
1. Extract the zip (Files by Google > tap the zip > Extract).
2. On github.com (Chrome or Brave, **Desktop site** on), open your repo, tap **Add file > Upload files**, select `index.html` and `version.json`, and commit. Same names replace the old files.
3. Check **Settings > Pages** is set to deploy from `main`, folder `/ (root)`.
4. After about a minute, open `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

## Updates
The page shows its version next to the title (V2). Whenever you open it or come back to the tab, it checks `version.json`. If a newer version has been uploaded, a green bar appears with an **Update now** button, which reloads the newest page.

To release a new version: upload the new `index.html` **and** `version.json` together. Upload both files every time.

## Use it
1. Choose a video.
2. Pick a quality: **Balanced** is the default, **Sharper** gives a bigger file, **Smaller** a lighter one.
3. Leave **Split into 30-second parts** on for long videos.
4. Tap **Compress for Status** and keep the tab open.
5. For each part, tap **Share to WhatsApp** and choose **My status**, or **Save to phone** and post from the gallery.

## Good to know
- First load downloads about 30 MB of converter files.
- Phones convert slowly: expect a few minutes per 30-second clip. Keep the screen on.
- Files over about 400 MB are refused.
- The Share button needs HTTPS (GitHub Pages is fine) and Chrome or Brave.
- The quality presets are educated guesses. Test by posting to your own status.
- Compression stops WhatsApp from blurring the video. It does not improve the original.

## Troubleshooting
| Problem | Fix |
|---|---|
| "failed to import ffmpeg-core.js" | Use V2 or newer (fixed). Reload the page twice. |
| Stuck on "Loading the converter" | Check your connection and reload. The files come from cdn.jsdelivr.net. |
| "Conversion failed" | Try the Smaller preset, or a shorter or smaller video. |
| No update bar after uploading | Make sure you uploaded `version.json` too, then reload. |
| No Share button | Use Save to phone and post from the gallery. |

## Version history
- **V2**: update prompt, visible version number, and the converter fix from v1.1.
- **v1.1**: fixed "failed to import ffmpeg-core.js".
- **v1**: first release.
