import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAbonnementsComponent } from './show-abonnements.component';

describe('ShowAbonnementsComponent', () => {
  let component: ShowAbonnementsComponent;
  let fixture: ComponentFixture<ShowAbonnementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowAbonnementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAbonnementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
