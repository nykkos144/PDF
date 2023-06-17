import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import ToolInterface from 'src/app/interfaces/tool.interface';
import { PDFWIZService } from 'src/app/services/pdfwiz.service';

import { formatSize, formatType } from 'src/app/utils/utils';

@Component({
  selector: 'file-controller',
  templateUrl: './file-controller.component.html',
  styleUrls: ['./file-controller.component.scss']
})
export class FileControllerComponent {

  constructor(
    private PDFWIZ : PDFWIZService,
    private router: Router
  ) {}
  
  @Input() tool : ToolInterface | null = null;
  
  file : File | null = null;
  fileSize : number | null = null;

  formatSize = formatSize;
  formatType = formatType;

  ngOnChanges(changes : SimpleChanges) {

    if (changes['tool'] && !changes['tool'].firstChange) {
      this.file = null;
      this.PDFWIZ.restart();
    }

  }


  handleFileUpload = (file : File) : void => {

    this.file = file;
    // this.PDFWIZ.setFile(file).then(async () => {
    //   this.fileSize = await this.PDFWIZ.getSize();
    // });
    
    const route = this.tool?.route?.type == 'route' ? this.tool?.route.component : null;

    this.fileSize = file.size;
    // this.PDFWIZ.setFile(file);

    this.PDFWIZ.setFile(file).then(() => {
      if (route) {
        console.log(route)
        this.router.navigate([`/${ route }`]);
      }
    });

    // const route = this.tool?.route?.type == 'route' ? this.tool?.route.component : null;

    // if (route) {
    //   console.log(route)
    //   this.router.navigate([`/${ route }`]);
    // }

  }

  handleFileRemove = () : void => {

    this.file = null;
    this.PDFWIZ.restart();

  }

  handleSubmit = async (option : number | null = null) => {

    if (option !== null && this.tool?.options) console.log(this.tool?.options[option])

    console.log('submitted');
    // const pdf = await this.PDFWIZ.getFile();
    // console.log(pdf);

    this.router.navigate(['/review']);

    // console.log(this.PDFWIZ.splitPoints)
  }

  handleOptionSubmit = async (option : number) => {

    if (!this.tool || !this.tool.options) return;

    await this.PDFWIZ.compressPDF(this.tool.options[option].extraData.compressionLevel);
    this.router.navigate(['/review']);
  }

  updateFileSize = (size : number) : void => {
    this.fileSize = size;
  }

}
