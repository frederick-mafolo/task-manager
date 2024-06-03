import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateTask } from '../state/task.actions';
import { TaskState } from '../state/task.state';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {
  
  tasks$!: Observable<Task[]>;
  taskForm!: FormGroup;
  taskId: string='' ;
  @Select(TaskState.getTasks)
 
  today: Date = new Date();

  constructor(private readonly _fb: FormBuilder, private readonly _store: Store, private readonly _route: ActivatedRoute, private readonly _router: Router) { }

  ngOnInit(): void {
    this.taskId = this._route.snapshot.paramMap.get('id') || "";
    this.tasks$.pipe(
      map(tasks => tasks.find(task => task.id === this.taskId))
    ).subscribe(task => {
      if (task) {
      this.taskForm = this._fb.group({
        title: [task.title, Validators.required],
        description: [task.description, Validators.required],
        dueDate: [task.dueDate, Validators.required],
        priority: [task.priority, Validators.required],
        completed: [task.completed]
      });
    } else {
      // Will handle when task not found
    
      this.taskForm = this._fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        dueDate: ['', Validators.required],
        priority: ['', Validators.required],
        completed: [false]
      });
    }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const updatedTask = {
        ...this.taskForm.value,
        id: this.taskId
      };
      this._store.dispatch(new UpdateTask(updatedTask)).subscribe(() => {
        this._router.navigate(['/tasks']);
      });
    }
  }
}
