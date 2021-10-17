import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';  
import { ApiService } from '../api.service';

@Component({
  selector: 'app-completetasks',
  templateUrl: './completetasks.page.html',
  styleUrls: ['./completetasks.page.scss'],
})
export class CompletetasksPage implements OnInit {

  constructor(private service: ApiService,  private router: Router,  private formbulider: FormBuilder) { }
  form : any;
  task : any;
  Description : any;
  DueDate : any;
  TaskTypeName : any;
  TaskStatus : any;
  Practitioner : any;
   
  ngOnInit(): void {
    this.service.ViewTask(localStorage["TaskToCompleteID"]).subscribe((x) => {
      this.Description = x[0].Description;
      this.DueDate = x[0].DueDate;
      this.TaskTypeName = x[0].TaskTypeName;
      this.TaskStatus = x[0].TaskStatus;
      this.Practitioner = x[0].Practitioner;

    console.log(this.task)
  })

    this.form = this.formbulider.group({  
      Task: ['', [Validators.required]],  
    }); 
  }

  complete(e){
    let task = {
      "Description": e.target.Task.value,
    }
    this.service.CompleteTask(task, localStorage["TaskToCompleteID"]).subscribe((x) => {
      this.task = x;
    console.log(task)
  })
  this.router.navigate(["viewtasks"])
  }
}
