import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAbnnComponent } from './update-abnn.component';

describe('UpdateAbnnComponent', () => {
  let component: UpdateAbnnComponent;
  let fixture: ComponentFixture<UpdateAbnnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateAbnnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAbnnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
