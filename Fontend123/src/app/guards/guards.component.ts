import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

import { HireguardComponent } from "../hireguard/hireguard.component";

@Component({
  selector: 'app-guards',
  standalone: true,
  imports: [NavbarComponent,  HireguardComponent],
  templateUrl: './guards.component.html',
  styleUrl: './guards.component.css'
})
export class GuardsComponent {

}
