---
id: composition-vs-inheritance
title: Composition vs Inheritance
permalink: docs/composition-vs-inheritance.html
redirect_from:
  - "docs/multiple-components.html"
prev: lifting-state-up.html
next: thinking-in-react.html
---
          .على نموذج تركيبي قوي ، ونوصي باستخدام التركيب بدلاً من التوريث لإعادة استخدام الرمز بين المكونات React يحتوي

           في كثير من الأحيان من أجل الميراث React في هذا القسم ، سننظر في بعض المشكلات التي يواجهها المطورون الجدد في
                                                                                     .ويظهروا كيف يمكننا حلها مع التركيب،

## Containment { الاحتواء { #الاحتواء

                                                 
التي تمثل" مربعات "عامة "Sidebar" أو `Dialog` مثل بعض المكونات لا تعرف أطفالهم في وقت مبكر. هذا أمر شائع خاصة لمكونات           

                        :الخاصة لتمرير عناصر الأطفال مباشرةً إلى مخرجاتهم`children` نوصي بأن تستخدم هذه المكونات دعامة

```js{4}
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```

:JSX هذا يتيح لمكونات أخرى تمرير الأطفال التعسفي لهم عن طريق تداخل

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

**[Try it on CodePen](https://codepen.io/gaearon/pen/ozqNOV?editors=0010)**

  يعرض `FancyBorder` بما أن.children` كطفل` `FancyBorder` إلى مكون `FancyBorder>` JSX  يتم تمرير أي شيء داخل علامة    
                                 .تظهر العناصر التي تم تمريرها في الإخراج النهائي.  ،`<div> داخل ` {props.children}                               
                في حين أن هذا أقل شيوعًا ، فقد تحتاج أحيانًا إلى "ثقوب" متعددة في أحد المكونات. في مثل هذه الحالات 
                                                           :`children` قد تأتي مع الاتفاقية الخاصة بك بدلا من استخدام  

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

[**Try it on CodePen**](https://codepen.io/gaearon/pen/gwZOJp?editors=0010)

كدعامات مثل أي بيانات أخرى. قد يذكرك هذا النهج بـ "الفتحات" في المكتبات الأخرى ،   `<Contacts />` و `<Chat />` مثل  React إن عناصر
                                                                              React  ولكن لا توجد قيود على ما يمكنك تمريره كدعامات في   
## Specialization ( التخصص (#التخصص

.`Dialog`هي حالة خاصة لـ`WelcomeDialog`أحيانا نفكر في المكونات بأنها "حالات خاصة" من المكونات الأخرى. على سبيل المثال ، قد نقول إن 

                :يتحقق ذلك أيضًا من خلال التكوين ، حيث يؤدي مكون "محدد" أكثر إلى عرض "عام" أكثر وتكوينه باستخدام الدعائم ،React في

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

[**Try it on CodePen**](https://codepen.io/gaearon/pen/kkEaOZ?editors=0010)

:يعمل التركيب بشكل جيد للمكونات المحددة كطبقات

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

[**Try it on CodePen**](https://codepen.io/gaearon/pen/gwZbYa?editors=0010)


## So What About Inheritance? {إذن ماذا عن الوراثة؟ {# ذلك، ما-حول الميراث

               في آلاف المكونات ، ولم نعثر على أي حالات استخدام نوصي فيها بإنشاء تسلسلات هرمية للمكونات React نستخدم ،Facebook في

تمنحك الدعامات والتكوينات كل المرونة التي تحتاج إليها لتخصيص مظهر وسلوك أحد المكونات بطريقة صريحة وآمنة. تذكر أن المكونات قد 
                                                  .تقبل الدعائم التعسفية ، بما في ذلك القيم البدائية أو عناصر التفاعل أو الوظائف  

   إذا كنت ترغب في إعادة استخدام وظائف غير تابعة لواجهة المستخدم بين المكونات ، فإننا نقترح عليك استخلاصها في وحدة جافا سكريبت 
                                 .منفصلة. قد تقوم المكونات باستيرادها واستخدام هذه الوظيفة ، أو الكائن ، أو الفئة ، دون تمديدها    
