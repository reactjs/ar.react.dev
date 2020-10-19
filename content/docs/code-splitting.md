---
id: code-splitting
title: تقسيم الشيفرة
permalink: docs/code-splitting.html
---

## التحزيم (Bundling) {#bundling}

<<<<<<< HEAD
تكون معظم الملفّات في تطبيقات React مُحزَّمة باستخدام أدوات مثل
[Webpack](https://webpack.js.org/) أو [Rollup](https://rollupjs.org/) أو [Browserify](http://browserify.org/).
التحزيم هو عملية تتبّع الملفّات المستوردة ودمجها في ملف واحد وهو الحزمة (Bundle). يُمكِن بعدها تضمين هذه الحزمة في صفحة ويب لتحميل كامل التطبيق دفعة واحدة.
=======
Most React apps will have their files "bundled" using tools like [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) or [Browserify](http://browserify.org/). Bundling is the process of following imported files and merging them into a single file: a "bundle". This bundle can then be included on a webpage to load an entire app at once.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

#### مثال {#example}

**App:**

```js
// app.js
import { add } from './math.js';

console.log(add(16, 26)); // 42
```

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

**Bundle:**

```js
function add(a, b) {
  return a + b;
}

console.log(add(16, 26)); // 42
```

> ملاحظة:
>
> سينتهي مظهر الحزم لديك إلى شكلٍ مختلف عن هذا.

<<<<<<< HEAD
إن كنت تستخدم [Create React App](https://create-react-app.dev/) ،[Next.js](https://nextjs.org/) ،[Gatsby](https://www.gatsbyjs.org/)، أو أي أداة مشابهة، فسيكون لديك إعداد Webpack جاهز لتحزيم تطبيقك.

أمّا إن لم تكن تستخدم أيا من هذه الأدوات فستحتاج إلى إعداد التحزيم بنفسك. انظر إلى دليل
[التثبيت](https://webpack.js.org/guides/installation/) و
[دليل البدء](https://webpack.js.org/guides/getting-started/) في توثيق Webpack.
=======
If you're using [Create React App](https://create-react-app.dev/), [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/), or a similar tool, you will have a Webpack setup out of the box to bundle your app.

If you aren't, you'll need to setup bundling yourself. For example, see the [Installation](https://webpack.js.org/guides/installation/) and [Getting Started](https://webpack.js.org/guides/getting-started/) guides on the Webpack docs.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

## تقسيم الشيفرة {#code-splitting}

<<<<<<< HEAD
يكون التحزيم رائعًا، ولكن عندما يكبر تطبيقك ستكبر الحزمة لديك أيضًا، خاصّة إن كنت تُضمِّن مكتبات طرف ثالث كبيرة الحجم. يجب الانتباه إلى الشيفرة التي تُضمِّنها في حزمتك لكي لا تجعلها كبيرة من غير قصد لدرجة أن يستغرق تطبيقك زمنًا طويلًا للتحميل.

لتجنّب الحصول على حزمة كبيرة من الأفضل استباق حصول المشكلة والبدء في تقسيم حزمتك.
تقسيم الشيفرة هو ميّزة مدعومة من قبل المُحزِّمات مثل [Webpack](https://webpack.js.org/guides/code-splitting/) ،[Rollup](https://rollupjs.org/guide/en/#code-splitting) و Browserify (عبر
[factor-bundle](https://github.com/browserify/factor-bundle)) والتي تستطيع إنشاء حزم متعددة يُمكِن تحميلها بشكل ديناميكي في زمن التنفيذ.

يُساعدك تقسيم شيفرة تطبيقك على إجراء تحميل مُتأخّر (Lazy Load) للأشياء التي يحتاجها المستخدم حاليًّا فقط، ممّا يُحسِّن بشكل كبير أداء تطبيقك. وفي حين أنّك لم تُقلِّل الحجم الكلي لشيفرة تطبيقك، فقد تجنّبت تحميل شيفرة قد لا يحتاجها المستخدم أبدًا وقلّلتَ حجم الشيفرة التي تحتاج إلى تحميلها في البداية.
=======
Bundling is great, but as your app grows, your bundle will grow too. Especially if you are including large third-party libraries. You need to keep an eye on the code you are including in your bundle so that you don't accidentally make it so large that your app takes a long time to load.

To avoid winding up with a large bundle, it's good to get ahead of the problem and start "splitting" your bundle. Code-Splitting is a feature
supported by bundlers like [Webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://rollupjs.org/guide/en/#code-splitting) and Browserify (via [factor-bundle](https://github.com/browserify/factor-bundle)) which can create multiple bundles that can be dynamically loaded at runtime.

Code-splitting your app can help you "lazy-load" just the things that are currently needed by the user, which can dramatically improve the performance of your app. While you haven't reduced the overall amount of code in your app, you've avoided loading code that the user may never need, and reduced the amount of code needed during the initial load.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

## `()import` {#import}

<<<<<<< HEAD
أفضل طريقة لتقديم تقسيم الشيفرة إلى تطبيقك هي عبر استخدام صياغة `import()` الديناميكية.
=======
The best way to introduce code-splitting into your app is through the dynamic `import()` syntax.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

**الشيفرة قبل الاستخدام:**

```js
import { add } from './math';

console.log(add(16, 26));
```

**الشيفرة بعد الاستخدام:**

```js
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

<<<<<<< HEAD
عندما يأتي Webpack على هذه الصياغة سيبدأ بتقسيم شيفرة تطبيقك تلقائيًّا. إن كنت تستخدم Create React App، فهذا الإعداد موجود لديك مُسبقًا و [تستطيع استخدامه مباشرةً](https://create-react-app.dev/docs/code-splitting) وهو أيضًا موجود بشكل جاهز عندما تستخدم [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

إن كنت تُعِد Webpack بنفسك فستحتاج لقراءة [ دليل Webpack حول تقسيم الشيفرة](https://webpack.js.org/guides/code-splitting/). يجب أن تبدو إعدادات Webpack لديك [مثل هذا](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

عند استخدامك [Babel](https://babeljs.io/)، يجب أن تتأكد من قدرته على تصريف صياغة الاستيراد `import()‎` الديناميكية دون تحويلها. ستحتاج من أجل ذلك إلى هذه الإضافة [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import).
=======
When Webpack comes across this syntax, it automatically starts code-splitting your app. If you're using Create React App, this is already configured for you and you can [start using it](https://create-react-app.dev/docs/code-splitting/) immediately. It's also supported out of the box in [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

If you're setting up Webpack yourself, you'll probably want to read Webpack's [guide on code splitting](https://webpack.js.org/guides/code-splitting/). Your Webpack config should look vaguely [like this](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

When using [Babel](https://babeljs.io/), you'll need to make sure that Babel can parse the dynamic import syntax but is not transforming it. For that you will need [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import).
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

## `React.lazy` {#reactlazy}

> ملاحظة:
>
> `React.lazy` و `Suspense` غير متاحين للتصيير من طرف الخادوم. إن أردت تنفيذ تقسيم للشيفرة في تطبيق مصيَّر من طرف الخادوم، ننصح باستعمال المكتبة [Loadable Components](https://github.com/smooth-code/loadable-components). إذ تملك [دليلًا جيدًا لتحزيم عملية التقسيم مع التصيير من طرف الخادوم](https://loadable-components.com/docs/server-side-rendering/).

تمكِّنك الدالة `React.lazy` من تصيير استيراد ديناميكي على أنَّه مكون عادي.

**قبل:**

```js
import OtherComponent from './OtherComponent';
```

**بعد:**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

ستحمِّل هذه الشيفرة الحزمة تلقائيًّا التي تحوي المكون `OtherComponent` عند تصييره.

تأخذ الدالة `React.lazy` دالةً يجب عليها استدعاء استيراد ديناميكي عبر `import()`. هذا يجب أن يعيد وعدًا (أي `Promise`) يُستبيَن إلى وحدةٍ مع تصدير افتراضي `default` يحوي مكون React.

بعد ذلك، يجب تصيير المكون الكسول (lazy component) داخل مكون `Suspense`، والذي يسمح لنا بإظهار بعض المحتوى الاحتياطي (مثل مؤشر التحميل) بينما ننتظر تحميل المكون الكسول.

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

تقبل الخاصية `fallback` أي عناصر React تريد تصييرها أثناء انتظار المكون لتحمليه. يمكنك وضع المكون `Suspense` في أي مكان فوق المكون الكسول. يمكنك حتى تغليف مكونات كسولة مع مكون `Suspense` وحيد.

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```

### حدود الخطأ {#error-boundaries}

إن فشل تحميل الوحدة الأخرى (نتيجة فشل الشبكة مثلًا)، فسيُطلَق خطأ. يمكنك معالجة هذه الأخطاء لتحسين تجربة المستخدم وإدارة عملية الإصلاح عبر حد الأخطاء. متى ما أنشأت حدًا للخطأ، يمكنك استعماله في أي مكان فوق مكوناتك الكسولة لعرض حالة الخطأ عندما يكون هنالك خطأ في الشبكة.

```js
import React, { Suspense } from 'react';
import MyErrorBoundary from './MyErrorBoundary';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

## تقسيم الشيفرة المعتمد على الطريق (Route) {#route-based-code-splitting}

<<<<<<< HEAD
قد يكون من الصعب تحديد موضع تقسيم الشيفرة في تطبيقك. يجب عليك أن تتأكد من اختيار أماكن تُقسِّم الشيفرة بشكلٍ متساوٍ ولكن من دون الضرر بتجربة المستخدم.

المكان الجيد للبدء بذلك هو الطرق (routes). اعتاد معظم مستخدمي الويب على أنّ أزرار التقليب بين الصفحات تستغرق وقتًا لتحميلها. تميل حينها أيضًا إلى إعادة تصيير كامل الصفحة مرة واحدة لذا من غير المحتمل أن المستخدم يحاول التفاعل مع الصفحة في نفس الوقت.

هذا مثال حول إعداد تقسيم الشيفرة اعتمادًا على الطريق في تطبيقك باستخدام مكتبات مثل [React Router](https://reacttraining.com/react-router/) و `React.lazy`.
=======
Deciding where in your app to introduce code splitting can be a bit tricky. You want to make sure you choose places that will split bundles evenly, but won't disrupt the user experience.

A good place to start is with routes. Most people on the web are used to page transitions taking some amount of time to load. You also tend to be re-rendering the entire page at once so your users are unlikely to be interacting with other elements on the page at the same time.

Here's an example of how to setup route-based code splitting into your app using libraries like [React Router](https://reacttraining.com/react-router/) with `React.lazy`.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

## التصديرات المسماة {#named-exports}

تدعم الدالة `React.lazy` حاليًا التصديرات الافتراضية (default exports). إن كانت الوحدة التي تريد استيرادها تستعمل التصديرات المسماة (named exports)، تستطيع إنشاء وحدة وسيطة تعيد تصديرها بالشكل الافتراضي. يضمن ذلك استمرار التحقق من عدم وجود شيفرات «ميتة» وعدم استيراد المكونات غير المستعملة.

```js
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;
```

```js
// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```

```js
// MyApp.js
import React, { lazy } from 'react';
const MyComponent = lazy(() => import("./MyComponent.js"));
```
