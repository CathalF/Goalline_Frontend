import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionDetail } from './competition-detail';

describe('CompetitionDetail', () => {
  let component: CompetitionDetail;
  let fixture: ComponentFixture<CompetitionDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitionDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
