---
title: "resumeAndPrerender (استئناف التصيير المسبق)"
---

<Intro>

تُكمِل الدالة `resumeAndPrerender` شجرة React مُسبَقة التصيير إلى HTML ساكن باستخدام [تدفق ويب (Web Stream)](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

```js
const { prelude, postponed } = await resumeAndPrerender(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

تعتمد هذه الواجهة على [تدفقات الويب (Web Streams).](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) في Node.js استخدم [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) بدلًا منها.

</Note>

---

## مرجع {/*reference*/}

### `resumeAndPrerender(reactNode, postponedState, options?)` {/*resumeandprerender*/}

استدعِ `resumeAndPrerender` لمتابعة شجرة React مُسبَقة التصيير إلى سلسلة HTML ساكنة.

```js
import { resumeAndPrerender } from 'react-dom/static';
import { getPostponedState } from 'storage';

async function handler(request, response) {
  const postponedState = getPostponedState(request);
  const { prelude } = await resumeAndPrerender(<App />, postponedState, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

على العميل، استدعِ [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) لتفعيل التفاعل مع HTML المُولَّد على الخادم.

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `reactNode`: عقدة React التي استدعيت معها `prerender` (أو استدعاء `resumeAndPrerender` سابق). مثلًا عنصر JSX مثل `<App />`. يُفترض أن تمثل المستند بالكامل، لذا يجب أن يصيّر مكوّن `App` وسم `<html>`.
* `postponedState`: الكائن المعتم `postponed` المُرجَع من [واجهة تصيير مسبق](/reference/react-dom/static/index)، بعد تحميله من مكان تخزينه (مثلًا Redis أو ملف أو S3).
* **اختياري** `options`: كائن يحوي خيارات البث.
  * **اختياري** `signal`: [إشارة إلغاء (abort signal)](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) تسمح لك [بإيقاف تصيير الخادم](#aborting-server-rendering) وتصيير الباقي على العميل.
  * **اختياري** `onError`: دالة استدعاء تُنفَّذ عند حدوث خطأ على الخادم، سواء كان [قابلاً للاسترداد](#recovering-from-errors-outside-the-shell) أو [غير قابل للاسترداد.](#recovering-from-errors-inside-the-shell) افتراضيًا تستدعي `console.error` فقط. إن استبدلتها [لتسجيل تقارير الأعطال،](#logging-crashes-on-the-server) فتأكد أنك ما زلت تستدعي `console.error`.

#### القيمة المُرجَعة {/*returns*/}

تُرجِع `resumeAndPrerender` وعدًا (Promise):
- إذا نجح التصيير، يُحقَّق الوعد بكائن يحتوي على:
  - `prelude`: [تدفق ويب (Web Stream)](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) من HTML. يمكنك استخدامه لإرسال الاستجابة على دفعات، أو قراءة التدفق كاملًا إلى سلسلة.
  - `postponed`: كائن معتم يمكن تسلسله بصيغة JSON ويُمرَّر إلى [`resume`](/reference/react-dom/server/resume) أو [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) إذا أُوقِف استدعاء `resumeAndPrerender`.
- إذا فشل التصيير، يُرفَض الوعد. [استخدم ذلك لإخراج غلاف احتياطي.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)

#### ملاحظات مهمة {/*caveats*/}

`nonce` ليس خيارًا متاحًا أثناء التصيير المسبق. يجب أن تكون قيم `nonce` فريدة لكل طلب، وإن استخدمتها لتأمين التطبيق عبر [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) فمن غير المناسب وغير الآمن تضمين قيمة الـ nonce في التصيير المسبق نفسه.

<Note>

### متى أستخدم `resumeAndPrerender`؟ {/*when-to-use-prerender*/}

تُستخدم الواجهة الساكنة `resumeAndPrerender` لتوليد HTML من جانب الخادم بشكل ساكن (SSG). على عكس `renderToString`، تنتظر `resumeAndPrerender` تحميل كل البيانات قبل أن تُحقِّق الوعد. لذلك تناسب توليد HTML ساكن لصفحة كاملة، بما في ذلك البيانات التي تُجلب عبر Suspense. لبث المحتوى أثناء تحمّله، استخدم واجهة SSR تدعم البث مثل [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream).

يمكن إيقاف `resumeAndPrerender` ثم متابعته لاحقًا إما باستدعاء `resumeAndPrerender` آخر أو بـ `resume` لدعم التصيير المسبق الجزئي.

</Note>

---

## الاستخدام {/*usage*/}

### مطالعة إضافية {/*further-reading*/}

تتصرف `resumeAndPrerender` بشكل مشابه لـ [`prerender`](/reference/react-dom/static/prerender) لكنها تُستخدم لمتابعة عملية تصيير مسبق بدأت سابقًا ثم أُوقِفت.
لمزيد من المعلومات حول استئناف شجرة مُسبَقة التصيير، راجع [توثيق `resume`](/reference/react-dom/server/resume#resuming-a-prerender).
