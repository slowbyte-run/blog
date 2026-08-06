export const animation = {
  duration: {
    fast: 150,
    tween: 200,
    normal: 250,
    ui: 300,
    slow: 350,
    slower: 500,
    flipCard: 600,
  },
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  spring: {
    default: { type: 'spring' as const, stiffness: 300, damping: 30 },
    gentle: { type: 'spring' as const, stiffness: 200, damping: 25 },
    wobbly: { type: 'spring' as const, stiffness: 400, damping: 20 },
    stiff: { type: 'spring' as const, stiffness: 500, damping: 35 },
    slow: { type: 'spring' as const, stiffness: 150, damping: 20 },
    microDamping: { type: 'spring' as const, stiffness: 200, damping: 13 },
    microRebound: { type: 'spring' as const, stiffness: 200, damping: 9 },
    menu: { type: 'spring' as const, stiffness: 300, damping: 25 },
    popoverContent: { type: 'spring' as const, stiffness: 300, damping: 20 },
  },
  transition: {
    fast: `all ${150}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    normal: `all ${250}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    slow: `all ${350}ms cubic-bezier(0.4, 0, 0.2, 1)`,
  },
} as const;

export type SpringPresetToken = keyof typeof animation.spring;
export type EasingToken = keyof typeof animation.easing;
