/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Types_landingComponent } from './Types_landing.component';

describe('Types_landingComponent', () => {
  let component: Types_landingComponent;
  let fixture: ComponentFixture<Types_landingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Types_landingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Types_landingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
