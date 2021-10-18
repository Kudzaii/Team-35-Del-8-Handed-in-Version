import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-PractitonerProfile',
  templateUrl: './PractitonerProfile.component.html',
  styleUrls: ['./PractitonerProfile.component.scss']
})
export class PractitionerProfileComponent implements OnInit {

  userRole:any

  constructor(private auth:AuthService) {
    this.userRole =  this.auth.Role
  }

  ngOnInit() {
  }

}
