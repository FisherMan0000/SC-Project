// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
//   imports: [
//     ReactiveFormsModule,
//     CommonModule,
//     HttpClientModule
//   ]
// })
// export class LoginComponent implements OnInit {

//   loginForm!: FormGroup;
//   registerForm!: FormGroup;
//   isLogin: boolean = true;
//   errorMessage: string = '';

//   constructor(
//     private fb: FormBuilder,
//     private http: HttpClient,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
 
//     this.loginForm = this.fb.group({
//       username: ['', Validators.required],
//       password: ['', [Validators.required]]
//     });

    
//     this.registerForm = this.fb.group(
//       {
//         name: ['', Validators.required],
//         PhoneNo: ['', Validators.required],
//         address: ['', Validators.required],
//         gender: ['', Validators.required],
//         Dob: ['', Validators.required],
//         username: ['', Validators.required],
//         password: ['', [Validators.required]],
//         confirmPassword: ['', Validators.required],
//         email: ['', [Validators.required, Validators.email]],
//       },
//       {
//         validators: this.passwordMatchValidator 
//       }
//     );
//   }

 
//   onLogin(): void {
//     if (this.loginForm.invalid) {
//       this.errorMessage = 'Please fill out the form correctly.';
//       return;
//     }

//     const loginData = this.loginForm.value;
//     this.http.post<{ token: string }>('http://localhost:5253/api/Auth/login', loginData)
//       .subscribe({
//         next: (response) => {
//           localStorage.setItem('token', response.token);
//           this.router.navigate(['/home']);
//         },
//         error: () => {
//           this.errorMessage = 'Invalid username or password.';
//         }
//       });
//   }

 
//   onRegister(): void {
//     if (this.registerForm.invalid) {
//       this.errorMessage = 'Please fill out the form correctly.';
//       return;
//     }

//     const registerData = this.registerForm.value;
//     this.http.post('http://localhost:5253/api/Auth/register', {
//       name: registerData.name,
//       PhoneNo: registerData.PhoneNo,
//       address: registerData.address,
//       gender: registerData.gender,
//       Dob: registerData.Dob,
//       username: registerData.username,
//       password: registerData.password,
//       email: registerData.email
//     }).subscribe({
//       next: () => {
//         alert('Registration successful! Please log in.');
//         this.toggleForm();
//       },
//       error: (err) => {
//         console.error(err);
//         this.errorMessage = 'Registration failed. Please try again.';
//       }
//     });
//   }

//   toggleForm(): void {
//     this.isLogin = !this.isLogin;
//     this.errorMessage = ''; 
//   }

//   passwordMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
//     const password = formGroup.get('password')?.value;
//     const confirmPassword = formGroup.get('confirmPassword')?.value;
//     return password === confirmPassword ? null : { passwordMismatch: true };
//   }
// }


import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    ReactiveFormsModule,
    CommonModule,

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
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // ✅ Inject PLATFORM_ID เพื่อตรวจสอบว่าอยู่ใน Browser หรือไม่
  ) {}

  ngOnInit(): void {
    // Login form
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]]
    });

    // Register form
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
        validators: this.passwordMatchValidator, // ✅ ใช้ฟังก์ชัน passwordMatchValidator
        updateOn: 'blur' // ✅ ตรวจสอบค่าเมื่อออกจากช่อง Input
      }
    );
    
  }

  // Login function with role checking
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }
  
    const loginData = this.loginForm.value;
  
    this.http.post<{ token: string, role: string, id: string }>(
      'http://localhost:5253/api/Auth/login',
      loginData,
      { headers: { 'Content-Type': 'application/json' } } // ✅ เพิ่ม Headers
    ).subscribe({
      next: (response) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('id', response.id);
        }
  
        if (response.role === 'Customer') {
          this.router.navigate(['/home']);
        } else if (response.role === 'Manager') {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Invalid username or password.';
      }
    });

  }

  // Register function
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

  // Password match validator
  passwordMatchValidator = (formGroup: FormGroup): void => {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
  
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true }); // ✅ ใช้ setErrors()
    } else {
      confirmPassword?.setErrors(null);
    }
  };
}
