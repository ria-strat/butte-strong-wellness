# Google Play Store Listing — Butte Strong Wellness

Everything you need to paste into the Play Console. Package name: `com.buttestrongwellness.app`.
Copy lengths are within Google's limits (noted in parentheses).

---

## 1. Store listing — text

**App name** (max 30 chars)
```
Butte Strong Wellness
```

**Short description** (max 80 chars)
```
Wellness resources, peer support, and crisis help for Butte County responders.
```

**Full description** (max 4000 chars)
```
Butte Strong Wellness is the official wellness app for the Butte County first responder community — built for the men and women who serve, and for the families who stand behind them.

When you need support, you shouldn't have to search for it. This app puts the whole Butte Strong Wellness Unit in your pocket: someone to call, a place to start, and resources that respect what this work asks of you.

WHAT'S INSIDE

• Get Help Now — One-tap access to crisis lines and emergency contacts. Tap any number to call immediately.

• Peer Support — Reach trained peer support members and chaplains who understand the job. Read their backgrounds and connect directly.

• Mental Health & Resilience — A vetted directory of therapists who work with first responders, including their specialties, insurance, and contact details.

• Physical Fitness — Local gyms, training resources, and fitness programs available to the responder community.

• Family Resources — Support built for the people at home, including a dedicated family engagement contact.

• News & Events — Stay current on wellness events, trainings, and unit updates.

• Anonymous Feedback — Share what you need, confidentially, to help shape the unit's work.

WHO IT'S FOR

Butte County Sheriff's Office, Mounted Posse, allied first responder agencies, and their families.

ABOUT THE UNIT

The Butte Strong Wellness Unit exists to make sure no responder carries the weight alone. This app is one more way to mend the net — to keep support close, current, and easy to reach.

If you or someone you know is in crisis, call or text 988 (Suicide & Crisis Lifeline) or use the Get Help Now screen in the app.
```

**Category:** Health & Fitness
**Tags (choose up to 5):** Health & wellness, First aid, Mental health, Community, Lifestyle

**Contact details**
- Email: `buttestrongwellness@gmail.com`
- Website: `https://butte-strong-wellness.vercel.app`
- Phone (optional): Mandy Barrow, Family Engagement — (949) 338-4553

**Privacy Policy URL:** ⚠️ REQUIRED — see Section 5. You must host one before you can publish.

---

## 2. Graphic assets (you must upload these)

| Asset | Required size | Notes |
|---|---|---|
| App icon | 512 × 512 PNG (32-bit, alpha) | The Butte Strong shield. Generate from `resources/icon.png`. |
| Feature graphic | 1024 × 500 PNG/JPG | Shield + "Butte Strong Wellness" on navy `#0B1F4A`. Shown at top of listing. **Required.** |
| Phone screenshots | 2–8 images, 9:16, min 1080 px tall | Capture Home, Get Help Now, Peer Support, Resources. |
| 7" tablet screenshots | optional | Skip unless you want tablet store presence. |
| 10" tablet screenshots | optional | Skip. |

**How to get phone screenshots:** open https://butte-strong-wellness.vercel.app in Chrome → DevTools (F12) → toggle device toolbar → pick "iPhone 14 Pro Max" or a 1080×2340 custom size → screenshot each page. Or screenshot from the installed app on an Android phone.

Brand colors for any graphics: navy `#0B1F4A`, gold `#C9A84C`, cream `#F4F2EE`. Fonts: Bebas Neue (display), DM Sans (body).

---

## 3. Content rating questionnaire (IARC)

Answer in Play Console → "Content rating". Expected result: **Everyone**.

- Category: **Reference, News, or Educational** (or Utility) — it's an informational resource app.
- Violence: No
- Sexuality: No
- Profanity: No
- Controlled substances: No
- Gambling: No
- User-generated content / sharing: The anonymous feedback form lets users submit text — answer **Yes** to "users can interact / share content" only if asked, since feedback goes to staff (not public). It is not publicly visible, so most UGC follow-ups are No.
- References to sensitive topics (mental health / suicide resources): Yes if asked — this is supportive crisis-resource content, which is permitted.

---

## 4. Data safety form

Play Console → "Data safety". Answer based on what the app actually does:

**Does your app collect or share user data?** Yes.

| Data type | Collected? | Why | Shared? | Optional? |
|---|---|---|---|---|
| Email address | Yes (ALL users — registration + recovery) | Account management | No | No (required to register) |
| Name | Yes (feedback form — optional field) | App functionality | No | Yes |
| App activity / other user-generated content | Yes (feedback messages) | App functionality | No | Yes |
| Device or other IDs | Yes (push token via OneSignal) | App functionality — notifications | No (processed by OneSignal as a service provider) | Yes (user can decline notifications) |

> Note: the app requires a login for **every** user (not just admins). Registration collects email, password, department, and role, and is gated by an org access code. So email is collected for all users, and "Account management" is a data-collection purpose.

**Key answers:**
- Is data encrypted in transit? **Yes** (HTTPS / Supabase + OneSignal both use TLS).
- Can users request deletion? **Yes** — they can email `buttestrongwellness@gmail.com`. (State this.)
- Is any data used for advertising or shared with data brokers? **No.**
- Is data used for tracking across apps? **No.**

> ⚠️ Note: OneSignal (push notifications) is the reason "Device or other IDs" is collected. If push is **not** wired up for Android yet (no `google-services.json`), no push token is collected — in that case you may answer No to Device IDs. Keep this form in sync with what actually ships.

---

## 5. Privacy Policy (REQUIRED before publishing)

Google **will not let you publish** without a hosted privacy policy URL. Health apps are held to this strictly. You need a public URL — host the text below as a page on the Vercel site (e.g. add a `/privacy` route) or paste it into a public Google Doc and use that link.

Draft policy text:

```
PRIVACY POLICY — Butte Strong Wellness
Last updated: [DATE]

Butte Strong Wellness ("the app") is provided by the Butte County Sheriff's
Office Wellness Unit in partnership with Ría Strategies. We respect your privacy
and collect as little information as possible.

INFORMATION WE COLLECT
• Feedback you submit: If you use the feedback form, we receive the message and,
  optionally, the name and agency you choose to include. You may submit feedback
  anonymously by leaving those fields blank.
• Push notification token: If you allow notifications, we store a device token so
  we can send you wellness updates. You can turn notifications off at any time in
  your device settings.
• Staff accounts: Authorized unit administrators sign in with an email and
  password to manage app content. This applies to staff only, not general users.

We do NOT collect your location, contacts, photos, or browsing activity. We do
not use advertising, analytics trackers, or sell any data.

HOW WE USE INFORMATION
We use the information solely to operate the app, respond to feedback, and send
wellness updates you have opted into. We never use it for advertising and never
sell or share it with data brokers.

SERVICE PROVIDERS
We use Supabase (database) and OneSignal (notifications) as service providers.
They process data on our behalf under their own security and privacy terms and
do not use it for their own purposes.

DATA RETENTION & DELETION
You may request deletion of any feedback or data associated with you by emailing
buttestrongwellness@gmail.com. We will respond promptly.

CHILDREN
The app is intended for first responders and their families and is not directed
to children under 13.

CONTACT
Questions? Email buttestrongwellness@gmail.com.
```

> Replace `[DATE]` and have it reviewed by the Sheriff's Office before publishing.

---

## 6. App content & release details

- **Target audience & content:** Adults (18+) / first responder community. Not directed at children.
- **App access (CRITICAL — do not skip):** The ENTIRE app is behind a login, and registration requires an org access code the public doesn't have. Google reviewers cannot self-register, so if you don't give them a working account they will **reject the app for being inaccessible.** In **App content → App access**, select "All or some functionality is restricted" and provide:
  - A pre-created test account: email + password that is already registered (create one in advance).
  - Instructions noting the access code is only needed for *new* registration, and the provided account is already past that gate.
  - (If reviewers must register themselves, also supply the current access code — but a ready-made login is safer.)
- **Ads:** This app contains no ads → answer **No**.
- **Government app:** This is affiliated with the Butte County Sheriff's Office. If you register the developer account as an organization/government entity, you may need to complete Google's government-app declaration. Confirm which Play developer account owns this.
- **Release track:** Start with **Internal testing** (instant, up to 100 testers) → then **Closed/Open testing** → **Production**. The first production release for a brand-new app can take a few days to review.

---

## 7. First-build submission flow

1. In Codemagic, create the keystore (see `ANDROID_BUILD_SETUP.md`), then run the **android-google-play** workflow.
2. Download the signed `.aab` from the build (emailed / in artifacts).
3. Play Console → your app → **Production** (or **Internal testing**) → **Create new release** → upload the `.aab`.
4. On first upload, accept **Play App Signing** (Google manages the signing key; your keystore is the *upload* key).
5. Fill release notes, roll out.

---

## Outstanding items checklist

- [ ] Host the privacy policy and get the URL
- [ ] Create app icon 512×512 + feature graphic 1024×500
- [ ] Capture 2–8 phone screenshots
- [ ] Confirm which Google Play developer account owns the app (org vs. personal)
- [ ] Decide whether Android push (OneSignal + `google-services.json`) ships in v1 or a later update
- [ ] Provide reviewer test credentials for /admin
