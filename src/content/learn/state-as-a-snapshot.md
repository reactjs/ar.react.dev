---
title: الحالة كلقطة
---

<Intro>

قد تبدو متغيرات الحالة مثل متغيرات JavaScript العادية التي يمكنك القراءة منها والكتابة إليها. ومع ذلك، تتصرف الحالة أكثر مثل لقطة. تعيينها لا يغير متغير الحالة الذي لديك بالفعل، بل يؤدي بدلاً من ذلك إلى تشغيل إعادة تصيير.

</Intro>

<YouWillLearn>

* كيف يؤدي تعيين الحالة إلى تشغيل إعادة التصيير
* متى وكيف تتحدث الحالة
* لماذا لا تتحدث الحالة فورًا بعد تعيينها
* كيف تصل معالجات الأحداث إلى "لقطة" من الحالة

</YouWillLearn>

## تعيين الحالة يؤدي إلى التصيير {/*setting-state-triggers-renders*/}

قد تفكر في واجهة المستخدم الخاصة بك على أنها تتغير مباشرة استجابةً لحدث المستخدم مثل النقر. في React، يعمل الأمر بشكل مختلف قليلاً عن هذا النموذج الذهني. في الصفحة السابقة، رأيت أن [تعيين الحالة يطلب إعادة تصيير](/learn/render-and-commit#step-1-trigger-a-render) من React. هذا يعني أنه لكي تتفاعل الواجهة مع الحدث، تحتاج إلى *تحديث الحالة*.

في هذا المثال، عند الضغط على "إرسال"، يخبر `setIsSent(true)` React بإعادة تصيير واجهة المستخدم:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

إليك ما يحدث عند النقر على الزر:

1. ينفذ معالج الحدث `onSubmit`.
2. `setIsSent(true)` يعين `isSent` إلى `true` ويضع تصييرًا جديدًا في قائمة الانتظار.
3. يعيد React تصيير المكون وفقًا لقيمة `isSent` الجديدة.

دعنا نلقي نظرة فاحصة على العلاقة بين الحالة والتصيير.

## التصيير يأخذ لقطة في الوقت {/*rendering-takes-a-snapshot-in-time*/}

["التصيير"](/learn/render-and-commit#step-2-react-renders-your-components) يعني أن React يستدعي مكونك، وهو دالة. الـ JSX الذي ترجعه من تلك الدالة يشبه لقطة من واجهة المستخدم في الوقت. تم حساب props ومعالجات الأحداث والمتغيرات المحلية **باستخدام حالته في وقت التصيير.**

على عكس الصورة الفوتوغرافية أو إطار الفيلم، "لقطة" واجهة المستخدم التي ترجعها تفاعلية. إنها تتضمن منطقًا مثل معالجات الأحداث التي تحدد ما يحدث استجابة للمدخلات. يحدّث React الشاشة لتطابق هذه اللقطة ويربط معالجات الأحداث. ونتيجة لذلك، سيؤدي الضغط على زر إلى تشغيل معالج النقر من JSX الخاص بك.

عندما يعيد React تصيير مكون:

1. يستدعي React دالتك مرة أخرى.
2. ترجع دالتك لقطة JSX جديدة.
3. ثم يحدّث React الشاشة لتطابق اللقطة التي أرجعتها دالتك.

<IllustrationBlock sequential>
    <Illustration caption="React ينفذ الدالة" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="حساب اللقطة" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="تحديث شجرة DOM" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

كذاكرة المكون، الحالة ليست مثل متغير عادي يختفي بعد عودة دالتك. الحالة في الواقع "تعيش" في React نفسه - كما لو كانت على رف! - خارج دالتك. عندما يستدعي React مكونك، يعطيك لقطة من الحالة لذلك التصيير المحدد. يرجع مكونك لقطة من واجهة المستخدم مع مجموعة جديدة من props ومعالجات الأحداث في JSX الخاص به، وكلها محسوبة **باستخدام قيم الحالة من ذلك التصيير!**

<IllustrationBlock sequential>
  <Illustration caption="أنت تخبر React بتحديث الحالة" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React يحدّث قيمة الحالة" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React يمرر لقطة من قيمة الحالة إلى المكون" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

إليك تجربة صغيرة لتوضيح كيف يعمل هذا. في هذا المثال، قد تتوقع أن النقر على زر "+3" سيزيد العداد ثلاث مرات لأنه يستدعي `setNumber(number + 1)` ثلاث مرات.

انظر ماذا يحدث عند النقر على زر "+3":

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

لاحظ أن `number` يزداد مرة واحدة فقط لكل نقرة!

**تعيين الحالة يغيرها فقط للتصيير *التالي*.** خلال التصيير الأول، كانت `number` هي `0`. هذا هو السبب في أن قيمة `number` في معالج `onClick` *لذلك التصيير* لا تزال `0` حتى بعد استدعاء `setNumber(number + 1)`:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

إليك ما يخبر معالج النقر لهذا الزر React بفعله:

1. `setNumber(number + 1)`: `number` هي `0` لذا `setNumber(0 + 1)`.
    - يستعد React لتغيير `number` إلى `1` في التصيير التالي.
2. `setNumber(number + 1)`: `number` هي `0` لذا `setNumber(0 + 1)`.
    - يستعد React لتغيير `number` إلى `1` في التصيير التالي.
3. `setNumber(number + 1)`: `number` هي `0` لذا `setNumber(0 + 1)`.
    - يستعد React لتغيير `number` إلى `1` في التصيير التالي.

على الرغم من أنك استدعيت `setNumber(number + 1)` ثلاث مرات، في معالج الحدث *لهذا التصيير* `number` دائمًا `0`، لذا تعين الحالة إلى `1` ثلاث مرات. هذا هو السبب في أنه بعد انتهاء معالج الحدث، يعيد React تصيير المكون مع `number` مساوية لـ `1` بدلاً من `3`.

يمكنك أيضًا تصور هذا من خلال استبدال متغيرات الحالة ذهنيًا بقيمها في الكود الخاص بك. نظرًا لأن متغير الحالة `number` هو `0` *لهذا التصيير*، يبدو معالج الحدث الخاص به كما يلي:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

بالنسبة للتصيير التالي، `number` هي `1`، لذا يبدو معالج النقر *لذلك التصيير* كما يلي:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

هذا هو السبب في أن النقر على الزر مرة أخرى سيعين العداد إلى `2`، ثم إلى `3` عند النقر التالي، وهكذا.

## الحالة عبر الوقت {/*state-over-time*/}

حسنًا، كان ذلك ممتعًا. حاول تخمين ما سيعرضه التنبيه عند النقر على هذا الزر:

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
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

إذا استخدمت طريقة الاستبدال من قبل، يمكنك تخمين أن التنبيه يعرض "0":

```js
setNumber(0 + 5);
alert(0);
```

ولكن ماذا لو وضعت مؤقتًا على التنبيه، بحيث يُطلق فقط _بعد_ إعادة تصيير المكون؟ هل سيقول "0" أو "5"؟ خمّن!

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
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

متفاجئ؟ إذا استخدمت طريقة الاستبدال، يمكنك رؤية "لقطة" الحالة الممررة إلى التنبيه.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

قد تكون الحالة المخزنة في React قد تغيرت بحلول الوقت الذي يتم فيه تشغيل التنبيه، لكنها تم جدولتها باستخدام لقطة من الحالة في الوقت الذي تفاعل فيه المستخدم معها!

**قيمة متغير الحالة لا تتغير أبدًا داخل التصيير،** حتى لو كان كود معالج الحدث الخاص به غير متزامن. داخل `onClick` *لذلك التصيير*، تظل قيمة `number` `0` حتى بعد استدعاء `setNumber(number + 5)`. تم "تثبيت" قيمتها عندما "أخذ" React "اللقطة" من واجهة المستخدم من خلال استدعاء مكونك.

إليك مثال على كيف يجعل ذلك معالجات الأحداث الخاصة بك أقل عرضة لأخطاء التوقيت. فيما يلي نموذج يرسل رسالة مع تأخير خمس ثوانٍ. تخيل هذا السيناريو:

1. تضغط على زر "إرسال"، مرسلاً "مرحبًا" إلى Alice.
2. قبل انتهاء تأخير الخمس ثوانٍ، تغير قيمة حقل "إلى" إلى "Bob".

ماذا تتوقع أن يعرض `alert`؟ هل سيعرض، "قلت مرحبًا إلى Alice"؟ أم سيعرض، "قلت مرحبًا إلى Bob"؟ قم بالتخمين بناءً على ما تعرفه، ثم جربه:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**يحتفظ React بقيم الحالة "ثابتة" داخل معالجات الأحداث لتصيير واحد.** لست بحاجة إلى القلق بشأن ما إذا كانت الحالة قد تغيرت أثناء تشغيل الكود.

ولكن ماذا لو أردت قراءة أحدث حالة قبل إعادة التصيير؟ سترغب في استخدام [دالة محدّث الحالة](/learn/queueing-a-series-of-state-updates)، المشروحة في الصفحة التالية!

<Recap>

* تعيين الحالة يطلب تصييرًا جديدًا.
* يخزن React الحالة خارج مكونك، كما لو كانت على رف.
* عندما تستدعي `useState`، يعطيك React لقطة من الحالة *لذلك التصيير*.
* المتغيرات ومعالجات الأحداث لا "تنجو" من إعادات التصيير. كل تصيير له معالجات الأحداث الخاصة به.
* كل تصيير (والدوال بداخله) سيرى دائمًا "لقطة" الحالة التي أعطاها React *لذلك* التصيير.
* يمكنك استبدال الحالة ذهنيًا في معالجات الأحداث، بشكل مماثل لكيفية تفكيرك في JSX المُصَيَّر.
* معالجات الأحداث المنشأة في الماضي لديها قيم الحالة من التصيير الذي تم إنشاؤها فيه.

</Recap>



<Challenges>

#### تنفيذ إشارة مرور {/*implement-a-traffic-light*/}

إليك مكون إشارة عبور المشاة الذي يتبدل عند الضغط على الزر:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

أضف `alert` إلى معالج النقر. عندما تكون الإشارة خضراء وتقول "Walk"، يجب أن يقول النقر على الزر "Stop is next". عندما تكون الإشارة حمراء وتقول "Stop"، يجب أن يقول النقر على الزر "Walk is next".

هل يحدث فرق ما إذا وضعت `alert` قبل أو بعد استدعاء `setWalk`؟

<Solution>

يجب أن يبدو `alert` الخاص بك كما يلي:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Stop is next' : 'Walk is next');
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

سواء وضعته قبل أو بعد استدعاء `setWalk` لا يحدث فرقًا. قيمة `walk` لذلك التصيير ثابتة. استدعاء `setWalk` سيغيرها فقط للتصيير *التالي*، ولكن لن يؤثر على معالج الحدث من التصيير السابق.

قد يبدو هذا السطر غير بديهي في البداية:

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

ولكن منطقي إذا قرأته على أنه: "إذا كانت إشارة المرور تعرض 'Walk now'، يجب أن تقول الرسالة 'Stop is next.'" متغير `walk` داخل معالج الحدث الخاص بك يطابق قيمة `walk` لذلك التصيير ولا يتغير.

يمكنك التحقق من أن هذا صحيح من خلال تطبيق طريقة الاستبدال. عندما تكون `walk` `true`، تحصل على:

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Change to Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

لذا فإن النقر على "Change to Stop" يضع في قائمة الانتظار تصييرًا مع `walk` معينة إلى `false`، ويعرض تنبيه "Stop is next".

</Solution>

</Challenges>
