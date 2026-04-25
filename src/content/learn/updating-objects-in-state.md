---
title: تحديث الكائنات في الحالة
---

<Intro>

يمكن أن تحتفظ الحالة بأي نوع من قيم JavaScript، بما في ذلك الكائنات. لكن لا يجب تغيير الكائنات المخزّنة في حالة React مباشرةً. بدلًا من ذلك، عندما تريد تحديث كائن، أنشئ كائنًا جديدًا (أو انسخًا من كائن موجود)، ثم اضبط الحالة لتستخدم ذلك النسخ.

</Intro>

<YouWillLearn>

- كيفية تحديث كائن في حالة React بشكل صحيح
- كيفية تحديث كائن متداخل دون تعديله موضعيًا
- ما المقصود بثبات البيانات (immutability)، وكيف لا تخرقه
- كيف تقلل تكرار نسخ الكائنات باستخدام Immer

</YouWillLearn>

## ما المقصود بالتعديل الموضعي؟ {/*whats-a-mutation*/}

يمكنك تخزين أي نوع من قيم JavaScript في الحالة.

```js
const [x, setX] = useState(0);
```

حتى الآن تعاملت مع أعداد وسلاسل وقيم منطقية. هذه الأنواع من قيم JavaScript «غير قابلة للتعديل»، أي ثابتة أو «للقراءة فقط». يمكنك إطلاق إعادة التصيير لـ _استبدال_ قيمة:

```js
setX(5);
```

تغيّرت حالة `x` من `0` إلى `5`، لكن _العدد `0` نفسه_ لم يتغيّر. لا يمكن تعديل القيم البدائية المدمجة مثل الأعداد والسلاسل والمنطقية في JavaScript.

الآن فكّر في كائن داخل الحالة:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

من الناحية الفنية، يمكن تغيير محتوى _الكائن نفسه_. **يُسمى ذلك تعديلًا موضعيًا (mutation):**

```js
position.x = 5;
```

ومع أن كائنات حالة React قابلة للتعديل تقنيًا، يجب التعامل معها **كأنها** غير قابلة للتعديل—مثل الأعداد والمنطقية والسلاسل. بدل تعديلها، استبدلها دائمًا.

## عامل الحالة وكأنها للقراءة فقط {/*treat-state-as-read-only*/}

بمعنى آخر، **عامل أي كائن JavaScript تضعه في الحالة وكأنه للقراءة فقط.**

يحتفظ هذا المثال بكائن في الحالة ليمثل موضع المؤشر. من المفترض أن تتحرك النقطة الحمراء عند اللمس أو تحريك المؤشر فوق منطقة المعاينة. لكن النقطة تبقى في الموضع الأولي:

<Sandpack>

```js {expectedErrors: {'react-compiler': [11]}}
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
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
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

المشكلة في هذا الجزء من الكود.

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

هذا الكود يعدّل الكائن المخصّص لـ `position` من [التصيير السابق.](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) لكن بدون استخدام دالة ضبط الحالة، لا يعلم React أن الكائن تغيّر، فلا يفعل شيئًا ردًا على ذلك. الأمر كمحاولة تغيير الطلب بعد أن انتهيت من الأكل. قد يعمل تعديل الحالة موضعيًا في بعض الحالات، لكننا لا ننصح به. عامل قيمة الحالة المتاحة لك أثناء التصيير وكأنها للقراءة فقط.

لـ [إطلاق إعادة تصيير](/learn/state-as-a-snapshot#setting-state-triggers-renders) فعليًا في هذه الحالة، **أنشئ *كائنًا جديدًا* ومرّره إلى دالة ضبط الحالة:**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

باستخدام `setPosition`، تخبر React بما يلي:

* استبدل `position` بهذا الكائن الجديد
* وأعد تصيير هذا المكوّن

لاحظ كيف تتبع النقطة الحمراء المؤشر عند اللمس أو التمرير فوق منطقة المعاينة:

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
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### التعديل الموضعي المحلي مقبول {/*local-mutation-is-fine*/}

كود كهذا مشكلة لأنه يعدّل كائنًا *موجودًا* في الحالة:

```js
position.x = e.clientX;
position.y = e.clientY;
```

لكن كودًا كهذا **مقبول تمامًا** لأنك تعدّل كائنًا طازجًا *أنشأته للتو*:

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

في الواقع، يعادل تمامًا كتابة هذا:

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

التعديل الموضعي مشكلة فقط عند تغيير كائنات *موجودة* في الحالة بالفعل. تعديل كائن أنشأته للتو مقبول لأن *لا كودًا آخر يشير إليه بعد.* ولن يؤثر تغييره بالخطأ على شيء يعتمد عليه. يُسمى ذلك «تعديلًا موضعيًا محليًا». يمكنك حتى إجراء تعديل موضعي محلي [أثناء التصيير.](/learn/keeping-components-pure#local-mutation-your-components-little-secret) مريح ومقبول تمامًا!

</DeepDive>  

## نسخ الكائنات بصيغة الانتشار {/*copying-objects-with-the-spread-syntax*/}

في المثال السابق، يُنشأ كائن `position` دائمًا من جديد من موضع المؤشر الحالي. لكن غالبًا ستريد إدراج *بيانات موجودة* كجزء من الكائن الجديد الذي تنشئه. مثلاً قد تريد تحديث *حقل واحد* فقط في نموذج مع الإبقاء على القيم السابقة لبقية الحقول.

حقول الإدخال هذه لا تعمل لأن معالجات `onChange` تعدّل الحالة موضعيًا:

<Sandpack>

```js {expectedErrors: {'react-compiler': [11, 15, 19]}}
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

مثلاً، هذا السطر يعدّل الحالة من تصيير سابق:

```js
person.firstName = e.target.value;
```

الطريقة الموثوقة للحصول على السلوك المطلوب هي إنشاء كائن جديد وتمريره إلى `setPerson`. لكن هنا تريد أيضًا **نسخ البيانات الموجودة إليه** لأن حقلًا واحدًا فقط تغيّر:

```js
setPerson({
  firstName: e.target.value, // الاسم الأول الجديد من الإدخال
  lastName: person.lastName,
  email: person.email
});
```

يمكنك استخدام صيغة [انتشار الكائن `...`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals) حتى لا تحتاج لنسخ كل خاصية على حدة.

```js
setPerson({
  ...person, // انسخ الحقول القديمة
  firstName: e.target.value // لكن استبدل هذا الحقل
});
```

الآن يعمل النموذج!

لاحظ أنك لم تعلن متغير حالة منفصلًا لكل حقل إدخال. في النماذج الكبيرة، تجميع كل البيانات في كائن مريح جدًا—ما دمت تحدّثه بشكل صحيح!

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

لاحظ أن صيغة الانتشار `...` «سطحية»—تنسخ مستوى واحدًا فقط. هذا يجعلها سريعة، لكنه يعني أيضًا أنك إن أردت تحديث خاصية متداخلة، ستحتاج لاستخدامها أكثر من مرة.

<DeepDive>

#### استخدام معالج حدث واحد لعدة حقول {/*using-a-single-event-handler-for-multiple-fields*/}

يمكنك أيضًا استخدام الأقواس `[` و`]` داخل تعريف الكائن لتحديد خاصية باسم ديناميكي. إليك نفس المثال، لكن بمعالج حدث واحد بدلًا من ثلاثة:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

هنا، `e.target.name` يشير إلى الخاصية `name` المعطاة لعنصر `<input>` في DOM.

</DeepDive>

## تحديث كائن متداخل {/*updating-a-nested-object*/}

تخيّل بنية كائن متداخلة كهذه:

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

إن أردت تحديث `person.artwork.city`، يبدو واضحًا كيف تفعل ذلك بتعديل موضعي:

```js
person.artwork.city = 'New Delhi';
```

لكن في React تعامل الحالة على أنها غير قابلة للتعديل! لتغيير `city`، تحتاج أولًا لإنتاج كائن `artwork` جديد (معبأ مسبقًا ببيانات السابق)، ثم إنتاج كائن `person` جديد يشير إلى `artwork` الجديد:

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

أو كتابة واحدة لاستدعاء الدالة:

```js
setPerson({
  ...person, // انسخ الحقول الأخرى
  artwork: { // لكن استبدل artwork
    ...person.artwork, // بنفس المحتوى
    city: 'New Delhi' // لكن المدينة نيودلهي!
  }
});
```

قد يصبح النص أطول قليلًا، لكنه يعمل جيدًا في كثير من الحالات:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<DeepDive>

#### الكائنات ليست متداخلة حقًا {/*objects-are-not-really-nested*/}

كائن كهذا يبدو «متداخلًا» في الكود:

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

لكن «التداخل» طريقة غير دقيقة للتفكير في سلوك الكائنات. عند تنفيذ الكود، لا يوجد شيء اسمه كائن «متداخل». أنت تنظر فعليًا إلى كائنين مختلفين:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

الكائن `obj1` ليس «داخل» `obj2`. مثلاً، يمكن لـ `obj3` أن «يشير» إلى `obj1` أيضًا:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

إن عدّلت موضعيًا `obj3.artwork.city`، سيؤثر ذلك على `obj2.artwork.city` و`obj1.city` معًا. لأن `obj3.artwork` و`obj2.artwork` و`obj1` هم نفس الكائن. هذا صعب الملاحظة عندما تفكر في الكائنات على أنها «متداخلة». بدلًا من ذلك، هي كائنات منفصلة «تشير» إلى بعضها عبر الخصائص.

</DeepDive>  

### اكتب منطق التحديث بإيجاز باستخدام Immer {/*write-concise-update-logic-with-immer*/}

إن كانت حالتك متداخلة بعمق، قد ترغب في [تسطيحها.](/learn/choosing-the-state-structure#avoid-deeply-nested-state) لكن إن لم ترد تغيير بنية الحالة، قد تفضّل اختصارًا لانتشار متعدد المستويات. [Immer](https://github.com/immerjs/use-immer) مكتبة شائعة تسمح لك بالكتابة بصيغة مريحة لكنها تبدو كتعديل موضعي، وهي تهتم بإنتاج النسخ عنك. مع Immer، يبدو الكود وكأنك «تخرق القواعد» وتعدّل كائنًا:

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

لكن على عكس التعديل الموضعي العادي، لا يستبدل الحالة السابقة!

<DeepDive>

#### كيف يعمل Immer؟ {/*how-does-immer-work*/}

`draft` الذي يوفّره Immer نوع خاص من الكائنات يُسمى [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)، «يسجّل» ما تفعله به. لذلك يمكنك تعديله بحرية كما تشاء! في الخلفية، يحدد Immer أجزاء `draft` التي تغيّرت، وينتج كائنًا جديدًا تمامًا يحتوي تعديلاتك.

</DeepDive>

 لتجربة Immer:

1. نفّذ `npm install use-immer` لإضافة Immer كتبعية
2. ثم استبدل `import { useState } from 'react'` بـ `import { useImmer } from 'use-immer'`

إليك المثال أعلاه محوّلًا إلى Immer:

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
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

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

لاحظ كم أصبحت معالجات الأحداث أقصر. يمكنك خلط `useState` و`useImmer` في مكوّن واحد كما تشاء. Immer وسيلة ممتازة لإبقاء معالجات التحديث موجزة، خصوصًا عند وجود تداخل في الحالة، وعندما يؤدي نسخ الكائنات إلى تكرار في الكود.

<DeepDive>

#### لماذا لا يُنصح بتعديل الحالة موضعيًا في React؟ {/*why-is-mutating-state-not-recommended-in-react*/}

لأسباب منها:

* **التصحيح:** إن استخدمت `console.log` ولم تعدّل الحالة موضعيًا، لن تُستبدل السجلات القديمة بتغيّرات أحدث بوضوح. فيمكنك رؤية كيف تغيّرت الحالة بين التصييرات.
* **التحسينات:** تعتمد [استراتيجيات التحسين](/reference/react/memo) الشائعة في React على تخطي العمل إن كانت الخصائص أو الحالة السابقة مطابقة للتالية. إن لم تعدّل الحالة موضعيًا، يصبح التحقق من التغيّر سريعًا جدًا. إن كان `prevObj === obj`، يمكنك التأكد أن لا شيء داخله تغيّر.
* **ميزات جديدة:** تعتمد ميزات React الجديدة التي نبنيها على [معاملة الحالة كصورة لحظية.](/learn/state-as-a-snapshot) تعديل نسخ قديمة من الحالة قد يمنعك من استخدام الميزات الجديدة.
* **تغيّر المتطلبات:** بعض ميزات التطبيق، مثل التراجع/الإعادة، أو عرض تاريخ التغييرات، أو إعادة النموذج لقيم سابقة، أسهل عند عدم التعديل الموضعي، لأنك تحتفظ بنسخ قديمة من الحالة وتعيد استخدامها. إن بدأت بتعديل موضعي، قد يصعب إضافة مثل هذه الميزات لاحقًا.
* **تنفيذ أبسط:** لأن React لا يعتمد على التعديل الموضعي، لا يحتاج لمعالجة خاصة لكائناتك. لا يحتاج لاعتراض خصائصها أو لفّها دائمًا في Proxies أو عمل آخر عند التهيئة كما تفعل حلول «تفاعلية» كثيرة. لذلك يسمح React بوضع أي كائن في الحالة—مهما كان كبيرًا—دون فخاخ إضافية في الأداء أو الصحة.

عمليًا، قد «تفلت» أحيانًا بتعديل الحالة موضعيًا في React، لكننا ننصح بشدة بعدم ذلك حتى تستفيد من ميزات React الجديدة المبنية على هذا النهج. سيشكرك المساهمون لاحقًا—وربما أنت لاحقًا!

</DeepDive>

<Recap>

* عامل كل حالة في React على أنها غير قابلة للتعديل.
* عند تخزين كائنات في الحالة، تعديلها موضعيًا لا يطلق تصييرات ويغيّر الحالة في «لقطات» تصيير سابقة.
* بدل تعديل كائن، أنشئ *نسخة جديدة* منه، وأطلق إعادة التصيير بضبط الحالة عليه.
* يمكنك استخدام صيغة انتشار الكائن `{...obj, something: 'newValue'}` لإنشاء نسخ.
* الانتشار سطحي: ينسخ مستوى واحدًا فقط.
* لتحديث كائن متداخل، أنشئ نسخًا طوال المسار من موضع التحديث حتى الأعلى.
* لتقليل تكرار نسخ الكود، استخدم Immer.

</Recap>



<Challenges>

#### إصلاح تحديثات حالة خاطئة {/*fix-incorrect-state-updates*/}

لهذا النموذج بعض الأخطاء. انقر الزر الذي يزيد النقاط عدة مرات. لاحظ أنها لا تزيد. ثم عدّل الاسم الأول ولاحظ أن النقاط «لحقت» فجأة بتغييراتك. أخيرًا عدّل اسم العائلة ولاحظ أن النقاط اختفت تمامًا.

مهمتك إصلاح كل هذه الأخطاء. أثناء الإصلاح، اشرح سبب حدوث كل منها.

<Sandpack>

```js {expectedErrors: {'react-compiler': [11]}}
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

إليك نسخة أصلحت فيها كلا الخطأين:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

مشكلة `handlePlusClick` أنها عدّلت كائن `player` موضعيًا. فلم يعلم React أن هناك سببًا لإعادة التصيير، ولم يحدّث النقاط على الشاشة. لذلك عند تعديل الاسم الأول، حُدثت الحالة وأطلقت تصييرًا _حدّث أيضًا_ النقاط على الشاشة.

مشكلة `handleLastNameChange` أنها لم تنسخ حقول `...player` الموجودة إلى الكائن الجديد. لذلك ضاعت النقاط بعد تعديل اسم العائلة.

</Solution>

#### اعثر على التعديل الموضعي وأصلحه {/*find-and-fix-the-mutation*/}

هناك صندوق قابل للسحب على خلفية ثابتة. يمكنك تغيير لون الصندوق عبر قائمة الاختيار.

لكن هناك خلل. إن حركت الصندوق أولًا ثم غيّرت لونه، ستقفز الخلفية (التي لا يفترض أن تتحرك!) إلى موضع الصندوق. وهذا لا يجب أن يحدث: خاصية `position` لمكوّن `Background` مضبوطة على `initialPosition` أي `{ x: 0, y: 0 }`. لماذا تتحرك الخلفية بعد تغيير اللون؟

اعثر على الخلل وأصلحه.

<Hint>

إن تغيّر شيء غير متوقع، فهناك تعديل موضعي. ابحث عن التعديل في `App.js` وأصلحه.

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [17]}} src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

المشكلة في التعديل الموضعي داخل `handleMove`. عدّل `shape.position`، وهو نفس الكائن الذي تشير إليه `initialPosition`. لذلك يتحرك كل من الشكل والخلفية. (إنه تعديل موضعي، فلا يظهر التغيير على الشاشة حتى تحديث غير مرتبط—تغيير اللون—يطلق إعادة تصيير.)

الإصلاح إزالة التعديل الموضعي من `handleMove`، واستخدام صيغة الانتشار لنسخ الشكل. لاحظ أن `+=` تعديل موضعي، فأعد كتابتها باستخدام `+` عادي.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### حدّث كائنًا باستخدام Immer {/*update-an-object-with-immer*/}

هذا نفس المثال المعطوب من التحدي السابق. هذه المرة أصلح التعديل الموضعي باستخدام Immer. لراحتك، `useImmer` مستورد مسبقًا، فعليك تغيير متغير حالة `shape` ليستخدمه.

<Sandpack>

```js {expectedErrors: {'react-compiler': [18]}} src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

<Solution>

هذا الحل معاد كتابته بـ Immer. لاحظ أن معالجات الأحداث تُكتب بأسلوب يبدو تعديلًا موضعيًا، لكن الخلل لا يحدث. لأن Immer في الداخل لا يعدّل الكائنات الموجودة أبدًا.

<Sandpack>

```js src/App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

</Solution>

</Challenges>
