---
id: test-renderer
title: Test Renderer
permalink: docs/test-renderer.html
layout: docs
category: Reference
---

**الاستيراد**

```javascript
import TestRenderer from 'react-test-renderer'; // ES6
const TestRenderer = require('react-test-renderer'); // ES5 with npm
```

## لمحة عامة {#overview}

تُزوّدنا هذه الحزمة بمُصيِّر React يُمكِن استخدامه لتصيير مكوّنات React إلى كائنات JavaScript نقيّة بدون الاعتماد على DOM أو بيئة الهاتف المحمول الأصليّة.

تُسهِّل هذه الحزمة بشكل أساسي من أخذ صورة حول التسلسل الهرمي للمكوّنات (مشابه لشجرة DOM) والتي يُصيّرها React DOM أو React Native بدون استخدام المتصفح أو [jsdom](https://github.com/tmpvar/jsdom).

مثال:

```javascript
import TestRenderer from 'react-test-renderer';

function Link(props) {
  return <a href={props.page}>{props.children}</a>;
}

const testRenderer = TestRenderer.create(
  <Link page="https://www.facebook.com/">Facebook</Link>
);

console.log(testRenderer.toJSON());
// { type: 'a',
//   props: { href: 'https://www.facebook.com/' },
//   children: [ 'Facebook' ] }
```

نستطيع استخدام ميزة الاختبار بالتقاط الصورة الموجودة في Jest لحفظ نسخة عن شجرة JSON بشكل تلقائي إلى ملف والتحقق في اختباراتك من أنّها لم تتغيّر. [تعلّم المزيد حول ذلك](https://jestjs.io/docs/en/snapshot-testing).

بإمكانك أيضًا التنقل في الناتج لإيجاد عقد محددة:

```javascript
import TestRenderer from 'react-test-renderer';

function MyComponent() {
  return (
    <div>
      <SubComponent foo="bar" />
      <p className="my">Hello</p>
    </div>
  )
}

function SubComponent() {
  return (
    <p className="sub">Sub</p>
  );
}

const testRenderer = TestRenderer.create(<MyComponent />);
const testInstance = testRenderer.root;

expect(testInstance.findByType(SubComponent).props.foo).toBe('bar');
expect(testInstance.findByProps({className: "sub"}).children).toEqual(['Sub']);
```

### TestRenderer {#testrenderer}

* [`()TestRenderer.create`](#testrenderercreate)

### TestRenderer instance {#testrenderer-instance}

* [`()testRenderer.toJSON`](#testrenderertojson)
* [`()testRenderer.toTree`](#testrenderertotree)
* [`()testRenderer.update`](#testrendererupdate)
* [`()testRenderer.unmount`](#testrendererunmount)
* [`()testRenderer.getInstance`](#testrenderergetinstance)
* [`testRenderer.root`](#testrendererroot)

### TestInstance {#testinstance}

* [`()testInstance.find`](#testinstancefind)
* [`()testInstance.findByType`](#testinstancefindbytype)
* [`()testInstance.findByProps`](#testinstancefindbyprops)
* [`()testInstance.findAll`](#testinstancefindall)
* [`()testInstance.findAllByType`](#testinstancefindallbytype)
* [`()testInstance.findAllByProps`](#testinstancefindallbyprops)
* [`testInstance.instance`](#testinstanceinstance)
* [`testInstance.type`](#testinstancetype)
* [`testInstance.props`](#testinstanceprops)
* [`testInstance.parent`](#testinstanceparent)
* [`testInstance.children`](#testinstancechildren)

## مرجع {#reference}

### `()TestRenderer.create` {#testrenderercreate}

```javascript
TestRenderer.create(element, options);
```

إنشاء نسخة من `TestRenderer` مع عنصر React المُمرَّر. لا يستخدم هذا التابع DOM الحقيقي ولكنّه يُصيِّر بشكل كامل شجرة المكوّنات في الذاكرة. تملك النسخة المُعادة التوابع والخاصيّات التالية.

### `()testRenderer.toJSON` {#testrenderertojson}

```javascript
testRenderer.toJSON()
```

ن يُمثِّل الشجرة المُصيَّرة. تحتوي هذه الشجرة على عُقَد خاصّة بالمنصّة مثل `<div>` ن يُمثِّل الشجرة المُصيَّرة. تحتوي هذه الشجرة على عُقَد خاصّة بالمنصّة مثل `<View>` وخاصيّاتها، ولكنّه لا يحتوي على مكوّنات مكتوبة من قبل المستخدم. يُفيد هذا لأجل[اختبار اللقطات (snapshot testing)](https://facebook.github.io/jest/docs/en/snapshot-testing.html#snapshot-testing-with-jest).

### `()testRenderer.toTree` {#testrenderertotree}

```javascript
testRenderer.toTree()
```

يُعيد كائن يُمثِّل الشجرة المُصيَّرة. وعلى النقيض من التابع `toJSON()`‎ يكون التمثيل أكثر تفصيلًا ويتضمّن المكوّنات المكتوبة من قبل المستخدم. لن تحتاج هذا التابع غالبًا إلّا إذا كنت تكتب مكتبتك الخاصّة بناءً على مُصيِّر الاختبار.

### `()testRenderer.update` {#testrendererupdate}

```javascript
testRenderer.update(element)
```

يُعيد تصيير الشجرة في الذاكرة مع عنصر جذري جديد. يُحاكي هذا تحديث React الذي يطرأ على العنصر الجذري. إن كان للعنصر الجديد نفس النوع والمفتاح للعنصر السابق فستُحدَّث الشجرة، وفيما عدا ذلك سيُعيد وصل شجرة جديدة.

### `()testRenderer.unmount` {#testrendererunmount}

```javascript
testRenderer.unmount()
```

يفصل الشجرة الموجودة في الذاكرة، وبذلك يُطلِق أحداث دورة الحياة المناسبة.

### `()testRenderer.getInstance` {#testrenderergetinstance}

```javascript
testRenderer.getInstance()
```

يُعيد النسخة الموافقة للعنصر الجذري إن كانت موجودة. لن يعمل هذا التابع إن كان العنصر الجذري عبارة عن مكوّن دالة لأنّها لا تمتلك نُسَخًا مثل مكوّنات الأصناف.

### `testRenderer.root` {#testrendererroot}

```javascript
testRenderer.root
```

يُعيد نسخة الاختبار للكائن الجذري والتي تفيد في إجراء استعلامات حول عقد مُحدَّدة في شجرة المكوّنات. بإمكانك استخدامه لإيجاد نُسَخ الاختبار الأخرى الموجودة في مستويات أدنى من الشجرة.

### `()testInstance.find` {#testinstancefind}

```javascript
testInstance.find(test)
```

إيجاد نسخة الاختبار الوحيدة المنحدرة التي يُعيد فيها التابع `test(testInstance)‎` القيمة `true`. إن كان التابع `test(testInstance)‎`‎ لا يُعيد القيمة `true` لنسخة اختبار وحيدة بالضبط فسيرمي هذا التابع خطأً.

### `()testInstance.findByType` {#testinstancefindbytype}

```javascript
testInstance.findByType(type)
```

إيجاد نسخة اختبار وحيدة منحدرة من النوع المُعطى ضمن الوسيط `type`. إن لم يكن هنالك بالضبط نسخة اختبار وحيدة فسيرمي هذا التابع خطأً.

### `()testInstance.findByProps` {#testinstancefindbyprops}

```javascript
testInstance.findByProps(props)
```

إيجاد نسخة اختبار وحيدة منحدرة التي تمتلك الخاصيّات المُزوَّدة عن طريق الوسيط `props`. إن لم يكن هنالك بالضبط نسخة اختبار وحيدة تمتلك الخاصيّات المطلوبة فسيرمي هذا التابع خطأً.

### `()testInstance.findAll` {#testinstancefindall}

```javascript
testInstance.findAll(test)
```

إيجاد جميع نسخ الاختبار المنحدرة والتي يُعيد فيها التابع `test(testInstance)` القيمة `true`.

### `()testInstance.findAllByType` {#testinstancefindallbytype}

```javascript
testInstance.findAllByType(type)
```

إيجاد جميع نسخ الاختبار المنحدرة التي تمتلك النوع `type`.

### `testInstance.findAllByProps()` {#testinstancefindallbyprops}

```javascript
testInstance.findAllByProps(props)
```

إيجاد جميع نسخ الاختبار المنحدرة التي تمتلك الخاصيّات `props`.

### `testInstance.instance` {#testinstanceinstance}

```javascript
testInstance.instance
```

نسخة المكوّن المطابقة لنسخة الاختبار هذه. متوفّر فقط من أجل مكوّنات الأصناف، بسبب عدم امتلاك مكوّنات الدوال للنسخ. يُطابِق قيمة `this` بداخل المكوّن المُعطى.

### `testInstance.type` {#testinstancetype}

```javascript
testInstance.type
```

نوع المكوّن المُطابِق لنسخة الاختبار هذه. على سبيل المثال يمتلك المكوّن `<Button />` النوع `Button`.

### `testInstance.props` {#testinstanceprops}

```javascript
testInstance.props
```

الخاصيّات المطابقة لنسخة الاختبار هذه. على سبيل المثال يمتلك المكوّن `<Button size="small" />` الخاصيّة `{size: 'small'}` as props.

### `testInstance.parent` {#testinstanceparent}

```javascript
testInstance.parent
```

نسخة الاختبار الأب لنسخة الاختبار هذه.

### `testInstance.children` {#testinstancechildren}

```javascript
testInstance.children
```

نسخة الاختبار الابن لنسخة الاختبار هذه.

## بعض الأفكار {#ideas}

بإمكانك تمرير الدالة `createNodeMock` إلى التابع `TestRenderer.create` كخيار، والذي يسمح بالمراجع المخصصة للمحاكاة. يقبل `createNodeMock` العنصر الحالي ويجب أن يُعيد كائن مرجع محاكي. يفيد هذا عند اختبار المكوّنات التي تعتمد على المراجع:

```javascript
import TestRenderer from 'react-test-renderer';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.input = null;
  }
  componentDidMount() {
    this.input.focus();
  }
  render() {
    return <input type="text" ref={el => this.input = el} />
  }
}

let focused = false;
TestRenderer.create(
  <MyComponent />,
  {
    createNodeMock: (element) => {
      if (element.type === 'input') {
        // mock a focus function
        return {
          focus: () => {
            focused = true;
          }
        };
      }
      return null;
    }
  }
);
expect(focused).toBe(true);
```
