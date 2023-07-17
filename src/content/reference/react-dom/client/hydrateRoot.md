---
title: hydrateRoot
---

<Intro>

تمكنك `hydrateRoot` من عرض مكونات React في عناصر DOM في المتصفح، التي تم توليدها سابقًا باستخدام [`react-dom/server`](/reference/react-dom/server).

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

استدعِ `hydrateRoot` لـ "ربط" React بـ HTML الحالي الذي تم عرضه بالفعل بواسطة React في بيئة الخادم.

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

سيقوم React بربط نفسه بالHTML الموجود داخل الـ `domNode` والاهتمام بإدارة DOM داخلها. التطبيق المبنى كاملًا بواسطة React سيكون لديه عادة استدعاء واحد فقط لـ `hydrateRoot` باستخدام مكوِّن الجذر الخاص به.

[شاهد المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `domNode`: عنصر [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element) الذي تم عرضه كعنصر جذر على الخادم.

* `reactNode`: "مُكوِّن React" المستخدم لعرض HTML الحالي. هذا عادةً ما يكون جزءًا من JSX مثل `<App />` الذي تم عرضه باستخدام طريقة `ReactDOM Server` مثل `renderToPipeableStream(<App />)`.

* `options` **اختياري**: كائن يحتوي على خيارات لجذر React هذا.

  * `onRecoverableError` **اختياري**: دالة مرجعية تُستدعى تلقائيًا عندما يفيق React من الأخطاء.
  * `identifierPrefix` **اختياري**: بادئة نصيّة يستخدمها React للمعرفات الفريدة التي تنشأ عن طريق [`useId`](/reference/react/useId). مفيد لتجنب التعارض عند استخدام العديد من الجذور في نفس الصفحة.


#### العائدات {/*returns*/}

تعيد `hydrateRoot` كائنًا يحتوي على طريقتين: [`render`](#root-render) و [`unmount`.](#root-unmount)

#### ملاحظات {/*caveats*/}

* `hydrateRoot()` يتوقع أن يكون المحتوى المعروض مطابقًا تمامًا للمحتوى المرسوم في الخادم. يجب عليك التعامل مع عدم التطابقات على أنها أخطاء وإصلاحها.
* في وضع التطوير، يحذر React من التطابقات أثناء الربط. لا يوجد ضمانات بأن الاختلافات في السمات ستكون مُصحَّحة في حالة التطابقات. هذا مهم لأسباب أداء لأنه في معظم التطبيقات، يكون الاختلافات نادرة، وبالتالي فإن التحقق من صحة جميع العلامات قد يكون صعبًا جدًا.
* من المرجح أن لديك استدعاء واحد فقط لـ `hydrateRoot` في تطبيقك. إذا كنت تستخدم إطار عمل، فقد يستدعيها الإطار نيابةً عنك.
* إذا كان تطبيقك يُرسم في جانب العميل، بدون أي محتوى HTML بالفعل، فاستخدام `hydrateRoot()` ليس مناسبًا. بدلاً من ذلك، استخدم [`createRoot()`](/reference/react-dom/client/createRoot).

---

### `root.render(reactNode)` {/*root-render*/}

استدعِ `root.render` لتحديث مكون React داخل جذر React في عنصر DOM في المتصفح.

```js
root.render(<App />);
```

ستحدث React <App /> في `root` المُجَمّع.

[شاهد المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*root-render-parameters*/}

* `reactNode`: *عنصر React* الذي ترغب في عرضه. عادةً ما يكون هذا جزءًا من JSX مثل `<App />`، ولكن يمكنك أيضًا تمرير عنصر React المُنشأ باستخدام [`createElement()`](/reference/react/createElement)، أو نص أو رقم أو `null` أو `undefined`.


#### العائدات {/*root-render-returns*/}

تعيد `root.render`: `undefined`.

#### ملاحظات {/*root-render-caveats*/}

* إذا استدعيت `root.render` قبل أن ينتهي الجذر من التجميع، فسيقوم React بمسح محتوى HTML المرسوم بالفعل من الخادم وتحويل الجذر بأكمله إلى الرسم  من جانب العميل.

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

### ربط HTML تم رسمه بالخادم {/*hydrating-server-rendered-html*/}

إذا تم إنشاء HTML تطبيقك بواسطة [`react-dom/server`](/reference/react-dom/client/createRoot)، فستحتاج إلى *ترطيبه* في جانب الخادم.

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

سيقوم هذا بترطيب HTML الخادم داخل <CodeStep step={1}>عنصر DOM المتصفح</CodeStep> باستخدام <CodeStep step={2}>مكوِّن React</CodeStep> لتطبيقك. عادةً ما تقوم بفعل ذلك مرة واحدة عند بدء التشغيل. إذا كنت تستخدم إطار عمل ما، فقد يقوم الإطار بعمل هذا الأمر بالنيابة عنك.

بهذه الطريقة، سيقوم React بـ "ربط" منطق المكوِّنات الخاصة بك بالـ HTML الأولي الذي تم إنشاؤه من الخادم. يحول الربطُ نسخة HTML الأولية من الخادم إلى تطبيق متفاعل بالكامل يعمل في المتصفح.

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Hello, world!</h1><button>You clicked me <!-- -->0<!-- --> times</button></div>
```

```js index.js active
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

```js App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Hello, world!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}
```

</Sandpack>

لن تحتاج لاستدعاء `hydrateRoot` مرة أخرى في أي مكان أخر. من هذه النقطة فصاعدًا، سيقوم React بإدارة DOM لتطبيقك. لتحديث واجهة مستخدم، ستقوم المكوِّنات الخاصة بك [باستخدام الحالة](/reference/react/useState) بدلاً من ذلك.

<Pitfall>

عنصر React الذي تمرره إلى `hydrateRoot` يحتاج إلى إنتاج **نفس النتيجة** التي حققها عند الخادم.

هذا مهم لتجربة المستخدم. سيقضي المستخدم بعض الوقت في النظر إلى HTML الذي تم إنشاؤه من الخادم قبل تحميل كود JavaScript الخاص بك. يخلق الرسم من جانب الخادم وهمًا بأن التطبيق يحمل بشكل أسرع عن طريق عرض نسخة HTML المُمنتج. إظهار محتوى مختلف فجأة يكسر هذا الوهم. لهذا السبب، يجب أن يتطابق إخراج الرسم الخادم مع إخراج الرسم الأولي على العميل.

أكثر الأسباب شيوعًا التي تؤدي إلى حدوث أخطاء الربط تشمل:

* فراغ إضافي (مثل الأسطر الجديدة) حول HTML المُنتَج بواسطة React داخل العنصر الجذر.
* استخدام فحوص مثل `typeof window !== 'undefined'` في منطق الرسم الخاص بك.
* استخدام واجهات برمجة تطبيقات معتمدة على المتصفح مثل [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) في منطق الرسم الخاص بك.
* عرض بيانات مختلفة على الخادم والعميل.

يقوم React بالتعافي من بعض أخطاء الربط، ولكن يجب عليك **إصلاحها مثل الأخطاء الأخرى**. في أفضل الحالات، ستؤدي إلى إبطاء الأداء. في أسوأ الحالات، يمكن أن تتم إضافة المعالجات إلى العناصر الخاطئة.

</Pitfall>

---

### ربط مستند بأكمله {/*hydrating-an-entire-document*/}

يمكن للتطبيقات المُبنَّية بالكامل بواسطة React أن تعرض المستند بأكمله على شكل JSX، بما في ذلك العلامة [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html) :

```js {3,13}
function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>تطبيقي</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

لترطيب المستند بأكمله، مرر الكائن العام (`document`) كأول معامل إلى `hydrateRoot`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### كتم تحذيرات الربط غير المرتبطة بالترطيب {/*suppressing-unavoidable-hydration-mismatch-errors*/}

إذا كان هناك اختلاف ضروري بين سمة عنصر واحد أو محتوى النص بين الخادم والعميل (على سبيل المثال ، الطابع الزمني)، فيمكنك إسكات تحذيرات الربط غير المرتبطة بالترطيب.

لكتم تحذيرات الربط على عنصر ما، أضف `suppressHydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Current Date: <!-- -->01/01/2020</h1></div>
```

```js index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Current Date: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

هذا يعمل فقط لعنصر واحد عميق، ومقصود أن يكون هروبًا. لا تستخدمه بكثرة. ما لم يكن هو محتوى النص، فإن React لن يحاول تصحيحه، وبالتالي قد يظل غير متسق حتى التحديثات المستقبلية.

---

