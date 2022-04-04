---
id: react-dom
title: الكائن ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

<<<<<<< HEAD
إن حمّلت React عن طريق العنصر ‎`<script>‎ `فستكون هذه الواجهة ذات المستوى الأعلى متوفرة عبر الكائن العام React. وإن استخدمت ES6 مع npm فتستطيع كتابة ‎`import React from 'react'`‎. إن استخدمت ES5 مع npm فتستطيع كتابة ‎`var React = require('react')`‎.
=======
The `react-dom` package provides DOM-specific methods that can be used at the top level of your app and as an escape hatch to get outside the React model if you need to.

```js
import * as ReactDOM from 'react-dom';
```

If you use ES5 with npm, you can write:

```js
var ReactDOM = require('react-dom');
```

The `react-dom` package also provides modules specific to client and server apps:
- [`react-dom/client`](/docs/react-dom-client.html)
- [`react-dom/server`](/docs/react-dom-server.html)
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

## لمحة عامة {#overview}

<<<<<<< HEAD
تُزوِّدنا الحزمة `react-dom` بتوابع خاصّة بـ DOM والتي يُمكِن استخدامها في المستوى الأعلى من تطبيقك وكوسيلة هروب للخروج من نموذج React إن أردت ذلك. ينبغي ألّا تحتاج معظم مكوّناتك إلى استخدام هذه الوحدة.

- [`()render`](#render)
- [`()hydrate`](#hydrate)
- [`()unmountComponentAtNode`](#unmountcomponentatnode)
- [`()findDOMNode`](#finddomnode)
- [`()createPortal`](#createportal)
=======
The `react-dom` package exports these methods:
- [`createPortal()`](#createportal)
- [`flushSync()`](#flushsync)

These `react-dom` methods are also exported, but are considered legacy:
- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`findDOMNode()`](#finddomnode)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)

> Note: 
> 
> Both `render` and `hydrate` have been replaced with new [client methods](/docs/react-dom-client.html) in React 18. These methods will warn that your app will behave as if it's running React 17 (learn more [here](https://reactjs.org/link/switch-to-createroot)).
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

### دعم المتصفح {#browser-support}

<<<<<<< HEAD
تدعم React جميع المتصفحات الشائعة، بما في ذلك Internet Explorer 9 فما فوق، رغم [الحاجة إلى توفير دعم](/docs/javascript-environment-requirements.html) للمتصفحات القديمة مثل Internet Explorer 9 و Internet Explorer 10.
=======
React supports all modern browsers, although [some polyfills are required](/docs/javascript-environment-requirements.html) for older versions.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> ملاحظة
>
<<<<<<< HEAD
> لا ندعم المتصفحات التي لا تدعم توابع ES5، ولكن قد تجد أنّ تطبيقاتك تعمل في المتصفحات القديمة إن ضمّنت polyfills مثل [es5-shim and es5-sham](https://github.com/es-shims/es5-shim) في الصفحة. ولكن لك حريّة ذلك إن اخترت هذا الطريق.

* * *
=======
> We do not support older browsers that don't support ES5 methods or microtasks such as Internet Explorer. You may find that your apps do work in older browsers if polyfills such as [es5-shim and es5-sham](https://github.com/es-shims/es5-shim) are included in the page, but you're on your own if you choose to take this path.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

## مرجع {#reference}

<<<<<<< HEAD
### `()render` {#render}
=======
### `createPortal()` {#createportal}
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

```javascript
createPortal(child, container)
```

<<<<<<< HEAD
يُصيّر عنصر React إلى DOM ضمن الحاوية المذكورة بالوسيط `container` ويُعيد [مرجعًا](/docs/more-about-refs.html) إلى المكوّن (أو يُعيد `null` [للمكوّنات التي بدون حالة](/docs/components-and-props.html#function-and-class-components)).
=======
Creates a portal. Portals provide a way to [render children into a DOM node that exists outside the hierarchy of the DOM component](/docs/portals.html).

### `flushSync()` {#flushsync}

```javascript
flushSync(callback)
```

Force React to flush any updates inside the provided callback synchronously. This method is useful for being able to read the result of those updates immediately.

> Note:
> 
> `flushSync` can have a significant impact on performance. Use sparingly.
> 
> `flushSync` may force pending Suspense boundaries to show their `fallback` state.
> 
> `flushSync` may also run pending effects and synchronously apply any updates they contain before returning.
> 
> `flushSync` may also flush updates outside the callback when necessary to flush the updates inside the callback. For example, if there are pending updates from a click, React may flush those before flushing the updates inside the callback.

## Legacy Reference {#legacy-reference}
### `render()` {#render}
```javascript
render(element, container[, callback])
```

> Note:
>
> `render` has been replaced with `createRoot` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Render a React element into the DOM in the supplied `container` and return a [reference](/docs/more-about-refs.html) to the component (or returns `null` for [stateless components](/docs/components-and-props.html#function-and-class-components)).
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

إن كان عنصر React مُصيَّر سابقًا إلى الحاوية`container`, فسيُجري تحديثًا عليه ويُعدِّل DOM فقط كما هو ضروري ليعكس آخر تحديثات عنصر React.

إن أضفنا رد النداء الاختياري فسيُنفَّذ بعد تصيير أو تحديث المكوّن.

> ملاحظة:
>
<<<<<<< HEAD
> يتحكّم التابع `ReactDOM.render()` بمحتويات العقدة الحاوية (container node)  التي تُمرِّرها. تُستبدَل أي عناصر موجودة بداخلها عند أول استدعاء. تستخدم الاستدعاءات اللاحقة خوارزمية المقارنة من أجل التحديث بكفاءة.
>
> لا يُعدِّل التابع `ReactDOM.render()`   العقدة الحاوية (بل يُعدِّل فقط العناصر الأبناء لها). من الممكن إدخال مكوّن إلى عقدة DOM موجودة مسبقًا بدون الكتابة فوق العناصر الأبناء الموجودين داخلها.
>
> يُعيد التابع `ReactDOM.render()` حاليًّا مرجعًا إلى نسخة الصنف `ReactComponent` الجذري. على أيّة حال هذه القيمة المُعادة تعتبر قديمة حاليًّا ويجب تجنبها لأنّ إصدارات React القادمة قد تُصيِّر المكوّنات بشكلٍ غير متزامن في بعض الحالات. إن أردت مرجعًا إلى نسخة الصنف`ReactComponent`  الجذري فالحل الأمثل هو إرفاق مرجع رد نداء إلى العنصر الجذري.
> [callback ref](/docs/more-about-refs.html#the-ref-callback-attribute) to the root element.
>
> أصبح استخدام التابع `ReactDOM.render()` لإجراء hydrate على الحاوية المُصيَّرة من قبل الخادم أمرًا مهمًلا وسيُزال في إصدار React 17. استخدم التابع [`hydrate()`](#hydrate) بدلًا من ذلك.
=======
> `render()` controls the contents of the container node you pass in. Any existing DOM elements inside are replaced when first called. Later calls use React’s DOM diffing algorithm for efficient updates.
>
> `render()` does not modify the container node (only modifies the children of the container). It may be possible to insert a component to an existing DOM node without overwriting the existing children.
>
> `render()` currently returns a reference to the root `ReactComponent` instance. However, using this return value is legacy
> and should be avoided because future versions of React may render components asynchronously in some cases. If you need a reference to the root `ReactComponent` instance, the preferred solution is to attach a
> [callback ref](/docs/refs-and-the-dom.html#callback-refs) to the root element.
>
> Using `render()` to hydrate a server-rendered container is deprecated. Use [`hydrateRoot()`](#hydrateroot) instead.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `()hydrate` {#hydrate}

```javascript
hydrate(element, container[, callback])
```

<<<<<<< HEAD
يُشير المصطلح hydrate إلى عمليّة ملء الكائن بالبيانات. هذا التابع مماثل للتابع [`render()`](#render), ولكنّه يُستخدَم لإجراء hydrate على حاوية محتواها مُصيَّر من قبل[`ReactDOMServer`](/docs/react-dom-server.html). تحاول React إرفاق مستمع للأحداث إلى الشيفرة الحالية.
=======
> Note:
>
> `hydrate` has been replaced with `hydrateRoot` in React 18. See [hydrateRoot](/docs/react-dom-client.html#hydrateroot) for more info.

Same as [`render()`](#render), but is used to hydrate a container whose HTML contents were rendered by [`ReactDOMServer`](/docs/react-dom-server.html). React will attempt to attach event listeners to the existing markup.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

تتوقّع React أنّ المحتوى المُصيَّر متطابق بين الخادم والعميل. بإمكانها تصحيح الاختلافات في محتوى النص ولكن يجب عليك معاملة عدم التطابق كخطأ وإصلاحه. في وضع التطوير تُعطينا React تحذيرات حول عدم التطابق خلال عملية الـ hydration. لا يوجد ضمان بتصحيح الاختلافات بين الخاصيّات في حال عدم التطابق. يعد هذا هامًّا لأسباب تتعلق بالأداء لأنّه في معظم التطبيقات يكون عدم التطابق نادرًا ولذا يصبح التحقق من كل الأخطاء أمرًا مكلفًا.

إن كانت هنالك خاصيّة عنصر وحيدة أو محتوى نص مختلف بين الخادم والعميل بشكل لا يُمكِن تجنّبه (مثلًا الطابع الزمني) فبإمكانك إيقاف التحذير عن طريق إضافة  `suppressHydrationWarning={true}` للعنصر. يعمل هذا فقط في مستوى واحد فقط والغرض منه إيجاد طريقة للهروب، لذا لا تفرط في استخدامه. لن تصحح React الاختلافات ما لم يكن المحتوى نصيًّا، لذا قد يبقى غير مستقر حتى التحديثات القادمة.

إن احتجت عن قصد تصيير شيء مختلف على الخادم والعميل فبإمكانك إجراء تصيير ذو تمريرين. تتمكّن المكوّنات التي تُصيّر شيئًا مختلفًا على العميل من قراءة متغيّر الحالة مثل  `this.state.isClient`, بهذه الحالة سيُصيّر مرور التصيير الأولي نفس محتوى الخادم، متجنبًا بذلك عدم التطابق، ولكن سيحدث مرور إضافي بشكل متزامن بعد عمليّة hydration. انتبه إلى أنّ هذه المقاربة ستجعل مكوّناتك أبطأ لأنّه يجب عليها التصيير مرتين، لذا استخدم ذلك بحذر.

تذكر أن تبقي في ذهنك تجربة المستخدم الذي يمتلك اتصالًا بطيئًا بالإنترنت. قد تُحمَّل شيفرة JavaScript بعد تصيير HTML المبدئي بفترة هامّة، لذا إن صيّرت شيئًا مختلفًا في تمرير العميل فقط، فسيصبح الانتقال بطيئًا. قد يكون من المفيد تصيير واجهة shell للتطبيق على الخادم، وإظهار بعض الأدوات المصغرة فقط من جانب العميل. لتعلّم كيفيّة فعل ذلك بدون الحصول على مشاكل في التوافق فارجع إلى الشرح المذكور في الفقرة السابقة.

* * *

### `()unmountComponentAtNode` {#unmountcomponentatnode}

```javascript
unmountComponentAtNode(container)
```

<<<<<<< HEAD
يُزيل مكوّن React الموصول من DOM ويمسح معالجات أحداثه وحالته. إن لم يكن هنالك أي مكوّن موصول في الحاوية فلن يؤدي استدعاء هذا التابع إلى فعل أي شيء. يُعيد هذا التابع القيمة `true` إن فصلنا المكوّن بنجاح و `false` إن لم يكون هنالك مكوّن لفصله.
=======
> Note:
>
> `unmountComponentAtNode` has been replaced with `root.unmount()` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Remove a mounted React component from the DOM and clean up its event handlers and state. If no component was mounted in the container, calling this function does nothing. Returns `true` if a component was unmounted and `false` if there was no component to unmount.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `()findDOMNode` {#finddomnode}

> ملاحظة:
>
> التابع `findDOMNode` و وسيلة هروب مستخدمة للوصول إلى عقدة DOM التحتية. من غير المفضل في معظم الأحيان استخدام وسيلة الهروب هذه لأنّها تخرق تجريد المكوّنات. لقد  [أهمل في الوضع الصارم `StrictMode`.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
findDOMNode(component)
```

إن كان هذا المكوّن موصولًا إلى DOM، فسيُعيد هذا التابع عنصر DOM الأصلي الموافق في المتصفح. يُفيد هذا التابع لقراءة القيم من DOM، مثل قيم حقول الإدخال وإنجاز قياسات DOM. في معظم الحالات تستطيع إرفاق مرجع إلى عقدة DOM وتجنب استخدام `findDOMNode` نهائيًّا.
عندما يُصيِّر المكوّن القيمة `false` أو `null` فسيُعيد `findDOMNode` القيمة `null`. عندما يُصيِّر المكوّن سلسلة نصيّة، فسيُعيد هذا التابع عقدة DOM نصيّة تحتوي على تلك القيمة. بدءًا من إصدار React 16 قد يُعيد المكوّن جزءًا (fragment) مع عدّة عناصر أبناء، وفي تلك الحالة سيُعيد `findDOMNode` عقدة DOM الموافقة لأول عنصر ابن غير فارغ.

> ملاحظة:
>
> يعمل التابع `findDOMNode` فقط على المكوّنات الموصولة (أي المكوّنات المتوضعة في DOM). إن حاولت استدعاء هذا التابع على مكوّن غير موصول بعد (مثل استدعاء `findDOMNode` في التابع `render` في مكوّن لم يُنشَأ بعد) فسيُرمى استثناء.
>
> لا يُمكِن استخدام `findDOMNode`على مكوّنات الدوال.

* * *
<<<<<<< HEAD

### `()createPortal` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

يُنشِئ مدخل (portal). تُزوّدنا المداخل بطريقة [لتصيير العناصر الأبناء إلى عقدة DOM موجودة خارج التسلسل الهرمي لمكوّنات DOM](/docs/portals.html).
=======
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1
