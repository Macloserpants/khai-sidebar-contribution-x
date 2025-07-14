/// <reference lib="webworker" />
import {
    ApplicationBehaviors,
    ApplicationNode, OptionalPromise,
    registerApplicationBehavior,
    ScriptBuilder
} from '@universal-robots/contribution-api';
import { SidebarApplicationNode } from './sidebar-application.node';

// factory is required
const createApplicationNode = (): OptionalPromise<SidebarApplicationNode> => ({
    type: 'funh-sidebar-contribution-sidebar-application',    // type is required
    version: '1.0.0',     // version is required
    text: 'init text',
});

// generatePreamble is optional
const generatePreambleScriptCode = (node: SidebarApplicationNode): OptionalPromise<ScriptBuilder> => {
    const builder = new ScriptBuilder();
    return builder;
};

// upgradeNode is optional
const upgradeApplicationNode
  = (loadedNode: ApplicationNode, defaultNode: SidebarApplicationNode): SidebarApplicationNode =>
      defaultNode;

// downgradeNode is optional
const downgradeApplicationNode
  = (loadedNode: ApplicationNode, defaultNode: SidebarApplicationNode): SidebarApplicationNode =>
      defaultNode;

const behaviors: ApplicationBehaviors = {
    factory: createApplicationNode,
    generatePreamble: generatePreambleScriptCode,
    upgradeNode: upgradeApplicationNode,
    downgradeNode: downgradeApplicationNode
};

registerApplicationBehavior(behaviors);
