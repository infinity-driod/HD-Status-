# Status Compressor v1

Shrinks a video so WhatsApp leaves it nearly untouched when you post it to Status, and cuts long clips into 30-second parts. Everything runs in your phone's browser. Nothing is uploaded and no server is needed.

## Files
- `index.html`: the whole app (one file).
- `README.md`: this guide.

## Put it online (GitHub Pages, from your phone)
1. Extract the zip (Files by Google > tap the zip > Extract).
2. On github.com (Chrome or Brave, **Desktop site** on), open your repo, tap **Add file > Upload files**, select `index.html` and commit. If the repo already has an `index.html`, this replaces it.
3. In the repo: **Settings > Pages**, set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. After about a minute, open `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

## Use it
1. Choose a video.
2. Pick a quality: **Balanced** is the default. **Sharper** gives a bigger file, **Smaller** a lighter one.
3. Leave **Split into 30-second parts** on for long videos.
4. Tap **Compress for Status** and keep the tab open.
5. For each part, tap **Share to WhatsApp** and choose **My status**. Or tap **Save to phone** and post it from the gallery.

## Good to know
- First load downloads about 30 MB of converter files. After that it is faster.
- Phones convert slowly: expect a few minutes per 30-second clip. Keep the screen on.
- Files over about 400 MB are refused.
- The Share button needs HTTPS (GitHub Pages is fine) and a browser that supports file sharing (Chrome, Brave).
- The quality presets are educated guesses. Test by posting to your own status and comparing.
- Compression stops WhatsApp from blurring the video. It does not improve the original.

## Troubleshooting
| Problem | Fix |
|---|---|
| Stuck on "Loading the converter" | Check your connection and reload. The files come from cdn.jsdelivr.net. |
| "Conversion failed" | Try the Smaller preset, or a shorter or smaller video. Send the error text to get it fixed. |
| Page not found after upload | Wait a minute, and check Settings > Pages is enabled. |
| No Share button | Use Save to phone and post from the gallery. |

## Version
- **v1**: in-browser compression with 3 presets, 30-second splitting, share and save.
