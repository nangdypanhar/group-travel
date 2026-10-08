import { BAGGAGE, INSURANCE_PLANS } from '../data/mockData'

// A traveler's personal add-ons (extra baggage, insurance) from their details.
// These are on top of the group share and only the traveler pays them.
export function getExtras(info) {
  const bagKg = Number(info?.extraBagKg) || 0
  const bagCost = bagKg * BAGGAGE.pricePerKg
  const plan = INSURANCE_PLANS.find((p) => p.id === info?.insurance) ?? INSURANCE_PLANS[0]
  const lines = []
  if (bagKg) lines.push({ label: `Extra baggage · +${bagKg} kg`, amount: bagCost })
  if (plan.price) lines.push({ label: `Insurance · ${plan.label}`, amount: plan.price })
  return { bagKg, bagCost, plan, lines, total: bagCost + plan.price }
}
