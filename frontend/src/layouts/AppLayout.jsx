import { Outlet, Link } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-100 p-4 border-r">
        <h2 className="text-xl font-bold mb-6">NetaCheck 🇳🇵</h2>
        <nav className="flex flex-col space-y-4">
          <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <Link to="/ratings" className="hover:text-blue-600">Rate Politicians</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
