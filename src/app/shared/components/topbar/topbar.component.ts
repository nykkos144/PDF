import { Component, HostListener, Input } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {

  @Input() page : string | null = null;

  constructor (
    private electronService : ElectronService
  ) {}


  // keyDown_subscription : Subscription | undefined;
  // keyUp_subscription : Subscription | undefined;

  // mouseMove_subscription: Subscription | undefined;
  // mouseUp_subscription: Subscription | undefined;

  ngOnInit() {

    // this.mouseMove_subscription = fromEvent(document, 'mousemove').subscribe(event => {
    //   this.handleMouseMove(event);
    // });

    // this.keyDown_subscription = fromEvent(document, 'keydown').subscribe(event => {
    //   this.handleKeyDown(event);
    // });
    // this.keyUp_subscription = fromEvent(document, 'keyup').subscribe(event => {
    //   this.handleKeyUp(event);
    // });

  }

  handleClose = () => {

    if (!this.electronService.isElectronApp) return;
    this.electronService.ipcRenderer.send('close-window');

  }
  handleMaximize = () => {

    if (!this.electronService.isElectronApp) return;
    this.electronService.ipcRenderer.send('maximize-window');

  }
  handleMinimize = () => {

    if (!this.electronService.isElectronApp) return;
    this.electronService.ipcRenderer.send('minimize-window');

  }


  moving : boolean = false;
  x : number = 0;
  y : number = 0;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown = (event : any) => {

    if (!event.altKey || this.moving) return;

    event.preventDefault();
    this.moving = true;

    this.x = event.clientX;
    this.y = event.clientY;

  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp = (event : any) => {

    if (event.key !== 'Alt') return;

    event.preventDefault();
    this.moving = false;

  }

}