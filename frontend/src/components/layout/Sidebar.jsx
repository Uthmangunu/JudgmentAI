import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/analysis/demo', label: 'Analysis' },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:block w-64 border-r border-border bg-bg-secondary/40 p-6">
      <nav className="space-y-3 text-sm">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 font-medium ${isActive ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:text-primary'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
