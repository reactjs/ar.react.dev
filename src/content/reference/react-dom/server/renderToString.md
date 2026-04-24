---
title: renderToString
---

<Pitfall>

`renderToString` لا يدعم التدفق (streaming) ولا انتظار البيانات. [اطلع على البدائل.](#alternatives)

</Pitfall>

<Intro>

`renderToString` يصيّر شجرة React إلى سلسلة HTML.

```js
const html = renderToString(reactNode, options?)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `renderToString(reactNode, options?)` {/*rendertostring*/}

على الخادم، استدعِ `renderToString` لتصيير تطبيقك إلى HTML.

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

على العميل، استدعِ [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) لجعل HTML المُولَّد على الخادم تفاعلياً.

[انظر المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `reactNode`: عقدة React تريد تصييرها إلى HTML، مثل عنصر JSX مثل `<App />`.

* `options` **اختياري**: كائن لخيارات التصيير على الخادم.
  * `identifierPrefix` **اختياري**: بادئة نصية يستخدمها React للمعرّفات التي يولّدها [`useId`.](/reference/react/useId) مفيدة لتجنّب التعارض عند استخدام عدة جذور في الصفحة نفسها. يجب أن تكون نفس البادئة المُمرَّرة إلى [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)

#### العائدات {/*returns*/}

سلسلة HTML.

#### ملاحظات {/*caveats*/}

* دعم Suspense في `renderToString` محدود. إذا علّق مكوّن، يرسل `renderToString` فوراً `fallback` الأقرب كـ HTML.

* يعمل `renderToString` في المتصفح، لكن استخدامه في شيفرة العميل [غير مُوصى به.](#removing-rendertostring-from-the-client-code)

---

## الاستخدام {/*usage*/}

### تصيير شجرة React كـ HTML في سلسلة {/*rendering-a-react-tree-as-html-to-a-string*/}

استدعِ `renderToString` لتصيير تطبيقك إلى سلسلة HTML يمكنك إرسالها مع استجابة الخادم:

```js {5-6}
import { renderToString } from 'react-dom/server';

// صيغة معالج المسار تعتمد على إطار عمل الواجهة الخلفية لديك
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

ينتج ذلك HTMLاً أولياً غير تفاعلي من مكوّنات React. على العميل، ستحتاج إلى استدعاء [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) لـ *ترطيب* HTML المُولَّد على الخادم وجعله تفاعلياً.


<Pitfall>

`renderToString` لا يدعم التدفق ولا انتظار البيانات. [اطلع على البدائل.](#alternatives)

</Pitfall>

---

## البدائل {/*alternatives*/}

### الانتقال من `renderToString` إلى تصيير متدفّق على الخادم {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

يعيد `renderToString` سلسلة فوراً، لذا لا يدعم تدفّق المحتوى أثناء تحمّله.

عند الإمكان، ننصح بهذه البدائل الكاملة:

* إذا كنت تستخدم Node.js، استخدم [`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)
* إذا كنت تستخدم Deno أو بيئة حافة حديثة مع [تيارات الويب (Web Streams)](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)، استخدم [`renderToReadableStream`.](/reference/react-dom/server/renderToReadableStream)

يمكنك الاستمرار في استخدام `renderToString` إذا كانت بيئة خادمك لا تدعم التيارات.

---

### الانتقال من `renderToString` إلى توليد ثابت مسبق على الخادم {/*migrating-from-rendertostring-to-a-static-prerender-on-the-server*/}

يعيد `renderToString` سلسلة فوراً، لذا لا يدعم انتظار تحمّل البيانات لتوليد HTML ثابت.

ننصح بهذه البدائل الكاملة:

* إذا كنت تستخدم Node.js، استخدم [`prerenderToNodeStream`.](/reference/react-dom/static/prerenderToNodeStream)
* إذا كنت تستخدم Deno أو بيئة حافة حديثة مع [تيارات الويب](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)، استخدم [`prerender`.](/reference/react-dom/static/prerender)

يمكنك الاستمرار في استخدام `renderToString` إذا كانت بيئة توليد موقعك الثابت لا تدعم التيارات.

---

### إزالة `renderToString` من شيفرة العميل {/*removing-rendertostring-from-the-client-code*/}

أحياناً يُستخدَم `renderToString` على العميل لتحويل مكوّن إلى HTML.

```js {1-2}
// 🚩 غير ضروري: استخدام renderToString على العميل
import { renderToString } from 'react-dom/server';

const html = renderToString(<MyIcon />);
console.log(html); // مثلاً "<svg>...</svg>"
```

استيراد `react-dom/server` **على العميل** يزيد حجم الحزمة دون داعٍ ويجب تجنّبه. إذا احتجت تصيير مكوّن إلى HTML في المتصفح، استخدم [`createRoot`](/reference/react-dom/client/createRoot) واقرأ HTML من DOM:

```js
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<MyIcon />);
});
console.log(div.innerHTML); // مثلاً "<svg>...</svg>"
```

استدعاء [`flushSync`](/reference/react-dom/flushSync) ضروري ليُحدَّث DOM قبل قراءة خاصية [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML).

---

## حل المشكلات {/*troubleshooting*/}

### عند تعليق مكوّن، يحتوي HTML دائماً على fallback {/*when-a-component-suspends-the-html-always-contains-a-fallback*/}

`renderToString` لا يدعم Suspense بالكامل.

إذا علّق مكوّن (مثلاً لأنه مُعرَّف بـ [`lazy`](/reference/react/lazy) أو يجلب بيانات)، لن ينتظر `renderToString` حل محتواه. بدلاً من ذلك، يجد أقرب حد [`<Suspense>`](/reference/react/Suspense) فوقه ويصيّر خاصية `fallback` في HTML. لن يظهر المحتوى حتى تُحمَّل شيفرة العميل.

لحل ذلك، استخدم أحد [حلول التدفق المُوصى بها.](#alternatives) لتصيير الخادم، يمكنها تدفّق المحتوى على دفعات مع اكتماله على الخادم فيرى المستخدم الصفحة تُملأ تدريجياً قبل تحمّل شيفرة العميل. لتوليد موقع ثابت، يمكنها انتظار اكتمال كل المحتوى قبل توليد HTML الثابت.

