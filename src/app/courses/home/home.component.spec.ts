import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick, waitForAsync} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';


//Use waitForAsync if the test require HTTP request otherwise use fakeAsync for asyncrize tests

describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component:HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses().filter(course => course.category == 'BEGINNER');
  const advancedCourses = setupCourses().filter(course => course.category == 'ADVANCED');

  beforeEach(waitForAsync((() => {
    const coursesServiceSpy = jasmine.createSpyObj("CoursesService", ['findAllCourses']);
    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule //There is an animation here. instead of BrowserAnimationsModule we put this. Dont import animation but show animations
      ],
      providers: [{provide: CoursesService, useValue: coursesServiceSpy}]
    }).compileComponents()
      .then(()=> {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      })

  })));

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display only beginner courses", () => {

    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found")
  });


  it("should display only advanced courses", () => {

    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found")

  });


  it("should display both tabs", () => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(2, "Unexpected number of tabs found")

  });

//"done" is Jasmine specific callback for async tasks. When adding done, Jasmine wont immediately consider test finishes after it completes test spec.
// Jasmine will consider test finishing after calling done function
  it("should display advanced courses when tab clicked - fakeAsync", fakeAsync(() => {
    // This would be asynchrous testing (Browser async API - settimeout setInterval requestAnimationFrame)
    //This is a smart/container component testing.
    // This is how it is tested the component with async service
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    //el.nativeElement.click()
    click(tabs[1]);
    fixture.detectChanges();
    //tick(16);
    flush();
    const cardTitles = el.queryAll(By.css('.mat-card-title'));
    expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');
    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Testing Course');

  }));

  it("should display advanced courses when tab clicked - async", waitForAsync(() => {
    //This is not convenient as fakeAsync. Prefer fakeAsync
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    //el.nativeElement.click()
    click(tabs[1]);
    fixture.detectChanges();
    fixture.whenStable().then(()=> {
      console.log("called whenstabled")
      const cardTitles = el.queryAll(By.css('.mat-card-title'));
      expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');
      expect(cardTitles[0].nativeElement.textContent).toContain('Angular Testing Course');
    });


  }));

});


