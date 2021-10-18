import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
@Component({
  selector: 'app-ReviewSessionFeedback',
  templateUrl: './ReviewSessionFeedback.component.html',
  styleUrls: ['./ReviewSessionFeedback.component.scss']
})
export class ReviewSessionFeedbackComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }
  goBack(): void {
    this.location.back();
  }
}
