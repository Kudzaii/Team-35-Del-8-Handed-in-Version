import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientService } from 'src/app/dashboard/Client/services/client.service';
import * as moment from 'moment';
import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from 'src/app/shared/material/fomart-datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ReviewDialog',
  templateUrl: './ReviewDialog.component.html',
  styleUrls: ['./ReviewDialog.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class ReviewDialogComponent implements OnInit {

  selectedDate: any | null;
  AvailabilityID: number;
  datesToHighlight: any = [];
  CurrentlyChosen: any;
  Packages: any = [];
  minDate = new Date();
  selectedLevel:any;
  AvailableSlots: any = [];
  session:any=this.data.data;
  date:any;
  AVSL_OBJ:any;
  ReviewMessage = '';

  form = new FormGroup({
    date: new FormControl('', Validators.required),
    slot: new FormControl('', Validators.required)
  });
  constructor(
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private clientservice: ClientService,) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    console.log(this.data.data)
    this.getAvailableDates();
    this.getReviewSession();

  }


  getDateAvailability(date) {
    const momentDate = new Date(date); // Replace event.value with your date value
    const formattedDate = moment(momentDate).format('YYYY-MM-DD');
    this.AvailableSlots = [];
    this.clientservice
      .getDateAvailability(formattedDate)
      .subscribe((res) => {
        console.log(res);
        res.forEach((dates) => {
          console.log(dates);
          this.AvailableSlots.push(dates);
          if(dates.Practitioner_ID === Number( sessionStorage.getItem('Practitioner_ID')))
            {
              this.AvailableSlots.push(dates);
            }
            this.AvailableSlots =  this.AvailableSlots.filter((v,i,a)=>a.findIndex(t=>(t.Availability_ID === v.Availability_ID))===i)
        });
      });
  }

  getAvailableDates() {
    this.clientservice.getAvailableDates().subscribe((res) => {
      console.log(res);
      res.forEach((dates) => {
        console.log(dates);
        this.datesToHighlight.push(dates.Date);
      });

    });
  }

  TimeChange(time) {
    let times = time.split('-');
    let timeArray = [times[0], times[1]];
    return timeArray;
  }

  selected(data){
    console.log(data)

  }

  getReviewSession() {
    this.clientservice.getReviewSessionFeedback(this.session.Session_ID).subscribe(res=>{
      this.ReviewMessage =  res.Feedback;
      console.log(res)
    })
  }
  RescheduleSession() {
    /**
     * ?Placeholders
     */

    Swal.fire({
      title: 'Are you sure you want to reschedule this booking?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let book = {
          Slot_ID: this.AVSL_OBJ.TimeSlot_ID,
          Date: this.date,
          Package_ID: this.session.Package_ID,
          Booking_ID: this.session.Booking_ID,
          Client_ID: this.clientservice.ClientID,
        };
        console.log(book)
        this.clientservice
          .RescheduleSession(book, this.AVSL_OBJ.Availability_ID)
          .subscribe((res) => {
            if(res==null) {
              console.log(res)
            }
            else {
              console.log(res)
              Swal.fire('successfully booked!', '', 'success');
              this.onNoClick()
              this.getAvailableDates();

            }

          }, err => {
            console.log(err)
          });
        }

    });


  }
}
