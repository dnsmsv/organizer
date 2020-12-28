import { TestBed } from '@angular/core/testing';
import * as moment from 'moment';
import { MomentPipe } from './moment.pipe';

describe('MomentPipe', () => {
  let pipe: MomentPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MomentPipe],
    });
    pipe = TestBed.inject(MomentPipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it("#transform should return 'Dec 2020' for date '28.12.2020 16:41:03.123'", () => {
    const result: string = pipe.transform(
      moment({
        year: 2020,
        month: 11,
        day: 28,
        hour: 16,
        minute: 41,
        second: 3,
        millisecond: 123,
      })
    );
    expect(result).toBe('Dec 2020');
  });
});
