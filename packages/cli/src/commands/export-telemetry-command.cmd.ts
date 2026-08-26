/**
 * ============================================================================
 * COGNIVANTA DEVELOPER CLI COMMAND: EXPORTTELEMETRYCOMMAND
 * ============================================================================
 */

export class ExportTelemetryCommand {
  public readonly commandName = 'exporttelemetry';

  public async execute(args: string[]): Promise<void> {
    console.log(`[*] Executing cognivanta ${this.commandName}...`);
    console.log(`[+] Command ${this.commandName} completed successfully.`);
  }
}

export const exportTelemetryCommand = new ExportTelemetryCommand();
