import { Component, Input, SimpleChanges } from '@angular/core';
import ToolInterface from 'src/app/interfaces/tool.interface';
import { formatSize } from 'src/app/utils/formatSize';

@Component({
  selector: 'file-operator',
  templateUrl: './file-operator.component.html',
  styleUrls: ['./file-operator.component.scss']
})
export class FileOperatorComponent {

  @Input() tool : ToolInterface | null = null;
  @Input() file : File | null = null;
  @Input() fileSize : number | null = null;

  @Input() fileRemoveCallback = () : void => {};
  @Input() updateFileSize = (size : number) : void => {};

  @Input() submitCallback = () : void => {};
  @Input() submitOptionCallback = (option : number) : void => {};



  formatSize = formatSize;

  formatType = (name : string) : string => {

    const extension = name.split('.').pop();

    if (extension === 'pdf') {
      return 'PDF';
    }
    else if (extension === 'doc' || extension === 'docx') {
      return 'WORD';
    }
    else if (extension === 'xls' || extension === 'xlsx') {
      return 'EXCEL';
    }
    else if (extension === 'ppt' || extension === 'pptx') {
      return 'POWERPOINT';
    }
    else if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
      return 'IMAGE';
    }

    return 'OTHER';
  }




}
