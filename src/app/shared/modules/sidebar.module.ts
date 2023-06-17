import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../components/sidebar/sidebar/sidebar.component';
import { ToolMenuComponent } from '../components/sidebar/tool-menu/tool-menu.component';
import { AppRoutingModule } from 'src/app/app-routing.module';



@NgModule({
  declarations: [
    SidebarComponent,
    ToolMenuComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  exports: [
    SidebarComponent
  ],
  bootstrap: [SidebarComponent]
})
export class SidebarModule { }
