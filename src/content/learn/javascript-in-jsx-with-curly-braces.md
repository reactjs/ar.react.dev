---
title: JavaScript في JSX باستخدام الأقواس المنحنية
---

<Intro>

 تتيح لك JSX كتابة ترميز شبيه بـ HTML داخل ملف JavaScript، مما يسمح بالحفاظ على منطق التصيير والمحتوى في المكان نفسه. في بعض الأحيان، قد ترغب في إضافة بعض منطق لغة JavaScript أو الإشارة إلى خاصية ديناميكية داخل هذا الترميز. في هذه الحالة، يمكنك استخدام الأقواس المنحنية داخل JSX الخاص بك لفتح نافذة للغة JavaScript.

</Intro>

<YouWillLearn>

* كيفية تمرير النصوص (string) باستخدام علامات التنصيص
* كيفية الإشارة إلى متغير JavaScript داخل JSX باستخدام الأقواس المعقوفة
* كيفية استدعاء دالة JavaScript داخل JSX باستخدام الأقواس المنحنية
* كيفية استخدام كائن JavaScript داخل JSX باستخدام الأقواس المعقوفة

</YouWillLearn>

## تمرير النصوص باستخدام علامات التنصيص {/*passing-strings-with-quotes*/}

عندما ترغب في تمرير نص إلى JSX، يتم وضعها بين علامات تنصيص مفردة أو مزدوجة:

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/NpGVLas.jpg"
      alt="نجيب محفوظ"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

هنا، يتم تمرير `"https://i.imgur.com/NpGVLas.jpg"` و `"نجيب محفوظ"` كنصوص.

ولكن ماذا لو كنت ترغب في تحديد `src` أو نص `alt` بشكل ديناميكي؟ يمكنك **استخدام قيمة من JavaScript عن طريق استبدال `"`و `"` بـ `{`و `}`**:

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/NpGVLas.jpg';
  const description = 'نجيب محفوظ';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

لاحظ الاختلاف بين `className="avatar"`، الذي يحدد اسم فئة CSS `"avatar"` الذي يجعل الصورة دائرية، و`src={avatar}` الذي يقرأ قيمة متغير JavaScript المسمى `avatar`. هذا لأن الأقواس المنحنية تتيح لك العمل مع لغة JavaScript مباشرة داخل الترميز الخاصة بك!

## استخدام الأقواس المنحنية: نافذة إلى عالم JavaScript {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX هي طريقة خاصة لكتابة JavaScript. وهذا يعني أنه يمكن استخدام JavaScript داخلها - باستخدام الأقواس المعقوفة `{ }`. في المثال أدناه، يتم تعريف اسم للعالِم، `name`، ثم يتم تضمينه بواسطة الأقواس المنحنية داخل عنصر `<h1>`.

<Sandpack>

```js
export default function TodoList() {
  const name = 'نجيب محفوظ';
  return (
    <h1>قائمة مهام {name}</h1>
  );
}
```

</Sandpack>

حاول تغيير قيمة `name` من `'نجيب محفوظ'` إلى `'أحمد زويل'`. لاحظ كيف يتغير عنوان القائمة؟

أي تعبير JavaScript سيعمل بين الأقواس المنحنية، بما في ذلك استدعاءات الدوال مثل `formatDate()`:
<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'ar-EG',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>قائمة مهام لـ {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### أين يجب استخدام الأقواس المنحنية؟ {/*where-to-use-curly-braces*/}

يمكنك استخدام الأقواس المنحنية في JSX بطريقتين فقط:

1. **كنص** مباشرة داخل وسم JSX: `<h1>قائمة مهام {name}</h1>` يعمل، ولكن `<{tag}>قائمة مهام نجيب محفوظ </{tag}>` لن يعمل.
2. **كخصائص** تأتي فورًا بعد علامة `=`: `src={avatar}` ستقرأ قيمة المتغير `avatar`، ولكن `src="{avatar}"` ستمرره `"{avatar}"` كنص.

## استخدام "أقواس منحنية مزدوجة": CSS وكائنات أخرى داخل JSX {/*using-double-curlies-css-and-other-objects-in-jsx*/}

بالإضافة إلى النصوص والأرقام وتعابير JavaScript الأخرى، يمكنك تمرير الكائنات في JSX. يتم تمييز الكائنات أيضًا بواسطة الأقواس المنحنية، مثل `{ name: "أحمد زويل", inventions: 5 }`. لذلك، لتمرير كائن JavaScript في JSX، يجب عليك إحاطة الكائن بزوج آخر من الأقواس المنحنية: `person={{ name: "أحمد زويل", inventions: 5 }}`.

قد ترى ذلك في أنماط CSS المضمنة فيJSX. React لا تتطلب منك استخدام أنماط CSS مضمنة (فئة CSS يعمل جيداً في معظم الحالات). ولكن عندما تحتاج إلى أسلوب مضمن، يمكنك تمرير كائن إلى خاصية `style`:

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>كتابة روايات وأعمال أدبية</li>
      <li>الدفاع عن الحرية الأدبية والتعبير</li>
      <li>تعزيز الوعي الثقافي والأدبي</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

حاول تغيير قيم `backgroundColor` و `color`.

يمكنك رؤية كائن JavaScript بوضوح داخل الأقواس المنحنية عندما تكتبه بهذه الطريقة:

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

في المرة القادمة التي ترى `{{` و `}}` في JSX، أعلم أنه ليس سوى كائن داخل أقواس JSX المنحنية!

<Pitfall>

خصائص `style` المضمنة تكتب بتنسيق camelCase. على سبيل المثال، عنصرHTML `<ul style="background-color: black">` يتم كتابته في المكون الخاص بك على النحو التالي: `<ul style={{ backgroundColor: 'black' }}>`.

</Pitfall>

## المزيد من المرح مع كائنات JavaScript والأقواس المنحنية! {/*more-fun-with-javascript-objects-and-curly-braces*/}

يمكنك دمج العديد من التعابير في كائن واحد والإشارة لهم في JSX الخاص بك داخل الأقواس المنحنية:

<Sandpack>

```js
const person = {
  name: 'نجيب محفوظ',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>مهام {person.name}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/NpGVLas.jpg"
        alt="نجيب محفوظ"
      />
      <ul>
        <li>كتابة روايات وأعمال أدبية</li>
        <li>الدفاع عن الحرية الأدبية والتعبير</li>
        <li>تعزيز الوعي الثقافي والأدبي</li>
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

في هذا المثال، يحتوي كائنJavaScript `person` على نص `name` وكائن `theme`:

```js
const person = {
  name: 'نجيب محفوظ',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

يمكن للمكوّن استخدام قيم من الكائن `person` كالتالي:

```js
<div style={person.theme}>
  <h1>قائمة مهام {person.name}</h1>
```

JSXهي لغة قوالب بسيطة جدًا لأنها تسمح لك بتنظيم البيانات والمنطق باستخدام JavaScript.

<Recap>

الآن تعرف تقريبًا كل شيء عن JSX:

* يتم تمرير خصائص JSX كنصوص داخل أقواس تنصيص
* تسمح لك الأقواس المنحنية بإضافة منطق ومتغيرات JavaScript داخل الترميز الخاص بك.
* تعمل الأقواس المنحنية داخل محتوى وسم JSX أو مباشرة بعد `=` في الخصائص.
* `{{` و `}}` ليست صيغة خاصة: إنما هي كائن JavaScript موجود داخل أقواس JSX المنحنية.

</Recap>

<Challenges>

#### أصلح الخطأ {/*fix-the-mistake*/}

هذا الكود يتعطل ويظهر خطأ `Objects are not valid as a React child`:

<Sandpack>

```js
const person = {
  name: 'نجيب محفوظ',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>مهام {person}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/NpGVLas.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>كتابة روايات وأعمال أدبية</li>
        <li>الدفاع عن الحرية الأدبية والتعبير</li>
        <li>تعزيز الوعي الثقافي والأدبي</li>
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

هل يمكنك إيجاد المشكلة؟

<Hint>ابحث عن ما يوجد داخل الأقواس المنحنية. هل يتم وضع الشيء الصحيح هناك؟</Hint>

<Solution>

يحدث هذا بسبب أن هذا المثال يقوم بتصيير *كائن بذاته* في الترميز بدلاً من النص: `<h1>قائمة مهام {person}</h1>` يحاول عرض كائن `person` بأكمله! إدراج الكائنات المباشرة كمحتوى نصي يُثير خطأ لأن React لا يعرف كيف ترغب في عرضها.

لحل هذه المشكلة، قم بتبديل `<h1>قائمة مهام {person}</h1>` بـ `<h1>قائمة مهام {person.name}</h1>`:

<Sandpack>

```js
const person = {
  name: 'نجيب محفوظ',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>مهام {person.name}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/NpGVLas.jpg"
        alt="نجيب محفوظ"
      />
      <ul>
        <li>كتابة روايات وأعمال أدبية</li>
        <li>الدفاع عن الحرية الأدبية والتعبير</li>
        <li>تعزيز الوعي الثقافي والأدبي</li>
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

</Solution>

#### استخرج المعلومات إلى كائن {/*extract-information-into-an-object*/}

استخرج عنوان URL للصورة إلى كائن `person`.

<Sandpack>

```js
const person = {
  name: 'نجيب محفوظ',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>مهام {person.name}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/NpGVLas.jpg"
        alt="نجيب محفوظ"
      />
      <ul>
        <li>كتابة روايات وأعمال أدبية</li>
        <li>الدفاع عن الحرية الأدبية والتعبير</li>
        <li>تعزيز الوعي الثقافي والأدبي</li>
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

<Solution>

قم بنقل عنوان URL للصورة إلى خاصية تسمى `person.imageUrl` وقم بقراءتها من وسم `<img>` باستخدام الأقواس المنحنية:

<Sandpack>

```js
const person = {
  name: 'نجيب محفوظ',
  imageUrl: "https://i.imgur.com/NpGVLas.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>مهام {person.name}</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="نجيب محفوظ"
      />
      <ul>
        <li>كتابة روايات وأعمال أدبية</li>
        <li>الدفاع عن الحرية الأدبية والتعبير</li>
        <li>تعزيز الوعي الثقافي والأدبي</li>
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

</Solution>

#### اكتب تعبيراً داخل أقواس JSX المنحنية. {/*write-an-expression-inside-jsx-curly-braces*/}

في الكائن أدناه، يتم تقسيم العنوان الكامل للصورة إلى أربعة أجزاء: العنوان الأساس و`imageId` و`imageSize` وامتداد الملف.

نريد أن يتم دمج عنوان URL للصورة باستخدام هذه الخصائص معًا: العنوان الأساس (دائمًا `'https://i.imgur.com/'`) و`imageId` (`'NpGVLas'`) و `imageSize` (`'s'`)، وامتداد الملف (دائمًا `'.jpg'`). ومع ذلك، هناك خطأ في كيفية تحديد الوسم `<img>` لخاصية `src` الخاصة به.

هل يمكنك إصلاح الخطأ؟

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'نجيب محفوظ',
  imageId: 'NpGVLas',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>مهام {person.name}</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>كتابة روايات وأعمال أدبية</li>
        <li>الدفاع عن الحرية الأدبية والتعبير</li>
        <li>تعزيز الوعي الثقافي والأدبي</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

للتحقق من نجاح حلك، جرب تغيير قيمة `imageSize` إلى `'b'`. يفترض أن يتغير حجم الصورة بعد تعديلك.

<Solution>

يمكنك كتابته على هذا النحو `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`.

1. `{` تفتح التعبير الخاص بـ JavaScript
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` ينتج نص URL الصحيح
3. `{` تغلق التعبير الخاص بـ JavaScript

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'نجيب محفوظ',
  imageId: 'NpGVLas',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>مهام {person.name}</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>كتابة روايات وأعمال أدبية</li>
        <li>الدفاع عن الحرية الأدبية والتعبير</li>
        <li>تعزيز الوعي الثقافي والأدبي</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

يمكنك أيضًا نقل هذا التعبير إلى دالة منفصلة مثل `getImageUrl` في الأسفل:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'نجيب محفوظ',
  imageId: 'NpGVLas',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>مهام {person.name}</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>كتابة روايات وأعمال أدبية</li>
        <li>الدفاع عن الحرية الأدبية والتعبير</li>
        <li>تعزيز الوعي الثقافي والأدبي</li>
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

المتغيرات والدوال يمكنها مساعدتك في إبقاء الترميز بسيط!

</Solution>

</Challenges>
