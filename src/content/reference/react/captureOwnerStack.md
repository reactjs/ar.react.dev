---
title: "دالة captureOwnerStack"
---

<Intro>

`captureOwnerStack` تقرأ Owner Stack الحالي في وضع التطوير وتُرجعه كسلسلة إن وُجد.

```js
const stack = captureOwnerStack();
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `captureOwnerStack()` {/*captureownerstack*/}

استدعِ `captureOwnerStack` للحصول على Owner Stack الحالي.

```js {5,5}
import * as React from 'react';

function Component() {
  if (process.env.NODE_ENV !== 'production') {
    const ownerStack = React.captureOwnerStack();
    console.log(ownerStack);
  }
}
```

#### المعاملات {/*parameters*/}

`captureOwnerStack` لا تأخذ معاملات.

#### القيمة المُرجَعة {/*returns*/}

`captureOwnerStack` تُرجع `string | null`.

تتوفر Owner Stacks في:
- عرض المكوّن
- Effects (مثل `useEffect`)
- معالجات أحداث React (مثل `<button onClick={...} />`)
- معالجات أخطاء React ([خيارات React Root](/reference/react-dom/client/createRoot#parameters) `onCaughtError` و`onRecoverableError` و`onUncaughtError`)

إذا لم يكن Owner Stack متاحًا، تُرجع `null` (راجع [استكشاف الأخطاء: Owner Stack هو `null`](#the-owner-stack-is-null)).

#### ملاحظات {/*caveats*/}

- Owner Stacks متاحة في التطوير فقط. `captureOwnerStack` تُرجع دائمًا `null` خارج التطوير.

<DeepDive>

#### Owner Stack مقابل Component Stack {/*owner-stack-vs-component-stack*/}

Owner Stack يختلف عن Component Stack المتاح في معالجات أخطاء React مثل [`errorInfo.componentStack` في `onUncaughtError`](/reference/react-dom/client/hydrateRoot#error-logging-in-production).

مثلًا، انظر الشيفرة التالية:

<Sandpack>

```js src/App.js
import {Suspense} from 'react';

function SubComponent({disabled}) {
  if (disabled) {
    throw new Error('disabled');
  }
}

export function Component({label}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <SubComponent key={label} disabled={label === 'disabled'} />
    </fieldset>
  );
}

function Navigation() {
  return null;
}

export default function App({children}) {
  return (
    <Suspense fallback="loading...">
      <main>
        <Navigation />
        {children}
      </main>
    </Suspense>
  );
}
```

```js src/index.js
import {captureOwnerStack} from 'react';
import {createRoot} from 'react-dom/client';
import App, {Component} from './App.js';
import './styles.css';

createRoot(document.createElement('div'), {
  onUncaughtError: (error, errorInfo) => {
    // The stacks are logged instead of showing them in the UI directly to
    // highlight that browsers will apply sourcemaps to the logged stacks.
    // Note that sourcemapping is only applied in the real browser console not
    // in the fake one displayed on this page.
    // Press "fork" to be able to view the sourcemapped stack in a real console.
    console.log(errorInfo.componentStack);
    console.log(captureOwnerStack());
  },
}).render(
  <App>
    <Component label="disabled" />
  </App>
);
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <p>Check the console output.</p>
  </body>
</html>
```

</Sandpack>

`SubComponent` سيرمي خطأ.
Component Stack لهذا الخطأ سيكون

```
at SubComponent
at fieldset
at Component
at main
at React.Suspense
at App
```

أما Owner Stack فيقرأ فقط

```
at Component
```

لا يُعتبر `App` ولا مكوّنات DOM (مثل `fieldset`) مالكين (Owners) في هذا الStack لأنهما لم يساهما في «إنشاء» العقدة التي تحتوي `SubComponent`. `App` ومكوّنات DOM أعادتا فقط توجيه العقدة. `App` عرضت عقدة `children` فقط، بخلاف `Component` التي أنشأت عقدة تحتوي `SubComponent` عبر `<SubComponent />`.

لا يظهر `Navigation` ولا `legend` في الStack لأنهما مجرد أشقاء لعقدة تحتوي `<SubComponent />`.

يُستبعد `SubComponent` لأنه جزء من call stack أصلًا.

</DeepDive>

## الاستخدام {/*usage*/}

### تحسين طبقة أخطاء مخصّصة {/*enhance-a-custom-error-overlay*/}

```js [[1, 5, "console.error"], [4, 7, "captureOwnerStack"]]
import { captureOwnerStack } from "react";
import { instrumentedConsoleError } from "./errorOverlay";

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Keep in mind that in a real application, console.error can be
    // called with multiple arguments which you should account for.
    consoleMessage: args[0],
    ownerStack,
  });
};
```

إذا اعترضت استدعاءات <CodeStep step={1}>`console.error`</CodeStep> لإبرازها في طبقة أخطاء، يمكنك استدعاء <CodeStep step={2}>`captureOwnerStack`</CodeStep> لتضمين Owner Stack.

<Sandpack>

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Error dialog in raw HTML
  since an error in the React app may crash.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red">Error</h1>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h2 class="-mb-20">Owner Stack:</h4>
  <pre id="error-owner-stack" class="nowrap"></pre>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
</div>
<!-- This is the DOM node -->
<div id="root"></div>
</body>
</html>

```

```js src/errorOverlay.js

export function onConsoleError({ consoleMessage, ownerStack }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorBody = document.getElementById("error-body");
  const errorOwnerStack = document.getElementById("error-owner-stack");

  // Display console.error() message
  errorBody.innerText = consoleMessage;

  // Display owner stack
  errorOwnerStack.innerText = ownerStack;

  // Show the dialog
  errorDialog.classList.remove("hidden");
}
```

```js src/index.js active
import { captureOwnerStack } from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import { onConsoleError } from "./errorOverlay";
import './styles.css';

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Keep in mind that in a real application, console.error can be
    // called with multiple arguments which you should account for.
    consoleMessage: args[0],
    ownerStack,
  });
};

const container = document.getElementById("root");
createRoot(container).render(<App />);
```

```js src/App.js
function Component() {
  return <button onClick={() => console.error('Some console error')}>Trigger console.error()</button>;
}

export default function App() {
  return <Component />;
}
```

</Sandpack>

## استكشاف الأخطاء {/*troubleshooting*/}

### Owner Stack هو `null` {/*the-owner-stack-is-null*/}

حدث استدعاء `captureOwnerStack` خارج دالة يتحكم بها React، مثلًا في استدعاء `setTimeout`، أو بعد `fetch`، أو في معالج حدث DOM مخصّص. أثناء العرض، وEffects، ومعالجات أحداث React، ومعالجات أخطاء React (مثل `hydrateRoot#options.onCaughtError`) يجب أن تكون Owner Stacks متاحة.

في المثال أدناه، النقر على الزر يسجّل Owner Stack فارغًا لأن `captureOwnerStack` اُستدعيت أثناء معالج حدث DOM مخصّص. يجب التقاط Owner Stack مبكرًا، مثلًا بنقل استدعاء `captureOwnerStack` إلى جسم Effect.
<Sandpack>

```js
import {captureOwnerStack, useEffect} from 'react';

export default function App() {
  useEffect(() => {
    // Should call `captureOwnerStack` here.
    function handleEvent() {
      // Calling it in a custom DOM event handler is too late.
      // The Owner Stack will be `null` at this point.
      console.log('Owner Stack: ', captureOwnerStack());
    }

    document.addEventListener('click', handleEvent);

    return () => {
      document.removeEventListener('click', handleEvent);
    }
  })

  return <button>Click me to see that Owner Stacks are not available in custom DOM event handlers</button>;
}
```

</Sandpack>

### `captureOwnerStack` غير متاح {/*captureownerstack-is-not-available*/}

`captureOwnerStack` تُصدَّر فقط في بنيات التطوير. ستكون `undefined` في بنيات الإنتاج. إذا وُجدت `captureOwnerStack` في ملفات تُجمَّع للإنتاج والتطوير معًا، يجب الوصول إليها شرطيًا عبر استيراد مساحة أسماء.

```js
// Don't use named imports of `captureOwnerStack` in files that are bundled for development and production.
import {captureOwnerStack} from 'react';
// Use a namespace import instead and access `captureOwnerStack` conditionally.
import * as React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const ownerStack = React.captureOwnerStack();
  console.log('Owner Stack', ownerStack);
}
```
