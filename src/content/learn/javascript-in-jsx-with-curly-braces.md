---
title: JavaScript في JSX باستخدام الأقواس المعقوفة
---

<Intro>

 تتيح لك JSX كتابة ترميز شبيه بـ HTML داخل ملف JavaScript، مما يسمح بالحفاظ على منطق التصيير والمحتوى في المكان نفسه. في بعض الأحيان، قد ترغب في إضافة بعض منطق لغة JavaScript أو الإشارة إلى خاصية ديناميكية داخل هذا الترميز. في هذه الحالة، يمكنك استخدام الأقواس المعقوفة داخل JSX الخاص بك لفتح نافذة للغة JavaScript.

</Intro>

<YouWillLearn>

* كيفية تمرير strings باستخدام علامات التنصيص
* كيفية الإشارة إلى متغير JavaScript داخل JSX باستخدام الأقواس المعقوفة
* كيفية استدعاء دالة JavaScript داخل JSX باستخدام الأقواس المعقوفة
* كيفية استخدام كائن JavaScript داخل JSX باستخدام الأقواس المعقوفة

</YouWillLearn>

## تمرير strings باستخدام علامات التنصيص {/*passing-strings-with-quotes*/}

عندما ترغب في تمرير خاصية string إلى JSX، يتم وضعها بين علامات تنصيص مفردة أو مزدوجة:

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

هنا ، يتم تمرير `"https://i.imgur.com/7vQD0fPs.jpg"` و `"Gregorio Y. Zara"` في صورة strings.

ولكن ماذا لو كنت ترغب في تحديد `src` أو نص `alt` بشكل ديناميكي؟ يمكنك **استخدام قيمة من JavaScript عن طريق استبدال `"`و `"` بـ `{`و `}`**:

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
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

لاحظ الاختلاف بين `className="avatar"`، الذي يحدد اسم صنف CSS `"avatar"` الذي يجعل الصورة دائرية، و `src={avatar}` الذي يقرأ قيمة متغير JavaScript المسمى `avatar`. هذا لأن الأقواس المعقوفة تتيح لك العمل مع لغة JavaScript مباشرة داخل الترميز الخاصة بك!

## استخدام الأقواس المعقوفة: نافذة إلى عالم JavaScript {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX هي طريقة خاصة لكتابة JavaScript. وهذا يعني أنه يمكن استخدام JavaScript داخلها - باستخدام الأقواس المعقوفة `{ }`. في المثال أدناه، يتم تعريف اسم للعالم، `name`، ثم يتم تضمينه بواسطة الأقواس المعقوفة داخل عنصر `<h1>`.

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```

</Sandpack>

حاول تغيير قيمة `name` من `'Gregorio Y. Zara'` إلى `'Hedy Lamarr'`. لاحظ كيف يتغير عنوان القائمة؟

أي تعبير JavaScript سيعمل بين الأقواس المعقوفة، بما في ذلك استدعاءات الدوال مثل `formatDate()`:
<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### أين يجب استخدام الأقواس المعقوفة؟ {/*where-to-use-curly-braces*/}

يمكنك استخدام الأقواس المعقوفة في JSX بطريقتين فقط:

1. **كنص** مباشرة داخل وسم JSX: `<h1>{name}'s قائمة المهام</h1>` يعمل، ولكن `<{tag}>قائمة المهام لـ Gregorio Y. Zara</{tag}>` لن يعمل.
2. **كخصائص** تأتي فورًا بعد علامة `=`: `src={avatar}` ستقرأ قيمة المتغير `avatar`، ولكن `src="{avatar}"` ستمرر `"{avatar}"` في صورة string.

## استخدام "أقواس معقوفة مزدوجة": CSS وكائنات أخرى داخل JSX {/*using-double-curlies-css-and-other-objects-in-jsx*/}

بالإضافة إلى strings والأرقام وتعابير JavaScript الأخرى، يمكنك تمرير الكائنات في JSX. يتم تمييز الكائنات أيضًا بواسطة الأقواس المعقوفة، مثل `{ name: "Hedy Lamarr", inventions: 5 }`. لذلك، لتمرير كائن JavaScript في JSX، يجب عليك إحاطة الكائن بزوج آخر من الأقواس المعقوفة: `person={{ name: "Hedy Lamarr", inventions: 5 }}`.

قد ترى ذلك في أنماط CSS المضمنة في JSX. React لا تتطلب منك استخدام أنماط CSS مضمنة (صنف CSS يعمل جيداً في معظم الحالات). ولكن عندما تحتاج إلى أسلوب مضمن، يمكنك تمرير كائن إلى خاصية `style`:

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
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

يمكنك رؤية كائن JavaScript بوضوح داخل الأقواس المعقوفة عندما تكتبه بهذه الطريقة:

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

في المرة القادمة التي ترى `{{` و `}}` في JSX، أعلم أنه ليس سوى كائن داخل أقواس JSX المعقوفة!

<Pitfall>

خصائص `style` المضمنة تكتب بتنسيق camelCase. على سبيل المثال، عنصر HTML `<ul style="background-color: black">` يتم كتابته في المكون الخاص بك على النحو التالي: `<ul style={{ backgroundColor: 'black' }}>`.

</Pitfall>

## المزيد من المرح مع كائنات JavaScript والأقواس المعقوفة! {/*more-fun-with-javascript-objects-and-curly-braces*/}

يمكنك دمج العديد من التعابير في كائن واحد والإشارة لهم في JSX الخاص بك داخل الأقواس المعقوفة:

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

في هذا المثال، يحتوي كائن JavaScript `person` على string `name` وكائن `theme`:

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

يمكن للمكوّن استخدام قيم من الكائن `person` كالتالي:

```js
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSX هي لغة قوالب بسيطة جدًا لأنها تسمح لك بتنظيم البيانات والمنطق باستخدام JavaScript.

<Recap>

الآن تعرف تقريبًا كل شيء عن JSX:

* يتم تمرير خصائص JSX في شكل strings داخل أقواس تنصيص
* تسمح لك الأقواس المعقوفة بإضافة منطق ومتغيرات JavaScript داخل الترميز الخاص بك.
* تعمل الأقواس المعقوفة داخل محتوى وسم JSX أو مباشرة بعد `=` في الخصائص.
* `{{` و `}}` ليست بصيغة خاصة: إنما هي كائن JavaScript موجود داخل أقواس JSX المعقوفة.

</Recap>

<Challenges>

#### أصلح الخطأ {/*fix-the-mistake*/}

هذا الكود يتعطل ويظهر خطأ  `Objects are not valid as a React child`:

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
      <h1>{person}'s Todos</h1>
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

هل يمكنك إيجاد المشكلة؟

<Hint>ابحث عن ما يوجد داخل الأقواس المجعدة. هل يتم وضع الشيء الصحيح هناك؟</Hint>

<Solution>

يحدث هذا بسبب أن هذا المثال يقوم بتصيير *كائن بذاته* في الترميز بدلاً من string: `<h1>{person}'s قائمة المهام</h1>` يحاول عرض كائن `person` بأكمله! إدراج الكائنات المباشرة كمحتوى نصي يُثير خطأ لأن React لا يعرف كيف ترغب في عرضها.

لحل هذه المشكلة، قم بتبديل `<h1>{person}'s Todos</h1>` بـ `<h1>{person.name}'s Todos</h1>`:

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

</Solution>

#### استخرج المعلومات إلى كائن {/*extract-information-into-an-object*/}

استخرج عنوان URL للصورة إلى كائن `person`.

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

<Solution>

قم بنقل عنوان URL للصورة إلى خاصية تسمى `person.imageUrl` وقم بقراءتها من وسم `<img>` باستخدام الأقواس المعقوفة:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
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
        src={person.imageUrl}
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

</Solution>

#### اكتب تعبيراً داخل أقواس JSX المعقوفة. {/*write-an-expression-inside-jsx-curly-braces*/}

في الكائن أدناه، يتم تقسيم العنوان الكامل للصورة إلى أربعة أجزاء: العنوان الأساس و`imageId` و`imageSize` وامتداد الملف.

نريد أن يتم دمج عنوان URL للصورة باستخدام هذه الخصائص معًا: العنوان الأساس (دائمًا `'https://i.imgur.com/'`) و`imageId` (`'7vQD0fP'`) و `imageSize` (`'s'`)، وامتداد الملف (دائمًا `'.jpg'`). ومع ذلك، هناك خطأ في كيفية تحديد الوسم `<img>` لخاصية `src` الخاصة به.

هل يمكنك إصلاح الخطأ؟

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
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
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
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
.avatar { border-radius: 50%; }
```

</Sandpack>

للتحقق من نجاح حلك، جرب تغيير قيمة `imageSize` إلى `'b'`. يفترض أن يتغير حجم الصورة بعد تعديلك.

<Solution>

يمكنك كتابته على هذا النحو `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`.

1. `{` تفتح التعبير الخاص بـ JavaScript
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` ينتج string URL الصحيح
3. `{` تغلق التعبير الخاص بـ JavaScript

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
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
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
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
.avatar { border-radius: 50%; }
```

</Sandpack>

يمكنك أيضًا نقل هذا التعبير إلى دالة منفصلة مثل `getImageUrl` في الأسفل:

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
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
        src={getImageUrl(person)}
        alt={person.name}
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

```js utils.js
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
