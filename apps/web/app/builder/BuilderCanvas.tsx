'use client';

import { useMemo } from 'react';
import type { CSSProperties, DragEvent, ReactNode } from 'react';
import { getBuilderDefinition } from './builder-registry';
import { getBuilderSlotLabel, getBuilderSlotNames } from './builder-slots';
import type { BuilderAsset, BuilderDocument, BuilderDropTarget, BuilderMode, BuilderNode, BuilderViewport } from './builder.types';
import s from './builder.module.css';

const BUILDER_DATA_TYPE = 'application/x-digikit-builder';

export type BuilderDragPayload =
  | { kind: 'component'; type: string }
  | { kind: 'node'; nodeId: string };

export interface BuilderCanvasProps {
  document: BuilderDocument;
  masterDocument?: BuilderDocument | null;
  assets: BuilderAsset[];
  mode: BuilderMode;
  viewport: BuilderViewport;
  selectedId: string;
  selectedSlot: { parentId: string; slotName: string } | null;
  dropTarget: BuilderDropTarget | null;
  onSelect(nodeId: string): void;
  onSelectSlot(parentId: string, slotName: string): void;
  onContextMenu(nodeId: string, clientX: number, clientY: number): void;
  onDrop(target: BuilderDropTarget, payload: BuilderDragPayload): void;
  onDropTargetChange(target: BuilderDropTarget | null): void;
  onDragStart(payload: BuilderDragPayload): void;
  onDragEnd(): void;
}

function responsiveStyle(node: Pick<BuilderNode, 'styles'>, viewport: BuilderViewport): CSSProperties {
  const base = node.styles?.desktop || {};
  const tablet = viewport === 'desktop' ? {} : node.styles?.tablet || {};
  const mobile = viewport === 'mobile' ? node.styles?.mobile || {} : {};
  const values = { ...base, ...tablet, ...mobile };
  return {
    display: values.display === 'none' ? 'none' : 'block',
    maxWidth: typeof values.maxWidth === 'number' ? values.maxWidth : undefined,
    marginTop: typeof values.marginTop === 'number' ? values.marginTop : undefined,
    marginBottom: typeof values.marginBottom === 'number' ? values.marginBottom : undefined,
    paddingBlock: typeof values.paddingBlock === 'number' ? values.paddingBlock : undefined,
    background: typeof values.background === 'string' ? values.background : undefined,
  };
}

function readPayload(event: DragEvent): BuilderDragPayload | null {
  try {
    const raw = event.dataTransfer.getData(BUILDER_DATA_TYPE);
    if (!raw) return null;
    const payload: unknown = JSON.parse(raw);
    if (!payload || typeof payload !== 'object') return null;
    if ('kind' in payload && payload.kind === 'component' && 'type' in payload && typeof payload.type === 'string') return payload as BuilderDragPayload;
    if ('kind' in payload && payload.kind === 'node' && 'nodeId' in payload && typeof payload.nodeId === 'string') return payload as BuilderDragPayload;
    return null;
  } catch {
    return null;
  }
}

export function readBuilderDragPayload(event: DragEvent): BuilderDragPayload | null {
  return readPayload(event);
}

export function setBuilderDragData(event: DragEvent, payload: BuilderDragPayload): void {
  event.dataTransfer.effectAllowed = payload.kind === 'component' ? 'copy' : 'move';
  event.dataTransfer.setData(BUILDER_DATA_TYPE, JSON.stringify(payload));
}

function DropZone({ target, active, onDrop, onDropTargetChange }: { target: BuilderDropTarget; active: boolean; onDrop(target: BuilderDropTarget, payload: BuilderDragPayload): void; onDropTargetChange(target: BuilderDropTarget | null): void }) {
  return (
    <div
      className={active ? `${s.dropZone} ${s.dropZoneActive}` : s.dropZone}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = event.dataTransfer.effectAllowed === 'copy' ? 'copy' : 'move';
        onDropTargetChange(target);
      }}
      onDragLeave={() => onDropTargetChange(null)}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const payload = readPayload(event);
        if (payload) onDrop(target, payload);
        onDropTargetChange(null);
      }}
      aria-label="محل رها کردن component"
    >
      <span>{active ? 'اینجا رها کن' : 'برای افزودن، component را اینجا بکش'}</span>
    </div>
  );
}

interface NodeViewProps extends BuilderCanvasProps {
  nodeId: string;
  isRoot?: boolean;
}

interface MasterNodeViewProps extends BuilderCanvasProps {
  masterDocument: BuilderDocument;
  masterNodeId: string;
  isMasterRoot?: boolean;
}

function PageSlotContent({ document, assets, mode, viewport, selectedId, selectedSlot, dropTarget, onSelect, onSelectSlot, onContextMenu, onDrop, onDropTargetChange, onDragStart, onDragEnd }: BuilderCanvasProps) {
  const root = document.nodes[document.rootId];
  if (!root) return null;
  const childIds = root.slots.children || [];
  const children = mode === 'preview'
    ? childIds.map((childId) => <NodeView key={childId} nodeId={childId} document={document} assets={assets} mode={mode} viewport={viewport} selectedId={selectedId} selectedSlot={selectedSlot} dropTarget={dropTarget} onSelect={onSelect} onSelectSlot={onSelectSlot} onContextMenu={onContextMenu} onDrop={onDrop} onDropTargetChange={onDropTargetChange} onDragStart={onDragStart} onDragEnd={onDragEnd} />)
    : childIds.flatMap((childId, index) => [
      <DropZone key={`before-${childId}`} target={{ parentId: root.id, slotName: 'children', index }} active={dropTarget?.parentId === root.id && dropTarget.slotName === 'children' && dropTarget.index === index} onDrop={onDrop} onDropTargetChange={onDropTargetChange} />,
      <NodeView key={childId} nodeId={childId} document={document} assets={assets} mode={mode} viewport={viewport} selectedId={selectedId} selectedSlot={selectedSlot} dropTarget={dropTarget} onSelect={onSelect} onSelectSlot={onSelectSlot} onContextMenu={onContextMenu} onDrop={onDrop} onDropTargetChange={onDropTargetChange} onDragStart={onDragStart} onDragEnd={onDragEnd} />,
    ]).concat(<DropZone key="after" target={{ parentId: root.id, slotName: 'children', index: childIds.length }} active={dropTarget?.parentId === root.id && dropTarget.slotName === 'children' && dropTarget.index === childIds.length} onDrop={onDrop} onDropTargetChange={onDropTargetChange} />);
  return <div className={s.composedPageSlot} data-builder-page-slot="content" onClick={(event) => { event.stopPropagation(); onSelect(root.id); }}>{children}</div>;
}

function MasterNodeView({ masterDocument, document, assets, mode, viewport, selectedId, selectedSlot, dropTarget, onSelect, onSelectSlot, onContextMenu, onDrop, onDropTargetChange, onDragStart, onDragEnd, masterNodeId, isMasterRoot = false }: MasterNodeViewProps) {
  const node = masterDocument.nodes[masterNodeId];
  if (!node) return null;
  const definition = getBuilderDefinition(node.type);
  if (node.type === 'builder/page-slot') {
    return <div className={s.masterLayoutSlot} style={responsiveStyle(node, viewport)} data-builder-master-slot="true"><PageSlotContent document={document} assets={assets} mode={mode} viewport={viewport} selectedId={selectedId} selectedSlot={selectedSlot} dropTarget={dropTarget} onSelect={onSelect} onSelectSlot={onSelectSlot} onContextMenu={onContextMenu} onDrop={onDrop} onDropTargetChange={onDropTargetChange} onDragStart={onDragStart} onDragEnd={onDragEnd} /></div>;
  }
  const slotNames = definition.canHaveChildren ? getBuilderSlotNames(node) : [];
  const childContent = useMemo(() => slotNames.map((slotName) => {
    const childIds = node.slots[slotName] || [];
    return <div key={slotName} data-builder-slot={slotName} className={node.type === 'builder/grid' ? s.masterLayoutColumn : undefined}>{childIds.map((childId) => <MasterNodeView key={childId} masterDocument={masterDocument} masterNodeId={childId} document={document} assets={assets} mode={mode} viewport={viewport} selectedId={selectedId} selectedSlot={selectedSlot} dropTarget={dropTarget} onSelect={onSelect} onSelectSlot={onSelectSlot} onContextMenu={onContextMenu} onDrop={onDrop} onDropTargetChange={onDropTargetChange} onDragStart={onDragStart} onDragEnd={onDragEnd} />)}</div>;
  }), [assets, document, dropTarget, masterDocument, mode, node, onContextMenu, onDragEnd, onDragStart, onDrop, onDropTargetChange, onSelect, onSelectSlot, selectedId, selectedSlot, slotNames, viewport]);
  const src = node.props.src;
  const resolvedProps = node.type === 'builder/image' && typeof src === 'string' && src.startsWith('asset:')
    ? { ...node.props, src: assets.find((asset) => asset.id === src.slice(6))?.src || '' }
    : node.type === 'builder/product-grid' && Array.isArray(node.props.items)
      ? { ...node.props, items: node.props.items.map((item) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) return item;
        const imageSource = item.image;
        if (typeof imageSource !== 'string' || !imageSource.startsWith('asset:')) return item;
        return { ...item, image: assets.find((asset) => asset.id === imageSource.slice(6))?.src || 'ph:0' };
      }) }
      : node.props;
  const content = definition.render(resolvedProps, childContent, { mode: 'preview', viewport });
  const className = mode === 'editor' && !isMasterRoot ? s.masterLayoutNodeFaded : s.masterLayoutNode;
  return <div className={className} style={responsiveStyle(node, viewport)} data-builder-master-node={masterNodeId}>{content}</div>;
}

function NodeView({ document, assets, mode, viewport, selectedId, selectedSlot, dropTarget, onSelect, onSelectSlot, onContextMenu, onDrop, onDropTargetChange, onDragStart, onDragEnd, nodeId, isRoot = false }: NodeViewProps) {
  const node = document.nodes[nodeId];
  const definition = getBuilderDefinition(node?.type || 'builder/root');
  const isSelected = selectedId === nodeId;
  const slotNames = node && definition.canHaveChildren ? getBuilderSlotNames(node) : [];
  const childContent = useMemo(() => slotNames.map((slotName) => {
    const childIds = node?.slots[slotName] || [];
    const children = mode === 'preview'
      ? childIds.map((childId) => <NodeView key={childId} nodeId={childId} document={document} assets={assets} mode={mode} viewport={viewport} selectedId={selectedId} selectedSlot={selectedSlot} dropTarget={dropTarget} onSelect={onSelect} onSelectSlot={onSelectSlot} onContextMenu={onContextMenu} onDrop={onDrop} onDropTargetChange={onDropTargetChange} onDragStart={onDragStart} onDragEnd={onDragEnd} />)
      : childIds.flatMap((childId, index) => [
        <DropZone key={`before-${childId}`} target={{ parentId: nodeId, slotName, index }} active={dropTarget?.parentId === nodeId && dropTarget.slotName === slotName && dropTarget.index === index} onDrop={onDrop} onDropTargetChange={onDropTargetChange} />,
        <NodeView key={childId} nodeId={childId} document={document} assets={assets} mode={mode} viewport={viewport} selectedId={selectedId} selectedSlot={selectedSlot} dropTarget={dropTarget} onSelect={onSelect} onSelectSlot={onSelectSlot} onContextMenu={onContextMenu} onDrop={onDrop} onDropTargetChange={onDropTargetChange} onDragStart={onDragStart} onDragEnd={onDragEnd} />,
      ]).concat(<DropZone key="after" target={{ parentId: nodeId, slotName, index: childIds.length }} active={dropTarget?.parentId === nodeId && dropTarget.slotName === slotName && dropTarget.index === childIds.length} onDrop={onDrop} onDropTargetChange={onDropTargetChange} />);
    return <div
      key={slotName}
      className={node?.type === 'builder/grid' ? (selectedSlot?.parentId === nodeId && selectedSlot.slotName === slotName ? `${s.gridColumn} ${s.gridColumnSelected}` : s.gridColumn) : undefined}
      data-builder-slot={slotName}
      onClick={node?.type === 'builder/grid' ? (event) => { event.stopPropagation(); onSelectSlot(nodeId, slotName); } : undefined}
    >
      {node?.type === 'builder/grid' && mode === 'editor' && <div className={s.gridColumnHeader}><span>{getBuilderSlotLabel(slotName)}</span><small>{childIds.length.toLocaleString('fa-IR')} مورد</small></div>}
      {children}
    </div>;
  }), [assets, document, dropTarget, mode, node, nodeId, onContextMenu, onDragEnd, onDragStart, onDrop, onDropTargetChange, onSelect, onSelectSlot, selectedId, selectedSlot, slotNames, viewport]);

  if (!node) return null;
  const src = node.props.src;
  const resolvedProps = node.type === 'builder/image' && typeof src === 'string' && src.startsWith('asset:')
    ? { ...node.props, src: assets.find((asset) => asset.id === src.slice(6))?.src || '' }
    : node.type === 'builder/product-grid' && Array.isArray(node.props.items)
      ? { ...node.props, items: node.props.items.map((item) => {
        if (!item || typeof item !== 'object' || Array.isArray(item) || typeof item.image !== 'string' || !item.image.startsWith('asset:')) return item;
        const imageSource = item.image;
        return { ...item, image: assets.find((asset) => asset.id === imageSource.slice(6))?.src || 'ph:0' };
      }) }
      : node.props;
  const content = definition.render(resolvedProps, childContent, { mode, viewport });
  if (mode === 'preview') return <div style={responsiveStyle(node, viewport)} data-builder-node={nodeId}>{content}</div>;

  return (
    <div
      className={isRoot ? s.canvasRootNode : isSelected ? `${s.canvasNode} ${s.canvasNodeSelected}` : s.canvasNode}
      draggable={!isRoot}
      role={isRoot ? 'group' : 'button'}
      tabIndex={isRoot ? 0 : 0}
      aria-label={isRoot ? 'ریشه صفحه' : `انتخاب ${definition.label}`}
      aria-pressed={isSelected}
      onDragStart={(event) => {
        event.stopPropagation();
        setBuilderDragData(event, { kind: 'node', nodeId });
        onDragStart({ kind: 'node', nodeId });
      }}
      onDragEnd={onDragEnd}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onSelect(nodeId);
        if (node.type === 'builder/grid') onSelectSlot(nodeId, getBuilderSlotNames(node)[0]);
      }}
      onContextMenu={(event) => {
        if (mode !== 'editor') return;
        event.preventDefault();
        event.stopPropagation();
        onContextMenu(nodeId, event.clientX, event.clientY);
      }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return;
        event.preventDefault();
        onSelect(nodeId);
      }}
      data-builder-node={nodeId}
      data-builder-type={node.type}
    >
      {!isRoot && <span className={s.nodeBadge}>{definition.label}</span>}
      <div className={isRoot ? s.canvasRootContent : s.canvasNodeContent} style={responsiveStyle(node, viewport)}>{content}</div>
    </div>
  );
}

export function BuilderCanvas(props: BuilderCanvasProps) {
  return (
    <div className={props.mode === 'preview' ? s.previewCanvas : s.editorCanvas} onClick={() => props.mode === 'editor' && props.onSelect(props.document.rootId)}>
      {props.masterDocument ? <MasterNodeView {...props} masterDocument={props.masterDocument} masterNodeId={props.masterDocument.rootId} isMasterRoot /> : <NodeView nodeId={props.document.rootId} isRoot {...props} />}
    </div>
  );
}

export { BUILDER_DATA_TYPE };
