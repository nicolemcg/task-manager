import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Subject, takeUntil } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit, OnDestroy{

  taskForm: FormGroup;
  selectedTaskId: number | null = null ;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ){
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });
  }

  ngOnInit(): void{
    this.taskService.taskSelected$
      .pipe(takeUntil(this.destroy$))
      .subscribe(task => {

        this.selectedTaskId = task.id!;

        this.taskForm.patchValue({ 
          title: task.title,
          description: task.description
        })
    });
  }

  onSubmit(){
    
    if(this.taskForm.valid){
      const newTask = {
        ...this.taskForm.value,
        // title: this.taskForm.value.title,
        // description: this.taskForm.value.description,
        completed: false
      };

      if(this.selectedTaskId){
        this.taskService.updateTask(this.selectedTaskId, newTask).subscribe(()=>{
          this.resetForm();
          this.taskService.notifyTaskCreated();
        });
      } else {
        this.taskService.createTask(newTask).subscribe(() => {
          this.resetForm();
          this.taskService.notifyTaskCreated();
        });
      }
    }
  }

  resetForm(){
    this.taskForm.reset();
    this.selectedTaskId = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
