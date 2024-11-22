import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAbonnComponent } from './add-abonn.component';

describe('AddAbonnComponent', () => {
  let component: AddAbonnComponent;
  let fixture: ComponentFixture<AddAbonnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAbonnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAbonnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
