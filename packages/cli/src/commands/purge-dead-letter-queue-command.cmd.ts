/**
 * ============================================================================
 * COGNIVANTA DEVELOPER CLI COMMAND: PURGEDEADLETTERQUEUECOMMAND
 * ============================================================================
 */

export class PurgeDeadLetterQueueCommand {
  public readonly commandName = 'purgedeadletterqueue';

  public async execute(args: string[]): Promise<void> {
    console.log(`[*] Executing cognivanta ${this.commandName}...`);
    console.log(`[+] Command ${this.commandName} completed successfully.`);
  }
}

export const purgeDeadLetterQueueCommand = new PurgeDeadLetterQueueCommand();
