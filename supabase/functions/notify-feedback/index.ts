// Butte Strong Wellness — Feedback Email Notification
// Triggered by Supabase Database Webhook on feedback INSERT
// Sends an email to Jodi and Mandy via Resend
//
// RESEND_API_KEY is stored in Supabase Secrets (never in code)

const NOTIFY_EMAILS = [
  'jdrysdale@buttecounty.ca.gov',
  'mandyjoybarrow@yahoo.com',
]

Deno.serve(async (req) => {
  try {
    const payload = await req.json()
    const record  = payload.record   // the new feedback row

    const from    = record.name   || 'Anonymous'
    const agency  = record.agency || 'Not specified'
    const message = record.message

    const submitted = new Date(record.created_at).toLocaleString('en-US', {
      timeZone:  'America/Los_Angeles',
      month:     'short',
      day:       'numeric',
      year:      'numeric',
      hour:      'numeric',
      minute:    '2-digit',
    })

    const subject = record.name
      ? `New Feedback from ${record.name}`
      : 'New Anonymous Feedback'

    const body = [
      'New feedback was submitted on the Butte Strong Wellness app.',
      '',
      `From:    ${from}`,
      `Agency:  ${agency}`,
      `Time:    ${submitted} PT`,
      '',
      `"${message}"`,
      '',
      '─────────────────────────────────────',
      'View & manage all feedback:',
      'https://butte-strong-wellness.vercel.app/admin/dashboard',
    ].join('\n')

    const res = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    'Butte Strong Wellness <onboarding@resend.dev>',
        to:      NOTIFY_EMAILS,
        subject,
        text:    body,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      status:  res.status,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('notify-feedback error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
