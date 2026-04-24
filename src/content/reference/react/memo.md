---
title: "دالة memo"
---

<Intro>

`memo` تتيح تخطي إعادة عرض مكوّن عندما لا تتغيّر خصائصه.

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) يطبّق تلقائيًا ما يعادل `memo` على كل المكوّنات، ما يقلّل الحاجة للتذكير اليدوي. يمكنك استخدام المجمّع لمعالجة تذكير المكوّنات تلقائيًا.

</Note>

<InlineToc />

---

## المرجع {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

لفّ مكوّنًا بـ `memo` للحصول على نسخة *مذكّرة (memoized)* منه. هذه النسخة عادةً لا تُعاد رسمها عند إعادة عرض الأب ما دامت خصائصها لم تتغيّر. لكن React قد تعيد عرضها مع ذلك: التذكير تحسين أداء وليس ضمانًا.

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `Component`: المكوّن الذي تريد تذكيره. لا تعدّل `memo` هذا المكوّن، بل تُرجع مكوّنًا جديدًا مذكّرًا بدلًا منه. يُقبل أي مكوّن React صالح، بما فيه الدوال ومكوّنات [`forwardRef`](/reference/react/forwardRef).

* **اختياري** `arePropsEqual`: دالة تأخذ معاملين: خصائص المكوّن السابقة والجديدة. يجب أن تُرجع `true` إذا كانت الخصائص متساوية: أي أن المكوّن سيعرض نفس المخرجات ويتصرّف بنفس الطريقة مع الخصائص الجديدة كما مع القديمة. وإلا تُرجع `false`. عادةً لن تحدد هذه الدالة. افتراضيًا، تقارن React كل خاصية بـ [`Object.is`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

#### القيمة المُرجَعة {/*returns*/}

`memo` تُرجع مكوّن React جديدًا. يتصرّف كالمكوّن المُمرَّر إلى `memo` لكن React لن تعيد عرضه دائمًا عند إعادة عرض الأب ما لم تتغيّر خصائصه.

---

## الاستخدام {/*usage*/}

### تخطي إعادة العرض عند ثبات الخصائص {/*skipping-re-rendering-when-props-are-unchanged*/}

تُعيد React عرض المكوّن عادةً عند كل إعادة عرض للأب. بـ `memo`، يمكنك إنشاء مكوّن لا تعيد React عرضه عند إعادة عرض الأب ما دامت الخصائص الجديدة مطابقة للقديمة. يُقال لمثل هذا المكوّن إنه *مذكّر*.

لتذكير مكوّن، لفّه بـ `memo` واستخدم القيمة المُرجَعة بدل المكوّن الأصلي:

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```

يجب أن يكون لمكوّن React دائمًا [منطق عرض نقي.](/learn/keeping-components-pure) أي أنه يجب أن يُرجع نفس المخرجات إذا لم تتغيّر الخصائص والحالة والسياق. باستخدام `memo`، تخبر React أن مكوّنك يلتزم بهذا، فلا حاجة لإعادة العرض ما دامت الخصائص لم تتغيّر. حتى مع `memo`، يُعاد عرض المكوّن إذا تغيّرت حالته أو سياق يستخدمه.

في هذا المثال، لاحظ أن مكوّن `Greeting` يُعاد عرضه عند تغيّر `name` (لأنه من خصائصه)، وليس عند تغيّر `address` (لأنه لا يُمرَّر إلى `Greeting` كخاصية):

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

**يجب أن تعتمد على `memo` كتحسين أداء فقط.** إذا لم تعمل شيفرتك بدونه، اكتشف المشكلة الجذرية وأصلحها أولًا. ثم يمكنك إضافة `memo` لتحسين الأداء.

</Note>

<DeepDive>

#### هل تضيف memo في كل مكان؟ {/*should-you-add-memo-everywhere*/}

إذا كان تطبيقك مثل هذا الموقع وتفاعلاته غالبة خشنة (مثل استبدال صفحة أو قسم كامل)، التذكير غالبًا غير لازم. أما إذا كان أشبه بمحرّر رسوم وتفاعلاته دقيقة (مثل تحريك أشكال)، قد يكون التذكير مفيدًا جدًا.

التحسين بـ `memo` يفيد فقط عندما يُعاد عرض المكوّن كثيرًا بنفس الخصائص تمامًا ومنطق إعادة العرض مكلف. إذا لم يكن هناك تأخير ملحوظ عند إعادة العرض، `memo` غير لازمة. تذكّر أن `memo` عديمة الفائدة إذا كانت الخصائص الممرّرة *دائمًا مختلفة،* مثل تمرير كائن أو دالة عادية تُعرَّف أثناء العرض. لذلك غالبًا تحتاج [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) و[`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) مع `memo`.

لا فائدة من لفّ مكوّن بـ `memo` في الحالات الأخرى. ولا ضرر كبير في ذلك أيضًا، فبعض الفرق تفضّل التذكير قدر الإمكان. العيب أن الشيفرة تصبح أقل وضوحًا. وليس كل التذكير فعّالًا: قيمة واحدة «دائمة الجُدد» تكفي لكسر التذكير للمكوّن بأكمله.

**عمليًا، يمكنك جعل كثير من التذكير غير لازم باتباع مبادئ:**

1. عندما يغلّف مكوّن بصريًا مكوّنات أخرى، دعه [يقبل JSX كأبناء.](/learn/passing-props-to-a-component#passing-jsx-as-children) هكذا عندما يحدّث المغلّف حالته، تعرف React أن الأبناء لا يحتاجون إعادة عرض.
1. فضّل الحالة المحلية ولا [ترفع الحالة](/learn/sharing-state-between-components) أكثر من اللازم. مثلًا، لا تخزّن حالة عابرة مثل النماذج وما إذا كان عنصر تحت المؤشر في أعلى الشجرة أو مكتبة حالة عامة.
1. حافظ على [نقاء منطق العرض.](/learn/keeping-components-pure) إذا تسبب إعادة العرض بمشكلة أو شذوذ بصري، فهذا خلل في المكوّن! أصلح الخلل بدل إضافة تذكير.
1. تجنّب [Effects غير الضرورية التي تُحدّث الحالة.](/learn/you-might-not-need-an-effect) أغلب مشاكل الأداء في تطبيقات React سببها سلاسل تحديث تنبع من Effects تجعل المكوّنات تعيد العرض مرارًا.
1. حاول [إزالة تبعيات غير ضرورية من Effects.](/learn/removing-effect-dependencies) مثلًا، بدل التذكير، غالبًا أبسط نقل كائن أو دالة داخل Effect أو خارج المكوّن.

إذا بقي تفاعل معيّن بطيئًا، [استخدم محلل React Developer Tools](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) لمعرفة المكوّنات الأكثر استفادة من التذكير وأضفه حيث يلزم. هذه المبادئ تسهّل التصحيح والفهم، فمن الجيد اتباعها في كل الأحوال. على المدى الطويل، نبحث في [تذكير دقيق تلقائي](https://www.youtube.com/watch?v=lGEMwh32soc) لحل الموضوع جذريًا.

</DeepDive>

---

### تحديث مكوّن مذكّر باستخدام الحالة {/*updating-a-memoized-component-using-state*/}

حتى المكوّن المذكّر يُعاد عرضه عند تغيّر حالته الخاصة. التذكير يخص فقط الخصائص الممرّرة من الأب.

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting was rendered at', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Hello');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Hello'}
          onChange={e => onChange('Hello')}
        />
        Regular greeting
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Hello and welcome'}
          onChange={e => onChange('Hello and welcome')}
        />
        Enthusiastic greeting
      </label>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

إذا عيّنت متغير حالته إلى قيمته الحالية، تتخطى React إعادة عرض مكوّنك حتى بدون `memo`. قد ترى دالة المكوّن تُستدعى مرة إضافية، لكن النتيجة تُهمل.

---

### تحديث مكوّن مذكّر باستخدام سياق {/*updating-a-memoized-component-using-a-context*/}

حتى المكوّن المذكّر يُعاد عرضه عند تغيّر سياق يستخدمه. التذكير يخص فقط الخصائص الممرّرة من الأب.

<Sandpack>

```js
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <ThemeContext value={theme}>
      <button onClick={handleClick}>
        Switch theme
      </button>
      <Greeting name="Taylor" />
    </ThemeContext>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Hello, {name}!</h3>
  );
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}

.light {
  color: black;
  background-color: white;
}

.dark {
  color: white;
  background-color: black;
}
```

</Sandpack>

لجعل المكوّن يُعاد عرضه فقط عند تغيّر *جزء* من سياق ما، قسّم المكوّن إلى اثنين. اقرأ ما تحتاجه من السياق في المكوّن الخارجي، ومرّره لمذكّر فرعي كخاصية.

---

### تقليل تغيّر الخصائص {/*minimizing-props-changes*/}

عند استخدام `memo`، يُعاد عرض المكوّن عندما لا تكون أي خاصية *مساوية سطحيًا* لما كانت عليه. أي أن React تقارن كل خاصية بقيمتها السابقة باستخدام [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). لاحظ أن `Object.is(3, 3)` هي `true`، لكن `Object.is({}, {})` هي `false`.


للاستفادة القصوى من `memo`، قلّل مرات تغيّر الخصائص. مثلًا، إذا كانت الخاصية كائنًا، امنع الأب من إعادة إنشاء الكائن في كل مرة باستخدام [`useMemo`:](/reference/react/useMemo)

```js {5-8}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

طريقة أفضل لتقليل تغيّر الخصائص هي أن يقبل المكوّن الحد الأدنى من المعلومات في خصائصه. مثلًا، يمكنه قبول قيم منفصلة بدل كائن كامل:

```js {4,7}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

حتى القيم المنفردة يمكن إسقاطها أحيانًا إلى قيم تتغيّر أقل تكرارًا. هنا يقبل المكوّن قيمة منطقية تدل على وجود قيمة بدل القيمة نفسها:

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```

عند الحاجة لتمرير دالة إلى مكوّن مذكّر، إمّا أن تُعلنها خارج مكوّنك فلا تتغيّر، أو تستخدم [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) لتخزين تعريفها بين عمليات العرض.

---

### تحديد دالة مقارنة مخصّصة {/*specifying-a-custom-comparison-function*/}

في حالات نادرة قد يكون تقليل تغيّر خصائص المكوّن المذكّر غير عملي. يمكنك حينها توفير دالة مقارنة مخصّصة تستخدمها React لمقارنة الخصائص القديمة والجديدة بدل المساواة السطحية. تُمرَّر كالمعامل الثاني لـ `memo`. يجب أن تُرجع `true` فقط إذا كانت الخصائص الجديدة ستُنتج نفس مخرجات القديمة؛ وإلا `false`.

```js {3}
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

إذا فعلت ذلك، استخدم لوحة الأداء في أدوات المطوّر للتأكد أن دالة المقارنة أسرع فعلًا من إعادة عرض المكوّن. قد تُفاجأ.

عند قياس الأداء، تأكد أن React تعمل في وضع الإنتاج.

<Pitfall>

إذا وفّرت تنفيذًا مخصّصًا لـ `arePropsEqual`، **يجب أن تقارن كل خاصية، بما فيها الدوال.** الدوال غالبًا [تغلق على (close over)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) خصائص وحالة الآباء. إذا أرجعت `true` بينما `oldProps.onClick !== newProps.onClick`، سيظل مكوّنك «يرى» خصائص وحالة عرض سابق داخل معالج `onClick`، ما يسبب أخطاء مربكة.

تجنّب المساواة العميقة داخل `arePropsEqual` إلا إذا كنت متأكدًا أن بنية البيانات لها عمق محدود معروف. **المساواة العميقة قد تصبح بطيئة جدًا** وتجمّد التطبيق لثوانٍ إذا غيّر أحدهم البنية لاحقًا.

</Pitfall>

---

### هل ما زلت أحتاج React.memo مع React Compiler؟ {/*react-compiler-memo*/}

عند تفعيل [React Compiler](/learn/react-compiler)، عادةً لا تحتاج `React.memo` بعد ذلك. المجمّع يحسّن إعادة عرض المكوّنات تلقائيًا.

إليك كيف يعمل:

**بدون React Compiler**، تحتاج `React.memo` لمنع إعادات العرض غير الضرورية:

```js
// Parent re-renders every second
function Parent() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1>Seconds: {seconds}</h1>
      <ExpensiveChild name="John" />
    </>
  );
}

// Without memo, this re-renders every second even though props don't change
const ExpensiveChild = memo(function ExpensiveChild({ name }) {
  console.log('ExpensiveChild rendered');
  return <div>Hello, {name}!</div>;
});
```

**مع تفعيل React Compiler**، يحدث نفس التحسين تلقائيًا:

```js
// No memo needed - compiler prevents re-renders automatically
function ExpensiveChild({ name }) {
  console.log('ExpensiveChild rendered');
  return <div>Hello, {name}!</div>;
}
```

إليك الجزء الأساسي مما يولّده React Compiler:

```js {6-12}
function Parent() {
  const $ = _c(7);
  const [seconds, setSeconds] = useState(0);
  // ... other code ...

  let t3;
  if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = <ExpensiveChild name="John" />;
    $[4] = t3;
  } else {
    t3 = $[4];
  }
  // ... return statement ...
}
```

لاحظ الأسطر المظللة: المجمّع يلفّ `<ExpensiveChild name="John" />` بفحص ذاكرة تخزين مؤقت. بما أن خاصية `name` دائمًا `"John"`، يُنشأ هذا JSX مرة واحدة ويُعاد استخدامه في كل إعادة عرض للأب. هذا بالضبط ما تفعله `React.memo`—تمنع إعادة عرض الابن عندما لا تتغيّر خصائصه.

React Compiler تلقائيًا:
1. تتتبع أن خاصية `name` الممرّرة إلى `ExpensiveChild` لم تتغيّر
2. تعيد استخدام JSX السابق لـ `<ExpensiveChild name="John" />`
3. تتخطى إعادة عرض `ExpensiveChild` بالكامل

يعني ذلك **يمكنك إزالة `React.memo` بأمان من مكوّناتك عند استخدام React Compiler**. المجمّع يوفّر نفس التحسين تلقائيًا، فتصبح الشيفرة أوضح وأسهل صيانة.

<Note>

تحسين المجمّع أشمل فعلًا من `React.memo`. يذكّر أيضًا القيم الوسيطة والحسابات المكلفة داخل المكوّنات، أشبه بدمج `React.memo` مع `useMemo` عبر شجرة المكوّنات.

</Note>

---

## استكشاف الأخطاء {/*troubleshooting*/}
### يُعاد عرض مكوّني عندما تكون الخاصية كائنًا أو مصفوفة أو دالة {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

تقارن React الخصائص القديمة والجديدة بالمساواة السطحية: أي هل كل خاصية جديدة مساوية بالمرجع للقديمة. إذا أنشأت كائنًا أو مصفوفة جديدة في كل إعادة عرض للأب، حتى لو تطابقت العناصر، تعتبر React أنها تغيّرت. كذلك إذا أنشأت دالة جديدة عند عرض الأب، تعتبر أنها تغيّرت حتى لو التعريف نفسه. لتجنب ذلك، [بسّط الخصائص أو ذكّرها في الأب](#minimizing-props-changes).
