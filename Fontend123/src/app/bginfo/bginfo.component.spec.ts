import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BGinfoComponent } from './bginfo.component';

describe('BGinfoComponent', () => {
  let component: BGinfoComponent;
  let fixture: ComponentFixture<BGinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BGinfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BGinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
