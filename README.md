# Status Compressor V8

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

## Watermark-free download from many sites (new in V8)
- Paste a link from **TikTok, Instagram, Facebook, YouTube** (including Shorts), X, Reddit, Pinterest, Snapchat and other sites a Cobalt server supports, then tap **Get media without watermark**.
- It now works for **photos, photo carousels and TikTok slideshows**, not only videos. Each photo or video gets its own card with **Save to phone** and **Share**. For several items there are **Share all** and **Save all** buttons.
- Videos also keep the **Prepare for Status (HD)** button.
- **Slideshow video.** TikTok slideshows are animated, so when a link has two or more photos the app offers **Make slideshow video**. It joins the photos into one 9:16 MP4 (720x1280), with a slow zoom and a short crossfade between photos, and adds the post's original music (tick **Add the original music**). Choose 2 to 5 seconds per photo. The new video appears at the top with Save, Share and **Prepare for Status (HD)**. The photos stay below.
- **Each photo as its own clip.** Tap **Make each photo an animated clip** to get one short MP4 per photo (same slow zoom, same seconds per photo). Each clip gets the matching slice of the music, so clip 1 has the first seconds of the song, clip 2 the next, and so on. Every clip has Save, Share and **Prepare for Status (HD)**, and there are **Share all clips** and **Save all clips** buttons. Handy for posting a slideshow as several Status updates.
- **TikTok's own version.** Some TikTok slideshows have animated stickers, logos or effects that TikTok draws on top of the photos while you watch. Those are not part of the photo files, so the app cannot rebuild them. When the TikTok service also provides TikTok's own rendered video of the slideshow, the app downloads it and shows it first, named `tiktok-slideshow.mp4`. Not every post has one.
- It is **not a copy of TikTok's own animation**: TikTok's exact transitions and effects are not available, so this is a clean zoom-and-fade version. If the music cannot be fetched, the video is made without sound and the app says so.
- It uses your phone's video chip like Fast mode. If that does not work, it falls back to the standard converter, which makes a plain slideshow without zoom or fades and is slower. If both fail you still have the photos.
- **How it works.** TikTok links still go through tikwm.com (no setup). Every other site goes through a **Cobalt** server (open-source downloader). Open **Download server (advanced)** and paste the address of a Cobalt server you can use, plus an API key only if that server asks for one. The app also tries `https://api.cobalt.tools/` after yours, but the official one normally needs a key, so expect to set your own server. Your choice is remembered on your phone. Best option: host your own Cobalt (see the Cobalt project docs), then it is private and stable.
- **About watermarks.** TikTok is the main one that stamps a logo on the shared copy. Instagram, Facebook and YouTube files are normally clean already, so for those the app just fetches the original file instead of a screen recording. A site that burns a logo into the picture itself cannot be cleaned by this app.
- Files over about 400 MB are not held in the browser. The app shows an **Open to save it** button instead.
- These are unofficial third-party services: the link you paste is sent to them, they can change or stop working, and private posts cannot be fetched. Only save media you have the right to reuse, and credit the creator.
- "Share" from Instagram, Facebook, YouTube and others into **Status Compressor** fills the link box (installed app, Chrome on Android).

## Enhance (V8)
- Tick **Enhance** to add three gentle touches after resizing: light noise cleanup, sharpening, and a small lift in contrast and color. Pick **Light**, **Medium** or **Strong**. Light is the one to start with.
- Optional **Upscale small videos to the chosen size** stretches low-resolution clips up to your chosen size with a high-quality resize filter (Lanczos). It can make small clips look a bit cleaner on screen and gives WhatsApp more pixels to work with, but it does not add real detail and it makes files bigger.
- **It cannot make a video look like real 4K.** The detail has to exist in the original. Enhance only makes what is there look a little crisper. Strong settings can look over-processed, and the noise cleanup can soften fine texture. On clips that are already sharp and clean you may see little change.
- Enhance runs in the standard converter, so Fast mode is switched off while it is on. It is noticeably slower than Fast mode, and files over about 300 MB are not supported.
- If this converter build is missing the filters, the app says so and compresses without them rather than failing.
- Your Enhance choices are remembered.

## Custom quality
- Pick **Custom...** in the quality list to set your own **video bitrate** (0.5 to 8 Mbps) and the **largest side** of the picture (960, 1280 or 1920 px).
- A live estimate shows the size of each 30-second part. Audio is counted at about 128 kbps.
- WhatsApp does not publish how much it compresses Status videos. A commonly quoted cap is about 16 MB per clip, but that is not official and sources disagree. The way to find your sweet spot is to try a few settings, post each to your own status, and keep the sharpest one that still looks untouched.
- In Fast mode the encoder aims at your bitrate. In standard mode the bitrate is a ceiling on top of CRF 21, so a simple clip can come out smaller than the estimate.
- Going very high does not guarantee a better result: a file well above WhatsApp's limits gets re-encoded harder, which is what you are trying to avoid.
- Your custom values are remembered.

## Fast mode
- **Fast mode** is a checkbox, on by default. It uses your phone's built-in video encoder (WebCodecs) instead of the slow software converter. It should be far quicker, but I could not time it on a real phone, so your speed will depend on the phone.
- It also reads your video in slices instead of loading the whole file into memory, so the size limit is about 2 GB instead of 300 MB.
- **It falls back by itself.** If your phone or browser cannot do it, the video format is unsupported, the encoder errors, or it stops responding for 60 seconds, the app switches to the standard converter and carries on from the part it was on. Parts already finished are kept. Fast mode is then turned off and a note explains why. Tick it again to retry.
- The video is re-encoded as H.264 at the preset's bitrate. Audio is copied as it is when the format allows, or converted to AAC. If audio can't be handled, the app falls back rather than give you a silent video.
- Phone hardware encoders are usually a little less efficient than the software one, so quality at the same bitrate may look slightly different. Check one clip first. If you are not happy, try Sharper, or turn Fast mode off.
- The first time you use it, a small extra library (a few hundred KB) is downloaded and saved for offline use.

## Install and offline
- Open the page in Chrome. If an **Install app** button appears, tap it. You can also use Chrome's menu > **Add to Home screen** / **Install app**.
- On your first visit the app saves its files in the background (about 30 MB, for the standard converter). After that, compressing videos from your phone works with no internet.
- Link downloading always needs internet.
- Once installed, you can use **Share** inside TikTok, Instagram and others and pick **Status Compressor**. The link is filled in for you, then tap **Get media without watermark**. (Chrome on Android only.)
- Your quality, split and fast mode choices are remembered.

## Use it
1. Choose a video.
2. Pick a quality: **Balanced** is the default, **Sharper** gives a bigger file, **Smaller** a lighter one.
3. Leave **Split into 30-second parts** on for long videos.
4. Tap **Compress for Status** and keep the tab open. Tap **Cancel** to stop; parts that already finished are kept.
5. Tap **Share all parts to WhatsApp** and choose **My status**, or share or save each part one by one.

## Link downloads
1. Tap **Paste** (or paste by hand) and then **Get media without watermark**.
2. When the media is ready, save or share it. For a video you can tap **Prepare for Status (HD)** to compress and share it.
3. If the browser blocks a direct download, tap **Open to save it**, save the file, then pick it with the file picker.

TikTok uses tikwm.com (`TIKTOK_API` near the bottom of `index.html`). Other sites use the Cobalt server you set in the app (`COBALT_DEFAULTS` in `index.html` holds the built-in fallback list).

## Updates
The page shows its version next to the title (V8). Whenever you open it or come back to the tab, it checks `version.json`. If a newer version has been uploaded, a green bar appears with an **Update now** button.

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
| Enhance makes the video look over-sharp or plastic | Use Light, or turn Enhance off. |
| Fast mode result has no sound | Turn Fast mode off and run it again, then tell me which phone and video it was. |
| "Could not load the converter" | Check your connection and try again. After one good load it is saved for offline use. |
| "Conversion failed" | Try the Smaller preset, or a shorter or smaller video. |
| Page crashes or reloads on a big video | Turn Fast mode on, or use the Smaller preset. |
| "Could not reach a download server" | The service may be down or blocking the page. Try later, or set a different Cobalt server under Download server (advanced). |
| "The download server said: the server needs an API key" | Enter the key under Download server (advanced), or use a server that does not need one. |
| "Could not build the slideshow video" | Try fewer photos, or tick Fast mode on again. The photos are still saved below. |
| "That site or link type is not supported" | The server does not handle that site. Try another Cobalt server. |
| Old version still showing | Tap **Update now**, or close the tab or installed app fully and open it again. |
| No update bar after uploading | Make sure you uploaded `version.json` too, then reload. |
| No Install button | Use Chrome, and open the https page. Or use Chrome's menu > Add to Home screen. |
| No Share button | Use Save to phone and post from the gallery. |
| Paste button missing or fails | Press and hold in the link box and paste by hand. |

## Version history
- **V8**: Watermark-free download for Instagram, Facebook, YouTube and more (through a Cobalt server you choose), and for photos, carousels and slideshows, not only videos. Save all / Share all. Make a slideshow video, or one animated clip per photo, from photos with music.
- **V7**: Enhance option (noise cleanup, sharpening, color lift, optional upscale), with automatic fallback if the filters are missing.
- **V6**: Custom quality with a bitrate slider, picture size choice and a live file-size estimate.
- **V5**: Fast mode using the phone's hardware encoder, with automatic fallback to the standard converter. Big-file limit raised to about 2 GB in fast mode. Remembers your settings.
- **V4**: Cancel button. Memory cleanup. Installable and works offline. Share all parts at once. Paste button and share-to-app for TikTok links.
- **V3**: TikTok link download without watermark, with a prompt to use the HD feature. App description text removed.
- **V2**: update prompt, visible version number, and the converter fix from v1.1.
- **v1.1**: fixed "failed to import ffmpeg-core.js".
- **v1**: first release.
