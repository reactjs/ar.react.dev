---
title: ترتيب سلسلة من تحديثات الحالة
---

<Intro>

تعيين متغير حالة سيؤدي إلى ترتيب إعادة عرض أخرى. لكن أحيانًا قد ترغب في تنفيذ عدة عمليات على القيمة قبل ترتيب إعادة العرض التالية. لفعل ذلك، من المفيد فهم كيفية قيام React بتجميع تحديثات الحالة.
</Intro>

<YouWillLearn>

* ما هو مفهوم "التجميع" وكيف يستخدم React هذا التجميع لمعالجة تحديثات الحالة المتعددة
* كيفية تطبيق عدة تحديثات على نفس متغير الحالة بشكل متتالي.

</YouWillLearn>

## React batches state updates {/*react-batches-state-updates*/}

قد تتوقع أنه عند النقر على زر "+3"، سيتم زيادة العداد ثلاث مرات لأنه يستدعي setNumber(number + 1) ثلاث مرات.

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

ومع ذلك، كما قد تتذكر من القسم السابق، [each render's state values are fixed](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time),
، لذلك فإن قيمة number داخل مُعالج حدث العرض الأول دائمًا تكون 0، بغض النظر عن عدد المرات التي تستدعي فيها setNumber(1)
```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

. React ينتظر حتى يتم تنفيذ كل الكود داخل مُعالجات الأحداث قبل أن يقوم بمعالجة لكن هناك عامل آخر مؤثر هنا
setNumber() هذهتحديثات الحالة الخاصة بك. لهذا السبب، تحدث إعادة العرض فقط بعد استدعاء جميع

قد يُذكّرك هذا بالنادل الذي يأخذ طلبًا في المطعم. لا يركض النادل إلى المطبخ عند ذكر الطبق الأول فقط! بدلاً من ذلك، يتركك تُكمل طلبك، ويتيح لك تعديل الطلب، بل ويأخذ طلبات الآخرين على الطاولة أيضًا

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="An elegant cursor at a restaurant places and order multiple times with React, playing the part of the waiter. After she calls setState() multiple times, the waiter writes down the last one she requested as her final order." />

هذا يسمح لك بتحديث عدة متغيرات حالة—حتى من مكونات متعددة—دون تشغيل الكثير من[re-renders.](/learn/render-and-commit#re-renders-when-state-updates)لكن هذا يعني أيضًا أن واجهة المستخدم لن يتم تحديثها إلا بعد اكتمال مُعالِج الحدث الخاص بك، وأي كود بداخله. يُعرف هذاالخاص بك يعمل بشكل أسرع بكثير. كما أنه يتجنب التعامل مع إعادة React ويجعل تطبيق**اbatching **لسلوك أيضًا باسم العروض "نصف المكتملة" المربكة حيث يتم تحديث بعض المتغيرات فقط

**React does not batch across *multiple* intentional events like clicks**React لا يقوم بالتجميع عبر عدة أحداث مقصودة مثل النقرات—فكل نقرة تُعالج بشكل منفصل. كن مطمئنًا أن React يقوم بالتجميع فقط عندما يكون ذلك آمنًا بشكل عام. هذا يضمن، على سبيل المثال، أنه إذا قامت النقرة الأولى على الزر بتعطيل نموذج، فلن تقوم النقرة الثانية بإرساله مرة أخرى

## Updating the same state multiple times before the next render {/*updating-the-same-state-multiple-times-before-the-next-render*/}

##  {/*updating-the-same-state-multiple-times-before-the-next-render*/}تحديث نفس الحالة عدة مرات قبل إعادة العرض التالية

هذه حالة استخدام غير شائعة، ولكن إذا أردت تحديث نفس متغير الحالة عدة مرات قبل إعادة العرض التالية، بدلًا من تمرير القيمة التالية للحالة مثل setNumber(number + 1)، يمكنك تمرير دالة تحسب الحالة التالية بناءً على القيمة السابقة في قائمة الانتظار، مثل setNumber(n => n + 1). هذه طريقة لإخبار React بـ "القيام بشيء مع قيمة الحالة" بدلًا من مجرد استبدالها.

جرّب الآن زيادة العداد:

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

هنا، n => n + 1 تُسمى دالة تحديث. عند تمريرها إلى مُعيّن الحالة:

1. يقوم React بوضع هذه الدالة في قائمة الانتظار ليتم معالجتها بعد تنفيذ جميع الكود الآخر في معالج الحدث
2. خلال عملية العرض التالية، يقوم React بالمرور عبر قائمة الانتظار ويعطيك الحالة النهائية المحدثة

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

إليك كيف يعمل React على هذه الأسطر من الشيفرة أثناء تنفيذ معالج الحدث:

1. `setNumber(n => n + 1)`: `n => n + 1` is a function. React adds it to a queue.
1. `setNumber(n => n + 1)`: `n => n + 1` is a function. React adds it to a queue.
1. `setNumber(n => n + 1)`: `n => n + 1` is a function. React adds it to a queue.

عندما تستدعي useState أثناء عملية إعادة العرض التالية، يقوم React بالمرور عبر قائمة الانتظار. كانت قيمة الحالة السابقة لـ number تساوي 0، لذلك يمررها React إلى الدالة المحدثة الأولى كوسيط n. بعد ذلك، يأخذ React قيمة الإرجاع من الدالة المحدثة السابقة ويمررها إلى المحدث التالي كـ n، وهكذا:

|  queued update | `n` | returns |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

يقوم React بتخزين القيمة 3 كالناتج النهائي ويعيدها من useState.

This is why clicking "+3" in the above example correctly increments the value by 3.

### What happens if you update state after replacing it {/*what-happens-if-you-update-state-after-replacing-it*/}

### ماذا يحدث إذا قمت بتحديث الحالة بعد استبدالها {/what-happens-if-you-update-state-after-replacing-it/}

ماذا عن هذا المعالج للحدث؟ ماذا تعتقد أن قيمة number ستكون في العرض التالي؟

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

هذا ما يخبر معالج الحدث هذا React بفعله:

1. setNumber(number + 5): قيمة number هي 0، لذا تصبح setNumber(0 + 5). يضيف React "استبدال بالقيمة 5" إلى قائمة الانتظار الخاصة به
2. setNumber(n => n + 1): n => n + 1 هي دالة تحديث. يضيف React تلك الدالة إلى قائمة الانتظار الخاصة به

أثناء إعادة العرض التالية، يمر React عبر قائمة انتظار الحالة:

|   queued update       | `n` | returns |
|--------------|---------|-----|
| "replace with `5`" | `0` (unused) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

يقوم React بتخزين القيمة 6 كنتيجة نهائية ويعيدها من useState. 

<Note>

قد تكون لاحظت أن setState(5) تعمل فعليًا مثل setState(n => 5)، لكن المتغير n غير مستخدم!

</Note>

### What happens if you replace state after updating it {/*what-happens-if-you-replace-state-after-updating-it*/}
### ماذا يحدث إذا قمت باستبدال الحالة بعد تحديثها {/what-happens-if-you-replace-state-after-updating-it/}

دعنا نجرب مثالاً آخر. ما رأيك، ما هي قيمة number في التحديث التالي للواجهة؟

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

إليك كيف يتعامل React مع هذه الأسطر من الكود أثناء تنفيذ معالج الحدث:

1. setNumber(number + 5): قيمة number هي 0، لذا يصبح setNumber(0 + 5). يقوم React بإضافة "استبدال بالقيمة 5" إلى قائمة الانتظار الخاصة به
2. setNumber(n => n + 1): n => n + 1 هي دالة تحديث (updater function). يقوم React بإضافة تلك الدالة إلى قائمة الانتظار الخاصة به
3. setNumber(42): يقوم React بإضافة "استبدال بالقيمة 42" إلى قائمة الانتظار الخاصة به

خلال عملية الـ render التالية، يقوم React بالمرور على قائمة انتظار الحالة (state queue):

|   queued update       | `n` | returns |
|--------------|---------|-----|
| "replace with `5`" | `0` (unused) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| "replace with `42`" | `6` (unused) | `42` |

بعد ذلك، يقوم React بتخزين القيمة 42 كنتيجة نهائية ويعيدها من useState.

لتلخيص، إليك كيف يمكنك التفكير فيما تمرره إلى دالة تغيير الحالة setNumber:

* **An updater function** (e.g. `n => n + 1`) gets added to the queue.
* **Any other value** (e.g. number `5`) adds "replace with `5`" to the queue, ignoring what's already queued.

After the event handler completes, React will trigger a re-render. During the re-render, React will process the queue. Updater functions run during rendering, so **updater functions must be [pure](/learn/keeping-components-pure)** and only *return* the result. Don't try to set state from inside of them or run other side effects. In Strict Mode, React will run each updater function twice (but discard the second result) to help you find mistakes.

### Naming conventions {/*naming-conventions*/}

### اتفاقيات التسمية {/naming-conventions/}

من الشائع تسمية الوسيط الخاص بدالة التحديث باستخدام الحروف الأولى من متغير الحالة المقابل:

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

إذا كنت تفضل كتابة الكود بشكل أكثر وضوحًا، فمن الشائع تكرار اسم متغير الحالة بالكامل، مثل setEnabled(enabled => !enabled)، أو استخدام بادئة مثل setEnabled(prevEnabled => !prevEnabled).

<Recap>

* تغيير الحالة لا يغيّر قيمة المتغير في عملية العرض الحالية، ولكنه يطلب إعادة عرض جديدة
* يقوم React بمعالجة تحديثات الحالة بعد أن تنتهي جميع معالجات الأحداث من التنفيذ. يُعرف هذا بالسلسلة (batching)
* لتحديث حالة معينة عدة مرات خلال حدث واحد، يمكنك استخدام دالة التحديث setNumber(n => n + 1)

</Recap>



<Challenges>

#### Fix a request counter {/*fix-a-request-counter*/}
### إصلاح عداد الطلبات {/fix-a-request-counter/}

أنت تعمل على تطبيق سوق للفنون يتيح للمستخدم تقديم عدة طلبات لعنصر فني في نفس الوقت. في كل مرة يضغط فيها المستخدم على زر "شراء"، يجب أن يزيد عداد "قيد الانتظار" بمقدار واحد. بعد ثلاث ثوانٍ، يجب أن يقل عداد "قيد الانتظار" ويزداد عداد "مكتمل".

ومع ذلك، فإن عداد "قيد الانتظار" لا يعمل كما هو مقصود. عند الضغط على زر "شراء"، ينخفض إلى -1 (وهو ما لا يجب أن يحدث!). وإذا نقرت بسرعة مرتين، يبدو أن كلا العدادين يتصرفان بشكل غير متوقع.

لماذا يحدث هذا؟ أصلح كلا العدادين.

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

داخل معالج حدث handleClick، قيم pending و completed تمثل ما كانت عليه في وقت وقوع حدث النقر. في أول عملية إعادة عرض، كانت قيمة pending هي 0، لذا يصبح setPending(pending - 1) هو setPending(-1)، وهذا خطأ. بما أنك تريد زيادة أو نقصان العدادين، بدلًا من تعيينهما إلى قيمة محددة عند النقر، يمكنك تمرير دوال التحديث بدلاً من ذلك:

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

هذا يضمن أنه عند زيادة أو نقصان أي عداد، يتم ذلك بالنسبة إلى حالته الأحدث وليس وفقًا لما كانت عليه الحالة وقت النقر.

</Solution>

#### Implement the state queue yourself {/*implement-the-state-queue-yourself*/}
#### تنفيذ قائمة انتظار الحالة بنفسك {/implement-the-state-queue-yourself/}

في هذا التحدي، ستقوم بإعادة تنفيذ جزء صغير من React من الصفر! الأمر ليس بالصعوبة التي قد تتصورها.

تصفح معاينة الصندوق (sandbox). لاحظ أنه يعرض أربع حالات اختبار. هذه الحالات تتوافق مع الأمثلة التي رأيتها سابقًا في هذه الصفحة. مهمتك هي تنفيذ دالة getFinalState بحيث تُرجع النتيجة الصحيحة لكل حالة من هذه الحالات. إذا نفذت الدالة بشكل صحيح، ستنجح جميع الاختبارات الأربع.

ستستقبل دالتك معاملين: baseState هو الحالة الابتدائية (مثل 0)، وqueue هو مصفوفة تحتوي على مزيج من الأرقام (مثل 5) ودوال التحديث (مثل n => n + 1) بالترتيب الذي أُضيفت به.

مهمتك هي إرجاع الحالة النهائية، تمامًا كما توضح الجداول في هذه الصفحة!

<Hint>

إذا شعرت بأنك عالق، ابدأ بهذا الهيكل البرمجي:

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

املأ الأسطر الناقصة!

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

هذا هو نفس الخوارزمية بالضبط الموضحة في هذه الصفحة والتي يستخدمها React لحساب الحالة النهائية:

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

الآن أنت تعرف كيف يعمل هذا الجزء من React!

</Solution>

</Challenges>