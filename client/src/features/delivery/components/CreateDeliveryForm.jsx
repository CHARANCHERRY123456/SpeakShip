// src/features/delivery/components/CreateDeliveryForm.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { createDeliveryRequest } from '../api';
import { Mail, Phone, MapPin, Notebook, Camera, Tag } from 'lucide-react'; // Import relevant icons

const CreateDeliveryForm = ({ onDeliveryCreated }) => {
    const { currentUser } = useAuth(); // Assuming 'currentUser' holds the logged-in user's data
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        pickupAddress: '',
        dropoffAddress: '',
        note: '',
    });
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Pre-fill form with current user's data if available
    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                name: currentUser.name || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                // If currentUser has a default address, you could pre-fill pickupAddress
                // pickupAddress: currentUser.address || '',
            }));
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        if (photo) {
            data.append('photo', photo); // 'photo' must match the field name in upload.single('photo')
        }

        try {
            const response = await createDeliveryRequest(data);
            setSuccessMessage('Delivery request created successfully!');
            // Clear form fields after successful submission
            setFormData({
                name: currentUser?.name || '',
                email: currentUser?.email || '',
                phone: currentUser?.phone || '',
                pickupAddress: '',
                dropoffAddress: '',
                note: '',
            });
            setPhoto(null);
            if (onDeliveryCreated) {
                onDeliveryCreated(response); // Callback to parent to update lists
            }
        } catch (err) {
            console.error('Failed to create delivery request:', err);
            setError(err.response?.data?.error || 'Failed to create delivery request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const InputField = ({ icon: Icon, label, name, type = "text", value, onChange, placeholder, required = false, isTextArea = false }) => (
        <div>
            <label htmlFor={name} className="sr-only">{label}</label>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                {isTextArea ? (
                    <textarea
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={required}
                        rows="3"
                        className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm font-inter"
                    />
                ) : (
                    <input
                        id={name}
                        name={name}
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={required}
                        className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm font-inter"
                    />
                )}
            </div>
        </div>
    );


    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create New Delivery Request</h2>
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4" role="alert">
                    {successMessage}
                </div>
            )}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField icon={Tag} label="Your Name" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required />
                <InputField icon={Mail} label="Your Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required />
                <InputField icon={Phone} label="Your Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Your Phone Number" required />
                <InputField icon={MapPin} label="Pickup Address" name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} placeholder="Pickup Address" required />
                <InputField icon={MapPin} label="Dropoff Address" name="dropoffAddress" value={formData.dropoffAddress} onChange={handleChange} placeholder="Dropoff Address" required />
                <InputField icon={Notebook} label="Note" name="note" value={formData.note} onChange={handleChange} placeholder="Any special notes for delivery" isTextArea />

                <div>
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">Upload Item Photo (Optional)</label>
                    <div className="relative border border-gray-300 rounded-lg p-3 flex items-center gap-3 bg-gray-50">
                        <Camera className="h-5 w-5 text-gray-400" />
                        <input
                            id="photo"
                            name="photo"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                        />
                        {photo && <span className="text-sm text-gray-500">{photo.name}</span>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-colors ${
                        loading ? 'bg-sky-300 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700'
                    }`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                        </>
                    ) : (
                        'Submit Delivery Request'
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreateDeliveryForm;
