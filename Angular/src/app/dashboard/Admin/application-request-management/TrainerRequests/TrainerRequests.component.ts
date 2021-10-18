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


    this.trainerervice.AcceptORejectTrainer(trainee,decision).subscribe(()=>{
      this.refreshData()
    })
  }

  refreshData(){
      this.trainerervice.getTrainerRegistrations().subscribe(res=>{
        console.log(res)
          this.trainers = res;
      })
  }
}
