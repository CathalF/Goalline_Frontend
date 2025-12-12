import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCompetitions } from './admin-competitions';

describe('AdminCompetitions', () => {
  let component: AdminCompetitions;
  let fixture: ComponentFixture<AdminCompetitions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCompetitions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCompetitions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
