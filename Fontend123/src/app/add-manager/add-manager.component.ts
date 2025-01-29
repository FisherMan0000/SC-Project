import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-add-manager',
  templateUrl: './add-manager.component.html',
  styleUrls: ['./add-manager.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, SidebarComponent]
})
export class addManagerComponent implements OnInit {
  registerForm!: FormGroup;
  isLogin: boolean = true;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {


    // Initialize registration form
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: ['', [Validators.required]],
        confirmPassword: ['', Validators.required],
        PhoneNo: ['', Validators.required],
        address: ['', Validators.required],
        gender: ['', Validators.required],
        Dob: ['', Validators.required],
        Role: ['Manager']
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    const registerData = this.registerForm.value;
    this.http.post('http://localhost:5253/api/Auth/addManager', registerData)
      .subscribe({
        next: () => {
          alert('Registration successful! Please log in.');
          this.toggleForm();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Registration failed. Please try again.';
        }
      });
  }

  toggleForm(): void {
    this.isLogin = !this.isLogin;
    this.errorMessage = ''; 
  }

  passwordMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
