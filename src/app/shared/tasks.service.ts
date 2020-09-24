import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

export interface Task {
    id?: string;
    title: string;
    date?: string;
}

interface CreateResponse {
    name: string;
}

export class MomentMap<T1, T2> extends Map {
    has(key: T1): boolean {
        if (!moment.isMoment(key)) {
            return super.has(key);
        }

        const mapKey: moment.Moment = this.getOriginalKey(key);
        return Boolean(mapKey);
    }

    get(key: T1): T2 {
        if (!moment.isMoment(key)) {
            return super.get(key);
        }

        const mapKey: moment.Moment = this.getOriginalKey(key);
        return super.get(mapKey);
    }

    delete(key: T1): boolean {
        if (!moment.isMoment(key)) {
            return super.delete(key);
        }

        const mapKey: moment.Moment = this.getOriginalKey(key);

        if (mapKey) {
            return super.delete(mapKey);
        }

        return false;
    }

    private getOriginalKey(key: moment.Moment): moment.Moment {
        const keys: moment.Moment[] = Array.from(this.keys());
        return keys.find(k => k.isSame(key, 'date'));
    }
}

@Injectable({providedIn: 'root'})
export class TasksService {
    public static url = 'https://localhost:5001/Organizer';
    // public static url = 'https://organizer-1a984.firebaseio.com/tasks';
    public tasks: BehaviorSubject<MomentMap<moment.Moment, Task[]>> =
        new BehaviorSubject(new MomentMap<moment.Moment, Task[]>());

    constructor(private http: HttpClient) {}

    load(date: moment.Moment): void {
        this.http.get<Task[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`, {
            headers: {
                'content-type': 'application/json'
            }
        })
        .pipe(map(tasks => {
            if (!tasks) {
                return [];
            }
            else {
                const obj = typeof tasks === 'string' ? JSON.parse(tasks) : tasks;
                const newTasks = Reflect.ownKeys(obj).map(key => ({ ...obj[key], id: key }));
                return newTasks;
            }
        })).subscribe(t => {
            const newTasks = this.tasks.value;

            if (newTasks.has(date)) {
                newTasks.delete(date);
            }

            newTasks.set(date.clone(), t);
            this.tasks.next(newTasks);
        }, err => console.error(err));
    }

    create(date: moment.Moment, task: Task): void {
        this.http.post<CreateResponse>(`${TasksService.url}/${task.date}.json`, task,
        {
            headers: {
                'content-type': 'application/json',
                'Access-Control-Allow-Methods': '*'
            }
        })
        .pipe(map(res => {
            if (res) {
                return { ...task, id: res.name };
            } else {
                return task;
            }
        })).subscribe(t => {
            const newTasks = this.tasks.value;
            const array: Task[] = newTasks.get(date);

            if (array) {
                array.push(t);
            }
            else {
                newTasks.set(date.clone(), [t]);
            }

            this.tasks.next(newTasks);
        }, err => console.error(err));
    }

    remove(date: moment.Moment, task: Task): void {
        this.http.delete<void>(`${TasksService.url}/${task.date}/${task.id}.json`)
            .subscribe(() => {
                const newTasks = this.tasks.value;
                let array: Task[] = newTasks.get(date);

                if (array) {
                    array = array.filter(a => a.id !== task.id);
                    console.log(newTasks.delete(date));
                    newTasks.set(date, array);
                    this.tasks.next(newTasks);
                }
            }, err => console.error(err));
    }
}
