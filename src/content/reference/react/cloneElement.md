---
title: "دالة cloneElement"
---

<Pitfall>

استخدام `cloneElement` نادر وقد يؤدي إلى شيفرة هشة. [راجع البدائل الشائعة.](#alternatives)

</Pitfall>

<Intro>

`cloneElement` تتيح لك إنشاء عنصر React جديد انطلاقًا من عنصر آخر كنقطة بداية.

```js
const clonedElement = cloneElement(element, props, ...children)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `cloneElement(element, props, ...children)` {/*cloneelement*/}

استدعِ `cloneElement` لإنشاء عنصر React مبنيًا على `element` لكن بـ `props` و`children` مختلفة:

```js
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage">
    Hello
  </Row>,
  { isHighlighted: true },
  'Goodbye'
);

console.log(clonedElement); // <Row title="Cabbage" isHighlighted={true}>Goodbye</Row>
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `element`: يجب أن يكون معامل `element` عنصر React صالحًا. مثلًا، قد يكون عقدة JSX مثل `<Something />`، أو ناتج استدعاء [`createElement`](/reference/react/createElement)، أو ناتج استدعاء `cloneElement` آخر.

* `props`: يجب أن يكون معامل `props` إما كائنًا أو `null`. إذا مررت `null`، يحتفظ العنصر المستنسخ بكل `element.props` الأصلية. وإلا، لكل خاصية في كائن `props`، يكون للعنصر المُرجَع «تفضيل» القيمة من `props` على القيمة من `element.props`. تُملأ بقية الخصائص من `element.props` الأصلية. إذا مررت `props.key` أو `props.ref`، يستبدلان الأصليين.

* **اختياري** `...children`: صفر أو أكثر من العقد الفرعية. يمكن أن تكون أي عقد React، بما فيها عناصر React وسلاسل وأرقامًا و[بوابات](/reference/react-dom/createPortal) وعقدًا فارغة (`null` و`undefined` و`true` و`false`) ومصفوفات من عقد React. إذا لم تمرّر أي معاملات `...children`، تُحفظ `element.props.children` الأصلية.

#### القيمة المُرجَعة {/*returns*/}

`cloneElement` تُرجع كائن عنصر React ببعض الخصائص:

* `type`: نفس `element.type`.
* `props`: ناتج دمج سطحي لـ `element.props` مع `props` التي مررتها للتجاوز.
* `ref`: `element.ref` الأصلي، ما لم يُستبدل بـ `props.ref`.
* `key`: `element.key` الأصلي، ما لم يُستبدل بـ `props.key`.

عادةً تُرجع العنصر من مكوّنك أو تجعله فرعًا لعنصر آخر. رغم أنه يمكنك قراءة خصائص العنصر، من الأفضل اعتبار كل عنصر معتمًا بعد إنشائه والاكتفاء بعرضه.

#### ملاحظات {/*caveats*/}

* استنساخ عنصر **لا يعدّل العنصر الأصلي.**

* يجب أن **تمرّر الأبناء كمعاملات متعددة لـ `cloneElement` فقط إذا كانت كلها معروفة ثابتًا،** مثل `cloneElement(element, null, child1, child2, child3)`. إذا كانت الأبناء ديناميكية، مرر المصفوفة كاملة كالمعامل الثالث: `cloneElement(element, null, listItems)`. يضمن ذلك أن React [تحذّرك من `key` الناقصة](/learn/rendering-lists#keeping-list-items-in-order-with-key) لأي قوائم ديناميكية. للقوائم الثابتة هذا غير لازم لأنها لا تُعاد ترتيبها.

* `cloneElement` يصعّب تتبّع تدفق البيانات، لذا **جرّب [البدائل](#alternatives) بدلًا منها.**

---

## الاستخدام {/*usage*/}

### تجاوز خصائص عنصر {/*overriding-props-of-an-element*/}

لتجاوز خصائص <CodeStep step={1}>عنصر React</CodeStep> ما، مرره إلى `cloneElement` مع <CodeStep step={2}>الخصائص التي تريد تجاوزها</CodeStep>:

```js [[1, 5, "<Row title=\\"Cabbage\\" />"], [2, 6, "{ isHighlighted: true }"], [3, 4, "clonedElement"]]
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage" />,
  { isHighlighted: true }
);
```

هنا، <CodeStep step={3}>العنصر المستنسخ</CodeStep> الناتج سيكون `<Row title="Cabbage" isHighlighted={true} />`.

**لنمشِ خطوة بخطوة في مثال لنرى متى يكون مفيدًا.**

تخيّل مكوّن `List` يعرض [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) كقائمة صفوف قابلة للاختيار مع زر «Next» يغيّر الصف المحدد. يحتاج `List` إلى عرض `Row` المحدد بشكل مختلف، فيستنسخ كل فرع `<Row>` تلقاه ويضيف خاصية إضافية `isHighlighted: true` أو `isHighlighted: false`:

```js {6-8}
export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
```

لنفترض أن JSX الأصلي الذي تتلقاه `List` يبدو هكذا:

```js {2-4}
<List>
  <Row title="Cabbage" />
  <Row title="Garlic" />
  <Row title="Apple" />
</List>
```

باستنساخ أبنائها، يمكن لـ `List` تمرير معلومات إضافية إلى كل `Row` داخلها. النتيجة تبدو هكذا:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

لاحظ كيف يحدّث ضغط «Next» حالة `List` ويبرز صفًا مختلفًا:

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List>
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title} 
        />
      )}
    </List>
  );
}
```

```js src/List.js active
import { Children, cloneElement, useState } from 'react';

export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % Children.count(children)
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

باختصار، استنسخت `List` عناصر `<Row />` التي تلقتها وأضافت إليها خاصية إضافية.

<Pitfall>

استنساخ الأبناء يصعّب معرفة كيف تتدفق البيانات في تطبيقك. جرّب أحد [البدائل.](#alternatives)

</Pitfall>

---

## البدائل {/*alternatives*/}

### تمرير البيانات بخاصية عرض (render prop) {/*passing-data-with-a-render-prop*/}

بدل `cloneElement`، فكّر في قبول *خاصية عرض* مثل `renderItem`. هنا، `List` تتلقى `renderItem` كخاصية. تستدعي `List` الدالة `renderItem` لكل عنصر وتمرّر `isHighlighted` كمعامل:

```js {1,7}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
```

تُسمى خاصية `renderItem` «خاصية عرض» لأنها تحدد كيفية عرض شيء ما. مثلًا، يمكنك تمرير تنفيذ `renderItem` يعرض `<Row>` بالقيمة `isHighlighted` المعطاة:

```js {3,7}
<List
  items={products}
  renderItem={(product, isHighlighted) =>
    <Row
      key={product.id}
      title={product.title}
      isHighlighted={isHighlighted}
    />
  }
/>
```

النتيجة النهائية مثل `cloneElement`:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

لكن يمكنك تتبّع مصدر قيمة `isHighlighted` بوضوح.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product, isHighlighted) =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={isHighlighted}
        />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

يُفضَّل هذا النمط على `cloneElement` لأنه أوضح.

---

### تمرير البيانات عبر السياق {/*passing-data-through-context*/}

بديل آخر لـ `cloneElement` هو [تمرير البيانات عبر السياق.](/learn/passing-data-deeply-with-context)


مثلًا، يمكنك استدعاء [`createContext`](/reference/react/createContext) لتعريف `HighlightContext`:

```js
export const HighlightContext = createContext(false);
```

يمكن لمكوّن `List` أن يلفّ كل عنصر تعرضه داخل موفّر `HighlightContext`:

```js {8,10}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext key={item.id} value={isHighlighted}>
            {renderItem(item)}
          </HighlightContext>
        );
      })}
```

بهذا النهج، لا يحتاج `Row` إلى خاصية `isHighlighted` أصلًا. بدلًا من ذلك، يقرأ السياق:

```js src/Row.js {2}
export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  // ...
```

فيستطيع المكوّن الندّ أن لا يعلم أو يقلق بشأن تمرير `isHighlighted` إلى `<Row>`:

```js {4}
<List
  items={products}
  renderItem={product =>
    <Row title={product.title} />
  }
/>
```

بدلًا من ذلك، تنسّق `List` و`Row` منطق الإبراز عبر السياق.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product) =>
        <Row title={product.title} />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext
            key={item.id}
            value={isHighlighted}
          >
            {renderItem(item)}
          </HighlightContext>
        );
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
import { useContext } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/HighlightContext.js
import { createContext } from 'react';

export const HighlightContext = createContext(false);
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

[اطلع على المزيد حول تمرير البيانات عبر السياق.](/reference/react/useContext#passing-data-deeply-into-the-tree)

---

### استخراج المنطق إلى Hook مخصص {/*extracting-logic-into-a-custom-hook*/}

نهج آخر هو استخراج المنطق «غير المرئي» إلى Hook خاص بك، واستخدام المعلومات التي يعيدها Hook لتحديد ما تعرضه. مثلًا، يمكنك كتابة Hook مخصص `useList` هكذا:

```js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

ثم تستخدمه هكذا:

```js {2,9,13}
export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

تدفق البيانات واضح، لكن الحالة داخل Hook المخصص `useList` الذي يمكنك استخدامه من أي مكوّن:

<Sandpack>

```js
import Row from './Row.js';
import useList from './useList.js';
import { products } from './data.js';

export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

```js src/useList.js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

هذا النهج مفيد خصوصًا إذا أردت إعادة استخدام هذا المنطق بين مكوّنات مختلفة.
