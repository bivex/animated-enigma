import { parseTemplate, Lexer, Parser } from '@angular/compiler';

export interface TemplateAnalysis {
  hasTrackBy: boolean;
  ngForCount: number;
  functionCalls: Array<{expression: string, line: number, column: number}>;
  unsafeInnerHtml: boolean;
  nestedAnchors: boolean;
  dynamicContent: boolean;
  structuralDirectives: Array<{name: string, value: string}>;
}

export class TemplateParser {
  parse(templateContent: string): TemplateAnalysis {
    const analysis: TemplateAnalysis = {
      hasTrackBy: false,
      ngForCount: 0,
      functionCalls: [],
      unsafeInnerHtml: false,
      nestedAnchors: false,
      dynamicContent: false,
      structuralDirectives: []
    };

    try {
      // Basic HTML analysis first
      this.analyzeHtmlStructure(templateContent, analysis);

      // Try Angular template parsing
      const result = parseTemplate(templateContent, 'test.html');
      if (result.errors && result.errors.length > 0) {
        console.warn('Template parsing errors:', result.errors);
      }

      if (result.nodes) {
        this.analyzeAstNodes(result.nodes, analysis);
      }

    } catch (error) {
      console.warn('Template parsing failed, falling back to regex analysis:', error);
      // Fallback to regex analysis
      this.fallbackAnalysis(templateContent, analysis);
    }

    return analysis;
  }

  private analyzeHtmlStructure(content: string, analysis: TemplateAnalysis): void {
    // Check for unsafe innerHTML
    if (content.includes('[innerHTML]')) {
      analysis.unsafeInnerHtml = true;
    }

    // Check for nested anchor tags using normalized HTML
    let anchorDepth = 0;
    let nestedFound = false;

    // Normalize HTML by removing extra whitespace and newlines
    const normalizedContent = content.replace(/\s+/g, ' ').replace(/>\s+</g, '><');

    // Simple HTML parser to detect nested anchors
    const tagRegex = /<\/?a[^>]*>/gi;
    let match;
    while ((match = tagRegex.exec(normalizedContent)) !== null) {
      const tag = match[0].trim(); // Trim whitespace
      if (tag.startsWith('<a') && !tag.includes('</a>')) {
        // Opening anchor tag
        anchorDepth++;
        if (anchorDepth > 1) {
          nestedFound = true;
          break;
        }
      } else if (tag.startsWith('</a')) {
        // Closing anchor tag (handles </a> and </a >)
        anchorDepth--;
      }
    }

    if (nestedFound) {
      analysis.nestedAnchors = true;
    }

    // Check for dynamic/random content
    if (content.includes('Math.random()') ||
        content.includes('Date.now()') ||
        content.includes('new Date()')) {
      analysis.dynamicContent = true;
    }

    // Count *ngFor directives
    const ngForMatches = content.match(/\*ngFor/g);
    analysis.ngForCount = ngForMatches ? ngForMatches.length : 0;

    // Check for trackBy functions
    if (content.includes('trackBy:')) {
      analysis.hasTrackBy = true;
    }
  }

  private analyzeAstNodes(nodes: any[], analysis: TemplateAnalysis): void {
    for (const node of nodes) {
      this.analyzeNode(node, analysis);
    }
  }

  private analyzeNode(node: any, analysis: TemplateAnalysis): void {
    // Handle element nodes
    if (node.type === 1) { // Element
      // Check for structural directives
      if (node.attrs) {
        for (const attr of node.attrs) {
          if (attr.name.startsWith('*')) {
            analysis.structuralDirectives.push({
              name: attr.name,
              value: attr.value
            });
          }
        }
      }

      // Recursively analyze children
      if (node.children) {
        this.analyzeAstNodes(node.children, analysis);
      }
    }

    // Handle bound attributes and text nodes
    if (node.type === 0 || node.type === 2) { // Text or BoundText
      if (node.value && typeof node.value === 'string') {
        this.analyzeExpression(node.value, analysis);
      }
    }

    // Handle bound attributes
    if (node.type === 3) { // BoundAttribute
      if (node.value) {
        this.analyzeExpression(node.value, analysis);
      }
    }
  }

  private analyzeExpression(expression: string, analysis: TemplateAnalysis): void {
    // Look for function calls
    const functionCallRegex = /\b\w+\s*\(/g;
    const matches = expression.match(functionCallRegex);

    if (matches) {
      // Filter out Angular built-ins and common safe calls
      const unsafeCalls = matches.filter(call =>
        !this.isSafeCall(call.trim())
      );

      if (unsafeCalls.length > 0) {
        analysis.functionCalls.push({
          expression: expression.trim(),
          line: 0, // Would need source map for accurate line numbers
          column: 0
        });
      }
    }
  }

  private isSafeCall(call: string): boolean {
    const safeCalls = [
      'async',
      'json',
      'trackBy',
      'index',
      'count',
      'first',
      'last',
      'even',
      'odd'
    ];

    return safeCalls.some(safe => call.startsWith(safe));
  }

  private fallbackAnalysis(content: string, analysis: TemplateAnalysis): void {
    // Enhanced regex-based analysis when AST parsing fails

    // Function calls in interpolation
    const interpolationRegex = /\{\{\s*([^}]+)\s*\}\}/g;
    let match;

    while ((match = interpolationRegex.exec(content)) !== null) {
      const expression = match[1];
      if (expression.includes('(') && expression.includes(')')) {
        analysis.functionCalls.push({
          expression: expression.trim(),
          line: this.getLineNumber(content, match.index),
          column: match.index - content.lastIndexOf('\n', match.index)
        });
      }
    }

    // Structural directives
    const structuralRegex = /\*(\w+)="([^"]*)"/g;
    while ((match = structuralRegex.exec(content)) !== null) {
      analysis.structuralDirectives.push({
        name: `*${match[1]}`,
        value: match[2]
      });
    }
  }

  private getLineNumber(content: string, index: number): number {
    const beforeIndex = content.substring(0, index);
    return (beforeIndex.match(/\n/g) || []).length + 1;
  }
}