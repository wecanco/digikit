import type { ReactNode } from 'react';

export type BuilderScalar = string | number | boolean | null;
export type BuilderValue = BuilderScalar | BuilderValue[] | { [key: string]: BuilderValue };
export type BuilderProps = Record<string, BuilderValue>;

export type BuilderFieldType = 'text' | 'textarea' | 'number' | 'select' | 'color' | 'url';

export interface BuilderFieldOption {
  label: string;
  value: string;
}

export interface BuilderField {
  key: string;
  label: string;
  type: BuilderFieldType;
  description?: string;
  options?: BuilderFieldOption[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface BuilderNode {
  id: string;
  type: string;
  props: BuilderProps;
  slots: Record<string, string[]>;
  styles?: BuilderResponsiveStyles;
}

export interface BuilderStyle {
  display?: 'block' | 'none';
  maxWidth?: number;
  marginTop?: number;
  marginBottom?: number;
  paddingBlock?: number;
  background?: string;
}

export type BuilderResponsiveStyles = Partial<Record<BuilderViewport, BuilderStyle>>;

export interface BuilderDocument {
  schemaVersion: 1;
  id: string;
  title: string;
  slug: string;
  description?: string;
  rootId: string;
  nodes: Record<string, BuilderNode>;
  createdAt: string;
  updatedAt: string;
}

export interface StoredPage {
  id: string;
  title: string;
  slug: string;
  document: BuilderDocument;
  updatedAt: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  version: number;
  versions: BuilderPageVersion[];
  inheritMasterLayout?: boolean;
}

export interface BuilderPageVersion {
  id: string;
  version: number;
  document: BuilderDocument;
  createdAt: string;
}

export interface BuilderAsset {
  id: string;
  name: string;
  mimeType: string;
  src: string;
  createdAt: string;
}

export interface BuilderBlock {
  id: string;
  title: string;
  rootId: string;
  nodes: Record<string, BuilderNode>;
  createdAt: string;
}

export interface BuilderStorageState {
  schemaVersion: 3;
  activePageId: string;
  pages: StoredPage[];
  assets: BuilderAsset[];
  blocks: BuilderBlock[];
  masterLayout: BuilderDocument | null;
}

export type BuilderMode = 'editor' | 'preview';
export type BuilderViewport = 'desktop' | 'tablet' | 'mobile';
export type BuilderTheme = 'light' | 'dark';

export interface BuilderDropTarget {
  parentId: string;
  slotName: string;
  index: number;
}

export interface BuilderBundle {
  format: 'digikit-builder-bundle';
  formatVersion: 1;
  exportedAt: string;
  page: BuilderDocument;
  assets: BuilderAsset[];
  blocks: BuilderBlock[];
}

export interface BuilderWorkspaceBundle {
  format: 'digikit-builder-workspace';
  formatVersion: 1;
  exportedAt: string;
  state: BuilderStorageState;
}

export interface BuilderRenderContext {
  mode: BuilderMode;
  viewport: BuilderViewport;
}

export interface BuilderDefinition {
  type: string;
  label: string;
  category: 'layout' | 'content' | 'commerce' | 'decorative';
  description: string;
  icon: string;
  defaultProps: BuilderProps;
  fields: BuilderField[];
  canHaveChildren?: boolean;
  render(props: BuilderProps, children: ReactNode, context: BuilderRenderContext): ReactNode;
}
