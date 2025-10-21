import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const BenefitCard = ({ title, description, icon, bgColor = "bg-gray-50" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className={`${bgColor} p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 h-full relative overflow-hidden group`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      
      <div className="flex items-start gap-4 relative z-10">
        <motion.span 
          whileHover={{ scale: 1.1 }}
          className="text-3xl p-3 rounded-lg bg-white shadow-sm flex items-center justify-center"
          style={{
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
          }}
        >
          {icon}
        </motion.span>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
            <FiArrowUpRight className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
          
         
        </div>
      </div>
      
     
    </motion.div>
  );
};

export default BenefitCard;