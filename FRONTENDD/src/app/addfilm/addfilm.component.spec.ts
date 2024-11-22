import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfilmComponent } from './addfilm.component';

describe('AddfilmComponent', () => {
  let component: AddfilmComponent;
  let fixture: ComponentFixture<AddfilmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddfilmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddfilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
