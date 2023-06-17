import { Component, Input, SimpleChanges } from '@angular/core';
import ToolInterface from 'src/app/interfaces/tool.interface';
import { formatSize } from 'src/app/utils/formatSize';

@Component({
  selector: 'options-operator',
  templateUrl: './options-operator.component.html',
  styleUrls: ['./options-operator.component.scss']
})
export class OptionsOperatorComponent {

  @Input() tool : ToolInterface | null = null;
  @Input() fileSize : number | null = null;

  @Input() submitOptionCallback = (option : number) : void => {};

  formatSize = formatSize;

  activeOption : number = 0;

  ngOnChanges(changes : SimpleChanges) {
    if (changes['tool'] && !changes['tool'].firstChange) {
      this.activeOption = 0;
    }
  }

  changeActiveOption = (index : number) => {
    this.activeOption = index;
  }

  handleSubmit = () => {
    this.submitOptionCallback(this.activeOption);
  }
}
