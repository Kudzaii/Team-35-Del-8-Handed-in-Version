import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from 'src/app/auth/auth.service';
import { Timeslot } from 'src/app/models/Task';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { PractitionerUserService } from '../services/PractitionerUser.service';
import Swal from 'sweetalert2';
import { DataService } from '../../Admin/services/DataService.service';
import { Subscription } from 'rxjs';

import { Location } from '@angular/common'

@Component({
  selector: 'app-set-availability',
  templateUrl: './set-availability.component.html',
  styleUrls: ['./set-availability.component.scss']
})
export class SetAvailabilityComponent implements OnInit {
  timesAvailable: Array<any>
  ChosenTimesList: Array<any>
  TimeSlots: Array<Timeslot>
  isComplete: boolean = true;
  isDateChosen: boolean;
  chosenDate: any;
  show: number = 7;
  selectedDate:any
  // For Reschedule
  subscription: Subscription;
  SlotDetails:any =null;
  isReschedule: boolean;
  minDate = new Date();
  constructor(
    private practitionerService: PractitionerUserService,
    private snackbarService: SnackbarService,
    private authService: AuthService,
    private data: DataService,
    private location: Location) { }

  ngOnInit() {
    this.subscription = this.data.currentMessage.subscribe(
      (message) => {
        this.SlotDetails = message;
        console.log(this.SlotDetails)
        this.isReschedule= (this.SlotDetails.Availability_ID != undefined)
        console.log(this.isReschedule,   this.SlotDetails.Availability_ID != undefined )
      }
    );
    this.getTimesSlots();
  }


  increaseShow() {
    this.show += 10;
  }
  getDateAvailableDate(date: any) {
    this.selectedDate =date;
    const momentDate = new Date(date); // Replace event.value with your date value
    const formattedDate = moment(momentDate).format('YYYY-MM-DD')
    console.log(formattedDate)
    this.isDateChosen = true;
    this.chosenDate = formattedDate;
  }


  ChooseSession(timeSlot_ID, index) {
    console.log(timeSlot_ID)
    index = Number(index);
    if (this.TimeSlots[index].isChosen) {
      this.ChosenTimesList.splice(index, 1);
      this.TimeSlots[index].isChosen = false;
    } else {
      this.TimeSlots[index].isChosen = true;
      if(!this.isReschedule)
      {
        this.ChosenTimesList[index] = { AvailabilityDate: this.chosenDate, TimeSlot_ID: timeSlot_ID, Practitioner_ID: this.authService.loginId }
      }else{
        this.ChosenTimesList[index] = {Availability_ID: this.SlotDetails.Availability_ID, AvailabilityDate: this.chosenDate, TimeSlot_ID: timeSlot_ID, Practitioner_ID: this.authService.loginId }
        console.log( this.ChosenTimesList[index])
      }
    }
  }


  getTimesSlots() {
    this.practitionerService.getTimeSlots().subscribe(response => {
      this.TimeSlots = response;
      this.ChosenTimesList = new Array(this.TimeSlots.length)
    })

  }


  SetTimes() {
    Swal.fire({
      title: !this.isReschedule ? 'Are You Sure Your Availability Is Correct?' : 'Are You Sure You Want To Reschedule?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {

        console.log(this.ChosenTimesList)  //?console
        this.ChosenTimesList = this.ChosenTimesList.filter(function () { return true }); //Removes empty positions;
        if (this.checkCompleteness()) {
          console.log(this.ChosenTimesList); //?console
          this.practitionerService.SetPractitionerAvailability(this.ChosenTimesList,this.isReschedule,this.SlotDetails,).subscribe(result => {
            console.log(result); //?console
            if (result.Availability_ID! = null) {
              Swal.fire(
                'Slot Updated!',
                ' The Slot has been successfully set up.',
                'success'
              )
            } else {
              // this.snackbarService.openSnackBar("Times/Time has already been booked")
            }
            this.getTimesSlots();
          })
        }


      }
      else {

      }
    })
  }

  checkCompleteness(): boolean {

    this.ChosenTimesList.forEach(element => {
      if (element.TimeSlot_ID == null || element.TimeSlot_ID == undefined) {
        console.log(element)
        this.isComplete = false;
      }
    })
    if (this.ChosenTimesList.length == 0)
      this.isComplete = false;

         return this.isReschedule ? true : this.isComplete
  }
  goBack(): void {
    this.location.back();
  }
}
