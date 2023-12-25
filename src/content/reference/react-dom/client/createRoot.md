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

يتم عادة إنشاء التطبيق بالكامل باستخدام React بنداء واحد فقط لـ `createRoot` في المكون الجذر. قد يحتوي الموقع الذي يستخدم React لأجزاء محددة من الصفحة على عدد من نقاط البداية الفردية حسب الحاجة.

[انظر المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `domNode`: عنصر [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element) يقوم React بإنشاء جذر لهذا العنصر ويتيح لك استدعاء الدوال على الجذر مثل `render` لعرض المحتوى الذي تنشئه React.

* `options` **اختياري**: كائن يحتوي على خيارات لجذر React هذا.

  * `onRecoverableError` **اختياري**: دالة مرجعية تُستدعى تلقائيًا عندما يفيق React من الأخطاء.
  * `identifierPrefix` **اختياري**: بادئة نصيّة يستخدمها React للمعرفات الفريدة التي تنشأ عن طريق [`useId`](/reference/react/useId). مفيد لتجنب التعارض عند استخدام العديد من الجذور في نفس الصفحة.

#### العائدات {/*returns*/}

يعيد `createRoot` كائنًا يحتوي على طريقتين: [`render`](#root-render) و [`unmount`](#root-unmount).

#### ملاحظات {/*caveats*/}
* إذا كان تطبيقك يتم عرضه من الخادم SSR، فإن استخدام `createRoot()` غير مدعوم. استخدم [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) بدلاً من ذلك.
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
* بمجرد استدعاء `root.unmount`، لا يمكنك استدعاء `root.render` مرة أخرى على نفس الجذر. ستؤدي محاولة استدعاء `root.render` على جذر غير مثبتة إلى إطلاق خطأ `"Cannot update an unmounted root"`. ومع ذلك، يمكنك إنشاء جذر جديد لنفس عنصر DOM بعد إلغاء تثبيت الجذر السابقة لذلك العنصر.

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

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
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

من هذه النقطة وما بعدها، سيتولى React إدارة DOM للتطبيق بأكمله. لإضافة مكونات إضافية، [احتضنها داخل المكون `App`.](/learn/importing-and-exporting-components) عندما تحتاج إلى تحديث واجهة المستخدم، يمكن أن تقوم كل من مكوناتك بذلك عن طريق [استخدام الحالة.](/reference/react/useState) وعندما تحتاج إلى عرض محتوى إضافي مثل نافذة منبثقة أو نصائح خارج عنصر DOM، [اعرضه باستخدام `createPortal`.](/reference/react-dom/createPortal)

<Note>

عندما يكون عنصر HTML خاليًا، يرى المستخدم صفحة فارغة حتى يتم تحميل وتشغيل كود JavaScript للتطبيق:

```html
<div id="root"></div>
```

يمكن أن يكون هذا بطيئًا جدًا! لحل هذه المشكلة، يمكنك إنشاء عنصر HTML الأولي من مكوناتك [على الخادم أو أثناء البناء.](/reference/react-dom/server) ثم يمكن لزوار موقعك قراءة النص ورؤية الصور والنقر على الروابط قبل تحميل أي كود JavaScript. نوصي بأن تستخدم [إطار عمل](/learn/start-a-new-react-project#production-grade-react-frameworks) يفعل هذا الأمر تلقائيًا. اعتمادًا على موعد تشغيله، يُطلق عليه *تحميل من جانب الخادم (SSR)* أو *توليد المواقع الثابت (SSG).*

</Note>

<Pitfall>

**يجب على التطبيقات التي تستخدم تقنية تصيير الخادم (server rendering) أو التوليد الثابت (static generation) استدعاء [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) بدلاً من `createRoot`.** سيقوم React بعد ذلك بـ *تحييد hydrate* (إعادة استخدام) عناصر DOM من HTML الخاص بك بدلاً من تدميرها وإعادة إنشائها.

</Pitfall>

---

### عرض صفحة مبنية جزئيًا بواسطة React {/*rendering-a-page-partially-built-with-react*/}

إذا كانت صفحتك [ليست مبنية بالكامل باستخدام React](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)، يمكنك استدعاء `createRoot` عدة مرات لإنشاء جذر لكل قسم من أقسام واجهة المستخدم الرئيسية التي تُدار بواسطة React. يمكنك عرض محتوى مختلف في كل جذر عن طريق استدعاء [`root.render`](#root-render).

في هذا المثال، يتم عرض نوعين مختلفين من مُكوِّنات React في عنصري DOM موجودين في ملف `index.html`:
<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>تطبيقي</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>هذا الجزء ليس مبنيًا بـReact. افتح index.html لتتأكد</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode); 
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode); 
commentRoot.render(<Comments />);
```

```js src/Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">الرئيسية</NavLink>
      <NavLink href="/about">من نحن</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>التعليقات</h2>
      <Comment text="مرحبًا!" author="رحمة" />
      <Comment text="كيف حالك?" author="فاطمة" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
body { direction: rtl; }
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

يمكنك أيضًا إنشاء عنصر DOM جديد باستخدام [`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) وإضافتها يدويًا إلى المستند.

```js
const domNode = document.createElement('div');
const root = createRoot(domNode); 
root.render(<Comment />);
document.body.appendChild(domNode); // يمكنك إضافتها في أي مكان بالمستند
```

لإزالة شجرة React من عنصر DOM وتنظيف جميع الموارد المستخدمة من قِبلها، استدعِ [`root.unmount`.](#root-unmount)

```js
root.unmount();
```

تعتبر هذه الطريقة مفيدة بشكل رئيسي إذا كانت مُكوِّنات React الخاصة بك داخل تطبيق مكتوب بإطار عمل مختلف.

---

### تحديث المكون الجذر {/*updating-a-root-component*/}

يمكنك استدعاء `render` أكثر من مرة على نفس الجذر. طالما أن هيكل شجرة المُكوِّن يُطابق ما تم عرضه سابقًا، ستُحافظ React على [الحالة.](/learn/preserving-and-resetting-state) لاحظ كيف يمكنك كتابة نص في المُدخل، مما يعني أن التحديثات الناتجة عن استدعاءات `render` المتكررة كل ثانية في هذا المثال لا تُؤدي إلى حذف البيانات:

<Sandpack>

```js src/index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>مرحبًا بكم {counter}</h1>
      <input placeholder="اكتب شيئا هنا" />
    </>
  );
}
```

</Sandpack>

من غير الشائع أن تستدعي `render` عدة مرات. عادةً، يمكن لمكوناتك [تحديث الحالة](/reference/react/useState) بدلاً من ذلك.

---
## حل المشكلات {/*troubleshooting*/}

### لقد أنشأت جذرًا، ولكن لا يتم عرض أي شيء {/*ive-created-a-root-but-nothing-is-displayed*/}

تأكد من أنك لم تنسى أن تقوم بـ *عرض* تطبيقك فعليًا في الجذر:

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

إلى أن تفعل ذلك، لن يتم عرض أي شيء.

---

### أواجه خطأ: `"Target container is not a DOM element"` {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

هذا الخطأ يعني أن ما تقوم بتمريره إلى `createRoot` ليس عنصر DOM.

إذا لم تكن متأكدًا مما يحدث، جرب استخدام `console.log` للتحقق من القيمة التي تمررها إلى `createRoot`:

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

على سبيل المثال، إذا كانت `domNode` تساوي `null`، فهذا يعني أن [`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) قد أرجع `null`. وهذا سيحدث إذا لم يكن هناك عنصر في المستند يحمل المعرف ID المعطاة في وقت استدعائك للدالة. قد تكون هناك بعض الأسباب وراء ذلك:

1. ربما يكون المعرف الذي تبحث عنه مختلف عن المعرف التي استخدمته في ملف HTML. تحقق من الأخطاء الإملائية!
2. ربما لا يمكن لعنصر `<script>` الخاص بك "رؤية" أي عنصر DOM تظهر *بعده* في HTML.

طريقة شائعة أخرى للحصول على هذا الخطأ هي كتابة `createRoot(<App />)` بدلاً من `createRoot(domNode)`.

---

### أواجه خطأ: `"Functions are not valid as a React child."` {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

هذا الخطأ يعني أن ما تمرره إلى `root.render` ليس مكوِّن React.

قد يحدث هذا إذا قمت باستدعاء `root.render` باستخدام `Component` بدلاً من `<Component />`:

```js {2,5}
// 🚩 خاطئ: App هي دالة، وليست مكوِّن.
root.render(App);

// ✅ صحيح: <App /> هو مكوِّن.
root.render(<App />);
```

أو إذا قمت بتمرير دالة إلى `root.render` بدلاً من نتيجة استدعائها:

```js {2,5}
// 🚩 خاطئ: createApp هي دالة، وليست مكوِّن.
root.render(createApp);

// ✅ صحيح: قم باستدعاء createApp لترجع مكوِّنًا.
root.render(createApp());
```

---

### يتم إعادة إنشاء HTML المنشأة بواسطة الخادم من جديد {/*my-server-rendered-html-gets-re-created-from-scratch*/}

إذا كان تطبيقك قد تم رسمه بواسطة الخادم ويتضمن HTML الأولي الذي تم إنشاؤه بواسطة React، قد تلاحظ أن إنشاء جذر واستدعاء `root.render` يحذف كل هذا الHTML، ثم يُعيد إنشاء جميع عناصر DOM من جديد. قد يكون هذا أبطأ، ويؤدي إلى إعادة تعيين التركيز ومواقع التمرير، وقد يؤدي إلى فقدان مدخلات المستخدم الأخرى.

يجب على تطبيقات التي تم رسمها بواسطة الخادم استخدام [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) بدلاً من `createRoot`:

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

لاحظ أن واجهة برمجة التطبيقات API مختلفة. عادةً ما لن يكون هناك مزيد من استدعاءات `root.render`.