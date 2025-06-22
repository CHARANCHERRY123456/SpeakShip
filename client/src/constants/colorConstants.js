// src/constants/colorConstants.js
// Centralized color and style constants for SpeakShip UI (Material/modern design)

export const COLORS = {
  APP_BG: 'bg-[#F4F6F8]',
  CARD_BG: 'bg-white',
  CARD_SHADOW: 'shadow-[0_2px_10px_rgba(0,0,0,0.08)]',
  CARD_RADIUS: 'rounded-[12px]',
  BORDER: 'border-[#E0E0E0]',
  ACCENT: 'text-[#1976D2]',
  ACCENT_BG: 'bg-[#1976D2]',
  ACCENT_HOVER_BG: 'hover:bg-[#1565C0]',
  ACCENT_BORDER: 'border-[#1976D2]',
  ACCENT_SECONDARY: 'text-[#00C853]',
  ACCENT_PENDING: 'text-[#FF9100]',
  TEXT_MAIN: 'text-[#212121]',
  TEXT_SECONDARY: 'text-[#616161]',
  DIVIDER: 'border-[#E0E0E0]',
  BUTTON_PRIMARY: 'bg-[#1976D2] text-white hover:bg-[#1565C0]',
  BUTTON_SECONDARY: 'border border-[#1976D2] text-[#1976D2] hover:bg-[#E3F2FD] bg-white',
};

export const STYLES = {
  CARD: `${COLORS.CARD_BG} ${COLORS.CARD_RADIUS} ${COLORS.CARD_SHADOW} p-6 md:p-8 my-4`,
  SECTION_HEADING: 'text-lg md:text-xl font-semibold mb-4 flex items-center gap-2',
  LABEL: `${COLORS.TEXT_SECONDARY} text-sm label`,
  VALUE: `${COLORS.TEXT_MAIN} text-base font-medium value`,
  STATUS_PENDING: 'status-pending',
  STATUS_DELIVERED: 'status-delivered',
  DIVIDER: 'border-t my-4 ' + COLORS.DIVIDER,
};
