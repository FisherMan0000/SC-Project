import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";

import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-revenues',
  standalone: true,
  imports: [SidebarComponent, ReactiveFormsModule,],
  templateUrl: './revenues.component.html',
  styleUrl: './revenues.component.css'
})
export class RevenuesComponent {

}
