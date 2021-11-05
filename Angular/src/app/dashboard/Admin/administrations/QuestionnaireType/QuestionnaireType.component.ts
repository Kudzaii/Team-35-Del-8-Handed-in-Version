import { Component, OnInit } from '@angular/core';
import { PromptComponent } from 'src/app/shared/utils/modals/prompt/prompt.component';
import { TypeService } from '../../services/type.service';
import { SimpleModalService } from 'ngx-simple-modal';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-QuestionnaireType',
  templateUrl: './QuestionnaireType.component.html',
  styleUrls: ['./QuestionnaireType.component.scss']
})
export class QuestionnaireTypeComponent implements OnInit {

  QuestionnaireTypes: Array<any>;
  public query: any = '';


  constructor(private typeService: TypeService,private SimpleModalService: SimpleModalService) {}


  ngOnInit() {
      this.getQuestionnaireTypes();
  }
  getQuestionnaireTypes() {
    this.typeService.GetTypes(1).subscribe((res) => {
      this.QuestionnaireTypes = res;
    });
  }


  AddType() {

    this.SimpleModalService.addModal(PromptComponent, {
      title: 'Questionnaire Type',
      question: 'Add Your Questionnaire Type: ',
        message: ''
      })
      .subscribe((message) => {
        // We get modal result
          console.log(message);
          let pack = {Description:message }
          this.typeService.AddQuestionnaireType(pack).subscribe(response=>{
            this.getQuestionnaireTypes();


          },
          error => {throw new Error('Client Not Added')})
      });
  }

  Maintain(Description,Id) {
    this.SimpleModalService.addModal(PromptComponent, {
      title: 'Questionnaire Type',
      question: 'Update Questionnaire Type: ',
      message: Description.toString()
    })
      .subscribe((message) => {
        // We get modal result
          console.log(message);
          let pack = {Description:message, QuestionBankType_ID: Id }
          this.typeService.UpdateQuestionnaireType(pack,Id).subscribe(response=>{
            this.getQuestionnaireTypes();
            this.typeService.success('questionnaire')
          }
          ,error => {throw new Error('Client Not Added '); console.log(error)})
      });
  }

  delete(id) {
    Swal.fire({
      title: 'Are You Sure You Want To Delete Questionnaire Type?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.typeService.DeleteQuestionnaireType(id).subscribe(res=>{
          console.log(res);
          this.getQuestionnaireTypes();
      })
      }
    }
    )}
    
}

