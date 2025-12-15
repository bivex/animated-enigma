/**
 * Entity representing a source file in the Angular project.
 * Contains the file content and metadata for analysis.
 */
export class SourceFile {
  constructor(
    private readonly _filePath: string,
    private readonly _content: string,
    private readonly _fileType: FileType,
    private readonly _size: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.filePath.trim()) {
      throw new Error('File path cannot be empty');
    }
    if (this.size < 0) {
      throw new Error('File size cannot be negative');
    }
  }

  get filePath(): string {
    return this._filePath;
  }

  get content(): string {
    return this._content;
  }

  get fileType(): FileType {
    return this._fileType;
  }

  get size(): number {
    return this._size;
  }

  get fileName(): string {
    return this.filePath.split('/').pop() || '';
  }

  get extension(): string {
    const parts = this.fileName.split('.');
    return parts.length > 1 ? parts.pop() || '' : '';
  }

  isTypeScript(): boolean {
    return this.fileType === FileType.TYPE_SCRIPT;
  }

  isTemplate(): boolean {
    return this.fileType === FileType.TEMPLATE;
  }

  isConfiguration(): boolean {
    return this.fileType === FileType.CONFIGURATION;
  }

  getLines(): string[] {
    return this.content.split('\n');
  }

  getLineCount(): number {
    return this.getLines().length;
  }

  equals(other: SourceFile): boolean {
    return this.filePath === other.filePath;
  }

  toString(): string {
    return `${this.fileType} file: ${this.filePath}`;
  }
}

/**
 * Enumeration of supported file types for analysis.
 */
export enum FileType {
  TYPE_SCRIPT = 'typescript',
  TEMPLATE = 'template',
  CONFIGURATION = 'configuration',
  OTHER = 'other'
}