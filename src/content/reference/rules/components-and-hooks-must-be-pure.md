---
title: يجب أن تكون المكوّنات والـ Hooks نقية
---

<Intro>
الدوال النقية تقوم فقط بإجراء حساب ولا شيء غير ذلك. ذلك يجعل الكود أسهل للفهم والتصحيح، ويتيح لـ React تحسين مكوّناتك و Hooks تلقائياً بالشكل الصحيح.
</Intro>

<Note>
تغطي صفحة المرجع هذه مواضيع متقدمة وتفترض الإلمام بالمفاهيم الواردة في صفحة [الحفاظ على نقاء المكوّنات](/learn/keeping-components-pure).
</Note>

<InlineToc />

### لماذا يهم النقاء؟ {/*why-does-purity-matter*/}

من المفاهيم الأساسية التي تجعل React هو _React_ هو _النقاء_. المكوّن أو الـ Hook النقي هو الذي يكون:

* **أيديمبوتنت (idempotent)** – [تحصل دائماً على نفس النتيجة في كل مرة](/learn/keeping-components-pure#purity-components-as-formulas) تشغّل فيها الكود مع نفس المدخلات – أي props و state و context لمكوّنات؛ والوسائط (arguments) لمدخلات الـ Hook.
* **بلا آثار جانبية (side effects) في التصيير (render)** – يجب أن يعمل الكود ذو الآثار الجانبية [**منفصلاً عن التصيير**](#how-does-react-run-your-code). مثلاً في [معالج حدث (event handler)](/learn/responding-to-events) – حيث يتفاعل المستخدم مع الواجهة فيُحدّثها؛ أو في [Effect](/reference/react/useEffect) – الذي يعمل بعد التصيير.
* **لا يغيّر قيماً غير محلية**: يجب ألا [تعدّل المكوّنات والـ Hooks قيماً لم تُنشأ محلياً](#mutation) أثناء التصيير.

عندما يبقى التصيير نقياً، يستطيع React فهم كيفية ترتيب أولويات التحديثات الأهم للمستخدم ليراها أولاً. يصبح ذلك ممكناً بفضل نقاء التصيير: بما أن المكوّنات لا تُحدّث آثاراً جانبية [أثناء التصيير](#how-does-react-run-your-code)، يمكن لـ React إيقاف تصيير مكوّنات أقل أهمية للتحديث والعودة إليها لاحقاً عند الحاجة.

عملياً، يعني ذلك أن منطق التصيير قد يُشغَّل عدة مرات بطريقة تسمح لـ React بتقديم تجربة مستخدم سلسة. أما إذا كان لمكوّنك أثر جانبي غير مُتتبَّع – مثل تعديل قيمة متغيّر عام [أثناء التصيير](#how-does-react-run-your-code) – فعند إعادة تشغيل كود التصيير ستُفعَّل الآثار الجانبية بطريقة لا تتوافق مع ما تريد. غالباً ما يؤدي ذلك إلى أخطاء غير متوقعة تُضعف تجربة المستخدم. يمكنك رؤية [مثال لذلك في صفحة الحفاظ على نقاء المكوّنات](/learn/keeping-components-pure#side-effects-unintended-consequences).

#### كيف يشغّل React كودك؟ {/*how-does-react-run-your-code*/}

React تصريحي (declarative): تخبر React _ماذا_ تُصيّر، وReact يحدد _كيف_ يعرض ذلك بأفضل شكل للمستخدم. لذلك يمر React بعدة مراحل يشغّل فيها كودك. لا تحتاج معرفة كل هذه المراحل لاستخدام React جيداً. لكن على مستوى عام يجب أن تعرف ما الذي يعمل في _التصيير (render)_ وما الذي يعمل خارجه.

_التصيير_ يعني حساب شكل النسخة التالية من واجهتك. بعد التصيير، تُنفَّذ [Effects](/reference/react/useEffect) بالكامل (تُشغَّل حتى لا يبقى منها شيء) وقد يُحدَّث الحساب إذا أثرت الـ Effects على التخطيط (layout). يأخذ React هذا الحساب الجديد ويقارنه بالحساب المستخدم لإنشاء النسخة السابقة من الواجهة، ثم _يُلتزم (commits)_ بالحد الأدنى من التغييرات إلى [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) (ما يراه المستخدم فعلياً) لمواكبة أحدث نسخة.

<DeepDive>

#### كيف تعرف أن الكود يعمل أثناء التصيير؟ {/*how-to-tell-if-code-runs-in-render*/}

طريقة سريعة لمعرفة ما إذا كان الكود يعمل أثناء التصيير هي النظر إلى مكانه: إذا كان مكتوباً في المستوى الأعلى كما في المثال أدناه، فالاحتمال كبير أنه يعمل أثناء التصيير.

```js {2}
function Dropdown() {
  const selectedItems = new Set(); // created during render
  // ...
}
```

معالجات الأحداث والـ Effects لا تعمل أثناء التصيير:

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  const onSelect = (item) => {
    // this code is in an event handler, so it's only run when the user triggers this
    selectedItems.add(item);
  }
}
```

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  useEffect(() => {
    // this code is inside of an Effect, so it only runs after rendering
    logForAnalytics(selectedItems);
  }, [selectedItems]);
}
```
</DeepDive>

---

## يجب أن تكون المكوّنات والـ Hooks أيديمبوتنت {/*components-and-hooks-must-be-idempotent*/}

يجب أن تُرجع المكوّنات دائماً نفس المخرجات بالنسبة لمدخلاتها – props و state و context. يُعرف ذلك بـ _الأيديمبوتنسية (idempotency)_. [الأيديمبوتنسية](https://en.wikipedia.org/wiki/Idempotence) مصطلح شائع في البرمجة الوظيفية (functional programming). تقصد أنك [تحصل دائماً على نفس النتيجة في كل مرة](learn/keeping-components-pure) تشغّل فيها ذلك الجزء من الكود مع نفس المدخلات.

يعني ذلك أن _كل_ الكود الذي يعمل [أثناء التصيير](#how-does-react-run-your-code) يجب أن يكون أيديمبوتنت أيضاً حتى تُطبَّق هذه القاعدة. مثلاً، هذا السطر ليس أيديمبوتنت (وبالتالي المكوّن كذلك ليس كذلك):

```js {2}
function Clock() {
  const time = new Date(); // 🔴 Bad: always returns a different result!
  return <span>{time.toLocaleString()}</span>
}
```

`new Date()` ليس أيديمبوتنت لأنه يُرجع التاريخ الحالي ويختلف ناتجه في كل استدعاء. عند تصيير المكوّن أعلاه، يبقى الوقت المعروض على الشاشة عالقاً عند وقت تصيير المكوّن. وبالمثل، دوال مثل `Math.random()` ليست أيديمبوتنت لأنها تُرجع نتائج مختلفة في كل مرة حتى مع نفس المدخلات.

هذا لا يعني أنه يجب ألا تستخدم دوالاً غير أيديمبوتنت مثل `new Date()` _إطلاقاً_ – بل يجب فقط تجنب استخدامها [أثناء التصيير](#how-does-react-run-your-code). في هذه الحالة يمكننا _مزامنة_ أحدث تاريخ مع هذا المكوّن باستخدام [Effect](/reference/react/useEffect):

<Sandpack>

```js
import { useState, useEffect } from 'react';

function useTime() {
  // 1. Keep track of the current date's state. `useState` receives an initializer function as its
  //    initial state. It only runs once when the hook is called, so only the current date at the
  //    time the hook is called is set first.
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // 2. Update the current date every second using `setInterval`.
    const id = setInterval(() => {
      setTime(new Date()); // ✅ Good: non-idempotent code no longer runs in render
    }, 1000);
    // 3. Return a cleanup function so we don't leak the `setInterval` timer.
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function Clock() {
  const time = useTime();
  return <span>{time.toLocaleString()}</span>;
}
```

</Sandpack>

بتغليف استدعاء `new Date()` غير الأيديمبوتنت داخل Effect، ننقل ذلك الحساب [خارج التصيير](#how-does-react-run-your-code).

إذا لم تكن بحاجة لمزامنة حالة خارجية مع React، يمكنك أيضاً النظر في [معالج حدث (event handler)](/learn/responding-to-events) إذا كان التحديث مطلوباً فقط استجابةً لتفاعل المستخدم.

---

## يجب أن تعمل الآثار الجانبية خارج التصيير {/*side-effects-must-run-outside-of-render*/}

لا ينبغي أن تعمل [الآثار الجانبية](/learn/keeping-components-pure#side-effects-unintended-consequences) [أثناء التصيير](#how-does-react-run-your-code)، لأن React قد يُصيّر المكوّنات أكثر من مرة لتحقيق أفضل تجربة ممكنة للمستخدم.

<Note>
الآثار الجانبية مصطلح أوسع من Effects. تشير Effects تحديداً إلى الكود الملفوف في `useEffect`، بينما الأثر الجانبي مصطلح عام لأي كود له أثر ملحوظ غير نتيجته الأساسية وهي إرجاع قيمة لمن استدعاه.

تُكتب الآثار الجانبية عادة داخل [معالجات الأحداث](/learn/responding-to-events) أو Effects. لكن لا أثناء التصيير أبداً.
</Note>

رغم أن التصيير يجب أن يبقى نقياً، فالآثار الجانبية ضرورية في مرحلة ما حتى يفعل تطبيقك شيئاً مفيداً، مثل إظهار شيء على الشاشة! جوهر هذه القاعدة أن الآثار الجانبية لا يجب أن تعمل [أثناء التصيير](#how-does-react-run-your-code)، لأن React قد يُصيّر المكوّنات عدة مرات. في أغلب الحالات ستستخدم [معالجات الأحداث](learn/responding-to-events) للتعامل مع الآثار الجانبية. استخدام معالج حدث يخبر React صراحة أن هذا الكود لا يحتاج للعمل أثناء التصيير، فيبقى التصيير نقياً. إذا استنفدت كل الخيارات – وفقط كملاذ أخير – يمكنك أيضاً التعامل مع الآثار الجانبية عبر `useEffect`.

### متى يُسمح بالتغيير المباشر (mutation)؟ {/*mutation*/}

#### التغيير المباشر المحلي {/*local-mutation*/}
من الأمثلة الشائعة للأثر الجانبي هو التغيير المباشر (mutation)، وفي JavaScript يقصد به تغيير قيمة غير [أولية (primitive)](https://developer.mozilla.org/en-US/docs/Glossary/Primitive). بشكل عام، رغم أن التغيير المباشر ليس أسلوباً شائعاً في React، فالتغيير المباشر _المحلي_ مقبول تماماً:

```js {2,7}
function FriendList({ friends }) {
  const items = []; // ✅ Good: locally created
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // ✅ Good: local mutation is okay
  }
  return <section>{items}</section>;
}
```

لا حاجة لإجبار الكود على تجنب التغيير المباشر المحلي. يمكن استخدام [`Array.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) هنا للاختصار، لكن لا بأس بإنشاء مصفوفة محلية ثم دفع عناصر إليها [أثناء التصيير](#how-does-react-run-your-code).

رغم أن الأمر يبدو وكأننا نغيّر `items` مباشرة، فالنقطة المهمة أن هذا الكود يفعل ذلك _محلياً_ فقط – التغيير لا يُحفَظ عند إعادة تصيير المكوّن. بمعنى آخر، `items` لا يدوم إلا طالما المكوّن قائم. وبما أن `items` يُعاد _إنشاؤه_ في كل مرة يُصيَّر فيها `<FriendList />`، فالمكوّن سيعيد دائماً نفس النتيجة.

من ناحية أخرى، إذا وُجد `items` خارج المكوّن، فهو يحتفظ بقيمه السابقة ويتذكر التغييرات:

```js {1,7}
const items = []; // 🔴 Bad: created outside of the component
function FriendList({ friends }) {
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // 🔴 Bad: mutates a value created outside of render
  }
  return <section>{items}</section>;
}
```

عند إعادة تشغيل `<FriendList />`، سنستمر في إلحاق `friends` بـ `items` في كل مرة يُشغَّل فيها المكوّن، ما يؤدي إلى تكرار النتائج. هذه النسخة من `<FriendList />` لها آثار جانبية ملحوظة [أثناء التصيير](#how-does-react-run-your-code) وت**خالف القاعدة**.

#### التهيئة الكسولة {/*lazy-initialization*/}

التهيئة الكسولة (lazy initialization) مقبولة أيضاً رغم أنها ليست «نقية» بالمعنى الصارم:

```js {2}
function ExpenseForm() {
  SuperCalculator.initializeIfNotReady(); // ✅ Good: if it doesn't affect other components
  // Continue rendering...
}
```

#### تغيير DOM {/*changing-the-dom*/}

لا يُسمح بآثار جانبية يظهر أثرها مباشرة للمستخدم في منطق تصيير مكوّنات React. بمعنى آخر، لا ينبغي أن يؤدي استدعاء دالة المكوّن وحده إلى تغيير يظهر على الشاشة.

```js {2}
function ProductDetailPage({ product }) {
  document.title = product.title; // 🔴 Bad: Changes the DOM
}
```

من الطرق لتحقيق تحديث `document.title` خارج التصيير [مزامنة المكوّن مع `document`](/learn/synchronizing-with-effects).

طالما أن استدعاء المكوّن عدة مرات آمناً ولا يؤثر على تصيير مكوّنات أخرى، فلا يهم React إن كان «نقياً» بنسبة 100% بالمعنى البرمجة الوظيفية الصارم. الأهم أن [المكوّنات يجب أن تكون أيديمبوتنت](/reference/rules/components-and-hooks-must-be-pure).

---

## الـ props والـ state غير قابلة للتغيير المباشر {/*props-and-state-are-immutable*/}

props و state للمكوّن هما [لقطات (snapshots)](learn/state-as-a-snapshot) غير قابلة للتغيير المباشر. لا تغيّرهما مباشرة أبداً. بدلاً من ذلك مرّر props جديدة للأسفل، واستخدم دالة الضبط (setter) من `useState`.

يمكنك اعتبار قيم props و state لقطات تُحدَّث بعد التصيير. لذلك لا تعدّل متغيّرات props أو state مباشرة: بل مرّر props جديدة، أو استخدم دالة الضبط المُزوَّدة لتخبر React أن الـ state يحتاج للتحديث في التصيير التالي للمكوّن.

### لا تغيّر الـ props مباشرة {/*props*/}
الـ props غير قابلة للتغيير المباشر لأن تعديلها يُنتج مخرجات غير متسقة للتطبيق، وقد يصعب تصحيحها لأنها قد تعمل أو لا تعمل حسب الظروف.

```js {expectedErrors: {'react-compiler': [2]}} {2}
function Post({ item }) {
  item.url = new Url(item.url, base); // 🔴 Bad: never mutate props directly
  return <Link url={item.url}>{item.title}</Link>;
}
```

```js {2}
function Post({ item }) {
  const url = new Url(item.url, base); // ✅ Good: make a copy instead
  return <Link url={url}>{item.title}</Link>;
}
```

### لا تغيّر الـ state مباشرة {/*state*/}
`useState` يُرجع متغيّر الـ state ودالة ضبط لتحديث ذلك الـ state.

```js
const [stateVariable, setter] = useState(0);
```

بدلاً من تحديث متغيّر الـ state في مكانه، نحدّثه باستخدام دالة الضبط التي يُرجعها `useState`. تغيير القيم على متغيّر الـ state مباشرة لا يُسبّب تحديث المكوّن، فيبقى المستخدم أمام واجهة قديمة. استخدام دالة الضبط يُعلِم React أن الـ state تغيّر، وأننا نحتاج لإدراج إعادة تصيير لتحديث الواجهة.

```js {expectedErrors: {'react-compiler': [2, 5]}} {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    count = count + 1; // 🔴 Bad: never mutate state directly
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // ✅ Good: use the setter function returned by useState
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

---

## قيم الإرجاع والوسائط الممرَّرة إلى Hooks غير قابلة للتغيير المباشر {/*return-values-and-arguments-to-hooks-are-immutable*/}

بعد تمرير القيم إلى hook، لا يجب تعديلها. كما في props داخل JSX، تصبح القيم غير قابلة للتغيير المباشر عند تمريرها إلى hook.

```js {expectedErrors: {'react-compiler': [4]}} {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  if (icon.enabled) {
    icon.className = computeStyle(icon, theme); // 🔴 Bad: never mutate hook arguments directly
  }
  return icon;
}
```

```js {3}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  const newIcon = { ...icon }; // ✅ Good: make a copy instead
  if (icon.enabled) {
    newIcon.className = computeStyle(icon, theme);
  }
  return newIcon;
}
```

من المبادئ المهمة في React _الاستدلال المحلي (local reasoning)_: القدرة على فهم ما يفعله مكوّن أو hook بمجرد النظر إلى كوده بمعزل عن غيره. يجب التعامل مع Hooks كـ «صناديق سوداء» عند استدعائها. مثلاً، قد يستخدم hook مخصّص وسائطه كتبعيات (dependencies) لحفظ قيم داخلياً عبر memoization:

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);

  return useMemo(() => {
    const newIcon = { ...icon };
    if (icon.enabled) {
      newIcon.className = computeStyle(icon, theme);
    }
    return newIcon;
  }, [icon, theme]);
}
```

إذا غيّرت وسائط الـ Hook مباشرة، يصبح حفظ القيم داخل الـ hook المخصّص غير صحيح، لذا من المهم تجنب ذلك.

```js {4}
style = useIconStyle(icon);         // `style` is memoized based on `icon`
icon.enabled = false;               // Bad: 🔴 never mutate hook arguments directly
style = useIconStyle(icon);         // previously memoized result is returned
```

```js {4}
style = useIconStyle(icon);         // `style` is memoized based on `icon`
icon = { ...icon, enabled: false }; // Good: ✅ make a copy instead
style = useIconStyle(icon);         // new value of `style` is calculated
```

وبالمثل، من المهم ألا تعدّل قيم الإرجاع من Hooks، لأنها قد تكون محفوظة عبر memoization.

---

## القيم غير قابلة للتغيير المباشر بعد تمريرها إلى JSX {/*values-are-immutable-after-being-passed-to-jsx*/}

لا تغيّر القيم بعد استخدامها في JSX. انقل التغيير المباشر إلى ما قبل إنشاء JSX.

عند استخدام JSX في تعبير، قد يقيّم React الـ JSX مبكراً قبل أن ينتهي المكوّن من التصيير. يعني ذلك أن تغيير القيم بعد تمريرها إلى JSX قد يؤدي إلى واجهات قديمة، لأن React لن يعرف أنه يجب تحديث مخرجات المكوّن.

```js {expectedErrors: {'react-compiler': [4]}} {4}
function Page({ colour }) {
  const styles = { colour, size: "large" };
  const header = <Header styles={styles} />;
  styles.size = "small"; // 🔴 Bad: styles was already used in the JSX above
  const footer = <Footer styles={styles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```

```js {4}
function Page({ colour }) {
  const headerStyles = { colour, size: "large" };
  const header = <Header styles={headerStyles} />;
  const footerStyles = { colour, size: "small" }; // ✅ Good: we created a new value
  const footer = <Footer styles={footerStyles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```
