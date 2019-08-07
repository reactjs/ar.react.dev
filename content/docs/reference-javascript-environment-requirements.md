---
id: javascript-environment-requirements
title: متطلبات بيئة JavaScript في React
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

تعتمد React 16 على أنواع المجموعة [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) و [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). إن كنت تدعم متصفحات أقدم وأجهزة قد لا توفر لك هذا من أصل المتصفح أو الجهاز (مثل الإصدارات الأقل من Internet Explorer 11) أو التي لا تمتلك اعتمادات بدون مشاكل (مثل Internet Explorer 11)، فانظر في تضمين polyfill عام في تطبيقك، مثل [core-js](https://github.com/zloirock/core-js) أو [babel-polyfill](https://babeljs.io/docs/usage/polyfill/).

تبدو البيئة بعد إضافة نقص الدعم (polyfill) في React 16 باستخدام `core-js` لدعم متصفحات أقدم كما يلي:

```js
import 'core-js/es/map';
import 'core-js/es/set';

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
