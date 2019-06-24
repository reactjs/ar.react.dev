---
id: refs-and-the-dom
title: استخدام المراجع مع DOM
redirect_from:
  - "docs/working-with-the-browser.html"
  - "docs/more-about-refs.html"
  - "docs/more-about-refs-ko-KR.html"
  - "docs/more-about-refs-zh-CN.html"
  - "tips/expose-component-functions.html"
  - "tips/children-undefined.html"
permalink: docs/refs-and-the-dom.html
---

تُزوّدنا المراجع بطريقة للوصول إلى عقد DOM أو عناصر React المُنشأة باستخدام التابع render.

تكون [الخاصيات](/docs/components-and-props.html) في تدفق بيانات React النموذجي هي الطريقة الوحيدة التي يتواصل بها المكون الأب مع أبنائه. وللتعديل على الإبن يتم اعادة تصيير المكون بخاصيات جديدة. على الرغم من ذلك ، في بعض الحالات التي قد تحتاج الى اجراء تعديل على مكون إبن بشكل إجباري خارج نطاق التدفق المعتاد. من الممكن ان يكون المكون الإبن المُراد تعديله نسخة instance من مُكوّن React ، أو ان يكون عنصر DOM. في كلتا الحالتين توفر لنا React مفر للإلتفاف حول هذه الحالات.

### متى تُستَخدم المراجع Refs {#when-to-use-refs}

هنالك بعض الحالات المناسبة لاستخدام المراجع refs وهي:

* التحكم بالتركيز على العناصر ، وتحديد النصوص ، والتحكم بتشغيل الوسائط.
* إطلاق التحريكات الإجباريّة.
* التكامل مع مكتبات DOM الطرف الثالث.

تجنب أستخدام المراجع لأي شئ يُمكن القيام به بشكل صريح.

فمثلاً ، بدلًا من تعريض التوابع `open()‎` و `close()‎` في مُكوِّن مربّع الحوار `Dialog،` مرِّر الخاصيّة `isOpen` له.

### لا تُفرِط في استخدام المراجع {#dont-overuse-refs}

قد تكون رغبتك الأولى هي أستخدام المراجع للقيام بما تريده في التطبيق خاصتك. إن كانت تلك هي الحالة فخُذ لحظة للتفكير بعمق حول مكان الحالة في التسلسل الهرمي للمكونات. يتضح عادةً أنّ المكان المناسب لوضع الحالة هو في المستويات العليا من التسلسل الهرمي للمُكوِّنات. انظر ألى [دَليل رفع الحالات](/docs/lifting-state-up.html) كمثال عملي على ذلك

> ملاحظة
>
> الأمثلة أدناه حُدِّثَت لتستخدم واجهة برمجة التطبيق `React.createRef()‎` التي تم طرحها في اصدار React 16.3. أذا كنت تستخدم إصدار React أقدم فحن نُوصي بأستخدام [ردود نداء المرجع](#callback-refs) عوضاُ عن ذلك. 

### إنشاء المراجع {#creating-refs}

تُنشَأ المراجع باستخدام `React.createRef()‎` وتُربَط إلى عناصر React عبر الخاصيّة `ref`. تُعيَّن المراجع غالباً إلى نسخة من الخاصيّة عند بناء المُكوِّن ليصبح لها امكانية الإرجاع من خلال المُكوِّن:

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

### الوصول للمراجع {#accessing-refs}

عند تمرير مرجع ref إلى عنصر في التابع `render` ، يُصبح المرجع إلى العُقدة قابلاً للوصول باستخدام الخاصية `current` للمرجع.

```javascript
const node = this.myRef.current;
```

تختلف قيمة المرجع بناءً على نوع العقدة:

- عند استخدام الخاصيّة `ref` على عنصر HTML فإن المرجع `ref` المنشأ في الدالة البانية باستخدام `React.createRef()` يستقبل عنصر DOM الأساسي كخاصية حالية `current`.
- عند استخدام خاصية المرجع `ref` على مكوِّن صنف مُخصص فأن الكائن المرجع `ref` يستقبل نسخة من المكون المُحَمَّل كخاصية حالية `current`.
- **لا يُمكنك استخدام الخاصيّة `ref` على المُكوِّنات المُعرَّفة كدوال** لأنّها لا تملك نُسَخ.

الأمثلة أدناه توَضِح الفروقات.

#### إضافة مرجع إلى عنصر DOM {#adding-a-ref-to-a-dom-element}

المثال التالي يستخدم خاصية المرجع `ref` لتخزين مرجع لعفدة DOM:

```javascript{5,12,22}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textInput.current.focus();
  }

  render() {
    // tell React that we want to associate the <input> ref
    // with the `textInput` that we created in the constructor
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

سَتُعيِّن React الخاصية `current` مع عنصر DOM عند تحميل المُكَوِّن و أعادة تعيينها الى `null` عند إزالة تحميل المُكون. تحديثات المرجع `ref` تحدث قبل خُطافات دورة حياة المُكوِّن `componentDidMount` أو `componentDidUpdate`.

#### إضافة مرجع إلى مُكوِّن الصنف {#adding-a-ref-to-a-class-component}

إن اردنا تغليف المكون `CustomTextInput` أعلاه لمحاكاة النقر عليه فورًا بعد التحميل ، يمكننا أن نستخدم مرجع للوصول إلى حقل الإدخال المُخَصَّص و استدعاء تابعه `focusTextInput` يدويًا:

```javascript{4,8,13}
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```

لاحظ أن هذا يعمل فقط عندما يكون المُكَوِن `CustomTextInput` مُعَرَّفًا كصنف:

```js{1}
class CustomTextInput extends React.Component {
  // ...
}
```

#### المراجع و مُكوِنات الدّالة {#refs-and-function-components}

**لا يُمكِنُكَ استخدام خاصية المرجع `ref` على مُكونات الدّالة** لأنها لا تَملك نُسَخ:

```javascript{1,8,13}
function MyFunctionComponent() {
  return <input />;
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    // This will *not* work!
    return (
      <MyFunctionComponent ref={this.textInput} />
    );
  }
}
```

يُنصَح بتحويل المُكون الى صنف إن أرَدت مرجعاُ له ، تماماً مثلما يتم تحويله إن احتجت توابع دورة الحياة أو الحالة.

على أيّةِ حال ، **يمكنك استخدام خاصية المرجع `ref` داخل مُكون دالّة** طالما كنت تُشير إلى عنصر DOM أو مُكون صنف:

```javascript{2,3,6,13}
function CustomTextInput(props) {
  // textInput must be declared here so the ref can refer to it
  let textInput = React.createRef();

  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />
      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );
}
```

### تعريض مراجع DOM إلى المونات الاب {#exposing-dom-refs-to-parent-components}

في حالاتٍ نادرة ، قد تحتاج إلى الوصول إلى عقدة DOM للمُكون الأبن من المُكون الأب.  لا يُفضَّل فعل ذلك بشكل عام لأنّه قد يخرق تغليف المُكوِّن، ولكن قد يكون أحيانًا مفيدًا لإطلاق حدث التركيز أو قياس حجم أو موضع عقدة DOM للمُكوِّن الابن.

وبينما تستطيع [إضافة مرجع إلى المُكوِّن الابن](#adding-a-ref-to-a-class-component) فليس هذا الحل الأمثل، حيث ستحصل فقط على نسخة عن المُكوِّن بدلًا من عقدة DOM. ولا يعمل هذا أيضًا على مُكوِّنات الدالة.

إن كُنتَ تستخدم إصدار React 16.3 أو أحدث، فنوصي باستخدام [تمرير المراجع](/docs/forwarding-refs.html) لأجل هذه الحالات. **حيث يُتيح ذلك للمُكوِّنات أن تُعرِّض أي مرجع للمُكوِّن الابن كمرجع خاص بها**. ستجد مثالًا مُفصّلًا حول كيفيّة تعريض عقدة DOM للابن إلى المُكوِّن الأب في [صفحة تمرير المراجع](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

إن كُنتَ تستخدم إصدار React 16.2 أو أقدم، أو احتجتَ مرونة أكبر من تلك التي يُعطيك إيّاها تمرير المراجع، فتستطيع استخدام [هذه الطريقة البديلة](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509) لتمرير مرجع بشكل صريح كخاصيّة ذات اسم مُختلِف.

ننصح بقدر الإمكان تجنّب تعريض عُقَد DOM، ولكن قد يكون أحيانًا هذا مفرًّا جيّدًا للالتفاف حول هذه المشكلة. لاحظ حاجة هذه الطريقة إلى إضافة بعض الشيفرة إلى المُكوِّن الابن. إن لم يكن لديك أي تحكّم بالمُكوِّن الابن فخيارك الأخير هو استخدام [`findDOMNode()‎`](/docs/react-dom.html#finddomnode)، ولكن لا نُوصي بهذا و قد تم حَذفُها في [`النمط المُشَدد`](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage) .

### ردود نداء المراجع {#callback-refs}

تدعم React أيضًا طريقة أخرى لتعيين المراجع تُدعى "ردود نداء المراجع" callback refs ، والتي تُعطي درجة أكبر من التحكم على وقت تعيين وإزالة تعيين المراجع.

بدلًا من تمرير خاصيّة المرجع `ref` المُنشَأة من قبل التابع `createRef()‎` ، مَرِّر دالّة. تستقبل هذه الدالّة نسخة من مُكوِّن React أو عنصر DOM كوسائط لها ، والتي يُمكِن تخزينها والوصول إليها من مكان آخر.

المِثال أدناه يُطبق مثالاً شائِعًا: استخدام رد نداء المرجع `ref` لتخزين مرجع إلى عُقدة DOM في نُسخة من الخاصية.

```javascript{5,7-9,11-14,19,29,34}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Focus the text input using the raw DOM API
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // autofocus the input on mount
    this.focusTextInput();
  }

  render() {
    // Use the `ref` callback to store a reference to the text input DOM
    // element in an instance field (for example, this.textInput).
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

ستستدعي React رد نداء المرجع `ref` مع عنصر DOM عند تحميل المُكوِّن ، وتستدعيه مع `null` عند إزالة تحميل المُكون. من المؤكَّد ان تكون المراجع مُحَدَّثة قَبلَ إطلاق التوابع `componentDidMount` أو `componentDidUpdate`.

يُمكِنُكَ تمرير ردود نداء المراجع بين المُكونات مثلما تَفعَل مع كائنات المراجع المُنشأةَ من قِبَل `React.createRef()`.

```javascript{4,13}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

في المِثال أعلاه يُمرِّر المُكوِّن `Parent` رد نداء مرجعها من خلال خاصيّة `inputRef` إلى المُكوِّن `CustomTextInput` والذي يُمرِّر نفس الدالة كخاصيّة مُميزة `ref` إلى العنصر `<input>`. وكنتيجة لذلك تُعيَّن `this.inputElement` في المُكوِّن `Parent` إلى عقدة DOM المُوافِقة للعنصر `<input>` في المُكوِّن `CustomTextInput`.

### واجهة برمجة التطبيق API القديمة: مراجع السلاسل النصية strings {#legacy-api-string-refs}

إن تعاملتَ مع React سابقًا فقد تكون متآلفًا مع واجهة برمجة التطبيق القديمة حيث كانت خاصيّة المرجع `ref` عبارة عن سلسلة نصيّة string، مثل `"textInput"`، ويتم الوصول إلى عقدة DOM عبر `this.refs.textInput`. لا ننصح بفعل ذلك لأنّ مراجع السلاسل النصيّة strings لديها [بعض المشاكل](https://github.com/facebook/react/pull/8333#issuecomment-271648615)، وأصبحت مُهمَلة، **ومن المحتمل أنّها ستُزال في الإصدارات القادمة**.

> ملاحظة
>
> إن كنتَ تستخدم `this.refs.textInput` حاليًّا للوصول إلى المراجع، فأننا ننصح باستخدام إمّا [نمط ردود النداء](#callback-refs) أو [واجهة برمجة التطبيق `createRef`](#creating-refs) عوضًا عن ذلك.

### أخطار استخدام ردود نداء المراجع {#caveats-with-callback-refs}

إن كان رد نداء المرجع `ref` مُعرَّفًا كدالّة سطريّة inline، فسيُستدعى مرتين خلال التحديثات، مرّة أولى مع القيمة `null` ومرة أخرى مع عنصر DOM. ويحدث هذا بسبب إنشاء نسخة جديدة من الدالة مع كل تصيير، لذا تحتاج React إلى مسح المرجع القديم وإعداد واحد جديد. بإمكانك تجنّب ذلك عن طريق تعريف رد نداء المرجع `ref` كتابع مربوط في الصنف، ولكن لاحظ أنّ هذا غير هام في معظم الحالات.
