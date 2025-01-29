import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { GuardsComponent } from './guards/guards.component';
import { NgModule } from '@angular/core';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactusComponent } from './contactus/contactus.component'; 
import { DashBoardComponent } from './dash-board/dash-board.component';
import { addManagerComponent } from './add-manager/add-manager.component';
import { TestTest1Component } from './test-test1/test-test1.component';


export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'guard', component: GuardsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'about', component: AboutusComponent },
    { path: 'contact', component: ContactusComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'dashboard', component: DashBoardComponent },
    { path: 'add-manager', component: addManagerComponent},
    {path: 'test1', component: TestTest1Component}

    
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}
  