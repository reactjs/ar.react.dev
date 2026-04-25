---
title: مشاركة الحالة بين المكوّنات
---

<Intro>

أحيانًا تريد أن تتغير حالة مكوّنين معًا دائمًا. لفعل ذلك، أزل الحالة منهما معًا، انقلها إلى أقرب أب مشترك لهما، ثم مرّرها إليهما عبر الخصائص. يُعرف هذا بـ *رفع الحالة،* وهو من أكثر ما ستفعله أثناء كتابة كود React.

</Intro>

<YouWillLearn>

- كيف تشارك الحالة بين المكوّنات برفعها
- ما المقصود بالمكوّنات المُتحكَّم بها وغير المُتحكَّم بها

</YouWillLearn>

## رفع الحالة عمليًا {/*lifting-state-up-by-example*/}

في هذا المثال، المكوّن الأب `Accordion` يرسم `Panel`ين منفصلين:

* `Accordion`
  - `Panel`
  - `Panel`

لكل مكوّن `Panel` حالة منطقية `isActive` تحدد ما إذا كان المحتوى ظاهرًا.

اضغط زر العرض في اللوحين:

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About">
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology">
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

لاحظ أن ضغط زر أحد اللوحين لا يؤثر على الآخر — كلاهما مستقل.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="مخطط يبيّن شجرة من ثلاثة مكوّنات: أب مسمى Accordion وطفلان مسميان Panel. كلاهما يحتويان isActive بقيمة false.">

في البداية، حالة `isActive` لكل `Panel` هي `false`، فيظهران مطويّين

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="نفس المخطط السابق مع إبراز isActive للوح Panel الأول بعد نقرة وتصبح true. اللوح الثاني ما زال false." >

النقر على زر أي `Panel` يحدّث حالة `isActive` لذلك `Panel` فقط

</Diagram>

</DiagramGroup>

**لكن لنقل إن أردت أن يبقى لوح واحد مفتوحًا في أي لحظة.** في هذا التصميم، فتح اللوح الثاني يجب أن يطوي الأول. كيف تفعل ذلك؟

لتنسيق اللوحين، تحتاج إلى «رفع حالتهما» إلى مكوّن أب في ثلاث خطوات:

1. **إزالة** الحالة من المكوّنات الفرعية.
2. **تمرير** بيانات ثابتة من الأب المشترك.
3. **إضافة** الحالة إلى الأب المشترك وتمريرها مع معالجات الأحداث.

هذا يتيح لمكوّن `Accordion` تنسيق `Panel`ين وفتح واحد فقط في كل مرة.

### الخطوة 1: إزالة الحالة من المكوّنات الفرعية {/*step-1-remove-state-from-the-child-components*/}

ستسلّم تحكم `isActive` للوح `Panel` إلى مكوّنه الأب. يعني أن الأب يمرّر `isActive` إلى `Panel` كخاصية. ابدأ بـ **حذف هذا السطر** من مكوّن `Panel`:

```js
const [isActive, setIsActive] = useState(false);
```

ثم أضف `isActive` إلى قائمة خصائص `Panel`:

```js
function Panel({ title, children, isActive }) {
```

الآن يمكن لمكوّن أب `Panel` أن *يتحكم* في `isActive` [بتمريرها كخاصية.](/learn/passing-props-to-a-component) بالمقابل، لم يعد لمكوّن `Panel` *سيطر* على قيمة `isActive` — الأمر عائد إلى الأب!

### الخطوة 2: تمرير بيانات ثابتة من الأب المشترك {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

لرفع الحالة، حدّد أقرب أب مشترك لـ *كلا* المكوّنين الفرعيين اللذين تريد تنسيقهما:

* `Accordion` *(أقرب أب مشترك)*
  - `Panel`
  - `Panel`

في هذا المثال، هو مكوّن `Accordion`. بما أنه فوق اللوحين ويستطيع التحكم بخصائصهما، يصبح «مصدر الحقيقة» لأي لوح نشط حاليًا. اجعل `Accordion` يمرّر قيمة ثابتة لـ `isActive` (مثلًا `true`) إلى اللوحين:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About" isActive={true}>
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology" isActive={true}>
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

جرّب تعديل قيم `isActive` الثابتة في `Accordion` ولاحظ النتيجة على الشاشة.

### الخطوة 3: إضافة الحالة إلى الأب المشترك {/*step-3-add-state-to-the-common-parent*/}

رفع الحالة غالبًا يغيّر طبيعة ما تخزّنه كحالة.

هنا، يجب أن يكون لوح واحد نشطًا في كل مرة. يعني أن الأب المشترك `Accordion` يحتاج تتبع *أي* لوح هو النشط. بدل قيمة `boolean`، يمكن استخدام رقم كفهرس `Panel` النشط لمتغير الحالة:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

عندما `activeIndex` تساوي `0`، اللوح الأول نشط، وعندما `1`، الثاني.

النقر على زر «Show» في أي `Panel` يجب أن يغيّر الفهرس النشط في `Accordion`. لا يستطيع `Panel` تعيين حالة `activeIndex` مباشرة لأنها معرّفة داخل `Accordion`. يحتاج `Accordion` إلى *السماح صراحةً* لمكوّن `Panel` بتغيير حالته [بتمرير معالج حدث كخاصية](/learn/responding-to-events#passing-event-handlers-as-props):

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

سيستخدم `<button>` داخل `Panel` الآن الخاصية `onShow` كمعالج النقر:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

هذا يكمل رفع الحالة! نقل الحالة إلى الأب المشترك مكّن من تنسيق اللوحين. استخدام الفهرس النشط بدل علمي «ظهور» يضمن لوحًا واحدًا نشطًا في كل مرة. وتمرير معالج الحدث إلى الطفل سمح للطفل بتغيير حالة الأب.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="مخطط: أب Accordion فيه activeIndex صفر، فيُمرَّر isActive true للوح الأول وfalse للثاني." >

في البداية، `activeIndex` في `Accordion` هي `0`، فيستقبل `Panel` الأول `isActive = true`

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="نفس المخطط مع إبراز activeIndex في Accordion بعد نقرة وتصبح 1. التدفق إلى Panelين يُبرَز، isActive للأول false وللثاني true." >

عندما تتغير حالة `activeIndex` في `Accordion` إلى `1`، يستقبل `Panel` الثاني `isActive = true` بدلًا من ذلك

</Diagram>

</DiagramGroup>

<DeepDive>

#### مكوّنات مُتحكَّم بها وغير مُتحكَّم بها {/*controlled-and-uncontrolled-components*/}

شائع تسمية المكوّن الذي له حالة محلية «غير مُتحكَّم به». مثلًا، `Panel` الأصلي بمتغير `isActive` غير مُتحكَّم به لأن الأب لا يستطيع التأثير في نشاط اللوح.

بالمقابل، قد تقول إن المكوّن «مُتحكَّم به» عندما تُقاد المعلومات المهمة فيه بالخصائص لا بحالته المحلية. يتيح للأب أن يحدد السلوك بالكامل. `Panel` النهائي بخاصية `isActive` يُتحكَّم به من `Accordion`.

المكوّنات غير المُتحكَّم بها أسهل داخل آبائها لأنها تحتاج إعدادًا أقل. لكنها أقل مرونة عند التنسيق معًا. المكوّنات المُتحكَّم بها مرنة إلى أقصى حد، لكنها تتطلب من الآباء إعدادها بالكامل بالخصائص.

عمليًا، «مُتحكَّم» و«غير مُتحكَّم» ليستا مصطلحين تقنيين صارمين — غالبًا يكون لكل مكوّن مزيج من الحالة المحلية والخصائص. لكنهما مفيدان للحديث عن تصميم المكوّنات وقدراتها.

عند كتابة مكوّن، فكّر أي معلومات يجب أن تكون مُتحكَّم بها (بالخصائص)، وأيها غير مُتحكَّم بها (بالحالة). ويمكنك دائمًا تغيير رأيك وإعادة الهيكلة لاحقًا.

</DeepDive>

## مصدر حقيقة واحد لكل قطعة حالة {/*a-single-source-of-truth-for-each-state*/}

في تطبيق React، لمكوّنات كثيرة حالتها الخاصة. قد «تعيش» بعض الحالة قرب أوراق الشجرة (مكوّنات القاع) مثل الحقول. وحالة أخرى أقرب لأعلى التطبيق. مثلًا، مكتبات التوجيه جانب العميل غالبًا تخزّن المسار الحالي في حالة React وتمرّره بالخصائص!

**لكل قطعة حالة فريدة، تختار المكوّن الذي «يملكها».** يُعرف هذا أيضًا بوجود [«مصدر حقيقة واحد».](https://en.wikipedia.org/wiki/Single_source_of_truth) لا يعني أن كل الحالة في مكان واحد — بل أن لـ *كل* قطعة حالة مكوّنًا *محددًا* يحتفظ بها. بدل تكرار الحالة المشتركة بين المكوّنات، *ارفعها* إلى الأب المشترك، و*مرّرها* إلى الأبناء الذين يحتاجونها.

يتغير تطبيقك أثناء العمل. شائع أن تنقل الحالة لأسفل أو لأعلى وأنت تبحث عن «موطن» كل قطعة. هذا جزء من العملية!

لتلمس ذلك عمليًا مع مكوّنات أكثر، اقرأ [التفكير في React.](/learn/thinking-in-react)

<Recap>

* عندما تريد تنسيق مكوّنين، انقل حالتهما إلى أبيهما المشترك.
* ثم مرّر المعلومات لأسفل بالخصائص من الأب المشترك.
* أخيرًا، مرّر معالجات الأحداث لأسفل حتى يستطيع الأبناء تغيير حالة الأب.
* مفيد أن تعتبر المكوّنات «مُتحكَّم بها» (بخصائص) أو «غير مُتحكَّم بها» (بحالة).

</Recap>

<Challenges>

#### حقول متزامنة {/*synced-inputs*/}

هذان الحقلان مستقلان. اجعلهما متزامنين: تعديل أحدهما يحدّث الآخر بنفس النص، والعكس.

<Hint>

ستحتاج رفع حالتهما إلى المكوّن الأب.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="First input" />
      <Input label="Second input" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

انقل متغير الحالة `text` إلى المكوّن الأب مع المعالج `handleChange`. ثم مرّرهما كخصائص إلى كلا مكوّني `Input`. يبقيان متزامنين.

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="First input"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Second input"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

#### تصفية قائمة {/*filtering-a-list*/}

في هذا المثال، `SearchBar` لها حالة `query` تتحكم في النص. الأب `FilterableList` يعرض `List` من عناصر، لكنه لا يأخذ استعلام البحث في الاعتبار.

استخدم الدالة `filterItems(foods, query)` لتصفية القائمة حسب الاستعلام. للتحقق، تأكد أن كتابة «s» في الحقل تصفّي القائمة إلى «Sushi» و«Shish kebab» و«Dim sum».

لاحظ أن `filterItems` مُنفَّذة ومستوردة مسبقًا فلا تحتاج كتابتها!

<Hint>

ستزيل حالة `query` والمعالج `handleChange` من `SearchBar`، وتنقلهما إلى `FilterableList`. ثم مرّرهما إلى `SearchBar` كخصائص `query` و`onChange`.

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

<Solution>

ارفع حالة `query` إلى `FilterableList`. استدعِ `filterItems(foods, query)` للحصول على القائمة المصفّاة ومرّرها إلى `List`. الآن تغيير الحقل ينعكس في القائمة:

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody> 
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

</Solution>

</Challenges>
