import * as ts from 'typescript';
import { ScannedFile } from '../scanner/FileScanner';
import { TemplateParser } from '../parser/TemplateParser';

export interface DetectionResult {
  file: string;
  line: number;
  column: number;
  smell: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  refactoring: string;
  category: string;
}

export class AngularSmellDetector {
  private results: DetectionResult[] = [];
  private templateParser = new TemplateParser();

  async analyzeFiles(files: ScannedFile[]): Promise<DetectionResult[]> {
    this.results = [];

    for (const file of files) {
      await this.analyzeFile(file);
    }

    return this.results;
  }

  private async analyzeFile(file: ScannedFile): Promise<void> {
    switch (file.type) {
      case 'component':
        this.analyzeComponent(file);
        break;
      case 'template':
        this.analyzeTemplate(file);
        break;
      case 'service':
        this.analyzeService(file);
        break;
      case 'directive':
        this.analyzeDirective(file);
        break;
      case 'config':
        this.analyzeConfig(file);
        break;
      case 'store':
        this.analyzeStore(file);
        break;
      case 'routing':
        this.analyzeRouting(file);
        break;
      case 'test':
        this.analyzeTest(file);
        break;
    }
  }

  private analyzeComponent(file: ScannedFile): void {
    const sourceFile = ts.createSourceFile(
      file.path,
      file.content,
      ts.ScriptTarget.Latest,
      true
    );

    // IMPURE_TEMPLATE_CALL detection
    this.detectImpureTemplateCalls(file, sourceFile);

    // GOD_STANDALONE_COMPONENT detection
    this.detectGodComponent(file, sourceFile);

    // SIGNAL_WRITE_IN_EFFECT detection
    this.detectSignalWriteInEffect(file, sourceFile);

    // NESTED_SUBSCRIPTION_HELL detection
    this.detectNestedSubscriptions(file, sourceFile);

    // PROVIDER_POLLUTION detection
    this.detectProviderPollution(file, sourceFile);

    // UNTRACKED_SIGNAL_READ detection
    this.detectUntrackedSignalRead(file, sourceFile);

    // ZONE_POLLUTION detection
    this.detectZonePollution(file, sourceFile);

    // CONTROL_FLOW_DEPRECATED detection
    this.detectControlFlowDeprecated(file, sourceFile);

    // DEFER detections
    this.detectDeferAboveFold(file, sourceFile);
    this.detectDeferErrorBlocks(file, sourceFile);
    this.detectDeferNonStandalone(file, sourceFile);

    // FORMS detections
    this.detectFormsMixed(file, sourceFile);
    this.detectFormsTyped(file, sourceFile);
    this.detectFormsValueChanges(file, sourceFile);

    // MISSING_ASYNC_PIPE detection
    this.detectMissingAsyncPipe(file, sourceFile);

    // ONPUSH_MISUSE detection
    this.detectOnPushMisuse(file, sourceFile);

    // SIGNALS detections
    this.detectSignalsEffectDerivation(file, sourceFile);
    this.detectSignalsLinkedsignalOveruse(file, sourceFile);
    this.detectSignalsResourceRace(file, sourceFile);

    // TYPESCRIPT detections
    this.detectTypescriptAny(file, sourceFile);
    this.detectTypescriptNonNull(file, sourceFile);

    // SUBJECT_MISUSE detection
    this.detectSubjectMisuse(file, sourceFile);

    // SWITCHMAP_DATA_LOSS detection
    this.detectSwitchmapDataLoss(file, sourceFile);

    // SMART_DUMB_VIOLATION detection
    this.detectSmartDumbViolation(file, sourceFile);

    // TEMPLATE_METHOD_CALL detection
    this.detectTemplateMethodCall(file, sourceFile);

    // ZONLESS detections
    this.detectZonlessNgzoneStable(file, sourceFile);
    this.detectZonlessObservableSubscriptions(file, sourceFile);
    this.detectZonlessTimerUpdates(file, sourceFile);
  }

  private analyzeTemplate(file: ScannedFile): void {
    const analysis = this.templateParser.parse(file.content);

    // LARGE_LIST_WITHOUT_VIRTUALIZATION detection
    this.detectLargeListWithoutVirtualization(file, analysis);

    // HYDRATION_MISMATCH detection
    this.detectHydrationMismatch(file, analysis);

    // IMPURE_TEMPLATE_CALL detection using AST analysis
    this.detectTemplateFunctionCalls(file, analysis);

    // MISSING_TRACKBY detection
    this.detectMissingTrackBy(file, analysis);

    // CONTROL_FLOW_DEPRECATED detection in template
    this.detectControlFlowDeprecatedTemplate(file);

    // HYDRATION detections
    this.detectHydrationInvalidHtml(file, analysis);
    this.detectHydrationMissingEventReplay(file, analysis);
    this.detectHydrationIncrementalTrigger(file, analysis);
  }

  private analyzeService(file: ScannedFile): void {
    const sourceFile = ts.createSourceFile(
      file.path,
      file.content,
      ts.ScriptTarget.Latest,
      true
    );

    // CIRCULAR_DEPENDENCY_INJECTION detection
    this.detectCircularDependency(file, sourceFile);

    // Additional service-specific detections
    this.detectSubjectMisuse(file, sourceFile);
    this.detectSwitchmapDataLoss(file, sourceFile);
    this.detectMissingAsyncPipe(file, sourceFile);
    this.detectTypescriptAny(file, sourceFile);
    this.detectTypescriptNonNull(file, sourceFile);
  }

  private analyzeDirective(file: ScannedFile): void {
    // Similar to component analysis but for directives
    this.analyzeComponent(file);
  }

  private analyzeConfig(file: ScannedFile): void {
    // INITIAL_BUNDLE_BUDGET_EXCEEDED detection
    this.detectInitialBundleBudgetExceeded(file);
  }

  private analyzeStore(file: ScannedFile): void {
    const sourceFile = ts.createSourceFile(
      file.path,
      file.content,
      ts.ScriptTarget.Latest,
      true
    );

    // ENTITY_DUPLICATION detection
    this.detectEntityDuplication(file, sourceFile);

    // BROAD_SELECTORS detection
    this.detectBroadSelectors(file, sourceFile);

    // NGRX detections
    this.detectNgrxEffectsIssues(file, sourceFile);
    this.detectNgrxMissingMemoization(file, sourceFile);
    this.detectNgrxNonNormalizedState(file, sourceFile);
    this.detectNgrxOverSelecting(file, sourceFile);
    this.detectNgrxStateMutation(file, sourceFile);
  }

  private analyzeRouting(file: ScannedFile): void {
    const sourceFile = ts.createSourceFile(
      file.path,
      file.content,
      ts.ScriptTarget.Latest,
      true
    );

    // ROUTING detections
    this.detectRoutingFunctionalGuards(file, sourceFile);
    this.detectRoutingGuards(file, sourceFile);
    this.detectRoutingInputBinding(file, sourceFile);
    this.detectRoutingLazyLoading(file, sourceFile);
    this.detectRoutingOrder(file, sourceFile);
  }

  private analyzeTest(file: ScannedFile): void {
    const sourceFile = ts.createSourceFile(
      file.path,
      file.content,
      ts.ScriptTarget.Latest,
      true
    );

    // TESTING detections
    this.detectTestingAsync(file, sourceFile);
    this.detectTestingDeferBehavior(file, sourceFile);
    this.detectTestingFakeasyncZonless(file, sourceFile);
    this.detectTestingFlushEffects(file, sourceFile);
    this.detectTestingImplementation(file, sourceFile);
    this.detectTestingSignalInputMutation(file, sourceFile);
    this.detectTestingTestbed(file, sourceFile);
    this.detectTestingZonelessObservableSubscriptions(file, sourceFile);
  }

  private detectImpureTemplateCalls(file: ScannedFile, sourceFile: ts.SourceFile): void {
    // Look for method calls in template-related code
    // This is a simplified implementation - in practice you'd need template parsing

    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Simple regex to find function calls in template-like context
      const templateCallRegex = /\{\{\s*\w+\([^}]*\)\s*\}\}/g;
      const matches = line.match(templateCallRegex);

      if (matches) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: line.indexOf(matches[0]) + 1,
          smell: 'IMPURE_TEMPLATE_CALL',
          severity: 'HIGH',
          message: 'Function call detected in template binding',
          refactoring: 'Use signals or pure pipes instead of method calls',
          category: 'Template & Rendering'
        });
      }
    });
  }

  private detectGodComponent(file: ScannedFile, sourceFile: ts.SourceFile): void {
    // Count imports in component
    const importMatches = file.content.match(/import\s+{[^}]+}\s+from/g);
    const importCount = importMatches ? importMatches.length : 0;

    // Count lines of code (rough estimate)
    const loc = file.content.split('\n').length;

    if (importCount > 20 || loc > 400) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'GOD_STANDALONE_COMPONENT',
        severity: importCount > 30 || loc > 500 ? 'CRITICAL' : 'HIGH',
        message: `Component has ${importCount} imports and ${loc} lines - potential god component`,
        refactoring: 'Split into smaller, focused components',
        category: 'Architecture & Dependency Injection'
      });
    }
  }

  private detectSignalWriteInEffect(file: ScannedFile, sourceFile: ts.SourceFile): void {
    // Look for signal writes inside effects
    const content = file.content;
    const lines = content.split('\n');

    let inEffect = false;
    lines.forEach((line, index) => {
      if (line.includes('effect(') || line.includes('effect(()')) {
        inEffect = true;
      }

      if (inEffect && (line.includes('.set(') || line.includes('.update('))) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: line.indexOf('.set(') !== -1 ? line.indexOf('.set(') + 1 : line.indexOf('.update(') + 1,
          smell: 'SIGNAL_WRITE_IN_EFFECT',
          severity: 'HIGH',
          message: 'Signal write detected inside effect - potential infinite loop',
          refactoring: 'Use computed() for derived state or untracked() for read-only access',
          category: 'Reactivity & Signals'
        });
      }

      if (line.includes('});') && inEffect) {
        inEffect = false;
      }
    });
  }

  private detectNestedSubscriptions(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const subscriptionDepth = this.calculateSubscriptionNesting(content);

    if (subscriptionDepth > 1) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'NESTED_SUBSCRIPTION_HELL',
        severity: 'CRITICAL',
        message: `Nested subscriptions detected (depth: ${subscriptionDepth})`,
        refactoring: 'Use switchMap, concatMap, or mergeMap operators',
        category: 'Reactivity & Signals'
      });
    }

    // Enhanced memory leak detection
    this.detectMemoryLeaks(file, sourceFile);
  }

  private detectMemoryLeaks(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    // Check for subscription declarations without proper cleanup
    const subscriptionDeclarations = [];
    const ngOnDestroyExists = content.includes('ngOnDestroy') || content.includes('OnDestroy');
    const implementsOnDestroy = content.includes('implements OnDestroy');

    lines.forEach((line, index) => {
      // Look for subscription variables
      const subVarMatch = line.match(/(?:private|public|protected)?\s*(\w+Subscription|\w+Sub|subscription\w*)\s*[:=]/);
      if (subVarMatch) {
        subscriptionDeclarations.push({
          name: subVarMatch[1],
          line: index + 1
        });
      }

      // Look for direct subscribe() calls without assignment
      if (line.includes('.subscribe(') && !line.includes('=')) {
        // Check if this is in ngOnInit or similar lifecycle method
        const isInLifecycleMethod = this.isInLifecycleMethod(content, index);

        if (!isInLifecycleMethod && !ngOnDestroyExists) {
          this.addResult({
            file: file.path,
            line: index + 1,
            column: line.indexOf('.subscribe(') + 1,
            smell: 'MEMORY_LEAK_SUBSCRIPTION',
            severity: 'CRITICAL',
            message: 'Unassigned subscription without proper cleanup mechanism',
            refactoring: 'Assign to variable and unsubscribe in ngOnDestroy or use async pipe',
            category: 'Reactivity & Signals'
          });
        }
      }
    });

    // Check if component implements OnDestroy but doesn't clean up subscriptions
    if (implementsOnDestroy && subscriptionDeclarations.length > 0) {
      const hasCleanup = content.includes('unsubscribe()') ||
                        content.includes('takeUntil(') ||
                        content.includes('async');

      if (!hasCleanup) {
        this.addResult({
          file: file.path,
          line: 1,
          column: 1,
          smell: 'MEMORY_LEAK_SUBSCRIPTION',
          severity: 'HIGH',
          message: 'Component implements OnDestroy but subscriptions are not cleaned up',
          refactoring: 'Add unsubscribe() calls or takeUntil pattern in ngOnDestroy',
          category: 'Reactivity & Signals'
        });
      }
    }

    // Check for Subject/BehaviorSubject without complete() calls
    const subjectDeclarations = [];
    lines.forEach((line, index) => {
      const subjectMatch = line.match(/(?:private|public|protected)?\s*(\w+Subject|\w+\$)\s*[:=]/);
      if (subjectMatch && (line.includes('Subject(') || line.includes('BehaviorSubject('))) {
        subjectDeclarations.push({
          name: subjectMatch[1],
          line: index + 1
        });
      }
    });

    if (subjectDeclarations.length > 0 && ngOnDestroyExists) {
      const hasCompleteCalls = content.includes('.complete()') || content.includes('.next(');
      if (!hasCompleteCalls) {
        this.addResult({
          file: file.path,
          line: 1,
          column: 1,
          smell: 'MEMORY_LEAK_SUBSCRIPTION',
          severity: 'MEDIUM',
          message: 'Subject/BehaviorSubject declared but not properly completed',
          refactoring: 'Call .complete() on subjects in ngOnDestroy',
          category: 'Reactivity & Signals'
        });
      }
    }
  }

  private isInLifecycleMethod(content: string, lineIndex: number): boolean {
    const lines = content.split('\n');
    let braceCount = 0;
    const lifecycleMethods = ['ngOnInit', 'ngAfterViewInit', 'ngAfterContentInit', 'ngOnChanges'];

    // Look backwards from the line to find method context
    for (let i = lineIndex; i >= 0; i--) {
      const line = lines[i];

      // Count braces to understand nesting
      braceCount += (line.match(/\{/g) || []).length;
      braceCount -= (line.match(/\}/g) || []).length;

      // Check if we're inside a lifecycle method
      if (lifecycleMethods.some(method => line.includes(method + '('))) {
        return braceCount >= 0; // We're inside the method if braces are balanced
      }

      if (braceCount < 0) break; // We've gone outside the current scope
    }

    return false;
  }

  private detectProviderPollution(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('@Injectable({providedIn: \'root\'})') &&
          content.includes('providers:') &&
          content.includes('@Injectable')) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: 1,
          smell: 'PROVIDER_POLLUTION',
          severity: 'CRITICAL',
          message: 'Root-provided service declared in component providers',
          refactoring: 'Remove from providers array - service is already singleton',
          category: 'Architecture & Dependency Injection'
        });
      }
    });
  }

  private detectUntrackedSignalRead(file: ScannedFile, sourceFile: ts.SourceFile): void {
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
              'console.log', 'return', 'if (', 'else if (', '&&', '||', '===', '!==', '<', '>', '<=', '>='
            ];

            const isReadOnly = readOnlyPatterns.some(pattern => line.includes(pattern)) ||
                              line.trim().startsWith('//') ||
                              line.trim().startsWith('/*');

            if (isReadOnly) {
              this.addResult({
                file: file.path,
                line: index + 1,
                column: line.indexOf(matches[0]) + 1,
                smell: 'UNTRACKED_SIGNAL_READ',
                severity: 'HIGH',
                message: 'Signal read inside effect may create unintended dependency',
                refactoring: 'Wrap in untracked(() => signal()) if read-only access is intended',
                category: 'Reactivity & Signals'
              });
            }
          }
        }
      }

      if (line.includes('});') && inEffect && line.includes('effect')) {
        inEffect = false;
      }
    });
  }

  private detectZonePollution(file: ScannedFile, sourceFile: ts.SourceFile): void {
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
            this.addResult({
              file: file.path,
              line: index + 1,
              column: line.indexOf(timerMethods.find(m => line.includes(m))!) + 1,
              smell: 'ZONE_POLLUTION',
              severity: 'HIGH',
              message: 'Timer/animation method used with zone-polluting library without runOutsideAngular',
              refactoring: 'Wrap in NgZone.runOutsideAngular(() => { ... }) to prevent global change detection',
              category: 'Performance & Bundle Metrics'
            });
          }
        });
      }

      // Check for direct DOM manipulation that could trigger zone
      const domMethods = ['getElementById', 'querySelector', 'addEventListener'];
      const hasDirectDom = domMethods.some(method => content.includes(method));

      if (hasDirectDom && !hasRunOutsideAngular) {
        this.addResult({
          file: file.path,
          line: 1,
          column: 1,
          smell: 'ZONE_POLLUTION',
          severity: 'MEDIUM',
          message: 'Direct DOM manipulation with zone-polluting library detected',
          refactoring: 'Use Angular Renderer2 or wrap DOM operations in runOutsideAngular',
          category: 'Performance & Bundle Metrics'
        });
      }
    }
  }

  private detectEntityDuplication(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    // Look for NgRx state interfaces with duplicate entity patterns
    const interfaceRegex = /interface\s+(\w*State)\s*{([^}]*)}/g;
    let match: RegExpExecArray | null;

    while ((match = interfaceRegex.exec(content)) !== null) {
      const stateInterface = match[2];

      // Check for duplicate entity storage patterns
      const entityFields: string[] = [];

      // Look for common entity duplication patterns
      const entityPatterns = [
        /(\w+):\s*{\s*\[id:\s*string\]:\s*\w+\s*}/g, // Dictionary pattern
        /(\w+):\s*\w+\[\]/g, // Array pattern
        /(\w+Ids):\s*string\[\]/g, // ID array pattern
        /selected(\w+):\s*\w+/g // Selected entity pattern
      ];

      entityPatterns.forEach(pattern => {
        let fieldMatch;
        while ((fieldMatch = pattern.exec(stateInterface)) !== null) {
          entityFields.push(fieldMatch[1]);
        }
      });

      // Check for duplicate entities (same entity stored in multiple ways)
      const uniqueEntities = new Set();
      entityFields.forEach(field => {
        const baseName = field.replace(/Ids?$/, '').replace(/selected/, '').toLowerCase();
        uniqueEntities.add(baseName);
      });

      if (uniqueEntities.size < entityFields.length / 2) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        this.addResult({
          file: file.path,
          line: lineNumber,
          column: 1,
          smell: 'ENTITY_DUPLICATION',
          severity: 'CRITICAL',
          message: 'Entity duplication in NgRx state - same data stored multiple ways',
          refactoring: 'Store only entity references (IDs) and use selectors to compute derived data',
          category: 'State Management'
        });
      }

      // Check for storing full objects when IDs would suffice
      const fullObjectPatterns = [
        /selected(\w+):\s*(\w+)/g, // selectedUser: User (should be selectedUserId: string)
        /(\w+):\s*(\w+)\[\]/g // users: User[] (might be better as userIds: string[])
      ];

      fullObjectPatterns.forEach(pattern => {
        let fieldMatch;
        while ((fieldMatch = pattern.exec(stateInterface)) !== null) {
          const fieldName = fieldMatch[1];
          const typeName = fieldMatch[2];

          // If field name suggests it's an entity and type matches, might be duplication
          if (fieldName.toLowerCase().includes(typeName.toLowerCase()) ||
              typeName.toLowerCase().includes(fieldName.toLowerCase())) {
            const lineNumber = match ? content.substring(0, match.index).split('\n').length : 1;

            this.addResult({
              file: file.path,
              line: lineNumber,
              column: 1,
              smell: 'ENTITY_DUPLICATION',
              severity: 'HIGH',
              message: `Potential entity duplication: ${fieldName} stores full ${typeName} object`,
              refactoring: `Store only reference: ${fieldName}Id: string`,
              category: 'State Management'
            });

            this.addResult({
              file: file.path,
              line: lineNumber,
              column: 1,
              smell: 'ENTITY_DUPLICATION',
              severity: 'HIGH',
              message: `Potential entity duplication: ${fieldName} stores full ${typeName} object`,
              refactoring: `Store only reference: ${fieldName}Id: string`,
              category: 'State Management'
            });
          }
        }
      });
    }
  }

  private detectBroadSelectors(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    // Look for NgRx selectors that return too much data
    const selectorRegex = /export\s+const\s+(\w+)\s*=\s*createSelector\(/g;
    let match;

    while ((match = selectorRegex.exec(content)) !== null) {
      const selectorName = match[1];
      const selectorStart = match.index;
      const selectorEnd = this.findClosingParen(content, selectorStart + match[0].length);

      if (selectorEnd !== -1) {
        const selectorBody = content.substring(selectorStart, selectorEnd + 1);

        // Check if selector returns entire state or large objects
        const returnPatterns = [
          /return\s+state\s*;/, // Returns entire state
          /return\s+\{[^}]*state[^}]*\}/, // Returns object containing state
          /return\s+.*entities.*\}/, // Returns all entities
          /return\s+.*items.*\}/ // Returns all items
        ];

        const isBroad = returnPatterns.some(pattern => pattern.test(selectorBody));

        // Check selector complexity (too many input selectors)
        const inputSelectors = (selectorBody.match(/select\w+,/g) || []).length;

        if (isBroad || inputSelectors > 3) {
          const lineNumber = content.substring(0, selectorStart).split('\n').length + 1;
          this.addResult({
            file: file.path,
            line: lineNumber,
            column: 1,
            smell: 'BROAD_SELECTORS',
            severity: isBroad ? 'HIGH' : 'MEDIUM',
            message: `Broad selector '${selectorName}' returns unnecessary data`,
            refactoring: 'Create focused selectors that return only needed data',
            category: 'State Management'
          });
        }

        // Check for selectors that don't memoize computed values
        if (selectorBody.includes('map(') || selectorBody.includes('filter(') ||
            selectorBody.includes('reduce(')) {
          const hasMemoization = selectorBody.includes('createSelector') &&
                                selectorBody.split('createSelector').length > 2;

          if (!hasMemoization) {
            const lineNumber = content.substring(0, selectorStart).split('\n').length + 1;
            this.addResult({
              file: file.path,
              line: lineNumber,
              column: 1,
              smell: 'BROAD_SELECTORS',
              severity: 'MEDIUM',
              message: `Selector '${selectorName}' performs computation without proper memoization`,
              refactoring: 'Split computation into separate memoized selectors',
              category: 'State Management'
            });
          }
        }
      }
    }
  }

  private findClosingParen(content: string, startIndex: number): number {
    let parenCount = 0;
    for (let i = startIndex; i < content.length; i++) {
      if (content[i] === '(') parenCount++;
      if (content[i] === ')') {
        parenCount--;
        if (parenCount === 0) return i;
      }
    }
    return -1;
  }

  private detectLargeListWithoutVirtualization(file: ScannedFile, analysis: any): void {
    const content = file.content;

    // Use AST analysis for more accurate detection
    if (analysis.ngForCount > 0 && !content.includes('cdk-virtual-scroll')) {
      // Check for structural directives that might indicate large lists
      const hasNgFor = analysis.structuralDirectives.some((dir: any) =>
        dir.name === '*ngFor'
      );

      if (hasNgFor) {
        // Look for large arrays in related component
        const componentFile = file.path.replace('.html', '.ts');
        const componentContent = this.getComponentContent(componentFile);

        if (componentContent) {
          const largeArrayMatch = componentContent.match(/Array\((\d+)\)/) ||
                                 componentContent.match(/new Array\((\d+)\)/) ||
                                 componentContent.match(/length:\s*(\d+)/);

          if (largeArrayMatch) {
            const count = parseInt(largeArrayMatch[1]);
            if (count > 500) {
              this.addResult({
                file: file.path,
                line: 1,
                column: 1,
                smell: 'LARGE_LIST_WITHOUT_VIRTUALIZATION',
                severity: count > 1000 ? 'CRITICAL' : 'HIGH',
                message: `Large list (${count} items) without virtualization`,
                refactoring: 'Use @angular/cdk/scrolling VirtualScrollViewport',
                category: 'Template & Rendering'
              });
            }
          }
        }
      }
    }
  }

  private detectHydrationMismatch(file: ScannedFile, analysis: any): void {
    // Use AST analysis results
    if (analysis.nestedAnchors) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'HYDRATION_MISMATCH',
        severity: 'CRITICAL',
        message: 'Nested anchor tags detected - hydration mismatch risk',
        refactoring: 'Fix HTML structure to be valid',
        category: 'Template & Rendering'
      });
    }

    if (analysis.dynamicContent) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'HYDRATION_MISMATCH',
        severity: 'HIGH',
        message: 'Dynamic/random data in template - SSR hydration mismatch',
        refactoring: 'Use static data or handle differences in component logic',
        category: 'Template & Rendering'
      });
    }

    if (analysis.unsafeInnerHtml) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'UNSAFE_INNER_HTML',
        severity: 'CRITICAL',
        message: 'Unsafe innerHTML binding - XSS vulnerability',
        refactoring: 'Use Angular sanitization or avoid dynamic HTML',
        category: 'Template & Rendering'
      });
    }
  }

  private detectTemplateFunctionCalls(file: ScannedFile, analysis: any): void {
    analysis.functionCalls.forEach((call: any) => {
      this.addResult({
        file: file.path,
        line: call.line || 1,
        column: call.column || 1,
        smell: 'IMPURE_TEMPLATE_CALL',
        severity: 'HIGH',
        message: `Function call in template: ${call.expression}`,
        refactoring: 'Use signals, computed values, or pure pipes instead',
        category: 'Template & Rendering'
      });
    });
  }

  private detectMissingTrackBy(file: ScannedFile, analysis: any): void {
    const content = file.content;

    // Look for *ngFor directives
    const ngForRegex = /\*ngFor\s*=\s*["']let\s+(\w+)\s+of\s+([^;"']+)/g;
    let match;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for ngFor without trackBy
      if (line.includes('*ngFor') && !line.includes('trackBy')) {
        // Extract the ngFor expression
        const ngForMatch = line.match(/\*ngFor\s*=\s*["']([^"']+)["']/);
        if (ngForMatch) {
          const ngForExpression = ngForMatch[1];

          // Check if this is a large collection that needs trackBy
          const componentFile = file.path.replace('.html', '.ts');
          const componentContent = this.getComponentContent(componentFile);

          let shouldRequireTrackBy = false;
          if (componentContent) {
            // Check if the collection variable suggests large data
            const collectionName = ngForExpression.split('of')[1]?.trim();
            if (collectionName) {
              const largeDataPatterns = [
                /items\.length\s*>\s*10/,
                /Array\((\d+)\)/,
                /new Array\((\d+)\)/,
                /\w+Data\w*/,
                /\w+List\w*/,
                /\w+Collection\w*/
              ];

              shouldRequireTrackBy = largeDataPatterns.some(pattern =>
                componentContent.includes(collectionName) &&
                pattern.test(componentContent)
              );
            }
          }

          this.addResult({
            file: file.path,
            line: index + 1,
            column: line.indexOf('*ngFor') + 1,
            smell: 'MISSING_TRACKBY',
            severity: shouldRequireTrackBy ? 'HIGH' : 'MEDIUM',
            message: `*ngFor without trackBy function - performance issue with list updates`,
            refactoring: 'Add trackBy function: *ngFor="let item of items; trackBy: trackByFn"',
            category: 'Template & Rendering'
          });
        }
      }
    });
  }

  private getComponentContent(componentPath: string): string | null {
    try {
      const fs = require('fs');
      if (fs.existsSync(componentPath)) {
        return fs.readFileSync(componentPath, 'utf-8');
      }
    } catch (error) {
      // Component file might not exist or be readable
    }
    return null;
  }

  private detectCircularDependency(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;

    // Build dependency graph for this service
    const dependencies = this.extractDependencies(content);
    const serviceName = this.extractServiceName(content);

    if (serviceName && dependencies.length > 0) {
      // Check for immediate circular dependencies within this file
      if (dependencies.includes(serviceName)) {
        this.addResult({
          file: file.path,
          line: 1,
          column: 1,
          smell: 'CIRCULAR_DEPENDENCY_INJECTION',
          severity: 'CRITICAL',
          message: `Service '${serviceName}' injects itself - circular dependency`,
          refactoring: 'Extract shared logic to separate service or use Injector for lazy injection',
          category: 'Architecture & Dependency Injection'
        });
      }

      // Check for constructor injection of services that might lead to cycles
      const constructorMatch = content.match(/constructor\(\s*([^)]+)\)/);
      if (constructorMatch) {
        const constructorParams = constructorMatch[1];
        const injectedServices = constructorParams.match(/(?:private|public|protected)?\s+\w+:\s*(\w+)/g) || [];

        injectedServices.forEach(param => {
          const serviceMatch = param.match(/(?:private|public|protected)?\s+\w+:\s*(\w+)/);
          if (serviceMatch) {
            const injectedService = serviceMatch[1];

            // Check if this service is likely to cause circular dependency
            // This is a heuristic - in production you'd need cross-file analysis
            if (injectedService.includes('Service') &&
                this.serviceLikelyDependsOn(content, injectedService, serviceName)) {
              this.addResult({
                file: file.path,
                line: 1,
                column: 1,
                smell: 'CIRCULAR_DEPENDENCY_INJECTION',
                severity: 'HIGH',
                message: `Potential circular dependency: ${serviceName} -> ${injectedService}`,
                refactoring: 'Review dependency chain or use lazy injection with Injector',
                category: 'Architecture & Dependency Injection'
              });
            }
          }
        });
      }
    }

    // Check for @Injectable with providedIn: 'root' but used in component providers
    // This was already handled in detectProviderPollution, but we can enhance it here

    // Check for barrel exports that might create circular dependencies
    const exportStatements = content.match(/export\s+.*from\s+['"][^'"]*['"]/g) || [];
    if (exportStatements.length > 5) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'CIRCULAR_DEPENDENCY_INJECTION',
        severity: 'MEDIUM',
        message: 'Large barrel export - potential circular dependency through re-exports',
        refactoring: 'Split barrel exports or use direct imports',
        category: 'Architecture & Dependency Injection'
      });
    }
  }

  private extractDependencies(content: string): string[] {
    const dependencies: string[] = [];

    // Extract constructor dependencies
    const constructorMatch = content.match(/constructor\(\s*([^)]*)\)/);
    if (constructorMatch) {
      const params = constructorMatch[1];
      const paramMatches = params.match(/(?:private|public|protected)?\s+\w+:\s*(\w+)/g) || [];
      paramMatches.forEach(param => {
        const typeMatch = param.match(/(?:private|public|protected)?\s+\w+:\s*(\w+)/);
        if (typeMatch) dependencies.push(typeMatch[1]);
      });
    }

    // Extract inject() dependencies
    const injectMatches = content.match(/inject\(\s*(\w+)/g) || [];
    injectMatches.forEach(match => {
      const injectMatch = match.match(/inject\(\s*(\w+)/);
      if (injectMatch) dependencies.push(injectMatch[1]);
    });

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

  private calculateSubscriptionNesting(content: string): number {
    let maxDepth = 0;
    let currentDepth = 0;

    const lines = content.split('\n');
    for (const line of lines) {
      if (line.includes('.subscribe(')) {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      }

      if (line.includes('});')) {
        currentDepth = Math.max(0, currentDepth - 1);
      }
    }

    return maxDepth;
  }

  private detectInitialBundleBudgetExceeded(file: ScannedFile): void {
    const content = file.content;

    if (file.path.includes('angular.json')) {
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
            this.addResult({
              file: file.path,
              line: 1,
              column: 1,
              smell: 'INITIAL_BUNDLE_BUDGET_EXCEEDED',
              severity: 'HIGH',
              message: `Bundle budget too restrictive: ${size}${unit.toUpperCase()} - may cause build failures`,
              refactoring: 'Increase bundle budget or implement lazy loading and code splitting',
              category: 'Performance & Bundle Metrics'
            });
          }
        }
      }
    }

    // Check for common bundle-bloating patterns in source files
    if (file.type === 'component' || file.type === 'service') {
      const importMatches = content.match(/import\s+.*from\s+['"][^'"]*['"]/g) || [];
      const heavyLibraries = [
        'lodash', 'moment', 'jquery', 'rxjs', 'three', 'chart.js', 'leaflet',
        '@angular/material', '@angular/cdk', '@ngrx/store', '@ngrx/effects'
      ];

      const heavyImports = importMatches.filter(imp =>
        heavyLibraries.some(lib => imp.includes(lib))
      );

      if (heavyImports.length > 3) {
        this.addResult({
          file: file.path,
          line: 1,
          column: 1,
          smell: 'INITIAL_BUNDLE_BUDGET_EXCEEDED',
          severity: 'MEDIUM',
          message: `Multiple heavy library imports (${heavyImports.length}) - potential bundle bloat`,
          refactoring: 'Implement lazy loading or tree-shaking for unused imports',
          category: 'Performance & Bundle Metrics'
        });
      }

      // Check for missing lazy loading patterns
      if (file.path.includes('routing') || file.path.includes('routes')) {
        const loadChildrenMatch = content.match(/loadChildren\s*:/g);
        const staticImports = content.match(/import\s*\(\s*['"][^'"]*['"]\s*\)/g);

        if (!loadChildrenMatch && !staticImports && content.includes('Routes')) {
          this.addResult({
            file: file.path,
            line: 1,
            column: 1,
            smell: 'INITIAL_BUNDLE_BUDGET_EXCEEDED',
            severity: 'HIGH',
            message: 'Routes without lazy loading detected',
            refactoring: 'Use loadChildren with dynamic imports for route lazy loading',
            category: 'Performance & Bundle Metrics'
          });
        }
      }
    }
  }

  // === CONTROL FLOW DETECTORS ===

  private detectControlFlowDeprecated(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for deprecated *ngIf, *ngFor, *ngSwitch
      const deprecatedDirectives = ['*ngIf', '*ngFor', '*ngSwitch', '*ngSwitchCase', '*ngSwitchDefault'];

      deprecatedDirectives.forEach(directive => {
        if (line.includes(directive)) {
          const modernAlternative = directive.replace('*ng', '@').replace('If', 'if').replace('For', 'for').replace('Switch', 'switch');

          this.addResult({
            file: file.path,
            line: index + 1,
            column: line.indexOf(directive) + 1,
            smell: 'CONTROL_FLOW_DEPRECATED',
            severity: 'MEDIUM',
            message: `Deprecated structural directive '${directive}' detected`,
            refactoring: `Replace with modern control flow: ${modernAlternative}`,
            category: 'Template & Rendering'
          });
        }
      });
    });
  }

  private detectControlFlowDeprecatedTemplate(file: ScannedFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const deprecatedDirectives = ['*ngIf', '*ngFor', '*ngSwitch', '*ngSwitchCase', '*ngSwitchDefault'];

      deprecatedDirectives.forEach(directive => {
        if (line.includes(directive)) {
          this.addResult({
            file: file.path,
            line: index + 1,
            column: line.indexOf(directive) + 1,
            smell: 'CONTROL_FLOW_DEPRECATED',
            severity: 'MEDIUM',
            message: `Deprecated directive '${directive}' in template`,
            refactoring: 'Migrate to @if, @for, @switch control flow',
            category: 'Template & Rendering'
          });
        }
      });
    });
  }

  // === DEFER DETECTORS ===

  private detectDeferAboveFold(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('@defer') && !line.includes('viewport') && !line.includes('idle')) {
        // Check if defer is used on critical above-the-fold content
        const criticalPatterns = ['<header', '<nav', 'hero', 'banner', 'main-content'];

        if (criticalPatterns.some(pattern => content.includes(pattern))) {
          this.addResult({
            file: file.path,
            line: index + 1,
            column: line.indexOf('@defer') + 1,
            smell: 'DEFER_ABOVE_FOLD',
            severity: 'HIGH',
            message: '@defer used on potential above-the-fold content',
            refactoring: 'Only defer below-the-fold content; critical content should load immediately',
            category: 'Performance & Bundle Metrics'
          });
        }
      }
    });
  }

  private detectDeferErrorBlocks(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('@defer')) {
        // Check if defer has error block
        const deferBlockStart = index;
        let hasErrorBlock = false;

        for (let i = index; i < Math.min(index + 20, lines.length); i++) {
          if (lines[i].includes('@error')) {
            hasErrorBlock = true;
            break;
          }
          if (lines[i].includes('}') && !lines[i].includes('@')) {
            break;
          }
        }

        if (!hasErrorBlock) {
          this.addResult({
            file: file.path,
            line: index + 1,
            column: line.indexOf('@defer') + 1,
            smell: 'DEFER_ERROR_BLOCKS',
            severity: 'MEDIUM',
            message: '@defer without @error block - no error handling',
            refactoring: 'Add @error block to handle deferred loading failures',
            category: 'Template & Rendering'
          });
        }
      }
    });
  }

  private detectDeferNonStandalone(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;

    if (content.includes('@defer') && content.includes('standalone: false')) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'DEFER_NON_STANDALONE',
        severity: 'HIGH',
        message: '@defer used in non-standalone component',
        refactoring: 'Convert to standalone component or avoid @defer',
        category: 'Architecture & Dependency Injection'
      });
    }
  }

  // === FORMS DETECTORS ===

  private detectFormsMixed(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;

    const hasNgModel = content.includes('[(ngModel)]') || content.includes('ngModel');
    const hasFormControl = content.includes('[formControl]') || content.includes('formControlName');

    if (hasNgModel && hasFormControl) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'FORMS_MIXED',
        severity: 'CRITICAL',
        message: 'Mixing template-driven and reactive forms',
        refactoring: 'Choose one approach: either template-driven (ngModel) or reactive (formControl)',
        category: 'Forms & Validation'
      });
    }
  }

  private detectFormsTyped(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for untyped FormGroup, FormControl, FormArray
      if (line.includes('FormGroup') && !line.includes('<') && line.includes('=')) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: line.indexOf('FormGroup') + 1,
          smell: 'FORMS_TYPED',
          severity: 'MEDIUM',
          message: 'Untyped FormGroup detected',
          refactoring: 'Use typed forms: FormGroup<T>',
          category: 'Forms & Validation'
        });
      }

      if (line.includes('FormControl') && !line.includes('<') && line.includes('=') && !line.includes('FormControl(')) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: line.indexOf('FormControl') + 1,
          smell: 'FORMS_TYPED',
          severity: 'MEDIUM',
          message: 'Untyped FormControl detected',
          refactoring: 'Use typed forms: FormControl<T>',
          category: 'Forms & Validation'
        });
      }
    });
  }

  private detectFormsValueChanges(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('.valueChanges.subscribe(')) {
        // Check if unsubscribed
        const hasUnsubscribe = content.includes('unsubscribe()') ||
                              content.includes('takeUntil(') ||
                              content.includes('async');

        if (!hasUnsubscribe) {
          this.addResult({
            file: file.path,
            line: index + 1,
            column: line.indexOf('.valueChanges') + 1,
            smell: 'FORMS_VALUE_CHANGES',
            severity: 'HIGH',
            message: 'valueChanges subscription without cleanup',
            refactoring: 'Add takeUntil or unsubscribe in ngOnDestroy',
            category: 'Forms & Validation'
          });
        }
      }
    });
  }

  // === HYDRATION DETECTORS ===

  private detectHydrationInvalidHtml(file: ScannedFile, analysis: any): void {
    const content = file.content;
    const lines = content.split('\n');

    // Check for invalid HTML that breaks hydration
    const invalidPatterns = [
      { pattern: /<(\w+)[^>]*>.*<\1[^>]*>/g, message: 'Nested same-tag elements' },
      { pattern: /<table[^>]*>(?!.*<tbody)/i, message: 'Table without tbody' },
      { pattern: /<p[^>]*>.*<div/i, message: 'Block element inside paragraph' }
    ];

    invalidPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(content)) {
        this.addResult({
          file: file.path,
          line: 1,
          column: 1,
          smell: 'HYDRATION_INVALID_HTML',
          severity: 'CRITICAL',
          message: `Invalid HTML structure: ${message}`,
          refactoring: 'Fix HTML structure to be valid for SSR hydration',
          category: 'Template & Rendering'
        });
      }
    });
  }

  private detectHydrationMissingEventReplay(file: ScannedFile, analysis: any): void {
    const content = file.content;

    if (content.includes('provideClientHydration()') && !content.includes('withEventReplay()')) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'HYDRATION_MISSING_EVENT_REPLAY',
        severity: 'MEDIUM',
        message: 'Client hydration without event replay enabled',
        refactoring: 'Add withEventReplay() to provideClientHydration()',
        category: 'Template & Rendering'
      });
    }
  }

  private detectHydrationIncrementalTrigger(file: ScannedFile, analysis: any): void {
    const content = file.content;

    if (content.includes('@defer') && content.includes('hydrate')) {
      // Check if using incremental hydration without proper triggers
      if (!content.includes('on viewport') && !content.includes('on idle')) {
        this.addResult({
          file: file.path,
          line: 1,
          column: 1,
          smell: 'HYDRATION_INCREMENTAL_TRIGGER',
          severity: 'MEDIUM',
          message: 'Incremental hydration without proper trigger',
          refactoring: 'Add viewport or idle trigger for deferred hydration',
          category: 'Performance & Bundle Metrics'
        });
      }
    }
  }

  // === MISSING ASYNC PIPE DETECTOR ===

  private detectMissingAsyncPipe(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    // Look for Observable subscriptions that could use async pipe
    lines.forEach((line, index) => {
      if (line.includes('.subscribe(') && !line.includes('//')) {
        // Check if this is in a component that has a template
        const hasTemplate = content.includes('template:') || content.includes('templateUrl:');

        if (hasTemplate) {
          // Check if observable is assigned to a property that could be used in template
          const propertyMatch = line.match(/this\.(\w+)\s*=.*\.subscribe/);
          if (propertyMatch) {
            this.addResult({
              file: file.path,
              line: index + 1,
              column: line.indexOf('.subscribe(') + 1,
              smell: 'MISSING_ASYNC_PIPE',
              severity: 'MEDIUM',
              message: 'Manual subscription where async pipe could be used',
              refactoring: 'Use async pipe in template instead of manual subscription',
              category: 'Reactivity & Signals'
            });
          }
        }
      }
    });
  }

  // === NGRX DETECTORS ===

  private detectNgrxEffectsIssues(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for effects without proper error handling
      if (line.includes('createEffect(')) {
        let hasErrorHandling = false;

        for (let i = index; i < Math.min(index + 10, lines.length); i++) {
          if (lines[i].includes('catchError') || lines[i].includes('retry')) {
            hasErrorHandling = true;
            break;
          }
        }

        if (!hasErrorHandling) {
          this.addResult({
            file: file.path,
            line: index + 1,
            column: line.indexOf('createEffect(') + 1,
            smell: 'NGRX_EFFECTS_ISSUES',
            severity: 'HIGH',
            message: 'Effect without error handling',
            refactoring: 'Add catchError operator to handle errors',
            category: 'State Management'
          });
        }
      }

      // Check for effects that dispatch actions in subscribe
      if (line.includes('.subscribe(') && content.includes('createEffect(')) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: line.indexOf('.subscribe(') + 1,
          smell: 'NGRX_EFFECTS_ISSUES',
          severity: 'HIGH',
          message: 'Manual subscription in effects file',
          refactoring: 'Use effect operator instead of manual subscribe',
          category: 'State Management'
        });
      }
    });
  }

  private detectNgrxMissingMemoization(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for selectors without createSelector
      if (line.includes('select(') && !content.includes('createSelector')) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: line.indexOf('select(') + 1,
          smell: 'NGRX_MISSING_MEMOIZATION',
          severity: 'MEDIUM',
          message: 'Selector without memoization',
          refactoring: 'Use createSelector for memoized selectors',
          category: 'State Management'
        });
      }

      // Check for inline state transformations
      if (line.includes('.pipe(map(') && line.includes('state =>')) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: line.indexOf('.pipe(map(') + 1,
          smell: 'NGRX_MISSING_MEMOIZATION',
          severity: 'MEDIUM',
          message: 'Inline state transformation without memoization',
          refactoring: 'Create memoized selector with createSelector',
          category: 'State Management'
        });
      }
    });
  }

  private detectNgrxNonNormalizedState(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;

    // Check for nested arrays or objects in state
    const nestedArrayPattern = /:\s*\w+\[\]\[\]/g;
    const nestedObjectPattern = /:\s*{\s*\w+:\s*{/g;

    if (nestedArrayPattern.test(content) || nestedObjectPattern.test(content)) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'NGRX_NON_NORMALIZED_STATE',
        severity: 'HIGH',
        message: 'Deeply nested state structure detected',
        refactoring: 'Normalize state using entity pattern',
        category: 'State Management'
      });
    }
  }

  private detectNgrxOverSelecting(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const selectCalls = (content.match(/\.select\(/g) || []).length;

    if (selectCalls > 5) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'NGRX_OVER_SELECTING',
        severity: 'MEDIUM',
        message: `Too many select calls (${selectCalls}) in single component`,
        refactoring: 'Create combined selector or use facade pattern',
        category: 'State Management'
      });
    }
  }

  private detectNgrxStateMutation(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for direct state mutations in reducers
      if (line.includes('state.') && (line.includes('.push(') || line.includes('.pop(') ||
          line.includes('.splice(') || line.includes('='))) {
        if (content.includes('on(') || content.includes('createReducer')) {
          this.addResult({
            file: file.path,
            line: index + 1,
            column: line.indexOf('state.') + 1,
            smell: 'NGRX_STATE_MUTATION',
            severity: 'CRITICAL',
            message: 'Direct state mutation in reducer',
            refactoring: 'Return new state object instead of mutating',
            category: 'State Management'
          });
        }
      }
    });
  }

  // === ONPUSH DETECTOR ===

  private detectOnPushMisuse(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    const hasOnPush = content.includes('ChangeDetectionStrategy.OnPush');

    if (hasOnPush) {
      // Check for mutable property assignments
      lines.forEach((line, index) => {
        if (line.includes('this.') && line.includes('.push(')) {
          this.addResult({
            file: file.path,
            line: index + 1,
            column: line.indexOf('.push(') + 1,
            smell: 'ONPUSH_MISUSE',
            severity: 'HIGH',
            message: 'Array mutation in OnPush component',
            refactoring: 'Create new array reference for change detection',
            category: 'Performance & Bundle Metrics'
          });
        }

        if (line.includes('this.') && line.includes('++')) {
          this.addResult({
            file: file.path,
            line: index + 1,
            column: line.indexOf('++') + 1,
            smell: 'ONPUSH_MISUSE',
            severity: 'HIGH',
            message: 'Property mutation in OnPush component',
            refactoring: 'Use immutable updates for change detection',
            category: 'Performance & Bundle Metrics'
          });
        }
      });
    }
  }

  // === ROUTING DETECTORS ===

  private detectRoutingFunctionalGuards(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for class-based guards
      if (line.includes('implements CanActivate') || line.includes('implements CanDeactivate')) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: 1,
          smell: 'ROUTING_FUNCTIONAL_GUARDS',
          severity: 'MEDIUM',
          message: 'Class-based guard instead of functional guard',
          refactoring: 'Use functional guards: canActivateFn, canDeactivateFn',
          category: 'Routing & Navigation'
        });
      }
    });
  }

  private detectRoutingGuards(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;

    // Check for missing guards on protected routes
    if (content.includes('path:') && content.includes('admin')) {
      if (!content.includes('canActivate') && !content.includes('canMatch')) {
        this.addResult({
          file: file.path,
          line: 1,
          column: 1,
          smell: 'ROUTING_GUARDS',
          severity: 'HIGH',
          message: 'Protected route without guard',
          refactoring: 'Add canActivate or canMatch guard',
          category: 'Routing & Navigation'
        });
      }
    }
  }

  private detectRoutingInputBinding(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;

    if (content.includes('ActivatedRoute') && content.includes('.params.subscribe(')) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'ROUTING_INPUT_BINDING',
        severity: 'MEDIUM',
        message: 'Manual route params subscription',
        refactoring: 'Use @Input() with route data binding',
        category: 'Routing & Navigation'
      });
    }
  }

  private detectRoutingLazyLoading(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('component:') && !line.includes('loadChildren') && content.includes('Routes')) {
        // Check if this is a feature route that should be lazy loaded
        const featurePatterns = ['admin', 'dashboard', 'settings', 'profile'];

        if (featurePatterns.some(pattern => content.toLowerCase().includes(pattern))) {
          this.addResult({
            file: file.path,
            line: index + 1,
            column: 1,
            smell: 'ROUTING_LAZY_LOADING',
            severity: 'MEDIUM',
            message: 'Feature route without lazy loading',
            refactoring: 'Use loadChildren with dynamic import',
            category: 'Performance & Bundle Metrics'
          });
        }
      }
    });
  }

  private detectRoutingOrder(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    let foundWildcard = false;
    let wildcardLine = 0;

    lines.forEach((line, index) => {
      if (line.includes("path: '**'") || line.includes('path: "**"')) {
        foundWildcard = true;
        wildcardLine = index + 1;
      }

      if (foundWildcard && line.includes('path:') && !line.includes('**')) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: 1,
          smell: 'ROUTING_ORDER',
          severity: 'CRITICAL',
          message: 'Route defined after wildcard route',
          refactoring: 'Move wildcard route to end of routes array',
          category: 'Routing & Navigation'
        });
      }
    });
  }

  // === SIGNALS DETECTORS ===

  private detectSignalsEffectDerivation(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('effect(') && (line.includes('return') || line.includes('=>'))) {
        // Effects should not return values - use computed instead
        this.addResult({
          file: file.path,
          line: index + 1,
          column: line.indexOf('effect(') + 1,
          smell: 'SIGNALS_EFFECT_DERIVATION',
          severity: 'HIGH',
          message: 'Effect used for derivation instead of computed',
          refactoring: 'Use computed() for derived values',
          category: 'Reactivity & Signals'
        });
      }
    });
  }

  private detectSignalsLinkedsignalOveruse(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const linkedSignalCount = (content.match(/linkedSignal\(/g) || []).length;

    if (linkedSignalCount > 3) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'SIGNALS_LINKEDSIGNAL_OVERUSE',
        severity: 'MEDIUM',
        message: `Excessive linkedSignal usage (${linkedSignalCount})`,
        refactoring: 'Consider using computed() or model() instead',
        category: 'Reactivity & Signals'
      });
    }
  }

  private detectSignalsResourceRace(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('resource(') && !content.includes('abortSignal')) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: line.indexOf('resource(') + 1,
          smell: 'SIGNALS_RESOURCE_RACE',
          severity: 'MEDIUM',
          message: 'Resource without abort signal',
          refactoring: 'Add abortSignal to prevent race conditions',
          category: 'Reactivity & Signals'
        });
      }
    });
  }

  // === TESTING DETECTORS ===

  private detectTestingAsync(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('async(') && line.includes('it(')) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: line.indexOf('async(') + 1,
          smell: 'TESTING_ASYNC',
          severity: 'LOW',
          message: 'Deprecated async() wrapper in test',
          refactoring: 'Use waitForAsync() instead',
          category: 'Testing'
        });
      }
    });
  }

  private detectTestingDeferBehavior(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;

    if (content.includes('@defer') && !content.includes('DeferBlockFixture')) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'TESTING_DEFER_BEHAVIOR',
        severity: 'MEDIUM',
        message: 'Defer block without proper test setup',
        refactoring: 'Use DeferBlockFixture to test defer behavior',
        category: 'Testing'
      });
    }
  }

  private detectTestingFakeasyncZonless(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;

    if (content.includes('fakeAsync(') && content.includes('provideExperimentalZonelessChangeDetection()')) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'TESTING_FAKEASYNC_ZONLESS',
        severity: 'HIGH',
        message: 'fakeAsync used with zoneless change detection',
        refactoring: 'Remove fakeAsync or use zone-based testing',
        category: 'Testing'
      });
    }
  }

  private detectTestingFlushEffects(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;

    if (content.includes('effect(') && !content.includes('TestBed.flushEffects()')) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'TESTING_FLUSH_EFFECTS',
        severity: 'MEDIUM',
        message: 'Signal effects without flushEffects in test',
        refactoring: 'Call TestBed.flushEffects() to stabilize effects',
        category: 'Testing'
      });
    }
  }

  private detectTestingImplementation(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for testing implementation details
      if (line.includes('.nativeElement') && line.includes('click()')) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: line.indexOf('.nativeElement') + 1,
          smell: 'TESTING_IMPLEMENTATION',
          severity: 'LOW',
          message: 'Testing implementation details',
          refactoring: 'Test user behavior, not implementation',
          category: 'Testing'
        });
      }

      if (line.includes('fixture.componentInstance.') && !line.includes('Input')) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: 1,
          smell: 'TESTING_IMPLEMENTATION',
          severity: 'LOW',
          message: 'Direct access to component internals',
          refactoring: 'Test through public API only',
          category: 'Testing'
        });
      }
    });
  }

  private detectTestingSignalInputMutation(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('input()') && line.includes('.set(')) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: line.indexOf('.set(') + 1,
          smell: 'TESTING_SIGNAL_INPUT_MUTATION',
          severity: 'HIGH',
          message: 'Attempting to mutate signal input in test',
          refactoring: 'Use setInput() or fixture properties',
          category: 'Testing'
        });
      }
    });
  }

  private detectTestingTestbed(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;

    if (content.includes('TestBed.') && !content.includes('TestBed.inject')) {
      if (content.includes('new ') && content.includes('Service')) {
        this.addResult({
          file: file.path,
          line: 1,
          column: 1,
          smell: 'TESTING_TESTBED',
          severity: 'MEDIUM',
          message: 'Manual service instantiation instead of TestBed',
          refactoring: 'Use TestBed.inject() for dependency injection',
          category: 'Testing'
        });
      }
    }
  }

  private detectTestingZonelessObservableSubscriptions(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;

    if (content.includes('provideExperimentalZonelessChangeDetection()') &&
        content.includes('.subscribe(')) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'TESTING_ZONLESS_OBSERVABLE_SUBSCRIPTIONS',
        severity: 'MEDIUM',
        message: 'Observable subscription in zoneless test',
        refactoring: 'Use fixture.detectChanges() or signals',
        category: 'Testing'
      });
    }
  }

  // === TYPESCRIPT DETECTORS ===

  private detectTypescriptAny(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes(': any') || line.includes('<any>') || line.includes('as any')) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: line.indexOf('any') + 1,
          smell: 'TYPESCRIPT_ANY',
          severity: 'MEDIUM',
          message: 'Usage of any type defeats type safety',
          refactoring: 'Define proper type or use unknown',
          category: 'TypeScript'
        });
      }
    });
  }

  private detectTypescriptNonNull(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('!.') || line.includes('!)')) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: line.indexOf('!') + 1,
          smell: 'TYPESCRIPT_NON_NULL',
          severity: 'MEDIUM',
          message: 'Non-null assertion operator used',
          refactoring: 'Add proper null checks or optional chaining',
          category: 'TypeScript'
        });
      }
    });
  }

  // === ZONELESS DETECTORS ===

  private detectZonlessNgzoneStable(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;

    if (content.includes('provideExperimentalZonelessChangeDetection()') &&
        content.includes('NgZone.onStable')) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'ZONLESS_NGZONE_STABLE',
        severity: 'HIGH',
        message: 'Using NgZone in zoneless app',
        refactoring: 'Remove NgZone usage in zoneless mode',
        category: 'Performance & Bundle Metrics'
      });
    }
  }

  private detectZonlessObservableSubscriptions(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;

    if (content.includes('provideExperimentalZonelessChangeDetection()') &&
        content.includes('.subscribe(')) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'ZONLESS_OBSERVABLE_SUBSCRIPTIONS',
        severity: 'MEDIUM',
        message: 'Observable subscription in zoneless app',
        refactoring: 'Use async pipe or signals instead',
        category: 'Performance & Bundle Metrics'
      });
    }
  }

  private detectZonlessTimerUpdates(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    if (content.includes('provideExperimentalZonelessChangeDetection()')) {
      lines.forEach((line, index) => {
        if (line.includes('setInterval') || line.includes('setTimeout')) {
          this.addResult({
            file: file.path,
            line: index + 1,
            column: 1,
            smell: 'ZONLESS_TIMER_UPDATES',
            severity: 'HIGH',
            message: 'Timer without change detection in zoneless app',
            refactoring: 'Call ChangeDetectorRef.markForCheck() after timer',
            category: 'Performance & Bundle Metrics'
          });
        }
      });
    }
  }

  // === SUBJECT MISUSE DETECTOR ===

  private detectSubjectMisuse(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for public Subject exposure
      if (line.includes('public') && (line.includes('Subject<') || line.includes('BehaviorSubject<'))) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: 1,
          smell: 'SUBJECT_MISUSE',
          severity: 'MEDIUM',
          message: 'Public Subject exposure',
          refactoring: 'Expose as Observable, keep Subject private',
          category: 'Reactivity & Signals'
        });
      }

      // Check for ReplaySubject with unbounded buffer
      if (line.includes('ReplaySubject()') || line.includes('ReplaySubject<>()')) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: line.indexOf('ReplaySubject') + 1,
          smell: 'SUBJECT_MISUSE',
          severity: 'HIGH',
          message: 'ReplaySubject without buffer limit',
          refactoring: 'Specify buffer size: new ReplaySubject(1)',
          category: 'Reactivity & Signals'
        });
      }
    });
  }

  // === SWITCHMAP DATA LOSS DETECTOR ===

  private detectSwitchmapDataLoss(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('switchMap(') && (content.includes('form') || content.includes('input'))) {
        // Check if dealing with form/user input that might cause data loss
        this.addResult({
          file: file.path,
          line: index + 1,
          column: line.indexOf('switchMap(') + 1,
          smell: 'SWITCHMAP_DATA_LOSS',
          severity: 'MEDIUM',
          message: 'switchMap may cancel in-flight requests',
          refactoring: 'Consider exhaustMap or concatMap for sequential processing',
          category: 'Reactivity & Signals'
        });
      }
    });
  }

  // === SMART DUMB VIOLATION DETECTOR ===

  private detectSmartDumbViolation(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;

    // Check for components with both store/service and presentation logic
    const hasStoreOrService = content.includes('inject(Store)') || content.includes('inject(') ||
                              content.includes('constructor(') && content.includes('Service');
    const hasTemplate = content.includes('template:') || content.includes('templateUrl:');
    const hasInputs = content.includes('@Input()');
    const hasOutputs = content.includes('@Output()');

    if (hasStoreOrService && hasInputs && hasOutputs) {
      this.addResult({
        file: file.path,
        line: 1,
        column: 1,
        smell: 'SMART_DUMB_VIOLATION',
        severity: 'MEDIUM',
        message: 'Component has both data access and presentation',
        refactoring: 'Split into smart (container) and dumb (presentational) components',
        category: 'Architecture & Dependency Injection'
      });
    }
  }

  // === TEMPLATE METHOD CALL DETECTOR ===

  private detectTemplateMethodCall(file: ScannedFile, sourceFile: ts.SourceFile): void {
    const content = file.content;
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Look for method calls in template bindings
      const templateMethodPattern = /\{\{\s*\w+\([^}]*\)\s*\}\}|\[\w+\]\s*=\s*["\'].*\([^"']*\)[^"']*["']/g;

      if (templateMethodPattern.test(line)) {
        this.addResult({
          file: file.path,
          line: index + 1,
          column: 1,
          smell: 'TEMPLATE_METHOD_CALL',
          severity: 'HIGH',
          message: 'Method call in template binding',
          refactoring: 'Use signals, computed, or pure pipes',
          category: 'Template & Rendering'
        });
      }
    });
  }

  private addResult(result: DetectionResult): void {
    this.results.push(result);
  }
}