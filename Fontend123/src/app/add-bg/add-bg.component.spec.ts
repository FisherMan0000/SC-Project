import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBGComponent } from './add-bg.component';

describe('AddBGComponent', () => {
  let component: AddBGComponent;
  let fixture: ComponentFixture<AddBGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBGComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
