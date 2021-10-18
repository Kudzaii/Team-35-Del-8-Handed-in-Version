import { Component, OnInit } from '@angular/core';
import { PractitionerService } from '../../services/practitioner.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-PractitionerRequests',
  templateUrl: './PractitionerRequests.component.html',
  styleUrls: ['./PractitionerRequests.component.scss']
})
export class PractitionerRequestsComponent implements OnInit {

  practitioners:Array<any>

  constructor(private practitionerservice:PractitionerService) { }

  ngOnInit() {
   this.refreshData()
  }

  AcceptOrReject(Pract,decision){
    let tempString
    let resultPopupString
    if(decision ==1)
    {
      tempString = 'Are You Sure You Want To Accept This Practitioner?';
      resultPopupString =  "Successfully Accepted!"
    }
    else
    {
      tempString = 'Are You Sure You Want To Reject This Practitioner?';
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
        this.practitionerservice.AcceptORejectPractitioner(Pract,decision).subscribe(()=>{
          this.refreshData()
          Swal.fire(resultPopupString, '', 'info')
        })
      } else if (result.isDenied) {

      }
    })

  }

  refreshData(){
    this.practitionerservice.getPractitionerRegistrations().subscribe(res=>{
          this.practitioners =  res;
    })
  }
}
