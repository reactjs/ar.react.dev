---
title: "'use client'"
titleForTitleTag: "توجيه 'use client'"
---

<RSC>

`'use client'` مخصص للاستخدام مع [مكونات React من جانب الخادم](/reference/rsc/server-components).

</RSC>


<Intro>

`'use client'` يتيح لك تحديد أي الكود يعمل على العميل.

</Intro>

<InlineToc />

---

## مرجع {/*reference*/}

### `'use client'` {/*use-client*/}

أضف `'use client'` في أعلى الملف لوسم الوحدة وكل تبعياتها غير المباشرة (transitive) على أنها كود عميل.

```js {1}
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
}
```

عند استيراد ملف موسوم بـ `'use client'` من مكون خادم، ستعامل [أدوات التجميع المتوافقة](/learn/creating-a-react-app#full-stack-frameworks) استيراد الوحدة كحدّ يفصل بين الكود الذي يعمل على الخادم والكود الذي يعمل على العميل.

وبصفتها تبعيات لـ `RichTextEditor`، ستُقيَّم أيضًا `formatDate` و`Button` على العميل بغض النظر عن احتواء وحداتها على توجيه `'use client'` أم لا. لاحظ أنه قد تُقيَّم وحدة واحدة على الخادم عند استيرادها من كود خادم، وعلى العميل عند استيرادها من كود عميل.

#### تحذيرات {/*caveats*/}

* يجب أن يكون `'use client'` في بداية الملف تمامًا، فوق أي استيراد أو كود آخر (التعليقات مسموحة). يجب كتابته بعلامتي اقتباس مفردتين أو مزدوجتين، وليس بعلامات الاقتباس الخلفية (backticks).
* عند استيراد وحدة `'use client'` من وحدة أخرى تُصيَّر على العميل، لا يكون للتوجيه أي أثر.
* عندما تحتوي وحدة مكوّن على توجيه `'use client'`، فإن أي استخدام لهذا المكوّن يُضمن أن يكون مكوّن عميل. مع ذلك، قد يُقيَّم المكوّن على العميل حتى لو لم يكن في وحدته توجيه `'use client'`.
	* يُعتبر استخدام المكوّن مكوّن عميلًا إذا عُرّف في وحدة تحتوي على توجيه `'use client'`، أو عندما يكون تبعية غير مباشرة لوحدة تحتوي على `'use client'`. وإلا فهو مكون خادم.
* الكود الموسوم للتقييم على العميل ليس مقتصرًا على المكوّنات؛ كل الكود الذي يقع ضمن شجرة فرعية لوحدة عميل يُرسل إلى العميل ويُنفَّذ عليه.
* عندما تستورد وحدة تُقيَّم على الخادم قيمًا من وحدة `'use client'`، يجب أن تكون القيم إما مكوّن React أو [قيم خصائص قابلة للتسلسل مدعومة](#passing-props-from-server-to-client-components) لتُمرَّر إلى مكوّن عميل. أي استخدام آخر سيرمي استثناءً.

### كيف يوسم `'use client'` كود العميل {/*how-use-client-marks-client-code*/}

في تطبيق React، غالبًا تُقسَّم المكوّنات إلى ملفات منفصلة، أو [وحدات](/learn/importing-and-exporting-components#exporting-and-importing-a-component).

في التطبيقات التي تستخدم مكونات React من جانب الخادم، يُصيَّر التطبيق على الخادم افتراضيًا. يُدخل `'use client'` حدًا بين الخادم والعميل في [شجرة تبعيات الوحدات](/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree)، مما يُنشئ فعليًا شجرة فرعية من وحدات العميل.

لتوضيح ذلك، انظر تطبيق مكونات React من جانب الخادم التالي.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
'use client';

import { useState } from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = useState(0);
  const quote = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational quote is:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  "Don’t let yesterday take up too much of today.” — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

في شجرة تبعيات الوحدات لهذا المثال، يوسم توجيه `'use client'` في `InspirationGenerator.js` تلك الوحدة وكل تبعياتها غير المباشرة على أنها وحدات عميل. الشجرة الفرعية التي تبدأ من `InspirationGenerator.js` أصبحت الآن موسومة كوحدات عميل.

<Diagram name="use_client_module_dependency" height={250} width={545} alt="رسم بياني شجري يمثل العقدة العليا كوحدة 'App.js'. لـ 'App.js' ثلاثة أبناء: 'Copyright.js' و'FancyText.js' و'InspirationGenerator.js'. لـ 'InspirationGenerator.js' ابنان: 'FancyText.js' و'inspirations.js'. العقد تحت 'InspirationGenerator.js' وبما فيها ذات خلفية صفراء تدل على أن هذه الشجرة الفرعية تُصيَّر على العميل بسبب توجيه 'use client' في 'InspirationGenerator.js'.">
يقسم `'use client'` شجرة تبعيات الوحدات لتطبيق مكونات React من جانب الخادم، ويوسم `InspirationGenerator.js` وكل تبعياتها على أنها تُصيَّر على العميل.
</Diagram>

أثناء التصيير، يصيّر الإطار مكوّن الجذر على الخادم ويستمر عبر [شجرة التصيير](/learn/understanding-your-ui-as-a-tree#the-render-tree)، متجنبًا تقييم أي كود مستورد من كود موسوم كعميل.

يُرسل بعدها الجزء من شجرة التصيير الذي صُيّر على الخادم إلى العميل. ثم يكمل العميل — بعد تنزيل كود العميل — تصيير بقية الشجرة.

<Diagram name="use_client_render_tree" height={250} width={500} alt="رسم بياني شجري حيث تمثل كل عقدة مكوّنًا وأبناءه كمكوّنات فرعية. العقدة العليا مسمّاة 'App' ولها ابنان 'InspirationGenerator' و'FancyText'. لـ 'InspirationGenerator' ابنان 'FancyText' و'Copyright'. كل من 'InspirationGenerator' ومكوّنه الفرعي 'FancyText' موسومان للتصيير على العميل.">
شجرة التصيير لتطبيق مكونات React من جانب الخادم. `InspirationGenerator` ومكوّنه الفرعي `FancyText` هما مكوّنان مُصدَّران من كود موسوم بالعميل ويُعتبران مكوّني عميل.
</Diagram>

نقدّم التعريفات التالية:

* **مكوّنات العميل** هي مكوّنات في شجرة التصيير تُصيَّر على العميل.
* **مكوّنات الخادم** هي مكوّنات في شجرة التصيير تُصيَّر على الخادم.

في مثال التطبيق، `App` و`FancyText` و`Copyright` كلها تُصيَّر على الخادم وتُعتبر مكوّنات خادم. وبما أن `InspirationGenerator.js` وتبعياتها غير المباشرة موسومة ككود عميل، فإن المكوّن `InspirationGenerator` ومكوّنه الفرعي `FancyText` هما مكوّنا عميل.

<DeepDive>
#### كيف يكون `FancyText` مكوّن خادم ومكوّن عميل معًا؟ {/*how-is-fancytext-both-a-server-and-a-client-component*/}

بحسب التعريفات أعلاه، المكوّن `FancyText` هو مكوّن خادم ومكوّن عميل في آن واحد؛ كيف يكون ذلك؟

أولًا، لنوضح أن مصطلح «مكوّن» ليس دقيقًا جدًا. إليك طريقتان فقط لفهم «المكوّن»:

1. قد يشير «المكوّن» إلى **تعريف المكوّن**. في أغلب الأحيان يكون دالة.

```js
// This is a definition of a component
function MyComponent() {
  return <p>My Component</p>
}
```

2. وقد يشير «المكوّن» أيضًا إلى **استخدام المكوّن** لتعريفه.
```js
import MyComponent from './MyComponent';

function App() {
  // This is a usage of a component
  return <MyComponent />;
}
```

غالبًا لا تهم هذه الدقة عند شرح المفاهيم، لكنها مهمة هنا.

عندما نتحدث عن مكوّنات الخادم أو العميل، نعني **استخدامات** المكوّن.

* إذا عُرّف المكوّن في وحدة تحتوي على توجيه `'use client'`، أو استُورد واستُدعي داخل مكوّن عميل، فاستخدام المكوّن هو مكوّن عميل.
* وإلا فاستخدام المكوّن هو مكوّن خادم.


<Diagram name="use_client_render_tree" height={150} width={450} alt="رسم بياني شجري حيث تمثل كل عقدة مكوّنًا وأبناءه كمكوّنات فرعية. العقدة العليا مسمّاة 'App' ولها ابنان 'InspirationGenerator' و'FancyText'. لـ 'InspirationGenerator' ابنان 'FancyText' و'Copyright'. كل من 'InspirationGenerator' ومكوّنه الفرعي 'FancyText' موسومان للتصيير على العميل.">شجرة التصيير توضح استخدامات المكوّن.</Diagram>

بالعودة إلى سؤال `FancyText`، نرى أن تعريف المكوّن _لا_ يحتوي على توجيه `'use client'`، وله استخدامان.

استخدام `FancyText` كابن لـ `App` يجعل ذلك الاستخدام مكوّن خادم. عندما يُستورد `FancyText` ويُستدعى تحت `InspirationGenerator`، فذلك الاستخدام لـ `FancyText` هو مكوّن عميل لأن `InspirationGenerator` يحتوي على توجيه `'use client'`.

هذا يعني أن تعريف المكوّن `FancyText` سيُقيَّم على الخادم ويُنزَّل أيضًا إلى العميل لتصيير استخدامه كمكوّن عميل.

</DeepDive>

<DeepDive>

#### لماذا `Copyright` مكوّن خادم؟ {/*why-is-copyright-a-server-component*/}

بما أن `Copyright` يُصيَّر كابن للمكوّن العميل `InspirationGenerator`، قد تتفاجأ بأنه مكوّن خادم.

تذكّر أن `'use client'` يحدّد الحدّ بين كود الخادم والعميل على **شجرة تبعيات الوحدات**، لا على شجرة التصيير.

<Diagram name="use_client_module_dependency" height={200} width={500} alt="رسم بياني شجري يمثل العقدة العليا كوحدة 'App.js'. لـ 'App.js' ثلاثة أبناء: 'Copyright.js' و'FancyText.js' و'InspirationGenerator.js'. لـ 'InspirationGenerator.js' ابنان: 'FancyText.js' و'inspirations.js'. العقد تحت 'InspirationGenerator.js' وبما فيها ذات خلفية صفراء تدل على أن هذه الشجرة الفرعية تُصيَّر على العميل بسبب توجيه 'use client' في 'InspirationGenerator.js'.">
يحدّد `'use client'` الفصل بين كود الخادم والعميل على شجرة تبعيات الوحدات.
</Diagram>

في شجرة تبعيات الوحدات، نرى أن `App.js` يستورد `Copyright` ويستدعيه من وحدة `Copyright.js`. وبما أن `Copyright.js` لا تحتوي على `'use client'`، فاستخدام المكوّن يُصيَّر على الخادم. ويُصيَّر `App` على الخادم لأنه مكوّن الجذر.

يمكن لمكوّنات العميل أن تصيّر مكوّنات خادم لأنك تستطيع تمرير JSX كخصائص. هنا، يستقبل `InspirationGenerator` مكوّن `Copyright` كـ [children](/learn/passing-props-to-a-component#passing-jsx-as-children). مع ذلك، وحدة `InspirationGenerator` لا تستورد وحدة `Copyright` مباشرة ولا تستدعي المكوّن؛ كل ذلك يفعله `App`. في الواقع، يُنفَّذ مكوّن `Copyright` بالكامل قبل أن يبدأ `InspirationGenerator` التصيير.

الخلاصة أن علاقة أب–ابن في التصيير بين المكوّنات لا تضمن نفس بيئة التصيير.

</DeepDive>

### متى تستخدم `'use client'` {/*when-to-use-use-client*/}

باستخدام `'use client'` تتحكم في متى تكون المكوّنات مكوّنات عميل. وبما أن مكوّنات الخادم هي الافتراض، إليك نظرة سريعة على مزايا وقيود مكوّنات الخادم لتحديد متى تحتاج لوسم شيء كتصيير على العميل.

للبساطة نتحدث عن مكوّنات الخادم، لكن المبادئ نفسها تنطبق على كل الكود في تطبيقك الذي يعمل على الخادم.

#### مزايا مكوّنات الخادم {/*advantages*/}
* يمكن لمكوّنات الخادم أن تقلل حجم الكود المُرسل والمنفَّذ على العميل؛ إذ تُجمَّع وتُقيَّم على العميل وحدات العميل فقط.
* تستفيد مكوّنات الخادم من العمل على الخادم. يمكنها الوصول إلى نظام الملفات المحلي وقد تستفيد من زمن استجابة منخفض لجلب البيانات وطلبات الشبكة.

#### قيود مكوّنات الخادم {/*limitations*/}
* لا تدعم مكوّنات الخادم التفاعل بنفس الطريقة لأن معالجات الأحداث يجب أن تُسجَّل وتُفعَّل على العميل.
	* على سبيل المثال، معالجات مثل `onClick` لا يمكن تعريفها إلا في مكوّنات عميل.
* لا تستطيع مكوّنات الخادم استخدام معظم الـ Hooks.
	* عند تصيير مكوّنات الخادم، مخرجاتها تُختصر في قائمة مكوّنات للعميل لتصييرها. مكوّنات الخادم لا تبقى في الذاكرة بعد التصيير ولا يمكن أن يكون لها حالة خاصة.

### الأنواع القابلة للتسلسل التي تُرجعها مكوّنات الخادم {/*serializable-types*/}

كما في أي تطبيق React، تمرّر المكوّنات الأب البيانات إلى الأبناء. وبما أنها تُصيَّر في بيئات مختلفة، يتطلب تمرير البيانات من مكوّن خادم إلى مكوّن عميل اعتبارًا إضافيًا.

يجب أن تكون قيم الخصائص الممرَّرة من مكوّن خادم إلى مكوّن عميل قابلة للتسلسل.

من ضمن الخصائص القابلة للتسلسل:
* القيم البدائية
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)، فقط الرموز المسجَّلة في سجل Symbol العام عبر [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* تكرارات تحتوي قيمًا قابلة للتسلسل
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) و[ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) عادية: المُنشأة بـ [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)، وخصائصها قابلة للتسلسل
* دوال هي [دوال خادم](/reference/rsc/server-functions)
* عناصر مكوّن عميل أو خادم (JSX)
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

ومما يلفت الانتباه أن هذه **غير** مدعومة:
* [Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) غير المُصدَّرة من وحدات موسومة بالعميل أو غير الموسومة بـ [`'use server'`](/reference/rsc/use-server)
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* كائنات هي مثيلات لأي صنف (غير المدمجة المذكورة) أو كائنات ذات [نموذج أولي فارغ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* رموز غير مسجَّلة عالميًا، مثل `Symbol('my new symbol')`


## الاستخدام {/*usage*/}

### البناء مع التفاعل والحالة {/*building-with-interactivity-and-state*/}

<Sandpack>

```js src/App.js
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Count Value: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

</Sandpack>

بما أن `Counter` يحتاج إلى Hook `useState` ومعالجات أحداث لزيادة القيمة أو إنقاصها، يجب أن يكون هذا المكوّن مكوّن عميل وسيحتاج إلى توجيه `'use client'` في أعلى الملف.

في المقابل، مكوّن يصيّر واجهة دون تفاعل لن يحتاج أن يكون مكوّن عميل.

```js
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />
}
```

على سبيل المثال، المكوّن الأب لـ `Counter` وهو `CounterContainer` لا يحتاج `'use client'` لأنه غير تفاعلي ولا يستخدم الحالة. إضافة إلى ذلك، يجب أن يكون `CounterContainer` مكوّن خادم لأنه يقرأ من نظام الملفات المحلي على الخادم، وهو ما يمكن فقط في مكوّن خادم.

هناك أيضًا مكوّنات لا تستخدم ميزات خاصة بالخادم أو العميل ويمكن أن تكون محايدة بشأن مكان التصيير. في مثالنا السابق، `FancyText` من هذا النوع.

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

هنا لا نضيف توجيه `'use client'`، فيُرسل **مخرج** `FancyText` (وليس شفرته المصدرية) إلى المتصفح عند الإشارة إليه من مكوّن خادم. كما بيّن مثال التطبيق السابق، يُستخدم `FancyText` كمكوّن خادم أو عميل حسب مكان الاستيراد والاستخدام.

لكن إذا كان مخرج HTML لـ `FancyText` كبيرًا نسبةً إلى شفرته المصدرية (بما في ذلك التبعيات)، قد يكون أكثر كفاءة إجباره دائمًا على أن يكون مكوّن عميل. المكوّنات التي تُرجع سلسلة مسار SVG طويلة من الحالات التي قد يكون فيها إجبار المكوّن على أن يكون مكوّن عميل أكثر كفاءة.

### استخدام واجهات برمجة العميل {/*using-client-apis*/}

قد يستخدم تطبيق React واجهات خاصة بالعميل، مثل واجهات المتصفح للتخزين، ومعالجة الصوت والفيديو، وأجهزة الجهاز، وغيرها من [الواجهات](https://developer.mozilla.org/en-US/docs/Web/API).

في هذا المثال، يستخدم المكوّن [واجهات DOM](https://developer.mozilla.org/en-US/docs/Glossary/DOM) للتعامل مع عنصر [`canvas`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas). وبما أن هذه الواجهات متاحة فقط في المتصفح، يجب أن يُوسم كمكوّن عميل.

```js
'use client';

import {useRef, useEffect} from 'react';

export default function Circle() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.reset();
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
  });
  return <canvas ref={ref} />;
}
```

### استخدام مكتبات طرف ثالث {/*using-third-party-libraries*/}

غالبًا في تطبيق React ستستفيد من مكتبات طرف ثالث لمعالجة أنماط واجهة أو منطق شائع.

قد تعتمد هذه المكتبات على Hooks للمكوّنات أو واجهات العميل. مكوّنات الطرف الثالث التي تستخدم أيًا مما يلي من واجهات React يجب أن تعمل على العميل:
* [createContext](/reference/react/createContext)
* Hooks [`react`](/reference/react/hooks) و[`react-dom`](/reference/react-dom/hooks)، باستثناء [`use`](/reference/react/use) و[`useId`](/reference/react/useId)
* [forwardRef](/reference/react/forwardRef)
* [memo](/reference/react/memo)
* [startTransition](/reference/react/startTransition)
* إذا استخدمت واجهات العميل، مثل إدراج DOM أو عروض المنصة الأصلية

إذا حُدّثت هذه المكتبات لتكون متوافقة مع مكونات React من جانب الخادم، فستتضمن عادةً علامات `'use client'` الخاصة بها، مما يسمح باستخدامها مباشرة من مكوّنات الخادم. إذا لم تُحدَّث مكتبة، أو إذا احتاج مكوّن إلى خصائص مثل معالجات أحداث لا يمكن تحديدها إلا على العميل، فقد تحتاج إلى إضافة ملف مكوّن عميل خاص بك بين مكوّن الطرف الثالث العميل ومكوّن الخادم حيث تريد استخدامه.

[TODO]: <> (استكشاف الأخطاء — حالات استخدام مطلوبة)
