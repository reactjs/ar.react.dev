---
title: "الصنف Component"
---

<Pitfall>

ننصح بتعريف المكوّنات كدوال بدل الأصناف. [اطلع على كيفية الترحيل.](#alternatives)

</Pitfall>

<Intro>

`Component` هو الصنف الأساس لمكوّنات React المعرفة كـ [أصناف JavaScript.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) ما زالت مكوّنات الأصناف مدعومة في React، لكننا لا ننصح باستخدامها في شيفرة جديدة.

```js
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `Component` {/*component*/}

لتعريف مكوّن React كصنف، ورّث من الصنف المدمج `Component` وعرّف [`دالة render`:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

لا تُلزمك سوى دالة `render`؛ بقية الدوال اختيارية.

[اطلع على المزيد من الأمثلة أدناه.](#usage)

---

### `context` {/*context*/}

[السياق](/learn/passing-data-deeply-with-context) لمكوّن الصنف متاح كـ `this.context`. يتوفر فقط إذا حددت *أي* سياق تريد تلقيه باستخدام [`static contextType`](#static-contexttype).

يمكن لمكوّن الصنف قراءة سياق واحد فقط في كل مرة.

```js {2,5}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

```

<Note>

قراءة `this.context` في مكوّنات الأصناف تعادل [`useContext`](/reference/react/useContext) في مكوّنات الدالة.

[اطلع على كيفية الترحيل.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `props` {/*props*/}

الخصائص الممرّرة إلى مكوّن الصنف متاحة كـ `this.props`.

```js {3}
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

<Greeting name="Taylor" />
```

<Note>

قراءة `this.props` في مكوّنات الأصناف تعادل [إعلان الخصائص](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component) في مكوّنات الدالة.

[اطلع على كيفية الترحيل.](#migrating-a-simple-component-from-a-class-to-a-function)

</Note>

---

### `state` {/*state*/}

حالة مكوّن الصنف متاحة كـ `this.state`. يجب أن يكون حقل `state` كائنًا. لا تعدّل الحالة مباشرة. إذا أردت تغيير الحالة، استدعِ `setState` بالحالة الجديدة.

```js {2-4,7-9,18}
class Counter extends Component {
  state = {
    age: 42,
  };

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleAgeChange}>
        Increment age
        </button>
        <p>You are {this.state.age}.</p>
      </>
    );
  }
}
```

<Note>

تعريف `state` في مكوّنات الأصناف يعادل استدعاء [`useState`](/reference/react/useState) في مكوّنات الدالة.

[اطلع على كيفية الترحيل.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `constructor(props)` {/*constructor*/}

يُنفَّذ [المُنشئ (constructor)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor) قبل أن يُركَّب مكوّن الصنف (*mount*، أي يُضاف إلى الشاشة). عادةً يُستخدم المُنشئ في React لغرضين فقط: إعلان الحالة و[ربط](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) دوال الصنف بمثيل الصنف:

```js {2-6}
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
```

إذا استخدمت صياغة JavaScript الحديثة، نادرًا ما تحتاج المُنشئات. بدلًا من ذلك يمكنك إعادة كتابة الشيفرة أعلاه باستخدام [صياغة حقول الأصناف العامة (public class fields)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields) المدعومة في المتصفحات الحديثة وأدوات مثل [Babel:](https://babeljs.io/)

```js {2,4}
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
```

لا يجب أن يحتوي المُنشئ على أي آثار جانبية أو اشتراكات.

#### المعاملات {/*constructor-parameters*/}

* `props`: الخصائص الأولية للمكوّن.

#### القيمة المُرجَعة {/*constructor-returns*/}

لا يجب أن يُرجع `constructor` أي شيء.

#### ملاحظات {/*constructor-caveats*/}

* لا تشغّل آثارًا جانبية أو اشتراكات في المُنشئ. استخدم [`componentDidMount`](#componentdidmount) لذلك بدلًا منه.

* داخل المُنشئ، يجب استدعاء `super(props)` قبل أي عبارة أخرى. إن لم تفعل، يكون `this.props` غير معرّف أثناء تنفيذ المُنشئ، ما قد يسبب لبسًا وأخطاء.

* المُنشئ هو المكان الوحيد الذي يمكنك فيه تعيين [`this.state`](#state) مباشرة. في كل الدوال الأخرى استخدم [`this.setState()`](#setstate). لا تستدعِ `setState` في المُنشئ.

* عند استخدام [عرض الخادم،](/reference/react-dom/server) يُنفَّذ المُنشئ على الخادم أيضًا، يليه [`render`](#render). لكن دوال دورة الحياة مثل `componentDidMount` أو `componentWillUnmount` لا تُنفَّذ على الخادم.

* عند تفعيل [Strict Mode](/reference/react/StrictMode)، تستدعي React `constructor` مرتين في وضع التطوير ثم تتخلّى عن أحد المثيلين. يساعدك ذلك على ملاحظة الآثار الجانبية العرضية التي يجب نقلها خارج `constructor`.

<Note>

لا يوجد ما يعادل `constructor` حرفيًا في مكوّنات الدالة. لإعلان الحالة في مكوّن دالة، استدعِ [`useState`.](/reference/react/useState) لتجنّب إعادة حساب الحالة الأولية، [مرّر دالة إلى `useState`.](/reference/react/useState#avoiding-recreating-the-initial-state)

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

إذا عرّفت `componentDidCatch`، تستدعيها React عندما يرمي مكوّن فرعي (بما فيه الأبناء البعيدون) خطأ أثناء العرض. يتيح لك ذلك تسجيل الخطأ في خدمة تقارير أخطاء في الإنتاج.

عادةً يُستخدم مع [`static getDerivedStateFromError`](#static-getderivedstatefromerror) الذي يتيح تحديث الحالة استجابةً لخطأ وعرض رسالة خطأ للمستخدم. المكوّن الذي يحتوي هذه الدوال يُسمى *حدود خطأ (Error Boundary).*

[اطلع على مثال.](#catching-rendering-errors-with-an-error-boundary)

#### المعاملات {/*componentdidcatch-parameters*/}

* `error`: الخطأ الذي أُرمي. عمليًا غالبًا ما يكون مثيل [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) لكن هذا غير مضمون لأن JavaScript تسمح بـ [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) لأي قيمة، بما فيها سلاسل أو حتى `null`.

* `info`: كائن يحتوي معلومات إضافية عن الخطأ. حقله `componentStack` يحتوي تتبعًا للمكدس مع المكوّن الذي رمى الخطأ، وأسماء ومواقع المصدر لجميع المكوّنات الأب. في الإنتاج تُصغَّر أسماء المكوّنات. إذا أعددت تقارير أخطاء للإنتاج، يمكنك فك ترميز مكدس المكوّنات بخرائط المصدر كما تفعل مع مكدسات أخطاء JavaScript العادية.

#### القيمة المُرجَعة {/*componentdidcatch-returns*/}

لا يجب أن تُرجع `componentDidCatch` أي شيء.

#### ملاحظات {/*componentdidcatch-caveats*/}

* في الماضي، كان شائعًا استدعاء `setState` داخل `componentDidCatch` لتحديث الواجهة وعرض رسالة خطأ احتياطية. هذا مُهمل لصالح تعريف [`static getDerivedStateFromError`.](#static-getderivedstatefromerror)

* تختلف بنيات React للتطوير والإنتاج قليلًا في كيفية تعامل `componentDidCatch` مع الأخطاء. في التطوير، تفقّع الأخطاء إلى `window`، أي أن `window.onerror` أو `window.addEventListener('error', callback)` قد تعترض الأخطاء التي التقطتها `componentDidCatch`. في الإنتاج، لا تفقّع الأخطاء، فيتلقى معالج الأخطاء في الأسلاف فقط الأخطاء التي لم تُلتقط صراحةً بـ `componentDidCatch`.

<Note>

لا يوجد ما يعادل `componentDidCatch` مباشرة في مكوّنات الدالة بعد. لتجنّب إنشاء أصناف، اكتب مكوّن `ErrorBoundary` واحدًا كما أعلاه واستخدمه في التطبيق. أو يمكنك استخدام الحزمة [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) التي تفعل ذلك نيابةً عنك.

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

إذا عرّفت `componentDidMount`، تستدعيها React عند إضافة مكوّنك *(تركيبه، mount)* إلى الشاشة. مكان شائع لبدء جلب البيانات أو إعداد اشتراكات أو التلاعب بعقد DOM.

إذا نفّذت `componentDidMount`، غالبًا تحتاج دوال دورة حياة أخرى لتجنّب الأخطاء. مثلًا، إذا قرأت `componentDidMount` حالة أو خصائص، نفّذ أيضًا [`componentDidUpdate`](#componentdidupdate) لمعالجة تغيّرها، و[`componentWillUnmount`](#componentwillunmount) لتنظيف ما فعلته `componentDidMount`.

```js {6-8}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[اطلع على المزيد من الأمثلة.](#adding-lifecycle-methods-to-a-class-component)

#### المعاملات {/*componentdidmount-parameters*/}

`componentDidMount` لا تأخذ معاملات.

#### القيمة المُرجَعة {/*componentdidmount-returns*/}

لا يجب أن تُرجع `componentDidMount` أي شيء.

#### ملاحظات {/*componentdidmount-caveats*/}

- عند تفعيل [Strict Mode](/reference/react/StrictMode)، في التطوير تستدعي React `componentDidMount`، ثم فورًا [`componentWillUnmount`،](#componentwillunmount) ثم `componentDidMount` مجددًا. يساعدك ذلك على ملاحظة إن نسيت `componentWillUnmount` أو إن منطقها لا «يعكس» تمامًا ما تفعله `componentDidMount`.

- رغم أنه يمكنك استدعاء [`setState`](#setstate) فورًا في `componentDidMount`، من الأفضل تجنّب ذلك عندما يمكن. سيُطلَق عرض إضافي، لكنه يحدث قبل أن يحدّث المتصفح الشاشة. يضمن ذلك أن المستخدم لا يرى الحالة الوسيطة رغم استدعاء [`render`](#render) مرتين. استخدم هذا النمط بحذر لأنه غالبًا يسبب مشاكل أداء. في أغلب الحالات يمكنك تعيين الحالة الأولية في [`constructor`](#constructor). قد يكون ضروريًا لحالات مثل النوافذ المنبثقة والتلميحات عندما تحتاج قياس عقدة DOM قبل عرض شيء يعتمد على حجمها أو موضعها.

<Note>

في كثير من الاستخدامات، تعريف `componentDidMount` و`componentDidUpdate` و`componentWillUnmount` معًا في مكوّنات الأصناف يعادل استدعاء [`useEffect`](/reference/react/useEffect) في مكوّنات الدالة. في الحالات النادرة التي يكون فيها تشغيل الشيفرة قبل رسم المتصفح مهمًا، [`useLayoutEffect`](/reference/react/useLayoutEffect) أقرب تطابقًا.

[اطلع على كيفية الترحيل.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `componentDidUpdate(prevProps, prevState, snapshot?)` {/*componentdidupdate*/}

إذا عرّفت `componentDidUpdate`، تستدعيها React فور إعادة عرض مكوّنك بعد تحديث الخصائص أو الحالة. لا تُستدعى هذه الدالة للعرض الأولي.

يمكنك استخدامها للتعامل مع DOM بعد التحديث. مكان شائع أيضًا لطلبات الشبكة طالما تقارن الخصائص الحالية بالسابقة (مثلًا قد لا يكون طلب الشبكة لازمًا إذا لم تتغيّر الخصائص). عادةً تستخدمها مع [`componentDidMount`](#componentdidmount) و[`componentWillUnmount`:](#componentwillunmount)

```js {10-18}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[اطلع على المزيد من الأمثلة.](#adding-lifecycle-methods-to-a-class-component)


#### المعاملات {/*componentdidupdate-parameters*/}

* `prevProps`: الخصائص قبل التحديث. قارن `prevProps` مع [`this.props`](#props) لمعرفة ما تغيّر.

* `prevState`: الحالة قبل التحديث. قارن `prevState` مع [`this.state`](#state) لمعرفة ما تغيّر.

* `snapshot`: إذا نفّذت [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)، يحتوي `snapshot` على القيمة التي أرجعتها من تلك الدالة. وإلا يكون `undefined`.

#### القيمة المُرجَعة {/*componentdidupdate-returns*/}

لا يجب أن تُرجع `componentDidUpdate` أي شيء.

#### ملاحظات {/*componentdidupdate-caveats*/}

- لا تُستدعى `componentDidUpdate` إذا عُرّفت [`shouldComponentUpdate`](#shouldcomponentupdate) وأرجعت `false`.

- يفضَّل أن يُلفّ منطق `componentDidUpdate` بشروط تقارن `this.props` مع `prevProps`، و`this.state` مع `prevState`. وإلا خطر حلقات لا نهائية.

- رغم أنه يمكنك استدعاء [`setState`](#setstate) فورًا في `componentDidUpdate`، من الأفضل تجنّب ذلك عندما يمكن. سيُطلَق عرض إضافي قبل تحديث الشاشة، فيضمن عدم رؤية المستخدم للحالة الوسيطة رغم استدعاء [`render`](#render) مرتين. هذا النمط غالبًا يسبب مشاكل أداء، لكنه قد يكون لازمًا لحالات نادرة مثل النوافذ المنبثقة والتلميحات عند قياس عقدة DOM.

<Note>

في كثير من الاستخدامات، تعريف `componentDidMount` و`componentDidUpdate` و`componentWillUnmount` معًا في مكوّنات الأصناف يعادل [`useEffect`](/reference/react/useEffect) في مكوّنات الدالة. في الحالات النادرة التي يكون فيها التشغيل قبل رسم المتصفح مهمًا، [`useLayoutEffect`](/reference/react/useLayoutEffect) أقرب تطابقًا.

[اطلع على كيفية الترحيل.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>
---

### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

أُعيدت تسمية واجهة `componentWillMount` إلى [`UNSAFE_componentWillMount`.](#unsafe_componentwillmount) الاسم القديم مُهمل. في إصدار رئيسي مستقبلي من React، سيعمل الاسم الجديد فقط.

شغّل [codemod `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) لتحديث مكوّناتك تلقائيًا.

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

أُعيدت تسمية واجهة `componentWillReceiveProps` إلى [`UNSAFE_componentWillReceiveProps`.](#unsafe_componentwillreceiveprops) الاسم القديم مُهمل. في إصدار رئيسي مستقبلي من React، سيعمل الاسم الجديد فقط.

شغّل [codemod `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) لتحديث مكوّناتك تلقائيًا.

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

أُعيدت تسمية واجهة `componentWillUpdate` إلى [`UNSAFE_componentWillUpdate`.](#unsafe_componentwillupdate) الاسم القديم مُهمل. في إصدار رئيسي مستقبلي من React، سيعمل الاسم الجديد فقط.

شغّل [codemod `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) لتحديث مكوّناتك تلقائيًا.

</Deprecated>

---

### `componentWillUnmount()` {/*componentwillunmount*/}

إذا عرّفت `componentWillUnmount`، تستدعيها React قبل إزالة مكوّنك *(فكه، unmount)* من الشاشة. مكان شائع لإلغاء جلب البيانات أو إزالة الاشتراكات.

يجب أن «يعكس» منطق `componentWillUnmount` منطق [`componentDidMount`.](#componentdidmount) مثلًا، إذا أعدّت `componentDidMount` اشتراكًا، يجب أن تنظّفه `componentWillUnmount`. إذا قرأ منطق التنظيف في `componentWillUnmount` خصائص أو حالة، غالبًا تحتاج أيضًا [`componentDidUpdate`](#componentdidupdate) لتنظيف الموارد (مثل الاشتراكات) المقابلة للخصائص والحالة القديمة.

```js {20-22}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[اطلع على المزيد من الأمثلة.](#adding-lifecycle-methods-to-a-class-component)

#### المعاملات {/*componentwillunmount-parameters*/}

`componentWillUnmount` لا تأخذ معاملات.

#### القيمة المُرجَعة {/*componentwillunmount-returns*/}

لا يجب أن تُرجع `componentWillUnmount` أي شيء.

#### ملاحظات {/*componentwillunmount-caveats*/}

- عند تفعيل [Strict Mode](/reference/react/StrictMode)، في التطوير تستدعي React [`componentDidMount`،](#componentdidmount) ثم فورًا `componentWillUnmount`، ثم `componentDidMount` مجددًا. يساعدك ذلك على ملاحظة إن نسيت `componentWillUnmount` أو إن منطقها لا «يعكس» تمامًا ما تفعله `componentDidMount`.

<Note>

في كثير من الاستخدامات، تعريف `componentDidMount` و`componentDidUpdate` و`componentWillUnmount` معًا في مكوّنات الأصناف يعادل [`useEffect`](/reference/react/useEffect) في مكوّنات الدالة. في الحالات النادرة التي يكون فيها التشغيل قبل رسم المتصفح مهمًا، [`useLayoutEffect`](/reference/react/useLayoutEffect) أقرب تطابقًا.

[اطلع على كيفية الترحيل.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

يُجبر مكوّنًا على إعادة العرض.

عادةً هذا غير لازم. إذا كانت [`render`](#render) تقرأ فقط من [`this.props`](#props) و[`this.state`](#state) و[`this.context`،](#context) فستُعاد الرسم تلقائيًا عند استدعاء [`setState`](#setstate) داخل المكوّن أو أحد آبائه. لكن إذا قرأت `render` مباشرة من مصدر بيانات خارجي، يجب أن تُخبر React بتحديث الواجهة عند تغيّر ذلك المصدر. هذا ما تتيحه `forceUpdate`.

حاول تجنّب `forceUpdate` والاكتفاء بقراءة `this.props` و`this.state` في `render`.

#### المعاملات {/*forceupdate-parameters*/}

* **اختياري** `callback`: إذا حُدّد، تستدعي React الدالة بعد اعتماد التحديث.

#### القيمة المُرجَعة {/*forceupdate-returns*/}

لا تُرجع `forceUpdate` أي شيء.

#### ملاحظات {/*forceupdate-caveats*/}

- إذا استدعيت `forceUpdate`، تعيد React العرض دون استدعاء [`shouldComponentUpdate`.](#shouldcomponentupdate)

<Note>

قراءة مصدر بيانات خارجي وإجبار مكوّنات الأصناف على إعادة العرض استجابةً لتغيّره بـ `forceUpdate` حُلّت بـ [`useSyncExternalStore`](/reference/react/useSyncExternalStore) في مكوّنات الدالة.

</Note>

---

### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

إذا نفّذت `getSnapshotBeforeUpdate`، تستدعيها React فورًا قبل تحديث DOM. يتيح للمكوّن التقاط معلومات من DOM (مثل موضع التمرير) قبل أن تتغيّر محتملًا. أي قيمة تُرجعها دورة الحياة هذه تُمرَّر كمعامل إلى [`componentDidUpdate`.](#componentdidupdate)

مثلًا، يمكنك استخدامها في واجهة مثل خيط محادثة يحتاج الحفاظ على موضع التمرير أثناء التحديثات:

```js {7-15,17}
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```

في المثال أعلاه، من المهم قراءة خاصية `scrollHeight` مباشرة في `getSnapshotBeforeUpdate`. ليس آمناً قراءتها في [`render`](#render) أو [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops) أو [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate) لأن فجوة زمنية محتملة بين استدعاء هذه الدوال وتحديث React لـ DOM.

#### المعاملات {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps`: الخصائص قبل التحديث. قارن `prevProps` مع [`this.props`](#props).

* `prevState`: الحالة قبل التحديث. قارن `prevState` مع [`this.state`](#state).

#### القيمة المُرجَعة {/*getsnapshotbeforeupdate-returns*/}

أرجع قيمة لقطة (snapshot) من أي نوع تريد، أو `null`. تُمرَّر القيمة التي أرجعتها كالمعامل الثالث إلى [`componentDidUpdate`.](#componentdidupdate)

#### ملاحظات {/*getsnapshotbeforeupdate-caveats*/}

- لا تُستدعى `getSnapshotBeforeUpdate` إذا عُرّفت [`shouldComponentUpdate`](#shouldcomponentupdate) وأرجعت `false`.

<Note>

لا يوجد حاليًا ما يعادل `getSnapshotBeforeUpdate` في مكوّنات الدالة. هذا الاستخدام نادر جدًا، لكن إن احتجته فعليك حاليًا كتابة مكوّن صنف.

</Note>

---

### `render()` {/*render*/}

دالة `render` هي الدالة الوحيدة المطلوبة في مكوّن الصنف.

يجب أن تحدد `render` ما تريد ظهوره على الشاشة، مثلًا:

```js {4-6}
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

قد تستدعي React `render` في أي لحظة، فلا تفترض أنها تعمل في وقت معيّن. عادةً تُرجع `render` جزءًا من [JSX،](/learn/writing-markup-with-jsx) لكن تُدعم بعض [أنواع الإرجاع الأخرى](#render-returns) (مثل السلاسل). لحساب JSX المُرجَع، يمكن لـ `render` قراءة [`this.props`](#props) و[`this.state`](#state) و[`this.context`](#context).

اكتب `render` كدالة نقية: تُرجع نفس النتيجة إذا بقيت الخصائص والحالة والسياق كما هما. لا يجب أن تحتوي على آثار جانبية (مثل إعداد اشتراكات) أو تتفاعل مع واجهات المتصفح. تُنفَّذ الآثار الجانبية في معالجات الأحداث أو دوال مثل [`componentDidMount`.](#componentdidmount)

#### المعاملات {/*render-parameters*/}

`render` لا تأخذ معاملات.

#### القيمة المُرجَعة {/*render-returns*/}

يمكن لـ `render` أن تُرجع أي عقدة React صالحة: عناصر مثل `<div />` وسلاسل وأرقامًا و[بوابات](/reference/react-dom/createPortal) وعقدًا فارغة (`null` و`undefined` و`true` و`false`) ومصفوفات من عقد React.

#### ملاحظات {/*render-caveats*/}

- يجب أن تكون `render` دالة نقية للخصائص والحالة والسياق، بلا آثار جانبية.

- لا تُستدعى `render` إذا عُرّفت [`shouldComponentUpdate`](#shouldcomponentupdate) وأرجعت `false`.

- عند تفعيل [Strict Mode](/reference/react/StrictMode)، تستدعي React `render` مرتين في التطوير ثم تتخلّى عن أحد النتائج. يساعدك ذلك على ملاحظة الآثار الجانبية التي يجب نقلها خارج `render`.

- لا توجد مراسلة واحد‑لواحد بين استدعاء `render` واستدعاء `componentDidMount` أو `componentDidUpdate` لاحقًا. قد تتخلّى React عن بعض نتائج `render` عندما يكون ذلك مفيدًا.

---

### `setState(nextState, callback?)` {/*setstate*/}

استدعِ `setState` لتحديث حالة مكوّن React.

```js {8-10}
class Form extends Component {
  state = {
    name: 'Taylor',
  };

  handleNameChange = (e) => {
    const newName = e.target.value;
    this.setState({
      name: newName
    });
  }

  render() {
    return (
      <>
        <input value={this.state.name} onChange={this.handleNameChange} />
        <p>Hello, {this.state.name}.</p>
      </>
    );
  }
}
```

`setState` تضع تغييرات الحالة في طابور. تُخبر React أن هذا المكوّن وأبناءه يحتاجان إعادة عرض بالحالة الجديدة. هذه الطريقة الرئيسية لتحديث الواجهة استجابةً للتفاعلات.

<Pitfall>

استدعاء `setState` **لا** يغيّر الحالة الحالية في الشيفرة الجارية أصلًا:

```js {6}
function handleClick() {
  console.log(this.state.name); // "Taylor"
  this.setState({
    name: 'Robin'
  });
  console.log(this.state.name); // Still "Taylor"!
}
```

يؤثر فقط في ما ستُرجعه `this.state` بدءًا من العرض *التالي.*

</Pitfall>

يمكنك أيضًا تمرير دالة إلى `setState` لتحديث الحالة بناءً على الحالة السابقة:

```js {2-6}
  handleIncreaseAge = () => {
    this.setState(prevState => {
      return {
        age: prevState.age + 1
      };
    });
  }
```

ليس إلزاميًا، لكنه مفيد إذا أردت تحديث الحالة عدة مرات في نفس الحدث.

#### المعاملات {/*setstate-parameters*/}

* `nextState`: إما كائن أو دالة.
  * إذا مررت كائنًا كـ `nextState`، يُدمج سطحيًا في `this.state`.
  * إذا مررت دالة كـ `nextState`، تُعامل كـ _دالة تحديث (updater)_. يجب أن تكون نقية، وتأخذ الحالة المعلّقة والخصائص كمعاملات، وتُرجع الكائن المدمج سطحيًا في `this.state`. تضع React دالة التحديث في طابور وتُعيد عرض المكوّن. في العرض التالي تحسب الحالة التالية بتطبيق كل دوال التحديث المصفوفة على الحالة السابقة.

* **اختياري** `callback`: إذا حُدّد، تستدعي React الدالة بعد اعتماد التحديث.

#### القيمة المُرجَعة {/*setstate-returns*/}

لا تُرجع `setState` أي شيء.

#### ملاحظات {/*setstate-caveats*/}

- اعتبر `setState` *طلبًا* وليس أمرًا فوريًا بتحديث المكوّن. عندما يحدّث عدة مكوّنات حالتها استجابةً لحدث، تجمع React التحديثات وتُعيد الرسم معًا في مرّة واحدة في نهاية الحدث. في الحالة النادرة التي تحتاج فيها لتطبيق تحديث حالة متزامن، يمكنك لفّه في [`flushSync`،](/reference/react-dom/flushSync) لكن ذلك قد يضرّ بالأداء.

- `setState` لا تحدّث `this.state` فورًا، فيجعل قراءة `this.state` مباشرة بعد `setState` فخًا محتملًا. استخدم [`componentDidUpdate`](#componentdidupdate) أو معامل `callback` لـ `setState`؛ كلاهما يُضمن تنفيذه بعد تطبيق التحديث. لضبط الحالة بناءً على السابقة، مرّر دالة إلى `nextState` كما وُصف.

<Note>

استدعاء `setState` في مكوّنات الأصناف يشبه استدعاء [دالة `set`](/reference/react/useState#setstate) في مكوّنات الدالة.

[اطلع على كيفية الترحيل.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

إذا عرّفت `shouldComponentUpdate`، تستدعيها React لتحديد ما إذا كان يمكن تخطّي إعادة العرض.

إذا أردت كتابتها يدويًا، قارن `this.props` مع `nextProps` و`this.state` مع `nextState` وأرجع `false` لتخبر React أن التحديث يمكن تخطّيه.

```js {6-18}
class Rectangle extends Component {
  state = {
    isHovered: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.position.x === this.props.position.x &&
      nextProps.position.y === this.props.position.y &&
      nextProps.size.width === this.props.size.width &&
      nextProps.size.height === this.props.size.height &&
      nextState.isHovered === this.state.isHovered
    ) {
      // Nothing has changed, so a re-render is unnecessary
      return false;
    }
    return true;
  }

  // ...
}

```

تستدعي React `shouldComponentUpdate` قبل العرض عند استلام خصائص أو حالة جديدة. القيمة الافتراضية `true`. لا تُستدعى للعرض الأولي ولا عند استخدام [`forceUpdate`](#forceupdate).

#### المعاملات {/*shouldcomponentupdate-parameters*/}

- `nextProps`: الخصائص التالية التي سيعرض بها المكوّن. قارن `nextProps` مع [`this.props`](#props).
- `nextState`: الحالة التالية التي سيعرض بها المكوّن. قارن `nextState` مع [`this.state`](#state) لمعرفة ما تغيّر.
- `nextContext`: السياق التالي. قارن `nextContext` مع [`this.context`](#context). متاح فقط إذا حددت [`static contextType`](#static-contexttype).

#### القيمة المُرجَعة {/*shouldcomponentupdate-returns*/}

أرجع `true` إذا أردت إعادة العرض. هذا السلوك الافتراضي.

أرجع `false` لتخبر React أن إعادة العرض يمكن تخطّيها.

#### ملاحظات {/*shouldcomponentupdate-caveats*/}

- توجد هذه الدالة *فقط* كتحسين للأداء. إذا انكسر المكوّن بدونها، أصلح السبب أولًا.

- فكّر في [`PureComponent`](/reference/react/PureComponent) بدل كتابة `shouldComponentUpdate` يدويًا. `PureComponent` تقارن الخصائص والحالة سطحيًا وتقلّل احتمال تخطّي تحديث لازم.

- لا ننصح بفحوصات مساواة عميقة أو بـ `JSON.stringify` داخل `shouldComponentUpdate`؛ يجعل الأداء غير متوقعًا ومعتمدًا على بنية كل خاصية وحالة.

- إرجاع `false` لا يمنع المكوّنات الفرعية من إعادة العرض عندما تتغيّر *حالتها* هي.

- إرجاع `false` لا *يضمن* عدم إعادة عرض المكوّن. React تستخدم القيمة كتلميح وقد تعيد الرسم لأسباب أخرى.

<Note>

تحسين مكوّنات الأصناف بـ `shouldComponentUpdate` يشبه تحسين مكوّنات الدالة بـ [`memo`.](/reference/react/memo) توفّر مكوّنات الدالة أيضًا تحسينًا أدق بـ [`useMemo`.](/reference/react/useMemo)

</Note>

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

إذا عرّفت `UNSAFE_componentWillMount`، تستدعيها React فورًا بعد [`constructor`.](#constructor) توجد لأسباب تاريخية فقط ولا يجب استخدامها في شيفرة جديدة. استخدم بدلًا منها:

- لتهيئة الحالة، عرّف [`state`](#state) كحقل صنف أو عيّن `this.state` داخل [`constructor`.](#constructor)
- لآثار جانبية أو اشتراك، انقل المنطق إلى [`componentDidMount`](#componentdidmount).

[أمثلة على الترحيل عن دورات حياة غير آمنة.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### المعاملات {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount` لا تأخذ معاملات.

#### القيمة المُرجَعة {/*unsafe_componentwillmount-returns*/}

لا يجب أن تُرجع `UNSAFE_componentWillMount` أي شيء.

#### ملاحظات {/*unsafe_componentwillmount-caveats*/}

- لا تُستدعى `UNSAFE_componentWillMount` إذا نفّذ المكوّن [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) أو [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- رغم الاسم، `UNSAFE_componentWillMount` لا تضمن أن المكوّن *سيُركَّب* إذا استخدم تطبيقك ميزات حديثة مثل [`Suspense`.](/reference/react/Suspense) إذا عُلّق محاولة عرض (مثلًا لأن شيفرة مكوّن فرعي لم تُحمَّل بعد)، تتخلّى React عن الشجرة الجارية وتحاول بناء المكوّن من جديد لاحقًا. لذلك تُسمّى «غير آمنة». الشيفرة المعتمدة على التركيب (مثل إضافة اشتراك) تنتقل إلى [`componentDidMount`.](#componentdidmount)

- `UNSAFE_componentWillMount` هي الدورة الوحيدة التي تُنفَّذ أثناء [عرض الخادم.](/reference/react-dom/server) عمليًا تطابق [`constructor`،](#constructor) لذا استخدم `constructor` لهذا المنطق.

<Note>

استدعاء [`setState`](#setstate) داخل `UNSAFE_componentWillMount` لتهيئة الحالة يعادل تمرير تلك الحالة كحالة أولية إلى [`useState`](/reference/react/useState) في مكوّن دالة.

</Note>

---

### `UNSAFE_componentWillReceiveProps(nextProps, nextContext)` {/*unsafe_componentwillreceiveprops*/}

إذا عرّفت `UNSAFE_componentWillReceiveProps`، تستدعيها React عندما يتلقى المكوّن خصائص جديدة. توجد لأسباب تاريخية فقط ولا تُستخدم في شيفرة جديدة. البدائل:

- لـ **تشغيل أثر جانبي** (جلب بيانات، رسوم متحركة، إعادة اشتراك) استجابةً لتغيّر الخصائص، انقل المنطق إلى [`componentDidUpdate`](#componentdidupdate).
- لتجنّب **إعادة حساب بيانات فقط عند تغيّر خاصية،** استخدم [مساعد تذكير (memoization)](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
- لـ **«إعادة ضبط» حالة عند تغيّر خاصية،** فكّر في مكوّن [خاضع للتحكم بالكامل](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) أو [غير خاضع بالكامل مع `key`](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).
- لـ **«ضبط» حالة عند تغيّر خاصية،** تحقق إن كان يمكن حساب كل المعلومات من الخصائص وحدها أثناء العرض. إن تعذّر، استخدم [`static getDerivedStateFromProps`](/reference/react/Component#static-getderivedstatefromprops).

[أمثلة على الترحيل.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

#### المعاملات {/*unsafe_componentwillreceiveprops-parameters*/}

- `nextProps`: الخصائص التالية من المكوّن الأب. قارن `nextProps` مع [`this.props`](#props).
- `nextContext`: السياق التالي من أقرب موفّر. قارن `nextContext` مع [`this.context`](#context). متاح فقط مع [`static contextType`](#static-contexttype).

#### القيمة المُرجَعة {/*unsafe_componentwillreceiveprops-returns*/}

لا يجب أن تُرجع `UNSAFE_componentWillReceiveProps` أي شيء.

#### ملاحظات {/*unsafe_componentwillreceiveprops-caveats*/}

- لا تُستدعى إذا نفّذ المكوّن [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) أو [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- رغم الاسم، لا تضمن أن المكوّن *سيستلم* تلك الخصائص مع [`Suspense`](/reference/react/Suspense) وغيره. عند تعليق العرض قد تختلف الخصائص لاحقًا؛ لذلك «غير آمنة». الشيفرة التي يجب أن تعمل فقط بعد التحديثات المعتمدة (مثل إعادة ضبط اشتراك) تذهب إلى [`componentDidUpdate`.](#componentdidupdate)

- لا تعني الدالة أن المكوّن استلم خصائص *مختلفة* عن المرة السابقة؛ قارن `nextProps` و`this.props` بنفسك.

- React لا تستدعيها بالخصائص الأولية أثناء التركيب، بل عندما ستُحدَّث خصائص المكوّن. مثلًا، [`setState`](#setstate) لا يُطلق `UNSAFE_componentWillReceiveProps` داخل نفس المكوّن عادةً.

<Note>

استدعاء [`setState`](#setstate) داخل `UNSAFE_componentWillReceiveProps` لـ «ضبط» الحالة يعادل [استدعاء دالة `set` من `useState` أثناء العرض](/reference/react/useState#storing-information-from-previous-renders) في مكوّن دالة.

</Note>

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}


إذا عرّفت `UNSAFE_componentWillUpdate`، تستدعيها React قبل العرض بالخصائص أو الحالة الجديدة. لأسباب تاريخية فقط؛ لا تُستخدم في شيفرة جديدة. البدائل:

- لأثر جانبي استجابةً لتغيّر الخصائص أو الحالة، انقل المنطق إلى [`componentDidUpdate`](#componentdidupdate).
- لقراءة معلومات من DOM (مثل حفظ موضع التمرير) لاستخدامها لاحقًا في [`componentDidUpdate`،](#componentdidupdate) اقرأها داخل [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate).

[أمثلة على الترحيل.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### المعاملات {/*unsafe_componentwillupdate-parameters*/}

- `nextProps`: الخصائص التالية للعرض. قارن `nextProps` مع [`this.props`](#props).
- `nextState`: الحالة التالية للعرض. قارن `nextState` مع [`this.state`](#state).

#### القيمة المُرجَعة {/*unsafe_componentwillupdate-returns*/}

لا يجب أن تُرجع `UNSAFE_componentWillUpdate` أي شيء.

#### ملاحظات {/*unsafe_componentwillupdate-caveats*/}

- لا تُستدعى إذا عُرّفت [`shouldComponentUpdate`](#shouldcomponentupdate) وأرجعت `false`.

- لا تُستدعى إذا نفّذ المكوّن [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) أو [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- غير مدعوم استدعاء [`setState`](#setstate) (أو أي شيء يؤدي إلى `setState`، مثل إرسال إجراء Redux) أثناء `componentWillUpdate`.

- رغم الاسم، لا تضمن أن المكوّن *سيُحدَّث* مع [`Suspense`](/reference/react/Suspense) وما شابه؛ قد تختلف الخصائص والحالة لاحقًا. الشيفرة التي يجب أن تعمل بعد تحديثات معتمدة تذهب إلى [`componentDidUpdate`.](#componentdidupdate)

- لا تعني أن الخصائص أو الحالة *اختلفت* عن المرة السابقة؛ قارن بنفسك.

- React لا تستدعيها بالخصائص والحالة الأولية أثناء التركيب.

<Note>

لا يوجد ما يعادل `UNSAFE_componentWillUpdate` مباشرة في مكوّنات الدالة.

</Note>

---

### `static contextType` {/*static-contexttype*/}

لقراءة [`this.context`](#context-instance-field) من مكوّن الصنف، حدّد أي سياق يقرأ. السياق الذي تضعه كـ `static contextType` يجب أن يكون قيمة أنشأتها سابقًا بـ [`createContext`.](/reference/react/createContext)

```js {2}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}
```

<Note>

قراءة `this.context` في مكوّنات الأصناف تعادل [`useContext`](/reference/react/useContext) في مكوّنات الدالة.

[اطلع على كيفية الترحيل.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

يمكنك تعريف `static defaultProps` لتعيين الخصائص الافتراضية للصنف. تُستخدم للخصائص `undefined` أو الناقصة، وليس لـ `null`.

مثلًا، لتعيين أن خاصية `color` الافتراضية `'blue'`:

```js {2-4}
class Button extends Component {
  static defaultProps = {
    color: 'blue'
  };

  render() {
    return <button className={this.props.color}>click me</button>;
  }
}
```

إذا لم تُمرَّر `color` أو كانت `undefined`، تُضبط افتراضيًا إلى `'blue'`:

```js
<>
  {/* this.props.color is "blue" */}
  <Button />

  {/* this.props.color is "blue" */}
  <Button color={undefined} />

  {/* this.props.color is null */}
  <Button color={null} />

  {/* this.props.color is "red" */}
  <Button color="red" />
</>
```

<Note>

تعريف `defaultProps` في مكوّنات الأصناف يشبه استخدام [قيم افتراضية](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop) في مكوّنات الدالة.

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

إذا عرّفت `static getDerivedStateFromError`، تستدعيها React عندما يرمي مكوّن فرعي (بما فيه البعيدون) خطأ أثناء العرض. يتيح عرض رسالة خطأ بدل مسح الواجهة.

عادةً يُستخدم مع [`componentDidCatch`](#componentdidcatch) لإرسال التقرير إلى خدمة تحليلات. المكوّن الذي يحتوي هاتين الدالتين يُسمى *حدود خطأ (Error Boundary).*

[اطلع على مثال.](#catching-rendering-errors-with-an-error-boundary)

#### المعاملات {/*static-getderivedstatefromerror-parameters*/}

* `error`: الخطأ المرمي. عمليًا غالبًا مثيل [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) لكن غير مضمون لأن JavaScript تسمح بـ [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) لأي قيمة.

#### القيمة المُرجَعة {/*static-getderivedstatefromerror-returns*/}

يجب أن تُرجع `static getDerivedStateFromError` الحالة التي تُخبر المكوّن بعرض رسالة الخطأ.

#### ملاحظات {/*static-getderivedstatefromerror-caveats*/}

* يجب أن تكون `static getDerivedStateFromError` دالة نقية. لأثر جانبي (مثل استدعاء تحليلات)، نفّذ أيضًا [`componentDidCatch`.](#componentdidcatch)

<Note>

لا يوجد ما يعادلها مباشرة في مكوّنات الدالة بعد. لتجنّب الأصناف، اكتب مكوّن `ErrorBoundary` واحدًا واستخدمه في التطبيق، أو استخدم [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary).

</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

إذا عرّفت `static getDerivedStateFromProps`، تستدعيها React قبل [`render`](#render) مباشرةً، في التركيب الأول وفي التحديثات اللاحقة. يجب أن تُرجع كائنًا لتحديث الحالة، أو `null` لعدم التحديث.

توجد لـ [حالات نادرة](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) تعتمد فيها الحالة على تغيّر الخصائص مع الزمن. مثلًا، يعيد مكوّن `Form` هذا ضبط حالة `email` عند تغيّر خاصية `userID`:

```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (props.userID !== state.prevUserID) {
      return {
        prevUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

لاحظ أن هذا النمط يتطلّب الاحتفاظ بقيمة سابقة للخاصية (مثل `userID`) في الحالة (مثل `prevUserID`).

<Pitfall>

اشتقاق الحالة يؤدي إلى شيفرة مطوّلة ويجعل المكوّنات أصعب للتفكير فيها. [تأكد أنك تعرف البدائل الأبسط:](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

- لـ **أثر جانبي** (جلب بيانات أو رسوم) استجابةً لتغيّر خاصية، استخدم [`componentDidUpdate`](#componentdidupdate).
- لإعادة **حساب بيانات فقط عند تغيّر خاصية،** [استخدم مساعد تذكير.](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)
- لـ **«إعادة ضبط» حالة عند تغيّر خاصية،** فكّر في مكوّن [خاضع للتحكم بالكامل](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) أو [غير خاضع مع `key`.](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)

</Pitfall>

#### المعاملات {/*static-getderivedstatefromprops-parameters*/}

- `props`: الخصائص التالية التي سيعرض بها المكوّن.
- `state`: الحالة التالية التي سيعرض بها المكوّن.

#### القيمة المُرجَعة {/*static-getderivedstatefromprops-returns*/}

تُرجع `static getDerivedStateFromProps` كائنًا لتحديث الحالة، أو `null` لعدم التحديث.

#### ملاحظات {/*static-getderivedstatefromprops-caveats*/}

- تُطلَق في *كل* عرض، بغض النظر عن السبب. يختلف ذلك عن [`UNSAFE_componentWillReceiveProps`](#unsafe_cmoponentwillreceiveprops) التي تُطلَق فقط عندما يسبّب الأب إعادة عرض وليس نتيجة `setState` محلي.

- لا تصل هذه الدالة إلى مثيل المكوّن. يمكنك إعادة استخدام شيفرة بينها وبين دوال الصنف الأخرى باستخراج دوال نقية للخصائص والحالة خارج تعريف الصنف.

<Note>

تنفيذ `static getDerivedStateFromProps` في مكوّن صنف يعادل [استدعاء دالة `set` من `useState` أثناء العرض](/reference/react/useState#storing-information-from-previous-renders) في مكوّن دالة.

</Note>

---

## الاستخدام {/*usage*/}

### تعريف مكوّن صنف {/*defining-a-class-component*/}

لتعريف مكوّن React كصنف، ورّث من الصنف المدمج `Component` وعرّف [`دالة render`:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

تستدعي React [`render`](#render) كلما احتاجت معرفة ما يُعرض على الشاشة. عادةً تُرجع منها بعض [JSX.](/learn/writing-markup-with-jsx) يجب أن تكون `render` [دالة نقية:](https://en.wikipedia.org/wiki/Pure_function) تحسب JSX فقط.

كما في [مكوّنات الدالة،](/learn/your-first-component#defining-a-component) يمكن لمكوّن الصنف [تلقي معلومات عبر الخصائص](/learn/your-first-component#defining-a-component) من المكوّن الأب، لكن صياغة قراءة الخصائص تختلف. مثلًا، إذا عرض الأب `<Greeting name="Taylor" />`، تقرأ خاصية `name` من [`this.props`](#props)، أي `this.props.name`:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

لاحظ أن Hooks (دوال تبدأ بـ `use`، مثل [`useState`](/reference/react/useState)) غير مدعومة داخل مكوّنات الأصناف.

<Pitfall>

ننصح بتعريف المكوّنات كدوال بدل الأصناف. [اطلع على كيفية الترحيل.](#migrating-a-simple-component-from-a-class-to-a-function)

</Pitfall>

---

### إضافة حالة إلى مكوّن صنف {/*adding-state-to-a-class-component*/}

لإضافة [حالة](/learn/state-a-components-memory) إلى صنف، عيّن كائنًا لخاصية اسمها [`state`](#state). لتحديث الحالة، استدعِ [`this.setState`](#setstate).

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack> 

<Pitfall>

ننصح بتعريف المكوّنات كدوال بدل الأصناف. [اطلع على كيفية الترحيل.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Pitfall>

---

### إضافة دوال دورة حياة إلى مكوّن صنف {/*adding-lifecycle-methods-to-a-class-component*/}

هناك عدة دوال خاصة يمكنك تعريفها على صنفك.

إذا عرّفت [`componentDidMount`](#componentdidmount)، تستدعيها React عند إضافة مكوّنك *(تركيبه)* إلى الشاشة. تستدعي [`componentDidUpdate`](#componentdidupdate) بعد إعادة العرض بسبب تغيّر الخصائص أو الحالة. وتستدعي [`componentWillUnmount`](#componentwillunmount) بعد إزالة المكوّن *(فكه)* من الشاشة.

إذا نفّذت `componentDidMount`، غالبًا تحتاج الثلاثة لتجنّب الأخطاء. مثلًا، إذا قرأت `componentDidMount` حالة أو خصائص، نفّذ `componentDidUpdate` لمعالجة تغيّرها و`componentWillUnmount` لتنظيف ما فعلته `componentDidMount`.

مثلًا، يحافظ مكوّن `ChatRoom` هذا على اتصال محادثة متزامنًا مع الخصائص والحالة:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

لاحظ أنه في التطوير عند تفعيل [Strict Mode](/reference/react/StrictMode)، تستدعي React `componentDidMount` ثم فورًا `componentWillUnmount` ثم `componentDidMount` مجددًا. يساعدك ذلك على ملاحظة إن نسيت `componentWillUnmount` أو إن منطقها لا «يعكس» تمامًا `componentDidMount`.

<Pitfall>

ننصح بتعريف المكوّنات كدوال بدل الأصناف. [اطلع على كيفية الترحيل.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Pitfall>

---

### التقاط أخطاء العرض بحدود خطأ {/*catching-rendering-errors-with-an-error-boundary*/}

افتراضيًا، إذا رمى تطبيقك خطأ أثناء العرض، تزيل React واجهته من الشاشة. لمنع ذلك، يمكنك لفّ جزء من الواجهة في *حدود خطأ (Error Boundary).* حدود الخطأ مكوّن خاص يتيح عرض واجهة احتياطية بدل الجزء الذي تعطّل — مثلًا رسالة خطأ.

<Note>
حدود الخطأ لا تلتقط الأخطاء في:

- معالجات الأحداث [(اطلع على المزيد)](/learn/responding-to-events)
- [عرض الخادم](/reference/react-dom/server)
- الأخطاء المرمية داخل حدود الخطأ نفسها (وليس أبناءها)
- الشيفرة غير المتزامنة (مثل استدعاءات `setTimeout` أو `requestAnimationFrame`)؛ استثناء هو استخدام دالة [`startTransition`](/reference/react/useTransition#starttransition) المُرجَعة من Hook [`useTransition`.](/reference/react/useTransition) الأخطاء داخل دالة الانتقال تُلتقط بحدود الخطأ [(اطلع على المزيد)](/reference/react/useTransition#displaying-an-error-to-users-with-error-boundary)

</Note>

لتنفيذ مكوّن حدود خطأ، وفّر [`static getDerivedStateFromError`](#static-getderivedstatefromerror) لتحديث الحالة استجابةً لخطأ وعرض رسالة للمستخدم. يمكنك اختياريًا تنفيذ [`componentDidCatch`](#componentdidcatch) لمنطق إضافي، مثل تسجيل الخطأ في خدمة تحليلات.

مع [`captureOwnerStack`](/reference/react/captureOwnerStack) يمكنك تضمين Owner Stack في التطوير.

```js {9-12,14-27}
import * as React from 'react';

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
    logErrorToMyService(
      error,
      // Example "componentStack":
      //   in ComponentThatThrows (created by App)
      //   in ErrorBoundary (created by App)
      //   in div (created by App)
      //   in App
      info.componentStack,
      // Warning: `captureOwnerStack` is not available in production.
      React.captureOwnerStack(),
    );
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

ثم يمكنك لفّ جزء من شجرة المكوّنات بها:

```js {1,3}
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

إذا رمى `Profile` أو أحد أبنائه خطأ، «تلتقط»ه `ErrorBoundary` وتعرض واجهة احتياطية بالرسالة التي وفّرتها وتُرسِل تقرير خطأ للإنتاج إلى خدمة التقارير.

لا حاجة للفّ كل مكوّن في حدود خطأ منفصلة. عند التفكير في [دقة حدود الخطأ،](https://www.brandondail.com/posts/fault-tolerance-react) فكّر أين يُعقَل عرض رسالة خطأ. مثلًا، في تطبيق رسائل يُعقَل وضع حدود خطأ حول قائمة المحادثات وحول كل رسالة، لكن ليس حول كل صورة رمزية.

<Note>

لا يوجد حاليًا طريقة لكتابة حدود خطأ كمكوّن دالة. لكن لا يلزمك كتابة صنف حدود الخطأ بنفسك؛ يمكنك مثلًا استخدام [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary).

</Note>

---

## البدائل {/*alternatives*/}

### ترحيل مكوّن بسيط من صنف إلى دالة {/*migrating-a-simple-component-from-a-class-to-a-function*/}

عادةً ستُعرّف [المكوّنات كدوال](/learn/your-first-component#defining-a-component).

مثلًا، لنفترض أنك تحوّل مكوّن الصنف `Greeting` هذا إلى دالة:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

عرّف دالة اسمها `Greeting`. هنا تنقل جسم دالة `render`.

```js
function Greeting() {
  // ... move the code from the render method here ...
}
```

بدل `this.props.name`، عرّف خاصية `name` [بصياغة التفكيك](/learn/passing-props-to-a-component) واقرأها مباشرة:

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

مثال كامل:

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

---

### ترحيل مكوّن يحتوي حالة من صنف إلى دالة {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

لنفترض أنك تحوّل مكوّن الصنف `Counter` هذا إلى دالة:

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = (e) => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

ابدأ بتعريف دالة مع [متغيرات الحالة اللازمة:](/reference/react/useState#adding-state-to-a-component)

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  // ...
```

ثم حوّل معالجات الأحداث:

```js {5-7,9-11}
function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }
  // ...
```

أخيرًا، استبدل كل مراجع `this` بالمتغيرات والدوال التي عرّفتها. مثلًا، `this.state.age` بـ `age`، و`this.handleNameChange` بـ `handleNameChange`.

مكوّن بعد التحويل بالكامل:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <>
      <input
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleAgeChange}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  )
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

---

### ترحيل مكوّن يحتوي دوال دورة حياة من صنف إلى دالة {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

لنفترض أنك تحوّل مكوّن الصنف `ChatRoom` هذا الذي يستخدم دوال دورة الحياة إلى دالة:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

أولًا، تحقّق أن [`componentWillUnmount`](#componentwillunmount) يعكس [`componentDidMount`.](#componentdidmount) في المثال أعلاه هذا صحيح: يفصل الاتصال الذي أعدّته `componentDidMount`. إن غاب هذا المنطق، أضفه أولًا.

ثانيًا، تحقّق أن [`componentDidUpdate`](#componentdidupdate) تعالج تغيّر أي خصائص وحالة تستخدمها في `componentDidMount`. في المثال، تستدعي `componentDidMount` `setupConnection` التي تقرأ `this.state.serverUrl` و`this.props.roomId`؛ لذلك تتحقق `componentDidUpdate` من تغيّرهما وتعيد ضبط الاتصال. إن كان منطق `componentDidUpdate` ناقصًا، أصلحه أولًا.

في المثال، يربط منطق دورة الحياة المكوّن بنظام خارج React (خادم محادثة). لربط مكوّن بنظام خارجي، [صف هذا المنطق كـ Effect واحد:](/reference/react/useEffect#connecting-to-an-external-system)

```js {6-12}
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  // ...
}
```

استدعاء [`useEffect`](/reference/react/useEffect) هذا يعادل منطق دوال دورة الحياة أعلاه. إذا فعلت دوال دورة الحياة عدة أشياء غير مرتبطة، [قسّمها إلى عدة Effects مستقلة.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) مثال كامل يمكنك تجربته:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Note>

إذا لم يزامن مكوّنك أي أنظمة خارجية، [قد لا تحتاج Effect.](/learn/you-might-not-need-an-effect)

</Note>

---

### ترحيل مكوّن يستخدم السياق من صنف إلى دالة {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

في هذا المثال، تقرأ مكوّنات الصنف `Panel` و`Button` [السياق](/learn/passing-data-deeply-with-context) من [`this.context`:](#context)

<Sandpack>

```js
import { createContext, Component } from 'react';

const ThemeContext = createContext(null);

class Panel extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'panel-' + theme;
    return (
      <section className={className}>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </section>
    );    
  }
}

class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

عند تحويلهما إلى مكوّنات دالة، استبدل `this.context` باستدعاءات [`useContext`:](/reference/react/useContext)

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>
