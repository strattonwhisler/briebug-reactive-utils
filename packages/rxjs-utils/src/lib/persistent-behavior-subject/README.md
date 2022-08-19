# Persistent Behavior Subject (PBS)

## Overview

The PBS class is designed to automatically store the value of a BehaviorSubject into either localStorage, or another specified location. Also acts as an "onWrite" trigger.

## Planned Improvements

Adding in specific support for indexDB, ionicStorage, memoryBase, and cookie

## Recent Jest Test Results

```text
 PASS   rxjs-utils  ./persistent-behavior-subject.spec.ts
  A PersistentBehaviorSubject
    with only a value provided
      √ should save to localStorage as PBS-{{DTS}} (4 ms)
      √ should detect updates (1 ms)
    with a value and name provided
      √ should save to localStorage as the name provided
    with a value and custom options provided
      √ should execute the custom write function on call
      √ should execute the custom delete function on call
      √ should not execute the default localStorage call (1 ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        3.174 s
Ran all test suites matching /persistent-behavior-subject.spec.ts/i.
```
