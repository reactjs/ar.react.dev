---
title: use
---

<Intro>

`use` هي واجهة في React تتيح لك قراءة قيمة مورد مثل [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) أو [السياق (context)](/learn/passing-data-deeply-with-context).

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `use(resource)` {/*use*/}

استدعِ `use` في مكوّنك لقراءة قيمة مورد مثل [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) أو [السياق](/learn/passing-data-deeply-with-context).

```jsx
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
```

على عكس Hooks في React، يمكن استدعاء `use` داخل حلقات وجمل شرطية مثل `if`. وكـ Hooks، يجب أن تكون الدالة التي تستدعي `use` إما مكوّنًا أو Hook.

عند استدعائها مع Promise، تتكامل واجهة `use` مع [`Suspense`](/reference/react/Suspense) و[حدود الأخطاء (Error Boundaries)](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). المكوّن الذي يستدعي `use` يدخل حالة *تعليق (suspend)* طالما Promise المُمرَّرة إلى `use` قيد الانتظار. إذا كان المكوّن ملفوفًا بحد Suspense، يُعرض الـ fallback. عند حل Promise، يُستبدل fallback الـ Suspense بالمكوّنات المرسومة باستخدام البيانات التي تُرجعها واجهة `use`. إذا رُفضت Promise المُمرَّرة إلى `use`، يُعرض fallback أقرب Error Boundary.

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### Parameters {/*parameters*/}

* `resource`: مصدر البيانات التي تريد قراءة قيمة منها. يمكن أن يكون المورد [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) أو [سياقًا](/learn/passing-data-deeply-with-context).

#### Returns {/*returns*/}

تُرجع واجهة `use` القيمة المقروءة من المورد، مثل القيمة المحلولة لـ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) أو [السياق](/learn/passing-data-deeply-with-context).

#### Caveats {/*caveats*/}

* يجب استدعاء واجهة `use` داخل مكوّن أو Hook.
* عند جلب البيانات في [Server Component](/reference/rsc/server-components)، فضّل `async` و`await` على `use`. يستأنف `async` و`await` الرسم من النقطة التي استُدعي فيها `await`، بينما يُعيد `use` رسم المكوّن بعد حل البيانات.
* فضّل إنشاء الـ Promises في [Server Components](/reference/rsc/server-components) وتمريرها إلى [Client Components](/reference/rsc/use-client) على إنشائها في Client Components. تُعاد إنشاء الـ Promises في Client Components في كل رسم. الـ Promises المُمرَّرة من Server Component إلى Client Component تبقى ثابتة عبر إعادات الرسم. [اطلع على هذا المثال](#streaming-data-from-server-to-client).

---

## Usage {/*usage*/}

### Reading context with `use` {/*reading-context-with-use*/}

عند تمرير [سياق](/learn/passing-data-deeply-with-context) إلى `use`، يعمل بشكل مشابه لـ [`useContext`](/reference/react/useContext). بينما يجب استدعاء `useContext` في أعلى المكوّن، يمكن استدعاء `use` داخل شروط مثل `if` وحلقات مثل `for`. يُفضَّل `use` على `useContext` لأنه أكثر مرونة.

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ... 
```

`use` يُرجع <CodeStep step={2}>قيمة السياق</CodeStep> للـ <CodeStep step={1}>سياق</CodeStep> الذي مررته. لتحديد قيمة السياق، يبحث React في شجرة المكوّنات ويجد **أقرب موفّر سياق فوق** ذلك السياق.

لتمرير السياق إلى `Button`، لفّه أو أحد مكوّناته الأب بموفّر السياق المناسب.

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

لا يهم عدد طبقات المكوّنات بين الموفر و`Button`. عندما يستدعي `Button` *في أي مكان* داخل `Form` الدالة `use(ThemeContext)`، سيستلم `"dark"` كقيمة.

على عكس [`useContext`](/reference/react/useContext)، يمكن استدعاء <CodeStep step={2}>`use`</CodeStep> في شروط وحلقات مثل <CodeStep step={1}>`if`</CodeStep>.

```js [[1, 2, "if"], [2, 3, "use"]]
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

يُستدعى <CodeStep step={2}>`use`</CodeStep> من داخل جملة <CodeStep step={1}>`if`</CodeStep>، مما يسمح بقراءة قيم السياق بشكل شرطي.

<Pitfall>

مثل `useContext`، تبحث `use(context)` دائمًا عن أقرب موفّر سياق *فوق* المكوّن الذي يستدعيها. تبحث للأعلى و**لا** تأخذ في الاعتبار موفّري السياق في المكوّن الذي تستدعي منه `use(context)`.

</Pitfall>

<Sandpack>

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button show={true}>Sign up</Button>
      <Button show={false}>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

### Streaming data from the server to the client {/*streaming-data-from-server-to-client*/}

يمكن بث البيانات من الخادم إلى العميل بتمرير Promise كـ prop من <CodeStep step={1}>Server Component</CodeStep> إلى <CodeStep step={2}>Client Component</CodeStep>.

```js [[1, 4, "App"], [2, 2, "Message"], [3, 7, "Suspense"], [4, 8, "messagePromise", 30], [4, 5, "messagePromise"]]
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

يأخذ <CodeStep step={2}>Client Component</CodeStep> بعدها <CodeStep step={4}>الـ Promise التي استلمها كـ prop</CodeStep> ويمرّرها إلى واجهة <CodeStep step={5}>`use`</CodeStep>. هذا يتيح لـ <CodeStep step={2}>Client Component</CodeStep> قراءة القيمة من <CodeStep step={4}>الـ Promise</CodeStep> التي أنشأها Server Component في البداية.

```js [[2, 6, "Message"], [4, 6, "messagePromise"], [4, 7, "messagePromise"], [5, 7, "use"]]
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```
بما أن <CodeStep step={2}>`Message`</CodeStep> ملفوف في <CodeStep step={3}>[`Suspense`](/reference/react/Suspense)</CodeStep>، يُعرض الـ fallback حتى تُحل Promise. عند حلها، تقرأ واجهة <CodeStep step={5}>`use`</CodeStep> القيمة ويستبدل مكوّن <CodeStep step={2}>`Message`</CodeStep> fallback الـ Suspense.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 1000, "⚛️"));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

</Sandpack>

<Note>

عند تمرير Promise من Server Component إلى Client Component، يجب أن تكون قيمتها المحلولة قابلة للتسلسل لتمريرها بين الخادم والعميل. أنماط بيانات مثل الدوال غير قابلة للتسلسل ولا يمكن أن تكون القيمة المحلولة لمثل هذه الـ Promise.

</Note>


<DeepDive>

#### Should I resolve a Promise in a Server or Client Component? {/*resolve-promise-in-server-or-client-component*/}

يمكن تمرير Promise من Server Component إلى Client Component وحلّها في Client Component بواجهة `use`. يمكنك أيضًا حلّ الـ Promise في Server Component بـ `await` وتمرير البيانات المطلوبة إلى Client Component كـ prop.

```js
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />
}
```

لكن استخدام `await` في [Server Component](/reference/rsc/server-components) يعطل رسمه حتى ينتهي `await`. تمرير Promise من Server Component إلى Client Component يمنع الـ Promise من تعطيل رسم Server Component.

</DeepDive>

### Dealing with rejected Promises {/*dealing-with-rejected-promises*/}

في بعض الحالات قد تُرفض Promise المُمرَّرة إلى `use`. يمكنك التعامل مع الـ Promises المرفوضة بإحدى الطريقتين:

1. [Displaying an error to users with an Error Boundary.](#displaying-an-error-to-users-with-error-boundary)
2. [Providing an alternative value with `Promise.catch`](#providing-an-alternative-value-with-promise-catch)

<Pitfall>
لا يمكن استدعاء `use` داخل كتلة try-catch. بدلًا من try-catch [لفّ مكوّنك بحد خطأ (Error Boundary)](#displaying-an-error-to-users-with-error-boundary)، أو [زوّد قيمة بديلة باستخدام `.catch` على الـ Promise](#providing-an-alternative-value-with-promise-catch).
</Pitfall>

#### Displaying an error to users with an Error Boundary {/*displaying-an-error-to-users-with-error-boundary*/}

إذا أردت عرض خطأ للمستخدمين عند رفض Promise، يمكنك استخدام [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). لفّ المكوّن الذي تستدعي فيه واجهة `use` بحد خطأ. إذا رُفضت Promise المُمرَّرة إلى `use`، يُعرض fallback لحد الخطأ.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function MessageContainer({ messagePromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <Suspense fallback={<p>⌛Downloading message...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => setTimeout(reject, 1000));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

#### Providing an alternative value with `Promise.catch` {/*providing-an-alternative-value-with-promise-catch*/}

إذا أردت توفير قيمة بديلة عند رفض Promise المُمرَّرة إلى `use`، يمكنك استخدام طريقة <CodeStep step={1}>[`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)</CodeStep> على الـ Promise.

```js [[1, 6, "catch"],[2, 7, "return"]]
import { Message } from './message.js';

export default function App() {
  const messagePromise = new Promise((resolve, reject) => {
    reject();
  }).catch(() => {
    return "no new message found.";
  });

  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

لاستخدام طريقة <CodeStep step={1}>`catch`</CodeStep>، استدعِ <CodeStep step={1}>`catch`</CodeStep> على كائن الـ Promise. تأخذ <CodeStep step={1}>`catch`</CodeStep> معاملًا واحدًا: دالة تأخذ رسالة خطأ كمعامل. أي شيء <CodeStep step={2}>تُرجعه</CodeStep> الدالة المُمرَّرة إلى <CodeStep step={1}>`catch`</CodeStep> يُستخدم كقيمة محلولة للـ Promise.

---

## Troubleshooting {/*troubleshooting*/}

### "Suspense Exception: This is not a real error!" {/*suspense-exception-error*/}

إما أنك تستدعي `use` خارج مكوّن React أو دالة Hook، أو تستدعي `use` داخل try–catch. إذا كان الاستدعاء داخل try–catch، لفّ المكوّن بحد خطأ، أو استدعِ `catch` على الـ Promise لالتقاط الخطأ وحلّ الـ Promise بقيمة أخرى. [اطلع على هذه الأمثلة](#dealing-with-rejected-promises).

إذا كنت تستدعي `use` خارج مكوّن أو Hook، انقل استدعاء `use` إلى مكوّن أو Hook.

```jsx
function MessageComponent({messagePromise}) {
  function download() {
    // ❌ الدالة التي تستدعي `use` ليست مكوّنًا ولا Hook
    const message = use(messagePromise);
    // ...
```

بدلًا من ذلك، استدعِ `use` خارج أي إغلاقات للمكوّن، حيث تكون الدالة التي تستدعي `use` مكوّنًا أو Hook.

```jsx
function MessageComponent({messagePromise}) {
  // ✅ `use` يُستدعى من مكوّن. 
  const message = use(messagePromise);
  // ...
```
