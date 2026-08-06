/**
 * 设计令牌聚合导出
 * 拆分到多文件，降低单文件复杂度。
 */

export { colors, type ColorToken } from './design-tokens/colors';
export {
  spacing,
  spacingNames,
  type SpacingToken,
  type SpacingNameToken,
} from './design-tokens/spacing';
export {
  typography,
  type FontSizeToken,
  type FontWeightToken,
} from './design-tokens/typography';
export {
  shadows,
  borderRadius,
  type ShadowToken,
  type BorderRadiusToken,
} from './design-tokens/effects';
export {
  animation,
  type SpringPresetToken,
  type EasingToken,
} from './design-tokens/motion';
export {
  breakpoints,
  zIndex,
  gridBackground,
  perspective,
  type BreakpointToken,
  type ZIndexToken,
} from './design-tokens/layout';
