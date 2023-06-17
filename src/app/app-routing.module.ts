import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ToolPageComponent } from './components/tool-page/tool-page.component';
import { ReviewPageComponent } from './components/review-page/review-page.component';
import { EditPageComponent } from './components/edit-page/edit-page/edit-page.component';


const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'tool', children: [
    {
      path: ':tool', component: ToolPageComponent
    }
  ]},
  { path: 'review', component: ReviewPageComponent },
  { path: 'edit', component: EditPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
