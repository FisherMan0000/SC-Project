import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BginfosComponent } from './bginfos.component';

describe('BginfosComponent', () => {
  let component: BginfosComponent;
  let fixture: ComponentFixture<BginfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BginfosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BginfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
