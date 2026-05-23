import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionsList } from './competitions-list';

describe('CompetitionsList', () => {
  let component: CompetitionsList;
  let fixture: ComponentFixture<CompetitionsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitionsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
