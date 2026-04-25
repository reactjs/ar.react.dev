---
title: اختيار هيكلة الحالة
---

<Intro>

هيكلة الحالة جيدًا قد يفرق بين مكوّن مريح التعديل والتصحيح، ومكوّن يكون مصدرًا دائمًا للأخطاء. إليك بعض النصائح التي يفضل مراعاتها عند هيكلة الحالة.

</Intro>

<YouWillLearn>

* متى تستخدم متغير حالة واحدًا مقابل عدة متغيرات
* ما الذي يجب تجنبه عند تنظيم الحالة
* كيف تعالج مشكلات شائعة في هيكلة الحالة

</YouWillLearn>

## مبادئ هيكلة الحالة {/*principles-for-structuring-state*/}

عند كتابة مكوّن يحتفظ بحالة، ستختار عدد متغيرات الحالة وشكل بياناتها. وإن أمكن كتابة برامج صحيحة حتى بهيكلة دون المثلى، فهناك مبادئ توجهك لخيارات أفضل:

1. **جمّع الحالة المترابطة.** إذا حدّثت دائمًا متغيري حالة أو أكثر معًا، ففكّر بدمجها في متغير حالة واحد.
2. **تجنب التناقض في الحالة.** عندما تُهيكَل الحالة بحيث قد تتعارض قطع متعددة وتتنازع، تترك مجالًا للأخطاء. حاول تجنب ذلك.
3. **تجنب الحالة الزائدة.** إذا استطعت حساب معلومة من خصائص المكوّن أو متغيرات حالته أثناء العرض، فلا تضع تلك المعلومة في حالة المكوّن.
4. **تجنب التكرار في الحالة.** عند تكرار نفس البيانات بين متغيرات حالة أو داخل كائنات متداخلة، يصعب إبقاؤها متزامنة. قلل التكرار عندما يمكن.
5. **تجنب التعمق الشديد في الحالة.** الحالة الهرمية العميقة غير مريحة للتحديث. إن أمكن، فضّل هيكلة مسطحة.

الهدف من هذه المبادئ هو *جعل الحالة سهلة التحديث دون إدخال أخطاء*. إزالة البيانات الزائدة والمكررة من الحالة تساعد على بقاء أجزائها متزامنة. هذا يشبه ما قد يريده مهندس قواعد بيانات من [«تطبيع» هيكل قاعدة البيانات](https://docs.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description) لتقليل احتمال الأخطاء. بإعادة صياغة قول أينشتاين: **«اجعل حالتك بسيطة قدر الإمكان—ولا أبسط من ذلك.»**

فلنرَ كيف تُطبَّق هذه المبادئ عمليًا.

## تجميع الحالة المترابطة {/*group-related-state*/}

قد تتردد أحيانًا بين متغير حالة واحد أو عدة متغيرات.

هل تفعل هذا؟

```js
const [x, setX] = useState(0);
const [y, setY] = useState(0);
```

أم هذا؟

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

تقنيًا يمكنك أيًا من الأسلوبين. لكن **إذا تغيّر متغيرا حالة معًا دائمًا، فقد يكون من الحكمة دمجهما في متغير حالة واحد.** حتى لا تنسى إبقاءهما متزامنين، كهذا المثال حيث تحريك المؤشر يحدّث إحداثيي النقطة الحمراء معًا:

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

حالة أخرى تُجمّع فيها البيانات في كائن أو مصفوفة هي عندما لا تعرف كم قطعة حالة تحتاج. مثلاً عند نموذج يمكن للمستخدم إضافة حقول مخصصة إليه.

<Pitfall>

إذا كان متغير الحالة كائنًا، تذكر أنه [لا يمكنك تحديث حقل واحد فقط فيه](/learn/updating-objects-in-state) دون نسخ الحقول الأخرى صراحة. مثلاً لا يمكنك `setPosition({ x: 100 })` في المثال أعلاه لأن الكائن لن يحتوي خاصية `y` أصلًا! بدلًا من ذلك، لضبط `x` وحدها، إما `setPosition({ ...position, x: 100 })`، أو تقسيمهما إلى متغيري حالة و`setX(100)`.

</Pitfall>

## تجنب التناقض في الحالة {/*avoid-contradictions-in-state*/}

إليك نموذج ملاحظات فندق بمتغيري حالة `isSending` و`isSent`:

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
    return <h1>Thanks for feedback!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>How was your stay at The Prancing Pony?</p>
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
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

// Pretend to send a message.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

</Sandpack>

هذا الكود يعمل، لكنه يترك بابًا لحالات «مستحيلة». مثلاً إذا نسيت استدعاء `setIsSent` و`setIsSending` معًا، قد تصل لحيث `isSending` و`isSent` كلاهما `true` معًا. كلما زاد تعقيد المكوّن، ازداد صعوبة فهم ما حدث.

**بما أن `isSending` و`isSent` لا يجب أن يكونا `true` معًا، من الأفضل استبدالهما بمتغير حالة `status` واحد يأخذ واحدة من *ثلاث* حالات صالحة:** `'typing'` (ابتدائي)، و`'sending'`، و`'sent'`:

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
    return <h1>Thanks for feedback!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>How was your stay at The Prancing Pony?</p>
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
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

// Pretend to send a message.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

</Sandpack>

يمكنك الإبقاء على ثوابت للقراءة:

```js
const isSending = status === 'sending';
const isSent = status === 'sent';
```

لكنها ليست متغيرات حالة، فلا تقلق من تزامنها مع بعضها.

## تجنب الحالة الزائدة {/*avoid-redundant-state*/}

إذا استطعت حساب معلومة من خصائص المكوّن أو متغيرات حالته أثناء العرض، **فلا** تضع تلك المعلومة في حالة المكوّن.

خذ هذا النموذج. يعمل، لكن هل تجد حالة زائدة فيه؟

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
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

لهذا النموذج ثلاثة متغيرات حالة: `firstName` و`lastName` و`fullName`. لكن `fullName` زائد. **يمكنك دائمًا حساب `fullName` من `firstName` و`lastName` أثناء العرض، فأزله من الحالة.**

هكذا يمكن فعل ذلك:

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
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

هنا `fullName` *ليس* متغير حالة. بل يُحسب أثناء العرض:

```js
const fullName = firstName + ' ' + lastName;
```

لذلك لا تحتاج معالجات التغيير لفعل شيء خاص لتحديثه. عند استدعاء `setFirstName` أو `setLastName`، يُعاد العرض ثم يُحسب `fullName` التالي من البيانات الجديدة.

<DeepDive>

#### لا تعكس الخصائص في الحالة {/*don-t-mirror-props-in-state*/}

مثال شائع للحالة الزائدة هو كود كهذا:

```js
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
```

هنا متغير حالة `color` يُهيأ من خاصية `messageColor`. المشكلة أن **إذا مرّر المكوّن الأب قيمة مختلفة لـ`messageColor` لاحقًا (مثلاً `'red'` بدل `'blue'`)، فلن يُحدَّث متغير الحالة `color`!** الحالة تُهيأ فقط في العرض الأول.

لذلك قد يؤدي «عكس» خاصية في متغير حالة إلى لبس. استخدم خاصية `messageColor` مباشرة. إن أردت اسمًا أقصر، استخدم ثابتًا:

```js
function Message({ messageColor }) {
  const color = messageColor;
```

بهذا لا يخرج عن تزامن مع الخاصية القادمة من الأب.

«عكس» الخصائص إلى الحالة يكون منطقيًا فقط عندما *تريد* تجاهل كل التحديثات لخاصية معيّنة. وفق العرف، ابدأ اسم الخاصية بـ`initial` أو `default` ليوضح أن القيم الجديدة تُتجاهل:

```js
function Message({ initialColor }) {
  // The `color` state variable holds the *first* value of `initialColor`.
  // Further changes to the `initialColor` prop are ignored.
  const [color, setColor] = useState(initialColor);
```

</DeepDive>

## تجنب التكرار في الحالة {/*avoid-duplication-in-state*/}

مكوّن قائمة القائمة هذا يتيح اختيار وجبة خفيفة واحدة للسفر من بين عدة خيارات:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  return (
    <>
      <h2>What's your travel snack?</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.title}
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

حاليًا، يخزّن العنصر المختار ككائن في متغير الحالة `selectedItem`. وهذا ليس مثاليًا: **محتوى `selectedItem` هو نفس كائن أحد العناصر داخل قائمة `items`.** أي أن معلومات العنصر نفسها مكررة في مكانين.

لماذا هذه مشكلة؟ لنجعل كل عنصر قابلًا للتعديل:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
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
      <h2>What's your travel snack?</h2> 
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
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

لاحظ أنه إذا ضغطت «Choose» على عنصر *ثم* عدّلته، **يتحدث الحقل لكن التسمية في الأسفل لا تعكس التعديلات.** لأن الحالة مكررة ونسيت تحديث `selectedItem`.

رغم أنك قد تحدّث `selectedItem` أيضًا، فإزالة التكرار أبسط. في هذا المثال، بدل كائن `selectedItem` (الذي يكرر كائنًا داخل `items`)، احتفظ بـ`selectedId` في الحالة، *ثم* احصل على `selectedItem` بالبحث في `items` عن عنصر بهذا المعرّف:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
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
      <h2>What's your travel snack?</h2>
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
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

كانت الحالة مكررة هكذا:

* `items = [{ id: 0, title: 'pretzels'}, ...]`
* `selectedItem = {id: 0, title: 'pretzels'}`

وبعد التغيير أصبحت هكذا:

* `items = [{ id: 0, title: 'pretzels'}, ...]`
* `selectedId = 0`

ذهب التكرار وبقيت الحالة الجوهرية فقط!

الآن إذا عدّلت العنصر *المختار*، تتحدّث الرسالة في الأسفل فورًا. لأن `setItems` يُعيد العرض، و`items.find(...)` يجد العنصر بالعنوان المحدّث. لم تحتج لحفظ *العنصر المختار* في الحالة، لأن *معرّف الاختيار* وحده جوهري. الباقي يُحسب أثناء العرض.

## تجنب التعمق الشديد في الحالة {/*avoid-deeply-nested-state*/}

تخيّل خطة سفر تتكون من كواكب وقارات ودول. قد يغريك هيكلة حالتها بكائنات ومصفوفات متداخلة، كهذا المثال:

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
      <h2>Places to visit</h2>
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
    title: 'Earth',
    childPlaces: [{
      id: 2,
      title: 'Africa',
      childPlaces: [{
        id: 3,
        title: 'Botswana',
        childPlaces: []
      }, {
        id: 4,
        title: 'Egypt',
        childPlaces: []
      }, {
        id: 5,
        title: 'Kenya',
        childPlaces: []
      }, {
        id: 6,
        title: 'Madagascar',
        childPlaces: []
      }, {
        id: 7,
        title: 'Morocco',
        childPlaces: []
      }, {
        id: 8,
        title: 'Nigeria',
        childPlaces: []
      }, {
        id: 9,
        title: 'South Africa',
        childPlaces: []
      }]
    }, {
      id: 10,
      title: 'Americas',
      childPlaces: [{
        id: 11,
        title: 'Argentina',
        childPlaces: []
      }, {
        id: 12,
        title: 'Brazil',
        childPlaces: []
      }, {
        id: 13,
        title: 'Barbados',
        childPlaces: []
      }, {
        id: 14,
        title: 'Canada',
        childPlaces: []
      }, {
        id: 15,
        title: 'Jamaica',
        childPlaces: []
      }, {
        id: 16,
        title: 'Mexico',
        childPlaces: []
      }, {
        id: 17,
        title: 'Trinidad and Tobago',
        childPlaces: []
      }, {
        id: 18,
        title: 'Venezuela',
        childPlaces: []
      }]
    }, {
      id: 19,
      title: 'Asia',
      childPlaces: [{
        id: 20,
        title: 'China',
        childPlaces: []
      }, {
        id: 21,
        title: 'India',
        childPlaces: []
      }, {
        id: 22,
        title: 'Singapore',
        childPlaces: []
      }, {
        id: 23,
        title: 'South Korea',
        childPlaces: []
      }, {
        id: 24,
        title: 'Thailand',
        childPlaces: []
      }, {
        id: 25,
        title: 'Vietnam',
        childPlaces: []
      }]
    }, {
      id: 26,
      title: 'Europe',
      childPlaces: [{
        id: 27,
        title: 'Croatia',
        childPlaces: [],
      }, {
        id: 28,
        title: 'France',
        childPlaces: [],
      }, {
        id: 29,
        title: 'Germany',
        childPlaces: [],
      }, {
        id: 30,
        title: 'Italy',
        childPlaces: [],
      }, {
        id: 31,
        title: 'Portugal',
        childPlaces: [],
      }, {
        id: 32,
        title: 'Spain',
        childPlaces: [],
      }, {
        id: 33,
        title: 'Turkey',
        childPlaces: [],
      }]
    }, {
      id: 34,
      title: 'Oceania',
      childPlaces: [{
        id: 35,
        title: 'Australia',
        childPlaces: [],
      }, {
        id: 36,
        title: 'Bora Bora (French Polynesia)',
        childPlaces: [],
      }, {
        id: 37,
        title: 'Easter Island (Chile)',
        childPlaces: [],
      }, {
        id: 38,
        title: 'Fiji',
        childPlaces: [],
      }, {
        id: 39,
        title: 'Hawaii (the USA)',
        childPlaces: [],
      }, {
        id: 40,
        title: 'New Zealand',
        childPlaces: [],
      }, {
        id: 41,
        title: 'Vanuatu',
        childPlaces: [],
      }]
    }]
  }, {
    id: 42,
    title: 'Moon',
    childPlaces: [{
      id: 43,
      title: 'Rheita',
      childPlaces: []
    }, {
      id: 44,
      title: 'Piccolomini',
      childPlaces: []
    }, {
      id: 45,
      title: 'Tycho',
      childPlaces: []
    }]
  }, {
    id: 46,
    title: 'Mars',
    childPlaces: [{
      id: 47,
      title: 'Corn Town',
      childPlaces: []
    }, {
      id: 48,
      title: 'Green Hill',
      childPlaces: []      
    }]
  }]
};
```

</Sandpack>

لنقل تريد زرًا لحذف مكان زرته بالفعل. كيف تفعل؟ [تحديث الحالة المتداخلة](/learn/updating-objects-in-state#updating-a-nested-object) يتطلب نسخ الكائنات صعودًا من الجزء الذي تغيّر. حذف مكان عميق التداخل يعني نسخ سلسلة الآباء كاملة. قد يصبح الكود طويلًا جدًا.

**إذا كانت الحالة متداخلة أكثر مما يسهل تحديثها، ففكّر بتسطيحها.** إليك إعادة هيكلة للبيانات. بدل شجرة حيث لكل `place` مصفوفة من *أماكنه الفرعية*، يمكن لكل مكان أن يحتفظ بمصفوفة من *معرّفات أماكنه الفرعية*. ثم خزّن خريطة من كل معرّف مكان إلى المكان نفسه.

قد تذكّرك إعادة الهيكلة هذه بجدول قاعدة بيانات:

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
      <h2>Places to visit</h2>
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
    title: 'Earth',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Africa',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  }, 
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egypt',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenya',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  }, 
  7: {
    id: 7,
    title: 'Morocco',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigeria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'South Africa',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Americas',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],   
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brazil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  }, 
  14: {
    id: 14,
    title: 'Canada',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Mexico',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinidad and Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Asia',
    childIds: [20, 21, 22, 23, 24, 25],   
  },
  20: {
    id: 20,
    title: 'China',
    childIds: []
  },
  21: {
    id: 21,
    title: 'India',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapore',
    childIds: []
  },
  23: {
    id: 23,
    title: 'South Korea',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Thailand',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Vietnam',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Europe',
    childIds: [27, 28, 29, 30, 31, 32, 33],   
  },
  27: {
    id: 27,
    title: 'Croatia',
    childIds: []
  },
  28: {
    id: 28,
    title: 'France',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Germany',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Italy',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Portugal',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Spain',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Turkey',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Oceania',
    childIds: [35, 36, 37, 38, 39, 40, 41],   
  },
  35: {
    id: 35,
    title: 'Australia',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Bora Bora (French Polynesia)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Easter Island (Chile)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Fiji',
    childIds: []
  },
  39: {
    id: 40,
    title: 'Hawaii (the USA)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'New Zealand',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Vanuatu',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Moon',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Tycho',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Mars',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Corn Town',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Green Hill',
    childIds: []
  }
};
```

</Sandpack>

**الآن بعد أن أصبحت الحالة «مسطحة» (تُعرف أيضًا بأنها «مطبّعة» normalized)، يصبح تحديث العناصر المتداخلة أسهل.**

لإزالة مكان الآن، تحتاج فقط لمستويين من التحديث:

- النسخة المحدّثة من مكان *الأب* يجب أن تستبعد المعرّف المحذوف من مصفوفة `childIds`.
- النسخة المحدّثة من كائن الجذر «الجدول» يجب أن تتضمن النسخة المحدّثة من مكان الأب.

إليك مثال لكيفية القيام بذلك:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);

  function handleComplete(parentId, childId) {
    const parent = plan[parentId];
    // Create a new version of the parent place
    // that doesn't include this child ID.
    const nextParent = {
      ...parent,
      childIds: parent.childIds
        .filter(id => id !== childId)
    };
    // Update the root state object...
    setPlan({
      ...plan,
      // ...so that it has the updated parent.
      [parentId]: nextParent
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Places to visit</h2>
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
        Complete
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
    title: 'Earth',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Africa',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  }, 
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egypt',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenya',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  }, 
  7: {
    id: 7,
    title: 'Morocco',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigeria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'South Africa',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Americas',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],   
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brazil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  }, 
  14: {
    id: 14,
    title: 'Canada',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Mexico',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinidad and Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Asia',
    childIds: [20, 21, 22, 23, 24, 25],   
  },
  20: {
    id: 20,
    title: 'China',
    childIds: []
  },
  21: {
    id: 21,
    title: 'India',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapore',
    childIds: []
  },
  23: {
    id: 23,
    title: 'South Korea',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Thailand',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Vietnam',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Europe',
    childIds: [27, 28, 29, 30, 31, 32, 33],   
  },
  27: {
    id: 27,
    title: 'Croatia',
    childIds: []
  },
  28: {
    id: 28,
    title: 'France',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Germany',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Italy',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Portugal',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Spain',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Turkey',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Oceania',
    childIds: [35, 36, 37, 38, 39, 40, 41],   
  },
  35: {
    id: 35,
    title: 'Australia',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Bora Bora (French Polynesia)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Easter Island (Chile)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Fiji',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Hawaii (the USA)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'New Zealand',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Vanuatu',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Moon',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Tycho',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Mars',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Corn Town',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Green Hill',
    childIds: []
  }
};
```

```css
button { margin: 10px; }
```

</Sandpack>

يمكنك تداخل الحالة كما تشاء، لكن التسطيح يحل مشكلات كثيرة. يجعل التحديث أسهل ويساعد على عدم تكرار البيانات في أجزاء مختلفة من كائن متداخل.

<DeepDive>

#### تحسين استخدام الذاكرة {/*improving-memory-usage*/}

مثاليًا، تزيل أيضًا العناصر المحذوفة (وأبناءها!) من كائن «الجدول» لتحسين الذاكرة. هذا الإصدار يفعل ذلك. كما أنه [يستخدم Immer](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) لجعل منطق التحديث أقصر.

<Sandpack>

```js
import { useImmer } from 'use-immer';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, updatePlan] = useImmer(initialTravelPlan);

  function handleComplete(parentId, childId) {
    updatePlan(draft => {
      // Remove from the parent place's child IDs.
      const parent = draft[parentId];
      parent.childIds = parent.childIds
        .filter(id => id !== childId);

      // Forget this place and all its subtree.
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
      <h2>Places to visit</h2>
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
        Complete
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
    title: 'Earth',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Africa',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  }, 
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egypt',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenya',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  }, 
  7: {
    id: 7,
    title: 'Morocco',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigeria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'South Africa',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Americas',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],   
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brazil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  }, 
  14: {
    id: 14,
    title: 'Canada',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Mexico',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinidad and Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Asia',
    childIds: [20, 21, 22, 23, 24, 25,],   
  },
  20: {
    id: 20,
    title: 'China',
    childIds: []
  },
  21: {
    id: 21,
    title: 'India',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapore',
    childIds: []
  },
  23: {
    id: 23,
    title: 'South Korea',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Thailand',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Vietnam',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Europe',
    childIds: [27, 28, 29, 30, 31, 32, 33],   
  },
  27: {
    id: 27,
    title: 'Croatia',
    childIds: []
  },
  28: {
    id: 28,
    title: 'France',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Germany',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Italy',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Portugal',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Spain',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Turkey',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Oceania',
    childIds: [35, 36, 37, 38, 39, 40, 41],   
  },
  35: {
    id: 35,
    title: 'Australia',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Bora Bora (French Polynesia)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Easter Island (Chile)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Fiji',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Hawaii (the USA)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'New Zealand',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Vanuatu',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Moon',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Tycho',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Mars',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Corn Town',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Green Hill',
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

أحيانًا يمكنك تقليل تداخل الحالة بنقل جزء منها إلى المكوّنات الفرعية. هذا يناسب حالة واجهة عابرة لا تحتاج تخزينًا، مثل كون عنصرًا تحت المؤشر.

<Recap>

* إذا حدّث متغيرا حالة معًا دائمًا، ففكّر بدمجهما في واحد.
* اختر متغيرات الحالة بعناية لتجنب حالات «مستحيلة».
* هيكل الحالة بحيث تقل احتمالية الخطأ عند التحديث.
* تجنب الحالة الزائدة والمكررة حتى لا تضطر لمزامنتها يدويًا.
* لا تضع الخصائص *في* الحالة إلا إذا أردت صراحة منع التحديثات.
* لأنماط واجهة مثل الاختيار، احتفظ بالمعرّف أو الفهرس في الحالة بدل الكائن نفسه.
* إذا كان تحديث الحالة العميقة معقدًا، جرّب التسطيح.

</Recap>

<Challenges>

#### إصلاح مكوّن لا يتحدّث {/*fix-a-component-thats-not-updating*/}

مكوّن `Clock` هذا يستقبل خاصيتين: `color` و`time`. عند اختيار لون مختلف من القائمة، يستقبل `Clock` خاصية `color` مختلفة من الأب. لكن لسبب ما اللون المعروض لا يتحدّث. لماذا؟ أصلح المشكلة.

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

<Solution>

المشكلة أن المكوّن يهيئ حالة `color` بقيمة خاصية `color` الابتدائية. لكن عند تغيّر خاصية `color`، لا يتأثر متغير الحالة! فيخرجان عن التزامن. لإصلاح ذلك، أزل متغير الحالة واستخدم خاصية `color` مباشرة.

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

أو باستخدام صيغة التفكيك:

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

</Solution>

#### إصلاح قائمة تعبئة معطوبة {/*fix-a-broken-packing-list*/}

لهذه قائمة التعبئة تذييل يعرض عدد العناصر المعبأة والعدد الكلي. يبدو أنها تعمل أولًا، لكن فيها خلل. مثلاً إذا علّمت عنصرًا كمعبأ ثم حذفته، لا يتحدّث العداد بشكل صحيح. أصلح العداد ليكون دائمًا صحيحًا.

<Hint>

هل أي حالة في هذا المثال زائدة؟

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'Warm socks', packed: true },
  { id: 1, title: 'Travel journal', packed: false },
  { id: 2, title: 'Watercolors', packed: false },
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
      <b>{packed} out of {total} packed!</b>
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
      }}>Add</button>
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
            Delete
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

رغم أنك قد تعدّل كل معالج حدث بحذر لتحديث العدادين `total` و`packed`، فالمشكلة الجذرية أن متغيرات الحالة هذه موجودة أصلًا. هي زائدة لأنك تستطيع دائمًا حساب عدد العناصر (المعبأة أو الكلية) من مصفوفة `items` نفسها. أزل الحالة الزائدة لإصلاح الخلل:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'Warm socks', packed: true },
  { id: 1, title: 'Travel journal', packed: false },
  { id: 2, title: 'Watercolors', packed: false },
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
      <b>{packed} out of {total} packed!</b>
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
      }}>Add</button>
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
            Delete
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

لاحظ أن معالجات الأحداث تهتم فقط باستدعاء `setItems` بعد هذا التغيير. أعداد العناصر تُحسب الآن في العرض التالي من `items`، فتبقى محدّثة دائمًا.

</Solution>

#### إصلاح اختفاء التمييز {/*fix-the-disappearing-selection*/}

هناك قائمة من `letters` في الحالة. عند التمرير أو التركيز على رسالة معيّنة تُميَّز. الرسالة المميّزة حاليًا في متغير الحالة `highlightedLetter`. يمكنك «تمييز نجمة» و«إلغاء تمييز» رسائل فردية، مما يحدّث مصفوفة `letters` في الحالة.

الكود يعمل، لكن فيه خلل بسيط في الواجهة. عند الضغط على «Star» أو «Unstar» يختفي التمييز لحظة. ثم يعود بمجرد تحريك المؤشر أو الانتقال برسالة أخرى باللوحة. لماذا يحدث هذا؟ أصلحه بحيث لا يختفي التمييز بعد النقر على الزر.

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
      <h2>Inbox</h2>
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
        {letter.isStarred ? 'Unstar' : 'Star'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js src/data.js
export const initialLetters = [{
  id: 0,
  subject: 'Ready for adventure?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Time to check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Festival Begins in Just SEVEN Days!',
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

المشكلة أنك تحتفظ بكائن الرسالة في `highlightedLetter` بينما نفس المعلومات موجودة في مصفوفة `letters`. إذن الحالة مكررة! عند تحديث `letters` بعد النقر، تنشئ كائن رسالة جديدًا يختلف عن `highlightedLetter`. لذلك يصبح فحص `highlightedLetter === letter` خاطئًا ويختفي التمييز. يعود عند استدعاء `setHighlightedLetter` مرة أخرى عند تحريك المؤشر.

لإصلاح ذلك، أزل التكرار من الحالة. بدل تخزين *الرسالة نفسها* في مكانين، خزّن `highlightedId`. ثم تحقق من `isHighlighted` لكل رسالة بـ`letter.id === highlightedId`، وهذا يعمل حتى لو تغيّر كائن `letter` منذ العرض السابق.

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
      <h2>Inbox</h2>
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
        {letter.isStarred ? 'Unstar' : 'Star'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js src/data.js
export const initialLetters = [{
  id: 0,
  subject: 'Ready for adventure?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Time to check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Festival Begins in Just SEVEN Days!',
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

#### تنفيذ اختيار متعدد {/*implement-multiple-selection*/}

في هذا المثال، لكل `Letter` خاصية `isSelected` ومعالج `onToggle` يعلّمها كمختارة. هذا يعمل، لكن الحالة مخزّنة كـ`selectedId` (`null` أو معرّف)، فيمكن اختيار رسالة واحدة فقط في الوقت نفسه.

غيّر هيكلة الحالة لدعم اختيار متعدد. (كيف تُهيكلها؟ فكّر قبل الكتابة.) يجب أن يصبح كل مربع اختيار مستقلًا عن الآخرين. النقر على رسالة مختارة يلغي اختيارها. وأخيرًا يجب أن يعرض التذييل العدد الصحيح للعناصر المختارة.

<Hint>

بدل معرّف واحد، قد تحتفظ بمصفوفة أو [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) من معرّفات المختارين في الحالة.

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
      <h2>Inbox</h2>
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
            You selected {selectedCount} letters
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
      isSelected ? 'selected' : ''
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
  subject: 'Ready for adventure?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Time to check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Festival Begins in Just SEVEN Days!',
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

بدل `selectedId` واحد، احتفظ بمصفوفة `selectedIds` في الحالة. مثلاً إذا اخترت الرسالة الأولى والأخيرة، تحتوي `[0, 2]`. عند عدم اختيار شيء، تكون `[]` فارغة:

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
      <h2>Inbox</h2>
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
            You selected {selectedCount} letters
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
      isSelected ? 'selected' : ''
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
  subject: 'Ready for adventure?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Time to check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Festival Begins in Just SEVEN Days!',
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

عيب بسيط للمصفوفة أنك لكل عنصر تستدعي `selectedIds.includes(letter.id)` للتحقق من الاختيار. إذا كبرت المصفوفة كثيرًا، قد يصبح ذلك مشكلة أداء لأن البحث بـ[`includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) خطي الزمن، وتكرر البحث لكل عنصر.

للتخفيف، احتفظ بـ[Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) في الحالة بدلًا من ذلك، فهو يوفّر عملية [`has()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has) سريعة:

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
      <h2>Inbox</h2>
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
            You selected {selectedCount} letters
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
      isSelected ? 'selected' : ''
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
  subject: 'Ready for adventure?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Time to check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Festival Begins in Just SEVEN Days!',
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

الآن كل عنصر يجرى فحص `selectedIds.has(letter.id)`، وهو سريع جدًا.

تذكر أنه [لا يجب تعديل الكائنات في الحالة](/learn/updating-objects-in-state)، وهذا يشمل Set أيضًا. لذلك تنشئ `handleToggle` *نسخة* من Set أولًا ثم تعدّل النسخة.

</Solution>

</Challenges>
