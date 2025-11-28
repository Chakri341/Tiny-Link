export type LinkItem = {
  code: string;
  url: string;
  clicks: number;
  lastClicked: Date | null;
  createdAt: Date;
  expiresAt: Date | null; 
  passwordHash :string | null
};

export interface LinksTableProps {
  initialLinks: LinkItem[];
  pageSize: number;
  initialHasMore: boolean;
}