import PoliticianList from "../features/politicians/PoliticianList";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to NetaCheck 🇳🇵</h1>
      
      <nav className="mb-6 space-x-4">
        <a href="/dashboard" className="text-blue-600 hover:underline font-medium">Dashboard</a>
        <a href="/ratings" className="text-blue-600 hover:underline font-medium">Rate Politicians</a>
      </nav>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Top Politicians</h2>
        <PoliticianList />
      </section>
    </div>
  );
};

export default Dashboard;
