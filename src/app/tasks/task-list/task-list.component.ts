import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TaskState } from '../state/task.state';
import { Task } from '../models/task.model';
import { DeleteTask, ToggleCompleteTask } from '../state/task.actions';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  @Select(TaskState.getTasks) tasks$!: Observable<Task[]>;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<Task>;
  displayedColumns: string[] = ['title', 'description', 'dueDate', 'priority', 'actions'];

  statusFilter = '';
  priorityFilter = '';
  sortOption = '';



  constructor(private readonly _store: Store, private readonly _router: Router, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Task>([]);
  }

  ngOnInit(): void {
    this.tasks$.subscribe(tasks => {
      this.dataSource.data = tasks;
      this.dataSource.sort = this.sort;
      this.applyFilter();
    });
  }

  applyFilter() {
    this.tasks$.pipe(
      map(tasks => tasks.filter(task => {
        const matchesStatus = this.statusFilter === '' || (this.statusFilter === 'completed' && task.completed) || (this.statusFilter === 'pending' && !task.completed);
        const matchesPriority = this.priorityFilter === '' || task.priority === this.priorityFilter;
        return matchesStatus && matchesPriority;
      })),
      tap(filteredTasks => this.applySort(filteredTasks))
    ).subscribe(filteredAndSortedTasks => {
      this.dataSource.data = filteredAndSortedTasks;
    });
  }

  applySort(tasks: Task[]) {
    if (this.sortOption === 'dueDate') {
      tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } else if (this.sortOption === 'priority') {
      const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
      tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }
    this.dataSource.data = tasks;
  }
  

  onDeleteTask(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._store.dispatch(new DeleteTask(id));
      }
    });
  }


  onToggleCompleteTask(id: string): void {
    this._store.dispatch(new ToggleCompleteTask(id));
  }

  onEditTask(taskId: number): void {
    this._router.navigate(['/tasks/edit', taskId]);
  }
}
