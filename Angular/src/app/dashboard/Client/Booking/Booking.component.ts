import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Location } from '@angular/common'
import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { formatDate } from '@angular/common';
import { ClientService } from '../services/client.service';
import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from 'src/app/shared/material/fomart-datepicker';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
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



  constructor(private clientservice: ClientService, private router: Router, private location: Location) {this.getAvailableDates()}

  ngOnInit() {
    this.PractitionerExists()
  }

  BookSlot() {
    /**
     * ?Placeholders
     */

    Swal.fire({
      title: 'Are You Sure You Want To Make This Booking?',
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
          Package_ID: Number(this.package)
        };
        console.log(book)
        this.clientservice
          .BookSlot(book, this.AvailabilityID)
          .subscribe((res) => {
            Swal.fire('Successfully Booked! Your practitioner will email you with the session details!', '', 'success');
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
  ChoosePackage(Id) {
      this.package = Number(Id)
  }


  getDateAvailability(date) {
    const momentDate = new Date(date); // Replace event.value with your date value
    const formattedDate = moment(momentDate).format('YYYY-MM-DD');
    this.AvailableSlots = [];
    this.clientservice
      .getDateAvailability(formattedDate.toString())
      .subscribe((res) => {
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
      res.forEach((dates) => {
        console.log(dates);
        this.datesToHighlight.push(dates.Date);
      });

    });

  }

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      const highlightDate = this.datesToHighlight
        .map((strDate) => new Date(strDate))
        .some(
          (d) =>
            d.getDate() === date.getDate() &&
            d.getMonth() === date.getMonth() &&
            d.getFullYear() === date.getFullYear()
        );

      return highlightDate ? 'special-date' : '';
    };
  }

  // Check if theres a practitioner

  PractitionerExists()
  {
    if(sessionStorage.getItem('Practitioner_ID') != 'null' )
    {
      this.getAvailableDates();
      this.getUSerPaidPackages();
    }
    else
    {
      Swal.fire({
        icon: 'error',
        title: 'Booking Cannot Be Made.',
        text: 'There Are No Practitioners Assigned To You. A Practitionerer Will Be Assigned To You Soon!Thank You',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK!',
        footer: '<a href="">Why Do I Have This Issue?</a>'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/dashboard'])
        }
        this.router.navigate(['/dashboard'])
      })
    }
  }

//Package checking
  getUSerPaidPackages() {
    this.clientservice.getClientPurchasedPackages().subscribe((res) => {
      if (res===null || res.length ===  0) {
        this.timerNoPackageModal()
      }
      else{
         this.Packages = res;
         console.log(res)
      }
    });
  }
  timerNoPackageModal() {
    let timerInterval;
    Swal.fire({
      title: 'You Have Not Purchased A Package Yet!',
      html: 'This Page Will Redierct You To The Purchase Package Page In <b></b> .',
      timer: 10000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b: any = Swal.getHtmlContainer().querySelector('b');
        timerInterval = setInterval(() => {
          let v
          b.textContent = ((Swal.getTimerLeft() /1000)%60).toFixed(0);
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
       this.router.navigate(['/dashboard/PurchasePackage'])
      }
    });
  }

  // validate
  validate() {
    let book = {
      Slot_ID: this.CurrentlyChosen.TimeSlot_ID,
      Date: this.selectedDate,
      SessionType_ID: 1,
      Package_ID:  this.package
    };
    if(book.Date != null && book.SessionType_ID != null && book.Package_ID != null)
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
  goBack(): void {
    this.location.back();
  }

}
