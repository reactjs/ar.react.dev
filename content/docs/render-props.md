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

لمّا كانت المكوّنات الوحدة الأساسية في React لإعادة استخدام الشيفرة، فلنجرّب إعادة ترتيب الشيفرة قليلًا لتستخدم المكوّن `‎<Mouse>`‎ والذي يُغلِّف السلوك الذي نريد إعادة استخدامه في مكان ما:

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
        <h1>Move the mouse around!</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

This approach will work for our specific use case, but we haven't achieved the objective of truly encapsulating the behavior in a reusable way. Now, every time we want the mouse position for a different use case, we have to create a new component (i.e. essentially another `<MouseWithCat>`) that renders something specifically for that use case.

Here's where the render prop comes in: Instead of hard-coding a `<Cat>` inside a `<Mouse>` component, and effectively changing its rendered output, we can provide `<Mouse>` with a function prop that it uses to dynamically determine what to render–a render prop.

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
          Instead of providing a static representation of what <Mouse> renders,
          use the `render` prop to dynamically determine what to render.
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
        <h1>Move the mouse around!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

Now, instead of effectively cloning the `<Mouse>` component and hard-coding something else in its `render` method to solve for a specific use case, we provide a `render` prop that `<Mouse>` can use to dynamically determine what it renders.

More concretely, **a render prop is a function prop that a component uses to know what to render.**

This technique makes the behavior that we need to share extremely portable. To get that behavior, render a `<Mouse>` with a `render` prop that tells it what to render with the current (x, y) of the cursor.

One interesting thing to note about render props is that you can implement most [higher-order components](/docs/higher-order-components.html) (HOC) using a regular component with a render prop. For example, if you would prefer to have a `withMouse` HOC instead of a `<Mouse>` component, you could easily create one using a regular `<Mouse>` with a render prop:

```js
// If you really want a HOC for some reason, you can easily
// create one using a regular component with a render prop!
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

So using a render prop makes it possible to use either pattern.

## Using Props Other Than `render` {#using-props-other-than-render}

It's important to remember that just because the pattern is called "render props" you don't *have to use a prop named `render` to use this pattern*. In fact, [*any* prop that is a function that a component uses to know what to render is technically a "render prop"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce).

Although the examples above use `render`, we could just as easily use the `children` prop!

```js
<Mouse children={mouse => (
  <p>The mouse position is {mouse.x}, {mouse.y}</p>
)}/>
```

And remember, the `children` prop doesn't actually need to be named in the list of "attributes" in your JSX element. Instead, you can put it directly *inside* the element!

```js
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

You'll see this technique used in the [react-motion](https://github.com/chenglou/react-motion) API.

Since this technique is a little unusual, you'll probably want to explicitly state that `children` should be a function in your `propTypes` when designing an API like this.

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

## Caveats {#caveats}

### Be careful when using Render Props with React.PureComponent {#be-careful-when-using-render-props-with-reactpurecomponent}

Using a render prop can negate the advantage that comes from using [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) if you create the function inside a `render` method. This is because the shallow prop comparison will always return `false` for new props, and each `render` in this case will generate a new value for the render prop.

For example, continuing with our `<Mouse>` component from above, if `Mouse` were to extend `React.PureComponent` instead of `React.Component`, our example would look like this:

```js
class Mouse extends React.PureComponent {
  // Same implementation as above...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>

        {/*
          This is bad! The value of the `render` prop will
          be different on each render.
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

In this example, each time `<MouseTracker>` renders, it generates a new function as the value of the `<Mouse render>` prop, thus negating the effect of `<Mouse>` extending `React.PureComponent` in the first place!

To get around this problem, you can sometimes define the prop as an instance method, like so:

```js
class MouseTracker extends React.Component {
  // Defined as an instance method, `this.renderTheCat` always
  // refers to *same* function when we use it in render
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

In cases where you cannot define the prop statically (e.g. because you need to close over the component's props and/or state) `<Mouse>` should extend `React.Component` instead.
