---
id: hooks-state
title: استعمال Hook الحالة
permalink: docs/hooks-state.html
next: hooks-effect.html
prev: hooks-overview.html
---

<<<<<<< HEAD
*الخطافات* هي إضافة جديدة إلى الإصدار 16.8 في React، إذ تسمح لك باستعمال ميزة الحالة وميزات React الأخرى دون كتابة أي صنف.
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [State: A Component's Memory](https://beta.reactjs.org/learn/state-a-components-memory)
> - [`useState`](https://beta.reactjs.org/reference/react/useState)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

*Hooks* are a new addition in React 16.8. They let you use state and other React features without writing a class.
>>>>>>> 19aa5b4852c3905757edb16dd62f7e7506231210

شرحت الصفحة السابقة في قسم [خطاف الحالة](/docs/hooks-intro.html) هذا الخطاف عبر المثال التالي:

```js{4-5}
import React, { useState } from 'react';

function Example() {
  // "count" التصريح عن متغير حالة جديد ندعوه
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

بادئ ذي بدء، سنتعرف على الخطافات عبر موازنة هذه الشيفرة مع الصنف المكافئ لها.

## مثال عن صنف مكافئ لخطاف {#equivalent-class-example}

إن استعملت الأصناف في React من قبل، فيجب أن تكون الشيفرة التالية مألوفةً لديك:

```js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

الحالة الأولية تكون  `{ count: 0 }`، ونعمل على زيادة `state.count` عندما يضغط المستخدم على زر يستدعي `this.setState()`. سنستعمل أجزاء من هذا الصنف في أقسام لاحقة من هذه الصفحة.

>ملاحظة
>
>قد تتساءل عن سبب استعمالنا مثال عدَّادٍ هنا عوضَ استعمال مثال أكثر واقعية. يكمن السبب في أنَّ هذا المثال يساعدنا على التركيز على الواجهة البرمجية في بداية رحلتنا مع الخطافات.

## الخطافات ومكونات دالة {#hooks-and-function-components}

لنتذكر سويةً، تبدو مكونات دالة في React بالشكل:

```js
const Example = (props) => {
  // تستطيع استعمال الخطافات هنا
  return <div />;
}
```

أو الشكل التالي:

```js
function Example(props) {
  // تستطيع استعمال الخطافات هنا
  return <div />;
}
```

ربما كنت تعرف مسبقًا أنَّ هذه المكونات هي "مكونات عديمة الحالة" (stateless components). نعرِّف الآن إمكانية استعمال حالة React من هذه المكونات، لذا نفضل استعمال الاسم "مكونات دالة".

**لا تعمل** الخطافات داخل الأصناف، ولكن يمكن استعمالها بدلًا من الأصناف نفسها.

## ما هو الخطاف؟ {#whats-a-hook}

يبدأ مثالنا الجديد باستيراد الخطاف `useState` من React:

```js{1}
import React, { useState } from 'react';

function Example() {
  // ...
}
```

**إذًا، ما هو الخطاف تحديدًا؟** الخطاف هو دالة مميزة تمكنك من "تعليق أو ربط" (hook into) ميزات React مع بعضها. على سبيل المثال، `useState` هو خطاف يمكنك من إضافة حالة React إلى مكونات دالة. سنتطرق إلى الخطافات الأخرى لاحقًا.

**متى يمكنني استعمال الخطاف؟** إن كتبت مكون دالة ووجدت أنَّك بحاجة إلى إضافة بعض الحالة له، فستحتاج - سابقًا قبل عصر الخطافات - إلى تحويله إلى صنف. الآن، يمكنك استعمال خطاف داخل مكون دالة موجودة وهو ما سنفعله الآن.

>ملاحظة:
>
>هنالك بعض القواعد المخصَّصة تحدِّد المكان المسموح والمحظور فيه استعمال الخطافات ضمن مكون. سنشرح هذه القواعد بالتفصيل الممل في توثيق [قواعد استعمال الخطافات](/docs/hooks-rules.html).

## التصريح عن متغير حالة {#declaring-a-state-variable}

إن كنا سنستعمل صنفًا، نهيِّئ فيه الحالة `count` إلى 0 عبر ضبط `this.state` إلى `{ count: 0 }` في باني هذا الصنف:

```js{4-6}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

في مكون دالة، لا يمكننا استعمال `this`، لذا لا نستطيع إسناد أو قراءة `this.state`. عوضا عن ذلك، يمكننا استدعاء الخطاف `useState` مباشرةً داخل المكون الخاص بنا:

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // "count" التصريح عن متغير حالة جديد ندعوه
  const [count, setCount] = useState(0);
```

**ماذا يفعل استدعاء `useState` ؟** إنَّه يصرِّح عن "متغير حالة" (state variable). هذا المتغير يدعى `count` ولكن يمكننا أن ندعوه بأي اسم آخر مثل`banana`. هذه طريقة لحفظ بعض القيم بين استدعاءات الدالة، إذ `useState` هي طريقة جديدة لاستعمال الإمكانيات نفسها التي توفرها `this.state` في الصنف. عمومًا، المتغيرات "تختفي" عند اكتمال تنفيذ الدالة وخروجها ولكن متغيرات الحالة تحافظ على قيمتها في React.

**لماذا نمرر وسيطًا إلى useState؟** الوسيط الوحيد الذي يمكن تمريره إلى الخطاف `useState()` هو الحالة الأولية. خلافًا للأصناف، ليس من الضروري أن تكون الحالة كائنًا. يمكننا استعمال عدد أو سلسلة نصية إن كان ذلك ما نحتاجه. في مثالنا، نحتاج إلى عدد ليمثل عدد المرات التي ضغط فيها المستخدم على الزر، لذا مرَّرنا العدد 0 ليكون الحالة الأولية لمتغيرنا. (إن أردنا تخزين قيمتين مختلفتين في حالة، فيمكننا فعل ذلك عبر استدعاء `useState()` مرتين.)

**ما الذي يعيده`useState`؟** إنه يعيد زوجًا من القيم: الحالة الحالية، ودالة تحدِّثها. لهذا السبب، نكتب  `const [count, setCount] = useState()`. هذا الأمر يشبه `this.state.count` و `this.setState` في الصنف، باستثناء أنَّنا نحصل عليهم كزوج من القيم. إن لم تكن الصيغة السابقة التي استعملناها مألوفة لك، فسنتطرق إليها في [آخر هذه الصفحة](/docs/hooks-state.html#tip-what-do-square-brackets-mean).

الآن وقد عرفنا ما الذي يفعله الخطاف `useState` يجب أن تكون الشيفرة التالية مفهومة تمامًا لك:

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // "count" التصريح عن متغير حالة جديد ندعوه
  const [count, setCount] = useState(0);
```

صرَّحنا عن متغير حالة يدعى `count`، وأسندنا القيمة 0 العددية له. ستتذكر React قيمته الحالية بين عمليات إعادة التصيير، وتوفر الحالة الأحدث له للدالة. إن أردنا تحديث قيمة المتغير `count` الحالية، يمكننا استدعاء `setCount`.

>ملاحظة
>
>قد تتسائل عن سبب استعمال الاسم `useState` لهذا الخطاف وليس الاسم `createState`?
>
>الجواب هو أنَّ "إنشاء" (create) لن تكون دقيقة والسبب أنَّ الحالة تُنشَأ عندما يصيَّر المكون أول مرة فقط. في عمليات التصيير اللاحقة، يعطينا الخطاف `useState` القيمة (الحالة) الحالية وإلا لما كنا أطلقنا عليها "حالة" (state) على الإطلاق. هنالك أيضًا سبب متعلق ببدء تسمية الخطافات بالكلمة `use`، وسنتعرف عليه في توثيق [قواعد استعمال الخطافات](/docs/hooks-rules.html).

## قراءة الحالة {#reading-state}

إن أردنا إظهار قيمة المتغير count الحالية في صنف، يمكن أن نقرأ `this.state.count`:

```js
  <p>You clicked {this.state.count} times</p>
```

في دالة، يمكننا استعمال المتغير `count` مباشرةً:


```js
  <p>You clicked {count} times</p>
```

## تحديث الحالة {#updating-state}

في الصنف، نحتاج إلى استدعاء `this.setState()` لتحديث الحالة `count`:

```js{1}
  <button onClick={() => this.setState({ count: this.state.count + 1 })}>
    Click me
  </button>
```

في الدالة، لدينا `setCount` و `count` مسبقًا كمتغيرات، لذا لا تحتاج إلى `this`:

```js{1}
  <button onClick={() => setCount(count + 1)}>
    Click me
  </button>
```

## الخلاصة {#recap}

**لنراجع ما تعلمناه بالمرور على كل سطر من أسطر الشيفرة** والتأكد من فهمنا للخطافات بشكل عام ولخطاف الحالة بشكل خاص:

<!--
  I'm not proud of this line markup. Please somebody fix this.
  But if GitHub got away with it for years we can cheat.
-->
```js{1,4,9}
 1:  import React, { useState } from 'react';
 2:
 3:  function Example() {
 4:    const [count, setCount] = useState(0);
 5:
 6:    return (
 7:      <div>
 8:        <p>You clicked {count} times</p>
 9:        <button onClick={() => setCount(count + 1)}>
10:         Click me
11:        </button>
12:      </div>
13:    );
14:  }
```

* **السطر 1:** استوردنا الخطاف `useState` من React. هذا يمكننا من إبقاء حالة محلية (local state) في مكون دالة.
* **السطر 4:** داخل المكون `Example`، صرَّحنا عن متغير حالة جديد عبر استدعاء الخطاف `useState` Hook. يعيد الخطاف زوجًا من القيم أعطينا لكل من هاتين القيمتين اسمًا. سنتحاج إلى استدعاء المتغير `count` لأنَّه يحمل عدد ضغطات الزر. هيَّأنا هذا المتغير إلى القيمة 0 عبر تمرير هذه القيمة إلى `useState` القيمة الثانية من الزوج الذي يعيده الخطاف هي دالة بحد ذاتها. هذه الدالة تحدِّث المتغير `count` لذا سنطلق عليها `setCount`.
* **السطر 9:** عندما يضغط المستخدم على الزر، تُستدعَى الدالة `setCount` مع القيمة الجديدة. ستعيد React بعد ذلك تصيير المكون `Example` مع تمرير القيمة `count` الجديدة إليه.

قد يبدو للوهلة الأولى أنَّ هذا كثير ويحتاج إلى فهم وتركيز كبيرين. لا تتسرع بالحكم. إن شعرت أنَّك قد فقدت تركيزك أثناء الشرح، حضِّر كوبًا من القهوة ثمَّ اشربه مع إعادة قراءة الشيفرات بدءًا من بداية الدرس وحاول فهم كل سطر منها. نعدك إن نسيت (مؤقتًا) كيفية عمل الحالة في الأصناف ونظرت إلى الشيفرة مجدَّدًا، فستفهمها بشكل كامل.

### إضافة: ما الذي تعنيه الأقواس المعقوفة؟ {#tip-what-do-square-brackets-mean}

لابد أنَّك لاحظ وجود أقواس معقوفة عند التصريح عن متغير حالة:

```js
  const [count, setCount] = useState(0);
```

الأسماء في القسم الأيسر ليست جزءًا من واجهة React البرمجية. يمكنك أن تسمي متغيرات الحالة الخاصة بك بأي اسم تريد:

```js
  const [fruit, setFruit] = useState('banana');
```

هذه الصيغة هي إحدى صيغ JavaScript التي يطلق عليها ["تفكيك المصفوفات"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring). إنَّها تعني أنَّنا نريد إنشاء متغيِّرين جديدين هما: `fruit` و `setFruit`، إذ يعيَّن الأول إلى أول قيمة يعيدها `useState`، والثاني إلى القيمة الثانية المعادة. هذا يكافئ الشيفرة التالية:

```js
  var fruitStateVariable = useState('banana'); // يعيد زوجًا
  var fruit = fruitStateVariable[0]; // أول عنصر من الزوج
  var setFruit = fruitStateVariable[1]; // ثاني عنصر من الزوج
```

عندما صرَّحنا عن متغير حالة مع `useState`، فإنَّ هذا الخطاف يعيد زوجًا من القيم في مصفوفة بعنصرين. العنصر الأولي هو القيمة الحالية، والعنصر الثاني هو الدالة التي تمكننا من تحديثها. استعمال `[0]` و `[1]` للوصول إلى هاتين القيمتين أمرٌ مربك لأنَّ لهما معنى محدَّد. هذا هو سبب استعمالنا أسلوك الإسناد بالتفكيك عوضًا عن ذلك.

>ملاحظة
>
>ربما انتابك شيءٌ من الفضول حول كيفية معرفة React أي مكون يقابل `useState` لمَّا كنا نعيد تمرير أي شي مثل `this` إلى React. لا تقلق، سنجيب عن هذا السؤال وأسئلة أخرى في صفحة [الأسئلة الشائعة حول الخطافات](/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components).

### إضافة: استعمال متغيرات حالة عديدة {#tip-using-multiple-state-variables}

التصريح عن متغيرات حالة كأزواج من `[something, setSomething]` هو أمر عملي وجيد، إذ يسمح لنا بإعطاء أسماء مختلفة لمتغيرات مختلفة للحالة إن أردنا استعمال أكثر من متغير حالة واحد:

```js
function ExampleWithManyStates() {
  // التصريح عن متغيرات حالة عديدة
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```

في هذا المكون في الشيفرة الآنفة، لدينا المتغيرات `age`, `fruit`, و `todos` بوصفها متغيرات حالة، ويمكننا تحديث كل منها على حدة:

```js
  function handleOrangeClick() {
    // this.setState({ fruit: 'orange' }) يشبه
    setFruit('orange');
  }
```

**لا يتوجب عليه** استعمال عدة متغيرات حالة. متغيرات الحالة يمكنها أن تحوي كائنات ومصفوفات، لذا لا يزال بإمكانك تجميع البيانات المترابطة مع بعضها بعضًا. على أي حال، تحديث متغير حالة يستبدل دومًا قيمته بدلًا من دمجها، وهذا يخالف سلوك `this.setState` في الأصناف.

أعطينا الكثير من التوصيات حول فصل متغيرات الحالة المستقلة في صفحة [الأسئلة الشائعة حول الخطافات](/docs/hooks-faq.html#should-i-use-one-or-many-state-variables).

## الخطوات التالية {#next-steps}

تعلمنا حول أحد الخطافات التي توفرها React وهو الخطاف `useState`. في أغلب الأحيان، سنشير إليه بالاسم "خطاف الحالة" (State Hook). يسمح لنا هذا الخطاف بإضافة حالة محلية إلى مكونات دالة في React بخطوات بسيطة وشيفرة أقل.

تعلمنا أيضًا القليل حول ماهية الخطافات. كما رأينا، الخطافات هي دوال تمكنك من "تعليق أو ربط" (hook into) ميزات React من مكونات دالة. أسماء الخطافات تبدأ دومًا بالكلمة `use`، وهنالك الكثير من الخطافات التي لم نرها بعد.

**لنكمل الآن وننتقل إلى الخطاف التالي [وهو الخطاف: `useEffect`.](/docs/hooks-effect.html)** يسمح لنا هذا الخطاف بتنفيذ تأثيرات جانبية (side effects) في المكونات، وهو يشبه توابع دورة الحياة في الأصناف.
