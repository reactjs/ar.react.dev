---
title: Unknown Prop Warning
layout: single
permalink: warnings/unknown-prop.html
---
سَيُطلق تحذير خاصية-غير-معروفة "unknown-prop" إن قُمت بمحاولة تصيير عنصر DOM مع خاصية لم يُتَعرَّف عليها من قِبَل React كخاصية DOM قانونية. عليك التّأكد من أن عناصر DOM خاصتك ليس لديها خواص طُفيليّة.

هُناك بضعة أسباب شائعة أُخرى قد تُظهر التحذير:

1. هل تستخدم `{...this.props}` أو `cloneElement(element, this.props)`؟ يَنقل مُكوّنك خواصُه مُباشرةً إلى المُكوّن الإبن ([نقل الخواص "transferring props"](/docs/transferring-props.html)). عند نقل الخواص إلى مُكوّن إبن ينبغي عليك التأكد أنّه لم يتم نقل خواص من المُفترض أن تُفَسّر من قِبَل المُكوّن الأب إلى مكوّن إبن

2. تستخدم خواص DOM غير قياسية على عُقدة DOM أصلية ربما لعرض بيانات مُخصصة. إن كُنت تُحاول ربط بيانات مُخصصة بِعُنصر DOM تقليدي فعليك باستخدام خاصية بيانات مُخصصة "custom data attribute" كَما شُرِحَت [على MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes).

3. لا تتعرّف React على الخاصية التي حددتها. سيتم غالبًا إصلاح ذلك في نُسخة مُستقبلية من React. على أية حال ، تُزيل React حاليًا جميع الخواص الغير معروفة ، مما يعني أن تحديدهم في تطبيق React خاصيك لن يؤدي إلى تصييرهم.

4. تستخدم مُكوّن React بدون حروف كبيرة "upper case". تُفسّر React المُكون إلى وَسم "DOM tag" لأنّ [تحويل React JSX يستخدم ميثاق الحروف الكبيرة مُقابل الحروق الكبيرة للتميز بين المُكوّنات التي يُعرّفها المُستخدم وَوُسوم DOM](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized).

---

لإصلاح ذلك ، ينبغي على المُكوّنات المُرَكِبة أن تستنفذ أي خاصيّة مقصودة لها وليس للمُكوّ الإبن. كمثال:

**سيّئ:** تمرير خاصية `layout` غير المُتوفعة إلى وَسم `div`.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // BAD! Because you know for sure "layout" is not a prop that <div> understands.
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // BAD! Because you know for sure "layout" is not a prop that <div> understands.
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**جيّد:** يُمكن استخدام عامل الانتشار "speard operator" لأنتزاع خواص وتعيين االخواص المُتبقية إلى مُتغيّر.

```js
function MyDiv(props) {
  const { layout, ...rest } = props
  if (layout === 'horizontal') {
    return <div {...rest} style={getHorizontalStyle()} />
  } else {
    return <div {...rest} style={getVerticalStyle()} />
  }
}
```

**جيّد:** يُمكنك أيضًا تعيين الخواص إلى كائن جديد ومَحو المفاتيح التي تستخدِمُها من الكائن الجديد. تأكّد من عدم محو الخواص من الكائن `this.props` الأصلي لأن ذلك الكائن من المفروض ألّا يتغير.

```js
function MyDiv(props) {

  const divProps = Object.assign({}, props);
  delete divProps.layout;

  if (props.layout === 'horizontal') {
    return <div {...divProps} style={getHorizontalStyle()} />
  } else {
    return <div {...divProps} style={getVerticalStyle()} />
  }
}
```
