import { Component, OnInit } from '@angular/core';
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
    
    this.traineeservice.AcceptORejectTrainee(trainee,decision).subscribe(()=>{
      this.refreshData()
    })
  }

  refreshData(){
      this.traineeservice.getTraineeRegistrations().subscribe(res=>{
          this.trainees = res;
      })
  }
}
