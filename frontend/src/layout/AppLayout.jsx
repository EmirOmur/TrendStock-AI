import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header  from './Header.jsx';

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* ── Left sidebar ─────────────────────────────── */}
      <Sidebar />

      {/* ── Main content area ────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
