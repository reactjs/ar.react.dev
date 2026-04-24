---
title: renderToPipeableStream
---

<Intro>

`renderToPipeableStream` يصيّر شجرة React إلى [تيار Node.js](https://nodejs.org/api/stream.html) قابل للربط بالأنابيب (pipeable).

```js
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

هذه الواجهة خاصة بـ Node.js. البيئات التي تدعم [تيارات الويب،](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) مثل Deno وبيئات الحافة الحديثة، يجب أن تستخدم [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) بدلاً من ذلك.

</Note>

---

## المرجع {/*reference*/}

### `renderToPipeableStream(reactNode, options?)` {/*rendertopipeablestream*/}

استدعِ `renderToPipeableStream` لتصيير شجرة React كـ HTML في [تيار Node.js.](https://nodejs.org/api/stream.html#writable-streams)

```js
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

على العميل، استدعِ [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) لجعل HTML المُولَّد على الخادم تفاعلياً.

[انظر المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `reactNode`: عقدة React تريد تصييرها إلى HTML، مثل عنصر JSX مثل `<App />`. يُفترض أن تمثّل المستند بالكامل، لذا يجب أن يصيّر مكوّن `App` وسم `<html>`.

* `options` **اختياري**: كائن بخيارات التدفق.
  * `bootstrapScriptContent` **اختياري**: إذا حُدّد، تُوضَع هذه السلسلة داخل وسم `<script>` مضمّن.
  * `bootstrapScripts` **اختياري**: مصفوفة عناوين URL نصية لوسوم `<script>` تُصدَر في الصفحة. استخدمها لتضمين `<script>` الذي يستدعي [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) احذفها إذا لم ترد تشغيل React على العميل إطلاقاً.
  * `bootstrapModules` **اختياري**: مثل `bootstrapScripts`، لكن يُصدِر [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) بدلاً من ذلك.
  * `identifierPrefix` **اختياري**: بادئة نصية يستخدمها React للمعرّفات التي يولّدها [`useId`.](/reference/react/useId) مفيدة لتجنّب التعارض عند عدة جذور في الصفحة. يجب أن تطابق البادئة المُمرَّرة إلى [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * `namespaceURI` **اختياري**: سلسلة [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) الجذر للتيار. الافتراضي HTML العادي. مرّر `'http://www.w3.org/2000/svg'` لـ SVG أو `'http://www.w3.org/1998/Math/MathML'` لـ MathML.
  * `nonce` **اختياري**: سلسلة [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) للسماح بالنصوص ضمن [`script-src` في Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * `onAllReady` **اختياري**: دالة استدعاء تُنفَّذ عند اكتمال كل التصيير، بما فيه [الغلاف](#specifying-what-goes-into-the-shell) وكل [المحتوى الإضافي.](#streaming-more-content-as-it-loads) يمكنك استخدامها بدلاً من `onShellReady` [لمحركات الزحف والتوليد الثابت.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) إذا بدأت التدفق هنا، لن يحدث تحميل تدريجي. سيحتوي التيار على HTML النهائي.
  * `onError` **اختياري**: دالة استدعاء تُنفَّذ عند أي خطأ على الخادم، سواء كان [قابلاً للاسترداد](#recovering-from-errors-outside-the-shell) أو [غير ذلك.](#recovering-from-errors-inside-the-shell) افتراضياً، تستدعي `console.error` فقط. إذا غيّرتها [لتسجيل تقارير الأعطال،](#logging-crashes-on-the-server) فتأكد أنك ما زلت تستدعي `console.error`. يمكنك أيضاً استخدامها [لضبط رمز الحالة](#setting-the-status-code) قبل إصدار الغلاف.
  * `onShellReady` **اختياري**: دالة استدعاء تُنفَّذ مباشرة بعد تصيير [الغلاف الأولي](#specifying-what-goes-into-the-shell). يمكنك [تعيين رمز الحالة](#setting-the-status-code) واستدعاء `pipe` هنا لبدء التدفق. سيواصل React [تدفّق المحتوى الإضافي](#streaming-more-content-as-it-loads) بعد الغلاف مع وسوم `<script>` مضمّنة تستبدل بدائل التحميل في HTML بالمحتوى.
  * `onShellError` **اختياري**: دالة استدعاء تُنفَّذ إذا حدث خطأ أثناء تصيير الغلاف الأولي. تستقبل الخطأ كوسيط. لم يُصدَر أي بايت من التيار بعد، ولن تُستدعى `onShellReady` ولا `onAllReady`، لذا يمكنك [إخراج غلاف HTML احتياطي.](#recovering-from-errors-inside-the-shell)
  * `progressiveChunkSize` **اختياري**: عدد البايتات في القطعة. [اقرأ المزيد عن الافتراضي.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)


#### العائدات {/*returns*/}

يعيد `renderToPipeableStream` كائناً بطريقتين:

* `pipe` يخرج HTML إلى [تيار Node.js للكتابة](https://nodejs.org/api/stream.html#writable-streams) المُمرَّر. استدعِ `pipe` داخل `onShellReady` لتفعيل التدفق، أو داخل `onAllReady` لمحركات الزحف والتوليد الثابت.
* `abort` يتيح لك [إيقاف التصيير على الخادم](#aborting-server-rendering) وتصيير الباقي على العميل.

---

## الاستخدام {/*usage*/}

### تصيير شجرة React كـ HTML في تيار Node.js {/*rendering-a-react-tree-as-html-to-a-nodejs-stream*/}

استدعِ `renderToPipeableStream` لتصيير شجرة React كـ HTML في [تيار Node.js:](https://nodejs.org/api/stream.html#writable-streams)

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { renderToPipeableStream } from 'react-dom/server';

// صيغة معالج المسار تعتمد على إطار عمل الواجهة الخلفية لديك
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

إلى جانب <CodeStep step={1}>المكوّن الجذري</CodeStep>، تحتاج إلى تقديم قائمة <CodeStep step={2}>مسارات `<script>` للتمهيد (bootstrap)</CodeStep>. يجب أن يعيد مكوّنك الجذري **المستند بالكامل بما فيه وسم `<html>` الجذري.**

على سبيل المثال، قد يبدو هكذا:

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

سيحقن React [نوع المستند (doctype)](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) ووسوم <CodeStep step={2}>`<script>` للتمهيد</CodeStep> في تيار HTML الناتج:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML from your components ... -->
</html>
<script src="/main.js" async=""></script>
```

على العميل، يجب أن [يرطّب سكربت التمهيد المستند `document` بالكامل باستدعاء `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

يُرفق ذلك مستمعي الأحداث بـ HTML المُولَّد على الخادم ويجعله تفاعلياً.

<DeepDive>

#### قراءة مسارات أصول CSS وJS من مخرجات البناء {/*reading-css-and-js-asset-paths-from-the-build-output*/}

غالباً ما تُجزَّأ عناوين الأصول النهائية (مثل ملفات JavaScript وCSS) بعد البناء. فبدلاً من `styles.css` قد تحصل على `styles.123456.css`. تجزئة أسماء ملفات الأصول الثابتة تضمن أن كل بناء مميز لنفس الأصل يحصل على اسمه الخاص. يفيد ذلك لأنه يتيح تفعيل التخزين المؤقت طويل الأمد بأمان: ملف باسم معيّن لن يتغيّر محتواه.

لكن إذا لم تعرف عناوين الأصول إلا بعد البناء، لا يمكنك وضعها في الشيفرة المصدرية. فمثلاً تثبيت `"/styles.css"` في JSX كما سابقاً لن ينجح. لإبقائها خارج الشيفرة المصدرية، يمكن لمكوّنك الجذري قراءة الأسماء الحقيقية من خريطة تُمرَّر كخاصية:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        ...
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
        ...
      </head>
      ...
    </html>
  );
}
```

على الخادم، صيّر `<App assetMap={assetMap} />` ومرّر `assetMap` مع عناوين الأصول:

```js {1-5,8,9}
// ستحتاج للحصول على هذا JSON من أداة البناء، مثلاً قراءته من مخرجات البناء.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

بما أن الخادم يصيّر الآن `<App assetMap={assetMap} />`، تحتاج تصييره مع `assetMap` على العميل أيضاً لتجنّب أخطاء الترطيب. يمكنك تسلسل `assetMap` وتمريره للعميل هكذا:

```js {9-10}
// ستحتاج للحصول على هذا JSON من أداة البناء.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    // انتبه: stringify() هنا آمِن لأن هذه البيانات ليست من إنشاء المستخدم.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

في المثال أعلاه، يضيف خيار `bootstrapScriptContent` وسم `<script>` مضمّناً إضافياً يضبط المتغير العام `window.assetMap` على العميل. يتيح ذلك لشيفرة العميل قراءة نفس `assetMap`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

يصيّر العميل والخادم `App` مع نفس خاصية `assetMap`، فلا تحدث أخطاء ترطيب.

</DeepDive>

---

### تدفّق المزيد من المحتوى أثناء تحمّله {/*streaming-more-content-as-it-loads*/}

يتيح التدفّق للمستخدم رؤية المحتوى قبل اكتمال كل البيانات على الخادم. فمثلاً صفحة ملف شخصي تعرض غلافاً وشريطاً جانبياً بالأصدقاء والصور وقائمة منشورات:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Posts />
    </ProfileLayout>
  );
}
```

تخيّل أن تحميل بيانات `<Posts />` يستغرق وقتاً. مثالياً، تريد إظهار بقية صفحة الملف دون انتظار المنشورات. لفعل ذلك، [لفّ `Posts` داخل حد `<Suspense>`:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

```js {9,11}
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

يخبر React أن يبدأ تدفّق HTML قبل أن تُحمَّل بيانات `Posts`. يرسل React أولاً HTML لـ fallback التحميل (`PostsGlimmer`)، ثم عند اكتمال تحميل بيانات `Posts` يرسل بقية HTML مع وسم `<script>` مضمّن يستبدل fallback التحميل بذلك HTML. من منظور المستخدم، تظهر الصفحة أولاً مع `PostsGlimmer` ثم تُستبدل بـ `Posts`.

يمكنك [تداخل حدود `<Suspense>`](/reference/react/Suspense#revealing-nested-content-as-it-loads) لمزيد من دقّة تسلسل التحميل:

```js {5,13}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

في هذا المثال، يمكن لـ React بدء تدفّق الصفحة أبكر. يجب أن يكتمل تصيير `ProfileLayout` و`ProfileCover` أولاً لأنهما غير ملفوفين بأي حد `<Suspense>`. لكن إذا احتاج `Sidebar` أو `Friends` أو `Photos` لتحميل بيانات، سيرسل React HTML لـ fallback `BigSpinner` بدلاً من ذلك. ثم مع توفر المزيد من البيانات، يستمر كشف المحتوى حتى يظهر كله.

لا يحتاج التدفّق لانتظار تحمّل React في المتصفح ولا لتفاعلية تطبيقك. سيُكشَف محتوى HTML من الخادم تدريجياً قبل تحمّل أي من وسوم `<script>`.

[اقرأ المزيد عن آلية تدفّق HTML.](https://github.com/reactwg/react-18/discussions/37)

<Note>

**مصادر بيانات مفعّلة لـ Suspense فقط هي التي تُفعّل مكوّن Suspense.** وتشمل:

- جلب البيانات مع أطر تدعم Suspense مثل [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) و[Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- تحميل شيفرة المكوّن كسولاً بـ [`lazy`](/reference/react/lazy)
- قراءة قيمة وعد (Promise) بـ [`use`](/reference/react/use)

Suspense **لا** يكتشف الجلب داخل Effect أو معالج حدث.

طريقة تحميل البيانات في مكوّن `Posts` أعلاه تعتمد على إطار عملك. إذا استخدمت إطاراً يدعم Suspense، ستجد التفاصيل في توثيق جلب البيانات لديه.

جلب البيانات مع Suspense دون إطار راسخ ليس مدعوماً بعد. متطلبات تنفيذ مصدر بيانات مفعّل لـ Suspense غير مستقرة وغير موثّقة. ستُصدَر واجهة رسمية لدمج مصادر البيانات مع Suspense في إصدار مستقبلي من React.

</Note>

---

### تحديد ما يدخل في الغلاف {/*specifying-what-goes-into-the-shell*/}

الجزء من تطبيقك خارج أي حدود `<Suspense>` يُسمّى *الغلاف (shell):*

```js {3-5,13,14}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

يحدد أبكر حالة تحميل قد يراها المستخدم:

```js {3-5,13}
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

إذا لففت التطبيق كله داخل حد `<Suspense>` عند الجذر، سيحتوي الغلاف على ذلك الدوار فقط. لكن ذلك تجربة مستخدم سيئة لأن شاشة دوار كبير قد تبدو أبطأ وأكثر إزعاجاً من انتظار قليل ثم رؤية التخطيط الحقيقي. لذلك عادةً تضع حدود `<Suspense>` بحيث يبدو الغلاف *صغيراً لكن مكتملاً*—مثل هيكل تخطيط الصفحة.

تُستدعى `onShellReady` عند اكتمال تصيير الغلاف بالكامل. عادةً تبدأ التدفق حينها:

```js {3-6}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

عند استدعاء `onShellReady`، قد تكون مكوّنات داخل `<Suspense>` المتداخلة ما زالت تحمّل بياناتها.

---

### تسجيل الأعطال على الخادم {/*logging-crashes-on-the-server*/}

افتراضياً، تُسجَّل كل أخطاء الخادم في الطرفية. يمكنك تجاوز ذلك لتسجيل تقارير أعطال:

```js {7-10}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

إذا وفّرت تنفيذاً مخصصاً لـ `onError`، لا تنسَ أيضاً تسجيل الأخطاء في الطرفية كما أعلاه.

---

### التعافي من أخطاء داخل الغلاف {/*recovering-from-errors-inside-the-shell*/}

في هذا المثال، يضم الغلاف `ProfileLayout` و`ProfileCover` و`PostsGlimmer`:

```js {3-5,7-8}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

إذا حدث خطأ أثناء تصيير تلك المكوّنات، لن يملك React HTMLاً مفيداً ليرسله للعميل. تجاوز `onShellError` لإرسال HTML احتياطي لا يعتمد على التصيير على الخادم كملاذ أخير:

```js {7-11}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

عند خطأ أثناء توليد الغلاف، تُستدعى `onError` و`onShellError` معاً. استخدم `onError` للإبلاغ عن الخطأ و`onShellError` لإرسال مستند HTML احتياطي. لا يلزم أن يكون HTML الاحتياطي صفحة خطأ؛ يمكنك تضمين غلاف بديل يصيّر تطبيقك على العميل فقط.

---

### التعافي من أخطاء خارج الغلاف {/*recovering-from-errors-outside-the-shell*/}

في هذا المثال، مكوّن `<Posts />` ملفوف في `<Suspense>` فهو *ليس* جزءاً من الغلاف:

```js {6}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

إذا حدث خطأ في `Posts` أو داخله، ستحاول React [التعافي منه:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

1. تُصدِر fallback التحميل لأقرب حد `<Suspense>` (`PostsGlimmer`) في HTML.
2. تتخلّى عن محاولة تصيير محتوى `Posts` على الخادم بعد ذلك.
3. عند تحمّل JavaScript على العميل، تعيد React *محاولة* تصيير `Posts` على العميل.

إذا فشلت إعادة تصيير `Posts` على العميل *أيضاً*، ترمي React الخطأ على العميل. ككل الأخطاء أثناء التصيير، [أقرب حد خطأ أبوي](/reference/react/Component#static-getderivedstatefromerror) يحدد كيفية عرض الخطأ للمستخدم. عملياً، يرى المستخدم مؤشر تحميل حتى يتأكد أن الخطأ غير قابل للاسترداد.

إذا نجحت إعادة تصيير `Posts` على العميل، يُستبدل fallback الخادم بمخرجات التصيير على العميل. لن يعلم المستخدم أنه كان هناك خطأ على الخادم. لكن تُستدعى `onError` على الخادم و[`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) على العميل لتبلغك بالخطأ.

---

### تعيين رمز الحالة {/*setting-the-status-code*/}

التدفّق يطرح مفاضلة. تريد بدء تدفّق الصفحة مبكراً قدر الإمكان ليرى المستخدم المحتوى أسرع. لكن بعد بدء التدفّق، لا يمكنك تغيير رمز حالة الاستجابة.

بـ [تقسيم تطبيقك](#specifying-what-goes-into-the-shell) إلى الغلاف (فوق كل حدود `<Suspense>`) وبقية المحتوى، حللت جزءاً من المشكلة. إذا أخطأ الغلاف، تحصل على `onShellError` لتعيين رمز خطأ. وإلا فتعلم أن التطبيق قد يتعافى على العميل، فيمكنك إرسال «OK».

```js {4}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

إذا رمى مكوّن *خارج* الغلاف (أي داخل حد `<Suspense>`) خطأً، لن توقف React التصيير. يعني ذلك أن `onError` تُستدعى، لكنك ما زلت تحصل على `onShellReady` لا `onShellError`، لأن React ستحاول التعافي على العميل، [كما وُصف أعلاه.](#recovering-from-errors-outside-the-shell)

لكن إذا أردت، يمكنك استخدام حدوث خطأ لتعيين رمز الحالة:

```js {1,6,16}
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

يلتقط ذلك أخطاء خارج الغلاف حدثت أثناء توليد محتوى الغلاف الأولي فقط، فليس شاملاً. إذا كان معرفة وقوع خطأ لمحتوى ما حاسماً، انقله إلى الغلاف.

---

### التعامل مع أخطاء مختلفة بطرق مختلفة {/*handling-different-errors-in-different-ways*/}

يمكنك [إنشاء صنف فرعي من `Error`](https://javascript.info/custom-errors) واستخدام [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) للتحقق من نوع الخطأ. فمثلاً عرّف `NotFoundError` وارمه من مكوّنك. ثم يمكن لدوال `onError` و`onShellReady` و`onShellError` أن تتصرّف باختلاف حسب نوع الخطأ:

```js {2,4-14,19,24,30}
let didError = false;
let caughtError = null;

function getStatusCode() {
  if (didError) {
    if (caughtError instanceof NotFoundError) {
      return 404;
    } else {
      return 500;
    }
  } else {
    return 200;
  }
}

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = getStatusCode();
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
   response.statusCode = getStatusCode();
   response.setHeader('content-type', 'text/html');
   response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    didError = true;
    caughtError = error;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

تذكّر أنه بعد إصدار الغلاف وبدء التدفّق، لا يمكنك تغيير رمز الحالة.

---

### انتظار اكتمال المحتوى لمحركات الزحف والتوليد الثابت {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

التدفّق يحسّن تجربة المستخدم لأنه يرى المحتوى مع توفّره.

لكن عند زيارة زاحف لصفحتك، أو عند توليد الصفحات وقت البناء، قد تريد انتظار كل المحتوى ثم إخراج HTML النهائي بدلاً من الكشف التدريجي.

يمكنك الانتظار حتى يُحمَّل كل المحتوى باستدعاء `onAllReady`:


```js {2,7,11,18-24}
let didError = false;
let isCrawler = // ... depends on your bot detection strategy ...

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    if (!isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onAllReady() {
    if (isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);      
    }
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

يحصل الزائر العادي على تيار محمّل تدريجياً. يحصل الزاحف على HTML النهائي بعد تحمّل كل البيانات. لكن ذلك يعني أن الزاحف ينتظر *كل* البيانات، وبعضها قد يكون بطيئاً أو يخطئ. حسب تطبيقك، قد ترسل الغلاف للزواحف أيضاً.

---

### إيقاف التصيير على الخادم {/*aborting-server-rendering*/}

يمكنك إجبار التصيير على الخادم على «التخلّي» بعد مهلة:

```js {1,5-7}
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

ستفرغ React بقية بدائل التحميل كـ HTML، وستحاول تصيير الباقي على العميل.
