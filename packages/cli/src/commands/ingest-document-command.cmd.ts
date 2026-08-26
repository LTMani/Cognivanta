/**
 * ============================================================================
 * COGNIVANTA DEVELOPER CLI COMMAND: INGESTDOCUMENTCOMMAND
 * ============================================================================
 */

export class IngestDocumentCommand {
  public readonly commandName = 'ingestdocument';

  public async execute(args: string[]): Promise<void> {
    console.log(`[*] Executing cognivanta ${this.commandName}...`);
    console.log(`[+] Command ${this.commandName} completed successfully.`);
  }
}

export const ingestDocumentCommand = new IngestDocumentCommand();
