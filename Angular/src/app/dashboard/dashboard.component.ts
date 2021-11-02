import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { LazyLoadScriptService } from './services/lazy-load-script.service';
declare var $;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  Role: number | 0;
  DashboardSettings: any;
  isLoaded:boolean = true;
  constructor(
    private Auth: AuthService,
    private lazyLoadService: LazyLoadScriptService
  ) {}

  ngOnInit(): void {
    this.Role = this.Auth.Role;
    this.RoleFilter(this.Role);
    this.lazyLoadService.loadScript('/assets/jquery.min.js').subscribe((_) => {
      console.log('Jquery is loaded!');
      this.loadJS();
    });
  }

  RoleFilter(role) {
    switch (role) {
      case 1:
        this.DashboardSettings = Admin;
        break;
      case 2:
        this.DashboardSettings = dashboards_settings_client;
        break;
      case 3:
        this.DashboardSettings = dashboards_settings_practitioner;
        break;
      case 4:
        this.DashboardSettings = dashboards_settings_trainer;
        break;
      case 5:
        this.DashboardSettings = dashboards_settings_trainee;
        break;
      default:
        console.log('No such day exists!');
        break;
    }
    this.isLoaded =false;
  }

  loadJS() {
    $(document).ready(function () {
      var zindex = 10;

      $('div.card').click(function (e) {
        e.preventDefault();

        var isShowing = false;

        if ($(this).hasClass('show')) {
          isShowing = true;
        }

        if ($('div.cards').hasClass('showing')) {
          // a card is already in view
          $('div.card.show').removeClass('show');

          if (isShowing) {
            // this card was showing - reset the grid
            $('div.cards').removeClass('showing');
          } else {
            // this card isn't showing - get in with it
            $(this).css({ zIndex: zindex }).addClass('show');
          }

          zindex++;
        } else {
          // no cards in view
          $('div.cards').addClass('showing');
          $(this).css({ zIndex: zindex }).addClass('show');

          zindex++;
        }
      });
    });
  }
}

/**
 * ?Client dashboard
 */
const dashboards_settings_client = [
  {
    NumberOfObject: 1,
    Header_Name: 'Trial Questionnaire',
    Button_Name: 'View Trial Questionnaire',
    ImageLink: 'https://blog.hubspot.com/hubfs/questionnaire-4.jpg',
    RouterLink: 'Trial_Questionnaire',
    icon: 'open_in_new',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: ' Purchase Package',
    Button_Name: 'Purchase',
    ImageLink:
      'https://www.bellwethercorp.com/wp-content/uploads/2015/11/Depositphotos_11044948_s-2015.jpg',
    RouterLink: 'PurchasePackage',
    icon: 'receipt',
    color: '',
  },
  {
    NumberOfObject: 1,
    Header_Name: ' My Packages',
    Button_Name: 'Packages',
    ImageLink:
      'https://blog.mercadoe.com/wp-content/uploads/2016/10/gestao-de-compras.jpg',
    RouterLink: 'MyPackages',
    icon: 'library_add',
    color: '',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Book Sessions',
    Button_Name: 'Book',
    ImageLink:
      'http://cte.org.ua/wp-content/uploads/2021/06/schedule.jpg',
    RouterLink: 'Booking',
    icon: 'library_add',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 2,
    Header_Name: 'My Sessions',
    Button_Name: 'Sessions',
    ImageLink:
      'https://kgdshgoixg1vrh3sdpjwgidf-wpengine.netdna-ssl.com/wp-content/uploads/2020/10/first-therapy-session-sunday-edit-scaled.jpg',
    RouterLink: 'Sessions',
    icon: 'format_line_spacing',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'My Questionnaires',
    Button_Name: 'Questionnaires',
    ImageLink:
      'https://cdn.paperpile.com/guides/img/research-paper-types-illustr-400x400.png',
    RouterLink: 'My_Questionnaires',
    icon: 'library_books',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'My Tasks',
    Button_Name: 'Tasks',
    ImageLink:
      'https://blog.gainapp.com/wp-content/uploads/2019/12/Blog-PrioritizeWork-2.jpg',
    RouterLink: 'tasks',
    icon: 'dns',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Progress Report',
    Button_Name: 'View Report',
    ImageLink:
      'https://www.pngix.com/pngfile/big/687-6877615_project-management-insights-and-data-and-insights-icon.png',
    RouterLink: 'ProgressReport',
    icon: 'trending_up',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Profile',
    Button_Name: 'Maintain Profile',
    ImageLink:
      'https://yorktonrentals.com/wp-content/uploads/2017/06/usericon.png',
    RouterLink: 'Profile',
    icon: 'face',
    color: 'rgb(15, 147, 255);',
  }
];

/**
 * ?Practitioner dashboard
 */
const dashboards_settings_practitioner = [
  {
    NumberOfObject: 1,
    Header_Name: 'Purchase Questionnaire',
    Button_Name: 'Purchase',
    ImageLink:
      'https://www.bellwethercorp.com/wp-content/uploads/2015/11/Depositphotos_11044948_s-2015.jpg',
    RouterLink: 'purchase-questionnaire',
    icon: 'receipt',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Set Availability',
    Button_Name: 'Availability',
    ImageLink:
      'https://play-lh.googleusercontent.com/WLAw5a143EIbRfvqtgCx-OxVDn4kuHVBZDaxTYeRUF616ua3Y-G14GeHGrsNoio_e7ii=h200',
    RouterLink: 'set-availability',
    icon: 'format_line_spacing',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'My Schedule',
    Button_Name: 'Schedule',
    ImageLink:
      'https://cdn3.vectorstock.com/i/1000x1000/22/47/full-day-availability-icon-vector-29962247.jpg',
    RouterLink: 'my-slots',
    icon: 'format_line_spacing',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Send Task To Client',
    Button_Name: 'Send',
    ImageLink:
      'https://cdn1.vectorstock.com/i/1000x1000/24/05/send-button-and-hand-icon-flat-style-vector-13902405.jpg',
    RouterLink: 'send-client-task',
    icon: 'dns',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Send Feedback',
    Button_Name: 'Feedback',
    ImageLink:
      'https://www.seekpng.com/png/detail/83-839679_submit-feedback-feedback-png-transparent.png',
    RouterLink: 'feedbacks',
    icon: 'dns',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 2,
    Header_Name: 'My Sessions',
    Button_Name: 'Sessions',
    ImageLink:
      'https://kgdshgoixg1vrh3sdpjwgidf-wpengine.netdna-ssl.com/wp-content/uploads/2020/10/first-therapy-session-sunday-edit-scaled.jpg',
    RouterLink: 'Sessions',
    icon: 'format_line_spacing',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Profile',
    Button_Name: 'Maintain Profile',
    ImageLink:
      'https://yorktonrentals.com/wp-content/uploads/2017/06/usericon.png',
    RouterLink: 'Profile-Practitioner',
    icon: 'face',
    color: 'rgb(15, 147, 255);',
  }
];
/**
 * ? Trainer dashboard
 */

const dashboards_settings_trainer = [
  {
    NumberOfObject: 1,
    Header_Name: 'Set Availability',
    Button_Name: 'Set',
    ImageLink:
      'https://play-lh.googleusercontent.com/WLAw5a143EIbRfvqtgCx-OxVDn4kuHVBZDaxTYeRUF616ua3Y-G14GeHGrsNoio_e7ii=h200',
    RouterLink: 'set-practitioner-availability',
    icon: 'format_line_spacing',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Send Task To Trainee',
    Button_Name: 'Task',
    ImageLink:
      'https://cdn1.vectorstock.com/i/1000x1000/24/05/send-button-and-hand-icon-flat-style-vector-13902405.jpg',
    RouterLink: 'send-task-trainee',
    icon: 'dns',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Send Feedback',
    Button_Name: 'Feedback',
    ImageLink:
      'https://www.seekpng.com/png/detail/83-839679_submit-feedback-feedback-png-transparent.png',
    RouterLink: 'send-feedback',
    icon: 'dns',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Profile',
    Button_Name: 'Maintain Profile',
    ImageLink:
    'https://yorktonrentals.com/wp-content/uploads/2017/06/usericon.png',
    RouterLink: 'trainer-profile',
    icon: 'face',
    color: 'rgb(15, 147, 255);',
  },
];
/**
 * ? Trainee dashboard
 */
const dashboards_settings_trainee = [
  {
    NumberOfObject: 1,
    Header_Name: 'Book Sessions',
    Button_Name: 'Book',
    ImageLink:
      'http://cte.org.ua/wp-content/uploads/2021/06/schedule.jpg',
    RouterLink: 'book',
    icon: 'library_add',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'My Sessions',
    Button_Name: 'Sessions',
    ImageLink:
      'https://kgdshgoixg1vrh3sdpjwgidf-wpengine.netdna-ssl.com/wp-content/uploads/2020/10/first-therapy-session-sunday-edit-scaled.jpg',
    RouterLink: 'sessions',
    icon: 'format_line_spacing',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Performance Report',
    Button_Name: 'Performance',
    ImageLink:
      'https://www.pinclipart.com/picdir/big/385-3851687_finacial-inclusions-performance-icon-png-clipart.png',
    RouterLink: 'performance',
    icon: 'trending_up',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'My Questionnaires',
    Button_Name: 'Questionnaires',
    ImageLink:
      'https://cdn.paperpile.com/guides/img/research-paper-types-illustr-400x400.png',
    RouterLink: 'questionnaire',
    icon: 'library_books',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'My Tasks',
    Button_Name: 'Tasks',
    ImageLink:
      'https://blog.gainapp.com/wp-content/uploads/2019/12/Blog-PrioritizeWork-2.jpg',
    RouterLink: 'trainee-tasks',
    icon: 'dns',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Profile',
    Button_Name: 'Maintain Profile',
    ImageLink:
    'https://yorktonrentals.com/wp-content/uploads/2017/06/usericon.png',
    RouterLink: 'trainee-profile',
    icon: 'face',
    color: 'rgb(15, 147, 255);',
  },
];
/**
 * ? Admin dashboard
 */
const Admin = [

  {
    NumberOfObject: 1,
    Header_Name: 'Client Management',
    Button_Name: 'View',
    ImageLink:
      'https://cdn.contactcenterworld.com/imagestemp/422019135223_shutterstock_186060851.jpg',
    RouterLink: 'client-management',
    icon: 'library_add',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Access Management',
    Button_Name: 'Access',
    ImageLink:
      'https://www.calgary.ca/content/dam/www/ca/city-clerks/publishingimages/information-access-privacy/foip.jpg',
    RouterLink: 'access',
    icon: 'library_add',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Application Requests ',
    Button_Name: 'Requests',
    ImageLink:
      'https://www.netclipart.com/pp/m/9-93978_chapter-questions-for-interviewer-to-ask-during-.png',
    RouterLink: 'application-requests',
    icon: 'library_add',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Assign Users',
    Button_Name: 'Assign',
    ImageLink:
      'http://photos1.fotosearch.com/bthumb/CSP/CSP207/k2074736.jpg',
    RouterLink: 'assign',
    icon: 'library_add',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Manage Questionnaires ',
    Button_Name: 'Manage',
    ImageLink:
      'https://image.freepik.com/free-vector/business-background-design_1167-77.jpg',
    RouterLink: 'questionnaire-management',
    icon: 'library_add',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Assign Questionnaire',
    Button_Name: 'Assign',
    ImageLink:
      'https://thumbs.dreamstime.com/b/question-mark-character-notepad-cartoon-42449414.jpg',
    RouterLink: 'assign-questionnaire',
    icon: 'library_add',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Audit Trail',
    Button_Name: 'Audit',
    ImageLink:
      'http://images.clipartpanda.com/surtax-clipart-60496-design-mascot-paper-trail.jpg',
    RouterLink: 'audit-trail',
    icon: 'library_add',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Reports',
    Button_Name: 'Reports',
    ImageLink:
      'http://3.bp.blogspot.com/_O0OyyjHaqpo/SwISTQXBJ5I/AAAAAAAAAA8/5RPLkthofZY/s1600/report.jpg',
    RouterLink: 'Reports',
    icon: 'library_add',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Administration',
    Button_Name: 'Administration',
    ImageLink:
      'https://www.netclipart.com/pp/m/91-911062_receptionist-clipart-admin-assistant-cartoon.png',
    RouterLink: 'Administrations',
    icon: 'library_add',
    color: 'rgb(15, 147, 255);',
  },
  {
    NumberOfObject: 1,
    Header_Name: 'Exit Wavers',
    Button_Name: 'Exit Wavers',
    ImageLink:
      'https://www.netclipart.com/pp/m/91-911062_receptionist-clipart-admin-assistant-cartoon.png',
    RouterLink: 'Exit-Wavers',
    icon: 'library_add',
    color: 'rgb(15, 147, 255);',
  },

];
