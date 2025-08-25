import {AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, input, InputSignal, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {
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
  presenterAPI: InputSignal<SidebarPresenterAPI | undefined>;
}
@Component({
  templateUrl: './sidebar-contribution-x-sidebar.component.html',
  styleUrls: ['./sidebar-contribution-x-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class SidebarContributionXSidebarComponent implements SignalSidebarItemPresenter, OnChanges, OnDestroy, AfterContentInit {
  appText: string = '';
  isOn: boolean = false;
  IO_status_check: number;

  private ros2Client: Ros2Client;
  private textSubscription: Subscription;
  private subscription: Subscription; 
  
  // @Input() sidebarScreen: SignalSidebarItemPresenter;

  presenterAPI = input<SidebarPresenterAPI | undefined>();
  robotSettings = input<RobotSettings | undefined>();

  constructor(
    protected readonly translateService: TranslateService,
    protected readonly cd: ChangeDetectorRef,
    private textService: TextService
  ){

  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.applicationAPI?.firstChange) {
    // const rosClient = this.ros2Client;
    // if (!rosClient) {
    //     console.warn("ROS2 client not available yet");
    //     return;
    // }

    // this.subscription = ( await RosHelper.subscribeToAnalogStatus(rosClient)).subscribe((msg) => {
    //         this.IO_status_check = msg.value;
    //         this.cd.detectChanges();
    //     });
    // }

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

    if(this.textSubscription){
      this.textSubscription.unsubscribe();
    }
  }

  saveNode(){
    this.cd.detectChanges();
  }
  onMyButtonClick(): void {
    console.log('UR Button clicked inside SidebarContributionXSidebarComponent!');
  this.appText = 'Button was clicked!';
  this.cd.detectChanges();
  }

  toggle(): void {
  this.isOn = !this.isOn;
  
  if(!this.isOn) {
    this.appText = 'Toggle Off!'
  }
  
  else {
    this.appText = 'Toggle On!'
  }
  console.log('Toggle state:', this.isOn);
  }

  // KHAIRUL ROS

  getIOState() {
    return this.IO_status_check;
  }
}