import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareTestComponent } from './share-test.component';

describe('ShareTestComponent', () => {
  let component: ShareTestComponent;
  let fixture: ComponentFixture<ShareTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
