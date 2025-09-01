import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { SimpleOperatorScreenComponent } from './components/simple-operator-screen/simple-operator-screen.component';
import { UIAngularComponentsModule } from '@universal-robots/ui-angular-components';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { PATH } from '../generated/contribution-constants';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LogoComponent } from "./components/simple-operator-screen-logo/logo.component";
import { IntegratorInfoComponent } from "./components/simple-operator-screen-integrator-info/integrator-info.component";

export const httpLoaderFactory = (http: HttpBackend) =>
    new MultiTranslateHttpLoader(http, [
        { prefix: PATH + '/assets/i18n/', suffix: '.json' },
        { prefix: './ui/assets/i18n/', suffix: '.json' },
    ]);

@NgModule({
    declarations: [
        SimpleOperatorScreenComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        UIAngularComponentsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {provide: TranslateLoader, useFactory: httpLoaderFactory, deps: [HttpBackend]},
            useDefaultLang: false,
        }),
        LogoComponent,
        IntegratorInfoComponent,
    ],
    providers: [],
})

export class AppModule implements DoBootstrap {
    constructor(private injector: Injector) {
    }

    ngDoBootstrap() {
        const simpleoperatorscreenComponent = createCustomElement(SimpleOperatorScreenComponent, {injector: this.injector});
        customElements.define('simple-operator-screen', simpleoperatorscreenComponent);
    }

    // This function is never called, because we don't want to actually use the workers, just tell webpack about them
    registerWorkersWithWebPack() {
        new Worker(new URL('./components/simple-operator-screen/simple-operator-screen.behavior.worker.ts'
        /* webpackChunkName: "simple-operator-screen.worker" */, import.meta.url), {
        name: 'simple-operator-screen',
        type: 'module'
      });
    }
}

