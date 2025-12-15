/**
 * Value Object representing a location in source code.
 * Immutable and follows value object semantics.
 */
export class Location {
  constructor(
    private readonly _filePath: string,
    private readonly _line: number,
    private readonly _column: number
  ) {
    if (this._line < 1) {
      throw new Error('Line number must be positive');
    }
    if (this._column < 0) {
      throw new Error('Column number cannot be negative');
    }
  }

  get filePath(): string {
    return this._filePath;
  }

  get line(): number {
    return this._line;
  }

  get column(): number {
    return this._column;
  }

  toString(): string {
    return `${this._filePath}:${this._line}:${this._column}`;
  }

  equals(other: Location): boolean {
    return this._filePath === other._filePath &&
           this._line === other._line &&
           this._column === other._column;
  }

  withLine(newLine: number): Location {
    return new Location(this._filePath, newLine, this._column);
  }

  withColumn(newColumn: number): Location {
    return new Location(this._filePath, this._line, newColumn);
  }
}