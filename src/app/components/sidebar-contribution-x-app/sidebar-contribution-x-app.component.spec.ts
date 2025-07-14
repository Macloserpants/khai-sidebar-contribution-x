import {ComponentFixture, TestBed} from '@angular/core/testing';
import { SidebarContributionXAppComponent} from "./sidebar-contribution-x-app.component";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {Observable, of} from "rxjs";

describe('SidebarContributionXAppComponent', () => {
  let fixture: ComponentFixture<SidebarContributionXAppComponent>;
  let component: SidebarContributionXAppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarContributionXAppComponent],
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader, useValue: {
            getTranslation(): Observable<Record<string, string>> {
              return of({});
            }
          }
        }
      })],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarContributionXAppComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
