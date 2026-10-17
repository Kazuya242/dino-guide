// Mutations, verified 2026-10-17. Main source: theisle.info mutations page (updated May 2026),
// cross-checked with supercraft.host (Sept 2026) and holy.gg (May 2026).
// Devs changed many values in Oct 2025 (DevBlog #63) without publishing new numbers,
// so percentages are the last published defaults and servers can change them.
// diet: "All" | "Carnivore" | "Herbivore" | "HerbOmni"
// type: "life" (default pool) | "slot2" (only on slot 2) | "unlock" (unlock by doing something)
// slots: which slots it can appear on (default life pool = 1,2,3,4)

export const MUTATIONS = [
  { name: "Accelerated Prey Drive", value: "10%", diet: "Carnivore", type: "life", effect: "More damage to animals under 35% health." },
  { name: "Hematophagy", value: "15%", diet: "Carnivore", type: "life", effect: "Eating corpses restores some thirst." },
  { name: "Hemomania", value: "5%", diet: "Carnivore", type: "life", effect: "More damage to bleeding targets." },
  { name: "Cannibalistic", value: "", diet: "Carnivore", type: "unlock", slots: [2, 4], unlock: "Eat your own species.", effect: "Your own species counts as preferred prey." },
  { name: "Augmented Tapetum", value: "50%", diet: "Carnivore", type: "unlock", slots: [2], unlock: "Kill 5 players at night.", effect: "Better night vision." },
  { name: "Osteophagic", value: "15%", diet: "Carnivore", type: "unlock", slots: [2, 3], unlock: "Eat bones while you have a broken bone.", effect: "Eating bones heals fractures faster." },
  { name: "Hypermetabolic Inanition", value: "15%", diet: "Carnivore", type: "slot2", effect: "Deal more damage depending on your hunger. Sources describe it differently, test it." },

  { name: "Barometric Sensitivity", value: "", diet: "Herbivore", type: "life", effect: "Warning before storms or droughts." },
  { name: "Hypervigilance", value: "50%", diet: "Herbivore", type: "life", effect: "Wider camera while eating or drinking, and other dinos' footsteps are louder." },
  { name: "Photosynthetic Regeneration", value: "10%", diet: "Herbivore", type: "life", effect: "Faster stamina regen in daylight." },
  { name: "Truculency", value: "5%", diet: "Herbivore", type: "life", effect: "Better chance to throw off latched animals when bucking." },
  { name: "Xerocole Adaptation", value: "15%", diet: "Herbivore", type: "life", effect: "Get water from eating plants." },
  { name: "Tactile Endurance", value: "50%", diet: "Herbivore", type: "slot2", effect: "Part of the damage you take comes back as stamina." },
  { name: "Social Behavior", value: "", diet: "HerbOmni", type: "life", leader: true, effect: "Bigger group size limit. Group leader only." },

  { name: "Cellular Regeneration", value: "15%", diet: "All", type: "life", effect: "Faster health regen." },
  { name: "Congenital Hypoalgesia", value: "15%", diet: "All", type: "life", effect: "Less damage from bigger species." },
  { name: "Efficient Digestion", value: "20%", diet: "All", type: "life", effect: "Food goes down slower." },
  { name: "Enlarged Meniscus", value: "", diet: "All", type: "life", effect: "Fall damage hits stamina before health." },
  { name: "Epidermal Fibrosis", value: "15%", diet: "All", type: "life", effect: "Bleed resistance." },
  { name: "Featherweight", value: "50%", diet: "All", type: "life", effect: "Your footprints fade faster." },
  { name: "Hydrodynamic", value: "15%", diet: "All", type: "life", effect: "Faster swimming." },
  { name: "Hydro-regenerative", value: "25%", diet: "All", type: "life", effect: "Faster health regen in rain." },
  { name: "Increased Inspiratory Capacity", value: "15%", diet: "All", type: "life", effect: "More oxygen underwater." },
  { name: "Infrasound Communication", value: "50%", diet: "All", type: "life", effect: "Your chat messages make less sound." },
  { name: "Nocturnal", value: "5%", diet: "All", type: "life", effect: "Faster health regen at night." },
  { name: "Osteosclerosis", value: "20%", diet: "All", type: "life", effect: "Fracture resistance." },
  { name: "Photosynthetic Tissue", value: "5%", diet: "All", type: "life", effect: "Faster health regen in daylight." },
  { name: "Reabsorption", value: "", diet: "All", type: "life", effect: "Small water gain in rain or when swimming in drinkable water." },
  { name: "Submerged Optical Retention", value: "5%", diet: "All", type: "life", effect: "See further underwater." },
  { name: "Sustained Hydration", value: "20%", diet: "All", type: "life", effect: "Water goes down slower." },
  { name: "Wader", value: "25%", diet: "All", type: "life", effect: "Less slowed down in shallow water." },
  { name: "Sequential Hermaphroditism", value: "", diet: "All", type: "life", noInherit: true, effect: "Change your sex. Not passed on to babies." },
  { name: "Advanced Gestation", value: "50%", diet: "All", type: "life", female: true, effect: "Faster egg gestation, incubation and cooldown. Female only." },
  { name: "Traumatic Thrombosis", value: "", diet: "All", type: "slot2", effect: "You can't bleed out while resting." },
  { name: "Gastronomic Regeneration", value: "10%", diet: "All", type: "slot2", effect: "Eating heals a little." },

  { name: "Enhanced Digestion", value: "10%", diet: "All", type: "unlock", slots: [2, 3], unlock: "Keep your nutrients up for 60 minutes.", effect: "Nutrients go down slower." },
  { name: "Heightened Ghrelin", value: "25%", diet: "All", type: "unlock", slots: [2], unlock: "Keep hunger above 80% for 30 minutes.", effect: "You can overeat a lot more before throwing up." },
  { name: "Multichambered Lungs", value: "5%", diet: "All", type: "unlock", slots: [2, 3], unlock: "Burn about 4,500 stamina sprinting or fast swimming.", effect: "Stamina starts coming back sooner." },
  { name: "Reinforced Tendons", value: "10%", diet: "All", type: "unlock", slots: [2, 3], unlock: "Jump 50 times.", effect: "Jumps cost less stamina (cheaper take-off for Ptera)." },
  { name: "Reniculate Kidneys", value: "", diet: "All", type: "unlock", slots: [2, 3], unlock: "Lose about 1,250 thirst drinking saltwater.", effect: "You can drink saltwater." },
  { name: "Parthenogenesis", value: "", diet: "All", type: "unlock", slots: [2], female: true, noInherit: true, unlock: "Female only. Unlock condition not published.", effect: "Nest without a mate. Not passed on to babies." },
  { name: "Prolific Reproduction", value: "10%", diet: "All", type: "unlock", slots: [2], female: true, unlock: "Female only. Raise babies (exact condition varies by source).", effect: "Your babies regen faster, need less food and grow faster." },
];

export const HORDETEST = [
  ["Pit Organ", "See infrared heat sources."],
  ["Paratrepsis", "Fake a fracture."],
  ["Cochlear Sensitivity", "Spot sound traps from far away."],
];

export const RULES = [
  "You pick mutations as you grow: one around juvenile, one around sub-adult, one at adult (75%).",
  "A 4th slot only opens if you become a Prime Elder (hit 5 of 8 elder goals before 75%).",
  "Slot 2 has its own extra pool (Tactile Endurance, Traumatic Thrombosis, Gastronomic Regeneration, Hypermetabolic Inanition).",
  "Unlockable mutations are earned by doing tasks. Unlocks are account-wide.",
  "Mutations last for that life. Entombing at elder restarts you as a juvenile of the same species and keeps them stronger.",
  "Babies can inherit mutations from parents. Sequential Hermaphroditism and Parthenogenesis are never inherited.",
  "Since Oct 2025 no mutation gives movement speed.",
  "The in-game options you get are random. Servers can change values or turn mutations off.",
];

export function canUse(m, diet) {
  if (m.diet === "All") return true;
  if (m.diet === "HerbOmni") return diet === "Herbivore" || diet === "Omnivore";
  return m.diet === diet;
}

export function slotsFor(m) {
  if (m.type === "slot2") return [2];
  if (m.type === "unlock") return m.slots;
  return [1, 2, 3, 4];
}
