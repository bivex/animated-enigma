import { SourceFile } from '../entities/SourceFile';
import { CodeSmell } from '../entities/CodeSmell';

/**
 * Port interface for detecting code smells in source files.
 * Defines the contract for analyzing different types of Angular files.
 */
export interface SmellDetectorPort {
  /**
   * Analyzes a collection of source files and returns detected code smells.
   * @param files - Array of source files to analyze
   * @returns Promise resolving to array of detected code smells
   */
  analyzeFiles(files: SourceFile[]): Promise<CodeSmell[]>;
}