---
id: hooks-reference
title: مرجع إلى الواجهة البرمجية للـ Hooks
permalink: docs/hooks-reference.html
prev: hooks-custom.html
next: hooks-faq.html
---

*الخطافات* هي إضافة جديدة إلى الإصدار 16.8 في React، إذ تسمح لك باستعمال ميزة الحالة وميزات React الأخرى دون كتابة أي صنف.

تشرح هذه الصفحة الواجهات البرمجية للخطافات المضمَّنة في React.

إن كان موضوع الخطافات جديدًا بالنسبة لك، فيرجى الرجوع إلى صفحة [مدخل إلى الخطافات](/docs/hooks-overview.html) وقراءتها أولًا. قد تجد أيضًا الكثير من المعلومات المفيدة في قسم [الأسئلة الشائعة](/docs/hooks-faq.html).

- [الخطافات الأساسية](#basic-hooks)
  - [`useState`](#usestate)
  - [`useEffect`](#useeffect)
  - [`useContext`](#usecontext)
- [خطافات إضافية](#additional-hooks)
  - [`useReducer`](#usereducer)
  - [`useCallback`](#usecallback)
  - [`useMemo`](#usememo)
  - [`useRef`](#useref)
  - [`useImperativeHandle`](#useimperativehandle)
  - [`useLayoutEffect`](#uselayouteffect)
  - [`useDebugValue`](#usedebugvalue)
  - [`useDeferredValue`](#usedeferredvalue)
  - [`useTransition`](#usetransition)
  - [`useId`](#useid)
- [Library Hooks](#library-hooks)
  - [`useSyncExternalStore`](#usesyncexternalstore)
  - [`useInsertionEffect`](#useinsertioneffect)

## الخطافات الأساسية {#basic-hooks}

### `useState` {#usestate}

```js
const [state, setState] = useState(initialState);
```

يعيد هذا الخطاف قيمةً ذات حالة، ودالةً لتحديث هذه القيمة.

أثناء عملية التصيير الأولية، الحالة المعادة (`state`) هي نفسها القيمة المُمرَّرة كأول وسيط (`initialState`).

تُستعمَل الدالة `setState` لتحديث الحالة، إذ تقبل قيمةً جديدةً للحالة وتدرج في الطابور عملية إعادة تصيير لمكون.

```js
setState(newState);
```

أثناء عمليات إعادة التصيير اللاحقة، القيمة الأولى التي يعيدها الخطاف `useState` ستبقى دومًا أحدث حالة بعد تطبيق التحديثات.


> ملاحظة
>
> يضمن React أن هوية دالة setState مستقرة ولن تتغير في عمليات إعادة التصيير. هذا هو السبب في أنه من الآمن حذفها من قائمة التبعية useEffect أو useCallback.

#### تحديثات عبر تمرير دالة {#functional-updates}

إن حُسبَت الحالة الجديدة باستعمال الحالة السابقة، فيمكنك تمرير دالة إلى `setState`. ستستقبل الدالة القيمة السابقة، وتعيد القيمة المحدَّثة. إليك مثالٌ عن مكون عداد يستعمل كلا الشكلين للخطاف `setState`:

```js
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
  );
}
```

يستعمل الزر "+" والزر "-" الشكل الدالِّي (functional form) لأنَّ القيمة المحدَّثة تعتمد على القيمة السابقة. ولكن الزر "Reset" يستعمل الشكل الاعتيادي لأنَّه يضبط العداد إلى القيمة 0 دومًا.

If your update function returns the exact same value as the current state, the subsequent rerender will be skipped completely.

> ملاحظة
>
> خلافًا للتابع `setState` في مكونات الأصناف، الخطاف `useState` لا يدمج كائنات التحديث (update objects). يمكنك تكرار هذا السلوك عبر دمج شكل الدالة المحدِّثة مع معامل النشر للكائن:
>
> ```js
> const [state, setState] = useState({});
> setState(prevState => {
>   // Object.assign would also work
>   return {...prevState, ...updatedValues};
> });
> ```
>
> هنالك خيار آخر وهو استعمال الخطاف `useReducer` الذي يعدُّ مناسبًا لإدارة كائنات حالة تحوي عدة قيم فرعية.

#### الحالة الأولية الكسولة {#lazy-initial-state}

الوسيط `initialState` هو الحالة المستعملة أثناء عملية التصيير الأولى (initial render). في عمليات التصيير اللاحقة، سيُهمَل هذا الوسيط. إن كانت الحالة الأولية هي ناتج عملية حساب معقدة تؤثر على الأداء، فيمكنك أن تمرِّر دالةً تُنفَّذ مرةً واحدةً في أول عملية تصيير عوضًا عن ذلك:

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

#### عدم تغير الحالة عن إجراء تحديث عليها {#bailing-out-of-a-state-update}

إن حدَّث خطاف حالة وكانت القيمة المحدَّثة نفسَ قيمة الحالة الحالية، فلن تتكبد React عناء تصيير الابن أو تنفيذ التأثيرات. (تستعمل [React الخوارزمية `Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) لإجراء عملية الموازنة.)

لاحظ أن React قد لا يزال بحاجة إلى تصيير هذا المكون المحدد مرة أخرى قبل إنقاذ. لا ينبغي أن يكون ذلك مصدر قلق لأن  React  لن يكون "أعمق" دون داع في الشجرة. إذا كنت تجري حسابات باهظة الثمن أثناء تصيير ، فيمكنك تحسينها باستخدام `useMemo`.

Note that React may still need to render that specific component again before bailing out. That shouldn't be a concern because React won't unnecessarily go "deeper" into the tree. If you're doing expensive calculations while rendering, you can optimize them with `useMemo`.

#### Batching of state updates {#batching-of-state-updates}

React may group several state updates into a single re-render to improve performance. Normally, this improves performance and shouldn't affect your application's behavior.

Before React 18, only updates inside React event handlers were batched. Starting with React 18, [batching is enabled for all updates by default](/blog/2022/03/08/react-18-upgrade-guide.html#automatic-batching). Note that React makes sure that updates from several *different* user-initiated events -- for example, clicking a button twice -- are always processed separately and do not get batched. This prevents logical mistakes.

In the rare case that you need to force the DOM update to be applied synchronously, you may wrap it in [`flushSync`](/docs/react-dom.html#flushsync). However, this can hurt performance so do this only where needed.

### `useEffect` {#useeffect}

```js
useEffect(didUpdate);
```

يقبل هذا الخطاف دالةً تحوي أمرًا يكون غالبًا شيفرةً ذات تأثير.

التعديلات، والاشتراكات، والمؤقتات، والسجلات، والتسجيل (logging)، والتأثيرات الجانبية الأخرى غير مسموحٍ بها داخل الجسم الرئيسي لمكون دالة (يشار إليه على أنَّه مرحلة تصيير React [أي render phase]). سيؤدي فعل ذلك إلى حصول أخطاءٍ مربكة مع تناقضات في واجهة المستخدم.

عوضًا عن ذلك، استعمل الخطاف `useEffect`. الدالة المُمرَّر إليه ستُنفَّذ بعد الانتهاء من التصيير على الشاشة. فكر في التأثيرات وكأنَّها مخرج هروب (escape hatch) من عالم React الوظيفي البحت إلى العالم الأمري.

افتراضيًّا، تُنفَّذ التأثيرات بعد كل عملية تصيير مكتملة، ولكن يمكنك اختيار تنفيذها [فقط عند تغير قيم محدَّدة](#conditionally-firing-an-effect).

#### تنظيف تأثير {#cleaning-up-an-effect}

تنشئ التأثيرات غالبًا موارد تحتاج للتنظيف قبل أن يغادر المكون الشاشة مثل معرِّف اشتراك أو مُؤقِّت. لفعل ذلك، قد تعيد الدالة المُمرَّرة إلى الخطاف `useEffect` دالةً تجري عملية التنظيف. على سبيل المثال، يمكن إنشاء اشتراك بالشكل التالي:

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // تنظيف الاشتراك
    subscription.unsubscribe();
  };
});
```

تُنفَّذ دالة التنظيف قبل حذف المكون من واجهة المستخدم لمنع حدوث تسريب في الذاكرة. أضف إلى ذلك أنَّه إن صُيَّر مكوِّنٌ عدَّة مرات (كما تفعل عادةً)، فسيُنظَّف التأثير السابق قبل تنفيذ التأثير اللاحق. في مثالنا، هذا يعني أنَّه يُنشَأ اشتراك جديد في كل تحديث. لتجنب تنفيذ التأثير عند كل عملية تحديث، ارجع إلى القسم التالي.

#### توقيت التأثيرات {#timing-of-effects}

خلافًا للتابعين `componentDidMount` و `componentDidUpdate`، تُنفَّذ الدالة المُمرَّرة إلى الخطاف `useEffect` بعد التخطيط والرسم أثناء حدث مؤجَّل (deferred event). هذا يجعلها مناسبةً للاستعمال مع العديد من التأثيرات الجانبية الشائعة مثل ضبط الاشتراكات ومعالجات الحدث لأنَّ أغلب أنواع العمل لا يجب أن يحجز المتصفح عن تحديث الشاشة.

على أية حال، لا يمكن تأجيل جميع التأثيرات. على سبيل المثال، يجب أن تُنفَّذ التعديلات التي تجرَى على DOM والظاهرة للمستخدم بشكل متزامن قبل تنفيذ عملية الرسم التالية، لذا لا يلاحظ المستخدم أية تناقضات بصرية. (الفارق من ناحية النظرية مشابهٌ للفارق بين مستمعي حدث نشطين مقابل مستمعي حدث خاملين.) توفر React من أجل هذه الأنواع من التأثيرات خطافًا إضافيًّا يدعى `useLayoutEffect`. يملك هذا الخطاف نفس التوقيع الذي يملكه الخطاف `useEffect`. الاختلاف الوحيد بينهما هو وقت التنفيذ.

<<<<<<< HEAD
رغم أنَّ الخطاف `useEffect` مؤجَّل لبعد انتهاء المتصفح من الرسم، فإنَّ تنفيذه قبل أية عمليات تصيير أخرى أمرٌ مؤكد الحدوث، إذ تنفذ React أية تأثيرات لتصيير سابق قبل بدء تحديث جديد.
=======
Additionally, starting in React 18, the function passed to `useEffect` will fire synchronously **before** layout and paint when it's the result of a discrete user input such as a click, or when it's the result of an update wrapped in [`flushSync`](/docs/react-dom.html#flushsync). This behavior allows the result of the effect to be observed by the event system, or by the caller of [`flushSync`](/docs/react-dom.html#flushsync).

> Note
> 
> This only affects the timing of when the function passed to `useEffect` is called - updates scheduled inside these effects are still deferred. This is different than [`useLayoutEffect`](#uselayouteffect), which fires the function and processes the updates inside of it immediately.

Even in cases where `useEffect` is deferred until after the browser has painted, it's guaranteed to fire before any new renders. React will always flush a previous render's effects before starting a new update.
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

#### تنفيذ تأثير شرطيًّا {#conditionally-firing-an-effect}

السلوك الافتراضي للتأثيرات هو تنفيذ التصيير بعد كل عملية تصيير مكتملة. بهذه الطريقة، يعاد إنشاء تأثيرٍ دومًا إن تغيرت إحدى مدخلاته.

على أية حال، هذا السلوك قد يبدو مبالغًا فيه بشدة في بعض الحالات كما في حالة مثال الاشتراك من القسم السابق. لا نحتاج إلى إنشاء اشتراك جديد في كل تحديث إلا إذا تغيرت الخاصية `source`.

لتنفيذ ذلك، مرِّر وسيطًا ثانيًّا إلى الخطاف `useEffect` يمثِّل مصفوفة القيم التي يعتمد عليها التأثير. يبدو الآن مثالنا المعدَّل بالشكل التالي:

```js
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```

الآن، سيعاد إنشاء الاشتراك عند تغيِّر `props.source`.

> ملاحظة
>
> إذا كنت تستخدم هذا التحسين, تأكد من أن المصفوفة تشمل جميع القيم من نطاق المكون (كـ props و state) التي تتغير مع مرور الوقت والتي يتم استخدامها من قبل التأثير. وإلا ، فإن الشيفرة الخاص بك سوف تشير إلى القيم قديمة من تنصير السابق. تعرف على المزيد حول [كيفية التعامل مع الدوال](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) وماذا تفعل عندما [تتغير قيم المصفوفة كثيرا](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often). 
>
> إذا كنت ترغب في تشغيل تأثير وتنظيفه مرة واحدة فقط )في mount و unmount),  يمكنك تمرير لمصفوفة فارغة كعامل ثاني. هذا يخبر React أن تأثيرك لن يعتمد على أي قيمة من قيم props أو state,  لهذا فهو لن يعيدة تشغيله مرة ثانية.  فهذه لن يتم التعامل معها كحالة خاصة — فهو يتبع مباشرة كيفية عمل تبعية المصفوفات دائمًا. 
>
> إذا مررة ل مصفوفة خالية (`[]`), props و state كـ التأثير داخلي فستكون دائما قيمها الأولية.  أثناء تمرير [] كعامل ثاني قريب من عائلة `componentDidMount` و `componentWillUnmount` نموذج عقلي,  عادة ما تكون هناك [حلول](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) [أفضل](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)  لتجنب إعادة تشغيل التأثيرات في كثير من الأحيان.  كذلك, لا تنسى أن React يؤجل تشغيل `useEffect` حتى بعد أن يقوم المتصفح بالرسم,   لذلك القيام بعمل إضافي . 
>
> نوصي باستخدام  قاعدة [exhaustive-deps](https://github.com/facebook/react/issues/14920) كجزء من حزمة [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation).  يحذر عندما يتم تحديد التبعيات بشكل غير صحيح ويقترح إصلاح.
>

مصفوفة المدخلات لا تُمرَّر كوسائط إلى دالة التأثير. نظريًّا، إليك ما الذي تمثله: كل قيمة أشير إليها داخل دالة التأثير يجب أن تظهر أيضًا في مصفوفة المدخلات. في المستقبل، قد يصبح المصرِّف متقدمًا بما فيه الكفاية لإنشاء هذه المصفوفة تلقائيًا.

### `useContext` {#usecontext}

```js
const value = useContext(MyContext);
```

يقبل هذا الخطاف كائن سياق (context object، أي القيمة المعادة من `React.createContext`) ويعيد قيمة السياق الحالي كما أُعطيَت من قبل أقرب موفِّر سياق (context provider) للسياق المعطى.

عندما يكون أقرب `<MyContext.Provider>` فوق تحديثات المكون, هذا الخطاف سيؤدي إلى إعادة تقديم مع أحدث سياق `value` التي تمررها إلى المزود `MyContext`. حتى لو كان يستخدم [`React.memo`](/docs/react-api.html#reactmemo) أو [`shouldComponentUpdate`](/docs/react-component.html#shouldcomponentupdate), ستبقى اعادة التصيير تحدث بدءاً من المكون نفسه باستخدام `useContext`.

لا تنسى أن العامل `useContext` يجب أن يكون:

* **صحيح:** useContext(MyContext)
* **غير صحيح:** useContext(MyContext.Consumer)
* **غير صحيح:** useContext(MyContext.Provider)

المكون الذي يستدعي `useContext` يقوم دائما بإعادة تصيير عندما تتغير قيم السياق.  إذا كان إعادة تصيير مكلف يمكنك [تحسينه بإستخدام memoization](https://github.com/facebook/react/issues/15156#issuecomment-474590693).

>فائدة
>
>إذا كنت معتادًا على سياق API قبل خطفات, `useContext(MyContext)` تكافئ `static contextType = MyContext` في صنف, أو إلى `<MyContext.Consumer>`.
>
>`useContext(MyContext)` يتيح لك فقط قراءة السياق والاشتراك في تغييراته. 
>ما زلت بحاجة إلى `<MyContext.Provider>` أعلاه في الشجرة لتوفير قيمة لهذا السياق.

**وضعه جنبا إلى جنب مع Context.Provider**
```js{31-36}
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);

  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```
هذا المثال معدل ليتناسب مع hooks من مثال سابق في [الدليل المتقدم للسياق](/docs/context.html), حيث يمكنك العثور على مزيد من المعلومات حول متى وكيفية استخدام السياق.


## خطافات إضافية {#additional-hooks}

الخطافات التالية هي إمَّا شكل آخر للخطافات الأساسية أو يُلجَأ إليها في حالات محدَّدة فقط. لا تجهد نفسك بتعلمهم الآن إن لم تكن بحاجة لهم.

### `useReducer` {#usereducer}

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

هذا الخطاف هو بديل للخطاف [`useState`](#usestate). يقبل هذا الخطاف مخفِّضًا (reducer) من النوع `(state, action) => newState`, ويعيد الحالة الحالية مقرونةً مع التابع `dispatch`. (إن كانت المكتبة Redux مألوفةً لك، فأنت تعرف مسبقًا كيف يعمل ذلك.)

يفضَّل استعمال الخطاف `useReducer` عن الخطاف `useState` عندما يكون هنالك شيفرة حالة معقدة تتضمن قيم فرعية متعددة أو عندما تعتمد الحالة التالية على سابقتها. الخطاف `useReducer` يمكِّنك أيضًا من تحسين الأداء للمكونات التي تستدعي تحديثات عميقة لأنَّه [يمكِّنك من تمرير التابع `dispatch` للداخل بدلًا من ردود النداء.](/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down).

إليك مثال العداد الذي أعيد كتابته من القسم [`useState`](#usestate) ليستعمل مخفِّضًا:

```js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

> ملاحظة
>
>React يضمن بقاء الهوية الدالة  `dispatch` مستقرة ولن تتغير عند إعادة تصيير. هذا هو السبب الذي يجعل من الآمن حذف  `useEffect` أو `useCallback` من قائمة التبعية.

#### تحديد الحالة الأولية {#specifying-the-initial-state}

هنالك طريقتان مختلفان لتهيئة حالة الخطاف `useReducer` يمكنك الاختيار بينهما بناءً على الحالة المستعملة آنذاك. الطريقة الأبسط هي تمرير الحالة الأولية كوسيطٍ ثانٍ:

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

>ملاحظة
>
>لا تستعمل React الوسيط `state = initialState` المتعارف عليه والشائع في المكتبة Redux. القيمة الأولية تعتمد أحيانًا على خاصيات وبذلك تُحدَّد من استدعاء الخطاف. إن كنت تشعر بشدة حيال ذلك، فيمكنك استدعاء `useReducer(reducer, undefined, reducer)` لمحاكاة سلوك Redux ولكن لا نشجع على ذلك.

#### التهيئة الكسولة {#lazy-initialization}

يمكنك أيضًا إنشاء الحالة الأولية بتكاسل (lazily) عبر تمرير الدالة `init` كوسيط ثالث. ستُضبَط الحالة الأولية إلى `init(initialArg)`.

يمكِّنك ذلك من استخراج الشيفرة لحساب الحالة الأولية خارج المُخفِّض (reducer). هذا الأمر مفيدٌ وعملي لإعادة ضبط الحالة لاحقًا بالاستجابة لفعلٍ ما.

```js{1-3,11-12,19,24}
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

#### عدم تغير الحالة عن إجراء تحديث عليها {#bailing-out-of-a-dispatch}

إن أعيدت القيمة نفسها من خطافٍ مخفِّضٍ (Reducer Hook) والتي تمثِّل الحالة الحالية، فلن تتكبد React عناء تصيير الابن أو تنفيذ التأثيرات. (تستعمل [ React الخوارزمية `Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).)لإجراء عملية الموازنة.)

Note that React may still need to render that specific component again before bailing out. That shouldn't be a concern because React won't unnecessarily go "deeper" into the tree. If you're doing expensive calculations while rendering, you can optimize them with `useMemo`.

### `useCallback` {#usecallback}

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

يعيد نداء [memoized](https://en.wikipedia.org/wiki/Memoization).

يُمرَّر إلى هذا الخطاف رد نداء سطري (inline callback) ومصفوفة من المدخلات. `useCallback` ويعيد نسخة مُستظهَرة (memoized version، أي محفوظة دون إعادة تكرار العملية) من رد النداء المعطى والذي يتغير إن تغيرت قيمة إحدى مدخلاته فقط. هذا السلوك مفيدٌ للغاية عند تمرير ردود نداء لتحسين المكونات الأبناء الي تعتمد على المساواة المرجعية (reference equality) لمنع عمليات التصيير الغير ضرورية (مثل `shouldComponentUpdate`).

الاستدعاء `useCallback(fn, inputs)`  مكافئ للاستدعاء `useMemo(() => fn, inputs)`.

> ملاحظة
>
> مصفوفة المدخلات لا تُمرَّر كوسائط إلى رد النداء. نظريًّا، إليك ما الذي تمثله: كل قيمة أشير إليها داخل رد النداء يجب أن تظهر أيضًا في مصفوفة المدخلات. في المستقبل، قد يصبح المصرِّف متقدمًا بما فيه الكفاية لإنشاء هذه المصفوفة تلقائيًا.
>
> نوصي باستخدام  قاعدة [exhaustive-deps](https://github.com/facebook/react/issues/14920) كجزء من حزمة [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation).  يحذر عندما يتم تحديد التبعيات بشكل غير صحيح ويقترح إصلاح.

### `useMemo` {#usememo}

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

يعيد هذا الخطاف قيمةً مُستظهَرةً [memoized](https://en.wikipedia.org/wiki/Memoization).

يُمرَّر إلى الخطاف `useMemo` دالة إنشاء (create function) ومصفوفة من المدخلات. سيحسب الخطاف القيمة المُستظهَرة عند تغيِّر إحدى المدخلات فقط. يساعد هذا التحسين في تجنب إعادة إجراء عمليات الحساب المستهلكة للأداء عند كل تصيير.

تذكر أنَّ الدالة المُمرَّرة إلى الخطاف `useMemo` تُنفَّذ أثناء عملية التصيير. لا تفعل أي شيء إضافي لا تفعله عادةً أثناء عملية التصيير. على سبيل المثال، التأثيرات الجانبية تنتمي إلى الخطاف `useEffect` وليس إلى الخطاف `useMemo`.

إن لم تُعطَ أية مصفوفة، ستُحسَب قيمةٌ جديدةٌ متى ما مُرِّرت نسخة دالة جديدة كأول وسيط. (أو في كل عملية تصيير مع دالة سطرية [inline function])

**يمكنك الاعتماد على الخطاف `useMemo` لتحسين الأداء، وليس لضمان الدلالات (semantic guarantee).** في المستقبل، قد تختار React بأن "تنسى" بعض القيم المُستظهَرة (المحفوظة) وتعيد حسابها من جديد في عملية التصيير التالية وذلك لتحرير الذاكرة لمكونات غير ظاهرة على الشاشة مثلًا. اكتب أولًا شيفرتك لتعمل بشكل صحيح دون الخطاف `useMemo`، ومن ثمَّ أضفه لتحسين الأداء.

> ملاحظة
>
> مصفوفة المدخلات لا تُمرَّر كوسائط إلى الدالة. نظريًّا، إليك ما الذي تمثله: كل قيمة أُشيِر إليها داخل الدالة يجب أن تظهر أيضًا في مصفوفة المدخلات. في المستقبل، قد يصبح المصرِّف متقدمًا بما فيه الكفاية لإنشاء هذه المصفوفة تلقائيًا.
>
> نوصي باستخدام  قاعدة [exhaustive-deps](https://github.com/facebook/react/issues/14920) كجزء من حزمة [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation).  يحذر عندما يتم تحديد التبعيات بشكل غير صحيح ويقترح إصلاح.

### `useRef` {#useref}

```js
const refContainer = useRef(initialValue);
```

يعيد هذا الخطاف كائنًا مرجعيًّا قابلًا للتعديل (mutable ref object) تُهيَّأ الخاصية ‎.`current` فيه إلى قيمة الوسيط المُمرَّر (أي الوسيط `initialValue`).

قد يبقى الكائن المعاد حتى كامل دورة حياة المكون. حالة الاستعمال الشائعة لهذا الخطاف هي الحاجة إلى الوصول إلى ابنٍ بشكل إلزامي:

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // (mounted) إلى عنصر الإدخال النصي الموصول `current` يشير
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

بصفة أساسية, `useRef` هي مثل العلبة التي تحوي على القيم القابلة لتغير داخل خاصية`.current`.

قد تكون على دراية  بـ refs كطريقة أساسية [لـولوج إلى DOM](https://reactjs.org/docs/refs-and-the-dom.html). إذا قمت بتمرير كائن المرجع إلى React بـ `<div ref={myRef} />`, يحدد React خاصية `.current` إلى عقدةDOM  المعنية كلما تغير ذلك العقد .

ومع ذلك, `useRef()` فهو مفيد لأكثر من صفة `ref`. إنه [مفيد للحفاظ على أي قيمة قابلة للتغيير حولها](https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables) مشابه لكيفية استخدام حقول في الأصناف

هذا يعمل لأن `useRef()` ينشأ كائن JavaScript عادي. الفرق الوحين بين `useRef()` و إنشاء كائن `{current: ...}` بنفسك هو أن `useRef` سيعطيك نفس كائن ref عند كل تصيير.

لا تنسى أن `useRef` لا يعلمك عندما يتغير محتواه. تغير خاصية `.current` لا يعيد تصيير. إذا أردت تشغيل بعض الشفرات عندما يقوم React بالربط أو الفك ref لعقد DOM قد ترغب في استخدام [callback ref](https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node).

### `useImperativeHandle` {#useimperativehandle}

```js
useImperativeHandle(ref, createHandle, [deps])
```

يخصِّص هذا الخطاف نسخة المتغير التي تُعرَض لمكون أب عند استعمال `ref`. كما هو الحال دومًا، الشيفرة الأمرية التي تستعمل المراجع (refs) يجب أن تُتجنَّب في أغلب الحالات. الخطاف `useImperativeHandle` يجب أن يُستعمَل مع [`forwardRef`](/docs/react-api.html#reactforwardref) بالشكل التالي:

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

في هذا المثال، سيكون المكون الأب الذي يصير `<FancyInput ref={inputRef} />` قادرًا على استدعاء `inputRef.current.focus()`.

### `useLayoutEffect` {#uselayouteffect}

توقيع هذا الخطاف مماثل تمامًا للخطاف `useEffect` ولكن يُنفَّذ بشكل متزامن بعد إجراء كل التعديلات على DOM. استعمل هذا الخطاف لقراءة التخطيط (layout) من شجرة DOM وإعادة التصيير بشكل متزامن. ستُجرَى أية تحديثات مجدولة داخل الخطاف `useLayoutEffect` بشكل متزامن قبل أن يملك المتصفح فرصةً لإجراء عملية الرسم.

يفضل استعمال الخطاف `useEffect` الأساسي متى ما أمكنك ذلك لتجنب حجز التحديثات البصرية.

> نصيحة
>
> إن كنت تستبدل شيفرة كتُبَت عبر مكون صنف أو هجرت مكون صنف وأردت استعمال الخطافات، يُنفَّذ الخطاف `useLayoutEffect` في نفس المرحلة التي ينفَّذ فيها التابعان `componentDidMount` و `componentDidUpdate`، لذا إن لم تكن متأكدًا أيَّ خطاف تأثير تريد استعماله، فهذا الخطاف يرجَّح أن يكون أقل خطورة.
>
> إذا كنت تسخدم خادم التصيير, تذكر أنه لن يشتغل `useLayoutEffect` ولا `useEffect` حتى يتم تحميل javaScript. لهذا السبب يقوم React بتحذير خادم التصيير المكون الذي يحتوي `useLayoutEffect`. لتصليحه عليك, إما بنقل ذلك المنطق إلى `useEffect` (إذ لم تكن مهمة في تصيير الأول), أو تأخير ذلك المكون حتى بعد أن يقوم الزبون ب تصيير(إذا كان HTML يبدو مخرب حتى بعد تشغيل `useLayoutEffect`).
>
> لإستبعاد المكون الذي يحتاج إلى طبقة تأثيرات من خادم التصيير HTML, لتصيره بشرط يجب إستخدام `showChild && <Child />` وتأجيل إظهاره بإستخدام `useEffect(() => { setShowChild(true); }, [])`. بهذه الطريقة, واجهة المستخدم لا تظهر مكسورة.

### `useDebugValue` {#usedebugvalue}

```js
useDebugValue(value)
```

يمكن استعمال هذا الخطاف لإظهار تسمية (label) للخطافات المخصصة في أدوات تطوير React (أي React DevTools).

على سبيل المثال، افترض أنَّنا عرفنا الخطاف `useFriendStatus` المخصص الذي شرحناه في صفحة ["بناء خطاف خاص بك"](/docs/hooks-custom.html):

```js{6-8}
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // بجانب هذا الخطاف (DevTools) اظهار تسمية في أدوات التطوير
  // "FriendStatus: Online" أي
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

> نصيحة
>
> لا ننصح بإضافة قيم تنقيح الأخطاء (debug values) لكل خطاف مخصَّص. الشيء الأكثر نفعًا وقيمةً للخطافات المخصصة هو أن تكون جزءًا من المكتبات المشتركة (shared libraries).

#### الصيغة المؤجلة لقيم التنقيح {#defer-formatting-debug-values}

في بعض الحالات، قد تستهلك عملية تنسيق قيمة لإظهارها الكثير من الأداء. أضف إلى ذلك أنَّها غير ضرورية إلا إذا كان يجري فحص خطاف محدَّد.

لذلك السبب، يقبل الخطاف `useDebugValue` دالة تنسيق يمكن تمريرها كوسيطٍ ثانٍ اختياريًّا. تُستدعَى هذا الدالة فقط إن كان الخطاف قيد الفحص (inspect)، ويمرَّر إليها قيمة التنقيح كوسيط ويجب أن تعيد قيمة منسقة قابلة للعرض.

على سبيل المثال، يستطيع الخطاف المخصَّص الذي يعيد القيمة `Date` أن يتجنب استدعاء الدالة `toDateString` بشكل غير ضروري عبر تمرير المنسِّق التالي:

```js
useDebugValue(date, date => date.toDateString());
```

### `useDeferredValue` {#usedeferredvalue}

```js
const deferredValue = useDeferredValue(value);
```

`useDeferredValue` accepts a value and returns a new copy of the value that will defer to more urgent updates. If the current render is the result of an urgent update, like user input, React will return the previous value and then render the new value after the urgent render has completed.

This hook is similar to user-space hooks which use debouncing or throttling to defer updates. The benefits to using `useDeferredValue` is that React will work on the update as soon as other work finishes (instead of waiting for an arbitrary amount of time), and like [`startTransition`](/docs/react-api.html#starttransition), deferred values can suspend without triggering an unexpected fallback for existing content.

#### Memoizing deferred children {#memoizing-deferred-children}
`useDeferredValue` only defers the value that you pass to it. If you want to prevent a child component from re-rendering during an urgent update, you must also memoize that component with [`React.memo`](/docs/react-api.html#reactmemo) or [`React.useMemo`](/docs/hooks-reference.html#usememo):

```js
function Typeahead() {
  const query = useSearchQuery('');
  const deferredQuery = useDeferredValue(query);

  // Memoizing tells React to only re-render when deferredQuery changes,
  // not when query changes.
  const suggestions = useMemo(() =>
    <SearchSuggestions query={deferredQuery} />,
    [deferredQuery]
  );

  return (
    <>
      <SearchInput query={query} />
      <Suspense fallback="Loading results...">
        {suggestions}
      </Suspense>
    </>
  );
}
```

Memoizing the children tells React that it only needs to re-render them when `deferredQuery` changes and not when `query` changes. This caveat is not unique to `useDeferredValue`, and it's the same pattern you would use with similar hooks that use debouncing or throttling.

### `useTransition` {#usetransition}

```js
const [isPending, startTransition] = useTransition();
```

Returns a stateful value for the pending state of the transition, and a function to start it.

`startTransition` lets you mark updates in the provided callback as transitions:

```js
startTransition(() => {
  setCount(count + 1);
})
```

`isPending` indicates when a transition is active to show a pending state:

```js
function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  
  function handleClick() {
    startTransition(() => {
      setCount(c => c + 1);
    })
  }

  return (
    <div>
      {isPending && <Spinner />}
      <button onClick={handleClick}>{count}</button>
    </div>
  );
}
```

> Note:
>
> Updates in a transition yield to more urgent updates such as clicks.
>
> Updates in a transitions will not show a fallback for re-suspended content. This allows the user to continue interacting with the current content while rendering the update.

### `useId` {#useid}

```js
const id = useId();
```

`useId` is a hook for generating unique IDs that are stable across the server and client, while avoiding hydration mismatches.

> Note
>
> `useId` is **not** for generating [keys in a list](/docs/lists-and-keys.html#keys). Keys should be generated from your data.

For a basic example, pass the `id` directly to the elements that need it:

```js
function Checkbox() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Do you like React?</label>
      <input id={id} type="checkbox" name="react"/>
    </>
  );
};
```

For multiple IDs in the same component, append a suffix using the same `id`:

```js
function NameFields() {
  const id = useId();
  return (
    <div>
      <label htmlFor={id + '-firstName'}>First Name</label>
      <div>
        <input id={id + '-firstName'} type="text" />
      </div>
      <label htmlFor={id + '-lastName'}>Last Name</label>
      <div>
        <input id={id + '-lastName'} type="text" />
      </div>
    </div>
  );
}
```

> Note:
> 
> `useId` generates a string that includes the `:` token. This helps ensure that the token is unique, but is not supported in CSS selectors or APIs like `querySelectorAll`.
> 
> `useId` supports an `identifierPrefix` to prevent collisions in multi-root apps. To configure, see the options for [`hydrateRoot`](/docs/react-dom-client.html#hydrateroot) and [`ReactDOMServer`](/docs/react-dom-server.html).

## Library Hooks {#library-hooks}

The following Hooks are provided for library authors to integrate libraries deeply into the React model, and are not typically used in application code.

### `useSyncExternalStore` {#usesyncexternalstore}

```js
const state = useSyncExternalStore(subscribe, getSnapshot[, getServerSnapshot]);
```

`useSyncExternalStore` is a hook recommended for reading and subscribing from external data sources in a way that's compatible with concurrent rendering features like selective hydration and time slicing.

This method returns the value of the store and accepts three arguments:
- `subscribe`: function to register a callback that is called whenever the store changes.
- `getSnapshot`: function that returns the current value of the store.
- `getServerSnapshot`: function that returns the snapshot used during server rendering.

The most basic example simply subscribes to the entire store:

```js
const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
```

However, you can also subscribe to a specific field:

```js
const selectedField = useSyncExternalStore(
  store.subscribe,
  () => store.getSnapshot().selectedField,
);
```

When server rendering, you must serialize the store value used on the server, and provide it to `useSyncExternalStore`. React will use this snapshot during hydration to prevent server mismatches:

```js
const selectedField = useSyncExternalStore(
  store.subscribe,
  () => store.getSnapshot().selectedField,
  () => INITIAL_SERVER_SNAPSHOT.selectedField,
);
```

> Note:
>
> `getSnapshot` must return a cached value. If getSnapshot is called multiple times in a row, it must return the same exact value unless there was a store update in between.
> 
> A shim is provided for supporting multiple React versions published as `use-sync-external-store/shim`. This shim will prefer `useSyncExternalStore` when available, and fallback to a user-space implementation when it's not.
> 
> As a convenience, we also provide a version of the API with automatic support for memoizing the result of getSnapshot published as `use-sync-external-store/with-selector`.

### `useInsertionEffect` {#useinsertioneffect}

```js
useInsertionEffect(didUpdate);
```

The signature is identical to `useEffect`, but it fires synchronously _before_ all DOM mutations. Use this to inject styles into the DOM before reading layout in [`useLayoutEffect`](#uselayouteffect). Since this hook is limited in scope, this hook does not have access to refs and cannot schedule updates.

> Note:
>
> `useInsertionEffect` should be limited to css-in-js library authors. Prefer [`useEffect`](#useeffect) or [`useLayoutEffect`](#uselayouteffect) instead.
