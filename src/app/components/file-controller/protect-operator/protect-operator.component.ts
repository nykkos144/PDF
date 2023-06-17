import { Component, Input } from '@angular/core';

@Component({
  selector: 'protect-operator',
  templateUrl: './protect-operator.component.html',
  styleUrls: ['./protect-operator.component.scss']
})
export class ProtectOperatorComponent {

  @Input() submitCallback = () : any => {}

  handleSubmit = () => {

  }
  
}
