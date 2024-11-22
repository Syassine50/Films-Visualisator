import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmslistComponent } from './filmslist.component';

describe('FilmslistComponent', () => {
  let component: FilmslistComponent;
  let fixture: ComponentFixture<FilmslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilmslistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
