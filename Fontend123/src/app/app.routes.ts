import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TestTest1Component } from './test-test1/test-test1.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path : 'login',component:LoginComponent},
    {path : 'test',component:TestTest1Component},
    {path : 'home',component:HomeComponent},
    ];
