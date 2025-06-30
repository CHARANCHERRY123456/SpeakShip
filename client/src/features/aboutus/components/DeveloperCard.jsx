
const DeveloperCard = ({ name, role, bio, skills, image, isActive }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 h-full flex flex-col ${isActive ? 'transform scale-105 border-2 border-blue-500' : 'transform scale-95 opacity-80'}`}>
      <div className="p-6 flex flex-col items-center h-full">
        {/* Circular Image with Glow Effect */}
        <div className={`relative w-32 h-32 mb-6 rounded-full overflow-hidden border-4 ${isActive ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}>
          <img 
            src={image} 
            alt={`${name}, ${role}`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'https://via.placeholder.com/150';
            }}
          />
          {isActive && (
            <div className="absolute inset-0 rounded-full border-8 border-blue-100 opacity-60 animate-ping"></div>
          )}
        </div>
        
        {/* Content Section */}
        <div className="text-center w-full">
          <h3 className={`text-xl font-bold mb-2 ${isActive ? 'text-blue-600' : 'text-gray-800'}`}>{name}</h3>
          <p className={`mb-4 ${isActive ? 'text-blue-500' : 'text-gray-600'}`}>{role}</p>
          <p className="text-gray-600 mb-4">{bio}</p>
          
          {/* Skills Section */}
          <div className="mt-auto">
            <h4 className="font-medium mb-2 text-gray-700">Skills:</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={index} 
                  className={`px-3 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCard;