import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { isPlatformBrowser } from '@angular/common';

interface Manager {
  name: string;
  email: string;
  username: string;
  password: string;
  phoneNo: string;
  address: string;
  gender: string;
  dob: string;
  user_id: number;
}

@Component({
  selector: 'app-add-manager',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './add-manager.component.html',
  styleUrl: './add-manager.component.css'
})
export class AddManagerComponent implements OnInit {
  registerForm!: FormGroup;
  isLogin: boolean = false;
  errorMessage: string = '';
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // ✅ Inject PLATFORM_ID เพื่อตรวจสอบว่าอยู่ใน Browser หรือไม่
  ) {}

  ngOnInit(): void {
    this.loadUserId();
    
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: ['', [Validators.required]],
        confirmPassword: ['', Validators.required],
        phoneNo: ['', Validators.required],
        address: ['', Validators.required],
        gender: ['', Validators.required],
        dob: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  loadUserId(): void {
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        const storedUserId = localStorage.getItem('id');
        this.userId = storedUserId ? parseInt(storedUserId, 10) : null;
      }
      if (!this.userId) {
        console.warn('⚠️ No user ID found in localStorage');
      } else {
        console.log('✅ User ID loaded:', this.userId);
      }
    }, 500);
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    if (!this.userId) {
      this.errorMessage = 'User ID is missing. Please log in again.';
      console.error('❌ Error: User ID is missing!');
      return;
    }
  
    const registerData = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password,
      phoneNo: this.registerForm.value.phoneNo,
      address: this.registerForm.value.address,
      gender: this.registerForm.value.gender,
      dob: this.registerForm.value.dob,
      user_id: this.userId
    };
  
    console.log('🚀 Sending Registration Data:', JSON.stringify(registerData, null, 2));
  
    this.http.post('http://localhost:5253/api/Auth/addManager', registerData)
      .subscribe({
        next: () => {
          alert('Manager registration successful!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('❌ Error registering manager:', err);
          this.errorMessage = `Registration failed: ${err.error?.message || err.message}`;
        }
      });
  }
  

  passwordMatchValidator = (formGroup: FormGroup): void => {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
  
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  };
}
