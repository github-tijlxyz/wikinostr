export type Tab = {
  id: number;
  type: TabType;
  parent?: number;
  data?: string;
};

export type TabType = 'welcome' | 'articlefind' | 'article' | 'settings' | 'editor';
