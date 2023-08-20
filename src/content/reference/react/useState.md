---
title: useState
---

<Intro>

 `useState` هو Hook في React يتيح لك إضافة [متغير حالة](/learn/state-a-components-memory) إلى مكونك

```js
const [state, setState] = useState(initialState);
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `useState(initialState)` {/*usestate*/}


استدعِ `useState` في الطبقة العليا لمكونك لتعريف متغير الحالة.

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

المعتاد هو تسمية متغيرات الحالة بشكل مثل `[something, setSomething]` باستخدام [تفكيك المصفوفات](https://javascript.info/destructuring-assignment)

[انظر المزيد من الأمثلة أدناه](#usage)

#### المعاملات {/*parameters*/}

* `initialState`:القيمة الأولية التي تريد أن تكون عليها الحالة في البداية. يمكن أن تكون قيمة من أي نوع، ولكن هناك سلوك خاص للدوال. يتم تجاهل هذه القيمة بعد التصييى الأوَّلي.

* إذا مررت بدالة كـ `initialState،` سيتم التعامل معها كحالة التهيئة. يجب أن تكون نقية، ويجب ألا تأخذ أي حجج، ويجب أن تعيد قيمة من أي نوع. سيستدعي React وظيفة البادئ عند تهيئة المكون، ويقوم بتخزين قيمته المرتجعة كحالة أولية. [انظر مثالاً أدناه.](#avoiding-recreating-the-initial-state)

#### المرجعات {/*returns*/}

`useState` ترجع قيمتين 
1. الحالة الحالية. خلال العرض الأولي، ستتطابق مع `initialState` التي قمت بتمريرها.
2. الدالة [`set`](#setstate) التي تمكنك من تحديث الحالة إلى قيمة مختلفة وتشغيل إعادة العرض.

#### التحذيرات {/*caveats*/}

* `useState` هو Hook، لذلك يمكنك تسميتها فقط *** في المستوى الأعلى من مكوناتك *** أو الخطاطيف الخاصة بك. لا يمكنك تسميتها داخل الحلقات أو الظروف. إذا كنت بحاجة إلى ذلك، استخراج عنصر جديد وانقل الدولة فيه.
* في الوضع المقيد، يستدعي React *** وظيفة بدء التشغيل الخاصة بك مرتين *** من أجل [مساعدتك في العثور على الشوائب العرضية.] هذا سلوك تطويري فقط ولا يؤثر على الإنتاج. إذا كانت وظيفتك المبدئة نقية (كما ينبغي أن تكون)، فلا ينبغي أن يؤثر ذلك على السلوك. النتيجة من إحدى المكالمات سيتم تجاهلها.

---

### `set` مثل, الوظائف `setSomething(الحالة التالية)` {/*setstate*/}

تسمح لك الدالة `set` التي ترجعها `useState` بتحديث الحالة إلى قيمة مختلفة وتشغيل إعادة التقديم. يمكنك تمرير الحالة التالية مباشرة، أو دالة تحسبها من الحالة السابقة
```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### المعاملات {/*setstate-parameters*/}

* `next state`: القيمة التي تريد أن تكون عليها الحالة. يمكن أن تكون قيمة من أي نوع، ولكن هناك سلوك خاص للدوال.
  * إذا نجحت في اجتياز دالة كـ `next state`، سيتم التعامل معها كدالة _ تحديث. يجب أن تكون نقية، يجب أن تأخذ الحالة المعلقة كحجة وحيدة، ويجب أن تعيد الحالة التالية. رد الفعل سيضع وظيفة التحديث في طابور ويعيد تقديم المكون الخاص بك. خلال العرض التالي، يقوم React بحساب الحالة التالية من خلال تطبيق كل التحديثات الموجودة في قائمة الانتظار على الحالة السابقة. [انظر مثالاً أدناه.](#updating-state-based-on-the-previous-state)

#### المرجعات {/*setstate-returns*/}

الدوال `set` ليس لها قيمة ارتجاعية.

#### التحذيرات {/*setstate-caveats*/}

* الدالة `set` *** تقوم بتحديث متغير الحالة فقط لـ * تقديم *** التالي. إذا قرأت متغير الحالة بعد استدعاء الدالة `set`, [ستظل تحصل على القيمة القديمة](#ive-updated-the-state-but-logging-gives-me-the-old-value) التي كانت على الشاشة قبل استدعائك.

* إذا كانت القيمة الجديدة التي تقدمها مطابقة للحالة الحالية، كما تحددها مقارنة ['Object.is'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)، فإن React سيتخطى *** إعادة تقديم المكون وأبناءه. هذا هو التحسين. على الرغم من أنه في بعض الحالات React قد لا يزال بحاجة إلى استدعاء المكون الخاص بك قبل تخطي الأطفال، فإنه لا ينبغي أن يؤثر على شفرتك.

* React [batches state updates.](/learn/queueing-a-series-of-state-updates) يقوم بتحديث الشاشة بعد أن يقوم جميع معالجي الأحداث بتشغيل *** وتسمية وظائف "المجموعة" الخاصة بهم. وهذا يمنع إعادة العروض المتعددة خلال حدث واحد. في الحالات النادرة التي تحتاج فيها إلى تحديث الشاشة في وقت سابق، على سبيل المثال للوصول إلى DOM، يمكنك استخدام [`flushSync`.](/reference/react-dom/flushSync)

* استدعاء وظيفة `set` أثناء التقديم * مسموح به فقط من داخل مكون التقديم الحالي. سيتجاهل رد الفعل مخرجاته ويحاول على الفور تقديمه مرة أخرى مع الحالة الجديدة. نادرًا ما تكون هناك حاجة إلى هذا النمط، ولكن يمكنك استخدامه للوصول إلى تخزين المعلومات من العروض السابقة *** [انظر مثالاً أدناه.](#storing-information-from-previous-renders)

* في الوضع المقيد، سيستدعي React *** وظيفة التحديث الخاصة بك مرتين *** من أجل [مساعدتك في العثور على الشوائب العرضية.](#my-initializer-or-updater-function-runs-twice)  هذا سلوك تطويري فقط ولا يؤثر على الإنتاج. إذا كانت وظيفة التحديث الخاصة بك نقية (كما ينبغي أن تكون)، وهذا لا ينبغي أن يؤثر على السلوك. النتيجة من إحدى المكالمات سيتم تجاهلها.

---

## الاستخدام {/*usage*/}

### إضافة حالة إلى مكون {/*adding-state-to-a-component*/}

استدعي `useState` في المستوى الأعلى من المكون الخاص بك لإعلان واحد أو أكثر. [state variables.](/learn/state-a-components-memory)

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

الإتفاقية هي تسمية متغيرات الحالة مثل `[something, setSomething]` باستخدام [array destructuring.](https://javascript.info/destructuring-assignment)

`useState` إرجاع array يحتوي على عنصرين :

1. <CodeStep step={1}>current state</CodeStep> لمتغير الحالة تم تعيينها مبدئياً <CodeStep step={3}>initial state</CodeStep> التي قدمتها.
2.  <CodeStep step={2}>`set` الدالة</CodeStep> التي تسمح لك بتغييرها إلى أي قيمة أخرى كرد فعل للتفاعل.

لتحديث ما يظهر على الشاشة، اتصل بوظيفة الضبط مع بعض الحالات التالية:

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React سيقوم بتخزين `next state` وتقديم المكون مرة أخرى مع القيم الجديدة وتحديث واجهة المستخدم.

<Pitfall>

استدعاء `set` الدالة [**لا** يغيرthe current state في الكود المنفذ بالفعل](#ive-updated-the-state-but-logging-gives-me-the-old-value):

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // Still "Taylor"!
}
```

فهو يؤثر فقط على ما ستعود إليه `useState` بدءاً من تقديم * التالي.

</Pitfall>

<Recipes titleText="Basic useState examples" titleId="examples-basic">

#### العداد (number) {/*counter-number*/}

 رقما .الضغط علي الزر يزيدها state variable `count` في هذا المثال،يحمل 

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<Solution />

#### حقل نص (string) {/*text-field-string*/}


في هذا المثال، المتغير الحالي `text` يحتوي على سلسلة نصية. عند الكتابة، تقوم دالة `handleChange` بقراءة أحدث قيمة مُدخلة من عنصر DOM لإدخال النص في المتصفح، ثم تستدعي دالة `setText` لتحديث الحالة. هذا يسمح لك بعرض النص الحالي `text` أسفل الصندوق.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText('hello')}>
        Reset
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### خانة الاختيار (boolean) {/*checkbox-boolean*/}

في هذا المثال، المتغير الحالي `liked` يحتوي على قيمة منطقية. عند النقر فوق الخانة، تقوم دالة `setLiked` بتحديث المتغير الحالي `liked` بتمكين أو تعطيل خانة اختيار المتصفح. يُستخدم المتغير `liked` لعرض النص أسفل خانة الاختيار.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        I liked this
      </label>
      <p>You {liked ? 'liked' : 'did not like'} this.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### نموذج (متغيرين) {/*form-two-variables*/}

يمكنك إعلان أكثر من متغير حالة واحد في نفس المكون. كل متغير حالة مستقل تماما.
<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### تحديث الحالة بناء على الحالة السابقة {/*updating-state-based-on-the-previous-state*/}

لنفترض أن الـ `age` هو `42`. يتم استدعاء المعالج (handler) هذا بتنفيذ `setAge(age + 1)` ثلاث مرات:

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

ومع ذلك، بعد النقرة الواحدة، سيكون الـ `age` `43` فقط بدلاً من `45`! هذا يحدث لأن استدعاء دالة الضبط (set) [لايحدث تحديثا](/learn/state-as-a-snapshot) المتغير الحالي `age` في الشيفرة القائمة بالفعل. لذا يتحول كل استدعاء `setAge(age + 1)` إلى `setAge(43)`.

لحل هذه المشكلة **يمكنك ان تمرر  *دالة تحديثية*** الي `setAge` بدلا من next stage.

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

هنا, `a => a + 1` هي دالتك التحديثية. تأخذ <CodeStep step={1}>الحالة المعلقة</CodeStep> وتحسب <CodeStep step={2}>next state</CodeStep> من خلالها

React يضع دوال التحديث في [قائمة انتظار (Queue).](/learn/queueing-a-series-of-state-updates) ثم، خلال العرض (render) التالي، سيتم استدعاؤها بنفس الترتيب:

1. `a => a + 1` ستتلقى `42` كحالة معلقة وستعيد `43` كحالة تالية.
2. `a => a + 1` ستتلقى `43` كحالة معلقة وستعيد `44` كحالة تالية.
3. `a => a + 1` ستتلقى `44` كحالة معلقة وستعيد `45` كحالة تالية.
لا توجد تحديثات أخرى معلقة، لذا سيقوم React بتخزين `45` كحالة حالية في النهاية.

بشكل تقليدي، من الشائع تسمية وسيط الحالة المعلقة باستخدام أول حرف من اسم المتغير الحالي، مثل `a` للـ `age`. ومع ذلك، يمكنك أيضًا تسميته بمثل `prevAge` أو أي شيء آخر تجده أوضح.

ربما react [تستدعي دالتك التحديثية مرتين](#my-initializer-or-updater-function-runs-twice) في التطوير للتحقق من أنها [نقية.](/learn/keeping-components-pure)

<DeepDive>

#### هل استخدام المستجدات مفضّل دائما؟ {/*is-using-an-updater-always-preferred*/}

قد تسمع توصية بكتابة الشيفرة دائمًا على النحو التالي `setAge(a => a + 1)` إذا كانت الحالة التي تقوم بتعيينها محسوبة من الحالة السابقة. ليس هناك ضرر في ذلك، ولكنه أيضًا ليس دائمًا ضروريًا.

في معظم الحالات، لا يوجد فرق بين هاتين الطريقتين. تضمن React دائمًا أنه للأحداث المستخدمة بوضوح، مثل النقرات، سيتم تحديث المتغير الحالي `age` قبل النقرة التالية. وهذا يعني أنه لا يوجد خطر أن يرى معالج النقر حالة `age` "غير حديثة" في بداية معالج الحدث.

ومع ذلك، إذا قمت بعمليات تحديث متعددة داخل نفس الحدث، يمكن أن تكون الدوال التحديث مفيدة. كما أنها مفيدة إذا كان الوصول إلى المتغير الحالي نفسه غير ملائم (قد تواجه هذا عند تحسين إعادة العرض).

إذا كنت تفضل التناسق على الصيغة البسيطة إلى حد ما، من المعقول دائمًا كتابة دالة التحديث إذا كانت الحالة التي تقوم بتعيينها محسوبة من الحالة السابقة. إذا تم حسابها من الحالة السابقة لمتغير حالة آخر، قد ترغب في دمجهما في كائن واحد و [استخدام منظم (reducer).](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes titleText="
 الفرق بين تمرير حديث وتمرير الولاية التالية مباشرة" titleId="examples-updater">

#### تمرير وظيفة التحديث {/*passing-the-updater-function*/}

في هذا المثال، يتم تمرير دالة التحديث، لذا يعمل زر "+3" بشكل صحيح.
<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

#### تمرير الحالة التالية مباشرةً {/*passing-the-next-state-directly*/}

في هذا المثال، **لا يتم** تمرير دالة التحديث، لذا زر "+3" **لا يعمل كما هو مقصود**.
<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(age + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### تحديث الأشياء والمصفوفات في الحالة {/*updating-objects-and-arrays-in-state*/}

بإمكانك وضع كائنات ومصفوفات في الحالة. في React، يُعتبر الحالة "للقراءة فقط"، لذا **يجب عليك أن تستبدلها بدلاً من أن تُجفّف (تغيّر) الكائنات الحالية**. على سبيل المثال، إذا كان لديك كائن `form` في الحالة، فلا تُجفّفه:
```js
// 🚩 Don't mutate an object in state like this:
form.firstName = 'Taylor';
```

بدلاً من ذلك، استبدل الكائن بأكمله عن طريق إنشاء كائن جديد:

```js
// ✅ Replace state with a new object
setForm({
  ...form,
  firstName: 'Taylor'
});
```

اقرأ [تحديث الكائنات في الحالة](/learn/updating-objects-in-state) و [تحديث arrays في الحالة](/learn/updating-arrays-in-state) to learn more.

<Recipes titleText="أمثلة على objects وarrays في الحالة" titleId="examples-objects">

#### النموذج (كائن) {/*form-object*/}

في هذا المثال، المتغير الحالي `form` يحتوي على كائن. كل حقل إدخال (input) له معالج تغيير يقوم باستدعاء `setForm` بالحالة التالية للنموذج بأكمله. بناءً على نحو آمن، يضمن نمط الانتشار `{ ...form }` أن الكائن في الحالة يتم استبداله بدلاً من التغيير في مكوناته.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        First name:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Last name:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Email:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### النموذج (كائن متداخل) {/*form-nested-object*/}

في هذا المثال، الحالة متداخلة بشكل أكبر. عند تحديث الحالة المتداخلة، يجب عليك إنشاء نسخة من الكائن الذي تقوم بتحديثه، بالإضافة إلى أي كائنات "تحتوي" عليه على طول الطريق نحو الأعلى. اقرأ[تحديث كائن متداخل](/learn/updating-objects-in-state#updating-a-nested-object) to learn more.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<Solution />

#### قائمة (array) {/*list-array*/}


 في هذا المثال، يحمل متغير الحالة `todos` مصفوفة. كل معالج أزرار يدعو 'setTodos' مع الإصدار التالي من تلك المجموعة. `[…todos]` انتشار بناء الجملة،` todos.map() `و `todos.filter()` يضمن استبدال مصفوفة الحالة بدلاً من تحوّرها.
<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

#### كتابة موجز منطق التحديث مع  Immer {/*writing-concise-update-logic-with-immer*/}

إذا كان تحديث المصفوفات والأشياء بدون طفرة يشعر بالملل، يمكنك استخدام مكتبة مثل[Immer](https://github.com/immerjs/use-immer) لتقليل الكود المتكرر. تسمح لك Immer بكتابة كود مختصر كما لو كنت تحور الكائنات، ولكن تحت غطاء المحرك تقوم بتحديثات غير قابلة للتغيير:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### تجنب إعادة الحالة الأولية {/*avoiding-recreating-the-initial-state*/}

React يحفظ  الحالة الأولية مرة واحدة ويتجاهلها في العروض التالية.

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

على الرغم من أن نتيجة `createInitialTodos()`تستخدم فقط للترجمة الأولية، إلا أنك لا تزال تدعو هذه الدالة في كل ترجمة. هذا يمكن أن يكون تبذير إذا كان يخلق صفائف كبيرة أو إجراء حسابات مكلفة.

لحل هذه المشكلة  **يمكنك تمريرها كوظيفة _initializer_ function** الي `useState` بدلا من :

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

Notice that you’re passing `createInitialTodos`, which is the *function itself*, and not `createInitialTodos()`, which is the result of calling it. If you pass a function to `useState`, React will only call it during initialization.

ربما React [تستدعي initializer الخاص بك مرتين](#my-initializer-or-updater-function-runs-twice) in development to verify that they are [pure.](/learn/keeping-components-pure)

<Recipes titleText="الفرق بين تمرير المبدئ وتمرير الحالة الأولية مباشرة" titleId="examples-initializer">

#### تمرير initializer function {/*passing-the-initializer-function*/}

هذا المثال يمر دالة البادئ، لذلك يتم تشغيل وظيفة `createInitialTodos` فقط أثناء التهيئة. وهو لا يعمل عند إعادة عرض المكون كما هو الحال عند الكتابة في الإدخال
<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### تمرير the initial state مباشرة {/*passing-the-initial-state-directly*/}

هذا المثال **لا يقوم** بتمرير وظيفة المبتدئ، لذلك يتم تشغيل وظيفة 'createInitialTodos' على كل عرض، كما هو الحال عندما تكتب في الإدخال. لا يوجد فرق ملحوظ في السلوك، ولكن هذا الرمز أقل كفاءة.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### إعادة ضبط الحالة بمفتاح {/*resetting-state-with-a-key*/}

غالبًا ما ستواجه السمة `key` عندما [عرض القوائم.](/learn/rendering-lists)ومع ذلك، إنها تخدم أيضًا غرضًا آخر

بإمكانك **إعادة ضبط حالة المكوّن عن طريق تمرير مفتاح `key` مختلف للمكوّن.** في هذا المثال، يقوم زر إعادة الضبط بتغيير متغير الحالة `version`، الذي نمرره كـ `key` للمكوّن `Form`. عندما يتغيّر المفتاح، يقوم React بإعادة إنشاء مكوّن `Form` (وجميع أطفاله) من البداية، لذا تتم إعادة ضبط حالته.

اقرأ [preserving and resetting state](/learn/preserving-and-resetting-state) لتعلم المزيد.

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hello, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### تخزين المعلومات من العروض السابقة {/*storing-information-from-previous-renders*/}

عادةً، ستقوم بتحديث الحالة في معالجي الأحداث. ومع ذلك، في الحالات النادرة قد ترغب في ضبط الحالة استجابةً لعملية العرض، على سبيل المثال، قد ترغب في تغيير متغير الحالة عندما تتغير الخاصية (prop).

في معظم الحالات، لن تحتاج إلى ذلك:

* **إذا كان بإمكانك حساب القيمة التي تحتاجها بالكامل من الخصائص الحالية أو حالة أخرى, [فاحذف هذه الحالة المتكررة بشكل كامل.](/learn/choosing-the-state-structure#avoid-redundant-state)** إذا كنت قلقًا من إعادة الحساب بشكل متكرر، فال [`useMemo` Hook](/reference/react/useMemo) يمكنه المساعدة.
* إذا كنت ترغب في إعادة ضبط حالة شجرة المكوّن بأكمله, [قم بتمرير`key` مختلف إلى المكوّن الخاص بك.](#resetting-state-with-a-key)
* إذا أمكنك ذلك، قم بتحديث كل الحالات ذات الصلة في معالجي الأحداث.

في الحالة النادرة التي لا ينطبق أي من هذه الحالات، هناك نمط يمكنك استخدامه لتحديث الحالة استنادًا إلى القيم التي تم عرضها حتى الآن، من خلال استدعاء دالة `set` أثناء عملية عرض المكون.

إليك مثال. هذا المكون `CountLabel` يعرض الخاصية `count` التي يتم تمريرها إليه:

```js CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

لنفترض أنك تريد أن تعرض ما إذا كان عداد قد *زاد أو نقص* منذ آخر تغيير. الخاصية `count` لا تُخبرك بذلك، تحتاج إلى تتبع القيمة السابقة لها. قم بإضافة متغير الحالة `prevCount` لتتبعها. وأضف متغير حالة آخر يسمى `trend` لتخزين ما إذا كان العداد قد زاد أو نقص. قارن `prevCount` مع `count` وإذا لم تكن متساويين، قم بتحديث كل من `prevCount` و `trend`. الآن يمكنك عرض العدد الحالي و*كيفية تغييره منذ آخر عرض*.

<Sandpack>

```js App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

لاحظ أنه إذا استدعيت دالة 'set' أثناء التقديم، يجب أن تكون داخل حالة مثل 'prevCount!== count'، ويجب أن يكون هناك نداء مثل 'setPrevCount(count)' داخل الحالة. وإلا فسيعود جزئك في حلقة حتى ينهار أيضا، يمكنك فقط تحديث حالة مكون تقديم * حاليا على النحو التالي. استدعاء وظيفة 'set' لمكون * آخر أثناء التقديم هو خطأ. وأخيرًا، يجب أن تظل المكالمة المضبوطة [حالة التحديث دون حدوث طفرة](#updating-objects-and-arrays-in-state) -- هذا لا يعني أنه يمكنك كسر قواعد أخرى من [الدوال النقية.](/learn/keeping-components-pure)

يمكن أن يكون هذا النمط من الصعب فهمه وعادة ما يكون من الأفضل تجنبه. ومع ذلك، فإنه أفضل من تحديث الحالة في التأثير. عندما تقوم باستدعاء وظيفة `set` أثناء التقريب، ستقوم `React` بإعادة تقديم ذلك المكون مباشرة بعد خروج المكون الخاص بك مع عبارة `return` وقبل تقديم الأطفال. بهذه الطريقة، لا يحتاج الأطفال إلى التوليد مرتين. وسيستمر تنفيذ بقية وظيفة المكون الخاصة بك (وسيتم التخلص من النتيجة). وإذا كانت حالتك دون كل مكالمات هوك، يمكنك ان تضيف `return` مبكرا ؛ لتعود الى العرض في وقت ابكر.

---

## استكشاف الأخطاء وإصلاحها {/*troubleshooting*/}


### لقد قمت بتحديث الحالة، ولكن عندما أقوم بتسجيل البيانات، يعطيني القيمة القديمة. {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

استدعاء دالة `set`  **لا يقوم بتغيير الحالة في الكود الحالي**:

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Request a re-render with 1
  console.log(count);  // Still 0!

  setTimeout(() => {
    console.log(count); // Also 0!
  }, 5000);
}
```

ذلك بسبب [الحالات تتصرف كصورة فوتوغرافية.](/learn/state-as-a-snapshot) تحديث الحالة يُطلب عرضًا آخر بقيمة حالة جديدة، ولكنه لا يؤثر على متغير `count` في جافا سكريبت في معالج الأحداث الذي يعمل بالفعل.

إذا كنت بحاجة إلى استخدام الحالة التالية، يمكنك حفظها في متغير قبل تمريرها إلى دالة `set`:

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### لقد قمت بتحديث الحالة، ولكن الشاشة لا تُحدّث؟ {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

React سوف **تتجاهل تحديثك إذا كانت الحالة التالية مساوية للحالة السابقة ,** كما يتم تحديدها بواسطة [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) عملية المقارنة. يحدث ذلك عادةً عندما تقوم بتغيير كائن أو مصفوفة في الحالة مباشرةً:

```js
obj.x = 10;  // 🚩 Wrong: mutating existing object
setObj(obj); // 🚩 Doesn't do anything
```

لقد قمت بتغيير الكائن `obj` الموجود وقمت بتمريره مرة أخرى إلى `setObj`، لذا قام React بتجاهل التحديث. لتصحيح هذا، يجب عليك التأكد دائمًا من أنك تقوم بإنشاء نسخة جديدة من الكائن قبل تمريره إلى `setObj` [_بدلاً من تعديلها، قم بإستبدال الكائنات والمصفوفات في الحالة.](#updating-objects-and-arrays-in-state):

```js
// ✅ Correct: creating a new object
setObj({
  ...obj,
  x: 10
});
```

---

### أنت تواجه خطأ "عدد كبير جدًا من عمليات إعادة العرض". {/*im-getting-an-error-too-many-re-renders*/}

قد تحصل على خطأ يقول: "عدد كبير جدًا من عمليات إعادة العرض. تحدّ React عدد عمليات العرض لمنع الحلقة اللانهائية." عادةً ما يعني ذلك أنك تقوم بضبط الحالة بشكل غير مشروط *أثناء عملية العرض*، لذلك يدخل المكون في حلقة: عرض، ضبط الحالة (الذي يسبب عملية عرض جديدة)، عرض، ضبط الحالة (الذي يسبب عملية عرض جديدة)، وهكذا. في كثير من الأحيان، يتسبب هذا في حدوث خطأ أثناء تحديد معالج الأحداث:

```js {1-2}
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

إذا لم تتمكن من العثور على سبب هذا الخطأ، انقر على السهم المجاور للخطأ في وحدة التحكم وابحث في مكدس الجافاسكريبت للعثور على استدعاء دالة `set` المحدد الذي يسبب الخطأ.

---

### مُبدّل البداية (initializer) أو دالة التحديث (updater) تعمل مرتين. {/*my-initializer-or-updater-function-runs-twice*/}

في [الوضع الصارم](/reference/react/StrictMode), سوف تستدعي Reactfبعص الدوال مرتين بدلاً من مرة واحدة

```js {2,5-6,11-12}
function TodoList() {
  // This component function will run twice for every render.

  const [todos, setTodos] = useState(() => {
    // This initializer function will run twice during initialization.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // This updater function will run twice for every click.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

هذا أمر متوقع ولا يجب أن يؤذي الكود الخاص بك

هذا **development-only** السلوك يساعدك في الحفاظ على [بقاء المكونات نقية.](/learn/keeping-components-pure) React يستخدم نتيجة إحدى الاستدعاءات ويتجاهل نتيجة الاستدعاء الأخرى. طالما كانت دوال مكونك، ومبدّل البداية، ومبدّل التحديث نقية، فإن هذا لن يؤثر على منطقك. ومع ذلك، إذا كانت هذه الدوال غير نقية عن طريق الخطأ، فإن هذا يساعدك في اكتشاف الأخطاء.

على سبيل المثال، دالة مبدل التحديث غير النقية تقوم بتعديل مصفوفة في الحالة:

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Mistake: mutating state
  prevTodos.push(createTodo());
});
```

نظرًا لأن React تستدعي دالة مبدل التحديث مرتين، سترى أن المهمة Todo تمت إضافتها مرتين، وبالتالي ستعلم أن هناك خطأً. في هذا المثال، يمكنك تصحيح الخطأ عن طريق: [استبدال المصفوفة بدلاً من تعديلها.](#updating-objects-and-arrays-in-state):

```js {2,3}
setTodos(prevTodos => {
  // ✅ Correct: replacing with new state
  return [...prevTodos, createTodo()];
});
```

الآن بما أن دالة مبدل التحديث هذه نقية، فإن استدعائها مرة إضافية لا يؤثر في السلوك. وهذا هو السبب في أن استدعاء React لها مرتين يساعدك في اكتشاف الأخطاء. **فقط دوال المكون، ومبدل البداية، ومبدل التحديث يجب أن تكون نقية.** لا يجب أن تكون معالجات الأحداث نقية، لذلك لن يقوم React أبدًا باستدعاء معالجات الأحداث الخاصة بك مرتين.

اقرأ [الحفاظ على نقاء المكونات](/learn/keeping-components-pure)لتعلم المزيد.

---

### أنا أحاول تعيين الحالة إلى دالة، ولكنها تتم استدعاؤها بدلاً من ذلك {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

لا يمكنك وضع دالة في الحالة بهذه الطريقة:

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

نظرًا لأنك تمرر دالة، يفترض React أن `someFunction` تمثل[دالة المبدل الأولي](#avoiding-recreating-the-initial-state), وأن `someOtherFunction` هي [دالة المبدل](#updating-state-based-on-the-previous-state), لذلك يحاول استدعاؤها وتخزين النتيجة. لتخزين الوظيفة فعلياً، يجب وضع `() =>` قبلهما في كلا الحالتين. بذلك سيقوم React بتخزين الوظائف التي تمررها.

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
