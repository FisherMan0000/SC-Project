import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTest1Component } from './test-test1.component';

describe('TestTest1Component', () => {
  let component: TestTest1Component;
  let fixture: ComponentFixture<TestTest1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestTest1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestTest1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
