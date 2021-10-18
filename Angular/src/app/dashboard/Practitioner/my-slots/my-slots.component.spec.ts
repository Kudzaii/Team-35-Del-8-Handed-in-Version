/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MySlotsComponent } from './my-slots.component';

describe('MySlotsComponent', () => {
  let component: MySlotsComponent;
  let fixture: ComponentFixture<MySlotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySlotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
