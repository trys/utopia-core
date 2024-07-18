import { test, expect, describe } from 'vitest';
import { calculateClamp, calculateClamps, calculateSpaceScale, calculateTypeScale } from '.';

// utils
const logObject = (a: unknown) => console.dir(a, { depth: 4 });

describe('calculateClamp', () => {

  test('should generate a single clamp function', () => {
    const result = calculateClamp({ minSize: 16, maxSize: 32, minWidth: 320, maxWidth: 1240 });
    const expected = 'clamp(1rem, 0.6522rem + 1.7391vw, 2rem)';
    expect(result).toEqual(expected);
  });

  test('should generate a px clamp function', () => {
    const result = calculateClamp({ minSize: 16, maxSize: 32, minWidth: 320, maxWidth: 1240, usePx: true });
    const expected = 'clamp(16px, 10.4348px + 1.7391vw, 32px)';
    expect(result).toEqual(expected);
  });

  test('should generate a cqi clamp function', () => {
    const result = calculateClamp({ minSize: 16, maxSize: 32, minWidth: 320, maxWidth: 1240, relativeTo: 'container' });
    const expected = 'clamp(1rem, 0.6522rem + 1.7391cqi, 2rem)';
    expect(result).toEqual(expected);
  });


  test('should generate a vi clamp function', () => {
    const result = calculateClamp({ minSize: 16, maxSize: 32, minWidth: 320, maxWidth: 1240, relativeTo: 'viewport' });
    const expected = 'clamp(1rem, 0.6522rem + 1.7391vi, 2rem)';
    expect(result).toEqual(expected);
  });

});

describe('calculateClamps', () => {

  test('should generate multiple clamps', () => {
    const result = calculateClamps({ minWidth: 320, maxWidth: 1080, pairs: [[12, 16], [40, 28]] });
    const expected = [
      {
        clamp: "clamp(0.75rem, 0.6447rem + 0.5263vw, 1rem)",
        clampPx: "clamp(12px, 10.3158px + 0.5263vw, 16px)",
        label: "12-16",
      },
      {
        clamp: "clamp(1.75rem, 2.8158rem + -1.5789vw, 2.5rem)",
        clampPx: "clamp(28px, 45.0526px + -1.5789vw, 40px)",
        label: "40-28",
      },
    ];
    expect(result).toStrictEqual(expected);
  });

});

describe('calculateSpaceScale', () => {

  test('should generate a valid scale', () => {
    const result = calculateSpaceScale({
      minWidth: 320,
      maxWidth: 1240,
      minSize: 18,
      maxSize: 20,
      positiveSteps: [1.5, 2, 3, 4, 6],
      negativeSteps: [0.75, 0.5, 0.25],
      customSizes: ['s-l', '2xl-4xl']
    });
    const expected = {
      sizes: [
        {
          label: '3xs',
          minSize: 5,
          maxSize: 5,
          clamp: 'clamp(0.3125rem, 0.3125rem + 0vw, 0.3125rem)',
          clampPx: 'clamp(5px, 5px + 0vw, 5px)',
          multiplier: 0.25
        },
        {
          label: '2xs',
          minSize: 9,
          maxSize: 10,
          clamp: 'clamp(0.5625rem, 0.5408rem + 0.1087vw, 0.625rem)',
          clampPx: 'clamp(9px, 8.6522px + 0.1087vw, 10px)',
          multiplier: 0.5
        },
        {
          label: 'xs',
          minSize: 14,
          maxSize: 15,
          clamp: 'clamp(0.875rem, 0.8533rem + 0.1087vw, 0.9375rem)',
          clampPx: 'clamp(14px, 13.6522px + 0.1087vw, 15px)',
          multiplier: 0.75
        },
        {
          label: 's',
          minSize: 18,
          maxSize: 20,
          clamp: 'clamp(1.125rem, 1.0815rem + 0.2174vw, 1.25rem)',
          clampPx: 'clamp(18px, 17.3043px + 0.2174vw, 20px)',
          multiplier: 1,
        },
        {
          label: 'm',
          minSize: 27,
          maxSize: 30,
          clamp: 'clamp(1.6875rem, 1.6223rem + 0.3261vw, 1.875rem)',
          clampPx: 'clamp(27px, 25.9565px + 0.3261vw, 30px)',
          multiplier: 1.5
        },
        {
          label: 'l',
          minSize: 36,
          maxSize: 40,
          clamp: 'clamp(2.25rem, 2.163rem + 0.4348vw, 2.5rem)',
          clampPx: 'clamp(36px, 34.6087px + 0.4348vw, 40px)',
          multiplier: 2
        },
        {
          label: 'xl',
          minSize: 54,
          maxSize: 60,
          clamp: 'clamp(3.375rem, 3.2446rem + 0.6522vw, 3.75rem)',
          clampPx: 'clamp(54px, 51.913px + 0.6522vw, 60px)',
          multiplier: 3
        },
        {
          label: '2xl',
          minSize: 72,
          maxSize: 80,
          clamp: 'clamp(4.5rem, 4.3261rem + 0.8696vw, 5rem)',
          clampPx: 'clamp(72px, 69.2174px + 0.8696vw, 80px)',
          multiplier: 4
        },
        {
          label: '3xl',
          minSize: 108,
          maxSize: 120,
          clamp: 'clamp(6.75rem, 6.4891rem + 1.3043vw, 7.5rem)',
          clampPx: 'clamp(108px, 103.8261px + 1.3043vw, 120px)',
          multiplier: 6
        }
      ],
      oneUpPairs: [
        {
          label: '3xs-2xs',
          minSize: 5,
          maxSize: 10,
          clamp: 'clamp(0.3125rem, 0.2038rem + 0.5435vw, 0.625rem)',
          clampPx: 'clamp(5px, 3.2609px + 0.5435vw, 10px)'
        },
        {
          label: '2xs-xs',
          minSize: 9,
          maxSize: 15,
          clamp: 'clamp(0.5625rem, 0.4321rem + 0.6522vw, 0.9375rem)',
          clampPx: 'clamp(9px, 6.913px + 0.6522vw, 15px)'
        },
        {
          label: 'xs-s',
          minSize: 14,
          maxSize: 20,
          clamp: 'clamp(0.875rem, 0.7446rem + 0.6522vw, 1.25rem)',
          clampPx: 'clamp(14px, 11.913px + 0.6522vw, 20px)'
        },
        {
          label: 's-m',
          minSize: 18,
          maxSize: 30,
          clamp: 'clamp(1.125rem, 0.8641rem + 1.3043vw, 1.875rem)',
          clampPx: 'clamp(18px, 13.8261px + 1.3043vw, 30px)'
        },
        {
          label: 'm-l',
          minSize: 27,
          maxSize: 40,
          clamp: 'clamp(1.6875rem, 1.4049rem + 1.413vw, 2.5rem)',
          clampPx: 'clamp(27px, 22.4783px + 1.413vw, 40px)'
        },
        {
          label: 'l-xl',
          minSize: 36,
          maxSize: 60,
          clamp: 'clamp(2.25rem, 1.7283rem + 2.6087vw, 3.75rem)',
          clampPx: 'clamp(36px, 27.6522px + 2.6087vw, 60px)'
        },
        {
          label: 'xl-2xl',
          minSize: 54,
          maxSize: 80,
          clamp: 'clamp(3.375rem, 2.8098rem + 2.8261vw, 5rem)',
          clampPx: 'clamp(54px, 44.9565px + 2.8261vw, 80px)'
        },
        {
          label: '2xl-3xl',
          minSize: 72,
          maxSize: 120,
          clamp: 'clamp(4.5rem, 3.4565rem + 5.2174vw, 7.5rem)',
          clampPx: 'clamp(72px, 55.3043px + 5.2174vw, 120px)'
        }
      ],
      customPairs: [
        {
          label: 's-l',
          minSize: 18,
          maxSize: 40,
          clamp: 'clamp(1.125rem, 0.6467rem + 2.3913vw, 2.5rem)',
          clampPx: 'clamp(18px, 10.3478px + 2.3913vw, 40px)'
        }
      ]
    };
    expect(result).toStrictEqual(expected);
  });

  test('should generate a valid scale', () => {
    const result = calculateSpaceScale({
      minWidth: 320,
      maxWidth: 1240,
      minSize: 18,
      maxSize: 20,
      positiveSteps: [1.5, 2, 3, 4, 6, 8, 10],
      negativeSteps: [0.75, 0.5, 0.25],
      customSizes: ['s-l', '2xl-4xl']
    });
    const expected = {
      sizes: [
        {
          label: '3xs',
          minSize: 5,
          maxSize: 5,
          clamp: 'clamp(0.3125rem, 0.3125rem + 0vw, 0.3125rem)',
          clampPx: 'clamp(5px, 5px + 0vw, 5px)',
          multiplier: 0.25
        },
        {
          label: '2xs',
          minSize: 9,
          maxSize: 10,
          clamp: 'clamp(0.5625rem, 0.5408rem + 0.1087vw, 0.625rem)',
          clampPx: 'clamp(9px, 8.6522px + 0.1087vw, 10px)',
          multiplier: 0.5
        },
        {
          label: 'xs',
          minSize: 14,
          maxSize: 15,
          clamp: 'clamp(0.875rem, 0.8533rem + 0.1087vw, 0.9375rem)',
          clampPx: 'clamp(14px, 13.6522px + 0.1087vw, 15px)',
          multiplier: 0.75
        },
        {
          label: 's',
          minSize: 18,
          maxSize: 20,
          clamp: 'clamp(1.125rem, 1.0815rem + 0.2174vw, 1.25rem)',
          clampPx: 'clamp(18px, 17.3043px + 0.2174vw, 20px)',
          multiplier: 1
        },
        {
          label: 'm',
          minSize: 27,
          maxSize: 30,
          clamp: 'clamp(1.6875rem, 1.6223rem + 0.3261vw, 1.875rem)',
          clampPx: 'clamp(27px, 25.9565px + 0.3261vw, 30px)',
          multiplier: 1.5
        },
        {
          label: 'l',
          minSize: 36,
          maxSize: 40,
          clamp: 'clamp(2.25rem, 2.163rem + 0.4348vw, 2.5rem)',
          clampPx: 'clamp(36px, 34.6087px + 0.4348vw, 40px)',
          multiplier: 2
        },
        {
          label: 'xl',
          minSize: 54,
          maxSize: 60,
          clamp: 'clamp(3.375rem, 3.2446rem + 0.6522vw, 3.75rem)',
          clampPx: 'clamp(54px, 51.913px + 0.6522vw, 60px)',
          multiplier: 3
        },
        {
          label: '2xl',
          minSize: 72,
          maxSize: 80,
          clamp: 'clamp(4.5rem, 4.3261rem + 0.8696vw, 5rem)',
          clampPx: 'clamp(72px, 69.2174px + 0.8696vw, 80px)',
          multiplier: 4
        },
        {
          label: '3xl',
          minSize: 108,
          maxSize: 120,
          clamp: 'clamp(6.75rem, 6.4891rem + 1.3043vw, 7.5rem)',
          clampPx: 'clamp(108px, 103.8261px + 1.3043vw, 120px)',
          multiplier: 6
        },
        {
          label: '4xl',
          minSize: 144,
          maxSize: 160,
          clamp: 'clamp(9rem, 8.6522rem + 1.7391vw, 10rem)',
          clampPx: 'clamp(144px, 138.4348px + 1.7391vw, 160px)',
          multiplier: 8
        },
        {
          label: '5xl',
          minSize: 180,
          maxSize: 200,
          clamp: 'clamp(11.25rem, 10.8152rem + 2.1739vw, 12.5rem)',
          clampPx: 'clamp(180px, 173.0435px + 2.1739vw, 200px)',
          multiplier: 10
        }
      ],
      oneUpPairs: [
        {
          label: '3xs-2xs',
          minSize: 5,
          maxSize: 10,
          clamp: 'clamp(0.3125rem, 0.2038rem + 0.5435vw, 0.625rem)',
          clampPx: 'clamp(5px, 3.2609px + 0.5435vw, 10px)'
        },
        {
          label: '2xs-xs',
          minSize: 9,
          maxSize: 15,
          clamp: 'clamp(0.5625rem, 0.4321rem + 0.6522vw, 0.9375rem)',
          clampPx: 'clamp(9px, 6.913px + 0.6522vw, 15px)'
        },
        {
          label: 'xs-s',
          minSize: 14,
          maxSize: 20,
          clamp: 'clamp(0.875rem, 0.7446rem + 0.6522vw, 1.25rem)',
          clampPx: 'clamp(14px, 11.913px + 0.6522vw, 20px)'
        },
        {
          label: 's-m',
          minSize: 18,
          maxSize: 30,
          clamp: 'clamp(1.125rem, 0.8641rem + 1.3043vw, 1.875rem)',
          clampPx: 'clamp(18px, 13.8261px + 1.3043vw, 30px)'
        },
        {
          label: 'm-l',
          minSize: 27,
          maxSize: 40,
          clamp: 'clamp(1.6875rem, 1.4049rem + 1.413vw, 2.5rem)',
          clampPx: 'clamp(27px, 22.4783px + 1.413vw, 40px)'
        },
        {
          label: 'l-xl',
          minSize: 36,
          maxSize: 60,
          clamp: 'clamp(2.25rem, 1.7283rem + 2.6087vw, 3.75rem)',
          clampPx: 'clamp(36px, 27.6522px + 2.6087vw, 60px)'
        },
        {
          label: 'xl-2xl',
          minSize: 54,
          maxSize: 80,
          clamp: 'clamp(3.375rem, 2.8098rem + 2.8261vw, 5rem)',
          clampPx: 'clamp(54px, 44.9565px + 2.8261vw, 80px)'
        },
        {
          label: '2xl-3xl',
          minSize: 72,
          maxSize: 120,
          clamp: 'clamp(4.5rem, 3.4565rem + 5.2174vw, 7.5rem)',
          clampPx: 'clamp(72px, 55.3043px + 5.2174vw, 120px)'
        },
        {
          label: '3xl-4xl',
          minSize: 108,
          maxSize: 160,
          clamp: 'clamp(6.75rem, 5.6196rem + 5.6522vw, 10rem)',
          clampPx: 'clamp(108px, 89.913px + 5.6522vw, 160px)'
        },
        {
          label: '4xl-5xl',
          minSize: 144,
          maxSize: 200,
          clamp: 'clamp(9rem, 7.7826rem + 6.087vw, 12.5rem)',
          clampPx: 'clamp(144px, 124.5217px + 6.087vw, 200px)'
        }
      ],
      customPairs: [
        {
          label: 's-l',
          minSize: 18,
          maxSize: 40,
          clamp: 'clamp(1.125rem, 0.6467rem + 2.3913vw, 2.5rem)',
          clampPx: 'clamp(18px, 10.3478px + 2.3913vw, 40px)'
        },
        {
          label: '2xl-4xl',
          minSize: 72,
          maxSize: 160,
          clamp: 'clamp(4.5rem, 2.587rem + 9.5652vw, 10rem)',
          clampPx: 'clamp(72px, 41.3913px + 9.5652vw, 160px)'
        }
      ]
    };
    expect(result).toStrictEqual(expected);
  });

});

describe('calculateTypeScale', () => {

  test('should generate a valid scale', () => {
    const result = calculateTypeScale({
      minWidth: 320,
      maxWidth: 1240,
      minFontSize: 18,
      maxFontSize: 20,
      minTypeScale: 1.2,
      maxTypeScale: 1.25,
      positiveSteps: 5,
      negativeSteps: 2
    });
    const expected = [
      {
        step: 5,
        label: '5',
        minFontSize: 44.7898,
        maxFontSize: 61.0352,
        wcagViolation: null,
        clamp: 'clamp(2.7994rem, 2.4462rem + 1.7658vw, 3.8147rem)'
      },
      {
        step: 4,
        label: '4',
        minFontSize: 37.3248,
        maxFontSize: 48.8281,
        wcagViolation: null,
        clamp: 'clamp(2.3328rem, 2.0827rem + 1.2504vw, 3.0518rem)'
      },
      {
        step: 3,
        label: '3',
        minFontSize: 31.104,
        maxFontSize: 39.0625,
        wcagViolation: null,
        clamp: 'clamp(1.944rem, 1.771rem + 0.8651vw, 2.4414rem)'
      },
      {
        step: 2,
        label: '2',
        minFontSize: 25.92,
        maxFontSize: 31.25,
        wcagViolation: null,
        clamp: 'clamp(1.62rem, 1.5041rem + 0.5793vw, 1.9531rem)'
      },
      {
        step: 1,
        label: '1',
        minFontSize: 21.6,
        maxFontSize: 25,
        wcagViolation: null,
        clamp: 'clamp(1.35rem, 1.2761rem + 0.3696vw, 1.5625rem)'
      },
      {
        step: 0,
        label: '0',
        minFontSize: 18,
        maxFontSize: 20,
        wcagViolation: null,
        clamp: 'clamp(1.125rem, 1.0815rem + 0.2174vw, 1.25rem)'
      },
      {
        step: -1,
        label: '-1',
        minFontSize: 15,
        maxFontSize: 16,
        wcagViolation: null,
        clamp: 'clamp(0.9375rem, 0.9158rem + 0.1087vw, 1rem)'
      },
      {
        step: -2,
        label: '-2',
        minFontSize: 12.5,
        maxFontSize: 12.8,
        wcagViolation: null,
        clamp: 'clamp(0.7813rem, 0.7747rem + 0.0326vw, 0.8rem)'
      }
    ];
    expect(result).toStrictEqual(expected);
  });

  test('should generate a scale with tailwind labels', () => {
    const result = calculateTypeScale({
      minWidth: 320,
      maxWidth: 1240,
      minFontSize: 18,
      maxFontSize: 20,
      minTypeScale: 1.2,
      maxTypeScale: 1.25,
      positiveSteps: 5,
      negativeSteps: 3,
      labelStyle: 'tailwind'
    });

    const expected = [
      {
        step: 5,
        label: '4xl',
        minFontSize: 44.7898,
        maxFontSize: 61.0352,
        wcagViolation: null,
        clamp: 'clamp(2.7994rem, 2.4462rem + 1.7658vw, 3.8147rem)'
      },
      {
        step: 4,
        label: '3xl',
        minFontSize: 37.3248,
        maxFontSize: 48.8281,
        wcagViolation: null,
        clamp: 'clamp(2.3328rem, 2.0827rem + 1.2504vw, 3.0518rem)'
      },
      {
        step: 3,
        label: '2xl',
        minFontSize: 31.104,
        maxFontSize: 39.0625,
        wcagViolation: null,
        clamp: 'clamp(1.944rem, 1.771rem + 0.8651vw, 2.4414rem)'
      },
      {
        step: 2,
        label: 'xl',
        minFontSize: 25.92,
        maxFontSize: 31.25,
        wcagViolation: null,
        clamp: 'clamp(1.62rem, 1.5041rem + 0.5793vw, 1.9531rem)'
      },
      {
        step: 1,
        label: 'lg',
        minFontSize: 21.6,
        maxFontSize: 25,
        wcagViolation: null,
        clamp: 'clamp(1.35rem, 1.2761rem + 0.3696vw, 1.5625rem)'
      },
      {
        step: 0,
        label: 'base',
        minFontSize: 18,
        maxFontSize: 20,
        wcagViolation: null,
        clamp: 'clamp(1.125rem, 1.0815rem + 0.2174vw, 1.25rem)'
      },
      {
        step: -1,
        label: 'sm',
        minFontSize: 15,
        maxFontSize: 16,
        wcagViolation: null,
        clamp: 'clamp(0.9375rem, 0.9158rem + 0.1087vw, 1rem)'
      },
      {
        step: -2,
        label: 'xs',
        minFontSize: 12.5,
        maxFontSize: 12.8,
        wcagViolation: null,
        clamp: 'clamp(0.7813rem, 0.7747rem + 0.0326vw, 0.8rem)'
      },
      {
        step: -3,
        label: '2xs',
        minFontSize: 10.4167,
        maxFontSize: 10.24,
        wcagViolation: null,
        clamp: 'clamp(0.64rem, 0.6549rem + -0.0192vw, 0.651rem)'
      }
    ];
    expect(result).toStrictEqual(expected);
  });

  test('should generate a scale with tshirt labels', () => {
    const result = calculateTypeScale({
      minWidth: 320,
      maxWidth: 1240,
      minFontSize: 18,
      maxFontSize: 20,
      minTypeScale: 1.2,
      maxTypeScale: 1.25,
      positiveSteps: 5,
      negativeSteps: 3,
      labelStyle: 'tshirt'
    });

    const expected = [
      {
        step: 5,
        label: '4xl',
        minFontSize: 44.7898,
        maxFontSize: 61.0352,
        wcagViolation: null,
        clamp: 'clamp(2.7994rem, 2.4462rem + 1.7658vw, 3.8147rem)'
      },
      {
        step: 4,
        label: '3xl',
        minFontSize: 37.3248,
        maxFontSize: 48.8281,
        wcagViolation: null,
        clamp: 'clamp(2.3328rem, 2.0827rem + 1.2504vw, 3.0518rem)'
      },
      {
        step: 3,
        label: '2xl',
        minFontSize: 31.104,
        maxFontSize: 39.0625,
        wcagViolation: null,
        clamp: 'clamp(1.944rem, 1.771rem + 0.8651vw, 2.4414rem)'
      },
      {
        step: 2,
        label: 'xl',
        minFontSize: 25.92,
        maxFontSize: 31.25,
        wcagViolation: null,
        clamp: 'clamp(1.62rem, 1.5041rem + 0.5793vw, 1.9531rem)'
      },
      {
        step: 1,
        label: 'l',
        minFontSize: 21.6,
        maxFontSize: 25,
        wcagViolation: null,
        clamp: 'clamp(1.35rem, 1.2761rem + 0.3696vw, 1.5625rem)'
      },
      {
        step: 0,
        label: 'm',
        minFontSize: 18,
        maxFontSize: 20,
        wcagViolation: null,
        clamp: 'clamp(1.125rem, 1.0815rem + 0.2174vw, 1.25rem)'
      },
      {
        step: -1,
        label: 's',
        minFontSize: 15,
        maxFontSize: 16,
        wcagViolation: null,
        clamp: 'clamp(0.9375rem, 0.9158rem + 0.1087vw, 1rem)'
      },
      {
        step: -2,
        label: 'xs',
        minFontSize: 12.5,
        maxFontSize: 12.8,
        wcagViolation: null,
        clamp: 'clamp(0.7813rem, 0.7747rem + 0.0326vw, 0.8rem)'
      },
      {
        step: -3,
        label: '2xs',
        minFontSize: 10.4167,
        maxFontSize: 10.24,
        wcagViolation: null,
        clamp: 'clamp(0.64rem, 0.6549rem + -0.0192vw, 0.651rem)'
      }
    ];
    expect(result).toStrictEqual(expected);
  });

});
