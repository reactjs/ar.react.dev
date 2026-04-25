---
title: "resumeAndPrerenderToNodeStream (استئناف التصيير المسبق إلى تدفق Node)"
---

<Intro>

تُكمِل الدالة `resumeAndPrerenderToNodeStream` شجرة React مُسبَقة التصيير إلى HTML ساكن باستخدام [تدفق Node.js (Node.js Stream).](https://nodejs.org/api/stream.html)

```js
const {prelude, postponed} = await resumeAndPrerenderToNodeStream(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

هذه الواجهة خاصة بـ Node.js. البيئات التي تدعم [تدفقات الويب (Web Streams)،](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) مثل Deno وبعض بيئات الحافة الحديثة، يفضّل فيها استخدام [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) بدلًا منها.

</Note>

---

## مرجع {/*reference*/}

### `resumeAndPrerenderToNodeStream(reactNode, postponedState, options?)` {/*resumeandprerendertolnodestream*/}

استدعِ `resumeAndPrerenderToNodeStream` لمتابعة شجرة React مُسبَقة التصيير إلى سلسلة HTML ساكنة.

```js
import { resumeAndPrerenderToNodeStream } from 'react-dom/static';
import { getPostponedState } from 'storage';

async function handler(request, writable) {
  const postponedState = getPostponedState(request);
  const { prelude } = await resumeAndPrerenderToNodeStream(<App />, JSON.parse(postponedState));
  prelude.pipe(writable);
}
```

على العميل، استدعِ [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) لتفعيل التفاعل مع HTML المُولَّد على الخادم.

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `reactNode`: عقدة React التي استدعيت معها `prerender` (أو استدعاء `resumeAndPrerenderToNodeStream` سابق). مثلًا عنصر JSX مثل `<App />`. يُفترض أن تمثل المستند بالكامل، لذا يجب أن يصيّر مكوّن `App` وسم `<html>`.
* `postponedState`: الكائن المعتم `postponed` المُرجَع من [واجهة تصيير مسبق](/reference/react-dom/static/index)، بعد تحميله من مكان تخزينه (مثلًا Redis أو ملف أو S3).
* **اختياري** `options`: كائن يحوي خيارات البث.
  * **اختياري** `signal`: [إشارة إلغاء (abort signal)](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) تسمح لك [بإيقاف تصيير الخادم](#aborting-server-rendering) وتصيير الباقي على العميل.
  * **اختياري** `onError`: دالة استدعاء تُنفَّذ عند حدوث خطأ على الخادم، سواء كان [قابلاً للاسترداد](#recovering-from-errors-outside-the-shell) أو [غير قابل للاسترداد.](#recovering-from-errors-inside-the-shell) افتراضيًا تستدعي `console.error` فقط. إن استبدلتها [لتسجيل تقارير الأعطال،](#logging-crashes-on-the-server) فتأكد أنك ما زلت تستدعي `console.error`.

#### القيمة المُرجَعة {/*returns*/}

تُرجِع `resumeAndPrerenderToNodeStream` وعدًا (Promise):
- إذا نجح التصيير، يُحقَّق الوعد بكائن يحتوي على:
  - `prelude`: [تدفق Node.js](https://nodejs.org/api/stream.html) من HTML. يمكنك استخدامه لإرسال الاستجابة على دفعات، أو قراءة التدفق كاملًا إلى سلسلة.
  - `postponed`: كائن معتم يمكن تسلسله بصيغة JSON ويُمرَّر إلى [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) أو [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) إذا أُوقِف استدعاء `resumeAndPrerenderToNodeStream`.
- إذا فشل التصيير، يُرفَض الوعد. [استخدم ذلك لإخراج غلاف احتياطي.](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-inside-the-shell)

#### ملاحظات مهمة {/*caveats*/}

`nonce` ليس خيارًا متاحًا أثناء التصيير المسبق. يجب أن تكون قيم `nonce` فريدة لكل طلب، وإن استخدمتها لتأمين التطبيق عبر [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) فمن غير المناسب وغير الآمن تضمين قيمة الـ nonce في التصيير المسبق نفسه.

<Note>

### متى أستخدم `resumeAndPrerenderToNodeStream`؟ {/*when-to-use-prerender*/}

تُستخدم الواجهة الساكنة `resumeAndPrerenderToNodeStream` لتوليد HTML من جانب الخادم بشكل ساكن (SSG). على عكس `renderToString`، تنتظر `resumeAndPrerenderToNodeStream` تحميل كل البيانات قبل أن تُحقِّق الوعد. لذلك تناسب توليد HTML ساكن لصفحة كاملة، بما في ذلك البيانات التي تُجلب عبر Suspense. لبث المحتوى أثناء تحمّله، استخدم واجهة SSR تدعم البث مثل [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream).

يمكن إيقاف `resumeAndPrerenderToNodeStream` ثم متابعته لاحقًا إما باستدعاء `resumeAndPrerenderToNodeStream` آخر أو بـ `resumeToPipeableStream` لدعم التصيير المسبق الجزئي.

</Note>

---

## الاستخدام {/*usage*/}

### مطالعة إضافية {/*further-reading*/}

تتصرف `resumeAndPrerenderToNodeStream` بشكل مشابه لـ [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) لكنها تُستخدم لمتابعة عملية تصيير مسبق بدأت سابقًا ثم أُوقِفت.
لمزيد من المعلومات حول استئناف شجرة مُسبَقة التصيير، راجع [توثيق `resume`](/reference/react-dom/server/resume#resuming-a-prerender).
