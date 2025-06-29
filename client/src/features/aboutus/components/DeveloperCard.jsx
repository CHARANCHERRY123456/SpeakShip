const DeveloperCard = ({ name, role, bio, skills, avatar }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="p-6">
        <div className="text-5xl mb-4 text-center">{avatar}</div>
        <h3 className="text-xl font-bold text-center mb-1">{name}</h3>
        <p className="text-blue-600 text-center mb-4">{role}</p>
        <p className="text-gray-700 mb-4">{bio}</p>
        
        <div className="mt-4">
          <h4 className="font-medium mb-2">Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span 
                key={index} 
                className="bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCard;