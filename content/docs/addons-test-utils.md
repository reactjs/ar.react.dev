---
id: test-utils
title: Test Utilities
permalink: docs/test-utils.html
layout: docs
category: Reference
---

**استيراد الأدوات**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 with npm
```

## Overview {#overview}

تزيد أدوات الاختبار `ReactTestUtils` من سهولة اختبار مكوّنات React في إطار عمل الاختبار الذي تريده. يستخدم Facebook الأداة. [Jest](https://facebook.github.io/jest/) اختبار JavaScript بسهولة. تعلم كيفية البدء مع Jest عبر درس [React درس](https://jestjs.io/docs/tutorial-react) في موقع Jest..

> ملاحظة:
>
> هنالك أداة تُدعى [React Testing Library](https://testing-library.com/react) نوصي باستعمالها، إذ صُمِّمَت لتمكين وتشجيع كتابة اختبارات لاستخدامها مع مكوّناتك بينما يستخدمها المستخدم النهائي.
>
> أطلقت Airbnb أداة اختبار تُدعى [Enzyme](https://airbnb.io/enzyme/), والتي تجعل من السهل التعامل مع ناتج مكوّناتك. إن قرّرت استخدام أداة اختبار أخرى مع Jest فقد تستحق تجربتها

 - [`()act`](#act)
 - [`()mockComponent`](#mockcomponent)
 - [`()isElement`](#iselement)
 - [`()isElementOfType`](#iselementoftype)
 - [`()isDOMComponent`](#isdomcomponent)
 - [`()isCompositeComponent`](#iscompositecomponent)
 - [`()isCompositeComponentWithType`](#iscompositecomponentwithtype)
 - [`()findAllInRenderedTree`](#findallinrenderedtree)
 - [`()scryRenderedDOMComponentsWithClass`](#scryrendereddomcomponentswithclass)
 - [`()findRenderedDOMComponentWithClass`](#findrendereddomcomponentwithclass)
 - [`()scryRenderedDOMComponentsWithTag`](#scryrendereddomcomponentswithtag)
 - [`()findRenderedDOMComponentWithTag`](#findrendereddomcomponentwithtag)
 - [`()scryRenderedComponentsWithType`](#scryrenderedcomponentswithtype)
 - [`()findRenderedComponentWithType`](#findrenderedcomponentwithtype)
 - [`()renderIntoDocument`](#renderintodocument)
 - [`Simulate`](#simulate)

## مرجع {#reference}

### `()act` {#act}

إن أردت تحضير مكون لإجراء عمليات اختبار عليه، فغلِّف الشيفرة التي تصيّره ونفِّذ التحديثات داخل الاستدعاء `act()‎`. يؤدي ذلك إلى تنفيذ عمليات الاختبار بشكل مشابه لكيفية عمل React في المتصفح.

>ملاحظة
>
>إن كنت تستعمل `react-test-renderer`، فإنَّها توفر التصدير `act` الذي يسلك نفس السلوك.

على سبيل المثال، ليكن لدينا المكون `Counter` التالي:

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }
  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }
  handleClick() {
    this.setState(state => ({
      count: state.count + 1,
    }));
  }
  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={this.handleClick}>
          Click me
        </button>
      </div>
    );
  }
}
```

إليك كيف يمكن اختباره:

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // Test first render and componentDidMount
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // Test second render and componentDidUpdate
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

لا تنسَ أنَّ إرسال أحداث DOM يعمل عند إضافة حاوية DOM إلى `document` فقط. تستطيع استعمال مساعد مثل [`react-testing-library`](https://github.com/kentcdodds/react-testing-library) لتقليل الشيفرة المتداولة (boilerplate code).

* * *

### `()mockComponent` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

تمرير وحدة المكوّن المحاكي إلى هذا التابع لتزويد المكوّن بتوابع مفيدة، فبدلًا من التصيير الاعتيادي سيصبح المكوّن عنصر `div` بسيط (أو أي عنصر آخر ندخله ضمن الوسيط `mockTagName`) يحتوي على أي مكوّن ابن نعطيه له.

> ملاحظة:
>
> `()mockComponent` هي واجهة برمجة تطبيق قديمة. نوصي باستخدام التصيير السطحي أو [التصيير السطحي](/docs/shallow-renderer.html) أو [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock) بدلًا من ذلك.

* * *

### `()isElement` {#iselement}

```javascript
isElement(element)
```

يُعيد القيمة `true` إن كان الوسيط `element` عبارة عن عنصر React.

* * *

### `()isElementOfType` {#iselementoftype}

```javascript
isElementOfType(
  element,
  componentClass
)
```

يُعيد القيمة `true` إن كان الوسيط `element` عبارة عن عنصر React نوعه هو `componentClass`.

* * *

### `()isDOMComponent` {#isdomcomponent}

```javascript
isDOMComponent(instance)
```

يُعيد القيمة `true` إن كان الوسيط `instance` هو مكوّن DOM (مثل `div` أو `span`).

* * *

### `()isCompositeComponent` {#iscompositecomponent}

```javascript
isCompositeComponent(instance)
```

يُعيد القيمة `true` إن كان الوسيط `instance` عبارة عن مكوّن مُعرَّف من قبل المستخدم كالأصناف أو الدوال.

* * *

### `()isCompositeComponentWithType` {#iscompositecomponentwithtype}

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

يُعيد القيمة `true` إن كان الوسيط `instance` عبارة عن مكوّن من النوع `componentClass`.

* * *

### `()findAllInRenderedTree` {#findallinrenderedtree}

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

التنقل عبر مكوّنات شجرة المكوّنات وجمع كل المكوّنات حيث يكون test(component)‎ قيمته `true`. لا يكون هذا مفيدًا بحد ذاته ولكنّه يُستخدَم كبداية لأدوات اختبار أخرى.

* * *

### `()scryRenderedDOMComponentsWithClass` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

إيجاد جميع مكوّنات عناصر DOM في الشجرة المُصيَّرة والتي هي مكوّنات DOM لها اسم صنف يُطابِق المذكور في الوسيط `className`.

* * *

### `()findRenderedDOMComponentWithClass` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

مثل  [`()scryRenderedDOMComponentsWithClass`](#scryrendereddomcomponentswithclass)  ولكن يتوقّع وجود نتيجة واحدة، ويُعيد تلك النتيجة، أو يرمي استثناء إن كان عدد المكوّنات المطابقة أكثر من واحد.

* * *

### `()scryRenderedDOMComponentsWithTag` {#scryrendereddomcomponentswithtag}

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

إيجاد جميع مكوّنات عناصر DOM في الشجرة المُصيَّرة والتي هي مكوّنات DOM لها اسم للوسم يُطابِق المذكور في الوسيط `tagName`.

* * *

### `()findRenderedDOMComponentWithTag` {#findrendereddomcomponentwithtag}

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

مثل [`()scryRenderedDOMComponentsWithTag`](#scryrendereddomcomponentswithtag) , ولكن يتوقّع وجود نتيجة واحدة، ويُعيد تلك النتيجة، أو يرمي استثناء إن كان عدد المكوّنات المطابقة أكثر من واحد.

* * *

### `()scryRenderedComponentsWithType` {#scryrenderedcomponentswithtype}

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

إيجاد جميع نسخ المكوّنات التي نوعها يُساوي `componentClass`.

* * *

### `()findRenderedComponentWithType` {#findrenderedcomponentwithtype}

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

مثل [`()scryRenderedComponentsWithType`](#scryrenderedcomponentswithtype) ولكن يتوقّع وجود نتيجة واحدة، ويُعيد تلك النتيجة، أو يرمي استثناء إن كان عدد المكوّنات المطابقة أكثر من واحد.

***

### `()renderIntoDocument` {#renderintodocument}

```javascript
renderIntoDocument(element)
```

تصيير عنصر React في عقدة DOM منفصلة في المستند. تتطلّب هذه الدالة قابلية الوصول إلى DOM.

```js
const domContainer = document.createElement('div');
ReactDOM.render(element, domContainer);
```

> ملاحظة:
>
> تحتاج إلى أن تكون `window`، و `window.document`، و `window.document.createElement` متوفرة لديك بشكل عام (global) قبل استيراد React، وإلّا ستعتقد React أنّها لا تستطيع الوصول إلى DOM ولن تعمل توابع مثل `setState`.

* * *

## أدوات أخرى {#other-utilities}

### `Simulate` {#simulate}

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

محاكاة حدث في عقدة DOM مع خيار إضافي لبيانات الأحداث `eventData`.

تمتلك الأداة `Simulate` تابعًا [لكل حدث تفهمه React](/docs/events.html#supported-events).

**الضغط على عنصر:**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**تغيير القيمة لحقل الإدخال ثمّ الضغط على `ENTER`:**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'giraffe';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> ملاحظة
>
> يجب عليك تزويد أي خاصيّة حدث تستخدمها في مكوّنك (مثل `KeyCode`، و `Which`، إلخ...) لأنّ React لا تُنشِئ أي من هذه الخاصيّات لأجلك.

* * *
