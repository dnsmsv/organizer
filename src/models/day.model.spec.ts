import { TestBed } from '@angular/core/testing';
import * as moment from 'moment';
import { Day } from './day.model';

describe('Day', () => {
  let day: Day;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    day = new Day(moment(), false, false, false);
  });

  it('set task1 should set without changes', () => {
    day.task1 = 'title<10';
    expect(day.task1).toBe('title<10');
  });

  it('set task1 should set with cutting to 10 char', () => {
    day.task1 = 'title more than 10 characters';
    expect(day.task1).toBe('title more...');
  });

  it('set task2 should set without changes', () => {
    day.task2 = 'title<10';
    expect(day.task2).toBe('title<10');
  });

  it('set task2 should set with cutting to 10 char', () => {
    day.task2 = 'title more than 10 characters';
    expect(day.task2).toBe('title more...');
  });
});
