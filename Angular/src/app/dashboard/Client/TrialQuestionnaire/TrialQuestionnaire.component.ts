import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/models/Question';
import { ClientService } from '../services/client.service';
import { Location } from '@angular/common'
@Component({
  selector: 'app-TrialQuestionnaire',
  templateUrl: './TrialQuestionnaire.component.html',
  styleUrls: ['./TrialQuestionnaire.component.scss']
})
export class TrialQuestionnaireComponent implements OnInit {

  Questions: Array<Question>
   constructor(private clientService: ClientService,private location: Location) { }

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
}
