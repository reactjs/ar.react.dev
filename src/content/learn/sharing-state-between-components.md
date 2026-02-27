---
title: مشاركة الحالة بين المكونات
---

<Intro>

أحيانًا، تريد أن تتغير حالة مكونين معًا دائمًا. للقيام بذلك، أزل الحالة من كليهما، وانقلها إلى أقرب مكون أب مشترك، ثم مررها إليهما عبر props. يُعرف هذا باسم *رفع الحالة لأعلى،* وهو أحد أكثر الأشياء شيوعًا التي ستفعلها عند كتابة كود React.

</Intro>

<YouWillLearn>

- كيفية مشاركة الحالة بين المكونات من خلال رفعها لأعلى
- ما هي المكونات المتحكم فيها وغير المتحكم فيها

</YouWillLearn>

## رفع الحالة لأعلى بالمثال {/*lifting-state-up-by-example*/}

في هذا المثال، يصيّر مكون `Accordion` الأب مكونين منفصلين من `Panel`:

* `Accordion`
  - `Panel`
  - `Panel`

كل مكون `Panel` لديه حالة `isActive` من نوع boolean تحدد ما إذا كان محتواه مرئيًا.

اضغط على زر Show لكلا اللوحتين:

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

لاحظ أن الضغط على زر لوحة واحدة لا يؤثر على اللوحة الأخرى -- فهما مستقلتان.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="رسم تخطيطي يوضح شجرة من ثلاثة مكونات، أب واحد باسم Accordion واثنان من الأبناء باسم Panel. كلا مكوني Panel يحتويان على isActive بقيمة false.">

في البداية، حالة `isActive` لكل `Panel` هي `false`، لذا يظهران منطويين

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="نفس الرسم التخطيطي السابق، مع تمييز isActive لمكون Panel الأول الطفل مع الإشارة إلى نقرة مع تعيين قيمة isActive إلى true. مكون Panel الثاني لا يزال يحتوي على القيمة false." >

النقر على زر أي `Panel` سيحدّث حالة `isActive` لذلك `Panel` فقط

</Diagram>

</DiagramGroup>

**لكن الآن دعنا نقول أنك تريد تغييره بحيث يتم توسيع لوحة واحدة فقط في أي وقت.** مع هذا التصميم، يجب أن يؤدي توسيع اللوحة الثانية إلى طي اللوحة الأولى. كيف ستفعل ذلك؟

لتنسيق هاتين اللوحتين، تحتاج إلى "رفع حالتهما لأعلى" إلى مكون أب في ثلاث خطوات:

1. **أزل** الحالة من المكونات الفرعية.
2. **مرر** بيانات مكتوبة بشكل ثابت من الأب المشترك.
3. **أضف** حالة إلى الأب المشترك ومررها مع معالجات الأحداث.

سيسمح هذا لمكون `Accordion` بتنسيق كلا `Panel` وتوسيع واحد فقط في كل مرة.

### الخطوة 1: إزالة الحالة من المكونات الفرعية {/*step-1-remove-state-from-the-child-components*/}

ستمنح التحكم في `isActive` لـ `Panel` إلى مكونه الأب. هذا يعني أن مكون الأب سيمرر `isActive` إلى `Panel` كـ prop بدلاً من ذلك. ابدأ بـ **إزالة هذا السطر** من مكون `Panel`:

```js
const [isActive, setIsActive] = useState(false);
```

وبدلاً من ذلك، أضف `isActive` إلى قائمة props لـ `Panel`:

```js
function Panel({ title, children, isActive }) {
```

الآن يمكن لمكون أب `Panel` *التحكم* في `isActive` من خلال [تمريرها كـ prop.](/learn/passing-props-to-a-component) على العكس، مكون `Panel` الآن *ليس لديه سيطرة* على قيمة `isActive` -- الأمر الآن متروك لمكون الأب!

### الخطوة 2: تمرير بيانات مكتوبة بشكل ثابت من الأب المشترك {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

لرفع الحالة لأعلى، يجب عليك تحديد موقع أقرب مكون أب مشترك لـ *كلا* المكونين الفرعيين اللذين تريد تنسيقهما:

* `Accordion` *(أقرب أب مشترك)*
  - `Panel`
  - `Panel`

في هذا المثال، إنه مكون `Accordion`. نظرًا لأنه فوق كلا اللوحتين ويمكنه التحكم في props الخاصة بهما، فسيصبح "مصدر الحقيقة" للوحة النشطة حاليًا. اجعل مكون `Accordion` يمرر قيمة مكتوبة بشكل ثابت من `isActive` (على سبيل المثال، `true`) إلى كلا اللوحتين:

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

حاول تحرير قيم `isActive` المكتوبة بشكل ثابت في مكون `Accordion` وشاهد النتيجة على الشاشة.

### الخطوة 3: إضافة حالة إلى الأب المشترك {/*step-3-add-state-to-the-common-parent*/}

رفع الحالة لأعلى غالبًا ما يغير طبيعة ما تخزنه كحالة.

في هذه الحالة، يجب أن تكون لوحة واحدة فقط نشطة في كل مرة. هذا يعني أن مكون الأب المشترك `Accordion` يحتاج إلى تتبع *أي* لوحة هي النشطة. بدلاً من قيمة `boolean`، يمكن أن يستخدم رقمًا كمؤشر للـ `Panel` النشطة لمتغير الحالة:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

عندما يكون `activeIndex` هو `0`، تكون اللوحة الأولى نشطة، وعندما يكون `1`، تكون الثانية.

النقر على زر "Show" في أي `Panel` يحتاج إلى تغيير المؤشر النشط في `Accordion`. لا يمكن لـ `Panel` تعيين حالة `activeIndex` مباشرة لأنها معرّفة داخل `Accordion`. يحتاج مكون `Accordion` إلى *السماح بشكل صريح* لمكون `Panel` بتغيير حالته من خلال [تمرير معالج حدث كـ prop](/learn/responding-to-events#passing-event-handlers-as-props):

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

الآن سيستخدم `<button>` داخل `Panel` خاصية `onShow` كمعالج حدث النقر الخاص به:

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

هذا يكمل رفع الحالة لأعلى! نقل الحالة إلى مكون الأب المشترك سمح لك بتنسيق اللوحتين. استخدام المؤشر النشط بدلاً من علامتين "is shown" ضمن أن لوحة واحدة فقط نشطة في أي وقت معين. وتمرير معالج الحدث إلى الطفل سمح للطفل بتغيير حالة الأب.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="رسم تخطيطي يوضح شجرة من ثلاثة مكونات، أب واحد باسم Accordion واثنان من الأبناء باسم Panel. يحتوي Accordion على قيمة activeIndex صفر والتي تتحول إلى قيمة isActive صحيحة ممررة إلى Panel الأول، وقيمة isActive خاطئة ممررة إلى Panel الثاني." >

في البداية، `activeIndex` لـ `Accordion` هو `0`، لذا يتلقى `Panel` الأول `isActive = true`

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="نفس الرسم التخطيطي السابق، مع تمييز قيمة activeIndex لمكون Accordion الأب مع الإشارة إلى نقرة مع تغيير القيمة إلى واحد. التدفق إلى كلا مكوني Panel الطفلين مميز أيضًا، وقيمة isActive الممررة لكل طفل معينة على العكس: false للـ Panel الأول و true للثاني." >

عندما تتغير حالة `activeIndex` لـ `Accordion` إلى `1`، يتلقى `Panel` الثاني `isActive = true` بدلاً من ذلك

</Diagram>

</DiagramGroup>

<DeepDive>

#### المكونات المتحكم فيها وغير المتحكم فيها {/*controlled-and-uncontrolled-components*/}

من الشائع تسمية مكون بحالة محلية "غير متحكم فيه". على سبيل المثال، مكون `Panel` الأصلي مع متغير حالة `isActive` غير متحكم فيه لأن أبوه لا يمكنه التأثير على ما إذا كانت اللوحة نشطة أم لا.

في المقابل، قد تقول أن مكونًا "متحكم فيه" عندما تكون المعلومات المهمة فيه مدفوعة بـ props بدلاً من حالته المحلية الخاصة. هذا يتيح لمكون الأب تحديد سلوكه بالكامل. مكون `Panel` النهائي مع خاصية `isActive` متحكم فيه بواسطة مكون `Accordion`.

المكونات غير المتحكم فيها أسهل في الاستخدام داخل آبائها لأنها تتطلب تكوينًا أقل. لكنها أقل مرونة عندما تريد تنسيقها معًا. المكونات المتحكم فيها مرنة إلى أقصى حد، لكنها تتطلب من مكونات الأب تكوينها بالكامل بـ props.

في الممارسة العملية، "متحكم فيه" و "غير متحكم فيه" ليست مصطلحات تقنية صارمة -- كل مكون عادة ما يكون لديه مزيج من كل من الحالة المحلية و props. ومع ذلك، هذه طريقة مفيدة للحديث عن كيفية تصميم المكونات والقدرات التي تقدمها.

عند كتابة مكون، ضع في اعتبارك أي معلومات فيه يجب أن تكون متحكم فيها (عبر props)، وأي معلومات يجب أن تكون غير متحكم فيها (عبر state). ولكن يمكنك دائمًا تغيير رأيك وإعادة الهيكلة لاحقًا.

</DeepDive>

## مصدر حقيقة واحد لكل حالة {/*a-single-source-of-truth-for-each-state*/}

في تطبيق React، سيكون للعديد من المكونات حالتها الخاصة. قد "تعيش" بعض الحالات بالقرب من المكونات الورقية (المكونات في أسفل الشجرة) مثل المدخلات. قد "تعيش" حالات أخرى بالقرب من أعلى التطبيق. على سبيل المثال، حتى مكتبات routing من جانب client عادة ما يتم تنفيذها من خلال تخزين المسار الحالي في حالة React، وتمريره بـ props!

**لكل جزء فريد من الحالة، ستختار المكون الذي "يمتلكه".** هذا المبدأ معروف أيضًا باسم وجود ["مصدر حقيقة واحد".](https://en.wikipedia.org/wiki/Single_source_of_truth) لا يعني ذلك أن كل الحالات تعيش في مكان واحد -- ولكن لـ _كل_ جزء من الحالة، هناك مكون _محدد_ يحتوي على تلك القطعة من المعلومات. بدلاً من تكرار الحالة المشتركة بين المكونات، *ارفعها لأعلى* إلى الأب المشترك الخاص بها، و *مررها لأسفل* إلى الأطفال الذين يحتاجون إليها.

سيتغير تطبيقك أثناء عملك عليه. من الشائع أن تنقل الحالة لأسفل أو للخلف بينما لا تزال تكتشف أين "تعيش" كل قطعة من الحالة. هذا كله جزء من العملية!

لمعرفة ما يبدو عليه هذا في الممارسة مع المزيد من المكونات، اقرأ [التفكير على طريقة React.](/learn/thinking-in-react)

<Recap>

* عندما تريد تنسيق مكونين، انقل حالتهما إلى أبيهما المشترك.
* ثم مرر المعلومات عبر props من أبيهما المشترك.
* أخيرًا، مرر معالجات الأحداث بحيث يمكن للأطفال تغيير حالة الأب.
* من المفيد اعتبار المكونات "متحكم فيها" (مدفوعة بـ props) أو "غير متحكم فيها" (مدفوعة بـ state).

</Recap>

<Challenges>

#### مدخلات متزامنة {/*synced-inputs*/}

هذان المدخلان مستقلان. اجعلهما متزامنين: تحرير مدخل واحد يجب أن يحدّث المدخل الآخر بنفس النص، والعكس صحيح.

<Hint>

ستحتاج إلى رفع حالتهما لأعلى إلى مكون الأب.

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

Move the `text` state variable into the parent component along with the `handleChange` handler. Then pass them down as props to both of the `Input` components. This will keep them in sync.

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

#### Filtering a list {/*filtering-a-list*/}

In this example, the `SearchBar` has its own `query` state that controls the text input. Its parent `FilterableList` component displays a `List` of items, but it doesn't take the search query into account.

Use the `filterItems(foods, query)` function to filter the list according to the search query. To test your changes, verify that typing "s" into the input filters down the list to "Sushi", "Shish kebab", and "Dim sum".

Note that `filterItems` is already implemented and imported so you don't need to write it yourself!

<Hint>

You will want to remove the `query` state and the `handleChange` handler from the `SearchBar`, and move them to the `FilterableList`. Then pass them down to `SearchBar` as `query` and `onChange` props.

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

ارفع حالة `query` لأعلى إلى مكون `FilterableList`. استدعِ `filterItems(foods, query)` للحصول على القائمة المفلترة ومررها إلى `List`. الآن تغيير مدخل query ينعكس في القائمة:

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
