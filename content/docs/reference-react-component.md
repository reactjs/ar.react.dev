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

التابع الوحيد الذي *يجب*  عليك تعريفه في الصنف الفرعي الناتج عن الصنف  `React.Component` هو [`()render`](#render)، أمّا بقية التوابع المذكورة في هذه الصفحة هي اختياريّة.

**نوصي بشدّة ألّا تُنشِئ أصنافًا أساسيّة للمكوّنات خاصّة بك.** ففي مكوّنات React تتحقّق , [إعادة استخدام الشيفرة بشكل أساسي عبر التركيب (composition) بدلًا من الوراثة (inheritance)](/docs/composition-vs-inheritance.html).

>ملاحظة:
>
>لا تُجبِرك React على استخدام صياغة أصناف ES6. إن كنت تفضّل تجنّب ذلك فبإمكانك استخدام الوحدة `create-react-class` أو أي تجريد مُخصَّص مماثل بدلًا من ذلك. انظر إلى [استخدام React بدون ES6](/docs/react-without-es6.html) لتعلّم المزيد.

### دورة حياة المكوّن {#the-component-lifecycle}

يمتلك كل مكوّن توابع دورة حياة متعدّدة والتي تستطيع تجاوزها لتنفيذ الشيفرة في أوقات مُحدَّدة.  **تستطيع استخدام  [مُخطّط دورة حياة المكوّنات هذا](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)** في القائمة التالية سنكتب أسماء توابع دورة الحياة الشائعة بالخط العريض. أما البقية فهي موجودة لحالات الاستخدام النادرة نسبيًّا.

#### الوصل (mounting) {#mounting}

تُستدعى هذه التوابع بالترتيب التالي عند إنشاء نسخة من المكوّن وإدخالها إلى DOM:

- [**`()constructor`**](#constructor)
- [`()static getDerivedStateFromProps`](#static-getderivedstatefromprops)
- [**`()render`**](#render)
- [**`()componentDidMount`**](#componentdidmount)

>Note:
>
>ملاحظة: يُعتبر هذا التابع قديمًا ويجب أن [تتجنّب](/blog/2018/03/27/update-on-async-rendering.html) استخدامه في الشيفرة الجديدة:
>
>- [`()UNSAFE_componentWillMount`](#unsafe_componentwillmount)

#### التحديث {#updating}

يُمكِن أن يحصل التحديث عن طريق التغييرات في الخاصيّات أو الحالة. تُستدعى هذه التوابع بالترتيب التالي عند إعادة تصيير المكوّن:

- [`()static getDerivedStateFromProps`](#static-getderivedstatefromprops)
- [`()shouldComponentUpdate`](#shouldcomponentupdate)
- [**`()render`**](#render)
- [`()getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)
- [**`()componentDidUpdate`**](#componentdidupdate)

>Note:
>
>ملاحظة: يُعتبر هذا التابع قديمًا ويجب أن [تتجنّب](/blog/2018/03/27/update-on-async-rendering.html) استخدامه في الشيفرة الجديدة:
>
>- [`()UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate)
>- [`()UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops)

#### الفصل (unmounting) {#unmounting}

يُستدعى هذا التابع عند إزالة المكون من DOM:

- [**`()componentWillUnmount`**](#componentwillunmount)

#### معالجة الأخطاء {#error-handling}

يُستدعى هذا التابع عند وجود خطأ أثناء التصيير، أو في تابع دورة حياة المكوّن، أو في الدالة البانية لأي من المكوّنات الأبناء.

- [`()static getDerivedStateFromError`](#static-getderivedstatefromerror)
- [`()componentDidCatch`](#componentdidcatch)

### واجهات برمجة التطبيق الأخرى {#other-apis}

يُعطينا كل مكوّن بواجهات برمجة تطبيق أخرى:

  - [`()setState`](#setstate)
  - [`()forceUpdate`](#forceupdate)

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

### `()render` {#render}

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

### `()constructor` {#constructor}

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

### `()componentDidMount` {#componentdidmount}

```javascript
componentDidMount()
```

يُستدعى  `componentDidMount()` مباشرة بعد وصل المكوّن (إدخاله ضمن الشجرة). يجب أن نضع هنا التهيئة التي تتطلّب عقدة DOM. إن احتجت إلى تحميل بيانات من نقطة بعيدة فهذا التابع مكان جيد لبدء طلبات الشبكة.

يُعد هذا التابع أيضًا مكانًا جيّدًا لإعداد أي اشتراكات. إن فعلت ذلك فلا تنسَ إزالة الاشتراك في التابع `componentWillUnmount()`.

بإمكانك **استدعاء  `setState()` مباشرة في التابع** `componentDidMount()`. . سيُطلِق تصييرًا إضافيًّا ولكن سيحدث ذلك قبل أن يُحدِّث المتصفح الشاشة. يضمن ذلك عدم رؤية المستخدم للحالة مباشرة على الرغم من استدعاء التابع  `render()` مرتين. استخدم هذا النمط بحذر لأنّه يسبب غالبًا مشاكل بالأداء. يجب في معظم الحالات أن تُعيّن الحالة المبدئية في الدالة البانية بدلًا من ذلك. ولكن قد يكون ذلك ضروريًّا لحالات مثل تلميحات الأدوات (tooltips) عندما تحتاج إلى تقدير عقدة DOM قبل تصيير شيء يعتمد على حجمه أو موقعه.

* * *

### `()componentDidUpdate` {#componentdidupdate}

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

### `()componentWillUnmount` {#componentwillunmount}

```javascript
componentWillUnmount()
```

يُستدعى التابع  `componentWillUnmount()` مباشرةً قبل فصل المكوّن وتدميره. نفّذ أي مسح ضروري في هذا التابع، مثل تعطيل العدادات، وإلغاء طلبات الشبكة، ومسح أي اشتراكات أنشأها التابع `componentDidMount()`.

**لا يجب أن تستدعي التابع `setState()`**  في التابع `componentWillUnmount()` لأنّ المكوّن لن يُعاد تصييره. حالما تُفصَل نسخة المكوّن فلن تُوصل مرة أخرى.

* * *

### توابع دورة الحياة نادرة الاستخدام {#rarely-used-lifecycle-methods}

تستخدم التوابع المذكورة في هذا القسم في حالات نادرة، وهي مفيدة من حين لآخر، ولكن لن تحتاجها معظم مكوّناتك.**تستطيع أن ترى معظم هذه التوابع في [مخطط توابع دورة حياة المكوّنات](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) إن ضغطت على مربع التأشير "Show less common lifecycles" الموجود في الأعلى.**


### `()shouldComponentUpdate` {#shouldcomponentupdate}

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

### `()static getDerivedStateFromProps` {#static-getderivedstatefromprops}

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

### `()getSnapshotBeforeUpdate` {#getsnapshotbeforeupdate}

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

### `()static getDerivedStateFromError` {#static-getderivedstatefromerror}
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

> ملاحظة
>
> يُستدعَى  `getDerivedStateFromError()`  أثناء طور التصيير، لذا لا يُسمح بتنفيذ أي تأثيرات جانبية. 
من أجل حالات الاستعمال تلك، استعمل `componentDidCatch()` عوضًا عنه.

* * *

### `()componentDidCatch` {#componentdidcatch}

```javascript
componentDidCatch(error, info)
```

يُستدعَى تابع دورة الحياة هذا بعد أن يُرمَى خطأ عبر مكون سليل (descendant component).
يستلم هذا التابع معاملين:

1. `error` - الخطأ الذي رُمِي.
2. `info` - كائن مع المفتاح `componentStack` الذي يحوي [معلومات عن المكون الذي رمى الخطأ](/docs/error-boundaries.html#component-stack-traces).


يُستدعَى `componentDidCatch()` أثناء طور التطبيق، لذا يُسمَح بالتأثيرات الجانبية.
يجب أن يُستعمَل هذا التابع من أجل أشياء مثل تسجيل الأخطاء:

```js{12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // تحديث الحالة، لذا ستظهر عملية التصيير التالية واجهة
    // المستخدم الاحتياطية
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
      // يمكنك تصيير أية واجهة مستخدم احتياطية مخصصة
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

> ملاحظة
> 
> عند حدوث أي خطأ، يمكنك أن تصيير واجهة مستخدم احتياطية (fallback UI) مع التابع `componentDidCatch()` عبر استدعاء `setState`, ولكن هذا السلوك سيجري إهماله في إصدار مستقبلي.
> استعمل `static getDerivedStateFromError()` لمعالجة التصيير الاحتياطي عوضًا عن ذلك.

* * *

### توابع دورة الحياة القديمة {#legacy-lifecycle-methods}

تعتبر توابع دورة الحياة التالية قديمة. لا تزال تعمل ولكن لا نوصي باستخدامها في الشيفرة الجديدة. بإمكانك تعلم المزيد حول الانتقال من التوابع القديمة في [هذا المنشور](/blog/2018/03/27/update-on-async-rendering.html).

### `()UNSAFE_componentWillMount` {#unsafe_componentwillmount}

```javascript
UNSAFE_componentWillMount()
```

يُستدعى التابع `UNSAFE_componentWillMount()`‎ مباشرة قبل حدوث الوصل، ويُستدعى قبل تابع التصيير `render()‎` لذلك لن يُطلِق استدعاء التابع `setState()`‎ بشكل متزامن في هذا التابع أي تصيير إضافي. نوصي بشكلٍ عام استخدام الدالة البانية `constructor()`‎ بدلًا من ذلك لتهيئة الحالة.
تجنّب تقديم أي آثار جانبية أو اشتراكات في هذا التابع، ولأجل تلك الحالات استخدم التابع `componentDidMount()`‎.

هذا هو التابع الوحيد من توابع دورة الحياة الذي يُستدعى لأجل التصيير على الخادم.

ملاحظة: كان يُسمّى هذا التابع سابقًا `componentWillMount` وسيبقى هذا الاسم يعمل حتى الإصدار 17. استخدم rename-unsafe-lifecycles codemod لتحديث مكوّناتك تلقائيًّا.
* * *

### `()UNSAFE_componentWillReceiveProps` {#unsafe_componentwillreceiveprops}

```javascript
UNSAFE_componentWillReceiveProps(nextProps)
```

> ملاحظة
>
> كان يُسمّى هذا التابع سابقًا `componentWillReceiveProps`. وسيبقى هذا الاسم يعمل حتى الإصدار 17 استخدم  [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) لتحديث مكوّناتك تلقائيًّا.

> ملاحظة:
>
> يقود استخدام تابع دورة الحياة هذا إلى أخطاء وعدم توافقية، لذا سيُهمَل في المستقبل.
>
> * إن احتجت إلى إنجاز تأثير جانبي (مثل الحصول على البيانات أو التحريك) استجابةً إلى تغيّر في الخاصيّات، فاستخدم التابع [`componentDidUpdate`](#componentdidupdate) بدلًا من ذلك.
> * إن استخدمت التابع `componentWillReceiveProps` لإعادة حساب بعض البيانات عند تغيّر الخاصيّات فقط، فاستخدم, [مُساعِد التذكير](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
> * إن استخدمت التابع `componentWillReceiveProps`  لإعادة تعيين الحالة عند تغيّر الخاصيّات، فانظر في جعل المكوّن [مضبوطًا بشكل كامل](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) أو [غير مضبوط بشكل كامل مع استخدام المفاتيح](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) بدلًا من ذلك.
>
> في بعض الحالات النادرة قد ترغب باستخدام تابع دورة الحياة getDerivedStateFromProps كملاذ أخير.

يُستدعَى التابع  `UNSAFE_componentWillReceiveProps()` قبل أن يستقبل المكوّن الموصول خاصيّات جديدة. إن أردت تحديث الحالة استجابةً لتغيّر الخاصيّة (على سبيل المثال إعادة تعيينها) فبإمكانك مقارنة `this.props` و `nextProps` وإتمام تغيير الحالة باستخدام `this.setState()`.

انتبه إلى أنّه إذا كان المكوّن الأب يُسبب إعادة تصيير مكوّنك، فسيُستدعى هذا التابع حتى لو لم تتغيّر الخاصيّات. احرص على مقارنة القيم الحالية والقيم التالية فقط إذا أردت التعامل مع التغييرات.

لا تستدعي React التابع `UNSAFE_componentWillReceiveProps()` with initial props during [mounting](#mounting). مع الخاصيّات المبدئية خلال الوصل، وتستدعيه فقط إذا تحدثت بعض خاصيّات المكوّن. لا يُطلِق استدعاء `this.setState()` بشكلٍ عام التابع `UNSAFE_componentWillReceiveProps()`.

* * *

### `()UNSAFE_componentWillUpdate` {#unsafe_componentwillupdate}

```javascript
UNSAFE_componentWillUpdate(nextProps, nextState)
```

> ملاحظة
>
> كان يُسمّى هذا التابع سابقًا `componentWillUpdate`. وسيبقى هذا الاسم يعمل حتى الإصدار 17. استخدم [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) لتحديث مكوّناتك تلقائيًّا.

يُستدعى التابع `UNSAFE_componentWillUpdate()` قبل التصيير عند استقبال خاصيّات أو حالة جديدة. استخدم هذا التابع كفرصة لإنجاز التحضيرات قبل حصول التحديث. لا يُستدعى هذا التابع من أجل التصيير المبدئي.

انتبه إلى أنّك لا تستطيع استدعاء  `this.setState()` هنا، ولا ينبغي أن تفعل أي شيء آخر (مثلًا تطبيق إجراء في Redux) يقود إلى إطلاق تحديث مكوّن React قبل إعادة قيمة التابع `UNSAFE_componentWillUpdate()`.

يُمكِن استبدال هذا التابع بالتابع  `componentDidUpdate()`. إن كُنتَ تقرأ من DOM في هذا التابع (على سبيل المثال حفظ موضع النزول في الصفحة) فبإمكانك نقل هذا المنطق إلى التابع`getSnapshotBeforeUpdate()`.

> ملاحظة
>
> لن يُستدعى التابع `UNSAFE_componentWillUpdate()` إن أعاد التابع [`shouldComponentUpdate()`](#shouldcomponentupdate) القيمة false.

* * *

## واجهات برمجة التطبيق الأخرى {#other-apis-1}

على عكس توابع دورة الحياة السّابقة (والتي تستدعيها React لأجلك)، فإنّ التوابع التالية هي توابع تستطيع استدعاءها من مكوّناتك.

هنالك فقط تابعان: `setState()` و `forceUpdate()`.

### `()setState` {#setstate}

```javascript
setState(updater[, callback])
```

يُطبِّق التابع `setState()‎` التغييرات على حالة المكوّن ويُخبِر React بضرورة إعادة تصيير هذا المكوّن ومكوّناته الأبناء مع الحالة الجديدة. هذا هو التابع الرئيسي الذي تستخدمه لتحديث واجهة المستخدم استجابةً لمُعالِج أحداث واستجابات الخادم.
فكّر بالتابع `setState()‎`‎ كطلب بدلًا من أمر عاجل لتحديث المكوّن. للحصول على أداء أفضل قد تُؤخِّر React تنفيذ هذا التابع وبعد ذلك تُحدِّث عدّة مكوّنات في نفس الاستدعاء. لا تضمن React تطبيق تغيّرات الحالة بشكلٍ فوري.

لا يُحدِّث التابع `setState()‎`‎ المكوّن فورًا، فقد يُؤجل التحديث حتى وقتٍ لاحق. يجعل هذا من قراءة `this.state` مباشرةً بعد استدعاء `setState()`‎ أمرًا خاطئًا. استخدم بدلًا من ذلك التابع `componentDidUpdate` أو رد النداء `setState` (على الشكل `setState(updater, callback)`‎)، والتي من المضمون إطلاقها بعد تطبيق التحديث. إن احتجت إلى تعيين الحالة بناءً على الحالة السابقة، فاقرأ حول الوسيط `updater` الذي سنذكره بعد قليل.

يقود `setState()‎`‎ إلى إعادة التصيير دومًا ما لم يُرجِع التابع `shouldComponentUpdate()`‎ القيمة `false`. إن كنت تستخدم الكائنات القابلة للتعديل ولم يكن بالإمكان تطبيق منطق التصيير الشرطي ضمن التابع `shouldComponentUpdate()`‎، فستتجنّب إعادة التصيير غير الضرورية باستدعاء `setState()`‎ فقط عند اختلاف الحالة الجديدة.

الوسيط الأول هو الدالة `updater` والتي يكون شكلها كما يلي:

```javascript
(state, props) => stateChange
```

`prevState` هو مرجع إلى الحالة السابقة، فلا يجب تعديله بشكل مباشر، بل يجب تمثيل التغييرات عن طريق بناء كائن جديد اعتمادًا على المُدخلات من `prevState` و `props`. فلنفترض مثلًا أنّنا أردنا زيادة القيمة الموجودة في الحالة بإضافة `props.step` إليها:

```javascript
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

من المضمون أن تكون الحالة السابقة `prevState` والخاصيّات `props` التي تستقبلها الدالة `updater` بآخر تحديث. يُدمَج ناتج الدالة updater بشكل ضئيل مع الحالة السابقة `prevState`.
الوسيط الثاني للتابع `setState()`‎‎ هو دالة رد نداء اختياريّة تُنفَّذ حالما يكتمل التابع `setState()`‎ ويُعاد تصيير المكوّن. نوصي بشكلٍ عام باستخدام التابع `componentDidUpdate()`‎ لأجل هذا المنطق.

بإمكانك بشكل اختياري تمرير كائن كوسيط أول للتابع `setState()`‎‎ بدلًا من تمرير دالة:


```javascript
setState(stateChange[, callback])
```

يؤدي هذا إلى دمج ضئيل لتغيير الحالة `stateChange` مع الحالة الجديدة، على سبيل المثال لضبط كمية العنصر موجود في سلّة الشراء:

```javascript
this.setState({quantity: 2})
```

هذا الشكل للتابع `setState()`‎ غير متزامن أيضًا، ويُمكِن تجميع الاستدعاءات المتعددة خلال نفس الدور مع بعضها. مثلًا إن حاولت زيادة كمية العنصر أكثر من مرّة في نفس الدورة فسينتج عن ذلك ما يلي:

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

تتجاوز الاستدعاءات المتلاحقة القيم من الاستدعاءات السابقة في نفس الدورة، لذا ستزداد الكمية فقط مرّة واحدة. إن كانت الحالة التالية تعتمد على الحالة السابقة فنوصي باستخدام شكل الدالة `updater` بدلًا من ذلك:

```js
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

للمزيد من التفاصيل انظر:

* [دليل توابع دورة الحياة والحالة](/docs/state-and-lifecycle.html)
* [شرح مفصّل: متى ولماذا نُجمِّع استدعاءات التابع `setState()`?](https://stackoverflow.com/a/48610973/458193)
* [شرح مفصّل: لماذا لا تُحدَّث قيمة `this.state`  مباشرةً؟](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `()forceUpdate` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

عندما تتغيّر حالة أو خاصيّات مكوّناتك فسيعيد المكوّن تصيير نفسه بشكلٍ افتراضي. إن كان تابع التصيير `render()`‎ لديك يعتمد على بعض البيانات الأخرى، فبإمكانك إخبار React بضرورة إعادة تصيير المكوّن عن طريق استدعاء التابع `forceUpdate()`‎.
سيُؤدي استدعاء التابع `forceUpdate()`‎ إلى استدعاء التابع `render()`‎‎ في المكوّن مع تجاوز التابع `shouldComponentUpdate()`‎. سيُطلِق ذلك توابع دورة الحياة الاعتيادية للمكوّنات الأبناء بما في ذلك التابع `shouldComponentUpdate()‎` لكل ابن. وستبقى React تُحدِّث DOM فقط عند حصول تغيير.

يجب عليك أن تحاول تجنّب استخدام التابع `forceUpdate()‎` وأن تقرأ القيم فقط من `this.props` و `this.state` في التابع `render()`‎.

* * *

## خاصيّات الصنف {#class-properties-1}

### `defaultProps` {#defaultprops}

يُمكِن تعريف `defaultProps` كخاصيّة لمكوّن الصنف نفسه لتعيين الخاصيّات الافتراضيّة للصنف. تُستخدَم هذه الخاصيّة لأجل الخاصيّات غير المُعرَّفة، ولكن ليس لأجل الخاصيّات null، على سبيل المثال:

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

إن تُعطى قيمة `props.color` فستُعيَّن بشكل افتراضي إلى `'blue'`:

```js
  render() {
    return <CustomButton /> ; // props.color will be set to blue
  }
```

إن كانت `props.color` مُعيَّنة إلى, فستبقى  null:

```js
  render() {
    return <CustomButton color={null} /> ; // props.color ستبقى null
  }
```

* * *

### `displayName` {#displayname}

تُستخدَم السلسلة النصيّة  `displayName` في رسائل تنقيح الأخطاء (debugging). لن تحتاج عادةً إلى تعيينها بشكلٍ خاص لأنّها تُشتق من اسم الدالة أو الصنف الذي يُعرِّف المكوّن. قد ترغب بعيينها بشكلٍ صريح إن أردت أن تعرض اسمًا مختلفًا لأغراض تنقيح الأخطاء أو عند إنشاء مكوّن ذو ترتيب أعلى. للمزيد من التفاصيل انظر إلى [تغليف الاسم المعروض لتسهيل تنقيح الأخطاء](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging).

* * *

## خاصيّات النسخة (Instance) {#instance-properties-1}

### `props` {#props}

تحتوي `this.props` على الخاصيّات المُعرَّفة في السطر الذي استدعى هذا المكوّن. انظر إلى توثيق المكوّنات والخاصيّات لمقدمة حول الخاصيّات.

`this.props.children` هي خاصيّة مميزة مُعرَّفة عن طريق الوسم `child` في تعبير JSX بدلًا من وضعها ضمن الوسم نفسه.

### `state` {#state}

تحتوي الحالة على بيانات خاصّة بهذا المكوّن والتي قد تتغيّر مع مرور الوقت. تُعرَّف الحالة من قبل المستخدم ويجب أن تكون كائن JavaScript مجرّد.

إن لم تكن قيمة ما مستخدمة للتصيير أو تدفق البيانات (على سبيل المثال مُعرِّف عدّاد الوقت) فلا يجب عليك وضعها ضمن الحالة، حيث يُمكِن تعريف مثل هذه القيم كحقول في نسخة المكوّن.

انظر إلى [الحالة وتوابع دورة الحياة](/docs/state-and-lifecycle.html) للمزيد من المعلومات حول الحالة.

لا تُعدِّل قيمة `this.state` بشكلٍ مباشر إطلاقًا، فقد يؤدي استدعاء `setState()‎` بعدها إلى تبديل التغيير الذي أجريته. تعامل مع `this.state` كما لو أنّها قيمة غير قابلة للتعديل.
