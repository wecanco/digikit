import type { BuilderNode, BuilderProps } from './builder.types';

const GRID_SLOT_PATTERN = /^column-(\d+)$/;
const MAX_GRID_COLUMNS = 4;

export type BuilderSlotName = 'children' | `column-${number}`;

export function getGridColumnCount(props: BuilderProps): number {
  const value = props.columns;
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(1, Math.min(MAX_GRID_COLUMNS, Math.round(value))) : 2;
}

function existingGridSlots(node: BuilderNode): string[] {
  return Object.keys(node.slots)
    .filter((slotName) => GRID_SLOT_PATTERN.test(slotName))
    .sort((left, right) => Number(left.slice(7)) - Number(right.slice(7)));
}

export function isGridSlotName(slotName: string): boolean {
  return GRID_SLOT_PATTERN.test(slotName);
}

export function getBuilderSlotNames(node: BuilderNode): string[] {
  if (node.type !== 'builder/grid') return ['children'];
  return Array.from({ length: getGridColumnCount(node.props) }, (_, index) => `column-${index}`);
}

export function getBuilderSlotLabel(slotName: string): string {
  const match = GRID_SLOT_PATTERN.exec(slotName);
  return match ? `ستون ${Number(match[1]) + 1}` : 'محتوا';
}

export function normalizeGridNode(node: BuilderNode): BuilderNode {
  if (node.type !== 'builder/grid') return node;
  const slotNames = getBuilderSlotNames(node);
  const currentSlots = existingGridSlots(node);
  const nextSlots = Object.fromEntries(slotNames.map((slotName) => [slotName, [] as string[]]));

  if (currentSlots.length > 0) {
    currentSlots.forEach((slotName, index) => {
      const targetSlot = slotNames[Math.min(index, slotNames.length - 1)];
      nextSlots[targetSlot].push(...(node.slots[slotName] || []));
    });
  }

  const legacyChildren = node.slots.children || [];
  legacyChildren.forEach((childId, index) => {
    nextSlots[slotNames[index % slotNames.length]].push(childId);
  });

  return { ...node, slots: nextSlots };
}

export function normalizeBuilderDocument<T extends { nodes: Record<string, BuilderNode> }>(document: T): T {
  const nodes = Object.fromEntries(Object.values(document.nodes).map((node) => {
    const normalized = normalizeGridNode(node);
    return [normalized.id, normalized];
  })) as Record<string, BuilderNode>;
  return { ...document, nodes };
}

export function normalizeBuilderNodes(nodes: Record<string, BuilderNode>): Record<string, BuilderNode> {
  return normalizeBuilderDocument({ nodes }).nodes;
}
