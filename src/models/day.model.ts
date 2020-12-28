export class Day {
  value: moment.Moment;
  active: boolean;
  disabled: boolean;
  selected: boolean;
  // tslint:disable-next-line:variable-name
  private _task1: string;
  // tslint:disable-next-line:variable-name
  private _task2: string;
  showEllipsis: boolean;

  constructor(
    value: moment.Moment,
    active: boolean,
    disabled: boolean,
    selected: boolean
  ) {
    this.value = value;
    this.active = active;
    this.disabled = disabled;
    this.selected = selected;
  }

  get task1(): string {
    return this._task1;
  }

  set task1(title: string) {
    this._task1 = title.length > 10 ? `${title.substr(0, 10)}...` : title;
  }

  get task2(): string {
    return this._task2;
  }

  set task2(title: string) {
    this._task2 = title.length > 10 ? `${title.substr(0, 10)}...` : title;
  }
}
