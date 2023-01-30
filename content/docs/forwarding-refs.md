---
id: forwarding-refs
title: تمرير المراجع
permalink: docs/forwarding-refs.html
---

<<<<<<< HEAD
تمرير المراجع هو تقنية لتمرير مرجع [ref](/docs/refs-and-the-dom.html) تلقائيًّا من مكوّن إلى عناصره الأبناء. لا يكون هذا ضروريًّا بشكل نموذجي لمعظم مكوّنات التطبيق، ولكن قد يكون مفيدًا لبعض أنواع المكوّنات، خاصّة مكتبات المكوّنات القابلة لإعادة الاستخدام. سنتحدث في هذه الصفحة عن أشيع الحالات التي نحتاج فيها تمرير المراجع.
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Manipulating the DOM with Refs](https://beta.reactjs.org/learn/manipulating-the-dom-with-refs)
> - [`forwardRef`](https://beta.reactjs.org/reference/react/forwardRef)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

Ref forwarding is a technique for automatically passing a [ref](/docs/refs-and-the-dom.html) through a component to one of its children. This is typically not necessary for most components in the application. However, it can be useful for some kinds of components, especially in reusable component libraries. The most common scenarios are described below.
>>>>>>> 5647a9485db3426d62b5a8203f4499c01bcd789b

## تمرير المراجع إلى مكونات DOM {#forwarding-refs-to-dom-components}

فلنأخذ مثال عن المكوّن `FancyButton` والذي يُصيِّر عنصر `button` الأصلي في DOM:
`embed:forwarding-refs/fancy-button-simple.js`

تُخفي مكوّنات React تفاصيلها التنفيذية، وهذا يشمل الناتج المُصيَّر. هناك مكونات أخرى تستخدم المكوّن `FancyButton` عادة لا تحتاجً [للحصول على مرجع](/docs/refs-and-the-dom.html) لعنصر الزر `button `الداخلي. يكون هذا جيّدًا لأنّه يمنع المكوّنات من الاعتماد كثيرًا على بنية DOM للمكوّنات بعظها البعض.

قد يكون مثل هذا التغليف مرغوبًا في مكوّنات التطبيق مثل `FeedStory` أو `Comment`، ولكنّه قد يكون غير مناسب بالنسبة للمكوّنات القابلة لإعادة الاستخدام بكثرة مثل `FancyButton` أو `MyTextInput`. تميل هذه المكوّنات ليتم استخدامها في التطبيق بطريقة مماثلة لزر `button` وحقل الإدخال `input` في DOM الاعتيادي، وقد يكون الوصول إلى عقد DOM الخاصّة بها أمرًا لا بُدّ منه لإدارة التركيز، أو الاختيار، أو التحريكات.

**تمرير المراجع ميزة اختيارية تسمح لبعض المكوّنات باستقبال مرجع `ref` وتمريره إلى المستويات الأدنى إلى المكوّنات الأبناء.**

في المثال ادناه ، المكون `FancyButton` يستخدم `React.forwardRef` للحصول على المرجع `ref` المُمرَّر له، ومن ثمّ يُمرِّره إلى عنصر DOM الأصلي `button` الذي يُصيِّره:

`embed:forwarding-refs/fancy-button-simple-ref.js`

بهذه الطريقة ، تستطيع المكوّنات التي تستخدم المكوّن `FancyButton` الحصول على مرجع عقد DOM الأساسي `button` والوصول إليه عند الضرورة ، كما لو تم أستخدام عنصر `button` الأصلي بشكل مباشر.

وهذا شرح مُفصَّل خطوة بخطوة عمّا يحدث في المثال السابق أعلاه:

1. نقوم بأنشاء مرجع [ref](/docs/refs-and-the-dom.html) عن طريق استدعاء `React.createRef` وتعيينه إلى المتغيّر `ref`.
1. نمرر المرجع `ref` إلى المكوّن ‎`<FancyButton ref={ref}>‎` عن طريق تحديده كخاصيّة JSX.
1. تُمرِّر React المرجع `ref` إلى الدالة ‎`(props, ref) => ...‎` الموجودة بداخل `forwardRef` كوسيط ثانٍ له.
1. نُمرِّر هذا المرجع إلى الزر `‎‎<button ref={ref}>‎‎` عن طريق تحديده كخاصيّة JSX.
1. عند ربط المرجع ستُشير `ref.current` إلى عقدة DOM الخاصّة بالزر ‎`<button>‎`.

>ملاحظة
>
>يكون الوسيط الثاني `ref` فقظ عندما يتم تعريف المكون من خلال استدعاء `React.forwardRef`. لا تستقبل الدوال الاعتيادية او مكونات الصنف الوسيط `ref` و لذلك فهو غير متاح في الخاصيات حتى.
>
>تمرير المراجع ليس محدود فقظ لمكونات DOM. بل أنه بالأمكان تمرير المراجع إلى نُسَخ مكونات الصنف أيضًا. 

## ملاحظة لمشرفين مكتبات المكونات {#note-for-component-library-maintainers}

**عندما تبدأ باستخدام `forwardRef` في مكتبة مكوّناتك الخاصّة، فيجب عليك معاملتها كتغيير جذري وأطلاق إصدار رئيسي جديد من مكتبتك.** وذلك لأنّه من الغالب أنّ مكتبتك لديها سلوك ملحوظ مختلف تمامًا (مثل الأشياء التي نُعيِّن إليها المراجع، والأنواع المستخرجة) وقد يُعطِّل هذا التطبيقات والمكتبات الأخرى التي تعتمد على السلوك القديم.

لا نوصي بتطبيق `React.forwardRef` بشكلٍ شرطي عند وجودها لنفس الأسباب، فهي تغيّر سلوك مكتبتك وقد تُعطِّل تطبيقات مستخدميك عند تحديثهم لمكتبة React بحد ذاتها.

## تمرير المراجع في مكونات من المرتبة الأعلى {#forwarding-refs-in-higher-order-components}

تكون هذه الطريقة مفيدة بشكل خاص مع مكونات من المرتبة الأعلى [higher-order components](/docs/higher-order-components.html) (واختصارًا HOCs). فلنبدأ بمثال عن مكونات من المرتبة الأعلى والذي يعرض خاصيّات المكوّن في الكونسول:
`embed:forwarding-refs/log-props-before.js`


يُمرِّر المكوّن `logProps` كل الخاصيّات عبر المكوّن الذي يُغلِّفه، لذا سيكون الناتج المُصيَّر نفسه. فمثلًا نستطيع استخدام هذا المكوّن من المرتبة الأعلى لعرض جميع الخاصيّات المُمرَّرة إلى المكوّن `FancyButton`:
`embed:forwarding-refs/fancy-button.js`

هنالك شيء واحد يجب الانتباه له في المثال أعلاه ، وهو أن المراجع لن يتم تمريرها. وذلك لأنّ `ref` ليست خاصيّة. مثل خاصية المفتاح `key` مثلًا، حيث تُعامِلها React بشكلٍ مختلف. إن أضفت مرجعًا إلى مكوّن من المرتبة الأعلى فأنه سيُشير إلى المكوّن الخارجي الحاوي وليس المكوّن المُغلّف.

 هذا يعني أنّ المراجع المُخصَّصة من أجل المكوّن `FancyButton` سترتبط فعليًّا بالمكوّن `LogProps`:
`embed:forwarding-refs/fancy-button-ref.js`

لحسن الحظ نستطيع تمرير المراجع إلى المكوّن الداخلي `FancyButton` باستخدام واجهة برمجة التطبيقات `React.forwardRef`. والتي تقبل دالة تصيير تستقبل مُعامِلات للخاصيّات `props` والمرجع `ref` وتُعيد عقدة React. على سبيل المثال:
`embed:forwarding-refs/log-props-after.js`

## عرض اسم مخصص في أدوات التطوير `(DevTools)` {#displaying-a-custom-name-in-devtools}

يقبل `React.forwardRef` دالة تصيير. تستخدم أدوات تطوير React هذه الدالة لتحديد ما سيُعرَض من أجل المكون مُمَرِر المرجع.

على سبيل المثال ، سيظهر المكوّن التالي بالاسم "*ForwardRef*" في أدوات التطوير:

`embed:forwarding-refs/wrapped-component.js`

إن سميت دالة التصيير فستُضمّن أدوات التطوير اسمها (على نحو ‎"*ForwardRef(myFunction)*"‎):

`embed:forwarding-refs/wrapped-component-with-function-name.js`

بإمكانك أيضًا تعيين خاصيّة الدالّة `displayName` لتضمين المكوّن الذي تُغلِّفه:

`embed:forwarding-refs/customized-display-name.js`
