---
id: integrating-with-other-libraries
title: التكامل مع المكتبات الأخرى
permalink: docs/integrating-with-other-libraries.html
---

يمكن استخدام React في أي تطبيق ويب وتضمينها في تطبيقات أخرى، ويمكن أيضًا بجهد قليل تضمين المكتبات الأخرى مع React. سنتحدث في هذه الصفحة ع ن بعض أشيع الحالات مع التركيز على التكامل مع [jQuery](https://jquery.com/) و [Backbone](https://backbonejs.org/)، ولكن يمكن تطبيق نفس الأفكار لتكامل المكوّنات مع أي شيفرة موجودة حاليًّا.


## إضافات التكامل مع DOM {#integrating-with-dom-manipulation-plugins}

لا تعلم React بأي تغيير يحصل على DOM من خارج نطاق React. فهي تُحدِّد التحديثات بناءً على تمثيلها الداخلي الخاص، وإن عدّلت أي مكتبة أخرى على نفس عقدة DOM، فستختلط الأمور على React ولن تتمكن من إدراك ما يحصل.

لا يعني هذا استحالة أو صعوبة جمع React مع طرق أخرى للتعديل على DOM، ولكن يجب أن تكون على معرفة بما يجري.

أسهل طريقة لتجنب التضاربات هي منع مكوّن React من التحديث. بإمكانك فعل ذلك عن طريق تصيير عناصر لا داع لتحديثها في React، مثل عنصر ‎`<div />`‎ الفارغ.

### كيفيّة حل المشكلة {#how-to-approach-the-problem}

لتوضيح هذا فلنصنع حاوية لإضافة عامّة في jQuery.

سنُرفِق [ref](/docs/refs-and-the-dom.html) إلى عنصر DOM الجذري. وبداخل التابع `componentDidMount` سنحصل على مرجع له لكي نستطيع تمريره إلى إضافة jQuery.

ولمنع React من الاقتراب من DOM بعد الوصل، فسنعيد عنصر ‎`<div />` فارغ من التابع `render()`، لا يمتلك هذا العنصر أي خاصيّات أو أبناء، لذا لا تملك React سببًا لتحديثه، وبذلك نترك إضافة jQuery حرّة لإدارة ذلك الجزء من DOM:

```js{3,4,8,12}
class SomePlugin extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.somePlugin();
  }

  componentWillUnmount() {
    this.$el.somePlugin('destroy');
  }

  render() {
    return <div ref={el => this.el = el} />;
  }
}
```

لاحظ أننا عرّفنا [توابع دورة الحياة](/docs/react-component.html#the-component-lifecycle) `componentDidMount` و `componentWillUnmount`. تربط العديد من إضافات jQuery مستمعات للأحداث إلى DOM لذا من الهام فصلها في التابع `componentWillUnmount`. إن لم تزودنا الإضافة بطريقة لمسح كل شيء بعد الانتهاء، فيجب عليك إضافة طريقتك الخاصة مع تذكر إزالة أي مستمع للأحداث سجلته الإضافة لمنع أي تسريب في الذاكرة.

### التكامل مع إضافة jQuery التي تدعى Chosen {#integrating-with-jquery-chosen-plugin}

للحصول على مثال أكثر وضوحًا عن هذه المفاهيم فلنكتب تغليفًا للإضافة [Chosen](https://harvesthq.github.io/chosen/) والتي تضيف حقل الإدخال `<select>`.

>**ملاحظة:**
>
>لا تعني إمكانيّة فعل ذلك أنّ هذه هي الطريقة الأفضل من أجل تطبيقات React. نشجعك دومًا على استخدام المكوّنات قدر الإمكان، حيث من الأسهل إعادة استخدامها في تطبيقات React وتُعطينا تحكّمًا أكبر في السلوك والمظهر.

فلننظر أولًا إلى تأثير الإضافة Chosen على DOM.

إن استدعيتها على عقدة DOM لحقل الاختيار `<select>` فستقرأ الخاصيّات من عقدة DOM الأصليّة، وتخفيها باستخدام التنسيق السطري (inline)، وتُلحِق بعد ذلك عقدة DOM منفصلة مع تمثيلها الخاص بها بعد العنصر `<select>`. بعد ذلك تُطلِق أحداث jQuery لتنبيهنا حول التغييرات.

فلنفترض أنّ هذه هي واجهة برمجة التطبيقات (API) التي نرغب بإضافتها مع المكوّن ‎`<Chosen>`‎:

```js
function Example() {
  return (
    <Chosen onChange={value => console.log(value)}>
      <option>vanilla</option>
      <option>chocolate</option>
      <option>strawberry</option>
    </Chosen>
  );
}
```

سننفذها [كمكوّن غير مضبوط ](/docs/uncontrolled-components.html) للسهولة.

سنُنشِئ أولًا مكوّنًا فارغًا مع التابع `render()` حيث نعيد الحقل ‎`<select>`‎ مُغلَّفًا ضمن عنصر ‎`<div>`‎:

```js{4,5}
class Chosen extends React.Component {
  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

لاحظ كيف غلّفنا ‎`<select>` ضمن عنصر ‎`<div>` إضافي. يكون هذا ضروريًّا لأنّ Chosen ستُلحِق عنصر DOM آخر مباشرةً بعد عقدة العنصر ‎`<select>`‎ التي مررناها إليها. ولكن على حد علم React فإنّ العنصر ‎`<div>` يمتلك ابنًا واحدًا فقط. بهذا نضمن عدم تضارب تحديثات React مع عُقَد DOM الإضافية التي تُضيفها Chosen. من الهام عند تعديلك لعقد DOM خارج إطار React أن تضمن ألّا يكون هنالك سبب يجعل React تقترب من عقد DOM هذه.

سننفذ بعد ذلك توابع دورة حياة المكونات، نحتاج إلى تهيئة Chosen بالمرجع إلى عقدة ‎`<select>`‎ في التابع `componentDidMount` وحذف هذا المرجع في التابع `componentWillUnmount`:

```js{2,3,7}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();
}

componentWillUnmount() {
  this.$el.chosen('destroy');
}
```

[**جرّب المثال على موقع CodePen.**](https://codepen.io/gaearon/pen/qmqeQx?editors=0010)

لاحظ أنّ React لا تُخصِّص أي معنى مميز للحقل `this.el`. فهو يعمل فقط لأنّنا عيّناه من المرجع `ref` في التابع `render()`:

```js
<select className="Chosen-select" ref={el => this.el = el}>
```

هذا يكفينا لتصيير المكوّن، ولكننا نريد أيضًا أن تصلنا إشعارات حول القيم التي تغيّرت. لفعل ذلك سنشترك في حدث `change` في jQuery في العنصر ‎`<select>` الذي تديره Chosen.

لن نُمرِّر `this.props.onChange` بشكل مباشر إلى Chosen بسبب إمكانية تغيير خاصيّات المكوّن عبر الزمن وهذا يتضمن معالجات الأحداث. نصرّح بدلًا من ذلك عن التابع `handleChange()` الذي يستدعي `this.props.onChange` ويجعله يشترك بالحدث `change` في jQuery:

```js{5,6,10,14-16}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();

  this.handleChange = this.handleChange.bind(this);
  this.$el.on('change', this.handleChange);
}

componentWillUnmount() {
  this.$el.off('change', this.handleChange);
  this.$el.chosen('destroy');
}

handleChange(e) {
  this.props.onChange(e.target.value);
}
```

[**جرّب المثال على موقع CodePen.**](https://codepen.io/gaearon/pen/bWgbeE?editors=0010)

بقي شيء أخير يجب فعله. قد تتغيّر الخاصيّات في React مع مرور الوقت. على سبيل المثال قد يحصل المكوّن `<Chosen>` على مكوّنات أبناء مختلفين إن تغيّرت حالة المكوّن الأب له. يعني هذا أهميّة تحديث DOM بشكل يدوي في نقاط التكامل استجابةً لتحديثات الخاصيّات، بما أنّنا لم نعد نترك React تدير DOM لأجلنا.

يقترح توثيق Chosen أنّنا نستطيع استخدام الواجهة `trigger()`‎ للإعلام حول التغييرات في عنصر DOM الأصلي. سنترك React تهتم بتحديث `this.props.children` بداخل العنصر ‎`<select>`، ولكننا سنضيف أيضًا تابع دورة الحياة `componentDidUpdate()`‎ والتي تُعلِم Chosen بالتغيرات في قائمة العناصر الأبناء:

```js{2,3}
componentDidUpdate(prevProps) {
  if (prevProps.children !== this.props.children) {
    this.$el.trigger("chosen:updated");
  }
}
```

بهذه الطريقة ستعلم Chosen تحديث عنصر DOM الخاص بها بينما يبقى العنصر الابن لها وهو `<select>`‎ مُدارًا من قبل تغيير React. 

يبدو التنفيذ الكامل للمكوّن `Chosen` كما يلي:

```js
class Chosen extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.chosen();

    this.handleChange = this.handleChange.bind(this);
    this.$el.on('change', this.handleChange);
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.$el.trigger("chosen:updated");
    }
  }

  componentWillUnmount() {
    this.$el.off('change', this.handleChange);
    this.$el.chosen('destroy');
  }
  
  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

[**جرّب المثال على موقع CodePen.**](https://codepen.io/gaearon/pen/xdgKOz?editors=0010)

## التكامل مع مكتبات الإظهار الأخرى {#integrating-with-other-view-libraries}

يُمكِن تضمين React في تطبيقات أخرى بفضل مرونة التابع [`ReactDOM.render()`](/docs/react-dom.html#render).

على الرغم من أنّه من الشائع استخدام React في البداية لتحميل مكوّن React جذري وحيد إلى DOM، يُمكِن استدعاء التابع `ReactDOM.render()` عدّة مرات للأجزاء المستقلة من واجهة المستخدم والتي قد تكون صغيرة بحجم عنصر الزر button أو كبيرة بحجم تطبيق كامل.

في الواقع هذه هي طريقة استخدام React في Facebook. يُتيح لنا ذلك كتابة تطبيقات في React قطعة بقطعة، ومن ثمّ جمعها مع قوالبنا المُولَّدة من قبل الخادم ومع الشيفرات التي من جهة العميل (client-side) الأخرى.

### استبدال التصيير المعتمد على السلسلة النصية بتصيير React {#replacing-string-based-rendering-with-react}

من الأنماط الشائعة في تطبيقات الويب القديمة هي وصف مجموعة من DOM كسلسلة نصيّة وإدخالها في DOM كما يلي: ‎`$el.html(htmlString)`‎. هذه النقاط ملائمة لتقديم React، فقط أعد كتابة التصيير المعتمد على السلسلة النصيّة إلى مكوّن React.

فلنأخذ شيفرة jQuery التالية:

```js
$('#container').html('<button id="btn">قل مرحبًا</button>');
$('#btn').click(function() {
  alert('مرحبًا!');
});
```

يُمكِن إعادة كتابتها كمكوّن React كما يلي:

```js
function Button() {
  return <button id="btn">قل مرحبًا</button>;
}

ReactDOM.render(
  <Button />,
  document.getElementById('container'),
  function() {
    $('#btn').click(function() {
      alert('مرحبًا!');
    });
  }
);
```

من هنا بإمكانك إضافة المزيد من منطق React إلى هذا المكوّن والبدء بتبني المزيد من ممارسات React الشائعة. فمثلًا من الأفضل في المكوّنات عدم الاعتماد على المُعرّفات (IDs) بسبب إمكانية تصيير نفس المكوّن مرات عديدة. سنستخدم بدلًا من ذلك [نظام أحداث React](/docs/handling-events.html) ونسجل مُعالج حدث الضغط (click) بشكل مباشر على عنصر الزر `<button>`‎ في React:

```js{2,6,9}
function Button(props) {
  return <button onClick={props.onClick}>قل مرحبًا</button>;
}

function HelloButton() {
  function handleClick() {
    alert('مرحبًا!');
  }
  return <Button onClick={handleClick} />;
}

ReactDOM.render(
  <HelloButton />,
  document.getElementById('container')
);
```

[**جرّب المثال على موقع CodePen.**](https://codepen.io/gaearon/pen/RVKbvW?editors=1010)

بإمكانك امتلاك مكوّنات معزولة كما تشاء واستخدام التابع `ReactDOM.render()` لتصييرها إلى حاويات DOM مختلفة. وبينما تحوّل المزيد من شيفرة تطبيقك إلى React بشكل تدريجي، فستكون قادرًا على جمعها في مكوّنات أكبر ونقل استدعاءات التابع `ReactDOM.render()` إلى الأعلى في التسلسل الهرمي للمكوّنات.

### تضمين React في واجهة عرض Backbone {#embedding-react-in-a-backbone-view}

تستخدم واجهات عرض [Backbone](https://backbonejs.org/)  بشكل نموذجي سلاسل نصيّة أو دوال منتجة للسلاسل النصيّة لإنشاء المحتوى لعناصر DOM. يُمكِن استبدال هذه العملية بتصيير مكوّن React.

سنُنشِئ الآن واجهة عرض Backbone تُدعى `ParagraphView` والتي ستتجاوز دالة التصيير `render()`‎ في Backbone لتصيير المكوّن ‎`<Paragraph>` في React إلى عنصر DOM المُعطى من خلال Backbone (وهو`this.el`). نستخدم هنا أيضًا التابع [`ReactDOM.render()`](/docs/react-dom.html#render)‎:

```js{1,5,8,12}
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  render() {
    const text = this.model.get('text');
    ReactDOM.render(<Paragraph text={text} />, this.el);
    return this;
  },
  remove() {
    ReactDOM.unmountComponentAtNode(this.el);
    Backbone.View.prototype.remove.call(this);
  }
});
```

[**جرّب المثال على موقع CodePen.**](https://codepen.io/gaearon/pen/gWgOYL?editors=0010)

من الهام أن نستدعي أيضًا التابع `ReactDOM.unmountComponentAtNode()` في تابع الإزالة `remove` بحيث تلغي React تسجيل معالجات الأحداث والموارد الأخرى المرتبطة بشجرة المكوّن عند فصلها.

عند إزالة المكوّن *من* شجرة React، يُنفَّذ تابع المسح بشكل تلقائي، ولكن بما أننا نزيل كامل الشجرة يدويًّا فيجب أن نستدعي هذا التابع.

## التكامل مع طبقات النموذج (Model Layers) {#integrating-with-model-layers}

من المفضّل استخدام تدفق البيانات أحادي الاتجاه مثل [React state](/docs/lifting-state-up.html)، أو [Flux](https://facebook.github.io/flux/)، أو  [Redux](https://redux.js.org/)، ولكن يُمكِن لمكوّنات React استخدام طبقة النموذج (model layer) من أطر العمل والمكتبات الأخرى.

### استخدام نماذج Backbone في مكوّنات React {#using-backbone-models-in-react-components}

أبسط طريقة لاستهلاك نماذج [Backbone](https://backbonejs.org/) والمجموعات من قبل مكوّنات React هي الاستماع إلى أحداث التغيير المختلفة وإجبار التحديثات يدويًّا.

تستمع المكوّنات المسؤولة عن تصيير النماذج إلى الحدث `'change'` بينما تستمع المكوّنات المسؤولة عن تصيير المجموعات إلى الحدثين `'add'` و `'remove'`. استخدم في كلتا الحالتين التابع [`this.forceUpdate()`](/docs/react-component.html#forceupdate) لإعادة تصيير المكوّن مع البيانات الجديدة.

في المثال التالي يُصيِّر المكوّن `List` مجموعة Backbone باستخدام المكوّن `Item` لتصيير عناصر مفردة:

```js{1,7-9,12,16,24,30-32,35,39,46}
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.model.on('change', this.handleChange);
  }

  componentWillUnmount() {
    this.props.model.off('change', this.handleChange);
  }

  render() {
    return <li>{this.props.model.get('text')}</li>;
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.collection.on('add', 'remove', this.handleChange);
  }

  componentWillUnmount() {
    this.props.collection.off('add', 'remove', this.handleChange);
  }

  render() {
    return (
      <ul>
        {this.props.collection.map(model => (
          <Item key={model.cid} model={model} />
        ))}
      </ul>
    );
  }
}
```

[**جرّب المثال على موقع CodePen.**](https://codepen.io/gaearon/pen/GmrREm?editors=0010)

### استخراج البيانات من نماذج Backbone {#extracting-data-from-backbone-models}

يتطلّب الأسلوب السابق من مكوّنات React أن تكون على دراية بنماذج ومجموعات Backbone. إن قررت لاحقًا النقل إلى حل آخر لإدارة البيانات فربّما سترغب بالتركيز المعرفة على Backbone في معظم أجزاء الشيفرة قدر الإمكان.

أحد الحلول لهذه المشكلة هي استخراج خاصيّة النموذج كبيانات مجرّدة عندما تتغيّر، والاحتفاظ بهذا المنطق في مكان واحد. المثال التالي الذي سنتحدّث عنه هو عبارة عن [مكوّن ذو ترتيب أعلى](/docs/higher-order-components.html) يستخرج كل الخاصيّات من نموذج Backbone إلى حالة، مع تمرير البيانات إلى المكوّن المُغلّف.

بهذه الطريقة تحتاج فقط المكوّنات ذات الترتيب الأعلى إلى معرفة تفاصيل نموذج Backbone، أمّا باقي المكوّنات في التطبيق فتستطيع أن تبقى دون دراية بتفاصيل Backbone

في المثال التالي سنُنشِئ نسخة من خاصيّات النموذج لتشكيل الحالة المبدئية. سنشترك في الحدث `change` (ونزيل الاشتراك عند الفصل)، وعندما يحصل هذا الحدث فسنُحدِّث الحالة مع خاصيّات النموذج الحاليّة. يجب أن نحرص أخيرًا إنّه إن تغيّرت الخاصيّة `model` نفسها، فلا يجب أن ننسى إزالة الاشتراك من النموذج القديم والاشتراك بالنموذج الجديد.

لاحظ أنّ هذا المثال لا يقصد التعامل مع Backbone بشكل متقدم، ولكنّه يجب أن يعطيك فكرة عن كيفيّة التعامل معها بشكل عام:

```js{1,5,10,14,16,17,22,26,32}
function connectToBackboneModel(WrappedComponent) {
  return class BackboneComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = Object.assign({}, props.model.attributes);
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      this.props.model.on('change', this.handleChange);
    }

    componentWillReceiveProps(nextProps) {
      this.setState(Object.assign({}, nextProps.model.attributes));
      if (nextProps.model !== this.props.model) {
        this.props.model.off('change', this.handleChange);
        nextProps.model.on('change', this.handleChange);
      }
    }

    componentWillUnmount() {
      this.props.model.off('change', this.handleChange);
    }

    handleChange(model) {
      this.setState(model.changedAttributes());
    }

    render() {
      const propsExceptModel = Object.assign({}, this.props);
      delete propsExceptModel.model;
      return <WrappedComponent {...propsExceptModel} {...this.state} />;
    }
  }
}
```

لتوضيح كيفية استخدامها سنصل المكوّن `NameInput` في React إلى نموذج Backbone ونُحدِّث خاصيّته `firstName` في كل مرة يتغير فيها حقل الإدخال:

```js{4,6,11,15,19-21}
function NameInput(props) {
  return (
    <p>
      <input value={props.firstName} onChange={props.handleChange} />
      <br />
      اسمي هو {props.firstName}.
    </p>
  );
}

const BackboneNameInput = connectToBackboneModel(NameInput);

function Example(props) {
  function handleChange(e) {
    props.model.set('firstName', e.target.value);
  }

  return (
    <BackboneNameInput
      model={props.model}
      handleChange={handleChange}
    />
  );
}

const model = new Backbone.Model({ firstName: 'Frodo' });
ReactDOM.render(
  <Example model={model} />,
  document.getElementById('root')
);
```

[**جرّب المثال على موقع CodePen.**](https://codepen.io/gaearon/pen/PmWwwa?editors=0010)

هذه الطريقة ليست محدودة بمكتبة Backbone. فبإمكانك استخدام React مع أي مكتبة نماذج عن طريق المشاركة في تغييراتها بتوابع دورة حياة المكوّن، وبشكل اختياري نسخ البيانات إلى حالة React المحليّة.
