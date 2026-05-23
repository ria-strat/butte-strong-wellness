import { NavLink } from 'react-router-dom'

const HomeIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const ShieldIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const UsersIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const MessageIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const tabs = [
  { to: '/',             label: 'Home',      Icon: HomeIcon    },
  { to: '/resources',    label: 'Resources', Icon: ShieldIcon  },
  { to: '/about',        label: 'Team',      Icon: UsersIcon   },
  { to: '/feedback',     label: 'Feedback',  Icon: MessageIcon },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around"
      style={{
        height: '60px',
        backgroundColor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(11,31,74,0.07)',
      }}
    >
      {tabs.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className="flex flex-col items-center justify-center gap-0.5 flex-1"
          style={{ minHeight: '44px', minWidth: '44px', cursor: 'pointer' }}
        >
          {({ isActive }) => (
            <>
              <span
                style={{
                  color: isActive ? '#0B1F4A' : 'rgba(11,31,74,0.3)',
                  transition: 'color 0.2s cubic-bezier(0.32,0.72,0,1)',
                }}
              >
                <Icon active={isActive} />
              </span>
              <span
                className="font-sans text-[10px] font-medium"
                style={{
                  color: isActive ? '#0B1F4A' : 'rgba(11,31,74,0.3)',
                  transition: 'color 0.2s cubic-bezier(0.32,0.72,0,1)',
                }}
              >
                {label}
              </span>
              <span
                className="w-1 h-1 rounded-full mt-0.5"
                style={{
                  backgroundColor: '#C9A84C',
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 0.2s cubic-bezier(0.32,0.72,0,1)',
                }}
              />
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
