import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-bginfo',
  standalone: true,
  imports: [CommonModule,HttpClientModule],
  templateUrl: './bginfo.component.html',
  styleUrls: ['./bginfo.component.css']
})
export class BGinfoComponent implements OnInit {

  guards: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllGuards();
  }

  getAllGuards(): void {
    this.http.get<any>('http://localhost:5253/api/Guard').subscribe({
      next: (response) => {
        console.log('API Response:', response); // ✅ ดูว่า API ส่งอะไรมา
        if (response && Array.isArray(response.data)) {
          this.guards = response.data; // ✅ ใช้ response.data เพราะ API ห่อข้อมูลไว้
        } else {
          console.error('Unexpected API response format:', response);
          this.guards = [];
        }
      },
      error: (err) => {
        console.error('Error fetching guards:', err);
        this.errorMessage = 'Failed to load guards.';
      }
    });
  }
}
