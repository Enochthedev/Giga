// Simple Decimal mock for basic implementation
// In a real implementation, this would use the actual decimal.js library

export class Decimal {
  private value: number;

  constructor(value: string | number) {
    this.value = typeof value === 'string' ? parseFloat(value) : value;
  }

  toNumber(): number {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }

  plus(other: Decimal): Decimal {
    return new Decimal(this.value + other.value);
  }

  minus(other: Decimal): Decimal {
    return new Decimal(this.value - other.value);
  }

  times(other: Decimal): Decimal {
    return new Decimal(this.value * other.value);
  }

  dividedBy(other: Decimal): Decimal {
    return new Decimal(this.value / other.value);
  }

  equals(other: Decimal): boolean {
    return this.value === other.value;
  }

  gt(other: Decimal): boolean {
    return this.value > other.value;
  }

  gte(other: Decimal): boolean {
    return this.value >= other.value;
  }

  lt(other: Decimal): boolean {
    return this.value < other.value;
  }

  lte(other: Decimal): boolean {
    return this.value <= other.value;
  }
}
