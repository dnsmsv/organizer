import { HttpClientTestingModule } from '@angular/common/http/testing';
import { serializeNodes } from '@angular/compiler/src/i18n/digest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockPipe } from 'mock-pipe';
import * as moment from 'moment';
import { DateService } from '../shared/date.service';
import { MomentPipe } from '../shared/moment.pipe';
import { TasksService } from '../shared/tasks.service';
import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let dateService: DateService;
  let taskService: TasksService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CalendarComponent,
        MockPipe(MomentPipe, () => '28.12.2020 15:12'),
      ],
      imports: [HttpClientTestingModule],
      providers: [DateService, TasksService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    dateService = TestBed.inject(DateService);
    taskService = TestBed.inject(TasksService);
    spyOn(dateService, 'changeDate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#select should call changeDate', () => {
    component.select(moment());
    expect(dateService.changeDate).toHaveBeenCalled();
  });
});
