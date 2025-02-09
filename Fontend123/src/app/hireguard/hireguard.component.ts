import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Hiring {
  guard_id: number;
  customer_id?: number;
  price?: number;
  start_date: string;
  end_date: string;
}

@Component({
  selector: 'app-hireguard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './hireguard.component.html',
  styleUrl: './hireguard.component.css'
})
export class HireguardComponent implements OnInit {
  guards: any[] = [];
  errorMessage: string = '';
  selectedGuard: any | null = null;
  hireMessage: string = '';
  totalPrice: number = 0;
  totalDays: number = 0;
  customerId: number | null = null;

  hireData = {
    start_date: '',
    end_date: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllGuards();
    this.loadCustomerId();
  }

  loadCustomerId(): void {
    const id = localStorage.getItem('id');
    this.customerId = id ? parseInt(id, 10) : null;
    if (!this.customerId) {
      console.warn('⚠️ No customer ID found in localStorage');
    } else {
      console.log('✅ Customer ID loaded:', this.customerId);
    }
  }

  getAllGuards(): void {
    this.http.get<any>('http://localhost:5253/api/Guard').subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
          this.guards = response.data.map((guard: any) => ({
            ...guard,
            guard_id: guard.guard_id ?? guard.id
          }));
        } else {
          console.error('Unexpected API format:', response);
          this.guards = [];
        }
      },
      error: (err) => {
        console.error('Error fetching guards:', err);
        this.errorMessage = 'Failed to load guards.';
      }
    });
  }

  openHireForm(guard: any): void {
    if (!guard.guard_id) {
      console.error('Error: guard_id is missing!', guard);
      return;
    }
    this.selectedGuard = guard;
    this.hireMessage = '';
    this.totalPrice = 0;
    this.totalDays = 0;
    this.hireData.start_date = '';
    this.hireData.end_date = '';
  }

  calculateTotalPrice(): void {
    if (this.hireData.start_date && this.hireData.end_date) {
      const start = new Date(this.hireData.start_date);
      const end = new Date(this.hireData.end_date);
      if (end <= start) {
        this.hireMessage = 'End date must be after start date!';
        this.totalDays = 0;
        this.totalPrice = 0;
        return;
      }
      this.totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      this.totalPrice = this.totalDays * (this.selectedGuard?.price || 0);
    }
  }

  submitHireRequest(): void {
    if (!this.hireData.start_date || !this.hireData.end_date) {
      this.hireMessage = 'Please select valid dates.';
      console.error('❌ Error: start_date or end_date is missing!');
      return;
    }

    if (!this.customerId) {
      this.hireMessage = 'Customer ID not found!';
      console.error('❌ Error: Customer ID is missing!');
      return;
    }

    if (!this.selectedGuard || !this.selectedGuard.guard_id) {
      this.hireMessage = 'Guard ID is missing!';
      console.error('❌ Error: Guard ID is missing!', this.selectedGuard);
      return;
    }

    const hireRequest: Hiring = {
      guard_id: this.selectedGuard.guard_id,
      customer_id: this.customerId,
      price: this.totalPrice,
      start_date: new Date(this.hireData.start_date).toISOString(),
      end_date: new Date(this.hireData.end_date).toISOString()
    };

    console.log('🚀 API URL:', `http://localhost:5253/api/Hiring/${this.customerId}`);
    console.log('📌 Payload being sent:', JSON.stringify(hireRequest, null, 2));

    this.http.post(`http://localhost:5253/api/Hiring/${this.customerId}`, hireRequest)
      .subscribe({
        next: () => {
          this.hireMessage = 'Successfully hired guard!';
          this.selectedGuard = null;
        },
        error: (err) => {
          console.error('❌ Error hiring guard:', err);
          console.error('📌 Server Response:', err.error);
          this.hireMessage = `Failed to hire guard: ${err.error?.message || err.message}`;
        }
      });
  }

  cancelHire(): void {
    this.selectedGuard = null;
  }
}
