import type { BuilderBlock, BuilderDocument, BuilderNode, BuilderProps, BuilderStyle, BuilderViewport } from './builder.types';
import { createNode, getTimestamp, makeBlockId } from './builder-storage';
import { getBuilderDefinition } from './builder-registry';
import { getBuilderSlotNames, normalizeGridNode } from './builder-slots';

export interface ParentSlotReference {
  parentId: string;
  slotName: string;
  index: number;
}

export function canAcceptChild(parent: BuilderNode | undefined, slotName: string): boolean {
  if (!parent || !getBuilderDefinition(parent.type).canHaveChildren) return false;
  return parent.type === 'builder/grid' ? getBuilderSlotNames(parent).includes(slotName) : slotName === 'children';
}

export function findParentSlot(document: BuilderDocument, targetId: string): ParentSlotReference | null {
  for (const node of Object.values(document.nodes)) {
    for (const [slotName, childIds] of Object.entries(node.slots)) {
      const index = childIds.indexOf(targetId);
      if (index >= 0) return { parentId: node.id, slotName, index };
    }
  }
  return null;
}

export function isDescendant(document: BuilderDocument, ancestorId: string, candidateId: string): boolean {
  const ancestor = document.nodes[ancestorId];
  if (!ancestor) return false;
  return Object.values(ancestor.slots).some((childIds) => childIds.some((childId) => childId === candidateId || isDescendant(document, childId, candidateId)));
}

export function updateNodeProps(document: BuilderDocument, nodeId: string, patch: Partial<BuilderProps>): BuilderDocument {
  const node = document.nodes[nodeId];
  if (!node) return document;
  const nextNode = normalizeGridNode({ ...node, props: { ...node.props, ...patch } as BuilderProps });
  return {
    ...document,
    updatedAt: getTimestamp(),
    nodes: { ...document.nodes, [nodeId]: nextNode },
  };
}

export function updateNodeStyles(document: BuilderDocument, nodeId: string, viewport: BuilderViewport, patch: Partial<BuilderStyle>): BuilderDocument {
  const node = document.nodes[nodeId];
  if (!node) return document;
  const currentStyles = node.styles || {};
  const nextStyles = { ...currentStyles, [viewport]: { ...(currentStyles[viewport] || {}), ...patch } };
  return { ...document, updatedAt: getTimestamp(), nodes: { ...document.nodes, [nodeId]: { ...node, styles: nextStyles } } };
}

export function addNode(document: BuilderDocument, type: string, props: BuilderProps, parentId: string, slotName = 'children', index?: number): { document: BuilderDocument; nodeId: string } {
  const parent = normalizeGridNode(document.nodes[parentId]);
  if (!canAcceptChild(parent, slotName)) return { document, nodeId: '' };
  const rawNode = createNode(type, props, getBuilderDefinition(type).canHaveChildren ? { children: [] } : {});
  const node = normalizeGridNode(rawNode);
  const childIds = [...(parent.slots[slotName] || [])];
  const safeIndex = index == null ? childIds.length : Math.max(0, Math.min(index, childIds.length));
  childIds.splice(safeIndex, 0, node.id);
  return {
    nodeId: node.id,
    document: {
      ...document,
      updatedAt: getTimestamp(),
      nodes: {
        ...document.nodes,
        [node.id]: node,
        [parent.id]: { ...parent, slots: { ...parent.slots, [slotName]: childIds } },
      },
    },
  };
}

export function removeNode(document: BuilderDocument, nodeId: string): BuilderDocument {
  if (nodeId === document.rootId || !document.nodes[nodeId]) return document;
  const nextNodes = { ...document.nodes };
  const removeTree = (currentId: string) => {
    const node = nextNodes[currentId];
    if (!node) return;
    Object.values(node.slots).flat().forEach(removeTree);
    delete nextNodes[currentId];
  };
  removeTree(nodeId);
  for (const node of Object.values(nextNodes)) {
    const slots = Object.fromEntries(Object.entries(node.slots).map(([slotName, childIds]) => [slotName, childIds.filter((childId) => childId !== nodeId)]));
    nextNodes[node.id] = { ...node, slots };
  }
  return { ...document, updatedAt: getTimestamp(), nodes: nextNodes };
}

export function moveNode(document: BuilderDocument, nodeId: string, targetParentId: string, targetSlot: string, targetIndex: number): BuilderDocument {
  if (nodeId === document.rootId || nodeId === targetParentId || isDescendant(document, nodeId, targetParentId)) return document;
  const source = findParentSlot(document, nodeId);
  const targetParent = normalizeGridNode(document.nodes[targetParentId]);
  if (!source || !canAcceptChild(targetParent, targetSlot)) return document;
  const nextNodes = { ...document.nodes };
  const sourceParent = normalizeGridNode(nextNodes[source.parentId]);
  nextNodes[targetParentId] = targetParent;
  const sourceChildren = [...(sourceParent.slots[source.slotName] || [])];
  sourceChildren.splice(source.index, 1);
  nextNodes[sourceParent.id] = { ...sourceParent, slots: { ...sourceParent.slots, [source.slotName]: sourceChildren } };
  const targetChildren = [...(nextNodes[targetParentId].slots[targetSlot] || [])];
  const originalLength = (targetParent.slots[targetSlot] || []).length;
  const requestedIndex = Math.max(0, Math.min(targetIndex, originalLength));
  const safeIndex = source.parentId === targetParentId && source.slotName === targetSlot && source.index < requestedIndex ? requestedIndex - 1 : requestedIndex;
  if (source.parentId === targetParentId && source.slotName === targetSlot && safeIndex === source.index) return document;
  targetChildren.splice(safeIndex, 0, nodeId);
  nextNodes[targetParentId] = { ...nextNodes[targetParentId], slots: { ...nextNodes[targetParentId].slots, [targetSlot]: targetChildren } };
  return { ...document, updatedAt: getTimestamp(), nodes: nextNodes };
}

export function duplicateNode(document: BuilderDocument, nodeId: string): { document: BuilderDocument; nodeId: string } {
  const source = document.nodes[nodeId];
  const parent = findParentSlot(document, nodeId);
  if (!source || !parent) return { document, nodeId: '' };
  const idMap = new Map<string, string>();
  const cloneTree = (currentId: string): BuilderNode[] => {
    const node = document.nodes[currentId];
    if (!node) return [];
    const clonedId = createNode('builder/temp').id;
    idMap.set(currentId, clonedId);
    const descendants = Object.values(node.slots).flat().flatMap(cloneTree);
    return [{ ...node, id: clonedId, slots: Object.fromEntries(Object.entries(node.slots).map(([slotName, childIds]) => [slotName, childIds.map((childId) => idMap.get(childId) || childId)])) }, ...descendants];
  };
  const clonedNodes = cloneTree(nodeId).map((node) => normalizeGridNode(node));
  const clonedRoot = clonedNodes[0];
  if (!clonedRoot) return { document, nodeId: '' };
  const parentNode = document.nodes[parent.parentId];
  const nextChildren = [...(parentNode.slots[parent.slotName] || [])];
  nextChildren.splice(parent.index + 1, 0, clonedRoot.id);
  return {
    nodeId: clonedRoot.id,
    document: {
      ...document,
      updatedAt: getTimestamp(),
      nodes: {
        ...document.nodes,
        ...Object.fromEntries(clonedNodes.map((clonedNode) => [clonedNode.id, clonedNode])),
        [parentNode.id]: { ...parentNode, slots: { ...parentNode.slots, [parent.slotName]: nextChildren } },
      },
    },
  };
}

export function extractBlock(document: BuilderDocument, nodeId: string, title: string): BuilderBlock | null {
  if (!document.nodes[nodeId]) return null;
  const nodes: Record<string, BuilderNode> = {};
  const collect = (currentId: string) => {
    const node = document.nodes[currentId];
    if (!node) return;
    nodes[currentId] = node;
    Object.values(node.slots).flat().forEach(collect);
  };
  collect(nodeId);
  return { id: makeBlockId(), title, rootId: nodeId, nodes, createdAt: getTimestamp() };
}

export function insertBlock(document: BuilderDocument, block: BuilderBlock, parentId: string, slotName = 'children', index?: number): { document: BuilderDocument; nodeId: string } {
  const parent = document.nodes[parentId];
  if (!canAcceptChild(parent, slotName) || !block.nodes[block.rootId]) return { document, nodeId: '' };
  const idMap = new Map<string, string>();
  Object.keys(block.nodes).forEach((nodeId) => idMap.set(nodeId, createNode('builder/temp').id));
  const clonedNodes = Object.values(block.nodes).map((node) => normalizeGridNode({
    ...node,
    id: idMap.get(node.id) as string,
    slots: Object.fromEntries(Object.entries(node.slots).map(([name, childIds]) => [name, childIds.map((childId) => idMap.get(childId) || childId)])),
  }));
  const rootId = idMap.get(block.rootId) as string;
  const childIds = [...(parent.slots[slotName] || [])];
  const safeIndex = index == null ? childIds.length : Math.max(0, Math.min(index, childIds.length));
  childIds.splice(safeIndex, 0, rootId);
  return {
    nodeId: rootId,
    document: {
      ...document,
      updatedAt: getTimestamp(),
      nodes: {
        ...document.nodes,
        ...Object.fromEntries(clonedNodes.map((node) => [node.id, node])),
        [parent.id]: { ...parent, slots: { ...parent.slots, [slotName]: childIds } },
      },
    },
  };
}

export function cloneDocument(document: BuilderDocument, title: string, slug: string, id: string): BuilderDocument {
  const idMap = new Map<string, string>();
  for (const nodeId of Object.keys(document.nodes)) idMap.set(nodeId, createNode('builder/temp').id);
  const nodes = Object.fromEntries(Object.values(document.nodes).map((node) => [
    idMap.get(node.id) as string,
    normalizeGridNode({
      ...node,
      id: idMap.get(node.id) as string,
      slots: Object.fromEntries(Object.entries(node.slots).map(([slotName, childIds]) => [slotName, childIds.map((childId) => idMap.get(childId) || childId)])),
    }),
  ]));
  const timestamp = getTimestamp();
  return { ...document, id, title, slug, rootId: idMap.get(document.rootId) as string, nodes, createdAt: timestamp, updatedAt: timestamp };
}

export function getNodeLabel(document: BuilderDocument, nodeId: string, fallback: string): string {
  const node = document.nodes[nodeId];
  if (!node) return fallback;
  const title = node.props.title || node.props.text || node.props.label;
  return typeof title === 'string' && title.trim() ? title : fallback;
}
