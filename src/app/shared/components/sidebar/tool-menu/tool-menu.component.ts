import { Component, Input } from '@angular/core';

import { tools } from 'src/app/constants/tools';
import ToolInterface from 'src/app/interfaces/tool.interface';

@Component({
  selector: 'tool-menu',
  templateUrl: './tool-menu.component.html',
  styleUrls: ['./tool-menu.component.scss']
})
export class ToolMenuComponent {

  @Input() toolsOpen : boolean | undefined;
  @Input() changeMenuState = (event : any) : void => {};
  // @Input() changeMenuState: ((event: Event) => void) | undefined;

  // toolsList = [
  //   {
  //     category: 'Convert',
  //     tools: [
  //       {
  //         name: 'PDF to Word',
  //         image: 'assets/icons/word-file-bold.svg',
  //         id: '/pdf-to-word'
  //       },
  //       {
  //         name: 'PDF to PPT',
  //         image: 'assets/icons/powerpoint-file-bold.svg',
  //         id: '/pdf-to-ppt'
  //       },
  //       {
  //         name: 'PDF to Excel',
  //         image: 'assets/icons/excel-file-bold.svg',
  //         id: '/pdf-to-excel'
  //       },
  //       {
  //         name: 'PDF to JPEG',
  //         image: 'assets/icons/jpeg-file-bold.svg',
  //         id: '/pdf-to-jpeg'
  //       },
  //       {
  //         name: 'PDF Converter',
  //         image: 'assets/icons/convert-bold.svg',
  //         id: '/pdf-converter'
  //       }
  //     ]
  //   },
  //   {
  //     category: 'Edit',
  //     tools: [
  //       {
  //         name: 'Edit PDF',
  //         image: 'assets/icons/edit-bold.svg',
  //         id: '/edit'
  //       },
  //       {
  //         name: 'Reorder pages',
  //         image: 'assets/icons/reorder-pages-bold.svg',
  //         id: '/reorder-pages'
  //       },
  //       {
  //         name: 'Delete pages',
  //         image: 'assets/icons/delete-bold.svg',
  //         id: '/delete-pages'
  //       },
  //       {
  //         name: 'Split PDF',
  //         image: 'assets/icons/split-bold.svg',
  //         id: '/split'
  //       },
  //       {
  //         name: 'Number pages',
  //         image: 'assets/icons/number-pages-bold.svg',
  //         id: '/number-pages'
  //       }
  //     ]
  //   },
  //   {
  //     category: 'Sign & Security',
  //     tools: [
  //       {
  //         name: 'Sign PDF',
  //         image: 'assets/icons/sign-bold.svg',
  //         id: '/sign'
  //       },
  //       {
  //         name: 'Protect PDF',
  //         image: 'assets/icons/protect-bold.svg',
  //         id: '/protect'
  //       },
  //       {
  //         name: 'Unlock PDF',
  //         image: 'assets/icons/unlock-bold.svg',
  //         id: '/unlock'
  //       }
  //     ]
  //   },
  //   {
  //     category: 'Other',
  //     tools: [
  //       {
  //         name: 'Compress PDF',
  //         image: 'assets/icons/compress-bold.svg',
  //         id: '/compress'
  //       },
  //       {
  //         name: 'Merge PDF',
  //         image: 'assets/icons/merge-bold.svg',
  //         id: '/merge'
  //       }
  //     ]
  //   }
  // ];

  toolsList = [
    {
      category: 'Convert',
      tools: ['pdf-to-word', 'pdf-to-excel', 'pdf-to-ppt', 'pdf-to-jpeg', 'pdf-converter']
    },
    {
      category: 'Edit',
      tools: ['edit', 'reorder-pages', 'delete-pages', 'split', 'number-pages']
    },
    {
      category: 'Sign & Security',
      tools: ['sign', 'protect', 'unlock']
    },
    {
      category: 'Other',
      tools: ['compress', 'merge']
    }
  ];


  getToolById = (id : string) : ToolInterface | undefined => {
    return tools.find(tool => tool.id === id);
  }

}