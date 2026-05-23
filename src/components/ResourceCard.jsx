const accentColors = {
  teal: 'bg-teal',
  blue: 'bg-blue',
  gold: 'bg-gold',
  navy: 'bg-navy',
}

export default function ResourceCard({ title, description, phone, website, category, accent = 'teal' }) {
  return (
    <div className="flex items-stretch bg-white rounded-xl shadow-sm overflow-hidden">
      <div className={`w-1.5 shrink-0 ${accentColors[accent] ?? 'bg-teal'}`} />
      <div className="p-4 flex flex-col gap-1 flex-1">
        <span className="text-xs font-sans font-semibold text-navy/40 uppercase tracking-wider">{category}</span>
        <h3 className="font-sans font-semibold text-navy text-base leading-snug">{title}</h3>
        {description && <p className="font-sans text-sm text-navy/60 leading-relaxed">{description}</p>}
        <div className="flex gap-3 mt-1">
          {phone && (
            <a href={`tel:${phone}`} className="text-sm font-sans font-medium text-teal">
              {phone}
            </a>
          )}
          {website && (
            <a href={website} target="_blank" rel="noopener noreferrer" className="text-sm font-sans font-medium text-blue">
              Visit site
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
