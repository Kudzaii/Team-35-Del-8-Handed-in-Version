/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExitWaversComponent } from './Exit-wavers.component';

describe('ExitWaversComponent', () => {
  let component: ExitWaversComponent;
  let fixture: ComponentFixture<ExitWaversComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExitWaversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitWaversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
