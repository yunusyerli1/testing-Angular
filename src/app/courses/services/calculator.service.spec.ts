import { TestBed } from '@angular/core/testing';

import { CalculatorService } from './calculator.service';
import { LoggerService } from './logger.service';

//disable the test suite by adding x to describe (xdescribe)
//disable the spec by adding x to it (xit)
//focus the test suite by adding f to it (fdescribe - especially during debugging)
//focus the specification by adding f to it (fit - especially during debugging)

describe('CalculatorService', () => {
  // let service: CalculatorService;

  // beforeEach(() => {
  //   TestBed.configureTestingModule({});
  //   service = TestBed.inject(CalculatorService);
  // });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });

  // it('should add two numbers', () => {
  //   const logger = new LoggerService();
  //   spyOn(logger, 'log')
  //   const calculator = new CalculatorService(logger);
  //   const result = calculator.add(2,2);
  //   expect(result).toBe(4)
  //   expect(logger.log).toHaveBeenCalledTimes(1);
  // });

  let calculator: CalculatorService;
  let loggerSpy: any;

  //Dependency injection'ı testte de kullanabiliyoruz. O yuzden instance yaratmak gereksiz.
  // beforeEach(()=>{
  //   console.log("Calling beforeeach");
  //   loggerSpy = jasmine.createSpyObj('LoggerService', ["log"]);
  //   calculator = new CalculatorService(loggerSpy);
  // });

  beforeEach(()=>{
    loggerSpy = jasmine.createSpyObj('LoggerService', ["log"]);
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {provide: LoggerService, useValue: loggerSpy}
      ]
    });
    calculator = TestBed.inject(CalculatorService);
  });

  // it('should add two numbers', () => {
     //Preffered approach to provide other services as fake services not a instance of service bcz they might be expensive
     //This will help our test only if actual (CalculatorService) service fail
     //We should not inject real instances of dependencies. Use Jasmine Spy instead
     //Otherwise it wont be a unit test. It would be an integration test.
  //   const logger = jasmine.createSpyObj('LoggerService', ["log"]);
     //logger.log.and.returnValue()  log metodu value dönse idi
  //   const calculator = new CalculatorService(logger);
  //   const result = calculator.add(2,2);
  //   expect(result).toBe(4)
  //   expect(logger.log).toHaveBeenCalledTimes(1);
  // });

  it('should add two numbers', () => {
    const result = calculator.add(2,2);
    expect(result).toBe(4)
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);  // Bir kez çağrılsın.
  });

  it('should substract two numbers', () => {
    const result = calculator.subtract(2,2);
    expect(result).toBe(0)
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
