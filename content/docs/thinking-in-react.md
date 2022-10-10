---
id: thinking-in-react
title: التفكير على طريقة React
permalink: docs/thinking-in-react.html
redirect_from:
  - 'blog/2013/11/05/thinking-in-react.html'
  - 'docs/thinking-in-react-zh-CN.html'
prev: composition-vs-inheritance.html
---

برأينا React هو الطريقة اﻷساسية لبناء تطبيقات ويب كبيرة وسريعة باستخدام JavaScript، لقد ساعدنا في التوسع في التطبيقات بشكل جيد بفيسبوك (Facebook) وانستجرام (Instagram).

واحدة من المزايا العظيمة لـReact هي كيف أنه يجعلك تفكر في التطبيقات أثناء بناءها. في هذه الصفحة سنقوم معاَ بعملية التفكير لبناء جدول بيانات منتج قابل للبحث به باستخدام React.

## ابدأ بنموذج التطبيق {#start-with-a-mock}

تصور أننا نملك واجهة برمجة تطبيقات (API JSON) جاهزة ونموذج من المصمم. هذا النموذج يشبه الآتي:

![Mockup](../images/blog/thinking-in-react-mock.png)

واجهة برمجة التطبيقات ترسل بعض البيانات كالآتي:

```
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

### الخطوة الأولى: قم بتقسيم واجهة المستخدم (UI) لتسلسل هرمي لمكونات الواجهة (Component) {#step-1-break-the-ui-into-a-component-hierarchy}

أول شيء يجب عليك فعله هو رسم مستطيلات حول كل مكون (component) ومكون فرعي (subcomponent) في النموذج وإعطاء كل منهم اسما. إذا كنت تعمل مع مصمم تحدث معه فعلى الأرجح هو فعل ذلك! فأسماء طبقات الفوتوشوب (Photoshop layers) من الممكن أن تصلح أسماءً لمكوناتك (React component)!

ولكن كيف تعرف ما يجب أن تحدده بصفته مكونا؟ فقط استخدم نفس الأساليب أثناء أخذ قرار بإنشاء دالة (Function) أو كائن (Object) جديد، أسلوب "مبدأ المسئولية الأحادية" هو مثال على ذلك [مبدأ المهمة الواحدة](https://ar.wikipedia.org/wiki/%D9%85%D8%A8%D8%AF%D8%A3_%D8%A7%D9%84%D9%85%D9%87%D9%85%D8%A9_%D8%A7%D9%84%D9%88%D8%A7%D8%AD%D8%AF%D8%A9) وهي أن المكون (component) بشكل مثالي يجب أن يكون مسئولا عن فعل شيء واحد فقط، وإذا بدأ في التنامي يجب تقسيمه إلى مكونات فرعية (subcomponent) أصغر.

حيث أننا غالباَ ما نعرض نموذج البيانات (JSON data model) للمستخدم، ستجد أنه إذا كان هذا النموذج مبنيا بشكل جيد فإنه سيتطابق مع واجهة المستخدم (UI) خاصتك بشكل رائع، وبالتالي مع بناء مكوناتك (component structure)، وهذا لأن واجهة المستخدم (UI) ونموذج البيانات (data models) يميلان إلى التَّقييد بنفس *(الشكل البنائي للمعلومات information architecture)*، وهو مايعني أن العمل على تقسيم واجهة المستخدم (UI) إلى مكونات (components) غالباَ مايكون سهلا، فقط قم بتقسيمها إلى مكونات (component) تمثل تحديداَ جزءا واحدا من نموذج البيانات (data model) خاصتك.

![Diagram showing nesting of components](../images/blog/thinking-in-react-components.png)

سترى هنا أن لدينا خمس مكونات (components) في تطبيقنا الصغير، ولقد قمنا بالكتابة بخط عريض في كل مكون وما يمثله من بيانات.

  1. **`FilterableProductTable` (باللون البرتقالي):** يحتوي المثال بكامله
  2. **`SearchBar` (باللون الأزرق):** يستقبل ما يدخله المستخدم *(user input)*
  3. **`ProductTable` (باللون الأخضر):** يعرض وينقح (filter) مجموعة البيانات *(data collection)* طبقاَ لما أدخله المستخدم *(user input)*
  4. **`ProductCategoryRow` (باللون الفيروزي):** يعرض عنوانا (heading) لكل *فئة (category)*
  5. **`ProductRow` (باللون الأحمر):** يعرض صفا لكل *منتج (product)*

إذا نظرت إلى المكون `ProductTable` سترى أن عنوان الجدول (المحتوي على الاسم والسعر) ليس مكونا (component) منفصلا بذاته، فهي مسألة تفضيل وهناك حجة لكلا الطريقتين. في هذا المثال، تركناه جزءا من المكون `ProductTable` لأنه جزء من تصيير (rendering) *مجموعة البيانات (data collection)* والتي هي من مسئولية المكون `ProductTable`، ومع ذلك إذا تنامى عنوان الجدول بشكل معقد (مثال إضافة إمكانية الفرز (sorting)) سيكون بالتأكيد من المنطقي جعله مكونا منفصلا `ProductTableHeader`.

والأن بعد أن حددنا المكونات (components) في نموذج التصميم خاصتنا، لنقم بترتيبهم في تسلسل هرمي وهذا سهل، المكونات التي تظهر بداخل مكونات أخرى في النموذج يجب أن تكون ابنا (child) داخل التسلسل:

  * `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
      * `ProductCategoryRow`
      * `ProductRow`

## الخطوة الثانية: بناء نسخة ثابتة (static version) بـ (React) {#step-2-build-a-static-version-in-react}

<p data-height="600" data-theme-id="0" data-slug-hash="BwWzwm" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">شاهد النتيجة <a href="https://codepen.io/gaearon/pen/BwWzwm">التفكير بطريقة (React): الخطوة الثانية</a> على <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

والأن ونحن نملك التسلسل الهرمي للمكونات، حان وقت تنفيذ التطبيق. الطريقة السهلة هي بناء نسخة تستخدم نموذج البيانات (data model) لتصيير (renders) واجهة المستخدم (UI) ولكن بلا إمكانية للتفاعل مع التطبيق، من الأفضل فصل هذه العمليات لأن بناء نسخة ثابتة تحتاج للكثير من الكتابة دون تفكير، وإضافة التفاعلية (interactivity) تحتاج للكثير من التفكير والقليل من الكتابة، سنرى لماذا.

لبناء نسخة ثابتة من التطبيق ستحتاج إلى بناء مكونات تستخدم مكونات أخرى وترسل لها البيانات باستخدام *الخاصيات (props)*، وهي طريقة لتمرير البيانات من المكون الأب إلى المكون الابن، إذا كنت على معرفة بمبدأ *الحالة (state)* **لا تستخدم الحالة (state) أبداَ** لبناء نسخة ثابتة، الحالة (state) تستخدم لغرض التفاعلية فقط، ما يعني أن البيانات تتغير باستمرار، وبما أن هذه النسخة ثابتة فأنت لا تحتاجها.

يمكنك البناء من الأعلى إلى الأسفل أو من اﻷسفل إلى اﻷعلى، وذلك أنه يمكنك البدء ببناء المكونات في أعلى التسلسل الهرمي (مثلا ابدأ بـ `FilterableProductTable`) أو بمكون في أسفله (`ProductRow`)، في الأمثلة الغير معقدة من الأسهل عادة البدء من اﻷعلى إلى الأسفل، وفي المشاريع الأكبر من الأسهل البدء من الأسفل إلى الأعلى مع كتابة اختبارات (tests) خلال البناء.

<<<<<<< HEAD
مع نهاية هذه الخطوة، سيكون لديك مكتبة من المكونات القابلة لإعادة الاستخدام (reusable) التي تقوم بتصيير نموذج البيانات، المكونات ستحتوي فقط على دالات (`render()`) حيث أن هذه نسخة ثابتة من تطبيقك، المكون بأعلى التسلسل الهرمي (`FilterableProductTable`) سيحصل علي نموذج البيانات بصفته خاصية (prop)، إذا قمت بعمل تغيير في نموذج البيانات وقمت باستدعاء الدالة (`ReactDOM.render()`) مرة أخرى فإن واجهة المستخدم سيتم تحديثها، من السهل رؤية كيف يتم تحديث واجهة المستخدم وأين تحدث التغييرات فلا يوجد شيء معقد، طريقة تدفق البيانات في اتجاه واحد (**one-way data flow**) الخاصة بـ (React) وتدعي أيضاَ بـ (*one-way binding*) تحافظ على كل شيء سريع ووحدة (modular) واحدة.

انتقل إلى الوثائق [React docs](/docs/) إذا كنت بحاجة للمساعدة لتنفيذ هذه الخطوة
=======
At the end of this step, you'll have a library of reusable components that render your data model. The components will only have `render()` methods since this is a static version of your app. The component at the top of the hierarchy (`FilterableProductTable`) will take your data model as a prop. If you make a change to your underlying data model and call `root.render()` again, the UI will be updated. You can see how your UI is updated and where to make changes. React's **one-way data flow** (also called *one-way binding*) keeps everything modular and fast.

Refer to the [React docs](/docs/getting-started.html) if you need help executing this step.
>>>>>>> d07016aea812d26c60252a952bff7ae3e70bde27

### نبذة مختصرة: الخاصية (Props) مقابل الحالة (State){#a-brief-interlude-props-vs-state}

هناك نوعان من نماذج البيانات في (React): الحالة (state) والخاصية (props)، من المهم فهم الاختلاف بين الاثنين، تصفح الوثائق [the official React docs](/docs/state-and-lifecycle.html) إذا لم تكن متأكدا من الاختلاف. تصفح أيضا [الأسئلة الأكثر تكراراً: ما الفرق بين الحالة state والخاصيّات props؟](/docs/faq-state.html#what-is-the-difference-between-state-and-props)

##  الخطوة الثالثة: تحديد الحد الأدنى (ولكن المكتمل) الممثل لحالة واجهة المستخدم{#step-3-identify-the-minimal-but-complete-representation-of-ui-state}

لجعل واجهة المستخدم تفاعلية ستحتاج للقدرة على عمل تغييرات فى نموذج البيانات الخاص بتطبيقك، (React) تجعل هذا سهلاً باستخدام **الحالة (state)**.

لبناء تطبيقك بشكل صحيح، ستحتاج أولاً للتفكير فى الحد الأدنى من الحالة القابلة للتغيير (mutable state) التي سيحتاجها التطبيق، المفتاح هنا هو [لا تكرر نفسك (DRY: *Don't Repeat Yourself*)](https://ar.wikipedia.org/wiki/%D9%84%D8%A7_%D8%AA%D9%83%D8%B1%D8%B1_%D9%86%D9%81%D8%B3%D9%83)، حدد الحد الأدنى قدر الإمكان الممثل للحالة التي يحتاجها تطبيقك ثم قم بحساب كل شيء آخر عند الحاجة، على سبيل المثال إذا كنت تقوم ببناء تطبيق قائمة (TODO) فقط احتفظ بمصفوفة للعناصر ولا تحتفظ بمتغير حالة (state variable) منفصل للعدد، بدلاً من ذلك عندما تريد أن تصير (render) عدد العناصر (TODO) احسب طول المصفوفة لعناصر (TODO).

فكر في كل أجزاء البيانات في مثالنا، لدينا:

  * القائمة الأصلية للمنتجات
  * كلمة البحث التي أدخلها المستخدم
  * حالة الـ (checkbox)
  * قائمة المنتجات المنقحة

دعنا نحدد أي منهم تصلح حالةً، فقط اسأل ثلاث أسئلة عن كل جزء من البيانات:

  1. هل يتم تمريرها من مكون أب بصفتها خاصية (props)؟ إذا كان نعم، فمن المحتمل هي ليست حالة.
  2. هل هي ثابتة لاتتغير مع مرور الزمن؟ إذا كان نعم، فمن المحتمل هى ليست حالة.
  3. هل يمكنك حسابها بناء على حالة أو خاصية (props) أخرى فى هذا المكون؟ إذا كان نعم، فمن المحتمل هي ليست حالة.

القائمة الأصلية للمنتجات يتم تمريرها بصفتها خاصية (props) إذاَ فهي ليست حالة، كلمة البحث والـ (checkbox) يتضح أنهم حالة حيث أنهم يتغيرون مع الزمن ولا يمكن حسابهم من أي شيء، وأخيراَ القائمة المنقحة للمنتجات ليست حالة لأنه يمكن حسابها من دمج القائمة الأصلية للمنتجات مع كلمة البحث وحالة الـ (checkbox).

وأخيراً الحالة هي:

  * كلمة البحث التى أدخلها المستخدم
  * حالة الـ (checkbox)

## الخطوة الرابعة: حدد أين يجب أن تكون الحالة {#step-4-identify-where-your-state-should-live}

<p data-height="600" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">شاهد النتيجة<a href="https://codepen.io/gaearon/pen/qPrNQZ">التفكير بطريقة (React): الخطوة الرابعة</a> على <a href="https://codepen.io">CodePen</a>.</p>

حسناَ لقد حددنا ماهو الحد الأدنى للحالة، في الخطوة التالية سنحدد ماهو المكون المسئول عن تحويل (mutates) أو *يملك* هذه الحالة.

تذكر: في (React) تتدفق البيانات في اتجاه واحد (one-way flow) إلى أسفل التسلسل الهرمى للمكونات، قد لا يكون واضحا في هذه اللحظة أي مكون يجب أن يملك أية حالة **وهذه غالباَ أكثر الأجزاء تحدياَ للفهم على القادمين الجدد** لذلك اتبع هذه الخطوات للكشف لكل جزء من الحالة في تطبيقك:

  * حدد كل مكون يقوم بتصيير (render) شيء ما بناءً على هذه الحالة.
  * ابحث عن مكون مشترك ليملك هذه الحالة (مكون واحد أعلى فى التسلسل الهرمي من كل المكونات التي تحتاج لهذه الحالة).
  * إما المكون المشترك أو مكون آخر أعلى فى التسلسل الهرمي يجب أن يملك هذه الحالة.
  * إذا لم تجد مكونا يصلح لأن يملك هذه الحالة، أنشئ واحداَ جديداَ فقط ليملك هذه الحالة وأضفه في مكان ما في التسلسل الهرمى أعلى المكون المشترك.

لنتبع تلك الإستراتيجية في تطبيقنا:

  * المكون `ProductTable` يحتاج لتنقيح قائمة المنتجات بناء على الحالة والمكون `SearchBar` يحتاج لإظهار كلمة البحث وحالة الـ (checkbox).
  * المكون المشترك المالك للحالة هو `FilterableProductTable`.
  * نظرياَ من المنطقي أن تتواجد كلمة البحث وقيمة الـ (checkbox) في المكون `FilterableProductTable`.

رائع، لقد قررنا أن الحالة ستكون في المكون `FilterableProductTable`، أولاَ أضف (instance property) `this.state = {filterText: '', inStockOnly: false}` لل `constructor` للمكون `FilterableProductTable` 
 لتكون الحالة الإبتدائية للتطبيق ثم مرر الحالتين `filterText` و `inStockOnly` للمكونين `ProductTable` و `SearchBar` بصفتها خاصيات (props) وفي النهاية، استخدم هذه الخاصيات (props) لتنقيح صفوف المنتجات في المكون `ProductTable` وضع القيم للـ (form fields) في المكون `SearchBar`.

يمكنك الآن رؤية كيف سيتفاعل تطبيقك: ضع قيمة الحالة `filterText` إلى كرة `"ball"` وقم بعمل تحديث (refresh) للتطبيق، سترى أن جدول المنتجات تم تحديثه بشكل صحيح.

## الخطوة الخامسة: أضف التدفق العكسي للبيانات {#step-5-add-inverse-data-flow}

<p data-height="600" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js,result" data-user="rohan10" data-embed-version="2" data-pen-title="Thinking In React: Step 5" class="codepen">شاهد النتيجة <a href="https://codepen.io/gaearon/pen/LzWZvb">التفكير بطريقة React</a> على <a href="https://codepen.io">CodePen</a>.</p>

إلى الآن، قمنا ببناء التطبيق للتصيير (render) بشكل صحيح بإرسال الخاصيات (props) والحالة (state) إلى أسفل التسلسل الهرمي، الآن حان الوقت لدعم تدفق البيانات فى الإتجاه الآخر: المكونات الخاصة بـ (form) في أدنى التسلسل الهرمي تحتاج لتحديث الحالة للمكون `FilterableProductTable`.

تجعل (React) تدفق البيانات هذا صريحاَ ليسهل فهم كيف يعمل برنامجك، ولكنك ستحتاج للكتابة أكثر من الطريقة التقليدية لنقل البيانات في الإتجاهين (two-way data binding).

إذا حاولت الكتابة أو الضغط على الـ (checkbox) بالإصدار الحالي للتطبيق سترى أن React سيتجاهل ذلك، وذلك مقصود حيث أننا قمنا بوضع قيمة الخاصية (value) لل (input) لتكون دائماَ مساوية للحالة التى تم تمريرها من المكون `FilterableProductTable`.

<<<<<<< HEAD
لنفكر بما نريد أن يحدث، نريد التأكد كلما قام المستخدم بتغيير الـ (form) يتم تحديث الحالة لإظهار ما أدخله المستخدم وبما أن المكونات يجب أن تغير الحالة الخاصة بها فقط، المكون `FilterableProductTable` سيمرر الدالة (callback) للمكون `SearchBar` والتى سيتم استدعائها أينما وجب تحديث الحالة، يمكننا استخدام الحدث (`onChange` event) على الـ (inputs) لنعرف ذلك، الدالة (callback) التي تم تمريرها بواسطة المكون `FilterableProductTable` تقوم باستدعاء `setState()` ويتم تحديث التطبيق.
=======
If you try to type or check the box in the previous version of the example (step 4), you'll see that React ignores your input. This is intentional, as we've set the `value` prop of the `input` to always be equal to the `state` passed in from `FilterableProductTable`.
>>>>>>> d07016aea812d26c60252a952bff7ae3e70bde27

بالرغم من أن ذلك يبدو ذلك معقداَ، فحقيقة وباستخدام عدد قليل من الأسطر وبشكل صريح نرى كيف تتدفق البيانات خلال التطبيق.

## وهذا هو كل شيء {#and-thats-it}

<<<<<<< HEAD
أرجو أن تكون قد وصلتك الفكرة عن كيفية التفكير فى بناء المكونات والتطبيقات باستخدام (React)، بينما قد تكون الكتابة أكثر مما أنت معتاد عليه تذكر أن الكود من المهم أن يكون مقروء أكثر من كتابته ووحدة (modular) الكود هذه سهلة القراءة لأقصى الحدود، عند البدء فى بناء مكتبة كبيرة من المكونات ستقدر هذا الوضوح و النمطية (modularity) وبإعادة إستخدام هذا الكود سيتقلص عدد الأسطر :)
=======
Hopefully, this gives you an idea of how to think about building components and applications with React. While it may be a little more typing than you're used to, remember that code is read far more often than it's written, and it's less difficult to read this modular, explicit code. As you start to build large libraries of components, you'll appreciate this explicitness and modularity, and with code reuse, your lines of code will start to shrink. :)
>>>>>>> d07016aea812d26c60252a952bff7ae3e70bde27
