---
title: Dependency Injection With React And How It Can Greatly Affect Your Code Quality
publish_date: 0000-00-00
---

I'm going to assume that you already know about how dependency injection in general works. In this post I'm going to show you how dependency injection can be achieved with React and how it can benefit the quality of your code.

Consider the following example where we want to create a component that lists a set of users. One way of doing this could be to write the component like this:

```javascript
// Examples of component with fetch.
```

As a starting point, the above example is a great way to achieve our goal. But let's say that we want to write unit tests for our component. With Jest and React Testing Library that one could look like this:

```javascript
// Examples of component test.
```

Let's run the test.

Looks good! But now that we're at it - why not expand our component? Let's say we want to show a message when no users we're found. I'm a huge fan of TDD so let's write a test first:

```javascript
// New test
```

But while writing this test we realize something: *How are we going to make the fetch call inside our component return an empty list? We have no control over the external service. That's a bummer!* 

A quick search on Google for "jest fetch" shows us that we could either use an NPM package or override the global.fetch function. That seems like a lot of work to achieve somehing simple. Therefore I'm going to show you a very simple way that enables us to manipulate our component to our liking. This can be done using dependency injection with useContext.

