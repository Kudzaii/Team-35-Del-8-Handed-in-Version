import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ToastController, Platform, IonList, ModalController } from '@ionic/angular';
import { ApiService, Schedule } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewtasks',
  templateUrl: './viewtasks.page.html',
  styleUrls: ['./viewtasks.page.scss'],
})
export class ViewtasksPage implements OnInit {
  
  @ViewChild('data', { static: false }) data: IonList;
  DataSource : any;
  object: Schedule = {} as Schedule;

  constructor(private service : ApiService, private router: Router) { 
    this.ngOnInit();
  }

  ngOnInit() {
    this.service.ViewTasks(localStorage["Client_ID"]).subscribe((data) => {
      this.DataSource = data;
      console.log(data)
    });
    console.table(this.DataSource)
  }

  viewtasks(){
    this.DataSource = null;
    this.router.navigate(["viewschedule"])
  }

  completetask(id){
    this.DataSource = null;
    localStorage["TaskToCompleteID"] = id;
    console.log(localStorage["TaskToCompleteID"])
    this.router.navigate(["completetasks"])
  }
}