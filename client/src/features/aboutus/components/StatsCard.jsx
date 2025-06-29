const StatsCard = () => {
  const stats = [
    { value: "500K+", label: "Daily Active Users" },
    { value: "85%", label: "Reduction in Planning Time" },
    { value: "200+", label: "Cities Worldwide" },
    { value: "4.8/5", label: "Average Rating" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
          <div className="text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;