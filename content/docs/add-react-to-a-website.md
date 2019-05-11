---
id: add-react-to-a-website
title: إضافة React للموقع
permalink: docs/add-react-to-a-website.html
redirect_from:
  - "docs/add-react-to-an-existing-app.html"
prev: getting-started.html
next: create-a-new-react-app.html
---

استخدم القليل من React أو بقدر ما تحتاج إليه.

React صممت ابتداء بأخذ الاعتماد التدريجي في الحسبان، **لذا تستطيع الاعتماد على React الشيء البسيط أو بقدر ما تحتاج إليه**.ربما أنت بحاجة إلى اضافة القليل من التفاعل أو بقدر الحاجة إلى صفحة موجودة. مكونات React هي أفضل وسيلة للقيام بذلك.

أغلبية مواقع الويب ليست تطبيقات ذات صفحة وحيدة، ولا تحتاج إلى أن تكون كذلك. **ببضعة أسطر برمجية ودون أدوات بناء**, حاول تجريب React في أجزاء صغيرة من موقعك؛ يمكنك بعدئذٍ إمَّا أن توسِّع استعمال React تدريجيًّا، أو تقتصر باستعمالها على بضعة أدوات ذكية ديناميكية (dynamic widgets).

---

- [اضف React بدقيقة واحدة!](#add-react-in-one-minute)
- [إختياري: جرب React مع JSX](#optional-try-react-with-jsx) (لا حاجة لاي bundler!)

## اضف React بدقيقة واحدة! {#add-react-in-one-minute}

في هذا القسم، سنعلمك كيفية إضافة مكون واحد من مكونات React إلى صفحة HTML موجودة مسبقًا. يمكنك إمَّا استعمال إحدى صفحات موقعك وإمَّا إنشاء صفحة HTML جديدة للتدرُّب عليها.

لن تحتاج إلى أية أدوات معقدة أو تثبيت أي شيء. **كل ما تحتاج إليه لإكمال هذا القسم هو اتصال بالإنترنت ودقيقة مستقطعة من وقتك**.

تستطيع تنزيل [المثال التالي كاملًا (بحجم 2 كيلوبايت) )](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip) ولكن الأمر عائد إليك.

### الخطوة 1: أضف حاوية DOM إلى صفحة HTM {#step-1-add-a-dom-container-to-the-html}


أولًا، افتح صفحة HTML التي تريد تعديلها ثم أضف وسم `<div>` فارغ لتحديد الجزء حيث تريد إظهار شيء فيه باستعمال React:

```html{3}
<!-- ... HTML محتويات صفحة ... -->

<div id="like_button_container"></div>

<!-- ... HTML محتويات صفحة ... -->
```

أعطينا الوسم `<div>` معرِّفًا فريدًا عبر الخاصية `id` . سيسمح لنا هذا بالعثور عليه بسهولة عبر شيفرة جافاسكريبت لاحقًا وإضافة مكون React داخله.

>نصيحة
>
>تستطيع وضع "الحاوية" `<div>` **في أي مكان** ضمن الوسم `<body>`. إذ يمكنك استعمال عدد غير محدود من حاويات DOM المستقلة في صفحة واحدة. ستكون هذه الحاويات فارغةً عادةً، لأنَّ React ستستبدل أي محتوى موجود داخل حاويات DOM.

### الخطوة 2: إضافة وسوم Script {#step-2-add-the-script-tags}

ثانيًا, أضف ثلاثة وسوم `<script>` إلى صفحة HTML قبل وسم الإغلاق `</body>` بالشكل التالي:

```html{5,6,9}
  <!-- ... HTML محتوى ... -->

  <!-- React تحميل -->
  <!-- "development.js" مكان "production.min.js" ملاحظة: عند النشر، بدل -->
  <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>

  <!-- الخاص بنا React تحميل مكون. -->
  <script src="like_button.js"></script>

</body>
```

يحمِّل أول وسمين React، ويحمِّل الوسم الثالث شيفرة المكون الذي ستنشئه.

### الخطوة 3: أنشئ مكون React {#step-3-create-a-react-component}

أنشئ ملفًا باسم `like_button.js` بجانب صفحة HTML التي عدلناها للتو.

إفتح **[هذه الشيفرة المساعدة](https://cdn.rawgit.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** ثم انسخها والصقها في الملف الذي أنشأته قبل قليل.

>فائدة
>
>عرِّف هذه الشيفرة مكون React يدعى `LikeButton`. لا تقلق إن لم تفهم شيئًا منها، إذ سنغطي كل شيء مذكور فيها لاحقًا في [الدليل التطبيقي](/tutorial/tutorial.html) و[دليل المفاهيم الاساسية](/docs/hello-world.html). في الوقت الحالي، لندع هذه الشيفرة تُظهِر شيئًا على الشاشة.

بعد **[الشيفرة المساعدة](https://cdn.rawgit.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)**, أضف السطرين في نهاية الملف `like_button.js`:

```js{3,4}
// ... الشيفرة المساعدة التي لصقتها ...

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);
```

مهمة هذين السطرين هي العثور على العنصر `<div>` الذي أضفناه إلى صفحة HTML في الخطوة الأولى ثم إظهار الزر "Like" - الذي يمثِّل أحد مكونات React - داخله.

### انتهينا! {#thats-it}

لا توجد أية خطوات إضافية. **لقد أضفت للتو أول مكون من مكونات React إلى موقعك.**

انتقل إلى الأقسام التالية للمزيد حول دمج React.

**[اطلع على كامل شيفرة المثال](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)** أو **[نزل المثال كاملًا (ملف مضغوط بحجم 2 كيلوبايت)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)**

### إضافة: إعادة استعمال مكون {#tip-reuse-a-component}

عادةً، قد تحتاج إلى إظهار مكونات React في مواضع عدة في صفحة HTML. إليك مثال يُظهِر الزر "Like" في ثلاثة أماكن ويمرر بعض البيانات إليه:

[اطلع على الشيفرة الكاملة للمثال.](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda)

[نزل المثال كاملًا (ملف مضغوط بحجم 2 كيلوبايت)](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda/archive/9d0dd0ee941fea05fd1357502e5aa348abb84c12.zip)

>نصيحة
>
>هذا الأسلوب مفيد جدًا في أثناء كون الأجزاء التي تعمل باستعمال React هي أجزاء معزولة عن بعضها بعضًا. داخل شيفرة React، من الأسهل استعمال [تركيب المكونات](/docs/components-and-props.html#composing-components) عوض ذلك.

### إضافة: تصغير شيفرة الجافاسكريبت للنشر {#tip-minify-javascript-for-production}

قبل نشر موقعك على خادم إنتاجي، ضع في بالك أن عدم تصغير شيفرة JavaScript يمكن أن يبطِّئ الصفحة عندما يحملها المستخدم النهائي.

إن صغَّرت شيفرات التطبيق مسبقًا، **فسيكون موقعك جاهزًا للنشر** على البيئة الإنتاجية بعد التأكد من أن شيفرة HTML التي يراد نشرها تُحمِّل إصدار React الإنتاجي (أي الذي ينتهي بـ `production.min.js`:

```js
<script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script>
```

إن لم تعرف كيفية تنفيذ خطوة التصغير, [يمكنك اتباع هذه الطريقة](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).

## إختياري: جرب React مع JSX {#optional-try-react-with-jsx}

في المثال السابق، اعتمدنا على ميزات مدعومة من طرف المتصفحات فقط. هذا هو سبب استعمال استدعاء إحدى دوال جافسكريبت لاخبار React بالشيء الذي نريد عرضه:

```js
const e = React.createElement;

// "Like" ذي الاسم <button> عرض
return e(
  'button',
  { onClick: () => this.setState({ liked: true }) },
  'Like'
);
```

على أي حال، توفر React خيارًا بديلًا عبر استعمال [JSX](/docs/introducing-jsx.html):

```js
// "Like" ذي الاسم <button> عرض الزر
return (
  <button onClick={() => this.setState({ liked: true })}>
    Like
  </button>
);
```

هذه الشيفرة مكافئة للشيفرة التي قبلها تمامًا. لمَّا كان **JSX [اختياري بشكل كامل](/docs/react-without-jsx.html)**, يرى الكثير من الأشخاص أنَّه مفيد لكتابة شيفرة واجهة المستخدم (UI code) في React وفي مكتبات أخرى.

يمكنك تجريب JSX باستعمال [محول بابل المباشر](https://babeljs.io/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=Q&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2%2Cstage-3&prettier=true&targets=Node-6.12&version=6.26.0&envVersion=).

### جرب JSX بسرعة {#quickly-try-jsx}

أسرع طريقة لتجريب JSX في مشروعك هي إضافة الوسم `<script>` التالي لمشروعك:

```html
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

الآن، يمكنك استعمال JSX في أي وسم `<script>` عبر إضافة الخاصية `type="text/babel"` إليه. [ستجد هنا ملف HTML مع JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html) يمكنك تنزيله والتجريب به.

هذا الأسلوب لا بأس به للتعلم وإنشاء نماذج تجريبية، **ولكنه غير مناسب للإنتاج**  إذ سيجعل موقعك بطيئًا. عندما تكون مستعدًا للبدء بجدية، احذف الوسم `<script>` السابق والخاصية `type="text/babel"`, لأنَّك ستتعلم في القسم التالي كيفية ضبط معالج JSX الأولي (JSX preprocessor) لتحويل جميع الوسوم `<script>` تلقائيًّا.

### إضافة JSX إلى المشروع {#add-jsx-to-a-project}

 يتطلب إضافة JSX إلى مشروعٍ ما أية أدوات معقدة مثل مُحزِّم أو خادم تطويري. بشكل أساسي، **إضافة JSX يشبه إلى حد ما إضافة معالج CSS أولي.** لشيء المطلوب هو تثبيت [Node.js](https://nodejs.org/) على حاسوبك.

اذهب إلى مجلد مشروعك من الطرفية والصق الأمرين التاليين:

1. **الخطوة 1:** نفِّذ الأمر `npm init -y` (عند الفشل، اطلع على [هذا الحل](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. **الخطوة 2:** نفذ الأمر `npm install babel-cli@6 babel-preset-react-app@3`

>نصيحة
>
>نحن **نستعمل npm هنا لتثبيت معالج JSX الأولي؛** لن تحتاج إليه للقيام بأي شيء آخر. يمكن بقاء React وشيفرة التطبيق على شكل وسوم `<script>` دون أي تغيير.

تهانينا لك! لقد أضفت للتو **تهيئة JSX اللازمة لتجهيز البيئة الانتاجية.**


### تشغيل معالج JSX الأولي {#run-jsx-preprocessor}

أنشئ مجلدًا باسم `src` ثم نفذ الأمر التالي في الطرفية:

```
npx babel --watch src --out-dir . --presets react-app/prod 
```

>ملاحظة
>
>الأمر `npx`  ليس فيه أي خطأ كتابي، إذ هو أداة تشغيل للحزم تأتي مع [الإصدار 5.2 وما بعده من npm](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).
>
>إن حصلت على رسالة خطأ تقول: "You have mistakenly installed the babel package" (أي أنك ثبَّت الحزمة babel بشكل خطأ)، ربما لم تُنفِّذ الخطوة السابقة [إضافة JSX إلى المشروع](#add-jsx-to-a-project). نفذ الأمرين في تلك الخطوة في نفس مجلد المشروع ثم أعد تنفيذ الأمر السابق.

لا تنتظر انتهاء هذا الأمر لأنَّه لن ينتهي. يبدأ هذا الأمر تشغيل مراقب آلي من أجل JSX.

إن أنشأت الآن مجلدًا باسم `src/like_button.js` مع **[هذه الشيفرة المساعدة](https://cdn.rawgit.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/09b951c86c1bf1116af741fa4664511f2f179f0a/like_button.js)**, فسينشئ المراقب الملف `like_button.js` بعد معالجته مع شيفرة جافاسكريبت صرفة تناسب المتصفح. في كل مرة تعدل فيها الملف المصدري مع JSX، ستُجرَى عملية التحويل تلقائيًّا.

إضافة لذلك، هذا يمكِّنك أيضًا من استعمال ميزات صياغة JavaScript الحديثة مثل الأصناف دون القلق حيال دعم المتصفحات القديمة. الأداة التي استعملناها للتو تدعى "بابل" (Babel)، ويمكنك تعلم المزيد عنها من[توثيقها الرسمي](https://babeljs.io/docs/en/babel-cli/).

ن شعرت بالراحة مع أدوات البناء وأردت الاستزادة منها لأداء مزيد من الأمور، يشرح [القسم التالي](/docs/create-a-new-react-app.html) أشهر أدوات البناء (toolchains) وأكثرها فاعلية. إن لم تشعر كذلك، الخطوات السابقة مع الوسوم `<script>` كافية إلى حد ما.
