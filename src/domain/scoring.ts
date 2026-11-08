import {
  BadgeInfo,
  BadgeType,
  ScoreOutcome,
  ScoringCase,
  ScoringRule,
} from './types';

export const OUTCOME_BASE_POINTS: Record<ScoreOutcome, number> = {
  optimal: 100,
  good: 60,
  partial: 30,
  neutral: 0,
  harmful: -100,
  critical: -200,
  no_score: 0,
};

export const MAX_STREAK_BONUS = 50;

/**
 * Calculates streak bonus and next streak.
 * Positive resolution (+30, +60, +100) increments streak by 1.
 * Streak bonus is min(previousStreak, 5) * 10 (max +50).
 * Neutral, harmful (-100), critical (-200) resets streak to 0.
 * no_score leaves streak unchanged.
 */
export function calculateStreak(
  currentStreak: number,
  outcome: ScoreOutcome
): { streakBonus: number; nextStreak: number } {
  if (outcome === 'optimal' || outcome === 'good' || outcome === 'partial') {
    const streakBonus = Math.min(currentStreak, 5) * 10;
    const nextStreak = currentStreak + 1;
    return { streakBonus, nextStreak };
  }

  if (outcome === 'neutral' || outcome === 'harmful' || outcome === 'critical') {
    return { streakBonus: 0, nextStreak: 0 };
  }

  // no_score or non-scoring action: does not modify streak
  return { streakBonus: 0, nextStreak: currentStreak };
}

/**
 * Evaluates an action on a ScoringCase.
 * Returns the matched rule or null if no rule applies.
 */
export function evaluateScoringCaseAction(
  scoringCase: ScoringCase,
  actionId: string,
  targetEntityId?: string,
  targetFolderId?: string,
  targetScope?: 'occurrence' | 'series'
): ScoringRule | null {
  if (scoringCase.status === 'resolved') {
    return null;
  }

  const role = targetEntityId ? scoringCase.entityRoles[targetEntityId] : undefined;

  for (const rule of scoringCase.decisionRules) {
    if (rule.actionId !== actionId) {
      continue;
    }

    // Check entity ID if rule specifies targetEntityIds
    if (rule.targetEntityIds && targetEntityId) {
      if (!rule.targetEntityIds.includes(targetEntityId)) {
        continue;
      }
    }

    // Check entity role if rule specifies targetEntityRole
    if (rule.targetEntityRole && role) {
      if (rule.targetEntityRole !== role) {
        continue;
      }
    }

    // Check target folder if rule specifies targetFolderId
    if (rule.targetFolderId && targetFolderId) {
      if (rule.targetFolderId !== targetFolderId) {
        continue;
      }
    }

    // Target scope for recurring calendar events
    if (targetScope && rule.actionId.includes(targetScope)) {
      // rule matches specific scope
    }

    return rule;
  }

  return null;
}

/**
 * Determines badge based on score, resolved cases and violations.
 */
export function determineBadge(
  score: number,
  casesResolved: number,
  criticalDeletions: number,
  harmfulDeletions: number
): BadgeInfo {
  if (criticalDeletions > 0 || score < 0) {
    return {
      type: 'needs_review',
      title: 'Necesita revisar antes de borrar',
      description:
        'Se han producido eliminaciones irreversibles o la puntuación final refleja decisiones perjudiciales.',
      color: '#d13438',
    };
  }

  if (score >= 1200 && casesResolved >= 10 && criticalDeletions === 0) {
    return {
      type: 'exemplary',
      title: 'Gestión ejemplar',
      description:
        'Excelente criterio digital: información importante preservada, duplicados reducidos y uso responsable.',
      color: '#107c41',
    };
  }

  if (score >= 600 && criticalDeletions === 0) {
    return {
      type: 'responsible',
      title: 'Gestión responsable',
      description:
        'Buena labor de saneamiento y orden sin comprometer documentos ni registros esenciales.',
      color: '#0078d4',
    };
  }

  return {
    type: 'on_track',
    title: 'En buen camino',
    description:
      'Progreso adecuado hacia la gestión sostenible; conviene revisar criterios de conservación y duplicidad.',
    color: '#ca5010',
  };
}

