---
title: "مكوّن <Fragment> (<>...</>)"
---

<Intro>

`<Fragment>`، غالبًا عبر الصيغة `<>...</>`، يجمّع العناصر دون عقدة غلاف.

<Canary> يمكن لـ Fragments أيضًا قبول مراجع (refs)، ما يتيح التفاعل مع عقد DOM الأساسية دون إضافة عناصر غلاف. راجع المرجع والاستخدام أدناه.</Canary>

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `<Fragment>` {/*fragment*/}

لفّ العناصر بـ `<Fragment>` لتجميعها عندما تحتاج عنصرًا واحدًا. التجميع بـ `Fragment` لا يؤثر على DOM الناتج؛ كأن العناصر لم تُجمَّع. الوسم الفارغ `<>...</>` اختصار لـ `<Fragment></Fragment>` في أغلب الحالات.

#### الخصائص {/*props*/}

- **اختياري** `key`: Fragments المعرّفة بصيغة `<Fragment>` الصريحة يمكن أن تحتوي على [مفاتيح.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
- <CanaryBadge />  **اختياري** `ref`: كائن مرجع (مثل [`useRef`](/reference/react/useRef)) أو [دالة استدعاء مرجع](/reference/react-dom/components/common#ref-callback). توفّر React كائن `FragmentInstance` كقيمة المرجع وي implements طرقًا للتفاعل مع عقد DOM الملفوفة بالـ Fragment.

### <CanaryBadge /> FragmentInstance {/*fragmentinstance*/}

عند تمرير مرجع إلى fragment، توفّر React كائن `FragmentInstance` يوفّر دوالًا للتفاعل مع عقد DOM الملفوفة بالـ fragment:

**طرق معالجة الأحداث:**
- `addEventListener(type, listener, options?)`: يضيف مستمع حدث لكل الأبناء DOM من المستوى الأول للـ Fragment.
- `removeEventListener(type, listener, options?)`: يزيل مستمع حدث من كل الأبناء DOM من المستوى الأول للـ Fragment.
- `dispatchEvent(event)`: يُرسل حدثًا إلى فرع افتراضي للـ Fragment لاستدعاء المستمعات المضافة وقد ينتقل عبر الفقاعات إلى الأب في DOM.

**طرق التخطيط:**
- `compareDocumentPosition(otherNode)`: يقارن موضع المستند للـ Fragment مع عقدة أخرى.
  - إذا كان للـ Fragment أبناء، تُرجع قيمة `compareDocumentPosition` الأصلية.
  - Fragments الفارغة تحاول مقارنة الموضع ضمن شجرة React وتتضمن `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
  - العناصر ذات العلاقة المختلفة في شجرة React وشجرة DOM بسبب البوابات (portaling) أو إدراجات أخرى تكون `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
- `getClientRects()`: تُرجع مصفوفة مسطحة من `DOMRect` تمثل مستطيلات الإحاطة لكل الأبناء.
- `getRootNode()`: تُرجع الجذر الذي يحتوي على عقدة DOM الأب للـ Fragment.

**طرق إدارة التركيز:**
- `focus(options?)`: يركّز أول عقدة DOM قابلة للتركيز في الـ Fragment. يُحاول التركيز على الأبناء المتداخلين عمقًا أولًا.
- `focusLast(options?)`: يركّز آخر عقدة DOM قابلة للتركيز في الـ Fragment.
- `blur()`: يزيل التركيز إذا كان `document.activeElement` داخل الـ Fragment.

**طرق المراقب:**
- `observeUsing(observer)`: يبدأ مراقبة أبناء DOM للـ Fragment بـ IntersectionObserver أو ResizeObserver.
- `unobserveUsing(observer)`: يوقف المراقبة لأبناء DOM للـ Fragment بالمراقب المحدد.

#### ملاحظات {/*caveats*/}

- لتمرير `key` إلى Fragment، لا يمكنك استخدام صيغة `<>...</>`. يجب استيراد `Fragment` صراحة من `'react'` وعرض `<Fragment key={yourKey}>...</Fragment>`.

- لا [تُعيد React ضبط الحالة](/learn/preserving-and-resetting-state) عند الانتقال من عرض `<><Child /></>` إلى `[<Child />]` أو العكس، أو من `<><Child /></>` إلى `<Child />` والعكس. يعمل ذلك عمقًا واحدًا فقط: مثلًا الانتقال من `<><><Child /></></>` إلى `<Child />` يُصفّر الحالة. راجع الدلالات الدقيقة [هنا.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

- <CanaryBadge /> لتمرير `ref` إلى Fragment، لا يمكنك استخدام صيغة `<>...</>`. يجب استيراد `Fragment` صراحة من `'react'` وعرض `<Fragment ref={yourRef}>...</Fragment>`.

---

## الاستخدام {/*usage*/}

### إرجاع عناصر متعددة {/*returning-multiple-elements*/}

استخدم `Fragment`، أو صيغة `<>...</>` المكافئة، لتجميع عدة عناصر. يمكنك وضع عدة عناصر حيث يُسمح بعنصر واحد. مثلًا، المكوّن يمكنه إرجاع عنصر واحد فقط، لكن بـ Fragment تجمع عدة عناصر ثم تُرجعها كمجموعة:

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

Fragments مفيدة لأن التجميع بها لا يؤثر على التخطيط أو الأنماط، بخلاف لفّ العناصر في غلاف مثل عنصر DOM. إذا فحصت هذا المثال بأدوات المتصفح، سترى أن كل عقد `<h1>` و`<article>` تظهر كإخوة دون غلاف:

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="An update" body="It's been a while since I posted..." />
      <Post title="My new blog" body="I am starting a new blog!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### كيف تكتب Fragment دون الصيغة الخاصة؟ {/*how-to-write-a-fragment-without-the-special-syntax*/}

المثال أعلاه يعادل استيراد `Fragment` من React:

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

عادةً لا تحتاج هذا إلا إذا أردت [تمرير `key` إلى `Fragment`.](#rendering-a-list-of-fragments)

</DeepDive>

---

### تعيين عناصر متعددة إلى متغير {/*assigning-multiple-elements-to-a-variable*/}

مثل أي عنصر آخر، يمكنك تعيين عناصر Fragment إلى متغيرات وتمريرها كخصائص، وهكذا:

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Are you sure you want to leave this page?
    </AlertDialog>
  );
}
```

---

### تجميع عناصر مع نص {/*grouping-elements-with-text*/}

يمكنك استخدام `Fragment` لتجميع نص مع مكوّنات:

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      From
      <DatePicker date={start} />
      to
      <DatePicker date={end} />
    </>
  );
}
```

---

### عرض قائمة من Fragments {/*rendering-a-list-of-fragments*/}

هنا تحتاج كتابة `Fragment` صراحة بدل صيغة `<>...</>`. عند [عرض عناصر متعددة في حلقة](/learn/rendering-lists)، يجب تعيين `key` لكل عنصر. إذا كانت العناصر داخل الحلقة Fragments، استخدم صيغة JSX العادية لتوفير خاصية `key`:

```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

يمكنك فحص DOM للتأكد من عدم وجود عناصر غلاف حول أبناء Fragment:

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'An update', body: "It's been a while since I posted..." },
  { id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

---

### <CanaryBadge /> استخدام مراجع Fragment للتفاعل مع DOM {/*using-fragment-refs-for-dom-interaction*/}

مراجع Fragment تتيح التفاعل مع عقد DOM الملفوفة دون إضافة عناصر غلاف إضافية. يفيد ذلك في معالجة الأحداث وتتبع الظهور وإدارة التركيز واستبدال أنماط مهملة مثل `ReactDOM.findDOMNode()`.

```js
import { Fragment } from 'react';

function ClickableFragment({ children, onClick }) {
  return (
    <Fragment ref={fragmentInstance => {
      fragmentInstance.addEventListener('click', handleClick);
      return () => fragmentInstance.removeEventListener('click', handleClick);
    }}>
      {children}
    </Fragment>
  );
}
```
---

### <CanaryBadge /> تتبع الظهور بمراجع Fragment {/*tracking-visibility-with-fragment-refs*/}

مراجع Fragment مفيدة لتتبع الظهور وملاحظة التقاطع (intersection). يتيح ذلك مراقبة ظهور المحتوى دون أن يحتاج المكوّنات الفرعية لتوفير مراجع:

```js {19,21,31-34}
import { Fragment, useRef, useLayoutEffect } from 'react';

function VisibilityObserverFragment({ threshold = 0.5, onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        onVisibilityChange(entries.some(entry => entry.isIntersecting))
      },
      { threshold }
    );
    
    fragmentRef.current.observeUsing(observer);
    return () => fragmentRef.current.unobserveUsing(observer);
  }, [threshold, onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

function MyComponent() {
  const handleVisibilityChange = (isVisible) => {
    console.log('Component is', isVisible ? 'visible' : 'hidden');
  };

  return (
    <VisibilityObserverFragment onVisibilityChange={handleVisibilityChange}>
      <SomeThirdPartyComponent />
      <AnotherComponent />
    </VisibilityObserverFragment>
  );
}
```

هذا النمط بديل لتسجيل الظهور المعتمد على Effect فقط، وهو غالبًا نمطًا سيئًا. الاعتماد على Effects وحدها لا يضمن أن المكوّن المُعرض يمكن للمستخدم ملاحظته.

---

### <CanaryBadge /> إدارة التركيز بمراجع Fragment {/*focus-management-with-fragment-refs*/}

مراجع Fragment توفّر طرق إدارة تركيز تعمل عبر كل عقد DOM داخل الـ Fragment:

```js
import { Fragment, useRef } from 'react';

function FocusFragment({ children }) {
  return (
    <Fragment ref={(fragmentInstance) => fragmentInstance?.focus()}>
      {children}
    </Fragment>
  );
}
```

دالة `focus()` تركّز أول عنصر قابل للتركيز داخل الـ Fragment، بينما `focusLast()` تركّز الأخير القابل للتركيز.
