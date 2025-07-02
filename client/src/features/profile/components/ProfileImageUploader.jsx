import React, { useRef } from 'react';
import { DEFAULT_PROFILE_IMAGE_URL } from '../constants/profileImageConstants';

const ProfileImageUploader = ({ imageUrl, loading, error, upload, remove }) => {
  const fileInputRef = useRef();

  const handleUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    console.log('handleUpload called, file:', file);
    if (file) {
      upload(file);
      fileInputRef.current.value = '';
    } else {
      console.warn('No file selected in handleUpload');
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-2">
      {error && <div className="text-red-500 text-xs mb-1">{error}</div>}
      <div className="flex gap-2">
        <label htmlFor="profile-upload" className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer hover:bg-blue-700 transition">
          {imageUrl ? 'Change' : 'Upload'}
          <input
            id="profile-upload"
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            className="hidden"
            ref={fileInputRef}
            onChange={handleUpload}
            disabled={loading}
          />
        </label>
        <button
          className="inline-flex items-center px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition disabled:opacity-50"
          onClick={remove}
          disabled={loading}
        >
          Remove
        </button>
      </div>
      {loading && <div className="text-blue-500 text-xs mt-1">Processing...</div>}
    </div>
  );
};

export default ProfileImageUploader;
