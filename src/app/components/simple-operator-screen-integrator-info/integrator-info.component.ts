import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UIAngularComponentsModule } from '@universal-robots/ui-angular-components';

@Component({
    selector: 'simple-operator-screen-integrator-info',
    templateUrl: './integrator-info.component.html',
    styleUrls: ['./integrator-info.component.scss'],
    imports: [UIAngularComponentsModule, TranslateModule],
})
export class IntegratorInfoComponent {
    vendor_name = "Universal-Robots"
    urcap_name = "simple-operator-screen"
}
