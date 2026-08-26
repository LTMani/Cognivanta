/**
 * ============================================================================
 * COGNIVANTA DEVELOPER CLI COMMAND: LOGOUTCOMMAND
 * ============================================================================
 */

export class LogoutCommand {
  public readonly commandName = 'logout';

  public async execute(args: string[]): Promise<void> {
    console.log(`[*] Executing cognivanta ${this.commandName}...`);
    console.log(`[+] Command ${this.commandName} completed successfully.`);
  }
}

export const logoutCommand = new LogoutCommand();
