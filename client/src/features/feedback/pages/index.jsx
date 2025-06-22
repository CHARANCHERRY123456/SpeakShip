// FeedbackPage: Lets users submit feedback and ratings for deliveries.
import React, { useState } from 'react';
import { submitFeedback } from '../api/index';
import { toast } from 'react-hot-toast';

const FeedbackPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitFeedback(form);
      toast.success('Thank you for your feedback!');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12">
      <form onSubmit={handleSubmit} className="max-w-lg w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800 dark:text-white">Feedback</h2>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          placeholder="Your Name"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          placeholder="Your Email"
          required
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          placeholder="Your Feedback"
          rows={4}
          required
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackPage;
