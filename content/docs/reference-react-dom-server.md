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
import * as ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## لمحة عامة {#overview}

<<<<<<< HEAD
يُمكِن استخدام التوابع التالية في بيئة الخادم وبيئة المتصفح:
=======
These methods are only available in the **environments with [Node.js Streams](https://nodejs.org/api/stream.html):**

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

These methods are only available in the **environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)** (this includes browsers, Deno, and some modern edge runtimes):

- [`renderToReadableStream()`](#rendertoreadablestream)

The following methods can be used in the environments that don't support streams:
>>>>>>> b0ccb47f33e52315b0ec65edb9a49dc4910dd99c

- [`()renderToString`](#rendertostring)
- [`()renderToStaticMarkup`](#rendertostaticmarkup)

<<<<<<< HEAD
تعتمد هذه التوابع الإضافية على الحزمة (stream) والتي لا تتوفر إلا على الخادم ولا تعمل على المتصفح.

- [`()renderToNodeStream`](#rendertonodestream)
- [`()renderToStaticNodeStream`](#rendertostaticnodestream)

* * *

## مرجع {#reference}

### `()renderToString` {#rendertostring}
=======
## Reference {#reference}

### `renderToPipeableStream()` {#rendertopipeablestream}

> Try the new React documentation for [`renderToPipeableStream`](https://beta.reactjs.org/reference/react-dom/server/renderToPipeableStream).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)
>>>>>>> b0ccb47f33e52315b0ec65edb9a49dc4910dd99c

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

<<<<<<< HEAD
يُصيِّر عنصر React إلى تمثيل HTML البدئي له. ستعيد React سلسلة HTML نصية. بإمكانك استخدام هذا التابع لتوليد  HTML على الخادم وإرساله عند أول طلب وذلك لتحميل أسرع للصفحات وللسماح لمحركات البحث بإضافة صفحاتك بهدف تحسين تهيئة موقعك لمحركات البحث SEO (اختصارا للعبارة Search Engine Optimization).

إن استدعيت التابع  [`()ReactDOM.hydrate`](/docs/react-dom.html#hydrate) على عقدة تمتلك تمثيل التصيير على الخادم، فستحافظ React عليها وستُرفِق إليها معالجات الأحداث فقط، ممّا يسمح لك بالحصول على تجربة تحميل أولي سريع جدًّا للصفحات.

* * *

### `()renderToStaticMarkup` {#rendertostaticmarkup}
=======
Render a React element to its initial HTML. Returns a stream with a `pipe(res)` method to pipe the output and `abort()` to abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" via inline `<script>` tags later. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```javascript
let didError = false;
const stream = renderToPipeableStream(
  <App />,
  {
    onShellReady() {
      // The content above all Suspense boundaries is ready.
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : 200;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
    onShellError(error) {
      // Something errored before we could complete the shell so we emit an alternative shell.
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    },
    onAllReady() {
      // If you don't want streaming, use this instead of onShellReady.
      // This will fire after the entire page content is ready.
      // You can use this for crawlers or static generation.

      // res.statusCode = didError ? 500 : 200;
      // res.setHeader('Content-type', 'text/html');
      // stream.pipe(res);
    },
    onError(err) {
      didError = true;
      console.error(err);
    },
  }
);
```

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L36-L46).

> Note:
>
> This is a Node.js-specific API. Environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), like Deno and modern edge runtimes, should use [`renderToReadableStream`](#rendertoreadablestream) instead.
>

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

> Try the new React documentation for [`renderToReadableStream`](https://beta.reactjs.org/reference/react-dom/server/renderToReadableStream).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)
>>>>>>> b0ccb47f33e52315b0ec65edb9a49dc4910dd99c

```javascript
ReactDOMServer.renderToReadableStream(element, options);
```

<<<<<<< HEAD
مشابه للتابع  [`renderToString`](#rendertostring), عدا أنّه لا يُنشِئ خاصيات DOM إضافية لتستخدمها React داخليًّا، مثل `data-reactroot`. يفيدنا ذلك إن أردنا استخدام React كمولد لصفحات ثابتة بسيطة، حيث أنّ إزالة الخاصيات الإضافية توفر علينا بعض البايتات.

إن كنت تخطط لاستخدام React من جانب العميل لجعل تمثيل HTML متفاعلًا، فلا تستخدم هذا التابع، بل استخدم بدلًا منه [`renderToString`](#rendertostring) من جانب الخادم و [`()ReactDOM.hydrate`](/docs/react-dom.html#hydrate) من جانب العميل.

* * *

### `()renderToNodeStream` {#rendertonodestream}
=======
Streams a React element to its initial HTML. Returns a Promise that resolves to a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```javascript
let controller = new AbortController();
let didError = false;
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
      onError(error) {
        didError = true;
        console.error(error);
      }
    }
  );
  
  // This is to wait for all Suspense boundaries to be ready. You can uncomment
  // this line if you want to buffer the entire HTML instead of streaming it.
  // You can use this for crawlers or static generation:

  // await stream.allReady;

  return new Response(stream, {
    status: didError ? 500 : 200,
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

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerBrowser.js#L27-L35).

> Note:
>
> This API depends on [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). For Node.js, use [`renderToPipeableStream`](#rendertopipeablestream) instead.
>

* * *

### `renderToNodeStream()`  (Deprecated) {#rendertonodestream}

> Try the new React documentation for [`renderToNodeStream`](https://beta.reactjs.org/reference/react-dom/server/renderToNodeStream).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)
>>>>>>> b0ccb47f33e52315b0ec65edb9a49dc4910dd99c

```javascript
ReactDOMServer.renderToNodeStream(element)
```

<<<<<<< HEAD
يُصيِّر عنصر React إلى تمثيل HTML البدئي له. يُعيد [تدفّق بيانات (stream) قابل للقراءة](https://nodejs.org/api/stream.html#stream_readable_streams) والذي ينتج عنه سلسلة نصيّة في HTML. يكون ناتج HTML الصادر عن تدفّق البيانات مساويًا تمامًا للقيمة التي يعيدها التابع  [`ReactDOMServer.renderToString`](#rendertostring) بإمكانك استخدام هذا التابع لتوليد  HTML على الخادم وإرساله عند أول طلب وذلك لتحميل أسرع للصفحات وللسماح لمحركات البحث بإضافة صفحاتك بهدف تحسين تهيئة موقعك لمحركات البحث SEO (اختصارا للعبارة Search Engine Optimization).

إن استدعيت التابع  [`()ReactDOM.hydrate`](/docs/react-dom.html#hydrate) على عقدة تمتلك تمثيل التصيير على الخادم، فستحافظ React عليها وستُرفِق إليها معالجات الأحداث فقط، ممّا يسمح لك بالحصول على تجربة تحميل أولي سريع جدًّا للصفحات.
=======
Render a React element to its initial HTML. Returns a [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) that outputs an HTML string. The HTML output by this stream is exactly equal to what [`ReactDOMServer.renderToString`](#rendertostring) would return. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> b0ccb47f33e52315b0ec65edb9a49dc4910dd99c

> ملاحظة:
>
> تتوفر واجهة برمجة التطبيق هذه فقط على الخادم ولا تتوفر على المتصفح.
>
> يُعيد تدفق البيانات الناتج عن هذا التابع تدفّق بيانات مُرمَّز بصيغة utf-8. إن أردت الحصول على ترميز آخر فألقِ نظرة على مشروع مثل [iconv-lite](https://www.npmjs.com/package/iconv-lite)، والذي يُزوّدنا بطريقة لتحويل تدفّق البيانات إلى ترميز آخر.

* * *

### `()renderToStaticNodeStream` {#rendertostaticnodestream}

> Try the new React documentation for [`renderToStaticNodeStream`](https://beta.reactjs.org/reference/react-dom/server/renderToStaticNodeStream).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

مشابه للتابع  [`renderToNodeStream`](#rendertonodestream), عدا أنّه لا يُنشِئ خاصيات DOM إضافية لتستخدمها React داخليًّا، مثل `data-reactroot`. يفيدنا ذلك إن أردنا استخدام React كمولد لصفحات ثابتة بسيطة، حيث أنّ إزالة الخاصيات الإضافية توفر علينا بعض البايتات.

يكون ناتج HTML الصادر عن تدفّق البيانات مساويًا تمامًا للقيمة التي يعيدها التابع [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup).

<<<<<<< HEAD
إن كنت تخطط لاستخدام React من جانب العميل لجعل تمثيل HTML متفاعلًا، فلا تستخدم هذا التابع، بل استخدم بدلًا منه [`renderToNodeStream`](#rendertonodestream) من جانب الخادم و [`()ReactDOM.hydrate`](/docs/react-dom.html#hydrate) من جانب العميل.
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToNodeStream`](#rendertonodestream) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> b0ccb47f33e52315b0ec65edb9a49dc4910dd99c

> ملاحظة:
>
> تتوفر واجهة برمجة التطبيق هذه فقط على الخادم ولا تتوفر على المتصفح.
>
<<<<<<< HEAD
> يُعيد تدفق البيانات الناتج عن هذا التابع تدفّق بيانات مُرمَّز بصيغة `utf-8`. إن أردت الحصول على ترميز آخر فألقِ نظرة على مشروع مثل [iconv-lite](https://www.npmjs.com/package/iconv-lite)، والذي يُزوّدنا بطريقة لتحويل تدفّق البيانات إلى ترميز آخر.
=======
> The stream returned from this method will return a byte stream encoded in utf-8. If you need a stream in another encoding, take a look at a project like [iconv-lite](https://www.npmjs.com/package/iconv-lite), which provides transform streams for transcoding text.

* * *

### `renderToString()` {#rendertostring}

> Try the new React documentation for [`renderToString`](https://beta.reactjs.org/reference/react-dom/server/renderToString).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToString(element)
```

Render a React element to its initial HTML. React will return an HTML string. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note
>
> This API has limited Suspense support and does not support streaming.
>
> On the server, it is recommended to use either [`renderToPipeableStream`](#rendertopipeablestream) (for Node.js) or [`renderToReadableStream`](#rendertoreadablestream) (for Web Streams) instead.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

> Try the new React documentation for [`renderToStaticMarkup`](https://beta.reactjs.org/reference/react-dom/server/renderToStaticMarkup).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similar to [`renderToString`](#rendertostring), except this doesn't create extra DOM attributes that React uses internally, such as `data-reactroot`. This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes can save some bytes.

If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> b0ccb47f33e52315b0ec65edb9a49dc4910dd99c
