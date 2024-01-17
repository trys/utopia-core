// Types

type UtopiaRelativeTo = 'viewport' | 'container';

export type UtopiaTypeConfig = {
  minWidth: number;
  maxWidth: number;
  minFontSize: number;
  maxFontSize: number;
  minTypeScale: number;
  maxTypeScale: number;
  negativeSteps?: number;
  positiveSteps?: number;
  relativeTo?: UtopiaRelativeTo;
}

export type UtopiaStep = {
  step: number;
  minFontSize: number;
  maxFontSize: number;
  clamp: string;
}

export type UtopiaSpaceConfig = {
  minWidth: number;
  maxWidth: number;
  minSize: number;
  maxSize: number;
  negativeSteps?: number[];
  positiveSteps?: number[];
  customSizes?: string[];
  relativeTo?: UtopiaRelativeTo;
}

export type UtopiaSize = {
  label: string;
  minSize: number;
  maxSize: number;
  clamp: string;
  clampPx: string;
}

export type UtopiaClampsConfig = {
  minWidth: number;
  maxWidth: number;
  pairs: [number, number][];
  relativeTo?: UtopiaRelativeTo;
};

export type UtopiaClampConfig = {
  minWidth: number;
  maxWidth: number;
  minSize: number;
  maxSize: number;
  usePx?: boolean;
  relativeTo?: UtopiaRelativeTo;
};

export type UtopiaClamp = {
  label: string;
  clamp: string;
}

// Helpers

const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a
const clamp = (a: number, min: number = 0, max: number = 1) => Math.min(max, Math.max(min, a))
const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x))
const range = (x1: number, y1: number, x2: number, y2: number, a: number) => lerp(x2, y2, invlerp(x1, y1, a))
const roundToTwo = (n: number) => Math.round((n + Number.EPSILON) * 1000) / 1000;

// Clamp

export const calculateClamp = ({
  maxSize,
  minSize,
  minWidth,
  maxWidth,
  usePx = false,
  relativeTo = 'viewport'
}: UtopiaClampConfig): string => {
  const isNegative = minSize > maxSize;
  const min = isNegative ? maxSize : minSize;
  const max = isNegative ? minSize : maxSize;

  const divider = usePx ? 1 : 16;
  const unit = usePx ? 'px' : 'rem';
  const relativeUnit = relativeTo === 'viewport' ? 'vi' : 'cqi';

  const slope = ((maxSize / divider) - (minSize / divider)) / ((maxWidth / divider) - (minWidth / divider));
  const intersection = (-1 * (minWidth / divider)) * slope + (minSize / divider);
  return `clamp(${roundToTwo(min / divider)}${unit}, ${roundToTwo(intersection)}${unit} + ${roundToTwo(slope * 100)}${relativeUnit}, ${roundToTwo(max / divider)}${unit})`;
}

export const calculateClamps = ({ minWidth, maxWidth, pairs = [], relativeTo } : UtopiaClampsConfig): UtopiaClamp[] => {
  return pairs.map(([minSize, maxSize]) => {
    return {
      label: `${minSize}-${maxSize}`,
      clamp: calculateClamp({ minSize, maxSize, minWidth, maxWidth, relativeTo }),
      clampPx: calculateClamp({ minSize, maxSize, minWidth, maxWidth, relativeTo, usePx: true })
    }
  });
}

// Type

const calculateTypeSize = (config: UtopiaTypeConfig, viewport: number, step: number): number => {
  const scale = range(config.minWidth, config.maxWidth, config.minTypeScale, config.maxTypeScale, viewport);
  const fontSize = range(config.minWidth, config.maxWidth, config.minFontSize, config.maxFontSize, viewport);
  return fontSize * Math.pow(scale, step);
}

const calculateTypeStep = (config: UtopiaTypeConfig, step: number): UtopiaStep => {
  const minFontSize = calculateTypeSize(config, config.minWidth, step);
  const maxFontSize = calculateTypeSize(config, config.maxWidth, step);

  return {
    step,
    minFontSize: roundToTwo(minFontSize),
    maxFontSize: roundToTwo(maxFontSize),
    clamp: calculateClamp({
      minSize: minFontSize,
      maxSize: maxFontSize,
      minWidth: config.minWidth,
      maxWidth: config.maxWidth,
      relativeTo: config.relativeTo
    })
  }
}

export const calculateTypeScale = (config: UtopiaTypeConfig): UtopiaStep[] => {
  const positiveSteps = Array.from({ length: config.positiveSteps || 0 })
  .map((_, i) => calculateTypeStep(config, i + 1)).reverse();
  
  const negativeSteps = Array.from({ length: config.negativeSteps || 0 })
  .map((_, i) => calculateTypeStep(config, -1 * (i + 1)));
  
  return [
    ...positiveSteps,
    calculateTypeStep(config, 0),
    ...negativeSteps
  ]
}

// Space

const calculateSpaceSize = (config: UtopiaSpaceConfig, multiplier: number, step: number): UtopiaSize => {
  const minSize = Math.round(config.minSize * multiplier);
  const maxSize = Math.round(config.maxSize * multiplier);

  let label = 'S';
  if (step === 1) {
    label = 'M';
  } else if (step === 2) {
    label = 'L';
  } else if (step === 3) {
    label = 'XL';
  } else if (step > 3) {
    label = `${step - 2}XL`;
  } else if (step === -1) {
    label = 'XS';
  } else if (step < 0) {
    label = `${Math.abs(step)}XS`;
  }

  return {
    label: label.toLowerCase(),
    minSize: roundToTwo(minSize),
    maxSize: roundToTwo(maxSize),
    clamp: calculateClamp({
      minSize,
      maxSize,
      minWidth: config.minWidth,
      maxWidth: config.maxWidth,
      relativeTo: config.relativeTo,
    }),
    clampPx: calculateClamp({
      minSize,
      maxSize,
      minWidth: config.minWidth,
      maxWidth: config.maxWidth,
      relativeTo: config.relativeTo,
      usePx: true,
    })
  }
}

const calculateOneUpPairs = (config: UtopiaSpaceConfig, sizes: UtopiaSize[]): UtopiaSize[] => {
  return [...sizes.reverse()].map((size, i, arr) => {
    if (!i) return null;
    const prev = arr[i - 1];
    return {
      label: `${prev.label}-${size.label}`,
      minSize: prev.minSize,
      maxSize: size.maxSize,
      clamp: calculateClamp({
        minSize: prev.minSize,
        maxSize: size.maxSize,
        minWidth: config.minWidth,
        maxWidth: config.maxWidth,
        relativeTo: config.relativeTo,
      }),
      clampPx: calculateClamp({
        minSize: prev.minSize,
        maxSize: size.maxSize,
        minWidth: config.minWidth,
        maxWidth: config.maxWidth,
        relativeTo: config.relativeTo,
        usePx: true,
      }),
    }
  }).filter((size): size is UtopiaSize => !!size)
}

const calculateCustomPairs = (config: UtopiaSpaceConfig, sizes: UtopiaSize[]): UtopiaSize[] => {
  return (config.customSizes || []).map((label) => {
    const [keyA, keyB] = label.split('-');
    if (!keyA || !keyB) return null;
    
    const a = sizes.find(x => x.label === keyA);
    const b = sizes.find(x => x.label === keyB);
    if (!a || !b) return null;

    return {
      label: `${keyA}-${keyB}`,
      minSize: a.minSize,
      maxSize: b.maxSize,
      clamp: calculateClamp({
        minWidth: config.minWidth,
        maxWidth: config.maxWidth,
        minSize: a.minSize,
        maxSize: b.maxSize,
        relativeTo: config.relativeTo,
      }),
      clampPx: calculateClamp({
        minWidth: config.minWidth,
        maxWidth: config.maxWidth,
        minSize: a.minSize,
        maxSize: b.maxSize,
        relativeTo: config.relativeTo,
        usePx: true
      }),
    }
  }).filter((size): size is UtopiaSize => !!size)
}

export const calculateSpaceScale = (config: UtopiaSpaceConfig) => {
  const positiveSteps = [...config.positiveSteps || []].sort()
    .map((multiplier, i) => calculateSpaceSize(config, multiplier, i + 1)).reverse();

  const negativeSteps = [...config.negativeSteps || []].sort().reverse()
    .map((multiplier, i) => calculateSpaceSize(config, multiplier, -1 * (i + 1)));

  const sizes = [
    ...positiveSteps,
    calculateSpaceSize(config, 1, 0),
    ...negativeSteps
  ];

  const oneUpPairs = calculateOneUpPairs(config, sizes);
  const customPairs = calculateCustomPairs(config, sizes);

  return {
    sizes,
    oneUpPairs,
    customPairs
  }
}
