import { DateService } from './../shared/date.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TasksService, Task } from '../shared/tasks.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
  dateService: DateService;
  taskService: TasksService;
  form: FormGroup;

  constructor(dateService: DateService, taskService: TasksService) {
    this.dateService = dateService;
    this.taskService = taskService;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  submit(): void {
    const {title} = this.form.value;
    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYY')
    };

    this.taskService.create(task).subscribe(newTask => {
      console.log('New task: ', newTask);
      this.form.reset();
    }, err => console.error(err));
  }
}
