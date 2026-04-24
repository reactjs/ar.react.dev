---
title: 'قد لا تحتاج إلى Effect'
---

<Intro>

التأثيرات (Effects) مخارج طوارئ من نموذج React البرمجي. تسمح لك بـ «الخروج» من React ومزامنة مكوّناتك مع نظام خارجي مثل ودجة غير React أو الشبكة أو DOM المتصفح. إن لم يكن هناك نظام خارجي (مثلاً إن أردت تحديث حالة مكوّن عند تغيّر خصائص أو حالة)، فلا ينبغي أن تحتاج Effect. إزالة التأثيرات غير الضرورية تجعل الكود أوضح وأسرع وأقل عرضة للأخطاء.

</Intro>

<YouWillLearn>

* لماذا وكيف تزيل التأثيرات غير الضرورية من مكوّناتك
* كيف تخزّن حسابات مكلفة مؤقتًا دون Effects
* كيف تعيد ضبط حالة المكوّن وتعدّلها دون Effects
* كيف تشارك المنطق بين معالجات الأحداث
* أي منطق ينبغي نقله إلى معالجات الأحداث
* كيف تُبلغ المكوّنات الأب عن التغييرات

</YouWillLearn>

## كيف تزيل التأثيرات غير الضرورية {/*how-to-remove-unnecessary-effects*/}

هناك حالتان شائعتان لا تحتاج فيهما إلى Effects:

* **لا تحتاج Effects لتحويل البيانات للعرض.** مثلاً، تريد تصفية قائمة قبل عرضها. قد يغريك كتابة Effect يحدّث متغير حالة عند تغيّر القائمة. لكن هذا غير فعّال. عند تحديث الحالة، يستدعي React دوال مكوّناتك أولًا لحساب ما يجب أن يظهر على الشاشة. ثم React [«يُلتزم»](/learn/render-and-commit) بهذه التغييرات في DOM ويحدّث الشاشة. ثم يشغّل Effects. إن كان Effect يحدّث الحالة *فورًا* أيضًا، يعيد تشغيل العملية من البداية! لتجنب مرات تصيير زائدة، حوّل كل البيانات في المستوى الأعلى من مكوّناتك. يُعاد تشغيل ذلك الكود تلقائيًا عند تغيّر الخصائص أو الحالة.
* **لا تحتاج Effects لمعالجة أحداث المستخدم.** مثلاً، تريد إرسال طلب POST إلى `/api/buy` وإظهار إشعار عند شراء منتج. في معالج نقر زر الشراء، تعرف بالضبط ما حدث. بحلول وقت تشغيل Effect، لا تعرف *ماذا* فعل المستخدم (مثلاً أي زر نُقر). لذلك عادةً تتعامل مع أحداث المستخدم في معالجات الأحداث المناسبة.

أنت *تحتاج* Effects للـ [مزامنة](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events) مع أنظمة خارجية. مثلاً، يمكنك كتابة Effect يبقي ودجة jQuery متوافقة مع حالة React. يمكنك أيضًا جلب البيانات بـ Effects: مثلاً مزامنة نتائج البحث مع استعلام البحث الحالي. تذكّر أن [الأطر الحديثة](/learn/creating-a-react-app#full-stack-frameworks) توفر آليات جلب بيانات مدمجة أكثر كفاءة من كتابة Effects مباشرة في المكوّنات.

لمساعدتك على بناء الحدس الصحيح، لننظر إلى أمثلة عملية شائعة!

### تحديث الحالة بناءً على خصائص أو حالة {/*updating-state-based-on-props-or-state*/}

لنفترض مكوّنًا له متغيرا حالة: `firstName` و`lastName`. تريد حساب `fullName` بربطهما. وتريد أن يتحدّث `fullName` عند تغيّر `firstName` أو `lastName`. قد يغريك أولًا إضافة متغير حالة `fullName` وتحديثه في Effect:

```js {expectedErrors: {'react-compiler': [8]}} {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

هذا أعقد من اللازم وأقل كفاءة: يمرّ بتصيير كامل بقيمة قديمة لـ `fullName`، ثم يعيد التصيير فورًا بالقيمة المحدّثة. أزل متغير الحالة والـ Effect:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**إن أمكن حساب شيء من الخصائص أو الحالة الموجودة، [لا تضعه في الحالة.](/learn/choosing-the-state-structure#avoid-redundant-state) احسبه أثناء التصيير بدلًا من ذلك.** يجعل كودك أسرع (تتجنب تحديثات «متسلسلة» زائدة)، وأبسط (تحذف كودًا)، وأقل عرضة للأخطاء (تتجنب تعارض متغيرات حالة). إن كان هذا جديدًا عليك، [التفكير في React](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state) يشرح ما الذي يجب أن يدخل الحالة.

### تخزين مؤقت لحسابات مكلفة {/*caching-expensive-calculations*/}

يحسب هذا المكوّن `visibleTodos` من `todos` القادمة بالخصائص وتصفيتها حسب خاصية `filter`. قد يغريك تخزين النتيجة في حالة وتحديثها من Effect:

```js {expectedErrors: {'react-compiler': [7]}} {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

كالسابق، هذا غير ضروري وغير فعّال. أولًا أزل الحالة والـ Effect:

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ This is fine if getFilteredTodos() is not slow.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

عادةً هذا الكود كافٍ! لكن ربما `getFilteredTodos()` بطيئة أو لديك الكثير من `todos`. حينها لا تريد إعادة حساب `getFilteredTodos()` إن تغيّرت حالة غير مرتبطة مثل `newTodo`.

يمكنك التخزين المؤقت (أو [«الحفظ المؤقت» memoization](https://en.wikipedia.org/wiki/Memoization)) لحساب مكلف بلفّه في [`useMemo`](/reference/react/useMemo):

<Note>

يمكن لـ [React Compiler](/learn/react-compiler) أن يحفظ مؤقتًا الحسابات المكلفة تلقائيًا، فيزيل الحاجة لـ `useMemo` اليدوي في كثير من الحالات.

</Note>

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ Does not re-run unless todos or filter change
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

أو في سطر واحد:

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Does not re-run getFilteredTodos() unless todos or filter change
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**هذا يخبر React أنك لا تريد إعادة تشغيل الدالة الداخلية إلا إن تغيّر `todos` أو `filter`.** يتذكر React قيمة إرجاع `getFilteredTodos()` أثناء التصيير الأول. في التصييرات التالية، يتحقق إن اختلف `todos` أو `filter`. إن كانا كالمرة السابقة، يعيد `useMemo` آخر نتيجة خزّنها. وإن اختلفا، يستدعي React الدالة الداخلية مجددًا (ويخزن نتيجتها).

الدالة التي تلفّها في [`useMemo`](/reference/react/useMemo) تعمل أثناء التصيير، لذلك ينطبق هذا فقط على [حسابات نقية.](/learn/keeping-components-pure)

<DeepDive>

#### كيف تعرف أن الحساب مكلف؟ {/*how-to-tell-if-a-calculation-is-expensive*/}

بشكل عام، ما لم تنشئ أو تمرّ على آلاف الكائنات، فهو غالبًا غير مكلف. لمزيد من الثقة، أضف `console.log` أو `console.time` لقياس الزمن:

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

نفّذ التفاعل الذي تقيسه (مثلاً الكتابة في الحقل). ستظهر سجلات مثل `filter array: 0.15ms` في الطرفية. إن تجاوز الزمن المجموع حدًا ملحوظًا (مثلاً `1ms` أو أكثر)، قد يستحق الحساب تخزينًا مؤقتًا. جرّب لفّ الحساب بـ `useMemo` وتحقق إن انخفض الزمن لتلك التفاعلات:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // Skipped if todos and filter haven't changed
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo` لا يسرّع *أول* تصيير. يساعد فقط على تخطي عمل غير ضروري عند التحديثات.

تذكّر أن جهازك غالبًا أسرع من أجهزة المستخدمين، فمن الجيد اختبار الأداء مع إبطاء اصطناعي. مثلاً يوفّر Chrome [خانة خنق المعالج](https://developer.chrome.com/blog/new-in-devtools-61/#throttling).

قياس الأداء في وضع التطوير لن يعطِ أدق النتائج. (مثلاً مع تفعيل [Strict Mode](/reference/react/StrictMode) قد ترى كل مكوّن يُصيَّر مرتين.) لأدق القياسات، ابنِ التطبيق لوضع الإنتاج واختبره على جهاز يشبه أجهزة مستخدميك.

</DeepDive>

### إعادة ضبط كل الحالة عند تغيّر خاصية {/*resetting-all-state-when-a-prop-changes*/}

يستقبل مكوّن `ProfilePage` خاصية `userId`. الصفحة فيها حقل تعليق، وتستخدم متغير حالة `comment` لقيمته. ذات يوم تلاحظ مشكلة: عند الانتقال من ملف لآخر، لا تُصفّى حالة `comment`، فيسهل نشر تعليق على ملف المستخدم الخطأ. لإصلاح ذلك، تريد مسح `comment` كلما تغيّر `userId`:

```js {expectedErrors: {'react-compiler': [6]}} {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Avoid: Resetting state on prop change in an Effect
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

هذا غير فعّال لأن `ProfilePage` وأبناءه يُصيَّران أولًا بقيمة قديمة ثم يُعاد التصيير. وهو معقّد لأنك تحتاج تكرار ذلك في *كل* مكوّن له حالة داخل `ProfilePage`. مثلاً إن واجهة التعليق متداخلة، تريد مسح حالة تعليق متداخلة أيضًا.

بدلًا من ذلك، أخبر React أن ملف كل مستخدم هو ملف _مختلف_ مفهوميًا بإعطائه `key` صريحة. اقسم المكوّن إلى اثنين ومرّر خاصية `key` من الخارج إلى الداخل:

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ This and any other state below will reset on key change automatically
  const [comment, setComment] = useState('');
  // ...
}
```

عادةً يحافظ React على الحالة عند تصيير نفس المكوّن في نفس الموضع. **بتمرير `userId` كـ `key` إلى `Profile`، تطلب من React التعامل مع مكوّني `Profile` بقيم `userId` مختلفتين كمكوّنين منفصلين لا يجب أن يتشاركا أي حالة.** عند تغيّر المفتاح (الذي ضبطته على `userId`)، يعيد React إنشاء DOM و[يعيد ضبط الحالة](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key) لمكوّن `Profile` وجميع أبنائه. فيُفرّغ حقل `comment` تلقائيًا عند التنقل بين الملفات.

في هذا المثال، المكوّن الخارجي `ProfilePage` فقط هو المُصدَّر والظاهر لملفات أخرى. المكوّنات التي تصيّر `ProfilePage` لا تحتاج تمرير `key` إليها: تمرّر `userId` كخاصية عادية. أن `ProfilePage` يمرّرها كـ `key` للمكوّن الداخلي `Profile` تفصيل تنفيذي.

### تعديل جزء من الحالة عند تغيّر خاصية {/*adjusting-some-state-when-a-prop-changes*/}

أحيانًا تريد إعادة ضبط أو تعديل جزء من الحالة عند تغيّر خاصية، لا كلها.

يستقبل مكوّن `List` قائمة `items` كخاصية، ويحتفظ بالعنصر المحدد في `selection`. تريد إعادة `selection` إلى `null` كلما استلمت الخاصية `items` مصفوفة مختلفة:

```js {expectedErrors: {'react-compiler': [7]}} {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Avoid: Adjusting state on prop change in an Effect
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

هذا أيضًا غير مثالي. في كل مرة تتغيّر فيها `items`، يُصيَّر `List` وأبناؤه أولًا بقيمة `selection` قديمة. ثم يحدّث React DOM ويشغّل Effects. أخيرًا استدعاء `setSelection(null)` يطلق تصييرًا آخر لـ `List` وأبنائه، فيعيد الدورة.

ابدأ بحذف الـ Effect. بدلًا من ذلك، عدّل الحالة مباشرة أثناء التصيير:

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Better: Adjust the state while rendering
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

[تخزين معلومات من تصييرات سابقة](/reference/react/useState#storing-information-from-previous-renders) هكذا قد يكون صعب الفهم، لكنه أفضل من تحديث نفس الحالة في Effect. في المثال أعلاه، يُستدعى `setSelection` مباشرة أثناء التصيير. يعيد React تصيير `List` *فورًا* بعد خروجه بـ `return`. لم يُصيَّر بعد أبناء `List` ولم يُحدَّث DOM، فيتخطى أبناء `List` عرض قيمة `selection` قديمة.

عند تحديث مكوّن أثناء التصيير، يلقي React JSX المُعاد ويعيد المحاولة فورًا. لتجنب إعادات متسلسلة بطيئة جدًا، يسمح React فقط بتحديث حالة *نفس* المكوّن أثناء التصيير. تحديث حالة مكوّن آخر أثناء التصيير يظهر خطأ. شرط مثل `items !== prevItems` ضروري لتجنب الحلقات. يمكنك تعديل الحالة هكذا، لكن أي آثار جانبية أخرى (تعديل DOM، مؤقتات) تبقى في معالجات الأحداث أو Effects لـ [إبقاء المكوّنات نقية.](/learn/keeping-components-pure)

**رغم أن هذا الأنمط أكثر كفاءة من Effect، أغلب المكوّنات لا تحتاجه.** مهما فعلت، تعديل الحالة بناءً على خصائص أو حالة أخرى يصعّب فهم تدفق البيانات وتصحيحه. تحقق دائمًا إن أمكنك [إعادة ضبط كل الحالة بمفتاح](#resetting-all-state-when-a-prop-changes) أو [حساب كل شيء أثناء التصيير](#updating-state-based-on-props-or-state). مثلاً بدل تخزين (وإعادة ضبط) العنصر المحدد، خزّن *معرف العنصر المحدد:*

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Best: Calculate everything during rendering
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

لا حاجة إذن لـ «تعديل» الحالة على الإطلاق. إن كان العنصر ذو المعرف المحدد في القائمة، يبقى محددًا. وإلا فستكون `selection` المحسوبة أثناء التصيير `null` لعدم وجود تطابق. السلوك يختلف لكنه غالبًا أفضل لأن أغلب تغييرات `items` تحافظ على التحديد.

### مشاركة المنطق بين معالجات الأحداث {/*sharing-logic-between-event-handlers*/}

لنفترض صفحة منتج بزرّين (شراء ودفع) يشتريان المنتج. تريد إظهار إشعار كلما أضاف المستخدم المنتج للسلة. استدعاء `showNotification()` في معالجي النقر يتكرر فيغريك وضع المنطق في Effect:

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 Avoid: Event-specific logic inside an Effect
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

هذا Effect غير ضروري وقد يسبب أخطاء. مثلاً إن كان تطبيقك «يتذكر» سلة الشراء بين إعادة تحميل الصفحة، وأضفت منتجًا مرة ثم حدّثت الصفحة، ستظهر الإشعار مجددًا. سيستمر كلما حدّثت صفحة المنتج لأن `product.isInCart` ستكون `true` عند التحميل، فيستدعي Effect أعلاه `showNotification()`.

**إن لم تكن متأكدًا أين يوضع الكود—Effect أم معالج حدث—اسأل نفسك *لماذا* يجب أن يعمل هذا الكود. استخدم Effects فقط لما يجب أن يعمل *لأن* المكوّن عُرض للمستخدم.** هنا يجب أن تظهر الإشعار لأن المستخدم *ضغط الزر*، لا لأن الصفحة عُرضت! احذف الEffect وضع المنطق المشترك في دالة تُستدعى من معالجي الحدث:

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ Good: Event-specific logic is called from event handlers
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

هذا يزيل Effect غير الضروري ويصلح الخلل.

### إرسال طلب POST {/*sending-a-post-request*/}

يرسل مكوّن `Form` نوعين من طلبات POST: حدث تحليلات عند التركيب، وعند ملء النموذج والضغط على إرسال يُرسل POST إلى `/api/register`:

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic should run because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Avoid: Event-specific logic inside an Effect
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

طبّق نفس المعايير كالمثال السابق.

طلب التحليلات POST يبقى في Effect لأن _سبب_ إرسال الحدث هو أن النموذج _عُرض_. (قد يُطلق مرتين في التطوير، و[انظر هنا](/learn/synchronizing-with-effects#sending-analytics) لمعالجة ذلك.)

أما `/api/register` فليس بسبب _عرض_ النموذج. تريد الإرسال في لحظة واحدة: عند ضغط المستخدم الزر. يجب أن يحدث _مع ذلك التفاعل فقط_. احذف Effect الثاني وانقل طلب POST إلى معالج الحدث:

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic runs because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Good: Event-specific logic is in the event handler
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

عند اختيار وضع المنطق في معالج حدث أو Effect، السؤال الأساسي: _ما نوع المنطق_ من منظور المستخدم؟ إن كان بسبب تفاعل معيّن، ضعه في معالج الحدث. إن كان بسبب _رؤية_ المستخدم للمكوّن، ضعه في Effect.

### سلاسل حسابات {/*chains-of-computations*/}

قد يغريك ربط Effects يعدّل كل منها جزءًا من الحالة بناءً على حالة أخرى:

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 Avoid: Chains of Effects that adjust the state solely to trigger each other
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

هناك مشكلتان في هذا الكود.

الأولى: غير فعّال؛ يجب إعادة تصيير المكوّن (وأبنائه) بين كل استدعاء `set` في السلسلة. في أسوأ الحالات (`setCard` → تصيير → `setGoldCardCount` → …) هناك ثلاث إعادات تصيير زائدة للشجرة.

الثانية: حتى لو لم يكن بطيئًا، مع تطور الكود ستصطدم بسلسلة لا تناسب المتطلبات الجديدة. تخيّل إضافة تصفح لتاريخ حركات اللعبة بتحديث كل متغير حالة لقيمة من الماضي؛ ضبط `card` على قيمة قديمة يعيد سلسلة Effects ويغيّر ما تعرضه. مثل هذا الكود غالبًا جامد وهش.

هنا من الأفضل حساب ما يمكن أثناء التصيير، وتعديل الحالة في معالج الحدث:

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Calculate what you can during rendering
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ Calculate all the next state in the event handler
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount < 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

هذا أكثر كفاءة. وإن أضفت عرض تاريخ اللعبة، يمكنك ضبط كل متغير حالة على حركة من الماضي دون إطلاق سلسلة Effects تعدّل القيم الأخرى. لمشاركة المنطق بين معالجات، [استخرج دالة](#sharing-logic-between-event-handlers) واستدعها منها.

تذكّر أنه داخل معالجات الأحداث، [الحالة تتصرف كصورة لحظية.](/learn/state-as-a-snapshot) مثلاً بعد `setRound(round + 1)`، المتغير `round` يعكس القيمة وقت النقر. إن احتجت القيمة التالية للحساب، عرّفها يدويًا: `const nextRound = round + 1`.

في حالات، *لا يمكنك* حساب الحالة التالية مباشرة في المعالج. مثلاً نموذج بقوائم منسدلة متتابعة تعتمد خيارات كل قائمة على اختيار السابقة؛ حينها سلسلة Effects مناسبة لأنك تزامن مع الشبكة.

### تهيئة التطبيق {/*initializing-the-application*/}

منطق يجب أن يعمل مرة واحدة عند تحميل التطبيق.

قد يغريك وضعه في Effect في المكوّن الأعلى:

```js {2-6}
function App() {
  // 🔴 Avoid: Effects with logic that should only ever run once
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

لكنك سرعان ما تكتشف أنه [يُشغَّل مرتين في التطوير.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) قد يسبب مشاكل—مثلاً إبطال رمز مصادقة لأن الدالة لم تُصمَّم لاستدعاء مزدوج. بشكل عام، يجب أن تتحمّل المكوّنات إعادة التركيب، بما فيها `App` الأعلى.

رغم أنه قد لا يُعاد تركيبه في الإنتاج، فاتباع نفس القيود يسهل نقل الكود وإعادة استخدامه. إن كان المنطق يجب أن يعمل *مرة لكل تحميل تطبيق* لا *مرة لكل تركيب مكوّن*، أضف متغيرًا على المستوى الأعلى يتتبع التنفيذ:

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Only runs once per app load
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

يمكنك أيضًا تشغيله أثناء تهيئة الوحدة وقبل تصيير التطبيق:

```js {1,5}
if (typeof window !== 'undefined') { // Check if we're running in the browser.
   // ✅ Only runs once per app load
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

الكود على المستوى الأعلى يعمل مرة عند استيراد المكوّن، حتى إن لم يُصَرَّر. لتجنب البطء أو السلوك المفاجئ عند استيراد مكوّنات عشوائية، لا تفرط في هذا النمط. اجعل تهيئة التطبيق في جذر التطبيق أو نقطة الدخول.

### إبلاغ المكوّنات الأب عن تغيّر الحالة {/*notifying-parent-components-about-state-changes*/}

لنفترض مكوّن `Toggle` بحالة داخلية `isOn` (`true` أو `false`)، وطرق عدة للتبديل (نقر أو سحب). تريد إبلاغ الأب عند تغيّر الحالة الداخلية، فتعرّف `onChange` وتستدعيه من Effect:

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 Avoid: The onChange handler runs too late
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

كالسابق، غير مثالي. يحدّث `Toggle` حالته أولًا ثم الشاشة. ثم يشغّل React الEffect فيستدعي `onChange` من الأب، فيحدّث الأب حالته ويبدأ تصييرًا آخر. الأفضل كل شيء في مرور واحد.

احذف الEffect وحدّث حالة *كلا* المكوّنين في نفس معالج الحدث:

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Good: Perform all updates during the event that caused them
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

بهذا، يحدّث `Toggle` والأب حالتهما أثناء الحدث. React [يدمج التحديثات](/learn/queueing-a-series-of-state-updates) من مكوّنات مختلفة، فيصبح تصيير واحد.

قد تزيل الحالة تمامًا وتستقبل `isOn` من الأب:

```js {1,2}
// ✅ Also good: the component is fully controlled by its parent
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

[«رفع الحالة»](/learn/sharing-state-between-components) يجعل الأب يتحكم كليًا في `Toggle` عبر حالته. يزيد منطق الأب لكن يقلّ عدد متغيرات الحالة. كلما حاولت مزامنة متغيري حالة، جرّب رفع الحالة!

### تمرير البيانات إلى الأب {/*passing-data-to-the-parent*/}

يجلب مكوّن `Child` بيانات ثم يمرّرها إلى `Parent` في Effect:

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 Avoid: Passing data to the parent in an Effect
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

في React، البيانات تتدفق من الأب إلى الابن. عند خطأ على الشاشة، تتبع السلسلة صعودًا حتى تجد الخاصية أو الحالة الخاطئة. عندما يحدّث الابن حالة الأب في Effects، يصبح التتبع صعبًا جدًا. وبما أن الاثنين يحتاجان نفس البيانات، دع الأب يجلبها و*يمرّرها لأسفل* للابن:

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Good: Passing data down to the child
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

أبسط ويحافظ على تدفق متوقع: من الأب إلى الابن.

### الاشتراك في مخزن خارجي {/*subscribing-to-an-external-store*/}

قد تحتاج مكوّناتك للاشتراك ببيانات خارج حالة React، من مكتبة أو API متصفح. قد تتغيّر دون علم React، فتحتاج اشتراكًا يدويًا. يُفعل غالبًا بـ Effect، مثلاً:

```js {2-17}
function useOnlineStatus() {
  // Not ideal: Manual store subscription in an Effect
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

هنا يشترك المكوّن في مخزن خارجي (`navigator.onLine`). بما أن API غير موجودة على الخادم، تبدأ الحالة `true`. عند تغيّر القيمة في المتصفح، يحدّث المكوّن حالته.

رغم شيوع Effects لهذا، يوفّر React [`useSyncExternalStore`](/reference/react/useSyncExternalStore) المفضّل. احذف الEffect واستبدله:

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Good: Subscribing to an external store with a built-in Hook
  return useSyncExternalStore(
    subscribe, // React won't resubscribe for as long as you pass the same function
    () => navigator.onLine, // How to get the value on the client
    () => true // How to get the value on the server
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

أقل عرضة للأخطاء من مزامنة بيانات قابلة للتغيير يدويًا بحالة React عبر Effect. غالبًا تكتب Hook مخصصًا مثل `useOnlineStatus()` لتجنب التكرار. [اقرأ المزيد عن الاشتراك في مخازن خارجية.](/reference/react/useSyncExternalStore)

### جلب البيانات {/*fetching-data*/}

كثير من التطبيقات تبدأ الجلب بـ Effects. شائع كتابة Effect كهذا:

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Avoid: Fetching without cleanup logic
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

لا *تحتاج* لنقل هذا الجلب إلى معالج حدث.

قد يبدو متناقضًا مع الأمثلة السابقة! لكن السبب الرئيسي للجلب ليس *حدث الكتابة*. حقول البحث تُملأ أحيانًا من الرابط، والمستخدم قد يستخدم الرجوع دون لمس الحقل.

لا يهم مصدر `page` و`query`. ما دام المكوّن ظاهرًا، تريد إبقاء `results` [مزامنة](/learn/synchronizing-with-effects) مع الشبكة للـ `page` و`query` الحاليين. لذلك هو Effect.

لكن الكود أعلاه فيه خلل. اكتب `"hello"` بسرعة فيتغيّر `query` من `"h"` إلى `"hello"` بخطوات، فيُطلق جلبًا متعددًا دون ضمان ترتيب الاستجابات. قد تصل استجابة `"hell"` *بعد* `"hello"` فتستدعي `setResults()` أخيرًا وتعرض نتائج خاطئة. يُسمى ذلك [«سباقًا» race condition](https://en.wikipedia.org/wiki/Race_condition).

**لإصلاح السباق، [أضف دالة تنظيف](/learn/synchronizing-with-effects#fetching-data) لتجاهل الاستجابات القديمة:**

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

هذا يضمن أن كل الاستجابات ما عدا آخر طلب تُتجاهل.

السباق ليس الصعوبة الوحيدة. فكّر أيضًا في التخزين المؤقت للاستجابات، والجلب على الخادم (HTML أولي بمحتوى لا دوّار تحميل)، وتجنب شلالات الشبكة.

**هذه القضايا لأي مكتبة واجهات، وليست React وحدها. حلها غير بسيط، لذلك توفر [الأطر الحديثة](/learn/creating-a-react-app#full-stack-frameworks) آليات جلب مدمجة أكثر كفاءة من الجلب داخل Effects.**

إن لم تستخدم إطارًا ولا تريد بناء واحد، استخرج منطق الجلب إلى Hook مخصص كهذا:

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

ستريد غالبًا معالجة أخطاء وتتبع التحميل. ابنِ Hook بنفسك أو استخدم حلولًا جاهزة في المنظومة. **لن يكون هذا بمفرده كفاءة آلية الإطار، لكن نقل الجلب إلى Hook يسهل اعتماد استراتيجية أقوى لاحقًا.**

بشكل عام، كلما اضطررت لكتابة Effects، راقب فرص استخراج وظيفة إلى Hook مخصص بـ API أوضح مثل `useData`. كلما قلّت استدعاءات `useEffect` الخام في مكوّناتك، سهُل صيانة التطبيق.

<Recap>

- إن أمكن حساب شيء أثناء التصيير، لا تحتاج Effect.
- لتخزين مؤقت لحساب مكلف، أضف `useMemo` بدل `useEffect`.
- لإعادة ضبط شجرة مكوّنات كاملة، مرّر `key` مختلفًا.
- لإعادة ضبط جزء من الحالة عند تغيّر خاصية، اضبطها أثناء التصيير.
- الكود الذي يعمل لأن المكوّن *عُرض* يكون في Effects، والباقي في الأحداث.
- لتحديث عدة مكوّنات، الأفضل في حدث واحد.
- عند محاولة مزامنة حالات بين مكوّنات، فكّر برفع الحالة.
- يمكنك الجلب بـ Effects، لكن تنفيذ التنظيف ضروري لتجنب السباق.

</Recap>

<Challenges>

#### حوّل البيانات دون Effects {/*transform-data-without-effects*/}

يعرض `TodoList` أدناه قائمة مهام. عند تفعيل «إظهار المهام النشطة فقط»، لا تظهر المكتملة. مهما كانت المرئية، يعرض التذييل عدد المهام غير المكتملة.

بسّط المكوّن بإزالة الحالة والEffects غير الضرورية.

<Sandpack>

```js {expectedErrors: {'react-compiler': [12, 16, 20]}}
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} todos left
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

إن أمكن حساب شيء أثناء التصيير، لا تحتاج حالة ولا Effect يحدّثها.

</Hint>

<Solution>

هناك قطعتان أساسيتان من الحالة فقط: قائمة `todos` و`showActive` التي تعني تفعيل خانة «النشطة فقط». بقية المتغيرات [زائدة](/learn/choosing-the-state-structure#avoid-redundant-state) ويمكن حسابها أثناء التصيير، بما فيها `footer` التي يمكن نقلها مباشرة إلى JSX المحيط.

ينبغي أن يبدو ناتجك هكذا:

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} todos left
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### خزّن حسابًا مؤقتًا دون Effects {/*cache-a-calculation-without-effects*/}

في هذا المثال، استُخرجت تصفية المهام إلى دالة `getVisibleTodos()` فيها `console.log()` لتلاحظ متى تُستدعى. بدّل «إظهار النشطة فقط» ولاحظ إعادة تشغيل `getVisibleTodos()`—وهذا متوقع عند تغيّر القائمة المرئية.

مهمتك إزالة Effect إعادة حساب `visibleTodos` في `TodoList`، مع ضمان ألا يُعاد تشغيل `getVisibleTodos()` (ولا تُطبع سجلات) عند الكتابة في الحقل.

<Hint>

حل هو إضافة `useMemo` لتخزين المهام المرئية مؤقتًا. وهناك حل آخر أقل وضوحًا.

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [11]}}
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

أزل متغير الحالة والEffect، وأضف `useMemo` لتخزين نتيجة `getVisibleTodos()` مؤقتًا:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

بهذا التغيير، تُستدعى `getVisibleTodos()` فقط عند تغيّر `todos` أو `showActive`. الكتابة في الحقل تغيّر `text` فقط، فلا تستدعي `getVisibleTodos()`.

وهناك حل آخر بلا `useMemo`. بما أن `text` لا يمكن أن يؤثر على قائمة المهام، استخرج نموذج `NewTodo` إلى مكوّن منفصل وانقل `text` إليه:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

هذا يلبي المتطلبات أيضًا. عند الكتابة في الحقل، يتحدّث `text` فقط. وبما أن `text` في الابن `NewTodo`، لا يُعاد تصيير الأب `TodoList`، فلا تُستدعى `getVisibleTodos()` عند الكتابة. (ما زالت تُستدعى إن أُعيد تصيير `TodoList` لسبب آخر.)

</Solution>

#### أعد ضبط الحالة دون Effects {/*reset-state-without-effects*/}

يستقبل `EditContact` كائن اتصال `{ id, name, email }` كخاصية `savedContact`. جرّب تعديل الاسم والبريد. عند Save يتحدّث زر جهة الاتصال فوق النموذج. عند Reset تُلغى التعديلات المعلّقة. جرّب الواجهة.

عند اختيار جهة اتصال بالأزرار العلوية، يُصفّى النموذج. هذا يُنجَز حاليًا بـ Effect في `EditContact.js`. أزل الEffect. اعثر على طريقة أخرى لإعادة ضبط النموذج عند تغيّر `savedContact.id`.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js {expectedErrors: {'react-compiler': [8, 9]}} src/EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

مفيد لو أخبرت React أن نموذجًا بـ `savedContact.id` مختلف هو نموذج _جهة اتصال مختلفة_ ولا يجب أن يحتفظ بالحالة. هل تتذكر طريقة؟

</Hint>

<Solution>

اقسم `EditContact` إلى جزأين. انقل كل حالة النموذج إلى `EditForm` الداخلي. صدّر `EditContact` الخارجي ومرّر `savedContact.id` كـ `key` إلى `EditForm`. فيُصفّى النموذج ويُعاد إنشاء DOM عند اختيار جهة اتصال أخرى.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### أرسل نموذجًا دون Effects {/*submit-a-form-without-effects*/}

يسمح `Form` بإرسال رسالة لصديق. عند الإرسال، تُضبط `showForm` على `false`، فيُطلق Effect يستدعي `sendMessage(message)` (يظهر في الطرفية). ثم تظهر نافذة «شكرًا» وزر «فتح المحادثة» للعودة.

المستخدمون يرسلون رسائل كثيرة جدًا. قررت إظهار نافذة «شكرًا» *أولًا* بدل النموذج. غيّر تهيئة `showForm` إلى `false` بدل `true`، فسترى في الطرفية أن رسالة فارغة أُرسلت. المنطق فيه خطأ!

ما جذر المشكلة وكيف تصلحه؟

<Hint>

هل تُرسل الرسالة _لأن_ المستخدم رأى نافذة «شكرًا»؟ أم العكس؟

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

`showForm` تحدد عرض النموذج أو «شكرًا». لكنك لا ترسل الرسالة لأن الحوار _عُرض_، بل لأن المستخدم _أرسل النموذج_. احذف Effect المضلّل وانقل `sendMessage` إلى `handleSubmit`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

لاحظ أنه في هذا الإصدار، _إرسال النموذج_ (حدث) فقط هو ما يرسل الرسالة. يعمل سواء كانت `showForm` أولًا `true` أو `false`. (اضبطها على `false` ولن ترَ رسائل زائدة في الطرفية.)

</Solution>

</Challenges>
