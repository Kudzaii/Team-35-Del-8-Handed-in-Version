import { Component } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';

export interface NewPromptModel {
  title:string;
  question:string;
  message: any;
  describe: string;
  descriptionmessage: any;
  price: string;
  pricemessage: any;
  sessions: string;
  sessionsmessage: any;
}

@Component({
  selector: 'prompt',
  template: `
    <div class="modal-content">
      <div class="modal-header">
        <h4>{{title || 'Prompt'}}</h4>
      </div>
      <div class="modal-body">
        <label>{{question}}</label>


        <input type="text" *ngIf="show;else content" class="form-control" [(ngModel)]="message.Name" name="name" placeholder="Name" />
        <br>
        <input type="text" *ngIf="show;else content" class="form-control" [(ngModel)]="message.Description"placeholder="Description" />

        <ng-template #content> <input type="text" class="form-control"  [(ngModel)]="message" name="name" /></ng-template>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-danger" (click)="close()">Cancel</button>
        <button type="button" class="btn btn-primary" (click)="apply()">Confirm</button>
      </div>
    </div>
  `
})
export class NewPromptComponent extends SimpleModalComponent<NewPromptModel, string> implements NewPromptModel {
  title: string;
  question: string;
  message: any;
  describe: string;
  descriptionmessage: any;
  price: string;
  pricemessage: any;
  sessions: string;
  sessionsmessage: any;
  show=false
  constructor() {
    super();
    if(this.title ==='Session Type')
    {
        this.show =true
    }
  }
  apply() {
    this.result = this.message && this.pricemessage && this.sessionsmessage;
    this.close();
  }
}
