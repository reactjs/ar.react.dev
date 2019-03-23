---
id: add-react-to-a-website
title: إضافة React للمواقع
permalink: docs/add-react-to-a-website.html
redirect_from:
  - "docs/add-react-to-an-existing-app.html"
prev: getting-started.html
next: create-a-new-react-app.html
---

إستخدم أقل أو أكثر قدر من React كما تستطيع.

React تم تصميمها لإعتمادها تدريجياً و **بإمكانك استخدام أقل او أكثر قدر من React بحسب حاجتك**. ربما تريد فقط إضافة بعض "رشات التفاعل" إلى صفحة موجودة
. مكوّنات React طريقة عظمية لعمل ذلك.

غالبية مواقع الويب ليست تطبيقات صفحة واحدة ولا تحتاج إليها. مع **مع بعض السطور البرمجية وبدون أدوات الأنشاء**, جرب React في جزء صغير من موقع الويب الخاص بك. يمكنك بعد ذلك توسيع وجوده تدريجياً ، أو الاحتفاظ به في عدد قليل من الأدوات الديناميكية.

---

- [أضف React في دقيقة](#add-react-in-one-minute)
- [إختياري: جرب React مع JSX](#optional-try-react-with-jsx) (لا حاجة لاي bundler!)

## أضف React في دقيقة {#add-react-in-one-minute}

في هذا القسم ، سنعرض كيفية إضافة مكون React إلى صفحة HTML موجودة. يمكنك المتابعة مع موقع الويب الخاص بك ، أو إنشاء ملف HTML فارغ للتنفيذ.

 لن تكون هناك أدوات معقدة أو  تثبيت متطلبات -- **لإكمال هذا القسم ، تحتاج فقط إلى اتصال بالإنترنت ودقيقة من وقتك.**

إختياري: [تحميل المثال كاملً (2KB مضغوطة)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)

### الخطوة 1: إضافة حاويات DOM لصفحة HTML {#step-1-add-a-dom-container-to-the-html}

بدايتاً, إفتح صفحة HTML التي تريد ان تعدل عليها. أضف وسم `<div>` فارغ للاشارة الى موقع الذي ترغب بعرض شيء ما علية باستخدام React. مثال:

```html{3}
<!-- ... HTML موجود مسبقاً ... -->

<div id="like_button_container"></div>

<!-- ... HTML موجود مسبقاً ... -->
```

لقد أعطينا الوسم `<div>` خاصية HTML `id` فريدة. وهذا سيمكننا من الوصول له بإستخدام شفرة جافاسكريبت البرمجية لاحقاً وعرض مكوّن React بداخله.

>نصيحة
>
>يمكن وضع "الحاوية" `<div>` مثل هذة **في أي مكان** بداخل الوسم `<body>`. وقد يكون لديك الكثير من حاويات DOM في صفحة واحدة بحسب حاجتك. وهم في الغالب فارغين -- وReact ستقوم بتفريغ الي محتوى بداخل حاويات DOM.

### الخطوة 2: إضافة وسوم Script {#step-2-add-the-script-tags}

التالي, إضافة ثلاثة وسوم `<script>` لصفحة HTML قبل إغلاق الوسم `</body>`:

```html{5,6,9}
  <!-- ... other HTML ... -->

  <!-- .React حمّل -->
  <!--  ."production.min.js"  بالنص "development.js" ملاحظة: عند الرفع استبدل -->
  <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>

  <!--  React حمل مكوّن -->
  <script src="like_button.js"></script>

</body>
```

الوسم الاول والثاني يحمّلان React. والثالث سيحمّل شفرة المكوّن.

### الخطزة 3: إنشاء مكوّن React {#step-3-create-a-react-component}

أنساء ملف بتسمية `like_button.js` بجانب صفحة HTML خاصتك.

إفتح **[هذة الشفرة البرمجية المبداية](https://cdn.rawgit.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** والصقها بداخل الملف المنشأ.

>نصيحة
>
>هذة الشفرة البرمجية تعرف مكوّن React بتسمية `LikeButton`. لا تقلق إذا لم تفهمها للان -- سنغطي اللبنات الأساسية لReact لاحقناً في [التدريب العملي على البرنامج التعليمي](/tutorial/tutorial.html) و [دليل المفاهيم الاساسية](/docs/hello-world.html). في الوقت الحالي ، دعنا فقط نستعرضه على الشاشة!

بعد **[الشفرة البرمجية المبداية](https://cdn.rawgit.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)**, أضف السطرين في نهاية `like_button.js`:

```js{3,4}
// ...  الشفرة البرمجية المبداية الملصقة ...

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);
```

هذه السطرين من الشفرة البرمجية وجدت الوسم `<div>` الذي أضفناة في الخطوة 1 ومن ثم تعرض مكوّن React الزر "Link" بداخلة. 

### هذا هو! {#thats-it}

لاتوجد خطوة رابعة. **لقد أضفت المكوّن الاول من React في موقعك.**

تفحص القسم التالي للمزيد من النصائح حول دمج React.

**[شاهد الشفرة المصدرية للمثال كاملً](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)**

**[حمّل المثال كاملً (2KB مضغوطة)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)**

### نصيحة: أعد إستخدام المكوّن {#tip-reuse-a-component}

بشكل عام ، قد ترغب في عرض مكونات React في أماكن متعددة على صفحة HTML. فيما يلي مثال يعرض زر "Like" ثلاث مرات ويمرر بعض البيانات إليه:

[شاهد الشفرة المصدرية للمثال كاملً](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda)

[حمّل المثال كاملً (2KB مضغوطة)](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda/archive/9d0dd0ee941fea05fd1357502e5aa348abb84c12.zip)

>ملاحظة
>
>هذة الإستراتيجية مفيدة في الغالب بينما أجزاء React-powered للصفحة معزولة عن بعضها البعض. بداخل شفرة React البرمجية, الاسهل من ذلك إستخدام [تركيب المكونات](/docs/components-and-props.html#composing-components) بدلً عن ذلك.

### نصيحة: تصغير الجافاسكريبت للإنتاج {#tip-minify-javascript-for-production}

قبل نشر موقع الويب الخاص بك للإنتاج, حط بالحسبان ان الجافاسكريبت الغير مصغرة يمكن أن تبطئ بشكل ملحوظ الصفحة للمستخدمين.

إذا كنت بالفعل صغرت scripts التطبيق **سيكون موقعك جاهزًا للإنتاج** إذا تحققت من أن صفحت HTML المنشورة تحمّل إصدار React ينتهي بالنص `production.min.js`:

```js
<script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script>
```

إذا كنت لا تعلم خطوة تصغير scripts الخاصة بك, [إليك طريقة واحدة لإعداده](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).

## إختياري: جرب React مع JSX {#optional-try-react-with-jsx}

في المثال السابق إستخدمنا الخصائص المدعوة من أساساً من المتصفحات. لهذا السبب إستخدمنا دالة جافسكريبت لتخبر React ماذا يعرض:

```js
const e = React.createElement;

// عرض زر "Like" <button>
return e(
  'button',
  { onClick: () => this.setState({ liked: true }) },
  'Like'
);
```

ومع ذلك, React توفر خيار لاستخدام [JSX](/docs/introducing-jsx.html) بدلاً عن ذلك:

```js
// عرض زر "Like" <button>
return (
  <button onClick={() => this.setState({ liked: true })}>
    Like
  </button>
);
```

هذة القاقتين من الشفرات البرمجية متساوسات. ومع ان **JSX [إختياري كلياً](/docs/react-without-jsx.html)**الى أن الكثير من الاشخاص وجدوه مفيد لكتابة شفرات برمجية لبناء UI. مع كلً من React والمكتبات الاخرى.

يمكنك اللعب مع JSX باستخدام [هذا المحول عبر الإنترنت](https://babeljs.io/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=Q&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2%2Cstage-3&prettier=true&targets=Node-6.12&version=6.26.0&envVersion=).

### جرب JSX بسرعة {#quickly-try-jsx}

أسرع طريقة لتجرية JSX في مشروعك هي بإضافة الوسم `<script>` هذا في صفحتك:

```html
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

الان تستطيع إستخدام JSX في اي وسم `<script>` بإضافة الخاصية `type="text/babel"` له. وهنا [مثال ملف HTML مع JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html) يمكن تحميلة والتلاعب به.

هذه المنهجية جيدة للتعلم وانشاء عروض بسيطة. ومع ذلك
, فهي تجعل موقع الويب الخاص بك بطيئًا و **ليست مناسبة للإنتاج**. ومتى كنت مستعد للمضي قدماً إحذف هذا الوسم والخاصية `type="text/babel"` التي اضفتها. بدلاً من ذلك, في القسم التالي سنقوم بتنصيب معالج JSX لتحويل كل وسم `<script>` بشكل تلقائي.

### إضافة JSX لمشروع {#add-jsx-to-a-project}

إضافة JSX لمشروع لا تحتاج لادوات معقدة مثل bundler خادم تطوير. بشكل أساسي, إضافة JSX **يشبه إلى حد كبير إضافة معالج CSS.** المتطلب الوحيد تثبيت [Node.js](https://nodejs.org/) في حاسوبك.

إذهب لمجلد المشروع من treminal والصق هذين الامرين لها:

1. **الخطوة 1:** نفّذ `npm init -y` (إذا فشل, [هذا الحل](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. **الخطوة 2:** نفّذ `npm install babel-cli@6 babel-preset-react-app@3`

>نصيحة
>
>نحن **نستخدم npm هنا فقط للتثبيت معالج JSX فقط؛** ولست بحاجتها لشيء أخر. وكلّ من React شفراة التطبيق البرمجية لاتزال بداخل الوسم `<script>` بدون تغيير.

تهانينا! فقد أضفت **إنتاج-جاهز من تنصيب JSX** لمشروعك.


### شغل JSX معالج {#run-jsx-preprocessor}

أنشاءمجلد باسم `src` ونفذ الأوامر هذه على terminal:

```
npx babel --watch src --out-dir . --presets react-app/prod 
```

>ملاحظة
>
>`npx` ليست خطأ مطبعي -- هي عبارة عن [أداة تشغيل الحزم التي تاتي مع npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).
>
>إذا رأيت رسالة خطأ تقول "لقد قمت بتثبيت عن طريق الخطأ حزمة `babel`", فربما تكون قد فاتتك [الخطوة السابقة](#add-jsx-to-a-project). نفذها في نفس المجلد وحاول مجدداً.

لاتنتظر له حتى نتهِ -- هذا الأمر يبداء تشغيل مراقب تلقائي للشفرات JSX.

إذا انشات الان ملف بإسم `src/like_button.js` واضفت فيه **[شفرة JSX الابتدائية](https://cdn.rawgit.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/09b951c86c1bf1116af741fa4664511f2f179f0a/like_button.js)**, المراقب سينشأ ملف `like_button.js` مع رمز جافا سكريبت عادي مناسب للمتصفح. وعندما تقوم بتحرير الملف المصدر باستخدام JSX ، سيتم إعادة تشغيل التحويل تلقائيًا.

كمكافأة ، يتيح لك هذا أيضًا استخدام ميزات بناء جملة جافاسكريبت الحديثة مثل الفئات دون الحاجة إلى القلق بشأن كسر المتصفحات القديمة الاداة التي إستخدمناه تسمى Babel, وبإمكانك تعلم المزيد عنها من خلال [وثايقها](https://babeljs.io/docs/en/babel-cli/).

إذا لاحظت أنك تشعر بالارتياح تجاه أدوات البناء وتريد منها أن تفعل المزيد من أجلك
, [القسم التالي](/docs/create-a-new-react-app.html) يصف بعض من أكثر الأدوات الشعبية إنتشاراً. ما لم -- وسوم script هذه تفعل كل هذا على أفضل ما يرام!
