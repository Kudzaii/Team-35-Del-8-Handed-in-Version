import { Component, OnInit } from '@angular/core';
import { LazyLoadScriptService } from '../../services/lazy-load-script.service';

import { Location } from '@angular/common'
declare var $;
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  constructor(   private location: Location,private lazyLoadService: LazyLoadScriptService) { }

  ngOnInit() {
    this.lazyLoadService.loadScript('/assets/jquery.min.js').subscribe((_) => {
      console.log('Jquery is loaded!');
      this.loadJS();
    });
  }


  loadJS(){
    function readURL(input) {
      if (input.files && input.files[0]) {

        var reader = new FileReader();

        reader.onload = function(e) {
          $('.image-upload-wrap').hide();

          $('.file-upload-image').attr('src', e.target.result);
          $('.file-upload-content').show();

          $('.image-title').html(input.files[0].name);
        };

        reader.readAsDataURL(input.files[0]);

      } else {
        removeUpload();
      }
    }

    function removeUpload() {
      $('.file-upload-input').replaceWith($('.file-upload-input').clone());
      $('.file-upload-content').hide();
      $('.image-upload-wrap').show();
    }
    $('.image-upload-wrap').bind('dragover', function () {
        $('.image-upload-wrap').addClass('image-dropping');
      });
      $('.image-upload-wrap').bind('dragleave', function () {
        $('.image-upload-wrap').removeClass('image-dropping');
    });

  }
  goBack(): void {
    this.location.back();
  }

}
