import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HireguardComponent } from './hireguard.component';

describe('HireguardComponent', () => {
  let component: HireguardComponent;
  let fixture: ComponentFixture<HireguardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HireguardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HireguardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
