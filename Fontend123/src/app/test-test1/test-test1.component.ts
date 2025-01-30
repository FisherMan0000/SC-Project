// import { Component, OnInit } from '@angular/core';
// import { SidebarComponent } from "../sidebar/sidebar.component";
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-test-test1',
//   standalone: true,
//   imports: [SidebarComponent],
//   templateUrl: './test-test1.component.html',
//   styleUrl: './test-test1.component.css'
// })
// export class TestTest1Component implements OnInit {
//   guards: any[] = [];
//     errorMessage: string = '';
  
//     constructor(private http: HttpClient) {}
  
//     ngOnInit(): void {
//       this.getAllGuards();
//     }
  
//     getAllGuards(): void {
//       this.http.get<any[]>('http://localhost:5253/api/Guard').subscribe({
//         next: (data) => {
//           console.log('API Response:', data); // ✅ ตรวจสอบข้อมูลที่ได้รับ
//           this.guards = data;
//         },
//         error: (err) => {
//           console.error('Error fetching guards:', err);
//           this.errorMessage = 'Failed to load guards.';
//         }
//       });
//     }

// }
