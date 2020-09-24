import { MomentMap, Task } from './../shared/tasks.service';
import { DateService } from './../shared/date.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { TasksService } from '../shared/tasks.service';

class Day {
  value: moment.Moment;
  active: boolean;
  disabled: boolean;
  selected: boolean;
  // tslint:disable-next-line:variable-name
  private _task1: string;
  // tslint:disable-next-line:variable-name
  private _task2: string;
  showEllipsis: boolean;

  constructor(value: moment.Moment, active: boolean, disabled: boolean, selected: boolean) {
    this.value = value;
    this.active = active;
    this.disabled = disabled;
    this.selected = selected;
  }

  get task1(): string {
    return this._task1;
  }

  set task1(title: string) {
    this._task1 = title.length > 10
      ? `${title.substr(0, 10)}...`
      : title;
  }

  get task2(): string {
    return this._task2;
  }

  set task2(title: string) {
    this._task2 = title.length > 10
      ? `${title.substr(0, 10)}...`
      : title;
  }
}

interface Week {
  days: Day[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  calendar: Week[];
  oldSelectedDay: Day;

  constructor(private dateService: DateService, private taskService: TasksService) {}

  ngOnInit(): void {
    this.dateService.date.subscribe(this.generate.bind(this));
    this.taskService.tasks.subscribe(this.setTasks.bind(this));
  }

  private getDay(m: moment.Moment): Day {
    if (this.calendar) {
      for (const week of this.calendar) {
        const day = week.days.find(d =>
          d.value.isSame(m, 'date'));

        if (day) {
          return day;
        }
      }
    }

    return null;
  }

  private setTasks(tasksMap: MomentMap<moment.Moment, Task[]>): void {
    for (const taskMap of tasksMap) {
      const key = taskMap[0];
      const value = taskMap[1];
      const day: Day = this.getDay(key);

      if (day) {
        day.task1 = value.length > 0 ? value[0].title : '';
        day.task2 = value.length > 1 ? value[1].title : '';
        day.showEllipsis = value.length > 2;
      }
    }
  }

  generate(): void {
    const now = this.dateService.date.value;
    const today: Day = this.getDay(this.dateService.date.value);

    if (today) {
      this.oldSelectedDay.selected = false;
      today.selected = true;
    }
    else {
      this.calendar = [];
      const startDay = now.clone().startOf('month').startOf('week');
      const endDay = now.clone().endOf('month').endOf('week');

      const date = startDay.clone().subtract(1, 'day');
      const calendar = [];

      while (date.isBefore(endDay, 'day')) {
        calendar.push({
          days: Array(7).fill(0).map(() => {
            const value = date.add(1, 'day').clone();
            this.taskService.load(value);
            const active = moment().isSame(value, 'date');
            const disabled = !now.isSame(value, 'month');
            const selected = now.isSame(value, 'date');
            return new Day(value, active, disabled, selected);
          })
        });
      }

      this.calendar = calendar;
    }

    this.oldSelectedDay = this.getDay(this.dateService.date.value);
  }

  select(day: moment.Moment): void {
    this.dateService.changeDate(day);
  }
}
