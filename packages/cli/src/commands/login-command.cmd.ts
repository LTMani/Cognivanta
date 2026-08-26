/**
 * ============================================================================
 * COGNIVANTA DEVELOPER CLI COMMAND: LOGINCOMMAND
 * ============================================================================
 */

export class LoginCommand {
  public readonly commandName = 'login';

  public async execute(args: string[]): Promise<void> {
    console.log(`[*] Executing cognivanta ${this.commandName}...`);
    console.log(`[+] Command ${this.commandName} completed successfully.`);
  }
}

export const loginCommand = new LoginCommand();
