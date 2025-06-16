import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SidebarApplicationComponent} from "./sidebar-application.component";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {Observable, of} from "rxjs";

describe('SidebarApplicationComponent', () => {
  let fixture: ComponentFixture<SidebarApplicationComponent>;
  let component: SidebarApplicationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarApplicationComponent],
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

    fixture = TestBed.createComponent(SidebarApplicationComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
