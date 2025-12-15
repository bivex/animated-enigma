import * as ts from 'typescript';
import { SmellDetectorPort } from '../../domain/ports/SmellDetectorPort';
import { SourceFile, FileType } from '../../domain/entities/SourceFile';
import { CodeSmell } from '../../domain/entities/CodeSmell';
import { Location } from '../../domain/value-objects/Location';
import { Severity } from '../../domain/value-objects/Severity';
import { Category } from '../../domain/value-objects/Category';
import { LoggerPort } from '../../domain/ports/LoggerPort';
import { AnalysisError, ParsingError } from '../../domain/errors/DomainErrors';
import { TemplateParserAdapter } from './TemplateParserAdapter';

/**
 * Infrastructure adapter for Angular smell detection.
 * Implements the SmellDetectorPort using the existing AngularSmellDetector logic.
 */
export class AngularSmellDetectorAdapter implements SmellDetectorPort {
  constructor(
    private readonly logger: LoggerPort,
    private readonly templateParser: TemplateParserAdapter
  ) {}

  async analyzeFiles(files: SourceFile[]): Promise<CodeSmell[]> {
    const childLogger = this.logger.child({ fileCount: files.length });
    const allSmells: CodeSmell[] = [];

    childLogger.info('Starting file analysis');

    for (const file of files) {
      try {
        const smells = await this.analyzeFile(file);
        allSmells.push(...smells);

        if (smells.length > 0) {
          childLogger.debug('Detected smells in file', {
            file: file.fileName,
            smellCount: smells.length
          });
        }
      } catch (error) {
        childLogger.warn('Failed to analyze file', {
          file: file.fileName,
          error: (error as Error).message
        });
        // Continue with other files
      }
    }

    childLogger.info('File analysis completed', {
      totalSmells: allSmells.length,
      severityBreakdown: this.countBySeverity(allSmells)
    });

    return allSmells;
  }

  private async analyzeFile(file: SourceFile): Promise<CodeSmell[]> {
    try {
      switch (file.fileType) {
        case FileType.TYPE_SCRIPT:
          return this.analyzeTypeScriptFile(file);
        case FileType.TEMPLATE:
          return this.analyzeTemplateFile(file);
        case FileType.CONFIGURATION:
          return this.analyzeConfigurationFile(file);
        default:
          return [];
      }
    } catch (error) {
      throw new AnalysisError(file.filePath, error as Error);
    }
  }

  private analyzeTypeScriptFile(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];

    try {
      const sourceFile = ts.createSourceFile(
        file.filePath,
        file.content,
        ts.ScriptTarget.Latest,
        true
      );

      // Component analysis
      if (this.isComponentFile(file.content)) {
        smells.push(...this.detectComponentSmells(file, sourceFile));
      }

      // Service analysis
      if (this.isServiceFile(file.content)) {
        smells.push(...this.detectServiceSmells(file, sourceFile));
      }

      // Store/state analysis
      if (this.isStoreFile(file.content)) {
        smells.push(...this.detectStoreSmells(file, sourceFile));
      }

    } catch (error) {
      throw new ParsingError(file.filePath, (error as Error).message);
    }

    return smells;
  }

  private analyzeTemplateFile(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];

    try {
      // Use template parser for analysis
      const analysis = this.templateParser.parse(file.content);

      // Detect template-specific smells
      smells.push(...this.detectTemplateSmells(file, analysis));

    } catch (error) {
      throw new ParsingError(file.filePath, (error as Error).message);
    }

    return smells;
  }

  private analyzeConfigurationFile(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];

    // Configuration file analysis (angular.json, etc.)
    smells.push(...this.detectConfigurationSmells(file));

    return smells;
  }

  private isComponentFile(content: string): boolean {
    return content.includes('@Component(');
  }

  private isServiceFile(content: string): boolean {
    return content.includes('@Injectable(');
  }

  private isStoreFile(content: string): boolean {
    return content.includes('createReducer') ||
           content.includes('createSelector') ||
           content.includes('StoreModule');
  }

  private detectComponentSmells(file: SourceFile, sourceFile: ts.SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];

    // God component detection
    smells.push(...this.detectGodComponent(file));

    // Signal-related smells
    smells.push(...this.detectSignalSmells(file));

    // Subscription smells
    smells.push(...this.detectSubscriptionSmells(file));

    // Nested subscription hell detection
    smells.push(...this.detectNestedSubscriptionHell(file));

    // PHASE 2: Architecture Checks

    // Provider pollution detection
    smells.push(...this.detectProviderPollution(file));

    // Zone pollution detection
    smells.push(...this.detectZonePollution(file));

    // NEW DETECTORS

    // Control flow detectors
    smells.push(...this.detectControlFlowDeprecated(file));

    // Defer detectors
    smells.push(...this.detectDeferSmells(file));

    // Forms detectors
    smells.push(...this.detectFormsSmells(file));
    smells.push(...this.detectFormsTyped(file));
    smells.push(...this.detectFormsValueChanges(file));

    // Hydration detectors
    smells.push(...this.detectHydrationSmells(file));

    // Observable detectors
    smells.push(...this.detectObservableSmells(file));

    // NgRx detectors
    smells.push(...this.detectNgrxSmells(file));

    // OnPush misuse
    smells.push(...this.detectOnPushMisuse(file));

    // Signal write in effect
    smells.push(...this.detectSignalWriteInEffect(file));

    // Routing detectors
    smells.push(...this.detectRoutingSmells(file));

    // Signals detectors
    smells.push(...this.detectSignalsSmells(file));

    // Testing detectors
    smells.push(...this.detectTestingSmells(file));

    // TypeScript detectors
    smells.push(...this.detectTypeScriptSmells(file));

    // Smart/Dumb violation
    smells.push(...this.detectSmartDumbViolation(file));

    // Template method call detector
    smells.push(...this.detectTemplateMethodCall(file));

    // Zoneless detectors
    smells.push(...this.detectZonelessSmells(file));
    smells.push(...this.detectZonelessTimerUpdates(file));

    return smells;
  }

  private detectServiceSmells(file: SourceFile, sourceFile: ts.SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];

    // PHASE 2: Architecture Checks

    // Circular dependency detection
    smells.push(...this.detectCircularDependencies(file, sourceFile));

    return smells;
  }

  private detectStoreSmells(file: SourceFile, sourceFile: ts.SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];

    // Entity duplication detection
    smells.push(...this.detectEntityDuplication(file));

    // Broad selectors detection
    smells.push(...this.detectBroadSelectors(file));

    return smells;
  }

  private detectTemplateSmells(file: SourceFile, analysis: any): CodeSmell[] {
    const smells: CodeSmell[] = [];

    // PHASE 1: Critical Security & Performance Checks

    // 1. UNSAFE_INNER_HTML detection
    smells.push(...this.detectUnsafeInnerHtml(file, analysis));

    // 2. HYDRATION_MISMATCH detection
    smells.push(...this.detectHydrationMismatch(file, analysis));

    // 3. MISSING_TRACKBY detection
    smells.push(...this.detectMissingTrackBy(file, analysis));

    // 4. LARGE_LIST_WITHOUT_VIRTUALIZATION detection
    smells.push(...this.detectLargeListWithoutVirtualization(file, analysis));

    // 5. IMPURE_TEMPLATE_CALL detection
    smells.push(...this.detectImpureTemplateCall(file, analysis));

    return smells;
  }

  private detectConfigurationSmells(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];

    // PHASE 3: Bundle & Performance Checks

    // Bundle budget exceeded detection
    smells.push(...this.detectInitialBundleBudgetExceeded(file));

    return smells;
  }

  // Simplified detection methods (would contain the actual logic from the original detector)
  private detectGodComponent(file: SourceFile): CodeSmell[] {
    const importCount = (file.content.match(/import\s+{[^}]+}\s+from/g) || []).length;
    const loc = file.content.split('\n').length;

    if (importCount > 20 || loc > 400) {
      return [new CodeSmell(
        `god-component-${file.filePath}`,
        'GOD_STANDALONE_COMPONENT',
        importCount > 30 || loc > 500 ? Severity.CRITICAL : Severity.HIGH,
        new Location(file.filePath, 1, 1),
        `Component has ${importCount} imports and ${loc} lines - potential god component`,
        'Split into smaller, focused components',
        Category.ARCHITECTURE_DEPENDENCY_INJECTION
      )];
    }

    return [];
  }

  private detectSignalSmells(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];

    // PHASE 3: Signals & Bundle Checks

    // Signal write in effect detection
    if (file.content.includes('effect(') && file.content.includes('.set(')) {
      smells.push(new CodeSmell(
        `signal-write-effect-${file.filePath}`,
        'SIGNAL_WRITE_IN_EFFECT',
        Severity.HIGH,
        new Location(file.filePath, 1, 1),
        'Signal write detected inside effect - potential infinite loop',
        'Use computed() for derived state or untracked() for read-only access',
        Category.REACTIVITY_SIGNALS
      ));
    }

    // Untracked signal read detection
    smells.push(...this.detectUntrackedSignalRead(file));

    return smells;
  }

  private detectSubscriptionSmells(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];

    // Memory leak detection
    if (file.content.includes('.subscribe(') && !file.content.includes('unsubscribe()')) {
      smells.push(new CodeSmell(
        `memory-leak-${file.filePath}`,
        'MEMORY_LEAK_SUBSCRIPTION',
        Severity.CRITICAL,
        new Location(file.filePath, 1, 1),
        'Unassigned subscription without proper cleanup mechanism',
        'Assign to variable and unsubscribe in ngOnDestroy or use async pipe',
        Category.REACTIVITY_SIGNALS
      ));
    }

    return smells;
  }

  private detectNestedSubscriptionHell(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;
    const lines = content.split('\n');

    // Pattern to find nested subscribe calls
    const subscribeRegex = /\.subscribe\s*\(/g;
    const subscribeMatches = [];
    let match;

    // Find all subscribe calls
    while ((match = subscribeRegex.exec(content)) !== null) {
      subscribeMatches.push({
        index: match.index,
        match: match[0]
      });
    }

    // Analyze nesting levels
    for (let i = 0; i < subscribeMatches.length; i++) {
      const current = subscribeMatches[i];
      let nestingLevel = 0;
      let maxNesting = 0;

      // Look at the content after this subscribe to find nested ones
      const startIndex = current.index + current.match.length;
      let endIndex = content.length;

      // Find the end of this subscribe block (closing brace)
      let braceCount = 0;
      let inString = false;
      let stringChar = '';

      for (let j = startIndex; j < content.length; j++) {
        const char = content[j];

        // Handle strings
        if ((char === '"' || char === "'") && content[j - 1] !== '\\') {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (char === stringChar) {
            inString = false;
            stringChar = '';
          }
          continue;
        }

        if (inString) continue;

        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = j + 1;
            break;
          }
        }
      }

      const subscribeBlock = content.substring(startIndex, endIndex);

      // Count nested subscribe calls in this block
      const nestedSubscribes = (subscribeBlock.match(/\.subscribe\s*\(/g) || []).length;

      if (nestedSubscribes > 0) {
        // Find line number
        const beforeMatch = content.substring(0, current.index);
        const lineIndex = beforeMatch.split('\n').length - 1;

        const severity = nestedSubscribes >= 3 ? Severity.CRITICAL :
                        nestedSubscribes >= 2 ? Severity.HIGH : Severity.MEDIUM;

        smells.push(new CodeSmell(
          `nested-subscription-hell-${file.filePath}-${lineIndex + 1}`,
          'NESTED_SUBSCRIPTION_HELL',
          severity,
          new Location(file.filePath, lineIndex + 1, current.index - beforeMatch.lastIndexOf('\n') + 1),
          `Nested subscription hell: ${nestedSubscribes + 1} levels deep`,
          'Use RxJS operators (switchMap, forkJoin, combineLatest) and async pipe instead of nested subscriptions',
          Category.REACTIVITY_SIGNALS
        ));
      }
    }

    return smells;
  }

  private detectProviderPollution(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for services with @Injectable({providedIn: 'root'}) declared in component providers
      if (line.includes('@Injectable({providedIn: \'root\'})') ||
          line.includes("@Injectable({providedIn: \"root\"})")) {

        // Look for providers array in the same file
        const hasProvidersArray = content.includes('providers:') || content.includes('providers :');

        if (hasProvidersArray) {
          // Check if this service is used in providers array
          const serviceNameMatch = content.match(/export\s+class\s+(\w+)/);
          if (serviceNameMatch) {
            const serviceName = serviceNameMatch[1];

            // Check if service is in providers (simple heuristic)
            if (content.includes(serviceName) && content.includes('providers:')) {
              smells.push(new CodeSmell(
                `provider-pollution-${file.filePath}`,
                'PROVIDER_POLLUTION',
                Severity.CRITICAL,
                new Location(file.filePath, index + 1, 1),
                `Root-provided service '${serviceName}' declared in component providers`,
                'Remove from providers array - service is already singleton',
                Category.ARCHITECTURE_DEPENDENCY_INJECTION
              ));
            }
          }
        }
      }
    });

    return smells;
  }

  private detectCircularDependencies(file: SourceFile, sourceFile: ts.SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;

    // Extract service name
    const serviceName = this.extractServiceName(content);
    if (!serviceName) return smells;

    // Extract constructor dependencies
    const dependencies = this.extractConstructorDependencies(content);

    // Check for immediate self-injection
    if (dependencies.includes(serviceName)) {
      smells.push(new CodeSmell(
        `circular-dependency-${file.filePath}`,
        'CIRCULAR_DEPENDENCY_INJECTION',
        Severity.CRITICAL,
        new Location(file.filePath, 1, 1),
        `Service '${serviceName}' injects itself - circular dependency`,
        'Extract shared logic to separate service or use Injector for lazy injection',
        Category.ARCHITECTURE_DEPENDENCY_INJECTION
      ));
    }

    // Check for potential circular dependencies with other services
    // This is a simplified check - in production you'd need cross-file analysis
    const injectedServices = dependencies.filter(dep => dep.includes('Service'));

    for (const injectedService of injectedServices) {
      if (this.serviceLikelyDependsOn(content, injectedService, serviceName)) {
        smells.push(new CodeSmell(
          `potential-circular-${file.filePath}`,
          'CIRCULAR_DEPENDENCY_INJECTION',
          Severity.HIGH,
          new Location(file.filePath, 1, 1),
          `Potential circular dependency: ${serviceName} ↔ ${injectedService}`,
          'Review dependency chain or use lazy injection with Injector',
          Category.ARCHITECTURE_DEPENDENCY_INJECTION
        ));
      }
    }

    return smells;
  }

  private extractConstructorDependencies(content: string): string[] {
    const dependencies: string[] = [];

    // Extract constructor parameters
    const constructorMatch = content.match(/constructor\(\s*([^)]*)\)/);
    if (constructorMatch) {
      const params = constructorMatch[1];

      // Extract parameter types (simple regex)
      const paramMatches = params.match(/(?:private|public|protected)?\s+\w+:\s*(\w+)/g) || [];
      paramMatches.forEach(param => {
        const typeMatch = param.match(/(?:private|public|protected)?\s+\w+:\s*(\w+)/);
        if (typeMatch) dependencies.push(typeMatch[1]);
      });
    }

    return dependencies;
  }

  private extractServiceName(content: string): string | null {
    const classMatch = content.match(/export\s+class\s+(\w+)/);
    return classMatch ? classMatch[1] : null;
  }

  private serviceLikelyDependsOn(content: string, serviceA: string, serviceB: string): boolean {
    // Heuristic: check if serviceA methods are called on serviceB type
    const methodCallPattern = new RegExp(`${serviceB}\\.\\w+\\(`);
    return methodCallPattern.test(content);
  }

  private detectEntityDuplication(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;
    const lines = content.split('\n');

    // Look for state interfaces with potential duplication
    const interfaceMatches = content.match(/interface\s+(\w+State)\s*{([^}]*)}/g);
    if (interfaceMatches) {
      for (const interfaceMatch of interfaceMatches) {
        const interfaceName = interfaceMatch.match(/interface\s+(\w+State)/)?.[1];
        const interfaceBody = interfaceMatch.match(/interface\s+\w+State\s*{([^}]*)}/)?.[1];

        if (interfaceBody && interfaceName) {
          const properties = this.extractInterfaceProperties(interfaceBody);

          // Check for entity duplication patterns
          const entityGroups = this.groupEntityProperties(properties);

          for (const [entityName, group] of entityGroups.entries()) {
            if (group.length > 1) {
              // Check if this represents duplication
              if (this.isEntityDuplication(group)) {
                const lineIndex = lines.findIndex(line => line.includes(`interface ${interfaceName}`));
                smells.push(new CodeSmell(
                  `entity-duplication-${file.filePath}-${entityName}`,
                  'ENTITY_DUPLICATION',
                  Severity.HIGH,
                  new Location(file.filePath, lineIndex + 1, 1),
                  `Entity '${entityName}' duplicated in state: ${group.map(p => p.name).join(', ')}`,
                  'Normalize state structure or use selectors for derived data',
                  Category.ARCHITECTURE_DEPENDENCY_INJECTION
                ));
              }
            }
          }
        }
      }
    }

    return smells;
  }

  private extractInterfaceProperties(interfaceBody: string): Array<{name: string, type: string}> {
    const properties: Array<{name: string, type: string}> = [];
    const propertyRegex = /(\w+)\s*:\s*([^;]+);/g;
    let match;

    while ((match = propertyRegex.exec(interfaceBody)) !== null) {
      properties.push({
        name: match[1],
        type: match[2].trim()
      });
    }

    return properties;
  }

  private groupEntityProperties(properties: Array<{name: string, type: string}>): Map<string, Array<{name: string, type: string}>> {
    const groups = new Map<string, Array<{name: string, type: string}>>();

    for (const prop of properties) {
      // Extract potential entity names from property names/types
      const entityName = this.extractEntityName(prop);

      if (entityName) {
        if (!groups.has(entityName)) {
          groups.set(entityName, []);
        }
        groups.get(entityName)!.push(prop);
      }
    }

    return groups;
  }

  private extractEntityName(prop: {name: string, type: string}): string | null {
    // Remove common suffixes to find base entity name
    const name = prop.name.toLowerCase();
    const type = prop.type.toLowerCase();

    // Common patterns: users/User[], selectedUser/User, userIds/string[]
    if (name.includes('user') || type.includes('user')) {
      return 'user';
    }
    if (name.includes('item') || type.includes('item')) {
      return 'item';
    }
    if (name.includes('product') || type.includes('product')) {
      return 'product';
    }
    if (name.includes('order') || type.includes('order')) {
      return 'order';
    }

    // Generic entity detection
    const entityIndicators = ['list', 'array', 'entities', 'selected', 'ids', 'total', 'count'];
    if (entityIndicators.some(indicator => name.includes(indicator))) {
      // Try to extract base name
      const baseName = name.replace(/(list|array|entities|selected|ids|total|count)s?$/, '');
      if (baseName && baseName !== name) {
        return baseName;
      }
    }

    return null;
  }

  private isEntityDuplication(group: Array<{name: string, type: string}>): boolean {
    if (group.length < 2) return false;

    // Check for common duplication patterns
    const hasArray = group.some(p => p.type.includes('[]') || p.type.includes('Array<'));
    const hasSingle = group.some(p => !p.type.includes('[]') && !p.type.includes('Array<') && !p.type.includes('number'));
    const hasIds = group.some(p => p.name.toLowerCase().includes('ids') || p.name.toLowerCase().includes('id'));
    const hasCount = group.some(p => p.name.toLowerCase().includes('count') || p.name.toLowerCase().includes('total'));

    // If we have an array, a single item, and either IDs or count - likely duplication
    return hasArray && hasSingle && (hasIds || hasCount);
  }

  private detectBroadSelectors(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;
    const lines = content.split('\n');

    // Find createSelector calls
    const selectorRegex = /export\s+const\s+(\w+)\s*=\s*createSelector\s*\(/g;
    let match;

    while ((match = selectorRegex.exec(content)) !== null) {
      const selectorName = match[1];
      const selectorStart = match.index;

      // Find the end of this selector definition
      const selectorEnd = this.findSelectorEnd(content, selectorStart);
      if (selectorEnd === -1) continue;

      const selectorContent = content.substring(selectorStart, selectorEnd);

      // Analyze the selector
      const analysis = this.analyzeSelector(selectorContent, selectorName);

      if (analysis.isBroad) {
        const lineIndex = lines.findIndex((line, index) =>
          line.includes(`const ${selectorName}`) &&
          selectorStart >= content.split('\n').slice(0, index).join('\n').length
        );

        smells.push(new CodeSmell(
          `broad-selector-${file.filePath}-${selectorName}`,
          'BROAD_SELECTORS',
          analysis.severity,
          new Location(file.filePath, lineIndex + 1, 1),
          analysis.message,
          analysis.suggestion,
          Category.ARCHITECTURE_DEPENDENCY_INJECTION
        ));
      }
    }

    return smells;
  }

  private findSelectorEnd(content: string, startIndex: number): number {
    let braceCount = 0;
    let inString = false;
    let stringChar = '';

    for (let i = startIndex; i < content.length; i++) {
      const char = content[i];

      // Handle strings
      if ((char === '"' || char === "'") && content[i - 1] !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = '';
        }
        continue;
      }

      if (inString) continue;

      // Handle braces
      if (char === '(' || char === '{') {
        braceCount++;
      } else if (char === ')' || char === '}') {
        braceCount--;
        if (braceCount === 0 && char === ')') {
          return i + 1;
        }
      }
    }

    return -1;
  }

  private analyzeSelector(selectorContent: string, selectorName: string): {
    isBroad: boolean;
    severity: Severity;
    message: string;
    suggestion: string;
  } {
    // Check if selector returns entire state
    if (selectorContent.includes('(state:') && selectorContent.includes('(state) => state')) {
      return {
        isBroad: true,
        severity: Severity.CRITICAL,
        message: `Selector '${selectorName}' returns entire state object`,
        suggestion: 'Create focused selectors that return only needed data'
      };
    }

    // Check for multiple data sources (too many parameters)
    const paramMatches = selectorContent.match(/select\w+/g) || [];
    if (paramMatches.length > 3) {
      return {
        isBroad: true,
        severity: Severity.HIGH,
        message: `Selector '${selectorName}' combines ${paramMatches.length} data sources`,
        suggestion: 'Split into smaller, focused selectors'
      };
    }

    // Check for expensive computations without memoization
    const hasExpensiveOps = /\.(filter|map|reduce|forEach)\(\s*\w+\s*=>\s*\{/.test(selectorContent) ||
                           /\.(filter|map|reduce|forEach)\([^}]*\w+\.\w+/.test(selectorContent);

    if (hasExpensiveOps && paramMatches.length > 1) {
      return {
        isBroad: true,
        severity: Severity.MEDIUM,
        message: `Selector '${selectorName}' performs expensive computations across multiple data sources`,
        suggestion: 'Extract computation to separate memoized selector or use createSelector with proper memoization'
      };
    }

    // Check for returning large objects
    const returnMatch = selectorContent.match(/=>\s*({[^}]*})/);
    if (returnMatch) {
      const returnBody = returnMatch[1];
      const propertyCount = (returnBody.match(/,/g) || []).length + 1;
      if (propertyCount > 3) {
        return {
          isBroad: true,
          severity: Severity.MEDIUM,
          message: `Selector '${selectorName}' returns ${propertyCount} properties - consider splitting`,
          suggestion: 'Create separate selectors for each data requirement'
        };
      }
    }

    return {
      isBroad: false,
      severity: Severity.LOW,
      message: '',
      suggestion: ''
    };
  }

  // PHASE 1: Critical Template Security & Performance Checks

  private detectUnsafeInnerHtml(file: SourceFile, analysis: any): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for [innerHTML] bindings
      if (line.includes('[innerHTML]')) {
        // Check if sanitization is used
        const hasSanitization = this.hasHtmlSanitization(content, index);

        smells.push(new CodeSmell(
          `unsafe-inner-html-${file.filePath}-${index + 1}`,
          'UNSAFE_INNER_HTML',
          hasSanitization ? Severity.HIGH : Severity.CRITICAL,
          new Location(file.filePath, index + 1, line.indexOf('[innerHTML]') + 1),
          hasSanitization
            ? 'innerHTML binding detected - verify sanitization is adequate'
            : 'Unsafe innerHTML binding - XSS vulnerability',
          hasSanitization
            ? 'Ensure sanitization covers all attack vectors or use text interpolation'
            : 'Use Angular sanitization or avoid dynamic HTML',
          Category.TEMPLATE_RENDERING
        ));
      }
    });

    return smells;
  }

  private hasHtmlSanitization(content: string, lineIndex: number): boolean {
    // Check for Angular's built-in sanitizers or custom sanitization
    const sanitizationPatterns = [
      /DomSanitizer\.sanitize/,
      /DomSanitizer\.bypassSecurityTrustHtml/,
      /sanitizeHtml/,
      /Sanitizer\./,
      /bypassSecurityTrustHtml/
    ];

    // Look in a reasonable range around the innerHTML usage
    const startLine = Math.max(0, lineIndex - 10);
    const endLine = Math.min(content.split('\n').length, lineIndex + 10);
    const context = content.split('\n').slice(startLine, endLine).join('\n');

    return sanitizationPatterns.some(pattern => pattern.test(context));
  }

  private detectHydrationMismatch(file: SourceFile, analysis: any): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;

    // Check for nested anchor tags (HTML structure issues)
    if (this.hasNestedAnchors(content)) {
      smells.push(new CodeSmell(
        `nested-anchors-${file.filePath}`,
        'HYDRATION_MISMATCH',
        Severity.CRITICAL,
        new Location(file.filePath, 1, 1),
        'Nested anchor tags detected - hydration mismatch risk',
        'Fix HTML structure to be valid',
        Category.TEMPLATE_RENDERING
      ));
    }

    // Check for dynamic/random data that causes SSR/CSR mismatches
    if (this.hasDynamicData(content)) {
      smells.push(new CodeSmell(
        `dynamic-data-${file.filePath}`,
        'HYDRATION_MISMATCH',
        Severity.HIGH,
        new Location(file.filePath, 1, 1),
        'Dynamic/random data in template - SSR hydration mismatch',
        'Use static data or handle differences in component logic',
        Category.TEMPLATE_RENDERING
      ));
    }

    return smells;
  }

  private hasNestedAnchors(content: string): boolean {
    // Normalize HTML by removing extra whitespace
    const normalized = content.replace(/\s+/g, ' ').replace(/>\s+</g, '><');

    let anchorDepth = 0;
    let nestedFound = false;

    // Simple HTML parser to detect nested anchors
    const tagRegex = /<\/?a[^>]*>/gi;
    let match;

    while ((match = tagRegex.exec(normalized)) !== null) {
      const tag = match[0].trim();
      if (tag.startsWith('<a') && !tag.includes('</a>')) {
        // Opening anchor tag
        anchorDepth++;
        if (anchorDepth > 1) {
          nestedFound = true;
          break;
        }
      } else if (tag.startsWith('</a')) {
        // Closing anchor tag
        anchorDepth--;
      }
    }

    return nestedFound;
  }

  private hasDynamicData(content: string): boolean {
    // Check for functions that return different values on each call
    const dynamicPatterns = [
      /Math\.random\(\)/,
      /Date\.now\(\)/,
      /new Date\(\)/,
      /performance\.now\(\)/,
      /crypto\.getRandomValues/,
      /Math\.floor\(Math\.random/,
      /\w+\.random\(\)/, // Custom random functions
      /\w+\.now\(\)/     // Custom timestamp functions
    ];

    return dynamicPatterns.some(pattern => pattern.test(content));
  }

  private detectMissingTrackBy(file: SourceFile, analysis: any): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for *ngFor without trackBy
      if (line.includes('*ngFor') && !line.includes('trackBy')) {
        // Extract the ngFor expression to understand the data
        const ngForMatch = line.match(/\*ngFor\s*=\s*["']([^"']+)["']/);
        if (ngForMatch) {
          const ngForExpression = ngForMatch[1];

          // Check if this is a large collection that needs trackBy
          const componentFile = file.filePath.replace('.html', '.ts');
          const shouldRequireTrackBy = this.shouldRequireTrackBy(componentFile, ngForExpression);

          if (shouldRequireTrackBy) {
            smells.push(new CodeSmell(
              `missing-trackby-${file.filePath}-${index + 1}`,
              'MISSING_TRACKBY',
              Severity.HIGH,
              new Location(file.filePath, index + 1, line.indexOf('*ngFor') + 1),
              `*ngFor without trackBy function - performance issue with list updates`,
              'Add trackBy function: *ngFor="let item of items; trackBy: trackByFn"',
              Category.TEMPLATE_RENDERING
            ));
          }
        }
      }
    });

    return smells;
  }

  private shouldRequireTrackBy(componentFile: string, ngForExpression: string): boolean {
    try {
      // Try to read the component file to analyze the data
      const fs = require('fs');
      if (fs.existsSync(componentFile)) {
        const componentContent = fs.readFileSync(componentFile, 'utf-8');

        // Extract the collection variable name
        const collectionMatch = ngForExpression.match(/let\s+\w+\s+of\s+([^;\s]+)/);
        if (collectionMatch) {
          const collectionName = collectionMatch[1].trim();

          // Check for patterns that indicate large or dynamic data
          const largeDataPatterns = [
            // Array size indicators
            new RegExp(`${collectionName}\.length\\s*>\\s*\\d+`),
            new RegExp(`Array\\((\\d+)\\)`),
            new RegExp(`new Array\\((\\d+)\\)`),

            // API data patterns
            /\w+(Data|List|Items|Collection|Results)/i,

            // Observable patterns (RxJS)
            /\w+\$/,

            // HttpClient patterns
            /\.get\(|httpClient\.|\.subscribe\(/
          ];

          return largeDataPatterns.some(pattern =>
            pattern.test(componentContent) &&
            componentContent.includes(collectionName)
          );
        }
      }
    } catch (error) {
      // If we can't read the component file, be conservative
      this.logger.debug('Could not analyze component file for trackBy decision', { componentFile });
    }

    return false; // Default to not requiring trackBy if analysis fails
  }

  private detectLargeListWithoutVirtualization(file: SourceFile, analysis: any): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('*ngFor') && !content.includes('cdk-virtual-scroll')) {
        // Extract the ngFor expression
        const ngForMatch = line.match(/\*ngFor\s*=\s*["']([^"']+)["']/);
        if (ngForMatch) {
          const ngForExpression = ngForMatch[1];

          // Check for large data patterns
          const componentFile = file.filePath.replace('.html', '.ts');
          const listSize = this.estimateListSize(componentFile, ngForExpression);

          if (listSize > 0) {
            const severity = listSize > 1000 ? Severity.CRITICAL :
                           listSize > 500 ? Severity.HIGH : Severity.MEDIUM;

            smells.push(new CodeSmell(
              `large-list-${file.filePath}-${index + 1}`,
              'LARGE_LIST_WITHOUT_VIRTUALIZATION',
              severity,
              new Location(file.filePath, index + 1, line.indexOf('*ngFor') + 1),
              `Large list (${listSize} items) without virtualization`,
              'Use @angular/cdk/scrolling VirtualScrollViewport for better performance',
              Category.TEMPLATE_RENDERING
            ));
          }
        }
      }
    });

    return smells;
  }

  private estimateListSize(componentFile: string, ngForExpression: string): number {
    try {
      const fs = require('fs');
      if (fs.existsSync(componentFile)) {
        const componentContent = fs.readFileSync(componentFile, 'utf-8');

        // Extract collection variable name
        const collectionMatch = ngForExpression.match(/let\s+\w+\s+of\s+([^;\s]+)/);
        if (collectionMatch) {
          const collectionName = collectionMatch[1].trim();

          // Look for explicit array sizes
          const arraySizePatterns = [
            new RegExp(`${collectionName}\\s*=\\s*Array\\((\\d+)\\)`),
            new RegExp(`${collectionName}\\s*=\\s*new Array\\((\\d+)\\)`),
            new RegExp(`Array\\((\\d+)\\).*${collectionName}`),
            new RegExp(`${collectionName}\\.length\\s*>\\s*(\\d+)`),
            new RegExp(`${collectionName}\\.length\\s*===\\s*(\\d+)`)
          ];

          for (const pattern of arraySizePatterns) {
            const match = componentContent.match(pattern);
            if (match && match[1]) {
              const size = parseInt(match[1]);
              if (size > 50) return size; // Only consider large lists
            }
          }

          // Check for API data patterns that suggest large datasets
          if (/\w+(Data|List|Items|Collection|Results)/i.test(collectionName)) {
            return 100; // Assume potentially large dataset
          }

          // Check for Observable patterns
          if (componentContent.includes(`${collectionName}$`) ||
              componentContent.includes(`httpClient.`) ||
              componentContent.includes(`.subscribe(`)) {
            return 200; // Assume dynamic data that could be large
          }
        }
      }
    } catch (error) {
      this.logger.debug('Could not estimate list size', { componentFile, error: (error as Error).message });
    }

    return 0; // Unknown size
  }

  private detectImpureTemplateCall(file: SourceFile, analysis: any): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;
    const lines = content.split('\n');

    // Pattern to match function calls in templates: {{ functionName(...) }}
    const functionCallRegex = /\{\{\s*(\w+)\s*\([^)]*\)\s*\}\}/g;
    let match;

    while ((match = functionCallRegex.exec(content)) !== null) {
      const functionName = match[1];
      const fullMatch = match[0];

      // Skip Angular built-in functions
      if (this.isAngularBuiltInFunction(functionName)) {
        continue;
      }

      // Find line number
      const beforeMatch = content.substring(0, match.index);
      const lineIndex = beforeMatch.split('\n').length - 1;

      // Check if this is in a loop (more problematic)
      const contextStart = Math.max(0, match.index - 200);
      const contextEnd = Math.min(content.length, match.index + 200);
      const context = content.substring(contextStart, contextEnd);
      const isInLoop = context.includes('*ngFor');

      smells.push(new CodeSmell(
        `impure-template-call-${file.filePath}-${lineIndex + 1}`,
        'IMPURE_TEMPLATE_CALL',
        isInLoop ? Severity.CRITICAL : Severity.HIGH,
        new Location(file.filePath, lineIndex + 1, content.substring(0, match.index).length - beforeMatch.lastIndexOf('\n') + 1),
        `Function call '${fullMatch}' in template ${isInLoop ? '(inside *ngFor)' : ''}`,
        'Replace with signals, computed values, or pre-computed properties',
        Category.TEMPLATE_RENDERING
      ));
    }

    return smells;
  }

  private isAngularBuiltInFunction(functionName: string): boolean {
    const angularBuiltIns = [
      'async', 'json', 'keyvalue', 'date', 'currency', 'decimal', 'percent',
      'slice', 'lowercase', 'uppercase', 'titlecase', 'i18nPlural', 'i18nSelect'
    ];
    return angularBuiltIns.includes(functionName);
  }

  // PHASE 3: Advanced Signals & Bundle Checks

  private detectUntrackedSignalRead(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;
    const lines = content.split('\n');

    let inEffect = false;
    let effectStartLine = 0;

    lines.forEach((line, index) => {
      if (line.includes('effect(') || line.includes('effect(()')) {
        inEffect = true;
        effectStartLine = index + 1;
      }

      if (inEffect) {
        // Look for signal reads that might be intended as read-only
        const signalReadRegex = /(\w+)\(\)/g;
        const matches = line.match(signalReadRegex);

        if (matches) {
          // Check if this signal read is wrapped in untracked()
          const hasUntracked = line.includes('untracked(') ||
                              content.substring(0, lines.slice(0, index).join('\n').length)
                                .includes('untracked(()');

          if (!hasUntracked) {
            // Check if this looks like a read-only access pattern
            const readOnlyPatterns = [
              'console.log', 'return', 'if (', 'else if (', '&&', '||', '===', '!==', '<', '>', '<=', '>=',
              'template', 'styles', 'encapsulation', 'changeDetection'
            ];

            const isReadOnly = readOnlyPatterns.some(pattern => line.includes(pattern)) ||
                              line.trim().startsWith('//') ||
                              line.trim().startsWith('/*');

            if (isReadOnly && matches.some(match => !this.isAngularBuiltIn(match.replace('()', '')))) {
              smells.push(new CodeSmell(
                `untracked-signal-read-${file.filePath}-${index + 1}`,
                'UNTRACKED_SIGNAL_READ',
                Severity.HIGH,
                new Location(file.filePath, index + 1, line.indexOf(matches[0]) + 1),
                'Signal read inside effect may create unintended dependency',
                'Wrap in untracked(() => signal()) if read-only access is intended',
                Category.REACTIVITY_SIGNALS
              ));
            }
          }
        }
      }

      if (line.includes('});') && inEffect && line.includes('effect')) {
        inEffect = false;
      }
    });

    return smells;
  }

  private isAngularBuiltIn(identifier: string): boolean {
    const angularBuiltIns = [
      'async', 'json', 'trackBy', 'index', 'count', 'first', 'last', 'even', 'odd'
    ];
    return angularBuiltIns.includes(identifier);
  }

  private detectZonePollution(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;
    const lines = content.split('\n');

    // Libraries known to trigger zone pollution
    const zonePollutingLibraries = [
      'chart.js', 'charts', 'three', 'three.js', '@types/three',
      'leaflet', 'd3', 'animejs', 'gsap', 'tween', 'pixi', 'pixi.js',
      'fabric', 'fabric.js', 'paper', 'paper.js', 'raphael', 'raphael.js'
    ];

    // Check for imports of zone-polluting libraries
    const hasPollutingImports = zonePollutingLibraries.some(lib =>
      content.includes(`'${lib}'`) || content.includes(`"${lib}"`)
    );

    if (hasPollutingImports) {
      // Check if runOutsideAngular is used
      const hasRunOutsideAngular = content.includes('runOutsideAngular') ||
                                  content.includes('NgZone') && content.includes('runOutsideAngular');

      // Check for timer/animation frame usage without zone handling
      const timerMethods = [
        'setInterval', 'setTimeout', 'requestAnimationFrame',
        'requestIdleCallback', 'setImmediate'
      ];

      const hasTimerUsage = timerMethods.some(method => content.includes(method));

      if (!hasRunOutsideAngular && hasTimerUsage) {
        lines.forEach((line, index) => {
          if (timerMethods.some(method => line.includes(method))) {
            smells.push(new CodeSmell(
              `zone-pollution-${file.filePath}-${index + 1}`,
              'ZONE_POLLUTION',
              Severity.HIGH,
              new Location(file.filePath, index + 1, line.indexOf(timerMethods.find(m => line.includes(m))!) + 1),
              'Timer/animation method used with zone-polluting library without runOutsideAngular',
              'Wrap in NgZone.runOutsideAngular(() => { ... }) to prevent global change detection',
              Category.PERFORMANCE_BUNDLE_METRICS
            ));
          }
        });
      }

      // Check for direct DOM manipulation that could trigger zone
      const domMethods = ['getElementById', 'querySelector', 'addEventListener'];
      const hasDirectDom = domMethods.some(method => content.includes(method));

      if (hasDirectDom && !hasRunOutsideAngular) {
        smells.push(new CodeSmell(
          `zone-pollution-dom-${file.filePath}`,
          'ZONE_POLLUTION',
          Severity.MEDIUM,
          new Location(file.filePath, 1, 1),
          'Direct DOM manipulation with zone-polluting library detected',
          'Use Angular Renderer2 or wrap DOM operations in runOutsideAngular',
          Category.PERFORMANCE_BUNDLE_METRICS
        ));
      }
    }

    return smells;
  }

  private detectInitialBundleBudgetExceeded(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;

    if (file.filePath.includes('angular.json')) {
      // Check for bundle budget configurations
      const budgetMatch = content.match(/"budgets"\s*:\s*\[([^\]]*)\]/);
      if (budgetMatch) {
        const budgetConfig = budgetMatch[1];
        const sizeMatch = budgetConfig.match(/"maximumError"\s*:\s*"(\d+)([kmg])/i);

        if (sizeMatch) {
          const size = parseInt(sizeMatch[1]);
          const unit = sizeMatch[2].toLowerCase();
          let sizeInBytes = size;

          switch (unit) {
            case 'k': sizeInBytes = size * 1024; break;
            case 'm': sizeInBytes = size * 1024 * 1024; break;
            case 'g': sizeInBytes = size * 1024 * 1024 * 1024; break;
          }

          if (sizeInBytes < 500 * 1024) { // Less than 500KB warning threshold
            smells.push(new CodeSmell(
              `bundle-budget-${file.filePath}`,
              'INITIAL_BUNDLE_BUDGET_EXCEEDED',
              Severity.HIGH,
              new Location(file.filePath, 1, 1),
              `Bundle budget too restrictive: ${size}${unit.toUpperCase()} - may cause build failures`,
              'Increase bundle budget or implement lazy loading and code splitting',
              Category.PERFORMANCE_BUNDLE_METRICS
            ));
          }
        }
      }
    }

    // Check for common bundle-bloating patterns in source files
    if (file.fileType === 'typescript') {
      const importMatches = content.match(/import\s+.*from\s+['"][^'"]*['"]/g) || [];
      const heavyLibraries = [
        'lodash', 'moment', 'jquery', 'rxjs', 'three', 'chart.js', 'leaflet',
        '@angular/material', '@angular/cdk', '@ngrx/store', '@ngrx/effects'
      ];

      const heavyImports = importMatches.filter(imp =>
        heavyLibraries.some(lib => imp.includes(lib))
      );

      if (heavyImports.length > 3) {
        smells.push(new CodeSmell(
          `bundle-bloat-${file.filePath}`,
          'INITIAL_BUNDLE_BUDGET_EXCEEDED',
          Severity.MEDIUM,
          new Location(file.filePath, 1, 1),
          `Multiple heavy library imports (${heavyImports.length}) - potential bundle bloat`,
          'Implement lazy loading or tree-shaking for unused imports',
          Category.PERFORMANCE_BUNDLE_METRICS
        ));
      }

      // Check for missing lazy loading patterns
      if (file.filePath.includes('routing') || file.filePath.includes('routes')) {
        const loadChildrenMatch = content.match(/loadChildren\s*:/g);
        const staticImports = content.match(/import\s*\(\s*['"][^'"]*['"]\s*\)/g);

        if (!loadChildrenMatch && !staticImports && content.includes('Routes')) {
          smells.push(new CodeSmell(
            `missing-lazy-loading-${file.filePath}`,
            'INITIAL_BUNDLE_BUDGET_EXCEEDED',
            Severity.HIGH,
            new Location(file.filePath, 1, 1),
            'Routes without lazy loading detected',
            'Use loadChildren with dynamic imports for route lazy loading',
            Category.PERFORMANCE_BUNDLE_METRICS
          ));
        }
      }
    }

    return smells;
  }

  // === NEW DETECTOR IMPLEMENTATIONS ===

  private detectControlFlowDeprecated(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;
    const lines = content.split('\n');

    const deprecatedDirectives = ['*ngIf', '*ngFor', '*ngSwitch', '*ngSwitchCase', '*ngSwitchDefault'];

    lines.forEach((line, index) => {
      deprecatedDirectives.forEach(directive => {
        if (line.includes(directive)) {
          smells.push(new CodeSmell(
            `control-flow-deprecated-${file.filePath}-${index}`,
            'CONTROL_FLOW_DEPRECATED',
            Severity.MEDIUM,
            new Location(file.filePath, index + 1, line.indexOf(directive) + 1),
            `Deprecated structural directive '${directive}' detected`,
            'Migrate to modern @if, @for, @switch control flow',
            Category.TEMPLATE_RENDERING
          ));
        }
      });
    });

    return smells;
  }

  private detectDeferSmells(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('@defer')) {
        // Check for defer without error block
        let hasErrorBlock = false;
        for (let i = index; i < Math.min(index + 20, lines.length); i++) {
          if (lines[i].includes('@error')) {
            hasErrorBlock = true;
            break;
          }
        }

        if (!hasErrorBlock) {
          smells.push(new CodeSmell(
            `defer-error-${file.filePath}-${index}`,
            'DEFER_ERROR_BLOCKS',
            Severity.MEDIUM,
            new Location(file.filePath, index + 1, line.indexOf('@defer') + 1),
            '@defer without @error block - no error handling',
            'Add @error block to handle deferred loading failures',
            Category.TEMPLATE_RENDERING
          ));
        }

        // Check for defer above the fold
        const criticalPatterns = ['<header', '<nav', 'hero', 'banner'];
        if (criticalPatterns.some(pattern => content.includes(pattern))) {
          smells.push(new CodeSmell(
            `defer-above-fold-${file.filePath}-${index}`,
            'DEFER_ABOVE_FOLD',
            Severity.HIGH,
            new Location(file.filePath, index + 1, line.indexOf('@defer') + 1),
            '@defer used on potential above-the-fold content',
            'Only defer below-the-fold content',
            Category.PERFORMANCE_BUNDLE_METRICS
          ));
        }
      }
    });

    // Check for defer in non-standalone component
    if (content.includes('@defer') && content.includes('standalone: false')) {
      smells.push(new CodeSmell(
        `defer-non-standalone-${file.filePath}`,
        'DEFER_NON_STANDALONE',
        Severity.HIGH,
        new Location(file.filePath, 1, 1),
        '@defer used in non-standalone component',
        'Convert to standalone component or avoid @defer',
        Category.ARCHITECTURE_DEPENDENCY_INJECTION
      ));
    }

    return smells;
  }

  private detectFormsSmells(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;

    const hasNgModel = content.includes('[(ngModel)]') || content.includes('ngModel');
    const hasFormControl = content.includes('[formControl]') || content.includes('formControlName');

    if (hasNgModel && hasFormControl) {
      smells.push(new CodeSmell(
        `forms-mixed-${file.filePath}`,
        'FORMS_MIXED',
        Severity.CRITICAL,
        new Location(file.filePath, 1, 1),
        'Mixing template-driven and reactive forms',
        'Choose one approach: either template-driven (ngModel) or reactive (formControl)',
        Category.FORMS_VALIDATION
      ));
    }

    return smells;
  }

  private detectOnPushMisuse(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;
    const lines = content.split('\n');

    const hasOnPush = content.includes('ChangeDetectionStrategy.OnPush');

    if (hasOnPush) {
      lines.forEach((line, index) => {
        if (line.includes('this.') && line.includes('.push(')) {
          smells.push(new CodeSmell(
            `onpush-misuse-${file.filePath}-${index}`,
            'ONPUSH_MISUSE',
            Severity.HIGH,
            new Location(file.filePath, index + 1, line.indexOf('.push(') + 1),
            'Array mutation in OnPush component',
            'Create new array reference for change detection',
            Category.PERFORMANCE_BUNDLE_METRICS
          ));
        }
      });
    }

    return smells;
  }

  private detectTypeScriptSmells(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes(': any') || line.includes('<any>') || line.includes('as any')) {
        smells.push(new CodeSmell(
          `typescript-any-${file.filePath}-${index}`,
          'TYPESCRIPT_ANY',
          Severity.MEDIUM,
          new Location(file.filePath, index + 1, line.indexOf('any') + 1),
          'Usage of any type defeats type safety',
          'Define proper type or use unknown',
          Category.TYPESCRIPT
        ));
      }

      if (line.includes('!.') || line.includes('!)')) {
        smells.push(new CodeSmell(
          `typescript-non-null-${file.filePath}-${index}`,
          'TYPESCRIPT_NON_NULL',
          Severity.MEDIUM,
          new Location(file.filePath, index + 1, line.indexOf('!') + 1),
          'Non-null assertion operator used',
          'Add proper null checks or optional chaining',
          Category.TYPESCRIPT
        ));
      }
    });

    return smells;
  }

  private detectSmartDumbViolation(file: SourceFile): CodeSmell[] {
    const smells: CodeSmell[] = [];
    const content = file.content;

    const hasStoreOrService = content.includes('inject(Store)') ||
                              (content.includes('constructor(') && content.includes('Service'));
    const hasInputs = content.includes('@Input()');
    const hasOutputs = content.includes('@Output()');

    if (hasStoreOrService && hasInputs && hasOutputs) {
      smells.push(new CodeSmell(
        `smart-dumb-violation-${file.filePath}`,
        'SMART_DUMB_VIOLATION',
        Severity.MEDIUM,
        new Location(file.filePath, 1, 1),
        'Component has both data access and presentation',
        'Split into smart (container) and dumb (presentational) components',
        Category.ARCHITECTURE_DEPENDENCY_INJECTION
      ));
    }

    return smells;
  }

    private detectZonelessSmells(file: SourceFile): CodeSmell[] {
      const smells: CodeSmell[] = [];
      const content = file.content;

      if (content.includes('provideExperimentalZonelessChangeDetection()')) {
        if (content.includes('NgZone.onStable')) {
          smells.push(new CodeSmell(
            `zoneless-ngzone-${file.filePath}`,
            'ZONLESS_NGZONE_STABLE',
            Severity.HIGH,
            new Location(file.filePath, 1, 1),
            'Using NgZone in zoneless app',
            'Remove NgZone usage in zoneless mode',
            Category.PERFORMANCE_BUNDLE_METRICS
          ));
        }

        if (content.includes('.subscribe(')) {
          smells.push(new CodeSmell(
            `zoneless-subscription-${file.filePath}`,
            'ZONLESS_OBSERVABLE_SUBSCRIPTIONS',
            Severity.MEDIUM,
            new Location(file.filePath, 1, 1),
            'Observable subscription in zoneless app',
            'Use async pipe or signals instead',
            Category.PERFORMANCE_BUNDLE_METRICS
          ));
        }
      }

      return smells;
    }

    private detectZonelessTimerUpdates(file: SourceFile): CodeSmell[] {
      const smells: CodeSmell[] = [];
      const content = file.content;
      const lines = content.split('\n');

      if (content.includes('provideExperimentalZonelessChangeDetection()')) {
        lines.forEach((line, index) => {
          if (line.includes('setInterval') || line.includes('setTimeout')) {
            smells.push(new CodeSmell(
              `zoneless-timer-${file.filePath}-${index}`,
              'ZONLESS_TIMER_UPDATES',
              Severity.HIGH,
              new Location(file.filePath, index + 1, line.indexOf('setInterval') !== -1 ? line.indexOf('setInterval') + 1 : line.indexOf('setTimeout') + 1),
              'Timer without change detection in zoneless app',
              'Call ChangeDetectorRef.markForCheck() after timer',
              Category.PERFORMANCE_BUNDLE_METRICS
            ));
          }
        });
      }

      return smells;
    }

    private detectSignalWriteInEffect(file: SourceFile): CodeSmell[] {
      const smells: CodeSmell[] = [];
      const content = file.content;
      const lines = content.split('\n');

      let inEffect = false;
      lines.forEach((line, index) => {
        if (line.includes('effect(') || line.includes('effect(()')) {
          inEffect = true;
        }

        if (inEffect && (line.includes('.set(') || line.includes('.update('))) {
          smells.push(new CodeSmell(
            `signal-write-in-effect-${file.filePath}-${index}`,
            'SIGNAL_WRITE_IN_EFFECT',
            Severity.HIGH,
            new Location(file.filePath, index + 1, line.indexOf('.set(') !== -1 ? line.indexOf('.set(') + 1 : line.indexOf('.update(') + 1),
            'Signal write detected inside effect - potential infinite loop',
            'Use computed() for derived state or untracked() for read-only access',
            Category.REACTIVITY_SIGNALS
          ));
        }

        if (line.includes('});') && inEffect) {
          inEffect = false;
        }
      });

      return smells;
    }

    private detectFormsTyped(file: SourceFile): CodeSmell[] {
      const smells: CodeSmell[] = [];
      const content = file.content;
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        if (line.includes('FormControl(') && !line.includes('<') && !line.includes('any')) {
          // Check if FormControl is untyped
          const formControlMatch = line.match(/new FormControl\(([^)]*)\)/);
          if (formControlMatch && !formControlMatch[1].includes('<')) {
            smells.push(new CodeSmell(
              `forms-typed-${file.filePath}-${index}`,
              'FORMS_TYPED',
              Severity.MEDIUM,
              new Location(file.filePath, index + 1, line.indexOf('FormControl') + 1),
              'Untyped FormControl usage',
              'Use typed FormControl<T> instead',
              Category.FORMS_VALIDATION
            ));
          }
        }
      });

      return smells;
    }

    private detectFormsValueChanges(file: SourceFile): CodeSmell[] {
      const smells: CodeSmell[] = [];
      const content = file.content;
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        if (line.includes('.valueChanges.subscribe(') && !content.includes('takeUntil') && !content.includes('take(1)')) {
          smells.push(new CodeSmell(
            `forms-value-changes-${file.filePath}-${index}`,
            'FORMS_VALUE_CHANGES',
            Severity.MEDIUM,
            new Location(file.filePath, index + 1, line.indexOf('.valueChanges') + 1),
            'Form valueChanges subscription without proper cleanup',
            'Add takeUntil or take(1) operator',
            Category.FORMS_VALIDATION
          ));
        }
      });

      return smells;
    }

    private detectHydrationSmells(file: SourceFile): CodeSmell[] {
      const smells: CodeSmell[] = [];
      const content = file.content;
      const lines = content.split('\n');

      // Check for invalid HTML in hydration
      lines.forEach((line, index) => {
        if (content.includes('provideClientHydration()') || content.includes('withIncrementalHydration()')) {
          // Check for DOM manipulation that can cause hydration mismatches
          if (line.includes('document.') && (line.includes('.innerHTML') || line.includes('.appendChild'))) {
            smells.push(new CodeSmell(
              `hydration-invalid-html-${file.filePath}-${index}`,
              'HYDRATION_INVALID_HTML',
              Severity.HIGH,
              new Location(file.filePath, index + 1, line.indexOf('document.') + 1),
              'DOM manipulation during hydration',
              'Avoid direct DOM manipulation in hydrated components',
              Category.TEMPLATE_RENDERING
            ));
          }

          // Check for missing event replay
          if (line.includes('@HostListener') && !content.includes('withEventReplay()')) {
            smells.push(new CodeSmell(
              `hydration-event-replay-${file.filePath}-${index}`,
              'HYDRATION_MISSING_EVENT_REPLAY',
              Severity.MEDIUM,
              new Location(file.filePath, index + 1, line.indexOf('@HostListener') + 1),
              'HostListener without event replay configuration',
              'Add withEventReplay() to hydration config',
              Category.TEMPLATE_RENDERING
            ));
          }

          // Check for incremental hydration trigger
          if (content.includes('withIncrementalHydration()') && !line.includes('hover') && !line.includes('viewport')) {
            // This is a simplified check - in practice, we'd need more context
            const hasIncrementalTriggers = content.includes('hover') || content.includes('viewport') ||
                                         content.includes('interaction');
            if (!hasIncrementalTriggers) {
              smells.push(new CodeSmell(
                `hydration-incremental-trigger-${file.filePath}`,
                'HYDRATION_INCREMENTAL_TRIGGER',
                Severity.LOW,
                new Location(file.filePath, 1, 1),
                'Incremental hydration without trigger configuration',
                'Specify hover, viewport, or interaction triggers',
                Category.PERFORMANCE_BUNDLE_METRICS
              ));
            }
          }
        }
      });

      return smells;
    }

    private detectObservableSmells(file: SourceFile): CodeSmell[] {
      const smells: CodeSmell[] = [];
      const content = file.content;
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Check for missing async pipe
        if (line.includes('.subscribe(') && !content.includes('async') && !content.includes('| async')) {
          const hasAsyncPipe = content.includes('| async');
          if (!hasAsyncPipe && line.includes('.subscribe(')) {
            smells.push(new CodeSmell(
              `missing-async-pipe-${file.filePath}-${index}`,
              'MISSING_ASYNC_PIPE',
              Severity.LOW,
              new Location(file.filePath, index + 1, line.indexOf('.subscribe(') + 1),
              'Manual subscription instead of async pipe',
              'Use async pipe in template instead of manual subscription',
              Category.REACTIVITY_SIGNALS
            ));
          }
        }

        // Check for Subject misuse
        if (line.includes('public') && (line.includes('Subject<') || line.includes('BehaviorSubject<'))) {
          smells.push(new CodeSmell(
            `subject-misuse-${file.filePath}-${index}`,
            'SUBJECT_MISUSE',
            Severity.MEDIUM,
            new Location(file.filePath, index + 1, line.indexOf('Subject') + 1),
            'Public Subject exposure',
            'Expose as Observable, keep Subject private',
            Category.REACTIVITY_SIGNALS
          ));
        }

        // Check for ReplaySubject without buffer limit
        if (line.includes('ReplaySubject()') || line.includes('ReplaySubject<>()')) {
          smells.push(new CodeSmell(
            `subject-misuse-${file.filePath}-${index}`,
            'SUBJECT_MISUSE',
            Severity.HIGH,
            new Location(file.filePath, index + 1, line.indexOf('ReplaySubject') + 1),
            'ReplaySubject without buffer limit',
            'Specify buffer size: new ReplaySubject(1)',
            Category.REACTIVITY_SIGNALS
          ));
        }

        // Check for switchMap data loss
        if (line.includes('switchMap(') && (content.includes('form') || content.includes('input'))) {
          smells.push(new CodeSmell(
            `switchmap-data-loss-${file.filePath}-${index}`,
            'SWITCHMAP_DATA_LOSS',
            Severity.MEDIUM,
            new Location(file.filePath, index + 1, line.indexOf('switchMap(') + 1),
            'switchMap may cancel in-flight requests',
            'Consider exhaustMap or concatMap for sequential processing',
            Category.REACTIVITY_SIGNALS
          ));
        }
      });

      return smells;
    }

    private detectNgrxSmells(file: SourceFile): CodeSmell[] {
      const smells: CodeSmell[] = [];
      const content = file.content;
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Check for effects issues
        if (line.includes('createEffect(') && !line.includes('{ dispatch: false }')) {
          if (!content.includes('Actions.') && !content.includes('dispatch(')) {
            smells.push(new CodeSmell(
              `ngrx-effects-${file.filePath}-${index}`,
              'NGRX_EFFECTS_ISSUES',
              Severity.MEDIUM,
              new Location(file.filePath, index + 1, line.indexOf('createEffect') + 1),
              'Effect without proper dispatch configuration',
              'Add { dispatch: false } if no actions are dispatched',
              Category.STATE_MANAGEMENT
            ));
          }
        }

        // Check for missing memoization
        if (line.includes('createSelector(') && !content.includes('MemoizedSelector')) {
          const hasMemoization = content.includes('memoize') || content.includes('createSelectorFactory');
          if (!hasMemoization) {
            smells.push(new CodeSmell(
              `ngrx-memoization-${file.filePath}-${index}`,
              'NGRX_MISSING_MEMOIZATION',
              Severity.LOW,
              new Location(file.filePath, index + 1, line.indexOf('createSelector') + 1),
              'Selector without memoization',
              'Use memoized selectors for better performance',
              Category.STATE_MANAGEMENT
            ));
          }
        }

        // Check for non-normalized state
        if (line.includes('state.') && line.includes('entities') && !content.includes('normalized')) {
          smells.push(new CodeSmell(
            `ngrx-normalized-${file.filePath}-${index}`,
            'NGRX_NON_NORMALIZED_STATE',
            Severity.MEDIUM,
            new Location(file.filePath, index + 1, line.indexOf('entities') + 1),
            'Non-normalized state structure',
            'Normalize state to avoid duplication',
            Category.STATE_MANAGEMENT
          ));
        }

        // Check for over-selecting
        if (line.includes('select(') && content.includes('store.select') && lines.filter(l => l.includes('select(')).length > 5) {
          smells.push(new CodeSmell(
            `ngrx-over-selecting-${file.filePath}`,
            'NGRX_OVER_SELECTING',
            Severity.LOW,
            new Location(file.filePath, 1, 1),
            'Excessive selector usage',
            'Consider combining selectors or using feature selectors',
            Category.STATE_MANAGEMENT
          ));
        }

        // Check for state mutation
        if (line.includes('state.') && (line.includes('.push(') || line.includes('.splice('))) {
          smells.push(new CodeSmell(
            `ngrx-mutation-${file.filePath}-${index}`,
            'NGRX_STATE_MUTATION',
            Severity.CRITICAL,
            new Location(file.filePath, index + 1, line.indexOf('state.') + 1),
            'Direct state mutation in reducer',
            'Return new state object instead of mutating',
            Category.STATE_MANAGEMENT
          ));
        }
      });

      return smells;
    }

    private detectRoutingSmells(file: SourceFile): CodeSmell[] {
      const smells: CodeSmell[] = [];
      const content = file.content;
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Check for functional guards
        if (line.includes('canActivate:') && !line.includes('() =>')) {
          smells.push(new CodeSmell(
            `routing-functional-guards-${file.filePath}-${index}`,
            'ROUTING_FUNCTIONAL_GUARDS',
            Severity.LOW,
            new Location(file.filePath, index + 1, line.indexOf('canActivate') + 1),
            'Class-based guard instead of functional guard',
            'Use functional guards: () => inject(...).canActivate()',
            Category.ROUTING_NAVIGATION
          ));
        }

        // Check for guard injection
        if (line.includes('CanActivate') && content.includes('constructor(')) {
          smells.push(new CodeSmell(
            `routing-guards-${file.filePath}-${index}`,
            'ROUTING_GUARDS',
            Severity.LOW,
            new Location(file.filePath, index + 1, line.indexOf('CanActivate') + 1),
            'Guard with constructor injection',
            'Use functional guards with inject() instead',
            Category.ROUTING_NAVIGATION
          ));
        }

        // Check for route input binding
        if (content.includes('ActivatedRoute') && content.includes('.params.subscribe(')) {
          smells.push(new CodeSmell(
            `routing-input-binding-${file.filePath}`,
            'ROUTING_INPUT_BINDING',
            Severity.MEDIUM,
            new Location(file.filePath, 1, 1),
            'Manual route params subscription',
            'Use @Input() with route data binding',
            Category.ROUTING_NAVIGATION
          ));
        }

        // Check for lazy loading
        if (line.includes('component:') && !line.includes('loadChildren') && content.includes('Routes')) {
          const featurePatterns = ['admin', 'dashboard', 'settings', 'profile'];
          if (featurePatterns.some(pattern => content.toLowerCase().includes(pattern))) {
            smells.push(new CodeSmell(
              `routing-lazy-loading-${file.filePath}-${index}`,
              'ROUTING_LAZY_LOADING',
              Severity.MEDIUM,
              new Location(file.filePath, index + 1, line.indexOf('component:') + 1),
              'Feature route without lazy loading',
              'Use loadChildren with dynamic import',
              Category.PERFORMANCE_BUNDLE_METRICS
            ));
          }
        }

        // Check for route order
        let foundWildcard = false;
        let wildcardLine = 0;

        if (line.includes("path: '**'") || line.includes('path: "**"')) {
          foundWildcard = true;
          wildcardLine = index + 1;
        }

        if (foundWildcard && line.includes('path:') && !line.includes('**')) {
          smells.push(new CodeSmell(
            `routing-order-${file.filePath}-${index}`,
            'ROUTING_ORDER',
            Severity.CRITICAL,
            new Location(file.filePath, index + 1, line.indexOf('path:') + 1),
            'Route defined after wildcard route',
            'Move wildcard route to end of routes array',
            Category.ROUTING_NAVIGATION
          ));
        }
      });

      return smells;
    }

    private detectSignalsSmells(file: SourceFile): CodeSmell[] {
      const smells: CodeSmell[] = [];
      const content = file.content;
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Check for effect derivation
        if (line.includes('effect(') && (line.includes('return') || line.includes('=>'))) {
          smells.push(new CodeSmell(
            `signals-effect-derivation-${file.filePath}-${index}`,
            'SIGNALS_EFFECT_DERIVATION',
            Severity.HIGH,
            new Location(file.filePath, index + 1, line.indexOf('effect(') + 1),
            'Effect used for derivation instead of computed',
            'Use computed() for derived values',
            Category.REACTIVITY_SIGNALS
          ));
        }

        // Check for linkedSignal overuse
        const linkedSignalCount = (content.match(/linkedSignal\(/g) || []).length;
        if (linkedSignalCount > 3) {
          smells.push(new CodeSmell(
            `signals-linked-signal-${file.filePath}`,
            'SIGNALS_LINKEDSIGNAL_OVERUSE',
            Severity.MEDIUM,
            new Location(file.filePath, 1, 1),
            `Excessive linkedSignal usage (${linkedSignalCount})`,
            'Consider using computed() or model() instead',
            Category.REACTIVITY_SIGNALS
          ));
        }

        // Check for resource race conditions
        if (line.includes('resource(') && !content.includes('abortSignal')) {
          smells.push(new CodeSmell(
            `signals-resource-race-${file.filePath}-${index}`,
            'SIGNALS_RESOURCE_RACE',
            Severity.MEDIUM,
            new Location(file.filePath, index + 1, line.indexOf('resource(') + 1),
            'Resource without abort signal',
            'Add abortSignal to prevent race conditions',
            Category.REACTIVITY_SIGNALS
          ));
        }
      });

      return smells;
    }

    private detectTestingSmells(file: SourceFile): CodeSmell[] {
      const smells: CodeSmell[] = [];
      const content = file.content;
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Check for deprecated async wrapper
        if (line.includes('async(') && line.includes('it(')) {
          smells.push(new CodeSmell(
            `testing-async-${file.filePath}-${index}`,
            'TESTING_ASYNC',
            Severity.LOW,
            new Location(file.filePath, index + 1, line.indexOf('async(') + 1),
            'Deprecated async() wrapper in test',
            'Use waitForAsync() instead',
            Category.TESTING
          ));
        }

        // Check for defer behavior testing
        if (content.includes('@defer') && !content.includes('DeferBlockFixture')) {
          smells.push(new CodeSmell(
            `testing-defer-behavior-${file.filePath}`,
            'TESTING_DEFER_BEHAVIOR',
            Severity.MEDIUM,
            new Location(file.filePath, 1, 1),
            'Defer block without proper test setup',
            'Use DeferBlockFixture to test defer behavior',
            Category.TESTING
          ));
        }

        // Check for fakeAsync with zoneless
        if (content.includes('fakeAsync(') && content.includes('provideExperimentalZonelessChangeDetection()')) {
          smells.push(new CodeSmell(
            `testing-fakeasync-zoneless-${file.filePath}`,
            'TESTING_FAKEASYNC_ZONLESS',
            Severity.HIGH,
            new Location(file.filePath, 1, 1),
            'fakeAsync used with zoneless change detection',
            'Remove fakeAsync or use zone-based testing',
            Category.TESTING
          ));
        }

        // Check for missing flushEffects
        if (content.includes('effect(') && !content.includes('TestBed.flushEffects()')) {
          smells.push(new CodeSmell(
            `testing-flush-effects-${file.filePath}`,
            'TESTING_FLUSH_EFFECTS',
            Severity.MEDIUM,
            new Location(file.filePath, 1, 1),
            'Signal effects without flushEffects in test',
            'Call TestBed.flushEffects() to stabilize effects',
            Category.TESTING
          ));
        }

        // Check for testing implementation details
        if (line.includes('.nativeElement') && line.includes('click()')) {
          smells.push(new CodeSmell(
            `testing-implementation-${file.filePath}-${index}`,
            'TESTING_IMPLEMENTATION',
            Severity.LOW,
            new Location(file.filePath, index + 1, line.indexOf('.nativeElement') + 1),
            'Testing implementation details',
            'Test user behavior, not implementation',
            Category.TESTING
          ));
        }

        if (line.includes('fixture.componentInstance.') && !line.includes('Input')) {
          smells.push(new CodeSmell(
            `testing-implementation-${file.filePath}-${index}`,
            'TESTING_IMPLEMENTATION',
            Severity.LOW,
            new Location(file.filePath, index + 1, line.indexOf('fixture.componentInstance') + 1),
            'Direct access to component internals',
            'Test through public API only',
            Category.TESTING
          ));
        }

        // Check for signal input mutation
        if (line.includes('input()') && line.includes('.set(')) {
          smells.push(new CodeSmell(
            `testing-signal-input-${file.filePath}-${index}`,
            'TESTING_SIGNAL_INPUT_MUTATION',
            Severity.HIGH,
            new Location(file.filePath, index + 1, line.indexOf('.set(') + 1),
            'Attempting to mutate signal input in test',
            'Use setInput() or fixture properties',
            Category.TESTING
          ));
        }

        // Check for manual service instantiation
        if (content.includes('TestBed.') && !content.includes('TestBed.inject')) {
          if (content.includes('new ') && content.includes('Service')) {
            smells.push(new CodeSmell(
              `testing-testbed-${file.filePath}`,
              'TESTING_TESTBED',
              Severity.MEDIUM,
              new Location(file.filePath, 1, 1),
              'Manual service instantiation instead of TestBed',
              'Use TestBed.inject() for dependency injection',
              Category.TESTING
            ));
          }
        }

        // Check for observable subscriptions in zoneless tests
        if (content.includes('provideExperimentalZonelessChangeDetection()') && content.includes('.subscribe(')) {
          smells.push(new CodeSmell(
            `testing-zoneless-observables-${file.filePath}`,
            'TESTING_ZONLESS_OBSERVABLE_SUBSCRIPTIONS',
            Severity.MEDIUM,
            new Location(file.filePath, 1, 1),
            'Observable subscription in zoneless test',
            'Use fixture.detectChanges() or signals',
            Category.TESTING
          ));
        }
      });

      return smells;
    }

    private detectTemplateMethodCall(file: SourceFile): CodeSmell[] {
      const smells: CodeSmell[] = [];
      const content = file.content;
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Look for method calls in template bindings
        const templateMethodPattern = /\{\{\s*\w+\([^}]*\)\s*\}\}|\[\w+\]\s*=\s*["\'].*\([^"']*\)[^"']*["']/g;

        if (templateMethodPattern.test(line)) {
          smells.push(new CodeSmell(
            `template-method-call-${file.filePath}-${index}`,
            'TEMPLATE_METHOD_CALL',
            Severity.HIGH,
            new Location(file.filePath, index + 1, 1),
            'Method call in template binding',
            'Use signals, computed, or pure pipes',
            Category.TEMPLATE_RENDERING
          ));
        }
      });

      return smells;
    }

  private countBySeverity(smells: CodeSmell[]): Record<string, number> {
    return smells.reduce((counts, smell) => {
      const severity = smell.severity.toString();
      counts[severity] = (counts[severity] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }
}