import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListRequestFrotaPesqPage } from './list-request-pesq.page';

describe('ListInsumosPage', () => {
  let component: ListRequestFrotaPesqPage;
  let fixture: ComponentFixture<ListRequestFrotaPesqPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRequestFrotaPesqPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListRequestFrotaPesqPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
