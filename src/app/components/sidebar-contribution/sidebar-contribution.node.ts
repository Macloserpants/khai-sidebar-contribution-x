import { RobotSettings, SidebarItemPresenter, SidebarPresenterAPI } from "@universal-robots/contribution-api";

export interface SidebarScreen extends SidebarItemPresenter {
    type: string;
    version: string;
    parameters?:{
        [key: string]: any;
    }
    robotSettings?: RobotSettings;
    presenterAPI?: SidebarPresenterAPI;
  }