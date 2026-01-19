export type GameType = 'BGMI' | 'FREE_FIRE' | 'OTHER';

interface PlacementPoints {
  [placement: number]: number;
}

const BGMI_PLACEMENT_POINTS: PlacementPoints = {
  1: 10,
  2: 6,
  3: 5,
  4: 4,
  5: 3,
  6: 2,
  7: 1,
  8: 1,
};

const FREE_FIRE_PLACEMENT_POINTS: PlacementPoints = {
  1: 12,
  2: 9,
  3: 8,
  4: 7,
  5: 6,
  6: 5,
  7: 4,
  8: 3,
  9: 2,
  10: 1,
};

const KILL_POINTS_PER_KILL = 1;

export function identifyGameType(gameName: string): GameType {
  const normalized = gameName.toLowerCase();
  
  if (normalized.includes('bgmi') || normalized.includes('pubg') || normalized.includes('battlegrounds')) {
    return 'BGMI';
  }
  
  if (normalized.includes('free fire') || normalized.includes('freefire') || normalized.includes('ff')) {
    return 'FREE_FIRE';
  }
  
  return 'OTHER';
}

export function calculatePoints(
  gameType: GameType,
  placement: number,
  kills: number
): number {
  const killPoints = kills * KILL_POINTS_PER_KILL;
  let placementPoints = 0;
  
  if (gameType === 'BGMI') {
    placementPoints = BGMI_PLACEMENT_POINTS[placement] || 0;
  } else if (gameType === 'FREE_FIRE') {
    placementPoints = FREE_FIRE_PLACEMENT_POINTS[placement] || 0;
  }
  
  return placementPoints + killPoints;
}

export function getPlacementPointsTable(gameType: GameType): PlacementPoints {
  if (gameType === 'BGMI') {
    return BGMI_PLACEMENT_POINTS;
  } else if (gameType === 'FREE_FIRE') {
    return FREE_FIRE_PLACEMENT_POINTS;
  }
  return {};
}
