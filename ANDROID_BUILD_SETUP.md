# Android / Google Play Build Setup

How the Android build works and the one-time setup you need to do in Codemagic.

## How it works

`codemagic.yaml` now has two workflows:
- `ios-app-store` — the existing iOS build (unchanged)
- `android-google-play` — the new Android build

The Android workflow runs on a Linux machine and:
1. Installs deps, builds the web app (`npm run build`)
2. Generates the native Android project fresh (`npx cap add android` — the `android/` folder is **not** in git, same as iOS)
3. Generates launcher icons + splash from `resources/icon.png` (navy `#0B1F4A` background)
4. Patches `versionCode` (auto-incremented from Codemagic's build number) and injects the release signing config
5. Builds a signed **AAB** (`android/app/build/outputs/bundle/release/app-release.aab`) and emails it to you

The output is an **`.aab`** (Android App Bundle) — that's what Google Play wants, not an APK.

## One-time setup: create the keystore in Codemagic

The workflow expects a keystore stored under the reference name **`buttestrong_keystore`**. Create it once:

1. Open your app in Codemagic → **Settings** (gear) → **Code signing identities** → **Android keystores**.
2. Click **Generate keystore** (Codemagic makes one for you — no local tools needed).
3. Fill in:
   - **Reference name:** `buttestrong_keystore`  ← must match exactly
   - **Keystore password:** pick a strong one
   - **Key alias:** `upload`  (any value is fine)
   - **Key password:** pick a strong one (can be the same as keystore password)
   - **Validity:** 9999 days (a very long validity — Google recommends 25+ years)
   - Certificate fields (Name/Org/Country): "Butte Strong Wellness" / "Butte County Sheriff's Office" / "US"
4. Click **Generate / Save**.
5. **IMPORTANT — back it up:** click **Download keystore** and save the file plus both passwords somewhere safe (password manager). This is your *upload key*. With Google Play App Signing, if it's ever lost you can request a reset — but back it up anyway.

When the workflow runs with `android_signing: [buttestrong_keystore]`, Codemagic automatically provides `CM_KEYSTORE_PATH`, `CM_KEYSTORE_PASSWORD`, `CM_KEY_ALIAS`, and `CM_KEY_PASSWORD` to the build — that's what the gradle signing config reads.

## Run the build

1. Commit & push the `codemagic.yaml` change (see below).
2. In Codemagic, **Start new build** → pick branch `main` → workflow **Butte Strong Wellness — Android Google Play**.
3. When it finishes, the signed `.aab` is emailed to tricerri@gmail.com and available in the build's Artifacts.

## Notes / follow-ups

- **Push notifications (Android):** OneSignal needs a `google-services.json` (FCM) to deliver push on Android. The build succeeds without it, but push won't work until that's wired up. Decide whether push ships in v1 or a later update.
- **versionName** is pinned to `1.0` to match the iOS submission. Bump it in the inject step when you cut a new marketing version.
- **First Play upload:** must be done manually via the Play Console for a new app. Automated Play publishing can be enabled later (commented `google_play` block in the yaml).
- See `PLAY_STORE_LISTING.md` for all store-listing copy, data-safety answers, the required privacy policy, and asset specs.
