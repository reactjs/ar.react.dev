---
id: react-dom-server
title: الكائن ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

يُمكّننا الكائن `ReactDOMServer` من تصيير المكونات إلى تمثيل ثابت، وهو يُستخدَم بشكل نموذجي مع خادم Node.

```js
// ES modules
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Overview {#overview}

يُمكِن استخدام التوابع التالية في بيئة الخادم وبيئة المتصفح:

- [`()renderToString`](#rendertostring)
- [`()renderToStaticMarkup`](#rendertostaticmarkup)

تعتمد هذه التوابع الإضافية على الحزمة (stream) والتي لا تتوفر إلا على الخادم ولا تعمل على المتصفح.

- [`()renderToNodeStream`](#rendertonodestream)
- [`()renderToStaticNodeStream`](#rendertostaticnodestream)

* * *

## Reference {#reference}

### `()renderToString` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

يُصيِّر عنصر React إلى تمثيل HTML البدئي له. ستعيد React سلسلة HTML نصية. بإمكانك استخدام هذا التابع لتوليد  HTML على الخادم وإرساله عند أول طلب وذلك لتحميل أسرع للصفحات وللسماح لمحركات البحث بإضافة صفحاتك بهدف تحسين تهيئة موقعك لمحركات البحث SEO (اختصارا للعبارة Search Engine Optimization).

إن استدعيت التابع  [`()ReactDOM.hydrate`](/docs/react-dom.html#hydrate) على عقدة تمتلك تمثيل التصيير على الخادم، فستحافظ React عليها وستُرفِق إليها معالجات الأحداث فقط، ممّا يسمح لك بالحصول على تجربة تحميل أولي سريع جدًّا للصفحات.

* * *

### `()renderToStaticMarkup` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

مشابه للتابع  [`renderToString`](#rendertostring), عدا أنّه لا يُنشِئ خاصيات DOM إضافية لتستخدمها React داخليًّا، مثل `data-reactroot`. يفيدنا ذلك إن أردنا استخدام React كمولد لصفحات ثابتة بسيطة، حيث أنّ إزالة الخاصيات الإضافية توفر علينا بعض البايتات.

إن كنت تخطط لاستخدام React من جانب العميل لجعل تمثيل HTML متفاعلًا، فلا تستخدم هذا التابع، بل استخدم بدلًا منه [`renderToString`](#rendertostring) من جانب الخادم و [`()ReactDOM.hydrate`](/docs/react-dom.html#hydrate) من جانب العميل.

* * *

### `()renderToNodeStream` {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

يُصيِّر عنصر React إلى تمثيل HTML البدئي له. يُعيد [تدفّق بيانات (stream) قابل للقراءة](https://nodejs.org/api/stream.html#stream_readable_streams) والذي ينتج عنه سلسلة نصيّة في HTML. يكون ناتج HTML الصادر عن تدفّق البيانات مساويًا تمامًا للقيمة التي يعيدها التابع  [`ReactDOMServer.renderToString`](#rendertostring) بإمكانك استخدام هذا التابع لتوليد  HTML على الخادم وإرساله عند أول طلب وذلك لتحميل أسرع للصفحات وللسماح لمحركات البحث بإضافة صفحاتك بهدف تحسين تهيئة موقعك لمحركات البحث SEO (اختصارا للعبارة Search Engine Optimization).

إن استدعيت التابع  [`()ReactDOM.hydrate`](/docs/react-dom.html#hydrate) على عقدة تمتلك تمثيل التصيير على الخادم، فستحافظ React عليها وستُرفِق إليها معالجات الأحداث فقط، ممّا يسمح لك بالحصول على تجربة تحميل أولي سريع جدًّا للصفحات.

> ملاحظة:
>
> تتوفر واجهة برمجة التطبيق هذه فقط على الخادم ولا تتوفر على المتصفح.
>
> يُعيد تدفق البيانات الناتج عن هذا التابع تدفّق بيانات مُرمَّز بصيغة utf-8. إن أردت في الحصول على ترميز آخر فألقِ نظرة على مشروع مثل [iconv-lite](https://www.npmjs.com/package/iconv-lite), والذي يُزوّدنا بطريقة لتحويل تدفّق البيانات إلى ترميز آخر.

* * *

### `()renderToStaticNodeStream` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

مشابه للتابع  [`renderToNodeStream`](#rendertonodestream), عدا أنّه لا يُنشِئ خاصيات DOM إضافية لتستخدمها React داخليًّا، مثل `data-reactroot`. يفيدنا ذلك إن أردنا استخدام React كمولد لصفحات ثابتة بسيطة، حيث أنّ إزالة الخاصيات الإضافية توفر علينا بعض البايتات.

يكون ناتج HTML الصادر عن تدفّق البيانات مساويًا تمامًا للقيمة التي يعيدها التابع [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup).

إن كنت تخطط لاستخدام React من جانب العميل لجعل تمثيل HTML متفاعلًا، فلا تستخدم هذا التابع، بل استخدم بدلًا منه [`renderToNodeStream`](#rendertonodestream) من جانب الخادم و [`()ReactDOM.hydrate`](/docs/react-dom.html#hydrate) من جانب العميل.

> ملاحظة:
>
> تتوفر واجهة برمجة التطبيق هذه فقط على الخادم ولا تتوفر على المتصفح.
>
> يُعيد تدفق البيانات الناتج عن هذا التابع تدفّق بيانات مُرمَّز بصيغة `utf-8`. إن أردت في الحصول على ترميز آخر فألقِ نظرة على مشروع مثل [iconv-lite](https://www.npmjs.com/package/iconv-lite), والذي يُزوّدنا بطريقة لتحويل تدفّق البيانات إلى ترميز آخر.
