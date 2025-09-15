---
title: الحفاظ على نقاء المكوّنات
---

<Intro>

بعض دوال JavaScript *نقية.* الدوال النقية تقوم فقط بإجراء حساب ولا شيء اكثر. من خلال كتابة مكوّناتك بصرامة كدوال نقية، يمكنك تجنب صنف كامل من  الأخطاء المحيرة والسلوك غير المتوقع مع نمو قاعدة التعليمات البرمجية الخاصة بك. للحصول على هذه الفوائد، هناك بعض القواعد التي يجب عليك اتباعها.


</Intro>

<YouWillLearn>

* ما هو النقاء وكيف يساعدك على تجنب الأخطاء (bugs)
* كيفية الحفاظ على نقاء المكوّنات عن طريق إبقاء التغييرات خارج مرحلة التصيير (render phase)
* كيفية استخدام الوضع الصارم (Strict Mode) للعثور على الأخطاء في مكوّناتك

</YouWillLearn>

## النقاء: المكوّنات (components) كمعادلات رياضية {/*purity-components-as-formulas*/}

في علم الحاسب (وخاصة عالم البرمجة الوظيفية (functional programming)), [الدالة النقية](https://wikipedia.org/wiki/Pure_function) هي دالة بالخواص التالية:

* **تهتم بشؤونها.** لا تغير أي كائنات أو متغيرات كانت موجودة قبل استدعائها.
* **نفس المدخلات تؤدي لنفس المخرجات** بإعطاء نفس المدخلات ، يجب أن تُرجع الدالة النقية نفس النتيجة دائمًا.

قد تكون بالفعل على دراية بمثال واحد من الوظائف النقية: المعادلات في الرياضيات.

انظر معادلة الرياضيات هذه: <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>.

إذا <Math><MathI>x</MathI> = 2</Math> عندها <Math><MathI>y</MathI> = 4</Math>. دائمًا. 

إذا <Math><MathI>x</MathI> = 3</Math> عندها <Math><MathI>y</MathI> = 6</Math>. دائمًا. 

إذا <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> لن تكون احيانًا <Math>9</Math> أو <Math>–1</Math> أو <Math>2.5</Math> اعتمادًا على الوقت في اليوم أو حالة البورصة.

إذا <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> و <Math><MathI>x</MathI> = 3</Math>، <MathI>y</MathI> ستكون _دائمًا_ <Math>6</Math>. 

إذا قمنا بتحويل هذا إلى دالة JavaScript، فسيبدو كما يلي:



```js
function double(number) {
  return 2 * number;
}
```

في المثال أعلاه ، "double" هي **دالة نقية.** إذا مررت بـ "3" ، فستُرجع "6". دائماً.

تم تصميم React حول هذا المفهوم. **تفترض React أن كل مكّون تكتبه هو دالة نقية.** هذا يعني أن مكوّنات React التي تكتبها يجب أن تُرجع دائمًا نفس JSX مع الأخذ في الاعتبار نفس المدخلات:

<Sandpack>

```js src/App.js
function Recipe({ drinkers }) {
  return (
    <ol>    
      <li>أغلي {drinkers} كوب ماء.</li>
      <li>أضف {drinkers} ملعقة شاي و {0.5 * drinkers} ملعقة توابل.</li>
      <li>أضف {0.5 * drinkers} كوب حليب للغلي وسكر للتذوق</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>وصفة شاي متبل</h1>
      <h2>لاثنين</h2>
      <Recipe drinkers={2} />
      <h2>لتجمّع</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

عند تمرير `drinkers={2}` إلى `Recipe`, ستعيد JSX تحتوي على `2 اكواب من الماء`. دائمًا. 

إذا قمت بتمرير `drinkers={4}`, ستعيد JSX تحتوي على  `4 اكواب من الماء`. دائمًا.

تمامًا مثل الصيغ الرياضية.

يمكنك التفكير في المكوّنات الخاصة بك كوصفات: إذا اتبعتها ولم تقم بإدخال مكوّنات جديدة أثناء عملية الطهي، ستحصل على نفس الطبق في كل مرة. هذا "الطبق" هو ال JSX الذي يقدمه المكوّن لReact [للتصيير.](/learn/render-and-commit)

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="A tea recipe for x people: take x cups of water, add x spoons of tea and 0.5x spoons of spices, and 0.5x cups of milk" />

## الآثار الجانبية: العواقب (غير المقصودة) {/*side-effects-unintended-consequences*/}

يجب أن تكون عملية التصيير في React دائمًا نقية. يجب أن تقوم المكوّنات فقط بـ*إرجاع* JSX الخاص بهم، وعدم *تغيير* أي كائنات أو متغيرات كانت موجودة قبل عملية التصيير-فأن هذا سيجعلهم غير نقيين!



فيما يلي مكوّن يخالف هذه القاعدة:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // سيئ: تغيير متغير موجود بالفعل!
  guest = guest + 1;
  return <h2>كوب شاي للضيف رقم {guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

يقوم هذا المكوّن بقراءة وكتابة متغير `guest` المعلن خارجه. هذا يعني أن **استدعاء هذا المكوّن مرات متعددة سينتج JSX مختلف** بل وأكثر من ذلك ، إذا قرأت المكوّنات الأخرى `guest`, سوف تنتج JSX مختلف , أيضًا ، اعتمادًا على متى تم تصييرها! وهذا لا يمكن توقعه

نعود إلى صيغتنا السابقة <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>, الآن حتى إذا كان <Math><MathI>x</MathI> = 2</Math>, لا يمكننا الاعتماد على أن <Math><MathI>y</MathI> = 4</Math>. قد تفشل اختباراتنا ، وقد يصبح المستخدمون مشوشين, وقد تسقط الطائرات من السماء - يمكنك رؤية كيف يمكن أن يؤدي ذلك إلى خلل مربك!

يمكنك إصلاح هذا العنصر عن طريق [تمرير `guest` كخاصية](/learn/passing-props-to-a-component):

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>كوب شاي للضيف رقم {guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

الآن يعتبر المكوّن الخاص بك نقيًا، حيث أن JSX الذي يُرجعه يعتمد فقط على خاصية `guest`.

بشكل عام، لا يجب عليك أن تتوقع أن يتم تصيير المكوّنات الخاصة بك بترتيب معين. لا يهم إذا قمت بطلب <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> قبل أو بعد <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math>: ستتم حل كلا الصيغ بشكل مستقل عن بعضهما البعض. بنفس الطريقة، يجب على كل مكوّن "أن يفكر لنفسه" فقط، ولا يحاول التنسيق أو الاعتماد على المكوّنات الأخرى أثناء التصيير. التصيير مثل امتحان مدرسي: يجب على كل مكوّن حساب JSX بمفرده!

<DeepDive>

#### اكتشاف الحسابات غير النقية باستخدام الوضع الصارم {/*detecting-impure-calculations-with-strict-mode*/}

على الرغم من أنه قد لا تكون قد استخدمت جميعها بعد, في React هناك ثلاثة أنواع من المدخلات التي يمكنك قراءتها أثناء التصيير: [الخصائص](/learn/passing-props-to-a-component), [الحالة](/learn/state-a-components-memory), و [السياق.](/learn/passing-data-deeply-with-context) يجب عليك دائمًا معاملة هذه المدخلات على أنها للقراءة فقط.

عندما تريد *تغيير* شيء ما استجابة لإدخال المستخدم، يجب عليك [تعيين حالة](/learn/state-a-components-memory) بدلاً من الكتابة في متغير. يجب ألا تقوم بتغيير المتغيرات أو الكائنات الموجودة مسبقًا أثناء تصيير المكوّن الخاص بك.

React يوفر "وضعًا صارمًا"(Strict Mode) يقوم فيه باستدعاء دالة كل مكوّن مرتين أثناء التطوير. **من خلال استدعاء وظائف المكوّن مرتين، يساعد الوضع الصارم في العثور على المكوّنات التي تخالف هذه القواعد.**

لاحظ كيف عرض المثال الأصلي "Guest #2", "Guest #4", و "Guest #6" بدلاً من "Guest #1", "Guest #2", و "Guest #3". كانت الدالة الأصلية غير نقية، لذا تعطلت عند استدعاءها مرتين. ولكن الإصدار النقي المُصلح يعمل حتى إذا تم استدعاء الوظيفة مرتين. **الدوال النقية تقوم بالحساب فقط، لذلك لن يتغير أي شيء عند استدعائها مرتين**--تمامًا مثل استدعاء `double(2)` مرتين لن يتغير ما يتم إرجاعه، وحل <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> مرتين لن يغير ما هو <MathI>y</MathI>. نفس المدخلات، نفس المخرجات. دائمًا.

الوضع الصارم لا يؤثر في الإنتاج، لذلك لن يبطئ التطبيق لمستخدمينك. يمكنك الانضمام إلى الوضع الصارم, عن طريق تغليف المكّون الجذر(root component) الخاص بك في `<React.StrictMode>`. تفعل بعض الإطارات ذلك افتراضيًا.

</DeepDive>

### التغيير المحلي: سر صغير لمكوّناتك {/*local-mutation-your-components-little-secret*/}

في المثال أعلاه، كانت المشكلة في أن المكوّن قام بتغيير متغير *موجود مسبقًا* أثناء التصيير. يُطلق عليها في كثير من الأحيان **"طفرة"** لجعلها تبدو أكثر رعبًا. الدوال النقية لا تغيّر المتغيرات خارج نطاق الدالة أو الكائنات التي تم إنشاؤها قبل الاستدعاء - هذا يجعلها غير نقية!

ومع ذلك, **فمن المسموح تمامًا بتغيير المتغيرات والكائنات التي قمت بإنشائها *فقط* خلال التصيير** في هذا المثال, قم بإنشاء `[]` مصفوفة, وعيينها إلى متغير  `cups`, ثم ادفع `(push)` اثني عشر كوبًا فيها:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>كوب شاي للضيف رقم {guest}</h2>;
}

export default function TeaGathering() {
  const cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

إذا تم إنشاء متغير `cups` او `[]` مصفوفة خارج دالة `TeaGathering` فستكون هذه مشكلة كبيرة! ستقوم بتغيير كائن *موجود مسبقًا* عند دفع العناصر في تلك المصفوفة.

ومع ذلك, فإنه يعد أمرًا صحيحًا لأنك قمت بإنشائهم *خلال نفس التصيير*, داخل `TeaGathering`. لن يعرف أي كود خارج `TeaGathering` ابدًا أن هذا حدث. يُطلق على هذا **"التغيير المحلي"**—هو مثل سر صغير لمكوّناتك.

## اين يمكنك التسبب بآثار جانبية {/*where-you-_can_-cause-side-effects*/}

على الرغم من أن البرمجة الوظيفية تعتمد بشدة على النقاء، إلا أنه في نقطة ما، في مكان ما ،يجب أن يتغير _شيء_. هذه هي النقطة من البرمجة! هذه التغييرات - تحديث الشاشة، بدء الرسوم المتحركة، تغيير البيانات - تسمى **الآثار الجانبية** إنها أشياء تحدث _"على الجانب"_, وليس خلال التصيير.

في React, **تنتمي الآثار الجانبية عادةً داخل [معالجات الأحداث(event handlers).](/learn/responding-to-events)** معالجات الأحداث هي الدوال التي يقوم React بتشغيلها عندما تقوم بإجراء بعض الإجراءات—على سبيل المثال، عند النقر فوق زر. على الرغم من أن معالجات الأحداث يتم تعريفها *داخل* المكوّن الخاص بك، إلا أنها لا تعمل *خلال* التصيير! **لذلك، فإن معالجات الأحداث لا يجب أن تكون نقية.**

إذا استنفذت كل الخيارات الأخرى ولم تتمكن من العثور على معالج أحداث مناسب للآثار الجانبية، فيمكنك ربطها على الJSX المُرجَع الخاص بك باستدعاء[`useEffect`](/reference/react/useEffect) في مكوّنك. يخبر هذا React بتنفيذها لاحقًا، بعد التصيير، عندما يسمح بالآثار الجانبية. **ومع ذلك، يجب أن يكون هذا النهج هو خيارك الأخير.**

عندما يكون ذلك ممكنًا، حاول التعبير عن منطقك فقط من خلال التصيير. ستتفاجأ الى اي مدى يمكن لهذا أن يأخذك! 

<DeepDive>

#### لماذا يهتم React بالنقاء؟ {/*why-does-react-care-about-purity*/}

يتطلب كتابة الدوال النقية بعض العادات والانضباط. ولكنه يفتح أيضًا فرصًا رائعة:

* يمكن لمكوّناتك أن تعمل في بيئة مختلفة - على سبيل المثال، على الخادم! نظرًا لأنها تعيد نفس النتيجة لنفس المدخلات، يمكن لمكوّن واحد أن يخدم العديد من طلبات المستخدم.
* يمكنك تحسين الأداء من خلال [تخطي تصيير](/reference/react/memo) المكوّنات التي لم تتغير مدخلاتها. هذا آمن لأن الدوال النقية تعيد نفس النتائج دائمًا، لذلك فهي آمنة للتخزين المؤقت (cache).
* إذا تغيرت بعض البيانات في منتصف تصيير شجرة مكوّنات عميقة، يمكن لـReact إعادة بدء التصيير دون إضاعة الوقت لإنهاء التصيير القديم. يجعل النقاء من الآمن التوقف عن الحساب في أي وقت.

كل الميزات الجديدة التي نقوم ببنائها في React تستفيد من النقاء. من جلب البيانات إلى الرسوم المتحركة إلى الأداء، الحفاظ على المكوّنات نقية يطلق العنان لقوة نموذج React.

</DeepDive>

<Recap>

* يجب أن يكون المكوّن نقيًا، مما يعني:
  * **يهتم بأمره الخاص.** لا يجب أن يغير أي كائنات أو متغيرات كانت موجودة قبل التصيير.
  * **نفس المدخلات تؤدي لنفس المخرجات.** باعطاء نفس المدخلات، يجب على المكوّن أن يعيد دائمًا نفس JSX. 
*  يمكن أن يحدث التصيير في أي وقت ، لذلك لا يجب أن تعتمد المكوّنات على تسلسل التصيير لبعضها البعض.
* لا يجب تغيير أي من المدخلات التي تستخدمها المكوّنات الخاصة بك للتصيير. ويشمل ذلك الخصائص والحالة والسياق. لتحديث الشاشة ، استخدم, ["set" state](/learn/state-a-components-memory) بدلاً من تغيير الكائنات الموجودة مسبقًا.
* يجب ان تسعى للتعبير عن منطق المكوّن في الJSX الذي تعيده. عندما تحتاج إلى "تغيير الأشياء" ، عادةً ما تريد القيام بذلك في معالج الحدث(event listener). كخيار أخير ، يمكنك استخدام `useEffect`.
* يتطلب كتابة الدوال النقية بعض الممارسة ، ولكنه يطلق العنان لقوة نموذج React.

</Recap>


  
<Challenges>

#### إصلاح ساعة مكسورة {/*fix-a-broken-clock*/}

يحاول هذا المكوّن تعيين فئة(class) CSS لـ `<h1>` إلى `"night"` خلال الفترة من منتصف الليل إلى السادسة صباحًا، و `"day"` في جميع الأوقات الأخرى. ومع ذلك ، لا يعمل. هل يمكنك إصلاح هذا المكوّن؟

يمكنك التحقق مما إذا كان حلك يعمل عن طريق تغيير المنطقة الزمنية للحاسوب مؤقتًا. عندما يكون الوقت الحالي بين منتصف الليل والسادسة صباحًا ، يجب أن تكون الساعة قد عكست الوانها!

<Hint>

التصيير هو *حساب*، لا يجب أن يحاول "القيام" بأشياء. هل يمكنك التعبير عن نفس الفكرة بطريقة مختلفة؟

</Hint>

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  const hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
    </h1>
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
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

يمكنك إصلاح هذا المكوّن عن طريق حساب ال`className` وتضمينه في المَخْرَج الذي تقوم بإرجاعه

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  const hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
    </h1>
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
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

في هذا المثال، لم يكن الآثر الجانبي (تعديل DOM) ضروريًا على الإطلاق. كان عليك فقط إرجاع JSX.

</Solution>

#### اصلح الملف الشخصي المكسور {/*fix-a-broken-profile*/}

يتم تصيير مكوّنين للملف الشخصي `Profile` جنبًا إلى جنب ببيانات مختلفة. اضغط على "Collapse" في الملف الشخصي الأول ، ثم "مدده". ستلاحظ أن الملف الشخصيين يعرضان الآن نفس الشخص. هذا خطأ.

ابحث عن سبب الخطأ وأصلحه.

<Hint>

الكود المعطوب في ملف `Profile.js`. تأكد من قراءته بالكامل من الأعلى إلى الأسفل!

</Hint>

<Sandpack>

```js src/Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'سوبرامانيان تشاندراسيخار',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'كريولا كاثرين جونسون',
      }} />
    </>
  )
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

المشكلة هي أن مكوّن `Profile` يكتب على متغير موجود مسبقًا يسمى `currentPerson`, ويقرأ المكوّنان `Header` و `Avatar` منه. هذا يجعل *الثلاثة منها* غير نقية وصعبة التنبؤ بها.

لإصلاح الخطأ ، احذف المتغير `currentPerson`. بدلاً من ذلك ، قم بتمرير جميع المعلومات من `Profile` إلى `Header` و `Avatar` عبر الخصائص. ستحتاج إلى إضافة خاصية شخص `person` لكل من المكوّنين وتمريرها حتى النهاية.

<Sandpack>

```js src/Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'سوبرامانيان تشاندراسيخار',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'سوبرامانيان تشاندراسيخار',
      }} />
    </>
  );
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

تذكر أن React لا يضمن تنفيذ دوال المكوّنات في أي ترتيب معين ، لذلك لا يمكنك التواصل بينهم عن طريق تعيين المتغيرات. يجب أن يحدث كل التواصل من خلال الخصائص.

</Solution>

#### أصلح علبة قصة مكسورة {/*fix-a-broken-story-tray*/}

يطلب منك الرئيس التنفيذي لشركتك إضافة "قصص" إلى تطبيق الساعة الخاص بك على الإنترنت ، ولا يمكنك الرفض. لقد كتبت مكوّن `StoryTray` الذي يقبل قائمة من القصص `stories` ، تليها "إنشاء قصة" العنصر النائب.

قمت بتنفيذ "إنشاء قصة" العنصر النائب عن طريق دفع قصة وهمية أخرى في نهاية مصفوفة القصص `stories` التي تتلقاها كخاصية. ولكن لسبب ما ، يظهر "إنشاء قصة" أكثر من مرة. اصلح المشكلة.

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'إنشاء قصة'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

<<<<<<< HEAD
let initialStories = [
  {id: 0, label: "قصة عنكيت" },
  {id: 1, label: "قصة تايلور" },
=======
const initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
>>>>>>> a5181c291f01896735b65772f156cfde34df20ee
];

export default function App() {
  const [stories, setStories] = useState([...initialStories])
  const time = useTime();

  // خدعة: منع الذاكرة من النمو إلى الأبد أثناء قراءة الوثائق.
  // نحن نكسر قواعدنا الخاصة هنا.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

لاحظ كيف يتم إضافة "إنشاء قصة" *مرتين* في كل مرة يتم فيها تحديث الساعة. هذا يشير إلى أن لدينا تغيير خلال التصصير - يقوم الوضع الصارم (Strict Mode) بنداء المكوّنات مرتين لجعل هذه المشكلات أكثر وضوحًا.

الدالة `StoryTray` ليست نقية. من خلال استدعاء `push` على مصفوفة القصص `stories` التي تم تلقيها (خاصية!), فإنه يتم تغيير كائن تم إنشاؤه *من قبل* بدء `StoryTray` في التصيير. هذا يجعله غير صحيح وصعب جدًا التنبؤ به.

أبسط إصلاح هو عدم لمس المصفوفة على الإطلاق ، وتصيير "إنشاء قصة" بشكل منفصل:

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>إنشاء قصة</li>
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

<<<<<<< HEAD
let initialStories = [
  {id: 0, label: "قصة عنكيت" },
  {id: 1, label: "قصة تايلور" },
=======
const initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
>>>>>>> a5181c291f01896735b65772f156cfde34df20ee
];

export default function App() {
  const [stories, setStories] = useState([...initialStories])
  const time = useTime();

  // خدعة: منع الذاكرة من النمو إلى الأبد أثناء قراءة الوثائق.
  // نحن نكسر قواعدنا الخاصة هنا.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

بدلًا عن ذلك ، يمكنك إنشاء مصفوفة _جديدة_ (عن طريق نسخ الحالية) قبل دفع عنصر فيها:

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
<<<<<<< HEAD
  // انسخ المصفوفة!
  let storiesToDisplay = stories.slice();
=======
  // Copy the array!
  const storiesToDisplay = stories.slice();
>>>>>>> a5181c291f01896735b65772f156cfde34df20ee

  // لا يؤثر على المصفوفة الأصلية:
  storiesToDisplay.push({
    id: 'create',
    label: 'إنشاء قصة'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

<<<<<<< HEAD
let initialStories = [
  {id: 0, label: "قصة عنكيت" },
  {id: 1, label: "قصة تايلور" },
=======
const initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
>>>>>>> a5181c291f01896735b65772f156cfde34df20ee
];

export default function App() {
  const [stories, setStories] = useState([...initialStories])
  const time = useTime();

  // خدعة: منع الذاكرة من النمو إلى الأبد أثناء قراءة الوثائق.
  // نحن نكسر قواعدنا الخاصة هنا.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

هذا يحافظ على تغييرك محليًا ويجعل دالة التصيير الخاصة بك نقية. ومع ذلك ، لا يزال عليك أن تكون حذرًا: على سبيل المثال ، إذا حاولت تغيير أي من العناصر الموجودة في المصفوفة ، فسيتعين عليك استنساخ تلك العناصر أيضًا.

من المفيد تذكر العمليات التي تؤثر على المصفوفات والتي لا تؤثر عليها. على سبيل المثال ، ستؤثر `push` و `pop` و `reverse` و `sort` على المصفوفة الأصلية ، لكن `slice` و `filter` و `map` ستقوم بإنشاء مصفوفة جديدة.

</Solution>

</Challenges>
