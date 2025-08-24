/**
 * Test Dynamic Matrix Implementation
 * 
 * Demonstrates proper matrix-based rendering with dynamic dimensions
 */

import { MatrixASCIIChart } from './index';

console.log('=== Dynamic Matrix ASCII Chart Tests ===\n');

// Test 1: Single candle
console.log('Test 1: Single Bearish Candle');
console.log('-------------------------------');
const chart1 = new MatrixASCIIChart()
  .firstBearish(3, 1, 2)
  .withAxes();
console.log(chart1.toString());

console.log('\n' + '='.repeat(60) + '\n');

// Test 2: Two candles showing open = close rule
console.log('Test 2: Bearish to Bullish (Open = Close Rule)');
console.log('------------------------------------------------');
const chart2 = new MatrixASCIIChart()
  .firstBearish(3, 1, 2)
  .addBullish(2, 1, 1)
  .withAxes()
  .withAnnotations();
console.log(chart2.toString());

console.log('\n' + '='.repeat(60) + '\n');

// Test 3: Multiple candles with varying sizes
console.log('Test 3: Multiple Candles with Different Sizes');
console.log('----------------------------------------------');
const chart3 = new MatrixASCIIChart()
  .firstBullish(2, 1, 1)
  .addBearish(3, 0, 1)
  .addBullish(1, 1, 0)
  .addBearish(2, 1, 2)
  .withAxes()
  .withAnnotations();
console.log(chart3.toString());

console.log('\n' + '='.repeat(60) + '\n');

// Test 4: Match.md pattern
console.log('Test 4: Match.md Pattern');
console.log('------------------------');
const chart4 = new MatrixASCIIChart()
  .firstBearish(5, 1, 1)  // C1: Large bearish
  .addBearish(2, 0, 1)     // C2: Small bearish
  .addBullish(3, 0, 1)     // C3: Medium bullish
  .addBullish(1, 1, 0)     // C4: Tiny bullish
  .addBearish(2, 2, 1)     // C5: Small bearish
  .addBullish(3, 2, 0)     // C6: Medium bullish
  .addBullish(4, 1, 1)     // C7: Large bullish
  .withAxes()
  .withAnnotations();
console.log(chart4.toString());

console.log('\n' + '='.repeat(60) + '\n');

// Demonstrate the key features
console.log('Key Features Demonstrated:');
console.log('1. Dynamic matrix expansion based on candle sizes');
console.log('2. Proper open = close rule (each candle opens at previous close)');
console.log('3. Automatic spacing between candles');
console.log('4. Price-based positioning (not hardcoded rows)');
console.log('5. Axes added as final rendering step');
console.log('6. Labels positioned above candles');

console.log('\n' + '='.repeat(60) + '\n');

// Show the matrix concept
console.log('Matrix Concept:');
console.log('- Each row represents a price level');
console.log('- Each column represents a time position');
console.log('- Matrix expands dynamically as candles are added');
console.log('- Candles are positioned based on calculated price levels');
console.log('- Buffer space maintained above/below price extremes');