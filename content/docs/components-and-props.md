---
id: components-and-props
title: المكونات والخاصيات
permalink: docs/components-and-props.html
redirect_from:
  - "docs/reusable-components.html"
  - "docs/reusable-components-zh-CN.html"
  - "docs/transferring-props.html"
  - "docs/transferring-props-it-IT.html"
  - "docs/transferring-props-ja-JP.html"
  - "docs/transferring-props-ko-KR.html"
  - "docs/transferring-props-zh-CN.html"
  - "tips/props-in-getInitialState-as-anti-pattern.html"
  - "tips/communicate-between-components.html"
prev: rendering-elements.html
next: state-and-lifecycle.html
---

تتيح لنا المُكوِّنات (Components) تقسيم واجهة المستخدم إلى قطع مُستقِلَّة قابلة لإعادة الاستخدام، والتفكير بكل قطعة على انفراد. سنتحدّث في هذه الصفحة عن مُقدّمة إلى مفهوم المُكوِّنات،  بإمكانك أن تجد مرجعًا مُفصَّلًا حول [واجهة برمجة التطبيق (API) الخاصّة بالمُكوِّنات من هنا](/docs/react-component.html).

تُشبِه المُكوِّنات من الناحية النظريّة دوال JavaScript، فهي تقبل مُدخَلات المستخدم (والتي تُدعى props اختصارًا للكلمة properties وتعني الخاصيّات) وتُعيد عناصر React وصف ما الذي ينبغي عرضه على الشّاشة.

## مكونات الأصناف والدوال {#function-and-class-components}

إنّ أبسط طريقة لتعريف مُكوِّن هي كتابة دالة JavaScript:

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

تُعدّ هذه الدالة مُكوِّنًا صالحًا في React لأنّها تقبل وسيطًا واحدًا من خاصيّات الكائن "props" (اختصارًا للكلمة properties وتعني الخاصيّات) مع بياناته وتُعيد عنصر React. ندعو مثل هذه المُكوِّنات بالمُكوِّنات الداليّة "function components" لأنّها عبارة عن دوال JavaScript.

بإمكانك أيضًا أن تستخدم [الأصناف "ES6 class"](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) لتعريف المُكوِّنات كما يلي:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

إنّ المُكوِّنين السابقين مُتكافِئان من وجهة نظر React.

تمتلك الأصناف بعض الميّزات الإضافيّة التي سنتحدّث عنها في قسم [القسم التالي](/docs/state-and-lifecycle.html). وحتى ذلك الوقت سنستخدم المُكوِّنات الداليّة لبساطتها.

## تصيير المكوّنات (Rendering) {#rendering-a-component}

م نصادف حتى الآن إلّا عناصر React تُمثِّل عناصر DOM المُعتادة:

```js
const element = <div />;
```

ولكن يُمكِن للعناصر أن تُمثِّل مُكوِّنات مُعرَّفة من قبل المستخدم:

```js
const element = <Welcome name="Sara" />;
```

عندما تجد React عنصرًا يُمثِّل مُكوِّنًا مُعرَّفًا من قبل المستخدم، فستُمرِّر خاصيّات JSX إليه على شكل كائن وحيد، ندعو هذا الكائن "props".

لى سبيل المثال تعرض هذه الشيفرة عبارة "Hello, Sara" في الصّفحة:

```js{1,5}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[](codepen://components-and-props/rendering-a-component)

تلخيص ما حدث في هذا المثال:

1. نستدعي التّابع `ReactDOM.render()` مع العنصر `<Welcome name="Sara" />`.
2. تستدعي React المُكوِّن `Welcome` مع تمرير `{name: 'Sara'}` كخاصيّة props.
3. يُعيد العنصر `Welcome` العنصر `<h1>Hello, Sara</h1>` كنتيجة له.
4. تُحدِّث React DOM بكفاءة DOM ليُطابِق `<h1>Hello, Sara</h1>`.

>**ملاحظة:** يجب أن تبدأ أسماء المُكوِّنات دومًا بأحرف كبيرة.
>
>تُعامِل React المُكوِّنات التي تبدأ بأحرف صغيرة كعناصر DOM، على سبيل المثال يُمثِّل `<div />` عنصر HTML الذي يُدعى div، بينما تُمثِّل `<Welcome />` مُكوِّنًا في React وتتطلَّب أن يكون تعريف هذا المُكوِّن موجودًا ضمن المجال المُحدَّد.
>
>بإمكانك قراءة المزيد عن المنطق الكامن وراء هذه الاتفاقيّة [من هنا](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized).

## Composing Components {#composing-components}

Components can refer to other components in their output. This lets us use the same component abstraction for any level of detail. A button, a form, a dialog, a screen: in React apps, all those are commonly expressed as components.

For example, we can create an `App` component that renders `Welcome` many times:

```js{8-10}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[](codepen://components-and-props/composing-components)

Typically, new React apps have a single `App` component at the very top. However, if you integrate React into an existing app, you might start bottom-up with a small component like `Button` and gradually work your way to the top of the view hierarchy.

## Extracting Components {#extracting-components}

Don't be afraid to split components into smaller components.

For example, consider this `Comment` component:

```js
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[](codepen://components-and-props/extracting-components)

It accepts `author` (an object), `text` (a string), and `date` (a date) as props, and describes a comment on a social media website.

This component can be tricky to change because of all the nesting, and it is also hard to reuse individual parts of it. Let's extract a few components from it.

First, we will extract `Avatar`:

```js{3-6}
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}
```

The `Avatar` doesn't need to know that it is being rendered inside a `Comment`. This is why we have given its prop a more generic name: `user` rather than `author`.

We recommend naming props from the component's own point of view rather than the context in which it is being used.

We can now simplify `Comment` a tiny bit:

```js{5}
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

Next, we will extract a `UserInfo` component that renders an `Avatar` next to the user's name:

```js{3-8}
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```

This lets us simplify `Comment` even further:

```js{4}
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[](codepen://components-and-props/extracting-components-continued)

Extracting components might seem like grunt work at first, but having a palette of reusable components pays off in larger apps. A good rule of thumb is that if a part of your UI is used several times (`Button`, `Panel`, `Avatar`), or is complex enough on its own (`App`, `FeedStory`, `Comment`), it is a good candidate to be a reusable component.

## Props are Read-Only {#props-are-read-only}

Whether you declare a component [as a function or a class](#function-and-class-components), it must never modify its own props. Consider this `sum` function:

```js
function sum(a, b) {
  return a + b;
}
```

Such functions are called ["pure"](https://en.wikipedia.org/wiki/Pure_function) because they do not attempt to change their inputs, and always return the same result for the same inputs.

In contrast, this function is impure because it changes its own input:

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

React is pretty flexible but it has a single strict rule:

**All React components must act like pure functions with respect to their props.**

Of course, application UIs are dynamic and change over time. In the [next section](/docs/state-and-lifecycle.html), we will introduce a new concept of "state". State allows React components to change their output over time in response to user actions, network responses, and anything else, without violating this rule.
