import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { homePage } from './home.page';

describe('HomePage', () => {
  let component: homePage;
  let fixture: ComponentFixture<homePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [homePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(homePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
