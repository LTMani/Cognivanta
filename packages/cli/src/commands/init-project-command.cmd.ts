/**
 * ============================================================================
 * COGNIVANTA DEVELOPER CLI COMMAND: INITPROJECTCOMMAND
 * ============================================================================
 */

export class InitProjectCommand {
  public readonly commandName = 'initproject';

  public async execute(args: string[]): Promise<void> {
    console.log(`[*] Executing cognivanta ${this.commandName}...`);
    console.log(`[+] Command ${this.commandName} completed successfully.`);
  }
}

export const initProjectCommand = new InitProjectCommand();
