import * as fs from 'fs';
import * as path from 'path';
import glob from 'fast-glob';

export interface ScannedFile {
  path: string;
  content: string;
  type: 'component' | 'service' | 'directive' | 'template' | 'config' | 'store' | 'routing' | 'test' | 'other';
}

export class FileScanner {
  private readonly angularExtensions = [
    '.ts', '.html', '.scss', '.sass', '.less', '.css'
  ];

  async scanProject(projectPath: string): Promise<ScannedFile[]> {
    const patterns = [
      '**/*.ts',
      '**/*.html',
      '!**/node_modules/**',
      '!**/dist/**',
      '!**/*.spec.ts',
      '!**/*.d.ts'
    ];

    const filePaths = await glob(patterns, {
      cwd: projectPath,
      absolute: true
    });

    const files: ScannedFile[] = [];

    for (const filePath of filePaths) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const type = this.determineFileType(filePath);

        files.push({
          path: filePath,
          content,
          type
        });
      } catch (error) {
        console.warn(`⚠️  Could not read file: ${filePath}`);
      }
    }

    return files;
  }

  private determineFileType(filePath: string): ScannedFile['type'] {
    const ext = path.extname(filePath);
    const fileName = path.basename(filePath);

    if (ext === '.html') {
      return 'template';
    }

    if (ext === '.json') {
      if (fileName.includes('angular.json')) {
        return 'config';
      }
    }

    if (ext === '.ts') {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Check for test files
      if (fileName.includes('.spec.ts') || fileName.includes('.test.ts')) {
        return 'test';
      }

      // Check for routing files
      if (fileName.includes('routing') || fileName.includes('.routes.') ||
          content.includes('RouterModule') || content.includes('Routes =')) {
        return 'routing';
      }

      // Check for Angular decorators
      if (content.includes('@Component(')) {
        return 'component';
      }

      if (content.includes('@Injectable(')) {
        return 'service';
      }

      if (content.includes('@Directive(')) {
        return 'directive';
      }

      // Check for NgRx store files
      if (content.includes('createReducer') ||
          content.includes('createSelector') ||
          content.includes('StoreModule') ||
          fileName.includes('.reducer.') ||
          fileName.includes('.selector.') ||
          fileName.includes('.state.')) {
        return 'store';
      }
    }

    return 'other';
  }
}