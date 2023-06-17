import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from '../shared/modules/sidebar.module';
import { HomePageComponent } from '../components/home-page/home-page.component';
import { TopbarModule } from '../shared/modules/topbar.module';



@NgModule({
  declarations: [
    HomePageComponent
  ],
  imports: [
    CommonModule,
    SidebarModule,
    TopbarModule
  ],
  bootstrap: [HomePageComponent]
})
export class HomePageModule { }
