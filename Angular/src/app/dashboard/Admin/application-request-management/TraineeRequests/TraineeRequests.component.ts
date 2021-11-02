import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { TraineesService } from '../../services/trainees.service';

@Component({
  selector: 'app-TraineeRequests',
  templateUrl: './TraineeRequests.component.html',
  styleUrls: ['./TraineeRequests.component.scss']
})
export class TraineeRequestsComponent implements OnInit {

  trainees: Array<any>
  constructor(private traineeservice:TraineesService) { }

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
        this.traineeservice.AcceptORejectTrainee(trainee,decision).subscribe(()=>{
          this.refreshData()
          Swal.fire(resultPopupString, '', 'info')
        })
      } else if (result.isDenied) {

      }
    })

  }
    

  refreshData(){
      this.traineeservice.getTraineeRegistrations().subscribe(res=>{
          this.trainees = res;
      })
  }
}
