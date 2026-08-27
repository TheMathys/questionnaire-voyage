import { BUDGET_OPTIONS } from '../data/questionnaire'
import type { BudgetBreakdown, ComfortLevel, TravelProfile } from '../types/trip'

const COMFORT_FACTOR: Record<ComfortLevel, number> = {
  essentiel: 0.85,
  confortable: 1,
  'haut-de-gamme': 1.25,
  exceptionnel: 1.55,
}

/**
 * Estimation TribTravel déterministe — indicative, non commerciale.
 */
export function estimateBudget(
  profile: TravelProfile,
  costIndex: 1 | 2 | 3 | 4 | 5,
  durationDays: number,
): BudgetBreakdown {
  const travelers = Math.max(1, profile.travelers.adults + profile.travelers.children * 0.7)
  const days = Math.max(3, durationDays)
  const comfort = profile.comfortLevel
    ? COMFORT_FACTOR[profile.comfortLevel]
    : 1

  const basePerDay = 55 + costIndex * 28
  const activityBoost = 1 + profile.activities.length * 0.03
  const rawTotal = basePerDay * days * travelers * comfort * activityBoost

  const option = BUDGET_OPTIONS.find((b) => b.id === profile.budgetRange)
  const ceiling = option && profile.budgetRange !== 'unknown' ? option.mid * 1.15 : rawTotal

  let total = Math.round(rawTotal / 50) * 50
  let note: string | undefined
  let underBudget = true

  if (option && profile.budgetRange !== 'unknown' && total > option.mid) {
    underBudget = false
    total = Math.round(Math.min(total, ceiling) / 50) * 50
    note =
      'Votre budget est légèrement inférieur à l’estimation habituelle. TribTravel privilégierait ici l’hébergement et réduirait certains postes.'
  }

  // Priorités utilisateur pour la répartition
  const priorities = new Set(profile.priorities)
  let transportShare = 0.28
  let accommodationShare = 0.32
  let activitiesShare = 0.18
  let mealsShare = 0.15
  const contingencyShare = 0.07

  if (priorities.has('transport')) transportShare += 0.04
  if (priorities.has('hebergement') || priorities.has('confort')) accommodationShare += 0.05
  if (priorities.has('activites') || priorities.has('experiences')) activitiesShare += 0.04
  if (priorities.has('gastronomie')) mealsShare += 0.04

  const sum =
    transportShare + accommodationShare + activitiesShare + mealsShare + contingencyShare

  const transport = Math.round((total * transportShare) / sum / 10) * 10
  const accommodation = Math.round((total * accommodationShare) / sum / 10) * 10
  const activities = Math.round((total * activitiesShare) / sum / 10) * 10
  const meals = Math.round((total * mealsShare) / sum / 10) * 10
  const contingency = Math.max(0, total - transport - accommodation - activities - meals)

  return {
    transport,
    accommodation,
    activities,
    meals,
    contingency,
    total: transport + accommodation + activities + meals + contingency,
    note,
    underBudget,
  }
}

export function getBudgetLabel(id: string): string {
  return BUDGET_OPTIONS.find((b) => b.id === id)?.label ?? id
}
