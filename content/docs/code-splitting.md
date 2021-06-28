---
id: code-splitting
title: تقسيم الشيفرة
permalink: docs/code-splitting.html
---

## التحزيم (Bundling) {#bundling}

تكون معظم الملفّات في تطبيقات React مُحزَّمة باستخدام أدوات مثل [Webpack](https://webpack.js.org/) أو [Rollup](https://rollupjs.org/) أو [Browserify](http://browserify.org/). التحزيم هو عملية تتبّع الملفّات المستوردة ودمجها في ملف واحد وهو الحزمة (Bundle). يُمكِن بعدها تضمين هذه الحزمة في صفحة ويب لتحميل كامل التطبيق دفعة واحدة.

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

إن كنت تستخدم [Create React App](https://create-react-app.dev/) ،[Next.js](https://nextjs.org/) ،[Gatsby](https://www.gatsbyjs.org/)، أو أي أداة مشابهة، فسيكون لديك إعداد Webpack جاهز لتحزيم تطبيقك.

<<<<<<< HEAD
أمّا إن لم تكن تستخدم أيا من هذه الأدوات فستحتاج إلى إعداد التحزيم بنفسك. انظر إلى دليل [التثبيت](https://webpack.js.org/guides/installation/) و [دليل البدء](https://webpack.js.org/guides/getting-started/) في توثيق Webpack.
=======
If you aren't, you'll need to set up bundling yourself. For example, see the [Installation](https://webpack.js.org/guides/installation/) and [Getting Started](https://webpack.js.org/guides/getting-started/) guides on the Webpack docs.
>>>>>>> 25f756d8e3800afb032cb31ce3626d6134e31e38

## تقسيم الشيفرة {#code-splitting}

يكون التحزيم رائعًا، ولكن عندما يكبر تطبيقك ستكبر الحزمة لديك أيضًا، خاصّة إن كنت تُضمِّن مكتبات طرف ثالث كبيرة الحجم. يجب الانتباه إلى الشيفرة التي تُضمِّنها في حزمتك لكي لا تجعلها كبيرة من غير قصد لدرجة أن يستغرق تطبيقك زمنًا طويلًا للتحميل.

لتجنّب الحصول على حزمة كبيرة من الأفضل استباق حصول المشكلة والبدء في تقسيم حزمتك. تقسيم الشيفرة هو ميّزة مدعومة من قبل المُحزِّمات مثل [Webpack](https://webpack.js.org/guides/code-splitting/) ،[Rollup](https://rollupjs.org/guide/en/#code-splitting) و Browserify (عبر [factor-bundle](https://github.com/browserify/factor-bundle)) والتي تستطيع إنشاء حزم متعددة يُمكِن تحميلها بشكل ديناميكي في زمن التنفيذ.

يُساعدك تقسيم شيفرة تطبيقك على إجراء تحميل مُتأخّر (Lazy Load) للأشياء التي يحتاجها المستخدم حاليًّا فقط، ممّا يُحسِّن بشكل كبير أداء تطبيقك. وفي حين أنّك لم تُقلِّل الحجم الكلي لشيفرة تطبيقك، فقد تجنّبت تحميل شيفرة قد لا يحتاجها المستخدم أبدًا وقلّلتَ حجم الشيفرة التي تحتاج إلى تحميلها في البداية.

## `()import` {#import}

أفضل طريقة لتقديم تقسيم الشيفرة إلى تطبيقك هي عبر استخدام صياغة `import()` الديناميكية.

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

عندما يأتي Webpack على هذه الصياغة سيبدأ بتقسيم شيفرة تطبيقك تلقائيًّا. إن كنت تستخدم Create React App، فهذا الإعداد موجود لديك مُسبقًا و [تستطيع استخدامه مباشرةً](https://create-react-app.dev/docs/code-splitting) وهو أيضًا موجود بشكل جاهز عندما تستخدم [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

إن كنت تُعِد Webpack بنفسك فستحتاج لقراءة [ دليل Webpack حول تقسيم الشيفرة](https://webpack.js.org/guides/code-splitting/). يجب أن تبدو إعدادات Webpack لديك [مثل هذا](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

عند استخدامك [Babel](https://babeljs.io/)، يجب أن تتأكد من قدرته على تصريف صياغة الاستيراد `import()‎` الديناميكية دون تحويلها. ستحتاج من أجل ذلك إلى هذه الإضافة [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import).

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

قد يكون من الصعب تحديد موضع تقسيم الشيفرة في تطبيقك. يجب عليك أن تتأكد من اختيار أماكن تُقسِّم الشيفرة بشكلٍ متساوٍ ولكن من دون الضرر بتجربة المستخدم.

المكان الجيد للبدء بذلك هو الطرق (routes). اعتاد معظم مستخدمي الويب على أنّ أزرار التقليب بين الصفحات تستغرق وقتًا لتحميلها. تميل حينها أيضًا إلى إعادة تصيير كامل الصفحة مرة واحدة لذا من غير المحتمل أن المستخدم يحاول التفاعل مع الصفحة في نفس الوقت.

هذا مثال حول إعداد تقسيم الشيفرة اعتمادًا على الطريق في تطبيقك باستخدام مكتبات مثل [React Router](https://reacttraining.com/react-router/) و `React.lazy`.

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
