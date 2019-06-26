---
id: faq-state
title: حالة المكونات
permalink: docs/faq-state.html
layout: docs
category: FAQ
---
 
### ماذا يفعل التابع `setState`؟ {#what-does-setstate-do}

يُجدوِل التابع `setState()`‎ تحديثًا لكائن حالة المكوّن `state`. عندما تتغير الحالة يستجب المكوّن بإعادة التصيير.

### ما الفرق بين الحالة `state` والخاصيّات `props`؟ {#what-is-the-difference-between-state-and-props}

[`الخاصيّات props`](/docs/components-and-props.html) (اختصارًا للكلمة properties) و [`الحالة state`](/docs/state-and-lifecycle.html) كلاهما عبارة عن كائنات JavaScript مجرّدة. وفي حين أنّ كلاهما يحمل معلومات تؤثر في ناتج التصيير، فهما مختلفان بطريقة واحدة هامة، حيث تُمرَّر الخاصيّات إلى المكوّن (بشكل مماثل لمُعاملات الدالة) بينما تُدار الحالة `state` ضمن المكوّن (بشكل مشابه للمتغيرات المعرفة بداخل الدالة).

هنا تجد مصادر جيدة لقراءة المزيد حول استخدام الخاصيّات والحالة:
* [Props vs State](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)
* [ReactJS: Props vs. State](https://lucybain.com/blog/2016/react-state-vs-pros/)

### لماذا يُعطيني التابع `setState` القيمة الخاطئة؟ {#why-is-setstate-giving-me-the-wrong-value}

في React تُمثل `this.props` و `this.state` القيم المُصيَّرة، أي المعروضة على الشاشة حاليًّا.

تكون استدعاءات التابع `setState` غير متزامنة، فلا تعتمد على `this.state` لتعكس القيمة الجديدة للحالة بشكل مباشر بعد استدعاء التابع setState. مرر دالة تحديث بدلًا من تمرير كائن إن احتجت لحساب القيم بناءً على الحالة الحاليّة (انظر في الأسفل للمزيد من التفاصيل).

مثال عن شيفرة لن تعمل كما هو متوقع:

```jsx
incrementCount() {
  // ملاحظة: لن يعمل هذا كما هو متوقع
  this.setState({count: this.state.count + 1});
}

handleSomething() {
  // فلنقل أنّ this.state.count تبدأ بالقيمة 0
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();
   // عندما تعيد React تصيير المكون فستصبح قيمة this.state.count 1
  // ولكنك كنت تتوقعها أنها 3

   
  // هذا لأنّ الدالة incrementCount()
  // تقرأ this.state.count
  // ولكن لا تحدث React قيمتها حتى إعادة تصيير المكون
  // لذا ستقرأ React قيمة هذه الدالة على أنها صفر في كل مرة وستعينها للقيمة واحد

  // الحل موصوف لاحقًا
}
```

انظر في الأسفل لمعرفة كيفية إصلاح هذه المشكلة.


### كيف أحدث الحالة بقيم تعتمد على الحالة الحالية؟ {#how-do-i-update-state-with-values-that-depend-on-the-current-state}

مرر دالة بدلًا من كائن إلى التابع `setState` لضمان استخدام الاستدعاء دائمًا لآخر إصدار من الحالة.


### ما الفرق بين تمرير كائن أو دالة إلى التابع `setState`؟ {#what-is-the-difference-between-passing-an-object-or-a-function-in-setstate}

يسمح لك تمرير دالة التحديث بالوصول إلى قيمة الحالة الحالية بداخل دالة التحديث. وبما أنّ استدعاءات التابع `setState` مجدولة سيسمح لك ذلك بسلسلة التحديثات وضمان أنّها تبني فوق بعضها بدلًا من التعارض فيما بينها:

```jsx
incrementCount() {
  this.setState((state) => {
    // هام: اقرأ قيمة prevState بدلًا من this.state عند التحديث
    return {count: state.count + 1}
  });
}

handleSomething() {
  // فلنفترض أنّ قيمة this.state.count تبدأ من الصفر
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();

  // إن قرأت قيمة this.state.count الآن فستكون لا زالت صفر
  // ولكن عندما يعاد تصيير المكون فستصبح 3
}
```

[تعلم المزيد حول setState.](/docs/react-component.html#setstate)

### متى يكون التابع `setState` غير متزامن؟ {#when-is-setstate-asynchronous}

حاليًّا التابع  setState غير متزامن بداخل معالج الأحداث.

إن كان المكوّن الأب `Parent` والمكوّن الابن `Child` يستدعيان التابع `setState` خلال حدث النقر يضمن لنا عدم التزامن ألّا يُعاد تصيير المكوّن الابن `Child` مرتين، وبدلًا من ذلك تمسح React تحديثات الحالة في نهاية أحداث المتصفّح. ينتج عن هذا تحسين هام في الأداء في التطبيقات الكبيرة.

لا يزال هذا تفصيلًا تنفيذيًّا لذا تجنّب الاعتماد عليه بشكل مباشر. في الإصدارات القادمة ستطبّق React التحديثات بشكل افتراضي في حالات أكثر.

### لماذا لا تُحدِّث React قيمة `this.state` بشكلٍ متزامن؟ {#why-doesnt-react-update-thisstate-synchronously}

كما تحدثنا في القسم السابق، تنتظر React عن قصد حتى تستدعي جميع المكوّنات التابع `setState()`‎ في مُعالِجات أحداثها قبل البدء بإعادة التصيير. يُسرِّع هذا الأداء عن طريق تجنّب إعادة التصيير غير الضروريّة.

على أيّة حال قد لا تزال تتساءل لماذا لا تُحدِّث React قيمة `this.state` بشكل مباشر وبدون إعادة التصيير.

هنالك سببان رئيسيّان:

* يخرق هذا التوافقيّة بين الخاصيّات `props` والحالة `state`، مسببًا مشاكل من الصعب تنقيحها.
* سيجعل هذا من بعض الميّزات التي نعمل عليها مستحيلة التطبيق.

يشرح  [ هذا التعليق في GitHub](https://github.com/facebook/react/issues/11527#issuecomment-360199710) بالتفصيل أمثلة عن هذا.

### هل ينبغي أن أستخدم مكتبات إدارة الحالة مثل Redux أو MobX؟ {#should-i-use-a-state-management-library-like-redux-or-mobx}

[ربّما.](https://redux.js.org/faq/general#when-should-i-use-redux)

من الأفضل في البداية التعرّف على React أولًا قبل إضافة مكتبات أخرى. بإمكانك بناء تطبيقات معقدة وكبيرة باستخدام React فقط.
