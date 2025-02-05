import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bginfo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bginfo.component.html',
  styleUrls: ['./bginfo.component.css']
})
export class BGinfoComponent implements OnInit {
  
  guards: any[] = [];
  errorMessage: string = '';
  editingGuard: any = null; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllGuards();
  }

  getAllGuards(): void {
    this.http.get<any>('http://localhost:5253/api/Guard').subscribe({
      next: (response) => {
        console.log('API Response:', response); 
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
  
  // ✅ เปิด Popup Modal แก้ไข
  editGuard(guard: any): void {
    console.log('Editing Guard:', guard); 
    if (!guard.guard_id) {
      console.error('Guard ID is missing:', guard);
      return;
    }

    // ✅ สร้างสำเนาของ Guard ที่จะใช้แก้ไข เพื่อป้องกันค่าเดิมเปลี่ยน
    this.editingGuard = { ...guard };
  }

  // ✅ ยกเลิกการแก้ไข
  cancelEdit(): void {
    this.editingGuard = null;
  }

  updateGuard(): void {
    if (!this.editingGuard || !this.editingGuard.guard_id) {
      console.error('Update failed: Guard ID is missing');
      return;
    }
  
    // ✅ Debug: ดูค่า Price ก่อนแปลง
    console.log('Before conversion:', this.editingGuard.price, typeof this.editingGuard.price);
  
    // ✅ ตรวจสอบว่า `Price` มีค่าหรือไม่ ถ้าไม่มีให้ส่ง `0`
    if (this.editingGuard.price === '' || this.editingGuard.price === null || this.editingGuard.price === undefined) {
      console.error("Error: Price is missing or empty!");
      this.editingGuard.price = 0;  // หรือเปลี่ยนให้เป็นค่าเริ่มต้น
    } else {
      this.editingGuard.price = parseFloat(this.editingGuard.price);
    }
  
    console.log('After conversion:', this.editingGuard.price, typeof this.editingGuard.price);
  
    this.http.put(`http://localhost:5253/api/Guard/${this.editingGuard.guard_id}`, this.editingGuard)
      .subscribe({
        next: () => {
          const index = this.guards.findIndex(g => g.guard_id === this.editingGuard.guard_id);
          if (index !== -1) {
            this.guards[index] = { ...this.editingGuard };
          }
          this.cancelEdit();
        },
        error: (err) => {
          console.error('Error updating guard:', err);
          this.errorMessage = 'Failed to update guard.';
        }
      });
  }
  
  
}
