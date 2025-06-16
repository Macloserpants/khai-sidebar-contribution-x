import { ApplicationNode } from '@universal-robots/contribution-api';

export interface SidebarApplicationNode extends ApplicationNode {
  type: string;
  version: string;
  text: string;
}
