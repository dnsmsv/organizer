import { TestBed } from '@angular/core/testing';
import * as moment from 'moment';
import { expand } from 'rxjs/operators';
import { DateService } from './date.service';

describe('DateService', () => {
  let service: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateService],
    });
    service = TestBed.inject(DateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('date should be defined', () => {
    expect(service.date.value).toBeTruthy();
  });

  it('#changeMonth should call date.next', () => {
    Object.defineProperty(service, 'date', {
      get: jasmine.createSpy().and.returnValue({
        value: {
          add: jasmine.createSpy(),
          set: jasmine.createSpy(),
        },
        next: jasmine.createSpy(),
      }),
    });
    service.changeMonth(0);
    expect(service.date.next).toHaveBeenCalled();
  });

  it('#changeDate should call date.next', () => {
    Object.defineProperty(service, 'date', {
      get: jasmine.createSpy().and.returnValue({
        value: {
          add: jasmine.createSpy(),
          set: jasmine.createSpy(),
        },
        next: jasmine.createSpy(),
      }),
    });
    service.changeDate(moment());
    expect(service.date.next).toHaveBeenCalled();
  });
});
