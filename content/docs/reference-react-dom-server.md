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

## لمحة عامة {#overview}

يُمكِن استخدام التوابع التالية في بيئة الخادم وبيئة المتصفح:

- [`()renderToString`](#rendertostring)
- [`()renderToStaticMarkup`](#rendertostaticmarkup)

تعتمد هذه التوابع الإضافية على الحزمة (stream) والتي لا تتوفر إلا على الخادم ولا تعمل على المتصفح.

<<<<<<< HEAD
- [`()renderToNodeStream`](#rendertonodestream)
- [`()renderToStaticNodeStream`](#rendertostaticnodestream)
=======
- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToReadableStream()`](#rendertoreadablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

## مرجع {#reference}

### `()renderToString` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

يُصيِّر عنصر React إلى تمثيل HTML البدئي له. ستعيد React سلسلة HTML نصية. بإمكانك استخدام هذا التابع لتوليد  HTML على الخادم وإرساله عند أول طلب وذلك لتحميل أسرع للصفحات وللسماح لمحركات البحث بإضافة صفحاتك بهدف تحسين تهيئة موقعك لمحركات البحث SEO (اختصارا للعبارة Search Engine Optimization).

<<<<<<< HEAD
إن استدعيت التابع  [`()ReactDOM.hydrate`](/docs/react-dom.html#hydrate) على عقدة تمتلك تمثيل التصيير على الخادم، فستحافظ React عليها وستُرفِق إليها معالجات الأحداث فقط، ممّا يسمح لك بالحصول على تجربة تحميل أولي سريع جدًّا للصفحات.
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `()renderToStaticMarkup` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

مشابه للتابع  [`renderToString`](#rendertostring), عدا أنّه لا يُنشِئ خاصيات DOM إضافية لتستخدمها React داخليًّا، مثل `data-reactroot`. يفيدنا ذلك إن أردنا استخدام React كمولد لصفحات ثابتة بسيطة، حيث أنّ إزالة الخاصيات الإضافية توفر علينا بعض البايتات.

<<<<<<< HEAD
إن كنت تخطط لاستخدام React من جانب العميل لجعل تمثيل HTML متفاعلًا، فلا تستخدم هذا التابع، بل استخدم بدلًا منه [`renderToString`](#rendertostring) من جانب الخادم و [`()ReactDOM.hydrate`](/docs/react-dom.html#hydrate) من جانب العميل.

* * *

### `()renderToNodeStream` {#rendertonodestream}
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.

* * *

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

Render a React element to its initial HTML. Returns a [Control object](https://github.com/facebook/react/blob/3f8990898309c61c817fbf663f5221d9a00d0eaa/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L49-L54) that allows you to pipe the output or abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" later through javascript execution. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note:
>
> This is a Node.js specific API and modern server environments should use renderToReadableStream instead.
>

```
const {pipe, abort} = renderToPipeableStream(
  <App />,
  {
    onAllReady() {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      pipe(res);
    },
    onShellError(x) {
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    }
  }
);
```

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
    ReactDOMServer.renderToReadableStream(element, options);
```

Streams a React element to its initial HTML. Returns a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```
let controller = new AbortController();
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
    }
  );
  
  // This is to wait for all suspense boundaries to be ready. You can uncomment
  // this line if you don't want to stream to the client
  // await stream.allReady;

  return new Response(stream, {
    headers: {'Content-Type': 'text/html'},
  });
} catch (error) {
  return new Response(
    '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>',
    {
      status: 500,
      headers: {'Content-Type': 'text/html'},
    }
  );
}
```
* * *

### `renderToNodeStream()` {#rendertonodestream} (Deprecated)
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

```javascript
ReactDOMServer.renderToNodeStream(element)
```

يُصيِّر عنصر React إلى تمثيل HTML البدئي له. يُعيد [تدفّق بيانات (stream) قابل للقراءة](https://nodejs.org/api/stream.html#stream_readable_streams) والذي ينتج عنه سلسلة نصيّة في HTML. يكون ناتج HTML الصادر عن تدفّق البيانات مساويًا تمامًا للقيمة التي يعيدها التابع  [`ReactDOMServer.renderToString`](#rendertostring) بإمكانك استخدام هذا التابع لتوليد  HTML على الخادم وإرساله عند أول طلب وذلك لتحميل أسرع للصفحات وللسماح لمحركات البحث بإضافة صفحاتك بهدف تحسين تهيئة موقعك لمحركات البحث SEO (اختصارا للعبارة Search Engine Optimization).

<<<<<<< HEAD
إن استدعيت التابع  [`()ReactDOM.hydrate`](/docs/react-dom.html#hydrate) على عقدة تمتلك تمثيل التصيير على الخادم، فستحافظ React عليها وستُرفِق إليها معالجات الأحداث فقط، ممّا يسمح لك بالحصول على تجربة تحميل أولي سريع جدًّا للصفحات.
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> ملاحظة:
>
> تتوفر واجهة برمجة التطبيق هذه فقط على الخادم ولا تتوفر على المتصفح.
>
> يُعيد تدفق البيانات الناتج عن هذا التابع تدفّق بيانات مُرمَّز بصيغة utf-8. إن أردت الحصول على ترميز آخر فألقِ نظرة على مشروع مثل [iconv-lite](https://www.npmjs.com/package/iconv-lite)، والذي يُزوّدنا بطريقة لتحويل تدفّق البيانات إلى ترميز آخر.

* * *

### `()renderToStaticNodeStream` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

مشابه للتابع  [`renderToNodeStream`](#rendertonodestream), عدا أنّه لا يُنشِئ خاصيات DOM إضافية لتستخدمها React داخليًّا، مثل `data-reactroot`. يفيدنا ذلك إن أردنا استخدام React كمولد لصفحات ثابتة بسيطة، حيث أنّ إزالة الخاصيات الإضافية توفر علينا بعض البايتات.

يكون ناتج HTML الصادر عن تدفّق البيانات مساويًا تمامًا للقيمة التي يعيدها التابع [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup).

<<<<<<< HEAD
إن كنت تخطط لاستخدام React من جانب العميل لجعل تمثيل HTML متفاعلًا، فلا تستخدم هذا التابع، بل استخدم بدلًا منه [`renderToNodeStream`](#rendertonodestream) من جانب الخادم و [`()ReactDOM.hydrate`](/docs/react-dom.html#hydrate) من جانب العميل.
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToNodeStream`](#rendertonodestream) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> ملاحظة:
>
> تتوفر واجهة برمجة التطبيق هذه فقط على الخادم ولا تتوفر على المتصفح.
>
> يُعيد تدفق البيانات الناتج عن هذا التابع تدفّق بيانات مُرمَّز بصيغة `utf-8`. إن أردت الحصول على ترميز آخر فألقِ نظرة على مشروع مثل [iconv-lite](https://www.npmjs.com/package/iconv-lite)، والذي يُزوّدنا بطريقة لتحويل تدفّق البيانات إلى ترميز آخر.
