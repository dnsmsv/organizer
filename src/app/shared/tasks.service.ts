import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';

export interface Task {
    id?: string;
    title: string;
    date?: string;
}

interface CreateResponse {
    name: string;
}

@Injectable({providedIn: 'root'})
export class TasksService {
    public static url = 'https://localhost:5001/Organizer';
    // public static url = 'https://organizer-1a984.firebaseio.com/tasks';

    constructor(private http: HttpClient) {
    }

    load(date: moment.Moment): Observable<Task[]> {
        return this.http.get<Task[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`, {
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
                return Reflect.ownKeys(obj).map(key => ({...obj[key], id: key}));
            }
        }));
    }

    create(task: Task): Observable<Task> {
        return this.http.post<CreateResponse>(`${TasksService.url}/${task.date}.json`, task,
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
        }));
    }

    remove(task: Task): Observable<void> {
        return this.http.delete<void>(`${TasksService.url}/${task.date}/${task.id}.json`);
    }
}
