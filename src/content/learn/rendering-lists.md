---
title: تصيير القوائم
---

<Intro>

غالباً ستريد عرض عدة مكونات متشابهة من مجموعة بيانات. يمكنك أن تستخدم [دوال المصفوفات الخاصة بلغة JavaScript](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#) لتعديل مصفوفة من البيانات. في هذه الصفحة، سوف تستخدم الدالتين الآتيتين: [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) و[`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) مع مكتبة React لتصفّي وتحول مصفوفتك المكونة من مجموعة بيانات إلى مصفوفة من المكونات.

</Intro>

<YouWillLearn>

* كيفية تصيير مكونات من مصوفة باستخدام دالة JavaScript `map()`.
* كيفية تصيير مكونات محددة فقط باستخدام دالة JavaScript `filter()`.
* متى ولماذا تستخدم مفاتيح React (`key` prop)

</YouWillLearn>

## تصيير البيانات من مصفوفات. {/*rendering-data-from-arrays*/}

افترض بأنَّ لديك قائمة بالمحتوى.

```js
<ul>
  <li>كريولا كاثرين جونسون: عالمة رياضيات</li>
  <li>ماريو خوسيه مولينا-باسكيل هنريكيز: كيميائي</li>
  <li>محمد عبد السلام: فيزيائي</li>
  <li>بيرسي لافون جوليان: كيميائي</li>
  <li>سوبراهمانيان تشاندراسيخار: عالم فيزياء الفلك</li>
</ul>
```

الاختلاف الوحيد بين تلك القوائم هو محتوياتها، أو بالأحرى بياناتها. غالباً ستحتاج إظهار نماذج متعددة من المكون نفسه باستخدام بيانات مختلفة عندما تبني الواجهات: ابتداءً من قوائم من التعليقات إلى معارض صور الملفات الشخصية. في هذه الحالات، يمكنك تخزين تلك البيانات في كائنات ومصفوفات JavaScript واستخدام دالات مثل [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) and [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) لتصيير قوائم من البيانات من تلك المصفوفات والكائنات.

هذا مثال صغير حول كيفية توليد قائمة عناصر من مصفوفة:

1. **انقل** البيانات إلى مصفوفة:

```js
const people = [
  'كريولا كاثرين جونسون: عالمة رياضيات',
  'ماريو خوسيه مولينا-باسكيل هنريكيز: كيميائي',
  'محمد عبد السلام: فيزيائي',
  'بيرسي لافون جوليان: كيميائي',
  'سوبراهمانيان تشاندراسيخار: عالم فيزياء الفلك'
];
```

2. استخدم الدالة **Map** على أفراد القائمة `people` وحولها إلى مصفوفة من عناصر JSX، `listItems`:

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. **قم بإرجاع** القائمة `listItems` من مكونك  مغلفة بوسم `<ul>`:

```js
return <ul>{listItems}</ul>;
```

هذه هي النتيجة:

<Sandpack>

```js
const people = [
  'كريولا كاثرين جونسون: عالمة رياضيات',
  'ماريو خوسيه مولينا-باسكيل هنريكيز: كيميائي',
  'محمد عبد السلام: فيزيائي',
  'بيرسي لافون جوليان: كيميائي',
  'سوبراهمانيان تشاندراسيخار: عالم فيزياء الفلك'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

لاحظ أن sandbox في الأعلى يظهر خطأً في console:

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

سوف تتعلم كيف تصلح هذا الخطأ لاحقًا في هذه الصفحة. قبل أن نصل إلى ذلك، دعنا نضيف بعض الهيكلية لبياناتك.

## تصفية مصفوفات من العناصر {/*filtering-arrays-of-items*/}

هذه البيانات يمكن أن تكون مهيكلةً أكثر من ذلك.

```js
const people = [{
  id: 0,
  name: 'كريولا كاثرين جونسون',
  profession: 'عالمة رياضيات',
}, {
  id: 1,
  name: 'ماريو خوسيه مولينا-باسكيل هنريكيز',
  profession: 'كيميائي',
}, {
  id: 2,
  name: 'محمد عبد السلام',
  profession: 'فيزيائي',
}, {
  name: 'بيرسي لافون جوليان',
  profession: 'كيميائي',
}, {
  name: 'سوبراهمانيان تشاندراسيخار',
  profession: 'عالم فيزياء الفلك',
}];
```

لنقل أنك تريد طريقة لإظهار الناس الذين مهنتهم هي `'كيميائي'` فقط. تستطيع استخدام دالة JavaScript `filter()` لتقوم بإرجاع هؤلاء الناس فقط. هذه دالة تستقبل مصفوفة من العناصر، تمررهم عبر دالة اختبار (وهي دالة تقوم بإرجاع `true` أو `false`)، وتقوم بإرجاع مصفوفة جديدة من هؤلاء العناصر فقط الذين اجتازوا الاختبار (أي قامت بإرجاع `true`)

أنت تريد العناصر التي مهنتها `profession` هي `كيميائي` فقط. الدالة الاختبارية لهذا الأمر تبدو كالآتي: `(person) => person.profession === 'chemist'`. هنا نجد كيفية وضعهم معاً:

1. **أنشئ** مصفوفة جديدة تحوي الناس التي مهنتها `كيميائي`، عن طريق استدعاء الدالة `filter()` على المصفوفة `people` وتصفيتهم حسب مهنتهم `person.profession === 'كيميائي'`:

```js
const chemists = people.filter(person =>
  person.profession === 'كيميائي'
);
```

2. الآن قم بعمل **map** على المصفوفة `chemists`:

```js {1,13}
const listItems = chemists.map(person =>
  <li>
     <img
       src={getImageUrl(person)}
       alt={person.name}
     />
     <p>
       <b>{person.name}:</b>
       {' ' + person.profession + ' '}
       مشهور بـ {person.accomplishment}
     </p>
  </li>
);
```

3. أخيراً، قم بإرجاع **return** القائمة `listItems` من مكونك:

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const listItems = chemists.map(person =>
    <li>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        مشهور بـ {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'كريولا كاثرين جونسون',
  profession: 'عالمة رياضيات',
  accomplishment: 'حسابات الرحلات الفضائية',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'ماريو خوسيه مولينا-باسكيل هنريكيز',
  profession: 'كيميائي',
  accomplishment: 'اكتشاف ثقب الأوزون في القطب الشمالي',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'محمد عبد السلام',
  profession: 'فيزيائي',
  accomplishment: 'نظرية المغناطيسية والكهرومغناطيسية',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'بيرسي لافون جوليان',
  profession: 'كيميائي',
  accomplishment: 'تطوير أدوية الكورتيزون، الستيرويدات وحبوب منع الحمل',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'سوبراهمانيان تشاندراسيخار',
  profession: 'عالم فيزياء الفلك',
  accomplishment: 'حسابات كتلة نجمة الأبيض القزم',
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

الدوال السهمية `Arrow function` تعيد قيمة التعبير الموجود على اليمين بعد `=>`، لذلك لا حاجة لعبارة `return`:

```js
const listItems = chemists.map(person =>
  <li>...</li> // إرجاع ضمني
);
```

على أيّ حال، **عليك كتابة `return` بشكل صريح عندما يتبع `=>` خاصتك بقوس منحني `{`**

```js
const listItems = chemists.map(person => { // Curly brace
  return <li>...</li>;
});
```

الدوال السهمية التي تتضمن `=> {` تمتلك ["block body".](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body) تسمح لك بكتابة أكثر من سطرٍ واحدٍ من الكود، لكن *عليك* كتابة العبارة `return` بنفسك. إذا نسيتها، لا شيء يرجع من الدالة!

</Pitfall>

## أبقي العناصر مرتبة مع `key` {/*keeping-list-items-in-order-with-key*/}

لاحظ أنّ كل sandboxes في الأعلى تظهر خطأً في ال console:

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

أنت تحتاج إعطاء كل عنصر في المصفوفة `key` -- وهو عبارة عن نص أو معرف فريد يميز العنصر عن العناصر الأخرى في تلك المصفوفة:

```js
<li key={person.id}>...</li>
```

<Note>

استدعاء عناصر JSX مباشرة داخل الدالة `map()` يحتاج دائماً مفاتيح!

</Note>

تُخبر المفاتيح (Keys) React أي عنصر في المصفوفة يتوافق مع كل مكوّن، بحيث يمكنها تطابقها لاحقًا. يصبح ذلك مهمًا إذا كانت عناصر المصفوفة قابلة للتحريك (مثل الترتيب)، أو الإدراج، أو الحذف. تُساعد المفتاح المُختار بشكل جيد React على استنتاج ماذا حدث بالضبط، وإجراء التحديثات الصحيحة على شجرة DOM.

بدلا من توليد مفاتيح بسرعة وإغفالها، يجب عليك تضمينهم في بياناتك:

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
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          مشهور بـ {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js active
export const people = [{
  id: 0, // يُستخدم في JSX كمفتاح (key)
  name: 'كريولا كاثرين جونسون',
  profession: 'عالمة رياضيات',
  accomplishment: 'حسابات الرحلات الفضائية',
  imageId: 'MK3eW3A'
}, {
  id: 1, // يُستخدم في JSX كمفتاح (key)
  name: 'ماريو خوسيه مولينا-باسكيل هنريكيز',
  profession: 'كيميائي',
  accomplishment: 'اكتشاف ثقب الأوزون في القطب الشمالي',
  imageId: 'mynHUSa'
}, {
  id: 2, // يُستخدم في JSX كمفتاح (key)
  name: 'محمد عبد السلام',
  profession: 'فيزيائي',
  accomplishment: 'نظرية المغناطيسية',
  imageId: 'bE7W1ji'
}, {
  id: 3, // يُستخدم في JSX كمفتاح (key)
  name: 'بيرسي لافون جوليان',
  profession: 'كيميائي',
  accomplishment: 'تطوير أدوية الكورتيزون، الستيرويدات وحبوب منع الحمل',
  imageId: 'IOjWm71'
}, {
  id: 4, // يُستخدم في JSX كمفتاح (key)
  name: 'سوبراهمانيان تشاندراسيخار',
  profession: 'عالم فيزياء الفلك',
  accomplishment: 'حسابات كتلة نجمة الأبيض القزم',
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### عرض عدة عناصر DOM لكل قائمة من العناصر {/*displaying-several-dom-nodes-for-each-list-item*/}

ماذا تفعل عندما يحتاج كل عنصر إلى التصيير إلي عدة عناصر DOM وليس واحداً منها فقط?

الصيغة القصيرة ل [`<>...</>` Fragment](/reference/react/Fragment) لا تسمح لك بتمرير مفتاح، لذلك تحتاج إمّا أن تجمعهم داخل عنصر `<div>` مفرد، أو استخدام الصيغة الطويلة قليلاً و [`<Fragment>` الأكثر صراحة:](/reference/react/Fragment#rendering-a-list-of-fragments)

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

تختفي Fragments من DOM, لذلك سوف تنتج قائمة منبسطة (لاتحوي قوائم داخلية) مكونة من `<h1>`, `<p>`, `<h1>`, `<p>`, إلخ.

</DeepDive>

### من أين تحصل على `key` الخاص بك {/*where-to-get-your-key*/}

المصادر المخلتفة للبيانات تقدم مصادر مختلفة للمفاتيح:

* **البيانات من قواعد البيانات:** إذا كانت بياناتك قادمة من قاعدة بيانات، يمكنك استخدام المفاتيح أو المعرفات الفريدة التي تقدمها قواعد البيانات.
* **البيانات التي تم توليدها محلياً:** إذا كانت بياناتك مولدة ومستمرة محلياً (مثل: الملاحظات في تطبيق تدوين الملاحظات)، استخدم عداد متزايد، [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) أو حزمة مثل [`uuid`](https://www.npmjs.com/package/uuid) عندما تنشأ العناصر.

### قواعد المفاتيح {/*rules-of-keys*/}

* **المفاتيح يجب أن تكون فريدة بين الأشقاء.** على أي حال،ورغم ذلك، لا مشكلة في استخدام المفاتيح نفسها لعناصر JSX في مصفوفات _مختلفة_.
* **يجب ألا تتغير المفاتيح** أو يتم إحباط أهدافها! لا تقم بتوليدهم أثناء التصيير.

### لماذا تحتاج React مفاتيح? {/*why-does-react-need-keys*/}

تخيل بأنّ الملفات على حاسوبك لا تمتلك أسماء. بدلاً من ذلك أنت ترجع إليهم عن طريق ترتيبهم -- الملف الأول، الملف الثاني، إلخ. يمكنك اعتياد ذلك، لكن بمجرد حذفك لملف، يمكن أن يصبح الأمر غير مقبول. الملف الثاني يصبح الملف الاول، الملف الثالث يصبح الملف الثاني، وهكذا.

أسماء الملفات في مجلد ومفاتيح JSX في مصفوفة تخدم نفس الهدف. إنها تمكننا من تحديد عنصر بشكل فريد بين أشقائه. الاختيار الجيد للمفتاح يقدم معلومات أكثر من الموضع خلال المصفوفة. وحتى لو تغير _الموضع_ بسبب إعادة الترتيب، ال `key` يمكن React من تحديد العنصر أثناء وجوده.

<Pitfall>

يمكن أن يكون استخدام فهرس العنصر (index) في مصفوفة كمفتاح له مغرياً . في الحقيقة، ذلك ما ستستخدمه React إذا لم تحدد `key` على الإطلاق. لكن الترتيب المستخدم في تصيير العناصر سوف يتغير بمرور الوقت إذا تم إدخال عنصر، أو حذفه أو إذا تغير ترتيب المصفوفة. استخدام الفهرس كمفتاح يؤدي إلى مشاكل خفية ومرفوضة في الكود.

بالمثل لا تقلل من أهمية المفاتيخ عند توليدها، كاستخدام `key={Math.random()}`. هذا سيجعل المفاتيح غير متطابقة أبداً بين التصييرات، مؤديةً بذلك كل مكوناتك وDOM إلى أن يعاد إنشاؤها في كل مرة. ليس هذا بطيئاً فقط، بل سيفقد أي بيانات مدخلة من المستخدم داخل عناصر القائمة أيضاً، استخدم ID مستقراً معتمداً على البيانات.

لاحظ أن مكوناتك لا تتلقى `key` كخاصية (prop). إنها تستخدم فقط كتلميح ل React نفسه. إذا احتاج مكونك ID، عليك تمريره كخاصية منفصلة: `<Profile key={id} userId={id} />`.

</Pitfall>

<Recap>

تعلمت في هذه الصفحة:

* كيف تحول البيانات إلى مكونات أو إلى هياكل مثل المصفوفات والكائنات.
* كيف تولد مجموعات من المكونات المتشابهة باستخدام دالة JavaScript `map()`.
* كيف تنشئ مصفوفات من عناصر مصفّاة باستخدام دالة JavaScript `filter()`.
* لماذا وكيف تضبط ال `key` لكل مكون في مجموعة بطريقة تستطيع فيها React أن تتعقب كل واحد منهم حتى لو تغيرت بياناتهم ومواضعهم.

</Recap>



<Challenges>

#### فصل قائمة في قائمتين {/*splitting-a-list-in-two*/}

هذا المثال يظهر قائمة بجميع الناس.

أجري تغيرات عليها إظهار قائمتين منفصلتين واحدة بعد اأخرى: **Chemists** و**Everyone Else.** مثل ما سبق, يمكنك تحديد فيما إذا كان الشخص عالم كيمياء عن طريق التحقق من صحة `person.profession === 'chemist'`.

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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

يجب عليك استخدام الدالة `filter()` مرتين, أنشئ مصفوفتين منفصلتين, وبعدها عليك القيام ب `map` على كليهما:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
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
        )}
      </ul>
      <h2>Everyone Else</h2>
      <ul>
        {everyoneElse.map(person =>
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
        )}
      </ul>
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

في هذا الحل, تم وضع استدعاء للدالة `map` مضمنةً بشكل مباشر في عناصر الأب `<ul>`, لكن يمكنك تقديم متغيرات  لهم إذا وجدت ذلك مقروءاً أكثر.

مازال يوجد القليل من  التكرار بين القوائم التي تم تصييرها. يمكنك أن تخطو أبعد وتستخرج الأجزاء المكررة ضمن المكون `<ListSection>`:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
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
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

القارىء المنتبه جداً يمكن أن يلاحظ استدعائين للدالة `filter`، نحن نتحقق من مهنة الشخص مرتين. التحقق من الخاصة سريع جداً، لذلك في هذا المثال إنه جيد. إذا كان منطقك غنيٌّ جداً أكثر من ذلك، يمكنك استبدال استدعاء `filter` بحلقة تبني يدوياً المصفوفات وتتحقق من كل شخص مرة واحدة.

في الحقيقة، إذا لم تتغير `people` أبداً، يمكنك نقل هذا الكود من مكونك. من منظور React, كل مايهم في النهاية هو أن تعطيه مصفوفة من عقد JSX. ليست مشكلة كيف أنتجتَ تلك المصفوفة:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
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
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### القوائم المعشعشة في مكون واحد {/*nested-lists-in-one-component*/}

أنشئ قائمة من الوصفات من هذه المصفوفة! لكل وصفة في المصفوفة، اعرض اسمها ك `h2` وأنشئ قائمة بمكوناتها ضمن `ul`.

<Hint>

هذا يتطلب تعشيش استدعائين مختلفين للدالة `map`.

</Hint>

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

هنا واحد من الطرق يمكنك الذهاب به:

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

كل وصفة `recipe`  تتضمن بالفعل حقل معرف `id`، لذلك هذا ما تفعله الحلقة الخارجية باستخدامها لمفاتيح الوصفات `key`. لا يوجد معرف ID تسطيع استخدامه لتطبق مبدأ الحلقات على المكونات. من المعقول افتراض أنّ بعض المكونات لا يمكن وضعها في القائمة مرتين في الوصفة نفسها، لذلك يمكن أن تُستخدم أسماؤها كمفاتيح `key`. بدلاً من ذلك تسطيع تغيير هياكل البيانات لاضافة المعرفات IDs، أو استخدام الفهارس كمفاتيح `key` (مع تحذير بعدم إمكانية إعادة ترتيب المكونات بشكل آمن).

</Solution>

#### استخراج مكون عنصر قائمة {/*extracting-a-list-item-component*/}

مكون قائمة الوصفات هذه `RecipeList` تحوي استدعائين معشعشين لداتي `map`. لتبسيطها, استخرج مكون وصفة `Recipe` منها الذي يقبل خصائصاً  معرف `id`, اسم `name`, ومكونات `ingredients`. أين تضع المفتاح `key` الخارجي ولماذا?

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

يمكنك نسخ-لصق ال JSX من الدالة `map` الخارجية داخل مكون وصفة `Recipe` جديد وإعاددة ذلك ال JSX. بعدها يمكنك تغيير `recipe.name` ل `name`، `recipe.id` ل `id`, إلخ, وتمريرهم كخصائص ل  `Recipe`:

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

هنا, `<Recipe {...recipe} key={recipe.id} />` هي صيغة مختصرة تقول "مرر كل خاصيات كائن الوصفة  `recipe` كخصائص ل المكون `Recipe`". يمكن أيضاً كتابة كل خاصية بصراحة: `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.

**لاحظ أنّ `key` محدد على  `<Recipe>` نفسه عوضاً عن الجذر `<div>` عائدة من `Recipe`.** هذا بسبب أنّ هذا المفتاح `key` هو مُحتاج إليه بشكل مباشر في سياق محيط المصفوفة. سابقاً, امتلكنا مصفوفة من `<div>` لذلك كل واحدة منها تحتاج لمفتاح `key`, لكن الآن نمتلك مصفوفة من `<Recipe>`. بمعنى آخر، عندما تستخرج مكوناً، لاتنسى ترك المفتاح `key` خارج JSX أنت تنسخ وتلصق.

</Solution>

#### قائمة مع فاصل {/*list-with-a-separator*/}

هذا المثال يقوم بتصيير haiku المشهورة من قبل كاتسوشيكا هوكوسي، مع كل سطر ملتف في وسم `<p>`. عملك هو إدخال فاصل `<hr />` بين كل فقرة. يجب أن تبدو بنيتك الناتجة كما يلي:

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

 haiku فقط تتضمن ثلاثة أسطر, لكن حلك يجب أن يعمل مع أي عدد من الأسطر. لاحظ أنّ عناصر `<hr />` فقط تظهر *بين* عناصر `<p>`, لا في البداية ولا النهاية!

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

(هذه حالة نادرة حيث الفهرس هو مقبول كمفتاح أن أسطر القصيدة لن تتغير أبداً.)

<Hint>

أنت إما ستحتاج إلى تحويل `map` إلى حلقة يدوية، أو استخدام fragment.

</Hint>

<Solution>

يمكنك كتابة حلقة يدوية، إدخال `<hr />` و`<p>...</p>` داخل مصفوفة الإخراج كما لو أنك تفعل:

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // Fill the output array
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // Remove the first <hr />
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

استخدام فهرس الخط الأصلي ك `key` لم يعد يعمل بعد الآن  لأن كل فاصل وفقرة هما الآن في المصفوفة نفسها. على أية حال، يمكنك إعطاء كل واحد منهم مفتاحاً مميزاً باستخدام لاحقة. مثال `key={i + '-text'}`.

بدلاً من ذلك، يمكنك تصيير مجموعة من fragments التي تحتوي `<hr />` و`<p>...</p>`. الصيغة القصيرة `<>...</>` لا تدعم تمرير المفاتيح, لذلك أنت بحاجة لكتابة `<Fragment>` بشكل صريح:

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

تذكر، fragments (غالباً تكتب ك `<> </>`) تسمح لك بتجميع عقد JSX بدون إضافة عدة `<div>` إضافية!

</Solution>

</Challenges>
