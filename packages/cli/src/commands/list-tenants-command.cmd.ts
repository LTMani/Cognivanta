/**
 * ============================================================================
 * COGNIVANTA DEVELOPER CLI COMMAND: LISTTENANTSCOMMAND
 * ============================================================================
 */

export class ListTenantsCommand {
  public readonly commandName = 'listtenants';

  public async execute(args: string[]): Promise<void> {
    console.log(`[*] Executing cognivanta ${this.commandName}...`);
    console.log(`[+] Command ${this.commandName} completed successfully.`);
  }
}

export const listTenantsCommand = new ListTenantsCommand();
