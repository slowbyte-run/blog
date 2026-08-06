export const typography = {
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
    sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.0125em' }],
    base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
    lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.0125em' }],
    xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
    '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }],
    '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
    '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
    '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
    '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
    '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
} as const;

export type FontSizeToken = keyof typeof typography.fontSize;
export type FontWeightToken = keyof typeof typography.fontWeight;
