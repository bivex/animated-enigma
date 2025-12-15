import { SourceFile } from '../entities/SourceFile';

/**
 * Port interface for file system operations.
 * Defines the contract for scanning and reading project files.
 */
export interface FileScannerPort {
  /**
   * Scans a project directory and returns all relevant source files.
   * @param projectPath - Absolute path to the project root
   * @returns Promise resolving to array of source files
   */
  scanProject(projectPath: string): Promise<SourceFile[]>;
}