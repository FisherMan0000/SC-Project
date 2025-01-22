import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // นำเข้า HttpClient และ HttpClientModule
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true, // ใช้ Standalone Component
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    HttpClientModule, // เพิ่ม HttpClientModule
    ReactiveFormsModule,
    CommonModule
  ]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]]
    });
  }

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
}
