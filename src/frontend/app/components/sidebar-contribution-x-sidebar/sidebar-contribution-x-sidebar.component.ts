import {AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, input, InputSignal, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {
  ApplicationPresenterAPI,
  RobotSettings,
  SidebarItemPresenter,
  SidebarPresenterAPI,
  Ros2Client
} from '@universal-robots/contribution-api';
import {TranslateService} from "@ngx-translate/core";
import {first, Subscription} from "rxjs";
import { SidebarContributionXAppNode } from '../sidebar-contribution-x-app/sidebar-contribution-x-app.node';
import { TextService } from '../sidebar-contribution-x-app/TextService';

// KHAIRUL ROS
import { RosHelper } from '../../RosHelper';

interface SignalSidebarItemPresenter extends Omit<SidebarItemPresenter, "robotSettings" | "presenterAPI"> {
  robotSettings: InputSignal<RobotSettings | undefined>;
  presenterAPI: InputSignal<SidebarPresenterAPI | "ros2Client">;
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
  // applicationAPI = input<ApplicationPresenterAPI | undefined>();
  robotSettings = input<RobotSettings | undefined>();

  private ros2Client?: Ros2Client;
  IO_status_check: number;
  private subscription: Subscription | undefined;


  constructor(
    protected readonly translateService: TranslateService,
    protected readonly cd: ChangeDetectorRef,
    private textService: TextService, //注入 TextService

  ){

  }
  
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes.applicationAPI?.firstChange) {
        const rosClient = this.applicationAPI()?.ros2Client;
        if (!rosClient) {
            console.warn("ROS2 client not available yet");
            return;
        }

        this.subscription = (
            await RosHelper.subscribeToAnalogStatus(rosClient)
        ).subscribe((msg) => {
            this.IO_status_check = msg.value;
            this.cd.detectChanges();
        });
    }

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
    console.log('Sidebar contribution close!');

    //销毁订阅，防止内存泄漏
    if(this.textSubscription){
      this.textSubscription.unsubscribe();
    }
  }
  saveNode(){
    this.cd.detectChanges();
  }
  // KHAIRUL BUTTON TEST
  onMyButtonClick(): void {
    console.log('UR Button clicked inside SidebarContributionXSidebarComponent!');
  // Add your custom logic here
  // For example: call a service, update appText, or save node
  this.appText = 'Button was clicked!';
  this.cd.detectChanges();
  }

  // KHAIRUL ROS

  getIOState() {
    return this.IO_status_check
  }
}
