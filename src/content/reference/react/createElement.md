---
title: "دالة createElement"
---

<Intro>

`createElement` تنشئ عنصر React. تُستخدم بديلًا لكتابة [JSX.](/learn/writing-markup-with-jsx)

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

استدعِ `createElement` لإنشاء عنصر React بالـ `type` و`props` و`children` المعطاة.

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `type`: يجب أن يكون `type` نوع مكوّن React صالحًا. مثلًا، قد يكون سلسلة اسم وسم (مثل `'div'` أو `'span'`)، أو مكوّن React (دالة أو صنف أو مكوّن خاص مثل [`Fragment`](/reference/react/Fragment)).

* `props`: يجب أن يكون `props` إما كائنًا أو `null`. إذا مررت `null`، يُعامل ككائن فارغ. ينشئ React عنصرًا بخصائص تطابق `props` التي مررتها. لاحظ أن `ref` و`key` من كائن `props` خاصان ولن يكونا متاحين كـ `element.props.ref` و`element.props.key` على العنصر المُرجَع. سيظهران كـ `element.ref` و`element.key`.

* **اختياري** `...children`: صفر أو أكثر من العقد الفرعية. يمكن أن تكون أي عقد React، بما فيها عناصر React وسلاسل وأرقامًا و[بوابات](/reference/react-dom/createPortal) وعقدًا فارغة (`null` و`undefined` و`true` و`false`) ومصفوفات من عقد React.

#### القيمة المُرجَعة {/*returns*/}

`createElement` تُرجع كائن عنصر React ببعض الخصائص:

* `type`: الـ `type` الذي مررته.
* `props`: الـ `props` التي مررتها باستثناء `ref` و`key`.
* `ref`: الـ `ref` الذي مررته. إن غاب، `null`.
* `key`: الـ `key` الذي مررته بعد تحويله إلى سلسلة. إن غاب، `null`.

عادةً تُرجع العنصر من مكوّنك أو تجعله فرعًا لعنصر آخر. رغم أنه يمكنك قراءة خصائص العنصر، من الأفضل اعتبار كل عنصر معتمًا بعد إنشائه والاكتفاء بعرضه.

#### ملاحظات {/*caveats*/}

* يجب **اعتبار عناصر React وخصائصها [ثابتة (immutable)](https://en.wikipedia.org/wiki/Immutable_object)** وعدم تغيير محتواها بعد الإنشاء. في وضع التطوير، React ستجمد ([freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)) العنصر المُرجَع وخاصية `props` سطحيًا لفرض ذلك.

* عند استخدام JSX، **يجب أن تبدأ الوسم بحرف كبير لعرض مكوّنك المخصص.** بعبارة أخرى، `<Something />` يعادل `createElement(Something)`، لكن `<something />` (صغير) يعادل `createElement('something')` (سلسلة، أي يُعامل كوسم HTML مدمج).

* يجب أن **تمرر الأبناء كمعاملات متعددة لـ `createElement` فقط إذا كانت كلها معروفة ثابتًا،** مثل `createElement('h1', {}, child1, child2, child3)`. إذا كانت الأبناء ديناميكية، مرر المصفوفة كاملة كالمعامل الثالث: `createElement('ul', {}, listItems)`. يضمن ذلك أن React [تحذّرك من `key` الناقصة](/learn/rendering-lists#keeping-list-items-in-order-with-key) لأي قوائم ديناميكية. للقوائم الثابتة هذا غير لازم لأنها لا تُعاد ترتيبها.

---

## الاستخدام {/*usage*/}

### إنشاء عنصر بدون JSX {/*creating-an-element-without-jsx*/}

إذا لم يعجبك [JSX](/learn/writing-markup-with-jsx) أو لا يمكنك استخدامه في مشروعك، استخدم `createElement` بديلًا.

لإنشاء عنصر بدون JSX، استدعِ `createElement` مع <CodeStep step={1}>type</CodeStep> و<CodeStep step={2}>props</CodeStep> و<CodeStep step={3}>children</CodeStep>:

```js [[1, 5, "'h1'"], [2, 6, "{ className: 'greeting' }"], [3, 7, "'Hello ',"], [3, 8, "createElement('i', null, name),"], [3, 9, "'. Welcome!'"]]
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

<CodeStep step={3}>children</CodeStep> اختياري، ويمكنك تمرير أكثر من حاجة (المثال أعلاه له ثلاثة أبناء). يعرض هذا رأس `<h1>` مع تحية. للمقارنة، نفس المثال بـ JSX:

```js [[1, 3, "h1"], [2, 3, "className=\\"greeting\\""], [3, 4, "Hello <i>{name}</i>. Welcome!"], [1, 5, "h1"]]
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

لعرض مكوّن React خاص بك، مرّر دالة مثل `Greeting` كـ <CodeStep step={1}>type</CodeStep> بدل سلسلة مثل `'h1'`:

```js [[1, 2, "Greeting"], [2, 2, "{ name: 'Taylor' }"]]
export default function App() {
  return createElement(Greeting, { name: 'Taylor' });
}
```

بـ JSX يبدو هكذا:

```js [[1, 2, "Greeting"], [2, 2, "name=\\"Taylor\\""]]
export default function App() {
  return <Greeting name="Taylor" />;
}
```

مثال كامل بـ `createElement`:

<Sandpack>

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: 'Taylor' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

ونفس المثال بـ JSX:

<Sandpack>

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}

export default function App() {
  return <Greeting name="Taylor" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

كلتا الأسلوبين جائزتان، فاختر ما يناسب مشروعك. الفائدة الرئيسية لـ JSX مقارنة بـ `createElement` هي سهولة رؤية أي وسم إغلاق يقابل أي وسم فتح.

<DeepDive>

#### ما هو عنصر React بالضبط؟ {/*what-is-a-react-element-exactly*/}

العنصر وصف خفيف لجزء من واجهة المستخدم. مثلًا، `<Greeting name="Taylor" />` و`createElement(Greeting, { name: 'Taylor' })` ينتجان كائنًا مثل:

```js
// Slightly simplified
{
  type: Greeting,
  props: {
    name: 'Taylor'
  },
  key: null,
  ref: null,
}
```

**لاحظ أن إنشاء هذا الكائن لا يعرض مكوّن `Greeting` ولا ينشئ أي عقد DOM.**

عنصر React أشبه بوصف—تعليمات لـ React لاحقًا لعرض مكوّن `Greeting`. بإرجاع هذا الكائن من مكوّن `App`، تخبر React بما يجب فعله بعد ذلك.

إنشاء العناصر رخيص جدًا فلا حاجة لمحاولة تحسينه أو تجنبه.

</DeepDive>
