---
title: <StrictMode>
---


<Intro>

`<StrictMode>` يتيح لك اكتشاف أخطاء شائعة في مكوّناتك مبكرًا أثناء التطوير.


```js
<StrictMode>
  <App />
</StrictMode>
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `<StrictMode>` {/*strictmode*/}

استخدم `StrictMode` لتفعيل سلوكيات وتنبيهات إضافية للتطوير لشجرة المكوّنات بداخله:

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

Strict Mode يفعّل السلوكيات التالية في التطوير فقط:

- ستُعاد [مكوّناتك رسمًا مرة إضافية](#fixing-bugs-found-by-double-rendering-in-development) لاكتشاف أخطاء ناتجة عن رسم غير نقي.
- ستُعاد [تشغيل التأثيرات مرة إضافية](#fixing-bugs-found-by-re-running-effects-in-development) لاكتشاف أخطاء ناتجة عن نقص تنظيف التأثير.
- ستُعاد [استدعاءات ref callbacks مرة إضافية](#fixing-bugs-found-by-re-running-ref-callbacks-in-development) لاكتشاف أخطاء ناتجة عن نقص تنظيف الـ ref.
- ستُفحص [مكوّناتك لاستخدام واجهات برمجة مُهجَرة.](#fixing-deprecation-warnings-enabled-by-strict-mode)

#### Props {/*props*/}

`StrictMode` لا يقبل props.

#### ملاحظات مهمة {/*caveats*/}

* لا يمكن تعطيل Strict Mode داخل شجرة ملفوفة بـ `<StrictMode>`. هذا يمنحك ثقة أن كل المكوّنات داخله تُفحص. إذا اختلف فريقان حول فائدة الفحوصات، يجب التوصل لاتفاق أو نقل `<StrictMode>` لأسفل في الشجرة.

---

## الاستخدام {/*usage*/}

### تفعيل Strict Mode للتطبيق كله {/*enabling-strict-mode-for-entire-app*/}

يُفعّل Strict Mode فحوصات إضافية للتطوير فقط على شجرة المكوّنات بأكملها داخل مكوّن `<StrictMode>`. تساعدك هذه الفحوصات على اكتشاف أخطاء شائعة في مكوّناتك مبكرًا أثناء التطوير.


لتفعيل Strict Mode لتطبيقك كله، لفّ المكوّن الجذري بـ`<StrictMode>` عند رسمه:

```js {6,8}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

ننصح بلفّ التطبيق كله بـ Strict Mode، خصوصًا للتطبيقات الجديدة. إذا كان إطارك يستدعي [`createRoot`](/reference/react-dom/client/createRoot) نيابةً عنك، راجع توثيقه لمعرفة كيفية تفعيل Strict Mode.

رغم أن فحوصات Strict Mode **تعمل في التطوير فقط،** فهي تساعدك على إيجاد أخطاء موجودة أصلًا في كودك يصعُب إعادة إنتاجها بثبات في الإنتاج. يتيح لك Strict Mode إصلاح الأخطاء قبل أن يبلغك المستخدمون.

<Note>

يُفعّل Strict Mode الفحوصات التالية في التطوير:

- ستُعاد [رسم مكوّناتك مرة إضافية](#fixing-bugs-found-by-double-rendering-in-development) لاكتشاف أخطاء ناتجة عن رسم غير نقي.
- ستُعاد [تشغيل التأثيرات مرة إضافية](#fixing-bugs-found-by-re-running-effects-in-development) لاكتشاف أخطاء ناتجة عن نقص تنظيف التأثير.
- ستُعاد [استدعاءات ref callbacks مرة إضافية](#fixing-bugs-found-by-re-running-ref-callbacks-in-development) لاكتشاف أخطاء ناتجة عن نقص تنظيف الـ ref.
- ستُفحص [مكوّناتك لاستخدام واجهات برمجة مُهجَرة.](#fixing-deprecation-warnings-enabled-by-strict-mode)

**كل هذه الفحوصات للتطوير فقط ولا تؤثر على بنية الإنتاج.**

</Note>

---

### تفعيل Strict Mode لجزء من التطبيق {/*enabling-strict-mode-for-a-part-of-the-app*/}

يمكنك أيضًا تفعيل Strict Mode لأي جزء من التطبيق:

```js {7,12}
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

في هذا المثال، لن تُشغَّل فحوصات Strict Mode على مكوّني `Header` و`Footer`. لكنها ستُشغَّل على `Sidebar` و`Content` وكل المكوّنات بداخلهما مهما عمقت الشجرة.

<Note>

عند تفعيل `StrictMode` لجزء من التطبيق، تُفعّل React فقط السلوكيات الممكنة في الإنتاج. مثلًا، إذا لم يُفعَّل `<StrictMode>` عند الجذر، فلن [تُعاد تشغيل التأثيرات مرة إضافية](#fixing-bugs-found-by-re-running-effects-in-development) عند التركيب الأول، لأن ذلك سيجعل تأثيرات الأبناء تُشغَّل مرتين دون تأثيرات الآباء، وهو ما لا يحدث في الإنتاج.

</Note>

---

### إصلاح أخطاء يكشفها الرسم المزدوج في التطوير {/*fixing-bugs-found-by-double-rendering-in-development*/}

[React يفترض أن كل مكوّن تكتبه دالة نقية.](/learn/keeping-components-pure) أي أن مكوّنات React التي تكتبها يجب أن تعيد دائمًا نفس JSX عند نفس المدخلات (props والحالة والسياق).

المكوّنات التي تخرق هذا القاعدة تتصرف بشكل غير متوقع وتسبب أخطاء. لمساعدتك على إيجاد كود غير نقي بالخطأ، يستدعي Strict Mode بعض دوالك (التي يفترض أن تكون نقية فقط) **مرتين في التطوير.** يشمل ذلك:

- جسم دالة المكوّن (منطق المستوى الأعلى فقط، ولا يشمل الكود داخل معالجات الأحداث)
- الدوال التي تمررها إلى [`useState`](/reference/react/useState)، أو [دوال `set`](/reference/react/useState#setstate)، أو [`useMemo`](/reference/react/useMemo)، أو [`useReducer`](/reference/react/useReducer)
- بعض طرق مكوّنات الصنف مثل [`constructor`](/reference/react/Component#constructor)، و[`render`](/reference/react/Component#render)، و[`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) ([اطلع على القائمة كاملة](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects))

إذا كانت الدالة نقية، فتشغيلها مرتين لا يغيّر سلوكها لأنها تُنتج نفس النتيجة في كل مرة. أما إن كانت غير نقية (مثلًا تعدّل البيانات التي تتلقاها)، فغالبًا يظهر تشغيلها مرتين (وهذا ما يجعلها غير نقية!) فيساعدك ذلك على اكتشاف الخطأ وإصلاحه مبكرًا.

**إليك مثال يوضّح كيف يساعدك الرسم المزدوج في Strict Mode على إيجاد الأخطاء مبكرًا.**

يأخذ مكوّن `StoryTray` هذا مصفوفة `stories` ويضيف عنصرًا أخيرًا «Create Story» في النهاية:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

يوجد خطأ في الكود أعلاه. لكن من السهل تفويته لأن المخرج الأول يبدو صحيحًا.

يصبح الخطأ أوضح إذا أعاد مكوّن `StoryTray` الرسم عدة مرات. مثلًا، لنجعل `StoryTray` يُعاد رسمه بلون خلفية مختلف عند تمرير المؤشر فوقه:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

لاحظ أنه في كل مرة تمرّر فيها المؤشر فوق `StoryTray`، تُضاف «Create Story» إلى القائمة مجددًا. كان المقصود إضافتها مرة واحدة في النهاية. لكن `StoryTray` يعدّل مصفوفة `stories` القادمة من الـ props مباشرة. في كل مرة يُرسم فيها `StoryTray`، يُضاف «Create Story» مرة أخرى إلى نهاية نفس المصفوفة. بعبارة أخرى، `StoryTray` ليست دالة نقية — تشغيلها عدة مرات يُنتج نتائج مختلفة.

لإصلاح المشكلة، انسخ المصفوفة وعدّل النسخة بدل الأصل:

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // Clone the array
  // ✅ Good: Pushing into a new array
  items.push({ id: 'create', label: 'Create Story' });
```

هذا [يجعل دالة `StoryTray` نقية.](/learn/keeping-components-pure) في كل استدعاء تعدّل نسخة جديدة فقط من المصفوفة، ولا تؤثر على كائنات أو متغيرات خارجية. يحل ذلك الخطأ، لكنك احتجت لإعادة رسم المكوّن أكثر قبل أن يصبح واضحًا أن سلوكه خاطئ.

**في المثال الأصلي، لم يكن الخطأ واضحًا. الآن لِنلفّ الكود الأصلي (الخاطئ) بـ`<StrictMode>`:**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**Strict Mode يستدعي دالة الرسم *دائمًا* مرتين، فترى الخطأ فورًا** (تظهر «Create Story» مرتين). يتيح لك ذلك ملاحظة مثل هذه الأخطاء مبكرًا. عندما تُصلح المكوّن ليعمل في Strict Mode، *تُصلح* أيضًا أخطاء إنتاج محتملة كثيرة مثل سلوك التمرير السابق:

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // Clone the array
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

بدون Strict Mode، كان من السهل تفويت الخطأ حتى تضيف المزيد من إعادات الرسم. Strict Mode جعل نفس الخطأ يظهر فورًا. يساعدك Strict Mode على إيجاد الأخطاء قبل دفعها لفريقك ومستخدميك.

[اقرأ المزيد عن إبقاء المكوّنات نقية.](/learn/keeping-components-pure)

<Note>

إذا ثبّتت [أدوات مطوّري React](/learn/react-developer-tools)، ستظهر استدعاءات `console.log` أثناء الرسم الثاني باهتة قليلًا. توفر React DevTools أيضًا إعدادًا (معطّلًا افتراضيًا) لإخفائها بالكامل.

</Note>

---

### إصلاح أخطاء يكشفها إعادة تشغيل التأثيرات في التطوير {/*fixing-bugs-found-by-re-running-effects-in-development*/}

يمكن لـ Strict Mode أيضًا المساعدة في إيجاد أخطاء في [التأثيرات.](/learn/synchronizing-with-effects)

لكل تأثير كود إعداد وقد يكون له كود تنظيف. عادةً، تستدعي React الإعداد عند *تركيب* المكوّن (إضافته للشاشة) والتنظيف عند *إلغاء تركيبه* (إزالته من الشاشة). ثم تستدعي التنظيف والإعداد مجددًا إذا تغيّرت تبعياته منذ آخر رسم.

عند تفعيل Strict Mode، تشغّل React أيضًا **دورة إعداد+تنظيف إضافية في التطوير لكل تأثير.** قد يبدو ذلك مفاجئًا، لكنه يكشف أخطاء دقيقة يصعُب اصطيادها يدويًا.

**إليك مثال يوضّح كيف تساعدك إعادة تشغيل التأثيرات في Strict Mode على إيجاد الأخطاء مبكرًا.**

انظر إلى هذا المثال الذي يصل مكوّنًا بخدمة دردشة:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

هناك مشكلة في هذا الكود، لكنها قد لا تكون واضحة فورًا.

لنجعل المشكلة أوضح، لننفّذ ميزة. في المثال أدناه، `roomId` ليس ثابتًا في الكود. بدلًا من ذلك، يختار المستخدم `roomId` الذي يريد الاتصال به من قائمة منسدلة. انقر «Open chat» ثم اختر غرف دردشة مختلفة واحدة تلو الأخرى. تتبع عدد الاتصالات النشطة في وحدة التحكم:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

ستلاحظ أن عدد الاتصالات المفتوحة يزداد دائمًا. في تطبيق حقيقي، يسبب ذلك مشاكل أداء وشبكة. المشكلة أن [تأثيرك يفتقد دالة تنظيف:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

بعد أن يصبح تأثيرك «ينظّف» نفسه ويدمر الاتصالات القديمة، تُحل التسرّب. لكن لاحظ أن المشكلة لم تظهر حتى أضفت ميزات أكثر (مربع الاختيار).

**في المثال الأصلي، لم يكن الخطأ واضحًا. الآن لِنلفّ الكود الأصلي (الخاطئ) بـ`<StrictMode>`:**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**مع Strict Mode، ترى فورًا أن هناك مشكلة** (عدد الاتصالات النشطة يقفز إلى 2). يشغّل Strict Mode دورة إعداد+تنظيف إضافية لكل تأثير. هذا التأثير بلا تنظيف، فيُنشئ اتصالًا إضافيًا ولا يدمّره. هذا تلميح بأنك تفتقد دالة تنظيف.

يساعدك Strict Mode على ملاحظة مثل هذه الأخطاء مبكرًا. عندما تُصلح التأثير بإضافة تنظيف في Strict Mode، *تُصلح* أيضًا أخطاء إنتاج محتملة كثيرة مثل مربع الاختيار السابق:

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

لاحظ أن عدد الاتصالات النشطة في وحدة التحكم لم يعد يتزايد باستمرار.

بدون Strict Mode، كان من السهل تفويت أن تأثيرك يحتاج تنظيمًا. بتشغيل *إعداد → تنظيف → إعداد* بدل *إعداد* فقط لتأثيرك في التطوير، جعل Strict Mode نقص منطق التنظيف أكثر بروزًا.

[اقرأ المزيد عن تنفيذ تنظيف التأثير.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---
### إصلاح أخطاء يكشفها إعادة تشغيل استدعاءات ref في التطوير {/*fixing-bugs-found-by-re-running-ref-callbacks-in-development*/}

يمكن لـ Strict Mode أيضًا المساعدة في إيجاد أخطاء في [استدعاءات ref (callback refs).](/learn/manipulating-the-dom-with-refs)

لكل callback `ref` كود إعداد وقد يكون له تنظيف. عادةً، تستدعي React الإعداد عند *إنشاء* العنصر (إضافته إلى DOM) والتنظيف عند *إزالته* من DOM.

عند تفعيل Strict Mode، تشغّل React أيضًا **دورة إعداد+تنظيف إضافية في التطوير لكل callback `ref`.** قد يبدو ذلك مفاجئًا، لكنه يكشف أخطاء دقيقة يصعُب اصطيادها يدويًا.

انظر إلى هذا المثال الذي يتيح اختيار حيوان ثم التمرير إليه. لاحظ عند التبديل بين «Cats» و«Dogs» أن سجلات وحدة التحكم تُظهر أن عدد الحيوانات في القائمة يزداد، وتتوقف أزرار «Scroll to» عن العمل:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ❌ Not using StrictMode.
root.render(<App />);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  // 🚩 No cleanup, this is a bug!
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>


**هذا خطأ إنتاجي!** بما أن callback الـ ref لا يزيل الحيوانات من القائمة في التنظيف، تستمر القائمة بالنمو. هذا تسرّب ذاكرة قد يسبب مشاكل أداء في تطبيق حقيقي، ويكسر سلوك التطبيق.

المشكلة أن callback الـ ref لا ينظّف نفسه:

```js {6-8}
<li
  ref={node => {
    const list = itemsRef.current;
    const item = {animal, node};
    list.push(item);
    return () => {
      // 🚩 No cleanup, this is a bug!
    }
  }}
</li>
```

الآن لِنلفّ الكود الأصلي (الخاطئ) بـ`<StrictMode>`:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  // 🚩 No cleanup, this is a bug!
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

**مع Strict Mode، ترى فورًا أن هناك مشكلة.** يشغّل Strict Mode دورة إعداد+تنظيف إضافية لكل callback ref. هذا الـ callback بلا تنظيف، فيضيف عناصر ولا يزيلها. هذا تلميح بأنك تفتقد دالة تنظيف.

يساعدك Strict Mode على اكتشاف أخطاء callback refs مبكرًا. عندما تُصلح الـ callback بإضافة تنظيف في Strict Mode، *تُصلح* أيضًا أخطاء إنتاج محتملة كثيرة مثل خطأ «Scroll to» السابق:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  list.splice(list.indexOf(item), 1);
                  console.log(`❌ Removing cat from the map. Total cats: ${itemsRef.current.length}`);
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

الآن عند التركيب الأول في StrictMode، تُستدعى استدعاءات الـ ref كلها: إعداد، ثم تنظيف، ثم إعداد مجددًا:

```
...
✅ Adding animal to the map. Total animals: 10
...
❌ Removing animal from the map. Total animals: 0
...
✅ Adding animal to the map. Total animals: 10
```

**This is expected.** Strict Mode confirms that the ref callbacks are cleaned up correctly, so the size never grows above the expected amount. After the fix, there are no memory leaks, and all the features work as expected.

Without Strict Mode, it was easy to miss the bug until you clicked around to app to notice broken features. Strict Mode made the bugs appear right away, before you push them to production.

---
### Fixing deprecation warnings enabled by Strict Mode {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}

React warns if some component anywhere inside a `<StrictMode>` tree uses one of these deprecated APIs:

* `UNSAFE_` class lifecycle methods like [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount). [See alternatives.](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles)

These APIs are primarily used in older [class components](/reference/react/Component) so they rarely appear in modern apps.
