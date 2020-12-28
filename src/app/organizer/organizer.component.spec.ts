import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DateService } from '../shared/date.service';
import { TasksService } from '../shared/tasks.service';
import { OrganizerComponent } from './organizer.component';
import * as moment from 'moment';
import { MomentPipe } from '../shared/moment.pipe';
import { MockPipe } from 'mock-pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('OrganizerComponent', () => {
  let component: OrganizerComponent;
  let fixture: ComponentFixture<OrganizerComponent>;
  const tasksService = jasmine.createSpyObj('tasksService', [
    'load',
    'create',
    'remove',
  ]);
  const dateService = jasmine.createSpyObj('dateService', ['changeMonth']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OrganizerComponent,
        MockPipe(MomentPipe, () => '29.06.2018 15:12'),
      ],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        { provide: 'moment', useValue: moment },
        { provide: DateService, useValue: dateService },
        { provide: TasksService, useValue: tasksService },
        HttpClient,
        HttpHandler,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    Object.defineProperty(tasksService, 'tasks', {
      get: jasmine.createSpy().and.returnValue(
        of({
          has: jasmine.createSpy('has').and.returnValue(false),
        })
      ),
      configurable: true,
    });
    Object.defineProperty(dateService, 'date', {
      get: jasmine.createSpy().and.returnValue(of(undefined)),
      configurable: true,
    });
    fixture = TestBed.createComponent(OrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'ngOnDestroy');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should call form reset and taskService load', () => {
    const task = {
      has: jasmine.createSpy('has').and.returnValue(true),
      get: jasmine.createSpy('get').and.returnValue([]),
    };
    Object.defineProperty(tasksService, 'tasks', {
      get: jasmine.createSpy().and.returnValue(of(task)),
    });
    component.ngOnInit();
    expect(task.get).toHaveBeenCalled();
    expect(tasksService.load).toHaveBeenCalled();
  });

  it('#submit should create task', () => {
    Object.defineProperty(dateService, 'date', {
      get: jasmine.createSpy().and.returnValue({
        value: moment(),
      }),
      configurable: true,
    });
    component.submit();
    expect(tasksService.create).toHaveBeenCalled();
  });

  it('#remove should call taskService.remove', () => {
    Object.defineProperty(dateService, 'date', {
      get: jasmine.createSpy().and.returnValue({
        value: moment(),
      }),
      configurable: true,
    });
    component.remove(null);
    expect(tasksService.remove).toHaveBeenCalled();
  });
});
