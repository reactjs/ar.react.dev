---
id: handling-events
title: معالجة الأحداث
permalink: docs/handling-events.html
prev: state-and-lifecycle.html
next: conditional-rendering.html
redirect_from:
  - "docs/events-ko-KR.html"
---

تُشبه معالجة الأحداث لعناصر React معالجة الأحداث لعناصر DOM، ولكن هنالك فروق تتعلّق بالصياغة:

* تُسمَّى أحداث React باستخدام حالة الأحرف camelCase (أي عند وجود اسم مؤلف من عدة كلمات نجعل الحرف الأول من الكلمة الأولى بالشكل الصغير أمّا باقي الكلمات نجعل حرفها الأول بالشكل الكبير) بدلًا من استخدام الشكل الصغير للأحرف.
* نُمرِّر في JSX دالة كمُعالِج للأحداث، بدلًا من سلسلة نصيّة.  

على سبيل المثال لنأخذ شيفرة HTML التالية:

```html
<button onclick="activateLasers()">
  Activate Lasers
</button>
```

تكون الشيفرة السابقة مختلفة قليلًا في React:

```js{1}
<button onClick={activateLasers}>
  Activate Lasers
</button>
```

من الفروق الأخرى أنّه لا يمكنك إعادة القيمة `false` لمنع السلوك الافتراضي في React، بل يجب عليك أن تستدعي `preventDefault` بشكل صريح، فمثلًا في HTML لمنع السلوك الافتراضي للروابط في فتح صفحة جديدة بإمكانك كتابة ما يلي:

```html
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>
```

أمّا في React فنكتب بدلًا من ذلك ما يلي:

```js{2-5,8}
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
```

يُمثِّل المتغيّر `e` هنا حدثًا مُصطنعًا، حيث تُعرِّف React هذه الأحداث المُصطنعة وفق معايير [W3C spec](https://www.w3.org/TR/DOM-Level-3-Events/)، بحيث لا نهتم بمشاكل التوافقيّة بين المتصفحات. للمزيد حول [`الأحداث المصطنعة`](/docs/events.html) انتقل إلى مرجع الأحداث في React.

عند استخدام React بشكل عام لاينبغي استدعاء `addEventListener` لإضافة مُستمِع للأحداث إلى عنصر DOM بعد إنشائه، وبدلًا من ذلك نُضيف مُستمِعًا للأحداث عند تصيير العنصر (Rendering Element).

عند تعريف المُكوِّنات باستخدام [أصناف ES6](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) هنالك نمط شائع لمعالج الأحداث ليكون تابعًا ضمن الصنف، ففي المثال التالي يعرض المُكوِّن `Toggle` زرًّا يُتيح للمستخدم بأن يقلب بين الحالتين "ON" و "OFF":


```js{6,7,10-14,18}
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

[**جرِّب هذا المثال على موقع CodePen**](https://codepen.io/gaearon/pen/xEmzGg?editors=0010)

يجب أن تنتبه إلى معنى `this` في ردود نداء JSX، ففي JavaScript لا [تُربَط](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind) توابع الصّنف بشكل افتراضي عن طريق التابع bind()‎، وإن نسيت أن تربط وتُمرِّر `this.handleClick` إلى `onClick`، فستكون قيمة `this` غير مُعرَّفة عند استدعاء الدالة.

لا يُعدُّ هذا سلوكًا مرتبطًا بـ React، بل هو جزء من [سياق الدوال في JavaScript](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/). بشكل عام إن أشرت إلى التابع بدون استخدام الأقواس `()` بعده، مثل ‎`onClick={this.handleClick}‎`، فيجب أن تربط ذلك التابع.

إن كان استدعاء التابع `bind()`‎ يزعجك، فهناك طريقتان للالتفاف حول استعماله، إن كنت تستخدم صياغة [حقول الصنف العامة](https://babeljs.io/docs/plugins/transform-class-properties/) التجريبيّة فبإمكانك استخدام حقول الصنف لربط ردود النداء بشكل صحيح:

```js{2-6}
class LoggingButton extends React.Component {
  // This syntax ensures `this` is bound within handleClick.
  // Warning: this is *experimental* syntax.
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

هذه الصياغة مُمكَّنة بشكل افتراضي عند استخدام الأمر [Create React App](https://github.com/facebookincubator/create-react-app).

إن لم تكن تستخدم صياغة حقول الأصناف، فبإمكانك استخدام [الدوال السّهمية](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) في ردود النداء:

```js{7-9}
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // This syntax ensures `this` is bound within handleClick
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Click me
      </button>
    );
  }
}
```
المشكلة في هذه الصياغة هي إنشاء رد نداء مختلف في كل مرّة يُصيَّر فيها المُكوِّن `LoggingButton`، وفي معظم الحالات يكون هذا مقبولًا، ولكن إن مرَّرنا رد النداء هذا كخاصيّة prop إلى المُكوِّنات الموجودة في المستوى الأدنى، فقد تقوم هذه المُكوِّنات بعمل إعادة تصيير (re-rendering) إضافيّة. نوصي بشكل عام الربط في الدالة البانية (constructor) أو استخدام صياغة حقول الأصناف لتجنّب مثل هذا النوع من مشاكل الأداء.


## تمرير وسائط إلى معالجات الأحداث {#passing-arguments-to-event-handlers}

من الشائع أن نحتاج بداخل الحلقات (loops) إلى تمرير مُعامِل إضافي إلى مُعالِج الأحداث، فمثلًا إن كان المتغيّر `id` يُمثِّل مُعرِّف الصف (row ID)، فسيعمل كلا السطرين التاليين بنفس الكفاءة:

```js
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

إنّ السطرين السابقين متكافئان ويستخدمان [الدوال السهمية](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) و [`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) على التوالي وبالترتيب.  
في كلتا الحالتين سيُمرَّر الوسيط `e` الذي يُمثِّل حدث React كوسيطٍ ثانٍ بعد المُعرِّف ID. في الدوال السهمية يجب أن نُمرِّره بشكلٍ صريح، ولكن في حالة استخدام التابع `bind` فستُمرَّر أي وسائط أخرى تلقائيًّا.