---
id: lifting-state-up
title: رفع الحالات المستوى الأعلى
permalink: docs/lifting-state-up.html
prev: forms.html
next: composition-vs-inheritance.html
redirect_from:
  - "docs/flux-overview.html"
  - "docs/flux-todo-list.html"
---

عادةً ما تحتاج المُكوِّنات المُتعدِّدة إلى أن تعكس نفس البيانات المتغيّرة. نُوصي برفع الحالة المشتركة بينها إلى أقرب عنصر أب مشترك بينها، فلنشاهد كيف يُمكِن تطبيق ذلك عمليًّا.

في هذا القسم سنُنشِئ آلة حاسبة للحرارة والتي تحسب إن كان الماء سيغلي في الدرجة المُعطاة.

سنبدأ بمُكوِّن يُدعى `BoilingVerdict`، والذي يقبل درجة الحرارة بالسيلزيوس `celsius` كخاصيّة props له، ويطبع إن كانت هذه الدرجة كافية لغلي الماء:

```js{3,5}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}
```

سنُنشِئ الآن مُكوِّن الآلة الحاسبة `Calculator`، والذي يُصيِّر حقل إدخال `<input>` يُتيح لنا إدخال درجة الحرارة ويحتفظ بقيمتها في `this.state.temperature`.  

يُصيِّر هذا المُكوِّن أيضًا المُكوِّن `BoilingVerdict` مع تزويده بدرجة الحرارة التي أدخلها المستخدم:

```js{5,9,13,17-21}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>Enter temperature in Celsius:</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />
        <BoilingVerdict
          celsius={parseFloat(temperature)} />
      </fieldset>
    );
  }
}
```

[**جرّب المثال على موقع CodePen**](https://codepen.io/gaearon/pen/ZXeOBm?editors=0010)

## إضافة حقل إدخال آخر {#adding-a-second-input}

المتطلّب الآخر الذي نريده إلى جانب إدخال الحرارة بالسيلزيوس هو تزويد المستخدم بحقل إدخال لدرجة الحرارة بالفهرنهايت وإبقائهما متزامنين معًا.  

بإمكاننا البدء باستخراج المُكوِّن `TemperatureInput` من المُكوِّن `Calculator`. سنضيف خاصيّة جديدة وهي المقياس `scale` والتي يُمكِن أن تكون قيمتها `"c"` أو `"f"`:

```js{1-4,19,22}
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

نستطيع الآن تغيير المُكوِّن `Calculator` لتصيير حقلين منفصلين لإدخال درجة الحرارة:

```js{5,6}
class Calculator extends React.Component {
  render() {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}
```

[**جرّب المثال على موقع CodePen**](https://codepen.io/gaearon/pen/jGBryx?editors=0010)

نمتلك الآن حقلي إدخال، ولكن إن أدخلت درجة الحرارة في أحدهما فلن تتحدّث قيمة الآخر، وهذا يتعارض مع متطلّباتنا بأن نجعل القيمتين متزامنتان.

لا يُمكننا أيضًا عرض المُكوِّن `BoilingVerdict` من خلال المُكوِّن `Calculator`، حيث لا يعرف هذا الأخير درجة الحرارة الحاليّة لأنّها مخفيّة بداخل المُكوِّن `TemperatureInput`.

## كتابة دوال التحويل {#writing-conversion-functions}

سنكتب أولًا دالتين للتحويل من سيلزيوس إلى فهرنهايت وبالعكس:

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

تُحوِّل هاتان الدالتان الأرقام، سنكتب دالة أخرى تقبل سلسلة نصيّة لدرجة الحرارة `temperature` ودالة للتحويل تستقبل وسائط وتُعيد سلسلة نصيّة. سنستخدمها لحساب قيمة أحد حقول الإدخال بناءً على قيمة الآخر.  

تُعيد هذه الدالة سلسلة نصيّة فارغة عند إدخال درجة حرارة `temperature` خاطئة، وتُقرِّب الناتج إلى ثلاث قيم بعد الفاصلة:

```js
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```

على سبيل المثال استخدام هذه الدالة بالشكل `‎tryConvert('abc', toCelsius)‎` يُعيد سلسلة نصيّة فارغة، واستخدامها بالشكل `‎tryConvert('10.22', toFahrenheit)`‎ يُعيد القيمة `'50.396'`.

## رفع الحالة للأعلى {#lifting-state-up}

يحتفظ إلى حدّ الآن كل من المُكوِّنين `TemperatureInput` بقيمهما بشكلٍ مُستقلٍ في الحالة المحليّة:

```js{5,9,13}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    // ...  
```

ولكن نريد مزامنة هذين الحقلين مع بعضهما، فعندما نُحدِّث حقل إدخال درجة الحرارة بالسيلزيوس فيجب على حقل درجة الحرارة بالفهرنهايت أن يعكس قيمة درجة الحرارة المُحوَّلة، وبالعكس.
تُنفَّذ مشاركة الحالة في React عن طريق نقلها إلى أقرب مُكوِّن مشترك للمُكوِّنات التي تحتاجها، ويُدعى هذا برفع الحالة للأعلى (lifting state up). سنُزيل الحالة المحليّة من `TemperatureInput` وننقلها إلى `Calculator` بدلًا من ذلك.

إن كان المُكوِّن `Calculator` يمتلك الحالة المشتركة، فسيُصبِح "مصدر الحقيقة" بالنسبة لدرجة الحرارة الحاليّة في حقلي الإدخال، حيث يُمكِنه توجيه الأوامر لهما بأن يمتلكا قيم متوافقة مع بعضهما. بما أنّ الخاصيّات props في المكونين `TemperatureInput` قادمة من نفس الأب وهو المُكوِّن `Calculator`، فسيبقى الحقلان متزامنين دومًا.

فلنشاهد كيفية عمل ذلك خطوةً بخطوة.

بدايةً سنضع `this.props.temperature` بدلًا من `this.state.temperature` في المُكوِّن `TemperatureInput`. فلنفترض الآن وجود `this.props.temperature` على الرغم من أنّنا سنحتاج إلى تمريره من المُكوِّن `Calculator`:

```js{3}
  render() {
    // Before: const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

نعلم أنّ [الخاصيّات قابلة للقراءة-فقط](/docs/components-and-props.html#props-are-read-only)، فعندما كانت درجة الحرارة `temperature` في الحالة المحليّة لم يكن بإمكان المُكوِّن `TemperatureInput` إلّا أن يستدعي التابع `this.setState()`‎ لتغييرها.  

أمّا الآن وقد أصبحت درجة الحرارة `temperature` قادمة من الأب كخاصيّة prop فلا يمتلك `TemperatureInput` أي قدرة على التحكّم بها.
تُحلّ هذه المشكلة عادةً في React عن طريق جعل المُكوِّن مضبوطًا (controlled)، فكما يقبل العنصر `<input>` خاصيّات للقيمة `value` و `onChange`، فبإمكان العنصر المُخصَّص `TemperatureInput` أن يقبل خاصيّة لدرجة الحرارة `temperature` و خاصيّة عند تغيير درجة الحرارة `onTemperatureChange` من المُكوِّن الأب له وهو `Calculator`.

عندما يُريد الآن `TemperatureInput` تحديث درجة حرارته يستدعي `this.props.onTemperatureChange`:

```js{3}
  handleChange(e) {
    // Before: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```

>ملاحظة:
>
> ليس هنالك معنى خاص لأسماء الخاصيّات `temperature` و `onTemperatureChange` في المُكوِّنات المُخصَّصة، فقد كان بإمكاننا تسميتها بأي اسم آخر، مثل الاسم `value` و `onChange` والتي هي أسماء شائعة.

سيُزوِّدنا المُكوِّن `Calculator` بالخاصّيتين `onTemperatureChange` و `temperature`، حيث سيتعامل مع التغيير عن طريق تعديل حالته المحليّة وبذلك يُعيد تصيير حقلي الإدخال بالقيم الجديدة، سننظر إلى شيفرة المُكوِّن `Calculator` قريبًا.

قبل الخوض في التغييرات في المُكوِّن `Calculator` فلنتذكّر التغييرات التي أحدثناها حتى الآن في المُكوِّن `TemperatureInput`، لقد أزلنا حالته المحليّة وبدلًا من استخدام `this.state.temperature` فإنّنا نستخدم الآن `this.props.temperature`. وبدلًا من استدعاء `this.setState()`‎ عندما نريد إحداث تغيير نستدعي الآن `this.props.onTemperatureChange()`‎ والتي يُزوِّدنا بها المُكوِّن `Calculator`:

```js{8,12}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

والآن فلننتقل إلى المُكوِّن Calculator.  

سنُخزِّن درجة الحرارة المُدخَلَة `temperature` والمقياس `scale` في حالته المحليّة، وهي الحالة التي رفعنا مستواها للأعلى من حقول الإدخال والتي ستخدم كمصدر للحقيقة لتلك الحقول. يُمثِّل ذلك بشكلٍ مصغّر جميع البيانات التي نحتاج معرفتها من أجل تصيير الحقول.  

على سبيل المثال إن أدخلنا القيمة 37 إلى حقل إدخال السيلزيوس، فستكون حالة المُكوِّن `Calculator` هي:

```js
{
  temperature: '37',
  scale: 'c'
}
```

إن عدّلنا لاحقًا حقل درجة الحرارة بالفهرنهايت إلى 212 فستُصبِح حالة `Calculator` كما يلي:

```js
{
  temperature: '212',
  scale: 'f'
}
```

كان بإمكاننا تخزين قيمة كلا الحقلين ولكن تبيّن أنّ هذا غير ضروري، فيكفي تخزين القيمة التي تغيّرت مُؤخّرًا فقط والمقياس الذي يُمثّلها. باستطاعتنا بعد ذلك تبديل قيمة الحقل الآخر اعتمادًا على قيم `temperature` و `scale` فقط. يبقى حقلا الإدخال متزامنين لأنّ قيمهما محسوبة من نفس الحالة:

```js{6,10,14,18-21,27-28,31-32,34}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```

[**جرّب المثال على موقع CodePen**](https://codepen.io/gaearon/pen/WZpxpz?editors=0010)

لا يُهم الآن أي حقل إدخال تُعدِّل، فستُحدَّث `this.state.temperature` و `this.state.scale` الموجودة في المُكوِّن `Calculator`، حيث يأخذ أحد الحقلين القيمة التي تدخلها ويُعاد حساب قيمة الآخر بناءً عليها.

فلنعد تلخيص ما يحدث عند تعديلك لحقل الإدخال:

* تستدعي React الدالة المُحدَّدة في الخاصيّة `onChange` كما هو الحال عند استخدام العنصر `<input>` في DOM. في حالتنا التابع المطلوب هو `handleChange` الموجود في المُكوِّن `TemperatureInput`.
* يستدعي التابع `handleChange` الموجود ضمن المُكوِّن `TemperatureInput` الدالة `this.props.onTemperatureChange()`‎ مع القيمة الجديدة المطلوبة. مع العلم أنّ خاصيّات هذا المُكوِّن props بما في ذلك `onTemperatureChange` قد زوّدنا بها المُكوِّن الأب له وهو `Calculator`.
* عندما صيّرنا `Calculator` مُسبقًا فقد حدَّد أنّ الدالة `onTemperatureChange` من المُكوِّن `TemperatureInput` ذو المقياس سيلزيوس هي نفسها التابع `handleCelsiusChange` الخاص بالمُكوِّن `Calculator`، والدالة `onTemperatureChange` من المُكوِّن `TemperatureInput` ذو المقياس فهرنهايت هي نفسها التابع `handleFahrenheitChange` الخاص بالمُكوِّن `Calculator`، لذلك يُستدعى أي من هذان التابعان اعتمادًا على حقل الإدخال الذي عدّلنا قيمته.
* بداخل هذين التابعين يطلب المُكوِّن `Calculator` من React أن تُعيد تصييره عن طريق استدعاء `this.setState()`‎ بقيم حقول الإدخال الجديدة والمقياس الحالي لحقل الإدخال الذي عدّلناه.
* تستدعي React التابع `render` الخاص بالمُكوِّن `Calculator` لتعرف الشكل الذي ينبغي أن تكون عليه واجهة المستخدم. يُعاد حساب قيم حقول الإدخال بناءً على درجة الحرارة الحاليّة والمقياس قيد الاستخدام، تُحوَّل درجة الحرارة هنا.
* تستدعي React التابع `render` الخاص بكل مُكوِّن `TemperatureInput` مع خاصيّاتها props الجديدة المُحدَّدة عن طريق المُكوِّن `Calculator`، وبذلك تعرف الشكل الذي ينبغي أن تكون عليه واجهة المستخدم.
* تستدعي React التابع `render` الخاص بمُكوِّن `BoilingVerdict` ، وتمرير درجة الحرارة في درجة مئوية كوسيط.
* تُحدِّث React DOM واجهة DOM لتُطابِق القيم المُدخَلَة المطلوبة، حيث يحتوي حقل الإدخال الذي عدّلناه القيمة التي أدخلناها بأنفسنا، أمّا حقل الإدخال الآخر فيُحدَّث بدرجة الحرارة بعد تحويلها للمقياس المُناسِب.

يجري كل تحديث بنفس الخطوات بحيث تبقى حقول الإدخال متزامنة.

## الدروس المستفادة {#lessons-learned}

يجب أن يكون هناك "مصدر وحيد للحقيقة" لأيّة بيانات مُتغيِّرة في تطبيق React. تُضاف الحالة عادةً إلى المُكوِّن الذي يحتاجها للتصير أولًا، بعد ذلك إن كانت تحتاجها مُكوِّنات أخرى فبإمكانك رفعها إلى أقرب مُكوِّن مشترك. وبدلًأ من محاولة مزامنة الحالة بين مُكوِّنات مختلفة ينبغي عليك الاعتماد على  [تدفق البيانات للمستويات الأدنى](/docs/state-and-lifecycle.html#the-data-flows-down).

يتضمّن رفع الحالة كتابة شيفرة سلسة أكثر من محاولة إجراء ربط ثنائي الاتجاه، ولكن فائدة ذلك هي عدم بذل جهد كبير في محاولة إيجاد الأخطاء. بما أنّ الحالة تعيش ضمن المُكوِّن وهو وحده من يُمكنِه تغييرها، يُقلِّل ذلك من فرصة ارتكاب أخطاء. بإمكانك أيضًا تنفيذ أي منطق مُخصَّص لرفض أو تحويل مُدخلات المستخدم.

إن كان هنالك شيء يجب اشتقاقه إمّا من الخاصيّأت أو الحالات فبالتأكيد ليس من الحالات، فمثلًا بدلًا من تخزين قيمة درجة الحرارة بمتغيرين للسيلزيوس والفهرنهايت `celsiusValue` و `fahrenheitValue`، نُخزِّن فقط آخر قيمة مُعدَّلة للحرارة `temperature` ومقياسها `scale`، حيث يُمكِن حساب قيمة الحقل الآخر دومًا منها في التّابع `render()`‎. يُتيح لنا هذا مسح أو تقريب الحقل الآخر إلى أقرب قيمة بدون خسارة أي دقّة في مُدخلات المستخدم.

عندما تجد خطأً في واجهة المستخدم فبإمكانك استخدام [أدوات تطوير React](https://github.com/facebook/react-devtools) لفحص الخاصيّات والتنقّل في شجرة العناصر للأعلى حتى تجد المُكوِّن المسؤول عن تحديث الحالة. يُتيح لك ذلك تتبّع الخطأ حتى الوصول إلى مصدره:

<img src="../images/docs/react-devtools-state.gif" alt="Monitoring State in React DevTools" max-width="100%" height="100%">

