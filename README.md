# Utopia Core

The calculations behind [Utopia.fyi](https://utopia.fyi).

## Documentation

Complete documentation to follow.

### `calculateTypeScale`

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
}

type UtopiaStep = {
  step: number;
  minFontSize: number;
  maxFontSize: number;
  clamp: string;
}

calculateTypeScale(config: UtopiaTypeConfig): UtopiaStep[]
```

### `calculateSpaceScale`

```ts
type UtopiaSpaceConfig = {
  minWidth: number;
  maxWidth: number;
  minSize: number;
  maxSize: number;
  negativeSteps?: number[];
  positiveSteps?: number[];
  customSizes?: string[];
}

type UtopiaSize = {
  label: string;
  minSize: number;
  maxSize: number;
  clamp: string;
}

calculateSpaceScale(config: UtopiaSpaceConfig): {       
  sizes: UtopiaSize[],
  oneUpPairs: UtopiaSize[],
  customPairs: UtopiaSize[]
}
```

### `calculateClamps`

```ts
type UtopiaClampConfig = {
  minWidth: number;
  maxWidth: number;
  pairs: [number, number][];
};

type UtopiaClamp = {
  label: string;
  clamp: string;
};

calculateClamps(config: UtopiaClampConfig): UtopiaClamp[]

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
//    label: '16-48'
//    clamp: 'clamp(...)'
//  },
//  ...
//]
```

### `calculateClamp`

```ts
calculateClamp({
  minWidth: number;
  maxWidth: number;
  minSize: number;
  maxSize: number;
}): string;

calculateClamp({
  minWidth: 320,
  maxWidth: 1240,
  minSize: 16,
  maxSize: 48,
})

// clamp(...)
```
