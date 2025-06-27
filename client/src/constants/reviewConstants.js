// src/constants/reviewConstants.js
// Centralized constants for review UI, avatars, badges, and animation

export const REVIEW = {
  AVATAR_SIZE: 44,
  AVATAR_RING_WIDTH: 3,
  RING_COLOR: {
    driver: 'ring-blue-400',
    customer: 'ring-green-400',
    admin: 'ring-gray-400',
    default: 'ring-gray-300',
  },
  BADGE: {
    driver: 'bg-blue-100 text-blue-700',
    customer: 'bg-green-100 text-green-700',
    admin: 'bg-gray-200 text-gray-700',
    default: 'bg-gray-200 text-gray-700',
  },
  STAR_ANIMATION: 'transition-transform duration-300',
  CARD_ANIMATION: 'transition-all duration-300 hover:scale-[1.025] hover:shadow-lg',
  QUOTE_COLOR: 'text-[#1976D2] opacity-30',
  MASONRY_GAP: 'gap-6',
};
