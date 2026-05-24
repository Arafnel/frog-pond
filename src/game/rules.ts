import type { FrogColor, FrogDef, LevelDef } from "./levels";

export function neighborsOf(level: Pick<LevelDef, "adjacency">, padId: string): string[] {
  const out: string[] = [];
  for (const [a, b] of level.adjacency) {
    if (a === padId) out.push(b);
    if (b === padId) out.push(a);
  }
  return out;
}

export type NearRule = {
  id: string;
  type: "near";
  targetFrogId?: string;
  color?: FrogColor;
};

export type NotNearRule = {
  id: string;
  type: "not_near";
  targetFrogId?: string;
  color?: FrogColor;
};

export type SpecificTileRule = {
  id: string;
  type: "specific_tile";
  padId: string;
};

export type Rule = NearRule | NotNearRule | SpecificTileRule;

export type ValidationResult = {
  success: boolean;
  failedRules: Rule[];
};

export type RuleContext = {
  level: LevelDef;
  frogId: string;
  padId: string;
  placements: Record<string, string>;
};

function frogById(level: LevelDef): Record<string, FrogDef> {
  return Object.fromEntries(level.frogs.map((f) => [f.id, f]));
}

function neighborFrogIds(ctx: RuleContext): string[] {
  const neighborPads = neighborsOf(ctx.level, ctx.padId);
  return Object.entries(ctx.placements)
    .filter(([fid, pid]) => fid !== ctx.frogId && neighborPads.includes(pid))
    .map(([fid]) => fid);
}

function isNearTarget(
  ctx: RuleContext,
  targetFrogId?: string,
  color?: FrogColor,
): boolean {
  const neighbors = neighborFrogIds(ctx);
  const frogs = frogById(ctx.level);

  if (targetFrogId) {
    const pad = ctx.placements[targetFrogId];
    if (!pad) return false;
    return neighborsOf(ctx.level, ctx.padId).includes(pad);
  }

  if (color) {
    return neighbors.some((fid) => frogs[fid]?.color === color);
  }

  return neighbors.length > 0;
}

export function checkRule(rule: Rule, ctx: RuleContext): boolean {
  switch (rule.type) {
    case "near":
      return isNearTarget(ctx, rule.targetFrogId, rule.color);
    case "not_near":
      return !isNearTarget(ctx, rule.targetFrogId, rule.color);
    case "specific_tile":
      return ctx.padId === rule.padId;
  }
}

export function validateRules(rules: Rule[], ctx: RuleContext): ValidationResult {
  const failedRules = rules.filter((rule) => !checkRule(rule, ctx));
  return { success: failedRules.length === 0, failedRules };
}

export function isFrogHappy(
  frog: FrogDef,
  padId: string,
  level: LevelDef,
  placements: Record<string, string>,
): boolean {
  const { success } = validateRules(frog.rules, {
    level,
    frogId: frog.id,
    padId,
    placements,
  });
  return success;
}
