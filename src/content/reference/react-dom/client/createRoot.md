---
title: createRoot
---

<Intro>

تمكنك `createRoot` من إنشاء نقطة بداية أو جذر (Root) لعرض مكونات React داخل عنصر DOM في المتصفح.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

استدعِ `createRoot` لإنشاء جذر React لعرض المحتوى داخل عنصر DOM في المتصفح.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

سيقوم React بإنشاء جذر لـ `domNode`، ويتولى إدارة العنصر DOM داخله. بعد إنشاء الجذر، يتعين عليك استدعاء [`root.render`](#root-render) لعرض مكون React داخله:

```js
root.render(<App />);
```

يتم عادة إنشاء التطبيق بالكامل باستخدام React بنداء واحد فقط لـ `createRoot` للمكون الجذر. قد يحتوي الموقع الذي يستخدم React لأجزاء من الصفحة على عدد من نقاط البداية الفردية حسب الحاجة.

[انظر المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `domNode`: عنصر [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element) يقوم React بإنشاء جذر لهذا العنصر ويتيح لك استدعاء الدوال على الجذر مثل `render` لعرض المحتوى المعروض بواسطة React.

* `options` **اختياري**: كائن يحتوي على خيارات لجذر React هذا.

  * `onRecoverableError` **اختياري**: دالة مرجعية تستدعى عندما يفيق React تلقائيًا من الأخطاء.
  * `identifierPrefix` **اختياري**: بادئة نصيّة يستخدمها React للمعرفات الفريدة التي تنشأ عن طريق [`useId`](/reference/react/useId). مفيد لتجنب التعارض عند استخدام العديد من نقاط البداية في نفس الصفحة.

#### العائدات {/*returns*/}

يعيد `createRoot` كائنًا يحتوي على طريقتين: [`render`](#root-render) و [`unmount`](#root-unmount).

#### ملاحظات {/*caveats*/}
* إذا كان تطبيقك يتم عرضه من الخادم، فإن استخدام `createRoot()` غير مدعوم. استخدم [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) بدلاً من ذلك.
* من المرجح أن لديك استدعاء واحد فقط لـ `createRoot` في تطبيقك. إذا كنت تستخدم إطار عمل، فقد يستدعيها الإطار نيابةً عنك.
* عندما ترغب في عرض جزء من JSX في جزء آخر من شجرة DOM التي ليست طفلًا للمكون الخاص بك (على سبيل المثال، نافذة محادثة، أو توضيح Tooltip)، استخدم [`createPortal`](/reference/react-dom/createPortal) بدلاً من `createRoot`.

---

### `root.render(reactNode)` {/*root-render*/}

استدعِ `root.render` لعرض جزء من [JSX](/learn/writing-markup-with-jsx) ("عنصر React") داخل عنصر DOM في جذر React.

```js
root.render(<App />);
```

سيعرض React `<App />` في الجذر، وسيتولى إدارة العنصر DOM داخله.

[انظر المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*root-render-parameters*/}

* `reactNode`: *عنصر React* الذي ترغب في عرضه. عادةً ما يكون هذا جزءًا من JSX مثل `<App />`، ولكن يمكنك أيضًا تمرير عنصر React المُنشأ باستخدام [`createElement()`](/reference/react/createElement)، أو نص أو رقم أو `null` أو `undefined`.


#### العائدات {/*root-render-returns*/}

يعيد `root.render` `undefined`.

#### ملاحظات {/*root-render-caveats*/}

* عندما تستدعي `root.render` للمرة الأولى، سيحذف React كل المحتوى الموجود داخل جذر React قبل عرض مكونات React فيه.

* إذا كان جذر عنصر DOM الخاص بك يحتوي على HTML أنشأته React على الخادم أو أثناء البناء، استخدم [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) بدلاً من ذلك، والتي تربط مستمعي الأحداث بـ HTML الموجود بالفعل.

* إذا استدعيت `render` في نفس الجذر أكثر من مرة، ستحدث React عناصر DOM اللازمة ليظهر أحدث JSX مررتها، ستقرر React أي أجزاء React يمكن إعادة استخدامها، ,أيها يحتاج لإعادة الإنشاء عن طريق ["مطابقتها"](/learn/preserving-and-resetting-state) مع الشجرة المعروضة سابقًا. استدعاء `render` في نفس الجذر مرة أخرى يشبه مناداة [دالة `set`](/reference/react/useState#setstate) في المكون الجذر: تتجنب React تحديثات DOM غير الضرورية.


---

### `root.unmount()` {/*root-unmount*/}

استدعِ `root.unmount` لتدمير شجرة معروضة داخل جذر React.

```js
root.unmount();
```

عادةً، لن يستدعي تطبيق مبني كاملًا بـ React `root.unmount`.

هذا يكون مفيدًا بشكل أساسي إذا كان عنصر جذر React الخاصة بك (أو أي من العناصر الأسلاف لها) قد يتم إزالتها من DOM بواسطة بعض الأكواد الأخرى. على سبيل المثال، تخيل أن لديك لوحة علامات jQuery تقوم بإزالة علامات غير نشطة من DOM. إذا تمت إزالة علامة ما، فإن كل ما بداخلها (بما في ذلك جذور React الداخلية) سيتم إزالته من DOM أيضًا. في هذه الحالة، تحتاج إلى إخبار React بأنه يجب "إيقاف" إدارة محتوى الجذر المزال عن طريق استدعاء `root.unmount`. وإلا، فإن المكونات الداخلية في الجذر المزال لن تعرف كيفية التنظيف وتحرير الموارد العامة مثل الاشتراكات.

عند استدعاء `root.unmount`، سيتم إلغاء تثبيت جميع المكونات في الجذر" و"فصل" React عن عنصر DOM الجذر، بما في ذلك إزالة أي معالجات أحداث أو حالة في الشجرة.


#### المعاملات {/*root-unmount-parameters*/}

`root.unmount` لا تستقبل أي معاملات.


#### العائدات {/*root-unmount-returns*/}

تعيد `root.unmount`: `undefined`.

#### ملاحظات {/*root-unmount-caveats*/}

* استدعاء `root.unmount` سيلغي تثبيت جميع المكونات في الشجرة ويفصل React عن عنصر DOM الجذر.
* بمجرد استدعاء `root.unmount`، لا يمكنك استدعاء `root.render` مرة أخرى على نفس الجذر. ستؤدي محاولة استدعاء `root.render` على جذر غير مثبتة إلى إطلاق خطأ "Cannot update an unmounted root". ومع ذلك، يمكنك إنشاء جذر جديد لنفس عنصر DOM بعد إلغاء تثبيت الجذر السابقة لذلك العنصر.

---

## الاستخدام {/*usage*/}

### عرض التطبيق المُبني بالكامل بواسطة React {/*rendering-an-app-fully-built-with-react*/}

إذا كان تطبيقك مبنيًا بالكامل بواسطة React، قم بإنشاء جذر واحدة لتطبيقك بالكامل.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

عادةً ما يكون عليك تنفيذ هذا الشيء مرة واحدة فقط عند بدء التشغيل.

 سيقوم بما يلي:

1. العثور على <CodeStep step={1}>عنصر DOM للمتصفح</CodeStep> المعرف في ملف HTML الخاص بك.
2. عرض <CodeStep step={2}>مكون React</CodeStep> لتطبيقك بداخله.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>تطبيقي</title></head>
  <body>
    <!-- This is the DOM node -->
    <div id="root"></div>
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>مرحبًا بكم</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      لقد ضغطت {count} مرات
    </button>
  );
}
```

</Sandpack>

**إذا كان تطبيقك مبنيًا بالكامل بواسطة React، فغالبًا لن تحتاج إلى إنشاء مزيد من الجذور أو استدعاء [`root.render`](#root-render) مرة أخرى.** 

من هذه النقطة وما بعدها، سيتولى React إدارة DOM للتطبيق بأكمله. لإضافة مكونات إضافية، [احتضنها داخل المكون `App`.](/learn/importing-and-exporting-components) عندما تحتاج إلى تحديث واجهة المستخدم، يمكن أن تقوم كل من مكوناتك بذلك عن طريق [استخدام الحالة.](/reference/react/useState) وعندما تحتاج إلى عرض محتوى إضافي مثل شاشة نموذجية أو نصائح خارج عنصر DOM، [اعرضه باستخدام `createPortal`.](/reference/react-dom/createPortal)

<Note>

عندما يكون العنصر HTML خاليًا، يرى المستخدم صفحة فارغة حتى يتم تحميل وتشغيل كود JavaScript للتطبيق:

```html
<div id="root"></div>
```

يمكن أن يكون هذا بطيئًا جدًا! لحل هذه المشكلة، يمكنك إنشاء العنصر HTML الأولي من مكوناتك [على الخادم أو أثناء البناء.](/reference/react-dom/server) ثم يمكن لزوار موقعك قراءة النص ورؤية الصور والنقر على الروابط قبل تحميل أي كود JavaScript. نوصي بأن تستخدم [إطار عمل](/learn/start-a-new-react-project#production-grade-react-frameworks) يفعل هذا الأمر تلقائيًا. اعتمادًا على موعد تشغيله، يُطلق عليه *تحميل من جانب الخادم (SSR)* أو *توليد المواقع الثابت (SSG).*

</Note>

<Pitfall>

**يجب على التطبيقات التي تستخدم تقنية تصيير الخادم (server rendering) أو التوليد الثابت (static generation) استدعاء [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) بدلاً من `createRoot`.** سيقوم React بعد ذلك بـ *تحييد hydrate* (إعادة استخدام) عناصر DOM من HTML الخاص بك بدلاً من تدميرها وإعادة إنشائها.

</Pitfall>

---

