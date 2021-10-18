import { Component, OnInit } from '@angular/core';
import { DataService } from '../../Admin/services/DataService.service';
import { TrainerService } from '../services/trainer.service';
import { Location } from '@angular/common'
@Component({
  selector: 'app-send-trainee-task',
  templateUrl: './send-trainee-task.component.html',
  styleUrls: ['./send-trainee-task.component.scss']
})
export class SendTraineeTaskComponent implements OnInit {

  constructor( private location: Location,private data: DataService,private trainerservice:TrainerService) { }
  trainees:Array<any>;

  ngOnInit() {
    let id
    this.trainerservice.TraineesAssignedToTrainer().subscribe(res=>{  //needs a function
        this.trainees = res
    })

  }

  Transfer(Name,Surname){
  let NameSurname =  Name +" "+ Surname
  this.data.changeMessage( NameSurname)
  }
  
goBack(): void {
  this.location.back();
}

}
