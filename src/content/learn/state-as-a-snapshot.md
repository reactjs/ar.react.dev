---
title: الحالة كلقطة زمنية
---

<Intro>

قد تبدو متغيرات الحالة مثل متغيرات JavaScript العادية التي يمكنك قراءتها وكتابتها. ومع ذلك، تتصرف الحالة بأقرب إلى «لقطة» زمنية. تغييرها لا يغيّر قيمة المتغير الموجودة في التمرير الحالي، بل يطلب من React إعادة عرض المكوّن.

</Intro>

<YouWillLearn>

* كيف يؤدي تعيين الحالة إلى طلب إعادة عرض
* متى وكيف تجري تحديثات الحالة
* لماذا لا تتحدّث الحالة فورًا بعد استدعاء دالة التعيين
* كيف تصل معالجات الأحداث إلى «لقطة» من الحالة

</YouWillLearn>

## تعيين الحالة يؤدي إلى إعادة العرض {/*setting-state-triggers-renders*/}

قد تعتقد أن واجهة المستخدم تتغير مباشرةً استجابةً لحدث المستخدم (مثل النقر). في React، الأمر يعمل بطريقة مختلفة قليلًا عن هذا التصور الذهني. في الصفحة السابقة رأيت أن [تعيين الحالة يطلب إعادة عرض](/learn/render-and-commit#step-1-trigger-a-render) من React. هذا يعني أنه لكي تستجيب الواجهة للحدث، يجب عليك *تحديث الحالة*.

في هذا المثال، عند الضغط على زر "إرسال"، تستدعي `setIsSent(true)` React لإعادة عرض الواجهة:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('مرحبا!');
  if (isSent) {
    return <h1>رسالتك في طريقها!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="الرسالة"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">إرسال</button>
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

1. ينفّذ معالج حدث `onSubmit`.
2. تستدعي `setIsSent(true)` لتعيين `isSent` إلى `true` وتضع طلبًا لإعادة العرض.
3. تقوم React بإعادة عرض المكوّن وفقًا لقيمة `isSent` الجديدة.

لنلقِ نظرة أقرب على العلاقة بين الحالة والتصيير.

## العرض يأخذ لقطة زمنية {/*rendering-takes-a-snapshot-in-time*/}

تشير عملية "العرض"(["Rendering"](/learn/render-and-commit#step-2-react-renders-your-components)) إلى أن React تستدعي مكوّنك، وهو دالة. يعاد من هذه الدالة JSX يُشبه لقطة من حالة الواجهة في لحظة زمنية معيّنة. تُحسب الخصائص (props) ومعالجات الأحداث والمتغيرات المحلية **باستخدام قيم الحالة في لحظة العرض تلك.**

على عكس الصورة الفوتوغرافية أو إطار الفيلم، فإن "اللقطة" التي تُرجِعها من واجهة المستخدم تظل تفاعلية. تتضمن هذه اللقطة منطقًا مثل معالجات الأحداث التي تُحدِّد ما يحدث استجابةً للمدخلات. تقوم React بتحديث الشاشة لتطابق هذه اللقطة وتوصيل معالجات الأحداث — ونتيجة لذلك سيؤدي الضغط على زر إلى استدعاء معالج النقر الموجود في JSX الخاص بك.

عندما تُعيد React عرض (render) مكوَّنًا:

1. تستدعي React دالتك مرةً أخرى.
2. تُرجِع دالتك لقطة JSX جديدة.
3. ثم تُحدّث React الشاشة لتطابق اللقطة التي أعادت دالتك.

<IllustrationBlock sequential>
    <Illustration caption="React ينفّذ الدالة" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="حساب اللقطة" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="تحديث شجرة DOM" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

كونها ذاكرة المكوّن، ليست الحالة مثل المتغير العادي الذي يزول بعد إرجاع الدالة. بل تعيش الحالة في React نفسها — كأنها على رف — خارج نطاق دالتك. عندما تستدعي React مكوّنك، تمنحك لقطة من الحالة لذلك العرض المحدد. يُعيد مكوّنك لقطة من الواجهة تتضمّن مجموعة جديدة من الخصائص ومعالجات الأحداث في JSX، كلها محسوبة **باستخدام قيم الحالة في ذلك العرض!**

<IllustrationBlock sequential>
  <Illustration caption="أنت تطلب من React تحديث الحالة" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React تحدّث قيمة الحالة" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React تمرّر لقطة من قيمة الحالة إلى المكوّن" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

إليك تجربة صغيرة لتوضيح كيفية عمل ذلك. في هذا المثال قد تتوقع أن النقر على زر "+3" سيزيد العداد ثلاث مرات لأن الدالة تستدعي `setNumber(number + 1)` ثلاث مرات.

جَرّب النقر على زر "+3" لترى ما يحدث:

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

انتبه إلى أن قيمة `number` تزداد مرة واحدة فقط في كل نقرة!

**تعيين الحالة يغيّرها فقط للعرض التالي.** خلال العرض الأول كانت قيمة `number` تساوي `0`. ولهذا السبب، في معالج `onClick` الخاص بـ *ذلك العرض*، تظل قيمة `number` تساوي `0` حتى بعد استدعاء `setNumber(number + 1)`:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

إليك ما يطلبه معالج النقر من React القيام به:

1. `setNumber(number + 1)`: قيمة `number` هي `0` لذلك تُصبح `setNumber(0 + 1)`.
    - تستعد React لتغيير `number` إلى `1` في العرض التالي.
2. `setNumber(number + 1)`: قيمة `number` هي `0` لذلك تُصبح `setNumber(0 + 1)`.
    - تستعد React لتغيير `number` إلى `1` في العرض التالي.
3. `setNumber(number + 1)`: قيمة `number` هي `0` لذلك تُصبح `setNumber(0 + 1)`.
    - تستعد React لتغيير `number` إلى `1` في العرض التالي.

مع أنك استدعيت `setNumber(number + 1)` ثلاث مرات، في معالج هذا العرض تظل قيمة `number` دائمًا `0`، لذلك تضبط الحالة على `1` ثلاث مرات. ولهذا بعد انتهاء معالج الحدث تعيد React عرض المكوّن مع `number` يساوي `1` وليس `3`.

يمكنك أيضًا تصور ذلك بتبديل متغيرات الحالة بقيمها في الشفرة ذهنيًا. بما أن قيمة `number` تساوي `0` في *هذا العرض*، فمعالج النقر يبدو هكذا:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

في العرض التالي ستكون قيمة `number` تساوي `1`، لذا يصبح معالج النقر في *ذلك العرض* هكذا:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

لهذا عند النقر مرة أخرى سيُصبح العداد `2`، ثم `3` عند النقرة التالية، وهكذا.

## الحالة عبر الزمن {/*state-over-time*/}

حسنًا، كان ذلك ممتعًا. جرّب أن تخمّن ما سيعرضه التنبيه عند النقر على هذا الزر:

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

إذا استخدمت طريقة الاستبدال السابقة يمكنك تخمين أن التنبيه سيعرض "0":

```js
setNumber(0 + 5);
alert(0);
```

لكن ماذا لو أضفت مؤقتًا للتنبيه بحيث يظهر _بعد_ إعادة عرض المكوّن؟ هل سيعرض "0" أم "5"؟ جرّب التخمين!

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

هل تفاجأت؟ إذا استخدمت طريقة الاستبدال، يمكنك رؤية "اللقطة" من الحالة التي تُمرَّر إلى التنبيه.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

قد تكون الحالة المخزنة في React قد تغيّرت بحلول وقت تشغيل التنبيه، لكن التنبيه قد جُدول باستخدام لقطة من الحالة في لحظة تفاعل المستخدم!

**قيمة متغير الحالة لا تتغير أبدًا داخل عملية العرض (render)،** حتى لو كان كود معالج الحدث غير متزامن. داخل معالج `onClick` الخاص *بذلك العرض*، تظل قيمة `number` تساوي `0` حتى بعد استدعاء `setNumber(number + 5)`. تم "تثبيت" قيمتها عندما أخذت React "اللقطة" من واجهة المستخدم باستدعائها لمكوّنك.

إليك مثالًا يوضّح كيف يجعل ذلك معالجات الأحداث أقل عرضة لأخطاء التزامن. في الأسفل نموذج يرسل رسالة مع تأخير مقداره خمس ثوانٍ. تخيّل السيناريو التالي:

1. تضغط زر "إرسال" لإرسال "مرحبا" إلى ليلى.
2. قبل انتهاء مهلة الخمس ثوانٍ، تغيّر قيمة حقل "إلى" إلى "سامي".

ما الذي تتوقع أن يعرضه `alert`؟ هل سيعرض "لقد أرسلت مرحبا إلى ليلى" أم "لقد أرسلت مرحبا إلى سامي"؟ خمن ما يحدث ثم جرّب.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('ليلى');
  const [message, setMessage] = useState('مرحبا');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`لقد أرسلت ${message} إلى ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        إلى:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="ليلى">ليلى</option>
          <option value="سامي">سامي</option>
        </select>
      </label>
      <textarea
        placeholder="الرسالة"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">إرسال</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**تُبقي React قيم الحالة "ثابتة" داخل معالجات أحداث ذلك العرض.** لا حاجة للقلق من أن تكون الحالة قد تغيّرت أثناء تنفيذ الكود.

ولكن ماذا لو أردت قراءة أحدث قيمة للحالة قبل إعادة العرض؟ ستحتاج إلى استخدام [دالة محدثة للحالة](/learn/queueing-a-series-of-state-updates)، والتي سنغطيها في الصفحة التالية!

<Recap>

* يؤدي تعيين الحالة إلى طلب إعادة عرض جديد.
* تخزن React الحالة خارج مكوّنك، كما لو كانت على رف.
* عند استدعائك لـ `useState`، تعطيك React لقطة من الحالة *لهذا العرض*.
* المتغيرات ومعالجات الأحداث لا "تنجو" عبر إعادة العرض — كل عرض له معالجات أحداث خاصة به.
* كل عرض (والدوال داخله) سترى دائمًا لقطة الحالة التي أعطتها React *لذلك العرض*.
* يمكنك استبدال قيم الحالة ذهنيًا في معالجات الأحداث، تمامًا كما تفكر في JSX المعروض.
* معالجات الأحداث التي أُنشئت سابقًا تحتوي على قيم الحالة من العرض الذي أُنشئت فيه.

</Recap>



<Challenges>

#### Implement a traffic light {/*implement-a-traffic-light*/}

إليك مكوّن ضوء العبور (إشارة المشاة) الذي يتبدّل عند الضغط على الزر:

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
        غيّر إلى {walk ? 'قف' : 'امشِ'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'امشِ' : 'قف'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Add an `alert` to the click handler. When the light is green and says "Walk", clicking the button should say "Stop is next". When the light is red and says "Stop", clicking the button should say "Walk is next".

Does it make a difference whether you put the `alert` before or after the `setWalk` call?

<Solution>

Your `alert` should look like this:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'التالي: قف' : 'التالي: امشِ');
  }

  return (
    <>
      <button onClick={handleClick}>
        غيّر إلى {walk ? 'قف' : 'امشِ'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'امشِ' : 'قف'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Whether you put it before or after the `setWalk` call makes no difference. That render's value of `walk` is fixed. Calling `setWalk` will only change it for the *next* render, but will not affect the event handler from the previous render.

This line might seem counter-intuitive at first:

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

But it makes sense if you read it as: "If the traffic light shows 'Walk now', the message should say 'Stop is next.'" The `walk` variable inside your event handler matches that render's value of `walk` and does not change.

You can verify that this is correct by applying the substitution method. When `walk` is `true`, you get:

```js
<button onClick={() => {
  setWalk(false);
  alert('التالي: قف');
}}>
  غيّر إلى قف
</button>
<h1 style={{color: 'darkgreen'}}>
  امشِ
</h1>
```

لذلك، يؤدي النقر على "غيّر إلى قف" إلى جدولة إعادة عرض حيث تصبح قيمة `walk` مساوية لـ `false`، ويعرض التنبيه "التالي: قف".

</Solution>

</Challenges>
