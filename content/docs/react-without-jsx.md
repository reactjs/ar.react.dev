---
id: react-without-jsx
title: React بدون JSX
permalink: docs/react-without-jsx.html
---

JSX ليست متطلب لإستخدام React .حيث يمكنك إستخدام React بدون JSX بشكل خاص عندما لاترغب في إعداد مرحلة التصريف في بيئة البناء لديك.

كل عنصر من  JSX هو فقط تجميل صياغي لمناداة الداله `React.createElement(component, props, ...children)`. اذاً, أي شيء يمكن تطبيقه باستخدام JSX  من الممكن ايضاً تطبيقه بإستخدام javascript.

كمثال, هذه الشيفرة مكتوبه باستخدام JSX:

```js
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```

وتصرف الى شيفرة على النحو التالي بدون JSX:

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

إذا كنت مهتماً لرؤية المزيد من الامثلة عن كيفية تصريف شيفرة JSX الى javascript, فبإمكانك تجربة [مصرف Babel على الإنترنت](babel://jsx-simple-example).

يمكن تزويد المكون كسلسلة نصية, أو كصنف فرعي من `React.Component`, أو كدالة مجردة من أجل المُكونات بدون الحالة.

إن تعبت من كثرة كتابة `React.createElement`, فمن الأساليب الشائعة هي الطريقة المختصرة التالية:

```js
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Hello World'),
  document.getElementById('root')
);
```

إذا إستخدمت هذه الصيغة المختصرة (الثابت e) لأجل `React.createElement`, فسيكون من المناسب تمامًا استخدام React بدون JSX.

بدلاً من ذلك, تستطيع الرجوع إلى مشاريع مجتمع React مثل [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) و [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers) والتي توفر صياغة مختصرة أكثر.

