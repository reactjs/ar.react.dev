---
title: resumeToPipeableStream
---

<Intro>

`resumeToPipeableStream` يدفّق شجرة React مُصيَّرة مسبقاً إلى [تيار Node.js](https://nodejs.org/api/stream.html) قابل للربط بالأنابيب (pipeable).

```js
const {pipe, abort} = await resumeToPipeableStream(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

هذه الواجهة خاصة بـ Node.js. البيئات التي تدعم [تيارات الويب،](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) مثل Deno وبيئات الحافة الحديثة، يجب أن تستخدم [`resume`](/reference/react-dom/server/resume) بدلاً من ذلك.

</Note>

---

## المرجع {/*reference*/}

### `resumeToPipeableStream(node, postponed, options?)` {/*resume-to-pipeable-stream*/}

استدعِ `resumeToPipeableStream` لاستئناف تصيير شجرة React مُصيَّرة مسبقاً كـ HTML في [تيار Node.js.](https://nodejs.org/api/stream.html#writable-streams)

```js
import { resumeToPipeableStream } from 'react-dom/server';
import {getPostponedState} from './storage';

async function handler(request, response) {
  const postponed = await getPostponedState(request);
  const {pipe} = await resumeToPipeableStream(<App />, postponed, {
    onShellReady: () => {
      pipe(response);
    }
  });
}
```

[انظر المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `reactNode`: عقدة React التي استدعيت معها `prerender`، مثل عنصر JSX مثل `<App />`. يُفترض أن تمثّل المستند بالكامل، لذا يجب أن يصيّر مكوّن `App` وسم `<html>`.
* `postponedState`: الكائن المعتم `postpone` الذي تعيده [واجهة prerender](/reference/react-dom/static/index)، بعد تحميله من مكان تخزينه (مثل redis أو ملف أو S3).
* `options` **اختياري**: كائن بخيارات التدفق.
  * `nonce` **اختياري**: سلسلة [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) للسماح بالنصوص ضمن [`script-src` في Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * `signal` **اختياري**: [إشارة إلغاء](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) تتيح لك [إيقاف التصيير على الخادم](#aborting-server-rendering) وتصيير الباقي على العميل.
  * `onError` **اختياري**: دالة استدعاء تُنفَّذ عند حدوث خطأ على الخادم، سواء كان [قابلاً للاسترداد](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) أو [غير ذلك.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell) افتراضياً، تستدعي `console.error` فقط. إذا غيّرتها [لتسجيل تقارير الأعطال،](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) فتأكد أنك ما زلت تستدعي `console.error`.
  * `onShellReady` **اختياري**: دالة استدعاء تُنفَّذ مباشرة بعد انتهاء [الغلاف (shell)](#specifying-what-goes-into-the-shell). يمكنك استدعاء `pipe` هنا لبدء التدفق. سيواصل React [تدفّق المحتوى الإضافي](#streaming-more-content-as-it-loads) بعد الغلاف مع وسوم `<script>` مضمّنة تستبدل بدائل التحميل في HTML بالمحتوى.
  * `onShellError` **اختياري**: دالة استدعاء تُنفَّذ إذا حدث خطأ أثناء تصيير الغلاف. تستقبل الخطأ كوسيط. لم يُصدَر أي بايت من التيار بعد، ولن تُستدعى `onShellReady` ولا `onAllReady`، لذا يمكنك [إخراج غلاف HTML احتياطي](#recovering-from-errors-inside-the-shell) أو استخدام prelude.


#### العائدات {/*returns*/}

يعيد `resumeToPipeableStream` كائناً بطريقتين:

* `pipe` يخرج HTML إلى [تيار Node.js للكتابة](https://nodejs.org/api/stream.html#writable-streams) المُمرَّر. استدعِ `pipe` داخل `onShellReady` لتفعيل التدفق، أو داخل `onAllReady` لمحركات الزحف والتوليد الثابت.
* `abort` يتيح لك [إيقاف التصيير على الخادم](#aborting-server-rendering) وتصيير الباقي على العميل.

#### ملاحظات {/*caveats*/}

- لا يقبل `resumeToPipeableStream` خيارات `bootstrapScripts` أو `bootstrapScriptContent` أو `bootstrapModules`. مرّر هذه الخيارات بدلاً من ذلك إلى استدعاء `prerender` الذي يولّد `postponedState`. يمكنك أيضاً حقن محتوى التمهيد يدوياً في التيار القابل للكتابة.
- لا يقبل `identifierPrefix` لأن البادئة يجب أن تكون نفسها في `prerender` و`resumeToPipeableStream`.
- بما أن `nonce` لا يمكن تمريره إلى prerender، يجب تمرير `nonce` إلى `resumeToPipeableStream` فقط إذا لم تكن تمرّر نصوصاً إلى prerender.
- يعيد `resumeToPipeableStream` التصيير من الجذر حتى يجد مكوّناً لم يُكمَل تصييره مسبقاً بالكامل. تُتخطى بالكامل فقط المكوّنات المُصيَّرة مسبقاً بالكامل (اكتمل تصيير المكوّن وأطفاله).

## الاستخدام {/*usage*/}

### للاطلاع أكثر {/*further-reading*/}

سلوك الاستئناف يشبه `renderToReadableStream`. لمزيد من الأمثلة، راجع [قسم الاستخدام في `renderToReadableStream`](/reference/react-dom/server/renderToReadableStream#usage).
يتضمّن [قسم الاستخدام في `prerender`](/reference/react-dom/static/prerender#usage) أمثلة لاستخدام `prerenderToNodeStream` تحديداً.
