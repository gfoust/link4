
export interface RegisterPotentialMove {
  type: 'RegisterPotentialMove';
  column: number;
}

export function registerPotentialMove(column: number): RegisterPotentialMove {
  return {
    type: 'RegisterPotentialMove',
    column,
  };
}

export type Action = RegisterPotentialMove;
