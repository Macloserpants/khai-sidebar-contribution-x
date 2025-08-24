import {
  registerSidebarBehavior,
  SidebarItemBehaviors,
} from "@universal-robots/contribution-api";

const behaviors: SidebarItemBehaviors = {
  factory: () => {
    return {
      type: "funh-sidebar-contribution-x-sidebar-contribution-x-sidebar",
      version: "1.0.0",
    };
  },
};

registerSidebarBehavior(behaviors);
