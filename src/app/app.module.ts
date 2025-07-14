import { DoBootstrap, Injector, NgModule } from '@angular/core';
<<<<<<< HEAD
import { SidebarContributionXAppComponent } from './components/sidebar-contribution-x-app/sidebar-contribution-x-app.component';
import { SidebarContributionXSidebarComponent } from './components/sidebar-contribution-x-sidebar/sidebar-contribution-x-sidebar.component';
=======
import { SidebarApplicationComponent } from './components/sidebar-application/sidebar-application.component';
>>>>>>> 60eced23a9c21fc806b7b9e94b3eb1c586c6c83b
import { UIAngularComponentsModule } from '@universal-robots/ui-angular-components';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
<<<<<<< HEAD
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import { PATH } from '../generated/contribution-constants';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
=======
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import { PATH } from '../generated/contribution-constants';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { SidebarContributionComponent } from './components/sidebar-contribution/sidebar-contribution.component';
>>>>>>> 60eced23a9c21fc806b7b9e94b3eb1c586c6c83b

export const httpLoaderFactory = (http: HttpBackend) =>
    new MultiTranslateHttpLoader(http, [
        { prefix: PATH + '/assets/i18n/', suffix: '.json' },
        { prefix: './ui/assets/i18n/', suffix: '.json' },
    ]);

@NgModule({
<<<<<<< HEAD
  declarations: [
        SidebarContributionXAppComponent,
        SidebarContributionXSidebarComponent
   ],
=======
    declarations: [
        SidebarApplicationComponent,
        SidebarContributionComponent
    ],
>>>>>>> 60eced23a9c21fc806b7b9e94b3eb1c586c6c83b
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
<<<<<<< HEAD
    constructor(
        private injector: Injector,
        private translate: TranslateService
    ) {
        translate.setDefaultLang('en');
        translate.use('en');
    }

  async ngDoBootstrap() {
        const sidebarcontributionxappComponent = createCustomElement(SidebarContributionXAppComponent, {injector: this.injector});
        customElements.define('funh-sidebar-contribution-x-sidebar-contribution-x-app', sidebarcontributionxappComponent);
        const sidebarcontributionxsidebarComponent = createCustomElement(SidebarContributionXSidebarComponent, {injector: this.injector});
        customElements.define('funh-sidebar-contribution-x-sidebar-contribution-x-sidebar', sidebarcontributionxsidebarComponent);
    }

  // This function is never called, because we don't want to actually use the workers, just tell webpack about them
  registerWorkersWithWebPack() {
        new Worker(new URL('./components/sidebar-contribution-x-app/sidebar-contribution-x-app.behavior.worker.ts'
            /* webpackChunkName: "sidebar-contribution-x-app.worker" */, import.meta.url), {
            name: 'sidebar-contribution-x-app',
            type: 'module'
        });
        new Worker(new URL('./components/sidebar-contribution-x-sidebar/sidebar-contribution-x-sidebar.behavior.worker.ts'
            /* webpackChunkName: "sidebar-contribution-x-sidebar.worker" */, import.meta.url), {
            name: 'sidebar-contribution-x-sidebar',
            type: 'module'
        });
     
=======
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
>>>>>>> 60eced23a9c21fc806b7b9e94b3eb1c586c6c83b
    }
}

