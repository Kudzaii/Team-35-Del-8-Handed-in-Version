import { Component, OnInit } from '@angular/core';
import { Session } from 'src/app/models/Session';
import { ReviewDialogComponent } from './ReviewDialog/ReviewDialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TraineeService } from '../services/trainee.service';

import { CalendarOptions } from '@fullcalendar/angular';

import { Location } from '@angular/common';

@Component({
  selector: 'app-MySessions',
  templateUrl: './MySessions.component.html',
  styleUrls: ['./MySessions.component.scss']
})
export class MySessionsComponent implements OnInit {


    constructor( private location: Location,private traineeService:TraineeService,public dialog: MatDialog) { }



  sessions:Array<Session> = [];
  ID:Number;

  calendarOptions: CalendarOptions
 displayEvent: any;

 ngOnInit() {
   this.getDates();
 }

 getDates() {

  this.ID = this.traineeService.TraineeID
   this.traineeService.getSessions().subscribe(res =>{
     console.log(res)
     let data = []
     res.forEach(session =>{
       console.log(session)
         data.push({
             id:session.Session_ID,
             title: session.PackageName,
             start: session.Date,
             end: session.Date,
             extendedProps: {
               session: session
             },

         })
     })
      this.sessions= res;
      this.calendarOptions = {
       timeZone: 'UTC',
       //themeSystem: 'bootstrap',
       eventClick: this.openReviewDialog.bind(this),
       headerToolbar: {
         left: 'prev,next today',
         center: 'title',
         right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
       },

       editable: false,
       events: data,
       selectable: true,
       eventBackgroundColor: '#3D56B2',
       eventBorderColor:'#3D56B2',

     };
   })
 }

 openReviewDialog(arg): void {
   console.log(arg.event._def)
   let dialogRef = this.dialog.open(ReviewDialogComponent, {
     width: '1000px',
     height: '550px',
     data: { data: arg.event._def.extendedProps.session}
   });
   dialogRef.afterClosed().subscribe(result => {
     this.getDates();
   });
 }

 clickButton(model: any) {
   this.displayEvent = model;
   console.log(model)
 }
 eventClick(model: any) {
   model = {
     event: {
       id: model.event.id,
       start: model.event.start,
       end: model.event.end,
       title: model.event.title,
       allDay: model.event.allDay
       // other params
     },
     duration: {}
   }
   this.displayEvent = model;
   console.log(model)
 }

 handleEventClick(arg) {
   console.log(arg)
   // swal.fire({
   //     text: 'Event Title! ' + arg.event._def.title,
   //     icon: 'success'
   //   });
 }

 updateEvent(model: any) {
   model = {
     event: {
       id: model.event.id,
       start: model.event.start,
       end: model.event.end,
       title: model.event.title
       // other params
     },
     duration: {
       _data: model.duration._data
     }
   }
   this.displayEvent = model;
 }

 dayClick(event) {
   console.log('dayClick', event);
 }

    goBack(): void {
      this.location.back();
    }
  }

