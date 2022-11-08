import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';


//This is a presential/dummy component testing.
//This is all Synchronize testing.
// This is how it is tested the component with @Input

describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  // fixture is a test utility type that will help us to do some common test operations such as getting instance of component or debugging componont etc.
  let el: DebugElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule]
    })
    .compileComponents()  //We need to compile the component after imports. This is ayscronys process. So we need to use then method.
    .then( () => {
      fixture = TestBed.createComponent(CoursesCardListComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement; // This will allow us to query the DOM
    });
  }));

  it("should create the component", () => {
   expect(component).toBeTruthy();
  });


  it("should display the course list", () => {
    // Synchronously angular testing
    component.courses = setupCourses();
    fixture.detectChanges(); // We manually trigger change detection mechanism otherwise it wont detect changes and test fail
    //How to debug component (Test Debugging)
    //console.log(el.nativeElement.outerHTML);
    //By is test utility that predicate depending on DOM element matches certain condition. Returns true or false
    const cards = el.queryAll(By.css(".course-card"));
    expect(cards).toBeTruthy("Could not find courses")
    expect(cards.length).toBe(12, "Unexpepcted number of courses")
  });


  it("should display the first course", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    const course = component.courses[0];
    const card = el.query(By.css(".course-card:first-child"));
    const title = card.query(By.css("mat-card-title"));
    const image = card.query(By.css("img"));
    expect(card).toBeTruthy("Coulnt find course card");
    expect(title.nativeElement.textContent).toBe(course.titles.description);
    expect(image.nativeElement.src).toBe(course.iconUrl);

  });


});


