---
id: react-without-es6
title: React بدون ES6
permalink: docs/react-without-es6.html
---

نُعرِّف عادةً مُكوّنات React كأصناف JavaScript مُجرَّدة:

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

إن لم تكن تستخدم ES6 بعد، فبإمكانك استخدام الوحدة `create-react-class` بدلًا من ذلك:


```javascript
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>;
  }
});
```

تُشبِه واجهة برمجة التطبيقات لأصناف ES6 الصنف `createReactClass()` مع بعض الاستثناءات.

## تعريف الخاصيات الافتراضية {#declaring-default-props}

تُعرَّف الخاصيّات الافتراضيّة `defaultProps` في أصناف ودوال ES6 كخاصيّة ضمن المُكوّن نفسه:

```javascript
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary'
};
```

أمّا باستخدام `createReactClass()`‎ فتحتاج لتعريف الدالة `getDefaultProps()`‎ كدالة ضمن الكائن المُمرَّر:

```javascript
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Mary'
    };
  },

  // ...

});
```

## تعيين الحالة المبدئية {#setting-the-initial-state}

في أصناف ES6 تستطيع تعريف الحالة المبدئية عن طريق تعيين `this.state`  في الدالة البانية:

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}
```

يجب عليك مع الدالة `createReactClass()`‎ تزويدها بتابع `getInitialState` منفصل والذي يُعيد الحالة المبدئية:

```javascript
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```

## الربط التلقائي {#autobinding}

تتبع التوابع في مكوّنات React المُعرَّفة كأصناف ES6 نفس القواعد في أصناف ES6 الاعتيادية. يعني هذا أنّها لا تربط `this` بنسخة الكائن، بل يجب عليك أن تستخدم بشكل صريح التابع ‎`.bind(this)`‎ في الدالة البانية:

```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
    // This line is important!
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    // Because `this.handleClick` is bound, we can use it as an event handler.
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

لا يكون هذا ضروريًّا مع `createReactClass()`‎ لأنّها تربط كل التوابع بشكلٍ تلقائي:

```javascript
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Hello!'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
});
```

يعني هذا أن كتابة أصناف ES6 يحتاج لكتابة شيفرة متكررة من أجل معالجات الأحداث ولكنّ الجانب الجيد هنا هو الحصول على أداء أفضل قليلًا في التطبيقات الكبيرة. 

إن كنت لا تحب كتابة الشيفرة بشكل متكرر فتستطيع تمكين صياغة [خاصيّات الأصناف](https://babeljs.io/docs/plugins/transform-class-properties/) **التجريبية** مع Babel:


```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
  }
  // WARNING: this syntax is experimental!
  // Using an arrow here binds the method:
  handleClick = () => {
    alert(this.state.message);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

انتبه إلى أنّ هذه الصياغة **تجريبية** وبالتالي قد تتغير أو لا تبقى موجودة أصلًا.

إن كنت تفضّل البقاء بأمان فلديك بعض الخيارات:

* ربط التوابع في الدالة البانية..
* استخدام الدوال السهمية، مثل `onClick={(e) => this.handleClick(e)}`.
* الاستمرار في استخدام `createReactClass`.

## المخاليط (Mixins) {#mixins}

>**ملاحظة:**
>
>أُطلِقت ES6 بدون أي دعم للمخاليط، ولذلك لا يوجد دعم لها عندما تستخدم React مع أصناف ES6.
>
>**وجدنا أيضًا العديد من المشاكل عند استخدام المخاليط، [ولا نفضّل استخدامها في الشيفرات الجديدة](/blog/2016/07/13/mixins-considered-harmful.html).**
>
>يُوجَد هذا القسم فقط للتوثيق.

قد تتشارك بعض المُكوِّنات المختلفة كثيرًا ببعض الوظائف. يُدعى هذا أحيانًا بالاهتمامات المشتركة [cross-cutting concerns](https://en.wikipedia.org/wiki/Cross-cutting_concern). يُتيح لك `createReactClass` أن تستخدم نظام `المخاليط` القديم لأجل ذلك.

إحدى حالات الاستخدام الشائعة هي عندما يريد المُكوّن تحديث نفسه وفق فاصلة زمنية ثابتة. من السهل استخدام الدالة `setInterval()` ولكن من الهام أن تلغيها عند عدم الحاجة إليها لتوفير الذاكرة. تُزوِّدنا React بتوابع [دورة حياة المُكوِّنات](/docs/react-component.html#the-component-lifecycle) والتي تُعلِمنا بوقت إنشاء أو تدمير المُكوّن. فلنُنشِئ مخلوطًا بسيطًا يستخدم هذه التوابع لإعطائنا دالة `setInterval()` والتي تتوقف تلقائيًّا عند تدمير المُكوّن:

```javascript
var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};

var createReactClass = require('create-react-class');

var TickTock = createReactClass({
  mixins: [SetIntervalMixin], // Use the mixin
  getInitialState: function() {
    return {seconds: 0};
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000); // Call a method on the mixin
  },
  tick: function() {
    this.setState({seconds: this.state.seconds + 1});
  },
  render: function() {
    return (
      <p>
        React has been running for {this.state.seconds} seconds.
      </p>
    );
  }
});

ReactDOM.render(
  <TickTock />,
  document.getElementById('example')
);
```

إذا كان المُكوّن يستخدم مخاليط متعددة تُعرِّف نفس توابع دورة الحياة (أي مثلًا تريد كل هذه المخاليط إيقاف التابع setInterval()‎ عند تدمير المُكوّن)، فسنضمن استدعاء كافة توابع دورة الحياة. تعمل التوابع المُعرَّفة في المخاليط بنفس الترتيب الذي أوردنا فيه هذه المخاليط متبوعةً باستدعاء التابع على المُكوّن.
