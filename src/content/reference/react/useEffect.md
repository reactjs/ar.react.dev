---
title: دالة useEffect
---

<Intro>

`useEffect` هو Hook في React يتيح لك [مزامنة مكوّن مع نظام خارجي.](/learn/synchronizing-with-effects)

```js
useEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `useEffect(setup, dependencies?)` {/*useeffect*/}

استدعِ `useEffect` في أعلى مستوى من مكوّنك لإعلان تأثير (Effect):

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `setup`: الدالة التي تحتوي على منطق التأثير. قد تعيد دالة الإعداد اختياريًا دالة *تنظيف* (cleanup). عند إضافة المكوّن إلى DOM، ستشغّل React دالة الإعداد. بعد كل إعادة رسم عند تغيّر التبعيات، ستشغّل React أولًا دالة التنظيف (إن وُجدت) بالقيم القديمة، ثم دالة الإعداد بالقيم الجديدة. بعد إزالة المكوّن من DOM، ستشغّل React دالة التنظيف.
 
* **اختياري** `dependencies`: قائمة بكل القيم التفاعلية المُشار إليها داخل كود `setup`. تشمل القيم التفاعلية الـ props والحالة وجميع المتغيرات والدوال المعرّفة مباشرةً داخل جسم المكوّن. إذا كان linter لديك [مهيأ لـ React](/learn/editor-setup#linting)، فسيتحقق من أن كل قيمة تفاعلية مُدرجة كتبعية بشكل صحيح. يجب أن يكون عدد عناصر قائمة التبعيات ثابتًا وأن تُكتب مضمّنة مثل `[dep1, dep2, dep3]`. تقارن React كل تبعية بقيمتها السابقة باستخدام [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). إذا حذفت هذا الوسيط، فسيُعاد تشغيل التأثير بعد كل إعادة رسم للمكوّن. [اطلع على الفرق بين تمرير مصفوفة تبعيات، ومصفوفة فارغة، وعدم تمرير تبعيات على الإطلاق.](#examples-dependencies)

#### القيمة المعادة {/*returns*/}

`useEffect` يعيد `undefined`.

#### ملاحظات مهمة {/*caveats*/}

* `useEffect` هو Hook، لذا يمكنك استدعاؤه **في أعلى مستوى من مكوّنك** أو من Hooks الخاصة بك فقط. لا تستدعِه داخل حلقات أو شروط. إذا احتجت إلى ذلك، استخرج مكوّنًا جديدًا وانقل الحالة إليه.

* إذا كنت **لا تحاول المزامنة مع نظام خارجي،** [فربما لا تحتاج إلى تأثير.](/learn/you-might-not-need-an-effect)

* عند تفعيل Strict Mode، ستشغّل React **دورة إضافية للتطوير فقط (إعداد + تنظيف)** قبل أول إعداد حقيقي. هذا اختبار ضغط يتأكد من أن منطق التنظيف «يعكس» منطق الإعداد وأنه يوقف أو يلغي ما يفعله الإعداد. إذا سبب ذلك مشكلة، [نفّذ دالة التنظيف.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* إذا كانت بعض تبعياتك كائنات أو دوالًا معرّفة داخل المكوّن، فهناك خطر أن **تجعل التأثير يُعاد تشغيله أكثر من اللازم.** لإصلاح ذلك، أزل تبعيات [الكائن](#removing-unnecessary-object-dependencies) و[الدالة](#removing-unnecessary-function-dependencies) غير الضرورية. يمكنك أيضًا [استخراج تحديثات الحالة](#updating-state-based-on-previous-state-from-an-effect) و[المنطق غير التفاعلي](#reading-the-latest-props-and-state-from-an-effect) خارج التأثير.

* إذا لم يكن التأثير ناتجًا عن تفاعل (مثل نقرة)، فستسمح React عادةً للمتصفح **برسم الشاشة المحدثة أولًا قبل تشغيل التأثير.** إذا كان التأثير يقوم بشيء مرئي (مثل موضع تلميح) والتأخير ملحوظ (وميض)، استبدل `useEffect` بـ [`useLayoutEffect`.](/reference/react/useLayoutEffect)

* إذا كان التأثير ناتجًا عن تفاعل (مثل نقرة)، **قد تشغّل React التأثير قبل أن يرسم المتصفح الشاشة المحدثة.** يضمن ذلك أن يستطيع نظام الأحداث رصد نتيجة التأثير. عادةً يعمل ذلك كما يُنتظر. أما إذا كان يجب تأجيل العمل حتى بعد الرسم، مثل `alert()`، فيمكنك استخدام `setTimeout`. اطلع على [reactwg/react-18/128](https://github.com/reactwg/react-18/discussions/128) لمزيد من التفاصيل.

* حتى إذا كان التأثير ناتجًا عن تفاعل (مثل نقرة)، **قد تسمح React للمتصفح بإعادة رسم الشاشة قبل معالجة تحديثات الحالة داخل التأثير.** عادةً يعمل ذلك كما يُنتظر. أما إذا كان يجب منع المتصفح من إعادة الرسم، فاستبدل `useEffect` بـ [`useLayoutEffect`.](/reference/react/useLayoutEffect)

* التأثيرات **تعمل على العميل فقط.** لا تعمل أثناء العرض على الخادم.

---

## الاستخدام {/*usage*/}

### الاتصال بنظام خارجي {/*connecting-to-an-external-system*/}

تحتاج بعض المكوّنات إلى البقاء متصلة بالشبكة، أو ببعض واجهات المتصفح، أو بمكتبة طرف ثالث، أثناء عرضها في الصفحة. هذه الأنظمة لا تتحكم بها React، لذا تُسمى *خارجية.*

لـ [ربط مكوّنك بنظام خارجي،](/learn/synchronizing-with-effects) استدعِ `useEffect` في أعلى مستوى من مكوّنك:

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
  	const connection = createConnection(serverUrl, roomId);
    connection.connect();
  	return () => {
      connection.disconnect();
  	};
  }, [serverUrl, roomId]);
  // ...
}
```

تحتاج إلى تمرير وسيطين إلى `useEffect`:

1. دالة *إعداد* تحتوي على <CodeStep step={1}>كود الإعداد</CodeStep> الذي يتصل بذلك النظام.
   - يجب أن تعيد دالة *تنظيف* تحتوي على <CodeStep step={2}>كود التنظيف</CodeStep> الذي ينقطع عن ذلك النظام.
2. <CodeStep step={3}>قائمة تبعيات</CodeStep> تتضمن كل قيمة من مكوّنك تُستخدم داخل تلك الدوال.

**تستدعي React دوال الإعداد والتنظيف كلما دعت الحاجة، وقد يحدث ذلك عدة مرات:**

1. يعمل <CodeStep step={1}>كود الإعداد</CodeStep> عند إضافة المكوّن إلى الصفحة *(تركيب / mount)*.
2. بعد كل إعادة رسم للمكوّن حيث تغيّرت <CodeStep step={3}>التبعيات</CodeStep>:
   - أولًا، يعمل <CodeStep step={2}>كود التنظيف</CodeStep> بـ props والحالة القديمة.
   - ثم يعمل <CodeStep step={1}>كود الإعداد</CodeStep> بـ props والحالة الجديدة.
3. يعمل <CodeStep step={2}>كود التنظيف</CodeStep> مرة أخيرة بعد إزالة المكوّن من الصفحة *(إلغاء تركيب / unmount).*

**لنوضح هذا التسلسل للمثال أعلاه.**

عند إضافة مكوّن `ChatRoom` إلى الصفحة، يتصل بغرفة الدردشة بقيم `serverUrl` و`roomId` الأولية. إذا تغيّر أي من `serverUrl` أو `roomId` نتيجة إعادة رسم (مثل اختيار المستخدم غرفة مختلفة من القائمة)، فسيقوم التأثير *بقطع الاتصال بالغرفة السابقة والاتصال بالتالية.* عند إزالة مكوّن `ChatRoom` من الصفحة، يقطع التأثير الاتصال مرة أخيرة.

**لـ [مساعدتك على اكتشاف الأخطاء،](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) في وضع التطوير تشغّل React <CodeStep step={1}>الإعداد</CodeStep> و<CodeStep step={2}>التنظيف</CodeStep> مرة إضافية قبل <CodeStep step={1}>الإعداد</CodeStep>.** هذا اختبار ضغط يتحقق من صحة تنفيذ منطق التأثير. إذا ظهرت مشاكل مرئية، فمنطق التنظيف ناقص. يجب أن توقف دالة التنظيف أو تلغي كل ما تفعله دالة الإعداد. قاعدة عملية: لا يجب أن يميز المستخدم بين استدعاء الإعداد مرة واحدة (كما في الإنتاج) وتسلسل *إعداد* → *تنظيف* → *إعداد* (كما في التطوير). [اطلع على حلول شائعة.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

**حاول [كتابة كل تأثير كعملية مستقلة](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) و[التفكير في دورة إعداد/تنظيف واحدة في كل مرة.](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective)** لا يهم إن كان المكوّن يُركّب أو يُحدَّث أو يُزال. عندما «يعكس» منطق التنظيف منطق الإعداد بشكل صحيح، يصبح التأثير قادرًا على تحمّل تشغيل الإعداد والتنظيف بقدر الحاجة.

<Note>

يتيح لك التأثير [إبقاء المكوّن متزامنًا](/learn/synchronizing-with-effects) مع نظام خارجي (مثل خدمة دردشة). هنا، *النظام الخارجي* يعني أي جزء من الكود لا تتحكم به React، مثل:

* مؤقت يُدار بـ <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)</CodeStep> و<CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep>.
* اشتراك أحداث باستخدام <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)</CodeStep> و<CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)</CodeStep>.
* مكتبة رسوم متحركة من طرف ثالث بواجهة مثل <CodeStep step={1}>`animation.start()`</CodeStep> و<CodeStep step={2}>`animation.reset()`</CodeStep>.

**إذا لم تكن تتصل بأي نظام خارجي، [فربما لا تحتاج إلى تأثير.](/learn/you-might-not-need-an-effect)**

</Note>

<Recipes titleText="أمثلة على الاتصال بنظام خارجي" titleId="examples-connecting">

#### الاتصال بخادم دردشة {/*connecting-to-a-chat-server*/}

في هذا المثال، يستخدم مكوّن `ChatRoom` تأثيرًا للبقاء متصلًا بنظام خارجي معرّف في `chat.js`. اضغط «Open chat» لإظهار مكوّن `ChatRoom`. يعمل هذا الـ sandbox في وضع التطوير، لذا توجد دورة اتصال وانقطاع إضافية، كما [يُشرح هنا.](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) جرّب تغيير `roomId` و`serverUrl` عبر القائمة المنسدلة والحقل، ولاحظ كيف يعيد التأثير الاتصال بالدردشة. اضغط «Close chat» لرؤية انقطاع التأثير مرة أخيرة.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### الاستماع لحدث عام في المتصفح {/*listening-to-a-global-browser-event*/}

في هذا المثال، النظام الخارجي هو DOM المتصفح نفسه. عادةً تضيف مستمعي الأحداث في JSX، لكن لا يمكنك الاستماع إلى الكائن العام [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) بهذه الطريقة. يتيح لك التأثير الاتصال بكائن `window` والاستماع إلى أحداثه. الاستماع إلى حدث `pointermove` يتيح تتبع موضع المؤشر (أو الإصبع) وتحديث النقطة الحمراء لتتحرك معه.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### تشغيل رسوم متحركة {/*triggering-an-animation*/}

في هذا المثال، النظام الخارجي هو مكتبة الرسوم في `animation.js`. توفر صنف JavaScript باسم `FadeInAnimation` يأخذ عقدة DOM كوسيط وتعرض الطريقتين `start()` و`stop()` للتحكم بالحركة. [يستخدم هذا المكوّن ref](/learn/manipulating-the-dom-with-refs) للوصول إلى عقدة DOM. يقرأ التأثير العقدة من الـ ref ويبدأ الحركة تلقائيًا عند ظهور المكوّن.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(1000);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Jump to end immediately
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Start animating
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // We still have more frames to paint
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution />

#### التحكم بحوار منبثق (modal) {/*controlling-a-modal-dialog*/}

في هذا المثال، النظام الخارجي هو DOM المتصفح. يصيّر مكوّن `ModalDialog` عنصر [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog). يستخدم تأثيرًا لمزامنة prop `isOpen` مع استدعاءات [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) و[`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close).

<Sandpack>

```js
import { useState } from 'react';
import ModalDialog from './ModalDialog.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Open dialog
      </button>
      <ModalDialog isOpen={show}>
        Hello there!
        <br />
        <button onClick={() => {
          setShow(false);
        }}>Close</button>
      </ModalDialog>
    </>
  );
}
```

```js src/ModalDialog.js active
import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### تتبع ظهور عنصر في نافذة العرض {/*tracking-element-visibility*/}

في هذا المثال، النظام الخارجي هو DOM المتصفح مجددًا. يعرض مكوّن `App` قائمة طويلة، ثم مكوّن `Box`، ثم قائمة طويلة أخرى. مرّر القائمة للأسفل. لاحظ أنه عندما يصبح مكوّن `Box` بالكامل مرئيًا في منطقة العرض، يتغيّر لون الخلفية إلى الأسود. لتحقيق ذلك، يستخدم مكوّن `Box` تأثيرًا لإدارة [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). تخبرك واجهة المتصفح هذه عندما تكون عنصر DOM مرئيًا في منطقة العرض.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';

export default function Box() {
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
      } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### لف التأثيرات في Hooks مخصصة {/*wrapping-effects-in-custom-hooks*/}

التأثيرات [«مخرج طوارئ»](/learn/escape-hatches): تستخدمها عندما تحتاج إلى «الخطوة خارج React» ولا يوجد حل مدمج أفضل لحالتك. إذا وجدت نفسك تكتب التأثيرات يدويًا كثيرًا، فغالبًا عليك استخراج بعض [الـ Hooks المخصصة](/learn/reusing-logic-with-custom-hooks) للسلوكيات الشائعة التي تعتمد عليها مكوّناتك.

على سبيل المثال، تخفي هذه الـ Hook المخصصة `useChatRoom` منطق التأثير خلف واجهة أكثر تعريفيًا:

```js {1,11}
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

ثم يمكنك استخدامها من أي مكوّن هكذا:

```js {4-7}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

هناك أيضًا العديد من الـ Hooks المخصصة الممتازة لكل غرض في منظومة React.

[اطلع على المزيد حول تغليف التأثيرات في Hooks مخصصة.](/learn/reusing-logic-with-custom-hooks)

<Recipes titleText="أمثلة على تغليف التأثيرات في Hooks مخصصة" titleId="examples-custom-hooks">

#### Hook مخصص `useChatRoom` {/*custom-usechatroom-hook*/}

هذا المثال مطابق لأحد [الأمثلة السابقة،](#examples-connecting) لكن المنطق مُستخرَج إلى Hook مخصص.

<Sandpack>

```js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### Hook مخصص `useWindowListener` {/*custom-usewindowlistener-hook*/}

هذا المثال مطابق لأحد [الأمثلة السابقة،](#examples-connecting) لكن المنطق مُستخرَج إلى Hook مخصص.

<Sandpack>

```js
import { useState } from 'react';
import { useWindowListener } from './useWindowListener.js';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useWindowListener('pointermove', (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/useWindowListener.js
import { useState, useEffect } from 'react';

export function useWindowListener(eventType, listener) {
  useEffect(() => {
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Hook مخصص `useIntersectionObserver` {/*custom-useintersectionobserver-hook*/}

هذا المثال مطابق لأحد [الأمثلة السابقة،](#examples-connecting) لكن المنطق مُستخرَج جزئيًا إلى Hook مخصص.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver.js';

export default function Box() {
  const ref = useRef(null);
  const isIntersecting = useIntersectionObserver(ref);

  useEffect(() => {
   if (isIntersecting) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

```js src/useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, [ref]);

  return isIntersecting;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### التحكم بويدجت غير مبنية بـ React {/*controlling-a-non-react-widget*/}

أحيانًا تريد إبقاء نظام خارجي متزامنًا مع prop أو حالة من مكوّنك.

مثلًا، إذا كان لديك ويدجت خرائط من طرف ثالث أو مشغّل فيديو مكتوب دون React، يمكنك استخدام تأثير لاستدعاء طرق عليه تجعل حالته تطابق الحالة الحالية لمكوّن React. ينشئ هذا التأثير مثيلًا لصنف `MapWidget` معرّف في `map-widget.js`. عندما تغيّر prop `zoomLevel` لمكوّن `Map`، يستدعي التأثير `setZoom()` على المثيل ليبقى متزامنًا:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
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

```js src/App.js
import { useState } from 'react';
import Map from './Map.js';

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(0);
  return (
    <>
      Zoom level: {zoomLevel}x
      <button onClick={() => setZoomLevel(zoomLevel + 1)}>+</button>
      <button onClick={() => setZoomLevel(zoomLevel - 1)}>-</button>
      <hr />
      <Map zoomLevel={zoomLevel} />
    </>
  );
}
```

```js src/Map.js active
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export class MapWidget {
  constructor(domNode) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      touchZoom: false,
      zoomSnap: 0.1
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.map.setView([0, 0], 0);
  }
  setZoom(level) {
    this.map.setZoom(level);
  }
}
```

```css
button { margin: 5px; }
```

</Sandpack>

في هذا المثال، لا حاجة لدالة تنظيف لأن صنف `MapWidget` يدير فقط عقدة DOM الممررة إليه. بعد إزالة مكوّن React `Map` من الشجرة، ستُجمَّع عقدة DOM ومثيل صنف `MapWidget` تلقائيًا بواسطة محرك JavaScript في المتصفح.

---

### جلب البيانات بتأثيرات {/*fetching-data-with-effects*/}

يمكنك استخدام تأثير لجلب بيانات لمكوّنك. لاحظ أنه [إذا كنت تستخدم إطار عمل،](/learn/creating-a-react-app#full-stack-frameworks) فاستخدام آلية الجلب المدمجة في إطارك أكثر كفاءة بكثير من كتابة التأثيرات يدويًا.

إذا أردت جلب البيانات من تأثير يدويًا، قد يبدو كودك هكذا:

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
```

لاحظ المتغير `ignore` الذي يُهيأ إلى `false`، ويُضبط إلى `true` أثناء التنظيف. يضمن ذلك [ألا يتعرض كودك لـ «سباقات» (race conditions):](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) قد تصل استجابات الشبكة بترتيب مختلف عن الذي أرسلتَ الطلبات به.

<Sandpack>

{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js {expectedErrors: {'react-compiler': [9]}} src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

يمكنك إعادة الكتابة بصيغة [`async` / `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)، لكن ما زال يجب توفير دالة تنظيف:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    async function startFetching() {
      setBio(null);
      const result = await fetchBio(person);
      if (!ignore) {
        setBio(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

كتابة جلب البيانات مباشرةً داخل التأثيرات تصبح مكررة وتصعّب إضافة تحسينات مثل التخزين المؤقت والعرض على الخادم لاحقًا. [الأسهل استخدام Hook مخصص — سواءً كتبته بنفسك أو من المجتمع.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

<DeepDive>

#### ما البدائل الجيدة لجلب البيانات داخل التأثيرات؟ {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

استدعاءات `fetch` داخل التأثيرات هي [طريقة شائعة لجلب البيانات](https://www.robinwieruch.de/react-hooks-fetch-data/)، خصوصًا في التطبيقات التي تعمل كلها على العميل. لكنها يدوية جدًا ولها عيوب كبيرة:

- **التأثيرات لا تعمل على الخادم.** يعني ذلك أن HTML الأولي من الخادم سيحتوي فقط حالة تحميل بلا بيانات. سيجب على جهاز العميل تنزيل كل JavaScript ورسم التطبيق ليكتشف بعدها أنه يحتاج تحميل البيانات. هذا غير كفء.
- **الجلب المباشر في التأثيرات يسهل إنشاء «شلالات شبكية».** ترسم المكوّن الأب، فيجلب بياناته، ثم ترسم الأبناء فيبدأون بجلب بياناتهم. إذا لم تكن الشبكة سريعة، يصبح ذلك أبطأ بكثير من جلب كل البيانات بالتوازي.
- **الجلب المباشر في التأثيرات يعني عادةً عدم التحميل المسبق أو التخزين المؤقت.** مثلًا، إذا أُلغي تركيب المكوّن ثم أُعيد تركيبه، سيجب جلب البيانات من جديد.
- **ليست مريحة.** هناك كثير من القوالب عند كتابة `fetch` بطريقة تتجنب أخطاء مثل [سباقات الشروط.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

هذه العيوب ليست خاصة بـ React؛ تنطبق على جلب البيانات عند التركيب مع أي مكتبة. كالتوجيه، جلب البيانات ليس بسيطًا إن أردت فعله جيدًا، لذا ننصح بما يلي:

- **إذا استخدمت [إطار عمل](/learn/start-a-new-react-project#full-stack-frameworks)، فاستخدم آلية الجلب المدمجة فيه.** أطر React الحديثة تدمج آليات جلب كفء وتتجنب المآخذ أعلاه.
- **وإلا ففكّر في استخدام أو بناء تخزين مؤقت على العميل.** من الحلول المفتوحة المصدر الشائعة [TanStack Query](https://tanstack.com/query/latest/)، و[useSWR](https://swr.vercel.app/)، و[React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) يمكنك بناء حلّك أيضًا، وفي تلك الحالة تستخدم التأثيرات داخليًا مع منطق لإزالة التكرار في الطلبات وتخزين الاستجابات وتجنب الشلالات (بتحميل مسبق أو رفع متطلبات البيانات إلى المسارات).

يمكنك الاستمرار في الجلب مباشرة داخل التأثيرات إن لم تناسبك تلك المقاربات.

</DeepDive>

---

### تحديد التبعيات التفاعلية {/*specifying-reactive-dependencies*/}

**لاحظ أنك لا تستطيع «اختيار» تبعيات تأثيرك.** كل <CodeStep step={2}>قيمة تفاعلية</CodeStep> يستخدمها كود التأثير يجب إعلانها كتبعية. قائمة تبعيات التأثير تُحدَّد من الكود المحيط:

```js [[2, 1, "roomId"], [2, 2, "serverUrl"], [2, 5, "serverUrl"], [2, 5, "roomId"], [2, 8, "serverUrl"], [2, 8, "roomId"]]
function ChatRoom({ roomId }) { // This is a reactive value
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // This is a reactive value too

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads these reactive values
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ So you must specify them as dependencies of your Effect
  // ...
}
```

إذا تغيّر `serverUrl` أو `roomId`، سيعيد تأثيرك الاتصال بالدردشة بالقيم الجديدة.

**[القيم التفاعلية](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) تشمل الـ props وجميع المتغيرات والدوال المعرّفة مباشرة داخل مكوّنك.** بما أن `roomId` و`serverUrl` قيمتان تفاعليتان، لا يمكنك حذفهما من التبعيات. إذا حاولت حذفهما و[كان المُدقق مهيأ لـ React بشكل صحيح،](/learn/editor-setup#linting) فسيُبلغ عن ذلك كخطأ يجب إصلاحه:

```js {8}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has missing dependencies: 'roomId' and 'serverUrl'
  // ...
}
```

**لإزالة تبعية، عليك أن [«تُثبت» للمُدقق أنها *لا تحتاج* أن تكون تبعية.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)** مثلًا، يمكنك نقل `serverUrl` خارج المكوّن لإثبات أنها ليست تفاعلية ولن تتغيّر عند إعادة الرسم:

```js {1,8}
const serverUrl = 'https://localhost:1234'; // Not a reactive value anymore

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

بما أن `serverUrl` لم تعد قيمة تفاعلية (ولا يمكن أن تتغيّر عند إعادة الرسم)، لا تحتاج أن تكون تبعية. **إذا لم يستخدم كود التأثير أي قيم تفاعلية، فعليك أن تكون قائمة التبعيات فارغة (`[]`):**

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // Not a reactive value anymore
const roomId = 'music'; // Not a reactive value anymore

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
}
```

[التأثير ذو التبعيات الفارغة](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) لا يُعاد تشغيله عند تغيّر أي من props أو حالة مكوّنك.

<Pitfall>

إذا كان لديك قاعدة كود قائمة، قد تجد تأثيرات تُخفِي المُدقق هكذا:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**عندما لا تطابق التبعيات الكود، يرتفع خطر إدخال أخطاء.** بإخفاء المُدقق، «تكذب» على React بشأن القيم التي يعتمد عليها تأثيرك. [بدلًا من ذلك، أثبت أنها غير لازمة.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)

</Pitfall>

<Recipes titleText="أمثلة على تمرير تبعيات تفاعلية" titleId="examples-dependencies">

#### تمرير مصفوفة تبعيات {/*passing-a-dependency-array*/}

إذا حددت التبعيات، يعمل تأثيرك **بعد العرض الأول _و_ بعد إعادات الرسم التي تغيّرت فيها التبعيات.**

```js {3}
useEffect(() => {
  // ...
}, [a, b]); // Runs again if a or b are different
```

في المثال أدناه، `serverUrl` و`roomId` [قيمتان تفاعليتان،](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) فيجب تضمينهما كتبعيات. فينتج أن اختيار غرفة مختلفة من القائمة أو تعديل حقل عنوان الخادم يعيد الاتصال بالدردشة. أما `message` فلأنه غير مستخدم في التأثير (ولذا ليس تبعية)، فتعديل الرسالة لا يعيد الاتصال بالدردشة.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### تمرير مصفوفة تبعيات فارغة {/*passing-an-empty-dependency-array*/}

إذا لم يستخدم تأثيرك حقًا أي قيم تفاعلية، فسيُشغَّل **بعد العرض الأول فقط.**

```js {3}
useEffect(() => {
  // ...
}, []); // Does not run again (except once in development)
```

**حتى مع تبعيات فارغة، ستُشغَّل الإعداد والتنظيف [مرة إضافية في التطوير](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) لمساعدتك على اكتشاف الأخطاء.**


في هذا المثال، `serverUrl` و`roomId` ثابتان في الكود. وبما أنهما معرّفان خارج المكوّن، فليسا قيمتين تفاعليتين، ولا يُدرجان كتبعيات. قائمة التبعيات فارغة، فلا يُعاد تشغيل التأثير عند إعادة الرسم.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

</Sandpack>

<Solution />


#### عدم تمرير مصفوفة تبعيات إطلاقًا {/*passing-no-dependency-array-at-all*/}

إذا لم تمرّر مصفوفة تبعيات على الإطلاق، يعمل تأثيرك **بعد كل عرض (وإعادة رسم)** لمكوّنك.

```js {3}
useEffect(() => {
  // ...
}); // Always runs again
```

في هذا المثال، يُعاد تشغيل التأثير عند تغيير `serverUrl` و`roomId`، وهذا منطقي. لكنه *أيضًا* يُعاد عند تغيير `message`، وهذا غالبًا غير مرغوب. لذلك عادةً تحدد مصفوفة التبعيات.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }); // No dependency array at all

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### تحديث الحالة اعتمادًا على الحالة السابقة من تأثير {/*updating-state-based-on-previous-state-from-an-effect*/}

عندما تريد تحديث الحالة اعتمادًا على الحالة السابقة من داخل تأثير، قد تواجه مشكلة:

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // You want to increment the counter every second...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... but specifying `count` as a dependency always resets the interval.
  // ...
}
```

بما أن `count` قيمة تفاعلية، يجب إدراجها في قائمة التبعيات. لكن ذلك يجعل التأثير ينظّف ويُعاد إعداده في كل مرة يتغيّر فيها `count`. هذا غير مثالي.

لإصلاح ذلك، [مرّر دالة تحديث الحالة `c => c + 1`](/reference/react/useState#updating-state-based-on-the-previous-state) إلى `setCount`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ Pass a state updater
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ Now count is not a dependency

  return <h1>{count}</h1>;
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

بعد أن تمرّر `c => c + 1` بدل `count + 1`، [لم يعد تأثيرك بحاجة للاعتماد على `count`.](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state) نتيجة هذا الإصلاح، لن يحتاج لإلغاء إعداد المؤقت وإعادته في كل مرة يتغيّر فيها `count`.

---


### إزالة تبعيات كائن غير ضرورية {/*removing-unnecessary-object-dependencies*/}

إذا اعتمد تأثيرك على كائن أو دالة تُنشآن أثناء الرسم، قد يُشغَّل أكثر من اللازم. مثلًا، يعيد هذا التأثير الاتصال بعد كل رسم لأن كائن `options` [يختلف في كل رسم:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {6-9,12,15}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 This object is created from scratch on every re-render
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // It's used inside the Effect
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 As a result, these dependencies are always different on a re-render
  // ...
```

تجنب استخدام كائن يُنشأ أثناء الرسم كتبعية. أنشئ الكائن داخل التأثير بدلًا من ذلك:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

بعد أن تنشئ كائن `options` داخل التأثير، يصبح التأثير يعتمد فقط على السلسلة `roomId`.

مع هذا الإصلاح، الكتابة في الحقل لا تعيد الاتصال بالدردشة. بخلاف الكائن الذي يُعاد إنشاؤه، لا تتغيّر سلسلة مثل `roomId` ما لم تضبطها إلى قيمة أخرى. [اطلع على المزيد حول إزالة التبعيات.](/learn/removing-effect-dependencies)

---

### إزالة تبعيات دالة غير ضرورية {/*removing-unnecessary-function-dependencies*/}

إذا اعتمد تأثيرك على كائن أو دالة تُنشآن أثناء الرسم، قد يُشغَّل أكثر من اللازم. مثلًا، يعيد هذا التأثير الاتصال بعد كل رسم لأن دالة `createOptions` [تختلف في كل رسم:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {4-9,12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 This function is created from scratch on every re-render
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // It's used inside the Effect
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🚩 As a result, these dependencies are always different on a re-render
  // ...
```

إنشاء دالة من الصفر في كل إعادة رسم ليس مشكلة بذاته. لا حاجة لتحسين ذلك. لكن إذا استخدمتها كتبعية لتأثيرك، فستجعل التأثير يُعاد بعد كل إعادة رسم.

تجنب استخدام دالة تُنشأ أثناء الرسم كتبعية. عرّفها داخل التأثير بدلًا من ذلك:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

بعد أن تعرّف دالة `createOptions` داخل التأثير، يصبح التأثير يعتمد فقط على السلسلة `roomId`. مع هذا الإصلاح، الكتابة في الحقل لا تعيد الاتصال بالدردشة. بخلاف الدالة التي تُعاد إنشاؤها، لا تتغيّر سلسلة مثل `roomId` ما لم تضبطها إلى قيمة أخرى. [اطلع على المزيد حول إزالة التبعيات.](/learn/removing-effect-dependencies)

---

### قراءة أحدث الـ props والحالة من تأثير {/*reading-the-latest-props-and-state-from-an-effect*/}

افتراضيًا، عندما تقرأ قيمة تفاعلية من داخل تأثير، يجب إضافتها كتبعية. يضمن ذلك أن يتفاعل تأثيرك مع كل تغيّر لتلك القيمة. لمعظم التبعيات، هذا السلوك المرغوب.

**لكن أحيانًا تريد قراءة *أحدث* الـ props والحالة من داخل تأثير دون أن «يتفاعل» معها.** مثلًا، تخيّل أنك تريد تسجيل عدد عناصر سلة التسوق عند كل زيارة صفحة:

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ All dependencies declared
  // ...
}
```

**ماذا إن أردت تسجيل زيارة جديدة بعد كل تغيّر في `url`، لكن *ليس* إذا تغيّرت `shoppingCart` وحدها؟** لا يمكنك استبعاد `shoppingCart` من التبعيات دون كسر [قواعد التفاعل.](#specifying-reactive-dependencies) لكن يمكنك أن تعني أنك *لا تريد* أن يتفاعل جزء من الكود مع التغيّرات رغم أنه يُستدعى من داخل تأثير. [صرّح عن *حدث تأثير (Effect Event)*](/learn/separating-events-from-effects#declaring-an-effect-event) باستخدام Hook [`useEffectEvent`](/reference/react/useEffectEvent)، وانقل الكود الذي يقرأ `shoppingCart` إلى داخله:

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

**أحداث التأثير ليست تفاعلية ويجب دائمًا حذفها من تبعيات تأثيرك.** هذا ما يسمح بوضع كود غير تفاعلي (حيث يمكنك قراءة أحدث قيم بعض الـ props والحالة) داخلها. بقراءة `shoppingCart` داخل `onVisit`، تضمن ألا يعيد `shoppingCart` تشغيل تأثيرك.

[اطلع على المزيد حول كيف تفصل أحداث التأثير بين الكود التفاعلي وغير التفاعلي.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)


---

### عرض محتوى مختلف على الخادم والعميل {/*displaying-different-content-on-the-server-and-the-client*/}

إذا كان تطبيقك يستخدم العرض من الخادم (إما [مباشرة](/reference/react-dom/server) أو عبر [إطار عمل](/learn/creating-a-react-app#full-stack-frameworks))، فسيُرسم مكوّنك في بيئتين مختلفتين. على الخادم، يُنتج HTML أوليًا. على العميل، تعيد React تشغيل كود الرسم لتربط معالجات الأحداث بذلك HTML. لذلك، كي تعمل [الترطيب (hydration)](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html)، يجب أن يكون مخرج العرض الأول متطابقًا بين العميل والخادم.

في حالات نادرة، قد تحتاج لعرض محتوى مختلف على العميل. مثلًا، إذا قرأ التطبيق بيانات من [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)، فلا يمكن فعل ذلك على الخادم. إليك أحد أشكال التنفيذ:


{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js {expectedErrors: {'react-compiler': [5]}}
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... return client-only JSX ...
  }  else {
    // ... return initial JSX ...
  }
}
```

أثناء تحميل التطبيق، يرى المستخدم مخرج العرض الأول. ثم بعد التحميل والترطيب، يعمل تأثيرك ويضبط `didMount` إلى `true` فيُطلق إعادة رسم. ينتقل ذلك إلى مخرج خاص بالعميل. التأثيرات لا تعمل على الخادم، لذلك كان `didMount` يساوي `false` أثناء العرض الأول على الخادم.

استخدم هذا النمط باعتدال. تذكر أن المستخدمين باتصال بطيء سيرون المحتوى الأول لوقت طويل — ربما ثوانٍ عدة — فلا تُجرِ تغييرات مزعجة لمظهر المكوّن. في كثير من الحالات يمكنك تجنب الحاجة بعرض أشياء مختلفة شرطيًا بـ CSS.

---

## استكشاف الأخطاء {/*troubleshooting*/}

### يعمل تأثيري مرتين عند تركيب المكوّن {/*my-effect-runs-twice-when-the-component-mounts*/}

عند تفعيل Strict Mode، في التطوير، تشغّل React الإعداد والتنظيف مرة إضافية قبل الإعداد الفعلي.

هذا اختبار ضغط يتحقق من صحة تنفيذ منطق التأثير. إذا سبب ذلك مشاكل مرئية، فدالة التنظيف تفتقد منطقًا. يجب أن توقف دالة التنظيف أو تلغي كل ما تفعله دالة الإعداد. قاعدة عملية: لا يجب أن يميز المستخدم بين استدعاء الإعداد مرة واحدة (كما في الإنتاج) وتسلسل إعداد → تنظيف → إعداد (كما في التطوير).

اطلع على المزيد حول [كيف يساعد ذلك على اكتشاف الأخطاء](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) و[كيف تصلح منطقك.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### يعمل تأثيري بعد كل إعادة رسم {/*my-effect-runs-after-every-re-render*/}

أولًا، تحقق أنك لم تنسَ تحديد مصفوفة التبعيات:

```js {3}
useEffect(() => {
  // ...
}); // 🚩 No dependency array: re-runs after every render!
```

إذا حددت مصفوفة التبعيات لكن تأثيرك ما زال يُعاد في حلقة، فذلك لأن إحدى التبعيات تختلف في كل إعادة رسم.

يمكنك تنقيح المشكلة بتسجيل التبعيات يدويًا في وحدة التحكم:

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

ثم انقر بالزر الأيمن على المصفوفات من إعادات رسم مختلفة في وحدة التحكم واختر «Store as a global variable» لكليهما. إذا حُفظت الأولى كـ`temp1` والثانية كـ`temp2`، يمكنك في وحدة التحكم التحقق مما إذا كانت كل تبعية في المصفوفتين متطابقة:

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

عندما تجد التبعية التي تختلف في كل إعادة رسم، يمكنك عادةً إصلاحها بإحدى الطرق التالية:

- [تحديث الحالة اعتمادًا على الحالة السابقة من تأثير](#updating-state-based-on-previous-state-from-an-effect)
- [إزالة تبعيات كائن غير ضرورية](#removing-unnecessary-object-dependencies)
- [إزالة تبعيات دالة غير ضرورية](#removing-unnecessary-function-dependencies)
- [قراءة أحدث الـ props والحالة من تأثير](#reading-the-latest-props-and-state-from-an-effect)

كخيار أخير (إن لم تسعف تلك الطرق)، غلّف إنشاءها بـ [`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook) أو [`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often) (للدوال).

---

### يستمر تأثيري بالتشغيل في حلقة لا نهائية {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

إذا كان تأثيرك يعمل في حلقة لا نهائية، فيجب أن يتحقق أمران:

- يحدّث التأثير بعض الحالة.
- تلك الحالة تؤدي لإعادة رسم، ما يغيّر تبعيات التأثير.

قبل البدء بالإصلاح، اسأل نفسك هل يتصل تأثيرك بنظام خارجي (مثل DOM أو الشبكة أو ويدجت طرف ثالث، إلخ). لماذا يحتاج التأثير لضبط الحالة؟ هل يزامن ذلك النظام الخارجي؟ أم تحاول إدارة تدفق بيانات التطبيق به؟

إذا لم يوجد نظام خارجي، فكّر هل [إزالة التأثير بالكامل](/learn/you-might-not-need-an-effect) تبسّط المنطق.

إذا كنت تزامن فعلًا مع نظام خارجي، فكّر لماذا ومتى يجب أن يحدّث التأثير الحالة. هل تغيّر شيء يؤثر على المخرج المرئي؟ إذا احتجت تتبع بيانات لا تُستخدم في الرسم، فقد يكون [ref](/reference/react/useRef#referencing-a-value-with-a-ref) (ولا يطلق إعادة رسم) أنسب. تحقق أن تأثيرك لا يحدّث الحالة (ولا يطلق إعادات رسم) أكثر من اللازم.

أخيرًا، إذا حدّث التأثير الحالة في الوقت الصحيح لكن ما زالت هناك حلقة، فذلك لأن تحديث الحالة يغيّر إحدى تبعيات التأثير. [اطلع على كيفية تنقيح تغيّرات التبعيات.](/reference/react/useEffect#my-effect-runs-after-every-re-render)

---

### يعمل منطق التنظيف رغم أن مكوّني لم يُلغَ تركيبه {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}

دالة التنظيف لا تعمل عند إلغاء التركيب فقط، بل قبل كل إعادة رسم تتغيّر فيها التبعيات. إضافةً لذلك، في التطوير، [تشغّل React إعدادًا+تنظيفًا مرة إضافية مباشرة بعد تركيب المكوّن.](#my-effect-runs-twice-when-the-component-mounts)

إذا كان لديك كود تنظيف بلا كود إعداد مقابل، فغالبًا ذلك رائحة كود سيئ:

```js {2-5}
useEffect(() => {
  // 🔴 Avoid: Cleanup logic without corresponding setup logic
  return () => {
    doSomething();
  };
}, []);
```

يجب أن يكون منطق التنظيف «متناظرًا» مع منطق الإعداد، وأن يوقف أو يلغي كل ما فعله الإعداد:

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[تعرّف على كيف يختلف دورة حياة التأثير عن دورة حياة المكوّن.](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)

---

### يفعل تأثيري شيئًا مرئيًا وأرى وميضًا قبل تشغيله {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

إذا كان يجب أن يمنع تأثيرك المتصفح من [رسم الشاشة،](/learn/render-and-commit#epilogue-browser-paint) فاستبدل `useEffect` بـ [`useLayoutEffect`.](/reference/react/useLayoutEffect) لاحظ أن **هذا لا ينبغي أن يُحتاج لأغلب التأثيرات.** تحتاجه فقط إن كان من الحيوي تشغيل التأثير قبل رسم المتصفح: مثلًا لقياس وضع تلميح قبل أن يراه المستخدم.
