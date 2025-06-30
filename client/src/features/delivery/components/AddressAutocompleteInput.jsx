import React, { useState, useRef } from 'react';
import { Search } from 'lucide-react';

// Simple debounce function
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const AddressAutocompleteInput = ({ label, value, onChange, placeholder = '', required = false, icon: Icon }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  // Debounced fetch for address suggestions
  const fetchSuggestions = debounce(async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleInputChange = (e) => {
    onChange(e);
    fetchSuggestions(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange({ target: { value: suggestion.display_name } });
    setShowSuggestions(false);
    setSuggestions([]);
    // Optionally, you can pass coordinates as well
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {/* Show search icon always, and address icon if provided */}
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        {Icon && (
          <Icon className="absolute left-8 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          className={`w-full ${Icon ? 'pl-16' : 'pl-8'} pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500`}
          autoComplete="off"
          aria-label={label || 'Address search'}
          onFocus={() => value && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl mt-1 max-h-56 overflow-y-auto shadow-lg">
          {suggestions.map((s, idx) => (
            <li
              key={s.place_id}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 text-sm"
              onMouseDown={() => handleSuggestionClick(s)}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
      {loading && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Loading...</div>}
    </div>
  );
};

export default AddressAutocompleteInput;
