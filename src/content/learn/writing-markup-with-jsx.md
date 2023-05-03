---
title: كتابة البناء بـ JSX
---

<Intro>

*JSX* هو امتداد لبناء الجملة في لغة JavaScript والذي يتيح لك كتابة ترميز شبيه بلغة HTML داخل ملف JavaScript. وعلى الرغم من وجود طرق أخرى لكتابة المكونات، فإن معظم مطوري React يفضلون استخدام JSX بسبب قصره وبساطته، وغالبية الأكواد المستخدمة تستخدم JSX.

</Intro>

<YouWillLearn>

* لماذا يمزج React بين علامات البناء ومنطق التصيير
* كيف يختلف JSX عن HTML
* كيفية عرض المعلومات باستخدام JSX

</YouWillLearn>

## JSX: وضع علامات البناء داخل الجافاسكربت {/*jsx-putting-markup-into-javascript*/}

تم بناء الويب على HTML و CSS و JavaScript. لعدة سنوات، وضع مطورو الويب المحتوى داخل HTML، والتصميم داخل CSS، والمنطق داخل JavaScript - في أغلب الأحيان في ملفات منفصلة! تم وضع بناء الصفحة داخل HTML في حين أن منطق الصفحة عاش منفصلاً في JavaScript:

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="ترميز HTML بخلفية بنفسجية و div يحتوي على علامتي p و form كطفلين له.">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="ثلاثة معالجي JavaScript بخلفية صفراء: onSubmit، onLogin، و onClick.">

JavaScript

</Diagram>

</DiagramGroup>

ولكن مع تفاعلية الويب، أصبح المنطق مسيطرًا على المحتوى. وبالتالي، أصبح من الأفضل أن يعيش JavaScript داخل HTML. ولهذا السبب، **في React، تجمع المنطق والبناء معًا في نفس المكان - المكونات.**

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt='الصورة تصف المكون في React الذي يحتوي على ترميز HTML و JavaScript مختلط من الأمثلة السابقة. اسم الدالة هو "Sidebar" التي تستدعي الدالة "isLoggedIn" المميزة باللون الأصفر. ومدرجة داخل الدالة المميزة باللون الأرجواني، علامة p من السابق، وعلامة form تشير إلى المكون المعروض في الرسم التوضيحي التالي.'>

`Sidebar.js` مكون React

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="مكون React يحتوي على ترميز HTML و JavaScript مختلط من الأمثلة السابقة. اسم الدالة هو Form وتحتوي على معالجين onClick و onSubmit المميزين باللون الأصفر. بعد المعالجين يأتي HTML المميز باللون الأرجواني. يحتوي ال HTML على عنصر form مضمن مع عنصر input، يحتوي كل منهما على خاصية onClick.">

`Form.js` مكون React

</Diagram>

</DiagramGroup>

الحفاظ على منطق وترميز الزر معًا يضمن بقاءهما متزامنين مع بعضهما البعض في كل تحرير. وعلى العكس، فإن التفاصيل التي لا علاقة لها، مثل ترميز الزر وترميز الشريط الجانبي، معزولة عن بعضها البعض، مما يجعل من الأمان تغيير أي منهما بشكل منفصل.

يُعد كل مكون في React دالة JavaScript قد يحتوي على بعض ترميز البناء والتي يقوم React بتقديمه في المتصفح. تستخدم مكونات React امتدادًا يسمى JSX لتقديم ذلك البناء. يبدو JSX مشابهًا إلى حد كبير لترميز HTML، ولكنه يتميز بصرامة أكبر ويمكنه عرض المعلومات الديناميكية. أفضل طريقة لفهم ذلك هي تحويل بعض ترميز HTML إلى ترميز JSX.

<Note>

JSX و React هما شيئان منفصلان عن بعضهما البعض. غالبًا ما يتم استخدامهما معًا، ولكن **يمكنك** [استخدام أحدهما بشكل مستقل](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform). JSX هو امتداد لكود البناء، بينما React مكتبة لـ JavaScript.

</Note>

## تحويل HTML إلى JSX {/*converting-html-to-jsx*/}

لنفترض أن لديك بعض أكواد HTML (الصالحة تمامًا).

```html
<h1>مَهمَّات هايدي ليمار</h1>
<img
  src="https://i.imgur.com/yXOvdOSs.jpg"
  alt="هايدي"
  class="photo"
>
<ul>
  <li>اختراع إشارات المرور
  <li>إعادة تمثيل مشهد من فيلم
  <li>تحسين بعض التكنولوجيا
</ul>
```

وتريد وضعها في مكونك

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

إن  نسختها ولصقتها لن تعمل

<Sandpack>

```js
export default function TodoList() {
  return (
    // هذا لا بعمل
    <h1>مَهمَّات هايدي ليمار</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="هايدي"
      class="photo"
    >
    <ul>
      <li>اختراع إشارات المرور
      <li>إعادة تمثيل مشهد من فيلم
      <li>تحسين بعض التكنولوجيا
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

هذا لأن JSX أكثر صرامة ولديه بعض القواعد الإضافية مقارنة بـ HTML! إذا قرأت رسائل الخطأ أعلاه، فسترشدك إلى إصلاح العلامات، أو يمكنك اتباع الدليل أدناه.

<Note>

في أغلب الأحيان، ستساعدك رسائل الخطأ التي تظهر على الشاشة في React على إيجاد مكان المشكلة. قم بقراءتها إذا واجهتك مشكلة!

</Note>

## قواعد JSX {/*the-rules-of-jsx*/}

### 1. إرجاع عنصر جذر واحد {/*1-return-a-single-root-element*/}

لإرجاع عناصر متعددة من مكون، **قم بتجميعها في عنصر واحد فقط.**

على سبيل المثال، يمكنك استخدام `<div>`:

```js {1,11}
<div>
  <h1>مَهام هايدي ليمار</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="هايدي" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```

إن كنت لا تريد إضافة `<div>` إضافي لبناءك، يمكنك كتابة `<>` و `</>` بدلاً من ذلك:

```js {1,11}
<>
  <h1>مَهام هايدي ليمار</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="هايدي" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

هذا العنصر الفارغ يسمى *[الأجزاء (Fragments)](/reference/react/Fragment)*. تسمح لك الأجزاء بتجميع الأشياء دون ترك أي أثر في شجرة HTML في المتصفح.

<DeepDive>

#### لماذا يجب عليك تجميع عناصر JSX في عنصر واحد؟ {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

يبدو JSX مثل HTML، لكنه في الحقيقة يتم تحويله إلى كائنات JavaScript عادية. لا يمكنك إرجاع كائنين من دون تجميعهما في مصفوفة. هذا يفسر لماذا لا يمكنك إرجاع علامتي JSX من دون تجميعهما في علامة أخرى أو في أجزاء.

</DeepDive>

### 2. أغلق كل العلامات {/*2-close-all-the-tags*/}

يتطلب JSX إغلاق العلامات بشكل صريح: العلامات المغلقة ذاتيًا مثل `<img>` يجب أن تصبح `<img />`، والعلامات الملفوفة مثل `<li>oranges` يجب أن تكتب كـ `<li>oranges</li>`.

هذا هو شكل صورة هايدي ليمار وعناصر القائمة المغلقة:

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="هايدي"
    class="photo"
  />
  <ul>
    <li>اختراع إشارات المرور</li>
    <li>إعادة تمثيل مشهد من فيلم</li>
    <li>تحسين بعض التكنولوجيا</li>
  </ul>
</>
```

### 3. اكتب camelCase <s>لكل الأشياء</s> لمعظم الأشياء! {/*3-camelcase-salls-most-of-the-things*/}

يتحول JSX إلى JavaScript والسمات المكتوبة في JSX تصبح مفاتيح لكائنات JavaScript. في مكوناتك الخاصة، ستريد في كثير من الأحيان قراءة تلك السمات في متغيرات. لكن JavaScript لديه قيود على أسماء المتغيرات. على سبيل المثال، لا يمكن أن تحتوي أسماءهم على شرطات أو تكون كلمات محجوزة مثل `class`.

لهذا السبب، في React، تكتب العديد من السمات HTML و SVG بـ camelCase. على سبيل المثال، بدلاً من `stroke-width` تستخدم `strokeWidth`. نظرًا لأن `class` هي كلمة محجوزة، في React تكتب `className` بدلاً من ذلك، مسماة على [خاصية DOM البديلة](https://developer.mozilla.org/en-US/docs/Web/API/Element/className):

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="هايدي"
  className="photo"
/>
```

يمكنك [العثور على كل هذه السمات في قائمة خصائص مكونات DOM.](/reference/react-dom/components/common) إذا ارتكبت خطأً، لا تقلق — ستقوم React بطباعة رسالة مع تصحيح محتمل إلى [وحدة التحكم في المتصفح.](https://developer.mozilla.org/docs/Tools/Browser_Console)

<Pitfall>

لأسباب تاريخية، تكتب السمات [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) و [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) كما هي في HTML مع شرطات.

</Pitfall>

### نصيحة احترافية: استخدم محول JSX {/*pro-tip-use-a-jsx-converter*/}

يمكن أن يكون تحويل كل هذه السمات في العلامات الموجودة مملًا! نوصي باستخدام [محول](https://transform.tools/html-to-jsx) لترجمة HTML و SVG الموجودة إلى JSX. المحولات مفيدة جدًا في التدرب، لكن من الأفضل فهم ما يجري حتى تتمكن من كتابة JSX بسهولة بمفردك.

هنا هو نتيجتك النهائية:

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>مهمات هايدي</h1>
      <img 
        src="https://i.imgur.com/yXOvdOSs.jpg" 
        alt="هايدي"
        className="photo"
      />
      <ul>
        <li>اختراع إشارات المرور</li>
        <li>إعادة تمثيل مشهد من فيلم</li>
        <li>تحسين بعض التكنولوجيا</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>

الأن تعرف لماذا JSX موجود وكيفية استخدامه في المكونات:

* تجمع مكونات React المنطق مع البناء معًا لأنهما مرتبطان.
* JSX مشابه لـ HTML، مع بعض الاختلافات. يمكنك استخدام [محول](https://transform.tools/html-to-jsx) إذا كنت بحاجة إلى ذلك.
* رسائل الخطأ غالبًا ما تشير إلى الاتجاه الصحيح لإصلاح البناء.

</Recap>


<Challenges>

#### حوّل بعض HTML إلى JSX {/*convert-some-html-to-jsx*/}

تم لصق هذا الكود في مكون، لكنه ليس JSX صالح. قم بإصلاحه:

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>مرحبًا بكم في موقعي!</h1>
    </div>
    <p class="summary">
      يمكنك العثور على أفكاري هنا.
      <br><br>
      <b>و <i>صور</i></b> للعلماء!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

أيًّا ما تفعل، استخدام محّول أو بيدك، اختر المناسب لك.

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>مرحبًا بكم في موقعي!</h1>
      </div>
      <p className="summary">
        يمكنك العثور على أفكاري هنا.
        <br /><br />
        <b>و <i>صور</i></b> للعلماء!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>
