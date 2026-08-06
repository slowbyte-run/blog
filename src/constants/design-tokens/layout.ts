export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

export const gridBackground = {
  light: ['#ed719a', '#FFACDE', '#FBD7ED', '#EEF1F0', '#DDDDDD', '#B4B4B4'],
  dark: ['#212832', '#3F4659', '#8592A7', '#EEEFEA', '#212832', '#3F4659'],
} as const;

export const perspective = {
  card3d: '1000px',
} as const;

export type BreakpointToken = keyof typeof breakpoints;
export type ZIndexToken = keyof typeof zIndex;
