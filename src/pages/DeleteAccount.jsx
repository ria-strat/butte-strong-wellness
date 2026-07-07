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

export default function DeleteAccount() {
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
            Account
          </span>
          <h1 className="font-display text-cream uppercase leading-none"
            style={{ fontSize: 'clamp(2.2rem,10vw,3rem)' }}>
            Delete<br />Account
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent 0%, #C9A84C 40%, #C9A84C 60%, transparent 100%)', opacity: 0.3 }} />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-6 flex flex-col gap-6 max-w-lg mx-auto w-full pb-12">

        <p className="font-sans text-[12px] text-navy/40 italic">
          Butte Strong Wellness · Published by the Butte County Sheriff's Office
        </p>

        <Section title="Request Account Deletion">
          <p>
            If you have an account in the <strong>Butte Strong Wellness</strong> app, you may request
            that your account and its associated data be permanently deleted. To do so:
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Send an email to <strong>buttestrongwellness@gmail.com</strong>.</li>
            <li>Send it <strong>from the email address associated with your account</strong>, so we can verify the request.</li>
            <li>Use the subject line <strong>"Delete My Account"</strong>.</li>
          </ol>
          <p>
            We will verify your request and permanently delete your account within <strong>30 days</strong>.
            You do not need to be logged in to make this request.
          </p>
        </Section>

        <Section title="What Data Is Deleted">
          <p>When your account is deleted, we permanently remove:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your email address and login credentials</li>
            <li>Your profile information (department/agency and role)</li>
            <li>Your notification preferences and tags</li>
          </ul>
          <p>
            Any feedback you submitted through the app can also be deleted on request — just note this
            in your email. Feedback is not linked to your login and may be submitted anonymously.
          </p>
        </Section>

        <Section title="What Data Is Kept">
          <p>
            We do not retain account data after deletion. In limited cases, we may keep minimal records
            only where required by law, and only for the period the law requires. We do not sell or share
            your information, and we do not use it for advertising.
          </p>
        </Section>

        <Section title="Questions">
          <p>
            If you have any questions about deleting your account or your data, contact us at
            {' '}buttestrongwellness@gmail.com.
          </p>
        </Section>

      </div>
    </div>
  )
}
