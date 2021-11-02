import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../../services/trainer.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-TrainerRequests',
  templateUrl: './TrainerRequests.component.html',
  styleUrls: ['./TrainerRequests.component.scss']
})
export class TrainerRequestsComponent implements OnInit {

  trainers: Array<any>
  constructor(private trainerervice:TrainerService) { }

  ngOnInit() {
    this.refreshData()
  }

  AcceptOrReject(trainee, decision){
    let tempString
    let resultPopupString
    if(decision ==1)
    {
      tempString = 'Are You Sure You Want To Accept This Practitioner?';
      resultPopupString =  "Successfully Accepted!"
    }
    else
    {
      tempString = 'Are You Sure You Want To Reject This Practitioner? If Yes Please Make Sure They Receive An Email As To Why They Have Been Rejected.';
      resultPopupString =  "Successfully Rejected!"

    }

    Swal.fire({
      title: tempString,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't Save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.trainerervice.AcceptORejectTrainer(trainee,decision).subscribe(()=>{
          this.refreshData()
          Swal.fire(resultPopupString, '', 'info')
        })
      } else if (result.isDenied) {

      }
    })

  }

  refreshData(){
      this.trainerervice.getTrainerRegistrations().subscribe(res=>{
        console.log(res)
          this.trainers = res;
      })
  }
}
