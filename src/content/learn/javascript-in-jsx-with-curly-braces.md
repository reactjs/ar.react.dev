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

## More fun with JavaScript objects and curly braces {/*more-fun-with-javascript-objects-and-curly-braces*/}

You can move several expressions into one object, and reference them in your JSX inside curly braces:

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

In this example, the `person` JavaScript object contains a `name` string and a `theme` object:

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

The component can use these values from `person` like so:

```js
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSX is very minimal as a templating language because it lets you organize data and logic using JavaScript.

<Recap>

Now you know almost everything about JSX:

* JSX attributes inside quotes are passed as strings.
* Curly braces let you bring JavaScript logic and variables into your markup.
* They work inside the JSX tag content or immediately after `=` in attributes.
* `{{` and `}}` is not special syntax: it's a JavaScript object tucked inside JSX curly braces.

</Recap>

<Challenges>

#### Fix the mistake {/*fix-the-mistake*/}

This code crashes with an error saying `Objects are not valid as a React child`:

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

Can you find the problem?

<Hint>Look for what's inside the curly braces. Are we putting the right thing there?</Hint>

<Solution>

This is happening because this example renders *an object itself* into the markup rather than a string: `<h1>{person}'s Todos</h1>` is trying to render the entire `person` object! Including raw objects as text content throws an error because React doesn't know how you want to display them.

To fix it, replace `<h1>{person}'s Todos</h1>` with `<h1>{person.name}'s Todos</h1>`:

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

#### Extract information into an object {/*extract-information-into-an-object*/}

Extract the image URL into the `person` object.

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

Move the image URL into a property called `person.imageUrl` and read it from the `<img>` tag using the curlies:

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

#### Write an expression inside JSX curly braces {/*write-an-expression-inside-jsx-curly-braces*/}

In the object below, the full image URL is split into four parts: base URL, `imageId`, `imageSize`, and file extension.

We want the image URL to combine these attributes together: base URL (always `'https://i.imgur.com/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`), and file extension (always `'.jpg'`). However, something is wrong with how the `<img>` tag specifies its `src`.

Can you fix it?

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

To check that your fix worked, try changing the value of `imageSize` to `'b'`. The image should resize after your edit.

<Solution>

You can write it as `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`.

1. `{` opens the JavaScript expression
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` produces the correct URL string
3. `}` closes the JavaScript expression

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

You can also move this expression into a separate function like `getImageUrl` below:

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

Variables and functions can help you keep the markup simple!

</Solution>

</Challenges>
