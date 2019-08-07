---
id: faq-styling
title: التنسيق واستخدام CSS
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---
 
### كيف أُضيف أصناف CSS إلى المكوّنات؟ {#how-do-i-add-css-classes-to-components}

مرِّر سلسلة نصيّة إلى خاصيّة اسم الصنف `className` :

```jsx
render() {
  return <span className="menu navigation-menu">القائمة</span>
}
```

من الشائع أن تعتمد أصناف CSS على خاصيّات أو حالة المكوّنات :

```jsx
render() {
  let className = 'menu';
  if (this.props.isActive) {
    className += ' menu-active';
  }
  return <span className={className}>القائمة</span>
}
```

>ملاحظة
>
>إن وجدت نفسك تكتب شيفرة مثل هذه، فتستطيع الحزمة, [classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs) تبسيطها لك.

### هل أستطيع استخدام التنسيقات السطرية (inline)؟ {#can-i-use-inline-styles}

نعم، انظر إلى هذا التوثيق حول التنسيق [من هنا](/docs/dom-elements.html#style).

### هل التنسيقات السطرية سيئة؟ {#are-inline-styles-bad}

تكون أصناف CSS أفضل بشكل عام للأداء من التنسيقات السطرية.

### ماذا يعني المصطلح CSS-in-JS? {#what-is-css-in-js}

يُشير المصطلح CSS-in-JS إلى النمط الذي تُركَّب فيه CSS باستخدام JavaScript بدلًا من تعريفها في الملفّات الخارجيّة. اقرأ [من هنا ](https://github.com/MicheleBertoli/css-in-js)  مقارنة بين مكتبات CSS-in-JS.

لاحظ أنّ هذه الوظيفة ليست جزءًا من React ولكن تُزوّدنا بها مكتبات الطرف الثالث. ليس هناك رأي محدّد لمكتبة React حول كيفيّة تعريف التنسيقات. إن كنت مترددًا فأفضل نقطة للبدء هي تعريف تنسيقاتك في ملف ‎*.css منفصل كالعادة والإشارة إليها باستخدام الخاصيّة [`className`](/docs/dom-elements.html#classname).

### هل بإمكاني إجراء تحريك في React؟ {#can-i-do-animations-in-react}

يُمكِن استخدام React لدعم التحريك. انظر إلى مكتبة [React Transition Group](https://reactcommunity.org/react-transition-group/) ومكتبة  [React Motion](https://github.com/chenglou/react-motion), على سبيل المثال.
