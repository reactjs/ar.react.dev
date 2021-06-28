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

يُساعدنا `الوضع الصارم` حاليًّا في:
* [التعرف على المكوّنات التي لا تمتلك توابع دورة حياة آمنة.](#identifying-unsafe-lifecycles)
* [التحذير حول استخدام واجهة برمجة التطبيقات (API) القديمة لمراجع السلاسل النصيّة.](#warning-about-legacy-string-ref-api-usage)
* [التحذير حول استخدام الواجهة findDOMNode المهملة.](#warning-about-deprecated-finddomnode-usage)
* [كشف التأثيرات الجانبية غير المتوقعة.](#detecting-unexpected-side-effects)
* [كشف واجهة برمجة التطبيقات (API) القديمة للسياق (context).](#detecting-legacy-context-api)

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

<<<<<<< HEAD
يمكن استعمال `findDOMNode` أيضًا مع مكونات الأصناف ولكن عُدَّ ذلك تجاوزًا لمستويات التجريد (abstraction levels) عبر السماح للمكون الأب بطلب ابن محدَّدٍ جرى تصييره. إنَّها تشكل خطرًا بإعادة التصميم في المكان الذي لا يمكنك فيه تغيير تفاصيل التنفيذ لمكونٍ ما؛ سبب ذلك هو أنَّ المكون الأب له قد يكون في قيد الوصول إلى عقدة DOM الخاصة به. تعيد `findDOMNode` أول مكون ابن فقط ولكن يمكن لأي مكون مع استعمال الأجزاء (Fragments) أن يصيِّر عدة عقد DOM. تعدُّ الواجهة `findDOMNode` واجهةً برمجيةً تقرأ مرةً واحدةً. أي أنَّها ترد عليك متى ما سألتها فقط. إن صَيَّر عنصرٌ عقدةً مختلفةً، فليس هنالك أي وسيلة لمعالجة هذا التغيير. وبالتالي، تعمل `findDOMNode` إن أعادت المكونات دومًا عقدة DOM وحيدة لا تتغير على الإطلاق.
=======
`findDOMNode` can also be used on class components but this was breaking abstraction levels by allowing a parent to demand that certain children were rendered. It creates a refactoring hazard where you can't change the implementation details of a component because a parent might be reaching into its DOM node. `findDOMNode` only returns the first child, but with the use of Fragments, it is possible for a component to render multiple DOM nodes. `findDOMNode` is a one time read API. It only gave you an answer when you asked for it. If a child component renders a different node, there is no way to handle this change. Therefore `findDOMNode` only worked if components always return a single DOM node that never changes.
>>>>>>> 25f756d8e3800afb032cb31ce3626d6134e31e38

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
> بدءًا من React 17، يقوم React تلقائيًا بتعديل طرق وحدة التحكم مثل `console.log()` لإسكات السجلات في الاستدعاء الثاني لوظائف دورة المكون.
ومع ذلك، قد يتسبب ذلك في سلوك غير مرغوب فيه في بعض الحالات حيث يمكن استخدام [حل بديل](https://github.com/facebook/react/issues/20090#issuecomment-715927125).

### كشف واجهة برمجة التطبيقات (API) القديمة للسياق (context) {#detecting-legacy-context-api}

وهي واجهة مسببة للأخطاء وستُزال بشكل كامل في الإصدار الرئيسي القادم. لا تزال تعمل في الإصدارات 16.x ولكنها ستُظهِر هذه الرسائل التحذيرية في الوضع الصارم:

![](../images/blog/warn-legacy-context-in-strict-mode.png)

اقرأ [ توثيق context API الجديدة ](/docs/context.html) ليساعدك على الانتقال إلى الإصدار الجديد.
