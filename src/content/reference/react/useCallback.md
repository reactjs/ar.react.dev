---
title: دالة useCallback
---

<Intro>

`useCallback` هو Hook في React يتيح لك تخزين تعريف دالة مؤقتًا بين إعادات الرسم.

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) يذكر القيم والدوال تلقائيًا، ما يقلل الحاجة لاستدعاءات `useCallback` اليدوية. يمكنك استخدام المُجمّع للتعامل مع التذكير تلقائيًا.

</Note>

<InlineToc />

---

## المرجع {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

استدعِ `useCallback` في أعلى مستوى مكوّنك لتخزين تعريف دالة بين إعادات الرسم:

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `fn`: قيمة الدالة التي تريد تخزينها. يمكن أن تأخذ أي وسائط وتعيد أي قيم. تعيد React (ولا تستدعي!) دالتك إليك أثناء الـ render الأول. في الـ renders التالية، تعيد React نفس الدالة إذا لم تتغيّر `dependencies` منذ آخر render. وإلا تعيد الدالة التي مررتها في الـ render الحالي وتخزّنها لربما يُعاد استخدامها لاحقًا. لن تستدعي React دالتك. تُعاد الدالة إليك لتقرر متى وهل تستدعيها.

* `dependencies`: قائمة كل القيم التفاعلية المُشار إليها داخل كود `fn`. تشمل القيم التفاعلية الـ props والـ state وكل المتغيرات والدوال المصرّح عنها مباشرة في جسم المكوّن. إذا كان linterك [مهيأ لـ React](/learn/editor-setup#linting)، يتحقق من أن كل قيمة تفاعلية مذكورة كتبعية. يجب أن يبقى عدد عناصر قائمة التبعيات ثابتًا وتُكتب مضمّنة مثل `[dep1, dep2, dep3]`. تقارن React كل تبعية بقيمتها السابقة باستخدام خوارزمية [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### القيمة المعادة {/*returns*/}

في الـ render الأول، يعيد `useCallback` دالة `fn` التي مررتها.

في الـ renders اللاحقة، يعيد إما دالة `fn` المخزّنة من آخر render (إذا لم تتغيّر التبعيات)، أو دالة `fn` التي مررتها في هذا الـ render.

#### ملاحظات مهمة {/*caveats*/}

* `useCallback` هو Hook، فتستدعيه **في أعلى مستوى المكوّن** أو في Hooks خاصة بك فقط. لا تستدعه داخل حلقات أو شروط. إذا احتجت ذلك، استخرج مكوّنًا جديدًا وانقل الـ state إليه.
* React **لا تلقي بالدالة المخزّنة إلا لسبب محدد.** مثلًا، في التطوير، تُفرغ الذاكرة المؤقتة عند تعديل ملف المكوّن. في التطوير والإنتاج، تُفرغ الذاكرة إذا علّق المكوّن أثناء التركيب الأول. قد تضيف React لاحقًا ميزات تستفيد من إفراغ الذاكرة — مثلًا دعمًا مدمجًا للقوائم الافتراضية، فيكون من المنطقي إفراغ الذاكرة للعناصر التي تخرج من نافذة العرض. ينبغي أن يطابق ذلك توقعاتك إذا اعتمدت على `useCallback` لتحسين الأداء. وإلا فقد تكون [متغير state](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) أو [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) أنسب.

---

## الاستخدام {/*usage*/}

### تخطي إعادة رسم المكوّنات {/*skipping-re-rendering-of-components*/}

عند تحسين أداء الرسم، قد تحتاج أحيانًا لتخزين الدوال التي تمررها للمكوّنات الابنة. لننظر أولًا إلى الصياغة، ثم إلى الحالات التي يفيد فيها ذلك.

لتخزين دالة بين إعادات رسم مكوّنك، لفّ تعريفها في Hook `useCallback`:

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

تحتاج لتمرير أمرين إلى `useCallback`:

1. تعريف دالة تريد تخزينها بين إعادات الرسم.
2. <CodeStep step={2}>قائمة تبعيات</CodeStep> تتضمن كل قيمة داخل مكوّنك تُستخدم داخل دالتك.

في الـ render الأول، تكون <CodeStep step={3}>الدالة المعادة</CodeStep> من `useCallback` هي الدالة التي مررتها.

في الـ renders التالية، تقارن React <CodeStep step={2}>التبعيات</CodeStep> بالتبعيات التي مررتها في الـ render السابق. إذا لم تتغيّر أي تبعية (بالمقارنة مع [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is))، يعيد `useCallback` نفس الدالة كما قبل. وإلا يعيد الدالة التي مررتها في *هذا* الـ render.

بعبارة أخرى، `useCallback` يخزّن دالة بين إعادات الرسم حتى تتغيّر تبعياتها.

**لنمضِ في مثال لنرى متى يكون ذلك مفيدًا.**

لنقلك تمرّر دالة `handleSubmit` من `ProductPage` إلى مكوّن `ShippingForm`:

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

لاحظت أن تبديل خاصية `theme` يجمّد التطبيق لحظة، لكن إذا أزلت `<ShippingForm />` من JSX يبدو سريعًا. ذلك يدل على أن تحسين مكوّن `ShippingForm` يستحق المحاولة.

**افتراضيًا، عند إعادة رسم مكوّن، تعيد React رسم كل أبنائه بشكل متكرر.** لذلك عندما يعيد `ProductPage` الرسم بـ `theme` مختلف، يعيد مكوّن `ShippingForm` *أيضًا* الرسم. هذا مقبول للمكوّنات التي لا تحتاج حسابًا كبيرًا لإعادة الرسم. لكن إذا تأكدت أن إعادة الرسم بطيئة، يمكنك جعل `ShippingForm` يتخطى إعادة الرسم عندما تكون خصائصه كما في آخر render بلفّه بـ [`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**مع هذا التغيير، يتخطى `ShippingForm` إعادة الرسم إذا كانت كل خصائصه *نفسها* كما في آخر render.** هنا يصبح تخزين الدالة مهمًا! لنقل عرّفت `handleSubmit` بلا `useCallback`:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Every time the theme changes, this will be a different function...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      {/* ... so ShippingForm's props will never be the same, and it will re-render every time */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**في JavaScript، `function () {}` أو `() => {}` ينشئان دالة _مختلفة_ دائمًا،** كما أن حرف `{}` ينشئ كائنًا جديدًا دائمًا. عادةً لا مشكلة، لكن ذلك يعني أن خصائص `ShippingForm` لن تكون أبدًا «نفسها»، فلا يعمل تحسين [`memo`](/reference/react/memo). هنا يفيد `useCallback`:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Tell React to cache your function between re-renders...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...so as long as these dependencies don't change...

  return (
    <div className={theme}>
      {/* ...ShippingForm will receive the same props and can skip re-rendering */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**بلفّ `handleSubmit` في `useCallback`، تضمن أنها *نفس* الدالة بين إعادات الرسم** (حتى تتغيّر التبعيات). لا *يلزمك* لفّ دالة في `useCallback` إلا لسبب محدد. في هذا المثال، السبب أنك تمررها إلى مكوّن ملفوف بـ [`memo`,](/reference/react/memo) فيتخطى إعادة الرسم. توجد أسباب أخرى لـ`useCallback` تُشرح لاحقًا في هذه الصفحة.

<Note>

**اعتمد على `useCallback` فقط كتحسين للأداء.** إذا لم يعمل الكود بلاها، فابحث عن المشكلة الجذرية وأصلحها أولًا. ثم يمكنك إعادة `useCallback`.

</Note>

<DeepDive>

#### ما علاقة useCallback بـ useMemo؟ {/*how-is-usecallback-related-to-usememo*/}

غالبًا ترى [`useMemo`](/reference/react/useMemo) مع `useCallback`. كلاهما مفيد عند تحسين مكوّن ابن. يتيحان لك [memoization](https://en.wikipedia.org/wiki/Memoization) (أي تخزينًا) لما تمرره للأسفل:

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // Calls your function and caches its result
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // Caches your function itself
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

الفرق في *ما* تسمحان بتخزينه:

* **[`useMemo`](/reference/react/useMemo) يخزّن *نتيجة* استدعاء دالتك.** في هذا المثال، يخزّن نتيجة `computeRequirements(product)` فلا تتغيّر إلا إذا تغيّر `product`. يتيح لك تمرير كائن `requirements` دون إعادة رسم `ShippingForm` بلا داعٍ. عند الحاجة، تستدعي React الدالة التي مررتها أثناء الرسم لحساب النتيجة.
* **`useCallback` يخزّن *الدالة نفسها.*** على عكس `useMemo`، لا يستدعي الدالة التي تقدمها. بل يخزّنها بحيث لا تتغيّر `handleSubmit` *ذاتها* إلا إذا تغيّر `productId` أو `referrer`. يتيح لك تمرير `handleSubmit` دون إعادة رسم `ShippingForm` بلا داعٍ. لا يُنفَّذ الكود حتى يرسل المستخدم النموذج.

إذا كنت تعرف [`useMemo`،](/reference/react/useMemo) قد يفيدك تخيّل `useCallback` هكذا:

```js {expectedErrors: {'react-compiler': [3]}}
// Simplified implementation (inside React)
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[اقرأ المزيد عن الفرق بين `useMemo` و`useCallback`.](/reference/react/useMemo#memoizing-a-function)

</DeepDive>

<DeepDive>

#### هل تضيف useCallback في كل مكان؟ {/*should-you-add-usecallback-everywhere*/}

إذا كان تطبيقك مثل هذا الموقع وتفاعلاته غالبًا خشنة (استبدال صفحة أو قسم كامل)، فالتذكير غالبًا غير لازم. أما إذا كان أشبه بمحرر رسوم وتفاعلاته دقيقة (تحريك أشكال)، قد تجد التذكير مفيدًا جدًا.

تخزين دالة بـ`useCallback` قيّم في حالات قليلة:

- تمررها كخاصية لمكوّن ملفوف بـ [`memo`.](/reference/react/memo) وتريد تخطي إعادة الرسم إذا لم تتغيّر القيمة. التذكير يجعل المكوّن يعيد الرسم فقط عند تغيّر التبعيات.
- الدالة التي تمررها تُستخدم لاحقًا كتبعية لـHook. مثلًا، دالة أخرى ملفوفة بـ`useCallback` تعتمد عليها، أو تعتمد عليها من [`useEffect`.](/reference/react/useEffect)

لا فائدة من لفّ دالة بـ`useCallback` في غير هذه الحالات. ولا ضرر كبيرًا من ذلك أيضًا، ففرق يختار عدم التفكير في كل حالة والتذكير قدر الإمكان. العيب أن الكود يصعب قراءته. كذلك ليس كل تذكيرًا فعالًا: قيمة واحدة «دائمة الجدّة» تكفي لكسر التذكير لمكوّن كامل.

لاحظ أن `useCallback` لا يمنع *إنشاء* الدالة. تُنشئ دالة دائمًا (وهذا طبيعي!)، لكن React تتجاهلها وتعيد الدالة المخزّنة إن لم يتغيّر شيء.

**عمليًا، يمكنك جعل كثيرًا من التذكير غير لازم باتباع مبادئ:**

1. عندما يغلّف مكوّن مرئيًا مكوّنات أخرى، اجعله [يقبل JSX كأبناء.](/learn/passing-props-to-a-component#passing-jsx-as-children) فإذا حدّث المكوّن الغلاف حالته، تعلم React أن الأبناء لا يحتاجون إعادة رسم.
2. فضّل state المحلي ولا [ترفع state](/learn/sharing-state-between-components) أكثر من اللازم. لا تبقِ state عابرًا مثل النماذج وما إذا مرّ المؤشر فوق عنصر في أعلى الشجرة أو في مكتبة state عامة.
3. أبقِ [منطق الرسم نقيًا.](/learn/keeping-components-pure) إذا تسببت إعادة رسم مكوّن في مشكلة أو شذوذًا مرئيًا، فهذا خلل في المكوّن! أصلح الخلل بدل إضافة تذكير.
4. تجنب [Effects غير ضرورية تحدّث state.](/learn/you-might-not-need-an-effect) أغلب مشاكل الأداء في تطبيقات React سلاسل تحديثات تنبع من Effects تجعل المكوّنات ترسم مرارًا.
5. حاول [إزالة تبعيات غير ضرورية من Effects.](/learn/removing-effect-dependencies) غالبًا أبسط من التذكير نقل كائن أو دالة داخل Effect أو خارج المكوّن.

إذا بقي تفاعل معيّن بطيئًا، [استخدم ملف React Developer Tools](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) لمعرفة المكوّنات التي تستفيد أكثر من التذكير وأضفه حيث يلزم. هذه المبادئ تسهّل التصحيح والفهم، فمن الجيد اتباعها على أي حال. على المدى الطويل، نبحث في [تذكير تلقائي](https://www.youtube.com/watch?v=lGEMwh32soc) لحل ذلك جذريًا.

</DeepDive>

<Recipes titleText="الفرق بين useCallback وتعريف دالة مباشرة" titleId="examples-rerendering">

#### تخطي إعادة الرسم بـ`useCallback` و`memo` {/*skipping-re-rendering-with-usecallback-and-memo*/}

في هذا المثال، **يُبطّأ** مكوّن `ShippingForm` اصطناعيًا حتى ترى ماذا يحدث عندما يكون المكوّن بطيئًا فعلًا. جرّب زيادة العداد وتبديل السمة.

زيادة العداد تبدو بطيئة لأنها تجبر `ShippingForm` المبطّأ على إعادة الرسم. ذلك متوقع لأن العداد تغيّر وتحتاج عكس اختيار المستخدم.

ثم جرّب تبديل السمة. **بفضل `useCallback` مع [`memo`](/reference/react/memo)، يبقى سريعًا رغم الإبطاء الاصطناعي!** تخطى `ShippingForm` إعادة الرسم لأن دالة `handleSubmit` لم تتغيّر. ولم تتغيّر لأن `productId` و`referrer` (تبعيات `useCallback`) لم يتغيّرا منذ آخر render.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
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

في هذا المثال، تنفيذ `ShippingForm` **مُبطّأ** اصطناعيًا أيضًا حتى ترى ماذا يحدث عندما يكون المكوّن بطيئًا. جرّب زيادة العداد وتبديل السمة.

على عكس المثال السابق، تبديل السمة بطيء الآن أيضًا! لأن **لا يوجد استدعاء `useCallback` في هذه النسخة،** فـ`handleSubmit` دالة جديدة دائمًا، ولا يستطيع `ShippingForm` المبطّأ تخطي إعادة الرسم.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
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


فيما يلي نفس الكود **بعد إزالة الإبطاء الاصطناعي.** هل غياب `useCallback` ملحوظ أم لا؟

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('Rendering <ShippingForm />');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
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

تذكّر أنك تحتاج تشغيل React في وضع الإنتاج، وتعطيل [React Developer Tools](/learn/react-developer-tools)، واستخدام أجهزة قريبة من أجهزة مستخدميك لتقدير واقعي لما يبطئ تطبيقك.

<Solution />

</Recipes>

---

### تحديث state من callback مذكّر {/*updating-state-from-a-memoized-callback*/}

أحيانًا تحتاج تحديث state اعتمادًا على state سابق من callback مذكّر.

تحدد دالة `handleAddTodo` هنا `todos` كتبعية لأنها تحسب قائمة المهام التالية منها:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

عادةً تريد أقل تبعيات ممكنة للدوال المذكّرة. عندما تقرأ state فقط لحساب التالي، أزل تلك التبعية بتمرير [دالة تحديث](/reference/react/useState#updating-state-based-on-the-previous-state):

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ No need for the todos dependency
  // ...
```

هنا، بدل جعل `todos` تبعية وقراءتها داخل الدالة، تمرّر تعليمات عن *كيفية* تحديث الحالة (`todos => [...todos, newTodo]`) إلى React. [اقرأ المزيد عن دوال التحديث.](/reference/react/useState#updating-state-based-on-the-previous-state)

---

### منع تشغيل Effect كثيرًا {/*preventing-an-effect-from-firing-too-often*/}

أحيانًا تريد استدعاء دالة من داخل [Effect:](/learn/synchronizing-with-effects)

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    // ...
```

هذا يخلق مشكلة. [كل قيمة تفاعلية يجب تعليمها كتبعية للـ Effect.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) لكن إذا جعلت `createOptions` تبعية، سيجعل Effectك يعيد الاتصال بغرفة الدردشة باستمرار:


```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 Problem: This dependency changes on every render
  // ...
```

لحل ذلك، لفّ الدالة التي تستدعيها من Effect في `useCallback`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Only changes when roomId changes

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ Only changes when createOptions changes
  // ...
```

هذا يضمن أن `createOptions` نفسها بين إعادات الرسم إذا كان `roomId` نفسه. **لكن الأفضل إزالة الحاجة لتبعية دالة.** انقل دالتك *داخل* الـ Effect:

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ No need for useCallback or function dependencies!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Only changes when roomId changes
  // ...
```

الآن الكود أبسط ولا يحتاج `useCallback`. [تعرّف أكثر على إزالة تبعيات Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

---

### تحسين Hook مخصص {/*optimizing-a-custom-hook*/}

إذا كتبت [Hook مخصصًا،](/learn/reusing-logic-with-custom-hooks) يُنصح بلفّ أي دوال يعيدها في `useCallback`:

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

هذا يضمن أن مستخدمي Hookك يستطيعون تحسين كودهم عند الحاجة.

---

## استكشاف الأخطاء {/*troubleshooting*/}

### في كل render يعيد `useCallback` دالة مختلفة {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

تأكد أنك مررت مصفوفة التبعيات كوسيط ثانٍ!

إذا نسيت مصفوفة التبعيات، يعيد `useCallback` دالة جديدة في كل مرة:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 Returns a new function every time: no dependency array
  // ...
```

هذه النسخة المصححة التي تمرر مصفوفة التبعيات كوسيط ثانٍ:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ Does not return a new function unnecessarily
  // ...
```

إذا لم يُفد، فالمشكلة أن تبعية واحدة على الأقل تختلف عن الـ render السابق. يمكنك التصحيح بتسجيل التبعيات يدويًا في وحدة التحكم:

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

ثم انقر بالزر الأيمن على المصفوفات من renders مختلفة في وحدة التحكم واختر «Store as a global variable» لكليهما. إذا حُفظت الأولى كـ`temp1` والثانية كـ`temp2`، استخدم وحدة تحكم المتصفح للتحقق من تساوي كل تبعية بين المصفوفتين:

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

عندما تجد التبعية التي تكسر التذكير، أزلها إن أمكن، أو [ذكّرها أيضًا.](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)

---

### أحتاج استدعاء `useCallback` لكل عنصر قائمة في حلقة، وهذا غير مسموح {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

لنقل مكوّن `Chart` ملفوفًا بـ [`memo`](/reference/react/memo). تريد تخطي إعادة رسم كل `Chart` في القائمة عند إعادة رسم `ReportList`. لكن لا يمكنك استدعاء `useCallback` داخل حلقة:

```js {expectedErrors: {'react-compiler': [6]}} {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 You can't call useCallback in a loop like this:
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

بدلًا من ذلك، استخرج مكوّنًا لعنصر واحد وضع `useCallback` فيه:

```js {5,12-21}
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
  // ✅ Call useCallback at the top level:
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

أو يمكنك إزالة `useCallback` من المقتطف الأخير ولف `Report` نفسه بـ [`memo`.](/reference/react/memo) إذا لم تتغيّر خاصية `item`، يتخطى `Report` إعادة الرسم، فيتخطى `Chart` أيضًا:

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
