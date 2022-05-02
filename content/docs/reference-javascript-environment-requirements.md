---
id: javascript-environment-requirements
title: متطلبات بيئة JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
تعتمد React 16 على أنواع المجموعة [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) و [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). إن كنت تدعم متصفحات أقدم وأجهزة قد لا توفر لك هذا من أصل المتصفح أو الجهاز (مثل الإصدارات الأقل من Internet Explorer 11) أو التي لا تمتلك اعتمادات بدون مشاكل (مثل Internet Explorer 11)، فانظر في تضمين polyfill عام في تطبيقك، مثل [core-js](https://github.com/zloirock/core-js).

تبدو البيئة بعد إضافة نقص الدعم (polyfill) في React 16 باستخدام `core-js` لدعم متصفحات أقدم كما يلي:
=======
React 18 supports all modern browsers (Edge, Firefox, Chrome, Safari, etc).

If you support older browsers and devices such as Internet Explorer which do not provide modern browser features natively or have non-compliant implementations, consider including a global polyfill in your bundled application.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

Here is a list of the modern features React 18 uses:
- [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

تعتمد React أيضًا على `requestAnimationFrame` (حتى في بيئات الاختبار).

تستطيع استخدام الحزمة [raf](https://www.npmjs.com/package/raf) كما يلي:

```js
import 'raf/polyfill';
```
=======
The correct polyfill for these features depend on your environment. For many users, you can configure your [Browserlist](https://github.com/browserslist/browserslist) settings. For others, you may need to import polyfills like [`core-js`](https://github.com/zloirock/core-js) directly.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d
