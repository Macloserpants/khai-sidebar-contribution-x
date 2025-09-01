import {
    RobotSettings,
    OperatorScreenPresenter,
    OperatorScreenPresenterAPI
} from '@universal-robots/contribution-api';
import { TranslateService } from '@ngx-translate/core';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    InputSignal, input, effect
} from '@angular/core';


interface SimpleOperatorScreen
    extends Omit<OperatorScreenPresenter, "robotSettings" | "presenterAPI"> {
    robotSettings: InputSignal<RobotSettings | undefined>;
    presenterAPI: InputSignal<OperatorScreenPresenterAPI | undefined>;
}
@Component({
    templateUrl: './simple-operator-screen.component.html',
    styleUrls: ['./simple-operator-screen.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class SimpleOperatorScreenComponent implements SimpleOperatorScreen {
    protected readonly translateService = inject(TranslateService);

    readonly robotSettings = input<RobotSettings | undefined>();
    readonly presenterAPI = input<OperatorScreenPresenterAPI | undefined>();

    readonly onCreateComponent = effect(() => {
        const language = this.robotSettings()?.language;
        if (language) {
            this.translateService.use(language);
        }
        this.translateService.setDefaultLang("en");
    });

}
