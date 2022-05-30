---
id: codebase-overview
title: نظرة عامة عن قاعدة الشفرة المصدرية
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

### مجلدات المستوى الأعلى {#top-level-folders}

بعد استنساخ [مستودع React](https://github.com/facebook/react), سترى بعض مجلدات المستوى الأعلى فيه:

* تحتوي [`الحزم`](https://github.com/facebook/react/tree/main/packages) (packages) على بيانات التعريف (مثل `package.json`) و شفرة المصدر (الدليل الفرعي `src`) لجميع الحزم في مستودع React. **إذا كان التغيير الخاص بك مرتبطًا بالشفرة (code)، فإن الدليل الفرعي "src" لكل حزمة هو المكان الذي ستقضي فيه معظم وقتك.**
* تحتوي [التركيبات](https://github.com/facebook/react/tree/main/fixtures) (fixtures) على عدد قليل من تطبيقات اختبار React الصغيرة للمساهمين.
* `build` هو ناتج بناء React.  ليس موجودًا في المستودع ، ولكنه سيظهر في استنساخ React الخاص بك بعد [إنشائه](/docs/how-to-contribute.html#development-workflow) للمرة الأولى.

تم استضافة الوثائق في [مستودع منفصل عن React](https://github.com/reactjs/reactjs.org).

يوجد عدد قليل من مجلدات المستوى الأعلى الأخرى ولكنها تستخدم في الغالب للأدوات، ومن المحتمل ألا تقابلها أبدًا عند المساهمة.

### الاختبارات الموضوعة سويًا {#colocated-tests}
ليس لدينا مجلد مستوي اعلي لاختبارات الوحدة (unit tests). بدلاً من ذلك، نضعها في مجلد يسمى `__tests__` نسبة إلى الملفات التي يختبرونها.

على سبيل المثال ،اختبار [`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js) موجود في [`tests__/setInnerHTML-test.js__`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js) بجانبه بالضبط.

### التحذيرات و الثوابت {#warnings-and-invariants}

تستخدم قاعدة الشفرة المصدرية لـ React `console.error` لعرض التحذيرات:

```js
if (__DEV__) {
  console.error('Something is wrong.');
}
```

يتم تمكين التحذيرات فقط في التطوير. في الإنتاج (production) ، يتم تجريدهم بالكامل. إذا كنت بحاجة إلى منع تنفيذ بعض مسار الكود، فاستخدم وحدة `invariant` بدلاً من ذلك:

```js
var invariant = require('invariant');

invariant(
  2 + 2 === 4,
  'You shall not pass!'
);
```

**يتم طرح الثابت عندما تكون حالة `invariant` تساوي `false`.**

"invariant" هي مجرد وسيلة لقول "هذا الشرط دائما صحيح". يمكنك التفكير في الأمر على أنه تأكيد.

من المهم الحفاظ على تشابة سلوكيات التطوير والإنتاج، لذلك `invariant` يطرح (throws) في كل من التطوير والإنتاج. يتم استبدال رسائل الخطأ تلقائيًا برموز (codes) خطأ في الإنتاج لتجنب التأثير السلبي على حجم البايت.

### التطوير والإنتاج {#development-and-production}

يمكنك استخدام المتغير الزائف (pseduo-global variable) `__DEV__` في قاعدة الشفرة المصدرية لـ React من حراسة كتل الكود المخصص للتطوير فقط.

يتم تضمينه أثناء خطوة التحويل البرمجي، ويتحول إلى تحقق `process.env.NODE_ENV !== 'production'` في بنايات CommonJS.

بالنسبة للبنيات القائمة بذاتها (standalone)، تصبح `true` في البنية غير المصغرة (unminified build)، ويتم تجريدها بالكامل من كتل `if` التي تحرسها في البنية المصغرة.

```js
if (__DEV__) {
  // This code will only run in development.
}
```

### Flow {#flow}

بدأنا في الآونة الأخيرة تقديم تحققات [Flow](https://flow.org/) الي قاعدة الشفرة المصدرية. يتم عمل فحص للأنواع للملفات التي تحمل علامة التعليقات التوضيحية `@flow` في  ترخيص رأس التعليق  (license header comment).

نحن نقبل طلبات السحب (pull requests). انظر [ضف تعليقات Flow التوضيحية لشفرتك الحالية](https://github.com/facebook/react/pull/7600/files). التعليقات التوضيحية لـFlow  تبدو كالتالي:

```js
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```

عندما يكون ذلك ممكنًا، يجب أن يستخدم الكود الجديد التعليقات التوضيحية الخاصة بFlow.
يمكنك تشغيل `yarn flow` محليًا للتحقق من شفرتك باستخدام Flow.

### الحزم المتعددة {#multiple-packages}

تصنف React ضمن [monorepo](https://danluu.com/monorepo/). إذ يحتوي مستودعها على حزم متعددة منفصلة بحيث يمكن تنسيق تغييراتها معًا، وتعيش المشكلات (issues) في مكان واحد.

### نواة React {#react-core}

<<<<<<< HEAD
تشمل "نواة" React جميع الـ [واجهات برمجة تطبيقات `React` ذات المستوى العالي](/docs/top-level-api.html#react) مثل:
=======
The "core" of React includes all the [top-level `React` APIs](/docs/react-api.html#react), for example:
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f

* `React.createElement()`
* `React.Component`
* `React.Children`

**نواة React لا تتضمن سوى واجهات برمجة التطبيقات الضرورية لتحديد المكونات.** لا تتضمن خوارزمية التسوية ([reconciliation](/docs/reconciliation.html)) أو أي كود خاص بالنظام الأساسي. يتم استخدامه من قبل كل من مكونات React DOM و React Native.

الكود الخاص بنواة React يقع في [`packages/react`](https://github.com/facebook/react/tree/main/packages/react) بشجرة المصدر (source tree). و هي متوفرة على npm كحزمة [`react`](https://www.npmjs.com/package/react). يسمى بناء المتصفح المستقل باسم `react.js`، ويصدر بشكل عمومي تحت مسمى `React`.

### العارضون {#renderers}

تم إنشاء React في الأصل من أجل DOM ولكن تم تكييفها لاحقًا أيضًا لدعم الأنظمة الأساسية الأصلية مع [React Native](https://reactnative.dev/). قدم هذا مفهوم "التصيير" لدواخل React.

**يدير العارضون كيف تتحول شجرة React إلى المكالمات الأساسية للنظام الأساسي.**

وتقع العارضين أيضا في [`/packages`](https://github.com/facebook/react/tree/main/packages/):

* تصيير [React DOM Renderer](https://github.com/facebook/react/tree/main/packages/react-dom)  مكونات React DOM. يقوم بتنفيذ [top-level `ReactDOM` APIs](/docs/react-dom.html) و هي متوفرة كحزمة [`react-dom`](https://www.npmjs.com/package/react-dom) علي npm. يمكن استخدامه أيضًا كحزمة متصفح مستقلة تسمى `react-dom.js` و التي تصدر `ReactDOM` عمومي.
* تصيير [React Native Renderer](https://github.com/facebook/react/tree/main/packages/react-native-renderer) مكونات React إلى وجهات النظر الأصلية. يتم استخدامه داخليًا بواسطة React Native.
* تصيير [React Test Renderer](https://github.com/facebook/react/tree/main/packages/react-test-renderer) مكونات React الي اشجار JSON. يتم استخدامه بواسطة ميزة [Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) الخاصة ب[Jest](https://facebook.github.io/jest) و هو متاح كحزمة [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) علي npm. 

العارض الوحيد الآخر المدعوم رسميًا هو [`react-art`](https://github.com/facebook/react/tree/main/packages/react-art). اعتادت أن تكون في [مستودع Github منفصل](https://github.com/reactjs/react-art) لكننا انتقلنا إلى شجرة المصدر الرئيسية في الوقت الحالي.

>**ملحوظة:**
>
>من الناحية الفنية ، يعد [`react-native-renderer`](https://github.com/facebook/react/tree/main/packages/react-native-renderer) طبقة رفيعة جدًا تُعلم React بالتفاعل مع تطبيق React Native . يعيش الكود الحقيقي الخاص بالنظام الأساسي الذي يدير المشاهدات الأصلية في [React Native repository](https://github.com/facebook/react-native) مع مكوناته.

### المطابقات {#reconcilers}

حتى العارضين المختلفين إلى حد كبير مثل React DOM و React Native يحتاجون إلى مشاركة الكثير من المنطق.  على وجه الخصوص ، يجب أن تكون خوارزمية [المطابقة](/docs/reconciliation.html) متشابهة قدر الإمكان حتى يعمل التصيير التوضيحي، والمكونات المخصصة، والحالة (state)، وطرق دورة الحياة (lifecycle methods)، والمراجع (refs) باستمرار عبر الأنظمة الأساسية.

لحل هذه المشكلة ، يشارك العارضون المختلفون بعض التعليمات البرمجية بينهم. نحن نسمي هذا الجزء من React "المطابق" (reconciler). عندما يتم جدولة تحديث مثل `setState()` ، يستدعي المطابق `render()` على المكونات الموجودة في الشجرة ويقوم بتثبيتها أو تحديثها أو إلغاء تحميلها.

لا يتم حزم المطابقات بشكل منفصل لأنه لا يوجد حاليًا أي واجهة برمجة تطبيقات عامة. بدلاً من ذلك ، يتم استخدامها حصريًا بواسطة عارضين مثل React DOM و React Native.

### مطابق المكدس {#stack-reconciler}

مطابق "المكدس" (stack reconciler) هو تطبيق يقوم بتشغيل React 15 والإصدارات الأقدم. لقد توقفنا عن استخدامه منذ ذلك الحين، لكن تم توثيقه بالتفصيل في [القسم التالي](/docs/implementation-notes.html).

### مطابق الفيبر {#fiber-reconciler}

يعتبر مطابق الفيبر (fiber reconciler) مجهودًا جديدًا يهدف إلى حل المشكلات الكامنة في المطابق المكدس وإصلاح عدد قليل من المشكلات القديمة. لقد كان المطابق الافتراضي منذ React 16.

أهدافه الرئيسية هي:

* القدرة على تقسيم العمل المنقطع في أجزاء.
* القدرة على تحديد الأولويات، إعادة صياغة وإعادة استخدام العمل قيد التقدم.
* القدرة على الخضوع ذهابًا وإيابًا بين الآباء والأطفال لدعم التخطيط في React.
* القدرة على إرجاع عناصر متعددة من `render()`.
* دعم أفضل لحدود الخطأ (error boundaries).

يمكنك قراءة المزيد عن "React Fiber Architecture" [هنا](https://github.com/acdlite/react-fiber-architecture) و [هنا](https://blog.ag-grid.com/inside-fiber-an-in-depth-overview-of-the-new-reconciliation-algorithm-in-react). بينما يتم شحنها مع React 16، لا يتم تمكين ميزات المزامنة (async) بشكل افتراضي بعد.

شفرة المصدر الخاصة به موجودة في [`packages/react-reconciler`](https://github.com/facebook/react/tree/main/packages/react-reconciler).

### نظام الأحداث {#event-system}

يطبّق React نظام أحداث وهمي منفصل عن المصيّرين (rendrers) ويعمل مع كل من React DOM و React Native. شيفرته المصدرية موجودة في [`packages/react-dom/src/events`](https://github.com/facebook/react/tree/main/packages/react-dom/src/events).

### ماذا بعد؟ {#what-next}

اقرأ [القسم التالي](/docs/implementation-notes.html) للتعرف على تطبيق المطابق قبل React 16 بمزيد من التفاصيل. لم نقم بتوثيق الأجزاء الداخلية للمطابق الجديد بعد.
