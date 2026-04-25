---
title: "مكوّن <Activity>"
---

<Intro>

`<Activity>` يتيح إخفاء واجهة المكوّنات الفرعية واستعادتها مع حالتها الداخلية.

```js
<Activity mode={visibility}>
  <Sidebar />
</Activity>
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `<Activity>` {/*activity*/}

يمكنك استخدام Activity لإخفاء جزء من تطبيقك:

```js [[1, 1, "\\"hidden\\""], [2, 2, "<Sidebar />"], [3, 1, "\\"visible\\""]]
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

عندما يكون حد Activity <CodeStep step={1}>مخفيًا (hidden)</CodeStep>، تخفي React بصريًا <CodeStep step={2}>أبناءه</CodeStep> باستخدام خاصية CSS `display: "none"`. كما تدمّر Effects الخاصة بهم وتنظّف أي اشتراكات نشطة.

أثناء الإخفاء، ما زال الأبناء يُعاد عرضهم استجابةً لخصائص جديدة، لكن بأولوية أقل من بقية المحتوى.

عندما يصبح الحد <CodeStep step={3}>ظاهرًا (visible)</CodeStep> مجددًا، تُظهر React الأبناء مع استعادة حالتهم السابقة وتُعيد إنشاء Effects.

بهذا الشكل، يمكن اعتبار Activity آلية لعرض «نشاط في الخلفية». بدل التخلص تمامًا من محتوى قد يظهر مجددًا، يمكنك بـ Activity الإبقاء على واجهة ذلك المحتوى وحالته الداخلية واستعادتهما، مع التأكد من أن المحتوى المخفي لا يسبب آثارًا جانبية غير مرغوبة.

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### الخصائص {/*props*/}

* `children`: واجهة المستخدم التي تريد إظهارها وإخفاءها.
* `mode`: سلسلة إما `'visible'` أو `'hidden'`. إذا حُذفت، الافتراضي `'visible'`. 

#### ملاحظات {/*caveats*/}

- إذا وُضع Activity داخل [ViewTransition](/reference/react/ViewTransition)، وأصبح ظاهرًا نتيجة تحديث سببه [startTransition](/reference/react/startTransition)، يُفعّل رسوم `enter` لـ ViewTransition. إذا أصبح مخفيًا، يُفعّل رسوم `exit`.
- Activity يعرض نصًا فقط لن يُصدر أي مخرجات بدل عرض نص مخفي، لأنه لا توجد عقدة DOM مطابقة لتطبيق تغييرات الظهور عليها. مثلًا، `<Activity mode="hidden"><ComponentThatJustReturnsText /></Activity>` لن تُنتج أي مخرجات في DOM لـ `const ComponentThatJustReturnsText = () => "Hello, World!"`.

---

## الاستخدام {/*usage*/}

### استعادة حالة المكوّنات المخفية {/*restoring-the-state-of-hidden-components*/}

في React، عندما تريد إظهار مكوّن أو إخفاءه مشروطًا، غالبًا تركّبه أو تزيله حسب الشرط:

```jsx
{isShowingSidebar && (
  <Sidebar />
)}
```

لكن إزالة تركيب (unmount) مكوّن تدمّر حالته الداخلية، وهذا ليس دائمًا ما تريده.

عندما تخفي مكوّنًا بحد Activity بدلًا من ذلك، «تحفظ» React حالته لوقت لاحق:

```jsx
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

هذا يجعل إخفاء المكوّنات ثم استعادتها لاحقًا بحالتها السابقة ممكنًا.

المثال التالي فيه شريط جانبي بقسم قابل للتوسيع. يمكنك الضغط على «Overview» لإظهار العناصر الفرعية الثلاثة تحته. منطقة التطبيق الرئيسية فيها زر لإخفاء الشريط الجانبي وإظهاره.

جرّب توسيع قسم Overview، ثم إغلاق الشريط الجانبي وفتحه:

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import Sidebar from './Sidebar.js';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <>
      {isShowingSidebar && (
        <Sidebar />
      )}

      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Toggle sidebar
        </button>
        <h1>Main content</h1>
      </main>
    </>
  );
}
```

```js src/Sidebar.js
import { useState } from 'react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        Overview
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <ul>
          <li>Section 1</li>
          <li>Section 2</li>
          <li>Section 3</li>
        </ul>
      )}
    </nav>
  );
}
```

```css
body { height: 275px; margin: 0; }
#root {
  display: flex;
  gap: 10px;
  height: 100%;
}
nav {
  padding: 10px;
  background: #eee;
  font-size: 14px;
  height: 100%;
}
main {
  padding: 10px;
}
p {
  margin: 0;
}
h1 {
  margin-top: 10px;
}
.indicator {
  margin-left: 4px;
  display: inline-block;
  rotate: 90deg;
}
.indicator.down {
  rotate: 180deg;
}
```

</Sandpack>

قسم Overview يبدأ دائمًا مطويًا. لأننا نزيل تركيب الشريط الجانبي عندما تصبح `isShowingSidebar` هي `false`، تضيع كل حالته الداخلية.

هذه حالة مثالية لـ Activity. يمكننا الحفاظ على الحالة الداخلية للشريط الجانبي حتى عند إخفائه بصريًا.

لنستبدل العرض المشروط للشريط الجانبي بحد Activity:

```jsx {7,9}
// Before
{isShowingSidebar && (
  <Sidebar />
)}

// After
<Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
  <Sidebar />
</Activity>
```

ثم لاحظ السلوك الجديد:

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';

import Sidebar from './Sidebar.js';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <>
      <Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
        <Sidebar />
      </Activity>

      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Toggle sidebar
        </button>
        <h1>Main content</h1>
      </main>
    </>
  );
}
```

```js src/Sidebar.js
import { useState } from 'react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        Overview
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <ul>
          <li>Section 1</li>
          <li>Section 2</li>
          <li>Section 3</li>
        </ul>
      )}
    </nav>
  );
}
```

```css
body { height: 275px; margin: 0; }
#root {
  display: flex;
  gap: 10px;
  height: 100%;
}
nav {
  padding: 10px;
  background: #eee;
  font-size: 14px;
  height: 100%;
}
main {
  padding: 10px;
}
p {
  margin: 0;
}
h1 {
  margin-top: 10px;
}
.indicator {
  margin-left: 4px;
  display: inline-block;
  rotate: 90deg;
}
.indicator.down {
  rotate: 180deg;
}
```

</Sandpack>

الحالة الداخلية للشريط الجانبي أصبحت تُستعاد، دون أي تغيير في تنفيذه.

---

### استعادة DOM للمكوّنات المخفية {/*restoring-the-dom-of-hidden-components*/}

بما أن حدود Activity تخفي أبناءها بـ `display: none`، يُحفظ DOM الأبناء أيضًا عند الإخفاء. هذا يجعلها ممتازة للإبقاء على حالة عابرة في أجزاء من الواجهة قد يتفاعل معها المستخدم مجددًا.

في هذا المثال، تبويب Contact فيه `<textarea>` يدخل فيها المستخدم رسالة. إذا أدخلت نصًا ثم انتقلت إلى تبويب Home ثم عدت إلى Contact، تضيع مسودة الرسالة:

<Sandpack>

```js src/App.js 
import { useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Contact from './Contact.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'contact'}
        onClick={() => setActiveTab('contact')}
      >
        Contact
      </TabButton>

      <hr />

      {activeTab === 'home' && <Home />}
      {activeTab === 'contact' && <Contact />}
    </>
  );
}
```

```js src/TabButton.js
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Contact.js active
export default function Contact() {
  return (
    <div>
      <p>Send me a message!</p>

      <textarea />

      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

ذلك لأننا نزيل تركيب `Contact` بالكامل في `App`. عند إزالة تركيب تبويب Contact، تضيع الحالة الداخلية لعنصر `<textarea>` في DOM.

إذا انتقلنا لاستخدام حد Activity لإظهار وإخفاء التبويب النشط، نحافظ على حالة DOM لكل تبويب. جرّب إدخال نص والتبديل بين التبويبات، ولن تُصفَّر المسودة بعد الآن:

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Contact from './Contact.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'contact'}
        onClick={() => setActiveTab('contact')}
      >
        Contact
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'contact' ? 'visible' : 'hidden'}>
        <Contact />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Contact.js 
export default function Contact() {
  return (
    <div>
      <p>Send me a message!</p>

      <textarea />

      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

مرة أخرى، سمح حد Activity بالحفاظ على الحالة الداخلية لتبويب Contact دون تغيير تنفيذه.

---

### عرض مسبق لمحتوى قد يظهر {/*pre-rendering-content-thats-likely-to-become-visible*/}

حتى الآن رأينا كيف يمكن لـ Activity إخفاء محتوى تفاعل معه المستخدم دون التخلص من حالته العابرة.

لكن حدود Activity يمكن استخدامها أيضًا لـ _تحضير_ محتوى لم يره المستخدم بعد:

```jsx [[1, 1, "\\"hidden\\""]]
<Activity mode="hidden">
  <SlowComponent />
</Activity>
```

عندما يكون حد Activity <CodeStep step={1}>مخفيًا</CodeStep> أثناء العرض الأولي، لن يكون الأبناء ظاهرين في الصفحة — لكنهم ما زالوا _يُعرضون_، بأولوية أقل من المحتوى الظاهر، ودون تركيب Effects لهم.

هذا _العرض المسبق_ يتيح للأبناء تحميل أي شيفرة أو بيانات يحتاجونها مبكرًا، حتى عندما يصبح الحد ظاهرًا لاحقًا يظهر الأبناء أسرع مع أوقات تحميل أقل.

لنرَ مثالًا.

في هذا العرض، تبويب Posts يحمّل بيانات. إذا ضغطته، ترى بديل Suspense أثناء الجلب:

<Sandpack>

```js src/App.js
import { useState, Suspense } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Posts from './Posts.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'posts'}
        onClick={() => setActiveTab('posts')}
      >
        Posts
      </TabButton>

      <hr />

      <Suspense fallback={<h1>🌀 Loading...</h1>}>
        {activeTab === 'home' && <Home />}
        {activeTab === 'posts' && <Posts />}
      </Suspense>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Posts.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Posts() {
  const posts = use(fetchData('/posts'));

  return (
    <ul className="items">
      {posts.map(post =>
        <li className="item" key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

ذلك لأن `App` لا تركّب `Posts` حتى يصبح تبويبه نشطًا.

إذا حدّثنا `App` لاستخدام حد Activity لإظهار وإخفاء التبويب النشط، يُعرض `Posts` مسبقًا عند أول تحميل للتطبيق، فيمكنه جلب بياناته قبل أن يصبح ظاهرًا.

جرّب النقر على تبويب Posts الآن:

<Sandpack>

```js src/App.js
import { Activity, useState, Suspense } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Posts from './Posts.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'posts'}
        onClick={() => setActiveTab('posts')}
      >
        Posts
      </TabButton>

      <hr />

      <Suspense fallback={<h1>🌀 Loading...</h1>}>
        <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
          <Home />
        </Activity>
        <Activity mode={activeTab === 'posts' ? 'visible' : 'hidden'}>
          <Posts />
        </Activity>
      </Suspense>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Posts.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Posts() {
  const posts = use(fetchData('/posts'));

  return (
    <ul className="items">
      {posts.map(post =>
        <li className="item" key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

تمكّن `Posts` من تهيئة نفسها لعرض أسرع بفضل حد Activity المخفي.

---

العرض المسبق للمكوّنات مع حدود Activity مخفية طريقة قوية لتقليل أوقات التحميل لأجزاء من الواجهة قد يتفاعل معها المستخدم لاحقًا.

<Note>

**فقط مصادر بيانات تدعم Suspense تُجلب أثناء العرض المسبق.** وتشمل:

- جلب البيانات مع أُطر تدعم Suspense مثل [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) و[Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)
- تحميل شيفرة المكوّن كسولًا بـ [`lazy`](/reference/react/lazy)
- قراءة قيمة Promise مخزّنة بـ [`use`](/reference/react/use)

Activity **لا** تكتشف البيانات المُجلبَة داخل Effect.

طريقة تحميل البيانات في مكوّن `Posts` أعلاه تعتمد على إطارك. إذا استخدمت إطارًا يدعم Suspense، ستجد التفاصيل في توثيق جلب البيانات لديه.

جلب البيانات مع Suspense دون إطار جاهز غير مدعوم بعد. متطلبات تنفيذ مصدر بيانات يدعم Suspense غير مستقرة وغير موثّقة. ستُصدَر واجهة رسمية لدمج مصادر البيانات مع Suspense في إصدار مستقبل من React.

</Note>

---


### تسريع التفاعلات أثناء تحميل الصفحة {/*speeding-up-interactions-during-page-load*/}

تتضمن React تحسينًا للأداء داخليًا يُسمى Selective Hydration. يعمل بترطيب HTML الأولي للتطبيق _على دفعات_، ما يتيح لمكوّنات أن تصبح تفاعلية حتى لو لم تُحمَّل شيفرة أو بيانات مكوّنات أخرى بعد.

حدود Suspense تشارك في Selective Hydration، لأنها تقسّم شجرة المكوّنات طبيعيًا إلى وحدات مستقلة عن بعضها:

```jsx
function Page() {
  return (
    <>
      <MessageComposer />

      <Suspense fallback="Loading chats...">
        <Chats />
      </Suspense>
    </>
  )
}
```

هنا، يمكن ترطيب `MessageComposer` بالكامل أثناء العرض الأولي للصفحة، حتى قبل تركيب `Chats` وبدء جلب بياناته.

إذًا بتقسيم شجرة المكوّنات إلى وحدات منفصلة، يتيح Suspense لـ React ترطيب HTML المُصادَر من الخادم على دفعات، فتصبح أجزاء من التطبيق تفاعلية بأسرع ما يمكن.

ماذا عن الصفحات التي لا تستخدم Suspense؟

انظر مثال التبويبات:

```jsx
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      {activeTab === 'home' && (
        <Home />
      )}
      {activeTab === 'video' && (
        <Video />
      )}
    </>
  )
}
```

هنا، يجب على React ترطيب الصفحة بأكملها دفعة واحدة. إذا كان عرض `Home` أو `Video` أبطأ، قد تجعل أزرار التبويب تبدو غير مستجيبة أثناء الترطيب.

إضافة Suspense حول التبويب النشط تحل هذا:

```jsx {13,20}
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      <Suspense fallback={<Placeholder />}>
        {activeTab === 'home' && (
          <Home />
        )}
        {activeTab === 'video' && (
          <Video />
        )}
      </Suspense>
    </>
  )
}
```

...لكن ذلك يغيّر الواجهة أيضًا، إذ سيُعرض بديل `Placeholder` في العرض الأولي.

بدلًا من ذلك، يمكننا استخدام Activity. بما أن حدود Activity تُظهر وتخفي أبناءها، فهي تقسّم شجرة المكوّنات طبيعيًا إلى وحدات مستقلة. ومثل Suspense، تتيح هذه الميزة المشاركة في Selective Hydration.

لنحدّث مثالنا لاستخدام حدود Activity حول التبويب النشط:

```jsx {13-18}
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      <Activity mode={activeTab === "home" ? "visible" : "hidden"}>
        <Home />
      </Activity>
      <Activity mode={activeTab === "video" ? "visible" : "hidden"}>
        <Video />
      </Activity>
    </>
  )
}
```

الآن يبدو HTML الأولي المُصادَر من الخادم كما في النسخة الأصلية، لكن بفضل Activity يمكن لـ React ترطيب أزرار التبويب أولًا، قبل أن تركّب `Home` أو `Video` حتى.

---

إذًا، إضافةً إلى إخفاء المحتوى وإظهاره، تساعد حدود Activity على أداء التطبيق أثناء الترطيب بإعلام React أي أجزاء من الصفحة يمكن أن تصبح تفاعلية بمعزل عن غيرها.

حتى إذا لم تخفِ صفحتك جزءًا من محتواها أبدًا، يمكنك إضافة حدود Activity دائمة الظهور لتحسين أداء الترطيب:

```jsx
function Page() {
  return (
    <>
      <Post />

      <Activity>
        <Comments />
      </Activity>
    </>
  );
} 
```

---

## استكشاف الأخطاء {/*troubleshooting*/}

### لمكوّناتي المخفية آثار جانبية غير مرغوبة {/*my-hidden-components-have-unwanted-side-effects*/}

حد Activity يخفي محتواه بضبط `display: none` على أبنائه وتنظيف Effects الخاصة بهم. لذلك، أغلب مكوّنات React المنضبطة التي تنظّف آثارها الجانبية جيدًا تكون بالفعل قوية أمام الإخفاء بـ Activity.

لكن توجد _حالات_ يتصرّف فيها المكوّن المخفي بشكل مختلف عن المُزال تركيبه. الأبرز أن DOM المكوّن المخفي لا يُدمّر، فتبقى أي آثار جانبية من ذلك DOM، حتى بعد إخفاء المكوّن.

كمثال، فكّر في وسم `<video>`. غالبًا لا يحتاج تنظيفًا، لأن إزالة تركيب الوسم يوقف الفيديو والصوت في المتصفح حتى أثناء التشغيل. جرّب تشغيل الفيديو ثم الضغط على Home في هذا العرض:

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      {activeTab === 'home' && <Home />}
      {activeTab === 'video' && <Video />}
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js 
export default function Video() {
  return (
    <video
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
      controls
      playsInline
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

يتوقف الفيديو عن التشغيل كما متوقع.

الآن، لنفترض أننا نريد الحفاظ على نقطة الزمن التي شاهد عندها المستخدم آخر مرة، حتى عند العودة إلى تبويب الفيديو لا يبدأ من البداية.

هذه حالة ممتازة لـ Activity!

لنحدّث `App` لإخفاء التبويب غير النشط بحد Activity مخفي بدل إزالة تركيبه، ولنرَ سلوك العرض هذه المرة:

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'video' ? 'visible' : 'hidden'}>
        <Video />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js 
export default function Video() {
  return (
    <video
      controls
      playsInline
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

عفوًا! يستمر الفيديو والصوت في التشغيل حتى بعد الإخفاء، لأن عنصر `<video>` في التبويب ما زال في DOM.

للإصلاح، يمكننا إضافة Effect بدالة تنظيف توقف الفيديو:

```jsx {2,4-10,14}
export default function VideoTab() {
  const ref = useRef();

  useLayoutEffect(() => {
    const videoRef = ref.current;

    return () => {
      videoRef.pause()
    }
  }, []);

  return (
    <video
      ref={ref}
      controls
      playsInline
      src="..."
    />

  );
}
```

نستدعي `useLayoutEffect` بدل `useEffect` لأن تنظيف الشيفرة مرتبط مفهوميًا بإخفاء واجهة المكوّن بصريًا. لو استخدمنا effect عاديًا، قد يتأخر التنفيذ بسبب (مثلًا) حد Suspense يُعلّق مجددًا أو View Transition.

لنرَ السلوك الجديد. جرّب تشغيل الفيديو، والانتقال إلى تبويب Home، ثم العودة إلى Video:

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'video' ? 'visible' : 'hidden'}>
        <Video />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js 
import { useRef, useLayoutEffect } from 'react';

export default function Video() {
  const ref = useRef();

  useLayoutEffect(() => {
    const videoRef = ref.current

    return () => {
      videoRef.pause()
    };
  }, [])

  return (
    <video
      ref={ref}
      controls
      playsInline
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

يعمل بشكل ممتاز! دالة التنظيف تضمن توقف الفيديو إذا أُخفي بحد Activity، والأفضل أن وسم `<video>` لا يُدمّر أبدًا، فيُحفظ مؤشر الزمن، ولا حاجة لإعادة تهيئة الفيديو أو تنزيله عندما يعود المستخدم لمتابعة المشاهدة.

هذا مثال رائع لاستخدام Activity للحفاظ على حالة DOM عابرة لأجزاء من الواجهة تُخفى لكن المستخدم قد يتفاعل معها قريبًا.

---

يوضح مثالنا أن لوسوم مثل `<video>` سلوكًا مختلفًا بين الإخفاء وإزالة التركيب. إذا كان المكوّن يعرض DOM له أثر جانبي وتريد منع ذلك الأثر عند إخفاء Activity، أضف Effect تُرجع منه دالة تنظيف.

أشيع الحالات لهذا من الوسوم التالية:

  - `<video>`
  - `<audio>`
  - `<iframe>`

عادةً، أغلب مكوّناتك يجب أن تكون بالفعل قوية أمام الإخفاء بـ Activity. ومفهوميًا، اعتبر Activities «المخفية» كأنها مُزالَة تركيبها.

للعثور مبكرًا على Effects بلا تنظيف سليم—وهو مهم ليس فقط لحدود Activity بل لسلوكيات كثيرة في React—نوصي باستخدام [`<StrictMode>`](/reference/react/StrictMode).

---


### لمكوّناتي المخفية Effects لا تعمل {/*my-hidden-components-have-effects-that-arent-running*/}

عندما يكون `<Activity>` «مخفيًا»، تُنظَّف كل Effects الأبناء. مفهوميًا، الأبناء مُزالَة تركيبهم، لكن React تحفظ حالتهم لاحقًا. هذه ميزة لـ Activity لأن الاشتراكات لا تبقى نشطة للأجزاء المخفية من الواجهة، ما يقلل العمل المطلوب للمحتوى المخفي.

إذا كنت تعتمد على تركيب Effect لتنظيف آثار جانبية، أعد هيكلة Effect لينفّذ التنظيم في دالة التنظيم المُرجعة بدلًا من ذلك.

للعثور مبكرًا على Effects إشكالية، نوصي بإضافة [`<StrictMode>`](/reference/react/StrictMode) الذي يُعيد بشكل مبكر إزالات وتركيبات Activity لالتقاط آثار جانبية غير متوقعة.
