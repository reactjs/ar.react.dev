---
title: 'الإشارة إلى قيم باستخدام المراجع'
---

<Intro>

عندما تريد أن «يتذكر» المكوّن بعض المعلومات، لكنك لا تريد أن تسبب [رسمًا جديدًا](/learn/render-and-commit)، يمكنك استخدام *مرجع* (ref).

</Intro>

<YouWillLearn>

- كيف تضيف مرجعًا إلى مكوّنك
- كيف تُحدّث قيمة المرجع
- كيف تختلف المراجع عن الحالة
- كيف تستخدم المراجع بأمان

</YouWillLearn>

## إضافة مرجع إلى مكوّنك {/*adding-a-ref-to-your-component*/}

يمكنك إضافة مرجع باستيراد Hook `useRef` من React:

```js
import { useRef } from 'react';
```

داخل المكوّن، استدعِ `useRef` ومرّر القيمة الأولية التي تريد الإشارة إليها كوسيط وحيد. مثلًا، مرجع إلى القيمة `0`:

```js
const ref = useRef(0);
```

`useRef` يعيد كائنًا مثل:

```js
{ 
  current: 0 // The value you passed to useRef
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="سهم مكتوب عليه current يُدخل في جيب مكتوب عليه ref." />

تصل إلى القيمة الحالية للمرجع عبر الخاصية `ref.current`. هذه القيمة قابلة للتعديل عن قصد؛ يمكنك قراءتها وكتابتها. مثل جيب سري في مكوّنك لا يتتبعه React. (هذا ما يجعله «مخرجًا طارئًا» من تدفق البيانات أحادي الاتجاه في React — المزيد أدناه!)

هنا، زر يزيد `ref.current` في كل نقرة:

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

المرجع يشير إلى رقم، لكن كـ [الحالة](/learn/state-a-components-memory) يمكن أن يشير إلى أي شيء: نصًا، كائنًا، أو حتى دالة. بخلاف الحالة، المرجع كائن JavaScript عادي بخاصية `current` يمكنك قراءتها وتعديلها.

لاحظ أن **المكوّن لا يُعاد رسمه مع كل زيادة.** كالحالة، React يحتفظ بالمراجع بين إعادات الرسم. لكن تعيين الحالة يُعيد رسم المكوّن. تغيير المرجع لا يفعل ذلك!

## مثال: بناء ساعة إيقاف {/*example-building-a-stopwatch*/}

يمكنك الجمع بين المراجع والحالة في مكوّن واحد. مثلًا، لنصنع ساعة إيقاف يبدأ المستخدم إيقافها أو تشغيلها بزر. لعرض الوقت المنقضي منذ الضغط على «Start»، تحتاج تتبع وقت الضغط والوقت الحالي. **هذه المعلومات تُستخدم للرسم، فتبقى في الحالة:**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

عند الضغط على «Start»، ستستخدم [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) لتحديث الوقت كل 10 مللي ثانية:

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Start counting.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Update the current time every 10ms.
      setNow(Date.now());
    }, 10);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
    </>
  );
}
```

</Sandpack>

عند الضغط على «Stop»، تحتاج إلغاء الفاصل الزمني الحالي ليتوقف تحديث `now`. يمكنك ذلك باستدعاء [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)، لكن تحتاج معرف الفاصل الذي أعاده `setInterval` عند Start. تحتاج مكانًا لحفظ معرف الفاصل. **بما أن معرف الفاصل لا يُستخدم للرسم، يمكنك الاحتفاظ به في مرجع:**

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

</Sandpack>

إن كانت المعلومة تُستخدم للرسم، احتفظ بها في الحالة. إن كانت تُحتاج فقط لمعالجات الأحداث وتغييرها لا يتطلب إعادة رسم، قد يكون المرجع أكثر كفاءة.

## الفروق بين المراجع والحالة {/*differences-between-refs-and-state*/}

قد تبدو المراجع أقل «صرامة» من الحالة — يمكنك تعديلها مباشرة بدل دالة التعيين دائمًا. لكن في أغلب الحالات تفضّل الحالة. المراجع «مخرج طارئ» لا تحتاجه كثيرًا. هكذا تقارن الحالة والمراجع:

| المراجع                                                                                  | الحالة                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` يعيد `{ current: initialValue }`                            | `useState(initialValue)` يعيد القيمة الحالية ودالة التعيين ( `[value, setValue]`) |
| لا يطلق إعادة رسم عند تغييره.                                         | يطلق إعادة رسم عند تغييره.                                                                                    |
| قابل للتعديل — يمكنك تعديل `current` خارج عملية الرسم. | «غير قابل للتعديل المباشر» — يجب استخدام دالة التعيين لتعديل الحالة وطلب إعادة الرسم.                       |
| لا يجب قراءة (أو كتابة) `current` أثناء الرسم. | يمكن قراءة الحالة في أي وقت. لكن كل رسم له [لقطة](/learn/state-as-a-snapshot) من الحالة لا تتغير.

إليك زر عدّاد مُنفَّذ بالحالة:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You clicked {count} times
    </button>
  );
}
```

</Sandpack>

بما أن قيمة `count` تُعرض، من المنطقي استخدام الحالة. عند تعيينها بـ `setCount()`، يعيد React رسم المكوّن وتتحدث الشاشة.

إن حاولت تنفيذ ذلك بمرجع، لن يعيد React رسم المكوّن فلن ترى العدّ يتغير! لاحظ أن النقر **لا يحدّث النص:**

<Sandpack>

```js {expectedErrors: {'react-compiler': [13]}}
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // This doesn't re-render the component!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      You clicked {countRef.current} times
    </button>
  );
}
```

</Sandpack>

لذلك قراءة `ref.current` أثناء الرسم تؤدي إلى سلوك غير موثوق. إن احتجت ذلك، استخدم الحالة.

<DeepDive>

#### كيف يعمل useRef داخليًا؟ {/*how-does-use-ref-work-inside*/}

رغم أن `useState` و`useRef` من React، ففي المبدأ يمكن تنفيذ `useRef` *فوق* `useState`. تتخيل أن React ينفّذ `useRef` هكذا:

```js
// Inside of React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

في الرسم الأول، `useRef` يعيد `{ current: initialValue }`. React يخزّن هذا الكائن، فيُعاد نفس الكائن في الرسم التالي. لاحظ أن دالة التعيين غير مستخدمة هنا. لا حاجة لها لأن `useRef` يجب أن يعيد دائمًا نفس الكائن!

يوفّر React `useRef` مدمجًا لأنه شائع عمليًا. لكن يمكنك اعتباره متغير حالة بلا مُعيّن. إن كنت تعرف البرمجة كائنية التوجيه، قد تذكرك المراجع بحقول المثيل — لكن بدل `this.something` تكتب `somethingRef.current`.

</DeepDive>

## متى تستخدم المراجع {/*when-to-use-refs*/}

غالبًا تستخدم مرجعًا عندما يحتاج المكوّن «الخروج» من React والتواصل مع واجهات خارجية — غالبًا واجهة المتصفح التي لا تؤثر مباشرة على مظهر المكوّن. أمثلة نادرة:

- تخزين [معرفات المؤقتات](https://developer.mozilla.org/docs/Web/API/setTimeout)
- تخزين والتعامل مع [عناصر DOM](https://developer.mozilla.org/docs/Web/API/Element)، كما في [الصفحة التالية](/learn/manipulating-the-dom-with-refs)
- تخزين كائنات أخرى غير ضرورية لحساب الـ JSX.

إن احتاج المكوّن تخزين قيمة لا تؤثر على منطق الرسم، اختر المراجع.

## أفضل الممارسات للمراجع {/*best-practices-for-refs*/}

اتباع هذه المبادئ يجعل مكوّناتك أكثر قابلية للتوقع:

- **عامل المراجع كمخرج طارئ.** مفيدة مع الأنظمة الخارجية أو واجهات المتصفح. إن اعتمد منطق تطبيقك كثيرًا على المراجع، قد تحتاج إعادة النظر في التصميم.
- **لا تقرأ أو تكتب `ref.current` أثناء الرسم.** إن كانت المعلومة مطلوبة أثناء الرسم، استخدم [الحالة](/learn/state-a-components-memory). بما أن React لا يعلم متى يتغير `ref.current`، حتى قراءته أثناء الرسم تجعل السلوك صعب التوقع. (الاستثناء الوحيد تقريبًا كود مثل `if (!ref.current) ref.current = new Thing()` الذي يضبط المرجع مرة في الرسم الأول.)

قيود حالة React لا تنطبق على المراجع. مثلًا، الحالة [لقطة لكل رسم](/learn/state-as-a-snapshot) و[لا تُحدَّث متزامنًا.](/learn/queueing-a-series-of-state-updates) لكن عند تعديل `current` للمرجع، يتغير فورًا:

```js
ref.current = 5;
console.log(ref.current); // 5
```

لأن **المرجع نفسه كائن JavaScript عادي** فيتصرف كذلك.

لا تحتاج أيضًا القلق من [تجنب التعديل المباشر](/learn/updating-objects-in-state) عند العمل بمرجع. ما دام الكائن الذي تعدّله لا يُستخدم للرسم، لا يهم React ما تفعل بالمرجع أو محتواه.

## المراجع و DOM {/*refs-and-the-dom*/}

يمكن أن يشير المرجع إلى أي قيمة. لكن الاستخدام الأشهر هو الوصول لعنصر DOM. مثلًا، لتوجيه التركيز لحقل برمجيًا. عند تمرير مرجع لخاصية `ref` في JSX مثل `<div ref={myRef}>`، يضع React العنصر المقابل في `myRef.current`. عند إزالة العنصر، يحدّث `myRef.current` إلى `null`. التفاصيل في [التعامل مع DOM باستخدام المراجع.](/learn/manipulating-the-dom-with-refs)

<Recap>

- المراجع مخرج طارئ للاحتفاظ بقيم لا تُستخدم للرسم. لا تحتاجها كثيرًا.
- المرجع كائن JavaScript عادي بخاصية واحدة `current` يمكن قراءتها أو تعيينها.
- تطلب مرجعًا من React باستدعاء Hook `useRef`.
- كالحالة، تبقي المراجع معلومات بين إعادات رسم المكوّن.
- بخلاف الحالة، تعيين `current` لا يطلق إعادة رسم.
- لا تقرأ أو تكتب `ref.current` أثناء الرسم. يصعّب التنبؤ بسلوك المكوّن.

</Recap>



<Challenges>

#### إصلاح حقل دردشة معطوب {/*fix-a-broken-chat-input*/}

اكتب رسالة واضغط «Send». ستلاحظ تأخيرًا ثلاث ثوانٍ قبل تنبيه «Sent!». خلاله يظهر زر «Undo». النقر عليه يفترض أن يمنع ظهور «Sent!» عبر [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) لمعرف المؤقت المحفوظ في `handleSend`. لكن حتى بعد «Undo» يظهر «Sent!» أيضًا. اكتشف السبب وأصلحه.

<Hint>

المتغيرات العادية مثل `let timeoutID` لا «تبقى» بين إعادات الرسم لأن كل رسم يعيد تشغيل المكوّن (ويبدأ المتغيرات) من الصفر. أين تحفظ معرف المؤقت؟

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [10]}}
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

عند إعادة رسم المكوّن (مثلًا عند تعيين الحالة)، تُهيأ كل المتغيرات المحلية من جديد. لذلك لا يمكن حفظ معرف المؤقت في `timeoutID` وتوقع أن معالجًا آخر «يراه» لاحقًا. خزّنه في مرجع يحفظه React بين الرسوم.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>


#### إصلاح مكوّن لا يُعاد رسمه {/*fix-a-component-failing-to-re-render*/}

يُفترض أن يبدّل هذا الزر بين «On» و«Off». لكنه يظهر دائمًا «Off». ما الخطأ؟ أصلحه.

<Sandpack>

```js {expectedErrors: {'react-compiler': [10]}}
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

<Solution>

هنا، قيمة المرجع تُستخدم لحساب المخرجات: `{isOnRef.current ? 'On' : 'Off'}`. هذا يدل أن المعلومة لا تنتمي لمرجع ويجب أن تكون حالة. أزل المرجع واستخدم الحالة:

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### إصلاح التأجيل (debouncing) {/*fix-debouncing*/}

في هذا المثال، كل معالجات النقر [«مؤجّلة».](https://kettanaito.com/blog/debounce-vs-throttle) اضغط زرًا. لاحظ أن الرسالة تظهر بعد ثانية. إن ضغطت أثناء الانتظار، يُعاد ضبط المؤقت. إن نقرت بسرعة كثيرًا، لا تظهر الرسالة إلا بعد ثانية *من توقفك*. التأجيل يؤخر فعلًا حتى «يتوقف المستخدم».

المثال يعمل لكن ليس كما يُراد. الأزرار ليست مستقلة. اضغط زرًا ثم فورًا زرًا آخر. تتوقع رسالتي الزرين بعد التأخير، لكن تظهر رسالة الزر الأخير فقط. ضاعت رسالة الأولى.

لماذا تتداخل الأزرار؟ اعثر على المشكلة وأصلحها.

<Hint>

متغير معرف المؤقت الأخير مشترك بين كل مكوّنات `DebouncedButton`. لذلك نقرة زر تلغي مؤقت زر آخر. هل يمكنك تخزين معرف مؤقت منفصل لكل زر؟

</Hint>

<Sandpack>

```js
let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

متغير مثل `timeoutID` مشترك بين كل المكوّنات. لذلك النقر على الزر الثاني يلغي مؤقت الزر الأول. للإصلاح، احتفظ بالمؤقت في مرجع. لكل زر مرجعه الخاص فلا يحدث تعارض. لاحظ أن النقر السريع على زرين يعرض الرسالتين.

<Sandpack>

```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### قراءة أحدث حالة {/*read-the-latest-state*/}

في هذا المثال، بعد «Send» يوجد تأخير بسيط قبل عرض الرسالة. اكتب «hello»، اضغط Send، ثم عدّل الحقل بسرعة. رغم التعديل، التنبيه يظهر «hello» (قيمة الحالة [في لحظة](/learn/state-as-a-snapshot#state-over-time) النقر).

عادة هذا السلوك مرغوب. لكن قد تحتاج أحيانًا أن يقرأ كود غير متزامن *أحدث* نسخة من الحالة. هل يمكنك جعل التنبيه يعرض نص الحقل *الحالي* لا ما كان عند النقر؟

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

الحالة [كلقطة](/learn/state-as-a-snapshot)، فلا تقرأ أحدث حالة من عملية غير متزامنة مثل `setTimeout`. لكن يمكنك الاحتفاظ بأحدث النص في مرجع. المرجع قابل للتعديل، فيمكن قراءة `current` في أي وقت. بما أن النص يُستخدم للرسم أيضًا، تحتاج هنا *حالة* (للرسم) *ومرجعًا* (للقراءة في المؤقت). حدّث المرجع يدويًا.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
