import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { GuardsComponent } from './guards/guards.component';
import { NgModule } from '@angular/core';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactusComponent } from './contactus/contactus.component'; 


export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'guard', component: GuardsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'about', component: AboutusComponent },
    { path: 'contact', component: ContactusComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}
  