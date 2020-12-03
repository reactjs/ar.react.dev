---
id: rendering-elements
title: تصدير العناصر
permalink: docs/rendering-elements.html
redirect_from:
  - "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

العناصر (Elements) هي أصغر الوحدات البنائية في التطبيقات المبنية باستخدام رياكت (React).

يصف العنصر الواحد ما تريد رؤيته على الشاشة:

```js
const element = <h1>مرحباً بالعالم!</h1>;
```


على عكس عناصر الـ DOM للمتصفح, فإن عناصر رياكت (React) ما هي إلا كائنات بسيطة, ولا تتطلب الكثير لإنشاءها. حيث تتحمل الـ DOM لـ رياكت  (React) مسؤولية تحديث الـ DOM لمماثلتها مع عناصر الرياكت (React).


>**ملاحظة:**
>
>من الممكن الخلط بين العناصر وأحد المفاهيم المعروفة "المكونات". سنقوم بتقديم المكونات في [القسم التالي] (/docs/components-and-props.html). تصنع المكونات من العناصر, ونشجعك على الإطلاع على هذا القسم قبل القفز إلى  مواضيع أخرى.

## تصدير عنصر واحد إلى الـ DOM {#rendering-an-element-into-the-dom}

دعنا نفترض أن هنالك عنصر `div` في مكان ما في ملف الـ HTML خاصتك:
```html
<div id="root"></div>
```

نطلق على هذا العنصر اسم عقدة DOM "الجذر" وذلك لأن كل ما تحتويها سيتم التحكم به من قبل رياكت DOM.

تتألف التطبيقات المبنية باستخدام رياكت في العادة, من عقدة DOM جذر وحيدة. أما إن كنت تقوم بعمل التكامل لـرياكت إلى تطبيق موجود مسبقاً, من الممكن أن يتوفر لديك أي عدد ترغب به من عقد DOM الجذر.

لتصدير عنصر رياكت إلى عقدة DOM جذر وحيدة, مررهما معاَ إلى [`ReactDOM.render()`](/docs/react-dom.html#render):

`embed:rendering-elements/render-an-element.js`

[](codepen://rendering-elements/render-an-element)

يعرض هذا المثال عند تنفيذه "مرحباً بالعالم".

## تحديث العنصر المصدر من قبل {#updating-the-rendered-element}

عناصر رياكت غير قابلة للتغيير [immutable](https://en.wikipedia.org/wiki/Immutable_object). عند انشائك عنصراَ, فإنه حينها لا يكون بإمكانك تغيير عناصره الأبناء أو صفاته. العنصر يشبه إطار الفيلم الواحد في كونه يمثل واجهة المستخدم خلال فترة معينة من الزمان.


وبهذا القدر البسيط من المعرفة التي امتلكناها لحد الآن, فإن الطريقة الوحيدة لتحديث واجهة المستخدم تتم من خلال إنشاء عنصر جديد, ومن ثم تمريره إلى [`ReactDOM.render()`](/docs/react-dom.html#render).

خذ على سبيل المثال هذه الساعة الداقة: 

`embed:rendering-elements/update-rendered-element.js`

[](codepen://rendering-elements/update-rendered-element)

حيث تقوم بمناداة [`ReactDOM.render()`](/docs/react-dom.html#render) كل ثانية من خلال رد النداء [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval).

>**ملاحظة:**
>
>عملياً, معظم التطبيقات المبنية مع رياكت تقوم بنداء [`ReactDOM.render()`](/docs/react-dom.html#render) مرة واحدة فقط. في القسم التالي سنعرف أكثر عن كم الشيفرة التي يتم تغليفها إلى [مكوًن صنف](/docs/state-and-lifecycle.html).
>
>نقترح عليك بألا تتخطى أية من المواضيع, لأنها تبني على بعضها البعض.


## يحدث رياكت واجهة المستخدم فقط عندما تدعو الحاجة لذلك {#react-only-updates-whats-necessary}

يقارن ReactDOM العنصر وأبنائه مع سابقه, ويقوم يتطبيق تحديثات DOM الضرورية لتحويل الـ DOM إلى الحالة المرغوب بها.


تستطيع تأكيد ذلك من خلال تفحص [المثال الأخير](codepen://rendering-elements/update-rendered-element) باستخدام أدوات المتصفح:

![DOM inspector showing granular updates](../images/docs/granular-dom-updates.gif)

بالرغم من أننا ننشئ عنصراً يصف شجرة واجهة المستخدم بأكملها عند كل دقة ساعة, فإن ما يتم تحديثه بواسطة ReactDOM ما هو إلا عقدة النص التي تغيرت محتوياتها.

بحسب خبرتنا, التفكير بالكيفية التي ستبدو عليها واجهة المستخدم في أي لحظة من الزمان بدل التفكير بآلية تغييرها بمرور الوقت يقضي على العديد من الأخطاء البرمجية bugs.
