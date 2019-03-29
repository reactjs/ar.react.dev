---
id: code-splitting
title: تقسيم الشيفرة في React
permalink: docs/code-splitting.html
---

## التحزيم (Bundling) {#bundling}

تكون معظم الملفّات في تطبيقات React مُحزَّمة باستخدام أدوات مثل
[Webpack](https://webpack.js.org/) أو [Browserify](http://browserify.org/).
التحزيم هو عملية تتبّع الملفّات المستوردة ودمجها في ملف واحد وهو الحزمة (Bundle). يُمكِن بعدها تضمين هذه الحزمة في صفحة ويب لتحميل كامل التطبيق دفعة واحدة.


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

إن كنت تستخدم  [Create React App](https://github.com/facebookincubator/create-react-app), [Next.js](https://github.com/zeit/next.js/), [Gatsby](https://www.gatsbyjs.org/), أو أي أداة مشابهة، فسيكون لديك إعداد Webpack جاهز لتحزيم تطبيقك.

أمّا إن لم تكن تستخدم أي من هذه الأدوات فستحتاج إلى إعداد التحزيم بنفسك. انظر إلى دليل
[التثبيت](https://webpack.js.org/guides/installation/) و
[ دليل البدء](https://webpack.js.org/guides/getting-started/) في توثيق Webpack.

## تقسيم الشيفرة {#code-splitting}

يكون التحزيم رائعًا، ولكن عندما يكبر تطبيقك ستكبر الحزمة لديك أيضًا، خاصّة إن كنت تُضمِّن مكتبات طرف ثالث كبيرة الحجم. يجب الانتباه إلى الشيفرة التي تُضمِّنها في حزمتك لكي لا تجعلها كبيرة من غير قصد لدرجة أن يستغرق تطبيقك زمنًا طويلًا للتحميل.

لتجنّب الحصول على حزمة كبيرة من الأفضل استباق حصول المشكلة والبدء في تقسيم حزمتك. 
 [تقسيم الشيفرة (Code-Splitting)](https://webpack.js.org/guides/code-splitting/) هو ميّزة مدعومة من قبل المُحزِّمات مثل Webpack و Browserify (عبر
[factor-bundle](https://github.com/browserify/factor-bundle)) والتي تستطيع إنشاء حزم متعددة يُمكِن تحميلها بشكل ديناميكي في زمن التنفيذ.

يُساعدك تقسيم شيفرة تطبيقك على إجراء تحميل مُتأخّر (Lazy Load) للأشياء التي يحتاجها المستخدم حاليًّا فقط، ممّا يُحسِّن بشكل كبير أداء تطبيقك. وفي حين أنّك لم تُقلِّل الحجم الكلي لشيفرة تطبيقك، فقد تجنّبت تحميل شيفرة قد لا يحتاجها المستخدم أبدًا وقلّلتَ حجم الشيفرة التي تحتاج إلى تحميلها في البداية.

## `import()` {#import}

أفضل طريقة لتقديم تقسيم الشيفرة إلى تطبيقك هي عبر استخدام صياغة
`import()` الديناميكية.

**الشيفرة قبل الاستخدام:**

```js
import { add } from './math';

console.log(add(16, 26));
```

**الشيفرة بعد الاستخدام::**

```js
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

> ملاحظة:
>
> صياغة `import()` الديناميكية هي عبارة عن
> [اقتراح](https://github.com/tc39/proposal-dynamic-import) في ECMAScript (أي JavaScript) وليست جزءًا من اللغة المعيارية، ومن المتوقع قبولها في المستقبل القريب.

عندما يأتي Webpack على هذه الصياغة سيبدأ بتقسيم شيفرة تطبيقك تلقائيًّا. إن كنت تستخدم Create React App, فهذا الإعداد موجود لديك مُسبقًا
و [تستطيع استخدامه مباشرةً](https://facebook.github.io/create-react-app/docs/code-splitting) وهو أيضًا موجود بشكل جاهز عندما تستخدم [Next.js](https://github.com/zeit/next.js/#dynamic-import).

إن كنت تُعِد Webpack بنفسك فستحتاج لقراءة
[ دليل Webpack حول تقسيم الشيفرة](https://webpack.js.org/guides/code-splitting/). يجب أن تبدو إعدادات Webpack لديك [مثل هذا](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

عند استخدامك [Babel](https://babeljs.io/), yيجب أن تتأكد من قدرته على تصريف صياغة الاستيراد  (`import()‎`) الديناميكية بدون تحويلها. ستحتاج من أجل ذلك إلى هذه الإضافة [babel-plugin-syntax-dynamic-import](https://yarnpkg.com/en/package/babel-plugin-syntax-dynamic-import).

## `React.lazy` {#reactlazy}

> ملاحظة:
>
> `React.lazy` و `Suspense` غير متاحين للتصيير من طرف الخادم. إن أردت تنفيذ تقسيم للشيفرة في تطبيق مصيَّر من طرف الخادم، ننصح باستعمال المكتبة [Loadable Components](https://github.com/smooth-code/loadable-components). إذ تملك [دليلًا جيدًا لتحزيم عملية التقسيم مع التصيير من طرف الخادم](https://github.com/smooth-code/loadable-components/blob/master/packages/server/README.md).

تمكِّنك الدالة `React.lazy`  من تصيير استيراد ديناميكي على أنَّه مكون عادي.

**قبل:**

```js
import OtherComponent from './OtherComponent';

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

**بعد:**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

ستحمِّل هذه الشيفرة الحزمة تلقائيًّا التي تحوي المكون `OtherComponent` عند تصييره.

تأخذ الدالة `React.lazy` دالةً يجب عليها أن استدعاء استيراد ديناميكي عبر `import()`. هذا يجب أن يعيد وعدًا (أي `Promise`) يُستبيَن إلى وحدةٍ مع تصدير افتراضي `default` يحوي مكون React.

### Suspense {#suspense}

إن لم تُحمَّل الوحدة التي تحوي المكون `OtherComponent` بعد في الوقت الذي يُصيَّر فيه `MyComponent`, يجب أن نظهر بعض المحتوى التراجعي (fallback content) في أثناء انتظارنا تحميلها مثل تحميل مؤشِّر. يمكن تنفيذ هذا عبر استعمال المكون `Suspense` component.

```js
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

المكان الجيد للبدء بذلك هو الطرق (routes). اعتاد معظم مستخدمي الويب على أنّ أزرار التقليب بين الصفحات تستغرق وقتًا لتحميلها. تميل حينها أيضًا إلى إعادة تصيير كامل الصفحة مرة واحدة لذا من غير المحتمل أن يكون المستخدم يحاول التفاعل مع الصفحة في نفس الوقت.

هذا مثال حول إعداد تقسيم الشيفرة اعتمادًا على الطريق في تطبيقك باستخدام مكتبات مثل [React Router](https://reacttraining.com/react-router/) و `React.lazy`.

```js
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

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
