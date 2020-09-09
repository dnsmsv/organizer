import { DateService } from './../shared/date.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
  dateService: DateService;
  form: FormGroup;

  constructor(dateService: DateService) {
    this.dateService = dateService;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  submit(): void {
    const {title} = this.form.value;
  }
}
