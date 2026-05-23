import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchNotes } from './match-notes';

describe('MatchNotes', () => {
  let component: MatchNotes;
  let fixture: ComponentFixture<MatchNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchNotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchNotes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
