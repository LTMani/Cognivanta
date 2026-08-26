/**
 * ============================================================================
 * COGNIVANTA MARKOV DECISION PROCESS (MDP) VALUE ITERATION SOLVER
 * ============================================================================
 */

export interface MDPState {
  id: string;
  name: string;
  transitions: Array<{ action: string; nextState: string; probability: number; reward: number }>;
}

export class MDPSolver {
  public static valueIteration(
    states: MDPState[],
    discountFactor: number = 0.9,
    tolerance: number = 0.001
  ): Map<string, { value: number; bestAction: string }> {
    const values = new Map<string, number>();
    const policy = new Map<string, string>();

    for (const s of states) {
      values.set(s.id, 0);
      policy.set(s.id, '');
    }

    let delta = Infinity;
    let iteration = 0;

    while (delta > tolerance && iteration < 100) {
      iteration++;
      delta = 0;

      for (const s of states) {
        const v = values.get(s.id)!;
        let maxQ = -Infinity;
        let bestA = '';

        // Group transitions by action
        const actionMap = new Map<string, Array<{ nextState: string; probability: number; reward: number }>>();
        for (const t of s.transitions) {
          if (!actionMap.has(t.action)) actionMap.set(t.action, []);
          actionMap.get(t.action)!.push(t);
        }

        for (const [action, transList] of actionMap.entries()) {
          let q = 0;
          for (const t of transList) {
            q += t.probability * (t.reward + discountFactor * (values.get(t.nextState) || 0));
          }
          if (q > maxQ) {
            maxQ = q;
            bestA = action;
          }
        }

        if (maxQ !== -Infinity) {
          values.set(s.id, maxQ);
          policy.set(s.id, bestA);
          delta = Math.max(delta, Math.abs(v - maxQ));
        }
      }
    }

    const result = new Map<string, { value: number; bestAction: string }>();
    for (const s of states) {
      result.set(s.id, {
        value: Number((values.get(s.id) || 0).toFixed(4)),
        bestAction: policy.get(s.id) || 'default'
      });
    }

    return result;
  }
}
