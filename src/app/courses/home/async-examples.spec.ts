import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs/internal/observable/of";
import { delay } from "rxjs/internal/operators/delay";

describe('Async Testing Examples', () => {
  //done() method is not suitable for complex compoentns such as lots of Ajax requests.
  it("Async test example with Jasmine done()", (done:DoneFn)=> {
    let test = false;
    setTimeout(()=> {
      console.log("running assertion");
      test = true;
      expect(test).toBeTruthy();
      done();
    },1000)
  })

  it("Async test example - setTimeOut()-1", fakeAsync(()=> {
    //fakeASsync can detect many setTimeouts
    let test = false;
    setTimeout(()=> {
      console.log("running assertion Settimeout");
      test = true;
    },1000);
    tick(1000);        //tick API can only be called inside fakeAsymc method
    expect(test).toBeTruthy();
  }))

  it("Async test example - setTimeOut()-2", fakeAsync(()=> {
    //fakeASsync can detect many setTimeouts
    let test = false;
    setTimeout(()=> {})
    setTimeout(()=> {
      console.log("running assertion Settimeout");
      test = true;
    },1000);
    flush();       //instead of tick API and setting time we can declare flush here
    expect(test).toBeTruthy();
  }))

  //Promise is a micro task. SetTimeout is a macro task.
  //Browser has 2 queue. One of micro tasks and other for tasks.

  it("Async test example - Plain Promise", fakeAsync(()=> {
    let test = false;
    console.log("Creating promise");
    Promise.resolve().then(()=> {
      console.log("Promise first then() evaluated successfully")
      return Promise.resolve();
    }).then(()=> {
      console.log("Promise second then() evaluated successfully")
      test = true;
    })
    flushMicrotasks();
    console.log("running test assertion")
    expect(test).toBeTruthy();
  }))

  it("Async test example - Promise + SetTimeout()", fakeAsync( ()=> {
    let counter = 0;
    console.log("Creating promise");
    Promise.resolve().then(()=> {
      counter+=10;
      setTimeout(()=> {
        counter+=1;
      },1000)
    });
    expect(counter).toBe(0);
    flushMicrotasks();
    expect(counter).toBe(10);
    tick(500);
    expect(counter).toBe(10);
    tick(500);
    expect(counter).toBe(11);
  }))

  it("Async test example - Observables", fakeAsync( ()=> {
    let test = false;
    console.log("Creating Observables");
    const test$ = of(test).pipe(delay(1000));
    test$.subscribe(() => {
      test=true;
    })
    tick(1000)
    console.log("Running test assertion obs");
    expect(test).toBe(true);
  }))

})
