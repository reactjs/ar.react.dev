---
title: 'المزامنة مع التأثيرات'
---

<Intro>

تحتاج بعض المكوّنات للمزامنة مع أنظمة خارجية. مثلاً التحكم في مكوّن غير React بناءً على الحالة، أو إعداد اتصال بالخادم، أو إرسال سجل تحليلات عند ظهور المكوّن. تسمح لك *التأثيرات (Effects)* بتشغيل كود بعد التصيير لمزامنة المكوّن مع نظام خارج React.

</Intro>

<YouWillLearn>

- ما التأثيرات
- كيف تختلف عن الأحداث
- كيف تعلن عن Effect في مكوّنك
- كيف تتخطى إعادة تشغيل Effect دون داعٍ
- لماذا تُشغَّل Effects مرتين في التطوير وكيف تصلح ذلك

</YouWillLearn>

## ما التأثيرات وكيف تختلف عن الأحداث؟ {/*what-are-effects-and-how-are-they-different-from-events*/}

قبل Effects، تعرّف على نوعين من المنطق داخل مكوّنات React:

- **كود التصيير** (في [وصف واجهة المستخدم](/learn/describing-the-ui)) في أعلى المكوّن. تأخذ الخصائص والحالة، تحوّلها، وتعيد JSX المراد عرضه. [يجب أن يكون كود التصيير نقيًا.](/learn/keeping-components-pure) كمعادلة رياضية، يحسب النتيجة فقط دون فعل آخر.

- **معالجات الأحداث** (في [إضافة التفاعلية](/learn/adding-interactivity)) دوال متداخلة *تفعل* أشياء لا تحسبها فقط. قد تحدّث حقل إدخال، ترسل POST لشراء منتج، أو تنقل المستخدم. فيها [«آثار جانبية»](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) ناتجة عن فعل مستخدم (نقر أو كتابة).

أحيانًا لا يكفي ذلك. تخيّل `ChatRoom` يجب أن يتصل بخادم الدردشة كلما ظهر على الشاشة. الاتصال ليس حسابًا نقيًا (تأثير جانبي) فلا يحدث أثناء التصيير. وليس هناك حدث واحد مثل النقر يجعل `ChatRoom` يظهر.

***التأثيرات* تسمح بتحديد آثار جانبية سببها التصيير نفسه لا حدثًا معيّنًا.** إرسال رسالة في الدردشة *حدث* لأنه ناتج عن نقر زر. أما إعداد اتصال بالخادم فهو *Effect* لأنه يجب أن يحدث بغض النظر عن التفاعل الذي أظهر المكوّن. تُشغَّل Effects في نهاية [commit](/learn/render-and-commit) بعد تحديث الشاشة—وقت مناسب للمزامنة مع نظام خارجي (شبكة، مكتبة طرف ثالث).

<Note>

في هذا النص، «Effect» بأحرف كبيرة تعني تعريف React أعلاه (أثر جانبي ناتج عن التصيير). للمفهوم العام في البرمجة نقول «أثر جانبي».

</Note>


## قد لا تحتاج إلى Effect {/*you-might-not-need-an-effect*/}

**لا تتعجل بإضافة Effects.** تذكّر أنها عادةً لـ «الخروج» من React والمزامنة مع نظام *خارجي* (واجهات المتصفح، مكوّنات واجهة، شبكة، إلخ). إن كان Effect يضبط حالة بناءً على حالة أخرى فقط، [قد لا تحتاج Effect.](/learn/you-might-not-need-an-effect)

## كيف تكتب Effect {/*how-to-write-an-effect*/}

لتكتب Effect، اتبع ثلاث خطوات:

1. **أعلن عن Effect.** افتراضيًا، يُشغَّل بعد كل [commit](/learn/render-and-commit).
2. **حدّد تبعيات Effect.** أغلب Effects يجب أن تُعاد *عند الحاجة* لا بعد كل تصيير. مثلاً ظهور مكوّن يشغّل fade-in. الاتصال بغرفة دردشة عند الظهور والاختفاء أو تغيّر الغرفة. ستتعلم التحكم بذلك بـ *التبعيات.*
3. **أضف تنظيفًا إن لزم.** بعض Effects تحتاج طريقة لإيقاف أو إلغاء ما فعلته: «connect» يحتاج «disconnect»، «subscribe» يحتاج «unsubscribe»، «fetch» يحتاج «cancel» أو «ignore». تتعلم ذلك بإرجاع *دالة تنظيف.*

لننظر في كل خطوة.

### الخطوة 1: إعلان Effect {/*step-1-declare-an-effect*/}

لإعلان Effect، استورد [`useEffect`](/reference/react/useEffect) من React:

```js
import { useEffect } from 'react';
```

ثم استدعِه في أعلى المكوّن وضع الكود داخل Effect:

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // Code here will run after *every* render
  });
  return <div />;
}
```

في كل تصيير، يحدّث React الشاشة *ثم* يشغّل كود `useEffect`. بمعنى آخر، **`useEffect` يؤجّل تنفيذ جزء من الكود حتى يظهر ناتج التصيير على الشاشة.**

لنرَ مزامنة مع نظام خارجي عبر مكوّن `<VideoPlayer>`. من المفيد التحكم في التشغيل/الإيقاف بتمرير خاصية `isPlaying`:

```js
<VideoPlayer isPlaying={isPlaying} />;
```

مكوّن `VideoPlayer` يصيّر وسم المتصفح [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video):

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: do something with isPlaying
  return <video src={src} />;
}
```

لكن `<video>` لا تملك خاصية `isPlaying`. التحكم يكون باستدعاء [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) و[`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) على عنصر DOM. **يجب مزامنة `isPlaying` (هل يجب أن يعمل الفيديو الآن) مع `play()` و`pause()`.**

نحتاج أولًا [ref](/learn/manipulating-the-dom-with-refs) لعقدة `<video>`.

قد يغريك استدعاء `play()` أو `pause()` أثناء التصيير، وهذا غير صحيح:

<Sandpack>

```js {expectedErrors: {'react-compiler': [7, 9]}}
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // Calling these while rendering isn't allowed.
  } else {
    ref.current.pause(); // Also, this crashes.
  }

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

السبب أن الكود يمس DOM أثناء التصيير. في React، [التصيير حساب نقي](/learn/keeping-components-pure) لـ JSX بلا آثار جانبية كتعديل DOM.

أيضًا في أول استدعاء لـ `VideoPlayer` لا يوجد DOM بعد! لا عقدة لاستدعاء `play()` عليها حتى تعيد JSX.

الحل **لفّ الأثر الجانبي بـ `useEffect` لإخراجه من حساب التصيير:**

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

بلفّ التحديث في Effect، يحدّث React الشاشة أولًا ثم يشغّل Effect.

عند تصيير `VideoPlayer` (أول مرة أو إعادة)، يحدّث React الشاشة فيتأكد أن `<video>` في DOM بالخصائص الصحيحة، ثم يشغّل Effect، فيستدعي `play()` أو `pause()` حسب `isPlaying`.

اضغط Play/Pause عدة مرات ولاحظ بقاء المزامنة مع `isPlaying`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

«النظام الخارجي» هنا هو واجهة الوسائط في المتصفح. يمكنك لف كود قديم (مثل jQuery) في مكوّنات React تصريحية.

التحكم بالفيديو أعقد عمليًا (`play()` قد يفشل، تحكم المستخدم بالواجهة المدمجة، إلخ). المثال مبسّط.

<Pitfall>

افتراضيًا، Effects تُشغَّل بعد *كل* تصيير. لذلك كود كهذا **يُسبب حلقة لا نهائية:**

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

Effects نتيجة *التصيير*. ضبط الحالة *يطلق* تصييرًا. ضبط الحالة فورًا في Effect كوصل مقبس كهرباء بنفسه: Effect → حالة → تصيير → Effect…

عادةً تزامن مع نظام *خارجي*. إن لم يوجد ولا تريد سوى ضبط حالة من حالة، [قد لا تحتاج Effect.](/learn/you-might-not-need-an-effect)

</Pitfall>

### الخطوة 2: حدّد تبعيات Effect {/*step-2-specify-the-effect-dependencies*/}

افتراضيًا، Effects بعد *كل* تصيير، وغالبًا **هذا غير مرغوب:**

- قد يكون بطيئًا. المزامنة ليست فورية دائمًا، فتريد تخطيها إن لم تلزم. مثلاً لا تعيد الاتصال بخادم الدردشة عند كل حرف.
- قد يكون خطأ. لا تريد fade-in عند كل حرف، بل مرة عند أول ظهور.

لتوضيح المشكلة، المثال السابق مع `console.log` وحقل نص يحدّث حالة الأب. لاحظ إعادة Effect عند الكتابة:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

يمكنك إخبار React **بتخطي إعادة تشغيل Effect دون داعٍ** بمصفوفة *تبعيات* كوسيط ثانٍ لـ `useEffect`. أضف `[]` فارغة في المثال أعلاه (حوالي السطر 14):

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

ستظهر رسالة خطأ مثل `React Hook useEffect has a missing dependency: 'isPlaying'`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, []); // This causes an error

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

الكود داخل Effect *يعتمد على* `isPlaying` لكن التبعية لم تُصرَّح بها. أضف `isPlaying` إلى مصفوفة التبعيات:

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // It's used here...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...so it must be declared here!
```

بعد التصريح عن كل التبعيات يختفي الخطأ. `[isPlaying]` تعني: لا تعِد تشغيل Effect إن لم يتغيّر `isPlaying` عن التصيير السابق. الكتابة في الحقل لا تعيد Effect، بينما Play/Pause تعيده:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

يمكن أن تحتوي المصفوفة على عدة تبعيات. React يتخطى إعادة التشغيل فقط إذا *كل* القيم المصرَّح بها مطابقة للتصيير السابق، بمقارنة [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). التفاصيل في [مرجع `useEffect`](/reference/react/useEffect#reference).

**لا يمكنك «اختيار» التبعيات.** إن لم تطابق ما يتوقعه React من داخل Effect يظهر خطأ lint، وهذا يكشف أخطاء. إن لم ترد إعادة تشغيل كود، [*عدّل Effect نفسه* حتى لا «يحتاج» تلك التبعية.](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)

<Pitfall>

سلوك عدم وجود مصفوفة تبعيات يختلف عن مصفوفة `[]` *الفارغة*:

```js {3,7,11}
useEffect(() => {
  // This runs after every render
});

useEffect(() => {
  // This runs only on mount (when the component appears)
}, []);

useEffect(() => {
  // This runs on mount *and also* if either a or b have changed since the last render
}, [a, b]);
```

سنشرح معنى «mount» في الخطوة التالية.

</Pitfall>

<DeepDive>

#### لماذا حُذف ref من مصفوفة التبعيات؟ {/*why-was-the-ref-omitted-from-the-dependency-array*/}

Effect يستخدم `ref` و`isPlaying`، لكن فقط `isPlaying` مُصرَّح به:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

لأن كائن `ref` له *هوية ثابتة:* React يضمن [نفس الكائن](/reference/react/useRef#returns) من نفس استدعاء `useRef` في كل تصيير. لا يتغيّر، فلا يعيد تشغيل Effect وحده. يمكن إدراجه أو حذفه؛ الإدراج مقبول أيضًا:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

[دوال `set`](/reference/react/useState#setstate) من `useState` لها هوية ثابتة أيضًا، فغالبًا تُحذف من التبعيات. إن سمح linter بالحذف بلا أخطاء فالأمر آمن.

حذف التبعيات الثابتة دائمًا يعمل فقط إن كان linter «يرى» الثبات. إن مرَّر الأب `ref` يجب إدراجه في المصفوفة؛ وهذا صحيح لأنك لا تدري إن كان الأب يمرّر نفس ref دائمًا أم refًا مشروطًا، فيعتمد Effect على أي ref يُمرَّر.

</DeepDive>

### الخطوة 3: أضف تنظيفًا إن لزم {/*step-3-add-cleanup-if-needed*/}

مثال آخر: مكوّن `ChatRoom` يتصل بخادم الدردشة عند الظهور. لديك `createConnection()` تعيد كائنًا فيه `connect()` و`disconnect()`. كيف تبقي الاتصال طالما المكوّن ظاهر؟

ابدأ بكتابة Effect:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

الاتصال بعد كل تصيير بطيء، فأضف مصفوفة التبعيات:

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**الكود داخل Effect لا يستخدم props ولا state، فالمصفوفة `[]` (فارغة). هذا يخبر React بتشغيل الكود عند «mount» المكوّن، أي أول ظهور على الشاشة.**

جرّب تشغيله:

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

Effect يعمل عند mount فقط، فتتوقع طباعة `"✅ Connecting..."` مرة في الـ console. **لكنك ستجدها مرتين. لماذا؟**

تخيّل `ChatRoom` ضمن تطبيق بشاشات متعددة. المستخدم يبدأ من صفحة الدردشة، فيُحمَّل المكوّن ويستدعي `connection.connect()`. ثم ينتقل إلى الإعدادات فيُزال `ChatRoom` من DOM. ثم يضغط رجوع فيُعاد تحميل `ChatRoom`، فيُنشأ اتصال ثانٍ بينما الأول لم يُغلق! مع التنقل تتراكم الاتصالات.

أخطاء كهذه تفوت دون اختبار يدوي طويل. في التطوير، يعيد React تحميل كل مكوّن مرة بعد أول mount لمساعدتك على اكتشافها.

رؤية السجل مرتين تكشف المشكلة: الكود لا يغلق الاتصال عند unmount.

الحل: أعد *دالة تنظيف* من Effect:

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React يستدعي دالة التنظيف قبل كل إعادة تشغيل لـ Effect، ومرة أخيرة عند unmount المكوّن. لنرَ النتيجة:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

في التطوير ترى ثلاث رسائل:

1. `"✅ Connecting..."`
2. `"❌ Disconnected."`
3. `"✅ Connecting..."`

**هذا السلوك الصحيح في التطوير.** بإعادة mount، React يتحقق أن الذهاب والعودة لا يكسر الكود. قطع الاتصال ثم إعادة الاتصال هو المتوقع! مع تنظيف جيد لا يفرق للمستخدم بين تشغيل Effect مرة أو تسلسل _إعداد → تنظيف → إعداد_. الزوج الإضافي connect/disconnect لأن React يختبر الكود في التطوير — طبيعي، لا تحاول إزالته.

**في الإنتاج تظهر `"✅ Connecting..."` مرة واحدة.** إعادة mount للمكوّنات في التطوير فقط لاكتشاف Effects التي تحتاج تنظيفًا. يمكن إيقاف [Strict Mode](/reference/react/StrictMode)، لكن ننصح بإبقائه.

## كيف تتعامل مع تشغيل Effect مرتين في التطوير؟ {/*how-to-handle-the-effect-firing-twice-in-development*/}

React يعيد mount عمدًا في التطوير لاكتشاف الأخطاء. **السؤال الصحيح ليس «كيف أشغّل Effect مرة» بل «كيف أصلح Effect ليعمل بعد إعادة mount».**

الجواب غالبًا: تنفيذ دالة التنظيف. يجب أن توقف أو تلغي ما فعله Effect. القاعدة: المستخدم لا يميز بين تشغيل مرة (كالإنتاج) وتسلسل _setup → cleanup → setup_ (كالتطوير).

أغلب Effects التي تكتبها تندرج تحت الأنماط التالية.

<Pitfall>

#### لا تستخدم refs لمنع تشغيل Effects {/*dont-use-refs-to-prevent-effects-from-firing*/}

خطأ شائع: `ref` لمنع تشغيل Effect أكثر من مرة، مثل «إصلاح» الخطأ السابق بـ `useRef`:

```js {1,3-4}
  const connectionRef = useRef(null);
  useEffect(() => {
    // 🚩 This wont fix the bug!!!
    if (!connectionRef.current) {
      connectionRef.current = createConnection();
      connectionRef.current.connect();
    }
  }, []);
```

فيظهر `"✅ Connecting..."` مرة في التطوير لكن الخطأ باقٍ.

عند المغادرة لا يُغلق الاتصال، وعند العودة يُنشأ اتصال جديد، فتتراكم الاتصالات كما قبل «الإصلاح».

لا يكفي جعل Effect يعمل مرة؛ يجب أن يعمل بعد إعادة mount، أي تنظيف الاتصال كما في الحل أعلاه.

انظر الأمثلة التالية للأنماط الشائعة.

</Pitfall>

### التحكم في ويدجتات غير React {/*controlling-non-react-widgets*/}

أحيانًا تحتاج واجهات ليست بـ React، مثل خريطة فيها `setZoomLevel()` وتريد مزامنة التكبير مع `zoomLevel` في React. Effect يشبه:

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

لا حاجة لتنظيف هنا. في التطوير يُستدعى Effect مرتين دون مشكلة لأن `setZoomLevel` بنفس القيمة لا يضر. قد يكون أبطأ قليلًا دون أهمية؛ في الإنتاج لا إعادة mount بلا داعٍ.

بعض الواجهات لا تسمح بالاستدعاء المزدوج، مثل [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) لـ [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) الذي يرمي عند الاستدعاء الثاني. نفّذ التنظيف بإغلاق الحوار:

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

في التطوير: `showModal()` ثم `close()` ثم `showModal()` — للمستخدم كاستدعاء واحد كما في الإنتاج.

### الاشتراك في الأحداث {/*subscribing-to-events*/}

إن اشترك Effect في شيء، يجب أن يلغي الاشتراك في التنظيف:

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

في التطوير: `addEventListener` ثم `removeEventListener` ثم `addEventListener` بنفس المعالج، فيبقى اشتراك واحد فعّال. كالاستدعاء مرة في الإنتاج.

### تشغيل الحركات {/*triggering-animations*/}

إن أدخل Effect حركة، يعيد التنظيف القيم الأولية:

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Trigger the animation
  return () => {
    node.style.opacity = 0; // Reset to the initial value
  };
}, []);
```

في التطوير: opacity `1` ثم `0` ثم `1` — للمستخدم كتعيين `1` مباشرة كالإنتاج. مع مكتبة حركة خارجية، أعد الخط الزمني للبداية في التنظيف.

### جلب البيانات {/*fetching-data*/}

إن جلب Effect بيانات، استخدم التنظيف لـ [إلغاء الطلب](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) أو لتجاهل النتيجة:

```js {2,6,13-15}
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

لا يمكن «تراجع» طلب حدث، لكن التنظيف يمنع استجابة _لم تعد ملائمة_ من تغيير التطبيق. إن تغيّر `userId` من `'Alice'` إلى `'Bob'`، يُتجاهل رد Alice حتى لو وصل بعد Bob.

**في التطوير قد ترى طلبين في Network** — لا بأس. مع النمط أعلاه، يُنظَّف أول Effect فورًا فيُضبط `ignore` إلى `true`، فالطلب الإضافي لا يغيّر الحالة بفحص `if (!ignore)`.

**في الإنتاج طلب واحد.** إن أزعجك الطلب الثاني في التطوير، استخدم حلاً يزيل التكرار ويخزّن الاستجابات بين المكوّنات:

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

يحسّن التطوير ويسرّع التطبيق؛ زر الرجوع قد لا ينتظر إعادة التحميل لأن البيانات مخزّنة. ابنِ التخزين أو استخدم بدائل الجلب اليدوي في Effects.

<DeepDive>

#### ما البدائل الجيدة لجلب البيانات في Effects؟ {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

`fetch` داخل Effects [طريقة شائعة](https://www.robinwieruch.de/react-hooks-fetch-data/) خصوصًا في تطبيقات العميل فقط، لكنها يدوية ولها عيوب:

- **Effects لا تعمل على الخادم.** HTML الأول يحتوي غالبًا تحميلًا بلا بيانات، ثم يحمّل العميل كل JS ليكتشف أنه يحتاج البيانات — غير فعّال.
- **الجلب المباشر في Effects يسهل «شلالات الشبكة».** الأب يجلب، ثم الأبناء يبدأون الجلب متتابعًا؛ أبطأ من الجلب المتوازي.
- **غالبًا بلا تحميل مسبق ولا تخزين.** عند unmount ثم mount يُعاد الجلب.
- **مزعج إنشائيًا.** كثير من القوالب لتجنب [سباقات النتائج](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect).

القائمة ليست خاصة بـ React؛ تنطبق على «جلب عند mount» بأي مكتبة. الجلب الجيد غير بسيط، فننصح بـ:

- **مع [إطار عمل](/learn/start-a-new-react-project#full-stack-frameworks)، استخدم آلية الجلب المدمجة.**
- **وإلا ففكّر بتخزين جانب العميل.** حلول مفتوحة: [TanStack Query](https://tanstack.com/query/latest)، [useSWR](https://swr.vercel.app/)، [React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview). أو ابنِ حلاً يستخدم Effects داخليًا مع إزالة التكرار والتخزين وتجنب الشلالات (تحميل مسبق أو رفع متطلبات البيانات للمسارات).

يمكنك الإبقاء على `fetch` في Effects إن لم يناسبك غير ذلك.

</DeepDive>

### إرسال التحليلات {/*sending-analytics*/}

كود يرسل حدث تحليلات عند زيارة الصفحة:

```js
useEffect(() => {
  logVisit(url); // Sends a POST request
}, [url]);
```

في التطوير يُستدعى `logVisit` مرتين لكل URL، وقد تريد «إصلاح» ذلك. **أبقِ الكود كما هو.** كالأمثلة السابقة، لا فرق *مرئيًا للمستخدم* بين مرة ومرتين. عمليًا، `logVisit` لا يفعل شيئًا في التطوير حتى لا تشوّش سجلات المطورين المقاييس. المكوّن يُعاد mount عند كل حفظ فيزيد السجلات في التطوير على أي حال.

**في الإنتاج لا تكرار لسجلات الزيارة.**

لتصحيح الأحداث المرسلة، انشر على staging (وضع إنتاج) أو عطّل مؤقتًا [Strict Mode](/reference/react/StrictMode). أو أرسل التحليلات من معالجات تغيير المسار بدل Effects. للدقة، [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) يتتبع الظهور في viewport.

### ليس Effect: تهيئة التطبيق {/*not-an-effect-initializing-the-application*/}

منطق يعمل مرة عند بدء التطبيق — ضعه خارج المكوّنات:

```js {2-3}
if (typeof window !== 'undefined') { // Check if we're running in the browser.
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

يضمن التنفيذ مرة بعد تحميل الصفحة في المتصفح.

### ليس Effect: شراء منتج {/*not-an-effect-buying-a-product*/}

أحيانًا حتى مع التنظيف لا يمكن منع عواقب مرئية لتشغيل Effect مرتين، مثل POST لشراء منتج:

```js {2-3}
useEffect(() => {
  // 🔴 Wrong: This Effect fires twice in development, exposing a problem in the code.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

لا تريد شراء مرتين، ولذلك لا تضع هذا في Effect. إن ذهب المستخدم ثم رجع بالرجوع يُعاد Effect. الشراء ليس عند *زيارة* الصفحة بل عند *نقر* الشراء.

الشراء من تفاعل محدد، لا من التصيير. **احذف Effect وانقل طلب `/api/buy` إلى معالج النقر:**

```js {2-3}
  function handleClick() {
    // ✅ Buying is an event because it is caused by a particular interaction.
    fetch('/api/buy', { method: 'POST' });
  }
```

**إن كسر إعادة mount منطقك فغالبًا الخطأ موجود مسبقًا.** للمستخدم، زيارة الصفحة يجب أن تشبه: زيارة، رابط، رجوع. React يتحقق بإعادة mount مرة في التطوير.

## جمع الأفكار {/*putting-it-all-together*/}

ساحة تجريبية لتلمس سلوك Effects عمليًا.

المثال يستخدم [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) لجدولة `console.log` بعد ثلاث ثوانٍ؛ التنظيف يلغي المؤقت. ابدأ بالضغط على «Mount the component»:

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Schedule "' + text + '" log');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Cancel "' + text + '" log');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        What to log:{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Unmount' : 'Mount'} the component
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

في البداية ترى ثلاث رسائل: `Schedule "a" log`، ثم `Cancel "a" log`، ثم `Schedule "a" log` مجددًا. بعد ثلاث ثوانٍ تظهر `a`. الزوج الإضافي schedule/cancel لأن React يعيد mount في التطوير للتحقق من التنظيف.

عدّل الحقل إلى `abc` بسرعة؛ قد ترى `Schedule "ab" log` ثم `Cancel "ab" log` ثم `Schedule "abc" log`. **React ينظّف Effect التصيير السابق قبل Effect التصيير التالي.** لذلك حتى مع كتابة سريعة يوجد مؤقت واحد على الأكثر جدولة. جرّب عدة مرات ولاحظ التنظيف.

اكتب في الحقل ثم اضغط فورًا «Unmount the component». unmount ينظّف Effect آخر تصيير؛ هنا يلغي آخر مؤقت قبل أن يُطلق.

أخيرًا علّق دالة التنظيف حتى لا تُلغى المؤقتات. اكتب `abcde` بسرعة. ماذا تتوقع بعد ثلاث ثوانٍ؟ هل `console.log(text)` داخل المؤقت يطبع *آخر* `text` فينتج خمس رسائل `abcde`؟ جرّب!

بعد ثلاث ثوانٍ ترى تسلسلًا (`a`، `ab`، … `abcde`) لا خمس مرات `abcde`. **كل Effect «يلتقط» قيمة `text` من تصييره.** تغيّر `text` لا يغيّر ما يراه Effect من تصيير `text = 'ab'` — دائمًا `'ab'`. Effects من تصييرات مختلفة معزولة. للتفاصيل: [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures).

<DeepDive>

#### لكل تصيير Effects خاصة به {/*each-render-has-its-own-effects*/}

يمكنك اعتبار `useEffect` ربطًا لسلوك بناتج التصيير. Effect مثل:

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to {roomId}!</h1>;
}
```

لنرَ ما يحدث عند تنقّل المستخدم.

#### التصيير الأول {/*initial-render*/}

المستخدم يزور `<ChatRoom roomId="general" />`. [عوّض ذهنيًا](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `roomId` بـ `'general'`:

```js
  // JSX for the first render (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

**Effect جزء *أيضًا* من ناتج التصيير.** Effect التصيير الأول يصبح:

```js
  // Effect for the first render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the first render (roomId = "general")
  ['general']
```

React يشغّل Effect فيتصل بغرفة `'general'`.

#### إعادة تصيير بنفس التبعيات {/*re-render-with-same-dependencies*/}

لنفترض إعادة تصيير `<ChatRoom roomId="general" />`. JSX كما هو:

```js
  // JSX for the second render (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

React يرى أن الناتج لم يتغيّر فلا يحدّث DOM.

Effect التصيير الثاني:

```js
  // Effect for the second render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the second render (roomId = "general")
  ['general']
```

React يقارن `['general']` بالتصييرين. **بما أن التبعيات متطابقة، React *يتجاهل* Effect التصيير الثاني.** لا يُستدعى.

#### إعادة تصيير بتبعيات مختلفة {/*re-render-with-different-dependencies*/}

ثم `<ChatRoom roomId="travel" />`. JSX مختلف:

```js
  // JSX for the third render (roomId = "travel")
  return <h1>Welcome to travel!</h1>;
```

React يحدّث DOM من `"Welcome to general"` إلى `"Welcome to travel"`.

Effect التصيير الثالث:

```js
  // Effect for the third render (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the third render (roomId = "travel")
  ['travel']
```

React يقارن `['travel']` مع `['general']`. تبعية مختلفة: `Object.is('travel', 'general')` هو `false`، فلا يمكن تخطي Effect.

**قبل تطبيق Effect التصيير الثالث، React ينظّف آخر Effect *نُفِّذ*.** Effect التصيير الثاني تُخطّى، فينظّف Effect التصيير الأول. تنظيفه يستدعي `disconnect()` على الاتصال من `createConnection('general')`، فينقطع عن `'general'`.

ثم يشغّل React Effect التصيير الثالث فيتصل بـ `'travel'`.

#### عند إزالة المكوّن {/*unmount*/}

أخيرًا يغادر المستخدم فيُزال `ChatRoom`. React يشغّل تنظيف آخر Effect (من التصيير الثالث) فيُدمَّر اتصال `createConnection('travel')`، فينقطع عن `'travel'`.

#### سلوكيات التطوير فقط {/*development-only-behaviors*/}

مع تفعيل [Strict Mode](/reference/react/StrictMode)، يعيد React mount كل مكوّن مرة بعد mount (الحالة وDOM تُحفظ). هذا [يساعد على اكتشاف Effects التي تحتاج تنظيفًا](#step-3-add-cleanup-if-needed) ويكشف سباقات مبكرًا. كذلك قد يُعاد mount عند حفظ ملف في التطوير. كل ذلك للتطوير فقط.

</DeepDive>

<Recap>

- بخلاف الأحداث، Effects ناتجة عن التصيير نفسه لا عن تفاعل محدد.
- Effects تمكّن مزامنة المكوّن مع نظام خارجي (واجهة طرف ثالث، شبكة، إلخ).
- افتراضيًا، Effects بعد كل تصيير (بما فيه الأول).
- React يتخطى Effect إن كانت كل التبعيات كقيم التصيير السابق.
- لا يمكنك «اختيار» التبعيات؛ يحددها كود داخل Effect.
- مصفوفة تبعيات فارغة (`[]`) تقابل مرحلة mount، أي إضافة المكوّن للشاشة.
- في Strict Mode، mount مرتين (التطوير فقط!) لاختبار Effects.
- إن كسر إعادة mount التأثير الخاص بك، نفّذ دالة تنظيف.
- React يستدعي التنظيف قبل تشغيل Effect التالي، وعند unmount.

</Recap>

<Challenges>

#### تركيز حقل عند mount {/*focus-a-field-on-mount*/}

النموذج يصيّر `<MyInput />`.

استخدم [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) ليجذب `MyInput` التركيز عند الظهور. يوجد تنفيذ معلّق لا يعمل؛ اكتشف السبب وأصلحه. (إن كنت تعرف `autoFocus` فتجاهله؛ نعيد بناء الوظيفة يدويًا.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: This doesn't quite work. Fix it.
  // ref.current.focus()

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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


للتحقق: اضغط «Show form» وتأكد أن الحقل يستقبل التركيز (تمييز ومؤشر داخله). «Hide form» ثم «Show form» مرة أخرى وتأكد من التركيز.

`MyInput` يجب أن يركّز _عند mount_ فقط لا بعد كل تصيير. اضغط «Show form» ثم كرّر «Make it uppercase» — النقر على المربع _لا_ يجب أن يركّز الحقل فوقه.

<Solution>

استدعاء `ref.current.focus()` أثناء التصيير خطأ لأنه *أثر جانبي*. الآثار إما في معالج حدث أو في `useEffect`. هنا السبب _ظهور_ المكوّن لا تفاعل محدد، فـ Effect مناسب.

لفّ `ref.current.focus()` في `useEffect`، وأضف `[]` فارغة ليعمل عند mount فقط لا بعد كل تصيير.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

</Solution>

#### تركيز حقل بشكل مشروط {/*focus-a-field-conditionally*/}

النموذج يصيّر `<MyInput />` مرتين.

بعد «Show form» يلتقط الحقل الثاني التركيز لأن كليهما يستدعي `focus()`؛ آخر استدعاء «يفوز».

أردنا تركيز الحقل الأول. الأول يستقبل `shouldFocus={true}`. عدّل المنطق ليستدعي `focus()` فقط إذا كانت `shouldFocus` لـ `MyInput` هي `true`.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: call focus() only if shouldFocus is true.
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

للتحقق: كرّر «Show form» و«Hide form». عند الظهور يجب أن يلتقط *الأول* التركيز لأن الأب يمرّر `shouldFocus={true}` للأول و`false` للثاني. تأكد أن الحقلين يقبلان الكتابة.

<Hint>

لا تعلن Effect بشكل مشروط، لكن يمكن أن يحتوي Effect على منطق مشروط.

</Hint>

<Solution>

ضع الشرط داخل Effect. أضف `shouldFocus` للتبعيات لأنك تستخدمه داخل Effect. (إن تغيّرت من `false` إلى `true` سيركّز بعد mount.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

</Solution>

#### إصلاح فاصل زمني يُطلق مرتين {/*fix-an-interval-that-fires-twice*/}

`Counter` يعرض عدّادًا يزيد كل ثانية. عند mount يستدعي [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) فيُشغَّل `onTick` كل ثانية ويزيد العدّاد.

لكنه يزيد مرتين في الثانية لا مرة. لماذا؟ اعثر على السبب وأصلحه.

<Hint>

`setInterval` يعيد معرفًا يمكن تمريره إلى [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) لإيقاف الفاصل.

</Hint>

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
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

<Solution>

مع تفعيل [Strict Mode](/reference/react/StrictMode) (كما في Sandpack هنا)، يعيد React mount المكوّن مرة في التطوير، فيُنشأ الفاصل مرتين فيزيد العدّاد مرتين في الثانية.

سلوك React ليس *سبب* الخطأ؛ الخطأ في الكود أصلًا، وReact يبرزه. السبب الحقيقي أن Effect يبدأ عملية بلا تنظيف.

احفظ معرف الفاصل من `setInterval` ونفّذ تنظيفًا بـ [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
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

في التطوير يعيد React mount مرة للتحقق من التنظيف: `setInterval` ثم `clearInterval` ثم `setInterval`. في الإنتاج استدعاء `setInterval` واحد. للمستخدم: زيادة مرة في الثانية في الحالتين.

</Solution>

#### إصلاح الجلب داخل Effect {/*fix-fetching-inside-an-effect*/}

يعرض السيرة للشخص المختار. يحمّلها بـ `fetchBio(person)` عند mount وعند تغيّر `person`. الدالة غير المتزامنة تعيد [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) تُحلّ إلى نص؛ عند الانتهاء يستدعي `setBio` لعرضه تحت القائمة.

<Sandpack>

{/* not the most efficient, but this validation is enabled in the linter only, so it's fine to ignore it here since we know what we're doing */}
```js {expectedErrors: {'react-compiler': [9]}} src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
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


يوجد خطأ. اختر «Alice» ثم «Bob» ثم فورًا «Taylor». بسرعة كافية ترى Taylor مختارة لكن الفقرة تعرض سيرة Bob.

لماذا؟ أصلح Effect.

<Hint>

إن جلب Effect بيانات بشكل غير متزامن فغالبًا يحتاج تنظيفًا.

</Hint>

<Solution>

لتكرار الخطأ بالترتيب:

- اختيار `'Bob'` يطلق `fetchBio('Bob')`
- اختيار `'Taylor'` يطلق `fetchBio('Taylor')`
- **اكتمال جلب `'Taylor'` *قبل* جلب `'Bob'`**
- Effect تصيير `'Taylor'` يستدعي `setBio('This is Taylor’s bio')`
- يكتمل جلب `'Bob'`
- Effect تصيير `'Bob'` يستدعي `setBio('This is Bob’s bio')`

لذلك تظهر سيرة Bob رغم اختيار Taylor. يُسمى [race condition](https://en.wikipedia.org/wiki/Race_condition) لأن عمليتين تتسابقان وقد تصلان بترتيب غير متوقع.

أضف تنظيفًا:

<Sandpack>

{/* not the most efficient, but this validation is enabled in the linter only, so it's fine to ignore it here since we know what we're doing */}
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

لكل Effect متغير `ignore` خاص. في البداية `false`؛ عند تنظيف Effect (مثل اختيار شخص آخر) يصبح `true`. ترتيب اكتمال الطلبات لا يهم: آخر Effect نشط يبقي `ignore` عند `false` فيستدعي `setBio(result)`. Effects السابقة مُنظَّفة فـ `if (!ignore)` يمنع `setBio`:

- اختيار `'Bob'` يطلق `fetchBio('Bob')`
- اختيار `'Taylor'` يطلق `fetchBio('Taylor')` **وينظّف Effect Bob السابق**
- يكتمل جلب `'Taylor'` *قبل* جلب `'Bob'`
- Effect `'Taylor'` يستدعي `setBio('This is Taylor’s bio')`
- يكتمل جلب `'Bob'`
- Effect `'Bob'` **لا يفعل شيئًا لأن `ignore` أصبح `true`**

إلى جانب تجاهل نتيجة قديمة، يمكن [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) لإلغاء الطلبات غير اللازمة، لكنه وحده لا يكفي إن تتابعت خطوات غير متزامنة بعد الجلب؛ لذلك العلم `ignore` موثوق لهذه المشكلة.

</Solution>

</Challenges>
