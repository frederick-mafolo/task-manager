import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { AddTask } from '../state/task.actions';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.scss']
})
export class TaskAddComponent implements OnInit {
  taskForm!: FormGroup;
  today: Date = new Date();

  constructor(private readonly _fb: FormBuilder, private readonly _store: Store, private readonly _router: Router) { }

  ngOnInit(): void {
    this.taskForm = this._fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['low', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const newTask = {
        ...this.taskForm.value,
        id: uuidv4(),
        completed: false
      };
      this._store.dispatch(new AddTask(newTask)).subscribe(() => {
        this._router.navigate(['/tasks']);
      });
    }
  }
}
