export type LinkItem = {
  code: string;
  url: string;
  clicks: number;
  lastClicked: Date | null;
  createdAt: Date;
};

export interface LinksTableProps {
  initialLinks: LinkItem[];
  pageSize: number;
  initialHasMore: boolean;
}