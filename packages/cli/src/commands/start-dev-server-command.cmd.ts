/**
 * ============================================================================
 * COGNIVANTA DEVELOPER CLI COMMAND: STARTDEVSERVERCOMMAND
 * ============================================================================
 */

export class StartDevServerCommand {
  public readonly commandName = 'startdevserver';

  public async execute(args: string[]): Promise<void> {
    console.log(`[*] Executing cognivanta ${this.commandName}...`);
    console.log(`[+] Command ${this.commandName} completed successfully.`);
  }
}

export const startDevServerCommand = new StartDevServerCommand();
