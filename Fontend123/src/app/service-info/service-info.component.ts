import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-service-info',
  templateUrl: './service-info.component.html',
  styleUrls: ['./service-info.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent]
})
export class ServiceInfoComponent {
  hiringList: any[] = []; // เก็บข้อมูลทั้งหมดจาก API
  errorMessage: string = '';
  apiUrl = 'http://localhost:5253/api/Hiring/all'; // URL ตาม Backend

  constructor(private http: HttpClient) {}

  fetchAllHiring() {
    this.errorMessage = '';
  
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log("Raw API Response:", data); // ดูข้อมูลที่ได้จาก API
  
        this.hiringList = data.map(hiring => ({
          hiring_id: hiring.hiring_id,
          customerName: hiring.customerName,
          guardName: hiring.guardName,
          price: hiring.price ?? 'N/A', // ถ้าเป็น null ให้เป็น 'N/A'
          start_date: hiring.start_date ? new Date(hiring.start_date).toISOString() : 'N/A',
          end_date: hiring.end_date ? new Date(hiring.end_date).toISOString() : 'N/A'
        }));
  
        console.log("Formatted Data:", this.hiringList); // ดูข้อมูลที่ถูกแปลง
      },
      error: () => {
        this.hiringList = [];
        this.errorMessage = 'Failed to fetch hiring data!';
      }
    });
  }
  
  
}
