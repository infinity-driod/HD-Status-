# Status Compressor V5

Shrinks a video so WhatsApp leaves it nearly untouched when you post it to Status, and cuts long clips into 30-second parts. Everything runs in your phone's browser. Nothing is uploaded and no server is needed.

## Files
Upload all of these every time you release a version:
- `index.html`: the app.
- `version.json`: the current version number. The app reads this to know when an update exists.
- `sw.js`: the offline helper (service worker).
- `manifest.json`: lets you install the app and receive shared links.
- `icon-192.png`, `icon-512.png`: the app icon.
- `README.md`: this guide (optional to upload).

## Put it online (GitHub Pages, from your phone)
1. Extract the zip (Files by Google > tap the zip > Extract).
2. On github.com (Chrome or Brave, **Desktop site** on), open your repo, tap **Add file > Upload files**, select every file except `README.md`, and commit. Same names replace the old files.
3. Check **Settings > Pages** is set to deploy from `main`, folder `/ (root)`.
4. After about a minute, open `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

## Fast mode (new in V5)
- **Fast mode** is a checkbox, on by default. It uses your phone's built-in video encoder (WebCodecs) instead of the slow software converter. It should be far quicker, but I could not time it on a real phone, so your speed will depend on the phone.
- It also reads your video in slices instead of loading the whole file into memory, so the size limit is about 2 GB instead of 300 MB.
- **It falls back by itself.** If your phone or browser cannot do it, the video format is unsupported, the encoder errors, or it stops responding for 60 seconds, the app switches to the standard converter and carries on from the part it was on. Parts already finished are kept. Fast mode is then turned off and a note explains why. Tick it again to retry.
- The video is re-encoded as H.264 at the preset's bitrate. Audio is copied as it is when the format allows, or converted to AAC. If audio can't be handled, the app falls back rather than give you a silent video.
- Phone hardware encoders are usually a little less efficient than the software one, so quality at the same bitrate may look slightly different. Check one clip first. If you are not happy, try Sharper, or turn Fast mode off.
- The first time you use it, a small extra library (a few hundred KB) is downloaded and saved for offline use.

## Install and offline
- Open the page in Chrome. If an **Install app** button appears, tap it. You can also use Chrome's menu > **Add to Home screen** / **Install app**.
- On your first visit the app saves its files in the background (about 30 MB, for the standard converter). After that, compressing videos from your phone works with no internet.
- The TikTok feature always needs internet.
- Once installed, you can use **Share** inside TikTok and pick **Status Compressor**. The link is filled in for you, then tap **Get video without watermark**. (Chrome on Android only.)
- Your quality, split and fast mode choices are remembered.

## Use it
1. Choose a video.
2. Pick a quality: **Balanced** is the default, **Sharper** gives a bigger file, **Smaller** a lighter one.
3. Leave **Split into 30-second parts** on for long videos.
4. Tap **Compress for Status** and keep the tab open. Tap **Cancel** to stop; parts that already finished are kept.
5. Tap **Share all parts to WhatsApp** and choose **My status**, or share or save each part one by one.

## TikTok links
1. Tap **Paste** (or paste by hand) and then **Get video without watermark**.
2. When the video is ready, the app asks if you want the HD feature for WhatsApp Status. Tap **Save to phone** to keep it as is, or **Yes, prepare for Status (HD)** to compress and share it.
3. If the browser blocks the direct download, tap **Open video to save it**, save the file, then pick it with the file picker.

This uses an unofficial third-party service (tikwm.com), so the link you paste is sent to it, and it can change or stop working. The address is `TIKTOK_API` near the bottom of `index.html`. Only save videos you have the right to reuse, and credit the creator.

## Updates
The page shows its version next to the title (V5). Whenever you open it or come back to the tab, it checks `version.json`. If a newer version has been uploaded, a green bar appears with an **Update now** button.

## Good to know
- Standard mode is slow on phones: expect a few minutes per 30-second clip. Keep the screen on in either mode.
- Standard mode refuses files over about 300 MB. Fast mode allows about 2 GB.
- After each run the converter is shut down to free memory.
- Sharing needs HTTPS (GitHub Pages is fine) and Chrome or Brave. Sharing many large parts at once may be refused by the phone; if so, share them one by one.
- The quality presets are educated guesses. Test by posting to your own status.
- Compression stops WhatsApp from blurring the video. It does not improve the original.
- Fast mode loads the Mediabunny library (version 1.61.3, pinned) from cdn.jsdelivr.net, the same CDN as the standard converter.

## Troubleshooting
| Problem | Fix |
|---|---|
| Note says "Fast mode did not work on this phone" | Nothing is wrong: the standard method finished the job. Tick Fast mode again to retry, or leave it off. |
| Fast mode result has no sound | Turn Fast mode off and run it again, then tell me which phone and video it was. |
| "Could not load the converter" | Check your connection and try again. After one good load it is saved for offline use. |
| "Conversion failed" | Try the Smaller preset, or a shorter or smaller video. |
| Page crashes or reloads on a big video | Turn Fast mode on, or use the Smaller preset. |
| "Could not reach the TikTok service" | The service may be down or blocking the page. Try later, or save the video another way and pick it with the file picker. |
| Old version still showing | Tap **Update now**, or close the tab or installed app fully and open it again. |
| No update bar after uploading | Make sure you uploaded `version.json` too, then reload. |
| No Install button | Use Chrome, and open the https page. Or use Chrome's menu > Add to Home screen. |
| No Share button | Use Save to phone and post from the gallery. |
| Paste button missing or fails | Press and hold in the link box and paste by hand. |

## Version history
- **V5**: Fast mode using the phone's hardware encoder, with automatic fallback to the standard converter. Big-file limit raised to about 2 GB in fast mode. Remembers your settings.
- **V4**: Cancel button. Memory cleanup. Installable and works offline. Share all parts at once. Paste button and share-to-app for TikTok links.
- **V3**: TikTok link download without watermark, with a prompt to use the HD feature. App description text removed.
- **V2**: update prompt, visible version number, and the converter fix from v1.1.
- **v1.1**: fixed "failed to import ffmpeg-core.js".
- **v1**: first release.
