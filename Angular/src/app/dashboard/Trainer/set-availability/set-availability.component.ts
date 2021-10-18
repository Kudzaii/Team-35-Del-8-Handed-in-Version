import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from 'src/app/auth/auth.service';
import { Timeslot } from 'src/app/models/Task';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { PractitionerUserService } from '../../Practitioner/services/PractitionerUser.service';
import { Location } from '@angular/common'
@Component({
  selector: 'app-set-availability',
  templateUrl: './set-availability.component.html',
  styleUrls: ['./set-availability.component.scss']
})
export class SetAvailabilityComponent implements OnInit {
  timesAvailable:Array<any>
  ChosenTimesList:Array<any>
  TimeSlots: Array<Timeslot>
  isComplete: boolean =true;
  isDateChosen:boolean;
  chosenDate:any;
  show:number = 7;
  minDate = new Date();
  constructor(private location: Location,private practitionerService:PractitionerUserService, private snackbarService:SnackbarService,private authService:AuthService) { }

  ngOnInit() {
    this.getTimesSlots();
  }


  increaseShow()
  {
    this.show += 10;
  }
  getDateAvailableDate(date:any){

    const momentDate = new Date(date); // Replace event.value with your date value
    const formattedDate = moment(momentDate).format('YYYY-MM-DD')
    console.log(formattedDate)
      this.isDateChosen =true;
      this.chosenDate = formattedDate;
  }


  ChooseSession(timeSlot_ID,index){
    console.log(timeSlot_ID)
    index = Number(index);
    if(this.TimeSlots[index].isChosen){
      this.ChosenTimesList.splice(index, 1);
      this.TimeSlots[index].isChosen = false;
    }else{
      this.TimeSlots[index].isChosen = true;
      this.ChosenTimesList[index] = {AvailabilityDate: this.chosenDate, TimeSlot_ID: timeSlot_ID , Trainer_ID: this.authService.loginId }
    }
  }


  getTimesSlots(){
    this.practitionerService.getTimeSlots().subscribe(response=>{
        this.TimeSlots = response;
        this.ChosenTimesList = new Array(this.TimeSlots.length)
    })

  }
  SetTimes(){
    console.log(this.ChosenTimesList)
    this.ChosenTimesList = this.ChosenTimesList.filter(function () { return true }); //Removes empty positions;
    if(this.checkCompleteness()){
      console.log(this.ChosenTimesList);
      this.practitionerService.SetPractitionerAvailability(this.ChosenTimesList,"chekcer","details").subscribe(result=>{
        console.log(result);
          if(result.Availability_ID ! = null){
            this.snackbarService.openSnackBar("Times have successfully added")
          }else{
            this.snackbarService.openSnackBar("Times/Time has already been booked")
          }
          this.getTimesSlots();
      })
    }

  }

  checkCompleteness():boolean {
    this.ChosenTimesList.forEach(element=>{
      if(element.TimeSlot_ID ==null || element.TimeSlot_ID ==undefined){
        console.log(element)
        this.isComplete = false;
      }
    })
    if(this.ChosenTimesList.length ==0)
        this.isComplete = false;
    return this.isComplete
  }
  goBack(): void {
    this.location.back();
  }

}
