---
title:  تمرير الخصائص إلى مكوّن
---

<Intro>

تستخدم مكوّنات React "الخصائص" (props) للتواصل مع بعضها البعض. يمكن لكل مكوّن أب تمرير بعض المعلومات إلى مكوّناته الفرعية عن طريق إعطائها الخصائص. قد تذكرك الخصائص بسمات HTML، ولكن يمكنك تمرير أي قيمة JavaScript من خلالها، بما في ذلك الكائنات والمصفوفات والدوال.

</Intro>

<YouWillLearn>

* كيفية تمرير الخصائص (props) إلى المكوّنات (Components)
* كيفية قراءة الخصائص من مكوّن
* كيفية تحديد القيم الافتراضية للخصائص
* كيفية تمرير بعض عناصر JSX إلى مكوّن
* كيف تتغير الخصائص مع مرور الوقت

</YouWillLearn>

## الخصائص المألوفة {/*familiar-props*/}

الخصائص هي المعلومات التي تمررها إلى وسم JSX . على سبيل المثال، `className`، `src`، `alt`، `width`، و `height` هي بعض الخصائص التي يمكنك تمريرها إلى `<img>`:

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

الخصائص التي يمكن تمريرها إلى وسم `<img>` هي خصائص محدده مسبقًا (ReactDOM يتوافق مع  [معيار الHTML](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)). ولكن يمكنك تمرير أي خصائص إلى المكوّنات *الخاصة بك*، مثل `<Avatar>`، لتخصيصها. هنا كيفية ذلك!

## تمرير الخصائص إلى مكوّن {/*passing-props-to-a-component*/}

في هذا الكود، مكوّن ال `Profile` لا يمرر أي خصائص إلى مكوّنه الطفل، `Avatar`:

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

يمكنك إعطاء `Avatar` بعض الخصائص في خطوتين.

### الخطوة الأولى: تمرير الخصائص إلى مكوّن طفل {/*step-1-pass-props-to-the-child-component*/}

أولاً، يجب تمرير بعض الخصائص إلى  `Avatar`. على سبيل المثال، دعونا نمرر خاصيتين: `person` (كائن)، و `size` (رقم): 

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying'، imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

<Note>

إذا كنت تشعر بالحيرة بسبب تكرار الأقواس المنحنية بعد `person=`، فتذكر [أنها مجرد كائن](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx) داخل الأقواس المنحنية (curlies) في JSX

</Note>

الآن يمكنك قراءة هذه الخصائص داخل مكوّن ال`Avatar`.

### الخطوة الثانية: اقرأ الخصائص داخل المكّون الطفل {/*step-2-read-props-inside-the-child-component*/}

يمكنك قراءة هذه الخصائص عن طريق كتابة أسمائها `person, size` مفصولة بفواصل داخل `({` و `})` مباشرة بعد `function Avatar`. هذا يتيح لك استخدامها داخل كود `Avatar`، كما تفعل مع المتغيرات.


```js
function Avatar({ person, size }) {
  // person و size متاحين هنا
}
```

أضف بعض المنطق إلى `Avatar` باستخدام الخصائص `person` و `size` للتصيير، وبذلك تكون انتهيت.

الآن يمكنك تهيئة `Avatar` للتصيير بطرق مختلفة مع خصائص مختلفة. جرب تعديل القيم!

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

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

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{ 
          name: 'كاتسوكو ساروهاشي', 
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'أكليلو ليما', 
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{ 
          name: 'لين لانين',
          imageId: '1bX5QH6'
        }}
      />
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
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

تتيح لك المكوّنات التفكير في المكوّنات الآباء والمكوّنات الأبناء بشكل مستقل. على سبيل المثال، يمكنك تغيير مكوّنات ال`person` أو ال`size` في داخل `Profile` دون الحاجة للتفكير في كيفية استخدامهما في المكوّن المسمى `Avatar`. بالمثل، يمكنك تغيير كيفية استخدام المكوّن `Avatar` لهذه الخصائص دون النظر إلى المكوّن `Profile`.

يمكنك التفكير في الخصائص على أنها "أدوات تعديل" يمكنك تعديلها. إنها تؤدي نفس الدور الذي تؤديه الوسائط للدوال - في الواقع، الخصائص هي الوسيطة الوحيدة لمكوّنك! تقبل دوال المكوّنات في React وسيطة واحدة فقط، كائن خصائص

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

عادةً ما لا تحتاج إلى كامل كائن ال`props` نفسه، لذلك يتم تحليله إلى خصائص فردية.

<Pitfall>

**لا تنسى زوجي `{` و `}` الأقواس المنحنية** داخل `(` و `)` عند إعلان الخصائص:

```js
function Avatar({ person, size }) {
  // ...
}
```

هذه الصيغة تسمى ["تحليل"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter) وهي ما تعادل قراءة الخصائص من عامل الدالة:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## تحديد قيمة افتراضية لخاصية {/*specifying-a-default-value-for-a-prop*/}

إذا كنت تريد إعطاء قيمة افتراضية لخاصية تستخدم عند عدم تحديد قيمة، يمكنك القيام بذلك باستخدام الصيغة التحليلية عن طريق وضع علامة `=` والقيمة الافتراضية مباشرة بعد المعامل:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

الآن، إذا تم عرض `<Avatar person={...} />` بدون خاصية `size`،سيتم تعيين ال`size` على `100`.

تُستخدم القيمة الافتراضية فقط إذا كانت خاصية ال`size` مفقودة أو إذا قمت بتمرير `size={undefined}`. ولكن إذا قمت بتمرير `size={null}` أو `size={0}`، **فلن** يتم استخدام القيمة الافتراضية.

## إعادة توجيه الخصائص باستخدام صيغة الانتشار (spread operator) في JSX {/*forwarding-props-with-the-jsx-spread-syntax*/}

في بعض الأحيان، يصبح تمرير الخصائص مُكررًا جدًا:

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

لا يوجد أي شيء خاطئ في تكرار الكود - بل يمكن أن يزيد الوضوح. ولكن في بعض الأحيان قد يُفَضّل الاختصار. تقوم بعض المكوّنات بتوجيه جميع خصائصها إلى أطفالها، مثل الطريقة التي يفعل بها `Profile` مع `Avatar`.  نظرًا لعدم استخدامها لأي من خصائصها مباشرة، فقد يكون من المنطقي استخدام صيغة الانتشار "spread" الأكثر اختصارًا:

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

يقوم هذا بتوجيه جميع خصائص `Profile` إلى `Avatar` دون تسمية كل منها بشكل فردي.

**استخدم صيغة انتشار بحذر.** إذا كنت تستخدمها في كل مكوّن آخر، فهناك شيء خاطئ. غالبًا ما يشير ذلك إلى أنه يجب تقسيم المكوّنات الخاصة بك وتمرير الأطفال كـ JSX. المزيد حول ذلك في القسم التالي!

## تمرير JSX كأطفال {/*passing-jsx-as-children*/}

من الشائع تضمين أوسمّة المتصفح المدمجة:

```js
<div>
  <img />
</div>
```

في بعض الأحيان ستريد تضمين مكوّناتك الخاصة بنفس الطريقة:

```js
<Card>
  <Avatar />
</Card>
```

عند تضمين محتوى داخل وسم JSX، سيتلقى المكوّن الأب هذا المحتوى في خاصية تسمى `children`. على سبيل المثال، سيتلقى المكوّن `Card` القادم خاصية `children` التي تم تعيينها على `<Avatar />` و يقوم بعرضها في قسم مجمع

<Sandpack>

```js App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{ 
          name: 'كاتسوكو ساروهاشي',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}
```

```js Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
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

جرب استبدال `<Avatar>` داخل `<Card>` بنص ما لمعرفة كيف يمكن للمكوّن `Card` لف أي محتوى متداخل. لا يحتاج  المكوّن إلى "معرفة" ما يتم تقديمه داخله. سترى هذه النمط المرن في العديد من الأماكن.

يمكنك التفكير في المكوّن الذي يحتوي على خاصية `children` على أنه لديه "ثقب" يمكن "ملؤه" من قِبَل مكوّناته الأبويه بأي JSX. سوف تستخدم في كثير من الأحيان خاصية `children` للتغليف البصري: اللوحات، الشبكات، إلخ.

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='A puzzle-like Card tile with a slot for "children" pieces like text and Avatar' />

## كيفية تغيير الخصائص مع مرور الوقت {/*how-props-change-over-time*/}

يتلقى المكوّن `Clock` القادم خاصيتين من مكوّنه الأب: `color` و `time`. (تم حذف كود المكوّن الأب لأنه يستخدم الحالة [state](/learn/state-a-components-memory)، التي لا نريد أن نتعمق فيها الآن.)

جرب تغيير اللون في مربع الاختيار أدناه:

<Sandpack>

```js Clock.js active
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

يوضح هذا المثال أنه **يمكن للمكوّن أن يتلقى خصائص مختلفة مع مرور الوقت.** الخصائص ليست دائمًا ثابتة! هنا، تتغير الخاصية `time` كل ثانية، وتتغير الخاصية `color` عندما تختار لونًا آخر. تعكس الخصائص بيانات المكوّن في أي نقطة من الزمن، عوضاً عن البدايه فقط.

ومع ذلك، تكون الخصائص [immutable](https://en.wikipedia.org/wiki/Immutable_object)—وهو مصطلح من علم الحوسبة يعني "لا يمكن تغييره". عندما يحتاج المكوّن إلى تغيير خصائصه (على سبيل المثال، ردًا على تفاعل من المستخدم أو بيانات جديدة)، سيضطر إلى "طلب" من مكوّنه الأب تمريره _خصائص مختلفة_—كائن جديد! سيتم رفض الخصائص القديمة ثم سيستعيد محرك JavaScript في نهاية المطاف الذاكرة التي استهلكتها.

**لا تحاول "تغيير الخصائص". ** عندما تحتاج إلى الاستجابة لإدخال المستخدم (مثل تغيير اللون المحدد)، ستحتاج إلى "تعيين الحالة"، والتي يمكنك التعرف عليها في [الحالة: ذاكرة المكوّن.](/learn/state-a-components-memory)

<Recap>

* لتمرير الخصائص، أضفها إلى JSX، تمامًا كما تفعل مع سمات HTML.
* لقراءة الخصائص، استخدم `function Avatar({ person, size })` صيغة تحليل.
* يمكنك تحديد قيمة افتراضية مثل `size = 100`، التي تُستخدم في الخصائص الناقصة وغير المُعرّفة 'undefined'.
* يمكنك توجيه جميع الخصائص باستخدام صيغة الانتشار `<Avatar {...props} />`، ولكن لا تستخدمها بكثرة!
* JSX المتداخل مثل `<Card><Avatar /></Card>` سيظهر كخاصية `children` للمكوّن `Card`.
* تمثل الخصائص لقطات للقراءة فقط في الوقت: يتلقى كل عرض نسخة جديدة من الخصائص.
* لا بمكنك تغيير الخصائص. عندما تحتاج إلى التفاعلية، ستحتاج إلى تعيين الحالة.

</Recap>



<Challenges>

#### استخراج مكوّن {/*extract-a-component*/}

يحتوي مكوّن `Gallery` هذا على بعض الmarkup المماثلة جدًا لاثنين من الملفات. استخرِج  مكوّن ال`Profile` منه لتقليل التكرار. سوف تحتاج إلى اختيار الخصائص التي ستمررها إليه.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>العلماء البارزون</h1>
      <section className="profile">
        <h2>ماري سكاوندوڤسكا-كوري</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>المهنة: </b> 
            عالمة فيزياء وكيمياء
          </li>
          <li>
            <b>الجوائز: 4 </b> 
            (جائزة نوبل في الفيزياء، جائزة نوبل في الكيمياء، ميدالية دافي، ميدالية ماتيوتشي)
          </li>
          <li>
            <b>اكتشفت: </b>
            البولونيوم (عنصر كيميائي)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>كاتسوكو ساروهاشى</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>المهنة: </b> 
            جيوكيميائية
          </li>
          <li>
            <b>الجوائز: 2 </b> 
            (جائزة مياكي للجيوكيمياء، جائزة تاناكا)
          </li>
          <li>
            <b>اكتشفت: </b>
            طريقة لقياس ثاني أكسيد الكربون في المياه البحرية
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

ابدأ بإستخراج علامات الترميز لأحد العلماء. ثم ابحث عن الأجزاء التي لا تتطابق معها في المثال الثاني، وإجعلها قابلة للتهيئة باستخدام الخصائص.

</Hint>

<Solution>

في هذا الحل، يقبل مكوّن ال`Profile` العديد من الخصائص: `imageId` (سلسلة)، `name` (سلسلة)، `profession` (سلسلة)، `awards` (مصفوفة من السلاسل)، `discovery` (سلسلة)، و `imageSize` (عدد).

لاحظ أن خاصية `imageSize` لديها قيمة افتراضية، وهذا هو السبب في عدم تمريرها إلى المكوّن.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>المهنة:</b> {profession}</li>
        <li>
          <b>الجوائز: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>اكتشفت: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>العلماء البارزون</h1>
      <Profile
        imageId="szV5sdG"
        name="ماري سكاوندوڤسكا-كوري"
        profession="عالمة فيزياء وكيمياء"
        discovery="البولونيوم (عنصر)"
        awards={[
          'جائزة نوبل في الفيزياء',
          'جائزة نوبل في الكيمياء',
          'ميدالية دافي',
          'ميدالية ماتيوتشي'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='كاتسوكو ساروهاشى'
        profession='جيوكيميائية'
        discovery="طريقة لقياس ثاني أكسيد الكربون في المياه البحرية"
        awards={[
          'جائزة مياكي للجيوكيمياء',
          'جائزة تاناكا'
        ]}
      />
    </div>
  );
}
```

```js utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

لاحظ كيف لا تحتاج إلى خاصية `awardCount` منفصلة إذا كانت `awards` مصفوفة. عندها يمكنك استخدام `awards.length` لحساب عدد الجوائز. تذكر أن الخصائص يمكن أن تأخذ أي قيم، وهذا يشمل المصفوفات أيضًا!

حل آخر، والذي يشبه أكثر الأمثلة السابقة في هذه الصفحة، هو تجميع جميع المعلومات المتعلقة بشخص ما في كائن واحد، وتمرير هذا الكائن كخصيصة واحد:

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>المهنة:</b> {person.profession}
        </li>
        <li>
          <b>الجوائز: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>اكتشفت: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>العلماء البارزون</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'ماري سكاوندوڤسكا-كوري',
        profession: 'عالمة فيزياء وكيمياء',
        discovery: 'البولونيوم (عنصر)',
        awards: [
          'جائزة نوبل في الفيزياء',
          'جائزة نوبل في الكيمياء',
          'ميدالية دافي',
          'ميدالية ماتيوتشي'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'كاتسوكو ساروهاشى',
        profession: 'جيوكيميائية',
        discovery: 'طريقة لقياس ثاني أكسيد الكربون في المياه البحرية',
        awards: [
          'جائزة مياكي للجيوكيمياء',
          'جائزة تاناكا'
        ],
      }} />
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
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1، h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

رغم أن صيغة الجمل تبدو مختلفة قليلاً  لأنك تصف خصائص كائن JavaScript بدلاً من مجموعة من سمات JSX، إلا أن هذه الأمثلة متكافئة إلى حد كبير، ويمكنك اختيار أي منهما.

</Solution>

#### ضبط حجم الصورة استنادًا إلى خاصية {/*adjust-the-image-size-based-on-a-prop*/}

في هذا المثال، يستلم `Avatar` خاصية رقمية `size` التي تُحدد عرض وارتفاع عنصر `<img>`. قيمة خاصية `size` هي `40` في هذا المثال. ومع ذلك، إذا قمت بفتح الصورة في علامة تبويب جديدة، ستلاحظ أن حجم الصورة نفسها أكبر (`160` بكسل). يتم تحديد حجم الصورة الفعلي بناءً على حجم الصورة المصغرة التي تطلبها.

قم بتغيير مكوّن `Avatar` لطلب أقرب حجم للصورة استنادًا إلى خاصية `size`. على وجه التحديد، إذا كانت قيمة `size` أقل من `90`، فيجب تمرير `'s'` ("small") بدلاً من `'b'` ("big") إلى دالة `getImageUrl`. تحقق من أن التغييرات تعمل عن طريق عرض الصور الرمزية بقيم مختلفة لخاصية `size` وأفتح الصور في علامة تبويب جديدة.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{ 
        name: 'غريغوريو ي. زارا', 
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

هنا كيف يمكنك القيام بذلك:

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'غريغوريو ي. زارا', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'غريغوريو ي. زارا', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

يمكنك أيضًا عرض صورة أكثر وضوحًا لشاشات العرض عالية الكثافة [`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio) من خلال احتسابها:

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'غريغوريو ي. زارا', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{ 
          name: 'غريغوريو ي. زارا', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'غريغوريو ي. زارا', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

تمكنك الخصائص من تجميع المنطق مثل هذا داخل مكوّن `Avatar` (وتغييره في وقت لاحق إذا لزم الأمر) بحيث يمكن للجميع استخدام مكوّن `<Avatar>` دون  التفكير في كيفية طلب الصور وتغيير حجمها.

</Solution>

#### تمرير  JSX في خاصية `children` {/*passing-jsx-in-a-children-prop*/}

إستخرج مكوّن `Card`  من العلامات التالية، واستخدم خاصية `children` لتمرير JSX مختلفة إليه:

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>صورة</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>حول</h1>
          <p>أكيلو ليما كان عالمًا إثيوبيًا متميزًا اكتشف علاجًا طبيعيًا للبلهارسيا.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

أي JSX تضعه داخل وسم المكوّن سيتم تمريره كخاصية `children` إلى هذا المكوّن.

</Hint>

<Solution>

هذه هي كيفية استخدام مكوّن `Card` في كلا الأماكن:

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>صورة</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>حول</h1>
        <p>أكيلو ليما كان عالمًا إثيوبيًا متميزًا اكتشف علاجًا طبيعيًا للبلهارسيا.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

يمكنك أيضًا جعل `title` خاصية منفصلة إذا كنت ترغب في أن يكون لدى كل `Card` عنوانًا دائمًا:

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="صورة">
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card title="حول">
        <p>>أكيلو ليما كان عالمًا إثيوبيًا متميزًا اكتشف علاجًا طبيعيًا للبلهارسيا.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>
