import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { TasksService, Task } from './tasks.service';
import * as moment from 'moment';

describe('TasksService', () => {
  let service: TasksService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TasksService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#get tasks should return empty map', () => {
    expect(service.tasks.value).toBeTruthy();
  });

  it('#load should call next if get null request', () => {
    const someDate = moment();
    Object.defineProperty(service, 'tasks', {
      get: jasmine.createSpy().and.returnValue({
        value: {
          has: jasmine.createSpy('has').and.returnValue(false),
          delete: jasmine.createSpy('delete'),
          set: jasmine.createSpy('set'),
        },
        next: jasmine.createSpy('next'),
      }),
    });
    service.load(someDate);
    const request: TestRequest = httpController.expectOne(
      `${service.url}/${someDate.format('DD-MM-YYYY')}.json`
    );
    expect(request.request.method).toBe('GET');
    request.flush(null);
    expect(service.tasks.next).toHaveBeenCalled();
  });

  it('#load should call next if get request with task', () => {
    const someDate = moment();
    Object.defineProperty(service, 'tasks', {
      get: jasmine.createSpy().and.returnValue({
        value: {
          has: jasmine.createSpy('has').and.returnValue(true),
          delete: jasmine.createSpy('delete'),
          set: jasmine.createSpy('set'),
          get: jasmine.createSpy('get').and.returnValue([]),
        },
        next: jasmine.createSpy('next'),
      }),
      configurable: true,
    });
    service.load(someDate);
    const request: TestRequest = httpController.expectOne(
      `${service.url}/${someDate.format('DD-MM-YYYY')}.json`
    );
    expect(request.request.method).toBe('GET');
    const task: Task = {
      title: 'some title',
    };
    request.flush([task]);
    expect(service.tasks.next).toHaveBeenCalled();
  });

  it('#load should call next if get request with string task', () => {
    const someDate = moment();
    Object.defineProperty(service, 'tasks', {
      get: jasmine.createSpy().and.returnValue({
        value: {
          has: jasmine.createSpy('has').and.returnValue(true),
          delete: jasmine.createSpy('delete'),
          set: jasmine.createSpy('set'),
          get: jasmine.createSpy('get').and.returnValue([]),
        },
        next: jasmine.createSpy('next'),
      }),
      configurable: true,
    });
    service.load(someDate);
    const request: TestRequest = httpController.expectOne(
      `${service.url}/${someDate.format('DD-MM-YYYY')}.json`
    );
    expect(request.request.method).toBe('GET');
    request.flush('{}');
    expect(service.tasks.next).toHaveBeenCalled();
  });

  it('#load should call delete if date already exists', () => {
    const someDate = moment();
    Object.defineProperty(service, 'tasks', {
      get: jasmine.createSpy().and.returnValue({
        value: {
          has: jasmine.createSpy('has').and.returnValue(true),
          delete: jasmine.createSpy('delete'),
          set: jasmine.createSpy('set'),
          get: jasmine.createSpy('get').and.returnValue([]),
        },
        next: jasmine.createSpy('next'),
      }),
      configurable: true,
    });
    service.load(someDate);
    const request: TestRequest = httpController.expectOne(
      `${service.url}/${someDate.format('DD-MM-YYYY')}.json`
    );
    expect(request.request.method).toBe('GET');
    request.flush(null);
    expect(service.tasks.value.delete).toHaveBeenCalled();
  });

  it('#load should throw error and call console.error', () => {
    const someDate = moment();
    const consoleErrorSpy = spyOn(console, 'error');
    service.load(someDate);
    const request: TestRequest = httpController.expectOne(
      `${service.url}/${someDate.format('DD-MM-YYYY')}.json`
    );
    expect(request.request.method).toBe('GET');
    request.error(new ErrorEvent('some error'));
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('#create should map with null and call next', () => {
    const task: Task = {
      title: 'some title',
      date: 'some date',
    };
    Object.defineProperty(service, 'tasks', {
      get: jasmine.createSpy().and.returnValue({
        value: {
          has: jasmine.createSpy('has').and.returnValue(true),
          delete: jasmine.createSpy('delete'),
          set: jasmine.createSpy('set'),
          get: jasmine.createSpy('get').and.returnValue([]),
        },
        next: jasmine.createSpy('next'),
      }),
      configurable: true,
    });
    service.create(moment(), task);
    const request: TestRequest = httpController.expectOne(
      `${service.url}/${task.date}.json`
    );
    expect(request.request.method).toBe('POST');
    request.flush(null);
    expect(service.tasks.next).toHaveBeenCalled();
  });

  it('#create should map with some result and call next', () => {
    const task: Task = {
      title: 'some title',
      date: 'some date',
    };
    Object.defineProperty(service, 'tasks', {
      get: jasmine.createSpy().and.returnValue({
        value: {
          has: jasmine.createSpy('has').and.returnValue(true),
          delete: jasmine.createSpy('delete'),
          set: jasmine.createSpy('set'),
          get: jasmine.createSpy('get').and.returnValue([]),
        },
        next: jasmine.createSpy('next'),
      }),
      configurable: true,
    });
    service.create(moment(), task);
    const request: TestRequest = httpController.expectOne(
      `${service.url}/${task.date}.json`
    );
    expect(request.request.method).toBe('POST');
    request.flush({
      name: 'some name',
    });
    expect(service.tasks.next).toHaveBeenCalled();
  });

  it('#create should map with null and call set', () => {
    const task: Task = {
      title: 'some title',
      date: 'some date',
    };
    Object.defineProperty(service, 'tasks', {
      get: jasmine.createSpy().and.returnValue({
        value: {
          set: jasmine.createSpy('set'),
          get: jasmine.createSpy('get').and.returnValue(undefined),
        },
        next: jasmine.createSpy('next'),
      }),
      configurable: true,
    });
    service.create(moment(), task);
    const request: TestRequest = httpController.expectOne(
      `${service.url}/${task.date}.json`
    );
    expect(request.request.method).toBe('POST');
    request.flush(null);
    expect(service.tasks.value.set).toHaveBeenCalled();
  });

  it('#create should throw error and call console.error', () => {
    const task: Task = {
      title: 'some title',
      date: 'some date',
    };
    const consoleErrorSpy = spyOn(console, 'error');
    service.create(moment(), task);
    const request: TestRequest = httpController.expectOne(
      `${service.url}/${task.date}.json`
    );
    expect(request.request.method).toBe('POST');
    request.error(new ErrorEvent('some error'));
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('#remove should call tasks.next if date exists in tasks', () => {
    const task: Task = {
      title: 'some title',
      date: 'some date',
    };
    Object.defineProperty(service, 'tasks', {
      get: jasmine.createSpy().and.returnValue({
        value: {
          delete: jasmine.createSpy('delete'),
          set: jasmine.createSpy('set'),
          get: jasmine.createSpy('get').and.returnValue([
            {
              id: 'some id',
            },
          ]),
        },
        next: jasmine.createSpy('next'),
      }),
      configurable: true,
    });
    service.remove(moment(), task);
    const request: TestRequest = httpController.expectOne(
      `${service.url}/${task.date}/${task.id}.json`
    );
    expect(request.request.method).toBe('DELETE');
    request.flush({});
    expect(service.tasks.next).toHaveBeenCalled();
  });

  it('#remove should not call tasks.next if date do not exist in tasks', () => {
    const task: Task = {
      title: 'some title',
      date: 'some date',
    };
    Object.defineProperty(service, 'tasks', {
      get: jasmine.createSpy().and.returnValue({
        value: {
          get: jasmine.createSpy('get').and.returnValue(undefined),
        },
        next: jasmine.createSpy('next'),
      }),
      configurable: true,
    });
    service.remove(moment(), task);
    const request: TestRequest = httpController.expectOne(
      `${service.url}/${task.date}/${task.id}.json`
    );
    expect(request.request.method).toBe('DELETE');
    request.flush({});
    expect(service.tasks.next).not.toHaveBeenCalled();
  });

  it('#remove should throw error and call console.error', () => {
    const task: Task = {
      title: 'some title',
      date: 'some date',
    };
    const consoleErrorSpy = spyOn(console, 'error');
    service.remove(moment(), task);
    const request: TestRequest = httpController.expectOne(
      `${service.url}/${task.date}/${task.id}.json`
    );
    expect(request.request.method).toBe('DELETE');
    request.error(new ErrorEvent('some error'));
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
