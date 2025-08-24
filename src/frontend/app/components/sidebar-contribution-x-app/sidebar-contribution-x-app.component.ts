import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injectable, Input, OnChanges, OnInit, Signal, signal, SimpleChanges } from '@angular/core';
import { ApplicationPresenterAPI, ApplicationPresenter, RobotSettings } from '@universal-robots/contribution-api';
import { SidebarContributionXAppNode } from './sidebar-contribution-x-app.node';
import { BehaviorSubject } from 'rxjs';
import { TextService } from './TextService';

@Component({
    templateUrl: './sidebar-contribution-x-app.component.html',
    styleUrls: ['./sidebar-contribution-x-app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})


export class SidebarContributionXAppComponent implements ApplicationPresenter,AfterContentInit,OnChanges {
    // applicationAPI is optional
    @Input() applicationAPI: ApplicationPresenterAPI;
    // robotSettings is optional
    @Input() robotSettings: RobotSettings;
    // applicationNode is required
    @Input() applicationNode: SidebarContributionXAppNode;
console: any;

    


    constructor(
        protected readonly translateService: TranslateService,
        protected readonly cd: ChangeDetectorRef,
        private textService: TextService
    ) {
    }
    ngAfterContentInit(): void {
        if(this.applicationNode.text){
            console.log('text value: ', this.applicationNode.text);
        }
        this.updateText(this.applicationNode.text);
    }

    updateText(newText: string){
        this.applicationNode.text = newText;
        this.textService.updateText(newText); //通知服务
        console.log("通知服务更新：",{newText})
        this.saveNode();
    }
    // ngAfterContentInit(): void {
        
    // }

    

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.robotSettings) {
            if (!changes?.robotSettings?.currentValue) {
                return;
            }

            if (changes?.robotSettings?.isFirstChange()) {
                if (changes?.robotSettings?.currentValue) {
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
        }
        
    }

    

    // call saveNode to save node parameters
    saveNode() {
        this.cd.detectChanges();
        this.applicationAPI.applicationNodeService.updateNode(this.applicationNode);
    }
}
