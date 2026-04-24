---
title: "prerenderToNodeStream (التصيير المسبق إلى تدفق Node)"
---

<Intro>

تُصيِّر الدالة `prerenderToNodeStream` شجرة React إلى HTML ساكن باستخدام [تدفق Node.js (Node.js Stream).](https://nodejs.org/api/stream.html)

```js
const {prelude, postponed} = await prerenderToNodeStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

هذه الواجهة خاصة بـ Node.js. البيئات التي تدعم [تدفقات الويب (Web Streams)،](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) مثل Deno وبعض بيئات الحافة الحديثة، يفضّل فيها استخدام [`prerender`](/reference/react-dom/static/prerender) بدلًا منها.

</Note>

---

## مرجع {/*reference*/}

### `prerenderToNodeStream(reactNode, options?)` {/*prerender*/}

استدعِ `prerenderToNodeStream` لتصيير تطبيقك إلى HTML ساكن.

```js
import { prerenderToNodeStream } from 'react-dom/static';

// The route handler syntax depends on your backend framework
app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js'],
  });

  response.setHeader('Content-Type', 'text/plain');
  prelude.pipe(response);
});
```

على العميل، استدعِ [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) لتفعيل التفاعل مع HTML المُولَّد على الخادم.

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `reactNode`: عقدة React تريد تصييرها إلى HTML. مثلًا عنصر JSX مثل `<App />`. يُفترض أن تمثل المستند بالكامل، لذا يجب أن يصيّر مكوّن `App` وسم `<html>`.

* **اختياري** `options`: كائن يحوي خيارات التوليد الساكن.
  * **اختياري** `bootstrapScriptContent`: إن وُجد، تُوضَع هذه السلسلة داخل وسم `<script>` مضمَّن.
  * **اختياري** `bootstrapScripts`: مصفوفة من عناوين URL كسلاسل لوسوم `<script>` تُصدَر في الصفحة. استخدمها لتضمين `<script>` الذي يستدعي [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) احذفها إن لم ترد تشغيل React على العميل إطلاقًا.
  * **اختياري** `bootstrapModules`: مثل `bootstrapScripts`، لكن يُصدَر [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) بدلًا من ذلك.
  * **اختياري** `identifierPrefix`: بادئة نصية يستخدمها React للمعرّفات التي يولّدها [`useId`.](/reference/react/useId) مفيدة لتجنّب التعارض عند وجود جذور متعددة في الصفحة. يجب أن تكون نفس البادئة المُمرَّرة إلى [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **اختياري** `namespaceURI`: سلسلة تحوي [مساحة الأسماء الجذرية (namespace URI)](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) للتدفق. الافتراضي هو HTML العادي. مرّر `'http://www.w3.org/2000/svg'` لـ SVG أو `'http://www.w3.org/1998/Math/MathML'` لـ MathML.
  * **اختياري** `onError`: دالة استدعاء تُنفَّذ عند حدوث خطأ على الخادم، سواء كان [قابلاً للاسترداد](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-outside-the-shell) أو [غير قابل للاسترداد.](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-inside-the-shell) افتراضيًا تستدعي `console.error` فقط. إن استبدلتها [لتسجيل تقارير الأعطال،](/reference/react-dom/server/renderToPipeableStream#logging-crashes-on-the-server) فتأكد أنك ما زلت تستدعي `console.error`. يمكنك أيضًا استخدامها [لضبط رمز الحالة](/reference/react-dom/server/renderToPipeableStream#setting-the-status-code) قبل إصدار الغلاف.
  * **اختياري** `progressiveChunkSize`: عدد البايتات في كل مقطع. [اقرأ المزيد عن الافتراضي.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  * **اختياري** `signal`: [إشارة إلغاء (abort signal)](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) تسمح لك [بإيقاف التصيير المسبق](#aborting-prerendering) وتصيير الباقي على العميل.

#### القيمة المُرجَعة {/*returns*/}

تُرجِع `prerenderToNodeStream` وعدًا (Promise):
- إذا نجح التصيير، يُحقَّق الوعد بكائن يحتوي على:
  - `prelude`: [تدفق Node.js](https://nodejs.org/api/stream.html) من HTML. يمكنك استخدامه لإرسال الاستجابة على دفعات، أو قراءة التدفق كاملًا إلى سلسلة.
  - `postponed`: كائن معتم يمكن تسلسله بصيغة JSON ويُمرَّر إلى [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) إذا لم تنتهِ `prerenderToNodeStream`. وإلا `null` يدل على أن `prelude` يحتوي كل المحتوى ولا حاجة لاستدعاء resume.
- إذا فشل التصيير، يُرفَض الوعد. [استخدم ذلك لإخراج غلاف احتياطي.](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-inside-the-shell)

#### ملاحظات مهمة {/*caveats*/}

`nonce` ليس خيارًا متاحًا أثناء التصيير المسبق. يجب أن تكون قيم `nonce` فريدة لكل طلب، وإن استخدمتها لتأمين التطبيق عبر [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) فمن غير المناسب وغير الآمن تضمين قيمة الـ nonce في التصيير المسبق نفسه.

<Note>

### متى أستخدم `prerenderToNodeStream`؟ {/*when-to-use-prerender*/}

تُستخدم الواجهة الساكنة `prerenderToNodeStream` لتوليد HTML من جانب الخادم بشكل ساكن (SSG). على عكس `renderToString`، تنتظر `prerenderToNodeStream` تحميل كل البيانات قبل أن تُحقِّق الوعد. لذلك تناسب توليد HTML ساكن لصفحة كاملة، بما في ذلك البيانات التي تُجلب عبر Suspense. لبث المحتوى أثناء تحمّله، استخدم واجهة SSR تدعم البث مثل [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream).

يمكن إيقاف `prerenderToNodeStream` ثم متابعته لاحقًا بـ `resumeToPipeableStream` لدعم التصيير المسبق الجزئي.

</Note>

---

## الاستخدام {/*usage*/}

### تصيير شجرة React إلى تدفق HTML ساكن {/*rendering-a-react-tree-to-a-stream-of-static-html*/}

استدعِ `prerenderToNodeStream` لتصيير شجرة React إلى HTML ساكن في صورة [تدفق Node.js](https://nodejs.org/api/stream.html):

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { prerenderToNodeStream } from 'react-dom/static';

// The route handler syntax depends on your backend framework
app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js'],
  });

  response.setHeader('Content-Type', 'text/plain');
  prelude.pipe(response);
});
```

إلى جانب <CodeStep step={1}>مكوّن الجذر</CodeStep>، تحتاج إلى قائمة <CodeStep step={2}>مسارات `<script>` للتهيئة (bootstrap)</CodeStep>. يجب أن يُرجِع مكوّن الجذر **المستند بالكامل بما في ذلك وسم `<html>` الجذري.**

مثلًا قد يبدو هكذا:

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

ستحقن React [DOCTYPE](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) ووسوم <CodeStep step={2}>`<script>` للتهيئة</CodeStep> في تدفق HTML الناتج:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML from your components ... -->
</html>
<script src="/main.js" async=""></script>
```

على العميل، يجب أن يقوم سكربت التهيئة [بترطيب المستند `document` بالكامل عبر استدعاء `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

يُرفِق هذا مستمعي الأحداث بـ HTML الساكن المُولَّد على الخادم ويجعله تفاعليًا.

<DeepDive>

#### قراءة مسارات أصول CSS وJS من مخرجات البناء {/*reading-css-and-js-asset-paths-from-the-build-output*/}

غالبًا ما تُجزَّأ عناوين الأصول النهائية (مثل ملفات JavaScript وCSS) بعد البناء. مثلًا بدل `styles.css` قد تحصل على `styles.123456.css`. تجزئة أسماء ملفات الأصول الساكنة تضمن أن كل بناء مختلف لنفس الأصل يحصل على اسم ملف مختلف. هذا مفيد لأنه يتيح تفعيل التخزين المؤقت طويل الأمد بأمان للأصول الساكنة: ملف باسم معيّن لن يتغيّر محتواه.

لكن إن لم تعرف عناوين الأصول إلا بعد البناء، لا يمكنك وضعها في الشيفرة المصدرية. مثلًا تثبيت `"/styles.css"` في JSX كما سابقًا لن ينجح. لإبقائها خارج الشيفرة المصدرية، يمكن لمكوّن الجذر قراءة الأسماء الحقيقية من خريطة تُمرَّر كخاصية (prop):

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        <title>My app</title>
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
      </head>
      ...
    </html>
  );
}
```

على الخادم، صيِّر `<App assetMap={assetMap} />` ومرّر `assetMap` مع عناوين الأصول:

```js {1-5,8,9}
// You'd need to get this JSON from your build tooling, e.g. read it from the build output.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: [assetMap['main.js']]
  });

  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
});
```

بما أن الخادم يصيّر الآن `<App assetMap={assetMap} />`، تحتاج لتصييره مع `assetMap` على العميل أيضًا لتجنّب أخطاء الترطيب. يمكنك تسلسل `assetMap` وتمريره للعميل هكذا:

```js {9-10}
// You'd need to get this JSON from your build tooling.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    // Careful: It's safe to stringify() this because this data isn't user-generated.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['main.js']],
  });

  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
});
```

في المثال أعلاه، يضيف خيار `bootstrapScriptContent` وسم `<script>` مضمَّنًا إضافيًا يضبط المتغيّر العام `window.assetMap` على العميل. وهذا يُمكِّن شيفرة العميل من قراءة نفس `assetMap`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

العميل والخادم يصيّران `App` بنفس خاصية `assetMap`، فلا تحدث أخطاء ترطيب.

</DeepDive>

---

### تصيير شجرة React إلى سلسلة HTML ساكنة {/*rendering-a-react-tree-to-a-string-of-static-html*/}

استدعِ `prerenderToNodeStream` لتصيير تطبيقك إلى سلسلة HTML ساكنة:

```js
import { prerenderToNodeStream } from 'react-dom/static';

async function renderToString() {
  const {prelude} = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js']
  });

  return new Promise((resolve, reject) => {
    let data = '';
    prelude.on('data', chunk => {
      data += chunk;
    });
    prelude.on('end', () => resolve(data));
    prelude.on('error', reject);
  });
}
```

يُنتِج هذا المخرجات HTML الأولية غير التفاعلية من مكوّنات React. على العميل، ستحتاج لاستدعاء [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) لـ *ترطيب* HTML المُولَّد على الخادم وجعله تفاعليًا.

---

### انتظار تحميل كل البيانات {/*waiting-for-all-data-to-load*/}

تنتظر `prerenderToNodeStream` تحميل كل البيانات قبل إنهاء توليد HTML الساكن وتحقيق الوعد. مثلًا صفحة ملف شخصي تعرض غلافًا، شريطًا جانبيًا فيه الأصدقاء والصور، وقائمة منشورات:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

تخيّل أن `<Posts />` يحتاج لتحميل بيانات تستغرق وقتًا. مثاليًا تريد انتظار انتهاء المنشورات لتُضمَّن في HTML. لذلك يمكنك استخدام Suspense للتعليق على البيانات، وستنتظر `prerenderToNodeStream` انتهاء المحتوى المعلّق قبل أن تُحقِّق إلى HTML الساكن.

<Note>

**مصادر البيانات المفعّلة لـ Suspense فقط هي التي تفعّل مكوّن Suspense.** منها:

- جلب البيانات مع أطر تدعم Suspense مثل [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) و [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- تحميل شيفرة المكوّن كسولًا عبر [`lazy`](/reference/react/lazy)
- قراءة قيمة وعد (Promise) عبر [`use`](/reference/react/use)

Suspense **لا** يكتشف الجلب داخل Effect أو معالج حدث.

طريقة تحميل البيانات في مكوّن `Posts` أعلاه تعتمد على إطار العمل. إن استخدمت إطارًا يدعم Suspense، ستجد التفاصيل في توثيق جلب البيانات لديه.

جلب البيانات المفعّل لـ Suspense دون إطار رأي محدد غير مدعوم بعد. متطلبات تنفيذ مصدر بيانات يدعم Suspense غير مستقرة وغير موثّقة. ستُصدَر واجهة رسمية لدمج مصادر البيانات مع Suspense في إصدار لاحق من React.

</Note>

---

### إيقاف التصيير المسبق {/*aborting-prerendering*/}

يمكنك إجبار التصيير المسبق على «التخلي» بعد مهلة زمنية:

```js {2-5,11}
async function renderToString() {
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort()
  }, 10000);

  try {
    // the prelude will contain all the HTML that was prerendered
    // before the controller aborted.
    const {prelude} = await prerenderToNodeStream(<App />, {
      signal: controller.signal,
    });
    //...
```

ستُضمَّن أي حدود Suspense بأطفال غير مكتملة في `prelude` بحالة الاحتياط (fallback).

يمكن استخدام ذلك للتصيير المسبق الجزئي مع [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) أو [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream).

## استكشاف الأعطال {/*troubleshooting*/}

### لا يبدأ تدفقي حتى يُصيَّر التطبيق بالكامل {/*my-stream-doesnt-start-until-the-entire-app-is-rendered*/}

استجابة `prerenderToNodeStream` تنتظر انتهاء تصيير التطبيق بالكامل، بما في ذلك انتظار حل كل حدود Suspense، قبل أن تُحقِّق. صُممت لتوليد المواقع ساكنًا (SSG) مسبقًا ولا تدعم بث المزيد من المحتوى أثناء تحمّله.

لبث المحتوى أثناء تحمّله، استخدم واجهة SSR تدعم البث مثل [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream).
