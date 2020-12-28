import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { MomentMap } from 'src/models/moment-map.model';

export interface Task {
  id?: string;
  title: string;
  date?: string;
}

interface CreateResponse {
  name: string;
}

@Injectable({ providedIn: 'root' })
export class TasksService {
  // public static url = 'https://localhost:5001/Organizer';
  private _url = 'https://organizer-1a984.firebaseio.com/tasks';
  private _tasks: BehaviorSubject<
    MomentMap<moment.Moment, Task[]>
  > = new BehaviorSubject(new MomentMap<moment.Moment, Task[]>());

  constructor(private http: HttpClient) {}

  public get url() {
    return this._url;
  }

  public get tasks() {
    return this._tasks;
  }

  load(date: moment.Moment): void {
    this.http
      .get<Task[]>(`${this.url}/${date.format('DD-MM-YYYY')}.json`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .pipe(
        map((tasks) => {
          if (!tasks) {
            return [];
          } else {
            const obj = typeof tasks === 'string' ? JSON.parse(tasks) : tasks;
            const newTasks = Reflect.ownKeys(obj).map((key) => ({
              ...obj[key],
              id: key,
            }));
            return newTasks;
          }
        })
      )
      .subscribe(
        (t) => {
          const newTasks = this.tasks.value;

          if (newTasks.has(date)) {
            newTasks.delete(date);
          }

          newTasks.set(date.clone(), t);
          this.tasks.next(newTasks);
        },
        (err) => console.error(err)
      );
  }

  create(date: moment.Moment, task: Task): void {
    this.http
      .post<CreateResponse>(`${this.url}/${task.date}.json`, task, {
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Methods': '*',
        },
      })
      .pipe(
        map((res) => {
          if (res) {
            return { ...task, id: res.name };
          } else {
            return task;
          }
        })
      )
      .subscribe(
        (t) => {
          const newTasks = this.tasks.value;
          const array: Task[] = newTasks.get(date);

          if (array) {
            array.push(t);
          } else {
            newTasks.set(date.clone(), [t]);
          }

          this.tasks.next(newTasks);
        },
        (err) => console.error(err)
      );
  }

  remove(date: moment.Moment, task: Task): void {
    this.http
      .delete<void>(`${this.url}/${task.date}/${task.id}.json`)
      .subscribe(
        () => {
          const newTasks = this.tasks.value;
          let array: Task[] = newTasks.get(date);

          if (array) {
            array = array.filter((a) => a.id !== task.id);
            newTasks.delete(date);
            newTasks.set(date, array);
            this.tasks.next(newTasks);
          }
        },
        (err) => console.error(err)
      );
  }
}
