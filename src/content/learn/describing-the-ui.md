---
title: وصف واجهات المستخدم (UI)
---

<Intro>

تعد React من مكتبات JavaScript المخصَّصة لبناء واجهات المستخدم (UI). يتم بناء واجهات المستخدم من وحدات صغيرة مثل الأزرار والنصوص والصور. تسمح لك React بتجميع هذه العناصر في مكونات (Components) يمكن إعادة استخدامها أو تضمينها داخل بعضها البعض. من مواقع الويب إلى تطبيقات الهاتف الجوال يمكن تقسم كل شئ إلى مكونات. في هذا الفصل، سوف تتعلم كيفية إنشاء وتعديل وتصيير مكونات حسب الشروط.

</Intro>

<YouWillLearn isChapter={true}>

<<<<<<< HEAD
* [كيفية كتابة أول مكون React لك](/learn/your-first-component)
* [متى وكيف تنشأ ملفات تحتوى على أكثر من مكون](/learn/importing-and-exporting-components)
* [كيفية إضافة ترميز (Markup) إلى JavaScript باستخدام JSX](/learn/writing-markup-with-jsx)
* [كيفية استخدام الأقواس المنحنية في JSX لاستخدام وظائف JavaScript في مكوناتك (Components)](/learn/javascript-in-jsx-with-curly-braces)
* [كيفية إعداد المكونات باستخدام الخصائص (Props)](/learn/passing-props-to-a-component)
* [(Conditional rendering) كيفية تصيير المكونات بشكل شرطي](/learn/conditional-rendering)
* [كيفية تصيير أكثر من مكون مرة واحدة](/learn/rendering-lists)
* [كيفية تجنب الثغرات المحيرة عن طريق الحفاظ على المكونات نقية](/learn/keeping-components-pure)
=======
* [How to write your first React component](/learn/your-first-component)
* [When and how to create multi-component files](/learn/importing-and-exporting-components)
* [How to add markup to JavaScript with JSX](/learn/writing-markup-with-jsx)
* [How to use curly braces with JSX to access JavaScript functionality from your components](/learn/javascript-in-jsx-with-curly-braces)
* [How to configure components with props](/learn/passing-props-to-a-component)
* [How to conditionally render components](/learn/conditional-rendering)
* [How to render multiple components at a time](/learn/rendering-lists)
* [How to avoid confusing bugs by keeping components pure](/learn/keeping-components-pure)
* [Why understanding your UI as trees is useful](/learn/understanding-your-ui-as-a-tree)
>>>>>>> 943e3ce4e52be56bcd75b679448847302f557da1

</YouWillLearn>

## مكوّنك الأول {/*your-first-component*/}

يتم بناء تطبيقات React باستخدام قطع معزولة من واجهات المستخدم تسمى مكونات. المكون في React هو عبارة عن دالة JavaScript التى يمكنك إضافة ترميزات إليها. المكونات يمكن أن تكون صغيرة كزرار أو كبيرة كصفحة كاملة. هنا المكون `Gallery` يقوم بتصيير ثلاث مكونات `Profile`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="كاثرين جونسون"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>علماء مذهلون</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/your-first-component">

اقرأ **[مكوّنك الأول](/learn/your-first-component)** لتتعلم كيفية تعريف واستخدام مكونات React.

</LearnMore>

## استيراد وتصدير المكونات {/*importing-and-exporting-components*/}

يمكنك تعريف أكثر من مكون في ملف واحد، ولكن الملفات الكبيرة يمكن أن تصبح صعبة التصفح. لحل هذه المشكلة يمكنك أن تصدر *export* مكون من الملف الخاص به، ثم استخدام *import* لتستخدم هذا المكون في ملف آخر:

<Sandpack>

```js App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>علماء مذهلون</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="آلان إل. هارت"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

اقرأ **[استيراد وتصدير المكونات](/learn/importing-and-exporting-components)** لتتعلم كيفية تقسيم المكونات إلى ملفات خاصة بها.

</LearnMore>

## كتابة ترميز البناء بـ JSX {/*writing-markup-with-jsx*/}

كل مكون في React عبارة عن دالة JavaScript التى يمكن أن تحتوي على بعض الترميزات التي يمكن لـ React أن تُصيرها في المتصفح. المكونات في React تستخدم صيغة معدلة تسمى JSX لكى تمثل هذه الترميزات. JSX تشبه HTML كثيرا، ولكنها صارمة قليلا وتستطيع أن تعرض محتوى ديناميكي.

إذا قمنا بنسخ ترميزات HTML موجودة سابقا داخل مكون React، لن تعمل دائما:

<Sandpack>

```js
export default function TodoList() {
  return (
    // هذا لن يعمل
    <h1>قائمة مهام هيدي لامار</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>اختراع إشارة مرور جديدة
      <li>تدرب على مشهد فيلم
      <li>تحسين تكنولوجيا الطيف
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

إذا كان لديك ترميزات HTML مثل هذه، يمكنك أن تصلحها باستخدام [محوّل](https://transform.tools/html-to-jsx):

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>قائمة مهام هيدي لامار</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="هيدي لامار"
        className="photo"
      />
      <ul>
        <li>اختراع إشارة مرور جديدة</li>
        <li>تدرب على مشهد فيلم</li>
        <li>تحسين تكنولوجيا الطيف</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

اقرأ **[كتابة ترميز البناء بـ JSX](/learn/writing-markup-with-jsx)** لتتعلم كيفية كتابة JSX صحيحة

</LearnMore>

## JavaScript في JSX باستخدام الأقواس المنحنية {/*javascript-in-jsx-with-curly-braces*/}

تتيح لك JSX أن تكتب ترميزات مشابهة إلى HTML بداخل ملفات JavaScript وأن تُصير محتوى وتبقى المنطق الخاص بالمكونات في نفس المكان. في بعض الأحيان، قد ترغب في إضافة بعض المنطق المكتوب باستخدام JavaScript أو الإشارة إلى خاصية ديناميكية داخل هذا الترميز. في هذا الموقف، يمكنك استخدام الأقواس المنحنية في JSX الخاص بك لفتح نافذة إلى JavaScript:

<Sandpack>

```js
const person = {
  name: 'جريجوري زارا',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>قائمة مهام {person.name}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="جريجوري زارا"
      />
      <ul>
        <li>تحسين هاتف الفيديو</li>
        <li>اعداد محاضرات طيران</li>
        <li>العمل على محرك يعمل بالوقود الكحولي</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

اقرأ **[JavaScript في JSX باستخدام الأقواس المنحنية](/learn/javascript-in-jsx-with-curly-braces)** لتتعلم كيفية الوصول إلى بيانات JavaScript في JSX

</LearnMore>

## تمرير الخصائص إلى مكوّن {/*passing-props-to-a-component*/}

المكونات في React تتواصل مع بعضها البعض عن طريق الخصائص (Props). كل مكون أب يمكن له أن يمرر بعض المعلومات إلى المكونات الأبناء عن طريق إعطائهم خصائص. الخصائص يمكن أن تذكرك بـ"خصائص HTML"، ولكن يمكنك أن تمرر أي قيمة JavaScript عن طريقهم، هذا يمكن أن يكون كائن (object) أو مصفوفة (array) أو دالة function أو حتى JSX!

<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'قاتسوكو ساروهاشي',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

```

```js utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

<LearnMore path="/learn/passing-props-to-a-component">

اقرأ **[تمرير الخصائص إلى مكوّن](/learn/passing-props-to-a-component)** لتتعلم كيفية تمرير وقراءة الخصائص.

</LearnMore>

## التصيير الشرطي {/*conditional-rendering*/}

غالبًا ما تحتاج مكوناتك إلى عرض أشياء مختلفة تعتمد على شروط مختلفة. في React، يمكنك تصيير JSX حسب شروط باستخدام صيغ شبيهه بـ JavaScript مثل التعبيرات الشرطية `if` والمعاملات `&&` و `condition ? if true : else`.

في هذا المثال،  معامل `&&` في JavaScript يستخدم لتصيير علامة صح بشكل مشروط:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>قائمة تعبئة سالي رايد</h1>
      <ul>
        <Item
          isPacked={true}
          name="بدلة الفضاء"
        />
        <Item
          isPacked={true}
          name="خوذة مع ورقة ذهبية"
        />
        <Item
          isPacked={false}
          name="صورة لـ تام"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<LearnMore path="/learn/conditional-rendering">

اقرأ **[التصيير الشرطي](/learn/conditional-rendering)** لتتعلم الطرق المختلفة لتصيير المحتوى بشكل شرطي.

</LearnMore>

## تصيير القوائم {/*rendering-lists*/}

غالبًا ما سترغب في عرض عدة مكونات متشابهة من مجموعة البيانات. يمكن استخدام `filter()` و `map()` في JavaScript مع React لتصفية وتحويل مصفوفة البيانات الخاصة بك إلى مصفوفة من المكونات.

يتعين عليك تحديد مفتاح `key` لكل عنصر في المصفوفة. عادةً سترغب في استخدام ID من قاعدة البيانات كمفتاح `key`. يتيح المفتاح `key` إلى React أن تتبع مكان كل عنصر في القائمة حتى لو تغيرت القائمة.

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        معروف بـ {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>علماء</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'كريولا كاثرين جونسون',
  profession: ' عالم رياضيات',
  accomplishment: 'حسابات الرحلات الفضائية',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'ماريو خوسيه مولينا باسكويل هنريكيز',
  profession: 'كيميائي',
  accomplishment: 'اكتشاف ثقب الأوزون في منطقة القطب الشمالي',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'محمد عبد السلام',
  profession: 'فزيائى',
  accomplishment: 'نظرية الكهرومغناطيسية',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'بيرسي لافون جوليان',
  profession: 'كيميائي',
  accomplishment: 'تطوير أدوية الكورتيزون والستيرويدات وحبوب منع الحمل',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'سوبرامانيان شاندراسيخار',
  profession: 'عالم فيزياء فلكية',
  accomplishment: 'حسابات كتلة نجم قذم أبيض',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

اقرأ **[تصيير القوائم](/learn/rendering-lists)** لتتعلم  كيفية تصيير قوائم من المكونات، وكيفية اختيار مفتاح.

</LearnMore>

## الحفاظ على المكونات نقية {/*keeping-components-pure*/}

بعض دوال JavaScript *نقية*. الدالة النقية:

* **تهتم بشؤونها فقط.** لا تغيّر أي كائنات (objects) أو متغيرات (variables) كانت موجودة من قبل عند استدعائها.
* **نفس المدخلات، نفس المخرجات.** يجب أن تعيد الدالة النقية دائمًا نفس النتيجة عندما تمرر لها نفس المُدخلات.

من خلال كتابة مكوناتك بشكل صارم، حيث تكون دوالا نقية فقط، يمكنك تجنب فئة كاملة من الأخطاء صعبة التفسير والسلوك غير المتوقع مع تطور قاعدة الكود (codebase) الخاصّة بك. هنا مثال على مكوّن غير نقي:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // سيء: تعديل متغير موجود مسبقًا
  guest = guest + 1;
  return <h2>كوب شاى لضيف #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

يمكنك جعل هذا المكون نقي عن طريق تمرير الخاصية بدلا عن تعديل متغير موجود بالفعل:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>كوب شاى لضيف #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/keeping-components-pure">

اقرأ **[الحفاظ على المكونات نقية](/learn/keeping-components-pure)** لتتعلم كيفية كتابة مكونات نقية ودوال متنبئة.

</LearnMore>

<<<<<<< HEAD
## ماذا بعد ذلك؟ {/*whats-next*/}
=======
## Your UI as a tree {/*your-ui-as-a-tree*/}

React uses trees to model the relationships between components and modules. 

A React render tree is a representation of the parent and child relationship between components. 

<Diagram name="generic_render_tree" height={250} width={500} alt="A tree graph with five nodes, with each node representing a component. The root node is located at the top the tree graph and is labelled 'Root Component'. It has two arrows extending down to two nodes labelled 'Component A' and 'Component C'. Each of the arrows is labelled with 'renders'. 'Component A' has a single 'renders' arrow to a node labelled 'Component B'. 'Component C' has a single 'renders' arrow to a node labelled 'Component D'.">

An example React render tree.

</Diagram>

Components near the top of the tree, near the root component, are considered top-level components. Components with no child components are leaf components. This categorization of components is useful for understanding data flow and rendering performance.

Modelling the relationship between JavaScript modules is another useful way to understand your app. We refer to it as a module dependency tree. 

<Diagram name="generic_dependency_tree" height={250} width={500} alt="A tree graph with five nodes. Each node represents a JavaScript module. The top-most node is labelled 'RootModule.js'. It has three arrows extending to the nodes: 'ModuleA.js', 'ModuleB.js', and 'ModuleC.js'. Each arrow is labelled as 'imports'. 'ModuleC.js' node has a single 'imports' arrow that points to a node labelled 'ModuleD.js'.">

An example module dependency tree.

</Diagram>

A dependency tree is often used by build tools to bundle all the relevant JavaScript code for the client to download and render. A large bundle size regresses user experience for React apps. Understanding the module dependency tree is helpful to debug such issues. 

<LearnMore path="/learn/understanding-your-ui-as-a-tree">

Read **[Your UI as a Tree](/learn/understanding-your-ui-as-a-tree)** to learn how to create a render and module dependency trees for a React app and how they're useful mental models for improving user experience and performance.

</LearnMore>


## What's next? {/*whats-next*/}
>>>>>>> 943e3ce4e52be56bcd75b679448847302f557da1

توجه إلى [المكون الأول الخاص بك](/learn/your-first-component) لبدء قراءة هذا الفصل صفحة بصفحة!

أو، إذا كنت بالفعل على دراية بهذه المواضيع، لماذا لا تقرأ عن [إضافة التفاعلية](/learn/adding-interactivity)?
