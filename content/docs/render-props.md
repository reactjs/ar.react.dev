---
id: render-props
title: خاصيات التصيير
permalink: docs/render-props.html
---

يُشير مصطلح [خاصيّة التصيير (render prop)](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) إلى تقنية بسيطة لمشاركة الشيفرة بين مكوّنات React باستخدام خاصية والتي قيمتها هي عبارة عن دالة.

يأخذ المكوّن الذي يمتلك خاصيّة تصيير دالة تُعيد عنصر React ويستدعيها بدلًا من تنفيذ منطق التصيير الخاص به.

```jsx
<DataProvider render={data => (
  <h1>أهلا {data.target}</h1>
)}/>
```

تتضمّن المكتبات التي تستخدم خاصيّات التصيير [React Router](https://reacttraining.com/react-router/web/api/Route/render-func) و [Downshift](https://github.com/paypal/downshift).

سنناقش في هذه الصفحة فائدة خاصيّات التصيير وكيفية كتابة خاصيّات التصيير الخاصّة بك.

## استخدام خاصيّات التصيير للاهتمامات المشتركة{#use-render-props-for-cross-cutting-concerns}

تُعد المكوّنات الوحدة الأساسية من الشيفرة القابلة لإعادة الاستخدام في React، ولكن ليس من الواضح كيفيّة مشاركة الحالة أو السلوك من مكوّن إلى مكوّن آخر يحتاج نفس الحالة.

على سبيل المثال يتتبع المكوّن التالي موقع الفأرة في تطبيق الويب:

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
        <h1>حرك الفأرة!</h1>
        <p>موقع الفأرة الحالي هو ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

بينما يتحرك المؤشر على الشاشة، يعرض المكوّن إحداثياته (x, y) ضمن العنصر `<p>`.

السؤال الآن هو كيفيّة إعادة استخدام هذا السلوك في مكوّن آخر؟ أي بمعنى آخر إن احتاج مكوّن آخر إلى معرفة مكان المؤشر، فهل نستطيع تغليف هذا السلوك لمشاركته بسهولة مع ذلك المكوّن؟

بما أن المكوّنات هي الوحدة الأساسية في React لإعادة استخدام الشيفرة، فلنجرّب إعادة ترتيب الشيفرة قليلًا لتستخدم المكوّن `‎<Mouse>`‎ والذي يُغلِّف السلوك الذي نريد إعادة استخدامه في مكان ما:

```js
// يغلف المكون <Mouse> السلوك الذي نحتاجه
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/* ؟ <p> ولكن كيف نصيّر شيء آخر غير العنصر... */}
        <p>موقع الفأرة الحالي هو ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>حرك الفأرة!</h1>
        <Mouse />
      </div>
    );
  }
}
```

يُغلِّف المكوّن `‎<Mouse>‎` الآن السلوك المرتبط بالاستماع إلى أحداث تحريك الفأرة `mousemove` وتخزين إحداثيات (x, y) لموقع المؤشر، ولكنّه ليس قابلًا لإعادة الاستخدام حتى الآن.

فلنفترض أننا نمتلك المكوّن `‎<Cat>`‎ والذي يُصيِّر صورة لقطة تُطارِد الفأرة ضمن الشاشة. بإمكاننا استخدام الخاصيّة ‎`<Cat mouse = { { x, y } } >`‎ لإخبار المكوّن بإحداثيات الفأرة بحيث تعلم أي تضع الصورة في الشاشة.

كمحاولة أولى جرّب تصيير المكوّن ‎`<Cat>`‎ *بداخل تابع التصيير للمكوّن ‎`<Mouse>`‎* كما يلي:

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class MouseWithCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/*
		  كان بإمكاننا فقط تبديل العنصر p بالمكون <Cat> هنا
		  ولكن سيتوجب علينا إنشاء مكون <MouseWithSomethingElse> منفصل
		  في كل مرة نحتاج لاستخدامه. لذا لن يكون <MouseWithCat> قابلًا لإعادة الاستخدام حتى الآن
        */}
        <Cat mouse={this.state} />
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>حرك الفأرة!</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

ستعمل هذه الطريقة لحالتنا، لكننا لم نحقق حتى الآن هدفنا الحقيقي من تغليف هذا السلوك بطريقة قابلة لإعادة الاستخدام، ففي كل مرة نريد فيها الحصول على موقع الفأرة لحالة استخدام مختلفة يجب علينا إنشاء مكوّن جديد (وهو `‎<MouseWithCat>‎`) والذي يُصيِّر شيء ما مُخصَّص لتلك الحالة.

هنا تأتي فائدة خاصيّات التصيير، فبدلًا من كتابة المكوّن `‎<Cat>‎` بشكل حرفي في المكوّن `‎<Mouse>‎` وتغيير ناتجه، بإمكاننا تزويد المكوّن `‎<Mouse>‎` بخاصيّة على شكل دالة تستخدمها لتحدد بشكل ديناميكي ما هي خاصيّة التصيير.


```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/*
		  بدلًا من تزويد تمثيل ثابت لما يصيره المكون <Mouse>
		  استخدم خاصية التصيير لتحدد بشكل دينامكي ما الذي ينبغي تصييره
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>حرك الفأرة!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

والآن بدلًا من نسخ المكوّن `<Mouse>` وكتابة شيفرة حرفية بداخل التابع `render` الخاص به لحل المشكلة لحالة محددة، فسنُزوِّد خاصيّة `render` والتي يستخدمها` <Mouse>` ليحدد بشكل ديناميكي ما الذي ينبغي تصييره.

بشكل أصح، **خاصية التصيير هي دالة يستخدمها المكوّن ليعلم ما يجب تصييره**.

تجعل هذه التقنية من السلوك الذي نحتاجه للمشاركة قابلًا للنقل بسهولة. للحصول على هذا السلوك صيِّر المكوّن `<Mouse>` مع خاصيّة `render` والتي تخبره ما يجب عليه تصييره مع الإحداثيات الحالية للمؤشر.

من الأشياء المثيرة للاهتمام التي تميّز خاصيّات التصيير هي أنّه بإمكانك تطبيقه على [المكوّنات ذات الترتيب الأعلى (higher-order components)](/docs/higher-order-components.html) باستخدام مكوّن اعتيادي مع خاصيّة تصيير. على سبيل المثال إن كنت تفضل أن يكون لديك المكوّن ذو الترتيب الأعلى `withMouse` بدلًا من المكوّن ‎`<Mouse>`‎ فبإمكانك بسهولة إنشاء واحد باستخدام المكوّن `‎<Mouse>`‎ مع خاصيّة تصيير:

```js
// إن أردت حقا مكون ذو ترتيب أعلى فبإمكانك بسهولة
// إنشاء واحد باستخدام مكوّن عادي مع خاصية تصيير
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
```

لذا من الممكن باستخدام خاصية التصيير الانتقال إلى نمط آخر.

## استخدام خاصيات أخرى غير `render` {#using-props-other-than-render}

من الهام معرفة أنّه ليس بالضرورة إذا كان اسم هذا النمط خاصيّات التصيير (render props) أن تستخدم الخاصيّة التي اسمها `render`. ففي الحقيقة [أي دالة يستخدمها المكوّن ليعرف ما الذي ينبغي تصييره هي عمليًّا خاصيّة تصيير](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce). 

على الرغم من استخدام المثال السابق للاسم `render` فبإمكاننا استخدام أي اسم مثل الخاصيّة `children`:

```js
<Mouse children={mouse => (
  <p>موقع الفأرة هو {mouse.x}, {mouse.y}</p>
)}/>
```

ليس من الضروري أن تكون الخاصيّة `children` موجودة في قائمة الخاصيّات في عنصر JSX لديك، فبإمكانك وضعها بشكل مباشر *بداخل* العنصر:

```js
<Mouse>
  {mouse => (
    <p>موقع الفأرة هو {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

سترى أن هذه الطريقة مستخدمة في [react-motion](https://github.com/chenglou/react-motion) API. 

بما أنّ هذه الطريقة غير معتادة قليلًا فقد ترغب بالإعلان عن أنّ `children` يجب أن تكون دالة من خلال `propTypes`:

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

## محاذير {#caveats}

### انتبه عند استخدام خاصية التصيير مع `React.PureComponent` {#be-careful-when-using-render-props-with-reactpurecomponent}

قد يُلغي استخدام خاصية التصيير الفائدة المرجوة من استخدام [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) إن أنشأت الدالة بداخل التابع `render`، وذلك لأنّ المقارنة بين الخاصيّات ستعيد دومًا `false` للخاصيّات الجديدة، وسيُولِّد كل تابع `render` في هذه الحالة قيمة جديدة للخاصيّة `render`. 

فمثلًا بالمتابعة مع المكوّن السابق ‎`<Mouse>`‎، إن كان هذا المكوّن يمتد إلى `React.PureComponent` بدلًا من `React.Component`، فسيبدو مثالنا كما يلي:

```js
class Mouse extends React.PureComponent {
  // نفس التنفيذ السابق...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>حرّك الفأرة!</h1>

        {/*
         `render` هذا سيّء! حيث ستكون قيمة خاصية التصيير
          مختلفة عند كل تصيير
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

في هذا المثال عند كل تصيير للمكوّن `‎<MouseTracker>`‎ فسيُولِّد دالة جديدة كقيمة للخاصية ‎`<Mouse render>`‎، وبذلك يلغي تأثير المكوّن ‎`<Mouse>`‎ الذي يمتد إلى `React.PureComponent` في المقام الأول.

لحل هذه المشكلة تستطيع تعريف الخاصيّة كنسخة من تابع كما يلي:

```js
class MouseTracker extends React.Component {
  // معرف كنسخة تابع
  // يشير this.renderTheCat دومًا إلى *نفس* الدالة عند استخدامها للتصيير
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>حرك الفأرة!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

في الحالات التي لا تستطيع فيها تعريف الخاصيّة بشكل ثابت (مثلًا إذا كنت تحتاج إلى تغيير خاصية أو حالة المكوّن) فيجب أن يمتد المكوّن ‎`<Mouse>‎` إلى `React.Component` بدلًا من ذلك.