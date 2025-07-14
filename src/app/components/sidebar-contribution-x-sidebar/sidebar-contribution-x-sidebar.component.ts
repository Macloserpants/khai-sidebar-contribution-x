import {AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, input, InputSignal, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {
  RobotSettings,
  SidebarItemPresenter,
  SidebarPresenterAPI
} from '@universal-robots/contribution-api';
import {TranslateService} from "@ngx-translate/core";
import {first} from "rxjs";
import { SidebarContributionXAppNode } from '../sidebar-contribution-x-app/sidebar-contribution-x-app.node';


interface SignalSidebarItemPresenter extends Omit<SidebarItemPresenter, "robotSettings" | "presenterAPI"> {
  robotSettings: InputSignal<RobotSettings | undefined>;
  presenterAPI: InputSignal<SidebarPresenterAPI | undefined>;
}
@Component({
  templateUrl: './sidebar-contribution-x-sidebar.component.html',
  styleUrls: ['./sidebar-contribution-x-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class SidebarContributionXSidebarComponent implements SignalSidebarItemPresenter, OnChanges, OnDestroy, AfterContentInit {

  // @Input() sidebarScreen: SignalSidebarItemPresenter;

  presenterAPI = input<SidebarPresenterAPI | undefined>();
  robotSettings = input<RobotSettings | undefined>();

  appText: string = '';
  constructor(
    protected readonly translateService: TranslateService,
    protected readonly cd: ChangeDetectorRef
  ){

  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.robotSettings){
      if(!changes?.robotSettings?.currentValue){
        return;
      }

      if(changes?.robotSettings?.isFirstChange()){
        if(changes?.robotSettings?.currentValue){
          this.translateService.use(changes?.robotSettings?.currentValue?.language);
        }
        this.translateService.setDefaultLang('en');
      }

      this.translateService
          .use(changes?.robotSettings?.currentValue?.language)
          .pipe(first())
          .subscribe(() => {
              this.cd.detectChanges();
          });
      // console.log(this.robotSettings()?.language);
    }
  }

  async ngAfterContentInit(): Promise<void>{
    console.log('sidebar contribution open!');
    const appNode = await this.presenterAPI()?.applicationService
    .getApplicationNode('funh-sidebar-contribution-x-sidebar-contribution-x-app') as SidebarContributionXAppNode;
    this.appText = appNode.text;
    console.log('available app node text: ', this.appText);
    this.cd.detectChanges(); //should manually trigger change detect!!
  }
  ngOnDestroy(): void {
    console.log('sidebar contribution close!');
  }


  // switchToChinese() {
  //     this.translateService.use('zh-CN');
  //     this.cd.detectChanges();
  // }
  // switchToEnglish(){
  //     this.translateService.use('en');
  //     this.cd.detectChanges();
  // }
  saveNode(){
    this.cd.detectChanges();
  }
}
