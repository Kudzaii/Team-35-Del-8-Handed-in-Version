import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SimpleModalService } from 'ngx-simple-modal';
import { PromptComponent } from 'src/app/shared/utils/modals/prompt/prompt.component';
import { QuestionnaireService } from '../../services/Questionnaire.service';

@Component({
  selector: 'app-TitleDetails',
  templateUrl: './TitleDetails.component.html',
  styleUrls: ['./TitleDetails.component.scss']
})
export class TitleDetailsComponent implements OnInit {

    title_id:number
    QuestionsBank: Array<any>
  constructor(private SimpleModalService: SimpleModalService, private questionnaireService: QuestionnaireService, private Arouter: ActivatedRoute,
    private location: Location
   ) {   this.title_id = Number(this.Arouter.snapshot.params.id); }


  ngOnInit() {
    this.getTitles();
  }

  AddType() {

    this.SimpleModalService.addModal(PromptComponent, {
      title: 'Titles',
      question: 'Add Your Question titles: ',
        message: ''
      })
      .subscribe((message) => {
        // We get modal result
          console.log(message);
          let pack = {Description:message }
          this.questionnaireService.AddQuestionnaireTitle(pack).subscribe(response=>{
            this.getTitles();


          },
          error => {throw new Error('Client not added')})
      });
  }

  Maintain(Id,Title) {
    this.SimpleModalService.addModal(PromptComponent, {
      title: 'Question Details',
      question: 'Update Question Details',
      message: Title
    })
      .subscribe((message) => {
        // We get modal result
          console.log(message);
          let pack = {Question:message, Question_ID: Id }
          this.questionnaireService.MaintainQuestionnaireTitleDetails(Id, pack).subscribe(response=>{
            this.getTitles();

          }
          ,error => {throw new Error('Client not added '); console.log(error)})
      });
  }

  getTitles() {
    this.questionnaireService.ViewQuestionnaireDetails(this.title_id).subscribe((res:any) => {
      this.QuestionsBank = res
    })
  }


  goBack(): void {
    this.location.back();
  }

}