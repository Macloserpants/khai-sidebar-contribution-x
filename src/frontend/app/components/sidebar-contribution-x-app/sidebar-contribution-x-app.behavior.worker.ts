/// <reference lib="webworker" />
import {
    ApplicationBehaviors,
    ApplicationNode, OptionalPromise,
    registerApplicationBehavior,
    ScriptBuilder
} from '@universal-robots/contribution-api';
import { SidebarContributionXAppNode } from './sidebar-contribution-x-app.node';

// factory is required
const createApplicationNode = (): OptionalPromise<SidebarContributionXAppNode> => ({
    type: 'funh-sidebar-contribution-x-sidebar-contribution-x-app',    // type is required
    version: '1.0.0',     // version is required
    text: 'init text',
});

// generatePreamble is optional
const generatePreambleScriptCode = (node: SidebarContributionXAppNode): OptionalPromise<ScriptBuilder> => {
    const builder = new ScriptBuilder();
    return builder;
};

// upgradeNode is optional
const upgradeApplicationNode
  = (loadedNode: ApplicationNode, defaultNode: SidebarContributionXAppNode): SidebarContributionXAppNode =>
      defaultNode;

// downgradeNode is optional
const downgradeApplicationNode
  = (loadedNode: ApplicationNode, defaultNode: SidebarContributionXAppNode): SidebarContributionXAppNode =>
      defaultNode;

const behaviors: ApplicationBehaviors = {
    factory: createApplicationNode,
    generatePreamble: generatePreambleScriptCode,
    upgradeNode: upgradeApplicationNode,
    downgradeNode: downgradeApplicationNode
};

registerApplicationBehavior(behaviors);
