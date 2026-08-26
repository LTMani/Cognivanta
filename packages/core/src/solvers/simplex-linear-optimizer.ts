/**
 * ============================================================================
 * COGNIVANTA SIMPLEX LINEAR PROGRAMMING OPTIMIZER
 * ============================================================================
 * Solves linear programming optimization problems for token budget allocation
 * and compute resource scheduling: Maximize c^T * x subject to A * x <= b, x >= 0.
 */

export class SimplexOptimizer {
  public static maximize(
    objectiveCoefficients: number[],
    constraintMatrix: number[][],
    constraintBounds: number[]
  ): { optimalValue: number; solution: number[]; isFeasible: boolean } {
    const numConstraints = constraintMatrix.length;
    if (numConstraints === 0) return { optimalValue: 0, solution: [], isFeasible: true };
    const numVariables = objectiveCoefficients.length;

    // Build Simplex Tableau
    const tableau: number[][] = [];
    for (let i = 0; i < numConstraints; i++) {
      const row: number[] = [...constraintMatrix[i]];
      // Slack variables
      for (let s = 0; s < numConstraints; s++) {
        row.push(s === i ? 1 : 0);
      }
      row.push(constraintBounds[i]);
      tableau.push(row);
    }

    // Objective row (negated for maximization)
    const objRow: number[] = objectiveCoefficients.map(c => -c);
    for (let s = 0; s <= numConstraints; s++) objRow.push(0);
    tableau.push(objRow);

    const totalCols = numVariables + numConstraints + 1;
    let iteration = 0;
    const maxIterations = 50;

    while (iteration < maxIterations) {
      iteration++;

      // Find entering column (most negative coefficient in objective row)
      let enteringCol = -1;
      let minVal = 0;
      for (let c = 0; c < totalCols - 1; c++) {
        if (tableau[numConstraints][c] < minVal) {
          minVal = tableau[numConstraints][c];
          enteringCol = c;
        }
      }

      if (enteringCol === -1) break; // Optimal found

      // Find leaving row (minimum positive ratio)
      let leavingRow = -1;
      let minRatio = Infinity;
      for (let r = 0; r < numConstraints; r++) {
        const val = tableau[r][enteringCol];
        if (val > 0) {
          const ratio = tableau[r][totalCols - 1] / val;
          if (ratio < minRatio) {
            minRatio = ratio;
            leavingRow = r;
          }
        }
      }

      if (leavingRow === -1) {
        return { optimalValue: Infinity, solution: [], isFeasible: false }; // Unbounded
      }

      // Pivot operation
      const pivotVal = tableau[leavingRow][enteringCol];
      for (let c = 0; c < totalCols; c++) {
        tableau[leavingRow][c] /= pivotVal;
      }

      for (let r = 0; r <= numConstraints; r++) {
        if (r !== leavingRow) {
          const factor = tableau[r][enteringCol];
          for (let c = 0; c < totalCols; c++) {
            tableau[r][c] -= factor * tableau[leavingRow][c];
          }
        }
      }
    }

    const solution: number[] = new Array(numVariables).fill(0);
    for (let c = 0; c < numVariables; c++) {
      let isBasic = true;
      let oneRow = -1;
      for (let r = 0; r < numConstraints; r++) {
        if (Math.abs(tableau[r][c] - 1) < 0.0001 && oneRow === -1) {
          oneRow = r;
        } else if (Math.abs(tableau[r][c]) > 0.0001) {
          isBasic = false;
        }
      }
      if (isBasic && oneRow !== -1) {
        solution[c] = Number(tableau[oneRow][totalCols - 1].toFixed(4));
      }
    }

    const optimalValue = Number(tableau[numConstraints][totalCols - 1].toFixed(4));
    return { optimalValue, solution, isFeasible: true };
  }
}
