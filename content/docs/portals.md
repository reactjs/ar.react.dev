---
id: portals
title: Portals
permalink: docs/portals.html
---
 
تُزوّدنا Portals بطريقة ممتازة لتصيير المكونات الأبناء إلى عقدة DOM موجودة خارج تسلسل DOM للمكونات الآباء.


```js
ReactDOM.createPortal(child, container)
```

الوسيط الأول (`child`) هو عبارة عن أي [مكوّن ابن قابل للتصيير في React](/docs/react-component.html#render)، مثل العناصر، والسلاسل النصية، والأجزاء (fragments). الوسيط الثاني (`container`) هو عنصر DOM.

## الاستخدام {#usage}

عندما تُعيد عنصر من تابع تصيير المكوّن فبشكل اعتيادي يُوصَل إلى DOM كمكوّن ابن لأقرب عقدة أب:

```js{4,6}
render() {
  // تصل React عنصر div جديد وتصير الأبناء إليه
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

ولكن من المفيد أحيانًا إدخال الابن في مواقع متعددة من DOM:

```js{6}
render() {
  // لا تنشئ React عنصر div جديد، فهي تصير الأبناء إلى `domNode`
  // `domNode` هي اي عقدة DOM صحيحة بغض النظر عن موقعها في DOM
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

الحالة النموذجية لاستخدام portals هي عندما يمتلك المكوّن الأب التنسيق  `overflow: hidden` أو `z-index` ولكنك تريد من المكوّن الابن أن يظهر خارج حاويته، على سبيل المثال مربعات الحوار (dialogs) وتلميحات الأدوات (tooltips).

> ملاحظة:
>
> تذكر عند التعامل مع Portals أنّ [إدارة تركيز لوحة المفاتيح](/docs/accessibility.html#programmatically-managing-focus) تصبح أمرًا هامًّا.
>
>من أجل مربعات الحوار تأكد من قدرة جميع المستخدمين على التعامل معها عن طريق اتباع [هذه الإرشادات](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal).

[**جرب المثال على CodePen.**](https://codepen.io/gaearon/pen/yzMaBd)

## انتشار الأحداث عن طريق Portals {#event-bubbling-through-portals}

بالرغم من أن portals يُمكِن لها أن تكون في أي مكان من شجرة DOM، فهي تتصرف مثل عناصر React الأبناء في كل طريقة أخرى. تعمل ميزات مثل السياق بنفس الطريقة بالضبط بغض النظر إن كان العنصر الابن portal أم لا، لأنّ portal يبقى موجودًا في *شجرة React* بغض النظر عن موقعه في *شجرة DOM*.

يتضمّن ذلك انتشار الأحداث (event bubbling)، حيث أنّ الحدث الذي أُطلِق بداخل portal سيتصاعد إلى العناصر الأسلاف في *شجرة React* حتى ولو لم تكن هذه العناصر أسلافًا في *شجرة DOM*. بافتراض بنية HTML التالية:


```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

سيكون المكوّن الأب `Parent` في  `#app-root` قادرًا على الإمساك بالحدث المُضاعَف من العقدة الشقيقة له وهي ‎`#modal-root`.

```js{28-31,42-49,53,61-63,70-71,74}
// الحاويتان التاليتان هما أشقاء في DOM
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
  // يُدخَل عنصر portal في شجرة DOM
	// بعد وصل أبناء الـ modal
	// مما يعني وصل الأبناء إلى عقدة DOM منفصلة
	// إن احتاج المكون الابن وصله إلى عقدة DOM مباشرة عند الوصل
	// مثلا لقياس عقدة DOM
	// أو استخدام التركيز التلقائي
	// فأضف حالة إلى الـ Modal وصير فقط الابن
	// عند إدخال الـ Modal في شجرة DOM
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
	  // سيطلَق هذا عند الضغط على الزر في المكون الابن
	  // مما يحدث حالة المكون الأب
	  // حتى ولو لم يكن الزر منحدرًا بشكل مباشر في DOM.
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>عدد النقرات : {this.state.clicks}</p>
        <p>
		  افتح أدوات تطوير المتصفح لتلاحظ أن الزر ليس ابنًا
		  للعنصر div
		  الذي يمتلك معالج الأحداث onClick.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // سيتضاعف حدث النقر على هذا الزر إلى المكون الأب
  // بسبب عدم وجود خاصية onClick معرفة
  
  return (
    <div className="modal">
      <button>انقر هنا</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

[**جرب المثال على موقع CodePen.**](https://codepen.io/gaearon/pen/jGBWpE)

يسمح الإمساك بالحدث المُضاعَف من protal في المكوّن الأب بتطوير تجريدات مرنة والتي لا تعتمد على protals. على سبيل المثال إن صيرنا المكوّن `<Modal />`‎، فبإمكان المكوّن الأب له التقاط أحداثه بغض النظر عمّا إذا كان يعتمد protals.

