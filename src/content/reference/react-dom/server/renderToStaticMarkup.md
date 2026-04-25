---
title: renderToStaticMarkup
---

<Intro>

`renderToStaticMarkup` يصيّر شجرة React غير تفاعلية إلى سلسلة HTML.

```js
const html = renderToStaticMarkup(reactNode, options?)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `renderToStaticMarkup(reactNode, options?)` {/*rendertostaticmarkup*/}

على الخادم، استدعِ `renderToStaticMarkup` لتصيير تطبيقك إلى HTML.

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

ينتج مخرجات HTML غير تفاعلية من مكوّنات React.

[انظر المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `reactNode`: عقدة React تريد تصييرها إلى HTML، مثل عنصر JSX مثل `<Page />`.
* `options` **اختياري**: كائن لخيارات التصيير على الخادم.
  * `identifierPrefix` **اختياري**: بادئة نصية يستخدمها React للمعرّفات التي يولّدها [`useId`.](/reference/react/useId) مفيدة لتجنّب التعارض عند استخدام عدة جذور في الصفحة نفسها.

#### العائدات {/*returns*/}

سلسلة HTML.

#### ملاحظات {/*caveats*/}

* لا يمكن ترطيب مخرجات `renderToStaticMarkup` (hydration).

* دعم Suspense في `renderToStaticMarkup` محدود. إذا علّق مكوّن (suspend)، يرسل `renderToStaticMarkup` فوراً `fallback` الخاص به كـ HTML.

* يعمل `renderToStaticMarkup` في المتصفح، لكن استخدامه في شيفرة العميل غير مُوصى به. إذا احتجت تصيير مكوّن إلى HTML في المتصفح، [احصل على HTML بتصييره داخل عقدة DOM.](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)

---

## الاستخدام {/*usage*/}

### تصيير شجرة React غير تفاعلية كـ HTML في سلسلة {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}

استدعِ `renderToStaticMarkup` لتصيير تطبيقك إلى سلسلة HTML يمكنك إرسالها مع استجابة الخادم:

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';

// صيغة معالج المسار تعتمد على إطار عمل الواجهة الخلفية لديك
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

ينتج ذلك HTMLاً أولياً غير تفاعلي من مكوّنات React.

<Pitfall>

تصيّر هذه الطريقة **HTMLاً غير تفاعلي لا يمكن ترطيبه.** يفيد ذلك إذا أردت استخدام React كمولّد صفحات ثابت بسيط، أو عند تصيير محتوى ثابت بالكامل مثل رسائل البريد.

يجب أن تستخدم التطبيقات التفاعلية [`renderToString`](/reference/react-dom/server/renderToString) على الخادم و[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) على العميل.

</Pitfall>
