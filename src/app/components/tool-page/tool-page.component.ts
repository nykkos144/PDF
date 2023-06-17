import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { generateFilter } from 'colorize-filter';
import { tools } from 'src/app/constants/tools';
import ToolInterface from 'src/app/interfaces/tool.interface';

@Component({
  selector: 'app-tool-page',
  templateUrl: './tool-page.component.html',
  styleUrls: ['./tool-page.component.scss']
})
export class ToolPageComponent {

  tool : ToolInterface | null = null;
  // tool : string | null = null;

  page : string = '';

  constructor(
    private route : ActivatedRoute
  ) { }

  ngOnInit() {

    this.route.paramMap.subscribe((params : ParamMap) => {
      this.tool = tools.find(item => item.id == params.get('tool')) || null;
      this.page = this.tool?.id || '';

      const root : HTMLElement | null = document.querySelector(':root');
      if (!root) return;

      root.style.setProperty('--main-color', this.tool ? this.tool.color : '#fff');
      root.style.setProperty('--main-color-filter', this.tool ? 'brightness(0) saturate(100%) ' + generateFilter(this.tool.color) : 'brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(0%) hue-rotate(48deg) brightness(107%) contrast(101%)');      
    });

  }
  
}
