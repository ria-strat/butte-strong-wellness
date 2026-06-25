import { useNavigate } from 'react-router-dom'
import LogoMark from '../assets/LogoMark'

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-sans font-semibold text-navy text-[15px]">{title}</h2>
      <div className="font-sans text-[13px] text-navy/70 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  )
}

export default function Privacy() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream">

      {/* Header */}
      <div className="relative bg-navy pt-14 pb-8 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 0% 100%, rgba(201,168,76,0.1) 0%, transparent 65%)' }} />
        <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: '#C9A84C' }} />
        <div className="relative z-10">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 font-sans text-[12px] text-cream/40 hover:text-cream/70 transition-colors mb-4 cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <div className="flex items-center gap-3 mb-3">
            <LogoMark size={32} />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] font-medium mb-3"
            style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'rgba(201,168,76,0.8)' }}>
            Legal
          </span>
          <h1 className="font-display text-cream uppercase leading-none"
            style={{ fontSize: 'clamp(2.2rem,10vw,3rem)' }}>
            Privacy<br />Policy
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent 0%, #C9A84C 40%, #C9A84C 60%, transparent 100%)', opacity: 0.3 }} />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-6 flex flex-col gap-6 max-w-lg mx-auto w-full pb-12">

        <p className="font-sans text-[12px] text-navy/40 italic">
          Published by the Butte County Sheriff's Office · Effective June 18, 2026
        </p>

        <Section title="Overview">
          <p>
            The Butte Strong Wellness app is provided by the Butte County Sheriff's Office to support
            the wellness of Butte County first responders and their families. Access is restricted to
            authorized personnel and family members. This policy explains what information we collect,
            how we use it, and your rights.
          </p>
        </Section>

        <Section title="Account Creation and Access">
          <p>
            The app requires an access code to register. This code is distributed by the Butte County
            Sheriff's Office to verify that users are authorized first responders or their immediate
            family members.
          </p>
          <p>When you create an account, we collect:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your email address (used for account recovery only — we do not send marketing email)</li>
            <li>A password (stored encrypted; we never see your plain-text password)</li>
            <li>Your department or agency</li>
            <li>Your role: Sworn Staff, Civilian Staff, or Family Member</li>
          </ul>
        </Section>

        <Section title="Notification Preferences">
          <p>
            If you opt in to push notifications, your department and role selections are used to
            deliver relevant wellness announcements. This information is stored as an anonymous tag
            on our notification service and is not linked to your email address.
          </p>
        </Section>

        <Section title="Feedback Form">
          <p>
            If you submit feedback, we collect your message and optionally your name and agency.
            Feedback is only accessible to authorized administrators.
          </p>
        </Section>

        <Section title="What We Don't Collect">
          <ul className="list-disc pl-5 space-y-1">
            <li>We do not collect your badge number, employee ID, or any government-issued identifier</li>
            <li>We do not track your location</li>
            <li>We do not share your information with advertisers or third parties for commercial purposes</li>
          </ul>
        </Section>

        <Section title="Who Can See Your Information">
          <p>
            Your profile information (department, role) is not visible to other users. Administrators
            can see submitted feedback. No user can see another user's account details.
          </p>
        </Section>

        <Section title="How We Use Your Information">
          <ul className="list-disc pl-5 space-y-1">
            <li>Email: account recovery only</li>
            <li>Department + role: delivering relevant push notifications</li>
            <li>Feedback: reviewed by the wellness team to improve the program</li>
          </ul>
        </Section>

        <Section title="Third-Party Services">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Supabase</strong> — secure database and user authentication</li>
            <li><strong>OneSignal</strong> — push notification delivery. Your notification tag (department + role) is processed by OneSignal.</li>
            <li><strong>Vercel</strong> — app hosting</li>
          </ul>
        </Section>

        <Section title="Data Retention">
          <p>
            Your account and profile data are retained while your account is active. You may request
            account deletion by contacting us at buttestrongwellness@gmail.com, and we will delete
            your data within 30 days. Feedback submissions are retained until manually deleted by
            an administrator.
          </p>
        </Section>

        <Section title="Your Rights">
          <p>
            You may update your department and role at any time within the app. You may opt out of
            push notifications through your device settings or within the app. You may request full
            account deletion by emailing buttestrongwellness@gmail.com.
          </p>
        </Section>

        <Section title="Children">
          <p>
            This app is not directed to children under 13. Access requires an organizational access
            code not available to the general public.
          </p>
        </Section>

        <Section title="Contact">
          <p>Questions about this policy: buttestrongwellness@gmail.com</p>
        </Section>

      </div>
    </div>
  )
}
