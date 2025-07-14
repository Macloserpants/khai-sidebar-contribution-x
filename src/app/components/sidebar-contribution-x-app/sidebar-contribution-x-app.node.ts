import { ApplicationNode } from '@universal-robots/contribution-api';

export interface SidebarContributionXAppNode extends ApplicationNode {
  type: string;
  version: string;
  text: string;
}
