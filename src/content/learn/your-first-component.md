---
title: مكوّنك الأول
---

<Intro>

*المكونات* هي إحدى المفاهيم الرئيسية في React. هي الأساس الذي تبني عليه واجهات المستخدم. مما يجعلها المكان الصحيح لبدأ رحلتك مع React.

</Intro>

<YouWillLearn>

* ما هو المكوّن
* ما الدور الذي تلعبه المكوّنات في تطبيق React
* كيف تكتب أول مكوّن React

</YouWillLearn>

## المكونات: حجر بناء واجهة المستخدم {/*components-ui-building-blocks*/}

في الويب، تمكننا HTML من إنشاء صفحات مبنية بجدارة بالعديد من عناصرها المدمَجة مثل `<h1>` و `<li>`:

```html
<article>
  <h1>مكوّني الأول</h1>
  <ol>
    <li>المكوّنات: حجر بناء واجهة المستخدم</li>
    <li>تعريف المكوّن</li>
    <li>استخدام المكوّن</li>
  </ol>
</article>
```

يمثل هذا الترميز هذه المقالة `<article>`، عنوانها `<h1>`، وفهرس محتويات مختصر في شكل قائمة مرتبة `<ol>`. ترميز كهذا, مع بعض CSS للأنماط التصميمية, وJavaScript من أجل التفاعلية، يكمن وراء كل شريط جانبي، أو صورة رمزية، أو نافذة، أو قائمة منسدلة - أو أي قطعة من واجهة مستخدم تراها في الويب.

تمكنك React من دمج الترميز، وCSS، وJavaScript في "مكونات" مخصصة، **عناصر واجهة المستخدم قابلة لإعادة الاستخدام في تطبيقك**. يمكن تحويل كود فهرس المحتوى الذي رأيته أعلاه إلى مكوّن `<TableOfContents />` الذي يمكن تصييره في كل صفحة. لا يزال يستخدم هذا المكوّن خلف الكواليس وسوم مثل `<article>` ،`<h1>`، إلخ.

تمامًا مثل عناصر HTML، يمكنك تجميع وترتيب وتضمين المكوّنات لتصميم صفحات كاملة. على سبيل المثال، صفحة المستندات التي تقرأها مصنوعة من مكوّنات React.

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">المستندات</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

مع نمو مشروعك، ستلاحظ أنه يمكن تجميع العديد من تصاميمك بواسطة إعادة استخدام مكوّنات كتبتها مسبقا، مما يسرع عملية التطوير. يمكن إضافة فهرس المحتويات أعلاه إلى أي شاشة عن طريق `<TableOfContents />`! يمكنك أيضا الانطلاق بسرعة في مشروعك باستخدام آلاف المكوّنات التي ينشرها مجتمع React مفتوحة المصدر مثل [Chakra UI](https://chakra-ui.com/) و [Material UI.](https://material-ui.com/).

## تعريف المكوّن {/*defining-a-component*/}

قديمًا، عند إنشاء صفحات الويب، كان مطورو الويب يقومون بترميز المحتوى الخاص بهم ومن ثم يضيفون التفاعل عن طريق إضافة بعض JavaScript. نجح هذا بشكل رائع عندما كان التفاعل مجرد ميزة إضافية جيدة على الويب. الآن يُتوقع وجود التفاعل في العديد من المواقع وجميع التطبيقات. تضع React التفاعلية في المقام الأول مع الاستمرار في استخدام نفس التقنية: **مكوّن React هو دالة JavaScript يمكنك أن تُضيف إليها ترميز مرئي.** هنا مثال لذلك (يمكنك تحرير المثال أدناه):

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="كاثرين جونسون"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

وهنا كيفية بناء مكوّن:

### الخطوة الأولى: تصدير المكوّن {/*step-1-export-the-component*/}

البادئة `export default` هي جزء من [صيغة JavaScript القياسية](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) (ليست خاصة بـ React). تتيح لك وضع علامة على الدالة الرئيسية في ملف بحيث يمكنك استيرادها لاحقًا من ملفات أخرى. (للمزيد عن الاستيراد، راجع موضوع [استيراد وتصدير المكوّنات](/learn/importing-and-exporting-components)!)

### الخطوة الثانية: تعريف الدالة {/*step-2-define-the-function*/}

باستخدام الدالة `Profile() { }` ، تقوم بتعريف دالة JavaScript بإسم "Profile".

<Pitfall>

مكوّنات React هي عبارة عن دوال JavaScript عادية، ولكن يجب أن تبدأ أسماءها بحرف كبير، وإلا فلن تعمل بشكل صحيح!

</Pitfall>

### الخطوة الثالثة: أضف الترميز المرئي {/*step-3-add-markup*/}

يقوم المكوّن بإرجاع عنصر `<img />` مع خواص `src` و `alt`. يتم كتابة `<img />` بنفس طريقة كتابة HTML، ولكنه في الواقع JavaScript خلف الكواليس! يُطلق على هذه الصيغة [JSX](/learn/writing-markup-with-jsx)، وتتيح لك تضمين ترميز مرئي داخل JavaScript.

يمكن كتابة عبارات الإرجاع في سطر واحد، كما في هذا المكوّن:

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="كاثرين جونسون" />;
```

ولكن إذا لم يكن الترميز موجودًا في نفس السطر مع عبارة `return`، فيجب عليك وضعه بين قوسين:

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="كاثرين جونسون" />
  </div>
);
```

<Pitfall>

بدون الأقواس, [سيتم تجاهل](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi) أي كود في الأسطر التي تلي عبارة `return`!

</Pitfall>

## استخدام المكوّن {/*using-a-component*/}

الآن بعد تعريفك لمكون `Profile`، يمكنك تضمينه داخل مكوّنات أخرى. على سبيل المثال، يمكنك تصدير مكون `Gallery` الذي يستخدم عدة مكونات `Profile`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="كاثرين جونسون"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>علماء رائعون</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

### ما يراه المتصفح {/*what-the-browser-sees*/}

لاحظ الفرق في حالة الأحرف:

* `<section>` بحرف صغير `s`، لذا تعرف React أننا نشير إلى عنصر HTML.
* `<Profile />` يبدأ بحرف `P` كبير, لذا تعرف React أننا نريد استخدام مكوّننا الذي اسمه `Profile`.

ومكوّن `Profile` يحتوي على المزيد من HTML:`<img />`. في النهاية، هذا ما يراه المتصفح:

```html
<section>
  <h1>علماء رائعون</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="كاثرين جونسون" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="كاثرين جونسون" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="كاثرين جونسون" />
</section>
```

### تضمين وتنظيم المكوّنات {/*nesting-and-organizing-components*/}

المكوّنات هي دوال JavaScript عادية، لذا يمكنك الاحتفاظ بعدة مكوّنات في نفس الملف. هذا مناسب عندما تكون المكوّنات صغيرة نسبيًا أو تتعلق بشكل وثيق ببعضها البعض. إذا أصبح الملف مكتظًا، يمكنك دائمًا نقل المكوّن `Profile` إلى ملف منفصل. ستتعلم كيفية فعل ذلك قريبًا في [الصفحة التي تتحدث عن الاستيرادات.](/learn/importing-and-exporting-components).

نظرًا لأن مكوّنات `Profile` يتم تصييرها داخل مكوّن `Gallery` - وحتى لعدة مرات! - يمكننا القول بأن مكون `Gallery` هو **المكوّن الأب**، الذي يقوم بتصيير كل مكوّن `Profile` كـ "ابن" . هذا جزء من سحر React: يمكنك تعريف مكوّن مرة واحدة، ثم استخدامه في العديد من الأماكن والعديد من المرات كما تريد.

<Pitfall>

يمكن للمكوّنات عرض مكوّنات أخرى، ولكن **يجب ألا تقوم أبدا بتضمين تعريفها داخل بعضها البعض**.

```js {2-5}
export default function Gallery() {
  // 🔴 لا تقم أبدا بتعريف مكوّن داخل مكوّن اخر
  function Profile() {
    // ...
  }
  // ...
}
```

الكود السابق [بطيء جدًا ويسبب أخطاء.](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state) بدلاً من ذلك، قم بتعريف كل مكوّن على المستوى الأعلى

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ قم بتعريف المكوّنات على المستوى الأعلى
function Profile() {
  // ...
}
```

عندما يحتاج المكوّن الابن إلى الحصول على بعض البيانات من المكوّن الأب، يتم [تمريرها كخواص](/learn/passing-props-to-a-component) بدلاً من تضمين تعريفاتها.

</Pitfall>

<DeepDive>

#### مكوّنات على طول الطريق {/*components-all-the-way-down*/}

يبدأ تطبيق React الخاص بك في مكوّن "الجذر". عادةً ما يتم إنشاؤه تلقائيًا عند بدء مشروع جديد. على سبيل المثال، إذا كنت تستخدم [CodeSandbox](https://codesandbox.io/)، يتم تعريف مكون الجذر في `src/App.js`. إذا كنت تستخدم إطار العمل [Next.js](https://nextjs.org/)، يتم تعريف مكون الجذر في `pages/index.js`. في هذه الأمثلة، كنت تقوم بتصدير مكونات الجذر.

معظم تطبيقات React تستخدم مكوّنات على طول الطريق. وهذا يعني أنك لن تستخدم المكونات فقط للأجزاء القابلة لإعادة الاستخدام مثل الأزرار، ولكن أيضًا للأجزاء الأكبر مثل الأشرطة الجانبية، والقوائم، وفي النهاية، الصفحات الكاملة! المكوّنات هي وسيلة مفيدة لتنظيم كود واجهة المستخدم والترميز المرئي، حتى لو كان بعضها لا يستخدم سوى مرة واحدة.

<<<<<<< HEAD
[أطر العمل المبنية على React](/learn/creating-a-react-app) تأخذ خطوة إضافية. بحيث بدلاً من استخدام ملف HTML فارغ والسماح لـ React بـ "الاستيلاء" على إدارة الصفحة بواسطة JavaScript، فإنها *أيضًا* تقوم بتوليد كود الـ HTML تلقائيًا من مكوّنات React الخاصة بك. هذا يسمح لتطبيقك بعرض بعض المحتوى قبل تحميل كود JavaScript.
=======
[React-based frameworks](/learn/creating-a-react-app) take this a step further. Instead of using an empty HTML file and letting React "take over" managing the page with JavaScript, they *also* generate the HTML automatically from your React components. This allows your app to show some content before the JavaScript code loads.
>>>>>>> 427f24d694674be458f0fe7cb97ab1c8fe736586

ومع ذلك، لا تزال هناك العديد من المواقع التي تستخدم React فقط [لإضافة التفاعلية إلى صفحات HTML الموجودة مسبقا.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) فلديها العديد من المكوّنات الجذرية بدلاً من وجود مكوّن جذر واحد للصفحة بأكملها. يمكنك استخدام React بالمقدار الذي تحتاج إليه.

</DeepDive>

<Recap>

لقد حصلت للتو على لمحة أولى عن React! دعنا نلخص بعض النقاط الرئيسية.

* تمكنك React من إنشاء مكوّنات، **عناصر واجهة المستخدم قابلة لإعادة الاستخدام لتطبيقك**
* في تطبيق React، كل قطعة من واجهة المستخدم تمثل مكوّن
* مكوّنات React هي عبارة عن دوال JavaScript عادية ما عدا أن:

  1. اسمها يبدأ دائما بحرف كبير.
  2. تقوم بإرجاع ترميز مرئي JSX

</Recap>

<Challenges>

#### قم بتصدير المكوّن {/*export-the-component*/}

هذا الكود لا يعمل لأن المكوّن الجذري لم يتم تصديره

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="أكليلو ليما"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

حاول إصلاحه بنفسك قبل أن تلقي نظرة على الحل!

<Solution>

قم بإضافة `export default` قبل تعريف الدالة بهذا الشكل:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="أكليلو ليما"

    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

قد تتساءل لماذا كتابة `export` بمفردها ليس كافيًا لإصلاح هذا المثال. يمكنك معرفة الفرق بين `export` و `export default` في قسم [استيراد وتصدير المكوّنات.](/learn/importing-and-exporting-components)

</Solution>

#### قم بإصلاح جملة `return` {/*fix-the-return-statement*/}

هناك شي غير صحيح في جملة `return` هذه. هل يمكنك إصلاحه؟

<Hint>

قد تحصل على خطأ "Unexpected token" أثناء محاولتك لإصلاح هذا. في هذه الحالة، تحقق من أن الفاصلة المنقوطة تظهر *بعد* قوس الإغلاق. ترك فاصلة منقوطة داخل `return ( )` سيسبب خطأ.

</Hint>

<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="كاتسوكو ساروهاشي" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

يمكنك إصلاح هذا المكوّن عن طريق نقل جملة return إلى سطر واحد كما يلي:

<Sandpack>

```js
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="كاتسوكو ساروهاشي" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

أو عن طريق إحاطة الترميز المرئي JSX الذي يتم إرجاعه بالأقواس ووضع علامة القوس المفتوحة مباشرة بعد الكلمة `return`.

<Sandpack>

```js
export default function Profile() {
  return (
    <img 
      src="https://i.imgur.com/jA8hHMpm.jpg" 
      alt="كاتسوكو ساروهاشي"
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

#### اكتشف الخطأ {/*spot-the-mistake*/}

هناك خطأ في كيفية تعريف واستخدام المكوّن `Profile`. هل يمكنك اكتشاف الخطأ؟ (حاول تذكر كيف تمّيز React المكوّنات عن وسوم HTML!)

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="ألان ل. هارت"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>علماء رائعون</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

يجب أن تبدأ أسماء مكوّنات React بحرف كبير.

قم بتغيير `function profile()` إلى`function Profile()`, ثم قم بتغيير كل `<profile />` إلى `<Profile />`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="ألان ل. هارت"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>علماء رائعون</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

#### مكوّنك الخاص {/*your-own-component*/}

قم بكتابة مكوّن من الصفر. يمكنك إعطائه أي اسم صالح وإرجاع أي ترميز مرئي. إذا كنت بحاجة إلى أفكار، يمكنك كتابة مكوّن `Congratulations` الذي يعرض `<h1>عمل رائع!</h1>`. لا تنسى تصديره!

<Sandpack>

```js
// قم بكتابة مكونك بالأسفل

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>عمل رائع!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
