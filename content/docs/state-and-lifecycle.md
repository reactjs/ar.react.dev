---
id: state-and-lifecycle
title: حالة ودورة حياة المكونات
permalink: docs/state-and-lifecycle.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

سنتحدّث في هذا القسم حول مفهوم حالة ودورة حياة المُكوِّنات في React، بإمكانك أن تجد من هنا [مرجعًا مُفصّلًا حول واجهة برمجة التطبيق (API) للمُكوِّنات](/docs/react-component.html).

فلنتذكر مثال الساعة من قسم [تصيير العناصر](/docs/rendering-elements.html#updating-the-rendered-element)، تعلّمنا في ذلك القسم فقط طريقة واحدة لتحديث واجهة المستخدم عن طريق استدعاء التابع `ReactDOM.render()` لتغيير الناتج:

```js{8-11}
function tick() {
  const element = (
    <div>
      <h1>أهلًا بالعالم!</h1>
      <h2>الساعة الآن {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**جرِّب المثال على موقع CodePen**](https://codepen.io/gaearon/pen/gwoJZk?editors=0010)

سنتعلّم في هذا القسم كيف نجعل مُكوِّن الساعة `Clock` قابلًا لإعادة الاستخدام حقًّا مع تغليفه ضمن نفسه، حيث يُعيِّن عدّاد الوقت الخاص به ويُحدِّث نفسه في كل ثانية.

بإمكاننا البدء عن طريق تغليف شكل السّاعة:

```js{3-6,12}
function Clock(props) {
  return (
    <div>
      <h1>أهلًا بالعالم!</h1>
      <h2>الساعة الآن {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**جرِّب المثال على موقع CodePen**](https://codepen.io/gaearon/pen/dpdoYR?editors=0010)

ولكن على الرغم من ذلك يفتقد هذا المُكوِّن لمتطلب أساسي، وهو أنّ تعيين السّاعة لعدّاد الوقت وتحديثها لواجهة المستخدم في كل ثانية ينبغي أن يكون تفصيلًا داخليًّا خاصًّا بالمُكوِّن `Clock`.

نريد بشكل مثالي أن نكتب هذه الشيفرة مرة واحدة ونجعل المُكوِّن `Clock` يُحدِّث نفسه:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

لتنفيذ هذا نحتاج لإضافة حالة (state) إلى المُكوِّن `Clock`.

تُشبِه الحالة الخاصيّات props، ولكنّها خاصّة (private) ويتحكَّم فيها المُكوِّن.

## تحويل الدالة إلى صنف {#converting-a-function-to-a-class}

بإمكانك تحويل مُكوِّنات الدوال مثل `Clock` إلى أصناف بخمس خطوات:

1. إنشاء [صنف ( ES6 )](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) بنفس الاسم والذي يمتد (extends) إلى `React.Component`.

2. إضافة تابع فارغ وحيد لهذا الصنف اسمه `render()`‎.

3. نقل جسم الدالة إلى التّابع `render()`‎.

4. تبديل `props` إلى `this.props` في جسم التّابع `render()`‎.

5. حذف باقي تصريح الدالة الفارغ.

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>أهلًا بالعالم!</h1>
        <h2>الساعة الآن {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[**جرِّب المثال على موقع CodePen**](https://codepen.io/gaearon/pen/zKRGpo?editors=0010)

أصبح المُكوِّن `Clock` الآن مُعرَّفًا كصنف بدلًا من دالة.

سيُستدعى التّابع `render()`‎ في كل مرّة يحصل فيها تحديث، ولكن طالما أنّنا نُصيِّر (Render) العنصر `<Clock />` إلى نفس عقدة DOM، فستُستخدَم نسخة واحدة فقط من الصنف `Clock` يسمح لنا هذا باستخدام ميزات إضافية مثل الحالة المحليّة ودورة حياة المُكوِّنات.

## إضافة الحالة المحلية للصنف {#adding-local-state-to-a-class}

سننقل التاريخ `date` من الخاصيّات `props` إلى الحالة في ثلاث خطوات:

1)  تبديل `this.props.date` بـ `this.state.date` في التّابع `render()`:

```js{6}
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>أهلًا بالعالم!</h1>
        <h2>الساعة الآن {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

2) إضافة [دالة بانية للصنف (constructor)](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes#Constructor) والتي تُعيِّن القيمة المبدئية `this.state`: 
  
```js{4}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>أهلًا بالعالم!</h1>
        <h2>الساعة الآن {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

لاحظ كيف مرّرنا الخاصيّات `props` إلى الدالة البانية:

```js{2}
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```

ينبغي لمُكوِّنات الأصناف أن تستدعي دومًا الدالة البانية مع الخاصيّات `props`.

3) إزالة الخاصيّة `date` من العنصر ‎`<Clock />`:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

سنعيد لاحقًا إضافة شيفرة عداد الوقت إلى المُكوِّن نفسه.

تبدو النتيجة كما يلي:


```js{2-5,11,18}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>أهلًا بالعالم!</h1>
        <h2>الساعة الآن {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**جرِّب المثال على موقع CodePen**](https://codepen.io/gaearon/pen/KgQpJd?editors=0010)

سنجعل الآن المُكوِّن `Clock` يُعيِّن عدّاد الوقت الخاص به ويُحدِّث نفسه في كل ثانية.

## إضافة توابع دورة الحياة إلى الصنف {#adding-lifecycle-methods-to-a-class}

من المهم في التطبيقات التي تمتلك العديد من المُكوِّنات أن نُحرِّر الموارد المحجوزة من قبل هذه المُكوِّنات عند تدميرها.

نريد [تعيين عدّاد الوقت](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) حالما يُصيَّر المُكوِّن `Clock` إلى DOM لأوّل مرّة، يُسمَّى هذا في React بالوصل (mounting).
ونرغب أيضًا [بمسح هذا العدّاد](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval) حالما يُزال DOM الناتج عن المُكوِّن `Clock`، يُسمَّى هذا في React بالفصل (unmounting).

بإمكاننا التصريح عن توابع خاصّة في مُكوِّنات الأصناف لتنفيذ بعض الشيفرات عند وصل وفصل المُكوِّن:

```js{7-9,11-13}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>أهلًا بالعالم!</h1>
        <h2>الساعة الآن {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

تُدعى هذه التوابع بـ"دوال دورة الحياة".

تعمل دالة `componentDidMount()`‎ بعد تصيير ناتج المُكوِّن إلى DOM، لذلك هو مكان مُلائم لتعيين عداد الوقت:

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

لاحظ كيف حفظنا مُعرِّف عدّاد الوقت (timer ID) من خلال `this`.

لمّا كانت `this.props` يجري إعدادها عن طريق React نفسها و `this.state` تمتلك معنًى خاصًّا، فأنت حر بأن تضيف حقول إضافيّة يدويًّا إلى الصّنف إن احتجت تخزين شيء ما لا يُشارِك في تدفّق البيانات (مثل مُعرِّف عداد الوقت).

سننهي عدّاد الوقت في دالة دورة الحياة `componentWillUnmount()`:

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

وأخيرًا سنضيف تابعًا يُدعى `tick()`‎ يُنفِّذه المُكوِّن `Clock` في كل ثانية.

سيستخدم `this.setState()`‎ لجدولة التحديثات إلى الحالة المحليّة للمُكوِّن:

```js{18-22}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>أهلًا بالعالم</h1>
        <h2>الساعة الآن {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**جرِّب المثال على موقع CodePen**](https://codepen.io/gaearon/pen/amqdNA?editors=0010)

تدق السّاعة الآن في كل ثانية.

فلنوجز بسرعة ما يجري ونذكر الترتيب الذي تُستدعى فيه التوابع:

1) عندما يُمرَّر العنصر ‎`<Clock />`‎ إلى `ReactDOM.render()`‎ تستدعي React الدالة البانية للمُكوِّن `Clock`. وبما أنّ `Clock` يحتاج لإظهار الوقت الحالي سيُهيِّئ `this.state` بكائن يتضمّن الوقت الحالي، ولاحقًا يُحدِّث هذه الحالة.

2) تستدعي بعدها React التّابع `render()`‎ للمُكوِّن `Clock` وهكذا تعلم React ما الذي ينبغي عرضه على الشاشة. تُحدِّث React بعد ذلك DOM ليُطابِق ناتج `Clock`.

3) عندما يُدخَل ناتج `Clock` إلى DOM، تستدعي React خُطاف دورة الحياة `componentDidMount()`، وبداخله يسأل المُكوِّن `Clock` المتصفّح أن يُعيِّن عدّاد الوقت لاستدعاء التابع `tick()`‎ الخاص بالمُكوِّن مرّة كل ثانية.

4) يستدعي المتصفّح في كل ثانية التّابع `tick()`، وبداخله يُجدوِل المُكوِّن `Clock` تحديثًا لواجهة المستخدم عن طريق استدعاء `setState()` مع كائن يحوي على الوقت الحالي. وبفضل استدعاء `setState()` تعلم React أنّ الحالة تغيّرت وبذلك تستدعي التّابع `render()`‎ مرّة أخرى ليعلم ما الذي ينبغي أن يكون على الشاشة، ستكون `this.state.date` في التابع `render()`‎ مختلفة هذه المرّة، وبهذا يتضمّن الناتج الوقت المُحدَّث. تُحدِّث React وفق ذلك DOM.
  
5) إن أُزيل المُكوِّن `Clock` من DOM تستدعي React دالة دورة الحياة `componentWillUnmount()` بحيث يتوقّف عدّاد الوقت.

## استخدام الحالة بشكل صحيح {#using-state-correctly}

هنالك ثلاثة أشياء ينبغي أن تعلمها حول `setState()`.

### لا تعدل الحالة بشكل مباشر {#do-not-modify-state-directly}

على سبيل المثال لن يُعيد المثال التالي تصيير المُكوِّن:

```js
// طريقة خاطئة
this.state.comment = 'أهلًا';
```

استخدم `setState()`‎ بدلًا من ذلك:

```js
// الطريقة الصحيحة
this.setState({comment: 'أهلًا'});
```

المكان الوحيد الذي يُمكنك فيه تعيين `this.state` هو الدالة البانية.

### قد تكون تحديثات الحالة غير متزامنة {#state-updates-may-be-asynchronous}

قد تجمع React نداءات عديدة للتّابع `setState()`‎ في تحديث واحد من أجل تحسين الأداء.

بما أنّ `this.props` و `this.state`  قد تُحدَّث بشكل غير متزامن، فيجب ألّا تعتمد على قيمها لحساب الحالة التالية.

على سبيل المثال قد تفشل الشيفرة التالية بتحديث عدّاد الوقت:

```js
// طريقة خاطئة
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

لإصلاح ذلك استخدم شكل آخر من `setState()`‎ يقبل دالة بدلًا من كائن، حيث تستقبل هذه الدالة الحالة السّابقة كوسيط أول لها، والخاصيّات `props` في وقت تطبيق التحديث كوسيطٍ ثانٍ لها:

```js
// الطريقة الصحيحة
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment
}));
```

استخدمنا [الدوال السهمية](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) في المثال السّابق، ولكنّها تعمل أيضًا مع الدوال الاعتياديّة:

```js
// الطريقة الصحيحة
this.setState(function(prevState, props) {
  return {
    counter: prevState.counter + props.increment
  };
});
```

### تدمج React تحديثات الحالة {#state-updates-are-merged}

عندما تستدعي `setState()`، تدمج React الكائن الذي تُزوِّدها به مع الحالة الحاليّة.

على سبيل المثال قد تحتوي حالتك على متغيّرات مستقلّة عديدة:

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

يُمكنِك بعد ذلك تحديثها بشكل مستقل باستدعاءات منفصلة للتابع `setState()`:

```js{4,10}
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

يكون هذا الدمج ضئيلًا، لذلك لا يُؤثِّر تحديث حالة التعليقات `this.setState({comments})`‎ على حالة المنشورات أي `this.state.posts`، ولكنّه يستبدل حالة التعليقات `this.state.comments` بشكل كامل.

## تتدفق البيانات للمستويات الأدنى {#the-data-flows-down}

لا تعلم المُكوِّنات الآباء ولا حتى الأبناء إن كان مُكوِّن مُحدَّد لديه حالة أو بدون حالة، ولا يجب أن تُبالي إن كان مُعرَّفًا كدالة أو كصنف.

هذا هو السبّب وراء تسمية الحالة بالمحليّة أو المُغلَّفة، فهي غير قابلة للوصول من قبل أي مُكوِّن آخر غير المُكوِّن الذي يملكها ويُعيّنها.

قد يختار المُكوِّن تمرير حالته كخاصيّات `props` إلى عناصره الأبناء في المستوى الأدنى:

```js
<h2>الساعة الآن {this.state.date.toLocaleTimeString()}.</h2>
```

يعمل هذا المثال مع المُكوِّنات المُعرَّفة من قبل المستخدم أيضًا:

```js
<FormattedDate date={this.state.date} />
```

يستقبل المُكوِّن `FormattedDate` التاريخ `date` في خاصيّاته ولن يعلم ما إذا كان هذا التاريخ قد أتى عن طريق حالة المُكوِّن `Clock`، أو من خاصيّات `Clock`، أو كُتِب بشكل يدوي:

```js
function FormattedDate(props) {
  return <h2>الساعة الآن {props.date.toLocaleTimeString()}.</h2>;
}
```

[**جرِّب المثال على موقع CodePen**](https://codepen.io/gaearon/pen/zKRqNB?editors=0010)

يُدعى هذا عادةً بتدفق البيانات من المستوى الأعلى للأدنى (top-down) أو أحادي الاتجاه (unidirectional). حيث أي حالة يمتلكها مُكوِّن مُحدَّد، وأي بيانات أو واجهة مستخدم مُشتقَّة من تلك الحالة بإمكانها فقط التأثير على المُكوِّنات التي تحتها في شجرة المُكوِّنات.

إن تخيّلت شجرة المُكوِّنات كشلّال من الخاصيّات، فكل حالة مُكوِّن تُشبِه مصدر إضافي للماء ينضم إليها في نقطة عشوائيّة ويتدفق معها للأسفل.

ولنبرهن أنّ جميع المُكوِّنات معزولة حقًا، فبإمكاننا إنشاء المُكوِّن `App` الذي يُظهِر شجرة من مُكوِّنات ‎`<Clock>`:

```js{4-6}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[**جرِّب المثال على موقع CodePen**](https://codepen.io/gaearon/pen/vXdGmd?editors=0010)

يُعيِّن كل مُكوِّن `Clock` عدّاده الخاص به ويُحدِّثه بشكل منفصل.

في تطبيقات React عند استخدام مُكوِّن بداخل مُكوِّن آخر، فيُعتبَر المُكوِّن تفصيلًا تنفيذيًّا للمُكوِّن الآخر سواءً كان المُكوِّن يحتوي على حالة (stateful) أو بدون حالة (stateless) ويُمكِن أن يتغيّر عبر الوقت، بإمكانك استخدام المُكوِّنات بدون الحالة بداخل المُكوِّنات ذات الحالة وبالعكس أيضًا.
