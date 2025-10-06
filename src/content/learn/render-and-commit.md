---
title: التصيير والتأكيد
---

<Intro>

قبل أن يتم عرض مكوناتك في الشاشة، يجب أن يتم تصييرها بواسطة React. فهم الخطوات في هذه العملية سيساعدك على التفكير في كيفية تنفيذ الكود الخاص بك وشرح سلوكه.

</Intro>

<YouWillLearn>

* ماذا يعني التصيير في React
* متى ولماذا يقوم React بتصيير مكون
* خطوات عرض مكون في الشاشة
* لماذا التصيير لا يقدم دائمًا تحديث DOM

</YouWillLearn>

تخيل أن مكوناتك طهاة في المطبخ، يطبخون وصفات لذيذة، في هذا السيناريو، React هو النادل الذي يسجل طلبات الزبائن ويقدمها لهم. هذه العملية من طلب وتقديم الواجهة لها ثلاث خطوات:

1. **تنشيط** عملية التصيير (تسليم طلب الزبون للمطبخ)
2. **تصيير** المكون (إعداد الطلب في المطبخ)
3. **التأكيد** على DOM (وضع الطلب على الطاولة)

<IllustrationBlock sequential>
  <Illustration caption="تنشيط" alt="تمثل React دور خادم المطعم، تجلب الطلبات من المستخدمين وتوصلها إلى مطبخ المكونات" src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration catpion="تصيير" alt="يقدم الطاهي (بطاقة Card) مكون Card جديد لـ React" src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="تأكيد" alt="يقدم React البطاقة للمستخدم على طاولته" src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## الخطوة الأولى: تنشيط التصيير {/*step-1-trigger-a-render*/}

هناك سببان لتنفيذ تصيير المكون:

1. التصيير الأوَّلِي للمكون. (initial render)
2. تم تحديث حالة المكون (أو أحد آبائه). (state)

### التصيير الأوَّلِي {/*initial-render*/}

عند بدء تشغيل التطبيق، تحتاج لبدء التصيير الأوَّلِي، تخفي إطارات العمل ومحررات الأكواد البسيطة هذا الكود، لكنه يتم بواسطة استدعاء [`createRoot`](/reference/react-dom/client/createRoot) مستهدفًا عنصر DOM، ثم استدعاء طريقة `render` مع المكون الخاص بك:

<Sandpack>

```js src/index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js src/Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Generica' لإدواردو كاتالانو: منحوتة زهرة معدنية عملاقة بتلات عاكسة للضوء"
    />
  );
}
```

</Sandpack>

جرب عمل تعليق على السطر الذي يستدعي `root.render()` وانظر كيف تختفي الصورة. 

مثل هذا: 

```js
// root.render(<Image />);
```

### إعادة التصيير عند تحديث الحالة {/*re-renders-when-state-updates*/}

بمجرد أن يتم تصيير المكون لأول مرة، يمكنك تنشيط عمليات التصيير الأخرى عن طريق تحديث حالته باستخدام دالة [`set`](/reference/react/useState#setstate). تحديث حالة المكون الخاص بك يضع تلقائيًا عملية تصيير في قائمة الانتظار. (يمكنك تخيل هذه العمليات على أنها طلبات من زبون المطعم للحصول على الشاي أو الحلويات أو أي شيء آخر بعد طلبه الأول، اعتمادًا على حالة عطشه أو جوعه.)

<IllustrationBlock sequential>
<<<<<<< HEAD
  <Illustration caption="تحديث الحالة..." alt="React كخادم في مطعم، يقدم واجهة مستخدم بطاقة للمستخدم، ويمثل المستخدم بزبون مع مؤشر لرأسه. يعبر الزبون عن رغبته في الحصول على بطاقة وردية، وليس سوداء!" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...يؤدي إلى..." alt="يعود React إلى مطبخ المكونات ويخبر طاهي البطاقات أنه يحتاج إلى بطاقة وردية." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...تصيير!" alt="يعطي طاهي البطاقات React البطاقة الوردية." src="/images/docs/illustrations/i_rerender3.png" />
=======
  <Illustration caption="State update..." alt="React as a server in a restaurant, serving a Card UI to the user, represented as a patron with a cursor for their head. The patron expresses they want a pink card, not a black one!" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...triggers..." alt="React returns to the Component Kitchen and tells the Card Chef they need a pink Card." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...render!" alt="The Card Chef gives React the pink Card." src="/images/docs/illustrations/i_rerender3.png" />
>>>>>>> 11cb6b591571caf5fa2a192117b6a6445c3f2027
</IllustrationBlock>

## الخطوة الثانية: يقوم React بتصيير مكوناتك {/*step-2-react-renders-your-components*/}

بعد تنشيط عملية التصيير، يقوم React بتصيير مكوناتك لمعرفة ما يجب عرضه على الشاشة. **"التصيير" هو استدعاء React لمكوناتك.**

* **عند التصيير الأوَّلِي،** سينشئ React المكون الأصل.
* **عند التصيير اللاحق،** سينشئ React المكون الذي أدى تحديث حالته إلى التصيير.

هذه العملية تتكرر: إذا كان المكون المحدث يعيد مكونًا آخر، فسيقوم React بتصيير هذا المكون التالي، وإذا كان هذا المكون أيضًا يعيد شيئًا ما، فسيقوم بتصيير هذا المكون التالي، وهكذا. ستستمر العملية حتى لا تكون هناك مكونات متداخلة أخرى ويعرف React بالضبط ما يجب عرضه على الشاشة.

<<<<<<< HEAD
في المثال التالي، سينفذ React `Gallery()` و `Image()` عدة مرات:
=======
In the following example, React will call `Gallery()` and `Image()` several times:
>>>>>>> 11cb6b591571caf5fa2a192117b6a6445c3f2027

<Sandpack>

```js src/Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>منحوتات ملهمة</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Generica' لإدواردو كاتالانو: منحوتة زهرة معدنية عملاقة بتلات عاكسة للضوء"
    />
  );
}
```

```js src/index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

* **أثناء التصيير الأولي** ستقوم React [بإنشاء عناصر DOM](https://developer.mozilla.org/docs/Web/API/Document/createElement) لعلامات `<section>`، `<h1>`، وثلاث علامات `<img>`.
* **أثناء التصيير اللاحق** سيحسب الخصائص التي تغيرت منذ التصيير السابق، إن وجدت. لن يفعل أي شيء بهذه المعلومات حتى الخطوة التالية، وهي مرحلة التأكيد.

<Pitfall>

دائمًا يجب أن يكون التصيير [محسوبًا بدقة](/learn/keeping-components-pure):

* **إن كان نفس المدخلات يجب أن يحصل على نفس الناتج.** بالنظر إلى نفس الطلبات، يجب أن يعيد المكون نفس JSX دائمًا. (عندما يطلب شخص ما سلطة مع الطماطم، فلا ينبغي أن يتلقى سلطة مع البصل!)
* **يهتم فقط بما يخصه.** لا ينبغي أن يغير أي كائنات أو متغيرات كانت موجودة قبل التصيير. (لا ينبغي أن يؤثر طلب واحد على طلبات الآخرين.)

وإلا، يمكنك أن تواجه أخطاءً محيّرة وسلوكًا غير متوقع مع تعقيد بيئة الكود. عند التطوير في "وضع صارم (Srrict Mode)"، ينشئ React كل وظيفة مكون مرتين، مما يساعد على كشف الأخطاء الناتجة عن الوظائف غير النقية.

</Pitfall>

<DeepDive>

#### تحسين الأداء {/*optimizing-performance*/}

التصرف الافتراضي لتصيير كل المكونات المتفرعة عن المكون الذي تم تحديثة ليس مثاليًا للأداء إذا كان المكون المحدث عاليًا جدًا في شجرة المكونات. إذا واجهتك مشكلة في الأداء، فهناك طرق مختلفة لحلها، مشروحة في قسم [الأداء](https://reactjs.org/docs/optimizing-performance.html). **لا تستعجل محاولة تحسين الأداء!**

</DeepDive>

## الخطوة الثالثة: يؤكد React التغييرات على DOM {/*step-3-react-commits-changes-to-the-dom*/}

<<<<<<< HEAD
بعد تصيير (استدعاء) للمكونات، سيعدل React الـ DOM.

* **أثناء التصيير المبدئي** سيستخدمReact [DOM API `appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) لوضع جميع عناصر DOM التي أنشأها على الشاشة.
* **أثناء إعادة التصيير** سينفذ React العمليات اللازمة (التي تم حسابها أثناء التصيير!) لجعل DOM يتطابق مع أحدث نتيجة تصيير.
=======
After rendering (calling) your components, React will modify the DOM.

* **For the initial render,** React will use the [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API to put all the DOM nodes it has created on screen.
* **For re-renders,** React will apply the minimal necessary operations (calculated while rendering!) to make the DOM match the latest rendering output.
>>>>>>> 11cb6b591571caf5fa2a192117b6a6445c3f2027

**يغيّر React عناصر DOM فقط إذا كان هناك فرق بين التصييرين.** على سبيل المثال، هناك مكون يقوم بإعادة التصيير مع اختلاف الخصائص المُمَرَّرة من المكون الأصلي كل ثانية. لاحظ كيف يمكنك إضافة بعض النص إلى `<input>`، وتحديث `value`، ولكن النص لا يختفي عند إعادة تصيير المكون:

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time.toLocaleTimeString()} />
  );
}
```

</Sandpack>

هذا يعمل لأنه أثناء هذه الخطوة الأخيرة، يحدّث React محتوى `<h1>` بالوقت الجديد. يرى React أن `<input>` يظهر في JSX في نفس المكان كالمرة السابقة، لذلك لا يلمس React الـ `<input>` - أو `value`!

## الخاتمة: رسم المتصفح {/*epilogue-browser-paint*/}

بعد الانتهاء من التصيير وتحديث React لـ DOM، سيعيد المتصفح رسم الشاشة. على الرغم من أن هذه العملية معروفة باسم "تصيير المتصفح"، سنشير إليها باسم "رسم" طوال التوثيق لتجنب الخلط.

<Illustration alt="رسم المتصفح: لا يزال حيًَا مع عنصر البطاقة'." src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

* **يحدث أي تحديث على الشاشة في تطبيق React في ثلاث خطوات:**
  1. **التنشيط**
  2. **التصيير**
  3. **التأكيد**
* يمكنك استخدام **الوضع الصارم** للعثور على الأخطاء في مكوناتك
* لا يلمس React الـ DOM إذا كانت نتيجة التصيير هي نفسها كالمرة السابقة

</Recap>

