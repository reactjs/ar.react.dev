---
title: تمرير البيانات بعمق باستخدام السياق (Context)
---

<Intro>

عادةً، ستقوم بتمرير المعلومات من المُكوّن الأب (parent component) إلى المُكوّن الابن (child component) عبر الخصائص (props). ولكن، قد يُصبح تمرير الخصائص مُطوّلاً ومُرهقاً إذا اضطررت لتمريرها عبر العديد من المُكوّنات الوسيطة، أو إذا كانت العديد من المُكوّنات في تطبيقك تحتاج إلى نفس المعلومات. يتيح السياق (Context) للمُكوّن الأب جعل بعض المعلومات مُتاحة لأي مُكوّن يقع تحته في شجرة المُكوّنات —بغض النظر عن مدى عُمقه— دون الحاجة لتمريرها صراحةً عبر الخصائص.

</Intro>

<YouWillLearn>

- ما هو "تمرير الخصائص المتكرر" (prop drilling)؟
- كيف تستبدل تمرير الخصائص المتكرر باستخدام السياق (Context)؟
- حالات الاستخدام الشائعة للسياق (Context)
- البدائل الشائعة للسياق (Context)

</YouWillLearn>

## مشكلة تمرير الخصائص {/*the-problem-with-passing-props*/}

يُعد [تمرير الخصائص](/learn/passing-props-to-a-component) طريقة رائعة لتوجيه البيانات صراحةً عبر شجرة واجهة المستخدم (UI tree) إلى المُكوّنات التي تستخدمها.

ولكن، قد يُصبح تمرير الخصائص (props) مُطوّلاً ومُرهقاً عندما تحتاج إلى تمرير خاصية ما بعمق عبر الشجرة، أو إذا كانت العديد من المُكوّنات (Components) تحتاج إلى الخاصية ذاتها. قد يكون السلف المشترك الأقرب (nearest common ancestor) بعيداً جداً عن المُكوّنات التي تحتاج إلى البيانات، ورفع الحالة (state) إلى هذا المستوى العالي قد يؤدي إلى حالة تُعرف باسم "التمرير العميق للخصائص" (prop drilling).

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="رسم توضيحي لشجرة تتكون من ثلاثة مكونات. يحتوي المكون الأب على فقاعة تمثل قيمة مميزة باللون الأرجواني. تتدفق القيمة إلى الأسفل نحو كل من المكونين الابنين، وكلاهما مميز باللون الأرجواني." >

رفع الحالة (Lifting state up)

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="رسم توضيحي لشجرة تتكون من عشر عُقد، كل عقدة لها ابنان أو أقل. تحتوي العقدة الجذرية على فقاعة تمثل قيمة مميزة باللون الأرجواني. تتدفق القيمة إلى الأسفل عبر الابنين، وكل منهما يمرر القيمة ولكنه لا يحتويها. يمرر الابن الأيسر القيمة إلى الأسفل نحو ابنين كلاهما مميز باللون الأرجواني. أما الابن الأيمن للجذر فيمرر القيمة عبر أحد ابنيه - الأيمن منهما، والمميز باللون الأرجواني. ويمرر هذا الابن القيمة عبر ابنه الوحيد، والذي يمررها بدوره إلى كلا ابنيه، وكلاهما مميز باللون الأرجواني.">

التمرير العميق للخصائص (Prop drilling)

</Diagram>

</DiagramGroup>

ألن يكون رائعاً لو كانت هناك طريقة لـ "نقل" (teleport) البيانات إلى المُكوّنات التي تحتاجها في الشجرة دون تمرير الخصائص (props)؟ مع ميزة السياق (Context) في React، هذا ممكن!

## السياق: بديل لتمرير الخصائص {/*context-an-alternative-to-passing-props*/}

يُتيح السياق (Context) للمُكوّن الأب توفير البيانات للشجرة بأكملها التي تقع أسفل منه. هناك العديد من الاستخدامات للسياق (Context). إليك أحد الأمثلة. تأمل مُكوّن الترويسة (Heading) هذا، والذي يقبل خاصية المستوى `level` لتحديد حجمه:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>العنوان الرئيسي</Heading>
      <Heading level={2}>الترويسة</Heading>
      <Heading level={3}>ترويسة فرعية</Heading>
      <Heading level={4}>ترويسة فرعية ثانية</Heading>
      <Heading level={5}>ترويسة فرعية ثالثة</Heading>
      <Heading level={6}>ترويسة فرعية رابعة</Heading>
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
      throw Error('مستوى غير معروف: ' + level);
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

لنفترض أن لديك عدة ترويسات داخل القسم `Section` نفسه، وتريد أن تكون جميعها بنفس الحجم دائماً:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>العنوان الرئيسي</Heading>
      <Section>
        <Heading level={2}>الترويسة</Heading>
        <Heading level={2}>الترويسة</Heading>
        <Heading level={2}>الترويسة</Heading>
        <Section>
          <Heading level={3}>ترويسة فرعية</Heading>
          <Heading level={3}>ترويسة فرعية</Heading>
          <Heading level={3}>ترويسة فرعية</Heading>
          <Section>
            <Heading level={4}>ترويسة فرعية ثانية</Heading>
            <Heading level={4}>ترويسة فرعية ثانية</Heading>
            <Heading level={4}>ترويسة فرعية ثانية</Heading>
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
      throw Error('مستوى غير معروف: ' + level);
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

حالياً، تقوم بتمرير الخاصية `level` إلى كل `<Heading>` على حدة:

```js
<Section>
  <Heading level={3}>حول</Heading>
  <Heading level={3}>الصور</Heading>
  <Heading level={3}>الفيديوهات</Heading>
</Section>

```

سيكون من الرائع لو كان بإمكانك تمرير الخاصية `level` إلى المُكوّن `<Section>` بدلاً من ذلك وإزالتها من `<Heading>`. بهذه الطريقة، يمكنك ضمان أن جميع الترويسات في القسم نفسه لها الحجم ذاته:

```js
<Section level={3}>
  <Heading>حول</Heading>
  <Heading>الصور</Heading>
  <Heading>الفيديوهات</Heading>
</Section>

```

ولكن كيف يمكن للمُكوّن `<Heading>` معرفة المستوى الخاص بأقرب `<Section>` إليه؟ **سيتطلب ذلك وجود طريقة ما للمُكوّن الابن لـ "طلب" البيانات من مكان أعلى منه في الشجرة.**

لا يمكنك القيام بذلك باستخدام الخصائص (props) وحدها. هنا يأتي دور السياق (Context). ستقوم بذلك في ثلاث خطوات:

1. **إنشاء** سياق (Context). (يمكنك تسميته `LevelContext`، بما أنه خاص بمستوى الترويسة.)
2. **استخدام** ذلك السياق (Context) من المُكوّن الذي يحتاج إلى البيانات. (سيستخدم `Heading` السياق `LevelContext`.)
3. **توفير** ذلك السياق (Context) من المُكوّن الذي يحدد البيانات. (سيوفر `Section` السياق `LevelContext`.)

يُتيح السياق (Context) للمُكوّن الأب (Parent component) —حتى وإن كان بعيداً!— توفير بعض البيانات للشجرة بأكملها الموجودة بداخله.

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="رسم توضيحي لشجرة تتكون من ثلاثة مكونات. يحتوي المكون الأب على فقاعة تمثل قيمة مميزة باللون البرتقالي والتي تسقط للأسفل نحو الابنين، وكل منهما مميز باللون البرتقالي." >

استخدام السياق (Context) مع المُكوّنات الأبناء القريبة

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="رسم توضيحي لشجرة تتكون من عشر عقد، كل عقدة لها ابنان أو أقل. تحتوي العقدة الجذرية الأب على فقاعة تمثل قيمة مميزة باللون البرتقالي. تسقط القيمة للأسفل مباشرة إلى أربع أوراق ومكون وسيط واحد في الشجرة، وجميعها مميزة باللون البرتقالي. لا توجد أي من المكونات الوسيطة الأخرى مميزة.">

استخدام السياق (Context) مع المُكوّنات الأبناء البعيدة

</Diagram>

</DiagramGroup>

### الخطوة 1: إنشاء السياق {/*step-1-create-the-context*/}

أولاً، تحتاج إلى إنشاء السياق (Context). ستحتاج إلى **تصديره من ملف** (export it from a file) حتى تتمكن مُكوّناتك (Components) من استخدامه:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>العنوان الرئيسي</Heading>
      <Section>
        <Heading level={2}>الترويسة</Heading>
        <Heading level={2}>الترويسة</Heading>
        <Heading level={2}>الترويسة</Heading>
        <Section>
          <Heading level={3}>ترويسة فرعية</Heading>
          <Heading level={3}>ترويسة فرعية</Heading>
          <Heading level={3}>ترويسة فرعية</Heading>
          <Section>
            <Heading level={4}>ترويسة فرعية ثانية</Heading>
            <Heading level={4}>ترويسة فرعية ثانية</Heading>
            <Heading level={4}>ترويسة فرعية ثانية</Heading>
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
      throw Error('مستوى غير معروف: ' + level);
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

الوسيط الوحيد لدالة `createContext` هو القيمة *الافتراضية* (default value). هنا، يشير `1` إلى مستوى الترويسة الأكبر، ولكن يمكنك تمرير أي نوع من القيم (حتى كائن (object)). سترى أهمية القيمة الافتراضية في الخطوة التالية.

### الخطوة 2: استخدام السياق {/*step-2-use-the-context*/}

استورد الخطاف (Hook) `useContext` من React والسياق (Context) الخاص بك:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

```

حالياً، يقرأ المُكوّن (Component) `Heading` الخاصية `level` من الخصائص (props):

```js
export default function Heading({ level, children }) {
  // ...
}

```

بدلاً من ذلك، قم بإزالة الخاصية (prop) `level` واقرأ القيمة من السياق (Context) الذي استوردته للتو، `LevelContext`:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}

```

`useContext` هو خطاف (Hook). تماماً مثل `useState` و `useReducer`، لا يمكنك استدعاء خطاف (Hook) إلا بشكل مباشر داخل مُكوّن (Component) React (وليس داخل الحلقات التكرارية أو الشروط). **يُخبر `useContext` React أن المُكوّن `Heading` يريد قراءة `LevelContext`.**

الآن وبما أن المُكوّن (Component) `Heading` لا يملك الخاصية `level`، فلن تحتاج إلى تمريرها إلى `Heading` داخل JSX الخاص بك بهذا الشكل بعد الآن:

```js
<Section>
  <Heading level={4}>ترويسة فرعية ثانية</Heading>
  <Heading level={4}>ترويسة فرعية ثانية</Heading>
  <Heading level={4}>ترويسة فرعية ثانية</Heading>
</Section>

```

قم بتحديث الـ JSX بحيث يكون المُكوّن (Component) `Section` هو من يتلقاها بدلاً من ذلك:

```jsx
<Section level={4}>
  <Heading>ترويسة فرعية ثانية</Heading>
  <Heading>ترويسة فرعية ثانية</Heading>
  <Heading>ترويسة فرعية ثانية</Heading>
</Section>

```

للتذكير، هذا هو الهيكل الذي كنت تحاول جعله يعمل:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>العنوان الرئيسي</Heading>
      <Section level={2}>
        <Heading>الترويسة</Heading>
        <Heading>الترويسة</Heading>
        <Heading>الترويسة</Heading>
        <Section level={3}>
          <Heading>ترويسة فرعية</Heading>
          <Heading>ترويسة فرعية</Heading>
          <Heading>ترويسة فرعية</Heading>
          <Section level={4}>
            <Heading>ترويسة فرعية ثانية</Heading>
            <Heading>ترويسة فرعية ثانية</Heading>
            <Heading>ترويسة فرعية ثانية</Heading>
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
      throw Error('مستوى غير معروف: ' + level);
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

لاحظ أن هذا المثال لا يعمل تماماً حتى الآن! كل الترويسات لها نفس الحجم لأنك **على الرغم من أنك *تستخدم* السياق (Context)، إلا أنك لم تقم بـ *توفيره* بعد.** لا تعرف React من أين يمكنها الحصول عليه!

إذا لم تقم بتوفير السياق (Context)، ستستخدم React القيمة الافتراضية التي حددتها في الخطوة السابقة. في هذا المثال، قمت بتحديد `1` كوسيط لـ `createContext`، لذا فإن `useContext(LevelContext)` تُرجع `1`، وتجعل جميع الترويسات تبدو كـ `<h1>`. دعنا نصلح هذه المشكلة بجعل كل `Section` توفر سياقها (Context) الخاص بها.

### الخطوة 3: توفير السياق {/*step-3-provide-the-context*/}

يقوم المُكوّن (Component) `Section` حالياً بعرض أبنائه:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}

```

**قم بتغليفهم بمُوفّر سياق** (context provider) لتوفير `LevelContext` لهم:

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

هذا يخبر React: "إذا طلب أي مُكوّن (Component) داخل هذا الـ `<Section>` السياق `LevelContext`، أعطه هذه الخاصية `level`". سيستخدم المُكوّن قيمة أقرب `<LevelContext>` في شجرة واجهة المستخدم (UI tree) الموجودة أعلاه.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>العنوان الرئيسي</Heading>
      <Section level={2}>
        <Heading>الترويسة</Heading>
        <Heading>الترويسة</Heading>
        <Heading>الترويسة</Heading>
        <Section level={3}>
          <Heading>ترويسة فرعية</Heading>
          <Heading>ترويسة فرعية</Heading>
          <Heading>ترويسة فرعية</Heading>
          <Section level={4}>
            <Heading>ترويسة فرعية ثانية</Heading>
            <Heading>ترويسة فرعية ثانية</Heading>
            <Heading>ترويسة فرعية ثانية</Heading>
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
      throw Error('مستوى غير معروف: ' + level);
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

هذه هي النتيجة نفسها كالكود الأصلي، لكنك لم تحتج إلى تمرير الخاصية (prop) `level` إلى كل مُكوّن (Component) `Heading`! بدلاً من ذلك، فإنه "يكتشف" مستوى الترويسة الخاص به عن طريق سؤال أقرب `Section` يقع فوقه:

1. تمرر الخاصية (prop) `level` إلى الـ `<Section>`.
2. يُغلّف `Section` أبناءه (children) داخل `<LevelContext value={level}>`.
3. يطلب المُكوّن `Heading` أقرب قيمة لـ `LevelContext` أعلاه باستخدام `useContext(LevelContext)`.

## استخدام وتوفير السياق من المُكوّن نفسه {/*using-and-providing-context-from-the-same-component*/}

حالياً، لا يزال يتعين عليك تحديد الخاصية `level` لكل قسم يدوياً:

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

بما أن السياق (Context) يتيح لك قراءة المعلومات من مُكوّن (Component) أعلاه، يمكن لكل `Section` قراءة الخاصية `level` من الـ `Section` الذي يعلوه، وتمرير `level + 1` إلى الأسفل تلقائياً. إليك كيف يمكنك القيام بذلك:

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

مع هذا التغيير، أنت لا تحتاج إلى تمرير الخاصية (prop) `level` *لا* إلى الـ `<Section>` *ولا* إلى `<Heading>`:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>العنوان الرئيسي</Heading>
      <Section>
        <Heading>الترويسة</Heading>
        <Heading>الترويسة</Heading>
        <Heading>الترويسة</Heading>
        <Section>
          <Heading>ترويسة فرعية</Heading>
          <Heading>ترويسة فرعية</Heading>
          <Heading>ترويسة فرعية</Heading>
          <Section>
            <Heading>ترويسة فرعية ثانية</Heading>
            <Heading>ترويسة فرعية ثانية</Heading>
            <Heading>ترويسة فرعية ثانية</Heading>
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
      throw Error('يجب أن تكون الترويسة داخل قسم (Section)!');
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
      throw Error('مستوى غير معروف: ' + level);
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

الآن يقرأ كل من `Heading` و `Section` السياق `LevelContext` لمعرفة مدى "عمقهم". ويقوم `Section` بتغليف أبنائه في `LevelContext` لتحديد أن أي شيء بداخله يقع في مستوى "أعمق".

<Note>

يستخدم هذا المثال مستويات الترويسات (headings) لأنها تُظهر بشكل مرئي كيف يمكن للمُكوّنات (Components) المتداخلة تجاوز (override) السياق (Context). لكن السياق (Context) مفيد في العديد من حالات الاستخدام الأخرى أيضاً. يمكنك تمرير أي معلومات تحتاجها الشجرة الفرعية (subtree) بأكملها للأسفل: سمة الألوان الحالية (color theme)، المستخدم المسجل دخوله حالياً، وما إلى ذلك.

</Note>

## يمر السياق عبر المُكوّنات الوسيطة {/*context-passes-through-intermediate-components*/}

يمكنك إدراج أي عدد تريده من المُكوّنات (Components) بين المُكوّن الذي يوفر السياق (Context) والمُكوّن الذي يستخدمه. يشمل هذا كلاً من المُكوّنات (Components) المدمجة مثل `<div>` والمُكوّنات التي قد تبنيها بنفسك.

في هذا المثال، يتم تصيير المُكوّن (Component) نفسه `Post` (والذي يمتلك حدوداً متقطعة) في مستويين متداخلين مختلفين. لاحظ أن الـ `<Heading>` بداخله يحصل على مستواه تلقائياً من أقرب `<Section>`:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>ملفي الشخصي</Heading>
      <Post
        title="مرحباً أيها المسافر!"
        body="اقرأ عن مغامراتي."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>المنشورات</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>أحدث المنشورات</Heading>
      <Post
        title="نكهات لشبونة"
        body="...تلك الفطائر اللذيذة!"
      />
      <Post
        title="بوينس آيرس على إيقاع التانغو"
        body="لقد أحببتها!"
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
      throw Error('يجب أن تكون الترويسة داخل قسم (Section)!');
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
      throw Error('مستوى غير معروف: ' + level);
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

لم تقم بفعل أي شيء خاص لكي يعمل هذا. يُحدد الـ `Section` السياق (Context) للشجرة التي بداخله، لذا يمكنك إدراج `<Heading>` في أي مكان، وسيكون له الحجم الصحيح. جربه في بيئة الاختبار (sandbox) أعلاه!

**يتيح لك السياق (Context) كتابة مُكوّنات (Components) "تتكيف مع محيطها" وتعرض نفسها بشكل مختلف بناءً على *المكان* (أو بعبارة أخرى، *في أي سياق (Context)*) الذي يتم تصييرها فيه.**

قد يُذكرك عمل السياق (Context) بـ [وراثة خصائص CSS (CSS property inheritance).](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) في CSS، يمكنك تحديد `color: blue` لـ `<div>`، وأي عقدة DOM بداخله، بغض النظر عن مدى عمقها، سترث هذا اللون ما لم تتجاوزه عقدة DOM أخرى في المنتصف عبر تحديد `color: green`. وبالمثل، في React، الطريقة الوحيدة لتجاوز سياق (Context) قادم من الأعلى هي تغليف الأبناء (children) في مُوفّر سياق (Context provider) بقيمة مختلفة.

في CSS، الخصائص المختلفة مثل `color` و `background-color` لا تتجاوز بعضها البعض. يمكنك تعيين الخاصية `color` لجميع عناصر `<div>` إلى اللون الأحمر دون التأثير على الخاصية `background-color`. وبالمثل، **لا تتجاوز سياقات React (React contexts) المختلفة بعضها البعض.** كل سياق (Context) تقوم بإنشائه باستخدام `createContext()` يكون منفصلاً تماماً عن السياقات الأخرى، ويربط معاً المُكوّنات (Components) التي تستخدم وتوفر *ذلك السياق بالذات*. يمكن لمُكوّن (Component) واحد أن يستخدم أو يوفر العديد من السياقات المختلفة دون أي مشكلة.

## قبل أن تستخدم السياق {/*before-you-use-context*/}

استخدام السياق (Context) أمر مغرٍ جداً! ومع ذلك، هذا يعني أيضاً أنه من السهل جداً الإفراط في استخدامه. **مجرد أنك تحتاج إلى تمرير بعض الخصائص (props) لعدة مستويات عميقة لا يعني أنه يجب عليك وضع تلك المعلومات في السياق (Context).**

إليك بعض البدائل التي يجب عليك أخذها في الاعتبار قبل استخدام السياق (Context):

1. **ابدأ بـ [تمرير الخصائص (props).**](https://www.google.com/search?q=/learn/passing-props-to-a-component) إذا كانت مُكوّناتك (Components) ليست بسيطة، فليس من غير المألوف تمرير عشرات الخصائص (props) للأسفل عبر عشرات المُكوّنات. قد يبدو الأمر شاقاً، ولكنه يجعل من الواضح جداً أي المُكوّنات تستخدم أي بيانات! سيكون الشخص الذي يصون كودك ممتناً لأنك جعلت تدفق البيانات صريحاً باستخدام الخصائص (props).
2. **استخرج المُكوّنات و[مرر JSX كـ `children](https://www.google.com/search?q=/learn/passing-props-to-a-component%23passing-jsx-as-children)` إليها.** إذا كنت تمرر بعض البيانات عبر العديد من طبقات المُكوّنات (Components) الوسيطة التي لا تستخدم تلك البيانات (وتكتفي بتمريرها للأسفل)، فهذا يعني غالباً أنك نسيت استخراج بعض المُكوّنات على طول الطريق. على سبيل المثال، ربما تمرر خصائص (props) بيانات مثل `posts` إلى مُكوّنات مرئية لا تستخدمها مباشرة، مثل `<Layout posts={posts} />`. بدلاً من ذلك، اجعل `Layout` يقبل `children` كخاصية (prop)، وقم بتصيير `<Layout><Posts posts={posts} /></Layout>`. هذا يقلل من عدد الطبقات بين المُكوّن الذي يحدد البيانات والمُكوّن الذي يحتاجها.

إذا لم تعمل أي من هذه المقاربات بشكل جيد معك، فكر حينها في استخدام السياق (Context).

## حالات استخدام السياق {/*use-cases-for-context*/}

* **السمات (Theming):** إذا كان تطبيقك يتيح للمستخدم تغيير مظهره (مثل الوضع الليلي)، يمكنك وضع مُوفّر سياق (Context provider) في أعلى تطبيقك، واستخدام ذلك السياق (Context) في المُكوّنات (Components) التي تحتاج إلى تعديل مظهرها المرئي.
* **الحساب الحالي (Current account):** قد تحتاج العديد من المُكوّنات (Components) إلى معرفة المستخدم المسجل دخوله حالياً. وضعه في سياق (Context) يجعله مريحاً للقراءة في أي مكان في الشجرة. تتيح لك بعض التطبيقات أيضاً تشغيل حسابات متعددة في نفس الوقت (مثل ترك تعليق كمستخدم مختلف). في تلك الحالات، قد يكون من المريح تغليف جزء من واجهة المستخدم (UI) بمُوفّر سياق (provider) متداخل يحمل قيمة حساب حالي مختلفة.
* **التوجيه (Routing):** تستخدم معظم حلول التوجيه السياق (Context) داخلياً للاحتفاظ بالمسار الحالي (route). هكذا "يعرف" كل رابط ما إذا كان نشطاً أم لا. إذا قمت ببناء الموجّه (router) الخاص بك، فربما ترغب في فعل ذلك أيضاً.
* **إدارة الحالة (Managing state):** مع نمو تطبيقك، قد ينتهي بك الأمر بوجود الكثير من الحالات (state) بالقرب من أعلى تطبيقك. قد ترغب العديد من المُكوّنات (Components) البعيدة بالأسفل في تغييرها. من الشائع [استخدام مُقلّل (reducer) مع سياق (Context)](https://www.google.com/search?q=/learn/scaling-up-with-reducer-and-context) لإدارة الحالات المعقدة وتمريرها للأسفل إلى المُكوّنات البعيدة دون الكثير من العناء.

لا يقتصر السياق (Context) على القيم الثابتة. إذا مررت قيمة مختلفة في التصيير (render) التالي، ستقوم React بتحديث جميع المُكوّنات (Components) التي تقرأه بالأسفل! هذا هو السبب في أن السياق يُستخدم غالباً بالاشتراك مع الحالة (state).

بشكل عام، إذا كانت بعض المعلومات مطلوبة من قبل مُكوّنات (Components) بعيدة في أجزاء مختلفة من الشجرة، فهذا مؤشر جيد على أن السياق (Context) سيساعدك.

<Recap>

* يتيح السياق (Context) لمُكوّن (Component) توفير بعض المعلومات للشجرة بأكملها التي تقع أسفله.
* لتمرير السياق (Context):
1. قم بإنشائه وتصديره باستخدام `export const MyContext = createContext(defaultValue)`.
2. مرره إلى الخطاف (Hook) عبر `useContext(MyContext)` لقراءته في أي مُكوّن (Component) ابن، بغض النظر عن مدى عمقه.
3. غلف الأبناء (children) داخل `<MyContext value={...}>` لتوفيره من مُكوّن أب (parent component).


* يمر السياق (Context) عبر أي مُكوّنات (Components) وسيطة في المنتصف.
* يتيح لك السياق (Context) كتابة مُكوّنات (Components) "تتكيف مع محيطها".
* قبل استخدام السياق (Context)، جرب تمرير الخصائص (props) أو تمرير JSX كـ `children`.

</Recap>

<Challenges>

#### استبدال التمرير العميق للخصائص باستخدام السياق {/*replace-prop-drilling-with-context*/}

في هذا المثال، يؤدي تبديل مربع الاختيار (checkbox) إلى تغيير الخاصية (prop) المسماة `imageSize` والممررة إلى كل مُكوّن `<PlaceImage>`. يتم الاحتفاظ بحالة (state) مربع الاختيار في المُكوّن ذي المستوى الأعلى `App`، ولكن كل `<PlaceImage>` بحاجة إلى أن يكون على دراية بها.

حالياً، يمرر الـ `App` الخاصية `imageSize` إلى `List`، والذي يمررها إلى كل `Place`، والذي بدوره يمررها إلى `PlaceImage`. قم بإزالة الخاصية (prop) `imageSize`، وبدلاً من ذلك مررها من المُكوّن (Component) `App` مباشرة إلى `PlaceImage`.

يمكنك التصريح عن السياق (Context) في الملف `Context.js`.

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
        استخدام صور كبيرة
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
  name: 'مدينة صنعاء القديمة، اليمن',
  description: 'تتميز بطراز معماري فريد ومبانٍ مزينة بـ "القمرية".',
  imageId: 'K9HVAGH' 
}, {
  id: 1, 
  name: 'البتراء (المدينة الوردية)، الأردن',
  description: 'مدينة تاريخية منحوتة في الصخر، وتُعد واحدة من عجائب الدنيا السبع الجديدة.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'أهرامات الجيزة، مصر',
  description: 'من أقدم المعالم التاريخية في العالم، وتُعد شاهداً على عظمة الحضارة الفرعونية.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'العُلا (مدائن صالح)، السعودية',
  description: 'موقع أثري مذهل يتميز بالواجهات الصخرية المنحوتة بدقة وسط الطبيعة الصحراوية.',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'شفشاون (المدينة الزرقاء)، المغرب',
  description: 'مدينة جبلية ساحرة تتميز بمبانيها وشوارعها المطلية بتدرجات اللون الأزرق.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'برج خليفة في دبي، الإمارات',
  description: 'أطول مبنى في العالم، ويُعد تحفة معمارية وهندسية حديثة.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'قلعة بعلبك، لبنان',
  description: 'تضم واحدة من أضخم وأفضل الهياكل الرومانية المحفوظة في العالم.',
  imageId: 'ZfQOOzf'
}];

```

```js src/utils.js
export function getImageUrl(place) {
  return (
    '[https://i.imgur.com/](https://i.imgur.com/)' +
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

قم بإزالة الخاصية (prop) `imageSize` من جميع المُكوّنات (Components).

قم بإنشاء وتصدير `ImageSizeContext` من `Context.js`. ثم قم بتغليف المُكوّن `List` داخل `<ImageSizeContext value={imageSize}>` لتمرير القيمة للأسفل، واستخدم `useContext(ImageSizeContext)` لقراءتها داخل `PlaceImage`:

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
        استخدام صور كبيرة
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
  name: 'مدينة صنعاء القديمة، اليمن',
  description: 'تتميز بطراز معماري فريد ومبانٍ مزينة بـ "القمرية".',
  imageId: 'K9HVAGH' 
}, {
  id: 1, 
  name: 'البتراء (المدينة الوردية)، الأردن',
  description: 'مدينة تاريخية منحوتة في الصخر، وتُعد واحدة من عجائب الدنيا السبع الجديدة.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'أهرامات الجيزة، مصر',
  description: 'من أقدم المعالم التاريخية في العالم، وتُعد شاهداً على عظمة الحضارة الفرعونية.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'العُلا (مدائن صالح)، السعودية',
  description: 'موقع أثري مذهل يتميز بالواجهات الصخرية المنحوتة بدقة وسط الطبيعة الصحراوية.',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'شفشاون (المدينة الزرقاء)، المغرب',
  description: 'مدينة جبلية ساحرة تتميز بمبانيها وشوارعها المطلية بتدرجات اللون الأزرق.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'برج خليفة في دبي، الإمارات',
  description: 'أطول مبنى في العالم، ويُعد تحفة معمارية وهندسية حديثة.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'قلعة بعلبك، لبنان',
  description: 'تضم واحدة من أضخم وأفضل الهياكل الرومانية المحفوظة في العالم.',
  imageId: 'ZfQOOzf'
}];

```

```js src/utils.js
export function getImageUrl(place) {
  return (
    '[https://i.imgur.com/](https://i.imgur.com/)' +
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

لاحظ كيف أن المُكوّنات (Components) في المنتصف لم تعد بحاجة إلى تمرير `imageSize` بعد الآن.

</Solution>

</Challenges>
