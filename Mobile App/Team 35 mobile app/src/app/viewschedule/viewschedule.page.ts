import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { ToastController, Platform, IonList, ModalController } from '@ionic/angular';
import { ApiService, Schedule } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewschedule',
  templateUrl: './viewschedule.page.html',
  styleUrls: ['./viewschedule.page.scss'],
})

export class ViewschedulePage implements OnInit {

  @ViewChild('data', { static: false }) data: IonList;
  DataSource : any;
  object: Schedule = {} as Schedule;

  constructor(private service : ApiService, private router: Router) { }

  ngOnInit() {
    this.service.ViewSchedule(localStorage["Client_ID"]).subscribe((data) => {
      this.DataSource = data;
      console.log(data)
    });
    console.table(this.DataSource)
  }

  viewtasks(){
    this.router.navigate(["viewschedule"])
  }
}