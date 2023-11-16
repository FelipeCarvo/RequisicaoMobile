import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestFormFrotaPesqComponent } from './request-form-frota-pesq.component';

describe('RequestFormFrotaPesqComponent', () => {
  let component: RequestFormFrotaPesqComponent;
  let fixture: ComponentFixture<RequestFormFrotaPesqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestFormFrotaPesqComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestFormFrotaPesqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
