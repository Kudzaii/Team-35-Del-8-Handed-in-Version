/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MySessionsComponent } from './MySessions.component';

describe('MySessionsComponent', () => {
  let component: MySessionsComponent;
  let fixture: ComponentFixture<MySessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
