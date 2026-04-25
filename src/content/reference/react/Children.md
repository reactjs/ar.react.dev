---
title: "واجهة Children"
---

<Pitfall>

استخدام `Children` نادر وقد يؤدي إلى شيفرة هشة. [راجع البدائل الشائعة.](#alternatives)

</Pitfall>

<Intro>

`Children` تتيح لك معالجة وتحويل JSX الذي تتلقاه كـ [`children` prop.](/learn/passing-props-to-a-component#passing-jsx-as-children)

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);

```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `Children.count(children)` {/*children-count*/}

استدعِ `Children.count(children)` لعدّ الأبناء في بنية `children`.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Total rows: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

[اطلع على المزيد من الأمثلة أدناه.](#counting-children)

#### المعاملات {/*children-count-parameters*/}

* `children`: قيمة [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) التي يتلقاها مكوّنك.

#### القيمة المُرجَعة {/*children-count-returns*/}

عدد العقد داخل هذه `children`.

#### ملاحظات {/*children-count-caveats*/}

- العقد الفارغة (`null` و`undefined` والقيم المنطقية) والسلاسل والأرقام و[عناصر React](/reference/react/createElement) تُعدّ عقدًا منفردة. المصفوفات لا تُعدّ عقدة واحدة، لكن أبناءها يُعدّون. **التجوال لا يتعمق داخل عناصر React:** لا تُعرض، ولا يُجال في أبنائها. [Fragments](/reference/react/Fragment) لا تُجال.

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

استدعِ `Children.forEach(children, fn, thisArg?)` لتشغيل شيفرة لكل ابن في بنية `children`.

```js src/RowList.js active
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[اطلع على المزيد من الأمثلة أدناه.](#running-some-code-for-each-child)

#### المعاملات {/*children-foreach-parameters*/}

* `children`: قيمة [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) التي يتلقاها مكوّنك.
* `fn`: الدالة التي تريد تشغيلها لكل ابن، مشابهة لاستدعاء [دالة `forEach` للمصفوفات](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). تُستدعى بالابن كأول معامل وفهرسه كثانٍ. الفهرس يبدأ من `0` ويزيد في كل استدعاء.
* **اختياري** `thisArg`: [قيمة `this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) التي تُستدعى بها `fn`. إذا حُذفت، تكون `undefined`.

#### القيمة المُرجَعة {/*children-foreach-returns*/}

`Children.forEach` تُرجع `undefined`.

#### ملاحظات {/*children-foreach-caveats*/}

- العقد الفارغة (`null` و`undefined` والقيم المنطقية) والسلاسل والأرقام و[عناصر React](/reference/react/createElement) تُعدّ عقدًا منفردة. المصفوفات لا تُعدّ عقدة واحدة، لكن أبناءها يُعدّون. **التجوال لا يتعمق داخل عناصر React:** لا تُعرض، ولا يُجال في أبنائها. [Fragments](/reference/react/Fragment) لا تُجال.

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

استدعِ `Children.map(children, fn, thisArg?)` لربط أو تحويل كل ابن في بنية `children`.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[اطلع على المزيد من الأمثلة أدناه.](#transforming-children)

#### المعاملات {/*children-map-parameters*/}

* `children`: قيمة [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) التي يتلقاها مكوّنك.
* `fn`: دالة الربط، مشابهة لاستدعاء [دالة `map` للمصفوفات](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map). تُستدعى بالابن كأول معامل وفهرسه كثانٍ. الفهرس يبدأ من `0` ويزيد في كل استدعاء. يجب أن تُرجع عقدة React من هذه الدالة. قد تكون عقدة فارغة (`null` أو `undefined` أو قيمة منطقية) أو سلسلة أو رقمًا أو عنصر React أو مصفوفة من عقد React أخرى.
* **اختياري** `thisArg`: [قيمة `this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) التي تُستدعى بها `fn`. إذا حُذفت، تكون `undefined`.

#### القيمة المُرجَعة {/*children-map-returns*/}

إذا كانت `children` هي `null` أو `undefined`، تُرجع نفس القيمة.

وإلا تُرجع مصفوفة مسطحة من العقد التي أرجعتها من `fn`. تحتوي المصفوفة على كل العقد التي أرجعتها باستثناء `null` و`undefined`.

#### ملاحظات {/*children-map-caveats*/}

- العقد الفارغة (`null` و`undefined` والقيم المنطقية) والسلاسل والأرقام و[عناصر React](/reference/react/createElement) تُعدّ عقدًا منفردة. المصفوفات لا تُعدّ عقدة واحدة، لكن أبناءها يُعدّون. **التجوال لا يتعمق داخل عناصر React:** لا تُعرض، ولا يُجال في أبنائها. [Fragments](/reference/react/Fragment) لا تُجال.

- إذا أرجعت عنصرًا أو مصفوفة عناصر بمفاتيح من `fn`، **تُدمج مفاتيح العناصر المُرجَعة تلقائيًا مع مفتاح العنصر الأصلي المقابل من `children`.** عند إرجاع عدة عناصر من `fn` في مصفوفة، يكفي أن تكون مفاتيحها فريدة محليًا بينها.

---

### `Children.only(children)` {/*children-only*/}


استدعِ `Children.only(children)` للتأكد أن `children` تمثل عنصر React واحدًا.

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### المعاملات {/*children-only-parameters*/}

* `children`: قيمة [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) التي يتلقاها مكوّنك.

#### القيمة المُرجَعة {/*children-only-returns*/}

إذا كانت `children` [عنصرًا صالحًا،](/reference/react/isValidElement) تُرجع ذلك العنصر.

وإلا ترمي خطأ.

#### ملاحظات {/*children-only-caveats*/}

- هذه الدالة **ترمي دائمًا إذا مررت مصفوفة (مثل ناتج `Children.map`) كـ `children`.** بعبارة أخرى، تفرض أن `children` عنصر React واحد، وليس أنها مصفوفة فيها عنصر واحد.

---

### `Children.toArray(children)` {/*children-toarray*/}

استدعِ `Children.toArray(children)` لإنشاء مصفوفة من بنية `children`.

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

#### المعاملات {/*children-toarray-parameters*/}

* `children`: قيمة [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) التي يتلقاها مكوّنك.

#### القيمة المُرجَعة {/*children-toarray-returns*/}

تُرجع مصفوفة مسطحة من العناصر في `children`.

#### ملاحظات {/*children-toarray-caveats*/}

- تُحذف العقد الفارغة (`null` و`undefined` والقيم المنطقية) من المصفوفة المُرجَعة. **تُحسب مفاتيح العناصر المُرجَعة من مفاتيح العناصر الأصلية ومستوى التداخل والموضع.** يضمن ذلك أن تسطيح المصفوفة لا يغيّر السلوك.

---

## الاستخدام {/*usage*/}

### تحويل الأبناء {/*transforming-children*/}

لتحويل JSX الأبناء الذي [يتلقاه مكوّنك كـ `children` prop،](/learn/passing-props-to-a-component#passing-jsx-as-children) استدعِ `Children.map`:

```js {6,10}
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

في المثال أعلاه، `RowList` تلفّ كل ابن تتلقاه داخل حاوية `<div className="Row">`. لنفترض أن المكوّن الأب يمرّر ثلاثة وسوم `<p>` كـ `children` إلى `RowList`:

```js
<RowList>
  <p>This is the first item.</p>
  <p>This is the second item.</p>
  <p>This is the third item.</p>
</RowList>
```

ثم، مع تنفيذ `RowList` أعلاه، يصبح العرض النهائي هكذا:

```js
<div className="RowList">
  <div className="Row">
    <p>This is the first item.</p>
  </div>
  <div className="Row">
    <p>This is the second item.</p>
  </div>
  <div className="Row">
    <p>This is the third item.</p>
  </div>
</div>
```

`Children.map` مشابه [لتحويل المصفوفات بـ `map()`.](/learn/rendering-lists) الفرق أن بنية `children` تُعتبر *معتمة (opaque).* أي أنه حتى لو كانت أحيانًا مصفوفة، لا يجب افتراض أنها مصفوفة أو نوع بيانات معيّن. لذلك استخدم `Children.map` إذا احتجت تحويلها.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<DeepDive>

#### لماذا ليست خاصية children دائمًا مصفوفة؟ {/*why-is-the-children-prop-not-always-an-array*/}

في React، تُعتبر خاصية `children` بنية بيانات *معتمة (opaque).* أي أنك لا تعتمد على شكلها الداخلي. لتحويل الأبناء أو تصفيتهم أو عدّهم، استخدم دوال `Children`.

عمليًا، تُمثَّل `children` داخليًا غالبًا كمصفوفة. لكن إذا كان هناك ابن واحد فقط، لا تنشئ React مصفوفة إضافية لأن ذلك يزيد الذاكرة دون فائدة. ما دمت تستخدم دوال `Children` بدل فحص `children` مباشرة، لن تنكسر شيفرتك حتى لو غيّرت React تنفيذ البنية.

حتى عندما تكون `children` مصفوفة، لـ `Children.map` سلوك خاص مفيد. مثلًا، `Children.map` تدمج [المفاتيح](/learn/rendering-lists#keeping-list-items-in-order-with-key) على العناصر المُرجَعة مع مفاتيح `children` التي مررتها. يضمن ذلك ألا «تفقد» أبناء JSX الأصليين مفاتيحهم حتى عند لفّهم كما في المثال أعلاه.

</DeepDive>

<Pitfall>

بنية `children` **لا تتضمن مخرجات العرض** للمكوّنات التي تمررها كـ JSX. في المثال أدناه، `children` التي تتلقاها `RowList` تحتوي على عنصرين فقط لا ثلاثة:

1. `<p>This is the first item.</p>`
2. `<MoreRows />`

لذلك يُنشأ غلافان صفّان فقط في هذا المثال:

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </>
  );
}
```

```js src/RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

**لا توجد طريقة للحصول على مخرجات العرض لمكوّن داخلي** مثل `<MoreRows />` عند معالجة `children`. لذلك [من الأفضل غالبًا استخدام أحد البدائل.](#alternatives)

</Pitfall>

---

### تشغيل شيفرة لكل ابن {/*running-some-code-for-each-child*/}

استدعِ `Children.forEach` للتكرار على كل ابن في بنية `children`. لا تُرجع قيمة وتشبه [دالة `forEach` للمصفوفات.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) يمكنك استخدامها لتشغيل منطق مخصّص مثل بناء مصفوفة خاصة بك.

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </SeparatorList>
  );
}
```

```js src/SeparatorList.js active
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Remove the last separator
  return result;
}
```

</Sandpack>

<Pitfall>

كما ذُكر سابقًا، لا طريقة للحصول على مخرجات العرض لمكوّن داخلي عند معالجة `children`. لذلك [من الأفضل غالبًا استخدام أحد البدائل.](#alternatives)

</Pitfall>

---

### عدّ الأبناء {/*counting-children*/}

استدعِ `Children.count(children)` لحساب عدد الأبناء.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<Pitfall>

كما ذُكر سابقًا، لا طريقة للحصول على مخرجات العرض لمكوّن داخلي عند معالجة `children`. لذلك [من الأفضل غالبًا استخدام أحد البدائل.](#alternatives)

</Pitfall>

---

### تحويل الأبناء إلى مصفوفة {/*converting-children-to-an-array*/}

استدعِ `Children.toArray(children)` لتحويل بنية `children` إلى مصفوفة JavaScript عادية. يتيح لك ذلك استخدام دوال المصفوفات المدمجة مثل [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) و[`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) و[`reverse`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse) 

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </ReversedList>
  );
}
```

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

</Sandpack>

<Pitfall>

كما ذُكر سابقًا، لا طريقة للحصول على مخرجات العرض لمكوّن داخلي عند معالجة `children`. لذلك [من الأفضل غالبًا استخدام أحد البدائل.](#alternatives)

</Pitfall>

---

## البدائل {/*alternatives*/}

<Note>

هذا القسم يصف بدائل واجهة `Children` (بحرف C كبير) المستوردة هكذا:

```js
import { Children } from 'react';
```

لا تخلطها مع [استخدام خاصية `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) (بحرف c صغير)، وهو أمر جيّد ومشجّع عليه.

</Note>

### كشف عدة مكوّنات {/*exposing-multiple-components*/}

معالجة الأبناء بدوال `Children` غالبًا تؤدي إلى شيفرة هشة. عندما تمرّر أبناءًا إلى مكوّن في JSX، لا تتوقع عادةً أن يعالج المكوّن الأبناء أو يحوّلهم فرديًا.

عندما يمكنك ذلك، حاول تجنّب دوال `Children`. مثلًا، إذا أردت أن يُلفّ كل ابن من `RowList` في `<div className="Row">`، صدّر مكوّن `Row`، ولفّ كل صف يدويًا هكذا:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </RowList>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

بخلاف `Children.map`، هذا النهج لا يلفّ كل ابن تلقائيًا. **لكن له فائدة كبيرة مقارنة بـ [المثال السابق مع `Children.map`](#transforming-children) لأنه يعمل حتى إذا استخرجت مكوّنات أكثر.** مثلًا، ما زال يعمل إذا استخرجت مكوّن `MoreRows` خاصًا بك:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

هذا لا يعمل مع `Children.map` لأنها «ترى» `<MoreRows />` كابن واحد (وصف واحد).

---

### قبول مصفوفة كائنات كخاصية {/*accepting-an-array-of-objects-as-a-prop*/}

يمكنك أيضًا تمرير مصفوفة صراحة كخاصية. مثلًا، `RowList` هذه تقبل مصفوفة `rows` كخاصية:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>This is the first item.</p> },
      { id: 'second', content: <p>This is the second item.</p> },
      { id: 'third', content: <p>This is the third item.</p> }
    ]} />
  );
}
```

```js src/RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

بما أن `rows` مصفوفة JavaScript عادية، يمكن لمكوّن `RowList` استخدام دوال مثل [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) عليها.

هذا النمط مفيد جدًا عندما تريد تمرير معلومات إضافية كبيانات منظمة مع الأبناء. في المثال أدناه، مكوّن `TabSwitcher` يتلقى مصفوفة كائنات كخاصية `tabs`:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'First',
        content: <p>This is the first item.</p>
      },
      {
        id: 'second',
        header: 'Second',
        content: <p>This is the second item.</p>
      },
      {
        id: 'third',
        header: 'Third',
        content: <p>This is the third item.</p>
      }
    ]} />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

</Sandpack>

بخلاف تمرير الأبناء كـ JSX، يتيح هذا النهج ربط بيانات إضافية مثل `header` بكل عنصر. لأنك تعمل مع `tabs` مباشرة، وهي مصفوفة، لا تحتاج دوال `Children`.

---

### استدعاء خاصية عرض (render prop) لتخصيص العرض {/*calling-a-render-prop-to-customize-rendering*/}

بدل إنتاج JSX لكل عنصر، يمكنك تمرير دالة تُرجع JSX واستدعاؤها عند الحاجة. في هذا المثال، مكوّن `App` يمرّر دالة `renderContent` إلى `TabSwitcher`. مكوّن `TabSwitcher` يستدعي `renderContent` للتبويب المحدد فقط:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['first', 'second', 'third']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>This is the {tabId} item.</p>;
      }}
    />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

</Sandpack>

خاصية مثل `renderContent` تُسمى *خاصية عرض (render prop)* لأنها تحدد كيفية عرض جزء من الواجهة. لكن لا شيء خاص بها: هي خاصية عادية تصادف أنها دالة.

خصائص العرض دوال، فيمكنك تمرير معلومات إليها. مثلًا، مكوّن `RowList` هذا يمرّر `id` و`index` كل صف إلى `renderRow`، التي تستخدم `index` لإبراز الصفوف الزوجية:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['first', 'second', 'third']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>This is the {id} item.</p>
          </Row> 
        );
      }}
    />
  );
}
```

```js src/RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ children, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

</Sandpack>

هذا مثال آخر على تعاون المكوّنات الأب والابن دون معالجة الأبناء.

---

## استكشاف الأخطاء {/*troubleshooting*/}

### أمرّر مكوّنًا مخصّصًا لكن دوال `Children` لا تُظهر نتيجة عرضه {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

لنفترض أنك تمرّر ابنين إلى `RowList` هكذا:

```js
<RowList>
  <p>First item</p>
  <MoreRows />
</RowList>
```

إذا نفّذت `Children.count(children)` داخل `RowList`، ستحصل على `2`. حتى لو عرض `MoreRows` عشرة عناصر مختلفة، أو أرجع `null`، ما زال `Children.count(children)` يساوي `2`. من منظور `RowList`، هي «ترى» JSX الذي تلقته فقط. لا «ترى» داخليات مكوّن `MoreRows`.

هذا القيد يصعّب استخراج مكوّن. لذلك تُفضَّل [البدائل](#alternatives) على استخدام `Children`.
