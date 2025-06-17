import politicians from "./mockData";

const PoliticianList = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {politicians.map((p) => (
        <div key={p.id} className="border p-4 bg-white rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-xl font-bold text-gray-800">{p.name}</h3>
          <p className="text-sm text-gray-600">Party: {p.party}</p>
          <p className="text-sm text-gray-600">Province: {p.province}</p>
          <p className="text-sm text-yellow-500 font-medium">⭐ {p.rating}</p>
        </div>
      ))}
    </div>
  );
};

export default PoliticianList;
