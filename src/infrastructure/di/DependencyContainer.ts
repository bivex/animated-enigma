import { FileScannerPort } from '../../domain/ports/FileScannerPort';
import { SmellDetectorPort } from '../../domain/ports/SmellDetectorPort';
import { ReportGeneratorPort } from '../../domain/ports/ReportGeneratorPort';
import { ConfigurationPort } from '../../domain/ports/ConfigurationPort';
import { LoggerPort } from '../../domain/ports/LoggerPort';

import { SmellDetectionService } from '../../domain/services/SmellDetectionService';
import { ReportService } from '../../domain/services/ReportService';

import { AnalyzeProjectUseCase } from '../../application/use-cases/AnalyzeProjectUseCase';
import { AnalysisApplicationService } from '../../application/services/AnalysisApplicationService';

import { FileSystemScannerAdapter } from '../adapters/FileSystemScannerAdapter';
import { AngularSmellDetectorAdapter } from '../adapters/AngularSmellDetectorAdapter';
import { ConsoleReportGeneratorAdapter } from '../adapters/ConsoleReportGeneratorAdapter';
import { TemplateParserAdapter } from '../adapters/TemplateParserAdapter';
import { EnvironmentConfigurationAdapter } from '../config/EnvironmentConfigurationAdapter';
import { ConsoleLoggerAdapter } from '../logging/ConsoleLoggerAdapter';
import { TemplateParser } from '../../parser/TemplateParser';

/**
 * Dependency Injection Container.
 * Manages the creation and wiring of all application dependencies.
 */
export class DependencyContainer {
  private static instance: DependencyContainer;
  private services = new Map<string, any>();

  private constructor() {}

  static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  // Domain Ports
  get fileScanner(): FileScannerPort {
    return this.getOrCreate('fileScanner', () => {
      const config = this.configuration;
      const logger = this.logger;
      return new FileSystemScannerAdapter(logger, {
        excludePatterns: config.get('scanning.excludePatterns'),
        includePatterns: config.get('scanning.includePatterns'),
        maxFileSize: config.get('analysis.maxFileSize')
      });
    });
  }

  get smellDetector(): SmellDetectorPort {
    return this.getOrCreate('smellDetector', () => {
      return new AngularSmellDetectorAdapter(this.logger, this.templateParserAdapter);
    });
  }

  private get templateParserAdapter(): TemplateParserAdapter {
    return this.getOrCreate('templateParserAdapter', () => {
      return new TemplateParserAdapter(new TemplateParser());
    });
  }

  get reportGenerator(): ReportGeneratorPort {
    return this.getOrCreate('reportGenerator', () => {
      return new ConsoleReportGeneratorAdapter(this.logger);
    });
  }

  get configuration(): ConfigurationPort {
    return this.getOrCreate('configuration', () => {
      return new EnvironmentConfigurationAdapter();
    });
  }

  get logger(): LoggerPort {
    return this.getOrCreate('logger', () => {
      return new ConsoleLoggerAdapter(this.configuration);
    });
  }

  // Domain Services
  get smellDetectionService(): SmellDetectionService {
    return this.getOrCreate('smellDetectionService', () => {
      return new SmellDetectionService(
        this.smellDetector,
        this.logger
      );
    });
  }

  get reportService(): ReportService {
    return this.getOrCreate('reportService', () => {
      return new ReportService(
        this.reportGenerator,
        this.logger
      );
    });
  }

  // Application Use Cases
  get analyzeProjectUseCase(): AnalyzeProjectUseCase {
    return this.getOrCreate('analyzeProjectUseCase', () => {
      return new AnalyzeProjectUseCase(
        this.fileScanner,
        this.smellDetectionService,
        this.reportService,
        this.logger
      );
    });
  }

  // Application Services
  get analysisApplicationService(): AnalysisApplicationService {
    return this.getOrCreate('analysisApplicationService', () => {
      return new AnalysisApplicationService(
        this.analyzeProjectUseCase,
        this.configuration,
        this.logger
      );
    });
  }

  private getOrCreate<T>(key: string, factory: () => T): T {
    if (!this.services.has(key)) {
      this.services.set(key, factory());
    }
    return this.services.get(key) as T;
  }

  // Lifecycle management
  dispose(): void {
    this.services.clear();
  }

  // For testing: allow overriding services
  override<T>(key: string, service: T): void {
    this.services.set(key, service);
  }

  // For testing: reset container
  reset(): void {
    this.services.clear();
  }
}