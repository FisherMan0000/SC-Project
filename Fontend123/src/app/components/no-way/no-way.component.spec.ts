import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoWayComponent } from './no-way.component';

describe('NoWayComponent', () => {
  let component: NoWayComponent;
  let fixture: ComponentFixture<NoWayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoWayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoWayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
