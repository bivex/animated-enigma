#!/usr/bin/env node

import { DependencyContainer } from '../../infrastructure/di/DependencyContainer';
import { AngularSmellsCli } from './AngularSmellsCli';

/**
 * CLI Entry Point.
 * Bootstraps the application using clean architecture principles.
 */
async function main() {
  try {
    // Initialize dependency container
    const container = DependencyContainer.getInstance();

    // Create and run CLI application
    const cli = new AngularSmellsCli(container);
    const args = process.argv.slice(2);
    const exitCode = await cli.run(args);

    // Cleanup
    container.dispose();

    // Exit with appropriate code
    process.exit(exitCode);

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main().catch(console.error);