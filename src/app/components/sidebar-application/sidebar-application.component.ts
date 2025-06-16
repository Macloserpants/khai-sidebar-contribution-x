import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApplicationPresenterAPI, ApplicationPresenter, RobotSettings } from '@universal-robots/contribution-api';
import { SidebarApplicationNode } from './sidebar-application.node';

@Component({
    templateUrl: './sidebar-application.component.html',
    styleUrls: ['./sidebar-application.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SidebarApplicationComponent implements ApplicationPresenter, OnChanges {
    // applicationAPI is optional
    @Input() applicationAPI: ApplicationPresenterAPI;
    // robotSettings is optional
    @Input() robotSettings: RobotSettings;
    // applicationNode is required
    @Input() applicationNode: SidebarApplicationNode;


    constructor(
        protected readonly translateService: TranslateService,
        protected readonly cd: ChangeDetectorRef
    ) {
        
    }

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
        console.log('text value: ', this.applicationNode.text);
    }

    // call saveNode to save node parameters
    saveNode() {
        this.cd.detectChanges();
        this.applicationAPI.applicationNodeService.updateNode(this.applicationNode);
    }
}
