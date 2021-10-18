import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from '../../Admin/services/DataService.service';
import { PractitionerUserService } from '../services/PractitionerUser.service';
import { RescheduleDialogComponent } from './rescheduleDialog/rescheduleDialog.component';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-my-slots',
  templateUrl: './my-slots.component.html',
  styleUrls: ['./my-slots.component.scss']
})
export class MySlotsComponent implements OnInit {

    MySlots: Array<any>
  constructor(
    private practitionerService:PractitionerUserService,
    public dialog: MatDialog,
    private data: DataService,
    private router: Router,
    private location: Location) { }

  ngOnInit() {
    this.getMySlots();
  }

  getMySlots() {
    this.practitionerService.getMyAvailability().subscribe(res=>{
        this.MySlots = res;
        console.log(res);
    })
  }



  Transfer(Timeslot){
    Swal.fire({
      title: 'Are You Sure You Want To Reschedule?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.data.changeMessage(Timeslot);
        this.router.navigate(['/dashboard/set-availability'])
      }
      else {

      }
    })
    
    }

    goBack(): void {
      this.location.back();
    }
}
