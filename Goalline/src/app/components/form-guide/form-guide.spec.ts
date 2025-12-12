import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGuide } from './form-guide';

describe('FormGuide', () => {
  let component: FormGuide;
  let fixture: ComponentFixture<FormGuide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGuide]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormGuide);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
