---
title: "تمييع الجذر (hydrateRoot)"
---

<Intro>

تمكنك `hydrateRoot` من عرض مكونات React داخل عقدة DOM في المتصفح كان قد تم توليد محتوى HTML لها مسبقًا بواسطة [`react-dom/server`.](/reference/react-dom/server)

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

استدعِ `hydrateRoot` لـ«ربط» React بـ HTML موجود سبق تصييره بواسطة React في بيئة الخادم.

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

سيربط React نفسه بالـ HTML الموجود داخل `domNode`، ويتولى إدارة DOM بداخله. التطبيق المبني بالكامل بـ React عادة ما يحتوي على استدعاء واحد فقط لـ `hydrateRoot` مع مكوّنه الجذري.

[المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `domNode`: [عنصر DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element) صُيّر كعنصر الجذر على الخادم.

* `reactNode`: «عقدة React» المستخدمة لتصيير الـ HTML الموجود. غالبًا ما تكون قطعة JSX مثل `<App />` التي صُيّرت بطريقة من طرق `ReactDOM Server` مثل `renderToPipeableStream(<App />)`.

* **اختياري** `options`: كائن يحتوي خيارات جذر React هذا.

  * **اختياري** `onCaughtError`: دالة استدعاء عند التقاط React لخطأ داخل حدود خطأ (Error Boundary). تُستدعى مع `error` الذي التقطته الحدود، وكائن `errorInfo` يحتوي على `componentStack`.
  * **اختياري** `onUncaughtError`: دالة استدعاء عند رمي خطأ دون التقاطه بحدود خطأ. تُستدعى مع `error` المرمى وكائن `errorInfo` يحتوي على `componentStack`.
  * **اختياري** `onRecoverableError`: دالة استدعاء عند تعافي React تلقائيًا من أخطاء. تُستدعى مع `error` الذي يرميه React، وكائن `errorInfo` يحتوي على `componentStack`. قد تتضمن بعض الأخطاء القابلة للتعافي السبب الأصلي للخطأ كـ `error.cause`.
  * **اختياري** `identifierPrefix`: بادئة نصية يستخدمها React للمعرّفات التي يولّدها [`useId`.](/reference/react/useId) مفيدة لتجنّب التعارض عند استخدام عدة جذور في الصفحة نفسها. يجب أن تكون نفس البادئة المستخدمة على الخادم.


#### القيمة المُرجَعة {/*returns*/}

تُرجِع `hydrateRoot` كائنًا فيه طريقتان: [`render`](#root-render) و[`unmount`.](#root-unmount)

#### ملاحظات {/*caveats*/}

* تتوقع `hydrateRoot()` أن يكون المحتوى المُصَيَّر مطابقًا لما صُيّر على الخادم. تعامل مع عدم التطابق كأخطاء برمجية وأصلحها.
* في وضع التطوير، يحذّر React من عدم التطابق أثناء التمييع. لا توجد ضمانات بأن تُصحَّح فروق السمات عند عدم التطابق، لأسباب تتعلق بالأداء لأن عدم التطابق نادر في أغلب التطبيقات، والتحقق من كل العلامات سيكون مكلفًا جدًا.
* غالبًا سيكون لديك استدعاء واحد فقط لـ `hydrateRoot` في تطبيقك. إن استخدمت إطار عمل، قد ينفّذ هو هذا الاستدعاء نيابةً عنك.
* إن كان تطبيقك يُصَيَّر على العميل فقط دون HTML مُسبَق، فاستخدام `hydrateRoot()` غير مدعوم. استخدم [`createRoot()`](/reference/react-dom/client/createRoot) بدلاً من ذلك.

---

### `root.render(reactNode)` {/*root-render*/}

استدعِ `root.render` لتحديث مكوّن React داخل جذر React مُمَيَّع لعنصر DOM في المتصفح.

```js
root.render(<App />);
```

سيحدّث React `<App />` في الجذر المُمَيَّع.

[المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*root-render-parameters*/}

* `reactNode`: «عقدة React» تريد تحديثها. غالبًا ما تكون JSX مثل `<App />`، ويمكنك أيضًا تمرير عنصر React مُنشَأ بـ [`createElement()`](/reference/react/createElement)، أو سلسلة، أو رقمًا، أو `null`، أو `undefined`.


#### القيمة المُرجَعة {/*root-render-returns*/}

تُرجِع `root.render` القيمة `undefined`.

#### ملاحظات {/*root-render-caveats*/}

* إن استدعيتَ `root.render` قبل انتهاء تمييع الجذر، سيمحو React محتوى HTML المُصَيَّر على الخادم الموجود ويحوّل الجذر بالكامل إلى التصيير على العميل.

---

### `root.unmount()` {/*root-unmount*/}

استدعِ `root.unmount` لتدمير الشجرة المُصَيَّرة داخل جذر React.

```js
root.unmount();
```

التطبيق المبني بالكامل بـ React عادة ما لا يحتوي على أي استدعاءات لـ `root.unmount`.

يُفيد ذلك أساسًا إن كان من الممكن أن تُزال عقدة DOM لجذر React (أو أحد أسلافها) من DOM بواسطة شيفرة أخرى. على سبيل المثال، تخيّل لوحة تبويب jQuery تزيل التبويبات غير النشطة من DOM. إن أُزيل تبويب، يُزال كل ما بداخله (بما فيها جذور React) من DOM أيضًا. يجب إخبار React بأن «يتوقف» عن إدارة محتوى الجذر المُزال باستدعاء `root.unmount`. وإلا فلن تُنظَّف المكوّنات داخل الجذر المُزال ولن تُحرَّر موارد مثل الاشتراكات.

يؤدي استدعاء `root.unmount` إلى إلغاء تركيب كل المكوّنات في الجذر و«فصل» React عن عقدة DOM الجذر، بما في ذلك إزالة معالجات الأحداث أو الحالة في الشجرة.


#### المعاملات {/*root-unmount-parameters*/}

لا تقبل `root.unmount` أي معاملات.


#### القيمة المُرجَعة {/*root-unmount-returns*/}

تُرجِع `root.unmount` القيمة `undefined`.

#### ملاحظات {/*root-unmount-caveats*/}

* يؤدي استدعاء `root.unmount` إلى إلغاء تركيب كل المكوّنات في الشجرة و«فصل» React عن عقدة DOM الجذر.

* بعد استدعاء `root.unmount` لا يمكنك استدعاء `root.render` مرة أخرى على ذلك الجذر. محاولة استدعاء `root.render` على جذر غير مُركَّب ترمي خطأ «Cannot update an unmounted root».

---

## الاستخدام {/*usage*/}

### تمييع HTML مُصَيَّر على الخادم {/*hydrating-server-rendered-html*/}

إن كان HTML تطبيقك قد أُنتِج بواسطة [`react-dom/server`](/reference/react-dom/server)، فتحتاج إلى *تمييعه* على العميل.

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

سيُمَيَّع HTML الخادم داخل <CodeStep step={1}>عقدة DOM في المتصفح</CodeStep> مع <CodeStep step={2}>مكوّن React</CodeStep> لتطبيقك. عادةً تفعل ذلك مرة واحدة عند الإقلاع. إن استخدمت إطار عمل، قد يحدث ذلك في الخلفية.

لتمييع تطبيقك، «يربط» React منطق مكوّناتك بلقطة HTML الأولية من الخادم. يحوّل التمييع لقطة HTML الأولية من الخادم إلى تطبيق تفاعلي بالكامل يعمل في المتصفح.

<Sandpack>

```html public/index.html
<!--
  محتوى HTML داخل <div id="root">...</div>
  أُنتِج من App بواسطة react-dom/server.
-->
<div id="root"><h1>مرحبًا بالعالم!</h1><button>لقد نقرّت عليّ <!-- -->0<!-- --> مرّات</button></div>
```

```js src/index.js active
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>مرحبًا بالعالم!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      لقد نقرّت عليّ {count} مرّات
    </button>
  );
}
```

</Sandpack>

لا حاجة عادةً لاستدعاء `hydrateRoot` مجددًا أو في أماكن متعددة. من هذه النقطة، يدير React DOM لتطبيقك. لتحديث الواجهة، تستخدم مكوّناتك [الحالة](/reference/react/useState) بدلًا من ذلك.

<Pitfall>

يجب أن تُنتِج شجرة React التي تمرّرها إلى `hydrateRoot` **نفس المخرجات** التي أنتجتها على الخادم.

هذا مهم لتجربة المستخدم. يمضي المستخدم وقتًا ينظر فيه إلى HTML المُولَّد على الخادم قبل تحميل شيفرة JavaScript. التصيير على الخادم يعطي وهمًا أن التطبيق أسرع بعرض لقطة HTML لمخرجاته. إظهار محتوى مختلف فجأة يكسر ذلك الوهم. لذلك يجب أن يطابق مخرج التصيير على الخادم المخرج الأولي على العميل.

من أشيع أسباب أخطاء التمييع:

* مسافات بيضاء زائدة (مثل أسطر جديدة) حول HTML المُولَّد من React داخل عقدة الجذر.
* استخدام فحوص مثل `typeof window !== 'undefined'` في منطق التصيير.
* استخدام واجهات خاصة بالمتصفح مثل [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) في منطق التصيير.
* تصيير بيانات مختلفة على الخادم والعميل.

يتعافى React من بعض أخطاء التمييع، لكن **يجب إصلاحها كأي أخطاء أخرى.** في أفضل الأحوال تؤدي إلى بطء؛ في أسوأها قد تُربَط معالجات الأحداث بعناصر خاطئة.

</Pitfall>

---

### تمييع المستند بالكامل {/*hydrating-an-entire-document*/}

يمكن للتطبيقات المبنية بالكامل بـ React أن تصيّر المستند كاملًا كـ JSX، بما فيها وسم [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html):

```js {3,13}
function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>تطبيقي</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

لتمييع المستند كاملًا، مرّر الكائن العام [`document`](https://developer.mozilla.org/en-US/docs/Web/API/Window/document) كأول وسيط لـ `hydrateRoot`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### كتم تحذيرات عدم تطابق التمييع غير القابلة للتجنب {/*suppressing-unavoidable-hydration-mismatch-errors*/}

إن كان سمات عنصر واحد أو محتواه النصي يختلف حتمًا بين الخادم والعميل (مثل طابع زمني)، يمكنك كتم تحذير عدم تطابق التمييع.

لإسكات تحذيرات التمييع على عنصر، أضف `suppressHydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  محتوى HTML داخل <div id="root">...</div>
  أُنتِج من App بواسطة react-dom/server.
-->
<div id="root"><h1>التاريخ الحالي: <!-- -->01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      التاريخ الحالي: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

يعمل ذلك على مستوى واحد فقط، وهو مخصّص كمخرج طوارئ. لا تفرط في استخدامه. لن يحاول React **إصلاح** محتوى نصي غير متطابق.

---

### التعامل مع محتوى مختلف على العميل والخادم {/*handling-different-client-and-server-content*/}

إن احتجت عمدًا لتصيير شيء مختلف على الخادم والعميل، يمكنك التصيير على مرحلتين. المكوّنات التي تعرض شيئًا مختلفًا على العميل يمكنها قراءة [متغير حالة](/reference/react/useState) مثل `isClient`، وتعيينه إلى `true` في [Effect](/reference/react/useEffect):

<Sandpack>

```html public/index.html
<!--
  محتوى HTML داخل <div id="root">...</div>
  أُنتِج من App بواسطة react-dom/server.
-->
<div id="root"><h1>من الخادم</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

{/* kind of an edge case, seems fine to use this hack here */}
```js {expectedErrors: {'react-compiler': [7]}} src/App.js active
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'من العميل' : 'من الخادم'}
    </h1>
  );
}
```

</Sandpack>

بهذه الطريقة تمرّرة التصيير الأولى نفس المحتوى كالخادم، فتتجنّب عدم التطابق، لكن تمرّرة إضافية تحدث متزامنة مباشرة بعد التمييع.

<Pitfall>

هذا النهج يبطئ التمييع لأن مكوّناتك تصيّر مرتين. انتبه لتجربة المستخدم على الاتصالات البطيئة. قد يُحمَّل كود JavaScript متأخرًا كثيرًا عن التصيير الأولي للـ HTML، فإظهار واجهة مختلفة فورًا بعد التمييع قد يكون مربكًا للمستخدم.

</Pitfall>

---

### تحديث مكوّن الجذر بعد التمييع {/*updating-a-hydrated-root-component*/}

بعد انتهاء تمييع الجذر، يمكنك استدعاء [`root.render`](#root-render) لتحديث مكوّن الجذر. **على عكس [`createRoot`](/reference/react-dom/client/createRoot)، لا تحتاج عادةً لفعل ذلك لأن المحتوى الأولي صُيّر مسبقًا كـ HTML.**

إن استدعيتَ `root.render` بعد التمييع، وكانت بنية الشجرة متوافقة مع ما صُيّر سابقًا، فسيحافظ React على [الحالة.](/learn/preserving-and-resetting-state) لاحظ أنك تستطيع الكتابة في الحقل، أي أن التحديثات من استدعاءات `render` المتكررة كل ثانية في هذا المثال ليست مدمرة:

<Sandpack>

```html public/index.html
<!--
  كل محتوى HTML داخل <div id="root">...</div> أُنتِج
  بتصيير <App /> بواسطة react-dom/server.
-->
<div id="root"><h1>مرحبًا بالعالم! <!-- -->0</h1><input placeholder="اكتب شيئًا هنا"/></div>
```

```js src/index.js active
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>مرحبًا بالعالم! {counter}</h1>
      <input placeholder="اكتب شيئًا هنا" />
    </>
  );
}
```

</Sandpack>

نادرًا ما يُستدعى [`root.render`](#root-render) على جذر مُمَيَّع. عادةً [تحدّث الحالة](/reference/react/useState) داخل أحد المكوّنات بدلًا من ذلك.

### تسجيل الأخطاء في الإنتاج {/*error-logging-in-production*/}

افتراضيًا، يسجّل React كل الأخطاء إلى الطرفية. لتنفيذ تقارير أخطاء خاصة بك، يمكنك تمرير معالجات الجذر الاختيارية `onUncaughtError` و`onCaughtError` و`onRecoverableError`:

```js [[1, 7, "onCaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack", 15]]
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import { reportCaughtError } from "./reportError";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== "Known error") {
      reportCaughtError({
        error,
        componentStack: errorInfo.componentStack,
      });
    }
  },
});
```

خيار <CodeStep step={1}>onCaughtError</CodeStep> هو دالة تُستدعى بوسيطين:

1. <CodeStep step={2}>error</CodeStep> الذي رُمي.
2. كائن <CodeStep step={3}>errorInfo</CodeStep> يحتوي على <CodeStep step={4}>componentStack</CodeStep> للخطأ.

مع `onUncaughtError` و`onRecoverableError` يمكنك بناء نظام تقارير أخطاء خاص بك:

<Sandpack>

```js src/reportError.js
function reportError({ type, error, errorInfo }) {
  // التنفيذ التفصيلي لك.
  // `console.error()` للعرض فقط.
  console.error(type, error, "Component Stack: ");
  console.error("Component Stack: ", errorInfo.componentStack);
}

export function onCaughtErrorProd(error, errorInfo) {
  if (error.message !== "Known error") {
    reportError({ type: "Caught", error, errorInfo });
  }
}

export function onUncaughtErrorProd(error, errorInfo) {
  reportError({ type: "Uncaught", error, errorInfo });
}

export function onRecoverableErrorProd(error, errorInfo) {
  reportError({ type: "Recoverable", error, errorInfo });
}
```

```js src/index.js active
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./reportError";

const container = document.getElementById("root");
hydrateRoot(container, <App />, {
  // تذكّر إزالة هذه الخيارات في التطوير لتستفيد
  // من معالجات React الافتراضية أو طبقة تطوير خاصة بك.
  // هنا وُضِعت المعالجات دائمًا للعرض فقط.
  onCaughtError: onCaughtErrorProd,
  onRecoverableError: onRecoverableErrorProd,
  onUncaughtError: onUncaughtErrorProd,
});
```

```js src/App.js
import { Component, useState } from "react";

function Boom() {
  foo.bar = "baz";
}

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>حدث خطأ ما.</h1>;
    }
    return this.props.children;
  }
}

export default function App() {
  const [triggerUncaughtError, settriggerUncaughtError] = useState(false);
  const [triggerCaughtError, setTriggerCaughtError] = useState(false);

  return (
    <>
      <button onClick={() => settriggerUncaughtError(true)}>
        تفعيل خطأ غير ملتقط
      </button>
      {triggerUncaughtError && <Boom />}
      <button onClick={() => setTriggerCaughtError(true)}>
        تفعيل خطأ ملتقط
      </button>
      {triggerCaughtError && (
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      )}
    </>
  );
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>تطبيقي</title>
</head>
<body>
<!--
  HTML يخت عن محتوى الخادم عمدًا لإثارة أخطاء قابلة للتعافي.
-->
<div id="root">محتوى الخادم قبل التمييع.</div>
</body>
</html>
```
</Sandpack>

## حل المشكلات {/*troubleshooting*/}


### أتلقى خطأ: "You passed a second argument to root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

خطأ شائع هو تمرير خيارات `hydrateRoot` إلى `root.render(...)`:

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(...) but it only accepts one argument.

</ConsoleBlock>

للإصلاح، مرّر خيارات الجذر إلى `hydrateRoot(...)` وليس `root.render(...)`:
```js {2,5}
// 🚩 خطأ: root.render يقبل وسيطًا واحدًا فقط.
root.render(App, {onUncaughtError});

// ✅ صحيح: مرّر الخيارات إلى hydrateRoot.
const root = hydrateRoot(container, <App />, {onUncaughtError});
```
