---
id: codebase-overview
title: Codebase Overview
layout: contributing
permalink: docs/codebase-overview.html
prev: how-to-contribute.html
next: implementation-notes.html
redirect_from:
  - "contributing/codebase-overview.html"
---

يوفر لك هذا القسم نظرة عامة حول تنظيم قاعدة كود برنامج React، أعرافه البرمجية، و طرق التنفيذ.

إذا كنت ترغب في [المساهمة في React](/docs/how-to-contribute.html)، نأمل أن يساعدك هذا الدليل على الشعور بالراحة عند إجراء التغييرات.

لا نوصي بالضرورة بأي من هذه الأعراف البرمجية في تطبيقات React. الكثير منهم موجودون لأسباب تاريخية وقد يتغيرون مع مرور الوقت.

### التبعيات الخارجية {#external-dependencies}

 لا يوجد لدي React أي تبعيات خارجية تقريبا. عادةً، تشير `require()` إلى ملف في قاعدة كود برنامج React الخاصة. ومع ذلك ، هناك بعض الاستثناءات النادرة نسبيا.

يوجد [مستودع fbjs](https://github.com/facebook/fbjs) لأن React يشارك بعض الأدوات الصغيرة مع المكتبات (libraries) مثل مكتبة [Relay](https://github.com/facebook/relay) ،و نبقيهم متزامنين. لا نعتمد على وحدات صغيرة مكافئة في نظام Node لأننا نريد أن يتمكن مهندسو Facebook من إجراء تغييرات عليها كلما دعت الضرورة. لا تعد أيًا من الأدوات المساعدة الموجودة داخل fbjs بمثابة واجهة برمجة تطبيقات (API) عامة، وهي مخصصة فقط للاستخدام من قبل مشاريع Facebook مثل React.

### مجلدات المستوى الأعلى {#top-level-folders}

بعد استنساخ [مستودع React](https://github.com/facebook/react), سترى بعض مجلدات المستوى الأعلى فيه:

* تحتوي [`الحزم`](https://github.com/facebook/react/tree/master/packages) (packages) على بيانات التعريف (مثل `package.json`) و شفرة المصدر (الدليل الفرعي `src`) لجميع الحزم في مستودع React. **إذا كان التغيير الخاص بك مرتبطًا بالشفرة (code)، فإن الدليل الفرعي "src" لكل حزمة هو المكان الذي ستقضي فيه معظم وقتك.**
* تحتوي [التركيبات](https://github.com/facebook/react/tree/master/fixtures) (fixtures) علي عدد قليل من تطبيقات اختبار React الصغيرة للمساهمين.
* `build` هو ناتج بناء React.  ليس موجودًا في المستودع ، ولكنه سيظهر في استنساخ React الخاص بك بعد [إنشائه](/docs/how-to-contribute.html#development-workflow) للمرة الأولى.

يتم استضافة الوثائق في [مستودع منفصل عن React](https://github.com/reactjs/reactjs.org).

يوجد عدد قليل من مجلدات المستوى الأعلى الأخرى ولكنها تستخدم في الغالب للأدوات، ومن المحتمل ألا تقابلها أبدًا عند المساهمة.

### الاختبارات الموضوعة سويًا {#colocated-tests}
ليس لدينا مجلد مستوي اعلي لاختبارات الوحدة (unit tests). بدلاً من ذلك، نضعها في مجلد يسمى `__tests__` نسبة إلى الملفات التي يختبرونها.

على سبيل المثال ،اختبار [`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js) موجود في [`tests__/setInnerHTML-test.js__`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js) بجانبه بالضبط.

### التحذيرات و الثوابت {#warnings-and-invariants}

تستخدم قاعدة كود برنامج React وحدة (module) `warning` لعرض التحذيرات:

```js
var warning = require('warning');

warning(
  2 + 2 === 4,
  'Math is not working today.'
);
```

**يظهر التحذير عندما تكون حالة `warning` تساوي `false`.**

إحدى طرق التفكير في الأمر هو أن الحالة يجب أن تعكس الوضع الطبيعي بدلاً من الحالة الاستثنائية.

من المستحسن تجنب إغراق (spamming) عارضة التحكم (console) بتحذيرات مكررة:

```js
var warning = require('warning');

var didWarnAboutMath = false;
if (!didWarnAboutMath) {
  warning(
    2 + 2 === 4,
    'Math is not working today.'
  );
  didWarnAboutMath = true;
}
```

يتم تمكين التحذيرات فقط في التطوير. في الإنتاج، يتم تجريدهم بالكامل. إذا كنت بحاجة إلى منع تنفيذ بعض مسار الكود، فاستخدم الوحدة `invariant` بدلاً من ذلك:

```js
var invariant = require('invariant');

invariant(
  2 + 2 === 4,
  'You shall not pass!'
);
```

**يتم طرح الثابت عندما تكون حالة `invariant` تساوي `false`.**

"ثابت" (invariant) هي مجرد وسيلة لقول "هذا الشرط دائما صحيح". يمكنك التفكير في الأمر على أنه تأكيد.

من المهم الحفاظ على تشابة سلوكيات التطوير والإنتاج، لذلك `invariant` يطرح (throws) في كل من التطوير والإنتاج. يتم استبدال رسائل الخطأ تلقائيًا برموز خطأ (error codes) في الإنتاج لتجنب التأثير السلبي على حجم البايت.

### التطوير والإنتاج {#development-and-production}

يمكنك استخدام المتغير الزائف (pseduo-global variable) `__DEV__` في قاعدة كود برنامج React لحراسة كتل الكود المخصص للتطوير فقط.

يتم تضمينه أثناء خطوة التحويل البرمجي، ويتحول إلى تحقق `process.env.NODE_ENV !== 'production'` في بنايات CommonJS.

بالنسبة للبنيات القائمة بذاتها (standalone)، تصبح `true` في البنية غير المصغرة (unminified build)، ويتم تجريدها بالكامل من كتل `if` التي تحرسها في البنية المصغرة.

```js
if (__DEV__) {
  // This code will only run in development.
}
```

### Flow {#flow}

بدأنا في الآونة الأخيرة تقديم تحققات [Flow](https://flow.org/) الي قاعدة الكود. يتم عمل فحص "typecheck" للملفات التي تحمل علامة التعليقات التوضيحية `@flow` في تعليق رأس الترخيص (license header comment).

نحن نقبل طلبات السحب (pull requests). انظر [adding Flow annotations to existing code](https://github.com/facebook/react/pull/7600/files). التعليقات التوضيحية لـFlow  تبدو كالتالي:

```js
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```

عندما يكون ذلك ممكنًا، يجب أن يستخدم الكود الجديد التعليقات التوضيحية الخاصة بFlow.
يمكنك تشغيل `yarn dev` محليًا للتحقق من شفرتك باستخدام Flow.

### الحقن ديناميكي {#dynamic-injection}

يستخدم React الحقن الديناميكي في بعض الوحدات. في حين أنه دائمًا ما يكون صريحًا، إلا أنه لا يزال مؤسفًا لأنه يعيق فهم الكود. السبب الرئيسي لوجوده هو أن React كان في الأصل يدعم DOM فقط كهدف. بدأ React Native كـ fork لـ React. كان علينا إضافة حقن ديناميكي للسماح لReact Native بتجاوز بعض السلوكيات.

قد ترى وحدات تعلن عن تبعياتها الديناميكية مثل هذا:

```js
// Dynamically injected
var textComponentClass = null;

// Relies on dynamically injected value
function createInstanceForText(text) {
  return new textComponentClass(text);
}

var ReactHostComponent = {
  createInstanceForText,

  // Provides an opportunity for dynamic injection
  injection: {
    injectTextComponentClass: function(componentClass) {
      textComponentClass = componentClass;
    },
  },
};

module.exports = ReactHostComponent;
```

لا يتم التعامل مع حقل `injection` بشكل خاص بأي طريقة. ولكن عن طريق الاصطلاح، فهذا يعني أن هذه الوحدة تريد الحصول على بعض التبعيات (من المفترض أنها خاصة بالنظام الأساسي) التي تم حقنها فيها في وقت التشغيل.

هناك عدة نقاط حقن في قاعدة الكود. في المستقبل، نعتزم التخلص من آلية الحقن الديناميكي وربط جميع القطع بشكل ثابت أثناء الإنشاء.

### Multiple Packages {#multiple-packages}

React is a [monorepo](https://danluu.com/monorepo/). Its repository contains multiple separate packages so that their changes can be coordinated together, and issues live in one place.

### React Core {#react-core}

The "core" of React includes all the [top-level `React` APIs](/docs/top-level-api.html#react), for example:

* `React.createElement()`
* `React.Component`
* `React.Children`

**React core only includes the APIs necessary to define components.** It does not include the [reconciliation](/docs/reconciliation.html) algorithm or any platform-specific code. It is used both by React DOM and React Native components.

The code for React core is located in [`packages/react`](https://github.com/facebook/react/tree/master/packages/react) in the source tree. It is available on npm as the [`react`](https://www.npmjs.com/package/react) package. The corresponding standalone browser build is called `react.js`, and it exports a global called `React`.

### Renderers {#renderers}

React was originally created for the DOM but it was later adapted to also support native platforms with [React Native](https://facebook.github.io/react-native/). This introduced the concept of "renderers" to React internals.

**Renderers manage how a React tree turns into the underlying platform calls.**

Renderers are also located in [`packages/`](https://github.com/facebook/react/tree/master/packages/):

* [React DOM Renderer](https://github.com/facebook/react/tree/master/packages/react-dom) renders React components to the DOM. It implements [top-level `ReactDOM` APIs](/docs/react-dom.html) and is available as [`react-dom`](https://www.npmjs.com/package/react-dom) npm package. It can also be used as standalone browser bundle called `react-dom.js` that exports a `ReactDOM` global.
* [React Native Renderer](https://github.com/facebook/react/tree/master/packages/react-native-renderer) renders React components to native views. It is used internally by React Native.
* [React Test Renderer](https://github.com/facebook/react/tree/master/packages/react-test-renderer) renders React components to JSON trees. It is used by the [Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) feature of [Jest](https://facebook.github.io/jest) and is available as [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) npm package.

The only other officially supported renderer is [`react-art`](https://github.com/facebook/react/tree/master/packages/react-art). It used to be in a separate [GitHub repository](https://github.com/reactjs/react-art) but we moved it into the main source tree for now.

>**Note:**
>
>Technically the [`react-native-renderer`](https://github.com/facebook/react/tree/master/packages/react-native-renderer) is a very thin layer that teaches React to interact with React Native implementation. The real platform-specific code managing the native views lives in the [React Native repository](https://github.com/facebook/react-native) together with its components.

### Reconcilers {#reconcilers}

Even vastly different renderers like React DOM and React Native need to share a lot of logic. In particular, the [reconciliation](/docs/reconciliation.html) algorithm should be as similar as possible so that declarative rendering, custom components, state, lifecycle methods, and refs work consistently across platforms.

To solve this, different renderers share some code between them. We call this part of React a "reconciler". When an update such as `setState()` is scheduled, the reconciler calls `render()` on components in the tree and mounts, updates, or unmounts them.

Reconcilers are not packaged separately because they currently have no public API. Instead, they are exclusively used by renderers such as React DOM and React Native.

### Stack Reconciler {#stack-reconciler}

The "stack" reconciler is the implementation powering React 15 and earlier. We have since stopped using it, but it is documented in detail in the [next section](/docs/implementation-notes.html).

### Fiber Reconciler {#fiber-reconciler}

The "fiber" reconciler is a new effort aiming to resolve the problems inherent in the stack reconciler and fix a few long-standing issues. It has been the default reconciler since React 16.

Its main goals are:

* Ability to split interruptible work in chunks.
* Ability to prioritize, rebase and reuse work in progress.
* Ability to yield back and forth between parents and children to support layout in React.
* Ability to return multiple elements from `render()`.
* Better support for error boundaries.

You can read more about React Fiber Architecture [here](https://github.com/acdlite/react-fiber-architecture) and [here](https://blog.ag-grid.com/inside-fiber-an-in-depth-overview-of-the-new-reconciliation-algorithm-in-react). While it has shipped with React 16, the async features are not enabled by default yet.

Its source code is located in [`packages/react-reconciler`](https://github.com/facebook/react/tree/master/packages/react-reconciler).

### Event System {#event-system}

React implements a synthetic event system which is agnostic of the renderers and works both with React DOM and React Native. Its source code is located in [`packages/events`](https://github.com/facebook/react/tree/master/packages/events).

There is a [video with a deep code dive into it](https://www.youtube.com/watch?v=dRo_egw7tBc) (66 mins).

### What Next? {#what-next}

Read the [next section](/docs/implementation-notes.html) to learn about the pre-React 16 implementation of reconciler in more detail. We haven't documented the internals of the new reconciler yet.
