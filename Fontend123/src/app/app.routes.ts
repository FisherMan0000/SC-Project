import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { GuardsComponent } from './guards/guards.component';
import { NgModule } from '@angular/core';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactusComponent } from './contactus/contactus.component'; 
import { DashBoardComponent } from './dash-board/dash-board.component';
import { AddManagerComponent } from './add-manager/add-manager.component';
import { AddBGComponent } from './add-bg/add-bg.component';
import { RevenuesComponent } from './revenues/revenues.component';
import { ServiceInfoComponent } from './service-info/service-info.component';
import { BGinfoComponent } from './bginfo/bginfo.component';
import { BginfosComponent } from './bginfos/bginfos.component';


export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'guard', component: GuardsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'about', component: AboutusComponent },
    { path: 'contact', component: ContactusComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'dashboard', component: DashBoardComponent },
    { path: 'add-manager', component: AddManagerComponent},
    {path: 'addbg', component: AddBGComponent},
    {path: 'revenue', component: RevenuesComponent},
    {path: 'serviceinfo', component: ServiceInfoComponent},
    {path: 'bginfo', component: BGinfoComponent},
    {path: 'bginfos', component: BginfosComponent},


    
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}
  