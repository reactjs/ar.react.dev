---
title: إزالة تبعيات التأثير
---

<Intro>

عند كتابة تأثير، يتحقق المُدقِّق من أنك أدرجت كل قيمة تفاعلية (مثل الخصائص والحالة) يقرأها التأثير في قائمة تبعياته. هذا يضمن بقاء التأثير متزامناً مع أحدث الخصائص والحالة لمكوّنك. التبعيات غير الضرورية قد تجعل التأثير يعمل كثيراً، أو تخلق حلقة لا نهائية. اتبع هذا الدليل لمراجعة وإزالة التبعيات غير الضرورية من تأثيراتك.

</Intro>

<YouWillLearn>

- كيف تصلح حلقات تبعيات التأثير اللانهائية
- ماذا تفعل عندما تريد إزالة تبعية
- كيف تقرأ قيمة من التأثير دون «التفاعل» معها
- كيف ولماذا تتجنّب تبعيات الكائنات والدوال
- لماذا كتم مُدقِّق التبعيات خطير، وماذا تفعل بدلاً من ذلك

</YouWillLearn>

## يجب أن تطابق التبعيات الشيفرة {/*dependencies-should-match-the-code*/}

عند كتابة تأثير، تحدّد أولاً كيفية [البدء والإيقاف](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) لما تريد أن يفعله تأثيرك:

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

ثم، إن تركت تبعيات التأثير فارغة (`[]`)، يقترح المُدقِّق التبعيات الصحيحة:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Fix the mistake here!
  return <h1>Welcome to the {roomId} room!</h1>;
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

املأها وفق ما يقوله المُدقِّق:

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

[التأثيرات «تتفاعل» مع القيم التفاعلية.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) وبما أن `roomId` قيمة تفاعلية (قد تتغيّر بسبب إعادة التصيير)، يتحقق المُدقِّق من أنك حدّدتها كتبعية. إن استلمت `roomId` قيمة مختلفة، يعيد React مزامنة تأثيرك. وهذا يضمن بقاء المحادثة متصلة بالغرفة المختارة وتتفاعل مع القائمة المنسدلة:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  return <h1>Welcome to the {roomId} room!</h1>;
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

### لإزالة تبعية، أثبت أنها ليست تبعية {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

لاحظ أنك لا تستطيع «اختيار» تبعيات تأثيرك. كل <CodeStep step={2}>قيمة تفاعلية</CodeStep> تستخدمها شيفرة التأثير يجب أن تُعلَن في قائمة التبعيات. تُحدَّد قائمة التبعيات بالشيفرة المحيطة:

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // This is a reactive value
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads that reactive value
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ So you must specify that reactive value as a dependency of your Effect
  // ...
}
```

[القيم التفاعلية](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) تشمل الخصائص وكل المتغيرات والدوال المعرّفة مباشرة داخل مكوّنك. وبما أن `roomId` تفاعلي، لا يمكنك حذفه من قائمة التبعيات. المُدقِّق لن يسمح:

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'roomId'
  // ...
}
```

والمُدقِّق على حق! وبما أن `roomId` قد يتغيّر مع الزمن، هذا يدخل علة في شيفرتك.

**لإزالة تبعية، «أثبت» للمُدقِّق أنها *لا تحتاج* إلى أن تكون تبعية.** مثلاً، انقل `roomId` خارج المكوّن لتثبت أنه ليس تفاعلياً ولن يتغيّر عند إعادة التصيير:

```js {2,9}
const serverUrl = 'https://localhost:1234';
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

وبما أن `roomId` لم يعد تفاعلياً (ولا يمكن أن يتغيّر عند إعادة التصيير)، لا يحتاج إلى أن يكون تبعية:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
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

لذلك يمكنك الآن تحديد [قائمة تبعيات فارغة (`[]`).](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) تأثيرك *لا يعتمد فعلاً* على أي قيمة تفاعلية بعد الآن، فلا *يحتاج فعلاً* إلى إعادة التشغيل عند تغيّر خصائص أو حالة المكوّن.

### لتغيير التبعيات، غيّر الشيفرة {/*to-change-the-dependencies-change-the-code*/}

ربما لاحظت نمطاً في سير عملك:

1. أولاً **تغيّر شيفرة** التأثير أو كيف تُعرَف القيم التفاعلية.
2. ثم تتبع المُدقِّق وتضبط التبعيات لت**طابق الشيفرة التي غيّرتها.**
3. إن لم ترضَ عن قائمة التبعيات، **عد إلى الخطوة الأولى** (وغيّر الشيفرة من جديد).

الجزء الأخير مهم. **إن أردت تغيير التبعيات، غيّر الشيفرة المحيطة أولاً.** يمكنك اعتبار قائمة التبعيات [قائمة بكل القيم التفاعلية التي تستخدمها شيفرة التأثير.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) لا *تختار* ما تضعه في القائمة. القائمة *تصف* شيفرتك. لتغيير قائمة التبعيات، غيّر الشيفرة.

قد يشعرك هذا بحل معادلة. قد تبدأ بهدف (مثلاً إزالة تبعية) وتحتاج إلى «إيجاد» الشيفرة التي تحققه. ليس الجميع يستمتع بحل المعادلات، ويمكن قول مثل ذلك عن كتابة التأثيرات! لحسن الحظ، توجد وصفات شائعة يمكنك تجربتها أدناه.

<Pitfall>

إن كان لديك قاعدة شيفرة قائمة، قد تجد تأثيرات تكتم المُدقِّق هكذا:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**عندما لا تطابق التبعيات الشيفرة، خطر إدخال العلل مرتفع جداً.** بكتم المُدقِّق، «تكذب» على React بشأن القيم التي يعتمد عليها تأثيرك.

استخدم بدلاً من ذلك التقنيات أدناه.

</Pitfall>

<DeepDive>

#### لماذا كتم مُدقِّق التبعيات خطير؟ {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

كتم المُدقِّق يؤدي إلى علل غير بديهية يصعب العثور عليها وإصلاحها. إليك مثالاً:

<Sandpack>

```js {expectedErrors: {'react-compiler': [14]}}
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

لنقل أردت تشغيل التأثير «عند التثبيت فقط». قرأت أن [تبعيات فارغة (`[]`)](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) تفعل ذلك، فقررت تجاهل المُدقِّق وفرضت `[]` كتبعيات.

كان المفترض أن يزداد العداد كل ثانية بالمقدار القابل للضبط بالزرّين. لكن بما أنك «كذبت» على React بأن التأثير لا يعتمد على شيء، يبقى React يستخدم دالة `onTick` من التصيير الأول إلى الأبد. [في ذلك التصيير](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) كان `count` هو `0` و`increment` هو `1`. لذلك تستدعي `onTick` من ذلك التصيير دائماً `setCount(0 + 1)` كل ثانية، وترى دائماً `1`. مثل هذه العلل أصعب إصلاحها عندما تنتشر بين عدة مكوّنات.

يوجد دائماً حل أفضل من تجاهل المُدقِّق! لإصلاح هذه الشيفرة، أضف `onTick` إلى قائمة التبعيات. (لضمان إعداد الفترة مرة واحدة فقط، [اجعل `onTick` حدث تأثير Effect Event.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events))

**ننصحك باعتبار خطأ lint للتبعيات كخطأ تجميع. إن لم تكتم المُدقِّق، لن ترى مثل هذه العلل.** بقية الصفحة توثّق البدائل لهذه الحالات وغيرها.

</DeepDive>

## إزالة التبعيات غير الضرورية {/*removing-unnecessary-dependencies*/}

في كل مرة تضبط فيها تبعيات التأثير لتعكس الشيفرة، انظر إلى قائمة التبعيات. هل من المنطقي أن يعاد تشغيل التأثير عند تغيّر أي منها؟ أحياناً الجواب «لا»:

* قد تريد إعادة تنفيذ *أجزاء مختلفة* من التأثير في ظروف مختلفة.
* قد تريد قراءة *أحدث قيمة* لتبعية ما دون «التفاعل» مع تغيّراتها.
* قد تتغيّر تبعية كثيراً *دون قصد* لأنها كائن أو دالة.

لإيجاد الحل الصحيح، ستحتاج إلى الإجابة عن أسئلة عن تأثيرك. لنمرّ عليها.

### هل ينبغي نقل هذه الشيفرة إلى معالج حدث؟ {/*should-this-code-move-to-an-event-handler*/}

أول ما ينبغي أن تفكر فيه: هل ينبغي أن تكون هذه الشيفرة تأثيراً أصلاً؟

تخيّل نموذجاً. عند الإرسال، تضبط متغير الحالة `submitted` إلى `true`. تحتاج إلى إرسال طلب POST وعرض إشعار. وضعت هذا المنطق داخل تأثير «يتفاعل» مع كون `submitted` هو `true`:

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('Successfully registered!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

لاحقاً، تريد تنسيق رسالة الإشعار حسب السمة الحالية، فتقرأ السمة الحالية. وبما أن `theme` معرّف في جسم المكوّن، فهو تفاعلي، فتضيفه كتبعية:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ All dependencies declared

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

بهذا أدخلت علة. تخيّل أنك أرسلت النموذج أولاً ثم بدّلت بين السمة الداكنة والفاتحة. ستتغيّر `theme`، فيعاد تشغيل التأثير، فيُعرض نفس الإشعار مرة أخرى!

**المشكلة هنا أن هذا لا ينبغي أن يكون تأثيراً أصلاً.** تريد إرسال POST وعرض الإشعار استجابةً *لإرسال النموذج،* وهو تفاعل محدد. لتشغيل شيفرة استجابةً لتفاعل محدد، ضع المنطق مباشرة في معالج الحدث المناسب:

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Good: Event-specific logic is called from event handlers
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }  

  // ...
}
```

وبما أن الشيفرة في معالج حدث، فليست تفاعلية—فتعمل فقط عند إرسال المستخدم للنموذج. اقرأ المزيد عن [الاختيار بين معالجات الأحداث والتأثيرات](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) و[كيف تحذف التأثيرات غير الضرورية.](/learn/you-might-not-need-an-effect)

### هل يفعل تأثيرك عدة أشياء غير مرتبطة؟ {/*is-your-effect-doing-several-unrelated-things*/}

السؤال التالي: هل يفعل تأثيرك عدة أشياء غير مرتبطة؟

تخيّل أنك تنشئ نموذج شحن يحتاج فيه المستخدم إلى اختيار مدينته ومنطقته. تجلب قائمة `cities` من الخادم حسب `country` المختار لتعرضها في قائمة منسدلة:

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]); // ✅ All dependencies declared

  // ...
```

هذا مثال جيّد لـ[جلب البيانات في تأثير.](/learn/you-might-not-need-an-effect#fetching-data) تزامن حالة `cities` مع الشبكة حسب خاصية `country`. لا يمكنك فعل هذا في معالج حدث لأنك تحتاج الجلب بمجرد عرض `ShippingForm` وكلما تغيّر `country` (بغض النظر عن التفاعل الذي سبب ذلك).

لنقل تضيف صندوق اختيار ثانياً لمناطق المدينة، يجب أن يجلب `areas` للمدينة المختارة حالياً `city`. قد تبدأ بإضافة استدعاء `fetch` ثانٍ لقائمة المناطق داخل نفس التأثير:

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 Avoid: A single Effect synchronizes two independent processes
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ All dependencies declared

  // ...
```

لكن بما أن التأثير يستخدم الآن متغير الحالة `city`، اضطررت إلى إضافة `city` إلى التبعيات. وهذا أدخل مشكلة: عند اختيار مدينة أخرى، يعاد تشغيل التأثير ويستدعي `fetchCities(country)`. النتيجة إعادة جلب قائمة المدن كثيراً دون داعٍ.

**مشكلة هذه الشيفرة أنك تزامن شيئين مختلفين غير مرتبطين:**

1. تريد مزامنة حالة `cities` مع الشبكة حسب خاصية `country`.
1. تريد مزامنة حالة `areas` مع الشبكة حسب حالة `city`.

قسّم المنطق إلى تأثيرين، كل منهما يتفاعل مع الخاصية التي يحتاج للمزامنة معها:

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]); // ✅ All dependencies declared

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]); // ✅ All dependencies declared

  // ...
```

الآن يعاد تشغيل التأثير الأول فقط إذا تغيّر `country`، بينما يعاد تشغيل الثاني عند تغيّر `city`. فصلتهما حسب الغرض: شيئان مختلفان يزامنهما تأثيران منفصلان. لتأثيرين منفصلين قائمتان تبعيتان منفصلتان، فلا يطلق أحدهما الآخر عن غير قصد.

الشيفرة النهائية أطول من الأصل، لكن تقسيم التأثيرين ما زال صحيحاً. [كل تأثير ينبغي أن يمثل عملية مزامنة مستقلة.](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) في هذا المثال، حذف أحد التأثيرين لا يكسر منطق الآخر. أي أنهما *يزامنان أشياء مختلفة،* فمن الجيد فصلهما. إن قلقك من التكرار، حسّن الشيفرة بـ[استخراج المنطق المتكرر إلى خطاف مخصّص.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

### هل تقرأ حالة لحساب الحالة التالية؟ {/*are-you-reading-some-state-to-calculate-the-next-state*/}

يحدّث هذا التأثير متغير الحالة `messages` بمصفوفة جديدة في كل مرة تصل رسالة جديدة:

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

يستخدم متغير `messages` لـ[إنشاء مصفوفة جديدة](/learn/updating-arrays-in-state) تبدأ بكل الرسائل القائمة ويضيف الرسالة الجديدة في النهاية. لكن بما أن `messages` قيمة تفاعلية يقرأها التأثير، يجب أن تكون تبعية:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ All dependencies declared
  // ...
```

وجعل `messages` تبعية يخلق مشكلة.

في كل مرة تصل فيها رسالة، يتسبب `setMessages()` في إعادة تصيير المكوّن بمصفوفة `messages` جديدة تتضمن الرسالة المستلمة. لكن بما أن التأثير يعتمد الآن على `messages`، فسيُعاد أيضاً *مزامنة* التأثير. فيعيد كل رسالة جديدة اتصال المحادثة. المستخدم لا يريد ذلك!

لإصلاح المشكلة، لا تقرأ `messages` داخل التأثير. بدلاً من ذلك، مرّر [دالة تحديث](/reference/react/useState#updating-state-based-on-the-previous-state) إلى `setMessages`:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

**لاحظ أن تأثيرك لا يقرأ متغير `messages` إطلاقاً الآن.** تحتاج فقط إلى تمرير دالة تحديث مثل `msgs => [...msgs, receivedMessage]`. React [يضع دالة التحديث في طابور](/learn/queueing-a-series-of-state-updates) ويزوّدها بالوسيط `msgs` أثناء التصيير التالي. لذلك لا يحتاج التأثير نفسه إلى الاعتماد على `messages` بعد الآن. نتيجة هذا الإصلاح، استلام رسالة محادثة لن يجعل المحادثة تعيد الاتصال.

### هل تريد قراءة قيمة دون «التفاعل» مع تغيّراتها؟ {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

لنقل تريد تشغيل صوت عند استلام المستخدم رسالة جديدة ما لم يكن `isMuted` هو `true`:

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

وبما أن التأثير يستخدم الآن `isMuted` في شيفرته، يجب إضافته إلى التبعيات:

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ All dependencies declared
  // ...
```

المشكلة أنه في كل مرة يتغيّر فيها `isMuted` (مثلاً عند الضغط على مفتاح «Muted»)، يعيد التأثير المزامنة ويعيد الاتصال بالمحادثة. هذا ليس تجربة المستخدم المرغوبة! (في هذا المثال، حتى تعطيل المُدقِّق لا يعمل—إن فعلت، يبقى `isMuted` «عالقاً» بقيمته القديمة.)

لحل المشكلة، استخرج المنطق الذي لا ينبغي أن يكون تفاعلياً من التأثير. لا تريد لهذا التأثير أن «يتفاعل» مع تغيّرات `isMuted`. [انقل هذا الجزء غير التفاعلي إلى حدث تأثير Effect Event:](/learn/separating-events-from-effects#declaring-an-effect-event)

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

أحداث التأثير Effect Events تتيح تقسيم التأثير إلى أجزاء تفاعلية (ينبغي أن «تتفاعل» مع قيم مثل `roomId` وتغيّراتها) وأجزاء غير تفاعلية (تقرأ أحدث قيمها فقط، كما يقرأ `onMessage` قيمة `isMuted`). **وبما أنك تقرأ `isMuted` داخل حدث تأثير، لا يحتاج إلى أن يكون تبعية لتأثيرك.** النتيجة: لن تعيد المحادثة الاتصال عند تبديل إعداد «Muted»، فيُحلّ السلوك الأصلي!

#### لف معالج حدث من الخصائص {/*wrapping-an-event-handler-from-the-props*/}

قد تواجه مشكلة مماثلة عندما يستلم مكوّنك معالج حدث كخاصية:

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ All dependencies declared
  // ...
```

لنقل أن المكوّن الأب يمرّر دالة `onReceiveMessage` *مختلفة* في كل تصيير:

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

وبما أن `onReceiveMessage` تبعية، ستسبب إعادة مزامنة التأثير بعد كل إعادة تصيير للأب. فيعيد الاتصال بالمحادثة. لحل ذلك، لفّ الاستدعاء في حدث تأثير:

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

أحداث التأثير ليست تفاعلية، فلا تحتاج إلى ذكرها كتبعيات. النتيجة: لن تعيد المحادثة الاتصال حتى لو مرّر الأب دالة مختلفة في كل إعادة تصيير.

#### فصل الشيفرة التفاعلية عن غير التفاعلية {/*separating-reactive-and-non-reactive-code*/}

في هذا المثال، تريد تسجيل زيارة في كل مرة يتغيّر فيها `roomId`. تريد تضمين `notificationCount` الحالي مع كل سجل، لكنك *لا* تريد أن يطلق تغيّر `notificationCount` حدث تسجيل إضافياً.

الحل مرة أخرى هو استخراج الشيفرة غير التفاعلية إلى حدث تأثير:

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

تريد منطقك أن يتفاعل مع `roomId`، فتقرأ `roomId` داخل التأثير. لكنك لا تريد أن يؤدي تغيّر `notificationCount` إلى تسجيل زيارة إضافية، فتقرأ `notificationCount` داخل حدث التأثير. [تعرّف أكثر على قراءة أحدث الخصائص والحالة من التأثيرات باستخدام أحداث التأثير.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

### هل تتغيّر قيمة تفاعلية دون قصد؟ {/*does-some-reactive-value-change-unintentionally*/}

أحياناً *تريد* أن «يتفاعل» تأثيرك مع قيمة معيّنة، لكنها تتغيّر أكثر مما تريد—ولا تعكس بالضرورة تغيّراً حقيقياً من منظور المستخدم. مثلاً، لنقل تنشئ كائن `options` في جسم مكوّنك، ثم تقرأه من داخل التأثير:

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

هذا الكائن معرّف في جسم المكوّن، فهو [قيمة تفاعلية.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) عندما تقرأ قيمة تفاعلية هكذا داخل تأثير، تعلنها كتبعية. هذا يضمن أن التأثير «يتفاعل» مع تغيّراتها:

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ All dependencies declared
  // ...
```

من المهم إعلانها كتبعية! هذا يضمن مثلاً أنه إن تغيّر `roomId`، يعيد تأثيرك الاتصال بالمحادثة بـ`options` الجديدة. لكن هناك أيضاً مشكلة في الشيفرة أعلاه. لرؤيتها، اكتب في الحقل في الـsandbox أدناه وراقب الـconsole:

<Sandpack>

```js {expectedErrors: {'react-compiler': [10]}}
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Temporarily disable the linter to demonstrate the problem
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

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

في الـsandbox أعلاه، الحقل يحدّث فقط متغير الحالة `message`. من منظور المستخدم، لا ينبغي أن يؤثر ذلك على اتصال المحادثة. لكن في كل مرة تحدّث فيها `message`، يُعاد تصيير مكوّنك. وعند إعادة التصيير، تعاد تشغيل الشيفرة داخله من البداية.

يُنشأ كائن `options` جديد من الصفر في كل إعادة تصيير لمكوّن `ChatRoom`. يرى React أن كائن `options` *مختلف* عن الكائن المُنشأ في التصيير السابق. لذلك يعيد مزامنة التأثير (الذي يعتمد على `options`)، فتعيد المحادثة الاتصال أثناء الكتابة.

**هذه المشكلة تصيب الكائنات والدوال فقط. في JavaScript، كل كائن ودالة يُنشآن حديثاً يُعتبران مختلفين عن غيرهما. لا يهم أن المحتوى قد يكون نفسه!**

```js {7-8}
// During the first render
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// During the next render
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// These are two different objects!
console.log(Object.is(options1, options2)); // false
```

**تبعيات الكائنات والدوال يمكن أن تجعل تأثيرك يعيد المزامنة أكثر من اللازم.**

لذلك، كلما أمكن، تجنّب جعل الكائنات والدوال تبعيات لتأثيرك. بدلاً من ذلك، انقلها خارج المكوّن أو داخل التأثير، أو استخرج منها قيماً أولية.

#### نقل كائنات ودوال ثابتة خارج المكوّن {/*move-static-objects-and-functions-outside-your-component*/}

إن لم يعتمد الكائن على خصائص أو حالة، انقله خارج المكوّن:

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

بهذا *تثبت* للمُدقِّق أنه ليس تفاعلياً. لا يمكن أن يتغيّر بسبب إعادة التصيير، فلا يحتاج إلى أن يكون تبعية. إعادة تصيير `ChatRoom` لن تعيد مزامنة التأثير الآن.

ينطبق الأمر على الدوال أيضاً:

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

وبما أن `createOptions` معرّفة خارج مكوّنك، فليست قيمة تفاعلية. لذلك لا تحتاج إلى أن تُذكر في تبعيات التأثير، ولن تسبب أبداً إعادة مزامنة غير مرغوبة.

#### نقل كائنات ودوال ديناميكية داخل التأثير {/*move-dynamic-objects-and-functions-inside-your-effect*/}

إن كان كائنك يعتمد على قيمة تفاعلية قد تتغيّر بإعادة التصيير، مثل خاصية `roomId`، لا يمكنك سحبه *خارج* المكوّن. لكن يمكنك نقل إنشائه *داخل* شيفرة التأثير:

```js {7-10,11,14}
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
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

وبما أن `options` أصبح معلناً داخل التأثير، لم يعد تبعية للتأثير. القيمة التفاعلية الوحيدة التي يستخدمها التأثير هي `roomId`. وبما أن `roomId` ليس كائناً ولا دالة، يمكنك التأكد أنه لن يختلف *دون قصد*. في JavaScript، تُقارن الأعداد والسلاسل بمحتواها:

```js {7-8}
// During the first render
const roomId1 = 'music';

// During the next render
const roomId2 = 'music';

// These two strings are the same!
console.log(Object.is(roomId1, roomId2)); // true
```

بفضل هذا الإصلاح، لا تعيد المحادثة الاتصال عند تعديل الحقل:

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

لكنه *يعيد* الاتصال عند تغيّر قائمة `roomId` المنسدلة، كما تتوقع.

ينطبق على الدوال أيضاً:

```js {7-12,14}
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
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

يمكنك كتابة دوالك الخاصة لتجميع أجزاء المنطق داخل التأثير. ما دمت تعرّفها *داخل* التأثير أيضاً، فليست قيماً تفاعلية، ولا تحتاج إلى أن تكون تبعيات.

#### قراءة قيم أولية من الكائنات {/*read-primitive-values-from-objects*/}

أحياناً تستلم كائناً من الخصائص:

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ All dependencies declared
  // ...
```

الخطر هنا أن المكوّن الأب قد ينشئ الكائن أثناء التصيير:

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

هذا يجعل تأثيرك يعيد الاتصال في كل إعادة تصيير للأب. لإصلاحه، اقرأ المعلومات من الكائن *خارج* التأثير، وتجنّب تبعيات الكائنات والدوال:

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```

يصبح المنطق مكرراً قليلاً (تقرأ قيماً من كائن خارج التأثير، ثم تنشئ كائناً بنفس القيم داخل التأثير). لكنه يجعل ما يعتمد عليه التأثير *فعلاً* صريحاً جداً. إن أعاد الأب إنشاء الكائن دون قصد، لن تعيد المحادثة الاتصال. أما إن كان `options.roomId` أو `options.serverUrl` مختلفين فعلاً، فستعيد الاتصال.

#### حساب قيم أولية من الدوال {/*calculate-primitive-values-from-functions*/}

ينفع نفس النهج مع الدوال. مثلاً، لنقل يمرّر الأب دالة:

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

لتجنّب جعلها تبعية (وما يسببه من إعادة اتصال عند إعادة التصيير)، استدعها خارج التأثير. يعطيك ذلك قيم `roomId` و`serverUrl` ليستا كائنين، ويمكنك قراءتهما من داخل التأثير:

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```

هذا ينفع مع [الدوال النقية](/learn/keeping-components-pure) لأن استدعاءها آمناً أثناء التصيير. إن كانت دالتك معالج حدث، لكنك لا تريد أن تغيّراتها تعيد مزامنة التأثير، [لفّها في حدث تأثير بدلاً من ذلك.](#do-you-want-to-read-a-value-without-reacting-to-its-changes)

<Recap>

- يجب أن تطابق التبعيات الشيفرة دائماً.
- إن لم ترضَ عن تبعياتك، فما تحتاج تعديله هو الشيفرة.
- كتم المُدقِّق يؤدي إلى علل مربكة، وتجنّبه دائماً أفضل.
- لإزالة تبعية، «أثبت» للمُدقِّق أنها غير لازمة.
- إن كان ينبغي تشغيل شيفرة استجابةً لتفاعل محدد، انقلها إلى معالج حدث.
- إن كان أجزاء مختلفة من التأثير يجب أن تعاد لأسباب مختلفة، قسّمه إلى عدة تأثيرات.
- إن أردت تحديث حالة بناءً على الحالة السابقة، مرّر دالة تحديث.
- إن أردت قراءة أحدث قيمة دون «التفاعل» معها، استخرج حدث تأثير من التأثير.
- في JavaScript، تُعتبر الكائنات والدوال مختلفة إذا أُنشئت في أوقات مختلفة.
- تجنّب تبعيات الكائنات والدوال قدر الإمكان. انقلها خارج المكوّن أو داخل التأثير.

</Recap>

<Challenges>

#### إصلاح فترة تُعاد إنشاؤها {/*fix-a-resetting-interval*/}

يضبط هذا التأثير فترة تدق كل ثانية. لاحظت شيئاً غريباً: يبدو أن الفترة تُدمَر وتُعاد إنشاؤها في كل دقة. أصلح الشيفرة حتى لا تُعاد إنشاء الفترة باستمرار.

<Hint>

يبدو أن شيفرة التأثير تعتمد على `count`. هل هناك طريقة لعدم الحاجة إلى هذه التبعية؟ ينبغي أن يكون بإمكانك تحديث حالة `count` بناءً على قيمتها السابقة دون إضافة تبعية عليها.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

<Solution>

تريد تحديث حالة `count` لتصبح `count + 1` من داخل التأثير. لكن هذا يجعل التأثير يعتمد على `count`، الذي يتغيّر مع كل دقة، ولهذا تُعاد إنشاء الفترة في كل دقة.

لحل ذلك، استخدم [دالة التحديث](/reference/react/useState#updating-state-based-on-the-previous-state) واكتب `setCount(c => c + 1)` بدلاً من `setCount(count + 1)`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, []);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

بدلاً من قراءة `count` داخل التأثير، تمرّر تعليمات `c => c + 1` («زاد هذا العدد!») إلى React. يطبّقها React في التصيير التالي. وبما أنك لم تعد تحتاج قراءة `count` داخل التأثير، يمكنك الإبقاء على تبعيات التأثير فارغة (`[]`). يمنع ذلك إعادة إنشاء الفترة في كل دقة.

</Solution>

#### إصلاح إعادة تشغيل الرسوم المتحركة {/*fix-a-retriggering-animation*/}

في هذا المثال، عند الضغط على «Show»، تظهر رسالة ترحيب بتأثير تلاشٍ. الرسوم تستغرق ثانية. عند «Remove»، تختفي الرسالة فوراً. منطق التلاشٍ منفّذ في `animation.js` كـ[حلقة رسوم](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) بJavaScript عادي. لا تحتاج تغيير ذلك. يمكنك اعتباره مكتبة طرف ثالث. يُنشئ تأثيرك مثيل `FadeInAnimation` لعقدة DOM، ثم يستدعي `start(duration)` أو `stop()` للتحكم. يتحكم منزلق في `duration`. حرّك المنزلق ولاحظ التغيير.

الشيفرة تعمل، لكن تريد تغييراً: حالياً، عند تحريك المنزلق الذي يتحكم في `duration`، تُعاد تشغيل الرسوم. غيّر السلوك بحيث لا «يتفاعل» التأثير مع `duration`. عند «Show»، يستخدم التأثير قيمة `duration` الحالية من المنزلق. لكن تحريك المنزلق وحده لا ينبغي أن يعيد تشغيل الرسوم من تلقاء نفسه.

<Hint>

هل هناك سطر في التأثير لا ينبغي أن يكون تفاعلياً؟ كيف تنقل الشيفرة غير التفاعلية خارج التأثير؟

</Hint>

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

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
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
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

<Solution>

يحتاج تأثيرك إلى قراءة أحدث قيمة `duration`، لكنك لا تريد أن «يتفاعل» مع تغيّراتها. تستخدم `duration` لبدء الرسوم، لكن بدء الرسوم ليس تفاعلياً. استخرج السطر غير التفاعلي إلى حدث تأثير، واستدعِه من التأثير.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
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
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
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
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
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

أحداث التأثير مثل `onAppear` ليست تفاعلية، فيمكنك قراءة `duration` داخلها دون إعادة تشغيل الرسوم.

</Solution>

#### إصلاح محادثة تعيد الاتصال {/*fix-a-reconnecting-chat*/}

في هذا المثال، في كل مرة تضغط فيها «Toggle theme»، تعيد المحادثة الاتصال. لماذا؟ أصلح الخطأ بحيث تعيد الاتصال فقط عند تعديل عنوان الخادم أو اختيار غرفة محادثة مختلفة.

اعتبر `chat.js` مكتبة طرف ثالث خارجية: يمكنك الرجوع إليها لفحص واجهتها، لكن لا تعدّلها.

<Hint>

هناك أكثر من طريقة للإصلاح، لكن المطلوب في النهاية تجنّب كائن كتبعية.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

يعاد تشغيل تأثيرك لأنه يعتمد على كائن `options`. قد تُعاد إنشاء الكائنات دون قصد، فتجنّبها كتبعيات كلما أمكن.

أقل تدخّل هو قراءة `roomId` و`serverUrl` مباشرة خارج التأثير، ثم جعل التأثير يعتمد على تلك القيم الأولية (التي لا تتغيّر دون قصد). داخل التأثير، أنشئ كائناً ومرّره إلى `createConnection`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

أفضل من ذلك استبدال خاصية الكائن `options` بالخصائص الأكثر تحديداً `roomId` و`serverUrl`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom
        roomId={roomId}
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

الالتزام بالخصائص الأولية حيثما أمكن يسهّل تحسين مكوّناتك لاحقاً.

</Solution>

#### إصلاح محادثة تعيد الاتصال، مرة أخرى {/*fix-a-reconnecting-chat-again*/}

يتصل هذا المثال بالمحادثة مع تشفير أو بدونه. بدّل مربع الاختيار ولاحظ رسائل الـconsole المختلفة عند التفعيل والإلغاء. جرّب تغيير الغرفة. ثم بدّل السمة. عند الاتصال بغرفة، تصل رسائل جديدة كل بضع ثوانٍ. تحقق أن لونها يطابق السمة التي اخترتها.

في هذا المثال، تعيد المحادثة الاتصال في كل مرة تحاول تغيير السمة. أصلح ذلك. بعد الإصلاح، تغيير السمة لا يعيد الاتصال، لكن تبديل التشفير أو تغيير الغرفة يعيدان الاتصال.

لا تغيّر شيفرة `chat.js`. عدا ذلك، يمكنك تغيير أي شيفرة طالما بقي السلوك نفسه. قد يفيدك تغيير الخصائص الممرّرة.

<Hint>

تمرّر دالتين: `onMessage` و`createConnection`. كلاهما يُنشآن من جديد في كل تصيير لـ`App`. تُعتبران قيمتين جديدتين في كل مرة، ولهذا يعيدان تشغيل التأثير.

إحدى الدالتين معالج حدث. هل تعرف طريقة لاستدعاء معالج حدث من التأثير دون «التفاعل» مع قيم الدالة الجديدة؟ سيفيدك ذلك!

الدالة الأخرى موجودة فقط لتمرير حالة إلى واجهة API مستوردة. هل هي ضرورية فعلاً؟ ما المعلومة الجوهرية الممرّرة؟ قد تحتاج نقل بعض الاستيرادات من `App.js` إلى `ChatRoom.js`.

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
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
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
      <ChatRoom
        roomId={roomId}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

هناك أكثر من حل صحيح، وهذا أحدها.

في المثال الأصلي، تبديل السمة أنشأ دالتين مختلفتين `onMessage` و`createConnection` ومرّرهما. وبما أن التأثير يعتمد على هاتين الدالتين، كانت المحادثة تعيد الاتصال في كل تبديل للسمة.

لمشكلة `onMessage`، يلزم لفّها في حدث تأثير:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

بخلاف خاصية `onMessage`، حدث التأثير `onReceiveMessage` ليس تفاعلياً. لذلك لا يحتاج أن يكون تبعية لتأثيرك. ونتيجة لذلك، تغيّرات `onMessage` لن تجعل المحادثة تعيد الاتصال.

لا يمكنك فعل الشيء نفسه مع `createConnection` لأنه *ينبغي* أن يكون تفاعلياً. *تريد* أن يعيد التأثير التشغيل إذا بدّل المستخدم بين اتصال مشفّر وغير مشفّر، أو إذا غيّر الغرفة الحالية. لكن بما أن `createConnection` دالة، لا يمكنك التحقق مما إذا كانت المعلومات التي تقرأها قد *تغيّرت فعلاً* أم لا. لحل ذلك، بدلاً من تمرير `createConnection` من مكوّن `App`، مرّر القيم الخام `roomId` و`isEncrypted`:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

الآن يمكنك نقل دالة `createConnection` *داخل* التأثير بدلاً من تمريرها من `App`:

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

بعد هذين التعديلين، لم يعد تأثيرك يعتمد على أي قيم دوال:

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Reactive values
  const onReceiveMessage = useEffectEvent(onMessage); // Not reactive

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Reading a reactive value
      };
      if (isEncrypted) { // Reading a reactive value
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ All dependencies declared
```

فالمحادثة تعيد الاتصال فقط عند تغيّر شيء ذي معنى (`roomId` أو `isEncrypted`):

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
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
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>
