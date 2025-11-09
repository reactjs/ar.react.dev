````markdown
---
title: renderToStaticMarkup
---

<Intro>

يصير `renderToStaticMarkup` شجرة React غير تفاعلية إلى سلسلة HTML.

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

سينتج إخراج HTML غير تفاعلي لمكونات React الخاصة بك.

[اطّلع على المزيد من الأمثلة في الأسفل.](#usage)

#### المعاملات {/*parameters*/}

* `reactNode`: عقدة React تريد تصييرها إلى HTML. على سبيل المثال، عقدة JSX مثل `<Page />`.
* **اختياري** `options`: كائن لتصيير الخادم.
  * **اختياري** `identifierPrefix`: بادئة سلسلة يستخدمها React للمعرفات التي تم إنشاؤها بواسطة [`useId`.](/reference/react/useId) مفيد لتجنب التعارضات عند استخدام عدة جذور على نفس الصفحة.

#### القيم المرجعة {/*returns*/}

سلسلة HTML.

#### تنبيهات {/*caveats*/}

* لا يمكن ترطيب إخراج `renderToStaticMarkup`.

* `renderToStaticMarkup` لديه دعم محدود لـ Suspense. إذا علّق مكون، يرسل `renderToStaticMarkup` على الفور fallback الخاص به كـ HTML.

* `renderToStaticMarkup` يعمل في المتصفح، لكن استخدامه في كود العميل غير موصى به. إذا كنت بحاجة إلى تصيير مكون إلى HTML في المتصفح، [احصل على HTML عن طريق تصييره في عقدة DOM.](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)

---

## الاستخدام {/*usage*/}

### تصيير شجرة React غير تفاعلية كـ HTML إلى سلسلة {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}

استدعِ `renderToStaticMarkup` لتصيير تطبيقك إلى سلسلة HTML يمكنك إرسالها مع استجابة الخادم الخاصة بك:

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

سينتج هذا إخراج HTML الأولي غير التفاعلي لمكونات React الخاصة بك.

<Pitfall>

تصير هذه الطريقة **HTML غير تفاعلي لا يمكن ترطيبه.** هذا مفيد إذا كنت تريد استخدام React كمولد صفحة ثابتة بسيط، أو إذا كنت تصير محتوى ثابتًا تمامًا مثل رسائل البريد الإلكتروني.

يجب أن تستخدم التطبيقات التفاعلية [`renderToString`](/reference/react-dom/server/renderToString) على الخادم و [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) على العميل.

</Pitfall>

````