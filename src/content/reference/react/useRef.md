---
title: دالة useRef
---

<Intro>

`useRef` هو Hook في React يتيح لك الإشارة إلى قيمة لا تُستخدم للرسم.

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

استدعِ `useRef` في أعلى مكوّنك لتصرّح عن [ref](/learn/referencing-values-with-refs)

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `initialValue`: القيمة التي تريد أن تكون خاصية `current` لكائن الـ ref مبدئيًا. يمكن أن تكون من أي نوع. يُتجاهل هذا الوسيط بعد أول render.

#### القيمة المعادة {/*returns*/}

`useRef` يعيد كائنًا بخاصية واحدة:

* `current`: في البداية تُضبط إلى `initialValue` التي مررتها. يمكنك لاحقًا تعيينها إلى شيء آخر. إذا مررت كائن الـ ref إلى React كسمة `ref` لعقدة JSX، ستضبط React خاصية `current`.

في الـ renders التالية، يعيد `useRef` نفس الكائن.

#### ملاحظات مهمة {/*caveats*/}

* يمكنك تعديل خاصية `ref.current`. على عكس الـ state، فهي قابلة للتغيير. لكن إذا احتوت على كائن يُستخدم للرسم (مثل جزء من state)، فلا يجب تعديل ذلك الكائن.
* عند تغيير خاصية `ref.current`، لا يعيد React رسم مكوّنك. React لا يعلم متى تغيّرها لأن الـ ref كائن JavaScript عادي.
* لا تكتب _ولا تقرأ_ `ref.current` أثناء الرسم، إلا من أجل [التهيئة.](#avoiding-recreating-the-ref-contents) ذلك يجعل سلوك المكوّن غير متوقع.
* في وضع Strict Mode، ستستدعي React **دالة المكوّن مرتين** من أجل [مساعدتك على اكتشاف الشوائب غير المقصودة.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) هذا سلوك للتطوير فقط ولا يؤثر على الإنتاج. يُنشأ كل كائن ref مرتين، لكن أحد النسختين يُستبعد. إذا كانت دالة المكوّن نقية (كما ينبغي)، فلا ينبغي أن يؤثر ذلك على السلوك.

---

## الاستخدام {/*usage*/}

### الإشارة إلى قيمة باستخدام ref {/*referencing-a-value-with-a-ref*/}

استدعِ `useRef` في أعلى مستوى مكوّنك لتصرّح عن [ref](/learn/referencing-values-with-refs) واحد أو أكثر.

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

يعيد `useRef` <CodeStep step={1}>كائن ref</CodeStep> بخاصية <CodeStep step={2}>`current`</CodeStep> واحدة مضبوطة مبدئيًا إلى <CodeStep step={3}>القيمة الأولية</CodeStep> التي قدمتها.

في الـ renders التالية، يعيد `useRef` نفس الكائن. يمكنك تغيير خاصية `current` لتخزين معلومات وقراءتها لاحقًا. قد يذكرك ذلك بـ [state](/reference/react/useState)، لكن هناك فرق مهم.

**تغيير ref لا يطلق إعادة رسم.** أي أن الـ ref مناسب لتخزين معلومات لا تؤثر على المخرجات المرئية للمكوّن. مثلًا، إذا احتجت تخزين [معرّف interval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) واسترجاعه لاحقًا، يمكنك وضعه في ref. لتحديث القيمة داخل الـ ref، غيّر يدويًا <CodeStep step={2}>خاصية `current`</CodeStep>:

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

لاحقًا، يمكنك قراءة معرّف الـ interval من الـ ref لتستدعي [clearInterval](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

باستخدام ref تضمن أن:

- يمكنك **تخزين معلومات** بين إعادات الرسم (على عكس المتغيرات العادية التي تُصفَّر في كل render).
- تغييره **لا يطلق إعادة رسم** (على عكس متغيرات الـ state التي تطلق إعادة رسم).
- **المعلومات محلية** لكل نسخة من المكوّن (على عكس المتغيرات الخارجية المشتركة).

بما أن تغيير ref لا يطلق إعادة رسم، فالـ ref غير مناسب لتخزين ما تريد عرضه على الشاشة. استخدم state لذلك. اقرأ المزيد عن [الاختيار بين `useRef` و`useState`.](/learn/referencing-values-with-refs#differences-between-refs-and-state)

<Recipes titleText="أمثلة على الإشارة إلى قيمة باستخدام useRef" titleId="examples-value">

#### عداد النقرات {/*click-counter*/}

يستخدم هذا المكوّن ref لتتبع عدد مرات النقر على الزر. ملاحظة: استخدام ref بدلًا من state هنا مقبول لأن عدّ النقرات يُقرأ ويُكتب فقط في معالج حدث.

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

إذا عرضت `{ref.current}` في JSX، فلن يتحدّث الرقم عند النقر. ذلك لأن تعيين `ref.current` لا يطلق إعادة رسم. المعلومات المستخدمة للرسم ينبغي أن تكون state.

<Solution />

#### ساعة إيقاف {/*a-stopwatch*/}

يستخدم هذا المثال مزيجًا من state والـ refs. كل من `startTime` و`now` متغيرات state لأنهما يُستخدمان للرسم. لكننا نحتاج أيضًا الاحتفاظ بـ [معرّف interval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) لإيقافه عند الضغط على الزر. بما أن معرّف الـ interval لا يُستخدم للرسم، فمن المناسب إبقاؤه في ref وتحديثه يدويًا.

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

<Solution />

</Recipes>

<Pitfall>

**لا تكتب _ولا تقرأ_ `ref.current` أثناء الرسم.**

يتوقع React أن يتصرّف جسم مكوّنك [كدالة نقية](/learn/keeping-components-pure):

- إذا كانت المدخلات ([props](/learn/passing-props-to-a-component)، و[state](/learn/state-a-components-memory)، و[context](/learn/passing-data-deeply-with-context)) نفسها، فينبغي أن يعيد نفس JSX بالضبط.
- استدعاؤه بترتيب مختلف أو بوسائط مختلفة لا ينبغي أن يؤثر على نتائج استدعاءات أخرى.

قراءة ref أو كتابته **أثناء الرسم** تخالف هذه التوقعات.

```js {expectedErrors: {'react-compiler': [4]}} {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 Don't write a ref during rendering
  myRef.current = 123;
  // ...
  // 🚩 Don't read a ref during rendering
  return <h1>{myOtherRef.current}</h1>;
}
```

يمكنك قراءة الـ refs أو كتابتها **من معالجات الأحداث أو من الـ Effects بدلًا من ذلك**.

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ You can read or write refs in effects
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ You can read or write refs in event handlers
    doSomething(myOtherRef.current);
  }
  // ...
}
```

إذا *اضطررت* لقراءة [أو كتابة](/reference/react/useState#storing-information-from-previous-renders) شيء أثناء الرسم، فاستخدم [state](/reference/react/useState) بدلًا من ذلك.

عند مخالفة هذه القواعد، قد يظل مكوّنك يعمل، لكن معظم الميزات الأحدث التي نضيفها إلى React ستعتمد على هذه التوقعات. اقرأ المزيد عن [إبقاء المكوّنات نقية.](/learn/keeping-components-pure#where-you-_can_-cause-side-effects)

</Pitfall>

---

### التحكم في DOM باستخدام ref {/*manipulating-the-dom-with-a-ref*/}

من الشائع استخدام ref للتحكم في [DOM.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API) يوفّر React دعمًا مدمجًا لذلك.

أولًا، صرّح عن <CodeStep step={1}>كائن ref</CodeStep> بـ <CodeStep step={3}>قيمة أولية</CodeStep> `null`:

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

ثم مرّر كائن الـ ref كسمة `ref` إلى JSX لعقدة DOM التي تريد التحكم بها:

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

بعد أن تنشئ React عقدة DOM وتضعها على الشاشة، تضبط <CodeStep step={2}>خاصية `current`</CodeStep> لكائن الـ ref إلى تلك العقدة. يمكنك الآن الوصول إلى عقدة `<input>` في DOM واستدعاء دوال مثل [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus):

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

تعيد React ضبط خاصية `current` إلى `null` عند إزالة العقدة من الشاشة.

اقرأ المزيد عن [التحكم في DOM باستخدام refs.](/learn/manipulating-the-dom-with-refs)

<Recipes titleText="أمثلة على التحكم في DOM باستخدام useRef" titleId="examples-dom">

#### تركيز حقل نصي {/*focusing-a-text-input*/}

في هذا المثال، النقر على الزر يجعل حقل الإدخال يستقبل التركيز:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### تمرير صورة إلى المنطقة المرئية {/*scrolling-an-image-into-view*/}

في هذا المثال، النقر على الزر يمرّر صورة إلى داخل المنطقة المرئية. يستخدم ref لعقدة قائمة في DOM، ثم يستدعي واجهة [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) للعثور على الصورة التي نريد التمرير إليها.

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // This line assumes a particular DOM structure:
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Neo
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Millie
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Bella
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<Solution />

#### تشغيل وإيقاف مؤقت لفيديو {/*playing-and-pausing-a-video*/}

يستخدم هذا المثال ref لاستدعاء [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) و[`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) على عقدة `<video>` في DOM.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

#### تمرير ref إلى مكوّنك الخاص {/*exposing-a-ref-to-your-own-component*/}

أحيانًا تريد أن يتحكم المكوّن الأب في DOM داخل مكوّنك. مثلًا، تكتب مكوّن `MyInput` لكنك تريد أن يستطيع الأب جعل الحقل يستقبل التركيز (بلا وصول مباشر). يمكنك إنشاء `ref` في الأب وتمرير `ref` كخاصية للمكوّن الابن. اقرأ [شرحًا تفصيليًا](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) هنا.

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### تجنب إعادة إنشاء محتويات الـ ref {/*avoiding-recreating-the-ref-contents*/}

تحفظ React قيمة الـ ref الأولية مرة واحدة وتتجاهلها في الـ renders التالية.

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

رغم أن نتيجة `new VideoPlayer()` تُستخدم فقط للـ render الأول، فما زلت تستدعي هذه الدالة في كل render. قد يكون ذلك مهدورًا إذا كانت تنشئ كائنات مكلفة.

لحل ذلك، يمكنك تهيئة الـ ref هكذا بدلًا من ذلك:

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

عادةً، كتابة `ref.current` أو قراءتها أثناء الرسم غير مسموحة. لكنها مقبولة هنا لأن النتيجة دائمًا نفسها، والشرط ينفّذ فقط أثناء التهيئة فيكون السلوك متوقعًا بالكامل.

<DeepDive>

#### كيف تتجنب فحوصات null عند تهيئة useRef لاحقًا {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

إذا استخدمت فاحص أنواع ولا تريد التحقق من `null` دائمًا، جرّب نمطًا كهذا:

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

هنا، `playerRef` نفسه قابل لأن يكون `null`. لكن ينبغي أن تستطيع إقناع فاحص الأنواع بأنه لا يوجد مسار يعيد فيه `getPlayer()` قيمة `null`. ثم استخدم `getPlayer()` في معالجات الأحداث.

</DeepDive>

---

## استكشاف الأخطاء {/*troubleshooting*/}

### لا أستطيع الحصول على ref لمكوّن مخصص {/*i-cant-get-a-ref-to-a-custom-component*/}

إذا حاولت تمرير `ref` إلى مكوّنك الخاص هكذا:

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

قد يظهر خطأ في وحدة التحكم:

<ConsoleBlock level="error">

TypeError: Cannot read properties of null

</ConsoleBlock>

افتراضيًا، لا تكشف مكوّناتك الخاصة عن refs لعقد DOM بداخلها.

لإصلاح ذلك، اعثر على المكوّن الذي تريد الحصول على ref له:

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

ثم أضف `ref` إلى قائمة الخصائص التي يقبلها مكوّنك ومرّر `ref` كخاصية إلى [المكوّن المدمج](/reference/react-dom/components/common) المناسب كالتالي:

```js {1,6}
function MyInput({ value, onChange, ref }) {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
};

export default MyInput;
```

فيستطيع المكوّن الأب الحصول على ref إليه.

اقرأ المزيد عن [الوصول إلى عقد DOM لمكوّن آخر.](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)
