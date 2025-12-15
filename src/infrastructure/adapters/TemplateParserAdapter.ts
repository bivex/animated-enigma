import { TemplateParser, TemplateAnalysis } from '../../parser/TemplateParser';

/**
 * Infrastructure adapter for Angular template parsing.
 * Wraps the existing TemplateParser to work with the clean architecture.
 */
export class TemplateParserAdapter {
  constructor(private readonly templateParser: TemplateParser) {}

  /**
   * Parses an Angular template and returns analysis results.
   * @param templateContent - The template content to parse
   * @returns Template analysis results
   */
  parse(templateContent: string): TemplateAnalysis {
    return this.templateParser.parse(templateContent);
  }
}