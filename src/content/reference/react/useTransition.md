---
title: دالة useTransition
---

<Intro>

`useTransition` هو Hook في React يتيح لك عرض جزء من الواجهة في الخلفية.

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `useTransition()` {/*usetransition*/}

استدعِ `useTransition` في أعلى مكوّنك لتوسيم بعض تحديثات الحالة كانتقالات (Transitions).

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

لا يأخذ `useTransition` أي معاملات.

#### القيمة المعادة {/*returns*/}

يعيد `useTransition` مصفوفة من عنصرين بالضبط:

1. العلم `isPending` الذي يخبرك ما إذا كانت هناك انتقالة (Transition) معلّقة.
2. [دالة `startTransition`](#starttransition) التي تتيح لك توسيم التحديثات كانتقالة.

---

### `startTransition(action)` {/*starttransition*/}

دالة `startTransition` التي يعيدها `useTransition` تتيح لك توسيم تحديث كانتقالة (Transition).

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

<Note>
#### الدوال المستدعاة داخل `startTransition` تُسمّى «إجراءات» (Actions). {/*functions-called-in-starttransition-are-called-actions*/}

الدالة المُمرَّرة إلى `startTransition` تُسمّى «إجراءً» (Action). وفقًا للعرف، يُفضَّل تسمية أي callback يُستدعى داخل `startTransition` (مثل خاصية callback) بـ `action` أو إضافة لاحقة «Action»:

```js {1,9}
function SubmitButton({ submitAction }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await submitAction();
        });
      }}
    >
      Submit
    </button>
  );
}

```

</Note>



#### المعاملات {/*starttransition-parameters*/}

* `action`: دالة تحدّث بعض الحالة باستدعاء واحدة أو أكثر من [دوال `set`](/reference/react/useState#setstate). يستدعي React `action` فورًا دون معاملات ويوسّم كل تحديثات الحالة المجدولة بشكل متزامن أثناء استدعاء دالة `action` كانتقالات. أي استدعاءات غير متزامنة تُنتظر (`await`) داخل `action` تُدرج في الانتقالة، لكنها حاليًا تتطلّب لفّ أي دوال `set` بعد `await` في `startTransition` إضافي (راجع [استكشاف الأخطاء](#react-doesnt-treat-my-state-update-after-await-as-a-transition)). تحديثات الحالة الموسومة كانتقالات تكون [غير حاجزة](#marking-a-state-update-as-a-non-blocking-transition) و[لا تعرض مؤشرات تحميل غير مرغوبة](#preventing-unwanted-loading-indicators).

#### القيمة المعادة {/*starttransition-returns*/}

لا تعيد `startTransition` أي قيمة.

#### ملاحظات مهمة {/*starttransition-caveats*/}

* `useTransition` هو Hook، لذا يُستدعى فقط داخل المكوّنات أو الـ Hooks المخصّصة. إذا احتجت لبدء انتقالة في مكان آخر (مثلًا من مكتبة بيانات)، استدعِ [`startTransition`](/reference/react/startTransition) المستقل بدلًا من ذلك.

* يمكنك لفّ تحديث في انتقالة فقط إذا كان بإمكانك الوصول إلى دالة `set` لتلك الحالة. إذا أردت بدء انتقالة استجابةً لخاصية أو قيمة من Hook مخصّص، جرّب [`useDeferredValue`](/reference/react/useDeferredValue) بدلًا من ذلك.

* الدالة التي تُمرّرها إلى `startTransition` تُستدعى فورًا، فيُوسَّم كل تحديث حالة يحدث أثناء تنفيذها كانتقالات. إذا حاولت تنفيذ تحديثات حالة داخل `setTimeout` مثلًا، فلن تُوسَّم كانتقالات.

* يجب لفّ أي تحديثات حالة بعد أي طلبات غير متزامنة في `startTransition` آخر لتوسيمها كانتقالات. هذا قيد معروف وسيُصلَح مستقبلًا (راجع [استكشاف الأخطاء](#react-doesnt-treat-my-state-update-after-await-as-a-transition)).

* دالة `startTransition` لهوية مستقرة، لذا غالبًا تُحذف من تبعيات التأثيرات، لكن تضمينها لن يُطلِق التأثير. إذا سمح linter بحذف تبعية دون أخطاء، فالأمر آمن. [تعرّف أكثر على إزالة تبعيات التأثيرات.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* قد يُقاطع تحديث الحالة الموسوم كانتقالة بتحديثات حالة أخرى. على سبيل المثال، إذا حدّثت مكوّن مخطط داخل انتقالة ثم بدأت الكتابة في حقل إدخال بينما المخطط في منتصف إعادة الرسم، يعيد React عمل الرسم على مكوّن المخطط بعد معالجة تحديث الإدخال.

* لا يمكن استخدام تحديثات الانتقالة للتحكم في حقول النص.

* إذا كانت هناك عدة انتقالات جارية، يجمع React حاليًا بينها. هذا قيد قد يُزال في إصدار لاحق.

## الاستخدام {/*usage*/}

### تنفيذ تحديثات غير حاجزة بإجراءات (Actions) {/*perform-non-blocking-updates-with-actions*/}

استدعِ `useTransition` في أعلى مكوّنك لإنشاء إجراءات (Actions) والوصول إلى حالة التعليق:

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import {useState, useTransition} from 'react';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

يعيد `useTransition` مصفوفة من عنصرين بالضبط:

1. <CodeStep step={1}>علم `isPending`</CodeStep> الذي يخبرك ما إذا كانت هناك انتقالة معلّقة.
2. <CodeStep step={2}>دالة `startTransition`</CodeStep> التي تتيح لك إنشاء إجراء (Action).

لبدء انتقالة، مرّر دالة إلى `startTransition` هكذا:

```js
import {useState, useTransition} from 'react';
import {updateQuantity} from './api';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);

  function onSubmit(newQuantity) {
    startTransition(async function () {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  }
  // ...
}
```

الدالة المُمرَّرة إلى `startTransition` تُسمّى «الإجراء» (Action). يمكنك تحديث الحالة و(اختياريًا) تنفيذ تأثيرات جانبية داخل إجراء، ويُنفَّذ العمل في الخلفية دون حظر تفاعلات المستخدم مع الصفحة. قد تشمل الانتقالة عدة إجراءات، وطالما الانتقالة قيد التقدم تبقى واجهتك مستجيبة. على سبيل المثال، إذا نقرت على تبويب ثم غيّرت رأيك ونقرت تبويبًا آخر، يُعالَج النقر الثاني فورًا دون انتظار انتهاء التحديث الأول.

لإعطاء المستخدم ملاحظات عن الانتقالات الجارية، تتحول حالة `isPending` إلى `true` عند أول استدعاء لـ `startTransition` وتبقى `true` حتى تكتمل كل الإجراءات وتُعرض الحالة النهائية للمستخدم. تضمن الانتقالات اكتمال التأثيرات الجانبية في الإجراءات بترتيب يُساعد على [منع مؤشرات التحميل غير المرغوبة](#preventing-unwanted-loading-indicators)، ويمكنك إعطاء ملاحظات فورية أثناء الانتقالة باستخدام `useOptimistic`.

<Recipes titleText="الفرق بين الإجراءات والتعامل العادي مع الأحداث">

#### تحديث الكمية داخل إجراء {/*updating-the-quantity-in-an-action*/}

في هذا المثال، تحاكي دالة `updateQuantity` طلبًا إلى الخادم لتحديث كمية العنصر في السلة. هذه الدالة *مُبطَّأة عن قصد* بحيث يستغرق الطلب ثانية على الأقل.

حدّث الكمية عدة مرات بسرعة. لاحظ أن حالة «الإجمالي» المعلّقة تظهر أثناء أي طلبات جارية، وأن «الإجمالي» يتحدّث فقط بعد اكتمال الطلب الأخير. لأن التحديث داخل إجراء، يمكن أن تستمر «الكمية» بالتحديث أثناء سير الطلب.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const updateQuantityAction = async newQuantity => {
    // To access the pending state of a transition,
    // call startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}
```

```js src/Item.js
import { startTransition } from "react";

export default function Item({action}) {
  function handleChange(event) {
    // To expose an action prop, await the callback in startTransition.
    startTransition(async () => {
      await action(event.target.value);
    })
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

هذا مثال أساسي يوضّح عمل الإجراءات، لكنه لا يتعامل مع اكتمال الطلبات بترتيب خاطئ. عند تحديث الكمية عدة مرات، قد تنتهي طلبات سابقة بعد طلبات لاحقة فيُحدَّث الترتيب بشكل خاطئ. هذا قيد معروف وسيُصلَح مستقبلًا (راجع [استكشاف الأخطاء](#my-state-updates-in-transitions-are-out-of-order) أدناه).

لحالات الاستخدام الشائعة، يوفّر React تجريدات مدمجة مثل:
- [`useActionState`](/reference/react/useActionState)
- [إجراءات `<form>`](/reference/react-dom/components/form)
- [دوال الخادم (Server Functions)](/reference/rsc/server-functions)

تتولى هذه الحلول ترتيب الطلبات نيابةً عنك. عند استخدام الانتقالات لبناء Hooks أو مكتبات خاصة تدير انتقالات حالة غير متزامنة، يزداد تحكّمك بترتيب الطلبات، لكن عليك التعامل معه بنفسك.

<Solution />

#### تحديث الكمية دون إجراء {/*updating-the-users-name-without-an-action*/}

في هذا المثال، تحاكي دالة `updateQuantity` أيضًا طلبًا إلى الخادم لتحديث كمية العنصر في السلة. هذه الدالة *مُبطَّأة عن قصد* بحيث يستغرق الطلب ثانية على الأقل.

حدّث الكمية عدة مرات بسرعة. لاحظ أن حالة «الإجمالي» المعلّقة تظهر أثناء أي طلبات جارية، لكن «الإجمالي» يتحدّث عدة مرات مع كل نقرة على «الكمية»:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async newQuantity => {
    // Manually set the isPending State.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({onUpdateQuantity}) {
  function handleChange(event) {
    onUpdateQuantity(event.target.value);
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

حل شائع لهذه المشكلة هو منع المستخدم من إجراء تغييرات أثناء تحديث الكمية:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async event => {
    const newQuantity = event.target.value;
    // Manually set the isPending state.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item isPending={isPending} onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({isPending, onUpdateQuantity}) {
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        disabled={isPending}
        onChange={onUpdateQuantity}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

هذا الحل يجعل التطبيق يبدو بطيئًا لأن المستخدم ينتظر في كل مرة يحدّث فيها الكمية. يمكن إضافة تعامل أيدوي أعقّد للسماح بالتفاعل مع الواجهة أثناء التحديث، لكن الإجراءات تتولى هذه الحالة بواجهة مدمجة مباشرة.

<Solution />

</Recipes>

---

### كشف خاصية `action` من المكوّنات {/*exposing-action-props-from-components*/}

يمكنك كشف خاصية `action` من مكوّن لتسمح للأب باستدعاء إجراء.

على سبيل المثال، يلفّ مكوّن `TabButton` هذا منطق `onClick` في خاصية `action`:

```js {8-12}
export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        // await the action that's passed in.
        // This allows it to be either sync or async.
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

لأن المكوّن الأب يحدّث حالته داخل `action`، يُوسَّم ذلك التحديث كانتقالة. يعني ذلك أنه يمكنك النقر على «Posts» ثم النقر فورًا على «Contact» دون حظر تفاعلات المستخدم:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={async () => {
      startTransition(async () => {
        // await the action that's passed in.
        // This allows it to be either sync or async.
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

<Note>

عند كشف خاصية `action` من مكوّن، يُفضَّل `await` لها داخل الانتقالة.

يسمح ذلك لـ callback الـ `action` أن يكون متزامنًا أو غير متزامن دون الحاجة إلى `startTransition` إضافي يلفّ `await` داخل الإجراء.

</Note>

---

### عرض حالة بصرية للتعليق {/*displaying-a-pending-visual-state*/}

يمكنك استخدام القيمة المنطقية `isPending` التي يعيدها `useTransition` لإعلام المستخدم أن انتقالة قيد التنفيذ. على سبيل المثال، يمكن أن يكون للزر حالة بصرية خاصة بـ «معلّق»:

```js {4-6}
function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

لاحظ أن النقر على «Posts» يبدو أكثر استجابة لأن زر التبويب نفسه يتحدّث فورًا:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

---

### منع مؤشرات التحميل غير المرغوبة {/*preventing-unwanted-loading-indicators*/}

في هذا المثال، يجلب مكوّن `PostsTab` بعض البيانات باستخدام [use](/reference/react/use). عند النقر على تبويب «Posts»، يعلّق مكوّن `PostsTab`، فيظهر أقرب بديل تحميل:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js
export default function TabButton({ action, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      action();
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

إخفاء حاوية التبويبات بأكملها لإظهار مؤشر تحميل يخلق تجربة مزعجة. إذا أضفت `useTransition` إلى `TabButton`، يمكنك بدلًا من ذلك عرض حالة التعليق في زر التبويب نفسه.

لاحظ أن النقر على «Posts» لم يعد يستبدل حاوية التبويبات بأكملها بمؤشر دوار:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[اقرأ المزيد عن استخدام الانتقالات مع Suspense.](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

<Note>

لا تنتظر الانتقالات (Transitions) إلا ما يكفي لتجنّب إخفاء محتوى *ظهر بالفعل* (مثل حاوية التبويبات). إذا كان لتبويب Posts [حد `<Suspense>` متداخل،](/reference/react/Suspense#revealing-nested-content-as-it-loads) فلن «تنتظر»ه الانتقالة.

</Note>

---

### بناء موجّه يدعم Suspense {/*building-a-suspense-enabled-router*/}

إذا كنت تبني إطار React أو موجّهًا (router)، نوصي بتوسيم تنقّلات الصفحات كانتقالات (Transitions).

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

يُنصَح بذلك لثلاثة أسباب:

- [الانتقالات قابلة للمقاطعة،](#marking-a-state-update-as-a-non-blocking-transition) ما يتيح للمستخدم النقر بعيدًا دون انتظار اكتمال إعادة الرسم.
- [الانتقالات تمنع مؤشرات التحميل غير المرغوبة،](#preventing-unwanted-loading-indicators) ما يجنّب المستخدم قفزات مزعجة عند التنقّل.
- [الانتقالات تنتظر كل الإجراءات المعلّقة](#perform-non-blocking-updates-with-actions) ما يتيح اكتمال التأثيرات الجانبية قبل إظهار الصفحة الجديدة.

فيما يلي مثال موجّه مبسّط يستخدم الانتقالات للتنقّلات.

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

<Note>

يُتوقَّع من [الموجّهات المفعّلة لـ Suspense](/reference/react/Suspense) أن تلفّ تحديثات التنقّل في انتقالات افتراضيًا.

</Note>

---

### عرض خطأ للمستخدم بحد خطأ (Error Boundary) {/*displaying-an-error-to-users-with-error-boundary*/}

إذا رمت الدالة المُمرَّرة إلى `startTransition` خطأ، يمكنك عرض الخطأ للمستخدم باستخدام [حد خطأ (error boundary)](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). لاستخدام حد خطأ، لفّ المكوّن الذي تستدعي فيه `useTransition` داخل حد خطأ. عندما تفشل الدالة المُمرَّرة إلى `startTransition`، يُعرض بديل حد الخطأ.

<Sandpack>

```js src/AddCommentContainer.js active
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // For demonstration purposes to show Error Boundary
  if (comment == null) {
    throw new Error("Example Error: An error thrown to trigger error boundary");
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // Intentionally not passing a comment
          // so error gets thrown
          addComment();
        });
      }}
    >
      Add comment
    </button>
  );
}
```

```js src/App.js hidden
import { AddCommentContainer } from "./AddCommentContainer.js";

export default function App() {
  return <AddCommentContainer />;
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## استكشاف الأخطاء {/*troubleshooting*/}

### تحديث حقل إدخال داخل انتقالة لا يعمل {/*updating-an-input-in-a-transition-doesnt-work*/}

لا يمكنك استخدام انتقالة لمتغير حالة يتحكم في حقل إدخال:

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Can't use Transitions for controlled input state
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

ذلك لأن الانتقالات غير حاجزة، بينما يجب أن يحدث تحديث الإدخال استجابةً لحدث التغيير بشكل متزامن. إذا أردت تشغيل انتقالة استجابةً للكتابة، لديك خياران:

1. يمكنك تعريف متغيري حالة منفصلين: أحدهما لحالة الإدخال (يتحدّث دائمًا بشكل متزامن)، وآخر تُحدّثه داخل انتقالة. يتيح لك ذلك التحكم في الإدخال بالحالة المتزامنة، وتمرير متغير حالة الانتقالة (الذي سيتأخر عن الإدخال) إلى بقية منطق الرسم.
2. أو يمكنك الاكتفاء بمتغير حالة واحد وإضافة [`useDeferredValue`](/reference/react/useDeferredValue) الذي سيتأخر عن القيمة الحقيقية. سيُطلِق إعادة رسم غير حاجزة لتلحق بالقيمة الجديدة تلقائيًا.

---

### React لا يعامل تحديث حالتي كانتقالة {/*react-doesnt-treat-my-state-update-as-a-transition*/}

عند لفّ تحديث حالة في انتقالة، تأكد أنه يحدث *أثناء* استدعاء `startTransition`:

```js
startTransition(() => {
  // ✅ Setting state *during* startTransition call
  setPage('/about');
});
```

يجب أن تكون الدالة المُمرَّرة إلى `startTransition` متزامنة. لا يمكنك توسيم تحديث كانتقالة هكذا:

```js
startTransition(() => {
  // ❌ Setting state *after* startTransition call
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

بدلًا من ذلك يمكنك فعل التالي:

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ Setting state *during* startTransition call
    setPage('/about');
  });
}, 1000);
```

---

### React لا يعامل تحديث حالتي بعد `await` كانتقالة {/*react-doesnt-treat-my-state-update-after-await-as-a-transition*/}

عند استخدام `await` داخل دالة `startTransition`، لا تُوسَّم تحديثات الحالة التي تحدث بعد `await` كانتقالات. يجب لفّ تحديثات الحالة بعد كل `await` في استدعاء `startTransition`:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ Not using startTransition after await
  setPage('/about');
});
```

لكن هذا يعمل:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ✅ Using startTransition *after* await
  startTransition(() => {
    setPage('/about');
  });
});
```

هذا قيد في JavaScript لأن React يفقد نطاق السياق غير المتزامن. مستقبلًا، عندما يتوفر [AsyncContext](https://github.com/tc39/proposal-async-context)، سيُزال هذا القيد.

---

### أريد استدعاء `useTransition` من خارج مكوّن {/*i-want-to-call-usetransition-from-outside-a-component*/}

لا يمكنك استدعاء `useTransition` خارج مكوّن لأنه Hook. في هذه الحالة استخدم [`startTransition`](/reference/react/startTransition) المستقل. يعمل بنفس الأسلوب لكنه لا يوفّر مؤشر `isPending`.

---

### الدالة التي أُمرّرها إلى `startTransition` تُنفَّذ فورًا {/*the-function-i-pass-to-starttransition-executes-immediately*/}

إذا شغّلت هذا الكود، سيُطبَع 1، 2، 3:

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**من المتوقع أن يُطبَع 1، 2، 3.** الدالة المُمرَّرة إلى `startTransition` لا تُؤجَّل. على عكس `setTimeout` في المتصفح، لا يُشغَّل الـ callback لاحقًا. ينفّذ React دالتك فورًا، لكن أي تحديثات حالة مجدولة *أثناء تشغيلها* تُوسَّم كانتقالات. يمكنك تخيّل أنها تعمل هكذا:

```js
// A simplified version of how React works

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... schedule a Transition state update ...
  } else {
    // ... schedule an urgent state update ...
  }
}
```

### تحديثات حالتي في الانتقالات خارج الترتيب {/*my-state-updates-in-transitions-are-out-of-order*/}

إذا استخدمت `await` داخل `startTransition`، قد ترى التحديثات تحدث بترتيب خاطئ.

في هذا المثال، تحاكي دالة `updateQuantity` طلبًا إلى الخادم لتحديث كمية العنصر في السلة. هذه الدالة *تُرجِع عن قصد كل طلب ثانٍ بعد السابق* لمحاكاة سباقات طلبات الشبكة.

جرّب تحديث الكمية مرة، ثم حدّثها بسرعة عدة مرات. قد ترى إجماليًا غير صحيح:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);

  const updateQuantityAction = newQuantity => {
    setClientQuantity(newQuantity);

    // Access the pending state of the transition,
    // by wrapping in startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
import {startTransition} from 'react';

export default function Item({action}) {
  function handleChange(e) {
    // Update the quantity in an Action.
    startTransition(async () => {
      await action(e.target.value);
    });
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({ clientQuantity, savedQuantity, isPending }) {
  return (
    <div className="total">
      <span>Total:</span>
      <div>
        <div>
          {isPending
            ? "🌀 Updating..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `Wrong total, expected: ${intl.format(clientQuantity * 9999)}`}
        </div>
      </div>
    </div>
  );
}
```

```js src/api.js
let firstRequest = true;
export async function updateQuantity(newName) {
  return new Promise((resolve, reject) => {
    if (firstRequest === true) {
      firstRequest = false;
      setTimeout(() => {
        firstRequest = true;
        resolve(newName);
        // Simulate every other request being slower
      }, 1000);
    } else {
      setTimeout(() => {
        resolve(newName);
      }, 50);
    }
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.total div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error {
  color: red;
}
```

</Sandpack>


عند النقر عدة مرات، قد تنتهي طلبات سابقة بعد طلبات لاحقة. عندها لا يملك React حاليًا وسيلة لمعرفة الترتيب المقصود. ذلك لأن التحديثات تُجدول بشكل غير متزامن، ويفقد React سياق الترتيب عبر حدود غير متزامنة.

هذا متوقع، لأن الإجراءات داخل انتقالة لا تضمن ترتيب التنفيذ. لحالات الاستخدام الشائعة، يوفّر React تجريدات أعلى مثل [`useActionState`](/reference/react/useActionState) و[إجراءات `<form>`](/reference/react-dom/components/form) تتولى الترتيب نيابةً عنك. للحالات المتقدمة، ستحتاج لتنفيذ منطق طوابير وإلغاء خاص بك.


مثال على `useActionState` يتعامل مع ترتيب التنفيذ:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useActionState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);
  const [quantity, updateQuantityAction, isPending] = useActionState(
    async (prevState, payload) => {
      setClientQuantity(payload);
      const savedQuantity = await updateQuantity(payload);
      return savedQuantity; // Return the new quantity to update the state
    },
    1 // Initial quantity
  );

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
import {startTransition} from 'react';

export default function Item({action}) {
  function handleChange(e) {
    // Update the quantity in an Action.
    startTransition(() => {
      action(e.target.value);
    });
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({ clientQuantity, savedQuantity, isPending }) {
  return (
    <div className="total">
      <span>Total:</span>
      <div>
        <div>
          {isPending
            ? "🌀 Updating..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `Wrong total, expected: ${intl.format(clientQuantity * 9999)}`}
        </div>
      </div>
    </div>
  );
}
```

```js src/api.js
let firstRequest = true;
export async function updateQuantity(newName) {
  return new Promise((resolve, reject) => {
    if (firstRequest === true) {
      firstRequest = false;
      setTimeout(() => {
        firstRequest = true;
        resolve(newName);
        // Simulate every other request being slower
      }, 1000);
    } else {
      setTimeout(() => {
        resolve(newName);
      }, 50);
    }
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.total div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error {
  color: red;
}
```

</Sandpack>
