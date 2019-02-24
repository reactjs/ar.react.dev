---
id: conditional-rendering
title: التصيير الشرطي (Conditional Rendering)
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from:
  - "tips/false-in-jsx.html"
---

من خلال React، يمكنك أن تنشيء مكونات (Components) متميزة، والتي تغلف السلوك الذي تريده. ثم يمكنك ان تعرض فقط بعض هذه المكونات، بناءاً على الحالة (State) في التطبيق الخاص بك.

العرض الشرطي في React يعمل بنفس طريقة عمل العرض الشرطي في لغة JavaScript. قم يإستخدام المعاملات الخاصة بلغة JavaScript، مثل [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) أو [conditional operator](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) لإنشاء العناصر التي تمثل الحالة (State)، وسوف يقوم React بتحديث الواجهه الأماميه (UI) لمطابقتها.

أنظر إلى هذين المكوّنين:

```js
function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}
```

سوف ننشيء مكون (Component) لتحية المستخدم، والذي يعرض أحد هذين المكوّنين بناءاً على حالة تسجيل دخول المستخدم:

```javascript{3-7,11,12}
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // Try changing to isLoggedIn={true}:
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

[**جرّب المثال على موقع CodePen**](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

هذا المثال يعرض تحيه مختلفه بناءاً على قيمة الخاصيّه `isLoggedIn`.

### متغيرات العناصر (Element Variables) {#element-variables}

يمكنك استخدام المتغيرات لحفظ العناصر. هذا يجعلك قادراً على عمل تصيير شرطي لجزء من المكوّنً، بينما باقي المخرجات لا تتغير.

أنظر إلى هذين المكوّنين الجديدين، والذين يمثلان أزرار لتسجيل الدخول والخروج للمستخدم:

```js
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}
```

في المثال التالي، سوف نقوم بإنشاء [مكوّن صنف stateful component](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) يسمى `LoginControl`.

سوف يقوم بتصيير إما `<LoginButton />` أو `<LogoutButton />`، بناءاً على حالة المكوّن. سوف يقوم أيضاً بتصيير مكوّن تحية المستخدم، والذي رأيناه في المثال السابق:

```javascript{20-25,29,30}
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

[**جرّب المثال على موقع CodePen**](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)

بينما يعتبر استخدام المتغيرات والتعبير الشرطي if هي طريقه سليمه لعمل التصيير الشرطي للمكوّن، إلا أنّك في بعض الأحيان قد ترغب في استخدام صياغه أقصر. هناك بعض الطرق تمكنك من استخدام التعبير الشرطي المباشر في JSX، شرح هذه الطرق بالأسفل.

### التعبير الشرطي المباشر بإستخدام معامل AND المنطقي {#inline-if-with-logical--operator}

يمكنك [تضمين أيّ تعبيرات في JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) من خلال تغليفهم داخل القوسان المعقوصان `{}`. يتضمن هذا معامل AND `&&` المنطقي في JavaScript. قد يصبح هذا سهل الاستخدام لتضمين عنصر بشكل شرطي:

```js{6-10}
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

[**جرّب المثال على موقع CodePen**](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

هذا المثال يعمل بنجاح لأنه في JavaScript، التعبير `true && expression` دائماً يعطي الناتج `expression`، و التعبير `false && expression` دائماً يعطي الناتج `false`.

ولذلك، إذا كان الشرط يعطي الناتج `true`، فإن العنصر المحدد بعد `&&` سوف يظهر في المخرجات. وإذا كان الناتج `false`، فإن React سوف تهمل العنصر وتتخطّاه.

### التعبير الشرطي المباشر (If-Else) بإستخدام المعامل الشرطي {#inline-if-else-with-conditional-operator}

طريقه أخرى للتصيير الشرطي المباشر في JSX بإستخدام المعامل الشرطي [`condition ? true : false`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator).

في المثال التالي، سوف نستخدم هذه الطريقه لتصيير نص قصير بشكل شرطي:

```javascript{5}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
    </div>
  );
}
```

يمكن استخدام هذه الطريقه أيضاً في التعبيرات الأكبر، بالرغم من أن هذا يجعل الامر أقل وضوحاً لفهم ما يحدث:

```js{5,7,9}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn ? (
        <LogoutButton onClick={this.handleLogoutClick} />
      ) : (
        <LoginButton onClick={this.handleLoginClick} />
      )}
    </div>
  );
}
```

كما هو الحال في JavaScript، يمكنك اختيار النمط المناسب بناءاً على ما تعتبره أنت وفريقك أكثر سهوله في القراءه. تذكّر أيضاً أنّه عندما يصبح التعبير الشرطي اكثر تعقيداً، قد يكون هذا هو الوقت المناسب لـ [استخلاص مكوّن](/docs/components-and-props.html#extracting-components).

### منع المكوّن (Component) من التصيير {#preventing-component-from-rendering}

في بعض الحالات النادره، قد تفضّل أن تجعل المكوّن يخفي نفسه، بالرغم من أنّه تم تصييره من خلال مكوّن آخر. يمكنك فعل ذلك من خلال إعطاء الناتج `null` بدلاً من تصيير مخرجات المكوّن.

في المثال التالي، المكوّن `<WarningBanner />` يتم تصييره بناءاً على قيمة الخاصيّه `warn`. إذا كانت قيمة الخاصيّه تساوي `false`، فإن المكوّن لن يتم تصييره:

```javascript{2-4,29}
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

[**جرّب المثال على موقع CodePen**](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)

إعطاء الناتج `null` في التابع `render` الخاص بالمكوّن لا يؤثر على حدوث التوابع الخاصه بدورة حياة المكوّن (Lifecycle Methods). فمثلاً التابع `componentDidUpdate` سوف يتم استدعاءه كالمعتاد.
