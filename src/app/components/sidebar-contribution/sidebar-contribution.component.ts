import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, input, InputSignal, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SidebarPresenterAPI, SidebarItemPresenter, RobotSettings, SidebarItem } from '@universal-robots/contribution-api';
import { first } from 'rxjs/internal/operators/first';
import { SidebarScreen } from './sidebar-contribution.node';
import { SidebarApplicationNode } from '../sidebar-application/sidebar-application.node';


@Component({
    selector: 'sidebar-contribution',
    templateUrl: './sidebar-contribution.component.html',
    styleUrls: ['./sidebar-contribution.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class SidebarContributionComponent implements SidebarItemPresenter, OnChanges, OnDestroy, OnInit {
    // applicationAPI is optional
    @Input() presenterAPI: SidebarPresenterAPI;
    // robotSettings is optional
    @Input() robotSettings: RobotSettings;
    // // sidbarNode is required
    @Input() sidebarScreen: SidebarScreen;

    appText: string = '';
    constructor(
        protected readonly translateService: TranslateService,
        protected readonly cd: ChangeDetectorRef
    ) {
        
    }
    async ngOnInit(): Promise<void> {
        console.log('sidebar contribution open!');
        const appNode = await this.presenterAPI.applicationService
                        .getApplicationNode('funh-sidebar-contribution-sidebar-application') as SidebarApplicationNode;
        this.appText = appNode.text;
        console.log('available app node text: ', this.appText);
        this.cd.detectChanges(); //should manually trigger change detect!!
    }
    ngOnDestroy(): void {
        console.log('sidebar contribution close!')
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
                .subscribe(async () => {
                    this.cd.detectChanges();
                    
                });
        }
    }


    saveNode(){
        this.cd.detectChanges();
        // this.presenterAPI.applicationService.getApplicationNode()
    }
    
    // type: string;
    // version: string;
    // parameters?: { [key: string]: any; };

    // ngOnChanges(changes: SimpleChanges): void {
    //     if (changes?.robotSettings) {
    //         if (!changes?.robotSettings?.currentValue) {
    //             return;
    //         }

    //         if (changes?.robotSettings?.isFirstChange()) {
    //             if (changes?.robotSettings?.currentValue) {
    //                 // this.translateService.use(changes?.robotSettings?.currentValue?.language);
    //             }
    //             // this.translateService.setDefaultLang('en');
    //         }

    //         // this.translateService
    //         //     .use(changes?.robotSettings?.currentValue?.language)
    //         //     .pipe(first())
    //         //     .subscribe(() => {
    //         //         this.cd.detectChanges();
    //         //     });
    //     }
    // }



    // call saveNode to save node parameters
    // saveNode() {
    //     this.cd.detectChanges();
    //     this.applicationAPI.applicationNodeService.updateNode(this.applicationNode);
    // }
}
