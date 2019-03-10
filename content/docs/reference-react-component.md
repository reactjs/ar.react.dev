---
id: react-component
title: React.Component
layout: docs
category: Reference
permalink: docs/react-component.html
redirect_from:
  - "docs/component-api.html"
  - "docs/component-specs.html"
  - "docs/component-specs-ko-KR.html"
  - "docs/component-specs-zh-CN.html"
  - "tips/UNSAFE_componentWillReceiveProps-not-triggered-after-mounting.html"
  - "tips/dom-event-listeners.html"
  - "tips/initial-ajax.html"
  - "tips/use-react-with-other-libraries.html"
---

تحتوي هذه الصفحة على مرجع مُفصَّل لواجهة برمجة التطبيقات (API) لتعريف صنف مكوّن React. سنفترض أنك على معرفة بمفاهيم React الأساسية، مثل [الخاصيّات props والمكوّنات](/docs/components-and-props.html)، بالإضافة إلى  [الحالة ودورة حياة المكوّنات](/docs/state-and-lifecycle.html). إن لم تكن كذلك فاطلع عليها أولًا.

## لمحة عامة {#overview}

تُتيح لك React أن تُعرِّف المكوّنات كأصناف أو دوال. تُزوّدنا المكوّنات المُعرَّفة كأصناف بميزات أكثر حاليًّا والتي سنشرحها بالتفصيل هنا. لتعريف صنف مكوّن React تحتاج إلى أن تمتد إلى الصنف `React.Component`:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

التابع الوحيد الذي *يجب*  عليك تعريفه في الصنف الفرعي الناتج عن الصنف  `React.Component` هو [`render()`](#render)، أمّا بقية التوابع المذكورة في هذه الصفحة هي اختياريّة.

**نوصي بشدّة ألّا تُنشِئ أصنافًا أساسيّة للمكوّنات خاصّة بك.** ففي مكوّنات React تتحقّق , [إعادة استخدام الشيفرة بشكل أساسي عبر التركيب (composition) بدلًا من الوراثة (inheritance)](/docs/composition-vs-inheritance.html).

>ملاحظة:
>
>لا تُجبِرك React على استخدام صياغة أصناف ES6. إن كنت تفضّل تجنّب ذلك فبإمكانك استخدام الوحدة `create-react-class` أو أي تجريد مُخصَّص مماثل بدلًا من ذلك. انظر إلى [استخدام React بدون ES6](/docs/react-without-es6.html) لتعلّم المزيد.

### دورة حياة المكوّن {#the-component-lifecycle}

يمتلك كل مكوّن توابع دورة حياة متعدّدة والتي تستطيع تجاوزها لتنفيذ الشيفرة في أوقات مُحدَّدة.  **تستطيع استخدام  [مُخطّط دورة حياة المكوّنات هذا](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)** في القائمة التالية سنكتب أسماء توابع دورة الحياة الشائعة بالخط العريض. أما البقية فهي موجودة لحالات الاستخدام النادرة نسبيًّا.

#### الوصل (mounting) {#mounting}

تُستدعى هذه التوابع بالترتيب التالي عند إنشاء نسخة من المكوّن وإدخالها إلى DOM:

- [**`constructor()`**](#constructor)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [**`render()`**](#render)
- [**`componentDidMount()`**](#componentdidmount)

>Note:
>
>ملاحظة: يُعتبر هذا التابع قديمًا ويجب أن [تتجنّب](/blog/2018/03/27/update-on-async-rendering.html) استخدامه في الشيفرة الجديدة:
>
>- [`UNSAFE_componentWillMount()`](#unsafe_componentwillmount)

#### التحديث {#updating}

يُمكِن أن يحصل التحديث عن طريق التغييرات في الخاصيّات أو الحالة. تُستدعى هذه التوابع بالترتيب التالي عند إعادة تصيير المكوّن:

- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [**`render()`**](#render)
- [`getSnapshotBeforeUpdate()`](#getsnapshotbeforeupdate)
- [**`componentDidUpdate()`**](#componentdidupdate)

>Note:
>
>ملاحظة: يُعتبر هذا التابع قديمًا ويجب أن [تتجنّب](/blog/2018/03/27/update-on-async-rendering.html) استخدامه في الشيفرة الجديدة:
>
>- [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
>- [`UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)

#### الفصل (unmounting) {#unmounting}

يُستدعى هذا التابع عند إزالة المكون من DOM:

- [**`componentWillUnmount()`**](#componentwillunmount)

#### معالجة الأخطاء {#error-handling}

يُستدعى هذا التابع عند وجود خطأ أثناء التصيير، أو في تابع دورة حياة المكوّن، أو في الدالة البانية لأي من المكوّنات الأبناء.

- [`static getDerivedStateFromError()`](#static-getderivedstatefromerror)
- [`componentDidCatch()`](#componentdidcatch)

### واجهات برمجة التطبيق الأخرى {#other-apis}

يُعطينا كل مكوّن بواجهات برمجة تطبيق أخرى:

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### خاصيّات الصنف {#class-properties}

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### خاصيّات النسخة (Instance) {#instance-properties}

  - [`props`](#props)
  - [`state`](#state)

* * *

## مرجع {#reference}

### توابع دورة الحياة شائعة الاستخدام {#commonly-used-lifecycle-methods}

تُغطّي التوابع في هذا القسم معظم حالات الاستخدام التي ستصادفها أثناء إنشاء مكوّنات React. **للحصول على مرجع لمخطط بصري انظر إلى [مخطط دورة حياة المكوّنات](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/).**

### `render()` {#render}

```javascript
render()
```

التابع  `render()` هو التابع الوحيد المطلوب وجوده في مكوّنات الأصناف.

عند استدعائه, يجب أن يفحص `this.props` و `this.state` ويُعيد إحدى الأنواع التالية:

- **React عناصر .**  تُنشَأ عادةً عن طريق [JSX](/docs/introducing-jsx.html). على سبيل المثال, `<div />` و `<MyComponent />` هي عناصر React والتي تأمر React بتصيير عقدة DOM ومكوّن مُعرَّف من قبل المستخدم على التوالي وبالترتيب.
- **الأجزاء والمصفوفات:** تسمح لك بإعادة عناصر متعددة من التابع انظر إلى توثيق [الأجزاء](/docs/fragments.html) للمزيد من التفاصيل.
- **المداخل (Portals):**. تسمح لك بتصيير العناصر الأبناء إلى تفرعات مختلفة من DOM. انظر إلى توثيق [portals](/docs/portals.html) للمزيد من التفاصيل.
- **الأعداد والسلاسل النصيّة:** تُصيَّر كعقد نصيّة في DOM.
- **القيم المنطقية (Booleans) أو `null`:**. لا تُصيِّر شيئًا.  (موجودة في معظم الأحيان لدعم النمط `return test && <Child />` pattern, حيث يكون `test` هو قيمة منطقيّة.)

يجب أن يكون التابع `render()` نقيًّا, أي لا يُعدِّل حالة المكوّن، ويعيد نفس النتيجة في كل مرة يُستدعى فيها، ولا يتفاعل بشكل مباشر مع المتصفح.

إن أردت التفاعل مع المتصفح فأنجز العمل المطلوب ضمن التابع  `componentDidMount()` أو أي تابع من توابع دورة الحياة. إنّ الحفاظ على التابع `render()` نقيًّا يزيد سهولة التفكير بمكوّناتك.

> ملاحظة
>
>  لن يُستدعى التابع `render()` إن أعاد التابع [`shouldComponentUpdate()`](#shouldcomponentupdate) القيمة false.

* * *

### `constructor()` {#constructor}

```javascript
constructor(props)
```

**إن لم تضع قيمة بدئية للحالة ولم تربط التوابع، فلن تحتاج إلى إضافة دالة بانية إلى مكوناتك.**

تُستدعى الدالة البانية لمكوّن React قبل الوصل. عند إضافة الدالة البانية لصنف فرعي عن الصنف `React.Component` فيجب أن تستدعي `super(props)`  قبل أي جملة أخرى وإلّا ستكون `this.props` غير معرفة في الدالة البانية والذي قد يؤدي إلى أخطاء.

تستخدم الدوال البانية في React فقط لغرضين عادةً:

* تهيئة [الحالة المحلية](/docs/state-and-lifecycle.html) عن طريق تعيين كائن إلى `this.state`.
* ربط توابع [معالج الأحداث](/docs/handling-events.html) إلى النسخة (instance).

**يجب ألّا تستدعي `()setState`**  في الدالة البانية، وإن كان مكوّنك يحتاج استخدام الحالة المحليّة فعيّن الحالة المبدئية إلى `this.state` مباشرة في الدالة البانية:

```js
constructor(props) {
  super(props);
  // هنا this.setState() لا تستدعي
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```

الدالة البانية هي المكان الوحيد الذي يجب أن تّعين فيه `this.state` بشكل مباشر، ففي جميع التوابع الأخرى يجب استخدام `this.setState()` بدلًا من ذلك..

تجنّب تقديم أي تأثيرات جانبية أو اشتراكات في الدالة البانية، ولتلك الحالات استخدم التابع`componentDidMount()`.

>ملاحظة
>
>**تجنّب نسخ الخاصيّات إلى الحالة، فهذا خطأ شائع:**
>
>```js
>constructor(props) {
>  super(props);
>  // Don't do this!
>  this.state = { color: props.color };
>}
>```
>
>المشكلة هي أنّ هذا غير ضروري (حيث تستطيع استخدام `this.props.color` بشكل مباشر), ويُعطي أخطاء (لن تنعكس التحديثات على الخاصيّة `color` في الحالة).
>
>**استخدم هذا النمط إن كنت تريد عن قصد تجاهل تحديثات الخاصيّات.** في تلك الحالة من المنطقي إعادة تسمية الخاصيّة إلى `initialColor` أو `defaultColor`. إمكانك بعدها إجبار المكوّن على "إعادة تعيين" حالته الداخلية عن طريق [تغيير `المفتاح`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) عند الضرورة.
>
>اقرأ [هذا المنشور حول تجنب الحالات المشتقة](/blog/2018/06/07/you-probably-dont-need-derived-state.html) لتتعلم ما يجب فعله إن أردت أن تعتمد الحالة على الخاصيّات.


* * *

### `componentDidMount()` {#componentdidmount}

```javascript
componentDidMount()
```

يُستدعى  `componentDidMount()` مباشرة بعد وصل المكوّن (إدخاله ضمن الشجرة). يجب أن نضع هنا التهيئة التي تتطلّب عقدة DOM. إن احتجت إلى تحميل بيانات من نقطة بعيدة فهذا التابع مكان جيد لبدء طلبات الشبكة.

يُعد هذا التابع أيضًا مكانًا جيّدًا لإعداد أي اشتراكات. إن فعلت ذلك فلا تنسَ إزالة الاشتراك في التابع `componentWillUnmount()`.

بإمكانك **استدعاء  `setState()` مباشرة في التابع** `componentDidMount()`. . سيُطلِق تصييرًا إضافيًّا ولكن سيحدث ذلك قبل أن يُحدِّث المتصفح الشاشة. يضمن ذلك عدم رؤية المستخدم للحالة مباشرة على الرغم من استدعاء التابع  `render()` مرتين. استخدم هذا النمط بحذر لأنّه يسبب غالبًا مشاكل بالأداء. يجب في معظم الحالات أن تُعيّن الحالة المبدئية في الدالة البانية بدلًا من ذلك. ولكن قد يكون ذلك ضروريًّا لحالات مثل تلميحات الأدوات (tooltips) عندما تحتاج إلى تقدير عقدة DOM قبل تصيير شيء يعتمد على حجمه أو موقعه.

* * *

### `componentDidUpdate()` {#componentdidupdate}

```javascript
componentDidUpdate(prevProps, prevState, snapshot)
```

يُستدعى التابع  `componentDidUpdate()` i مباشرة بعد حصول التحديث. لا يُستدعى هذا التابع من أجل التصيير المبدئي.

استخدم هذا التابع كفرصة للعمل على DOM عند تحديث المكوّن. يُعد هذا التابع مكانًا جيّدًا لإتمام طلبات الشبكة طالما تُقارِن الخاصيّات الحالية مع الخاصيّات السابقة (أي قد يكون طلب الشبكة غير ضروريّ إن لم تتغير الخاصيّات):

```js
componentDidUpdate(prevProps) {
  // استخدام نموذجي (لا تنس مقارنة الخاصيات)
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

بإمكانك  **استدعاء `()setState`  مباشرة في التابع** `componentDidUpdate()` ولكن انتبه أنّه **أنّه يجب تغليفه ضمن شرط** مثل المثال السابق وإلّا ستسبب حدوث حلقة لا نهائيّة وإعادة تصيير إضافيّة والتي رغم عدم وضوحها للمستخدم إلاّ أنّها تؤثّر على أداء المكوّن. إن كنت تحاول أن تعكس الحالة إلى الخاصيّة الآتية من الأعلى فيجب أن تستخدم الخاصيّة بشكل مباشر. اقرأ المزيد في تدوينة [لماذا يُسبب نسخ الخاصيّات إلى الحالة أخطاء](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

إن كان يعتمد مكوّنك تابع `getSnapshotBeforeUpdate()` دورة الحياة  (وهو أمرٌ نادر), فستُمرَّر القيمة التي يُعيدها كُمعامل ثالث إلى التابع `componentDidUpdate()`. فيما عدا ذلك يكون هذا المُعامِل غير مُعرَّفًا.

> ملاحظة
>
>  لن يُستدعى التابع `componentDidUpdate()`  إن أعاد التابع [`shouldComponentUpdate()`](#shouldcomponentupdate) القيمة  false.

* * *

### `componentWillUnmount()` {#componentwillunmount}

```javascript
componentWillUnmount()
```

يُستدعى التابع  `componentWillUnmount()` مباشرةً قبل فصل المكوّن وتدميره. نفّذ أي مسح ضروري في هذا التابع، مثل تعطيل العدادات، وإلغاء طلبات الشبكة، ومسح أي اشتراكات أنشأها التابع `componentDidMount()`.

**لا يجب أن تستدعي التابع `setState()`**  في التابع `componentWillUnmount()` لأنّ المكوّن لن يُعاد تصييره. حالما تُفصَل نسخة المكوّن فلن تُوصل مرة أخرى.

* * *

### توابع دورة الحياة نادرة الاستخدام {#rarely-used-lifecycle-methods}

تستخدم التوابع المذكورة في هذا القسم في حالات نادرة، وهي مفيدة من حين لآخر، ولكن لن تحتاجها معظم مكوّناتك.**تستطيع أن ترى معظم هذه التوابع في [مخطط توابع دورة حياة المكوّنات](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) إن ضغطت على مربع التأشير "Show less common lifecycles" الموجود في الأعلى.**


### `shouldComponentUpdate()` {#shouldcomponentupdate}

```javascript
shouldComponentUpdate(nextProps, nextState)
```

استخدم التابع `shouldComponentUpdate()` لتُعلِم React إن كان ناتج المكوّن لا يتأثر بالتغيير الحالي للخاصيّات أو الحالة. السلوك الافتراضي هو إعادة التصيير عند كل تغيير للحالة، وفي معظم الحالات ستعتمد على هذا السلوك.

يُستدعى التابع  `shouldComponentUpdate()`  قبل التصيير عند استقبال الخاصيّات أو الحالة. القيمة الافتراضية هي `true`.  لا يُستدعى هذا التابع للتصيير المبدئي أو عند استخدام التابع `forceUpdate()`.

يتواجد هذا التابع **[كتحسين للأداء](/docs/optimizing-performance.html).** لا تعتمد عليه لمنع التصيير, حيث يقود ذلك إلى أخطاء. انظر في استخدام الصنف [`PureComponent`](/docs/react-api.html#reactpurecomponent) المُضمَّن بدلًا من كتابة التابع `shouldComponentUpdate()` بشكلٍ يدوي.يُنفِّذ الصنف  `PureComponent` مقارنة ضئيلة للخاصيّات والحالة ويُقلِّل فرصة تجاوز تحديث ضروري.

إن كنت متأكدًا من أنّك تريد كتابته بشكل يدوي فيجب أن تقارن `this.props` مع `nextProps` و `this.state` مع `nextState` وتُعيد القيمة `false` لتخبر React بإمكانية تجاوز التحديث. انتبه إلى أنّ إعادة القيمة `false`  لا تمنع المكوّنات الأبناء من إعادة التصيير عند تغيير حالتها.

لا نوصي بإجراء اختبارات مفصلة للتساوي أو استخدام التابع  `JSON.stringify()` ضمن `shouldComponentUpdate()`. فهذا غير فعال وسيؤثر على الأداء بشكل كبير.

حاليًّا إن أعاد التابع `shouldComponentUpdate()` القيمة `false`,  فلن تُستدعى التوابع [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate), [`render()`](#render), و [`componentDidUpdate()`](#componentdidupdate).  في المستقبل قد تُعامل React التابع `shouldComponentUpdate()` كتلميح بدلًا من توجيه صارم، وقد تؤدي إعادة القيمة `false` لى إعادة تصيير المكوّن.

* * *

### `static getDerivedStateFromProps()` {#static-getderivedstatefromprops}

```js
static getDerivedStateFromProps(props, state)
```

يُستدعى التابع `getDerivedStateFromProps` مباشرةً قبل استدعاء تابع التصيير خلال الوصل المبدئي والتحديثات اللاحقة. يجب أن يُعيد كائنًا لتحديث الحالة، أو `null` لعدم تحديث شيء.

يوجد هذا التابع من أجل  [استخدامات نادرة](/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) ندما تعتمد الحالة على التغييرات في الخاصيّات مع مرور الوقت. على سبيل المثال قد يكون من المفيد تنفيذ المكوّن `<Transition>` والذي يقارن بين الأبناء السابقين واللاحقين ليقرر ما ينبغي تحريكه منها للداخل وللخارج.

يؤدي اشتقاق الحالة إلى تعقيد الشيفرة وصعوبة التفكير بمكوّناتك.  
[احرص على أن تكون على اطلاع على البدائل البسيطة له:](/blog/2018/06/07/you-probably-dont-need-derived-state.html)

* إن أردت إنجاز **تأثير جانبي (side effect)** (مثل الحصول على البيانات أو التحريك) (مثل الحصول على البيانات أو التحريك) استجابةً للتغيّر في الخاصيّات، فاستخدم تابع دورة الحياة [`componentDidUpdate`](#componentdidupdate).

* إن أردت **ردت إعادة حساب بعض البيانات فقط عند تغيير الخاصيّات**, [فاستخدم مساعد التذكير](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization) بدلًا من ذلك.

* إن أردت **أردت إعادة تعيين حالة ما عند تغيّر الخاصيّة**, فانظر في إمكانية جعل المكوّن [مضبوطًا بشكل كامل](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component)أو [غير مضبوط مع استخدام المفاتيح](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).

لا يمتلك هذا التابع الوصول إلى نسخة المكوّن. إن أردت فبإمكانك إعادة استخدام بعض الشيفرة بين  `getDerivedStateFromProps()` و توابع أخرى للصنف عن طريق استخراج الدوال النقية لخاصيّات وحالة المكوّن خارج تعريف الصنف.

انتبه إلى إطلاق هذا التابع عند كل تصيير بغض النظر عن السبب، وهذا على عكس `UNSAFE_componentWillReceiveProps`, والذي يُطلَق فقط عندما يُسبِّب المكوّن الأب إعادة التصيير وليس كنتيجة عن التابع `setState` المحلّي.

* * *

### `getSnapshotBeforeUpdate()` {#getsnapshotbeforeupdate}

```javascript
getSnapshotBeforeUpdate(prevProps, prevState)
```

يُستدعى التابع `getSnapshotBeforeUpdate()`‎ مباشرة قبل تطبيق الناتج الأخير المُصَّير إلى DOM. يُمكّننا من التقاط بعض المعلومات من DOM (مثل موضع النزول في الصفحة scroll) قبل أن تتغيّر. تُمرَّر أي قيمة مُعادة من هذا التابع كمعامل إلى `componentDidUpdate()`‎.
حالة الاستخدام هذه ليست شائعة، ولكن قد تحدث في واجهات مستخدم مثل محادثة في تطبيق للدردشة يحتاج للتعامل مع موضع النزول في الصفحة بطريقة معينة.

يجب إعادة قيمة snapshot (أو `null`).

على سبيل المثال:

`embed:react-component-reference/get-snapshot-before-update.js`

من المهم في المثال السابق قراءة الخاصيّة `scrollHeight` في `getSnapshotBeforeUpdate` لأنّه قد توجد تأخيرات بين توابع طور التصيير (مثل التابع render) وتوابع طور التطبيق (مثل `getSnapshotBeforeUpdate` و `componentDidUpdate`).

* * *

### حدود الأخطاء {#error-boundaries}

[حدود الأخطاء](/docs/error-boundaries.html) هي مكوّنات React التي تُمسِك أخطاء JavaScript في أي مكان من شجرة المكوّنات المتفرعة عنها، وتُسجل الأخطاء، وتعرض واجهة مستخدم بديلة عن شجرة المكوّنات التي انهارت. تُمسِك حدود الأخطاء بالأخطاء خلال التصيير، وفي توابع دورة حياة المكوّنات، وفي الدوال البانية لكل شجرة المكوّنات الأدنى منها.

يُصبح مكوّن الصنف حدًّا للأخطاء إن كان يُعرِّف تابع دورة الحياة `componentDidCatch()‎`. يسمح لك استدعاء التابع `setState()`‎ في التقاط أخطاء JavaScript التي لم تعالج في المستوى الأدنى من الشجرة مع عرض واجهة مستخدم بديلة

استخدم حدود الأخطاء فقط من أجل التعافي من الأخطاء غير المتوقعة; **لا تحاول استخدامها للتحكم بتدفق البيانات.**

للمزيد من المعلومات، انظر إلى [*التعامل مع الأخطاء في React 16*](/blog/2017/07/26/error-handling-in-react-16.html).

> ملاحظة
> 
> تُمسِك حدود الأخطاء فقط الأخطاء في المستويات الأدنى منها في شجرة المكوّنات، فلا يستطيع حد الخطأ أن يُمسِك بالأخطاء الحاصلة ضمنه.

### `static getDerivedStateFromError()` {#static-getderivedstatefromerror}
```javascript
static getDerivedStateFromError(error)
```

يُستدعَى تابع دورة الحياة هذا بعد أن يُرمَى الخطأ عبر مكون سليل (descendant component). يستقبل هذا التابع الخطأ الذي رُمِيَ كوسيط ويجب أن يعيد قيمةً لتحديث الحالة.

```js{7-10,13-16}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

> Note
>
> `getDerivedStateFromError()` is called during the "render" phase, so side-effects are not permitted.
For those use cases, use `componentDidCatch()` instead.

* * *

### `componentDidCatch()` {#componentdidcatch}

```javascript
componentDidCatch(error, info)
```

This lifecycle is invoked after an error has been thrown by a descendant component.
It receives two parameters:

1. `error` - The error that was thrown.
2. `info` - An object with a `componentStack` key containing [information about which component threw the error](/docs/error-boundaries.html#component-stack-traces).


`componentDidCatch()` is called during the "commit" phase, so side-effects are permitted.
It should be used for things like logging errors:

```js{12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logComponentStackToMyService(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

> Note
> 
> In the event of an error, you can render a fallback UI with `componentDidCatch()` by calling `setState`, but this will be deprecated in a future release.
> Use `static getDerivedStateFromError()` to handle fallback rendering instead.

* * *

### Legacy Lifecycle Methods {#legacy-lifecycle-methods}

The lifecycle methods below are marked as "legacy". They still work, but we don't recommend using them in the new code. You can learn more about migrating away from legacy lifecycle methods in [this blog post](/blog/2018/03/27/update-on-async-rendering.html).

### `UNSAFE_componentWillMount()` {#unsafe_componentwillmount}

```javascript
UNSAFE_componentWillMount()
```

> Note
>
> This lifecycle was previously named `componentWillMount`. That name will continue to work until version 17. Use the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

`UNSAFE_componentWillMount()` is invoked just before mounting occurs. It is called before `render()`, therefore calling `setState()` synchronously in this method will not trigger an extra rendering. Generally, we recommend using the `constructor()` instead for initializing state.

Avoid introducing any side-effects or subscriptions in this method. For those use cases, use `componentDidMount()` instead.

This is the only lifecycle method called on server rendering.

* * *

### `UNSAFE_componentWillReceiveProps()` {#unsafe_componentwillreceiveprops}

```javascript
UNSAFE_componentWillReceiveProps(nextProps)
```

> Note
>
> This lifecycle was previously named `componentWillReceiveProps`. That name will continue to work until version 17. Use the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

> Note:
>
> Using this lifecycle method often leads to bugs and inconsistencies
>
> * If you need to **perform a side effect** (for example, data fetching or an animation) in response to a change in props, use [`componentDidUpdate`](#componentdidupdate) lifecycle instead.
> * If you used `componentWillReceiveProps` for **re-computing some data only when a prop changes**, [use a memoization helper instead](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
> * If you used `componentWillReceiveProps` to **"reset" some state when a prop changes**, consider either making a component [fully controlled](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) or [fully uncontrolled with a `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) instead.
>
> For other use cases, [follow the recommendations in this blog post about derived state](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

`UNSAFE_componentWillReceiveProps()` is invoked before a mounted component receives new props. If you need to update the state in response to prop changes (for example, to reset it), you may compare `this.props` and `nextProps` and perform state transitions using `this.setState()` in this method.

Note that if a parent component causes your component to re-render, this method will be called even if props have not changed. Make sure to compare the current and next values if you only want to handle changes.

React doesn't call `UNSAFE_componentWillReceiveProps()` with initial props during [mounting](#mounting). It only calls this method if some of component's props may update. Calling `this.setState()` generally doesn't trigger `UNSAFE_componentWillReceiveProps()`.

* * *

### `UNSAFE_componentWillUpdate()` {#unsafe_componentwillupdate}

```javascript
UNSAFE_componentWillUpdate(nextProps, nextState)
```

> Note
>
> This lifecycle was previously named `componentWillUpdate`. That name will continue to work until version 17. Use the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

`UNSAFE_componentWillUpdate()` is invoked just before rendering when new props or state are being received. Use this as an opportunity to perform preparation before an update occurs. This method is not called for the initial render.

Note that you cannot call `this.setState()` here; nor should you do anything else (e.g. dispatch a Redux action) that would trigger an update to a React component before `UNSAFE_componentWillUpdate()` returns.

Typically, this method can be replaced by `componentDidUpdate()`. If you were reading from the DOM in this method (e.g. to save a scroll position), you can move that logic to `getSnapshotBeforeUpdate()`.

> Note
>
> `UNSAFE_componentWillUpdate()` will not be invoked if [`shouldComponentUpdate()`](#shouldcomponentupdate) returns false.

* * *

## Other APIs {#other-apis-1}

Unlike the lifecycle methods above (which React calls for you), the methods below are the methods *you* can call from your components.

There are just two of them: `setState()` and `forceUpdate()`.

### `setState()` {#setstate}

```javascript
setState(updater[, callback])
```

`setState()` enqueues changes to the component state and tells React that this component and its children need to be re-rendered with the updated state. This is the primary method you use to update the user interface in response to event handlers and server responses.

Think of `setState()` as a *request* rather than an immediate command to update the component. For better perceived performance, React may delay it, and then update several components in a single pass. React does not guarantee that the state changes are applied immediately.

`setState()` does not always immediately update the component. It may batch or defer the update until later. This makes reading `this.state` right after calling `setState()` a potential pitfall. Instead, use `componentDidUpdate` or a `setState` callback (`setState(updater, callback)`), either of which are guaranteed to fire after the update has been applied. If you need to set the state based on the previous state, read about the `updater` argument below.

`setState()` will always lead to a re-render unless `shouldComponentUpdate()` returns `false`. If mutable objects are being used and conditional rendering logic cannot be implemented in `shouldComponentUpdate()`, calling `setState()` only when the new state differs from the previous state will avoid unnecessary re-renders.

The first argument is an `updater` function with the signature:

```javascript
(state, props) => stateChange
```

`state` is a reference to the component state at the time the change is being applied. It should not be directly mutated. Instead, changes should be represented by building a new object based on the input from `state` and `props`. For instance, suppose we wanted to increment a value in state by `props.step`:

```javascript
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

Both `state` and `props` received by the updater function are guaranteed to be up-to-date. The output of the updater is shallowly merged with `state`.

The second parameter to `setState()` is an optional callback function that will be executed once `setState` is completed and the component is re-rendered. Generally we recommend using `componentDidUpdate()` for such logic instead.

You may optionally pass an object as the first argument to `setState()` instead of a function:

```javascript
setState(stateChange[, callback])
```

This performs a shallow merge of `stateChange` into the new state, e.g., to adjust a shopping cart item quantity:

```javascript
this.setState({quantity: 2})
```

This form of `setState()` is also asynchronous, and multiple calls during the same cycle may be batched together. For example, if you attempt to increment an item quantity more than once in the same cycle, that will result in the equivalent of:

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

Subsequent calls will override values from previous calls in the same cycle, so the quantity will only be incremented once. If the next state depends on the current state, we recommend using the updater function form, instead:

```js
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

For more detail, see:

* [State and Lifecycle guide](/docs/state-and-lifecycle.html)
* [In depth: When and why are `setState()` calls batched?](https://stackoverflow.com/a/48610973/458193)
* [In depth: Why isn't `this.state` updated immediately?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

By default, when your component's state or props change, your component will re-render. If your `render()` method depends on some other data, you can tell React that the component needs re-rendering by calling `forceUpdate()`.

Calling `forceUpdate()` will cause `render()` to be called on the component, skipping `shouldComponentUpdate()`. This will trigger the normal lifecycle methods for child components, including the `shouldComponentUpdate()` method of each child. React will still only update the DOM if the markup changes.

Normally you should try to avoid all uses of `forceUpdate()` and only read from `this.props` and `this.state` in `render()`.

* * *

## Class Properties {#class-properties-1}

### `defaultProps` {#defaultprops}

`defaultProps` can be defined as a property on the component class itself, to set the default props for the class. This is used for undefined props, but not for `null` props. For example:

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

If `props.color` is not provided, it will be set by default to `'blue'`:

```js
  render() {
    return <CustomButton /> ; // props.color will be set to blue
  }
```

If `props.color` is set to null, it will remain null:

```js
  render() {
    return <CustomButton color={null} /> ; // props.color will remain null
  }
```

* * *

### `displayName` {#displayname}

The `displayName` string is used in debugging messages. Usually, you don't need to set it explicitly because it's inferred from the name of the function or class that defines the component. You might want to set it explicitly if you want to display a different name for debugging purposes or when you create a higher-order component, see [Wrap the Display Name for Easy Debugging](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging) for details.

* * *

## Instance Properties {#instance-properties-1}

### `props` {#props}

`this.props` contains the props that were defined by the caller of this component. See [Components and Props](/docs/components-and-props.html) for an introduction to props.

In particular, `this.props.children` is a special prop, typically defined by the child tags in the JSX expression rather than in the tag itself.

### `state` {#state}

The state contains data specific to this component that may change over time. The state is user-defined, and it should be a plain JavaScript object.

If some value isn't used for rendering or data flow (for example, a timer ID), you don't have to put it in the state. Such values can be defined as fields on the component instance.

See [State and Lifecycle](/docs/state-and-lifecycle.html) for more information about the state.

Never mutate `this.state` directly, as calling `setState()` afterwards may replace the mutation you made. Treat `this.state` as if it were immutable.
