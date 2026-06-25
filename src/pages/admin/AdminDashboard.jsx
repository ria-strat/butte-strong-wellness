import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { AGENCIES } from '../../lib/agencies'

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

// ── Photo upload ─────────────────────────────────────────────────────────────
function PhotoUpload({ label = 'Photo', value, onChange, bucket = 'photos' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setUploading(true)

    const ext  = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
    if (uploadErr) { setError('Upload failed. Try again.'); setUploading(false); return }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
    // reset so same file can be re-selected if needed
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans text-[10px] uppercase tracking-[0.15em] text-navy/40 font-semibold">{label}</label>

      {/* Preview */}
      {value && (
        <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid rgba(11,31,74,0.1)' }}>
          <img src={value} alt="Preview" className="w-full h-36 object-cover" onError={e => { e.target.parentElement.style.display = 'none' }} />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center text-xs font-bold cursor-pointer"
            title="Remove photo"
          >✕</button>
        </div>
      )}

      {/* Upload button */}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-sans text-[12px] font-semibold cursor-pointer disabled:opacity-50"
        style={{ border: '1px dashed rgba(11,31,74,0.2)', backgroundColor: 'rgba(11,31,74,0.02)', color: 'rgba(11,31,74,0.5)' }}
      >
        {uploading ? (
          <>
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Uploading…
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            {value ? 'Replace Photo' : 'Upload Photo'}
          </>
        )}
      </button>
      {error && <p className="font-sans text-[11px] text-red-500">{error}</p>}
    </div>
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

function SaveBar({ onSave, onCancel, saving, error }) {
  return (
    <div className="flex flex-col gap-1.5 pt-1">
      <div className="flex items-center gap-2">
        <button onClick={onSave} disabled={saving} className="flex items-center gap-1.5 rounded-lg px-4 py-2 font-sans text-[12px] font-semibold text-white cursor-pointer disabled:opacity-50" style={{ backgroundColor: '#0B1F4A' }}>
          <CheckIcon />{saving ? 'Saving…' : 'Save'}
        </button>
        <button onClick={onCancel} className="flex items-center gap-1.5 rounded-lg px-4 py-2 font-sans text-[12px] font-semibold text-navy/60 border border-navy/15 cursor-pointer bg-white">
          <XIcon />Cancel
        </button>
      </div>
      {error && (
        <p className="font-sans text-[11px] text-red-500 leading-snug">⚠ {error}</p>
      )}
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
const emptyTeam   = { name: '', role: '', agency: '', phone: '', email: '', bio: '', experience: '', photo_url: '', accent: '#C9A84C', member_type: 'agency_contact', sort_order: 0, is_active: true }
const emptyEvent  = { title: '', event_date: '', event_time: '', location: '', description: '', registration_url: '', cover_image_url: '', is_active: true }
const emptyTherapist = { name: '', title: '', phone: '', email: '', address: '', insurance: '', bio: '', quote: '', photo_url: null, sort_order: 0, is_active: true }
const emptyCrisis = { name: '', phone: '', description: '', sort_order: 0, is_active: true }

// ── Member form (used for both add and edit) ─────────────────────────────────
function MemberForm({ form, setForm, onSave, onCancel, saving, error }) {
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
      <PhotoUpload label="Member Photo" value={form.photo_url || ''} onChange={f('photo_url')} />
      <div className="flex gap-4">
        <Checkbox label="Is Chaplain" checked={!!form.is_chaplain} onChange={f('is_chaplain')} />
        <Checkbox label="Active" checked={!!form.is_active} onChange={f('is_active')} />
      </div>
      <SaveBar onSave={onSave} onCancel={onCancel} saving={saving} error={error} />
    </div>
  )
}

// ── Event form ───────────────────────────────────────────────────────────────
function EventForm({ form, setForm, onSave, onCancel, saving, error }) {
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
      <PhotoUpload label="Cover Photo" value={form.cover_image_url || ''} onChange={f('cover_image_url')} />
      <Checkbox label="Active (visible to users)" checked={!!form.is_active} onChange={f('is_active')} />
      <SaveBar onSave={onSave} onCancel={onCancel} saving={saving} error={error} />
    </div>
  )
}

// ── Therapist form ───────────────────────────────────────────────────────────
function TherapistForm({ form, setForm, onSave, onCancel, saving, error }) {
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
      <PhotoUpload label="Photo" value={form.photo_url || ''} onChange={f('photo_url')} />
      <Checkbox label="Active" checked={!!form.is_active} onChange={f('is_active')} />
      <SaveBar onSave={onSave} onCancel={onCancel} saving={saving} error={error} />
    </div>
  )
}

// ── Crisis form ──────────────────────────────────────────────────────────────
function CrisisForm({ form, setForm, onSave, onCancel, saving, error }) {
  const f = key => val => setForm(prev => ({ ...prev, [key]: val }))
  return (
    <div className="flex flex-col gap-3">
      <Field label="Name" value={form.name} onChange={f('name')} required />
      <Field label="Phone / Number" value={form.phone || ''} onChange={f('phone')} />
      <Field label="Description" value={form.description || ''} onChange={f('description')} as="textarea" />
      <Checkbox label="Active" checked={!!form.is_active} onChange={f('is_active')} />
      <SaveBar onSave={onSave} onCancel={onCancel} saving={saving} error={error} />
    </div>
  )
}

// ── Team form ────────────────────────────────────────────────────────────────
function TeamForm({ form, setForm, onSave, onCancel, saving, error }) {
  const f = key => val => setForm(prev => ({ ...prev, [key]: val }))
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name" value={form.name} onChange={f('name')} required />
        <Field label="Role / Title" value={form.role || ''} onChange={f('role')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Agency" value={form.agency || ''} onChange={f('agency')} />
        <Field label="Phone" value={form.phone || ''} onChange={f('phone')} type="tel" />
      </div>
      <Field label="Email" value={form.email || ''} onChange={f('email')} type="email" />
      <Field label="Bio" value={form.bio || ''} onChange={f('bio')} as="textarea" />
      <Field label="Areas of Experience (comma-separated)" value={form.experience || ''} onChange={f('experience')} as="textarea" />
      <PhotoUpload label="Photo" value={form.photo_url || ''} onChange={f('photo_url')} />
      <div className="flex flex-col gap-1">
        <label className="font-sans text-[10px] uppercase tracking-[0.15em] text-navy/40 font-semibold">Role on Team</label>
        <select value={form.member_type || 'agency_contact'} onChange={e => f('member_type')(e.target.value)}
          className="w-full rounded-lg px-3 py-2 font-sans text-[13px] text-navy bg-white outline-none focus:ring-2 focus:ring-navy/20"
          style={{ border: '1px solid rgba(11,31,74,0.15)' }}>
          <option value="agency_contact">Agency Contact</option>
          <option value="staff">Wellness Unit Staff</option>
        </select>
      </div>
      <Field label="Sort Order" value={String(form.sort_order ?? 0)} onChange={v => f('sort_order')(parseInt(v) || 0)} type="number" />
      <Checkbox label="Active" checked={!!form.is_active} onChange={f('is_active')} />
      <SaveBar onSave={onSave} onCancel={onCancel} saving={saving} error={error} />
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
  const [saveError, setSaveError] = useState(null)
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
    setSaving(true); setSaveError(null)
    const { error: err } = await supabase.from('peer_support_members').update(form).eq('id', editId)
    setSaving(false)
    if (err) { setSaveError(err.message); return }
    setEditId(null)
    reload()
  }

  async function saveAdd() {
    if (!form.name.trim()) return
    setSaving(true); setSaveError(null)
    const { error: err } = await supabase.from('peer_support_members').insert(form)
    setSaving(false)
    if (err) { setSaveError(err.message); return }
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
          <MemberForm form={form} setForm={setForm} onSave={saveAdd} onCancel={() => { setAddOpen(false); setForm(emptyMember); setSaveError(null) }} saving={saving} error={saveError} />
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
              onEdit={() => { if (editId === row.id) { setEditId(null); setSaveError(null) } else { setEditId(row.id); setForm({ ...row }); setSaveError(null) } }}
              onDelete={() => deleteRow(row.id)}
            >
              {editId === row.id && (
                <FormPanel>
                  <MemberForm form={form} setForm={setForm} onSave={saveEdit} onCancel={() => { setEditId(null); setSaveError(null) }} saving={saving} error={saveError} />
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
  const [saveError, setSaveError] = useState(null)

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
    setSaving(true); setSaveError(null)
    const { error: err } = await supabase.from('events').update(form).eq('id', editId)
    setSaving(false)
    if (err) { setSaveError(err.message); return }
    setEditId(null)
    reload()
  }

  async function saveAdd() {
    if (!form.title.trim()) return
    setSaving(true); setSaveError(null)
    const { error: err } = await supabase.from('events').insert(form)
    setSaving(false)
    if (err) { setSaveError(err.message); return }
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
          <EventForm form={form} setForm={setForm} onSave={saveAdd} onCancel={() => { setAddOpen(false); setForm(emptyEvent); setSaveError(null) }} saving={saving} error={saveError} />
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
              onEdit={() => { if (editId === row.id) { setEditId(null); setSaveError(null) } else { setEditId(row.id); setForm({ ...row }); setSaveError(null) } }}
              onDelete={() => deleteRow(row.id)}
            >
              {editId === row.id && (
                <FormPanel>
                  <EventForm form={form} setForm={setForm} onSave={saveEdit} onCancel={() => { setEditId(null); setSaveError(null) }} saving={saving} error={saveError} />
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
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyTherapist)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    supabase.from('therapists').select('*').order('sort_order')
      .then(({ data }) => setRows(data || []))
  }, [version])

  const reload = () => setVersion(v => v + 1)

  async function toggleActive(row) {
    await supabase.from('therapists').update({ is_active: !row.is_active }).eq('id', row.id)
    setRows(prev => prev ? prev.map(r => r.id === row.id ? { ...r, is_active: !r.is_active } : r) : prev)
  }

  async function saveEdit() {
    if (!form.name.trim()) return
    setSaving(true); setSaveError(null)
    const { error: err } = await supabase.from('therapists').update(form).eq('id', editId)
    setSaving(false)
    if (err) { setSaveError(err.message); return }
    setEditId(null)
    reload()
  }

  async function saveAdd() {
    if (!form.name.trim()) return
    setSaving(true); setSaveError(null)
    const { error: err } = await supabase.from('therapists').insert(form)
    setSaving(false)
    if (err) { setSaveError(err.message); return }
    setAddOpen(false)
    setForm(emptyTherapist)
    reload()
  }

  async function deleteRow(id) {
    if (!confirm('Remove this therapist?')) return
    await supabase.from('therapists').delete().eq('id', id)
    reload()
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <AddButton label="Add Therapist" onClick={() => { setAddOpen(o => !o); setEditId(null); setForm(emptyTherapist) }} />
      </div>
      {addOpen && (
        <AddPanel title="New Therapist">
          <TherapistForm form={form} setForm={setForm} onSave={saveAdd} onCancel={() => { setAddOpen(false); setForm(emptyTherapist); setSaveError(null) }} saving={saving} error={saveError} />
        </AddPanel>
      )}
      {rows === null ? (
        <p className="font-sans text-[13px] text-navy/40 py-6 text-center">Loading…</p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map(row => (
            <RowCard key={row.id} label={row.name} sub={row.title} active={row.is_active}
              onToggle={() => toggleActive(row)}
              onEdit={() => { if (editId === row.id) { setEditId(null); setSaveError(null) } else { setEditId(row.id); setForm({ ...row }); setSaveError(null) } }}
              onDelete={() => deleteRow(row.id)}
            >
              {editId === row.id && (
                <FormPanel>
                  <TherapistForm form={form} setForm={setForm} onSave={saveEdit} onCancel={() => { setEditId(null); setSaveError(null) }} saving={saving} error={saveError} />
                </FormPanel>
              )}
            </RowCard>
          ))}
          {rows.length === 0 && <p className="font-sans text-[13px] text-navy/40 py-6 text-center">No therapists yet.</p>}
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
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyCrisis)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    supabase.from('crisis_contacts').select('*').order('sort_order')
      .then(({ data }) => setRows(data || []))
  }, [version])

  const reload = () => setVersion(v => v + 1)

  async function toggleActive(row) {
    await supabase.from('crisis_contacts').update({ is_active: !row.is_active }).eq('id', row.id)
    setRows(prev => prev ? prev.map(r => r.id === row.id ? { ...r, is_active: !r.is_active } : r) : prev)
  }

  async function saveEdit() {
    if (!form.name.trim()) return
    setSaving(true); setSaveError(null)
    const { error: err } = await supabase.from('crisis_contacts').update(form).eq('id', editId)
    setSaving(false)
    if (err) { setSaveError(err.message); return }
    setEditId(null)
    reload()
  }

  async function saveAdd() {
    if (!form.name.trim()) return
    setSaving(true); setSaveError(null)
    const { error: err } = await supabase.from('crisis_contacts').insert(form)
    setSaving(false)
    if (err) { setSaveError(err.message); return }
    setAddOpen(false)
    setForm(emptyCrisis)
    reload()
  }

  async function deleteRow(id) {
    if (!confirm('Remove this crisis contact?')) return
    await supabase.from('crisis_contacts').delete().eq('id', id)
    reload()
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <AddButton label="Add Contact" onClick={() => { setAddOpen(o => !o); setEditId(null); setForm(emptyCrisis) }} />
      </div>
      {addOpen && (
        <AddPanel title="New Crisis Contact">
          <CrisisForm form={form} setForm={setForm} onSave={saveAdd} onCancel={() => { setAddOpen(false); setForm(emptyCrisis); setSaveError(null) }} saving={saving} error={saveError} />
        </AddPanel>
      )}
      {rows === null ? (
        <p className="font-sans text-[13px] text-navy/40 py-6 text-center">Loading…</p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map(row => (
            <RowCard key={row.id} label={row.name} sub={row.phone} active={row.is_active}
              onToggle={() => toggleActive(row)}
              onEdit={() => { if (editId === row.id) { setEditId(null); setSaveError(null) } else { setEditId(row.id); setForm({ ...row }); setSaveError(null) } }}
              onDelete={() => deleteRow(row.id)}
            >
              {editId === row.id && (
                <FormPanel>
                  <CrisisForm form={form} setForm={setForm} onSave={saveEdit} onCancel={() => { setEditId(null); setSaveError(null) }} saving={saving} error={saveError} />
                </FormPanel>
              )}
            </RowCard>
          ))}
          {rows.length === 0 && <p className="font-sans text-[13px] text-navy/40 py-6 text-center">No contacts yet.</p>}
        </div>
      )}
    </div>
  )
}

// ── FITNESS tab ──────────────────────────────────────────────────────────────
const emptyItem = { title: '', item_type: 'location', description: '', address: '', phone: '', hours: '', url: '', content: '', sort_order: 0, is_active: true }

function FitItemForm({ form, setForm, onSave, onCancel, saving, error }) {
  const f = key => val => setForm(prev => ({ ...prev, [key]: val }))
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name" value={form.title} onChange={f('title')} required />
        <div className="flex flex-col gap-1">
          <label className="font-sans text-[10px] uppercase tracking-[0.15em] text-navy/40 font-semibold">Type</label>
          <select value={form.item_type} onChange={e => f('item_type')(e.target.value)}
            className="w-full rounded-lg px-3 py-2 font-sans text-[13px] text-navy bg-white outline-none focus:ring-2 focus:ring-navy/20"
            style={{ border: '1px solid rgba(11,31,74,0.15)' }}>
            <option value="location">Location</option>
            <option value="link">Link / Website</option>
            <option value="info">Info Only</option>
          </select>
        </div>
      </div>
      <Field label="Description" value={form.description || ''} onChange={f('description')} as="textarea" />
      {form.item_type === 'location' && <>
        <Field label="Address" value={form.address || ''} onChange={f('address')} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone" value={form.phone || ''} onChange={f('phone')} type="tel" />
          <Field label="Hours" value={form.hours || ''} onChange={f('hours')} placeholder="Mon–Fri 5am–10pm" />
        </div>
        <Field label="Website URL" value={form.url || ''} onChange={f('url')} type="url" placeholder="https://…" />
      </>}
      {form.item_type === 'link' && <Field label="URL" value={form.url || ''} onChange={f('url')} type="url" placeholder="https://…" required />}
      {form.item_type === 'info' && <Field label="Content" value={form.content || ''} onChange={f('content')} as="textarea" placeholder="Text to display" />}
      <Checkbox label="Active" checked={!!form.is_active} onChange={f('is_active')} />
      <SaveBar onSave={onSave} onCancel={onCancel} saving={saving} error={error} />
    </div>
  )
}

function FitnessTab() {
  const [cats, setCats] = useState(null)
  const [version, setVersion] = useState(0)
  const [addCatOpen, setAddCatOpen] = useState(false)
  const [catForm, setCatForm] = useState({ title: '', description: '', sort_order: 0, is_active: true })
  const [addItemCat, setAddItemCat] = useState(null)   // category id that has add-item open
  const [editItemId, setEditItemId] = useState(null)
  const [itemForm, setItemForm] = useState(emptyItem)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    supabase.from('fitness_categories').select('*, fitness_items(*)').order('sort_order')
      .then(({ data }) => {
        setCats((data || []).map(c => ({ ...c, items: (c.fitness_items || []).sort((a, b) => a.sort_order - b.sort_order) })))
      })
  }, [version])

  const reload = () => setVersion(v => v + 1)
  const toggle = id => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  async function toggleCat(cat) {
    await supabase.from('fitness_categories').update({ is_active: !cat.is_active }).eq('id', cat.id)
    setCats(prev => prev ? prev.map(c => c.id === cat.id ? { ...c, is_active: !c.is_active } : c) : prev)
  }

  async function toggleItem(item) {
    await supabase.from('fitness_items').update({ is_active: !item.is_active }).eq('id', item.id)
    reload()
  }

  async function saveCategory() {
    if (!catForm.title.trim()) return
    setSaving(true); setSaveError(null)
    const { error: err } = await supabase.from('fitness_categories').insert(catForm)
    setSaving(false)
    if (err) { setSaveError(err.message); return }
    setAddCatOpen(false)
    setCatForm({ title: '', description: '', sort_order: 0, is_active: true })
    reload()
  }

  async function saveAddItem(catId) {
    if (!itemForm.title.trim()) return
    setSaving(true); setSaveError(null)
    const { error: err } = await supabase.from('fitness_items').insert({ ...itemForm, category_id: catId })
    setSaving(false)
    if (err) { setSaveError(err.message); return }
    setAddItemCat(null)
    setItemForm(emptyItem)
    reload()
  }

  async function saveEditItem() {
    if (!itemForm.title.trim()) return
    setSaving(true); setSaveError(null)
    const { error: err } = await supabase.from('fitness_items').update(itemForm).eq('id', editItemId)
    setSaving(false)
    if (err) { setSaveError(err.message); return }
    setEditItemId(null)
    reload()
  }

  async function deleteItem(id) {
    if (!confirm('Remove this item?')) return
    await supabase.from('fitness_items').delete().eq('id', id)
    reload()
  }

  if (cats === null) return <p className="font-sans text-[13px] text-navy/40 py-6 text-center">Loading…</p>

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <AddButton label="Add Category" onClick={() => setAddCatOpen(o => !o)} />
      </div>

      {addCatOpen && (
        <AddPanel title="New Category">
          <div className="flex flex-col gap-3">
            <Field label="Category Name" value={catForm.title} onChange={v => setCatForm(p => ({ ...p, title: v }))} required />
            <Field label="Description" value={catForm.description || ''} onChange={v => setCatForm(p => ({ ...p, description: v }))} />
            <SaveBar onSave={saveCategory} onCancel={() => { setAddCatOpen(false); setSaveError(null) }} saving={saving} error={saveError} />
          </div>
        </AddPanel>
      )}

      {cats.map(cat => (
        <div key={cat.id} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(11,31,74,0.09)' }}>
          {/* Category header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white">
            <button onClick={() => toggle(cat.id)} className="flex-1 flex items-center gap-2 text-left cursor-pointer">
              <span className="font-sans font-semibold text-navy text-[13px]">{cat.title}</span>
              <span className="font-sans text-[10px] text-navy/30">{cat.items?.length || 0} items</span>
              <span className="text-navy/25 text-xs ml-auto mr-2">{expanded[cat.id] ? '▲' : '▼'}</span>
            </button>
            <Toggle value={cat.is_active} onChange={() => toggleCat(cat)} />
          </div>

          {/* Items */}
          {expanded[cat.id] && (
            <div className="bg-cream/50 px-3 pb-3 pt-1 flex flex-col gap-2">
              {(cat.items || []).map(item => (
                <div key={item.id}>
                  <RowCard
                    label={item.title}
                    sub={[item.item_type, item.address || item.url || item.content].filter(Boolean).join(' · ').slice(0, 60)}
                    active={item.is_active}
                    onToggle={() => toggleItem(item)}
                    onEdit={() => { if (editItemId === item.id) { setEditItemId(null); setSaveError(null) } else { setEditItemId(item.id); setItemForm({ ...item }); setSaveError(null) } }}
                    onDelete={() => deleteItem(item.id)}
                  >
                    {editItemId === item.id && (
                      <FormPanel>
                        <FitItemForm form={itemForm} setForm={setItemForm} onSave={saveEditItem} onCancel={() => { setEditItemId(null); setSaveError(null) }} saving={saving} error={saveError} />
                      </FormPanel>
                    )}
                  </RowCard>
                </div>
              ))}

              {addItemCat === cat.id ? (
                <div className="rounded-xl p-3 mt-1" style={{ backgroundColor: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-navy/40 mb-3">New Item</p>
                  <FitItemForm form={itemForm} setForm={setItemForm} onSave={() => saveAddItem(cat.id)} onCancel={() => { setAddItemCat(null); setItemForm(emptyItem); setSaveError(null) }} saving={saving} error={saveError} />
                </div>
              ) : (
                <button
                  onClick={() => { setAddItemCat(cat.id); setEditItemId(null); setItemForm(emptyItem) }}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-sans text-[11px] font-semibold cursor-pointer w-full justify-center"
                  style={{ border: '1px dashed rgba(11,31,74,0.15)', color: 'rgba(11,31,74,0.4)', backgroundColor: 'rgba(11,31,74,0.02)' }}
                >
                  <PlusIcon /> Add Item to {cat.title}
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── SIMPLE tab (Fitness only) ────────────────────────────────────────────────
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

// ── TEAM tab ─────────────────────────────────────────────────────────────────
function TeamTab() {
  const [rows, setRows] = useState(null)
  const [version, setVersion] = useState(0)
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyTeam)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    supabase.from('team_members').select('*').order('sort_order')
      .then(({ data }) => setRows(data || []))
  }, [version])

  const reload = () => setVersion(v => v + 1)

  async function toggleActive(row) {
    await supabase.from('team_members').update({ is_active: !row.is_active }).eq('id', row.id)
    setRows(prev => prev ? prev.map(r => r.id === row.id ? { ...r, is_active: !r.is_active } : r) : prev)
  }

  async function saveEdit() {
    if (!form.name.trim()) return
    setSaving(true); setSaveError(null)
    const { error: err } = await supabase.from('team_members').update(form).eq('id', editId)
    setSaving(false)
    if (err) { setSaveError(err.message); return }
    setEditId(null)
    reload()
  }

  async function saveAdd() {
    if (!form.name.trim()) return
    setSaving(true); setSaveError(null)
    const { error: err } = await supabase.from('team_members').insert(form)
    setSaving(false)
    if (err) { setSaveError(err.message); return }
    setAddOpen(false)
    setForm(emptyTeam)
    reload()
  }

  async function deleteRow(id) {
    if (!confirm('Remove this team member?')) return
    await supabase.from('team_members').delete().eq('id', id)
    reload()
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <AddButton label="Add Member" onClick={() => { setAddOpen(o => !o); setEditId(null); setForm(emptyTeam) }} />
      </div>
      {addOpen && (
        <AddPanel title="New Team Member">
          <TeamForm form={form} setForm={setForm} onSave={saveAdd} onCancel={() => { setAddOpen(false); setForm(emptyTeam); setSaveError(null) }} saving={saving} error={saveError} />
        </AddPanel>
      )}
      {rows === null ? (
        <p className="font-sans text-[13px] text-navy/40 py-6 text-center">Loading…</p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map(row => (
            <RowCard key={row.id} label={row.name} sub={row.role} active={row.is_active}
              onToggle={() => toggleActive(row)}
              onEdit={() => { if (editId === row.id) { setEditId(null); setSaveError(null) } else { setEditId(row.id); setForm({ ...row }); setSaveError(null) } }}
              onDelete={() => deleteRow(row.id)}
            >
              {editId === row.id && (
                <FormPanel>
                  <TeamForm form={form} setForm={setForm} onSave={saveEdit} onCancel={() => { setEditId(null); setSaveError(null) }} saving={saving} error={saveError} />
                </FormPanel>
              )}
            </RowCard>
          ))}
          {rows.length === 0 && <p className="font-sans text-[13px] text-navy/40 py-6 text-center">No team members yet.</p>}
        </div>
      )}
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

// ── ARTICLES tab ─────────────────────────────────────────────────────────────
const emptyArticle = { title: '', body: '', photo_url: '', url: '', is_active: true }

function ArticleForm({ form, setForm, onSave, onCancel, saving, error }) {
  const f = key => val => setForm(prev => ({ ...prev, [key]: val }))
  return (
    <div className="flex flex-col gap-3">
      <Field label="Title" value={form.title} onChange={f('title')} required />
      <Field label="Body / Content" value={form.body || ''} onChange={f('body')} as="textarea" placeholder="Paste article text here…" />
      <PhotoUpload label="Photo (optional)" value={form.photo_url || ''} onChange={f('photo_url')} />
      <Field label="Link URL (optional)" value={form.url || ''} onChange={f('url')} type="url" placeholder="https://…" />
      <Checkbox label="Active (visible to users)" checked={!!form.is_active} onChange={f('is_active')} />
      <SaveBar onSave={onSave} onCancel={onCancel} saving={saving} error={error} />
    </div>
  )
}

function ArticlesTab() {
  const [rows, setRows] = useState(null)
  const [version, setVersion] = useState(0)
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyArticle)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    supabase.from('articles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setRows(data || []))
  }, [version])

  const reload = () => setVersion(v => v + 1)

  async function toggleActive(row) {
    await supabase.from('articles').update({ is_active: !row.is_active }).eq('id', row.id)
    setRows(prev => prev ? prev.map(r => r.id === row.id ? { ...r, is_active: !r.is_active } : r) : prev)
  }

  async function saveEdit() {
    if (!form.title.trim()) return
    setSaving(true); setSaveError(null)
    const { error: err } = await supabase.from('articles').update(form).eq('id', editId)
    setSaving(false)
    if (err) { setSaveError(err.message); return }
    setEditId(null)
    reload()
  }

  async function saveAdd() {
    if (!form.title.trim()) return
    setSaving(true); setSaveError(null)
    const { error: err } = await supabase.from('articles').insert(form)
    setSaving(false)
    if (err) { setSaveError(err.message); return }
    setAddOpen(false)
    setForm(emptyArticle)
    reload()
  }

  async function deleteRow(id) {
    if (!confirm('Delete this article?')) return
    await supabase.from('articles').delete().eq('id', id)
    reload()
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <AddButton label="Add Article" onClick={() => { setAddOpen(o => !o); setEditId(null); setForm(emptyArticle) }} />
      </div>
      {addOpen && (
        <AddPanel title="New Article">
          <ArticleForm form={form} setForm={setForm} onSave={saveAdd} onCancel={() => { setAddOpen(false); setForm(emptyArticle); setSaveError(null) }} saving={saving} error={saveError} />
        </AddPanel>
      )}
      {rows === null ? (
        <p className="font-sans text-[13px] text-navy/40 py-6 text-center">Loading…</p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map(row => (
            <RowCard key={row.id} label={row.title}
              sub={row.body ? row.body.slice(0, 60) + (row.body.length > 60 ? '…' : '') : null}
              active={row.is_active}
              onToggle={() => toggleActive(row)}
              onEdit={() => { if (editId === row.id) { setEditId(null); setSaveError(null) } else { setEditId(row.id); setForm({ ...row }); setSaveError(null) } }}
              onDelete={() => deleteRow(row.id)}
            >
              {editId === row.id && (
                <FormPanel>
                  <ArticleForm form={form} setForm={setForm} onSave={saveEdit} onCancel={() => { setEditId(null); setSaveError(null) }} saving={saving} error={saveError} />
                </FormPanel>
              )}
            </RowCard>
          ))}
          {rows.length === 0 && <p className="font-sans text-[13px] text-navy/40 py-6 text-center">No articles yet. Add one above.</p>}
        </div>
      )}
    </div>
  )
}

// ── NOTIFICATIONS tab ─────────────────────────────────────────────────────────
const ROLES = ['Sworn Staff', 'Civilian Staff', 'Family Member']

function NotificationsTab() {
  const [title,          setTitle]          = useState('')
  const [message,        setMessage]        = useState('')
  const [targetAgency,   setTargetAgency]   = useState('')   // '' = all
  const [targetRole,     setTargetRole]     = useState('')   // '' = all
  const [sending,        setSending]        = useState(false)
  const [sendResult,     setSendResult]     = useState(null) // { ok, msg }
  const [log,            setLog]            = useState([])
  const [loadingLog,     setLoadingLog]     = useState(true)

  useEffect(() => {
    supabase
      .from('notification_log')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(20)
      .then(({ data }) => { setLog(data ?? []); setLoadingLog(false) })
  }, [sendResult])

  async function handleSend() {
    if (!title.trim() || !message.trim()) return
    setSending(true); setSendResult(null)

    try {
      // Fetch credentials server-side (admin-only RPC)
      const { data: appId,  error: e1 } = await supabase.rpc('get_setting_for_admin', { p_key: 'onesignal_app_id'  })
      const { data: apiKey, error: e2 } = await supabase.rpc('get_setting_for_admin', { p_key: 'onesignal_api_key' })

      if (e1 || e2 || !appId || !apiKey) {
        setSendResult({ ok: false, msg: 'OneSignal credentials not set. Add them in Supabase → SQL Editor.' })
        setSending(false); return
      }

      // Build OneSignal payload
      const body = {
        app_id:   appId,
        headings: { en: title.trim() },
        contents: { en: message.trim() },
      }

      if (targetAgency || targetRole) {
        const filters = []
        if (targetAgency) filters.push({ field: 'tag', key: 'agency',     relation: '=', value: targetAgency })
        if (targetAgency && targetRole) filters.push({ operator: 'AND' })
        if (targetRole)   filters.push({ field: 'tag', key: 'staff_type', relation: '=', value: targetRole  })
        body.filters = filters
      } else {
        body.included_segments = ['All']
      }

      const res  = await fetch('https://onesignal.com/api/v1/notifications', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${apiKey}` },
        body:    JSON.stringify(body),
      })
      const json = await res.json()

      if (!res.ok || json.errors) {
        setSendResult({ ok: false, msg: json.errors?.[0] ?? 'OneSignal returned an error.' })
        setSending(false); return
      }

      // Log to DB
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('notification_log').insert({
        title:         title.trim(),
        message:       message.trim(),
        target_agency: targetAgency || null,
        target_role:   targetRole   || null,
        sent_by:       user?.id,
      })

      setSendResult({ ok: true, msg: `Sent! ${json.recipients ?? 0} device(s) targeted.` })
      setTitle(''); setMessage('')
    } catch (err) {
      setSendResult({ ok: false, msg: err.message ?? 'Unexpected error. Check your internet connection.' })
    }
    setSending(false)
  }

  const audienceLabel = (() => {
    if (!targetAgency && !targetRole) return 'Everyone'
    if (targetAgency && targetRole)   return `${targetAgency} · ${targetRole}`
    return targetAgency || targetRole
  })()

  return (
    <div className="flex flex-col gap-6 pb-16">

      {/* Compose */}
      <div className="bg-white rounded-2xl p-5 flex flex-col gap-4" style={{ boxShadow: '0 2px 16px rgba(11,31,74,0.07)' }}>
        <h2 className="font-display text-navy uppercase tracking-wide text-[1.4rem]">Send a Notification</h2>

        {/* Audience */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-[11px] font-semibold uppercase tracking-wide text-navy/40">Audience</label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={targetAgency}
              onChange={e => setTargetAgency(e.target.value)}
              className="rounded-xl border border-navy/10 px-3 py-2.5 font-sans text-[13px] text-navy bg-white cursor-pointer"
              style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%230B1F4A' opacity='.3'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
              <option value="">All Agencies</option>
              {AGENCIES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              className="rounded-xl border border-navy/10 px-3 py-2.5 font-sans text-[13px] text-navy bg-white cursor-pointer"
              style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%230B1F4A' opacity='.3'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
              <option value="">All Roles</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <p className="font-sans text-[11px] text-navy/40 mt-0.5">Sending to: <strong className="text-navy/70">{audienceLabel}</strong></p>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-[11px] font-semibold uppercase tracking-wide text-navy/40">Notification Title</label>
          <input
            value={title} onChange={e => setTitle(e.target.value)} maxLength={80} placeholder="e.g. Wellness Reminder"
            className="rounded-xl border border-navy/10 px-4 py-2.5 font-sans text-[14px] text-navy placeholder:text-navy/25 focus:outline-none focus:border-gold"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-[11px] font-semibold uppercase tracking-wide text-navy/40">Message</label>
          <textarea
            value={message} onChange={e => setMessage(e.target.value)} rows={4} maxLength={500}
            placeholder="e.g. Don't forget to check in with your peer support team this week."
            className="rounded-xl border border-navy/10 px-4 py-2.5 font-sans text-[14px] text-navy placeholder:text-navy/25 focus:outline-none focus:border-gold resize-none"
          />
          <p className="font-sans text-[10px] text-navy/30 self-end">{message.length}/500</p>
        </div>

        {/* Result */}
        {sendResult && (
          <div className="rounded-xl px-4 py-3 font-sans text-[13px]"
            style={{ backgroundColor: sendResult.ok ? 'rgba(26,138,114,0.08)' : 'rgba(200,50,50,0.07)', color: sendResult.ok ? '#1A8A72' : '#c23232' }}>
            {sendResult.msg}
          </div>
        )}

        <button onClick={handleSend} disabled={sending || !title.trim() || !message.trim()}
          className="rounded-full px-6 py-3 font-sans text-[13px] font-semibold cursor-pointer disabled:opacity-40 transition-opacity self-start"
          style={{ backgroundColor: '#0B1F4A', color: '#C9A84C' }}>
          {sending ? 'Sending…' : 'Send Notification'}
        </button>
      </div>

      {/* Log */}
      <div className="bg-white rounded-2xl p-5 flex flex-col gap-3" style={{ boxShadow: '0 2px 16px rgba(11,31,74,0.07)' }}>
        <h2 className="font-sans font-semibold text-navy text-[15px]">Recent Sends</h2>
        {loadingLog ? (
          <p className="font-sans text-[13px] text-navy/30">Loading…</p>
        ) : log.length === 0 ? (
          <p className="font-sans text-[13px] text-navy/30">No notifications sent yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {log.map(entry => (
              <div key={entry.id} className="flex flex-col gap-0.5 pb-3" style={{ borderBottom: '1px solid rgba(11,31,74,0.06)' }}>
                <p className="font-sans font-semibold text-[13px] text-navy">{entry.title}</p>
                <p className="font-sans text-[12px] text-navy/60">{entry.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-sans text-[10px] text-navy/35">
                    {new Date(entry.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {(entry.target_agency || entry.target_role) && (
                    <Badge label={[entry.target_agency, entry.target_role].filter(Boolean).join(' · ')} color="#2563A8" />
                  )}
                  {!entry.target_agency && !entry.target_role && (
                    <Badge label="Everyone" color="#1A8A72" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

const TABS = [
  { id: 'members',       label: 'Members' },
  { id: 'events',        label: 'Events' },
  { id: 'articles',      label: 'Articles' },
  { id: 'therapists',    label: 'Therapists' },
  { id: 'crisis',        label: 'Crisis' },
  { id: 'fitness',       label: 'Fitness' },
  { id: 'team',          label: 'Team' },
  { id: 'feedback',      label: 'Feedback' },
  { id: 'notifications', label: 'Notifications' },
]

// ── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [tab, setTab] = useState('members')

  useEffect(() => {
    async function checkAuth() {
      const { data: { session: s } } = await supabase.auth.getSession()
      if (!s) { navigate('/admin'); return }
      // Check admin role
      const { data: adminRow } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', s.user.id)
        .single()
      setSession(s)
      setIsAdmin(!!adminRow)
      setChecking(false)
    }
    checkAuth()
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

  // Logged in but not an admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-6 text-center gap-4">
        <p className="font-display text-cream uppercase tracking-wide text-[2rem]">Access Denied</p>
        <p className="font-sans text-cream/40 text-[13px]">Your account does not have admin access.</p>
        <button onClick={signOut}
          className="mt-2 rounded-full px-6 py-2.5 font-sans text-[13px] font-semibold cursor-pointer"
          style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}>
          Sign Out
        </button>
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
        {tab === 'members'       && <MembersTab />}
        {tab === 'events'        && <EventsTab />}
        {tab === 'articles'      && <ArticlesTab />}
        {tab === 'therapists'    && <TherapistsTab />}
        {tab === 'crisis'        && <CrisisTab />}
        {tab === 'fitness'       && <FitnessTab />}
        {tab === 'team'          && <TeamTab />}
        {tab === 'feedback'      && <FeedbackTab />}
        {tab === 'notifications' && <NotificationsTab />}
      </div>
    </div>
  )
}
