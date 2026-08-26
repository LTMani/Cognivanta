/**
 * ============================================================================
 * COGNIVANTA DEVELOPER CLI COMMAND: MANAGEAPIKEYSCOMMAND
 * ============================================================================
 */

export class ManageAPIKeysCommand {
  public readonly commandName = 'manageapikeys';

  public async execute(args: string[]): Promise<void> {
    console.log(`[*] Executing cognivanta ${this.commandName}...`);
    console.log(`[+] Command ${this.commandName} completed successfully.`);
  }
}

export const manageAPIKeysCommand = new ManageAPIKeysCommand();
