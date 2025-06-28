import React from "react";

const mascot =
  "https://cdn.dribbble.com/userupload/43435636/file/original-58ba2613383f6fa8e8e3f4e941e175c7.png?resize=400x0";

const footerLinks = [
  {
    title: "Product",
    links: [
      "Features",
      "Enterprise",
      "Pricing",
      "Team",
      "Resources",
      "Roadmap"
    ],
  },
  {
    title: "Platform",
    links: [
      "Developer API",
      "Partners",
      "Education",
      "QuickDelivery CLI",
      "Desktop App",
      "Mobile App"
    ],
  },
  {
    title: "Support",
    links: [
      "Docs",
      "Community Forum",
      "Professional Services",
      "Premium Support",
      "Status",
      "Contact"
    ],
  },
  {
    title: "Company",
    links: [
      "About",
      "Customer Stories",
      "Careers",
      "Newsroom",
      "Social Impact",
      "Privacy Policy"
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-700 to-blue-900 text-gray-100 pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:justify-between gap-12">
        {/* Left: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-bold text-lg md:text-2xl mb-4 tracking-wide">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-blue-200 transition-colors duration-200 text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Right: Mascot, Ship, Newsletter */}
        <div className="flex flex-col items-center justify-between min-w-[220px]">
          {/* Ship SVG with left-right animation */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative flex items-center justify-center mb-2">
              <span className="absolute w-28 h-28 rounded-full bg-white ring-4 ring-blue-400 drop-shadow-2xl"></span>
              <svg
                viewBox="0 0 80 80"
                className="w-24 h-24 relative animate-ship-sail"
                style={{ filter: "drop-shadow(0 8px 32px rgba(37,99,235,0.7))" }}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Hull */}
                <path
                  d="M20 60 Q40 80 60 60 Z"
                  fill="#2563eb"
                  stroke="#1e40af"
                  strokeWidth="2"
                />
                {/* Deck */}
                <rect x="28" y="50" width="24" height="6" rx="2" fill="#3b82f6" />
                {/* Mast */}
                <rect x="39" y="26" width="2" height="24" fill="#1e293b" />
                {/* Sail */}
                <polygon points="40,28 40,48 60,48" fill="#60a5fa" />
                {/* Flag */}
                <polygon points="40,26 40,32 46,29" fill="#fbbf24" />
                {/* Waves */}
                <ellipse cx="40" cy="70" rx="18" ry="3" fill="#93c5fd" opacity="0.7" />
              </svg>
            </div>
          </div>
          {/* Newsletter */}
          <div className="text-center">
            <p className="mb-2 text-sm text-blue-100 font-medium">The QuickDelivery Newsletter</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="rounded-l-lg px-3 py-2 bg-blue-800 text-gray-100 placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="rounded-r-lg px-4 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Divider */}
      <div className="border-t border-blue-300/30 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
        <span className="text-xs text-blue-100 mb-2 md:mb-0">
          © {new Date().getFullYear()} QuickDelivery Inc. All rights reserved.
        </span>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-blue-200 transition-colors">
            {/* GitHub icon */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.1c-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.74 1.27 3.41.97.11-.76.41-1.27.75-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.99 0 1.99.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.43-2.68 5.41-5.24 5.7.42.36.8 1.09.8 2.2v3.26c0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/>
            </svg>
          </a>
          <a href="#" className="hover:text-blue-200 transition-colors">
            {/* Twitter icon */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.56c-.89.39-1.85.65-2.86.77a4.93 4.93 0 0 0 2.16-2.72 9.86 9.86 0 0 1-3.13 1.2A4.92 4.92 0 0 0 16.62 3c-2.73 0-4.94 2.21-4.94 4.94 0 .39.04.77.12 1.13A14 14 0 0 1 3.1 3.57a4.93 4.93 0 0 0-.67 2.49c0 1.72.87 3.23 2.2 4.12-.8-.03-1.56-.25-2.23-.62v.06c0 2.4 1.7 4.41 3.95 4.87-.41.11-.84.17-1.28.17-.31 0-.61-.03-.9-.08.61 1.9 2.38 3.29 4.48 3.32A9.87 9.87 0 0 1 2 19.54a13.94 13.94 0 0 0 7.56 2.22c9.07 0 14.04-7.52 14.04-14.04 0-.21 0-.41-.01-.61A10.02 10.02 0 0 0 24 4.56z"/>
            </svg>
          </a>
          <a href="#" className="hover:text-blue-200 transition-colors">
            {/* LinkedIn icon */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.29c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.29h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v4.74z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
