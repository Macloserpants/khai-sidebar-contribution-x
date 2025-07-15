import {AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, input, InputSignal, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {
  RobotSettings,
  SidebarItemPresenter,
  SidebarPresenterAPI
} from '@universal-robots/contribution-api';
import {TranslateService} from "@ngx-translate/core";
import {first, Subscription} from "rxjs";
import { SidebarContributionXAppNode } from '../sidebar-contribution-x-app/sidebar-contribution-x-app.node';
import { TextService } from '../sidebar-contribution-x-app/TextService';


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
  appText: string = ''; //用于绑定模板
  private textSubscription: Subscription; //保存订阅，用于销毁
  // @Input() sidebarScreen: SignalSidebarItemPresenter;

  presenterAPI = input<SidebarPresenterAPI | undefined>();
  robotSettings = input<RobotSettings | undefined>();

  constructor(
    protected readonly translateService: TranslateService,
    protected readonly cd: ChangeDetectorRef,
    private textService: TextService //注入 TextService
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

    //订阅text变化
    this.textSubscription = this.textService.text$.subscribe(text => {
      this.appText = text; //更新本地变量
      if(!text){
        this.appText = appNode.text;
      }
      this.cd.detectChanges(); //触发OnPush 变更检测
    });
  }
  ngOnDestroy(): void {
    console.log('sidebar contribution close!');

    //销毁订阅，防止内存泄漏
    if(this.textSubscription){
      this.textSubscription.unsubscribe();
    }
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
