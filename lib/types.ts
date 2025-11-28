import { Link } from "@prisma/client";

export type LinkItem = Link;


export interface LinksTableProps {
  initialLinks: LinkItem[];
  pageSize: number;
  initialHasMore: boolean;
}


// export type LinkItem = {
//   code: string;
//   url: string;
//   clicks: number;
//   lastClicked: Date | null;
//   createdAt: Date;
//   expiresAt: Date | null; 
//   passwordHash :string | null
// };