import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ElectronService } from "ngx-electron";

import ToolInterface from 'src/app/interfaces/tool.interface';
import { PDFWIZService } from 'src/app/services/pdfwiz.service';

// import PDFWiz from 'src/app/helpers/PDFWiz';


@Component({
  selector: 'file-upload-field',
  templateUrl: './file-upload-field.component.html',
  styleUrls: ['./file-upload-field.component.scss']
})
export class FileUploadFieldComponent {
  
  constructor(
    private PDFWIZ : PDFWIZService,
  ) {}

  @Input() tool : ToolInterface | null = null;

  @Input() fileUploadCallback = (file : File) : void => {};
  @Input() fileRemoveCallback = () : void => {};

  @ViewChild('fileInput') fileInput : ElementRef<HTMLInputElement> | undefined;


  handleFileFieldClick = (event : any) : void => {

    if (event.target.classList.contains('file-upload-dropdown')) {
      return;
    }

    this.fileInput?.nativeElement.click();
    
  }

  handleFileUpload = (event : any) : void => {

    if (event.target.files.length === 0) {
      this.fileRemoveCallback();
      return;
    }
    
    this.fileUploadCallback(event.target.files[0]);

  }


}