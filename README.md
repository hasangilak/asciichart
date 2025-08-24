# ASCII Chart Library - Dynamic Matrix Implementation

A powerful ASCII chart library for rendering candlestick charts in the terminal using a dynamic matrix-based approach.

## Core Concept

The library uses a **dynamic 2D matrix** where:
- **Rows** represent price levels (top = high price, bottom = low price)
- **Columns** represent time positions
- The matrix dynamically expands as candles are added
- Axes are added only during final rendering (not part of core matrix)

## Features

- ✅ **Dynamic Dimensions**: Starts with 7x7 default, expands automatically
- ✅ **Buffer Management**: Maintains 1 empty row above/below price extremes  
- ✅ **Open = Close Rule**: Each candle opens at previous candle's close
- ✅ **Price-Based Positioning**: Candles positioned by calculated price levels
- ✅ **Automatic Spacing**: Prevents candle overlap with consistent spacing
- ✅ **Fluent API**: Chainable methods for easy chart construction

## Usage

```typescript
import { MatrixASCIIChart } from './index';

const chart = new MatrixASCIIChart()
  .firstBearish(5, 1, 1)  // body=5, upperWick=1, lowerWick=1
  .addBullish(3, 0, 1)     // body=3, upperWick=0, lowerWick=1
  .addBearish(2, 1, 0)     // body=2, upperWick=1, lowerWick=0
  .withAxes()              // Add price/time axes
  .withAnnotations()       // Add candle labels (C1, C2, etc.)
  .toString();

console.log(chart);
```

## API

### Chart Methods

- `firstBullish(body, upperWick, lowerWick)` - Add first bullish candle
- `firstBearish(body, upperWick, lowerWick)` - Add first bearish candle
- `addBullish(body, upperWick, lowerWick)` - Add subsequent bullish candle
- `addBearish(body, upperWick, lowerWick)` - Add subsequent bearish candle
- `withAxes()` - Enable price and time axes
- `withAnnotations()` - Enable candle labels
- `toString()` - Render chart as string
- `toMarkdown()` - Render chart wrapped in markdown code block

## Architecture

### Files

- `core-matrix.ts` - Dynamic matrix implementation with expansion logic
- `index.ts` - Main chart class with axes and rendering
- `test.ts` - Comprehensive test suite

### Key Classes

- `DynamicMatrix` - Core 2D matrix that handles candle positioning and expansion
- `MatrixASCIIChart` - High-level API that uses DynamicMatrix and adds axes

## Example Output

```
 Price
   ↑ 
   |    C1
   |     |    C2
   |    ░░░    |
   |    ░░░   ███
   |    ░░░   ███
   |    ░░░   ███
   |     |     |
   |
    _____._____.___→ Time
```

## How It Works

1. **Initial State**: Matrix starts at 7x7 dimensions
2. **Add First Candle**: Centered in matrix with buffer space
3. **Add More Candles**: Each opens at previous close, may trigger expansion
4. **Dynamic Expansion**: Matrix grows to accommodate all candles
5. **Final Rendering**: Axes and labels added as overlay

## Testing

Run the test suite:

```bash
bun test.ts
```

This will show various test cases including single candles, multiple candles, and complex patterns.