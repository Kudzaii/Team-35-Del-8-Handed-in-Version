import { Component, NgModule, OnInit, TemplateRef } from '@angular/core';
//import { Question } from 'src/app/models/Question';
import { ClientService } from '../services/client.service';
import { Location } from '@angular/common'
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-TrialQuestionnaire',
  templateUrl: './TrialQuestionnaire.component.html',
  styleUrls: ['./TrialQuestionnaire.component.scss']
})
export class TrialQuestionnaireComponent implements OnInit {

  //Questions: Array<Question>
  modalRef: BsModalRef | null;
  modalRef2: BsModalRef;
   constructor(private clientService: ClientService,private location: Location, private modalService: BsModalService) { }

  /*ngOnInit() {
    this.getQuestionsTrialQuestions()
  }

  getQuestionsTrialQuestions(){
    this.clientService.getTrialQuestionnaire().subscribe(res=>{

      console.log(res)
      let Pack = Object.keys(res).map(index => {this.Questions = res[index];});
    })

  }*/
  goBack(): void {
    this.location.back();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-lg' });
  }
  openModal2(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, {id: 2, class: 'second' });
  }
  closeFirstModal() {
    if (!this.modalRef) {
      return;
    }
 
    this.modalRef.hide();
    this.modalRef = null;
  }
  closeModal(modalId?: number){
    this.modalService.hide(modalId);
  }

}