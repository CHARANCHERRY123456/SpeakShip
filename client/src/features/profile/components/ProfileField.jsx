// src/features/profile/components/ProfileField.jsx
import React from 'react';
import { User, Mail, Phone, Tag, Key } from 'lucide-react';

const iconComponents = {
  User,
  Mail,
  Phone,
  Tag,
  Key
};

const ProfileField = ({ label, value, icon }) => {
  const IconComponent = iconComponents[icon] || User;

  return (
    <div className="flex items-start gap-4 p-4 bg-white/70 hover:bg-gray-50/90 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:-translate-y-px mb-4">
      <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg text-blue-600">
        <IconComponent className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </span>
        <span className="block mt-1 text-gray-900 text-base sm:text-lg font-medium break-words">
          {value}
        </span>
      </div>
    </div>
  );
};

export default ProfileField;