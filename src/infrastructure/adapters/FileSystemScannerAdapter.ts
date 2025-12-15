import * as fs from 'fs';
import * as path from 'path';
import glob from 'fast-glob';
import { FileScannerPort } from '../../domain/ports/FileScannerPort';
import { SourceFile, FileType } from '../../domain/entities/SourceFile';
import { LoggerPort } from '../../domain/ports/LoggerPort';
import { FileSystemError } from '../../domain/errors/DomainErrors';

/**
 * Infrastructure adapter for file system operations.
 * Implements the FileScannerPort interface using Node.js fs and fast-glob.
 */
export class FileSystemScannerAdapter implements FileScannerPort {
  private readonly supportedExtensions = ['.ts', '.html', '.json'];

  constructor(
    private readonly logger: LoggerPort,
    private readonly config: {
      excludePatterns?: string[];
      includePatterns?: string[];
      maxFileSize?: number;
    } = {}
  ) {}

  async scanProject(projectPath: string): Promise<SourceFile[]> {
    const childLogger = this.logger.child({ projectPath });

    try {
      childLogger.info('Starting project scan');

      // Validate project path
      if (!fs.existsSync(projectPath)) {
        throw new FileSystemError('scan', projectPath, new Error('Path does not exist'));
      }

      // Build glob patterns
      const patterns = this.buildGlobPatterns();
      childLogger.debug('Using glob patterns', { patterns });

      // Scan files
      const filePaths = await glob(patterns, {
        cwd: projectPath,
        absolute: true,
        ignore: this.config.excludePatterns || [
          '**/node_modules/**',
          '**/dist/**',
          '**/*.spec.ts',
          '**/*.d.ts',
          '**/.git/**'
        ]
      });

      childLogger.debug('Found files', { count: filePaths.length });

      // Convert to SourceFile entities
      const sourceFiles: SourceFile[] = [];
      for (const filePath of filePaths) {
        try {
          const sourceFile = await this.createSourceFile(filePath);
          if (sourceFile) {
            sourceFiles.push(sourceFile);
          }
        } catch (error) {
          childLogger.warn('Failed to process file', { filePath, error: (error as Error).message });
          // Continue processing other files
        }
      }

      childLogger.info('Project scan completed', {
        totalFiles: sourceFiles.length,
        fileTypes: this.countFileTypes(sourceFiles)
      });

      return sourceFiles;

    } catch (error) {
      childLogger.error('Project scan failed', error as Error);
      throw error;
    }
  }

  private buildGlobPatterns(): string[] {
    const customPatterns = this.config.includePatterns;
    if (customPatterns && customPatterns.length > 0) {
      return customPatterns;
    }

    // Default patterns for Angular projects
    return [
      '**/*.ts',
      '**/*.html',
      '**/angular.json',
      '**/*.angular-cli.json'
    ];
  }

  private async createSourceFile(filePath: string): Promise<SourceFile | null> {
    try {
      // Check file size limit
      const stats = fs.statSync(filePath);
      const maxSize = this.config.maxFileSize || 10 * 1024 * 1024; // 10MB default

      if (stats.size > maxSize) {
        this.logger.warn('Skipping large file', { filePath, size: stats.size });
        return null;
      }

      // Read file content
      const content = fs.readFileSync(filePath, 'utf-8');

      // Determine file type
      const fileType = this.determineFileType(filePath);

      return new SourceFile(filePath, content, fileType, stats.size);

    } catch (error) {
      throw new FileSystemError('read', filePath, error as Error);
    }
  }

  private determineFileType(filePath: string): FileType {
    const ext = path.extname(filePath);

    if (ext === '.html') {
      return FileType.TEMPLATE;
    }

    if (ext === '.json' && (filePath.includes('angular.json') || filePath.includes('.angular-cli.json'))) {
      return FileType.CONFIGURATION;
    }

    if (ext === '.ts') {
      return FileType.TYPE_SCRIPT;
    }

    return FileType.OTHER;
  }

  private countFileTypes(files: SourceFile[]): Record<string, number> {
    return files.reduce((counts, file) => {
      const type = file.fileType;
      counts[type] = (counts[type] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }
}