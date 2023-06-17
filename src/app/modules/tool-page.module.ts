import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolPageComponent } from '../components/tool-page/tool-page.component';
import { SidebarModule } from '../shared/modules/sidebar.module';
import { TopbarModule } from '../shared/modules/topbar.module';
import { FileControllerModule } from './file-controller.module';



@NgModule({
  declarations: [
    ToolPageComponent
  ],
  imports: [
    CommonModule,
    SidebarModule,
    TopbarModule,
    
    FileControllerModule
  ],
  bootstrap: [ToolPageComponent]
})
export class ToolPageModule { }
