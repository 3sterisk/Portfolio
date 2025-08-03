import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCompoenent } from './home.compoenent';

describe('HomeCompoenent', () => {
  let component: HomeCompoenent;
  let fixture: ComponentFixture<HomeCompoenent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeCompoenent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCompoenent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
