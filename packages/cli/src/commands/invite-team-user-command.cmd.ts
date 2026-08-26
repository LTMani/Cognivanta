/**
 * ============================================================================
 * COGNIVANTA DEVELOPER CLI COMMAND: INVITETEAMUSERCOMMAND
 * ============================================================================
 */

export class InviteTeamUserCommand {
  public readonly commandName = 'inviteteamuser';

  public async execute(args: string[]): Promise<void> {
    console.log(`[*] Executing cognivanta ${this.commandName}...`);
    console.log(`[+] Command ${this.commandName} completed successfully.`);
  }
}

export const inviteTeamUserCommand = new InviteTeamUserCommand();
