const MissionCard = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 mb-16">
      <div className="md:flex items-center">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <img 
            src="https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
            alt="Transportation network" 
            className="rounded-lg w-full h-auto"
          />
        </div>
        <div className="md:w-1/2 md:pl-8">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            We built this platform to solve the growing complexity of urban transportation. 
            Our goal is to provide a unified solution that saves time, reduces stress, 
            and makes sustainable travel options more accessible to everyone.
          </p>
          <p className="text-gray-700">
            Whether you're commuting to work, planning a trip, or managing fleet logistics, 
            we're here to simplify your journey from start to finish.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MissionCard;