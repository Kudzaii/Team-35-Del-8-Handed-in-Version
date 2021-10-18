/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TimesetterComponent } from './Timesetter.component';

describe('TimesetterComponent', () => {
  let component: TimesetterComponent;
  let fixture: ComponentFixture<TimesetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
