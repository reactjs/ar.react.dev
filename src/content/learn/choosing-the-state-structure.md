---
title: اختيار هيكلة الحالة
---

<Intro>
إن هيكلة للحالة (state) بشكل صحيح هي أحد العناصر الأساسية التي يمكن أن تجعل المكون (component) سهل التعديل والتصحيح عند مواجهة الأخطاء، أو بالعكس، قد تكون مصدراً للتعقيد والمشاكل في مشروعك. لذا، إليك بعض النصائح التي يمكنك اتباعها لهيكلة الحالات (state) بشكل فعّال:
</Intro>

<YouWillLearn>

* متى تستخدم متغير حالة واحد مقابل عدة متغيرات حالة
* ما يجب تجنبه عند تنظيم الحالة
* كيفية إصلاح المشكلات الشائعة في هيكلة الحالة

</YouWillLearn>

## مبادئ هيلكة الحالات {/*principles-for-structuring-state*/}

عندما تقوم بكتابة مكون يحتوي على حالة، ستحتاج إلى اتخاذ قرارات بشأن عدد متغيرات الحالة التي ستستخدمها وشكل البيانات التي تحتويها. بينما من الممكن كتابة برامج صحيحة حتى مع هيكلة حالة غير مثلى، هناك بعض المبادئ التي يمكن أن تساعدك في اتخاذ قرارات أفضل:

1. **دمج الحالات المتشابهة** اذا كنت تحدث اثنين او اكثر من الحالات في آن واحدة. فكر في دمجهم الى حالة واحدة 
2. **تجنب تناقضات في الحالة.** عندما تكون الحالة مهيكلة بطريقة يكون فيها اجزاء من الحالة متناقضة, فهذا يفتح مجال للأخطاء. حاول تجنبها
3. **تجنب الحالة الزائدة.** اذا كنت تعالج معلومة ما عن طريق خصائص (prop) او الحالة موجودة مسبقا. فيجب عليك تفادي وضع تلك المعلومة في حالات ذلك المكون
4. **تجنب تكرار الحالات.** عندما تكون نفس البيانات مكررة بين عدة حالات، أو ضمن كائنات متداخلة، يصبح من الصعب الحفاظ على تزامنها. تفادى التكرار قدر الإمكان.
5. **تجنب الحالة المتداخلة بعمق.** تجنب الحالة المتداخلة بعمق. الحالة ذات الهيكلية العميقة ليست مناسبة للتحديث. يُفضّل هيكلة الحالة بطريقة مسطحة.

الهدف من هذه المبادئ هو *تسهيل تحديث الحالة دون فتح مجال للأخطاء*. من خلال إزالة البيانات الزائدة والمتكررة من الحالة، نضمن تماسك جميع أجزائها. هذا مماثل لما قد يفعله مهندس قاعدة المعلومات ["تطبيع" لهيكلة قاعدة المعلومات](https://docs.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description) لتقليل من الأخطاء المحتملة. كما قال أينشتاين, **"اجعل حالتك بسيطة بقدر الإمكان—لكن لا تجعلها أبسط من ذلك."**
 

لنرى الآن كيف يمكن تطبيق هذه المبادئ عملياً.

## جمع الحالة المتعلقة {/*group-related-state*/}

قد تكون أحياناً غير متأكد مما إذا كنت ينبغي أن تستخدم متغير حالة واحداً أم عدة متغيرات حالة.

هل يجب عليك فعل هذا؟

```js
const [x, setX] = useState(0);
const [y, setY] = useState(0);
```

او هذا؟

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

من الناحية التقنية، يمكنك استخدام أي من هاتين الطريقتين. ولكن  **إذا كان هناك متغيران من الحالة يتغيران دائماً معاً، فقد يكون من الجيد دمجهما في متغير حالة واحد.** بذلك، لن تنسى دائماً الحفاظ على تزامنهما، كما في هذا المثال حيث يؤدي تحريك المؤشر إلى تحديث إحداثيات النقطة الحمراء:

<Sandpack>

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => { 
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  )
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

في حالة أخرى، قد تحتاج إلى جمع بيانات الحالة في كائن أو مصفوفة عندما لا تعرف عدد أجزاء الحالة التي ستحتاجها. على سبيل المثال، ستكون هذه الطريقة مفيدة عندما يكون لديك نموذج يتيح للمستخدم إضافة حقول مخصصة

<Pitfall>

إذا كان متغير الحالة الخاص بك هو كائن، فتذكر أنه [لا يمكنك تحديث حقل واحد فقط فيه](/learn/updating-objects-in-state) دون نسخ الحقول الأخرى بشكل صريح. على سبيل المثال، لا يمكنك استخدام `setPosition({ x: 100 })` في المثال أعلاه لأنه لن يحتوي على خاصية `y` على الإطلاق! بدلاً من ذلك، إذا كنت ترغب في تعيين `x` فقط، يمكنك إما استخدام 
`setPosition({ ...position, x: 100 })`، أو تقسيمها إلى متغيرين للحالة واستخدام `setX(100)`.

</Pitfall>

## تجنب التناقضات في حالات {/*avoid-contradictions-in-state*/}

هنا نموذج تقييم للفندق يحتوي على متغيري حالة `isSending` و `isSent`:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);
    await sendMessage(text);
    setIsSending(false);
    setIsSent(true);
  }

  if (isSent) {
    return <h1>شكرًا لتقديم الملاحظات!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>كيف كانت إقامتك في فندق The Prancing Pony؟</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        ارسال
      </button>
      {isSending && <p>يتم الارسال...</p>}
    </form>
  );
}

// تظاهر بارسال رسالة
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

</Sandpack>

بينما يعمل هذا الكود، فإنه يسمح  لحالات "مستحيلة". على سبيل المثال، إذا نسيت منادات `setIsSent` و `setIsSending` معا, قد تجد نفسك في موقف تكون فيه كل من `isSending` و `isSent` بقيمة `true` في نفس الوقت. و كلما زاد تعقيد المكون الخاص بك كلما صعب عليك فهم ما حصل.

**بما أن `isSending` و `isSent` يجب ان لا يكونا `true` في الوقت نفسه, فمن الافضل استبدالهم ب `status` متغير الحالة الذي يمكنه أخذ *ثلاث* حالات فقط:** `'typing'` (بداية), `'sending'`, و `'sent'`:
<small> 
بحيث
typing يتم الكتابة 
sending: يتم ارسال
sent تم ارسال
</small>
<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('typing');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    await sendMessage(text);
    setStatus('sent');
  }

  const isSending = status === 'sending';
  const isSent = status === 'sent';

  if (isSent) {
   return <h1>شكرًا لتقديم الملاحظات!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
     <p>كيف كانت إقامتك في فندق The Prancing Pony؟</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        ارسال
      </button>
      {isSending && <p>يتم الارسال...</p>}
    </form>
  );
}

// تظاهر بارسال رسالة
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

</Sandpack>

يمكنك تعريف ثابت من أجل تسهيل قراءة:

```js
const isSending = status === 'sending';
const isSent = status === 'sent';
```
لكنهم ليسوا متغيرات حالة، لذا لا داعي للقلق بشأن فقدان التزامن بينها.

## تجنب تناقضات في الحالة. {/*avoid-redundant-state*/}

إذا كنت تستطيع حساب بعض المعلومات من خصائص المكون أو من متغيرات  الحالة الموجودة أثناء عملية العرض، يجب عليك **عدم وضع** تلك المعلومات في حالة المكون.

فمثلا, خذ هذا النموذج. إنه يعمل, ولكن هل يمكنك العثور على أي حالة زائدة فيه؟

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    // هنا يتم اضافت اسم الاول و اخير معا لتشكيل الاسم كاملا
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>فل نسجلك</h2>
      <label>
        الاسم الأول:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        الاسم الأخير:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        تذكرتك ستصدر الى: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

هذا النموذج لديه ثلاث متغيرات الحالة: `firstName`, `lastName`, و `fullName`. مع ذلك, `fullName` غير ضرورية. **يمكنك دائما حساب `fullName` انطلاقا `firstName` و `lastName` اثناء العرض, اذا يمكن حذفها.**

اليك الطريقة كيف يمكنك قيام بذالك:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>فل نسجلك</h2>
      <label>
        الاسم الأول:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        الاسم الأخير:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
          تذكرتك ستصدر الى: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

هنا, `fullName` *ليس* متغير حالة. ولكن, يتم حسابه أثناء العرض:

```js
const fullName = firstName + ' ' + lastName;
```

نتيجة لذلك، لا تحتاج معالجات التغييرات إلى القيام بشيء خاص لتحديثها. عند استدعاء `setFirstName` أو `setLastName`، فإنك تُحفِّز عملية إعادة العرض، ومن ثم سيتم حساب `fullName` التالي من البيانات الجديدة..

<DeepDive>

#### لا تنسخ الخصائص الى الحالة {/*don-t-mirror-props-in-state*/}

مثال شائع على الحالة الزائدة هو الكود التالي:

```js
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
```

هنا, `color` متغير حالة تم تهيئته بالخاصية `messageColor`. المشكل في هذه الطريقة **اذا قدم أب المكون قيمة اخرى للخاصية `messageColor` اثناء العرض (مثلا, `'red'` في مكان `'blue'`), *متغير الحالة* فان `color`  لن يتم تحديثه!** تُهيَّأ الحالة فقط خلال عملية العرض الأولى.

لهذا السبب، يؤدي نسخ الخصائص إلى متغيرات الحالة إلى حدوث ارتباك. بدلاً من ذلك، يمكنك استخدام الخاصية messageColor مباشرةً، أو إذا كنت ترغب في تغيير اسمها في المكون، يمكنك استخدام ثابت

```js
function Message({ messageColor }) {
  const color = messageColor;
```

بهذه الطريقة، لن تفقد الخاصية التزامن مع المكون الأب.

"النسخ" خاصية الى متغير الحالة يكون منطقيًا فقط عندما تريد ان تجاهل *جميع التحديثات* المتعلقة بالخاصية

 تقليديا, ابدأ اسم الخاصية ب `initial` أو `default` لتوضح أنه سيتم تجاهل القيم الجديدة.

```js
function Message({ initialColor }) {
  // متغير الحالة `color` يحتفظ ب *أول* قيمة ل `initialColor`.
  // أما تغيرات جديدة للخاصية `initialColor` سيتم تجاهلها
  const [color, setColor] = useState(initialColor);
```

</DeepDive>

## تجنب تكرار {/*avoid-duplication-in-state*/}

تتيح لك هذه المكونة لقائمة القائمة اختيار وجبة خفيفة واحدة من عدة خيارات:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
{ title: 'بريتزل', id: 0 },
{ title: 'أعشاب بحرية مقرمشة', id: 1 },
{ title: 'شريط جرانولا', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  return (
    <>
      <h2>ماهي وجبتك الخفيفة?</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.title}
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>اختر</button>
          </li>
        ))}
      </ul>
      <p>لقد اخترت {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>
حاليا, يتم تخزين العنصر المختار ككائن في `selectedItem` متغير الحالة. ولكن, هذا ليس مثاليًا **بسبب ان محتويات `selectedItem` هي نفسها الكائن كواحد من محتويات قائمة`items` فهذا يعني ان المعلومة حول العنصر متكررة في مكانين

لماذا يعتبر هذا الشيء مشكلة؟ 


<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
{ title: 'بريتزل', id: 0 },
{ title: 'أعشاب بحرية مقرمشة', id: 1 },
{ title: 'شريط جرانولا', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>ماهي وجبتك الخفيفة?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>اختر</button>
          </li>
        ))}
      </ul>
      <p>لقد اخترت {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

لاحظ كيف أنه إذا قمت أولاً بالنقر على "اختر" على عنصر ثم قمت بتعديله، **تتحدث المدخلات ولكن التسمية في الأسفل لا تعكس التعديلات.** وهذا لأن لديك حالة مكررة، ونسيت تحديث `selectedItem`.


على الرغم من أنه يمكنك تحديث `selectedItem` أيضًا، فإن الإصلاح الأسهل هو إزالة التكرار. في هذا المثال، بدلاً من استخدام كائن `selectedItem` (الذي يخلق تكرارًا مع الكائنات داخل items)، تحتفظ بـ `selectedId` في الحالة، وثم تحصل على `selectedItem` من خلال البحث في مصفوفة `items`  عن عنصر له هذا المعرف `id`: 

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
{ title: 'بريتزل', id: 0 },
{ title: 'أعشاب بحرية مقرمشة', id: 1 },
{ title: 'شريط جرانولا', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  const selectedItem = items.find(item =>
    item.id === selectedId
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>ماهي وجبتك الخفيفة?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedId(item.id);
            }}>اختر</button>
          </li>
        ))}
      </ul>
      <p>لقد اخترت {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

الحالة كانت متكررة هكذا:

* `items = [{ id: 0, title: 'بريتزل'}, ...]`
* `selectedItem = {id: 0, title: 'بريتزل'}`

ثم بعد التغييرات رجعت كهذا:

* `items = [{ id: 0, title: 'بريتزل'}, ...]`
* `selectedId = 0`

تمت إزالة التكرار، وتحتفظ الآن بالحالة الأساسية فقط!

الآن، إذا قمت بتعديل العنصر المحدد، ستُحدَّث الرسالة أدناه على الفور. وذلك لأن `setItems` يُحفِّز إعادة العرض، و `items.find(...)` سيجد العنصر بعنوانه المحدث. لم تكن بحاجة إلى الاحتفاظ بـ العنصر المحدد في الحالة، لأن معرّف العنصر المحدد فقط هو الأساسي. يمكن حساب البقية أثناء العرض.

## تجنب الحالة المتداخلة بعمق. {/*avoid-deeply-nested-state*/}

تخيل خطة سفر تتكون من كواكب وقارات ودول. قد تشعر بالميل لهيكلة حالتها باستخدام كائنات وأ Arrays متداخلة، مثلما في هذا المثال:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ place }) {
  const childPlaces = place.childPlaces;
  return (
    <li>
      {place.title}
      {childPlaces.length > 0 && (
        <ol>
          {childPlaces.map(place => (
            <PlaceTree key={place.id} place={place} />
          ))}
        </ol>
      )}
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);
  const planets = plan.childPlaces;
  return (
    <>
      <h2>أماكن لزيارة</h2>
      <ol>
        {planets.map(place => (
          <PlaceTree key={place.id} place={place} />
        ))}
      </ol>
    </>
  );
}
```

```js src/places.js active
export const initialTravelPlan = {
  id: 0,
  title: '(Root)',
  childPlaces: [{
    id: 1,
    title: 'الأرض',
    childPlaces: [{
      id: 2,
      title: 'افريقيا',
      childPlaces: [{
        id: 3,
        title: 'بوتسوانا',
        childPlaces: []
      }, {
        id: 4,
        title: 'مصر',
        childPlaces: []
      }, {
        id: 5,
        title: 'كينيا',
        childPlaces: []
      }, {
        id: 6,
        title: 'مدغشقر',
        childPlaces: []
      }, {
        id: 7,
        title: 'المغرب',
        childPlaces: []
      }, {
        id: 8,
        title: 'نيجيريا',
        childPlaces: []
      }, {
        id: 9,
        title: 'افريقيا',
        childPlaces: []
      }]
    }, {
      id: 10,
      title: 'الأمريكتين',
      childPlaces: [{
        id: 11,
        title: 'الأرجنتين',
        childPlaces: []
      }, {
        id: 12,
        title: 'البرازيل',
        childPlaces: []
      }, {
        id: 13,
        title: 'بربادوس',
        childPlaces: []
      }, {
        id: 14,
        title: 'كندا',
        childPlaces: []
      }, {
        id: 15,
        title: 'جامايكا',
        childPlaces: []
      }, {
        id: 16,
        title: 'المكسيك',
        childPlaces: []
      }, {
        id: 17,
        title: 'ترينيداد وتوباغو',
        childPlaces: []
      }, {
        id: 18,
        title: 'فنزويلا',
        childPlaces: []
      }]
    }, {
      id: 19,
      title: 'آسيا',
      childPlaces: [{
        id: 20,
        title: 'الصين',
        childPlaces: []
      }, {
        id: 21,
        title: 'الهند',
        childPlaces: []
      }, {
        id: 22,
        title: 'سنغافورة',
        childPlaces: []
      }, {
        id: 23,
        title: 'كوريا الجنوبية',
        childPlaces: []
      }, {
        id: 24,
        title: 'تايلاند',
        childPlaces: []
      }, {
        id: 25,
        title: 'فيتنام',
        childPlaces: []
      }]
    }, {
      id: 26,
      title: 'أوروبا',
      childPlaces: [{
        id: 27,
        title: 'كرواتيا',
        childPlaces: [],
      }, {
        id: 28,
        title: 'فرنسا',
        childPlaces: [],
      }, {
        id: 29,
        title: 'ألمانيا',
        childPlaces: [],
      }, {
        id: 30,
        title: 'إيطاليا',
        childPlaces: [],
      }, {
        id: 31,
        title: 'البرتغال',
        childPlaces: [],
      }, {
        id: 32,
        title: 'إسبانيا',
        childPlaces: [],
      }, {
        id: 33,
        title: 'تركيا',
        childPlaces: [],
      }]
    }, {
      id: 34,
      title: 'أوقيانوسيا',
      childPlaces: [{
        id: 35,
        title: 'أستراليا',
        childPlaces: [],
      }, {
        id: 36,
        title: 'بورا بورا (بولينيزيا الفرنسية)',
        childPlaces: [],
      }, {
        id: 37,
        title: 'جزيرة القيامة (الشيلي)',
        childPlaces: [],
      }, {
        id: 38,
        title: 'فيجي',
        childPlaces: [],
      }, {
        id: 39,
        title: 'هاواي (ولايات متحدة الامريكية)',
        childPlaces: [],
      }, {
        id: 40,
        title: 'نيوزلندا',
        childPlaces: [],
      }, {
        id: 41,
        title: 'فانواتو',
        childPlaces: [],
      }]
    }]
  }, {
    id: 42,
    title: 'القمر',
    childPlaces: [{
      id: 43,
      title: 'ريتا',
      childPlaces: []
    }, {
      id: 44,
      title: 'بيكولوميني',
      childPlaces: []
    }, {
      id: 45,
      title: 'تايكو',
      childPlaces: []
    }]
  }, {
    id: 46,
    title: 'المريخ',
    childPlaces: [{
      id: 47,
      title: 'مدينة الذرة',
      childPlaces: []
    }, {
      id: 48,
      title: 'جرين هيل',
      childPlaces: []      
    }]
  }]
};
```

</Sandpack>

الآن لنفترض أنك تريد إضافة زر لحذف مكان زرته بالفعل. كيف ستقوم بذلك؟ [تحديث الحالة المتداخلة](/learn/updating-objects-in-state#updating-a-nested-object) يتطلب تحديث الحالة المتداخلة عمل نسخ للكائنات بدءًا من الجزء الذي تغيّر وصولاً إلى أكبر كائن أب. حذف مكان متداخل بعمق يتطلب نسخ السلسلة كاملة، وهذا يجعل الكود طويلاً جدًا

**إذا كانت الحالة متداخلة جدًا لدرجة يصعب تحديثها، فكر في جعلها مسطحة.** إليك طريقة لإعادة هيكلة البيانات: بدلاً من استخدام هيكل شجري حيث يحتوي كل عنصر على مصفوفة من العناصر الفرعية، يمكنك جعل كل عنصر يحتوي على مصفوفة من معرّفات (ids) العناصر الفرعية. ثم خزّن خريطة تربط كل معرّف عنصر بالمكان الفعلي المقابل له.

اعادة الهيكلة هذه قد تذكرك بجدول قاعدة البيانات:


<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ id, placesById }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      {childIds.length > 0 && (
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              placesById={placesById}
            />
          ))}
        </ol>
      )}
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);
  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>أماكن لزيارة</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            placesById={plan}
          />
        ))}
      </ol>
    </>
  );
}
```

```js src/places.js active
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'الأرض',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'افريقيا',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  }, 
  3: {
    id: 3,
    title: 'بوتسوانا',
    childIds: []
  },
  4: {
    id: 4,
    title: 'مصر',
    childIds: []
  },
  5: {
    id: 5,
    title: 'كينيا',
    childIds: []
  },
  6: {
    id: 6,
    title: 'مدغشقر',
    childIds: []
  }, 
  7: {
    id: 7,
    title: 'المغرب',
    childIds: []
  },
  8: {
    id: 8,
    title: 'نيجيريا',
    childIds: []
  },
  9: {
    id: 9,
    title: 'افريقيا',
    childIds: []
  },
  10: {
    id: 10,
    title: 'الأمريكتين',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],   
  },
  11: {
    id: 11,
    title: 'الأرجنتين',
    childIds: []
  },
  12: {
    id: 12,
    title: 'البرازيل',
    childIds: []
  },
  13: {
    id: 13,
    title: 'بربادوس',
    childIds: []
  }, 
  14: {
    id: 14,
    title: 'كندا',
    childIds: []
  },
  15: {
    id: 15,
    title: 'جامايكا',
    childIds: []
  },
  16: {
    id: 16,
    title: 'المكسيك',
    childIds: []
  },
  17: {
    id: 17,
    title: 'ترينيداد وتوباغو',
    childIds: []
  },
  18: {
    id: 18,
    title: 'فنزويلا',
    childIds: []
  },
  19: {
    id: 19,
    title: 'آسيا',
    childIds: [20, 21, 22, 23, 24, 25],   
  },
  20: {
    id: 20,
    title: 'الصين',
    childIds: []
  },
  21: {
    id: 21,
    title: 'الهند',
    childIds: []
  },
  22: {
    id: 22,
    title: 'سنغافورة',
    childIds: []
  },
  23: {
    id: 23,
    title: 'كوريا الجنوبية',
    childIds: []
  },
  24: {
    id: 24,
    title: 'تايلاند',
    childIds: []
  },
  25: {
    id: 25,
    title: 'فيتنام',
    childIds: []
  },
  26: {
    id: 26,
    title: 'أوروبا',
    childIds: [27, 28, 29, 30, 31, 32, 33],   
  },
  27: {
    id: 27,
    title: 'كرواتيا',
    childIds: []
  },
  28: {
    id: 28,
    title: 'فرنسا',
    childIds: []
  },
  29: {
    id: 29,
    title: 'ألمانيا',
    childIds: []
  },
  30: {
    id: 30,
    title: 'إيطاليا',
    childIds: []
  },
  31: {
    id: 31,
    title: 'البرتغال',
    childIds: []
  },
  32: {
    id: 32,
    title: 'إسبانيا',
    childIds: []
  },
  33: {
    id: 33,
    title: 'تركيا',
    childIds: []
  },
  34: {
    id: 34,
    title: 'أوقيانوسيا',
    childIds: [35, 36, 37, 38, 39, 40, 41],   
  },
  35: {
    id: 35,
    title: 'أستراليا',
    childIds: []
  },
  36: {
    id: 36,
    title: 'بورا بورا (بولينيزيا الفرنسية)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'جزيرة القيامة (الشيلي)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'فيجي',
    childIds: []
  },
  39: {
    id: 40,
    title: 'هاواي (ولايات متحدة الامريكية)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'نيوزلندا',
    childIds: []
  },
  41: {
    id: 41,
    title: 'فانواتو',
    childIds: []
  },
  42: {
    id: 42,
    title: 'القمر',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'ريتا',
    childIds: []
  },
  44: {
    id: 44,
    title: 'بيكولوميني',
    childIds: []
  },
  45: {
    id: 45,
    title: 'تايكو',
    childIds: []
  },
  46: {
    id: 46,
    title: 'المريخ',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'مدينة الذرة',
    childIds: []
  },
  48: {
    id: 48,
    title: 'جرين هيل',
    childIds: []
  }
};
```

</Sandpack>

**الآن بعد أن أصبحت الحالة "مسطحة" (المعروفة أيضًا بـ "المنظمة")، أصبح تحديث العناصر المتداخلة أسهل.**

لحذف مكان الآن، تحتاج فقط إلى تحديث مستويين من الحالة:

- يجب أن تُحدث النسخة المعدلة من المكان الأب لتستثني معرّف المكان المحذوف من مصفوفة `childIds`.
- يجب أن تتضمن النسخة المعدلة من كائن `table` الجذري النسخة المحدثة من المكان الأب.

إليك مثال على كيفية القيام بذلك:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);

  function handleComplete(parentId, childId) {
    const parent = plan[parentId];
   // أنشئ نسخة جديدة من المكان الأب
    // لا تشمل معرّف الطفل هذا.
    const nextParent = {
      ...parent,
      childIds: parent.childIds
        .filter(id => id !== childId)
    };
    // حدث الكائن "root"
    setPlan({
      ...plan,
      // ...لكي يتضمن النسخة المحدثة من المكان الأب.
      [parentId]: nextParent
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>أماكن لزيارة</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        انتهى
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}
```

```js src/places.js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'الأرض',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'افريقيا',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  }, 
  3: {
    id: 3,
    title: 'بوتسوانا',
    childIds: []
  },
  4: {
    id: 4,
    title: 'مصر',
    childIds: []
  },
  5: {
    id: 5,
    title: 'كينيا',
    childIds: []
  },
  6: {
    id: 6,
    title: 'مدغشقر',
    childIds: []
  }, 
  7: {
    id: 7,
    title: 'المغرب',
    childIds: []
  },
  8: {
    id: 8,
    title: 'نيجيريا',
    childIds: []
  },
  9: {
    id: 9,
    title: 'افريقيا',
    childIds: []
  },
  10: {
    id: 10,
    title: 'الأمريكتين',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],   
  },
  11: {
    id: 11,
    title: 'الأرجنتين',
    childIds: []
  },
  12: {
    id: 12,
    title: 'البرازيل',
    childIds: []
  },
  13: {
    id: 13,
    title: 'بربادوس',
    childIds: []
  }, 
  14: {
    id: 14,
    title: 'كندا',
    childIds: []
  },
  15: {
    id: 15,
    title: 'جامايكا',
    childIds: []
  },
  16: {
    id: 16,
    title: 'المكسيك',
    childIds: []
  },
  17: {
    id: 17,
    title: 'ترينيداد وتوباغو',
    childIds: []
  },
  18: {
    id: 18,
    title: 'فنزويلا',
    childIds: []
  },
  19: {
    id: 19,
    title: 'آسيا',
    childIds: [20, 21, 22, 23, 24, 25],   
  },
  20: {
    id: 20,
    title: 'الصين',
    childIds: []
  },
  21: {
    id: 21,
    title: 'الهند',
    childIds: []
  },
  22: {
    id: 22,
    title: 'سنغافورة',
    childIds: []
  },
  23: {
    id: 23,
    title: 'كوريا الجنوبية',
    childIds: []
  },
  24: {
    id: 24,
    title: 'تايلاند',
    childIds: []
  },
  25: {
    id: 25,
    title: 'فيتنام',
    childIds: []
  },
  26: {
    id: 26,
    title: 'أوروبا',
    childIds: [27, 28, 29, 30, 31, 32, 33],   
  },
  27: {
    id: 27,
    title: 'كرواتيا',
    childIds: []
  },
  28: {
    id: 28,
    title: 'فرنسا',
    childIds: []
  },
  29: {
    id: 29,
    title: 'ألمانيا',
    childIds: []
  },
  30: {
    id: 30,
    title: 'إيطاليا',
    childIds: []
  },
  31: {
    id: 31,
    title: 'البرتغال',
    childIds: []
  },
  32: {
    id: 32,
    title: 'إسبانيا',
    childIds: []
  },
  33: {
    id: 33,
    title: 'تركيا',
    childIds: []
  },
  34: {
    id: 34,
    title: 'أوقيانوسيا',
    childIds: [35, 36, 37, 38, 39, 40, 41],   
  },
  35: {
    id: 35,
    title: 'أستراليا',
    childIds: []
  },
  36: {
    id: 36,
    title: 'بورا بورا (بولينيزيا الفرنسية)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'جزيرة القيامة (الشيلي)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'فيجي',
    childIds: []
  },
  39: {
    id: 39,
    title: 'هاواي (ولايات متحدة الامريكية)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'نيوزلندا',
    childIds: []
  },
  41: {
    id: 41,
    title: 'فانواتو',
    childIds: []
  },
  42: {
    id: 42,
    title: 'القمر',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'ريتا',
    childIds: []
  },
  44: {
    id: 44,
    title: 'بيكولوميني',
    childIds: []
  },
  45: {
    id: 45,
    title: 'تايكو',
    childIds: []
  },
  46: {
    id: 46,
    title: 'المريخ',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'مدينة الذرة',
    childIds: []
  },
  48: {
    id: 48,
    title: 'جرين هيل',
    childIds: []
  }
};
```

```css
button { margin: 10px; }
```

</Sandpack>

يمكنك تداخل الحالة بقدر ما ترغب، ولكن جعلها "مسطحة" يمكن أن يحل العديد من المشكلات. فهي تجعل تحديث الحالة أسهل، وتساعد على التأكد من عدم وجود تكرار في أجزاء مختلفة من كائن متداخل.


<DeepDive>

#### تحسين من استغلال ذاكرة الوصول العشوائي {/*improving-memory-usage*/}

من المثالي أيضًا أن تقوم بإزالة العناصر المحذوفة (وأطفالها!) من كائن "الجدول" لتحسين استخدام الذاكرة. هذه النسخة تقوم بذلك. كما أنها [تستعمل خاصية Immer](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) to make the update logic more concise.
لتجعل تحديث المنطق اكثر دقة

<Sandpack>

```js
import { useImmer } from 'use-immer';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, updatePlan] = useImmer(initialTravelPlan);

  function handleComplete(parentId, childId) {
    updatePlan(draft => {
      // إزالة من معرّفات الأطفال للمكان الأب.
      const parent = draft[parentId];
      parent.childIds = parent.childIds
        .filter(id => id !== childId);

      // انسَ هذا المكان وجميع أجزائه الفرعية.
      deleteAllChildren(childId);
      function deleteAllChildren(id) {
        const place = draft[id];
        place.childIds.forEach(deleteAllChildren);
        delete draft[id];
      }
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>أماكن لزيارة</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        انتهى
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}
```

```js src/places.js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'الأرض',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'افريقيا',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  }, 
  3: {
    id: 3,
    title: 'بوتسوانا',
    childIds: []
  },
  4: {
    id: 4,
    title: 'مصر',
    childIds: []
  },
  5: {
    id: 5,
    title: 'كينيا',
    childIds: []
  },
  6: {
    id: 6,
    title: 'مدغشقر',
    childIds: []
  }, 
  7: {
    id: 7,
    title: 'المغرب',
    childIds: []
  },
  8: {
    id: 8,
    title: 'نيجيريا',
    childIds: []
  },
  9: {
    id: 9,
    title: 'افريقيا',
    childIds: []
  },
  10: {
    id: 10,
    title: 'الأمريكتين',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],   
  },
  11: {
    id: 11,
    title: 'الأرجنتين',
    childIds: []
  },
  12: {
    id: 12,
    title: 'البرازيل',
    childIds: []
  },
  13: {
    id: 13,
    title: 'بربادوس',
    childIds: []
  }, 
  14: {
    id: 14,
    title: 'كندا',
    childIds: []
  },
  15: {
    id: 15,
    title: 'جامايكا',
    childIds: []
  },
  16: {
    id: 16,
    title: 'المكسيك',
    childIds: []
  },
  17: {
    id: 17,
    title: 'ترينيداد وتوباغو',
    childIds: []
  },
  18: {
    id: 18,
    title: 'فنزويلا',
    childIds: []
  },
  19: {
    id: 19,
    title: 'آسيا',
    childIds: [20, 21, 22, 23, 24, 25,],   
  },
  20: {
    id: 20,
    title: 'الصين',
    childIds: []
  },
  21: {
    id: 21,
    title: 'الهند',
    childIds: []
  },
  22: {
    id: 22,
    title: 'سنغافورة',
    childIds: []
  },
  23: {
    id: 23,
    title: 'كوريا الجنوبية',
    childIds: []
  },
  24: {
    id: 24,
    title: 'تايلاند',
    childIds: []
  },
  25: {
    id: 25,
    title: 'فيتنام',
    childIds: []
  },
  26: {
    id: 26,
    title: 'أوروبا',
    childIds: [27, 28, 29, 30, 31, 32, 33],   
  },
  27: {
    id: 27,
    title: 'كرواتيا',
    childIds: []
  },
  28: {
    id: 28,
    title: 'فرنسا',
    childIds: []
  },
  29: {
    id: 29,
    title: 'ألمانيا',
    childIds: []
  },
  30: {
    id: 30,
    title: 'إيطاليا',
    childIds: []
  },
  31: {
    id: 31,
    title: 'البرتغال',
    childIds: []
  },
  32: {
    id: 32,
    title: 'إسبانيا',
    childIds: []
  },
  33: {
    id: 33,
    title: 'تركيا',
    childIds: []
  },
  34: {
    id: 34,
    title: 'أوقيانوسيا',
    childIds: [35, 36, 37, 38, 39, 40,, 41],   
  },
  35: {
    id: 35,
    title: 'أستراليا',
    childIds: []
  },
  36: {
    id: 36,
    title: 'بورا بورا (بولينيزيا الفرنسية)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'جزيرة القيامة (الشيلي)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'فيجي',
    childIds: []
  },
  39: {
    id: 39,
    title: 'هاواي (ولايات متحدة الامريكية)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'نيوزلندا',
    childIds: []
  },
  41: {
    id: 41,
    title: 'فانواتو',
    childIds: []
  },
  42: {
    id: 42,
    title: 'القمر',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'ريتا',
    childIds: []
  },
  44: {
    id: 44,
    title: 'بيكولوميني',
    childIds: []
  },
  45: {
    id: 45,
    title: 'تايكو',
    childIds: []
  },
  46: {
    id: 46,
    title: 'المريخ',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'مدينة الذرة',
    childIds: []
  },
  48: {
    id: 48,
    title: 'جرين هيل',
    childIds: []
  }
};
```

```css
button { margin: 10px; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

</DeepDive>

في بعض الأحيان، يمكنك تقليل تداخل الحالة عن طريق نقل بعض الحالات المتداخلة إلى المكونات الفرعية. هذه الطريقة مفيدة لحالات واجهة المستخدم المؤقتة التي لا تحتاج إلى تخزين، مثل حالة تمرير الماوس فوق عنصر


<Recap>

* إذا كانت متغيرات الحالة تتغير دائمًا معًا، فكر في دمجها في متغير واحد.
* اختر متغيرات الحالة بعناية لتجنب إنشاء حالات مستحيلة.
* نظم حالتك بطريقة تقلل من فرص ارتكاب الأخطاء أثناء تحديثها.
* تجنب الحالة الزائدة والتكرار حتى لا تحتاج إلى مزامنتها.
* لا تضع الخصائص في الحالة إلا إذا كنت ترغب تحديدًا في منع التحديثات.
* لأنماط واجهة المستخدم مثل الاختيار، احتفظ بالمعرّف أو الفهرس في الحالة بدلاً من الكائن نفسه.
* إذا كان تحديث الحالة المتداخلة بعمق معقدًا، جرب تسويتها.

</Recap>

<Challenges>

#### إصلاح مكون لا يتم تحديثه {/*fix-a-component-thats-not-updating*/}

المكون التالي `Clock` يستقبل خاصيتين: `color` و `time`.
عندما تختار لون مختلف في صندوق الاختيار, المكون `Clock` يستقبل خاصية `color` مختلفة من مكون الأب. ولكن لسبب ما, اللون المعروض لا يتم تحديثه. لماذا؟ قم بحل المشكلة.


<Sandpack>

```js src/Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  const [color, setColor] = useState(props.color);
  return (
    <h1 style={{ color: color }}>
      {props.time}
    </h1>
  );
}
```

```js src/App.js hidden
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
        اختر لونا:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">مرجاني</option>
          <option value="midnightblue"> أزرق منتصف الليل </option>
          <option value="rebeccapurple">البنفسجي الريبيكا</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

<Solution>

المشكلة هي أن هذا المكون يحتوي على حالة `color` التي تم تهيئتها بالقيمة الأولية لخاصية `color`. لكن عندما تتغير خاصية `color`، فإن هذا التغيير لا يؤثر على متغير الحالة، مما يتسبب في فقدان التزامن بينهما. لحل هذه المشكلة، قم بحذف متغير الحالة تمامًا، واستخدم خاصية `color` مباشرة.

<Sandpack>

```js src/Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  return (
    <h1 style={{ color: props.color }}>
      {props.time}
    </h1>
  );
}
```

```js src/App.js hidden
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
        اختر لونا:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">مرجاني</option>
          <option value="midnightblue"> أزرق منتصف الليل </option>
          <option value="rebeccapurple">البنفسجي الريبيكا</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

أو، باستخدام syntax للتفكيك:

<Sandpack>

```js src/Clock.js active
import { useState } from 'react';

export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js src/App.js hidden
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
        اختر لونا:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">مرجاني</option>
          <option value="midnightblue"> أزرق منتصف الليل </option>
          <option value="rebeccapurple">البنفسجي الريبيكا</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

</Solution>

#### أصلح قائمة تعبئة معطلة {/*fix-a-broken-packing-list*/}

تحتوي قائمة التعبئة هذه على تذييل يعرض عدد العناصر التي تم تعبئتها وعدد العناصر الإجمالي. تبدو القائمة تعمل بشكل جيد في البداية، لكن بها أخطاء. على سبيل المثال، إذا قمت بوضع علامة على عنصر كـ "معبأ" ثم قمت بحذفه، فلن يتم تحديث العدّاد بشكل صحيح. قم بإصلاح العدّاد ليظل دقيقًا دائمًا.

<Hint>

هل هناك أي حالة في هذا المثال مكررة؟

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'جوارب دافئة', packed: true },
  { id: 1, title: 'دفتر السفر', packed: false },
  { id: 2, title: 'ألوان مائية', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(3);
  const [packed, setPacked] = useState(1);

  function handleAddItem(title) {
    setTotal(total + 1);
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    if (nextItem.packed) {
      setPacked(packed + 1);
    } else {
      setPacked(packed - 1);
    }
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setTotal(total - 1);
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>  
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>{packed} من أصل {total} تم تعبئته!</b>
    </>
  );
}
```

```js src/AddItem.js hidden
import { useState } from 'react';

export default function AddItem({ onAddItem }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add item"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddItem(title);
      }}>أضف</button>
    </>
  )
}
```

```js src/PackingList.js hidden
import { useState } from 'react';

export default function PackingList({
  items,
  onChangeItem,
  onDeleteItem
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={e => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked
                });
              }}
            />
            {' '}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>
            احذف
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

بالرغم من أنه يمكنك تعديل كل معالج حدث بعناية لتحديث العدادات `total` و `packed` بشكل صحيح، إلا أن المشكلة الأساسية هي أن هذه المتغيرات الحالة موجودة أصلاً. فهي مكررة لأنه يمكنك دائمًا حساب عدد العناصر (المعبأة أو الكلية) من مصفوفة `items` نفسها. قم بإزالة الحالة المكررة لإصلاح الخطأ:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'جوارب دافئة', packed: true },
  { id: 1, title: 'دفتر السفر', packed: false },
  { id: 2, title: 'ألوان مائية', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);

  const total = items.length;
  const packed = items
    .filter(item => item.packed)
    .length;

  function handleAddItem(title) {
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>  
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>{packed} من أصل {total} تم تعبئته!</b>
    </>
  );
}
```

```js src/AddItem.js hidden
import { useState } from 'react';

export default function AddItem({ onAddItem }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add item"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddItem(title);
      }}>أضف</button>
    </>
  )
}
```

```js src/PackingList.js hidden
import { useState } from 'react';

export default function PackingList({
  items,
  onChangeItem,
  onDeleteItem
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={e => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked
                });
              }}
            />
            {' '}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>
            احذف
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

لاحظ كيف أن معالجات الأحداث تهتم فقط باستدعاء `setItems` بعد هذا التغيير. يتم الآن حساب أعداد العناصر خلال التحديث التالي من `items`، لذا فهي دائمًا محدثة.

</Solution>

#### اصلح اختفاء الاختيارات {/*fix-the-disappearing-selection*/}

توجد قائمة من letters (رسائل) في الحالة. عندما تمرر الماوس فوق رسالة معينة أو تركز عليها، يتم تمييزها. الرسالة المميزة حاليًا يتم تخزينها في متغير الحالة highlightedLetter. يمكنك "تمييز" و"إلغاء تمييز" الرسائل الفردية، مما يؤدي إلى تحديث مصفوفة letters في الحالة.

يعمل هذا الكود، ولكن هناك خلل بسيط في واجهة المستخدم. عندما تضغط على "تمييز" أو "إلغاء تمييز"، يختفي التمييز للحظة. ومع ذلك، يظهر مرة أخرى بمجرد أن تحرك المؤشر أو تنتقل إلى رسالة أخرى باستخدام لوحة المفاتيح. لماذا يحدث هذا؟ قم بإصلاح المشكلة بحيث لا يختفي التمييز بعد النقر على الزر.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedLetter, setHighlightedLetter] = useState(null);

  function handleHover(letter) {
    setHighlightedLetter(letter);
  }

  function handleStar(starred) {
    setLetters(letters.map(letter => {
      if (letter.id === starred.id) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2>البريد الوارد</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter === highlightedLetter
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter);        
      }}
      onPointerMove={() => {
        onHover(letter);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter);
      }}>
        {letter.isStarred ? 'الغاء تمييز' : 'مميز'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js src/data.js
export const initialLetters = [{
  id: 0,
  subject: 'مستعد للمغامرة؟',
  isStarred: true,
}, {
  id: 1,
  subject: 'حان وقت التسجيل!',
  isStarred: false,
}, {
  id: 2,
  subject: 'المهرجان يبدأ خلال سبعة أيام فقط!',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

<Solution>

المشكلة هي أنك تحتفظ بكائن الحرف في متغير الحالة `highlightedLetter`. ولكنك أيضًا تحتفظ بنفس المعلومات في مصفوفة `الحروف`. لذا، هناك تكرار في الحالة! عندما تقوم بتحديث مصفوفة `الحروف` بعد النقر على الزر، تقوم بإنشاء كائن حرف جديد يختلف عن `highlightedLetter`. وهذا هو سبب عدم تطابق شرط `highlightedLetter === letter`، مما يؤدي إلى اختفاء التمييز. يظهر التمييز مرة أخرى في المرة التالية التي تستدعي فيها `setHighlightedLetter` عندما يتحرك المؤشر.

لحل المشكلة، قم بإزالة التكرار من الحالة. بدلاً من تخزين *الحرف نفسه* في مكانين، قم بتخزين `highlightedId` فقط. ثم يمكنك التحقق من `isHighlighted` لكل حرف باستخدام `letter.id === highlightedId`، وهذا سيعمل حتى إذا كان كائن `letter` قد تغير منذ آخر عملية عرض.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedId, setHighlightedId ] = useState(null);

  function handleHover(letterId) {
    setHighlightedId(letterId);
  }

  function handleStar(starredId) {
    setLetters(letters.map(letter => {
      if (letter.id === starredId) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2> البريد الوارد</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter.id === highlightedId
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter.id);        
      }}
      onPointerMove={() => {
        onHover(letter.id);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter.id);
      }}>
        {letter.isStarred ? 'الغاء تمييز' : 'مميز'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js src/data.js
export const initialLetters = [{
  id: 0,
  subject: 'هل انت مستعد للمغامرة?',
  isStarred: true,
}, {
  id: 1,
  subject: 'حان الوقت لتسجيل',
  isStarred: false,
}, {
  id: 2,
  subject: 'المهرجان يبدأ في سبع أيام',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

</Solution>

#### تنفيذ التحديد المتعدد {/*implement-multiple-selection*/}

في هذا المثال، كل رسالة `Letter` تحتوي على خاصية `isSelected` ومعالج `onToggle` الذي يميزها كمحددة. يعمل هذا بشكل جيد، لكن الحالة مخزنة كـ `selectedId` (إما `null` أو معرف `id`)، لذا يمكن تحديد رسالة واحدة فقط في أي وقت.

غيّر هيكل الحالة لدعم التحديد المتعدد. (كيف ستقوم بهيكلته؟ فكّر في ذلك قبل كتابة الشيفرة.) يجب أن يصبح كل مربع اختيار مستقل عن الآخرين. النقر على رسالة محددة يجب أن يزيل التحديد منها. أخيرًا، يجب أن يظهر التذييل عدد العناصر المحددة بشكل صحيح.


<Hint>

بدلاً من استخدام معرف ID واحد فقط، يمكنك الاحتفاظ بمصفوفة أو [مجموعة](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) من المعرفات (IDs) المختارة في الحالة.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedId, setSelectedId] = useState(null);

  // TODO: allow multiple selection
  const selectedCount = 1;

  function handleToggle(toggledId) {
    // TODO: allow multiple selection
    setSelectedId(toggledId);
  }

  return (
    <>
      <h2>البريد الوارد</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              // TODO: allow multiple selection
              letter.id === selectedId
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            لقد أخترت {selectedCount} رسالة
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'تم اختياره' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js src/data.js
export const letters = [{
  id: 0,
  subject: 'مستعد للمغامرة؟',
  isStarred: true,
}, {
  id: 1,
  subject: 'حان وقت التسجيل!',
  isStarred: false,
}, {
  id: 2,
  subject: 'المهرجان يبدأ خلال سبعة أيام فقط!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

<Solution>

بدلاً من استخدام `selectedId` واحد، احتفظ بمصفوفة `selectedIds` في الحالة. على سبيل المثال، إذا قمت بتحديد الحرف الأول والأخير، فإنها ستحتوي على `[0, 2]`. عندما لا يكون هناك أي تحديد، ستكون المصفوفة فارغة `[]`.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState([]);

  const selectedCount = selectedIds.length;

  function handleToggle(toggledId) {
    // Was it previously selected?
    if (selectedIds.includes(toggledId)) {
      // Then remove this ID from the array.
      setSelectedIds(selectedIds.filter(id =>
        id !== toggledId
      ));
    } else {
      // Otherwise, add this ID to the array.
      setSelectedIds([
        ...selectedIds,
        toggledId
      ]);
    }
  }

  return (
    <>
      <h2>البريد الوارد</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.includes(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            لقد أخترت {selectedCount} رسالة
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'تم اختياره' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js src/data.js
export const letters = [{
  id: 0,
  subject: 'مستعد للمغامرة؟',
  isStarred: true,
}, {
  id: 1,
  subject: 'حان وقت التسجيل!',
  isStarred: false,
}, {
  id: 2,
  subject: 'المهرجان يبدأ خلال سبعة أيام فقط!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

إحدى العيوب الصغيرة لاستخدام المصفوفة هي أنه لكل عنصر، تقوم بالتحقق من `selectedIds.includes(letter.id)` لمعرفة ما إذا كان محددًا. إذا كانت المصفوفة كبيرة جدًا، فقد يصبح هذا مشكلة في الأداء لأن البحث في المصفوفة باستخدام [`includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) يستغرق وقتًا خطيًا، وأنت تقوم بهذا البحث لكل عنصر على حدة.

لحل هذه المشكلة، يمكنك استخدام [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) في الحالة بدلاً من ذلك، حيث يوفر عملية [`has()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has) سريعة.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState(
    new Set()
  );

  const selectedCount = selectedIds.size;

  function handleToggle(toggledId) {
    // Create a copy (to avoid mutation).
    const nextIds = new Set(selectedIds);
    if (nextIds.has(toggledId)) {
      nextIds.delete(toggledId);
    } else {
      nextIds.add(toggledId);
    }
    setSelectedIds(nextIds);
  }

  return (
    <>
      <h2>البريد الوارد</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.has(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            لقد أخترت {selectedCount} رسالة
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'تم اختياره' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js src/data.js
export const letters = [{
  id: 0,
  subject: 'مستعد للمغامرة؟',
  isStarred: true,
}, {
  id: 1,
  subject: 'حان وقت التسجيل!',
  isStarred: false,
}, {
  id: 2,
  subject: 'المهرجان يبدأ خلال سبعة أيام فقط!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

الآن، يقوم كل عنصر بالتحقق من `selectedIds.has(letter.id)`، وهو أمر سريع جدًا.

تذكر أنه [ينبغي عليك عدم تغيير الكائنات في الحالة](https://reactjs.org/docs/handling-events.html#updating-objects-in-state)، وهذا يشمل Sets أيضًا. لذلك، تقوم دالة `handleToggle` بإنشاء *نسخة* من الـ Set أولاً، ثم تقوم بتحديث تلك النسخة.

</Solution>

</Challenges>
