import { DependencyContainer } from '../../infrastructure/di/DependencyContainer';
import { AnalysisApplicationService } from '../../application/services/AnalysisApplicationService';
import { LoggerPort } from '../../domain/ports/LoggerPort';

/**
 * CLI Application for Angular Smells Detection.
 * Handles command-line interface and user interaction.
 */
export class AngularSmellsCli {
  private readonly analysisService: AnalysisApplicationService;
  private readonly logger: LoggerPort;

  constructor(private readonly container: DependencyContainer) {
    this.analysisService = container.analysisApplicationService;
    this.logger = container.logger;
  }

  /**
   * Main entry point for CLI execution.
   * @param args - Command line arguments
   * @returns Exit code (0 for success, 1 for failure)
   */
  async run(args: string[]): Promise<number> {
    const childLogger = this.logger.child({ args });

    try {
      childLogger.info('Starting Angular Smells CLI');

      // Check for help and version before full argument parsing
      if (args.includes('--help') || args.includes('-h')) {
        this.showHelp();
        return 0;
      }

      if (args.includes('--version') || args.includes('-v')) {
        this.showVersion();
        return 0;
      }

      const options = this.parseArguments(args);

      if (!options.projectPath) {
        this.showUsage();
        return 1;
      }

      // Execute analysis
      const result = await this.analysisService.analyzeProjectWithOptions(options.projectPath, {
        minSeverity: options.minSeverity,
        format: options.format,
        includeDetails: options.includeDetails
      });

      // Display results
      console.log(result.report);

      // Determine exit code based on critical issues
      const hasCritical = result.result.hasCriticalIssues;
      const exitCode = hasCritical ? 1 : 0;

      childLogger.info('CLI execution completed', {
        exitCode,
        totalSmells: result.result.totalSmells,
        hasCriticalIssues: hasCritical
      });

      return exitCode;

    } catch (error) {
      childLogger.error('CLI execution failed', error as Error);
      console.error('❌ Error analyzing project:', (error as Error).message);
      return 1;
    }
  }

  private parseArguments(args: string[]): CliOptions {
    const options: CliOptions = {
      projectPath: args[0]
    };

    // Simple argument parsing (could be enhanced with a proper CLI library)
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];

      switch (arg) {
        case '--help':
        case '-h':
          options.help = true;
          break;
        case '--version':
        case '-v':
          options.version = true;
          break;
        case '--min-severity':
        case '-s':
          options.minSeverity = args[++i];
          break;
        case '--format':
        case '-f':
          options.format = args[++i];
          break;
        case '--details':
          options.includeDetails = true;
          break;
        case '--no-details':
          options.includeDetails = false;
          break;
        default:
          // Assume it's the project path if not recognized
          if (!options.projectPath) {
            options.projectPath = arg;
          }
          break;
      }
    }

    return options;
  }

  private showUsage(): void {
    console.log('Usage: angular-smells <project-path> [options]');
    console.log('');
    console.log('Examples:');
    console.log('  angular-smells .');
    console.log('  angular-smells /path/to/angular/project');
    console.log('  angular-smells . --min-severity HIGH --format json');
    console.log('');
    console.log('Use --help for more information.');
  }

  private showHelp(): void {
    console.log('Angular Smells Detector');
    console.log('=======================');
    console.log('');
    console.log('Detects anti-patterns and code smells in Angular projects.');
    console.log('');
    console.log('USAGE:');
    console.log('  angular-smells <project-path> [options]');
    console.log('');
    console.log('OPTIONS:');
    console.log('  -h, --help                 Show this help message');
    console.log('  -v, --version              Show version information');
    console.log('  -s, --min-severity LEVEL   Minimum severity level to report (LOW, MEDIUM, HIGH, CRITICAL)');
    console.log('  -f, --format FORMAT        Output format (console, json)');
    console.log('  --details                  Include detailed information');
    console.log('  --no-details               Exclude detailed information');
    console.log('');
    console.log('EXAMPLES:');
    console.log('  angular-smells .');
    console.log('  angular-smells /path/to/project --min-severity HIGH');
    console.log('  angular-smells . --format json --details');
    console.log('');
    console.log('For more information, visit: https://github.com/your-repo/angular-smells');
  }

  private showVersion(): void {
    console.log('Angular Smells Detector v1.0.0');
    console.log('Built with Clean Architecture principles');
  }
}

/**
 * CLI Options interface.
 */
interface CliOptions {
  projectPath?: string;
  help?: boolean;
  version?: boolean;
  minSeverity?: string;
  format?: string;
  includeDetails?: boolean;
}