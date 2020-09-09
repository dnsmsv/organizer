import { DateService } from './../shared/date.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent {
  dateService: DateService;

  constructor(dateService: DateService) {
    this.dateService = dateService;
  }

  go(dir: number): void {
    this.dateService.changeMonth(dir);
  }
}
