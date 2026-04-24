---
title: "دالة lazy"
---

<Intro>

`lazy` تؤجّل تحميل شيفرة المكوّن حتى يُعرض لأول مرة.

```js
const SomeComponent = lazy(load)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `lazy(load)` {/*lazy*/}

استدعِ `lazy` خارج مكوّناتك للإعلان عن مكوّن React يُحمَّل كسولًا:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `load`: دالة تُرجع [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) أو كائنًا *thenable* (مشابهًا لـ Promise بوجود دالة `then`). لن تستدعي React `load` حتى أول محاولة لعرض المكوّن المُرجَع. بعد أول استدعاء لـ `load`، تنتظر React حتى يُحلّ، ثم تعرض `.default` للقيمة المحلولة كمكوّن React. يُخزَّن كل من الـ Promise والقيمة المحلولة في الذاكرة المؤقتة، فلن تستدعي React `load` أكثر من مرة. إذا رُفض الـ Promise، ترمي React سبب الرفض لأقرب Error Boundary.

#### القيمة المُرجَعة {/*returns*/}

`lazy` تُرجع مكوّن React يمكنك عرضه في شجرتك. بينما شيفرة المكوّن الكسول لا تزال تُحمَّل، محاولة عرضه ستؤدي إلى *تعليق (suspend).* استخدم [`<Suspense>`](/reference/react/Suspense) لعرض مؤشر تحميل أثناء التحميل.

---

### دالة `load` {/*load*/}

#### المعاملات {/*load-parameters*/}

`load` لا تتلقى معاملات.

#### القيمة المُرجَعة {/*load-returns*/}

يجب أن تُرجع [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) أو كائنًا *thenable*. يجب أن يُحلّ في النهاية إلى كائن خاصية `.default` فيه نوع مكوّن React صالح، مثل دالة أو [`memo`](/reference/react/memo) أو مكوّن [`forwardRef`](/reference/react/forwardRef).

---

## الاستخدام {/*usage*/}

### تحميل المكوّنات كسولًا مع Suspense {/*suspense-for-code-splitting*/}

عادةً تستورد المكوّنات بتصريح [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) الثابت:

```js
import MarkdownPreview from './MarkdownPreview.js';
```

لتأجيل تحميل شيفرة هذا المكوّن حتى يُعرض لأول مرة، استبدل هذا الاستيراد بـ:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

تعتمد هذه الشيفرة على [`import()` الديناميكي،](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) وقد تحتاج دعمًا من مجمّعك أو إطارك. يتطلب هذا النمط أن يكون المكوّن الكسول المستورد مُصدَّرًا كـ `default`.

بما أن شيفرة المكوّن تُحمَّل عند الطلب، حدد ما يُعرض أثناء التحميل بلفّ المكوّن الكسول أو أي أسلاف له بحدود [`<Suspense>`](/reference/react/Suspense):

```js {1,4}
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
</Suspense>
```

في هذا المثال، لن تُحمَّل شيفرة `MarkdownPreview` حتى تحاول عرضها. إذا لم تُحمَّل بعد، يُعرض `Loading` مكانها. جرّب تفعيل مربع الاختيار:

<Sandpack>

```js src/App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Show preview
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Preview</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// Add a fixed delay so you can see the loading state
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

```js src/Loading.js
export default function Loading() {
  return <p><i>Loading...</i></p>;
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label {
  display: block;
}

input, textarea {
  margin-bottom: 10px;
}

body {
  min-height: 200px;
}
```

</Sandpack>

يُحمَّل هذا العرض بتأخير اصطناعي. في المرة التالية التي تلغي فيها التفعيل ثم تعيده، يكون `Preview` مخزّنًا فلا يظهر حالة التحميل. لإعادة رؤية التحميل، انقر «Reset» في الحاوية.

[تعرّف أكثر على إدارة حالات التحميل مع Suspense.](/reference/react/Suspense)

---

## استكشاف الأخطاء {/*troubleshooting*/}

### تُصفَّر حالة مكوّني `lazy` بشكل غير متوقع {/*my-lazy-components-state-gets-reset-unexpectedly*/}

لا تُعلن عن مكوّنات `lazy` *داخل* مكوّنات أخرى:

```js {4-5}
import { lazy } from 'react';

function Editor() {
  // 🔴 Bad: This will cause all state to be reset on re-renders
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

بدلًا من ذلك، أعلن عنها دائمًا على مستوى الوحدة:

```js {3-4}
import { lazy } from 'react';

// ✅ Good: Declare lazy components outside of your components
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```
