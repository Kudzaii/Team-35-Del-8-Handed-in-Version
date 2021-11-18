import { Component, OnInit } from '@angular/core';
import { Question } from '../../../models/Question';
import { ClientService } from '../services/client.service';
import { Location } from '@angular/common'
import { SimpleModalService } from 'ngx-simple-modal';
import { PromptComponent } from '../../../shared/utils/modals/prompt/prompt.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-TrialQuestionnaire',
  templateUrl: './TrialQuestionnaire.component.html',
  styleUrls: ['./TrialQuestionnaire.component.scss']
})
export class TrialQuestionnaireComponent implements OnInit {

  Questions: Array<Question>
   constructor(private clientService: ClientService,private location: Location, private SimpleModalService: SimpleModalService, ) { }

  ngOnInit() {
    this.getQuestionsTrialQuestions()
  }

  getQuestionsTrialQuestions(){
    this.clientService.getTrialQuestionnaire().subscribe(res=>{

      console.log(res)
      let Pack = Object.keys(res).map(index => {this.Questions = res[index];});
    })

  }
  goBack(): void {
    this.location.back();
  }

  delete() {
    Swal.fire({
      title: 'Congratulations! You show Cactus tendencies. Take The Questionnaire Assigned To You By Your Practitioner To Understand What That Means.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Okay'
    })}
  
}
