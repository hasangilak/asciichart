/**
 * Dynamic Matrix Implementation for ASCII Charts
 * 
 * This implements a proper 2D matrix that dynamically expands based on candles added.
 * The matrix represents price levels (rows) and time positions (columns).
 */

export interface Candle {
  type: 'bullish' | 'bearish';
  bodySize: number;
  upperWick: number;
  lowerWick: number;
}

export interface PositionedCandle extends Candle {
  column: number;
  // Price levels (not matrix rows yet)
  highPrice: number;
  openPrice: number;
  closePrice: number;
  lowPrice: number;
}

export class DynamicMatrix {
  private data: string[][];
  private width: number;
  private height: number;
  private defaultWidth = 7;
  private defaultHeight = 7;
  private buffer = 1; // Empty rows above/below extremes
  
  // Price tracking
  private minPrice = Infinity;
  private maxPrice = -Infinity;
  private candles: PositionedCandle[] = [];
  
  constructor() {
    this.width = this.defaultWidth;
    this.height = this.defaultHeight;
    this.data = this.createEmptyMatrix(this.width, this.height);
  }
  
  private createEmptyMatrix(width: number, height: number): string[][] {
    const matrix: string[][] = [];
    for (let row = 0; row < height; row++) {
      matrix[row] = new Array(width).fill(' ');
    }
    return matrix;
  }
  
  /**
   * Expand matrix dimensions while preserving content
   */
  private expandMatrix(newWidth: number, newHeight: number): void {
    if (newWidth <= this.width && newHeight <= this.height) {
      return; // No expansion needed
    }
    
    const actualWidth = Math.max(this.width, newWidth);
    const actualHeight = Math.max(this.height, newHeight);
    
    // Create new larger matrix
    const newMatrix = this.createEmptyMatrix(actualWidth, actualHeight);
    
    // Copy existing content
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        if (row < this.data.length && col < this.data[row].length) {
          newMatrix[row][col] = this.data[row][col];
        }
      }
    }
    
    this.data = newMatrix;
    this.width = actualWidth;
    this.height = actualHeight;
  }
  
  /**
   * Add first candle - centered in the matrix
   */
  addFirstCandle(candle: Candle): void {
    const totalHeight = candle.bodySize + candle.upperWick + candle.lowerWick;
    const requiredHeight = totalHeight + 2 * this.buffer;
    
    // Expand if needed
    if (requiredHeight > this.height) {
      this.expandMatrix(this.width, requiredHeight);
    }
    
    // Center the candle vertically
    const centerRow = Math.floor(this.height / 2);
    const halfHeight = Math.floor(totalHeight / 2);
    
    // Calculate price levels (using relative positioning)
    const highPrice = 100 + candle.upperWick;
    const lowPrice = 100 - candle.bodySize - candle.lowerWick;
    
    let openPrice: number, closePrice: number;
    if (candle.type === 'bullish') {
      openPrice = 100 - candle.bodySize;
      closePrice = 100;
    } else {
      openPrice = 100;
      closePrice = 100 - candle.bodySize;
    }
    
    const positioned: PositionedCandle = {
      ...candle,
      column: 3, // Start at column 3 for consistent spacing
      highPrice,
      openPrice,
      closePrice,
      lowPrice
    };
    
    this.candles.push(positioned);
    this.minPrice = lowPrice;
    this.maxPrice = highPrice;
    
    // Clear and redraw all candles
    this.redrawAllCandles();
  }
  
  /**
   * Add subsequent candle following open = close rule
   */
  addCandle(candle: Candle): void {
    if (this.candles.length === 0) {
      this.addFirstCandle(candle);
      return;
    }
    
    const prevCandle = this.candles[this.candles.length - 1];
    const prevClose = prevCandle.closePrice;
    
    // Calculate new candle's price levels
    let highPrice: number, openPrice: number, closePrice: number, lowPrice: number;
    
    openPrice = prevClose; // Open = previous close
    
    // Add visual separation for same-type transitions
    const visualSeparation = 1;
    if (prevCandle.type === 'bullish' && candle.type === 'bullish') {
      // Bullish to bullish: move up by 1 for visual separation
      openPrice += visualSeparation;
    } else if (prevCandle.type === 'bearish' && candle.type === 'bearish') {
      // Bearish to bearish: move down by 1 for visual separation
      openPrice -= visualSeparation;
    }
    
    if (candle.type === 'bullish') {
      closePrice = openPrice + candle.bodySize;
      highPrice = closePrice + candle.upperWick;
      lowPrice = openPrice - candle.lowerWick;
    } else {
      closePrice = openPrice - candle.bodySize;
      highPrice = openPrice + candle.upperWick;
      lowPrice = closePrice - candle.lowerWick;
    }
    
    // Update price range
    this.minPrice = Math.min(this.minPrice, lowPrice);
    this.maxPrice = Math.max(this.maxPrice, highPrice);
    
    // Calculate required dimensions
    const priceRange = this.maxPrice - this.minPrice;
    const requiredHeight = Math.ceil(priceRange) + 2 * this.buffer;
    const requiredWidth = (this.candles.length + 1) * 6 + 3; // More space between candles
    
    // Expand matrix if needed
    if (requiredHeight > this.height || requiredWidth > this.width) {
      this.expandMatrix(requiredWidth, requiredHeight);
    }
    
    const positioned: PositionedCandle = {
      ...candle,
      column: prevCandle.column + 6, // More spacing between candles
      highPrice,
      openPrice,
      closePrice,
      lowPrice
    };
    
    this.candles.push(positioned);
    
    // Redraw all candles with new positioning
    this.redrawAllCandles();
  }
  
  /**
   * Convert price to matrix row
   */
  private priceToRow(price: number): number {
    if (this.candles.length === 0) return 0;
    
    const priceRange = this.maxPrice - this.minPrice;
    if (priceRange === 0) return Math.floor(this.height / 2);
    
    // Normalize price to 0-1 range
    const normalized = (this.maxPrice - price) / priceRange;
    
    // Scale to available height (leaving buffer)
    const availableHeight = this.height - 2 * this.buffer;
    const row = this.buffer + Math.round(normalized * availableHeight);
    
    return Math.max(this.buffer, Math.min(row, this.height - this.buffer - 1));
  }
  
  /**
   * Clear matrix and redraw all candles
   */
  private redrawAllCandles(): void {
    // Clear matrix
    this.data = this.createEmptyMatrix(this.width, this.height);
    
    // Recalculate column positions if needed
    let currentColumn = 3; // Start with some left padding
    
    // Draw each candle
    for (let i = 0; i < this.candles.length; i++) {
      const candle = this.candles[i];
      candle.column = currentColumn;
      this.drawCandle(candle);
      currentColumn += 6; // Consistent spacing between candles
    }
  }
  
  /**
   * Draw a single candle in the matrix
   */
  private drawCandle(candle: PositionedCandle): void {
    const highRow = this.priceToRow(candle.highPrice);
    const openRow = this.priceToRow(candle.openPrice);
    const closeRow = this.priceToRow(candle.closePrice);
    const lowRow = this.priceToRow(candle.lowPrice);
    
    const bodySymbol = candle.type === 'bullish' ? '█' : '░';
    const wickSymbol = '|';
    
    // Determine body rows (top to bottom in matrix)
    const bodyTopRow = Math.min(openRow, closeRow);
    const bodyBottomRow = Math.max(openRow, closeRow);
    
    // Draw upper wick
    for (let row = highRow; row < bodyTopRow; row++) {
      this.setCell(row, candle.column, wickSymbol);
    }
    
    // Draw body
    for (let row = bodyTopRow; row <= bodyBottomRow; row++) {
      // Draw 3-character wide body
      if (candle.column > 0) {
        this.setCell(row, candle.column - 1, bodySymbol);
      }
      this.setCell(row, candle.column, bodySymbol);
      if (candle.column < this.width - 1) {
        this.setCell(row, candle.column + 1, bodySymbol);
      }
    }
    
    // Draw lower wick
    for (let row = bodyBottomRow + 1; row <= lowRow; row++) {
      this.setCell(row, candle.column, wickSymbol);
    }
  }
  
  /**
   * Safely set a cell in the matrix
   */
  private setCell(row: number, col: number, char: string): void {
    if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
      this.data[row][col] = char;
    }
  }
  
  /**
   * Get the matrix data (for rendering)
   */
  getMatrix(): string[][] {
    return this.data;
  }
  
  /**
   * Get dimensions
   */
  getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }
  
  /**
   * Get candle positions (for adding labels later)
   */
  getCandlePositions(): PositionedCandle[] {
    return this.candles;
  }
  
  /**
   * Convert to string for display
   */
  toString(): string {
    return this.data
      .map(row => row.join(''))
      .join('\n');
  }
}

// Test the dynamic matrix
if (import.meta.main) {
  console.log('=== Dynamic Matrix Test ===\n');
  
  const matrix = new DynamicMatrix();
  
  // Add first candle: bearish with body=3, upper=1, lower=2
  console.log('Adding first bearish candle (body=3, upper=1, lower=2)...');
  matrix.addCandle({ type: 'bearish', bodySize: 3, upperWick: 1, lowerWick: 2 });
  console.log('Matrix after first candle:');
  console.log(matrix.toString());
  console.log(`Dimensions: ${JSON.stringify(matrix.getDimensions())}\n`);
  
  // Add second candle: bullish with body=2, upper=1, lower=1
  console.log('Adding bullish candle (body=2, upper=1, lower=1)...');
  matrix.addCandle({ type: 'bullish', bodySize: 2, upperWick: 1, lowerWick: 1 });
  console.log('Matrix after second candle:');
  console.log(matrix.toString());
  console.log(`Dimensions: ${JSON.stringify(matrix.getDimensions())}\n`);
}