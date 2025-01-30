// import { Component, OnInit } from '@angular/core';
// import { SidebarComponent } from "../sidebar/sidebar.component";
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-add-bg',
//   standalone: true,
//   imports: [SidebarComponent,ReactiveFormsModule, CommonModule, HttpClientModule],
//   templateUrl: './add-bg.component.html',
//   styleUrls: ['./add-bg.component.css']
// })
// export class AddBGComponent implements OnInit {

//   bodyguardForm!: FormGroup;
//   errorMessage: string = '';

//   constructor(private fb: FormBuilder, private http: HttpClient) {}

//   ngOnInit(): void {
//     this.bodyguardForm = this.fb.group({
//       image_url: ['', Validators.required],
//       name: ['', Validators.required],
//       age: ['', [Validators.required, Validators.min(18)]],
//       gender: ['', Validators.required],
//       skills: ['', Validators.required],
//       type: ['', Validators.required],
//       bio: ['', Validators.required]
//     });
//   }

//   onAddBodyguard(): void {
//     if (this.bodyguardForm.invalid) {
//       this.errorMessage = 'Please fill out the form correctly.';
//       return;
//     }

//     const bodyguardData = this.bodyguardForm.value;
//     this.http.post('http://localhost:5253/api/Guard', bodyguardData)
//       .subscribe({
//         next: () => {
//           alert('Bodyguard added successfully!');
//           this.bodyguardForm.reset();
//         },
//         error: (err) => {
//           console.error(err);
//           this.errorMessage = 'Failed to add bodyguard. Please try again.';
//         }
//       });
//   }

// }

import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-bg',
  standalone: true,
  imports: [SidebarComponent, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './add-bg.component.html',
  styleUrls: ['./add-bg.component.css']
})
export class AddBGComponent implements OnInit {

  bodyguardForm!: FormGroup;
  errorMessage: string = '';
  token: string | null = null; // ใช้เก็บ Token ของ Manager

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // ดึง Token จาก localStorage หรือ sessionStorage
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');

    // ถ้าไม่มี Token ให้ Redirect ไปหน้า Login
    if (!this.token) {
      alert('Please log in first.');
      this.router.navigate(['/login']); // เปลี่ยนเส้นทางไปหน้า Login
      return;
    }

    this.bodyguardForm = this.fb.group({
      image_url: ['', Validators.required],
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      gender: ['', Validators.required],
      skills: ['', Validators.required],
      type: ['', Validators.required],
      bio: ['', Validators.required]
    });
  }

  onAddBodyguard(): void {
    if (this.bodyguardForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    const bodyguardData = this.bodyguardForm.value;

    // สร้าง HTTP Headers และเพิ่ม Token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // ส่ง Token ไปกับ Request
    });

    this.http.post('http://localhost:5253/api/Guard', bodyguardData, { headers })
      .subscribe({
        next: () => {
          alert('Bodyguard added successfully!');
          this.bodyguardForm.reset();
        },
        error: (err) => {
          console.error('Error:', err);
          if (err.status === 401) {
            this.errorMessage = 'Unauthorized. Please log in again.';
            this.router.navigate(['/login']); // ส่งกลับไปหน้า Login ถ้า Token หมดอายุ
          } else {
            this.errorMessage = 'Failed to add bodyguard. Please try again.';
          }
        }
      });
  }
}

