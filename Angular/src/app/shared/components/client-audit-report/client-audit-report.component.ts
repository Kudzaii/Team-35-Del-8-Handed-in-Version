import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ClientsService } from 'src/app/dashboard/Admin/services/clients.service';
import { SharedService } from '../../services/shared.service';

const image = {
  FERN: 'https://nitrocdn.com/BzukxzxIDWSkBjOuXIuFVkjjEriFmqlw/assets/static/optimized/rev-5165cad/wp-content/uploads/2020/02/Vascular-plants-ferns-and-relatives-768x512.jpg',
  CACTUS:
    'https://i.pinimg.com/originals/fc/1c/3e/fc1c3e872b27a3c21e11c0171f22550d.jpg',
  IMPATIENTS:
    'https://www.thespruce.com/thmb/7HE6E4A4cgLR9bkHa2_RIrCzaDA=/2121x1414/filters:no_upscale():max_bytes(150000):strip_icc()/impatiens-mixed-colors-big-592f2e103df78cbe7e3dc5f5-f52560e3689c4072a65f79a713f28223.jpg',
  SUNFLOWER:
    'https://www.almanac.com/sites/default/files/styles/amp_metadata_content_image_min_696px_wide/public/image_nodes/sunflower-1627193_1920.jpg?itok=z0U222mG',
};
@Component({
  selector: 'app-Client-audit-report',
  templateUrl: './client-audit-report.component.html',
  styleUrls: ['./client-audit-report.component.scss'],
})
export class ClientAuditReportComponent implements OnInit {
  ReportData: any = {};
  Clients: Array<any> = [];
  IMAGE:any;
  isAdmin: boolean = false;
  isSelected:boolean = false;
  constructor(private sharedService:SharedService, private clientsService:ClientsService,private authService: AuthService) {}

  ngOnInit() {

    this.getClient();
    if(this.authService.Role==1){
      this.isAdmin =true;
    }
    else{
      this.getReport();
    }
  }

  getReport(id?) {
    this.sharedService.ClientAudit(Number(id)).subscribe((res) => {
      this.ReportData = res[0];
      console.log(this.ReportData)
      if(this.ReportData.Result =='Sunflower')
      {
        this.IMAGE = image.SUNFLOWER
      }
      if(this.ReportData.Result == 'Cactus')
      {
        this.IMAGE = image.CACTUS
      }
      else if(this.ReportData.Result == 'Impatients'){
        this.IMAGE = image.IMPATIENTS
      }
      else if(this.ReportData.Result == 'Fern'){
        this.IMAGE = image.FERN
      }
      this.isSelected =true;
    });
  }


  getClient() {
    this.clientsService.getClients().subscribe((result) => {
      this.Clients = result;
    });
  }
}
