import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalExcluiReqDevPage } from './modal-exclui-req-dev.page';

describe('ModalExcluiReqDevPage', () => {
  let component: ModalExcluiReqDevPage;
  let fixture: ComponentFixture<ModalExcluiReqDevPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalExcluiReqDevPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
