---
id: strict-mode
title: الوضع الصارم
permalink: docs/strict-mode.html
prev: static-type-checking.html
next: typechecking-with-proptypes.html
---

`الوضع الصارم` هو عبارة عن أداة لتوضيح المشاكل المحتملة في التطبيق، وهو يُشبِه الأجزاء [`استخدام الأجزاء`](https://ar.reactjs.org/docs/fragments.html) في عدم تصييره لأي واجهة مستخدم مرئيّة. يُفعِّل الوضع الصارم تحققات وتحذيرات إضافيّة للمكوّنات المنحدرة عنه.


> ملاحظة:
>
> يعمل التحقق في الوضع الصارم في وضع التطوير فقط، ولا يؤثر على وضع الإنتاج.

بإمكانك تفعيل الوضع الصارم لأي جزء من تطبيقك، على سبيل المثال:
`embed:strict-mode/enabling-strict-mode.js`

في المثال السابق *لن* يعمل تحقق الوضع الصارم على المكوّنين `Header` و `Footer`. سيجري التحقق على المكوّنين `ComponentOne` و `ComponentTwo` بالإضافة إلى جميع المكوّنات المنحدرة عنها.

<<<<<<< HEAD
يُساعدنا `الوضع الصارم` حاليًّا في:
* [التعرف على المكوّنات التي لا تمتلك توابع دورة حياة آمنة.](#identifying-unsafe-lifecycles)
* [التحذير حول استخدام واجهة برمجة التطبيقات (API) القديمة لمراجع السلاسل النصيّة.](#warning-about-legacy-string-ref-api-usage)
* [التحذير حول استخدام الواجهة findDOMNode المهملة.](#warning-about-deprecated-finddomnode-usage)
* [كشف التأثيرات الجانبية غير المتوقعة.](#detecting-unexpected-side-effects)
* [كشف واجهة برمجة التطبيقات (API) القديمة للسياق (context).](#detecting-legacy-context-api)
=======
`StrictMode` currently helps with:
* [Identifying components with unsafe lifecycles](#identifying-unsafe-lifecycles)
* [Warning about legacy string ref API usage](#warning-about-legacy-string-ref-api-usage)
* [Warning about deprecated findDOMNode usage](#warning-about-deprecated-finddomnode-usage)
* [Detecting unexpected side effects](#detecting-unexpected-side-effects)
* [Detecting legacy context API](#detecting-legacy-context-api)
* [Ensuring reusable state](#ensuring-reusable-state)
>>>>>>> 868d525a74b717a10e0f61bb576213e133aa8d07

ستُضاف وظائف أخرى في الإصدارات القادمة من React.

### التعرف على المكوّنات التي لا تمتلك توابع دورة حياة آمنة {#identifying-unsafe-lifecycles}

كما هو مشروح [في هذا المنشور](/blog/2018/03/27/update-on-async-rendering.html)، من غير الآمن استخدام بعض توابع دورة الحياة القديمة المهملة مع تطبيقات React غير المتزامنة، ولكن إن كان تطبيقك يستخدم مكتبات طرف ثالث فسيصبح من الصعب ضمان عدم استخدام هذه التوابع. لحسن الحظ يُساعدنا الوضع الصارم في كشف ذلك.

عند تمكين الوضع الصارم تُصرِّف React قائمة بالمكوّنات الصنفية التي تستخدم توابع دورة حياة غير آمنة وتُسجِّل رسالة تحذير بمعلومات حول هذه المكوّنات كما يلي:

![](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

يؤدّي كشف المشاكل التي يتعرف عليها الوضع الصارم _الآن_ إلى تسهيل استخدامك للتصيير غير المتزامن في إصدارات React القادمة.

### التحذير حول استخدام واجهة برمجة التطبيقات (API) القديمة لمراجع السلاسل النصيّة {#warning-about-legacy-string-ref-api-usage}

كانت تزوّدنا React سابقًا بطريقتين لإدارة المراجع، وهما API مراجع السلاسل النصيّة القديمة و API ردود النداء. وعلى الرغم من أنّ الأولى كانت هي الأنسب من بينهما فقد كان لها [بعض المشاكل](https://github.com/facebook/react/issues/1373)، لذا كانت توصياتنا الرسمية هي [استخدام شكل ردود النداء بدلًا منها](/docs/refs-and-the-dom.html#legacy-api-string-refs).

أضاف إصدار React 16.3 خيارًا ثالثًا يوفّر لنا سهولة مراجع السلاسل النصيّة بدون أي مشاكل:
`embed:16-3-release-blog-post/create-ref-example.js`

منذ إضافة مراجع الكائنات كبديل لمراجع السلاسل النصيّة أصبح الوضع الصارم يُحذرنا عن استخدام مراجع السلاسل النصيّة.

> **ملاحظة:**
>
>  سيستمر دعم مراجع ردود النداء بالإضافة إلى `createRef` API الجديدة.
>
> لن تحتاج لاستبدال مراجع ردود النداء في مكوّناتك، فهي مرنة أكثر وستبقى كميزة متقدمة في الإصدارات القادمة.


[تعلّم المزيد حول createRef من هنا.](/docs/refs-and-the-dom.html)

### التحذير حول استخدام الواجهة findDOMNode المهملة {#warning-about-deprecated-finddomnode-usage}

كانت React تدعم `findDOMNode` للبحث في الشجرة عن عقدة DOM بإعطاء نسخة صنف. لا تحتاج عادةً إلى ذلك لأنَّك تستطيع [ربط مرجعٍ مباشرةً بعقدة DOM.](/docs/refs-and-the-dom.html#creating-refs).

يمكن استعمال `findDOMNode` أيضًا مع مكونات الأصناف ولكن عُدَّ ذلك تجاوزًا لمستويات التجريد (abstraction levels) عبر السماح للمكون الأب بطلب ابن محدَّدٍ جرى تصييره. إنَّها تشكل خطرًا بإعادة التصميم في المكان الذي لا يمكنك فيه تغيير تفاصيل التنفيذ لمكونٍ ما؛ سبب ذلك هو أنَّ المكون الأب له قد يكون في قيد الوصول إلى عقدة DOM الخاصة به. تعيد `findDOMNode` أول مكون ابن فقط ولكن يمكن لأي مكون مع استعمال الأجزاء (Fragments) أن يصيِّر عدة عقد DOM. تعدُّ الواجهة `findDOMNode` واجهةً برمجيةً تقرأ مرةً واحدةً. أي أنَّها ترد عليك متى ما سألتها فقط. إن صَيَّر عنصرٌ عقدةً مختلفةً، فليس هنالك أي وسيلة لمعالجة هذا التغيير. وبالتالي، تعمل `findDOMNode` إن أعادت المكونات دومًا عقدة DOM وحيدة لا تتغير على الإطلاق.

يمكنك عوضَ ذلك أن تجعل هذا أكثر وضوحًا عبر تمرير مرجعٍ إلى مكونك المخصص ثم تمريره إلى DOM باستعمال [تمرير المراجع](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

تستطيع أيضًا إضافة عقدة DOM مغلِّفة في مكونك وربط مرجعٍ بها مباشرةً.

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }
  render() {
    return <div ref={this.wrapper}>{this.props.children}</div>;
  }
}
```

> ملاحظة:
>
> ملاحظة: في CSS، يمكن استعمال الخاصية [`display: contents`](https://developer.mozilla.org/en-US/docs/Web/CSS/display#display_contents) إن لم ترد أن تكون العقدة جزءًا من التخطيط. 

### كشف التأثيرات الجانبية غير المتوقعة {#detecting-unexpected-side-effects}

تعمل React في طورين بشكل نظري:
* **طور التصيير (render)** والذي يُحدِّد ما التغييرات التي يجب فعلها (في DOM مثلًا). تستدعي React خلال هذا الطور التابع `render` ومن ثمّ تُقارِن النتيجة مع التصيير السابق.
* **طور التطبيق (commit)** وهو يحدث عند تطبيق React لأي تغييرات (في حالة DOM يحدث عند إدخال وتحديث وإزالة عُقَد DOM). تستدعي React أيضًا توابع دورة الحياة مثل `componentDidMount` و `componentDidUpdate` خلال هذا الطور.

يكون طور التطبيق سريعًا جدًّا عادةً، ولكن التصيير قد يكون بطيئًا. لهذا السبب يُجزِّء الوضع غير المتزامن (concurrent mode) القادم (والذي لم يُفعَّل بشكل افتراضي حتى الآن) عمل التصيير إلى قطع مع إيقاف واستكمال العمل لتجنّب إيقاف المتصفح. يعني هذا قدرة React على استدعاء توابع دورة حياة طور التصيير أكثر من مرّة قبل التطبيق، أو ربّما تستدعيها بدون التطبيق نهائيًّا (بسبب خطأ ما أو مقاطعة عالية الأهمية).

تتضمّن دورة حياة طور التصيير توابع المكوّنات التالية:
* `constructor`
* `componentWillMount` (or `UNSAFE_componentWillMount`)
* `componentWillReceiveProps` (or `UNSAFE_componentWillReceiveProps`)
* `componentWillUpdate` (or `UNSAFE_componentWillUpdate`)
* `getDerivedStateFromProps`
* `shouldComponentUpdate`
* `render`
* تابع التحديث `setState` (الوسيط الأول).

وبسبب إمكانيّة استدعاء التوابع التالية أكثر من مرة، من الهام ألّا تحتوي على آثار جانبية. يقود تجاهل هذه القاعدة إلى مشاكل عديدة، بما في ذلك تسريبات الذاكرة وحالة التطبيق غير الصحيحة. لسوء الحظ قد يكون من الصعب كشف هذه المشاكل لأنّها قد تكون أحيانًا [غير منهجية](https://en.wikipedia.org/wiki/Deterministic_algorithm).

لا يستطيع الوضع الصارم كشف الآثار الجانبية تلقائيًّا ولكن يُساعدك على توضيحها عن طريق جعلها أكثر منهجية. يفعل ذلك عن طريق الاستدعاء المزدوج للتوابع التالية عن قصد:

* التابع الباني `constructor`، `render`، أو `shouldComponentUpdate` لمكوّنات الأصناف.
* التابع الباني `getDerivedStateFromProps` لمكوّنات الأصناف الثابت
* محتوى مكون التابع
* تابع التحديث `setState` (الوسيط الأول).
* التوابع الممررة `useState`، `useMemo`، أو `useReducer`

> ملاحظة:
>
> يُطبَّق ذلك في وضع التطوير فقط. _لن يحصل الاستدعاء المزدوج في وضع الإنتاج._

على سبيل المثال انظر إلى الشيفرة التالية:
`embed:strict-mode/side-effects-in-constructor.js`

قد لا يظهر وجود مشكلة للوهلة الأولى، ولكن `SharedApplicationState.recordEvent` ليس [ثابتًا](https://en.wikipedia.org/wiki/Idempotence#Computer_science_meaning)، لذا قد يؤدي استنساخ المكوّن مرات متعددة إلى حالة تطبيق خاطئة. قد لا يظهر هذا النوع من المشاكل خلال التطوير أو ربّما قد لا يظهر دائمًا لذا قد نتجاهله.

يتمكن الوضع الصارم عن طريق الاستدعاء المزدوج للتوابع عن قصد مثل الدالة البانية للمكوّن من توضيح مثل هذه المشاكل بشكل أسهل.

> ملاحظة:
>
<<<<<<< HEAD
> بدءًا من React 17، يقوم React تلقائيًا بتعديل طرق وحدة التحكم مثل `console.log()` لإسكات السجلات في الاستدعاء الثاني لوظائف دورة المكون.
ومع ذلك، قد يتسبب ذلك في سلوك غير مرغوب فيه في بعض الحالات حيث يمكن استخدام [حل بديل](https://github.com/facebook/react/issues/20090#issuecomment-715927125).
=======
> In React 17, React automatically modifies the console methods like `console.log()` to silence the logs in the second call to lifecycle functions. However, it may cause undesired behavior in certain cases where [a workaround can be used](https://github.com/facebook/react/issues/20090#issuecomment-715927125).
>
> Starting from React 18, React does not suppress any logs. However, if you have React DevTools installed, the logs from the second call will appear slightly dimmed. React DevTools also offers a setting (off by default) to suppress them completely.
>>>>>>> 868d525a74b717a10e0f61bb576213e133aa8d07

### كشف واجهة برمجة التطبيقات (API) القديمة للسياق (context) {#detecting-legacy-context-api}

وهي واجهة مسببة للأخطاء وستُزال بشكل كامل في الإصدار الرئيسي القادم. لا تزال تعمل في الإصدارات 16.x ولكنها ستُظهِر هذه الرسائل التحذيرية في الوضع الصارم:

![](../images/blog/warn-legacy-context-in-strict-mode.png)

<<<<<<< HEAD
اقرأ [ توثيق context API الجديدة ](/docs/context.html) ليساعدك على الانتقال إلى الإصدار الجديد.
=======
Read the [new context API documentation](/docs/context.html) to help migrate to the new version.


### Ensuring reusable state {#ensuring-reusable-state}

In the future, we’d like to add a feature that allows React to add and remove sections of the UI while preserving state. For example, when a user tabs away from a screen and back, React should be able to immediately show the previous screen. To do this, React will support remounting trees using the same component state used before unmounting.

This feature will give React better performance out-of-the-box, but requires components to be resilient to effects being mounted and destroyed multiple times. Most effects will work without any changes, but some effects do not properly clean up subscriptions in the destroy callback, or implicitly assume they are only mounted or destroyed once.

To help surface these issues, React 18 introduces a new development-only check to Strict Mode. This new check will automatically unmount and remount every component, whenever a component mounts for the first time, restoring the previous state on the second mount.

To demonstrate the development behavior you'll see in Strict Mode with this feature, consider what happens when React mounts a new component. Without this change, when a component mounts, React creates the effects:

```
* React mounts the component.
  * Layout effects are created.
  * Effects are created.
```

With Strict Mode starting in React 18, whenever a component mounts in development, React will simulate immediately unmounting and remounting the component:

```
* React mounts the component.
    * Layout effects are created.
    * Effect effects are created.
* React simulates effects being destroyed on a mounted component.
    * Layout effects are destroyed.
    * Effects are destroyed.
* React simulates effects being re-created on a mounted component.
    * Layout effects are created
    * Effect setup code runs
```

On the second mount, React will restore the state from the first mount. This feature simulates user behavior such as a user tabbing away from a screen and back, ensuring that code will properly handle state restoration.

When the component unmounts, effects are destroyed as normal:

```
* React unmounts the component.
  * Layout effects are destroyed.
  * Effect effects are destroyed.
```

Unmounting and remounting includes:

- `componentDidMount`
- `componentWillUnmount`
- `useEffect`
- `useLayoutEffect`
- `useInsertionEffect`

> Note:
>
> This only applies to development mode, _production behavior is unchanged_.

For help supporting common issues, see:
  - [How to support Reusable State in Effects](https://github.com/reactwg/react-18/discussions/18)
>>>>>>> 868d525a74b717a10e0f61bb576213e133aa8d07
