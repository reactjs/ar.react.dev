---
title: دالة useState
---

<Intro>

`useState` هو Hook في React يتيح لك إضافة [متغير حالة](/learn/state-a-components-memory) إلى مكوّنك.

```js
const [state, setState] = useState(initialState)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `useState(initialState)` {/*usestate*/}

استدعِ `useState` في أعلى مستوى مكوّنك لتصرّح عن [متغير حالة.](/learn/state-a-components-memory)

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

الاصطلاح تسمية متغيرات الحالة مثل `[something, setSomething]` باستخدام [تفكيك المصفوفة.](https://javascript.info/destructuring-assignment)

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `initialState`: القيمة التي تريد أن تكون الحالة مبدئيًا. يمكن أن تكون من أي نوع، لكن للدوال سلوك خاص. يُتجاهل هذا الوسيط بعد الـ render الأول.
  * إذا مررت دالة كـ`initialState`، تُعامل كـ_دالة تهيئة_. ينبغي أن تكون نقية، بلا وسائط، وتعيد قيمة من أي نوع. تستدعي React دالة التهيئة عند تهيئة المكوّن وتخزّن قيمتها المعادة كحالة أولية. [اطلع على مثال أدناه.](#avoiding-recreating-the-initial-state)

#### القيمة المعادة {/*returns*/}

`useState` يعيد مصفوفة بقيمتين بالضبط:

1. الحالة الحالية. في أول render، تطابق `initialState` التي مررتها.
2. [دالة `set`](#setstate) التي تتيح تحديث الحالة إلى قيمة مختلفة وإطلاق إعادة رسم.

#### ملاحظات مهمة {/*caveats*/}

* `useState` هو Hook، فتستدعيه **في أعلى مستوى المكوّن** أو في Hooks خاصة بك فقط. لا تستدعه داخل حلقات أو شروط. إذا احتجت ذلك، استخرج مكوّنًا جديدًا وانقل الـ state إليه.
* في Strict Mode، تستدعي React **دالة التهيئة مرتين** من أجل [مساعدتك على اكتشاف الشوائب غير المقصودة.](#my-initializer-or-updater-function-runs-twice) هذا للتطوير فقط ولا يؤثر على الإنتاج. إذا كانت دالة التهيئة نقية (كما ينبغي)، فلا يؤثر ذلك على السلوك. تُتجاهل نتيجة أحد الاستدعاءين.

---

### دوال `set`، مثل `setSomething(nextState)` {/*setstate*/}

دالة `set` التي يعيدها `useState` تتيح تحديث الحالة إلى قيمة مختلفة وإطلاق إعادة رسم. يمكنك تمرير الحالة التالية مباشرة، أو دالة تحسبها من الحالة السابقة:

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### المعاملات {/*setstate-parameters*/}

* `nextState`: القيمة التي تريد أن تصبح الحالة. يمكن أن تكون من أي نوع، لكن للدوال سلوك خاص.
  * إذا مررت دالة كـ`nextState`، تُعامل كـ_دالة تحديث_. يجب أن تكون نقية، تأخذ الحالة المعلّقة وسيطها الوحيد، وتعيد الحالة التالية. تضع React دالة التحديث في طابور وتعيد رسم المكوّن. في الـ render التالي، تحسب الحالة التالية بتطبيق كل دوال التحديث المصفوفة على الحالة السابقة. [اطلع على مثال أدناه.](#updating-state-based-on-the-previous-state)

#### القيمة المعادة {/*setstate-returns*/}

دوال `set` لا تعيد قيمة.

#### ملاحظات مهمة {/*setstate-caveats*/}

* دالة `set` **تحدّث متغير الحالة لـ*الـ* render التالي فقط**. إذا قرأت متغير الحالة بعد استدعاء `set`، [ستحصل على القيمة القديمة](#ive-updated-the-state-but-logging-gives-me-the-old-value) التي كانت على الشاشة قبل الاستدعاء.

* إذا كانت القيمة الجديدة مطابقة للحالة الحالية `state` حسب [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)، **تتخطى React إعادة رسم المكوّن وأبناءه.** هذا تحسين. قد تحتاج React أحيانًا لاستدعاء مكوّنك قبل تخطي الأبناء، لكن ذلك لا ينبغي أن يؤثر على كودك.

* React [تجمع تحديثات الحالة.](/learn/queueing-a-series-of-state-updates) تحدّث الشاشة **بعد أن تنتهي كل معالجات الأحداث** وتستدعي دوال `set`. ذلك يمنع إعادات رسم متعددة في حدث واحد. في الحالات النادرة التي تحتاج فيها لإجبار React على التحديث مبكرًا، مثل الوصول إلى DOM، استخدم [`flushSync`.](/reference/react-dom/flushSync)

* دالة `set` لهوية مستقرة، فغالبًا تُحذف من تبعيات Effects، لكن تضمينها لا يجعل الـ Effect يشتغل. إذا سمح linter بحذف تبعية بلا أخطاء، فالأمر آمن. [تعرّف أكثر على إزالة تبعيات Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* استدعاء `set` *أثناء الرسم* مسموح فقط من المكوّن الذي يُرسم حاليًا. تتخلّى React عن مخرجاته وتحاول فورًا إعادة الرسم بالحالة الجديدة. هذا النادر الحاجة، لكن يمكنك به **تخزين معلومات من renders سابقة**. [اطلع على مثال أدناه.](#storing-information-from-previous-renders)

* في Strict Mode، تستدعي React **دالة التحديث مرتين** من أجل [مساعدتك على اكتشاف الشوائب غير المقصودة.](#my-initializer-or-updater-function-runs-twice) هذا للتطوير فقط ولا يؤثر على الإنتاج. إذا كانت دالة التحديث نقية (كما ينبغي)، فلا يؤثر ذلك على السلوك. تُتجاهل نتيجة أحد الاستدعاءين.

---

## الاستخدام {/*usage*/}

### إضافة حالة إلى مكوّن {/*adding-state-to-a-component*/}

استدعِ `useState` في أعلى مستوى مكوّنك لتصرّح عن [متغير حالة](/learn/state-a-components-memory) واحد أو أكثر.

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

الاصطلاح تسمية متغيرات الحالة مثل `[something, setSomething]` باستخدام [تفكيك المصفوفة.](https://javascript.info/destructuring-assignment)

يعيد `useState` مصفوفة بعنصرين بالضبط:

1. <CodeStep step={1}>الحالة الحالية</CodeStep> لهذا المتغير، مضبوطة مبدئيًا إلى <CodeStep step={3}>الحالة الأولية</CodeStep> التي قدمتها.
2. <CodeStep step={2}>دالة `set`</CodeStep> التي تغيّرها إلى أي قيمة أخرى استجابة للتفاعل.

لتحديث ما على الشاشة، استدعِ دالة `set` ببعض الحالة التالية:

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

تخزّن React الحالة التالية، تعيد رسم مكوّنك بالقيم الجديدة، وتحدّث الواجهة.

<Pitfall>

استدعاء دالة `set` [**لا** يغيّر الحالة الحالية في الكود الجاري](#ive-updated-the-state-but-logging-gives-me-the-old-value):

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // Still "Taylor"!
}
```

يؤثر فقط فيما يعيده `useState` بدءًا من الـ render *التالي*.

</Pitfall>

<Recipes titleText="أمثلة أساسية لـ useState" titleId="examples-basic">

#### عداد (رقم) {/*counter-number*/}

في هذا المثال، يحتفظ متغير الحالة `count` برقم. النقر على الزر يزيده.

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

#### حقل نص (سلسلة) {/*text-field-string*/}

في هذا المثال، يحتفظ متغير الحالة `text` بسلسلة. عند الكتابة، يقرأ `handleChange` أحدث قيمة من عنصر الإدخال في DOM ويستدعي `setText` لتحديث الحالة، فيمكنك عرض `text` الحالي أسفل الحقل.

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

#### مربع اختيار (منطقي) {/*checkbox-boolean*/}

في هذا المثال، يحتفظ متغير الحالة `liked` بقيمة منطقية. عند تغيير المدخل، يحدّث `setLiked` الحالة بحسب ما إذا كان مربع الاختيار في المتصفح محددًا. تُستخدم `liked` لرسم النص أسفل المربع.

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

#### نموذج (متغيران) {/*form-two-variables*/}

يمكنك التصرّح عن أكثر من متغير حالة في نفس المكوّن. كل متغير مستقل تمامًا.

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

### تحديث الحالة اعتمادًا على الحالة السابقة {/*updating-state-based-on-the-previous-state*/}

لنقل `age` يساوي `42`. يستدعي هذا المعالج `setAge(age + 1)` ثلاث مرات:

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

لكن بعد نقرة واحدة، يصبح `age` `43` وليس `45`! لأن استدعاء `set` [لا يحدّث](/learn/state-as-a-snapshot) متغير `age` في الكود الجاري. فيصبح كل `setAge(age + 1)` مثل `setAge(43)`.

لحل ذلك، **يمكنك تمرير *دالة تحديث*** إلى `setAge` بدل الحالة التالية مباشرة:

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

هنا، `a => a + 1` هي دالة التحديث. تأخذ <CodeStep step={1}>الحالة المعلّقة</CodeStep> وتحسب منها <CodeStep step={2}>الحالة التالية</CodeStep>.

تضع React دوال التحديث في [طابور.](/learn/queueing-a-series-of-state-updates) ثم في الـ render التالي تستدعيها بنفس الترتيب:

1. تستقبل `a => a + 1` القيمة `42` كحالة معلّقة وتعيد `43` كحالة تالية.
1. تستقبل `a => a + 1` القيمة `43` كحالة معلّقة وتعيد `44` كحالة تالية.
1. تستقبل `a => a + 1` القيمة `44` كحالة معلّقة وتعيد `45` كحالة تالية.

لا توجد تحديثات أخرى في الطابور، فتخزّن React `45` كحالة حالية في النهاية.

بالاصطلاح، شائع تسمية وسيط الحالة المعلّقة بالحرف الأول من اسم المتغير، مثل `a` لـ`age`. يمكنك أيضًا تسميته `prevAge` أو ما تجده أوضح.

قد [تستدعي React دوال التحديث مرتين](#my-initializer-or-updater-function-runs-twice) في التطوير للتحقق أنها [نقية.](/learn/keeping-components-pure)

<DeepDive>

#### هل استخدام دالة التحديث مفضّل دائمًا؟ {/*is-using-an-updater-always-preferred*/}

قد تسمع توصية بكتابة `setAge(a => a + 1)` دائمًا إذا كانت الحالة تُحسب من السابقة. لا ضرر في ذلك، لكنه ليس ضروريًا دائمًا.

في أغلب الحالات، لا فرق بين النهجين. تتأكد React أنه لإجراءات المستخدم المتعمدة مثل النقر، يُحدَّث `age` قبل النقرة التالية، فلا خطر أن يرى معالج النقر `age` «قديمًا» في بداية الحدث.

لكن إذا نفّذت عدة تحديثات في نفس الحدث، تفيد دوال التحديث. وتفيد أيضًا إذا كان الوصول لمتغير الحالة غير مريح (قد يحدث عند تحسين إعادات الرسم).

إذا فضّلت الاتساق على حساب صياغة أطول قليلًا، فمن المعقول دائمًا كتابة دالة تحديث إذا كانت الحالة تُحسب من السابقة. إذا حُسبت من حالة متغير *آخر*، قد تريد دمجها في كائن واحد و[استخدام reducer.](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes titleText="الفرق بين تمرير دالة تحديث وتمرير الحالة التالية مباشرة" titleId="examples-updater">

#### تمرير دالة التحديث {/*passing-the-updater-function*/}

يمرّر هذا المثال دالة التحديث، فيعمل زر «+3».

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

#### تمرير الحالة التالية مباشرة {/*passing-the-next-state-directly*/}

هذا المثال **لا** يمرّر دالة التحديث، فزر «+3» **لا يعمل كما يُقصَد**.

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

### تحديث الكائنات والمصفوفات في الحالة {/*updating-objects-and-arrays-in-state*/}

يمكنك وضع كائنات ومصفوفات في الحالة. في React تُعتبر الحالة للقراءة فقط، لذا **ينبغي أن *تستبدلها* بدل أن *تعدّل* الكائنات القائمة**. مثلًا، إذا كان لديك كائن `form` في الحالة، لا تعدّله:

```js
// 🚩 Don't mutate an object in state like this:
form.firstName = 'Taylor';
```

بدلًا من ذلك، استبدل الكائن كاملًا بإنشاء كائن جديد:

```js
// ✅ Replace state with a new object
setForm({
  ...form,
  firstName: 'Taylor'
});
```

اقرأ [تحديث الكائنات في الحالة](/learn/updating-objects-in-state) و[تحديث المصفوفات في الحالة](/learn/updating-arrays-in-state) للمزيد.

<Recipes titleText="أمثلة على كائنات ومصفوفات في الحالة" titleId="examples-objects">

#### نموذج (كائن) {/*form-object*/}

في هذا المثال، يحتفظ متغير الحالة `form` بكائن. لكل حقل معالج تغيّر يستدعي `setForm` بالحالة التالية للنموذج كاملًا. صياغة `{ ...form }` تضمن استبدال كائن الحالة بدل تعديله.

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

#### نموذج (كائن متداخل) {/*form-nested-object*/}

في هذا المثال، الحالة أكثر تداخلًا. عند تحديث حالة متداخلة، أنشئ نسخة من الكائن الذي تُحدّثه وأي كائنات «تحتويه» في الطريق إلى الأعلى. اقرأ [تحديث كائن متداخل](/learn/updating-objects-in-state#updating-a-nested-object) للمزيد.

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

#### قائمة (مصفوفة) {/*list-array*/}

في هذا المثال، يحتفظ متغير الحالة `todos` بمصفوفة. كل معالج أزرار يستدعي `setTodos` بالنسخة التالية من المصفوفة. صياغة `[...todos]` و`todos.map()` و`todos.filter()` تضمن استبدال مصفوفة الحالة بدل تعديلها.

<Sandpack>

```js src/App.js
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

```js src/AddTodo.js
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

```js src/TaskList.js
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

#### كتابة منطق تحديث موجز مع Immer {/*writing-concise-update-logic-with-immer*/}

إذا كان تحديث المصفوفات والكائنات دون تعديل مباشر مملًا، استخدم مكتبة مثل [Immer](https://github.com/immerjs/use-immer) لتقليل التكرار. يتيح Immer كودًا موجزًا كأنك تعدّل الكائنات، بينما ينفّذ تحديثات غير قابلة للتعديل تحت الغطاء:

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

### تجنب إعادة إنشاء الحالة الأولية {/*avoiding-recreating-the-initial-state*/}

تحفظ React الحالة الأولية مرة واحدة وتتجاهلها في الـ renders التالية.

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

رغم أن نتيجة `createInitialTodos()` تُستخدم فقط للـ render الأول، فما زلت تستدعي الدالة في كل render. قد يكون ذلك مهدورًا إذا أنشأت مصفوفات كبيرة أو حسابات مكلفة.

لحل ذلك، **مرّرها كدالة _مهيئة_** إلى `useState` بدلًا من ذلك:

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

لاحظ أنك تمرّر `createInitialTodos` أي *الدالة نفسها*، وليس `createInitialTodos()` أي نتيجة استدعائها. إذا مررت دالة إلى `useState`، تستدعيها React فقط أثناء التهيئة.

قد [تستدعي React مهيئاتك مرتين](#my-initializer-or-updater-function-runs-twice) في التطوير للتحقق أنها [نقية.](/learn/keeping-components-pure)

<Recipes titleText="الفرق بين تمرير مهيئ وتمرير الحالة الأولية مباشرة" titleId="examples-initializer">

#### تمرير دالة المهيئ {/*passing-the-initializer-function*/}

يمرّر هذا المثال دالة المهيئ، فيُنفَّذ `createInitialTodos` فقط أثناء التهيئة. لا يُنفَّذ عند إعادة رسم المكوّن، مثلًا عند الكتابة في الحقل.

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

#### تمرير الحالة الأولية مباشرة {/*passing-the-initial-state-directly*/}

هذا المثال **لا** يمرّر دالة المهيئ، فيُنفَّذ `createInitialTodos` في كل render، مثلًا عند الكتابة في الحقل. لا فرق ملحوظ في السلوك، لكن الكود أقل كفاءة.

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

### إعادة ضبط الحالة بمفتاح key {/*resetting-state-with-a-key*/}

غالبًا تصادف خاصية `key` عند [رسم القوائم.](/learn/rendering-lists) لكن لها غرضًا آخر أيضًا.

يمكنك **إعادة ضبط حالة مكوّن بتمرير `key` مختلف إلى المكوّن.** في هذا المثال، يغيّر زر إعادة الضبط متغير الحالة `version`، نمرره كـ`key` إلى `Form`. عند تغيّر `key`، تعيد React إنشاء مكوّن `Form` (وجميع أبنائه) من الصفر، فتُصفَّر حالته.

اقرأ [الحفاظ على الحالة وإعادة ضبطها](/learn/preserving-and-resetting-state) للمزيد.

<Sandpack>

```js src/App.js
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

### تخزين معلومات من renders سابقة {/*storing-information-from-previous-renders*/}

عادةً تحدّث الحالة في معالجات الأحداث. لكن في حالات نادرة قد تريد ضبط الحالة استجابة للرسم — مثلًا تغيير متغير حالة عند تغيّر prop.

في أغلب الحالات، لا تحتاج هذا:

* **إذا كان يمكن حساب القيمة كليًا من الـ props الحالية أو حالة أخرى، [أزل تلك الحالة الزائدة بالكامل.](/learn/choosing-the-state-structure#avoid-redundant-state)** إن قلقت من إعادة الحساب كثيرًا، قد يساعد [Hook `useMemo`](/reference/react/useMemo).
* إذا أردت إعادة ضبط حالة الشجرة كاملة، [مرّر `key` مختلفًا إلى مكوّنك.](#resetting-state-with-a-key)
* إن أمكن، حدّث كل الحالة ذات الصلة في معالجات الأحداث.

في الحالة النادرة التي لا تنطبق فيها أي من السابقة، يوجد نمط لتحديث الحالة بناءً على ما رُسم حتى الآن: استدعاء `set` أثناء رسم المكوّن.

مثال: مكوّن `CountLabel` يعرض prop `count` الممرَّر إليه:

```js src/CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

لنقل تريد إظهار ما إذا كان العداد *ازداد أو نقص* منذ آخر تغيير. prop `count` لا يخبرك بذلك — تحتاج تتبع قيمته السابقة. أضف متغير حالة `prevCount` لتتبعه، ومتغيرًا آخر `trend` لما إذا زاد العداد أو نقص. قارن `prevCount` مع `count`، وإذا اختلفا حدّث `prevCount` و`trend`. يمكنك الآن عرض قيمة `count` الحالية و*كيف تغيّرت منذ آخر render*.

<Sandpack>

```js src/App.js
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

```js src/CountLabel.js active
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

لاحظ أن استدعاء `set` أثناء الرسم يجب أن يكون داخل شرط مثل `prevCount !== count`، ويجب أن يوجد استدعاء مثل `setPrevCount(count)` داخل الشرط. وإلا يعيد المكوّن الرسم في حلقة حتى يتعطل. كذلك يمكنك تحديث حالة المكوّن *الذي يُرسم حاليًا* فقط بهذه الطريقة. استدعاء `set` لمكوّن *آخر* أثناء الرسم خطأ. أخيرًا، يجب أن يظل استدعاء `set` [يحدّث الحالة دون تعديل مباشر](#updating-objects-and-arrays-in-state) — هذا لا يعني أنك تخالف قواعد [الدوال النقية.](/learn/keeping-components-pure)

هذا النمط صعب الفهم ويُفضّل تجنبه عادةً. لكنه أفضل من تحديث الحالة في Effect. عند استدعاء `set` أثناء الرسم، تعيد React رسم ذلك المكوّن فورًا بعد خروج مكوّنك بـ`return` وقبل رسم الأبناء. هكذا لا يحتاج الأبناء لرسم مرتين. يستمر تنفيذ بقية دالة المكوّن (وتُتجاهل النتيجة). إذا كان الشرط أسفل كل استدعاءات Hooks، يمكنك إضافة `return;` مبكر لإعادة الرسم أبكر.

---

## استكشاف الأخطاء {/*troubleshooting*/}

### حدّثت الحالة لكن التسجيل يعطيني القيمة القديمة {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

استدعاء `set` **لا يغيّر الحالة في الكود الجاري**:

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

ذلك لأن [الحالة تتصرّف كلمحة.](/learn/state-as-a-snapshot) تحديث الحالة يطلب renderًا آخر بالقيمة الجديدة، لكنه لا يؤثر على متغير `count` في JavaScript داخل معالج الحدث الجاري.

إذا احتجت الحالة التالية، خزّنها في متغير قبل تمريرها إلى `set`:

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### حدّثت الحالة لكن الشاشة لا تتحدّث {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

**تتجاهل React تحديثك** إذا كانت الحالة التالية مساوية للسابقة حسب [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). يحدث ذلك غالبًا عند تعديل كائن أو مصفوفة في الحالة مباشرة:

```js
obj.x = 10;  // 🚩 Wrong: mutating existing object
setObj(obj); // 🚩 Doesn't do anything
```

عدّلت كائن `obj` قائمًا وأعدته إلى `setObj`، فتجاهلت React التحديث. لإصلاح ذلك، تأكد دائمًا من [_استبدال_ الكائنات والمصفوفات في الحالة بدل _تعديلها_](#updating-objects-and-arrays-in-state):

```js
// ✅ Correct: creating a new object
setObj({
  ...obj,
  x: 10
});
```

---

### أتلقى خطأ: «Too many re-renders» {/*im-getting-an-error-too-many-re-renders*/}

قد يظهر: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` غالبًا يعني أنك تضبط الحالة *أثناء الرسم* بلا شرط، فيدخل المكوّن حلقة: رسم، ضبط حالة (فيُسبب رسمًا)، وهكذا. غالبًا السبب خطأ في تعريف معالج الحدث:

```js {1-2}
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

إذا لم تجد السبب، انقر السهم بجانب الخطأ في وحدة التحكم وافحص مكدس JavaScript للعثور على استدعاء `set` المسبب.

---

### يعمل المهيئ أو دالة التحديث مرتين {/*my-initializer-or-updater-function-runs-twice*/}

في [Strict Mode](/reference/react/StrictMode)، تستدعي React بعض دوالك مرتين بدلًا من مرة:

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

هذا متوقع ولا ينبغي أن يكسر كودك.

هذا السلوك **للتطوير فقط** يساعدك على [إبقاء المكوّنات نقية.](/learn/keeping-components-pure) تستخدم React نتيجة أحد الاستدعاءين وتتجاهل نتيجة الآخر. طالما المكوّن والمهيئ ودالة التحديث نقيون، لا يؤثر ذلك على المنطق. لكن إذا كانوا شوائب بالخطأ، يساعدك ذلك على ملاحظة الأخطاء.

مثلًا، تعدّل دالة تحديث غير نقية مصفوفة في الحالة:

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Mistake: mutating state
  prevTodos.push(createTodo());
});
```

بما أن React تستدعي دالة التحديث مرتين، سترى المهمة أُضيفت مرتين، فتعرف أن هناك خطأ. في هذا المثال، أصلح الخطأ [باستبدال المصفوفة بدل تعديلها](#updating-objects-and-arrays-in-state):

```js {2,3}
setTodos(prevTodos => {
  // ✅ Correct: replacing with new state
  return [...prevTodos, createTodo()];
});
```

الآن بعد أن أصبحت دالة التحديث نقية، لا يغيّر استدعاؤها مرة إضافية السلوك. لذلك يساعدك استدعاء React لها مرتين على إيجاد الأخطاء. **دوال المكوّن والمهيئ والتحديث فقط ينبغي أن تكون نقية.** معالجات الأحداث لا تحتاج النقاء، ولن تستدعي React معالج حدثك مرتين.

اقرأ [إبقاء المكوّنات نقية](/learn/keeping-components-pure) للمزيد.

---

### أحاول ضبط الحالة إلى دالة فتُستدعى بدلًا من تخزينها {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

لا يمكنك وضع دالة في الحالة هكذا:

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

لأنك تمرّر دالة، تفترض React أن `someFunction` [دالة تهيئة](#avoiding-recreating-the-initial-state) وأن `someOtherFunction` [دالة تحديث](#updating-state-based-on-the-previous-state)، فتحاول استدعاءهما وتخزين النتيجة. لتخزين *دالة* فعلًا، ضع `() =>` قبلهما في الحالتين. عندها تخزّن React الدوال التي تمررها.

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
