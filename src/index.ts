// Types

export type UtopiaTypeConfig = {
  minWidth: number;
  maxWidth: number;
  minFontSize: number;
  maxFontSize: number;
  minTypeScale: number;
  maxTypeScale: number;
  negativeSteps?: number;
  positiveSteps?: number;
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
}

export type UtopiaSize = {
  label: string;
  minSize: number;
  maxSize: number;
  clamp: string;
}

export type UtopiaClampsConfig = {
  minWidth: number;
  maxWidth: number;
  pairs: [number, number][];
};

export type UtopiaClampConfig = {
  minWidth: number;
  maxWidth: number;
  minSize: number;
  maxSize: number;
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

export const calculateClamp = ({
  maxSize,
  minSize,
  minWidth,
  maxWidth,
}: UtopiaClampConfig): string => {
  const isNegative = minSize > maxSize;
  let min = isNegative ? maxSize : minSize;
  let max = isNegative ? minSize : maxSize;

  const slope = ((maxSize / 16) - (minSize / 16)) / ((maxWidth / 16) - (minWidth / 16));
  const intersection = (-1 * (minWidth / 16)) * slope + (minSize / 16);
  return `clamp(${roundToTwo(min / 16)}rem, ${roundToTwo(intersection)}rem + ${roundToTwo(slope * 100)}vw, ${roundToTwo(max / 16)}rem)`;
}

export const calculateClamps = ({ minWidth, maxWidth, pairs = [] } : UtopiaClampsConfig): UtopiaClamp[] => {
  return pairs.map(([minSize, maxSize]) => {
    return {
      label: `${minSize}-${maxSize}`,
      clamp: calculateClamp({ minSize, maxSize, minWidth, maxWidth })
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
