import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

// ── Icons ────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
)
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const SignOutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

// ── Shared UI ────────────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0"
      style={{ backgroundColor: value ? '#1A8A72' : 'rgba(11,31,74,0.15)' }}
    >
      <span
        className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform"
        style={{ transform: value ? 'translateX(18px)' : 'translateX(2px)' }}
      />
    </button>
  )
}

function Badge({ label, color = '#C9A84C' }) {
  return (
    <span className="rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide" style={{ backgroundColor: `${color}18`, color }}>
      {label}
    </span>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder, required, as }) {
  const cls = "w-full rounded-lg px-3 py-2 font-sans text-[13px] text-navy bg-white outline-none focus:ring-2 focus:ring-navy/20"
  const style = { border: '1px solid rgba(11,31,74,0.15)' }
  return (
    <div className="flex flex-col gap-1">
      <label className="font-sans text-[10px] uppercase tracking-[0.15em] text-navy/40 font-semibold">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {as === 'textarea'
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls} style={style} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} className={cls} style={style} />
      }
    </div>
  )
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="w-4 h-4 rounded accent-navy" />
      <span className="font-sans text-[13px] text-navy/70">{label}</span>
    </label>
  )
}

function SaveBar({ onSave, onCancel, saving }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <button onClick={onSave} disabled={saving} className="flex items-center gap-1.5 rounded-lg px-4 py-2 font-sans text-[12px] font-semibold text-white cursor-pointer disabled:opacity-50" style={{ backgroundColor: '#0B1F4A' }}>
        <CheckIcon />{saving ? 'Saving…' : 'Save'}
      </button>
      <button onClick={onCancel} className="flex items-center gap-1.5 rounded-lg px-4 py-2 font-sans text-[12px] font-semibold text-navy/60 border border-navy/15 cursor-pointer bg-white">
        <XIcon />Cancel
      </button>
    </div>
  )
}

function AddButton({ onClick, label = 'Add' }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-sans text-[12px] font-semibold text-white cursor-pointer" style={{ backgroundColor: '#C9A84C' }}>
      <PlusIcon />{label}
    </button>
  )
}

// ── Empty form templates ─────────────────────────────────────────────────────
const emptyMember = { name: '', agency: '', phone: '', email: '', bio: '', experience: '', is_chaplain: false, sort_order: 0, is_active: true, photo_url: null }
const emptyEvent  = { title: '', event_date: '', event_time: '', location: '', description: '', registration_url: '', is_active: true }
const emptyTherapist = { name: '', title: '', phone: '', email: '', address: '', insurance: '', bio: '', quote: '', sort_order: 0, is_active: true }
const emptyCrisis = { name: '', phone: '', description: '', sort_order: 0, is_active: true }

// ── Member form (used for both add and edit) ─────────────────────────────────
function MemberForm({ form, setForm, onSave, onCancel, saving }) {
  const f = key => val => setForm(prev => ({ ...prev, [key]: val }))
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name" value={form.name} onChange={f('name')} required />
        <Field label="Agency" value={form.agency || ''} onChange={f('agency')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Phone" value={form.phone || ''} onChange={f('phone')} type="tel" />
        <Field label="Email" value={form.email || ''} onChange={f('email')} type="email" />
      </div>
      <Field label="Bio" value={form.bio || ''} onChange={f('bio')} as="textarea" />
      <Field label="Areas of Experience" value={form.experience || ''} onChange={f('experience')} as="textarea" />
      <Field label="Sort Order" value={String(form.sort_order ?? 0)} onChange={v => f('sort_order')(parseInt(v) || 0)} type="number" />
      <div className="flex gap-4">
        <Checkbox label="Is Chaplain" checked={!!form.is_chaplain} onChange={f('is_chaplain')} />
        <Checkbox label="Active" checked={!!form.is_active} onChange={f('is_active')} />
      </div>
      <SaveBar onSave={onSave} onCancel={onCancel} saving={saving} />
    </div>
  )
}

// ── Event form ───────────────────────────────────────────────────────────────
function EventForm({ form, setForm, onSave, onCancel, saving }) {
  const f = key => val => setForm(prev => ({ ...prev, [key]: val }))
  return (
    <div className="flex flex-col gap-3">
      <Field label="Title" value={form.title} onChange={f('title')} required />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date" value={form.event_date || ''} onChange={f('event_date')} type="date" />
        <Field label="Time" value={form.event_time || ''} onChange={f('event_time')} placeholder="e.g. 6:00 PM" />
      </div>
      <Field label="Location" value={form.location || ''} onChange={f('location')} />
      <Field label="Description" value={form.description || ''} onChange={f('description')} as="textarea" />
      <Field label="Registration URL" value={form.registration_url || ''} onChange={f('registration_url')} type="url" placeholder="https://…" />
      <Checkbox label="Active (visible to users)" checked={!!form.is_active} onChange={f('is_active')} />
      <SaveBar onSave={onSave} onCancel={onCancel} saving={saving} />
    </div>
  )
}

// ── Therapist form ───────────────────────────────────────────────────────────
function TherapistForm({ form, setForm, onSave, onCancel, saving }) {
  const f = key => val => setForm(prev => ({ ...prev, [key]: val }))
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name" value={form.name} onChange={f('name')} required />
        <Field label="Title / License" value={form.title || ''} onChange={f('title')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Phone" value={form.phone || ''} onChange={f('phone')} type="tel" />
        <Field label="Email" value={form.email || ''} onChange={f('email')} type="email" />
      </div>
      <Field label="Address" value={form.address || ''} onChange={f('address')} />
      <Field label="Insurance / Payment" value={form.insurance || ''} onChange={f('insurance')} as="textarea" />
      <Field label="Bio" value={form.bio || ''} onChange={f('bio')} as="textarea" />
      <Field label="Quote (optional)" value={form.quote || ''} onChange={f('quote')} as="textarea" />
      <Checkbox label="Active" checked={!!form.is_active} onChange={f('is_active')} />
      <SaveBar onSave={onSave} onCancel={onCancel} saving={saving} />
    </div>
  )
}

// ── Crisis form ──────────────────────────────────────────────────────────────
function CrisisForm({ form, setForm, onSave, onCancel, saving }) {
  const f = key => val => setForm(prev => ({ ...prev, [key]: val }))
  return (
    <div className="flex flex-col gap-3">
      <Field label="Name" value={form.name} onChange={f('name')} required />
      <Field label="Phone / Number" value={form.phone || ''} onChange={f('phone')} />
      <Field label="Description" value={form.description || ''} onChange={f('description')} as="textarea" />
      <Checkbox label="Active" checked={!!form.is_active} onChange={f('is_active')} />
      <SaveBar onSave={onSave} onCancel={onCancel} saving={saving} />
    </div>
  )
}

// ── Generic row card ─────────────────────────────────────────────────────────
function RowCard({ label, sub, active, onToggle, onEdit, onDelete, children }) {
  return (
    <div>
      <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white" style={{ border: '1px solid rgba(11,31,74,0.07)', opacity: active ? 1 : 0.5 }}>
        <div className="flex-1 min-w-0">
          <span className="font-sans font-semibold text-navy text-[13px] block truncate">{label}</span>
          {sub && <p className="font-sans text-[11px] text-navy/40 mt-0.5 truncate">{sub}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Toggle value={active} onChange={onToggle} />
          {onEdit && (
            <button onClick={onEdit} className="p-1.5 rounded-lg cursor-pointer text-navy/40 hover:text-navy/70 hover:bg-navy/5">
              <EditIcon />
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="p-1.5 rounded-lg cursor-pointer text-red-400/60 hover:text-red-500 hover:bg-red-50">
              <TrashIcon />
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

function FormPanel({ children }) {
  return (
    <div className="rounded-xl p-4 mt-1" style={{ backgroundColor: 'rgba(11,31,74,0.03)', border: '1px solid rgba(11,31,74,0.08)' }}>
      {children}
    </div>
  )
}

function AddPanel({ title, children }) {
  return (
    <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)' }}>
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-navy/50 mb-3">{title}</p>
      {children}
    </div>
  )
}

// ── MEMBERS tab ──────────────────────────────────────────────────────────────
function MembersTab() {
  const [rows, setRows] = useState(null)
  const [version, setVersion] = useState(0)
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyMember)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    supabase.from('peer_support_members').select('*').order('sort_order')
      .then(({ data }) => setRows(data || []))
  }, [version])

  const reload = () => setVersion(v => v + 1)

  const filtered = (rows || []).filter(r =>
    filter === 'all' ? true : filter === 'chaplains' ? r.is_chaplain : !r.is_chaplain
  )

  async function toggleActive(row) {
    await supabase.from('peer_support_members').update({ is_active: !row.is_active }).eq('id', row.id)
    setRows(prev => prev ? prev.map(r => r.id === row.id ? { ...r, is_active: !r.is_active } : r) : prev)
  }

  async function saveEdit() {
    if (!form.name.trim()) return
    setSaving(true)
    await supabase.from('peer_support_members').update(form).eq('id', editId)
    setSaving(false)
    setEditId(null)
    reload()
  }

  async function saveAdd() {
    if (!form.name.trim()) return
    setSaving(true)
    await supabase.from('peer_support_members').insert(form)
    setSaving(false)
    setAddOpen(false)
    setForm(emptyMember)
    reload()
  }

  async function deleteRow(id) {
    if (!confirm('Remove this member permanently?')) return
    await supabase.from('peer_support_members').delete().eq('id', id)
    reload()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex gap-1.5">
          {['all', 'members', 'chaplains'].map(v => (
            <button key={v} onClick={() => setFilter(v)} className="rounded-full px-3 py-1 font-sans text-[11px] font-semibold capitalize cursor-pointer transition-colors"
              style={{ backgroundColor: filter === v ? '#0B1F4A' : 'rgba(11,31,74,0.06)', color: filter === v ? 'white' : 'rgba(11,31,74,0.5)' }}>
              {v}
            </button>
          ))}
        </div>
        <AddButton label="Add" onClick={() => { setAddOpen(o => !o); setEditId(null); setForm(emptyMember) }} />
      </div>

      {addOpen && (
        <AddPanel title="New Member">
          <MemberForm form={form} setForm={setForm} onSave={saveAdd} onCancel={() => { setAddOpen(false); setForm(emptyMember) }} saving={saving} />
        </AddPanel>
      )}

      {rows === null ? (
        <p className="font-sans text-[13px] text-navy/40 py-6 text-center">Loading…</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(row => (
            <RowCard
              key={row.id}
              label={
                <span className="flex items-center gap-2">
                  {row.name}
                  {row.agency && <Badge label={row.agency} />}
                  {row.is_chaplain && <Badge label="Chaplain" color="#C9A84C" />}
                </span>
              }
              sub={row.phone}
              active={row.is_active}
              onToggle={() => toggleActive(row)}
              onEdit={() => { if (editId === row.id) { setEditId(null) } else { setEditId(row.id); setForm({ ...row }) } }}
              onDelete={() => deleteRow(row.id)}
            >
              {editId === row.id && (
                <FormPanel>
                  <MemberForm form={form} setForm={setForm} onSave={saveEdit} onCancel={() => setEditId(null)} saving={saving} />
                </FormPanel>
              )}
            </RowCard>
          ))}
          {filtered.length === 0 && <p className="font-sans text-[13px] text-navy/40 py-6 text-center">No records.</p>}
        </div>
      )}
    </div>
  )
}

// ── EVENTS tab ───────────────────────────────────────────────────────────────
function EventsTab() {
  const [rows, setRows] = useState(null)
  const [version, setVersion] = useState(0)
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyEvent)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('events').select('*').order('event_date', { ascending: false })
      .then(({ data }) => setRows(data || []))
  }, [version])

  const reload = () => setVersion(v => v + 1)

  async function toggleActive(row) {
    await supabase.from('events').update({ is_active: !row.is_active }).eq('id', row.id)
    setRows(prev => prev ? prev.map(r => r.id === row.id ? { ...r, is_active: !r.is_active } : r) : prev)
  }

  async function saveEdit() {
    if (!form.title.trim()) return
    setSaving(true)
    await supabase.from('events').update(form).eq('id', editId)
    setSaving(false)
    setEditId(null)
    reload()
  }

  async function saveAdd() {
    if (!form.title.trim()) return
    setSaving(true)
    await supabase.from('events').insert(form)
    setSaving(false)
    setAddOpen(false)
    setForm(emptyEvent)
    reload()
  }

  async function deleteRow(id) {
    if (!confirm('Delete this event?')) return
    await supabase.from('events').delete().eq('id', id)
    reload()
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <AddButton label="Add Event" onClick={() => { setAddOpen(o => !o); setEditId(null); setForm(emptyEvent) }} />
      </div>

      {addOpen && (
        <AddPanel title="New Event">
          <EventForm form={form} setForm={setForm} onSave={saveAdd} onCancel={() => { setAddOpen(false); setForm(emptyEvent) }} saving={saving} />
        </AddPanel>
      )}

      {rows === null ? (
        <p className="font-sans text-[13px] text-navy/40 py-6 text-center">Loading…</p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map(row => (
            <RowCard
              key={row.id}
              label={row.title}
              sub={[row.event_date, row.event_time, row.location].filter(Boolean).join(' · ')}
              active={row.is_active}
              onToggle={() => toggleActive(row)}
              onEdit={() => { if (editId === row.id) { setEditId(null) } else { setEditId(row.id); setForm({ ...row }) } }}
              onDelete={() => deleteRow(row.id)}
            >
              {editId === row.id && (
                <FormPanel>
                  <EventForm form={form} setForm={setForm} onSave={saveEdit} onCancel={() => setEditId(null)} saving={saving} />
                </FormPanel>
              )}
            </RowCard>
          ))}
          {rows.length === 0 && <p className="font-sans text-[13px] text-navy/40 py-6 text-center">No events yet. Add one above.</p>}
        </div>
      )}
    </div>
  )
}

// ── THERAPISTS tab ───────────────────────────────────────────────────────────
function TherapistsTab() {
  const [rows, setRows] = useState(null)
  const [version, setVersion] = useState(0)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(emptyTherapist)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('therapists').select('*').order('sort_order')
      .then(({ data }) => setRows(data || []))
  }, [version])

  const reload = () => setVersion(v => v + 1)

  async function toggleActive(row) {
    await supabase.from('therapists').update({ is_active: !row.is_active }).eq('id', row.id)
    setRows(prev => prev ? prev.map(r => r.id === row.id ? { ...r, is_active: !r.is_active } : r) : prev)
  }

  async function saveAdd() {
    if (!form.name.trim()) return
    setSaving(true)
    await supabase.from('therapists').insert(form)
    setSaving(false)
    setAddOpen(false)
    setForm(emptyTherapist)
    reload()
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <AddButton label="Add Therapist" onClick={() => setAddOpen(o => !o)} />
      </div>
      {addOpen && (
        <AddPanel title="New Therapist">
          <TherapistForm form={form} setForm={setForm} onSave={saveAdd} onCancel={() => { setAddOpen(false); setForm(emptyTherapist) }} saving={saving} />
        </AddPanel>
      )}
      {rows === null ? (
        <p className="font-sans text-[13px] text-navy/40 py-6 text-center">Loading…</p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map(row => (
            <RowCard key={row.id} label={row.name} sub={row.title} active={row.is_active} onToggle={() => toggleActive(row)} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── CRISIS tab ───────────────────────────────────────────────────────────────
function CrisisTab() {
  const [rows, setRows] = useState(null)
  const [version, setVersion] = useState(0)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(emptyCrisis)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('crisis_contacts').select('*').order('sort_order')
      .then(({ data }) => setRows(data || []))
  }, [version])

  const reload = () => setVersion(v => v + 1)

  async function toggleActive(row) {
    await supabase.from('crisis_contacts').update({ is_active: !row.is_active }).eq('id', row.id)
    setRows(prev => prev ? prev.map(r => r.id === row.id ? { ...r, is_active: !r.is_active } : r) : prev)
  }

  async function saveAdd() {
    if (!form.name.trim()) return
    setSaving(true)
    await supabase.from('crisis_contacts').insert(form)
    setSaving(false)
    setAddOpen(false)
    setForm(emptyCrisis)
    reload()
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <AddButton label="Add Contact" onClick={() => setAddOpen(o => !o)} />
      </div>
      {addOpen && (
        <AddPanel title="New Crisis Contact">
          <CrisisForm form={form} setForm={setForm} onSave={saveAdd} onCancel={() => { setAddOpen(false); setForm(emptyCrisis) }} saving={saving} />
        </AddPanel>
      )}
      {rows === null ? (
        <p className="font-sans text-[13px] text-navy/40 py-6 text-center">Loading…</p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map(row => (
            <RowCard key={row.id} label={row.name} sub={row.phone} active={row.is_active} onToggle={() => toggleActive(row)} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── SIMPLE tab (Fitness, Team) ───────────────────────────────────────────────
function SimpleTab({ table, labelKey, subKey }) {
  const [rows, setRows] = useState(null)

  useEffect(() => {
    supabase.from(table).select('*').order('sort_order')
      .then(({ data }) => setRows(data || []))
  }, [table])

  async function toggleActive(row) {
    await supabase.from(table).update({ is_active: !row.is_active }).eq('id', row.id)
    setRows(prev => prev ? prev.map(r => r.id === row.id ? { ...r, is_active: !r.is_active } : r) : prev)
  }

  if (rows === null) return <p className="font-sans text-[13px] text-navy/40 py-6 text-center">Loading…</p>

  return (
    <div className="flex flex-col gap-2">
      {rows.map(row => (
        <RowCard key={row.id} label={row[labelKey]} sub={subKey ? row[subKey] : null} active={row.is_active} onToggle={() => toggleActive(row)} />
      ))}
      {rows.length === 0 && <p className="font-sans text-[13px] text-navy/40 py-6 text-center">No records.</p>}
    </div>
  )
}

// ── TABS config ──────────────────────────────────────────────────────────────
// ── FEEDBACK tab ─────────────────────────────────────────────────────────────
function FeedbackTab() {
  const [rows, setRows] = useState(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    supabase.from('feedback').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setRows(data || []))
  }, [version])

  async function markRead(row) {
    await supabase.from('feedback').update({ is_read: !row.is_read }).eq('id', row.id)
    setRows(prev => prev ? prev.map(r => r.id === row.id ? { ...r, is_read: !r.is_read } : r) : prev)
  }

  async function deleteRow(id) {
    if (!confirm('Delete this feedback entry?')) return
    await supabase.from('feedback').delete().eq('id', id)
    setVersion(v => v + 1)
  }

  const unread = (rows || []).filter(r => !r.is_read).length

  return (
    <div>
      {unread > 0 && (
        <p className="font-sans text-[12px] text-navy/50 mb-4">
          <span className="font-semibold text-navy">{unread}</span> unread
        </p>
      )}
      {rows === null ? (
        <p className="font-sans text-[13px] text-navy/40 py-6 text-center">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="font-sans text-[13px] text-navy/40 py-6 text-center">No feedback submissions yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map(row => (
            <div
              key={row.id}
              className="rounded-xl bg-white px-4 py-4"
              style={{ border: `1px solid ${row.is_read ? 'rgba(11,31,74,0.07)' : 'rgba(201,168,76,0.3)'}`, opacity: row.is_read ? 0.7 : 1 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-sans font-semibold text-navy text-[13px]">{row.name || 'Anonymous'}</span>
                    {row.agency && <Badge label={row.agency.split('(')[0].trim()} />}
                    {!row.is_read && <Badge label="New" color="#C9A84C" />}
                  </div>
                  <p className="font-sans text-[13px] text-navy/65 leading-relaxed">{row.message}</p>
                  <p className="font-sans text-[10px] text-navy/30 mt-2">
                    {new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => markRead(row)}
                    className="p-1.5 rounded-lg cursor-pointer text-navy/40 hover:text-navy/70 hover:bg-navy/5 font-sans text-[10px] font-semibold uppercase tracking-wide px-2"
                    title={row.is_read ? 'Mark unread' : 'Mark read'}
                  >
                    {row.is_read ? '↩' : '✓'}
                  </button>
                  <button onClick={() => deleteRow(row.id)} className="p-1.5 rounded-lg cursor-pointer text-red-400/60 hover:text-red-500 hover:bg-red-50">
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const TABS = [
  { id: 'members',    label: 'Members' },
  { id: 'events',     label: 'Events' },
  { id: 'therapists', label: 'Therapists' },
  { id: 'crisis',     label: 'Crisis' },
  { id: 'fitness',    label: 'Fitness' },
  { id: 'team',       label: 'Team' },
  { id: 'feedback',   label: 'Feedback' },
]

// ── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  const [tab, setTab] = useState('members')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!s) { navigate('/admin'); return }
      setSession(s)
      setChecking(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!s) navigate('/admin')
      else setSession(s)
    })
    return () => subscription.unsubscribe()
  }, [navigate])

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-sans text-navy/40 text-sm">Checking session…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* Header */}
      <div className="bg-navy px-6 py-4 flex items-center justify-between sticky top-0 z-20" style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <div>
          <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-gold/50 leading-none mb-0.5">Butte Strong Wellness</p>
          <h1 className="font-display text-gold uppercase tracking-wide text-[1.6rem] leading-none">Admin</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-sans text-[11px] text-cream/35 hidden sm:block truncate max-w-[180px]">
            {session?.user?.email}
          </span>
          <button onClick={signOut} className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-sans text-[12px] font-semibold cursor-pointer text-cream/60 hover:text-cream border border-cream/10 hover:border-cream/25 transition-colors">
            <SignOutIcon />Sign out
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white sticky top-[64px] z-10 overflow-x-auto" style={{ borderBottom: '1px solid rgba(11,31,74,0.08)' }}>
        <div className="flex px-4 min-w-max">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-5 py-3.5 font-sans text-[12px] font-semibold cursor-pointer transition-colors whitespace-nowrap"
              style={{ color: tab === t.id ? '#0B1F4A' : 'rgba(11,31,74,0.4)', borderBottom: tab === t.id ? '2px solid #C9A84C' : '2px solid transparent' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {tab === 'members'    && <MembersTab />}
        {tab === 'events'     && <EventsTab />}
        {tab === 'therapists' && <TherapistsTab />}
        {tab === 'crisis'     && <CrisisTab />}
        {tab === 'fitness'    && <SimpleTab table="fitness_categories" labelKey="title" subKey="description" />}
        {tab === 'team'       && <SimpleTab table="team_members" labelKey="name" subKey="role" />}
        {tab === 'feedback'   && <FeedbackTab />}
      </div>
    </div>
  )
}
