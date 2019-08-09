---
title: React Element Factories and JSX Warning
layout: single
permalink: warnings/legacy-factories.html
---

أنت على الأرجح هُنا لأن الشيفرة "code" خاصّتك تستدعِ مُكوّنك كدالّة مُجرّدة. تم إزالة ذلك:

```javascript
var MyComponent = require('MyComponent');

function render() {
  return MyComponent({ foo: 'bar' });  // WARNING
}
```

## JSX {#jsx}

لم تَعُد مُكوّنات React قابلة للإستدعاء مُباشرةً. عوضًا عن ذلك، [يُمكنك استخدام JSX](/docs/jsx-in-depth.html).

```javascript
var React = require('react');
var MyComponent = require('MyComponent');

function render() {
  return <MyComponent foo="bar" />;
}
```

## بدون JSX {#without-jsx}

إن كُنت لا تريد ، او لا تستطيع استخدام JSX فعليك بتغليف المُكوّن خاصّتك بِمَنصع "factory" قبل استدعائه:

```javascript
var React = require('react');
var MyComponent = React.createFactory(require('MyComponent'));

function render() {
  return MyComponent({ foo: 'bar' });
}
```

يكون ذلك طريق تحديث سهل إن كان لديك الكثير من استدعائات الدوال.

## مُكوّنات ديناميكية بدون JSX {#dynamic-components-without-jsx}

اذا حصلت على مُكون صنف من مصدر ديناميكي فَمن المُمكن الّا يكون من الضروري انشاء مصنع  تستدعيه مُباشرة. بدلًا من ذلك ُيُمكنك انشاء العنصر خاصّتك مُباشرة "inline":

```javascript
var React = require('react');

function render(MyComponent) {
  return React.createElement(MyComponent, { foo: 'bar' });
}
```

## بالتفصيل {#in-depth}

[اقرأ المزيد عن سبب عملنا لهذا التغيير.](https://gist.github.com/sebmarkbage/d7bce729f38730399d28)
