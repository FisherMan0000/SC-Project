import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Guard {
  id: number;
  name: string;
  age: number;
  gender: string;
  skills: string;
  type: string;
  price: number;
  image_url?: string;
}

@Component({
  selector: 'app-hireguard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './hireguard.component.html',
  styleUrl: './hireguard.component.css'
})
export class HireguardComponent implements OnInit {
  guards: Guard[] = [];
  errorMessage: string = '';
  selectedGuard: Guard | null = null;  
  hireMessage: string = '';  
  totalPrice: number = 0;
  totalDays: number = 0;  // ✅ เพิ่มตัวแปรนับจำนวนวัน

  hireData = {
    startDate: '',
    endDate: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllGuards();
  }

  getAllGuards(): void {
    this.http.get<any>('http://localhost:5253/api/Guard').subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
          this.guards = response.data;
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

  // ✅ เปิดฟอร์มจ้างงาน
  openHireForm(guard: Guard): void {
    this.selectedGuard = guard;
    this.hireMessage = '';
    this.totalPrice = 0;
    this.totalDays = 0; // รีเซ็ตค่าจำนวนวัน
    this.hireData.startDate = '';
    this.hireData.endDate = '';
  }

  // ✅ คำนวณจำนวนวันและราคาทั้งหมด
  calculateTotalPrice(): void {
    if (this.hireData.startDate && this.hireData.endDate) {
      const start = new Date(this.hireData.startDate);
      const end = new Date(this.hireData.endDate);
      const timeDiff = end.getTime() - start.getTime();
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (days > 0) {
        this.totalDays = days; // ✅ เก็บจำนวนวันที่คำนวณได้
        this.totalPrice = days * (this.selectedGuard?.price || 0);
      } else {
        this.totalDays = 0;
        this.totalPrice = 0;
      }
    }
  }

  // ✅ ส่งคำขอจ้างงานไปยัง API
  submitHireRequest(): void {
    if (!this.hireData.startDate || !this.hireData.endDate) {
      this.hireMessage = 'Please select valid dates.';
      return;
    }
  
    const customerId = localStorage.getItem('Customer_id'); // ✅ ดึง customerId
  
    if (!customerId) {
      this.hireMessage = 'Customer ID not found!';
      return;
    }
  
    const hireRequest = {
      guardId: this.selectedGuard?.id,
      startDate: this.hireData.startDate,
      endDate: this.hireData.endDate,
      totalPrice: this.totalPrice,
    };
  
    // ✅ เปลี่ยน URL ให้ถูกต้อง (เพิ่ม customerId)
    this.http.post(`http://localhost:5253/api/Hiring/${customerId}`, hireRequest)
      .subscribe({
        next: () => {
          this.hireMessage = 'Successfully hired guard!';
          this.selectedGuard = null;
        },
        error: (err) => {
          console.error('Error hiring guard:', err);
          this.hireMessage = `Failed to hire guard: ${err.message}`;
        }
      });
  }
  

  // ✅ ปิดฟอร์มจ้างงาน
  cancelHire(): void {
    this.selectedGuard = null;
  }
}
