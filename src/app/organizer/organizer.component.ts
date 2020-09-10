import { DateService } from './../shared/date.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TasksService, Task } from '../shared/tasks.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
  dateService: DateService;
  taskService: TasksService;
  form: FormGroup;
  tasks: Task[] = [];

  constructor(dateService: DateService, taskService: TasksService) {
    this.dateService = dateService;
    this.taskService = taskService;
  }

  ngOnInit(): void {
    this.dateService.date.pipe(
        switchMap(value => this.taskService.load(value))
      ).subscribe(tasks => {
        this.tasks = tasks;
    });
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  submit(): void {
    const {title} = this.form.value;
    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    };

    this.taskService.create(task).subscribe(newTask => {
      this.tasks.push(task);
      this.form.reset();
    }, err => console.error(err));
  }

  remove(task: Task): void {
    this.taskService.remove(task).subscribe(() =>
    {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    }, err => console.error(err));
  }
}
