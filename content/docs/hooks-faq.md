---
id: hooks-faq
title: Hooks FAQ
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

*الخطافات* هي إضافة جديدة إلى الإصدار 16.8 في React، إذ تسمح لك باستعمال ميزة الحالة وميزات React الأخرى دون كتابة أي صنف.

تجيب هذه الصفحة عن بعض الأسئلة التي يتكرر طرحها حول [الخطافات](/docs/hooks-overview.html).

<!--
  if you ever need to regenerate this, this snippet in the devtools console might help:

  $$('.anchor').map(a =>
    `${' '.repeat(2 * +a.parentNode.nodeName.slice(1))}` +
    `[${a.parentNode.textContent}](${a.getAttribute('href')})`
  ).join('\n')
-->

* **[	خطة تبني الخطافات](#adoption-strategy)**
  * [	أي إصدار من React يتضمن الخطافات؟](#which-versions-of-react-include-hooks)
  * [هل احتاج إلى إعادة كتابة جميع مكونات الأصناف الخاصة بي؟](#do-i-need-to-rewrite-all-my-class-components)
  * [	ما الذي يمكنني فعله مع الخطافات ولا يمكنني فعله مع الأصناف؟](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [	ما هي نسبة المعرفة التي بقيت على صلة بـ React فيما يخص الخطافات؟](#how-much-of-my-react-knowledge-stays-relevant)
  * [أيتوجب علي استعمال الخطافات، أم الأصناف، أم كلاهما؟](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [هل تغطي الخطافات جميع حالات الاستخدام التي توفرها الأصناف؟](#do-hooks-cover-all-use-cases-for-classes)
  * [	هل تستبدل الخطافات خاصيات التصيير والمكونات ذات الترتيب الأعلى؟](#do-hooks-replace-render-props-and-higher-order-components)
  * [ما الذي تعينه الخطافات بالنسبة للواجهات البرمجية الشهيرة مثل connect()‎ في مكتبة Redux ومكتبة React Router؟](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [	هل تعمل الخطافات مع أنواع البيانات الثابتة (static typing)؟](#do-hooks-work-with-static-typing)
  * [	كيف يمكن اختبار المكونات التي تستعمل الخطافات؟](#how-to-test-components-that-use-hooks)
  * [	ما الذي يحصل بالضبط عند فرض تطبيق قواعد إضافة تصحيح الأخطاء ESLint؟](#what-exactly-do-the-lint-rules-enforce)
* **[من الأصناف إلى الخطافات](#from-classes-to-hooks)**
  * [	كيف تتوافق توابع دورة الحياة مع الخطافات؟](#how-do-lifecycle-methods-correspond-to-hooks)
  * [كيف يمكنني أن أحصل على معلمات بواسطة الخطافات؟](#how-can-i-do-data-fetching-with-hooks)
  * [	هل هنالك شيء شبيه بمتغيرات النسخة؟](#is-there-something-like-instance-variables)
  * [	هل يجب أن استعمل متغير حالة واحد أم عدة متغيرات؟](#should-i-use-one-or-many-state-variables)
  * [	هل يمكنني تنفيذ تأثير عند إجراء التحديثات فقط؟](#can-i-run-an-effect-only-on-updates)
  * [كيف يمكن جلب الخاصية أو الحالة السابقة؟](#how-to-get-the-previous-props-or-state)
  * [لماذا أرى الخصائص قديمة أو الحالة داخل الدالة؟](#why-am-i-seeing-stale-props-or-state-inside-my-function)
  * [	كيف أنفِّذ getDerivedStateFromProps؟](#how-do-i-implement-getderivedstatefromprops)
  * [	هل يوجد شيء يشبه forceUpdate؟](#is-there-something-like-forceupdate)
  * [	أيمكنني إنشاء مرجع إلى مكون دالة؟](#can-i-make-a-ref-to-a-function-component)
  * [كيف يمكنني قياس عقدة DOM؟](#how-can-i-measure-a-dom-node)
  * [	ما الذي يعينه const [thing, setThing] = useState()‎؟](#what-does-const-thing-setthing--usestate-mean)
* **[	تحسينات الأداء](#performance-optimizations)**
  * [	أيمكنني تخطي تأثير ما في عمليات التحديث؟](#can-i-skip-an-effect-on-updates)
  * [	كيف يمكنني تنفيذ shouldComponentUpdate؟](#how-do-i-implement-shouldcomponentupdate)
  * [	كيف يمكن استظهار (memoize) العمليات الحسابية؟](#how-to-memoize-calculations)
  * [كيف يمكن إنشاء كائنات مستنزفة للأداء بشكل كسول؟](#how-to-create-expensive-objects-lazily)
  * [	هل تتسم الخطافات بالبطئ لإنشائها دوالًا في عملية التصيير؟](#are-hooks-slow-because-of-creating-functions-in-render)
  * [	ما هو السبيل لتجنب تمرير ردود النداء للداخل؟](#how-to-avoid-passing-callbacks-down)
  * [	كيف تجري عملية قراءة قيمة تتغير كثيرًا من الخطاف useCallback؟](#how-to-read-an-often-changing-value-from-usecallback)
* **[	ما خلف الستار](#under-the-hood)**
  * [	كيف تربط React استدعاءات الخطافات مع المكونات؟](#how-does-react-associate-hook-calls-with-components)
  * [ما هو المصدر الذي استقيت من الخطافات؟](#what-is-the-prior-art-for-hooks)

## خطة تبني الخطافات {#adoption-strategy}

### أي إصدار من React يتضمن الخطافات؟ {#which-versions-of-react-include-hooks}

بدءًا من الإصدار 16.8.0، تضمنت React تنفيذًا مستقرًا للخطافات من أجل:

* React DOM
* React DOM Server
* React Test Renderer
* React Shallow Renderer

لاحظ أن **لتمكين الخطافات ، يجب أن تكون جميع حزم  16.8.0 React    أو أعلى**. لن تعمل الخطافات إذا نسيت التحديث ، على سبيل المثال ،  React DOM.

ستدعم ReactNative الخطافات دعمًا كاملًا في الإصدار المستقر القادم.

### هل احتاج إلى إعادة كتابة جميع مكونات الأصناف الخاصة بي؟ {#do-i-need-to-rewrite-all-my-class-components}

لا. لا يوجد [أية خطط](/docs/hooks-intro.html#gradual-adoption-strategy) مستقبلية لحذف الأصناف من React. ستبقى الأصناف مضمنة في React، إذ لا يمكن تحمُّل عبء إعادة كتابة الشيفرات من جديد. جلَّ ما ننصح به هو تجريب الخطافات في الشيفرات الجديدة.

### ما الذي يمكنني فعله مع الخطافات ولا يمكنني فعله مع الأصناف؟{#what-can-i-do-with-hooks-that-i-couldnt-with-classes}

توفر الخطافات وسيلةً جديدةً تتسم بالقوة لإعادة استعمال دالة (وظيفة ما) بين المكونات. توثيق ["بناء خطاف خاص بك"](/docs/hooks-custom.html)  يعطيك لمحةً عن ما يمكن فعله مع الخطافات. تشرح [هذه المقالة](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889) الي نشرها أحد أفراد فريق React الأساسيين بنظرة تفصيلية الآفاق التي فُتحَت أمامنا بإضافة الخطافات إلى React.

### ما هي نسبة المعرفة التي بقيت على صلة بـ React فيما يخص الخطافات؟ {#how-much-of-my-react-knowledge-stays-relevant}

الخطافات هي طريقةٌ مباشرةٌ لاستعمال ميزات React التي تعرفها مسبقًا مثل الحالة، ودورة الحياة، والسياق، والمراجع (refs). إنها لم تغيِّر بشكل أساسي كيفية عمل React، ومعرفتك بالمكونات والخاصيات، وتدفق البيانات من الأعلى إلى الأسفل (top-down data flow) ستبقى كما هي ولن يغيَّر أي شيء.

تمتلك الخطافات منحى تعليمي خاص بها فقط. إن كان هنالك أي شيء ناقص في هذا التوثيق، أنشئ, [مشكلةً على GitHub](https://github.com/reactjs/reactjs.org/issues/new) وسنبذل قصارى جهدنا لمساعدتك.

### أيتوجب علي استعمال الخطافات، أم الأصناف، أم كلاهما؟{#should-i-use-hooks-classes-or-a-mix-of-both}

نشجع على البدء بتجريب الخطافات واستعمالها في مكوناتك الجديدة عندما تشعر أنك جاهز لذلك. احرص على موافقة كل فرد من أفراد فريقك أيضًا على استعمالها بعد أن يكونوا قد اطلعوا على كامل توثيق الخطافات. لا ننصح بإعادة كتابة الأصناف الموجودة وتحويلها إلى خطافات إلا إذا كنت قد خططت مسبقًا لفعل ذلك (أي لإصلاح مشكلة مثلًا أو لغرض آخر).

لا تستطيع استعمال الخطافات داخل مكون صنف، ولكن يمكنك بالتأكيد المزج بين الأصناف ومكونات دالة مع الخطافات في شجرة واحدة. سواءً كان مكونٌ ما صنفًا أو دالةً، فإنَّ تلك الخطافات المستعملة هي تفاصيل التنفيذ لذلك المكون. نتوقع على المدى البعيد أن تصبح الخطافات الوسيلة الرئيسية التي يستعملها الجميع في كتلة مكونات React.

### هل تغطي الخطافات جميع حالات الاستخدام التي توفرها الأصناف؟ {#do-hooks-cover-all-use-cases-for-classes}

هدفنا من الخطافات هو أن تغطي جميع حالات استخدام الأصناف في أقرب وقت ممكن. ليس هنالك أي خطاف مكافئ لدورتي الحياة `getSnapshotBeforeUpdate` و `componentDidCatch` الغير شائعتين بعد؛ لا تقلق، إذ ستغطي الخطافات هذه الناحية قريبًا.

ما زالت الخطافات حديثة العهد، وقد لا تتوافق بعض المكتبات الموفرة من طرف ثالث معها في الوقت الحالي.

### هل تستبدل الخطافات خاصيات التصيير والمكونات ذات الترتيب الأعلى؟ {#do-hooks-replace-render-props-and-higher-order-components}

غالبًا، خاصيات التصيير والمكونات ذات الترتيب الأعلى تُصيَّر ابنًا واحدًا فقط. نعتقد أنَّ الخطافات هي وسيلةٌ بسيطةٌ لتخدم حالة الاستخدام هذه. لا يزال هنالك متسعٌ لكلا النمطين (قد يملك مكون `scroller` افتراضي مثلًا الخاصية `renderItem` أو قد يملك مكون `container` حاوي على هيكل DOM خاصة به)؛ ولكن في معظم الحالات، ستكون الخطافات كافية ويمكنها أن تساعد في تقليل التشعب في شجرتك.

### ما الذي تعينه الخطافات بالنسبة للواجهات البرمجية الشهيرة مثل `()connect` في مكتبة Redux ومكتبة React Router؟ {#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}

يمكنك الاستمرار باستعمال الواجهات البرمجية نفسها التي تستعملها عادةً، إذ ستستمر بالعمل دون أية مشكلات.

في المستقبل، قد تحوي إصدارات جديدة من هاتين المكتبتين خطافات مخصصة مثل `useRedux()`‎ أو `useRouter()`‎ تمكنك من استعمال نفس الميزات دون الحاجة إلى مكونات مُغلِّفة.

### هل تعمل الخطافات مع أنواع البيانات الثابتة (static typing)؟ {#do-hooks-work-with-static-typing}

صُمِّمَت الخطافات مع أخذ الأنواع الثابتة بالحسبان. لمَّا كانت الخطافات دوالًا، فإنَّها أسهل للكتابة الصحيحة من أنماط أخرى مثل المكونات ذات المستوى الأعلى. تتضمن أحدث تعريفات للأداة Flow و TypeScript في React دعمًا للخطافات.

الأهم من ذلك أنَّ الخطافات المخصصة تمنحك القوة لتقييد واجهة React البرمجية إن أردت كتابتها بشكل صارم بطريقة ما. توفر لك React الأنواع الأساسية (primitives). ولكن يمكنك الدمج بينها بطرائق عدة أكثر من الطرائق الغير تقليدية التي وفرناها.

### كيف يمكن اختبار المكونات التي تستعمل الخطافات؟ {#how-to-test-components-that-use-hooks}

من وجهة نظر React، المكونات التي تستعمل الخطافات هي مكونات عادية تمامًا. إن لم يكن خيار الاختبار الخاص بك يعتمد على DOM الافتراضي وكائنات React الداخلية (أي React internals)، يجب ألا تختلف عملية اختبار المكونات مع الخطافات عن تلك التي اعتدت على استعمالها عادةً لاختبار المكونات.

على سبيل المثال، دعنا نفترض أنه لدينا مكون العداد (counter) التالي:

```js
function Example() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
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

سنختبره باستعمال `ReactDOM`. للتأكد من تطابق السلوك مع الذي يحصل في المتصفح، سنغلف عملية تصيير وتحديث الشيفرة في استدعاءات `ReactTestUtils.act()‎`:

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // اختبر أول تصيير وتأثير
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // اختبر ثاني تصيير وتأثير
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

تطبِّق الاستدعاءات `act()`‎ أيضًا التأثيرات داخلها.

إن أردت اختبار خطاف مخصص، يمكنك فعل ذلك عبر إنشاء مكون في اختبارك، واستعمال ذلك الخطاف منه. وتستطيع بعدئذٍ اختبار المكون الذي كتبته.

لتقليل الشيفرة المتداولة (boilerplate)، نوصي باستعمال المكتبة [`react-testing-library`](https://git.io/react-testing-library) التي صُمِّمَت لتشجيع كتابة اختبارات تستعمل مكوناتك كما سيفعل المستخدم النهائي.

### ما الذي يحصل بالضبط عند فرض تطبيق قواعد [إضافة تصحيح الأخطاء ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks) enforce؟ {#what-exactly-do-the-lint-rules-enforce}

نوفر الإضافة  [ESLint plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) التي تفرض تطبيق [القواعد الخاصة بالخطافات](/docs/hooks-rules.html) عليها لتجنب حصول أية أخطاء. إنها تفترض أنَّ أية دالة تبدأ بالسابقة "`use`" ثم يليها حرف كبير هي خطاف. نحن ندرك أنَّ هذه الطريقة للتعرف على الخطافات ليست مثالية وقد يكون هنالك بعض الإيجابيات الزائفة (false positives)، ولكن بدون عُرفٍ منتشر في بيئة العمل (ecosystem-wide convention)، ليس هنالك أية وسيلة لجعل الخطافات تعمل بشكل صحيح. أضف إلى ذلك أنَّ الأسماء الطويلة ستحبِّط الآخرين من إمَّا تبني الخطافات واستعمالها أو اتباع ما هو متعارف عليه.

باختصار، فرض تطبيق القواعد هي:

* استدعاء الخطافات إمَّا داخل دالة `PascalCase` (افترض كونها مكونًا) أو دالة `useSomething` أخرى (افترض كونها خطافًا مخصصًا).
* تُستدعَى الخطافات بالترتيب نفسه في كل عملية تصيير.

هنالك بضعة أساليب كشف (heuristics) أخرى وقد تتغير مع مرور الوقت، إذ نضبط القاعدة ونصيغها لتحقيق التوازن بين إيجاد الأخطاء وتجنب الإيجابيات الزائفة.

## من الأصناف إلى الخطافات {#from-classes-to-hooks}

### كيف تتوافق توابع دورة الحياة مع الخطافات؟ {#how-do-lifecycle-methods-correspond-to-hooks}

* `constructor`: لا تحتاج مكونات دالة إلى باني. يمكنك تهيئة الحالة عبر استدعاء الخطاف [`useState`](/docs/hooks-reference.html#usestate).  إن كان حسابها يشكل عبئًا على الأداء، فيمكنك تمرير دالة إلى `useState`.

* `getDerivedStateFromProps`: تحل مكان جدولة تحديثٍ [أثناء التصيير.](#how-do-i-implement-getderivedstatefromprops) instead.

* `shouldComponentUpdate`: اطلع على `React.memo` [في الأسفل.](#how-do-i-implement-shouldcomponentupdate).

* `render`: هذا التابع هو جسم مكون الدالة نفسها.

* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`: يحل [الخطاف useEffect](/docs/hooks-reference.html#useeffect) مكان هذه التوابع بشتى أشكال دمجها مع بعضها (بما فيها [الحالات](#can-i-skip-an-effect-on-updates) [النادرة](#can-i-run-an-effect-only-on-updates)).

* `componentDidCatch` و `getDerivedStateFromError`: ليس هنالك أي خطاف مكافئ لهذين التابعين بعد، ولكن سيُضَاف في القريب العاجل.

### كيف يمكنني أن أحصل على معلمات بواسطة الخطافات؟ {#how-can-i-do-data-fetching-with-hooks}

إليك [عرض تجريبي صغير](https://codesandbox.io/s/jvvkoo8pq3) لتبدأ به. لمعرفة المزيد, راجع هذا [المقال](https://www.robinwieruch.de/react-hooks-fetch-data/) حول جلب البيانات باستخدام الخصافات.

### هل هنالك شيء شبيه بمتغيرات النسخة؟ {#is-there-something-like-instance-variables}

نعم. الخطاف  [`()useRef`](/docs/hooks-reference.html#useref) ليس مخصص لمراجع DOM فقط. الكائن "ref" هو حاوية عامة (generic container)، إذ الخاصية `current` فيه قابلةٌ للتعديل وتستطيع تخزين أية قيمة بشكل مشابه لنسخة أية خاصية في صنف ما. يمكنك الوصول إليها من داخل

يمكنك الوصول إليها من داخل `useEffect`:

```js{2,8}
function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // ...
    });
    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  // ...
}
```

إن أردنا ضبط فترة زمنية (interval)، لن نحتاج إلى المرجع `ref` (المُعرِّف `id` يمكن أن يكون محليًّا نسبةً للتأثير)، ولكن من المفيد لو أردنا تصفير الفترة الزمنية من داخل معالج الحدث:

```js{3}
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
```

نظريًّا، يمكنك أن تتخيل المراجع وكأنها مشابهة لمتغيرات نسخة في أي صنف. إن لم تكن تُجرِي عملية تهيئة كسولة، تجنب ضبط المراجع أثناء التصيير، إذ يمكن أن يؤدي ذلك إلى سلوك مفاجئ. عوض ذلك، قد ترغب في تعديل المراجع في معالجات الحدث والتأثيرات.

### هل يجب أن استعمل متغير حالة واحد أم عدة متغيرات؟ {#should-i-use-one-or-many-state-variables}

إن كنت قادمًا من الأصناف، قد تميل إلى استدعاء `useState()` مرةً واحدةً دومًا ووضع جميع الحالات في كائن واحد. لا شك أنَّك تستطيع فعل ذلك إن كنت ترغب في ذلك. إليك مثالٌ عن مكون يتبع حركة مؤشر الفأرة، إذ نبقي موضعه وحجمه في الحالة المحلية:

```js
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

الآن، لنقل أننا نريد كتابة جزء من شيفرة تغيِّر `left` و `top` عندما يحرك المستخدم مؤشر الفأرة. لاحظ كيف يتوجب علينا دمج هذين الحقلين في كائن الحالة السابقة يدويًّا:

```js{4,5}
  // ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // عدم فقدان الارتفاع والعرض "...state" نتأكد بنشر
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // ملاحظة: هذا لتنفيذ بسيط جدًا
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

هذا بسببب أنَّه استبدلنا قيمة متغير حالة عندما حدثناها. هذا الأمر مخلف عن this.setState في الأصناف التي تدمج الحقول المحدَّثة

على أي حال، نوصي بدلًا من ذلك بتقسيم الحالة إلى متغيرات حالة متعددة اعتمادًا على القيم التي تتغير سويةً

على سبيل المثال، يمكنا تقسيم حالة المكون الخاص بنا إلى الكائنين `position` و `size`، واستبدال `position` دون الحاجة للدمج:

```js{2,7}
function Box() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [size, setSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    function handleWindowMouseMove(e) {
      setPosition({ left: e.pageX, top: e.pageY });
    }
    // ...
```

فصل متيغرات حالة مستقلة له فائدةٌ أخرى هي تسهيل استخراج جزء من مترابط من الشيفرة إلى خطاف مخصص لاحقًا مثل:

```js{2,7}
function Box() {
  const position = useWindowPosition();
  const [size, setSize] = useState({ width: 100, height: 100 });
  // ...
}

function useWindowPosition() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  useEffect(() => {
    // ...
  }, []);
  return position;
}
```

لاحظ كيف كان بإمكاننا نقل الاستدعاء `useState` من متغير الحالة `position` والتأثير المرتبط به إلى خطاف مخصص دون تغيير الشيفرة. إن كانت جميع متغيرات الحالة في كائن واحد، فسيَصعُب استخراجها.

وضع جميع متغيرات الحالة في استدعاء واحد للخطاف  `useState`,  واستدعاء `useState` بكل حقل أمران يمكن تطبيقهما بشكل صحيح. تميل المكونات لتكون أكثر قابلية للقراءة عند تحقيق التوازن بين هذين النقيضين، وتجميع كل ما يرتبط بالحالة في بضعة متغيرات حالة مستقلة. إن أصبحت شيفرة الحالة معقدة، نوصي [بإدارتها باستعمال مخفض](/docs/hooks-reference.html#usereducer) أو خطاف مخصص.

### هل يمكنني تنفيذ تأثير عند إجراء التحديثات فقط؟ {#can-i-run-an-effect-only-on-updates}

تعدُّ هذه الحالة نادرة الاستعمال. إن احتجت إليها، يمكنك استعمال [مرجعٍ قابل للتعديل](#is-there-something-like-instance-variables) لتخزين قيمة منطقية يدويًّا تشير إمَّا إلى كونك في أول عملية تصيير أو في عملية تصيير تالية ثم التحقق من هذه الراية في التأثير الخاص بك. (إن وجدت نفسك معتادًا على فعل هذا الأمر، يمكنك أن تنشئ خطافًا مخصصًا لذلك.)

### كيف يمكن جلب الخاصية أو الحالة السابقة؟ {#how-to-get-the-previous-props-or-state}

في الوقت الحالي، يمكنك فعل ذلك يدويًّا باستعمال [مرجع](#is-there-something-like-instance-variables):

```js{6,8}
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;

  return <h1>Now: {count}, before: {prevCount}</h1>;
}
```

قد تبدو هذه العملية معقدةً بعض الشيء ولكن يمكنك استخراجها إلى خطاف مخصص:

```js{3,7}
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Now: {count}, before: {prevCount}</h1>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

لاحظ كيف سيعمل هذا من أجل الخاصيات، أو الحالات، أو أية قيمة أخرى محسوبة:

```js{5}
function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count * 100;
  const prevCalculation = usePrevious(calculation);
  // ...
```

واردٌ في المستقبل أن توفر React خطافًا يدعى `usePrevious` مثلًا لفعل ذلك، إذ هذا السلوك شائع نسبيًا.

انظر أيضًا [إلى السؤال التالي للاطلاع على النمط الموصى به من أجل الحالة المشتقة.](#how-do-i-implement-getderivedstatefromprops).

### لماذا أرى الخصائص قديمة أو الحالة داخل الدالة؟ {#why-am-i-seeing-stale-props-or-state-inside-my-function}

أي دالة داخل مكون ، بما في ذلك معالجات الأحداث والتأثيرات ، "ترى" الخصائص والحالة من تصيير الذي تم إنشاؤه فيه. على سبيل المثال ، أنظر إلى شيفرة التالية:

```js
function Example() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={handleAlertClick}>
        Show alert
      </button>
    </div>
  );
}
```

إذا نقرت أولاً على "إظهار التنبيه" ثم قمت بزيادة العداد ، فسيظهر التنبيه المتغير `count` **في الوقت الذي قمت فيه بالنقر فوق الزر "إظهار التنبيه"**.  هذا يمنع الأخطاء الناتجة عن الكود بافتراض أن الخصائص والحالة لا تتغير.

إذا كنت تريد قرائة *آخر* حالة من بعض رد الاتصال غير متزامن عن قصد، يمكنك الاحتفاظ به في [مرجع](/docs/hooks-faq.html#is-there-something-like-instance-variables), تحويله ، وقراءة منه.

أخيرًا , هناك سبب آخر محتمل لرأيتك الخصائص القديمة أو الحالة, هي إذا كنت تستخدم تحسين " التبعية المصفوفة" ولكنك لم تحدد جميع التبعيات بشكل صحيح. على سبيل المثال ، إذا حدد التأثير `[]` الوسيطة الثانية ولكن يقرأ `someProp` في الداخل ، فسوف يحتفظ بـ“ رؤية ”القيمة الأولية لـ` someProp`. الحل هو إزالة صفيف التبعية أو إصلاحه. من هنا [كيف يمكنك التعامل مع الدوال](#is-it-safe-to-omit-functions-from-the-list-of-dependencies),  وهنا [استراتيجيات شائعة أخرى](#what-can-i-do-if-my-effect-dependencies-change-too-often)   لتشغيل التأثيرات في كثير من الأحيان دون تخطي التبعيات بشكل غير صحيح.

>ملاحظة
>
> نحن نقدم [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) قاعدة ESLint كجزء من حزمة [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). يحذر عندما يتم تحديد التبعيات بشكل غير صحيح ويقترح إصلاح.

### كيف أنفِّذ `getDerivedStateFromProps`؟ {#how-do-i-implement-getderivedstatefromprops}

رغم أنَّك [لن تحتاج إليه](/blog/2018/06/07/you-probably-dont-need-derived-state.html) على الأرجح، فيمكنك في حالات نادرة فعل ذلك (مثل تنفيذ المكون`<Transition>`) عبر تحديث الحالة بشكل صحيح أثناء عملية التصيير. ستعيد React تنفيذ المكون مع الحالة المحدَّثة مباشرةً بعد الخروج من أول عملية تصيير، لذا لن يؤثر ذلك على الأداء.

في الشيفرة التالية، نخزِّن القيمة السابقة للخاصية `row` في متغير حالة، ويمكننا بذلك إجراء عملية موازنة:

```js
function ScrollView({row}) {
  let [isScrollingDown, setIsScrollingDown] = useState(false);
  let [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // isScrollingDown تغيرت منذ أخرى عملية تصيير. حدِّث  row الخاصية
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
```

قد يبدو ذلك غريبًا في البداية، ولكن إجراء تحديث أثناء التصيير هو ما يشبه سلوك `getDerivedStateFromProps` تمامًا من الناحية النظرية.

### هل يوجد شيء يشبه forceUpdate؟ {#is-there-something-like-forceupdate}

يحافظ الخطافان `useState` و `useReducer` كلاهما على الحالة عند [إجراء تحديث](/docs/hooks-reference.html#bailing-out-of-a-state-update) عليها في حال كانت القيمة التالية هي نفس القيمة السابقة. تغيير الحالة يدويًّا (in place) واستدعاء الخطاف `useState` لن يؤدي إلى إعادة التصيير.

بشكل طبيعي، لا يجب عليك تعديل حالة محلية في React. على أي حال وكمخرج هروب، يمكنك استعمال عداد متزايد لإجبار إجراء إعادة الصيير حتى إن لم تتغير الحالة:

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

حاول تجنب هذه النمط قدر المستطاع.

### أيمكنني إنشاء مرجع إلى مكون دالة؟ {#can-i-make-a-ref-to-a-function-component}

رغم أنّه لا يجب أن تحتاج إلى تنفيذ ذلك في أغلب الأحيان، قد تعرض بعض التوابع الأمرية على مكون أب (parent component) مع الخطاف [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle).

### كيف يمكنني قياس عقدة DOM؟ {#how-can-i-measure-a-dom-node}

من أجل قياس موضع أو حجم عقدة DOM ، يمكنك استخدام [مرجع رد النداء](/docs/refs-and-the-dom.html#callback-refs). تستدعي React رد النداء هذا كلما تم ربط المرجع بعقدة مختلفة. هنا [عرض صغير](https://codesandbox.io/s/l7m0v5x4v9):

```js{4-8,12}
function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}
```

لم نختار `useRef` في هذا المثال لأن مرجع كائن لا يخطرنا بشأن * التغييرات * في قيمة المرجع الحالية. باستخدام المرجع رد النداء يضمن ذلك [حتى لو عرض أحد العناصر التابعة العقدة المقاسة لاحقًا](https://codesandbox.io/s/818zzk8m78) (e.g. in response to a click), ما زلنا نتلقى إشعارًا بذلك في المكون الرئيسي ويمكننا تحديث القياسات.

لاحظ أننا نقوم بتمرير `[]` كمصفوفة تبعية إلى ` useCallback ` . هذا يضمن أن رد النداء المرجعي الخاص بنا لا يتغير بين عمليات إعادة التصيير ، وبالتالي فإن React لن يناديها بشكل غير ضروري.

يمكنك اذا اردت [استخراج هذا المنطق](https://codesandbox.io/s/m5o42082xy) في خطاف قابلة لإعادة الاستخدام:

```js{2}
function MeasureExample() {
  const [rect, ref] = useClientRect();
  return (
    <>
      <h1 ref={ref}>Hello, world</h1>
      {rect !== null &&
        <h2>The above header is {Math.round(rect.height)}px tall</h2>
      }
    </>
  );
}

function useClientRect() {
  const [rect, setRect] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref];
}
```

### ما الذي يعينه `const [thing, setThing] = useState()`؟ {#what-does-const-thing-setthing--usestate-mean}

إن لم تكن هذه الصياغة مألوفة لديك، اطلع على الشرح المذكور في [هذا القسم](/docs/hooks-state.html#tip-what-do-square-brackets-mean) في توثيق خطاف الحالة.

## تحسينات الأداء {#performance-optimizations}

### أيمكنني تخطي تأثير ما في عمليات التحديث؟ {#can-i-skip-an-effect-on-updates}

نعم. اطلع على قسم [تنفيذ تأثير شرطيًّا](/docs/hooks-reference.html#conditionally-firing-an-effect). لاحظ أنَّ نسيان معالجة تحديثات يولد غالبًا أخطاء، إذ هذا هو سبب عدم كون هذا السلوك هو السلوك الافتراضي.

### كيف يمكنني تنفيذ `shouldComponentUpdate`؟ {#how-do-i-implement-shouldcomponentupdate}

يمكنك تغليف مكون دالة مع `React.memo` لموازنة خاصياته بشكل سطحي:

```js
const Button = React.memo((props) => {
  // المكون الخاص بك
});
```

هذا ليس خطافًا لأنَّه لم يُنشَأ بالشكل الذي تُنشَأ فيه الخطافات. إنَّ `React.memo` يكافئ `PureComponent` ولكن يوازن الخاصيات فقط. (يمكنك أيضًا أن تضيف وسيطًا آخر لتحديد دالة موازنة مخصصة تأخذ الخاصيات القديمة والجديدة. إن أعادت القيمة `true`، فسيُتخطَّى التحديث.)

لا يوازن `React.memo` الحالة لعدم وجود كائن حالة وحيد لموازنته. مع ذلك، يمكنك جعل الأبناء في حالة نقية (pure) أيضًا أو حتى تحسين ابنٍ واحدٍ مع `useMemo`.


### كيف يمكن استظهار (memoize) العمليات الحسابية؟ {#how-to-memoize-calculations}

يمكِّنك الخطاف [`useMemo`](/docs/hooks-reference.html#usememo) من تخزين الحسابات بين عدة عمليات تصيير عبر "تذكر" القيمة التي جرى حسابها مسبقًا:

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

تستدعي هذه الشيفرة `computeExpensiveValue(a, b)`. ولكن إن لم تتغير المدخلات `[a, b]` منذ آخر قيمة، سيتخطى الخطاف `useMemo` استدعاءها في المرة التالية ويعيد استعمال آخر قيمة أعادتها تلك الدالة.

تذكر أنَّ الدالة المُمرَّرة إلى  `useMemo` تُنفَّذ أثناء عملية التصيير. لا تفعل أي شيء في هذه الأثناء لم تكن لتفعله بشكل طبيعي خلال عملية التصيير. على سبيل المثال، التأُثيرات الجانبية تتبع للخطاف `useEffect` وليس للخطاف `useMemo`.

**يمكنك الاعتماد على الخطاف `useMemo` لتحسين الأداء، وليس لضمان الدلالات (semantic guarantee).** في المستقبل، قد تختار React بأن "تنسى" بعض القيم المُستظهَرة (المحفوظة) وتعيد حسابها من جديد في عملية التصيير التالية وذلك لتحرير الذاكرة لمكونات غير ظاهرة على الشاشة (offscreen) مثلًا. اكتب أولًا شيفرتك لتعمل بشكل صحيح دون الخطاف `useMemo`، ومن ثمَّ أضفه لتحسين الأداء. (في حالات نادرة عندما لا يجب حساب قيمة مطلقًا، يمكنك حينئذٍ تهيئة مرجع بشكل كسول.)

أضف إلى ذلك أنَّ الخطاف `useMemo` يمكِّنك بسهولة من تخطي عملية إعادة تصيير لابن تستنزف الأداء:

```js
function Parent({ a, b }) {
  // فقط `a` أعد عملية التصيير إن تغير:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // فقط `b` أعد عملية التصيير إن تغير:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

لاحظ أنَّ هذا الأسلوك لن يعمل في حلقة تكرار لأنَّه لا يمكن أن توضع استدعاءات الخطافات داخل حلقة تكرار. على أي حال، تستطيع استخراج مكون منفصل لعنصر القائمة واستدعاء `useMemo` هنالك.

### كيف يمكن إنشاء كائنات مستنزفة للأداء بشكل كسول؟ {#how-to-create-expensive-objects-lazily}

يمكِّنك الخطاف `useMemo` من استظهار [(memoize) عملية حسابية مستهلكة للأداء](#how-to-memoize-calculations) إن بقيت المدخلات نفسها دون تغيُّر. مع ذلك، يعدُّ هذا بمثابة تلميح فقط، ولا يوجد أي شيء يضمن عدم تكرار تنفيذ العملية الحسابية. على أية حال، تحتاج أحيانًا إلى التأكد من إنشاء كائنٍ مرةً واحدةً فقط.

**أول حالة استعمال شائعة هي عند استهلاك عملية إنشاء الحالة الأولية للأداء بشكل كبير:**

```js
function Table(props) {
  // ⚠️ في كل عملية تصيير createRows() يستدعى
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

لتجنب إعادة إنشاء الحالة الأولية المهملة، يمكننا تمرير دالة إلى `useState`:

```js
function Table(props) {
  // ✅ مرة واحدة فقط createRows() يستدعى
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

ستستدعي React هذه الدالة خلال عملية أول عملية تصيير. لمزيد من التفاصيل، ارجع إلى توثيق[الواجهة البرمجية للخطاف `useState`](/docs/hooks-reference.html#usestate).

**في بعض الأحيان، ربما ترغب بتجنب إعادة إنشاء الحالة الأولية للخطاف `()useRef`.** على سبيل المثال، ربما تريد التأكد من إنشاء بعض نسخ الأصناف الأمرية (imperative class instance) مرةً واحدةً فقط:

```js
function Image(props) {
  // ⚠️ في كل عملية تصيير IntersectionObserver يُنشَأ
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

لا يقبل الخطاف `useRef` دالة مخصصة إضافية مثل الخطاف `useState`. عوض ذلك، تستطيع كتابة دالة مخصصة تُنشئها وتضبطها بشكل كسول:

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ ٍمرةً واحدةً بِكَسَل IntersectionObserver يُنشَأ
  function getObserver() {
    let observer = ref.current;
    if (observer !== null) {
      return observer;
    }
    let newObserver = new IntersectionObserver(onIntersect);
    ref.current = newObserver;
    return newObserver;
  }

  // عندما تحتاج إليه getObserver() استدعي
  // ...
}
```

بذلك، تتجنب إنشاء كائنات مستهلكة للأداء حتى الحاجة الماسة إليها للمرة الأولى. إن كنت تستعمل Flow أو TypeScript، تستطيع أيضًا أن تعطي `getObserver()`‎ نوعًا غير معدوم (non-nullable type) للسهولة.


### هل تتسم الخطافات بالبطئ لإنشائها دوالًا في عملية التصيير؟{#are-hooks-slow-because-of-creating-functions-in-render}

لا. في المتصفحات الحديثة، لا يختلف الأداء الصافي (raw performance) للمغلفات (closures) بموازنته مع الأصناف اختلافًا كبيرًا باستثناء الحالات المبالغ بها.

إضافةً لذلك، يعدُّ تصميم الخطافات أكثر فعالية من ناحيتين هما:

* تخلصت الخطافات من الكثير من الأعباء التي تطلبها الأصناف مثل عبء طلب إنشاء نُسخٍ للصنف وربط معالجات حدث بالباني.

* **لا تحتاج الشيفرة الاصطلاحية (Idiomatic code) التي تستعمل الخطافات إلى التشعب العميق لشجرة المكونات (deep component tree nesting)**  السائد في قواعد الشيفرة (codebases) التي تستعمل المكوانات ذات الترتيب الأعلى، وخاصييات التصيير، والسياق. مع شجرة مكونات صغيرة، يكون لدى React القليل من العمل لإنجازه.

تقليديًّا، المخاوف التي تدور حول الدوال السطرية (inline functions) وتأثيرها على الأداء في React تتعلق بكيفية تمرير ردود النداء الجديدة في كل تصيير يفصل تحسينات `shouldComponentUpdate` في المكونات الأبناء. تتعامل الخطافات مع هذه المشكلة من ثلاث نواحٍ هي:

* يمكِّنك الخطاف [`useCallback`](/docs/hooks-reference.html#usecallback) من الإبقاء على مرجع رد النداء نفسه بين عمليات إعادة التصيير، لذا يستمر `shouldComponentUpdate` بالعمل:

    ```js{2}
	// `b` أو `a` لن يتغير إلا إذا تغير
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* يجعل [الخطاف `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations) عملية التحكم سهلةً عندما يَجرِي تحديث ابنٍ واحدٍ، مما يقلل من الحاجة إلى مكونات نقية (pure components).

* أخيرًا، يقلل الخطاف `useReducer` الحاجة إلى تمرير ردود نداء عميقة كما سيُشرَح ذلك في الأسفل.

### ما هو السبيل لتجنب تمرير ردود النداء للداخل؟ {#how-to-avoid-passing-callbacks-down}

وجدنا أنَّ أغلب الأشخاص لا يحبون تمرير ردود النداء يدويًا عبر كل مستوى من شجرة المكون. رغم أنَّ العملية واضحة إلا أنَّها أشبه بعملية تركيب شبكة من الأنابيب المتشعبة (أنابيب شبكة المياه والصرف مثلًا).

في شجرات المكون الكبيرة، البديل الذي نوصي به هو تمرير الدالة `dispatch` للداخل (down) من [`useReducer`](/docs/hooks-reference.html#usereducer) عبر السياق:

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // لن تتغير بين عمليات إعادة التصيير `dispatch` الدالة
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

أي ابن في الشجرة داخل `TodosApp` يمكن أن يستخدم الدالة `dispatch` لتمرير أحداث (actions) للأعلى حتى تصل إلى `TodosApp`:

```js{2,3}
function DeepChild(props) {
  // من السياق dispatch إذا أردنا أن ننفذ حدثًا ما، يمكننا جلب
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

هذا مناسبٌ أكثر من ناحية الصيانة (لا حاجة للاستمرار بتوجيه ردود النداء)، ويجنبنا من الوقوع في مشكلة رد النداء (callback problem) كليًّا. تمرير `dispatch` للأسفل بالشكل الذي وضحناه هو النمط الذي ينصح باتباعه للتحديثات العميقة.

الجدير بالملاحظة أنَّه لا يزال بإمكانك اختيار إمَّا إن تمرِّر حالة التطبيق (application state) للأسفل مثل الخاصيات (الأكثر وضوحًا) أو مثل السياق (أكثر سهولةً للتحديثات العميقة جدًا). إن كنت تستعمل السياق لتمرير الحالة للأسفل أيضًا، استعمل نوعان مختلفان من السياق، إذ لا يتغير السياق `dispatch` مطلقًا؛ لذلك، لا تحتاج المكونات التي تقرأه للتصيير إلا إذا احتاجت أيضًا إلى حالة التطبيق.

### كيف تجري عملية قراءة قيمة تتغير كثيرًا من الخطاف `useCallback`؟ {#how-to-read-an-often-changing-value-from-usecallback}

>ملاحظة
>
>نوصي [بتمرير `dispatch` للأسفل في السياق](#how-to-avoid-passing-callbacks-down) بدلًا من ردود النداء الفردية في الخاصيات. الطريقة المتبعة في الأسفل مذكورة هنا فقط كتتمة وكمخرج هروب (escape hatch).
>
>لاحظ أيضًا أن هذا النمط قد يسبب حدوث مشاكل في الوضع المتزامن [concurrent mode](/blog/2018/03/27/update-on-async-rendering.html). نخطط لتوفير بدائل أفضل في المستقبل، ولكن الحل الأكثر أمانًا الأن هو إبطال رد النداء دومًا إن تغيرت بعض القيم التي يعتمد عليها.

في حالات نادرة، قد تحتاج إلى استظهار (memoize) رد نداء مع الخطاف [`useCallback`](/docs/hooks-reference.html#usecallback) ولكن عملية الاستظهار لا تعمل بشكل صحيح لأنَّ الدالة الداخلية يجب أن يعاد إنشاؤها في كثير من الأحيان. إن كانت الدالة التي تريد استظهارها هي معالج حدث ولا تستخدم أثناء التصيير، يمكنك استعمال مرجع كمتغير نسخة، وتخزين آخر قيمة محفوظة ضمنه يدويًا:

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useLayoutEffect(() => {
    textRef.current = text; // كتابتها إلى المرجع
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // قراءتها من المرجع
    alert(currentText);
  }, [textRef]); // [text] كما ستفعل handleSubmit لا تعيد إنشاء

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

هذا النمط معقدٌ كثيرًا ولكن يبدو أنَّك لا بأس من فعل ذلك كمخرج هروب لتحسين الأداء إن شعرت أنك بحاجة إليه. يصبح التعامل مع هذا النمط أسهل وأكثير تقبُّلًا إن استخرجته إلى خطاف مخصص:

```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // `text` سيجري استظهاره حتى لو تغير:
  const handleSubmit = useEventCallback(() => {
    alert(text);
  }, [text]);

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}

function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useLayoutEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```

في كلا الحالتين، لا ننصح باستعمال هذا النمط، ودافع ذكره هنا هو للتكملة فقط. عوضًا عنه، يفضل تجنب تمرير ردود نداء بشكل عميق للأسفل.


## ما خلف الستار {#under-the-hood}

### كيف تربط React استدعاءات الخطافات مع المكونات؟ {#how-does-react-associate-hook-calls-with-components}

تتعقب React المكونات قيد التصيير باستمرار. بفضل [القواعد المخصصة بالخطافات](/docs/hooks-rules.html), أصبحنا نعلم كيف تستدَعى تلك الخطافات من مكونات React (أو من الخطافات المخصصة التي تُستدعَى أيضًا من مكونات React).

هنالك قائمة داخلية لخلايا في الذاكرة مرتبطة مع كل مكون. هي عبارة عن كائنات JavaScript نستطيع أن نضع فيها بعض البيانات. عندما تستدعي خطافًا مثل `useState()`‎، يقرأ الخلية الحالية (أو يهيِّئها في أول عملية تصيير)، ثم يحرِّك المؤشر إلى الخلية التالية. هذا هو تفسير حصول كل استدعاء من استدعاءات الخطاف useState()‎ حالة محلية مستقلة.

### ما هو المصدر الذي استقيت من الخطافات؟{#what-is-the-prior-art-for-hooks}

الخطافات هي فكرة متراكبة ومستقاة من مصادر مختلفة منها:

* تجربتنا المسبقة مع الواجهات الوظيفية البرمجية (functional APIs) في المستودع [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) repository.
* تجارب مجتمع React مع واجهات خاصيات التصيير البرمجية بما فيها المكون Reactions الذي يخص [Ryan Florence](https://github.com/ryanflorence)'s [Reactions Component](https://github.com/reactions/component).
* اقتراح [`adopt` الكلمة المفتاحية](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067) التي اقترحها [Dominic Gannaway](https://github.com/trueadm)'s كصياغة تجميلية لخاصيات التصيير.
* متغيرات الحالة وخلايا الحالة في [DisplayScript](http://displayscript.org/introduction.html).
* المكونات Reducer في [Reducer components](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html) في ReasonReact.
* [الاشتراكات](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html) في  Rx.
* [التأثيرات الجبرية](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting) في لغة OCaml متعددة النوى.

ابتكر  [Sebastian Markbåge](https://github.com/sebmarkbage) التصميم الأساسي للخطافات ثم أعيد تنقيح وصقله لاحقًا من قبل [Andrew Clark](https://github.com/acdlite), [Sophie Alpert](https://github.com/sophiebits), [Dominic Gannaway](https://github.com/trueadm), aوغيرهم من أعضاء فريق React.
