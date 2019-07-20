---
id: faq-functions
title: تمرير الدوال إلى المكونات
permalink: docs/faq-functions.html
layout: docs
category: FAQ
---

### كيف يمكنني تمرير مُعالِج حدث (مثل onClick) إلى مكوّن؟ {#how-do-i-pass-an-event-handler-like-onclick-to-a-component}

مرِّر مُعالِجات الأحداث والدوال الأخرى كخاصيّات `props` إلى المكوّنات الأبناء:

```jsx
<button onClick={this.handleClick}>
```

إن احتجت إلى الوصول إلى المكوّن الأب في مُعالِج الأحداث فستحتاج إلى ربط الدالة إلى نسخة المكوّن (انظر أدناه).

### كيف أربط الدالة إلى نسخة المكوّن؟ {#how-do-i-bind-a-function-to-a-component-instance}

هنالك عدة طرق للتأكّد من أنّ الدوال تستطيع الوصول إلى خاصيّات المكوّن مثل `this.props` و `this.state`، بناءً على الصياغة وخطوات البناء التي تستخدمها.

#### الربط في الدالة البانية (ES2015) {#bind-in-constructor-es2015}

```jsx
class Foo extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('حدثت نقرة');
  }
  render() {
    return <button onClick={this.handleClick}>انقر هنا</button>;
  }
}
```

#### خاصيّات الصنف (اقتراح المرحلة 3) {#class-properties-stage-3-proposal}

```jsx
class Foo extends Component {
  // ملاحظة: هذه الصياغة تجريبية وليست معيارية بعد
  handleClick = () => {
    console.log('حدثت نقرة');
  }
  render() {
    return <button onClick={this.handleClick}>انقر هنا</button>;
  }
}
```

#### الربط في تابع التصيير `render` {#bind-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('حدثت نقرة');
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>انقر هنا</button>;
  }
}
```

>**ملاحظة:**
>
>يُؤدّي استخدام `Function.prototype.bind` في التابع `render` إلى إنشاء دالة جديدة في كل مرّة يُصيَّر فيها المكوّن، ممّا قد يؤثر على الأداء (للمزيد تابع في الأسفل).

#### استخدام الدوال السهميّة في تابع التصيير `render` {#arrow-function-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('حدثت نقرة');
  }
  render() {
    return <button onClick={() => this.handleClick()}>انقر هنا</button>;
  }
}
```

>**ملاحظة:**
>
> يُؤدّي استخدام الدوال السهميّة في التابع `render` إلى إنشاء دالة جديدة في كل مرّة يُصيَّر فيها المكوّن، ممّا قد يؤثر على الأداء.

### هل من الجيّد استخدام الدوال السهميّة في توابع التصيير؟ {#is-it-ok-to-use-arrow-functions-in-render-methods}

بشكلٍ عام نعم، لا مشكلة في ذلك، وهي عادةً الطريقة الأسهل لتمرير المُعامِلات إلى دوال ردود النداء.

إن كانت لديك مشاكل في الأداء، فحاول تحسينه عن طريق الطرق المشروحة في [المستندات](/docs/getting-started.html).

### لماذا من الضروري إجراء الربط أساسًا؟ {#why-is-binding-necessary-at-all}

في JavaScript **لا** تكون الشيفرتان التاليتان متساويتين:

```js
obj.method();
```

```js
var method = obj.method;
method();
```

تضمن توابع الربط عمل الشيفرة الثانية بنفس طريقة عمل الشيفرة الأولى.

تحتاج باستخدام React فقط إلى ربط التوابع التي *تُمرِّرها* إلى المكوّنات الأخرى. على سبيل المثال يُمرِّر `‎<button onClick={this.handleClick}>‎` التابع `this.handleClick` لذا تحتاج إلى ربطه، ولكن من غير الضروري ربط التابع `render` أو توابع دورة حياة المكوّن، فنحن لا نُمرّرها إلى المكوّنات الأخرى.

يشرح [هذا المنشور](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/) مفهوم الربط (binding) وكيفيّة عمل الدوال في JavaScript بالتفصيل.

### لماذا تُستدعى الدالة لدي في كل مرّة يُصيَّر فيها المكوّن؟ {#why-is-my-function-being-called-every-time-the-component-renders}

تأكّد من عدم _استدعاء الدالة_ عند تمريرها إلى المكوّن:

```jsx
render() {
  // Wrong: handleClick is called instead of passed as a reference!
  return <button onClick={this.handleClick()}>انقر هنا</button>
}
```

بدلًا من فعل ذلك *مرِّر الدالة نفسها* بدون أقواس:

```jsx
render() {
  // Correct: handleClick is passed as a reference!
  return <button onClick={this.handleClick}>انقر هنا</button>
}
```

### كيف أمرّر مُعامِل إلى مُعالِج الأحداث أو رد النداء(callback)؟ {#how-do-i-pass-a-parameter-to-an-event-handler-or-callback}

تستطيع استخدام الدوال السهميّة من أجل الالتفاف حول مُعالِجات الأحداث وتمرير المُعامِلات:

```jsx
<button onClick={() => this.handleClick(id)} />
```

يُكافِئ هذا استدعاء ‎`.bind`:

```jsx
<button onClick={this.handleClick.bind(this, id)} />
```

#### مثال: تمرير المُعامِلات باستخدام خاصيّات البيانات {#example-passing-params-using-data-attributes}

```jsx
const A = 65 // ASCII character code

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }
  handleClick(letter) {
    this.setState({ justClicked: letter });
  }
  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} onClick={() => this.handleClick(letter)}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

#### مثال: تمرير المُعامِلات باستخدام خاصيّات البيانات {#example-passing-params-using-data-attributes}

بإمكانك بشكل بديل استخدام واجهات برمجة التطبيق في DOM لتزين البيانات التي تحتاجها من أجل مُعالِجات الأحداث. اتبع هذه الطريقة إن احتجت لضبط عدد كبير من العناصر أو كنتَ تمتلك شجرة تصيير تعتمد على اختبارات التساوي الخاصّة بالصنف `React.PureComponent`:

```jsx
const A = 65 // ASCII character code

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }

  handleClick(e) {
    this.setState({
      justClicked: e.target.dataset.letter
    });
  }

  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} data-letter={letter} onClick={this.handleClick}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

### كيف أستطيع منع استدعاء الدالة بسرعة كبيرة أو مرات عديدة؟ {#how-can-i-prevent-a-function-from-being-called-too-quickly-or-too-many-times-in-a-row}

إن كان لديك مُعالِج أحداث مثل `onClick` أو `onScroll` وكنتَ ترغب في منع إطلاق رد النداء بسرعة كبيرة، فتستطيع تحديد معدّل تنفيذ رد النداء. يُمكِن فعل ذلك باستخدام:

- **تقنية الخنق (throttling)**: معاينة التغييرات بناءً على تردد معتمد على الوقت (باستخدام [`_.throttle`](https://lodash.com/docs#throttle)).
- **منع الارتداد (debouncing)**: نشر التغييرات بعد مدّة زمنيّة معينة من عدم الفاعليّة (باستخدام [`_.debounce`](https://lodash.com/docs#debounce)).
- **الخنق باستخدام `requestAnimationFrame`**: معاينة التغييرات بناءً على [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) (باستخدام [`raf-schd`](https://github.com/alexreardon/raf-schd)).

انظر إلى [هذا المخطط](http://demo.nimius.net/debounce_throttle/) للمقارنة بين الدالتين `throttle` و `debounce`.

> ملاحظة:
>
> تُزوّدنا الدوال ‎`_.debounce`، و `_.throttle`، و `raf-schd` بتابع للإلغاء `cancel` لإلغاء ردود النداء المتأخرة. يجب إمّا استدعاء هذا التابع من خلال التابع `componentWillUnmount` _أو_ التحقق من أنّ المكون لا يزال موصولًا ضمن دالة التأخير.

#### الخنق (Throttle) {#throttle}

يمنع الخنق استدعاء الدالة أكثر من مرّة ضمن النافذة الزمنيّة المُعطاة. يخنق المثال التالي مُعالِج الأحداث "click" لمنع استدعائه أكثر من مرّة في الثانية.

```jsx
import throttle from 'lodash.throttle';

class LoadMoreButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickThrottled = throttle(this.handleClick, 1000);
  }

  componentWillUnmount() {
    this.handleClickThrottled.cancel();
  }

  render() {
    return <button onClick={this.handleClickThrottled}>تحميل المزيد</button>;
  }

  handleClick() {
    this.props.loadMore();
  }
}
```

#### منع الارتداد (Debounce) {#debounce}

يضمن منع الارتداد عدم تنفيذ الدالة حتى مرور فترة معينة من الوقت منذ آخر استدعاء لها. يكون هذا مفيدًا عندما يتوجب عليك إجراء بعض الحسابات المكلفة استجابةً لحدث قد ينتهي بسرعة (مثل النزول بالصفحة scroll أو أحداث لوحة المفاتيح). يمنع المثال التالي الارتداد في حقل إدخال نصي مع تأخير 250 ميلي ثانية.

```jsx
import debounce from 'lodash.debounce';

class Searchbox extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.emitChangeDebounced = debounce(this.emitChange, 250);
  }

  componentWillUnmount() {
    this.emitChangeDebounced.cancel();
  }

  render() {
    return (
      <input
        type="text"
        onChange={this.handleChange}
        placeholder="Search..."
        defaultValue={this.props.value}
      />
    );
  }

  handleChange(e) {
    // React pools events, so we read the value before debounce.
    // Alternately we could call `event.persist()` and pass the entire event.
    // For more info see reactjs.org/docs/events.html#event-pooling
    this.emitChangeDebounced(e.target.value);
  }

  emitChange(value) {
    this.props.onChange(value);
  }
}
```

#### الخنق باستخدام `requestAnimationFrame` {#requestanimationframe-throttling}

إنّ [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) هو عبارة عن طريقة لوضع الدالة في طابور لتنفيذه في المتصفح في الوقت المثالي لتحسين أداء التصيير. تُطلَق الدالة التي توضع في الطابور باستخدام `requestAnimationFrame` في الإطار الزمني التالي. سيعمل المتصفح بجد لضمان الحصول على 60 إطار في الثانية (60 fps). إن لم يكن المتصفح قادرًا على ذلك فسـ*يحد* عدد الإطارات في الثانية. على سبيل المثال قد يكون جهازك قادر على التعامل فقط مع 30 إطار بالثانية لذا ستحصل على 30 إطار بالثانية فقط. إنّ استخدام `requestAnimationFrame` للخنق هو تقنية مفيدة تمنع من إجراء أكثر من 60 تحديث في الثانية. إن كنت تجري 100 تحديث في الثانية فسيؤدي ذلك إلى إنشاء عمل إضافي على المتصفح والذي لن يراه المستخدم على أية حال.

>**ملاحظة:**
>
>استخدام هذه التقنية سيلتقط فقط آخر قيمة منشورة في الإطار. بإمكانك رؤية مثال حول كيفية عمل هذا الضبط من [هنا](https://developer.mozilla.org/en-US/docs/Web/Events/scroll).

```jsx
import rafSchedule from 'raf-schd';

class ScrollListener extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);

    // إنشاء دالة جديدة لجدولة التحديثات
    this.scheduleUpdate = rafSchedule(
      point => this.props.onScroll(point)
    );
  }

  handleScroll(e) {
    // عند استقبال حدث تمرير, جدول تحديثًا
    // إن استقبلنا الكثير من التحديثات ضمن الإطار فسننشر آخر قيمة فقط
    this.scheduleUpdate({ x: e.clientX, y: e.clientY });
  }

  componentWillUnmount() {
    // إلغاء أي تحديثات منتظرة بما أننا سنفصل المكون
    this.scheduleUpdate.cancel();
  }

  render() {
    return (
      <div
        style={{ overflow: 'scroll' }}
        onScroll={this.handleScroll}
      >
        <img src="/my-huge-image.jpg" />
      </div>
    );
  }
}
```

#### اختبار حدود معدل تحديث الإطار لديك {#testing-your-rate-limiting}

عند اختبار حدود معدل تحديث الإطار من المفيد امتلاك القدرة على تمرير الزمن بسرعة. إن كنت تستخدم [`jest`](https://facebook.github.io/jest/) بإمكانك استخدام [`محاكيات الوقت`](https://facebook.github.io/jest/docs/en/timer-mocks.html) لتمرير الوقت بسرعة. إن كنت تستخدم الخنق عن طريق `requestAnimationFrame` فهنالك الأداة [`raf-stub`](https://github.com/alexreardon/raf-stub) مفيدة للتحكم بضبط تحريك الإطارات.
