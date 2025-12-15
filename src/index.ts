/**
 * Angular Smells Detector - Clean Architecture Implementation
 *
 * This module provides a comprehensive static analysis tool for detecting
 * anti-patterns and code smells in Angular applications.
 *
 * Architecture follows Clean Architecture principles with:
 * - Domain layer: Core business logic and entities
 * - Application layer: Use cases and application services
 * - Infrastructure layer: External dependencies and adapters
 * - Presentation layer: CLI interface
 */

// Domain layer exports
export * from './domain/entities/CodeSmell';
export * from './domain/entities/SourceFile';
export * from './domain/aggregates/AnalysisResult';
export * from './domain/value-objects/Severity';
export * from './domain/value-objects/Location';
export * from './domain/value-objects/Category';
export * from './domain/services/SmellDetectionService';
export * from './domain/services/ReportService';
export * from './domain/ports';

// Application layer exports
export * from './application/use-cases/AnalyzeProjectUseCase';
export * from './application/services/AnalysisApplicationService';

// Infrastructure layer exports
export * from './infrastructure/adapters';
export * from './infrastructure/config';
export * from './infrastructure/logging';
export * from './infrastructure/di';

// Presentation layer exports
export * from './presentation/cli';

// Main CLI entry point for direct execution
export { AngularSmellsCli } from './presentation/cli/AngularSmellsCli';