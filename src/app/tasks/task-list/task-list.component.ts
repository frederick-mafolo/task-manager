import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TaskState } from '../state/task.state';
import { Task } from '../models/task.model';
import { DeleteTask, ToggleCompleteTask } from '../state/task.actions';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  @Select(TaskState.getTasks) tasks$!: Observable<Task[]> ;

  dataSource: MatTableDataSource<Task>;

  displayedColumns: string[] = ['title', 'description', 'dueDate', 'priority', 'actions'];

  constructor(private store: Store) {
    this.dataSource = new MatTableDataSource<Task>([]);
  }

  ngOnInit(): void {
    this.tasks$.subscribe(tasks => {
      this.dataSource.data = tasks;
    });
  }


  onDeleteTask(id: string): void {
    this.store.dispatch(new DeleteTask(id));
  }

  onToggleCompleteTask(id: string): void {
    this.store.dispatch(new ToggleCompleteTask(id));
  }
}
