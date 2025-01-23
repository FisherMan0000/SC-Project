import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule
  ]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  registerForm!: FormGroup;
  isLogin: boolean = true;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ฟอร์ม Login
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]]
    });

    // ฟอร์ม Register
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        PhoneNo: ['', Validators.required],
        address: ['', Validators.required],
        gender: ['', Validators.required],
        Dob: ['', Validators.required],
        username: ['', Validators.required],
        password: ['', [Validators.required]],
        confirmPassword: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      },
      {
        validators: this.passwordMatchValidator // เพิ่ม Validator ระดับฟอร์ม
      }
    );
  }

  // ฟังก์ชัน Login
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    const loginData = this.loginForm.value;
    this.http.post<{ token: string }>('http://localhost:5253/api/Auth/login', loginData)
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/home']);
        },
        error: () => {
          this.errorMessage = 'Invalid username or password.';
        }
      });
  }

  // ฟังก์ชัน Register
  onRegister(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    const registerData = this.registerForm.value;
    this.http.post('http://localhost:5253/api/Auth/register', {
      name: registerData.name,
      PhoneNo: registerData.PhoneNo,
      address: registerData.address,
      gender: registerData.gender,
      Dob: registerData.Dob,
      username: registerData.username,
      password: registerData.password,
      email: registerData.email
    }).subscribe({
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
