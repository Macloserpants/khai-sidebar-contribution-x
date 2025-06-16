import { registerSidebarBehavior, SidebarItemBehaviors } from "@universal-robots/contribution-api";

const behaviors: SidebarItemBehaviors = {
    factory: () => {
        return {
            type: 'funh-sidebar-contribution-sidebar-contribution',
            version: '1.0.0',
        }
    }
}

registerSidebarBehavior(behaviors);