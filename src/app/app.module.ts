import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { SidebarApplicationComponent } from './components/sidebar-application/sidebar-application.component';
import { UIAngularComponentsModule } from '@universal-robots/ui-angular-components';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import { PATH } from '../generated/contribution-constants';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { SidebarContributionComponent } from './components/sidebar-contribution/sidebar-contribution.component';

export const httpLoaderFactory = (http: HttpBackend) =>
    new MultiTranslateHttpLoader(http, [
        { prefix: PATH + '/assets/i18n/', suffix: '.json' },
        { prefix: './ui/assets/i18n/', suffix: '.json' },
    ]);

@NgModule({
    declarations: [
        SidebarApplicationComponent,
        SidebarContributionComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        UIAngularComponentsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useFactory: httpLoaderFactory, deps: [HttpBackend] },
            useDefaultLang: false,
        })
    ],
    providers: [],
})

export class AppModule implements DoBootstrap {
    constructor(private injector: Injector) {
    }

    ngDoBootstrap() {
        const sidebarapplicationComponent = createCustomElement(SidebarApplicationComponent, {injector: this.injector});
        customElements.define('funh-sidebar-contribution-sidebar-application', sidebarapplicationComponent);
        const sidebarContributionComponent = createCustomElement(SidebarContributionComponent, {injector: this.injector});
        customElements.define('funh-sidebar-contribution-sidebar-contribution', sidebarContributionComponent);
    }

    // This function is never called, because we don't want to actually use the workers, just tell webpack about them
    registerWorkersWithWebPack() {
        new Worker(new URL('./components/sidebar-application/sidebar-application.behavior.worker.ts'
            /* webpackChunkName: "sidebar-application.worker" */, import.meta.url), {
            name: 'sidebar-application',
            type: 'module'
        });
        new Worker(new URL('./components/sidebar-contribution/sidebar-contribution.behavior.worker.ts'
            /* webpackChunkName: "sidebar-contribution.worker" */, import.meta.url), {
            name: 'sidebar-contribution',
            type: 'module'
        });
    }
}

