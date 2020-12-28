import { DateService } from './../shared/date.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TasksService, Task } from '../shared/tasks.service';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss'],
})
export class OrganizerComponent implements OnInit, OnDestroy {
  dateService: DateService;
  taskService: TasksService;
  form: FormGroup;
  tasks: Task[] = [];
  subscription: Subscription;

  constructor(dateService: DateService, taskService: TasksService) {
    this.dateService = dateService;
    this.taskService = taskService;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
    });
    this.taskService.tasks.subscribe((map) => {
      if (map.has(this.dateService.date.value)) {
        this.tasks = map.get(this.dateService.date.value);
        this.form.reset();
      } else {
        this.tasks = [];
      }
    });
    this.subscription = this.dateService.date.subscribe((d) => {
      this.taskService.load(d);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  submit(): void {
    const { title } = this.form.value;
    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
    };

    this.taskService.create(this.dateService.date.value, task);
  }

  remove(task: Task): void {
    this.taskService.remove(this.dateService.date.value, task);
  }
}
