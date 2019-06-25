---
id: error-boundaries
title: حدود الأخطاء
permalink: docs/error-boundaries.html
---

في الماضي كانت أخطاء JavaScript بداخل المكوّنات تؤدّي إلى تخريب حالة React الداخلية [وإصدار](https://github.com/facebook/react/issues/4026) [أخطاء](https://github.com/facebook/react/issues/8579) [مخفية](https://github.com/facebook/react/issues/6895) في التصييرات التالية. كانت هذه الأخطاء مُسبَّبة دومًا بخطأ باكر في شيفرة التطبيق، ولكن لم تكن تعطينا React طريقة للتعامل معها في المكوّنات، ولم يكن بإمكانها استعادتها أيضًا.



## مقدمة إلى حدود الأخطاء {#introducing-error-boundaries}

لا يجب أن يؤدّي خطأ JavaScript الحاصل في جزء من واجهة المستخدم إلى تعطيل كامل التطبيق. ولحل هذه المشكلة لمستخدمي React، قدّمت React في الإصدار 16 مفهومًا جديدًا وهو حد الخطأ (error boundary).

حدود الأخطاء هي مكوّنات في React والتي **تلتقط أخطاء JavaScript في أي مكان من شجرة المكوّنات الأبناء لها، وتُسجِّل هذه الأخطاء، وتعرض واجهة مستخدم بديلة** وذلك بدلًا من عرض شجرة المكوّنات التي انهارت. تلتقط حدود الأخطاء هذه الأخطاء خلال التصيير، وفي توابع دورة حياة المكوّن، وفي الدوال البانية لكامل الشجرة الموجودة تحتها.

> ملاحظة
>
>  **لا** تلتقط حدود الأخطاء أخطاءً من أجل:
>
> * معالجات الأحداث ([تعلّم المزيد](#how-about-event-handlers))
> * الشيفرة غير المتزامنة (مثل ردود نداء `setTimeout` أو `requestAnimationFrame`)
> * التصيير من جانب الخادم.
> * الأخطاء المرميّة من قبل حد الخطأ نفسه (بدلًا من أخطاء المكوّنات الأبناء له).

تُصبِح مكوّنات الأصناف حدودًا للأخطاء إن عرّفت تابعًا جديدًا لدورة الحياة يُدعى  [`static getDerivedStateFromError()`](/docs/react-component.html#static-getderivedstatefromerror) أو [`componentDidCatch()`](/docs/react-component.html#componentdidcatch). إستعمل `static getDerivedStateFromError()` لتعرض واجة مستخدم بها أخطاء. وإستعمل `componentDidCatch()` لتسجيل معلومات عن الخطأ.

```js{7-10,12-15,18-21}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // عرض واجهة مستخدم بديلة
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // تستطيع تسجيل الخطأ إلى خدمة تبليغ عن الأخطاء
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // تستطيع تصيير أي واجهة مستخدم بديلة مخصصة
      return <h1>حدث خطأ ما.</h1>;
    }

    return this.props.children; 
  }
}
```

بعدها تستطيع استخدامها كمكوّنات اعتياديّة:

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

تعمل حدود الأخطاء مثل الكتلة `catch {}`، ولكن لأجل المكوّنات.. تستطيع فقط مكوّنات الأصناف أن تُصبِح حدودًا للأخطاء. في الممارسة العمليّة سترغب في أغلب الأوقات في التصريح عن مكوّن لحدود الأخطاء مرّة واحدة ومن ثم استخدامه خلال تطبيقك.

لاحظ أنّ **حدود الأخطاء تلتقط فقط الأخطاء في المكوّنات التي تقع تحتها في شجرة المكوّنات**، فلا يستطيع التقاط خطأ موجود ضمنه.إن فشل حد الأخطاء في محاولة تصيير رسالة الخطأ فستنتشر رسالة الخطأ إلى أقرب حد خطأ موجود في المستويات الأعلى منه. وهذا يُشبِه كيفيّة عمل الكتلة `catch {}` في JavaScript.

## تجربة حية {#live-demo}

تحقق من [هذا المثال عن تصريح واستخدام حدود الأخطاء](https://codepen.io/gaearon/pen/wqvxGa?editors=0010) في [React 16](/blog/2017/09/26/react-v16.0.html).


## أين نضع حدود الأخطاء {#where-to-place-error-boundaries}

تستطيع وضع حدود الأخطاء أينما شئت. فقد تضعها في المكوّنات ذات المستوى الأعلى لعرض رسالة "حدث خطأ ما" للمستخدمين، مثلما تتعامل أُطُر عمل من طرف الخادم مع الانهيار. بإمكانك أيضًا تغليف الأدوات الذكية (widgets) ضمن حدود أخطاء لكي لا تؤدي لانهيار كامل التطبيق معها.


## سلوك جديد للأخطاء غير الملتقطة {#new-behavior-for-uncaught-errors}

يملك هذا التغيير تأثيرًا هامًّا. **فبدءًا من إصدار React 16 أصبحت الأخطاء التي لا تلتقطها حدود الأخطاء ينتج عنها فصل كامل شجرة المكوّنات..**

ترددنا في هذا القرار، ولكن من خلال تجربتنا من الأسوأ ترك واجهة مستخدم معطوبة في مكانها بدلًا من إزالتها بشكل كامل. على سبيل المثال في مُنتَج مثل Messenger قد يؤدّي ترك واجهة المستخدم المعطوبة مرئيّة إلى إرسال رسالة للشخص الخطأ. وبشكلٍ مماثل من الأسوأ أيضًا بالنسبة لتطبيق للدفع أن يعرض مبلغًا خاطئًا بدلًا من عدم عرض شيء.

يعني هذا التغيير أنّك عندما تنتقل إلى إصدار React 16 فعلى الأغلب أنك ستقلل من الانهيارات الموجودة في تطبيقك والتي لم تكن تلاحظها من قبل. يُتيح لك إضافة حدود الأخطاء إعطاء تجربة مستخدم أفضل عند حدوث خطأ ما.

على سبيل المثال يُغلِّف تطبيق Facebook Messenger محتوى الشريط الجانبي، ونافذة المعلومات، وسجل المحادثات، وحقل إدخال الرسائل ضمن حدود أخطاء منفصلة. فإن انهار مكوّن ما في إحدى هذه المناطق من واجهة المستخدم، فستبقى الأخرى غير متفاعلة.

نشجعك أيضًا على استخدام خدمة التبليغ عن أخطاء JavaScript (أو بناء خدمة خاصة بك) بحيث تعرف عن الاستثناءات غير المُتعامل معها والتي تحصل أثناء مرحلة الإنتاج وتتمكن من إصلاحها.


## تتبع مكدس المكون {#component-stack-traces}

تطبع React 16 جميع الأخطاء الحاصلة خلال التصيير إلى نافذة الكونسول في وضعية التطوير، حتى ولو كان التطبيق يتجاهلها. وبالإضافة إلى رسائل الأخطاء ومكدس JavaScript فهي تُزوّدنا بتتبعات لمكدس المكوّن. بإمكانك الآن أن ترى بالضبط أين حصل الفشل في شجرة المكوّنات:

<img src="../images/docs/error-boundaries-stack-trace.png" style="max-width:100%" alt="Error caught by Error Boundary component">

تستطيع أيضًا أن ترى أسماء الملفات وأرقام الأسطر في تتبع مكدس المكوّن، يعمل هذا افتراضيًّا في المشاريع المبنية باستخدام [Create React App](https://github.com/facebookincubator/create-react-app):

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" style="max-width:100%" alt="Error caught by Error Boundary component with line numbers">

وإن لم تكن تستخدم  Create React App, فبإمكانك إضافة [هذه الإضافة](https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source) يدويًّا إلى إعدادات Babel لديك.  لاحظ أنّ الغرض منها هو وضعية التطوير فقط و**يجب تعطيلها في وضعية الإنتاج**..

> ملاحظة
>
> تعتمد أسماء المكوّنات المعروضة في تتبع لامكدس على الخاصيّة [`Function.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name). إن كنت تريد دعم متصفحات وأجهزة أقدم والتي قد لا تزوّدنا بها بشكل ذاتي (مثل IE 11), فضمّن الخاصيّة `Function.name` ضمن تطبيقك باستخدام, [`function.name-polyfill`](https://github.com/JamesMGreene/Function.name). وبشكل بديل تستطيع تعيين الخاصيّة  [`displayName`](/docs/react-component.html#displayname) في جميع مكوناتك.


## ماذا عن Try/Catch؟ {#how-about-trycatch}

`try` / `catch` هي طريقة رائعة ولكنّها تعمل مع الشيفرة من النمط الإلزامي فقط:

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

بينما مكوّنات React تصريحيّة وتُحدِّد *ما* ينبغي تصييره:

```js
<Button />
```

تحافظ حدود الأخطاء على الطبيعة التصريحية في React وتعمل كما تتوقع. على سبيل المثال إن حدث خطأ في التابع `componentDidUpdate`  ناتج عن التابع `setState` في مكان عميق من شجرة المكوّنات، فسيبقى هذا الخطأ ينتشر إلى أقرب حد للأخطاء.

## ماذا عن معالجات الأحداث Event Handlers؟ {#how-about-event-handlers}

**لا** تلتقط حدود الأخطاء الأخطاء الحاصلة بداخل مُعالِج الأحداث.

لا يحتاج React إلى حد للأخطاء للتعافي من الأخطاء في معالجات الأحداث. فعلى عكس تابع التصيير وتوابع دورة حياة المكوّن، لا تحدث مُعالجات الأحداث خلال التصيير. لذا إن رمت خطأ، فستبقى React تعرف ما الذي ينبغي عرضه على الشاشة.

إن احتجت لالتقاط الأخطاء بداخل مُعالِج للأحداث، فاستخدم الجملة الاعتيادية في JavaScript وهي `try` / `catch`:

```js{9-13,17-20}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
       // فعل أي شيء قد يرمي خطأ
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>التقط خطأ.</h1>
    }
    return <div onClick={this.handleClick}>انقر هنا</div>
  }
}
```

لاحظ أنّ المثال السابق يوضّح سلوك JavaScript الاعتيادي ولا يستخدم حدود الأخطاء.

## تغيير الأسماء في إصدار React 15 {#naming-changes-from-react-15}

تتضمّن React 15 دعمًا محدودًا جدًّا لحدود الأخطاء وذلك تحت اسم تابع مختلف هو: `unstable_handleError`. لا تعمل هذه الطريقة حاليًّا وستحتاج لتغييره إلى `componentDidCatch` في شيفرتك بدءًا من أول إصدار 16 تجريبي.

أضفنا [وضعًا جاهزًا](https://github.com/reactjs/react-codemod#error-boundaries) لنقل شيفرتك تلقائيًّا من أجل هذا التغيير.
