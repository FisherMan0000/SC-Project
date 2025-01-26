import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from "../sidebar/sidebar.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
