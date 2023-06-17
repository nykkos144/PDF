import { Component, Input, SimpleChanges } from '@angular/core';

import { tools } from 'src/app/constants/tools';
import ToolInterface from 'src/app/interfaces/tool.interface';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  
  @Input() page : string = '';

  toolsOpen : boolean = false;
  tool : ToolInterface | null = null;

  ngOnInit() {
    this.defineTool();
  }
  ngOnChanges(changes : SimpleChanges) {
    if (changes['page'] && !changes['page'].firstChange) {
      this.toolsOpen = false;
      this.defineTool();
    }
  }

  defineTool = () : void => {
    this.tool = tools.find(item => item.id == this.page) || null;
  }

  changeMenuState = (event : any) : void => {

    if (!event.target.classList.contains('button') && !event.target.classList.contains('container')) {
      return;
    }

    event.target.classList.contains('tool-menu');

    this.toolsOpen = !this.toolsOpen;
  }


}
