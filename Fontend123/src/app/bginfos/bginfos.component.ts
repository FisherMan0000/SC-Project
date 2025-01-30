import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { BGinfoComponent } from '../bginfo/bginfo.component';


@Component({
  selector: 'app-bginfos',
  standalone: true,
  imports: [SidebarComponent, BGinfoComponent],
  templateUrl: './bginfos.component.html',
  styleUrl: './bginfos.component.css'
})
export class BginfosComponent {

}
