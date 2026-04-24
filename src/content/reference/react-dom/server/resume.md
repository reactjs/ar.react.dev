---
title: resume
---

<Intro>

`resume` يدفّق شجرة React المُصيَّرة مسبقاً إلى [تيار ويب للقراءة (Readable Web Stream).](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js
const stream = await resume(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

تعتمد هذه الواجهة على [تيارات الويب (Web Streams).](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) لـ Node.js، استخدم [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) بدلاً من ذلك.

</Note>

---

## المرجع {/*reference*/}

### `resume(node, postponedState, options?)` {/*resume*/}

استدعِ `resume` لاستئناف تصيير شجرة React مُصيَّرة مسبقاً كـ HTML في [تيار ويب للقراءة (Readable Web Stream).](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js
import { resume } from 'react-dom/server';
import {getPostponedState} from './storage';

async function handler(request, writable) {
  const postponed = await getPostponedState(request);
  const resumeStream = await resume(<App />, postponed);
  return resumeStream.pipeTo(writable)
}
```

[انظر المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `reactNode`: عقدة React التي استدعيت معها `prerender`، مثل عنصر JSX مثل `<App />`. يُفترض أن تمثّل المستند بالكامل، لذا يجب أن يصيّر مكوّن `App` وسم `<html>`.
* `postponedState`: الكائن المعتم `postpone` الذي تعيده [واجهة prerender](/reference/react-dom/static/index)، بعد تحميله من مكان تخزينه (مثل redis أو ملف أو S3).
* `options` **اختياري**: كائن بخيارات التدفق.
  * `nonce` **اختياري**: سلسلة [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) للسماح بالنصوص ضمن [`script-src` في Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * `signal` **اختياري**: [إشارة إلغاء (abort signal)](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) تتيح لك [إيقاف التصيير على الخادم](#aborting-server-rendering) وتصيير الباقي على العميل.
  * `onError` **اختياري**: دالة استدعاء تُنفَّذ عند حدوث خطأ على الخادم، سواء كان [قابلاً للاسترداد](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) أو [غير ذلك.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell) افتراضياً، تستدعي `console.error` فقط. إذا غيّرتها [لتسجيل تقارير الأعطال،](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) فتأكد أنك ما زلت تستدعي `console.error`.


#### العائدات {/*returns*/}

يعيد `resume` وعداً (Promise):

- إذا نجح `resume` في إنتاج [الغلاف (shell)](/reference/react-dom/server/renderToReadableStream#specifying-what-goes-into-the-shell)، يُحلّ الوعد إلى [تيار ويب للقراءة](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) يمكن توجيهه إلى [تيار ويب للكتابة (Writable Web Stream).](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream)
- إذا حدث خطأ في الغلاف، يُرفض الوعد بذلك الخطأ.

للتيار المُعاد خاصية إضافية:

* `allReady`: وعد يُحلّ عند اكتمال كل التصيير. يمكنك `await stream.allReady` قبل إرجاع الاستجابة [لمحركات الزحف والتوليد الثابت.](/reference/react-dom/server/renderToReadableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation) إذا فعلت ذلك، لن يحدث تحميل تدريجي. سيحتوي التيار على HTML النهائي.

#### ملاحظات {/*caveats*/}

- لا يقبل `resume` خيارات `bootstrapScripts` أو `bootstrapScriptContent` أو `bootstrapModules`. مرّر هذه الخيارات بدلاً من ذلك إلى استدعاء `prerender` الذي يولّد `postponedState`. يمكنك أيضاً حقن محتوى التمهيد يدوياً في التيار القابل للكتابة.
- لا يقبل `resume` خاصية `identifierPrefix` لأن البادئة يجب أن تكون نفسها في `prerender` و`resume`.
- بما أن `nonce` لا يمكن تمريره إلى prerender، يجب تمرير `nonce` إلى `resume` فقط إذا لم تكن تمرّر نصوصاً إلى prerender.
- يعيد `resume` التصيير من الجذر حتى يجد مكوّناً لم يُكمَل تصييره مسبقاً بالكامل. تُتخطى بالكامل فقط المكوّنات المُصيَّرة مسبقاً بالكامل (اكتمل تصيير المكوّن وأطفاله).

## الاستخدام {/*usage*/}

### استئناف prerender {/*resuming-a-prerender*/}

<Sandpack>

```js src/App.js hidden 
```

```html public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <iframe id="container"></iframe>
</body>
</html>
```

```js src/index.js
import {
  flushReadableStreamToFrame,
  getUser,
  Postponed,
  sleep,
} from "./demo-helpers";
import { StrictMode, Suspense, use, useEffect } from "react";
import { prerender } from "react-dom/static";
import { resume } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";

function Header() {
  return <header>Me and my descendants can be prerendered</header>;
}

const { promise: cookies, resolve: resolveCookies } = Promise.withResolvers();

function Main() {
  const { sessionID } = use(cookies);
  const user = getUser(sessionID);

  useEffect(() => {
    console.log("reached interactivity!");
  }, []);

  return (
    <main>
      Hello, {user.name}!
      <button onClick={() => console.log("hydrated!")}>
        Clicking me requires hydration.
      </button>
    </main>
  );
}

function Shell({ children }) {
  // In a real app, this is where you would put your html and body.
  // We're just using tags here we can include in an existing body for demonstration purposes
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

function App() {
  return (
    <Shell>
      <Suspense fallback="loading header">
        <Header />
      </Suspense>
      <Suspense fallback="loading main">
        <Main />
      </Suspense>
    </Shell>
  );
}

async function main(frame) {
  // Layer 1
  const controller = new AbortController();
  const prerenderedApp = prerender(<App />, {
    signal: controller.signal,
    onError(error) {
      if (error instanceof Postponed) {
      } else {
        console.error(error);
      }
    },
  });
  // We're immediately aborting in a macrotask.
  // Any data fetching that's not available synchronously, or in a microtask, will not have finished.
  setTimeout(() => {
    controller.abort(new Postponed());
  });

  const { prelude, postponed } = await prerenderedApp;
  await flushReadableStreamToFrame(prelude, frame);

  // Layer 2
  // Just waiting here for demonstration purposes.
  // In a real app, the prelude and postponed state would've been serialized in Layer 1 and Layer would deserialize them.
  // The prelude content could be flushed immediated as plain HTML while
  // React is continuing to render from where the prerender left off.
  await sleep(2000);

  // You would get the cookies from the incoming HTTP request
  resolveCookies({ sessionID: "abc" });

  const stream = await resume(<App />, postponed);

  await flushReadableStreamToFrame(stream, frame);

  // Layer 3
  // Just waiting here for demonstration purposes.
  await sleep(2000);

  hydrateRoot(frame.contentWindow.document, <App />);
}

main(document.getElementById("container"));

```

```js src/demo-helpers.js
export async function flushReadableStreamToFrame(readable, frame) {
  const document = frame.contentWindow.document;
  const decoder = new TextDecoder();
  for await (const chunk of readable) {
    const partialHTML = decoder.decode(chunk);
    document.write(partialHTML);
  }
}

// This doesn't need to be an error.
// You can use any other means to check if an error during prerender was
// from an intentional abort or a real error.
export class Postponed extends Error {}

// We're just hardcoding a session here.
export function getUser(sessionID) {
  return {
    name: "Alice",
  };
}

export function sleep(timeoutMS) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeoutMS);
  });
}
```

</Sandpack>

### للاطلاع أكثر {/*further-reading*/}

سلوك الاستئناف يشبه `renderToReadableStream`. لمزيد من الأمثلة، راجع [قسم الاستخدام في `renderToReadableStream`](/reference/react-dom/server/renderToReadableStream#usage).
يتضمّن [قسم الاستخدام في `prerender`](/reference/react-dom/static/prerender#usage) أمثلة لاستخدام `prerender` تحديداً.
