
import { Location } from '@angular/common'

import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { formatDate } from '@angular/common';

import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from 'src/app/shared/material/fomart-datepicker';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { TraineeService } from '../services/trainee.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-Booking',
  templateUrl: './Booking.component.html',
  styleUrls: ['./Booking.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class BookingComponent implements OnInit {

  selectedDate: any | null;
  AvailableSlots: any = [];
  AvailabilityID: number;
  datesToHighlight: any = [];
  CurrentlyChosen: any;
  Packages: any = [];
  minDate = new Date();
  package


  constructor(private traineeservice: TraineeService, private location: Location,private router: Router) {}


  ngOnInit() {
    this.getAvailableDates();
    this.TrainerExists()
  }

  BookSlot() {
    /**
     * ?Placeholders
     */

    Swal.fire({
      title: 'Are you sure you want to make this booking?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed && this.validate()) {
        let book = {
          Slot_ID: this.CurrentlyChosen.TimeSlot_ID,
          Date: this.selectedDate,
          SessionType_ID: 1,
        };
        console.log(book)
        this.traineeservice
          .BookSlot(book, this.AvailabilityID)
          .subscribe((res) => {
            Swal.fire('successfully booked!', '', 'success');
          });
      } else if (result.isDenied) {

      }
    });
  }


  ChooseSlot(AvailabilityID, slotInfo) {
    this.AvailabilityID = AvailabilityID;
    this.CurrentlyChosen = slotInfo;
    this.selectedDate = slotInfo.Date;
  }

  getDateAvailability(date) {
    const momentDate = new Date(date); // Replace event.value with your date value
    const formattedDate = moment(momentDate).format('YYYY-MM-DD');

    this.traineeservice
      .getDateAvailability(formattedDate.toString())
      .subscribe((res) => {
        console.log(res)
        res.forEach((dates) => {
          this.AvailableSlots.push(dates);
        });
      });
  }

  getAvailableDates() {
    this.traineeservice.getAvailableDates().subscribe((res) => {
      console.log(res)
      res.forEach((dates) => {

        this.datesToHighlight.push(dates.Date);
      });
    });
    console.log(this.datesToHighlight)
  }

  TrainerExists()
  {
    if(sessionStorage.getItem('Trainer_ID') != 'null' )
    {
      this.getAvailableDates();
    }
    else
    {
      Swal.fire({
        icon: 'error',
        title: 'Booking cannot be made.',
        text: 'Theres no trainer assigned to you, a trainer will assigned to you soon!,Thank You',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok!',
        footer: '<a href="">Why do I have this issue?</a>'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/dashboard'])
        }
        this.router.navigate(['/dashboard'])
      })
    }
  }

// Trainer_ID
  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      const highlightDate = this.datesToHighlight
        .map(strDate => new Date(strDate))
        .some(d => d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear());

      return highlightDate ? 'special-date' : '';
    };
  }

  goBack(): void {
    this.location.back();
  }

   // validate
   validate() {
    let book = {
      Slot_ID: this.CurrentlyChosen.TimeSlot_ID,
      Date: this.selectedDate,
      SessionType_ID: 1,
    };
    if(book.Date != null && book.SessionType_ID != null )
    {
      return true
    }
    else{
      return false;
    }
  }
  //ChangeTime

  TimeChange(time) {
    let times = time.split('-');
    let timeArray = [times[0], times[1]];
    return timeArray;
  }


}






















