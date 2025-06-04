import politicians from "./mockData";

const PoliticianList = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Politicians</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {politicians.map((p) => (
          <div key={p.id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-bold">{p.name}</h3>
            <p className="text-gray-600">{p.party}</p>
            <p className="text-sm">Province: {p.province}</p>
            <p className="text-sm">Rating: ⭐ {p.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoliticianList;
