/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExitWavierComponent } from './exit-wavier.component';

describe('ExitWavierComponent', () => {
  let component: ExitWavierComponent;
  let fixture: ComponentFixture<ExitWavierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExitWavierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitWavierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
