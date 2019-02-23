---
id: forms
title: النماذج
permalink: docs/forms.html
prev: lists-and-keys.html
next: lifting-state-up.html
redirect_from:
  - "tips/controlled-input-null-value.html"
  - "docs/forms-zh-CN.html"
---

تعمل عناصر النماذج بشكلٍ مختلفٍ قليلًا عن بقيّة عناصر DOM الأخرى في React بسبب احتفاظ عناصر النماذج بشكل طبيعي بحالة داخلية خاصّة بها. فمثلًا يقبل هذا النموذج في HTML اسمًا واحدًا:

```html
<form>
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form>
```

يمتلك هذا النموذج نفس السّلوك الافتراضي لنماذج HTML من حيث الانتقال إلى صفحة جديدة عندما يضغط المستخدم على زر تقديم البيانات (Submit)، وإن أردت فقط هذا السّلوك في React فسيعمل بشكل جيّد معك، ولكن في معظم الأحيان من الملائم أكثر أن نمتلك دالة في JavaScript تتعامل مع تقديم البيانات ولديها الوصول إلى البيانات التي أدخلها المستخدم في النموذج. الطريقة القياسيّة لتحقيق هذا الأمر هي باستخدام تقنيّة تدعى المُكوِّنات المضبوطة (controlled components).

## المكونات الخاضعة للرقابة {#controlled-components}
 
تُحافِظ عناصر النموذج في HTML مثل `<input>`، و `<textarea>`، و `<select>` على حالتها الخاصّة وتُحدِثها وفقًا لمُدخلات المستخدم. أمّا في React فيُحتفَظ بحالة قابلة للتعديل ضمن خاصيّة الحالة للمُكوِّنات وتُحدَّث فقط عن طريق التابع [`setState()‎`](/docs/react-component.html#setstate).

بإمكاننا الجمع بينهما بأن نجعل حالة React المصدر الوحيد للحقيقة، فبذلك يُصبِح مُكوِّن React الذي يُصيِّر النموذج مُتحكِّمًا أيضًا بما يحدث في ذلك النموذج مع تتالي مُدخلات المستخدم. يُدعى عنصر الإدخال والذي تتحكّم React بقيمته بالمُكوِّن المضبوط.

على سبيل المثال إن أردنا في المثال السّابق أن نعرض الاسم بعد تقديمه فبإمكاننا كتابة النموذج كمُكوِّن مضبوط:

```javascript{4,10-12,24}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**جرب المثال على موقع CodePen**](https://codepen.io/gaearon/pen/VmmPgp?editors=0010)

لمّا كانت خاصيّة القيمة `value` مُعيَّنة عن طريق عنصر النموذج فستكون قيمتها المعروضة دومًا هي `this.state.value`، وبذلك نجعل حالة React المصدر الوحيد للحقيقة. وبما أنّ التابع `handleChange` يُنفَّذ عند كل ضغطة زر من المستخدم ليُحدِّث حالة React، فستتحدّث القيمة المعروضة بينما يكتب المستخدم.

في المكونات الخاضعة للرقابة يكون لكل تغيير للحالة دالة للتعامل مع ذلك مُوافِقة له. يجعل ذلك من تعديل دخل المستخدم والتحقّق منه أمرًا سهلًا، فمثلًا لو أردنا إجبار المستخدم على كتابة الأحرف بحالة كبيرة سنكتب الدالة `handleChange` كما يلي:

```javascript{2}
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}
```

## العنصر textarea {#the-textarea-tag}

في HTML يُعرَّف نص العنصر `<textarea>` بشكلٍ مباشر كما يلي:

```html
<textarea>
  Hello there, this is some text in a text area
</textarea>
```

أمّا في React يستخدم العنصر `<textarea>` الخاصيّة `value` بدلًا من ذلك، وبهذه الطريقة يُمكِن كتابة النموذج الذي يستخدم `<textarea>` بشكلٍ مُشابِه للحقل الذي يستخدم عنصر الإدخال `<input>`:

```javascript{4-6,12-14,26}
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

لاحظ أنّنا هيَّأنا `this.state.value` بقيمة مبدئيّة في الدالة البانية (constructor)، وبذلك نضمن وجود نص ضمن العنصر `<textarea>` منذ البداية.

## العنصر select {#the-select-tag}

في HTML يُنشِئ العنصر `<select>` قائمة مُنسدِلة، فمثلًا تُنشِئ هذه الشيفرة قائمة مُنسدِلة ببعض أسماء الفاكهة:

```html
<select>
  <option value="grapefruit">Grapefruit</option>
  <option value="lime">Lime</option>
  <option selected value="coconut">Coconut</option>
  <option value="mango">Mango</option>
</select>
```

لاحظ أنّ الخيار المبدئي هنا هو البرتقال بسبب وجود الخاصيّة `selected` بجانبه، ولكن في React بدلًا من استخدام الخاصيّة `selected` نستخدم الخاصيّة `value` ضمن العنصر `<select>` وهذا أسهل في المُكوِّنات المضبوطة لأنّك ستحتاج لتعديلها فقط في مكانٍ واحد. على سبيل المثال:

```javascript{4,10-12,24}
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick your favorite flavor:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**جرِّب المثال على موقع CodePen**](https://codepen.io/gaearon/pen/JbbEzX?editors=0010)

وبهذا نجد أنّ العناصر ‎`<input type="text"‎>‎` و `<textarea>` و `<select>` تعمل بشكلٍ مماثل، فجميعها تقبل الخاصيّة value والتي نستخدمها لتنفيذ المُكوِّن المضبوط.

ملاحظة: بإمكانك تمرير مصفوفة إلى الخاصيّة `value` حيث يُتيح لك ذلك انتقاء عدّة خيارات في العنصر `<select>` :

> ملاحظة
>
> بإمكانك تمرير مصفوفة إلى الخاصيّة `value` حيث يُتيح لك ذلك انتقاء عدّة خيارات في العنصر `<select>` :
>
>```js
><select multiple={true} value={['B', 'C']}>
>```

## عنصر إدخال الملفات {#the-file-input-tag}

في HTML يُتيح العنصر ‎`<input type="file">`‎ للمستخدم أن يختار ملفًّا واحدًا أو أكثر من جهازه لتحميلها إلى الخادم أو التعامل معها عن طريق JavaScript وذلك عبر [واجهة برمجة التطبيق الخاصّة بالملف](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

وبما أنّ قيمته هي قابلة للقراءة-فقط فهو مُكوِّن غير مضبوط (uncontrolled component) في React، سنناقش هذا المُكوِّن مع المُكوِّنات غير المضبوطة الأخرى في
 [قسمها الخاص](/docs/uncontrolled-components.html#the-file-input-tag).

## التعامل مع إدخالات متعددة {#handling-multiple-inputs}

عندما تحتاج إلى التعامل مع عناصر `input` مُتعدِّدة مضبوطة فبإمكانك إضافة الخاصيّة `name` إلى كل عنصر وتترك لدالة معالجة الأحداث أن تختار ما ستفعله بناءً على قيمة `event.target.name`.  
 فلنأخذ هذا المثال:

```javascript{15,18,28,37}
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

[**جرّب المثال على موقع CodePen**](https://codepen.io/gaearon/pen/wgedvV?editors=0010)

  لاحظ كيف استخدمنا صياغة ES6 [اسم الخاصيّة المحسوب](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names)  لتحديث مفتاح    الحالة بما يُوافِق الاسم المُدخَل:

```js{2}
this.setState({
  [name]: value
});
```

يُكافِئ الشيفرة السّابقة في ES5 ما يلي:

```js{2}
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

بما أنّ الدالة `setState()`‎ تدمج تلقائيًّا [حالة جزئيّة مع الحالة الحاليّة](/docs/state-and-lifecycle.html#state-updates-are-merged) سنحتاج فقط إلى استدعائها مع الأجزاء المتغيّرة.

## الإدخالات المضبوطة ذات القيمة Null {#controlled-input-null-value}

يمنع تحديد الخاصيّة `value` في [المُكوِّنات المضبوطة](/docs/forms.html#controlled-components) المستخدم من تغيير المُدخلات ما لم ترغب بذلك. إن حدَّدت القيمة `value` وبقي العنصر `input` قابلًا للتعديل فربّما قد عيّنت `value` إلى القيمة `undefined` أو `null` من غير قصد.

تُوضِّح الشيفرة التالية هذا (يكون العنصر input مقفولًا في البداية ثم يُصبِح قابلًا للتعديل بعد فترة زمنيّة قصيرة):

```javascript
ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);

```

## بدائل المكونات الخاضعة للرقابة {#alternatives-to-controlled-components}

قد يُصبِح استخدام المكونات الخاضعة للرقابة مُمِلًّا أحيانًا لأنّك تحتاج إلى كتابة مُعالِج أحداث لكل طريقة قد تتغيّر بها بياناتك وإلى توجيه جميع حالات الإدخال عبر مُكوِّن React. يُصبِح هذا مُزعجًا بشكلٍ خاص عند تحويل الشيفرة الموجودة سابقًا إلى React أو عند دمج تطبيق React مع مكتبة أخرى. في هذه الحالات قد ترغب باستخدام المُكوِّنات غير المضبوطة 
([uncontrolled components](/docs/uncontrolled-components.html))
، وهي تقنيّة بديلة للتعامل مع حقول الإدخال.

## حلول أخرى متكاملة {#fully-fledged-solutions}

إذا كنت تبحث عن حل كامل بما في ذلك التحقق من صحة الحقول، وتتبع الحقول التي قمت بزيارتها، والتعامل مع إرسال النموذج، فإن 
[Formik](https://jaredpalmer.com/formik)
 هو أحد الخيارات الشائعة. ومع ذلك، فهو مبني على نفس المبادئ للمكونات الخاضعة للرقابة وإدارة الحالة(state) - لذا لا تهمل تعلمها.
