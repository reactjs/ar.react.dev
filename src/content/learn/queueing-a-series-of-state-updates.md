---
title: ترتيب سلسلة من تحديثات الحالة
---

<Intro>

تعيين متغير حالة يضع عملية رسم أخرى في الطابور. لكن أحيانًا قد ترغب في تنفيذ عدة عمليات على القيمة قبل طلب الرسم التالي. لفعل ذلك، يفيد أن تفهم كيف يجمع React تحديثات الحالة.

</Intro>

<YouWillLearn>

* ما «التجميع» وكيف يستخدمه React لمعالجة عدة تحديثات للحالة
* كيف تطبق عدة تحديثات على نفس متغير الحالة متتاليةً

</YouWillLearn>

## React يجمع تحديثات الحالة {/*react-batches-state-updates*/}

قد تتوقع أن النقر على زر «+3» يزيد العداد ثلاث مرات لأنه يستدعي `setNumber(number + 1)` ثلاث مرات:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

لكن كما قد تتذكر من القسم السابق، [قيم حالة كل رسم ثابتة](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)، لذا قيمة `number` داخل معالج حدث الرسم الأول تكون دائمًا `0` مهما استدعيت `setNumber(1)`:

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

لكن هناك عامل آخر. **React ينتظر حتى يُنفَّذ كل الكود في معالجات الأحداث قبل معالجة تحديثات الحالة.** لذلك لا يحدث إعادة الرسم إلا *بعد* كل استدعاءات `setNumber()` هذه.

قد يذكرك ذلك بنادل يأخذ طلبًا في مطعم. النادل لا يركض إلى المطبخ عند ذكر أول طبق! بل يتركك تكمل طلبك وتعدّله، وقد يأخذ طلبات آخرين على نفس الطاولة.

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="مؤشر أنيق في مطعم يضع طلبًا عدة مرات مع React بدور النادل. بعد أن تستدعي setState() عدة مرات، يكتب النادل آخر ما طلبته كطلبها النهائي." />

هذا يتيح لك تحديث عدة متغيرات حتى من عدة مكوّنات دون إطلاق عدد كبير من [إعادات الرسم.](/learn/render-and-commit#re-renders-when-state-updates) لكنه يعني أيضًا أن الواجهة لا تُحدَّث حتى *بعد* انتهاء معالج الحدث وكل ما فيه. هذا السلوك، المعروف أيضًا باسم **التجميع،** يجعل تطبيق React أسرع كثيرًا. ويتجنب التعامل مع رسم «نصف مكتمل» مربك حيث تُحدَّث بعض المتغيرات فقط.

**React لا يجمع بين عدة أحداث مقصودة مثل النقرات** — كل نقرة تُعالَج على حدة. اطمئن إلى أن React يجمع فقط عندما يكون ذلك آمنًا عمومًا. يضمن ذلك مثلًا أنه إن عطّلت النقرة الأولى نموذجًا، فلن يُعاد إرساله بالنقرة الثانية.

## تحديث نفس الحالة عدة مرات قبل الرسم التالي {/*updating-the-same-state-multiple-times-before-the-next-render*/}

حالة استخدام نادرة، لكن إن أردت تحديث نفس متغير الحالة عدة مرات قبل الرسم التالي، بدل تمرير *قيمة الحالة التالية* مثل `setNumber(number + 1)`، يمكنك تمرير *دالة* تحسب الحالة التالية اعتمادًا على السابقة في الطابور، مثل `setNumber(n => n + 1)`. هي طريقة لتقول لReact «افعل شيئًا بقيمة الحالة» بدل استبدالها فقط.

جرّب زيادة العداد الآن:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

هنا، `n => n + 1` تُسمى **دالة المحدّث.** عند تمريرها إلى مُعيّن الحالة:

1. يضع React هذه الدالة في طابور لمعالجتها بعد انتهاء كل الكود الآخر في معالج الحدث.
2. أثناء الرسم التالي، يمر React على الطابور ويعطيك الحالة النهائية بعد التحديث.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

هكذا يعمل React مع هذه الأسطر أثناء تنفيذ معالج الحدث:

1. `setNumber(n => n + 1)`: `n => n + 1` دالة. React يضيفها إلى طابور.
1. `setNumber(n => n + 1)`: `n => n + 1` دالة. React يضيفها إلى طابور.
1. `setNumber(n => n + 1)`: `n => n + 1` دالة. React يضيفها إلى طابور.

عند استدعاء `useState` أثناء الرسم التالي، يمر React على الطابور. كانت حالة `number` السابقة `0`، فيمرّر React ذلك إلى أول دالة محدّث كوسيط `n`. ثم يأخذ قيمة الإرجاع من دالة المحدّث السابقة ويمرّرها إلى التالية كـ `n`، وهكذا:

|  التحديث في الطابور | `n` | الإرجاع |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

يخزن React `3` كنتيجة نهائية ويعيدها من `useState`.

لذلك النقر على «+3» في المثال أعلاه يزيد القيمة بثلاثة بشكل صحيح.
### ماذا يحدث إن حدّثت الحالة بعد استبدالها {/*what-happens-if-you-update-state-after-replacing-it*/}

وماذا عن معالج الحدث هذا؟ ما رأيك في قيمة `number` في الرسم التالي؟

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

هذا ما يطلبه معالج الحدث من React:

1. `setNumber(number + 5)`: `number` تساوي `0`، فيصبح `setNumber(0 + 5)`. React يضيف *«استبدال بـ `5`»* إلى طابوره.
2. `setNumber(n => n + 1)`: `n => n + 1` دالة محدّث. React يضيف *تلك الدالة* إلى الطابور.

أثناء الرسم التالي، يمر React على طابور الحالة:

|   التحديث في الطابور       | `n` | الإرجاع |
|--------------|---------|-----|
| «استبدال بـ `5`» | `0` (غير مستخدم) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

يخزن React `6` كنتيجة نهائية ويعيدها من `useState`. 

<Note>

قد لاحظت أن `setState(5)` يعمل فعلًا مثل `setState(n => 5)`، لكن `n` غير مستخدم!

</Note>

### ماذا يحدث إن استبدلت الحالة بعد تحديثها {/*what-happens-if-you-replace-state-after-updating-it*/}

لنجرب مثالًا آخر. ما رأيك في قيمة `number` في الرسم التالي؟

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
        setNumber(42);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

هكذا يعمل React مع هذه الأسطر أثناء تنفيذ معالج الحدث:

1. `setNumber(number + 5)`: `number` تساوي `0`، فيصبح `setNumber(0 + 5)`. React يضيف *«استبدال بـ `5`»* إلى الطابور.
2. `setNumber(n => n + 1)`: `n => n + 1` دالة محدّث. React يضيف *تلك الدالة* إلى الطابور.
3. `setNumber(42)`: React يضيف *«استبدال بـ `42`»* إلى الطابور.

أثناء الرسم التالي، يمر React على طابور الحالة:

|   التحديث في الطابور       | `n` | الإرجاع |
|--------------|---------|-----|
| «استبدال بـ `5`» | `0` (غير مستخدم) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| «استبدال بـ `42`» | `6` (غير مستخدم) | `42` |

ثم يخزن React `42` كنتيجة نهائية ويعيدها من `useState`.

باختصار، هكذا يمكنك التفكير فيما تمرّره إلى مُعيّن الحالة `setNumber`:

* **دالة محدّث** (مثل `n => n + 1`) تُضاف إلى الطابور.
* **أي قيمة أخرى** (مثل الرقم `5`) تضيف «استبدال بـ `5`» إلى الطابور، متجاهلةً ما في الطابور مسبقًا.

بعد انتهاء معالج الحدث، يطلق React إعادة رسم. أثناءها يعالج الطابور. دوال المحدّث تُنفَّذ أثناء الرسم، لذا **يجب أن تكون دوال المحدّث [نقية](/learn/keeping-components-pure)** وتُرجع النتيجة فقط. لا تحاول تعيين الحالة من داخلها أو تشغيل تأثيرات جانبية أخرى. في الوضع الصارم، يشغّل React كل دالة محدّث مرتين (لكن يتجاهل النتيجة الثانية) لمساعدتك على اكتشاف الأخطاء.

### تسميات متعارف عليها {/*naming-conventions*/}

شائع تسمية وسيط دالة المحدّث بالحرفين الأولين من متغير الحالة المقابل:

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

إن فضّلت كودًا أوضح، تسمية أخرى شائعة هي تكرار اسم متغير الحالة كاملًا، مثل `setEnabled(enabled => !enabled)`، أو بادئة مثل `setEnabled(prevEnabled => !prevEnabled)`.

<Recap>

* تعيين الحالة لا يغيّر المتغير في الرسم الحالي، لكنه يطلب رسمًا جديدًا.
* React يعالج تحديثات الحالة بعد انتهاء معالجات الأحداث. هذا يُسمى التجميع.
* لتحديث بعض الحالة عدة مرات في حدث واحد، يمكنك استخدام دالة المحدّث `setNumber(n => n + 1)`.

</Recap>



<Challenges>

#### إصلاح عدّاد الطلبات {/*fix-a-request-counter*/}

تعمل على تطبيق سوق فنون يتيح للمستخدم تقديم عدة طلبات لقطعة فنية في آن واحد. في كل ضغطة على زر «Buy»، يجب أن يزيد عدّاد «Pending» بواحد. بعد ثلاث ثوانٍ، يجب أن ينقص عدّاد «Pending» ويزيد عدّاد «Completed».

لكن عدّاد «Pending» لا يتصرف كما يُراد. عند الضغط على «Buy» ينخفض إلى `-1` (وهذا لا يجب أن يحدث!). وإن نقرت بسرعة مرتين، يبدو أن العدّادين يتصرفان بشكل غير متوقع.

لماذا يحدث هذا؟ أصلح العدّادين.

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

داخل معالج الحدث `handleClick`، قيم `pending` و`completed` تطابق ما كانت عليه وقت حدث النقر. في الرسم الأول، كانت `pending` تساوي `0`، فيصبح `setPending(pending - 1)` هو `setPending(-1)`، وهذا خطأ. بما أنك تريد *زيادة* أو *نقصان* العدّادات بدل تعيينها لقيمة محددة وقت النقر، يمكنك تمرير دوال المحدّث بدل ذلك:

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

هذا يضمن أن الزيادة أو النقصان يتم بالنسبة إلى *أحدث* حالة لا ما كانت عليه وقت النقر.

</Solution>

#### نفّذ طابور الحالة بنفسك {/*implement-the-state-queue-yourself*/}

في هذا التحدي، ستعيد تنفيذ جزء صغير من React من الصفر! الأمر أسهل مما يبدو.

مرّر في معاينة الـ sandbox. لاحظ أنها تعرض **أربع حالات اختبار.** تطابق الأمثلة التي رأيتها سابقًا في هذه الصفحة. مهمتك تنفيذ الدالة `getFinalState` لتعيد النتيجة الصحيحة لكل حالة. إن نفّذتها صحيحًا، يجب أن تنجح الاختبارات الأربعة.

ستستقبل وسيطين: `baseState` هي الحالة الأولية (مثل `0`)، و`queue` مصفوفة فيها أرقام (مثل `5`) ودوال محدّث (مثل `n => n + 1`) بالترتيب الذي أُضيفت به.

مهمتك إرجاع الحالة النهائية، كما توضح الجداول في هذه الصفحة!

<Hint>

إن شعرت بالجمود، ابدأ بهيكل الكود هذا:

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: apply the updater function
    } else {
      // TODO: replace the state
    }
  }

  return finalState;
}
```

أكمل الأسطر الناقصة!

</Hint>

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: do something with the queue...

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

هذا نفس الخوارزمية الموضحة في هذه الصفحة التي يستخدمها React لحساب الحالة النهائية:

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Apply the updater function.
      finalState = update(finalState);
    } else {
      // Replace the next state.
      finalState = update;
    }
  }

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

الآن تعرف كيف يعمل هذا الجزء من React!

</Solution>

</Challenges>
