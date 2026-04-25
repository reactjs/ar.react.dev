---
title: تمرير البيانات عميقًا بالسياق
---

<Intro>

عادةً، تمرّر المعلومات من مكوّن أب إلى ابن عبر الخصائص (props). لكن تمرير الخصائص قد يصير مطوّلًا ومزعجًا إذا اضطررت لتمريرها عبر كثير من المكوّنات الوسيطة، أو إذا احتاجت كثير من المكوّنات في تطبيقك إلى نفس المعلومة. يتيح *السياق* (Context) للمكوّن الأب جعل بعض المعلومات متاحة لأي مكوّن في الشجرة أسفله—مهما عمّ—دون تمريرها صراحةً عبر الخصائص.

</Intro>

<YouWillLearn>

- ما هو «ثقب الخصائص» (prop drilling)
- كيفية استبدال تمرير الخصائص المتكرر بالسياق
- حالات استخدام شائعة للسياق
- بدائل شائعة للسياق

</YouWillLearn>

## مشكلة تمرير الخصائص {/*the-problem-with-passing-props*/}

[تمرير الخصائص](/learn/passing-props-to-a-component) وسيلة ممتازة لتوجيه البيانات صراحةً عبر شجرة واجهتك إلى المكوّنات التي تستخدمها.

لكن تمرير الخصائص قد يصير مطوّلًا ومزعجًا عندما تحتاج لتمرير خاصية عميقًا في الشجرة، أو إذا احتاجت كثير من المكوّنات إلى نفس الخاصية. قد يكون السلف المشترك الأقرب بعيدًا عن المكوّنات التي تحتاج البيانات، و[رفع الحالة](/learn/sharing-state-between-components) إلى ذلك المستوى قد يؤدي إلى ما يُسمّى «ثقب الخصائص».

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="مخطط بشجرة من ثلاثة مكوّنات. الأب يحوي فقاعة تمثّل قيمة مميّزة بالبنفسجي. القيمة تتدفق إلى كل ابنين، كلاهما مميّز بالبنفسجي." >

رفع الحالة

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="مخطط بشجرة عشر عقد، لكل عقدة ابنان على الأكثر. الجذر يحوي فقاعة قيمة بالبنفسجي. القيمة تمر عبر الابنين دون أن يحتفظا بها. الابن الأيسر يمرّرها إلى ابنين بالبنفسجي. الابن الأيمن للجذر يمرّرها إلى أحد ابنيه الأيمن بالبنفسجي، ثم عبر ابن واحد إلى ابنين بالبنفسجي.">

ثقب الخصائص

</Diagram>

</DiagramGroup>

أليس من الرائع لو وُجدت طريقة «لنقل» البيانات إلى المكوّنات التي تحتاجها في الشجرة دون تمرير خصائص؟ مع ميزة السياق في React، وُجدت!

## السياق: بديل عن تمرير الخصائص {/*context-an-alternative-to-passing-props*/}

يتيح السياق لمكوّن أب أن يوفّر بيانات لكامل الشجرة أسفله. لاستخدامات السياق أشكال كثيرة. إليك مثال واحد. انظر إلى مكوّن `Heading` هذا الذي يقبل `level` لحجمه:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Heading level={2}>Heading</Heading>
      <Heading level={3}>Sub-heading</Heading>
      <Heading level={4}>Sub-sub-heading</Heading>
      <Heading level={5}>Sub-sub-sub-heading</Heading>
      <Heading level={6}>Sub-sub-sub-sub-heading</Heading>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

لنقل تريد أن تكون كل العناوين داخل نفس `Section` بنفس الحجم دائمًا:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

حاليًا، تمرّر خاصية `level` إلى كل `<Heading>` على حدة:

```js
<Section>
  <Heading level={3}>About</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>
```

من الجيد لو مررت خاصية `level` إلى `<Section>` بدلًا من ذلك وأزلتها من `<Heading>`. هكذا تفرض أن كل العناوين في القسم نفسه لها نفس الحجم:

```js
<Section level={3}>
  <Heading>About</Heading>
  <Heading>Photos</Heading>
  <Heading>Videos</Heading>
</Section>
```

لكن كيف يعرف مكوّن `<Heading>` مستوى أقرب `<Section>` له؟ **هذا يتطلّب طريقة لابن أن «يطلب» بيانات من أعلى الشجرة.**

لا يمكن فعل ذلك بالخصائص وحدها. هنا يدخل السياق. ستفعل ذلك في ثلاث خطوات:

1. **إنشاء** سياق. (يمكنك تسميته `LevelContext` لأنه لمستوى العنوان.)
2. **استخدام** ذلك السياق من المكوّن الذي يحتاج البيانات. (`Heading` سيستخدم `LevelContext`.)
3. **توفير** ذلك السياق من المكوّن الذي يحدد البيانات. (`Section` سيوفّر `LevelContext`.)

يتيح السياق للأب—حتى لو كان بعيدًا!—أن يوفّر بيانات لكامل الشجرة داخله.

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="مخطط بثلاثة مكوّنات. الأب يحوي فقاعة قيمة بالبرتقالي يمتد تأثيرها إلى الابنين، كلاهما بالبرتقالي." >

استخدام السياق مع أبناء قريبين

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="مخطط بعشر عقد. الجذر يحوي فقاعة بالبرتقالي. القيمة تمتد مباشرة إلى أربع أوراق ومكوّن وسيط واحد بالبرتقالي. بقية الوسطى غير مميّزة.">

استخدام السياق مع أبناء بعيدين

</Diagram>

</DiagramGroup>

### الخطوة 1: إنشاء السياق {/*step-1-create-the-context*/}

أولًا، أنشئ السياق. ستحتاج إلى **تصديره من ملف** لتتمكّن مكوّناتك من استخدامه:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

الوسيط الوحيد لـ`createContext` هو القيمة _الافتراضية_. هنا، `1` تشير إلى أكبر مستوى عنوان، لكن يمكنك تمرير أي نوع من القيم (حتى كائن). ستفهم أهمية القيمة الافتراضية في الخطوة التالية.

### الخطوة 2: استخدام السياق {/*step-2-use-the-context*/}

استورد خطاف `useContext` من React وسياقك:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

حاليًا، يقرأ مكوّن `Heading` قيمة `level` من الخصائص:

```js
export default function Heading({ level, children }) {
  // ...
}
```

بدلًا من ذلك، أزل خاصية `level` واقرأ القيمة من السياق الذي استوردته للتو، `LevelContext`:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` خطاف. مثل `useState` و`useReducer`، يمكنك استدعاء الخطاف فقط مباشرةً داخل مكوّن React (لا داخل حلقات أو شروط). **`useContext` يخبر React أن مكوّن `Heading` يريد قراءة `LevelContext`.**

بما أن `Heading` لم يعد له خاصية `level`، لم تعد بحاجة لتمرير `level` إلى `Heading` في JSX هكذا:

```js
<Section>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
</Section>
```

حدّث JSX بحيث يستقبلها `Section` بدلًا من ذلك:

```jsx
<Section level={4}>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
</Section>
```

للتذكير، هذا الترميز الذي كنت تحاول جعله يعمل:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

لاحظ أن هذا المثال لا يعمل بعد بالكامل! كل العناوين بنفس الحجم لأنك **رغم أنك *تستخدم* السياق، لم *توفّره* بعد.** لا يعرف React من أين يأخذ القيمة!

إن لم توفّر السياق، يستخدم React القيمة الافتراضية التي حددتها في الخطوة السابقة. في هذا المثال، مررت `1` إلى `createContext`، لذا يعيد `useContext(LevelContext)` القيمة `1`، فتصبح كل العناوين `<h1>`. لنصلح ذلك بأن يوفّر كل `Section` سياقه الخاص.

### الخطوة 3: توفير السياق {/*step-3-provide-the-context*/}

مكوّن `Section` حاليًا يصيّر أبناءه:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**لفّهم بموفّر سياق** لتوفير `LevelContext` لهم:

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext value={level}>
        {children}
      </LevelContext>
    </section>
  );
}
```

هذا يخبر React: «إذا طلب أي مكوّن داخل هذا `<Section>` الـ`LevelContext`، أعطه هذه قيمة `level`.» سيستخدم المكوّن قيمة أقرب `<LevelContext>` فوقه في شجرة الواجهة.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext value={level}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

نفس نتيجة الشيفرة الأصلية، لكنك لم تعد بحاجة لتمرير `level` إلى كل `Heading`! بدلًا من ذلك، يستنتج مستوى عنوانه بسؤال أقرب `Section` فوقه:

1. تمرّر خاصية `level` إلى `<Section>`.
2. يلفّ `Section` أبناءه بـ`<LevelContext value={level}>`.
3. يطلب `Heading` أقرب قيمة لـ`LevelContext` فوقه بـ`useContext(LevelContext)`.

## استخدام السياق وتوفيره من نفس المكوّن {/*using-and-providing-context-from-the-same-component*/}

ما زلت تحدد `level` لكل قسم يدويًا:

```js
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

بما أن السياق يتيح قراءة معلومات من مكوّن أعلى، يمكن لكل `Section` أن يقرأ `level` من `Section` الأعلى، ويمرّر `level + 1` للأسفل تلقائيًا. إليك كيفية فعل ذلك:

```js src/Section.js {5,8}
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

بهذا التغيير، لم تعد بحاجة لتمرير `level` *لا* إلى `<Section>` *ولا* إلى `<Heading>`:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

الآن كل من `Heading` و`Section` يقرآن `LevelContext` ليعرفا عمقهما. ويلفّ `Section` أبناءه بـ`LevelContext` ليحدّد أن كل ما بداخله في مستوى «أعمق».

<Note>

يستخدم هذا المثال مستويات العناوين لأنها تبيّن بصريًا كيف يمكن للمكوّنات المتداخلة أن تلغي السياق. لكن السياق مفيد لحالات كثيرة أخرى. يمكنك تمرير أي معلومة يحتاجها الشجرة الفرعية بأكملها: سمة الألوان الحالية، المستخدم المسجّل حاليًا، وغير ذلك.

</Note>

## السياق يمر عبر المكوّنات الوسيطة {/*context-passes-through-intermediate-components*/}

يمكنك إدراج أي عدد من المكوّنات بين المكوّن الذي يوفّر السياق والمكوّن الذي يستخدمه. يشمل ذلك المكوّنات المدمجة مثل `<div>` ومكوّناتك الخاصة.

في هذا المثال، يُصيّر نفس مكوّن `Post` (بحدّ متقطع) على مستويين مختلفين من التداخل. لاحظ أن `<Heading>` بداخله يأخذ مستواه تلقائيًا من أقرب `<Section>`:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post
        title="Hello traveller!"
        body="Read about my adventures."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Recent Posts</Heading>
      <Post
        title="Flavors of Lisbon"
        body="...those pastéis de nata!"
      />
      <Post
        title="Buenos Aires in the rhythm of tango"
        body="I loved it!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

لم تفعل شيئًا خاصًا ليعمل هذا. `Section` يحدد السياق للشجرة بداخله، فيمكنك إدراج `<Heading>` في أي مكان وسيأخذ الحجم الصحيح. جرّب في الصندوق أعلاه!

**السياق يتيح لك كتابة مكوّنات «تتأقلم مع محيطها» وتعرض نفسها بشكل مختلف حسب _أين_ (أي _في أي سياق_) تُصيَّر.**

قد يذكرك عمل السياق بـ[وراثة خصائص CSS.](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) في CSS، يمكنك ضبط `color: blue` لـ`<div>`، فترث أي عقدة DOM بداخلها ذلك اللون مهما عمّت، ما لم تعترضها عقدة أخرى بـ`color: green`. بالمثل، في React الطريقة الوحيدة لتجاوز سياق قادم من الأعلى هي لفّ الأبناء بموفّر سياق بقيمة مختلفة.

في CSS، خصائص مختلفة مثل `color` و`background-color` لا تلغي بعضها. يمكنك ضبط `color` لكل `<div>` على أحمر دون التأثير على `background-color`. بالمثل، **سياقات React مختلفة لا تلغي بعضها.** كل سياق تنشئه بـ`createContext()` منفصل تمامًا عن غيره، ويربط المكوّنات التي تستخدمه وتوفّره بـ*ذلك* السياق تحديدًا. قد يستخدم مكوّن واحد أو يوفّر عدة سياقات دون مشكلة.

## قبل استخدام السياق {/*before-you-use-context*/}

السياق مغرٍ جدًا للاستخدام! لكن هذا يعني أيضًا أن الإفراط فيه سهل. **مجرد أنك تحتاج لتمرير بعض الخصائص عدة مستويات لا يعني أنك يجب أن تضع تلك المعلومات في السياق.**

إليك بعض البدائل التي تفكّر فيها قبل السياق:

1. **ابدأ بـ[تمرير الخصائص.](/learn/passing-props-to-a-component)** إن لم تكن مكوّناتك تافهة، فليس غريبًا تمرير عشرات الخصائص عبر عشرات المكوّنات. قد يبدو ذلك مملًا، لكنه يوضّح أي مكوّن يستخدم أي بيانات! من يصون شيفرتك سيرحب بأنك جعلت تدفق البيانات صريحًا بالخصائص.
2. **استخرج مكوّنات و[مرّر JSX كـ`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) إليها.** إن مررت بيانات عبر طبقات كثيرة من مكوّنات وسيطة لا تستخدمها (بل تمرّرها فقط)، فغالبًا نسيت استخراج مكوّنات في الطريق. مثلًا، قد تمرّر `posts` إلى مكوّنات عرض لا تستخدمها مباشرة مثل `<Layout posts={posts} />`. بدلًا من ذلك، اجعل `Layout` يأخذ `children` وصيّر `<Layout><Posts posts={posts} /></Layout>`. هذا يقلّل الطبقات بين المكوّن الذي يحدد البيانات والذي يحتاجها.

إن لم تنفع إحدى الطريقتين جيدًا معك، فكّر بالسياق.

## حالات استخدام السياق {/*use-cases-for-context*/}

* **السمات (Theming):** إن كان تطبيقك يسمح بتغيير المظهر (مثل الوضع الداكن)، يمكنك وضع موفّر سياق أعلى التطبيق، واستخدام ذلك السياق في المكوّنات التي تحتاج تعديل المظهر.
* **الحساب الحالي:** قد تحتاج كثير من المكوّنات لمعرفة المستخدم المسجّل. وضعه في السياق يسهّل قراءته في أي مكان في الشجرة. بعض التطبيقات تسمح بعدة حسابات في آن (مثل ترك تعليق كمستخدم آخر). حينها قد يكون مناسبًا لف جزء من الواجهة بموفّر متداخل بقيمة حساب مختلفة.
* **التوجيه:** معظم حلول التوجيه تستخدم السياق داخليًا لاحتجاز المسار الحالي. هكذا يعرف كل رابط إن كان نشطًا. إن بنيت موجّهك الخاص، قد تفعل المثل.
* **إدارة الحالة:** مع نموّ التطبيق قد تتراكم حالة كثيرة قرب أعلى التطبيق. قد تريد مكوّنات بعيدة تغييرها. شائع [استخدام مُخفّض مع السياق](/learn/scaling-up-with-reducer-and-context) لإدارة حالة معقّدة وتمريرها لمكوّنات بعيدة دون عناء كبير.
  
السياق لا يقتصر على قيم ثابتة. إن مررت قيمة مختلفة في التصيير التالي، يحدّث React كل المكوّنات التي تقرأه أسفلها! لذلك يُستخدم السياق غالبًا مع الحالة.

بشكل عام، إذا احتاجت مكوّنات بعيدة في أجزاء مختلفة من الشجرة إلى معلومة ما، فذلك مؤشر جيد أن السياق سيساعدك.

<Recap>

* السياق يتيح لمكوّن أن يوفّر معلومة لكامل الشجرة أسفله.
* لتمرير السياق:
  1. أنشئه وصدّره بـ`export const MyContext = createContext(defaultValue)`.
  2. مرّره إلى خطاف `useContext(MyContext)` لقراءته في أي مكوّن ابن، مهما عمّ.
  3. لفّ الأبناء بـ`<MyContext value={...}>` لتوفيره من الأب.
* السياق يمر عبر أي مكوّنات في الوسط.
* السياق يتيح كتابة مكوّنات «تتأقلم مع محيطها».
* قبل استخدام السياق، جرّب تمرير الخصائص أو تمرير JSX كـ`children`.

</Recap>

<Challenges>

#### استبدال ثقب الخصائص بالسياق {/*replace-prop-drilling-with-context*/}

في هذا المثال، تبديل خانة الاختيار يغيّر خاصية `imageSize` الممرّرة إلى كل `<PlaceImage>`. حالة خانة الاختيار في `App` الأعلى، لكن كل `<PlaceImage>` يحتاج الاطلاع عليها.

حاليًا، يمرّر `App` قيمة `imageSize` إلى `List`، التي تمرّرها إلى كل `Place`، التي تمرّرها إلى `PlaceImage`. أزل خاصية `imageSize`، ومرّرها بدلًا من ذلك من `App` مباشرةً إلى `PlaceImage`.

يمكنك إعلان السياق في `Context.js`.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js

```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people."',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

<Solution>

أزل خاصية `imageSize` من كل المكوّنات.

أنشئ وصدّر `ImageSizeContext` من `Context.js`. ثم لفّ `List` بـ`<ImageSizeContext value={imageSize}>` لتمرير القيمة للأسفل، واستخدم `useContext(ImageSizeContext)` لقراءتها في `PlaceImage`:

<Sandpack>

```js src/App.js
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List />
    </ImageSizeContext>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people".',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

لاحظ أن المكوّنات الوسطى لم تعد بحاجة لتمرير `imageSize`.

</Solution>

</Challenges>
