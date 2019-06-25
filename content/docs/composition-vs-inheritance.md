---
id: composition-vs-inheritance
title: الفرق بين التركيب والوراثة في React
permalink: docs/composition-vs-inheritance.html
redirect_from:
  - "docs/multiple-components.html"
prev: lifting-state-up.html
next: thinking-in-react.html
---

تمتلك React نموذجًا قويًّا للتركيب (composition) ونُوصي باستخدام التركيب بدلًا من الوراثة (inheritance) لإعادة استخدام الشيفرة بين المُكوِّنات.

سننظر في هذا القسم إلى بعض المشاكل التي بسببها قد يستخدم المُطوِّر الجديد على React الوراثة، وسنرى كيفيّة حلّها باستخدام التركيب.


##  مفهوم الاحتواء {#containment}


لا تعرف بعض المُكوِّنات العناصر الأبناء لها مُسبقًا، وهو أمرٌ شائعٌ بشكلٍ خاص بالنسبة لمُكوِّن القائمة الجانبيّة `Sidebar` أو مربّع الحوار `Dialog`.

نُوصي بأن تستخدم تلك المُكوِّنات الخاصيّة `children` لتمرير العناصر بشكلٍ مباشر إلى ناتجها:


```js{4}
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```
يُتيح هذا للمُكوِّنات الأخرى بأن تُمرِّر عناصر أبناء لها عن طريق التداخل في JSX:

```js{4-9}
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```

**[جرب المثال على CodePen](https://codepen.io/gaearon/pen/ozqNOV?editors=0010)**

يُمرَّر أي شيء بداخل العنصر `<FancyBorder>` إلى المُكوِّن `FancyBorder` عبر الخاصيّة `children`. وبما أنّ المُكوِّن `FancyBorder` يُصيِّر `{props.children}` بداخل عنصر `<div>`، فستظهر العناصر المُمرَّرة بداخل الناتج النهائي.

أحيانًا قد تحتاج إلى تمرير عناصر مُتعدِّدة. في تلك الحالات يجب أن تفعل ذلك بطريقتك الخاصّة بدلًا من استخدام `children،` كما يلي:
    

```js{5,8,18,21}
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

[**جرب المثال على CodePen**](https://codepen.io/gaearon/pen/gwZOJp?editors=0010)
     
إنّ عناصر React مثل ‎`<Contacts />‎` و ‎`<Chat />‎` هي مُجرّد كائنات، لذلك بإمكانك تمريرها كخاصيّات `props` مثل أي بيانات أخرى. قد يُذكِّرك ذلك بمفهوم المداخل (slots) في مكتبات أخرى، ولكن لا توجد حدود لما يُمكِنك تمريره كخاصيّات `props` في React.


## التخصيص {#specialization}

أحيانًا نُفكّر بالمُكوِّنات على أنّها حالات خاصّة لمُكوِّنات أخرى، فمثلًا قد نقول أنّ مُكوِّن مربّع الترحيب `WelcomeDialog` هو حالة خاصّة من مربّع الحوار `Dialog`.

يُمكِن تحقيق ذلك في React عن طريق استخدام التركيب (composition) حيث يُصيِّر المُكوِّن الأكثر خصوصيّة المُكوِّن الأكثر عموميّة ويُعد له الخاصيّات:

```js{5,8,16-18}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!" />
  );
}
```

[**جرب المثال على CodePen**](https://codepen.io/gaearon/pen/kkEaOZ?editors=0010)

يعمل التركيب بشكلٍ مُماثل للمُكوِّنات المُعرَّفة كأصناف:

```js{10,27-31}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Mars Exploration Program"
              message="How should we refer to you?">
        <input value={this.state.login}
               onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>
          Sign Me Up!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Welcome aboard, ${this.state.login}!`);
  }
}
```

[**جرب المثال على CodePen**](https://codepen.io/gaearon/pen/gwZbYa?editors=0010)


## إذًا ماذا عن الوراثة؟ {#so-what-about-inheritance}

نستخدم في فيسبوك آلاف مُكوِّنات React، ولم نجد أي حالة نُفضِّل فيها استخدام الوراثة.

يمنحك التركيب والخاصيّات `props` المرونة التي تحتاجها لتخصيص مظهر وسلوك المُكوِّنات بطريقة مضبوطة وآمنة. تذكّر أنّ المُكوّنات قد تستقبل خاصيّات من محتوى مُتعدِّد، مثل القيم المبدئية، وعناصر React، والدوال.

إن أردت إعادة استخدام بعض الوظائف بين المُكوِّنات غير المُتعلِّقة بواجهة المستخدم فنقترح استخراجها إلى واحدات JavaScript مُنفصِلة، حيث يُمكِن للمُكوِّن أن يستورد ويستخدم الدوال والكائنات والأصناف بدون الامتداد لها عن طريق الكلمة `extend`.
