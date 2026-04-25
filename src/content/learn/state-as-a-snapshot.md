---
title: الحالة كلقطة
---

<Intro>

قد تبدو متغيرات الحالة مثل متغيرات JavaScript العادية التي تقرأها وتكتب فيها. لكن الحالة تتصرف أكثر كلقطة (snapshot). تعيينها لا يغيّر متغير الحالة الذي لديك بالفعل، بل يطلق إعادة رسم.

</Intro>

<YouWillLearn>

* كيف يؤدي تعيين الحالة إلى إعادة الرسم
* متى وكيف تُحدَّث الحالة
* لماذا لا تُحدَّث الحالة فورًا بعد تعيينها
* كيف تصل معالجات الأحداث إلى «لقطة» من الحالة

</YouWillLearn>

## تعيين الحالة يطلق الرسم {/*setting-state-triggers-renders*/}

قد تتصور أن واجهتك تتغير مباشرة استجابة لحدث المستخدم مثل النقر. في React الأمر يختلف قليلًا عن هذا النموذج الذهني. في الصفحة السابقة رأيت أن [تعيين الحالة يطلب إعادة رسم](/learn/render-and-commit#step-1-trigger-a-render) من React. يعني أن الواجهة لتتفاعل مع الحدث تحتاج إلى *تحديث الحالة*.

في هذا المثال، عند الضغط على «إرسال»، `setIsSent(true)` تخبر React بإعادة رسم الواجهة:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('مرحبًا!');
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

ما يحدث عند النقر على الزر:

1. يُنفَّذ معالج الحدث `onSubmit`.
2. `setIsSent(true)` يضع `isSent` إلى `true` ويضع عملية رسم جديدة في الطابور.
3. يعيد React رسم المكوّن وفق قيمة `isSent` الجديدة.

لننظر عن كثب إلى العلاقة بين الحالة والرسم.

## الرسم يأخذ لقطة في لحظة {/*rendering-takes-a-snapshot-in-time*/}

[«الرسم»](/learn/render-and-commit#step-2-react-renders-your-components) يعني أن React يستدعي مكوّنك، وهو دالة. الـ JSX الذي تُرجعه من تلك الدالة مثل لقطة للواجهة في تلك اللحظة. خصائصه ومعالجات الأحداث والمتغيرات المحلية حُسبت **باستخدام حالته في وقت ذلك الرسم.**

بخلاف صورة فوتوغرافية أو إطار فيلم، «لقطة» الواجهة التي تُرجعها تفاعلية. فيها منطق مثل معالجات الأحداث التي تحدد ماذا يحدث استجابة للمدخلات. يحدّث React الشاشة لتطابق هذه اللقطة ويربط معالجات الأحداث. النتيجة: الضغط على زر يطلق معالج النقر من JSX.

عندما يعيد React رسم مكوّن:

1. يستدعي React دالتك مجددًا.
2. تُرجع دالتك لقطة JSX جديدة.
3. يحدّث React الشاشة لتطابق اللقطة التي أرجعتها دالتك.

<IllustrationBlock sequential>
    <Illustration caption="React ينفّذ الدالة" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="حساب اللقطة" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="تحديث شجرة DOM" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

كذاكرة للمكوّن، الحالة ليست مثل متغير عادي يختفي بعد خروج الدالة. الحالة «تعيش» في React نفسه—كأنها على رف!—خارج دالتك. عندما يستدعي React مكوّنك، يعطيك لقطة من الحالة لتلك الجولة من الرسم. يُرجع مكوّنك لقطة للواجهة مع مجموعة جديدة من الخصائص ومعالجات الأحداث في JSX، كلها محسوبة **باستخدام قيم الحالة من ذلك الرسم!**

<IllustrationBlock sequential>
  <Illustration caption="تطلب من React تحديث الحالة" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React يحدّث قيمة الحالة" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React يمرّر لقطة من قيمة الحالة إلى المكوّن" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

إليك تجربة صغيرة توضح ذلك. في هذا المثال، قد تتوقع أن النقر على «+3» يزيد العداد ثلاث مرات لأنه يستدعي `setNumber(number + 1)` ثلاث مرات.

شاهد ماذا يحدث عند النقر على «+3»:

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

لاحظ أن `number` يزيد مرة واحدة فقط لكل نقرة!

**تعيين الحالة يغيّرها فقط للرسم *التالي*.** في أول رسم، كان `number` يساوي `0`. لذلك في معالج `onClick` *لذلك الرسم* تبقى قيمة `number` `0` حتى بعد استدعاء `setNumber(number + 1)`:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

إليك ما يطلبه معالج النقر لهذا الزر من React:

1. `setNumber(number + 1)`: `number` هو `0` فيصبح `setNumber(0 + 1)`.
    - React يستعد لتغيير `number` إلى `1` في الرسم التالي.
2. `setNumber(number + 1)`: `number` لا يزال `0` فيصبح `setNumber(0 + 1)`.
    - React يستعد لتغيير `number` إلى `1` في الرسم التالي.
3. `setNumber(number + 1)`: `number` لا يزال `0` فيصبح `setNumber(0 + 1)`.
    - React يستعد لتغيير `number` إلى `1` في الرسم التالي.

رغم أنك استدعيت `setNumber(number + 1)` ثلاث مرات، في معالج الحدث *لهذا الرسم* `number` دائمًا `0`، فتعيّن الحالة إلى `1` ثلاث مرات. لذلك بعد انتهاء معالج الحدث، يعيد React رسم المكوّن و`number` يساوي `1` لا `3`.

يمكنك أيضًا تخيّل ذلك باستبدال متغيرات الحالة بقيمها في الشيفرة. بما أن `number` هو `0` في *هذا الرسم*، يبدو معالج الحدث هكذا:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

في الرسم التالي، `number` هو `1`، فيبدو معالج النقر *لذلك الرسم* هكذا:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

لذلك النقر مرة أخرى يضبط العداد إلى `2`، ثم إلى `3` في النقرة التالية، وهكذا.

## الحالة عبر الزمن {/*state-over-time*/}

حسنًا، كان ذلك ممتعًا. حاول تخمين ماذا سيعرض التنبيه عند النقر على هذا الزر:

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

إذا استخدمت طريقة الاستبدال السابقة، تخمّن أن التنبيه يعرض «0»:

```js
setNumber(0 + 5);
alert(0);
```

لكن ماذا لو وضعت مؤقتًا على التنبيه ليطلق *بعد* إعادة رسم المكوّن؟ هل سيقول «0» أم «5»؟ خمّن!

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

مفاجأ؟ بطريقة الاستبدال ترى «لقطة» الحالة الممرَّرة إلى التنبيه.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

قد تتغير الحالة المخزنة في React بحلول وقت تشغيل التنبيه، لكنه جُدولَ بلقطة من الحالة لحظة تفاعل المستخدم!

**قيمة متغير الحالة لا تتغير داخل رسم واحد،** حتى لو كان كود معالج الحدث غير متزامن. داخل `onClick` *لذلك الرسم* تبقى قيمة `number` `0` حتى بعد `setNumber(number + 5)`. قيمتها «ثُبِّتت» عندما React «أخذ لقطة» للواجهة باستدعاء مكوّنك.

إليك مثالًا يوضح كيف يجعل ذلك معالجات أحداثك أقل عرضة لأخطاء التوقيت. في الأسفل نموذج يرسل رسالة بتأخير خمس ثوانٍ. تخيّل هذا السيناريو:

1. تضغط «إرسال»، فتُرسل «مرحبًا» إلى Alice.
2. قبل انتهاء التأخير خمس ثوانٍ، تغيّر حقل «إلى» إلى «Bob».

ماذا تتوقع أن يعرض `alert`؟ «قلت مرحبًا لـ Alice»؟ أم «قلت مرحبًا لـ Bob»؟ خمّن بناءً على ما تعرفه، ثم جرّب:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('مرحبًا');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`قلت ${message} لـ ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        إلى:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
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

**React يُبقي قيم الحالة «ثابتة» داخل معالجات أحداث رسم واحد.** لا تحتاج للقلق إن تغيّرت الحالة أثناء تشغيل الشيفرة.

لكن إن أردت قراءة أحدث حالة قبل إعادة الرسم؟ استخدم [دالة تحديث الحالة](/learn/queueing-a-series-of-state-updates)، وهي موضوع الصفحة التالية!

<Recap>

* تعيين الحالة يطلب رسمًا جديدًا.
* React يخزّن الحالة خارج مكوّنك، كأنها على رف.
* عند استدعاء `useState`، يعطيك React لقطة من الحالة *لذلك الرسم*.
* المتغيرات ومعالجات الأحداث لا «تبقى» عبر إعادات الرسم. كل رسم له معالجات أحداثه.
* كل رسم (والدوال بداخله) سيرى دائمًا اللقطة من الحالة التي منحها React *لذلك* الرسم.
* يمكنك استبدال الحالة ذهنيًا في معالجات الأحداث، كما تفكر في JSX المرسوم.
* معالجات الأحداث المُنشأة في الماضي تحمل قيم الحالة من الرسم الذي وُلدت فيه.

</Recap>



<Challenges>

#### تنفيذ إشارة مرور {/*implement-a-traffic-light*/}

إليك مكوّن إشارة ممر يتبدّل عند الضغط على الزر:

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
        التبديل إلى {walk ? 'توقف' : 'مشي'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'مشي' : 'توقف'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

أضف `alert` إلى معالج النقر. عندما تكون الإشارة خضراء وتقول «مشي»، النقر يجب أن يقول «التالي: توقف». عندما تكون حمراء وتقول «توقف»، النقر يجب أن يقول «التالي: مشي».

هل يفرق وضع `alert` قبل أو بعد استدعاء `setWalk`؟

<Solution>

يجب أن يبدو `alert` هكذا:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'التالي: توقف' : 'التالي: مشي');
  }

  return (
    <>
      <button onClick={handleClick}>
        التبديل إلى {walk ? 'توقف' : 'مشي'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'مشي' : 'توقف'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

لا فرق بين وضعه قبل أو بعد `setWalk`. قيمة `walk` في *ذلك الرسم* ثابتة. استدعاء `setWalk` يغيّرها فقط للرسم *التالي*، ولا يؤثر على معالج الحدث من الرسم السابق.

قد يبدو هذا السطر غير بديهي في البداية:

```js
alert(walk ? 'التالي: توقف' : 'التالي: مشي');
```

لكنه منطقي إذا قرأته: «إن كانت الإشارة تعرض مشيًا الآن، الرسالة تقول التالي توقف.» متغير `walk` داخل معالج الحدث يطابق قيمة `walk` لذلك الرسم ولا يتغيّر.

يمكنك التحقق بطريقة الاستبدال. عندما `walk` هو `true`، تحصل على:

```js
<button onClick={() => {
  setWalk(false);
  alert('التالي: توقف');
}}>
  التبديل إلى توقف
</button>
<h1 style={{color: 'darkgreen'}}>
  مشي
</h1>
```

فالنقر على «التبديل إلى توقف» يضع في الطابور رسمًا بـ`walk` يساوي `false`، ويعرض تنبيه «التالي: توقف».

</Solution>

</Challenges>
