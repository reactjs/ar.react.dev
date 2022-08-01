---
id: react-api
title: واجهة برمجة التطبيقات (API) ذات المستوى الأعلى
layout: docs
category: Reference
permalink: docs/react-api.html
redirect_from:
  - "docs/reference.html"
  - "docs/clone-with-props.html"
  - "docs/top-level-api.html"
  - "docs/top-level-api-ja-JP.html"
  - "docs/top-level-api-ko-KR.html"
  - "docs/top-level-api-zh-CN.html"
---

`React` هو نقطة الدخول إلى مكتبة React. إن قمت بتنزيل React عن طريق العنصر ‎`<script>`‎ فستكون هذه الواجهة ذات المستوى الأعلى متوفرة عبر الكائن العام `React`. وإن استخدمت ES6 مع npm فتستطيع كتابة `‎import React from 'react'`‎. إن استخدمت ES5 مع npm فتستطيع كتابة ‎`var React = require('react')`‎.



## نظرة عامة {#overview}

### المكوّنات {#components}
تُتيح لك مكوّنات React تقسيم واجهة المستخدم إلى قطع مستقلة قابلة لإعادة الاستخدام والتفكير بكل قطعة على حدة. يُمكِن تعريف مكوّنات React عن طريق أخذ صنف فرعي من `React.Component` أو `React.PureComponent`.

 - [`React.Component`](#reactcomponent)
 - [`React.PureComponent`](#reactpurecomponent)

إن لم تكن تستخدم أصناف ES6 فبإمكانك استخدام الوحدة `create-react-class`.
ألق نطرة على [استخدام React دون ES6](/docs/react-without-es6.html) للمزيد من المعلومات.

يمكن أن تُعرَّف مكونات React أيضًا على أنَّها دوالٌ يمكن تغليفها:
- [`React.memo`](#reactmemo)

### إنشاء عناصر React {#creating-react-elements}

نوصي باستخدام [JSX](/docs/introducing-jsx.html) لوصف مظهر واجهة المستخدم لديك. كل عنصر في JSX هو مجرّد تعبير بديل لاستدعاء التابع [`React.createElement()‎`](#createelement). لن تضطر بشكل اعتيادي إلى استدعاء التوابع التالية بشكل مباشر إن كنت تستخدم JSX:

- [`createElement()`](#createelement)
- [`createFactory()`](#createfactory)

ألق نظرة على [إستخدام React دون JSX](/docs/react-without-jsx.html) للمزيد من المعلومات.

### تحويل العناصر {#transforming-elements}

تُزوِّدنا `React` بالعديد من واجهات برمجة التطبيقات (APIs) للتعامل مع العناصر:

- [`cloneElement()`](#cloneelement)
- [`isValidElement()`](#isvalidelement)
- [`React.Children`](#reactchildren)

### الأجزاء (Fragments) {#fragments}

تُزوِّدنا `React` أيضًا بمكوّن لتصيير عدة عناصر بدون مُغلِّف له.

- [`React.Fragment`](#reactfragment)

### المراجع (Refs) {#refs}

- [`React.createRef`](#reactcreateref)
- [`React.forwardRef`](#reactforwardref)

### التعليق (Suspense) {#suspense}

يسمح التعليق للعنصر بانتظار لشيء ما قبل التصيير. اليوم التعليق يدعم حالة استخدام وحيدة :[تحميل المكونات ديناميكيًّا مع `React.lazy` ](/docs/code-splitting.html#reactlazy). في المستقبل، ستدعم حالات أخرى مثل جلب البيانات.

- [`React.lazy`](#reactlazy)
- [`React.Suspense`](#reactsuspense)

<<<<<<< HEAD
### الخطافات (Hooks) {#hooks}
=======
### Transitions {#transitions}

*Transitions* are a new concurrent feature introduced in React 18. They allow you to mark updates as transitions, which tells React that they can be interrupted and avoid going back to Suspense fallbacks for already visible content.

- [`React.startTransition`](#starttransition)
- [`React.useTransition`](/docs/hooks-reference.html#usetransition)

### Hooks {#hooks}
>>>>>>> 8223159395aae806f8602de35e6527d35260acfb

الخطافات هي إضافة جديدة إلى الإصدار 16.8 في React، إذ تسمح لك باستعمال ميزة الحالة وميزات React الأخرى دون كتابة أي صنف. [تملك الخطافات قسمًا خاصا بها](/docs/hooks-intro.html) وواجهة برمجية منفصلة:

- [الخطافات الأساسية](/docs/hooks-reference.html#basic-hooks)
  - [`useState`](/docs/hooks-reference.html#usestate)
  - [`useEffect`](/docs/hooks-reference.html#useeffect)
  - [`useContext`](/docs/hooks-reference.html#usecontext)
- [خطافات إضافية](/docs/hooks-reference.html#additional-hooks)
  - [`useReducer`](/docs/hooks-reference.html#usereducer)
  - [`useCallback`](/docs/hooks-reference.html#usecallback)
  - [`useMemo`](/docs/hooks-reference.html#usememo)
  - [`useRef`](/docs/hooks-reference.html#useref)
  - [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)
  - [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect)
  - [`useDebugValue`](/docs/hooks-reference.html#usedebugvalue)
  - [`useDeferredValue`](/docs/hooks-reference.html#usedeferredvalue)
  - [`useTransition`](/docs/hooks-reference.html#usetransition)
  - [`useId`](/docs/hooks-reference.html#useid)
- [Library Hooks](/docs/hooks-reference.html#library-hooks)
  - [`useSyncExternalStore`](/docs/hooks-reference.html#usesyncexternalstore)
  - [`useInsertionEffect`](/docs/hooks-reference.html#useinsertioneffect)

* * *

## مرجع {#reference}

### `React.Component` {#reactcomponent}

إنّ `React.Component` هو عبارة عن الصنف الأساسي لمكوّنات React عند تعريفها باستخدام أصناف [ES6 classes](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes):

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

ألق نظرة على [مرجع React.Component API](/docs/react-component.html) للحصول على قائمة بالتوابع والخاصيّات المرتبطة بالصنف `React.Component` الأساسي.

* * *

### `React.PureComponent` {#reactpurecomponent}

يُشبه `React.PureComponent` الصنف [`React.Component`](#reactcomponent). الفرق بينهما هو عدم اعتماد الصنف [`React.Component`](#reactcomponent) للتابع [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) بينما يعتمده `React.PureComponent` مع مقارنة ضئيلة بين الخاصيّات والحالة.

إن كان تابع التصيير `render()‎` للمكوّن يُصيّر نفس النتيجة عند إعطاء نفس الخاصيّات والحالة فتستطيع استخدام `React.PureComponent` لتحسين الأداء في بعض الحالات.

>ملاحظة
>
>يُقارِن التابع `shouldComponentUpdate()`‎ الخاص بالصنف `React.PureComponent` مقارنة ضئيلة فقط بين الكائنات، فإن كانت تحتوي على بنى معطيات معقدة فقد يُنتِج سلبيات كاذبة للمقارنات الأعمق. يجب الامتداد إلى الصنف `PureComponent` فقط عندما تتوقع امتلاك حالة وخاصيّات بسيطة، أو استخدم التابع
[`forceUpdate()`](/docs/react-component.html#forceupdate)عندما تعلم بتغيّر بنى المعطيات العميقة، أو انظر في استخدام [الكائنات غير القابلة](https://facebook.github.io/immutable-js/) للتعديل لتسهيل المقارنات السريعة بين البيانات المتداخلة.
>
>يتخطى التابع `React.PureComponent` `shouldComponentUpdate()`‎ أيضًا تحديث الخاصيّات لكامل الشجرة الفرعية للمكوّن، احرص على أن تكون المكوّنات الأبناء له أيضًا نقيّة.


* * *

### `React.memo` {#reactmemo}

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* props صيّر باستعمال */
});
```

إنَّ `React.memo` هو [مكون ذو ترتيب أعلى](/docs/higher-order-components.html).

إن صَير مكون الدالة الخاص بك نفس النتيجة بعد إعطاء نفس الخاصيات، يمكنك حينئذٍ تغليفه في استدعاء لـ `React.memo` من أجل تسريع الأداء في بعض الحالات عبر تذكر النتيجة. هذا يعني أنَّ React ستتخطى عملية تصيير المكون وتعيد استعمال آخر نتيجة جرى تصييرها.

`React.memo` تأثر فقط على تغيرات الخصائص. إذا كان مكون الدالة الخاص بك مغلفا بـ `React.memo` ويحتوي على [`useState`](/docs/hooks-state.html) أو [`useContext`](/docs/hooks-reference.html#usecontext) Hook في تنفيذه، سيتم اعادة تصيره عند تغير الحالة أو السياق.

افتراضيًّا، ستُجرَى عملية موازنة سطحية فقط بين الكائنات المعقدة في خصائص الكائنات. إن أردت التحكم بعملية الموازنة، يمكنك آنذاك توفير دالة موازنة مخصصة بصفتها وسيطًا ثانيًا.

```javascript
function MyComponent(props) {
  /* props صيّر باستعمال */
}
function areEqual(prevProps, nextProps) {
  /*
    سيعيد render إلى nextProps إن كان تمرير true سيعيد القيمة
   false وإلا سيعيد القيمة ،render إلى prevProps نفس النتيجة إذا مُرِّرت 
  */
}
export default React.memo(MyComponent, areEqual);
```

الغرض من خلق هذا التابع هو **[لتحسين الأداء](/docs/optimizing-performance.html).** لا تعتمد عليه لمنع عملية التصيير، إذ سيؤدي ذلك إلى حصول أخطاء.


>ملاحظة
>
>خلافًا للتابع [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) في مكونات الأصناف، تعيد الدالة` `areEqual القيمة `true` إن كانت الخاصيات (props) متساوية والقيمة `false` إن كانت الخاصيات غير متساوية. هذه هي حالة معاكسة للدالة `shouldComponentUpdate`.


* * *

### `createElement()` {#createelement}

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

يُنشِئ ويُعيد [عنصر React]() جديد من النوع المُعطى. يُمكِن للوسيط type أن يكون إمّا سلسلة نصيّة لاسم العنصر (مثل `‎'div'‎` أو `‎'span'`‎)، أو نوعًا [لمكوّن React](/docs/components-and-props.html) مثل (صنف أو دالة)، أو نوعًا [لجزء React](#reactfragment) (أي fragment).

تُحوَّل الشيفرة المكتوبة باستخدام [JSX](/docs/introducing-jsx.html) إلى استدعاءات للتابع `React.createElement()`‎. لن تستدعي هذا التابع بشكل مباشر عادةً إن كنت تستخدم JSX. ألق نظرة على استخدام [React دون JSX](/docs/react-without-jsx.html) لتعلم المزيد.

* * *

### `cloneElement()` {#cloneelement}

```
React.cloneElement(
  element,
  [config],
  [...children]
)
```

ينسخ ويُعيد عنصر React جديد باستخدام الوسيط `element` كنقطة بداية. يمتلك العنصر الناتج نفس خاصيّات العنصر الأصلي مع دمج الخاصيّات الجديد. سيحل العناصر الأبناء المُقدمون عبر الوسيط children محل العناصر الأبناء الحاليين. سيُحتفَظ بالمفتاح `key` والمرجع `ref` من العنصر الأصلي. يُكافِئ التابع `React.cloneElement()`‎ كتابة ما يلي:

```js
<element.type {...element.props} {...props}>{children}</element.type>
```
ولكن يُحافِظ استخدام التابع على المرجع `ref` أيضًا. يعني هذا أنّه لو كان لديك عنصر ابن مع مرجع `ref` ضمنه، فلن تأخذه عن طريق الخطأ من العنصر السليف له، بل ستحصل على نفس المرجع مُرفقًا بعنصرك الجديد.

قُدِّمت هذه الواجهة (ِAPI) بديلا للتابع `React.addons.cloneWithProps()`‎ المُهمَل.

* * *

### `createFactory()` {#createfactory}

```javascript
React.createFactory(type)
```

يُعيد دالة تُنتِج عناصر React من النوع المُعطى. وكما هو الحال مع التابع [`React.createElement()`](#createelement)‎ يُمكِن للوسيط type أن يكون إمّا سلسلة نصيّة لاسم العنصر (مثل ‎`'div'‎` أو `‎'span'`‎)، أو نوعًا [لمكوّن React](/docs/components-and-props.html) (مثل صنف أو دالة)، أو نوعًا [لجزء React](#reactfragment) (أي fragment).

يُعتبَر هذا التابع قديمًا في React ونوصي باستخدام JSX أو التابع `React.createElement()`‎ بشكل مباشر بدلًا من ذلك.

لن تستدعي `React.createFactory()` بشكل مباشر إن كنت تستخدم JSX. ألق نظرة على استخدام [React بدون JSX](/docs/react-without-jsx.html) لتعلّم المزيد.


* * *

### `isValidElement()` {#isvalidelement}

```javascript
React.isValidElement(object)
```

يتحقّق من أنّ الكائن هو عنصر React. يُعيد القيمة `true` أو `false`.


* * *

### `React.Children` {#reactchildren}

يُزوّدنا `React.Children` بأدوات مساعدة للتعامل مع بنية المعلومات `this.props.children`.


#### `React.Children.map` {#reactchildrenmap}

```javascript
React.Children.map(children, function[(thisArg)])
```

يستدعي دالة لكل عنصر ابن مباشر موجود ضمن `children` مع تعيين `this` إلى قيمة `thisArg`. إن كان `children` مصفوفة فسوف تُمرَّر الدالة للأبناء في كل المصفوفة. إن كانت قيمة children هي `null` أو `undefined` فسيُعيد `null` أو `undefined` بدلًا من المصفوفة.

>ملاحظة
>
>إذا كان `children` هو `Fragment` سيتم التعامل معه بصفته ابنًا وحيدًا وليس متعديًا


#### `React.Children.forEach` {#reactchildrenforeach}

```javascript
React.Children.forEach(children, function[(thisArg)])
```

مماثل للتابع [`React.Children.map()`](#reactchildrenmap)‎ ولكن لا يُعيد مصفوفة.


#### `React.Children.count` {#reactchildrencount}

```javascript
React.Children.count(children)
```

يُعيد العدد الكلي للمكوّنات الموجود ضمن `children`، مُكافئ لعدد المرات التي يُمرَّر فيها رد النداء إلى `map` أو التي يُستدعى فيها `forEach`.


#### `React.Children.only` {#reactchildrenonly}

```javascript
React.Children.only(children)
```

يتحقّق من أنّ `children` يمتلك فقط ابنًا واحدًا (عنصر React) ويُعيده. فيما عدا ذلك سيرمي هذا التابع خطأً.

>ملاحظة:
>
>لا يقبل التابع `React.Children.only()‎` القيمة المُعادة من [`React.Children.map()`](#reactchildrenmap)‎ لأنّها مصفوفة وليست عنصر React.


#### `React.Children.toArray` {#reactchildrentoarray}

```javascript
React.Children.toArray(children)
```

يُعيد بنية البيانات `children` في مصفوفة مع تعيين مفتاح لكل عنصر ابن. يكون مفيدًا إن أردت التعامل مع مجموعة من العناصر الأبناء في توابع التصيير لديك، خاصّة إن أردت إعادة ترتيب أو تجزئة `this.props.children` قبل تمريره.

>ملاحظة:
>
>يُغيّر التابع `React.Children.toArray()‎` المفاتيح ليُحافظ على دلالات المصفوفات `toArray` المتداخلة عند تبسيط قائمة من العناصر الأبناء. حيث يضع كل مفتاح قبل العنصر في المصفوفة المُعادة بحيث يكون المجال لمفتاح كل عنصر هو مصفوفة الدخل التي تحتويه.


* * *

### `React.Fragment` {#reactfragment}

يُتيح لك مكوّن الأجزاء `React.Fragment` أن تُعيد عناصر متعددة في التابع `render()‎` دون إنشاء عناصر DOM إضافيّة:


```javascript
render() {
  return (
    <React.Fragment>
      نص ما.
      <h2> ترويسة </h2>
    </React.Fragment>
  );
}
```

تستطيع أيضًا استخدامه عن طريق الصياغة المختصرة `‎<></>`‎. للمزيد من المعلومات ألق نظرة على [React v16.2.0: تحسين الدعم للأجزاء في إصدار](/blog/2017/11/28/react-v16.2.0-fragment-support.html).


### `React.createRef` {#reactcreateref}

يُنشِئ `React.createRef` مرجعًا [ref](/docs/refs-and-the-dom.html) والذي يُمكِن إرفاقه لعناصر React عبر الخاصيّة ref:
`embed:16-3-release-blog-post/create-ref-example.js`


### `React.forwardRef` {#reactforwardref}

يُنشِئ `React.forwardRef` مكوّن React يُمرِّر خاصيّة المرجع [ref](/docs/refs-and-the-dom.html) التي يستقبلها إلى مكوّن آخر أدنى منه في الشجرة. هذه التقنية ليست شائعة كثيرًا ولكنّها مفيدة بشكل خاص في حالتين:


* [تمرير المراجع إلى مكوّنات  DOM .](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
* [تمرير المراجع في المكوّنات ذات الترتيب الأعلى.](/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)


تقبل `React.forwardRef` دالة تصيير وسيطًا لها. ستستدعي React هذه الدالة مع الخاصيّات `props` والمرجع `ref` وسيطين لها. يجب أن تُعيد هذه الدالة عقدة React:

`embed:reference-react-forward-ref.js`

في المثال السابق تُمرِّر React مرجعًا `ref` إلى العنصر `‎<FancyButton ref={ref}>`‎ وسيطًا ثانيًا لدالة التصيير بداخل الاستدعاء `React.forwardRef`. تُمرِّر دالة التصيير هذه المرجع `ref` إلى العنصر ‎`<button ref={ref}>‎`.

نتيجة لذلك بعد إرفاق React للمرجع، سيُشير `ref.current` بشكلٍ مباشر إلى نسخة العنصر `‎<button>‎`.

للمزيد من المعلومات ألق نظرة على [`تمرير المراجع`](/docs/forwarding-refs.html) في توثيق React.


### `React.lazy` {#reactlazy}

تمكنك الدالة `()React.lazy` من تعريف مكون يُحَـمََّل ديناميكيًّا. هذا يساعد في تقليل حجم الحزمة (bundle size) لتأخير تحميل المكونات التي لا تُستعمَل أثناء أول عملية تصيير.

يمكنك تعلم كيفية استعمالها من [توثيق تقسيم الشيفرة](/docs/code-splitting.html#reactlazy). يمكنك أيضًا الاطلاع على [هذه المقالة](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d) التي توضح كيفية استعمالها بتفصيل أوسع.


```js
// يحمَّل هذا المكون ديناميكيًّا
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

يجب الانتباه إلى أن تحميل المكونات `lazy` (الكسولة) يتطلب وجود مكون من النوع `<React.Suspense>` في مستوى أعلى من شجرة التصيير. هذه هي كيفية تحديد مؤشر تحميل.

<<<<<<< HEAD

> **ملاحظة:**
>
> يتطلب استعمال `React.lazy` مع استيراد ديناميكي توافر وعود في البيئة JS. ذلك يتطلب دعمًا للإصدار IE11 وما قبله.


### `React.Suspense` {#reactsuspense}

يمكِّنك `React.Suspense` من تحديد مؤشر التحميل في حال كان هنالك بعض المكونات التي تقع أسفل منه في الشجرة غير جاهزة للتصيير بعد. اليوم، المكونات ذات التحميل الكسول (lazy loading components) هي حالة الاستعمال **الوحيدة** المدعومة عبر `<React.Suspense>`:
=======
### `React.Suspense` {#reactsuspense}

`React.Suspense` lets you specify the loading indicator in case some components in the tree below it are not yet ready to render. In the future we plan to let `Suspense` handle more scenarios such as data fetching. You can read about this in [our roadmap](/blog/2018/11/27/react-16-roadmap.html).

Today, lazy loading components is the **only** use case supported by `<React.Suspense>`:
>>>>>>> 8223159395aae806f8602de35e6527d35260acfb

```js
// This component is loaded dynamically
// يحمَّل هذا المكون ديناميكيًّا
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // Displays <Spinner> until OtherComponent loads
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

جرى توثيقه في [صفحة تقسيم الشيفرة](/docs/code-splitting.html#reactlazy). انتبه إلى أنَّ المكونات `lazy` (الكسولة) يمكن أن توضع بداخل الشجرة `Suspense` بعمق، إذ لا تحتاج إلى تغليف كل واحدة منها. أفضل سلوك هو وضع `<Suspense>` حيث أردت رؤية مؤشر تحميل، ولكن استعمال `()lazy` حيثما أردت القيام بتقسيم الشيفرة.

<<<<<<< HEAD
طالما أن ذلك غير مدعوم حتى الآن، نخطط في المستقبل أن نجعل `Suspense` يعالج حالات أوسع مثل جلب بيانات. يمكنك قراءة المزيد في هذه [التدوينة](/blog/2018/11/27/react-16-roadmap.html).

>ملاحظة:
>
> إن `()React.lazy` و `<React.Suspense>` غير مدعومين بعد عبر `ReactDOMServer`. سيتم حل هذا القيد في المستقبل.
=======
> Note
>
> For content that is already shown to the user, switching back to a loading indicator can be disorienting. It is sometimes better to show the "old" UI while the new UI is being prepared. To do this, you can use the new transition APIs [`startTransition`](#starttransition) and [`useTransition`](/docs/hooks-reference.html#usetransition) to mark updates as transitions and avoid unexpected fallbacks.

#### `React.Suspense` in Server Side Rendering {#reactsuspense-in-server-side-rendering}
During server side rendering Suspense Boundaries allow you to flush your application in smaller chunks by suspending.
When a component suspends we schedule a low priority task to render the closest Suspense boundary's fallback. If the component unsuspends before we flush the fallback then we send down the actual content and throw away the fallback.

#### `React.Suspense` during hydration {#reactsuspense-during-hydration}
Suspense boundaries depend on their parent boundaries being hydrated before they can hydrate, but they can hydrate independently from sibling boundaries. Events on a boundary before its hydrated will cause the boundary to hydrate at
a higher priority than neighboring boundaries. [Read more](https://github.com/reactwg/react-18/discussions/130)

### `React.startTransition` {#starttransition}

```js
React.startTransition(callback)
```
`React.startTransition` lets you mark updates inside the provided callback as transitions. This method is designed to be used when [`React.useTransition`](/docs/hooks-reference.html#usetransition) is not available.

> Note:
>
> Updates in a transition yield to more urgent updates such as clicks.
>
> Updates in a transition will not show a fallback for re-suspended content, allowing the user to continue interacting while rendering the update.
>
> `React.startTransition` does not provide an `isPending` flag. To track the pending status of a transition see [`React.useTransition`](/docs/hooks-reference.html#usetransition).
>>>>>>> 8223159395aae806f8602de35e6527d35260acfb
