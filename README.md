# Utopia Core

The calculations behind [Utopia.fyi](https://utopia.fyi). Available in JS/TS.

## Documentation

> Note: Complete documentation to follow in the coming weeks.

### `calculateTypeScale()`

Create a fluid type scale between two widths, sizes and scales. Set the number of positive and negative steps, and whether you want the scale to be relative to the `viewport` or the `container`.

If any step in the type scale fails [WCAG SC 1.4.4](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html), the viewports where the step fails to be zoomable to 200% are returned in `wcagViolation`.

#### Schema

```ts
type UtopiaTypeConfig = {
  minWidth: number;
  maxWidth: number;
  minFontSize: number;
  maxFontSize: number;
  minTypeScale: number;
  maxTypeScale: number;
  negativeSteps?: number;
  positiveSteps?: number;
  relativeTo?: UtopiaRelativeTo;
  labelStyle?: UtopiaLabelStyle;
}

type UtopiaStep = {
  step: number;
  label: string;
  minFontSize: number;
  maxFontSize: number;
  wcagViolation: {
    from: number;
    to: number;
  } | null;
  clamp: string;
}

calculateTypeScale(config: UtopiaTypeConfig): UtopiaStep[];
```

#### Example
```ts
calculateTypeScale({
  minWidth: 320,
  maxWidth: 1240,
  minFontSize: 18,
  maxFontSize: 20,
  minTypeScale: 1.2,
  maxTypeScale: 1.25,
  positiveSteps: 5,
  negativeSteps: 2
});

// [
//  {
//    step: 5,
//    label: '5',
//    minFontSize: 44.79,
//    maxFontSize: 61.04,
//    wcagViolation: 1200,
//    clamp: 'clamp(2.7994rem, 2.4461rem + 1.7663vw, 3.815rem)',
//  }
//  ...
// ]
```

### `calculateSpaceScale()`

Create a set of fluid spaces from min/max width/base sizes, and a number of positive/negative multipliers. Fluid spaces & one-up pairs are automatically created, and custom pairs can be created by supplying the keys you wish to interpolate between. Clamp provided in `rem` and `px`.

#### Schema

```ts
type UtopiaSpaceConfig = {
  minWidth: number;
  maxWidth: number;
  minSize: number;
  maxSize: number;
  negativeSteps?: number[];
  positiveSteps?: number[];
  customSizes?: string[];
  relativeTo?: UtopiaRelativeTo;
}

type UtopiaSize = {
  label: string;
  minSize: number;
  maxSize: number;
  clamp: string;
  clampPx: string;
}

type UtopiaSpaceScale = {
  sizes: UtopiaSize[];
  oneUpPairs: UtopiaSize[];
  customPairs: UtopiaSize[];
};

calculateSpaceScale(config: UtopiaSpaceConfig): UtopiaSpaceScale;
```

#### Example

```ts
calculateSpaceScale({
  minWidth: 320,
  maxWidth: 1240,
  minSize: 18,
  maxSize: 20,
  positiveSteps: [1.5, 2, 3, 4, 6],
  negativeSteps: [0.75, 0.5, 0.25],
  customSizes: ['s-l', '2xl-4xl']
});

// {
//  sizes: [
//    {
//      label: 's',
//      minSize: 18,
//      maxSize: 20,
//      clamp: 'clamp(1.125rem, 1.0815rem + 0.2174vw, 1.25rem)',
//      clampPx: 'clamp(18px, 17.034px + 0.2174vw, 20rem)'
//    },
//    ...
//  ],
//  oneUpPairs: [...],
//  customPairs: [...],
// }
```

### `calculateClamp`

Generate a single clamp calculation from a min/max width & size. Default to using `rem` and `vi` but this can be overriden to use `px` and `cqi`.

#### Schema

```ts
type UtopiaClampConfig = {
  minWidth: number;
  maxWidth: number;
  minSize: number;
  maxSize: number;
  usePx?: boolean;
  relativeTo?: UtopiaRelativeTo;
};

calculateClamp(UtopiaClampConfig): string;
```

#### Example

```ts
calculateClamp({
  minWidth: 320,
  maxWidth: 1240,
  minSize: 16,
  maxSize: 48,
})

// clamp(...)
```


### `calculateClamps`

Generate multiple clamps from a single set of min/max widths. Supply an array of number pairs to interpolate between.

#### Schema

```ts
type UtopiaClampsConfig = {
  minWidth: number;
  maxWidth: number;
  pairs: [number, number][];
  usePx?: boolean;
  relativeTo?: UtopiaRelativeTo;
};

type UtopiaClamp = {
  label: string;
  clamp: string;
};

calculateClamps(config: UtopiaClampsConfig): UtopiaClamp[]
```

#### Example

```ts
calculateClamps({
  minWidth: 320,
  maxWidth: 1240,
  pairs: [
    [16, 48],
    [32, 40]
  ]
})

// [
//  {
//    label: '16-48',
//    clamp: 'clamp(...)',
//  },
//  ...
//]
```

