---
title: Working With tests in JavaScript
publish_date: 2022-12-04
---

I'm a huge fan of tests! I think that writing tests helps you create better and more maintainable code, and it helps to ensure that bugs are not deployed to production.

In this post I am going to introduce how tests can be written with JavaScript, some essential tools, and some tips on writing tests. These tests are written with Vitests, but many other frameworks, such as Jest, works in a very similar way.

A full example of tests in use can be found in this example repo

# The Basic Structure of a Test in JavaScript

To create a test suite, first create a *module*.test.ts file (*module* should be the name of the module to test). In this file we are going to group our tests with a `describe` function.

```javascript
describe("module", (): void => {
  // tests ...
});
```

The `describe` function takes two arguments:
1. The name of the module that is under test.
2. A factory function that decribes the test suite.

Inside the function we can create multiple tests:

```javascript
describe("module", (): void => {
  test("testname", (): void => {
    // synchronous test
  });

  test("testname", async (): Promise<void> => {
    // asynchronous test
  });
});
```

As with `describe`, the `test` function takes two arguments:
1. The name of the test.
2. A function that describes the test. This function can be both synchronous and asynchronous.

If needed, a test can be fed with a data set so that it can be ran multiple times with different input:

```javascript
describe("module", (): void => {
  test.each([
    ["any-input"],
    ["any-other-input"],
  ])("testname", (input: string): void => {
    /**
     * This test is running two times where "input" has two
     * different values of "input". The first time the value is
     * "any-input", the second time it is "any-other-input".
     */
  });
});
```

To run assertions we use the `expect` function.

```javascript
describe("module", (): void => {
  test("testname", (): void => {
    expect(2 + 2).toEqual(4);
    expect(true).toBeTruthy();
    expect(() => { throw new Error("Error!") }).toThrow();
  });
});
```

For some test cases we may need to do some work before and after all or each test. To do this we have `beforeEach`, `beforeAll`, `afterEach`, `afterAll`.

```javascript
describe("module", (): void => {
  beforeEach(() => {
    // Runs before each test
  });

  beforeAll(() => {
    // Runs before all tests
  });

  afterEach(() => {
    // Runs after each test
  });

  afterAll(() => {
    // Runs after all tests
  });
  
  test("testname", (): void => {
    // synchronous test
  });
});
```

Tests can be skipped with the `.skip` function on `test` function.

```javascript
describe("module", (): void => {
  test.skip("testname", (): void => { /* ... */ });
});
```

## A Little Reflection of What We've Seen So Far
Now that we've looked at some of the basic functionality of a testcase, here are some of my personal opinions and thougts:

### Only One describe at the Root Per Test Case
It's the same principle as that you should only have one class per file and, one React component per file, etc. Nested describe is okay, though. Sometimes nested `describe` can help one organise tests.

```javascript
// stringUtilities.test.ts

// ❌ Avoid this
desribe("dashify", (): void => {
  test("should replace whitespace with a dash", () => { /* ... */ });
  test("should replace non-alphabetic character with dash", () => { /* ... */ });
});

describe("lowercase", (): void => {
  test("should lower case the string", () => { /* ... */ });
});
```

```javascript
// stringUtilities.test.ts

// ✅ Do this
describe("stringUtilities", (): void => {
  desribe("dashify", (): void => {
    test("should replace whitespace with a dash", (): void => { /* ... */ });
    test("should replace non-alphabetic character with dash", (): void => { /* ... */ });
  });
  describe("lowercase", (): void => {
    test("should lower case the string", (): void => { /* ... */ });
  });
});
```

### Divide the Test In Arrange, Act and Assert

I recommend dividing your code into three sections: Arrange, Act and Assert. It is a very easy way to set up your test, which creates a simple overview of the test.

```javascript
describe("module", (): void => {
  test("some test", () => {
    // Arrange
    const expectedName = "Hello, World!";

    // Act
    const actualName = createGreetingsMessage("World");

    // Assert
    expect(actualName).toEqual(expectedName);
  });
});
```

### Avoid SetUp and TearDown Functions

In my opinion, setup and teardown functions are a symptom of developers trying to write their test code as they would write their production code. As developers, we tend to want to be "smart" in our code and put repetitive lines of code in one place. But this mindset can lead to frustration when writing and reviewing tests. Each test should contain exactly what the test needs. Consider the following:

```javascript
describe("person", (): void => {
  test("should compute fullname", (): void => {
    // Arrange
    const expectedFullName = "Jane Doe";
    const person: Person = createPerson({
      firstName: "Jane",
      lastName: "Doe",
      age: 30,
    });

    // Act
    const actualFullName = person.getFullName();

    // Assert
    expect(actualFullName).toEqual(expectedFullName);
  });

  test("should determine if person is an adult", () => {
    // Arrange
    const person: Person = createPerson({
      firstName: "Jane",
      lastName: "Doe",
      age: 30,
    });

    // Act
    const actualIsAdult = person.isAdult();

    // Assert
    expect(actualIsAdult).toBeTrue();
  });
});
```

Because of the repetative task of creating a person object, we could be tempted to move this to a `beforeEach` function:

```javascript
describe("person", (): void => {
  let person: Person;
  
  beforeEach(() => {
    person: Person = createPerson({
      firstName: "Jane",
      lastName: "Doe",
      age: 30,
    });
  });
  
  test("should compute fullname", (): void => {
    // Arrange
    const expectedFullName = "Jane Doe";

    // Act
    const actualFullName = person.getFullName();

    // Assert
    expect(actualFullName).toEqual(expectedFullName);
  });

  test("should determine if person is an adult", () => {
    // Act
    const actualIsAdult = person.isAdult();

    // Assert
    expect(actualIsAdult).toBeTrue();
  });
});
```

But in my opinion we've just made these tests much more harder to review.

First, the reviewer now needs to know that a `person` object exists somewhere in my file, but knows nothing of it by just looking at the test.

Secondly, we now have less control og the object since it is created outside my test. I could do something like this:

```javascript
// ...

test("should determine if person is an adult", () => {
  // Arrange
  person.age = 30;

  // Act
  const actualIsAdult = person.isAdult();

  // Assert
  expect(actualIsAdult).toBeTrue();
});

// ...
```
This ensures that the age property of the `person` variable always have the value of 30. This feels kinda awkward to me though, because I still have no idea of where the `person` variable comes from.

Thirdly, if the test case contains many tests one may have to scroll up and down in the file, causing the reader to switch context, forgetting the task at hand, and perhaps getting lost in the file.

My point is: **we should not treat the code of our tests as we do with the our production code. Keep the tests simple by having everything the test needs where the test is written and reviewed!** I'm sure that there is a case for setup and teardown functions somehow, but I have yet to find a really good one.
