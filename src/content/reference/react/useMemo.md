---
title: دالة useMemo
---

<Intro>

`useMemo` هو Hook في React يتيح لك تخزين نتيجة حساب مؤقتًا بين إعادات الرسم.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) يذكر القيم والدوال تلقائيًا، ما يقلل الحاجة لاستدعاءات `useMemo` اليدوية. يمكنك استخدام المُجمّع للتعامل مع التذكير تلقائيًا.

</Note>

<InlineToc />

---

## المرجع {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

استدعِ `useMemo` في أعلى مستوى مكوّنك لتخزين نتيجة حساب بين إعادات الرسم:

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `calculateValue`: الدالة التي تحسب القيمة التي تريد تخزينها. يجب أن تكون نقية، بلا وسائط، وتعيد قيمة من أي نوع. تستدعي React دالتك أثناء الـ render الأول. في الـ renders التالية، تعيد نفس القيمة إذا لم تتغيّر `dependencies` منذ آخر render. وإلا تستدعي `calculateValue`، تعيد نتيجتها، وتخزّنها لربما يُعاد استخدامها لاحقًا.

* `dependencies`: قائمة كل القيم التفاعلية المُشار إليها داخل كود `calculateValue`. تشمل القيم التفاعلية الـ props والـ state وكل المتغيرات والدوال المصرّح عنها مباشرة في جسم المكوّن. إذا كان linterك [مهيأ لـ React](/learn/editor-setup#linting)، يتحقق من أن كل قيمة تفاعلية مذكورة كتبعية. يجب أن يبقى عدد عناصر قائمة التبعيات ثابتًا وتُكتب مضمّنة مثل `[dep1, dep2, dep3]`. تقارن React كل تبعية بقيمتها السابقة باستخدام [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### القيمة المعادة {/*returns*/}

في الـ render الأول، يعيد `useMemo` نتيجة استدعاء `calculateValue` بلا وسائط.

في الـ renders التالية، يعيد إما قيمة مخزّنة من آخر render (إذا لم تتغيّر التبعيات)، أو يعيد استدعاء `calculateValue` ويعيد ما أعادته.

#### ملاحظات مهمة {/*caveats*/}

* `useMemo` هو Hook، فتستدعيه **في أعلى مستوى المكوّن** أو في Hooks خاصة بك فقط. لا تستدعه داخل حلقات أو شروط. إذا احتجت ذلك، استخرج مكوّنًا جديدًا وانقل الـ state إليه.
* في Strict Mode، تستدعي React **دالة الحساب مرتين** من أجل [مساعدتك على اكتشاف الشوائب غير المقصودة.](#my-calculation-runs-twice-on-every-re-render) هذا للتطوير فقط ولا يؤثر على الإنتاج. إذا كانت دالة الحساب نقية (كما ينبغي)، فلا يؤثر ذلك على المنطق. تُتجاهل نتيجة أحد الاستدعاءين.
* React **لا تلقي بالقيمة المخزّنة إلا لسبب محدد.** مثلًا، في التطوير تُفرغ الذاكرة عند تعديل ملف المكوّن. في التطوير والإنتاج، تُفرغ إذا علّق المكوّن أثناء التركيب الأول. قد تضيف React لاحقًا ميزات تستفيد من إفراغ الذاكرة. إذا اعتمدت على `useMemo` فقط كتحسين أداء، فذلك مقبول. وإلا فقد يكون [متغير state](/reference/react/useState#avoiding-recreating-the-initial-state) أو [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) أنسب.

<Note>

تخزين القيم المعادة هكذا يُسمى أيضًا [*memoization*،](https://en.wikipedia.org/wiki/Memoization) ومن هنا اسم Hook `useMemo`.

</Note>

---

## الاستخدام {/*usage*/}

### تخطي إعادة الحساب المكلف {/*skipping-expensive-recalculations*/}

لتخزين حساب بين إعادات الرسم، لفّه في استدعاء `useMemo` في أعلى مستوى مكوّنك:

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

تحتاج لتمرير أمرين إلى `useMemo`:

1. <CodeStep step={1}>دالة حساب</CodeStep> بلا وسائط، مثل `() =>`، تعيد ما تريد حسابه.
2. <CodeStep step={2}>قائمة تبعيات</CodeStep> تتضمن كل قيمة داخل مكوّنك تُستخدم في الحساب.

في الـ render الأول، تكون <CodeStep step={3}>القيمة</CodeStep> من `useMemo` هي نتيجة استدعاء <CodeStep step={1}>الحساب</CodeStep>.

في كل render لاحق، تقارن React <CodeStep step={2}>التبعيات</CodeStep> بالتبعيات التي مررتها في آخر render. إذا لم تتغيّر أي تبعية (بالمقارنة مع [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is))، يعيد `useMemo` القيمة التي حسبتها سابقًا. وإلا تعيد React تشغيل الحساب وتعيد القيمة الجديدة.

بعبارة أخرى، `useMemo` يخزّن نتيجة حساب بين إعادات الرسم حتى تتغيّر التبعيات.

**لنمضِ في مثال لنرى متى يكون ذلك مفيدًا.**

افتراضيًا، تعيد React تشغيل جسم المكوّن كاملًا في كل إعادة رسم. مثلًا، إذا حدّث `TodoList` حالته أو تلقى props جديدة من الأب، تُعاد تشغيل دالة `filterTodos`:

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

عادةً لا مشكلة لأن أغلب الحسابات سريعة جدًا. لكن إذا صفّيت أو حوّلت مصفوفة كبيرة، أو نفّذت حسابًا مكلفًا، قد تريد تخطي إعادته إن لم تتغيّر البيانات. إذا بقي `todos` و`tab` كما في آخر render، فلفّ الحساب في `useMemo` كسابق يتيح إعادة استخدام `visibleTodos` المحسوبة.

هذا النوع من التخزين يُسمى *[memoization.](https://en.wikipedia.org/wiki/Memoization)*

<Note>

**اعتمد على `useMemo` فقط كتحسين للأداء.** إذا لم يعمل الكود بلاها، فابحث عن المشكلة الجذرية وأصلحها أولًا. ثم يمكنك إضافة `useMemo` لتحسين الأداء.

</Note>

<DeepDive>

#### كيف تعرف أن الحساب مكلف؟ {/*how-to-tell-if-a-calculation-is-expensive*/}

بشكل عام، ما لم تنشئ أو تمرّ على آلاف الكائنات، فغالبًا ليس مكلفًا. لمزيد من الثقة، أضف `console.log` أو `console.time` لقياس الزمن في جزء من الكود:

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

نفّذ التفاعل الذي تقيسه (مثلًا الكتابة في الحقل). ستظهر في وحدة التحكم سجلات مثل `filter array: 0.15ms`. إذا تجاوز الزمن المجموع حدًا ملحوظًا (مثلًا `1ms` أو أكثر)، قد يستحق الحساب التذكير. كتجربة، لفّ الحساب في `useMemo` وتحقق هل انخفض الزمن الكلي لذلك التفاعل:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // Skipped if todos and tab haven't changed
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo` لا يسرّع الـ render *الأول*. يساعد فقط على تخطي عمل غير ضروري عند التحديثات.

تذكّر أن جهازك غالبًا أسرع من أجهزة المستخدمين، فمن الجيد اختبار الأداء بإبطاء اصطناعي. يوفّر Chrome مثلًا خيار [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) لذلك.

قياس الأداء في التطوير لن يعطِ أدق النتائج (مثلًا مع [Strict Mode](/reference/react/StrictMode) قد ترى كل مكوّن يُرسم مرتين). لأدق التوقيتات، ابنِ للإنتاج واختبر على جهاز يشبه أجهزة المستخدمين.

</DeepDive>

<DeepDive>

#### هل تضيف useMemo في كل مكان؟ {/*should-you-add-usememo-everywhere*/}

إذا كان تطبيقك مثل هذا الموقع وتفاعلاته خشنة (استبدال صفحة أو قسم)، فالتذكير غالبًا غير لازم. أما إذا كان أشبه بمحرر رسوم وتفاعلاته دقيقة، قد تجد التذكير مفيدًا جدًا.

التحسين بـ`useMemo` قيّم في حالات قليلة:

- الحساب الذي تضعه في `useMemo` بطيء ملحوظًا وتبعياته نادرًا ما تتغيّر.
- تمرره كخاصية لمكوّن ملفوف بـ [`memo`.](/reference/react/memo) وتريد تخطي إعادة الرسم إن لم تتغيّر القيمة. التذكير يجعل المكوّن يعيد الرسم فقط عند اختلاف التبعيات.
- القيمة تُستخدم لاحقًا كتبعية لـHook. مثلًا، يعتمد عليها `useMemo` آخر، أو تعتمد عليها من [`useEffect`.](/reference/react/useEffect)

لا فائدة من لفّ الحساب بـ`useMemo` في غير هذه الحالات. ولا ضرر كبيرًا من ذلك أيضًا. العيب أن الكود يصعب قراءته. وليس كل تذكيرًا فعالًا: قيمة واحدة «دائمة الجدّة» تكفي لكسر التذكير لمكوّن كامل.

**عمليًا، يمكنك جعل كثيرًا من التذكير غير لازم باتباع مبادئ:**

1. عندما يغلّف مكوّن مرئيًا مكوّنات أخرى، اجعله [يقبل JSX كأبناء.](/learn/passing-props-to-a-component#passing-jsx-as-children) فإذا حدّث الغلاف حالته، تعلم React أن الأبناء لا يحتاجون إعادة رسم.
1. فضّل state المحلي ولا [ترفع state](/learn/sharing-state-between-components) أكثر من اللازم. لا تبقِ state عابرًا مثل النماذج ومرور المؤشر في أعلى الشجرة أو مكتبة عامة.
1. أبقِ [منطق الرسم نقيًا.](/learn/keeping-components-pure) إذا تسببت إعادة الرسم في مشكلة أو شذوذًا مرئيًا، فهذا خلل! أصلحه بدل التذكير.
1. تجنب [Effects غير ضرورية تحدّث state.](/learn/you-might-not-need-an-effect) أغلب مشاكل الأداء سلاسل تحديثات من Effects.
1. حاول [إزالة تبعيات غير ضرورية من Effects.](/learn/removing-effect-dependencies) غالبًا أبسط من التذكير نقل كائن أو دالة داخل Effect أو خارج المكوّن.

إذا بقي تفاعل بطيئًا، [استخدم ملف React Developer Tools](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) لمعرفة المكوّنات الأكثر استفادة من التذكير. على المدى الطويل، نبحث في [تذكير تلقائي دقيق](https://www.youtube.com/watch?v=lGEMwh32soc).

</DeepDive>

<Recipes titleText="الفرق بين useMemo وحساب قيمة مباشرة" titleId="examples-recalculation">

#### تخطي إعادة الحساب بـ`useMemo` {/*skipping-recalculation-with-usememo*/}

في هذا المثال، **يُبطّأ** تنفيذ `filterTodos` اصطناعيًا حتى ترى ماذا يحدث عندما تكون دالة JavaScript تستدعيها أثناء الرسم بطيئة فعلًا. جرّب تبديل التبويبات وتبديل السمة.

تبديل التبويبات يبدو بطيئًا لأنه يجبر `filterTodos` المبطّأ على إعادة التنفيذ. ذلك متوقع لأن `tab` تغيّر، فيحتاج الحساب كاملًا لإعادة التشغيل. (إن سألت لماذا يعمل مرتين، فالشرح [هنا.](#my-calculation-runs-twice-on-every-re-render))

بدّل السمة. **بفضل `useMemo`، يبقى سريعًا رغم الإبطاء!** تُتخطى استدعاءات `filterTodos` البطيئة لأن `todos` و`tab` (تبعيات `useMemo`) لم يتغيّرا منذ آخر render.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### إعادة حساب القيمة دائمًا {/*always-recalculating-a-value*/}

في هذا المثال، تنفيذ `filterTodos` **مُبطّأ** اصطناعيًا أيضًا حتى ترى ماذا يحدث عندما تكون دالة JavaScript تستدعيها أثناء الرسم بطيئة فعلًا. جرّب تبديل التبويبات والسمة.

على عكس المثال السابق، تبديل السمة بطيء الآن أيضًا! لأن **لا يوجد استدعاء `useMemo` في هذه النسخة،** فيُستدعى `filterTodos` المبطّأ في كل إعادة رسم، حتى إذا تغيّرت `theme` فقط.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

فيما يلي نفس الكود **بعد إزالة الإبطاء الاصطناعي.** هل غياب `useMemo` ملحوظ أم لا؟

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

غالبًا يعمل الكود بلا تذكير جيدًا. إذا كانت تفاعلاتك سريعة بما يكفي، قد لا تحتاج تذكيرًا.

جرّب زيادة عدد عناصر المهام في `utils.js` ولاحظ التغيّر. هذا الحساب لم يكن مكلفًا جدًا في البداية، لكن إذا كثر عدد المهام، يصبح معظم العبء في إعادة الرسم لا في التصفية. تابع أدناه لتحسين إعادة الرسم بـ`useMemo`.

<Solution />

</Recipes>

---

### تخطي إعادة رسم المكوّنات {/*skipping-re-rendering-of-components*/}

في بعض الحالات، يساعدك `useMemo` أيضًا على تحسين أداء إعادة رسم المكوّنات الأبناء. للتوضيح، لنقل مكوّن `TodoList` يمرّر `visibleTodos` كخاصية إلى المكوّن الابن `List`:

```js {5}
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

لاحظت أن تبديل خاصية `theme` يجمّد التطبيق لحظة، لكن إذا أزلت `<List />` من JSX يبدو سريعًا. ذلك يدل على أن تحسين `List` يستحق المحاولة.

**افتراضيًا، عند إعادة رسم مكوّن، تعيد React رسم كل أبنائه بشكل متكرر.** لذلك عندما يعيد `TodoList` الرسم بـ`theme` مختلف، يعيد مكوّن `List` *أيضًا* الرسم. هذا مقبول للمكوّنات التي لا تحتاج حسابًا كبيرًا. لكن إذا تأكدت أن إعادة الرسم بطيئة، يمكنك جعل `List` يتخطى إعادة الرسم عندما تكون خصائصه كما في آخر render بلفّه بـ [`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**مع هذا التغيير، يتخطى `List` إعادة الرسم إذا كانت كل خصائصه *نفسها* كما في آخر render.** هنا يصبح تخزين الحساب مهمًا! تخيّل أنك حسبت `visibleTodos` بلا `useMemo`:

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // Every time the theme changes, this will be a different array...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... so List's props will never be the same, and it will re-render every time */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**في المثال أعلاه، تنشئ دالة `filterTodos` دائمًا مصفوفة *مختلفة*،** كما أن `{}` ينشئ كائنًا جديدًا دائمًا. عادةً لا مشكلة، لكن ذلك يعني أن خصائص `List` لن تكون «نفسها» أبدًا، فلا يعمل تحسين [`memo`](/reference/react/memo). هنا يفيد `useMemo`:

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // Tell React to cache your calculation between re-renders...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...so as long as these dependencies don't change...
  );
  return (
    <div className={theme}>
      {/* ...List will receive the same props and can skip re-rendering */}
      <List items={visibleTodos} />
    </div>
  );
}
```


**بلفّ حساب `visibleTodos` في `useMemo`، تضمن أن له *نفس* القيمة بين إعادات الرسم** (حتى تتغيّر التبعيات). لا *يلزمك* لفّ الحساب في `useMemo` إلا لسبب محدد. في هذا المثال، السبب أنك تمرره إلى مكوّن ملفوف بـ [`memo`,](/reference/react/memo) فيتخطى إعادة الرسم. توجد أسباب أخرى لـ`useMemo` تُشرح لاحقًا في الصفحة.

<DeepDive>

#### تذكير عقد JSX فردية {/*memoizing-individual-jsx-nodes*/}

بدل لفّ `List` بـ [`memo`](/reference/react/memo)، يمكنك لفّ عقدة JSX `<List />` نفسها في `useMemo`:

```js {3,6}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

السلوك سيكون نفسه. إذا لم تتغيّر `visibleTodos`، لن يُعاد رسم `List`.

عقدة JSX مثل `<List items={visibleTodos} />` هي كائن مثل `{ type: List, props: { items: visibleTodos } }`. إنشاء هذا الكائن رخيص، لكن React لا تعلم هل محتواه كما في المرة السابقة. لذلك افتراضيًا تعيد رسم `List`.

لكن إذا رأت React نفس JSX حرفيًا كما في الـ render السابق، لا تحاول إعادة رسم المكوّن. لأن عقد JSX [غير قابلة للتغيير.](https://en.wikipedia.org/wiki/Immutable_object) كائن عقدة JSX لا يتغيّر بمرور الوقت، فتعلم React أن تخطي إعادة الرسم آمِن. لكن ليعمل ذلك، ينبغي أن تكون العقدة *نفس الكائن فعلًا*، لا مجرد أن تبدو نفسها في الكود. هذا ما يفعله `useMemo` هنا.

لفّ عقد JSX يدويًا في `useMemo` غير مريح؛ مثلًا لا يمكن فعله بشروط. لذلك غالبًا تلفّ المكوّنات بـ [`memo`](/reference/react/memo) بدل عقد JSX.

</DeepDive>

<Recipes titleText="الفرق بين تخطي إعادة الرسم وإعادة الرسم دائمًا" titleId="examples-rerendering">

#### تخطي إعادة الرسم بـ`useMemo` و`memo` {/*skipping-re-rendering-with-usememo-and-memo*/}

في هذا المثال، **يُبطّأ** مكوّن `List` اصطناعيًا حتى ترى ماذا يحدث عندما يكون المكوّن بطيئًا فعلًا. جرّب تبديل التبويبات والسمة.

تبديل التبويبات يبدو بطيئًا لأنه يجبر `List` المبطّأ على إعادة الرسم. ذلك متوقع لأن `tab` تغيّر وتحتاج عكس اختيار المستخدم.

ثم جرّب تبديل السمة. **بفضل `useMemo` مع [`memo`](/reference/react/memo)، يبقى سريعًا رغم الإبطاء!** تخطى `List` إعادة الرسم لأن مصفوفة `visibleTodos` لم تتغيّر منذ آخر render، ولم تتغيّر لأن `todos` و`tab` (تبعيات `useMemo`) لم يتغيّرا.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js {expectedErrors: {'react-compiler': [5, 6]}} src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### إعادة رسم دائمة {/*always-re-rendering-a-component*/}

في هذا المثال، تنفيذ `List` **مُبطّأ** اصطناعيًا أيضًا حتى ترى ماذا يحدث عندما يكون المكوّن بطيئًا فعلًا. جرّب تبديل التبويبات والسمة.

على عكس المثال السابق، تبديل السمة بطيء الآن أيضًا! لأن **لا يوجد `useMemo` في هذه النسخة،** فـ`visibleTodos` مصفوفة مختلفة دائمًا، ولا يستطيع `List` المبطّأ تخطي إعادة الرسم.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js {expectedErrors: {'react-compiler': [5, 6]}} src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

فيما يلي نفس الكود **بعد إزالة الإبطاء الاصطناعي.** هل غياب `useMemo` ملحوظ أم لا؟

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

غالبًا يعمل الكود بلا تذكير جيدًا. إذا كانت تفاعلاتك سريعة بما يكفي، فلا تحتاج تذكيرًا.

تذكّر تشغيل React في وضع الإنتاج، وتعطيل [React Developer Tools](/learn/react-developer-tools)، واستخدام أجهزة قريبة من أجهزة مستخدميك لتقدير واقعي لما يبطئ التطبيق.

<Solution />

</Recipes>

---

### منع تشغيل Effect كثيرًا {/*preventing-an-effect-from-firing-too-often*/}

أحيانًا تريد استخدام قيمة داخل [Effect:](/learn/synchronizing-with-effects)

```js {4-7,10}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: 'https://localhost:1234',
    roomId: roomId
  }

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

هذا يخلق مشكلة. [كل قيمة تفاعلية يجب تعليمها كتبعية للـ Effect.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) لكن إذا جعلت `options` تبعية، سيجعل Effectك يعيد الاتصال بغرفة الدردشة باستمرار:


```js {5}
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🔴 Problem: This dependency changes on every render
  // ...
```

لحل ذلك، لفّ الكائن الذي تحتاجه من Effect في `useMemo`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = useMemo(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Only changes when roomId changes

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Only changes when options changes
  // ...
```

هذا يضمن أن كائن `options` نفسه بين إعادات الرسم إذا أعاد `useMemo` الكائن المخزّن.

لكن بما أن `useMemo` تحسين أداء لا ضمانًا دلاليًا، قد تلقي React بالقيمة المخزّنة إن [وُجد سبب محدد](#caveats). وسيعيد ذلك تشغيل الـ Effect أيضًا، **فالأفضل إزالة الحاجة لتبعية كائن** بنقل الكائن *داخل* الـ Effect:

```js {5-8,13}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = { // ✅ No need for useMemo or object dependencies!
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    }

    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Only changes when roomId changes
  // ...
```

الآن الكود أبسط ولا يحتاج `useMemo`. [تعرّف أكثر على إزالة تبعيات Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)


### تذكير تبعية لـHook آخر {/*memoizing-a-dependency-of-another-hook*/}

لنقل لديك حسابًا يعتمد على كائن تُنشئه مباشرة في جسم المكوّن:

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 Caution: Dependency on an object created in the component body
  // ...
```

الاعتماد على كائن هكذا يُبطل غرض التذكير. عند إعادة رسم المكوّن، يُعاد تنفيذ كل الكود داخل الجسم. **أسطر إنشاء `searchOptions` تعمل في كل إعادة رسم.** وبما أن `searchOptions` تبعية لـ`useMemo` وهي مختلفة في كل مرة، تعرف React أن التبعيات تغيّرت فتعيد حساب `searchItems` في كل مرة.

لإصلاح ذلك، يمكنك تذكير كائن `searchOptions` *نفسه* قبل تمريره كتبعية:

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ Only changes when text changes

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ Only changes when allItems or searchOptions changes
  // ...
```

في المثال أعلاه، إذا لم يتغيّر `text`، لا يتغيّر كائن `searchOptions`. لكن الأفضل نقل تعريف `searchOptions` *داخل* دالة الحساب في `useMemo`:

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ Only changes when allItems or text changes
  // ...
```

الآن يعتمد الحساب على `text` مباشرة (سلسلة لا «تتغيّر بالخطأ»).

---

### تذكير دالة {/*memoizing-a-function*/}

لنقل مكوّن `Form` ملفوفًا بـ [`memo`.](/reference/react/memo) وتريد تمرير دالة كخاصية:

```js {2-7}
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

كما أن `{}` ينشئ كائنًا جديدًا، فتعريفات الدوال مثل `function() {}` وتعابير `() => {}` تنتج دالة *مختلفة* في كل إعادة رسم. إنشاء دالة جديدة ليس مشكلة بذاته ولا ينبغي تجنبه دائمًا! لكن إذا كان `Form` مذكّرًا، فغالبًا تريد تخطي إعادة الرسم عندما لا تتغيّر الخصائص. خاصية *دائمة الاختلاف* تُبطل التذكير.

لتذكير دالة بـ`useMemo`، يجب أن تعيد دالة الحساب دالة أخرى:

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

هذا يبدو ثقيلًا! **تذكير الدوال شائع لدرجة أن React وفّرت Hookًا لذلك. لفّ دوالك في [`useCallback`](/reference/react/useCallback) بدل `useMemo`** لتتجنب دالة متداخلة إضافية:

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

المثالان أعلاه متكافئان تمامًا. فائدة `useCallback` الوحيدة تجنب دالة متداخرة إضافية. لا يفعل غير ذلك. [اقرأ المزيد عن `useCallback`.](/reference/react/useCallback)

---

## استكشاف الأخطاء {/*troubleshooting*/}

### يعمل حسابي مرتين في كل إعادة رسم {/*my-calculation-runs-twice-on-every-re-render*/}

في [Strict Mode](/reference/react/StrictMode)، تستدعي React بعض دوالك مرتين بدلًا من مرة:

```js {2,5,6}
function TodoList({ todos, tab }) {
  // This component function will run twice for every render.

  const visibleTodos = useMemo(() => {
    // This calculation will run twice if any of the dependencies change.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

هذا متوقع ولا ينبغي أن يكسر كودك.

هذا السلوك **للتطوير فقط** يساعدك على [إبقاء المكوّنات نقية.](/learn/keeping-components-pure) تستخدم React نتيجة أحد الاستدعاءين وتتجاهل نتيجة الآخر. طالما المكوّن ودوال الحساب نقيان، لا يؤثر ذلك على المنطق. لكن إذا كانوا شوائب بالخطأ، يساعدك ذلك على الملاحظة والإصلاح.

مثلًا، تعدّل دالة حساب غير نقية مصفوفة تلقاها كـ prop:

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Mistake: mutating a prop
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

تستدعي React دالتك مرتين، فتلاحظ إضافة المهمة مرتين. لا ينبغي أن تغيّر الحساب كائنات قائمة، لكن يجوز تغيير أي *كائنات جديدة* أنشأتها أثناء الحساب. مثلًا، إذا أعادت `filterTodos` دائمًا مصفوفة *مختلفة*، يمكنك تعديل *تلك* المصفوفة:

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Correct: mutating an object you created during the calculation
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

اقرأ [إبقاء المكوّنات نقية](/learn/keeping-components-pure) للمزيد عن النقاء.

اطلع أيضًا على [تحديث الكائنات](/learn/updating-objects-in-state) و[تحديث المصفوفات](/learn/updating-arrays-in-state) دون تعديل مباشر.

---

### استدعاء `useMemo` يفترض أن يعيد كائنًا لكنه يعيد undefined {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

هذا الكود لا يعمل:

```js {1-2,5}
  // 🔴 You can't return an object from an arrow function with () => {
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

في JavaScript، `() => {` يبدأ جسم دالة السهم، فالأقواس `{` ليست جزءًا من كائنك. لذلك لا يعيد كائنًا ويسبب أخطاء. يمكنك إصلاحه بأقواس مثل `({` و`})`:

```js {1-2,5}
  // This works, but is easy for someone to break again
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

لكن هذا ما زال مربكًا وسهلًا أن يُكسر بحذف الأقواس.

لتجنب الخطأ، اكتب `return` صراحة:

```js {1-3,6-7}
  // ✅ This works and is explicit
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### في كل render يُعاد تشغيل الحساب في `useMemo` {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

تأكد أنك مررت مصفوفة التبعيات كوسيط ثانٍ!

إذا نسيت مصفوفة التبعيات، يُعاد تشغيل الحساب في كل مرة:

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 Recalculates every time: no dependency array
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

هذه النسخة المصححة التي تمرر مصفوفة التبعيات كوسيط ثانٍ:

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ Does not recalculate unnecessarily
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

إذا لم يُفد، فالمشكلة أن تبعية واحدة على الأقل تختلف عن الـ render السابق. صحّح بتسجيل التبعيات يدويًا في وحدة التحكم:

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

ثم انقر بالزر الأيمن على المصفوفات من renders مختلفة واختر «Store as a global variable» لكليهما. إذا حُفظت الأولى كـ`temp1` والثانية كـ`temp2`، افحص في وحدة التحكم تساوي كل تبعية بين المصفوفتين:

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

عندما تجد التبعية التي تكسر التذكير، أزلها إن أمكن، أو [ذكّرها أيضًا.](#memoizing-a-dependency-of-another-hook)

---

### أحتاج استدعاء `useMemo` لكل عنصر قائمة في حلقة، وهذا غير مسموح {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

لنقل `Chart` ملفوفًا بـ [`memo`](/reference/react/memo). تريد تخطي إعادة رسم كل `Chart` عند إعادة رسم `ReportList`. لكن لا يمكنك استدعاء `useMemo` داخل حلقة:

```js {expectedErrors: {'react-compiler': [6]}} {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 You can't call useMemo in a loop like this:
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

بدلًا من ذلك، استخرج مكوّنًا لكل عنصر وذكّر البيانات لكل عنصر:

```js {5,12-18}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Call useMemo at the top level:
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

أو أزل `useMemo` ولف `Report` نفسه بـ [`memo`.](/reference/react/memo) إذا لم تتغيّر خاصية `item`، يتخطى `Report` إعادة الرسم، فيتخطى `Chart` أيضًا:

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```
