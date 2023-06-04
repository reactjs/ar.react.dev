---
title: وصف واجهات المستخدم (UI)
---

<Intro>

تعد React من مكتبات JavaScript المخصَّصة لبناء واجهات المستخدم (UI). يتم بناء واجهات المستخدم من وحدات صغيرة مثل الأزرار والنصوص والصور. تسمح لك React بتجميع هذه العناصر في مكونات (Components) يمكن إعادة استخدامها أو تضمينها داخل بعضها البعض. من مواقع الويب إلى تطبيقات الهاتف الجوال يمكن تقسم كل شئ إلى مكونات. في هذا الفصل، سوف تتعلم كيفية إنشاء وتعديل وعرض مكونات حسب الشروط.

</Intro>

<YouWillLearn isChapter={true}>

* [كيفية كتابة أول مكون React لك](/learn/your-first-component)
* [متى وكيف تنشأ ملفات تحتوى على أكثر من مكون](/learn/importing-and-exporting-components)
* [كيفية إضافة ترميزات (Markup) إلى JavaScript باستخدام JSX](/learn/writing-markup-with-jsx)
* [كيفية استخدام الأقواس المجعدة في JSX لاستخدام وظائف JavaScript في مكوناتك (Components)](/learn/javascript-in-jsx-with-curly-braces)
* [كيفية إعداد المكونات باستخدام الخصائص (Props)](/learn/passing-props-to-a-component)
* [(Conditional rendering) كيفية عرض المكونات بشكل مشروط](/learn/conditional-rendering)
* [كيفية عرض أكثر من مكون مرة واحدة](/learn/rendering-lists)
* [كيفية تجنب الثغرات المحيرة عن طريق الحفاظ على المكونات نقية](/learn/keeping-components-pure)

</YouWillLearn>

## أول مكون لك {/*your-first-component*/}

يتم بناء تطبيقات React باستخدام قطع معزولة من واجهات المستخدم تسمى مكونات. المكون في React هو عبارة عن دالة JavaScript التى يمكنك إضافة ترميزات إليها. المكونات يمكن أن تكون صغيرة كزرار أو كبيرة كصفحة كاملة. هنا المكون `Gallery` يقوم بعرض ثلاث مكونات `Profile`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
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

اقرأ **[مكونك الأول](/learn/your-first-component)** لتتعلم كيفية تعريف واستخدام مكونات React.

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
      <h1>Amazing scientists</h1>
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
      alt="Alan L. Hart"
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

## كتابة ترميزات (Markup) باستخدام JSX {/*writing-markup-with-jsx*/}

كل مكون في React هو عبارة عن دالة JavaScript التى يمكن أن تحتوي على بعض الترميزات التي يمكن ل React أن تعرضها على المتصفح (Browser). المكونات في React تستخدم صيغة معدلة تسمى JSX لكى تمثل هذه الترميزات. أن JSX تشبه HTML كثيرا، ولكن شديدة قليلا وتستطيع أن تعرض محتوى ديناميكي.

إذا قمنا بنسخ ترميزات HTML موجودة سابقا داخل مكون React، لن تعمل دائما:

<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

اذا كان لديك ترميزات HTML مثل هذه، يمكنك أن تصلحها باستخدام [محول](https://transform.tools/html-to-jsx):

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve spectrum technology</li>
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

اقرأ **[كتابة ترميزات (Markup) باستخدام JSX](/learn/writing-markup-with-jsx)** لتتعلم كيفية كتابة JSX صحيحة

</LearnMore>

## استخدام JavaScript في JSX باستخدام الأقواس المجعدة {/*javascript-in-jsx-with-curly-braces*/}

تتيح لك JSX أن تكتب ترميزات مشابهة إلى HTML بداخل ملفات JavaScript وأن تعرض محتوى وتبقى المنطق الخاص بمكونات في نفس المكان. في بعض الأحيان، قد ترغب في إضافة بعض المنطق المكتوب باستخدام JavaScript  أو الإشارة إلى خاصية ديناميكية داخل هذا الترميز. في هذا الموقف، يمكنك استخدام الأقواس المجعدة في JSX الخاص بك لفتح نافذة إلى JavaScript:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
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

اقرأ **[استخدام JavaScript في JSX باستخدام الأقواس المجعدة](/learn/javascript-in-jsx-with-curly-braces)** لتتعلم كيف تتمكن من الوصول إلى بينات JavaScript في JSX

</LearnMore>

## تمرير الخصائص (Props) إلى مكون {/*passing-props-to-a-component*/}

المكونات في React تتواصل مع بعضها البعض عن طريق الخصائص (Props). كل مكون في أب يمكن له أن يمرر بعض المعلومات إلى المكونات الأبناء الخاصة به عن طريق إعطائهم خصائص. الخصائص يمكن أن تذكرك بـ"HTML attributes"، ولكن يمكنك أن تمرر أي قيمة JavaScript عن طريقهم، هذا يمكن أن يكون كائن (object) أو مصفوفة (array) أو دالة function أو حتى JSX!

<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
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

اقرأ **[تمرير الخصائص (Props) إلى مكون](/learn/passing-props-to-a-component)** لتتعلم كيف تقوم بتمرير وقراءة الخصائص.

</LearnMore>

## العرض المشروط (Conditional rendering) {/*conditional-rendering*/}

غالبًا ما يحتاج مكوناتك إلى عرض أشياء مختلفة تعتمد على شروط مختلفة. في React، يمكنك عرض JSX بشكل مشروط باستخدام صيغ مشابة إلى JavaScript مثل التعبيرات الشرطية `if` والمعاملات `&&` و `? :`.

في هذا المثال،  معامل `&&` في JavaScript يستخدم لعرض علامة صح بشكل مشروط:

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
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<LearnMore path="/learn/conditional-rendering">

اقرأ **[العرض المشروط (Conditional rendering)](/learn/conditional-rendering)** لتتعلم الطرق المختلفة لعرض المحتوى بشكل شرطي.

</LearnMore>

## عرض القوائم (lists) {/*rendering-lists*/}

غالبًا ما سترغب في عرض عدة مكونات مشابهة من مجموعة البيانات. يمكن استخدام `filter()` و `map()` في JavaScript مع React لتصفية وتحويل مصفوفة البيانات الخاصة بك إلى مصفوفة من المكونات.

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
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
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

اقرأ **[عرض القوائم (lists)](/learn/rendering-lists)** لتتعلم عن  كيفية عرض قوائم من المكونات، وكيفية اختيار مفتاح.

</LearnMore>

## إبقاء المكونات نقية {/*keeping-components-pure*/}

بعض دوال JavaScript *نقية*. الدالة النقية:

* **تهتم بشؤونها فقط.** لا تقم بتغيير أي كائنات (objects) أو متغيرات (variables) كانت موجودة من قبل عند استدعائها.
* **نفس المدخلات، نفس المخرجات.** يجب أن تعيد الدالة النقية دائمًا نفس النتيجة عندما تمرر لها نفس المُدخلات.

بواسطة كتابة مكوناتك بشكل صارم، حيث تكون دوالا نقية فقط، يمكنك تجنب فئة كاملة من الأخطاء الصعبة التفسير والسلوك غير المتوقع مع تطور قاعدة الشفرة (codebase) الخاصّة بك. هنا مثال على مكوّن غير نقي:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
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
  return <h2>Tea cup for guest #{guest}</h2>;
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

اقرأ **[إبقاء المكونات نقية](/learn/keeping-components-pure)** لتتعلم كيفية كتابة المكونات نقية ودوال متنبئة.

</LearnMore>

## ماذا بعد ذلك؟ {/*whats-next*/}

توجه إلى [المكون الأول الخاص بك](/learn/your-first-component) لبدء قراءة هذا الفصل صفحة بصفحة!

أو، إذا كنت بالفعل على دراية بهذه المواضيع، لماذا لا تقرأ عن [إضافة التفاعلية (Interactivity)](/learn/adding-interactivity)?
