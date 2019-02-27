---
id: thinking-in-react
title: التفكير بطريقة React
permalink: docs/thinking-in-react.html
redirect_from:
  - 'blog/2013/11/05/thinking-in-react.html'
  - 'docs/thinking-in-react-zh-CN.html'
prev: composition-vs-inheritance.html
---

برأينا (React) هو الطريقة الاساسية لبناء تطبيقات ويب كبيرة وسريعة بإستخدام الجافاسكريبت (Javascript) لقد ساعدنا في التوسع في التطبيقات بشكل جيد بفيسبوك (Facebook) وانستجرام (Instagram).

واحدة من المزايا العظيمة ل (React) هي كيف انه يجعلك تفكر في التطبيقات اثناء بناءها. في هذه الصفحة سنقوم معاَ بعملية التفكير لبناء جدول بيانات منتج قابل للبحث به بإستخدام (React)

## ابدأ بنموذج التطبيق {#start-with-a-mock}

تصور أننا نملك واجهة برمجة تطبيقات  (API JSON) جاهزة ونموذج من المصمم. هذا النموذج يشبه الآتي:

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

### الخطوة الأولي: قم بتقسيم واجهة المستخدم (UI) لتسلسل هرمي لمكونات الواجهة (Component) {#step-1-break-the-ui-into-a-component-hierarchy}

اول شئ يجب عليك فعله هو رسم مستطيلات حول كل مكون (component) ومكون فرعي(subcomponent) بالنموذج واعطاء كل منهم أسم. إذا كنت تعمل مع مصمم تحدث معه فعلي الأرجح هو فعل ذلك! فأسماء طبقات الفوتوشوب (Photoshop layers) من الممكن أن تصلح كأسماء لمكوناتك (React component)!

ولكن كيف تعرف ما يجب أن تحدده كمكون؟ فقط إستخدم نفس الأساليب أثناء أخذ قرار بإنشاء دالة (Function) او (Object) جديدة . كمثال علي أسلوب هو (مبدأ المسئولية الأحادية) [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle) وهي أن المكون (component) بشكل مثالي يجب أن يكون مسئول عن فعل شئ واحد فقط وإذا بدأ في التنامي يجب تقسيمه لمكونات فرعية (subcomponent) أصغر.

حيث أننا غالباَ ما نعرض نموذج البيانات (JSON data model) للمستخدم ستجد أنه إذا كان هذا النموذج مبني بشكل جيد فإنه سيتطابق مع واجهة المستخدم (UI) خاصتك بشكل رائع وبالتالي مع بناء مكوناتك (component structure) وهذا لأن واجهة المستخدم (UI) ونموذج البيانات (data models) يميلان الي التقيد بنفس *(الشكل البنائي للمعلومات information architecture)* وهو مايعني ان العمل علي تقسيم واجهة المستخدم (UI) لمكونات (components) غالباَ مايكون بسيط فقط قم بتقسيمها الي مكونات (component) تمثل تحديداَ جزء واحد من نموذج البيانات (data model) خاصتك.

![Component diagram](../images/blog/thinking-in-react-components.png)

ستري هنا أن لدينا خمس مكونات (components) في تطبيقنا البسيط ولقد قمنا بالكتابة بخط مائل كل مكون ومايمثله من بيانات.

  1. **`FilterableProductTable` (باللون البرتقالي):** يحتوي المثال بكامله
  2. **`SearchBar` (باللون الأزرق):** يستقبل ما يدخله المستخدم *(user input)*
  3. **`ProductTable` (باللون الأخضر):** يعرض و ينقح (filter) مجموعة البيانات *(data collection)* طبقاَ لما ادخله المستخدم *(user input)*
  4. **`ProductCategoryRow` (باللون الفيروزي):** يعرض عنوان (heading) لكل  *فئة (category)*
  5. **`ProductRow` (باللون الأحمر):** يعرض صف لكل *منتج (product)*

إذا نظرت الي المكون `ProductTable` ستري أن عنوان الجدول (المحتوي علي الأسم والسعر) ليس مكون (component) منفصل بذاته هي مسألة تفضيل وهناك حجة لكل الطريقتين. لهذا المثال نحن تركناه كجزء من المكون `ProductTable`لأنه جزء من تصيير (rendering) *مجموعة البيانات (data collection)* والتي هي من مسئولية المكون `ProductTable`، ومع ذلك إذا تنامي عنوان الجدول بشكل معقد (كمثال إضافة إمكانية الفرز (sorting)) سيكون بالتأكيد من المنطقي جعله مكون منفصل `ProductTableHeader`.

والأن بعد أن حددنا المكونات (components) في نموذج التصميم خاصتنا، لنقم برتيبهم في تسلسل هرمي وهذا سهل، المكونات التي تظهر بداخل مكونات أخري في النموذج يجب أن تكون إبن (child) داخل التسلسل:

  * `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
      * `ProductCategoryRow`
      * `ProductRow`

## الخطوة الثانية: بناء نسخة ثابتة (static version) بال (React) {#step-2-build-a-static-version-in-react}

<p data-height="600" data-theme-id="0" data-slug-hash="BwWzwm" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">شاهد النتيجة <a href="https://codepen.io/gaearon/pen/BwWzwm">التفكير بطريقة (React): الخطوة الثانية</a> علي <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

والأن ونحن لدينا التسلسل الهرمي للمكونات، حان وقت تنفيذ التطبيق. الطريقة السهلة هي بناء نسخة تستخدم نموذج البيانات (data model) لتصيير (renders) واجهة المستخدم (UI) ولكن بدون إمكانية للتفاعل مع التطبيق، من الأفضل فصل هذه العمليات لأن بناء نسخة ثابتة تحتاج للكثير من الكتابة بدون تفكير وإضافة التفاعلية (interactivity) تحتاج للكثير من التفكير والقليل من الكتابة، سنري لماذا.

لبناء نسخة ثابتة من التطبيق ستحتاج الي بناء مكونات تستخدم مكونات أخري وترسل لها البيانات بإستخدام *الخاصيات (props)*، وهي طريقة لتمرير البيانات من المكون الأب الي المكون الأبن، إذا كنت علي معرفة بمبدأ *الحالة (state)*
**لا تستخدم الحالة (state) ابداَ** لبناء نسخة ثابتة. الحالة (state) تستخدم لغرض التفاعلية فقط، وهو أن البيانات تتغير بأستمرار وحيث أن هذه النسخة ثابتة أنت لا تحتاجها.

يمكنك البناء من أعلي لأسفل او من أسفل لأعلي. وذلك أنه يمكنك البدء ببناء المكونات في أعلي التسلسل الهرمي (كمثال أبدأ ب `FilterableProductTable`) او بمكون في اسفله (`ProductRow`)، في الأمثلة البسيطة من الأسهل عادة البدء من أعلي لأسفل، وفي المشاريع الأكبر من الأسهل البدء من أسفل الي أعلي مع كتابة إختبارات (tests) كلما تبني.

بنهاية هذه الخطوة، سيكون لديك مكتبة من المكونات القابلة لإعادة الإستخدام (reusable) التي تقوم بتصيير نموذج البيانات. المكونات ستحتوي فقط علي دالات (`render()` methods) حيث أن هذه نسخة ثابتة من تطبيقك. المكون بأعلي التسلسل الهرمي (`FilterableProductTable`) سيحصل علي نموذج البيانات كخاصية (prop). إذا قمت بعمل تغيير في نموذج البيانات وقمت بإستدعاء الدالة (`ReactDOM.render()`) مرة أخري فإن واجهة المستخدم سيتم تحديثها. من السهل رؤية كيف يتم تحديث واجهة المستخدم واين تحدث التغييرات حيث أنه لايوجد شئ معقد يحدث، طريقة تدفق البيانات في اتجاه واحد (**one-way data flow**) لل (React) وتدعي أيضاَ (*one-way binding*) تحافظ علي كل شئ وسريع وكوحدة (modular) واحدة.

ببساطة انتقل الي [React docs](/docs/) إذا كنت بحاجة للمساعدة لتنفيذ هذه الخطوة

### نبذه بسيطة: الخاصية (Props) مقابل الحالة (State){#a-brief-interlude-props-vs-state}

هناك نوعان من نماذج البيانات في (React): الحالة (state) و الخاصية (props)، من المهم فهم الأختلاف بين الأثنين، تصفح [the official React docs](/docs/interactivity-and-dynamic-uis.html) إذا لم تكن متأكد من الأختلاف.

## Step 3: Identify The Minimal (but complete) Representation Of UI State {#step-3-identify-the-minimal-but-complete-representation-of-ui-state}

To make your UI interactive, you need to be able to trigger changes to your underlying data model. React makes this easy with **state**.

To build your app correctly, you first need to think of the minimal set of mutable state that your app needs. The key here is [DRY: *Don't Repeat Yourself*](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). Figure out the absolute minimal representation of the state your application needs and compute everything else you need on-demand. For example, if you're building a TODO list, just keep an array of the TODO items around; don't keep a separate state variable for the count. Instead, when you want to render the TODO count, simply take the length of the TODO items array.

Think of all of the pieces of data in our example application. We have:

  * The original list of products
  * The search text the user has entered
  * The value of the checkbox
  * The filtered list of products

Let's go through each one and figure out which one is state. Simply ask three questions about each piece of data:

  1. Is it passed in from a parent via props? If so, it probably isn't state.
  2. Does it remain unchanged over time? If so, it probably isn't state.
  3. Can you compute it based on any other state or props in your component? If so, it isn't state.

The original list of products is passed in as props, so that's not state. The search text and the checkbox seem to be state since they change over time and can't be computed from anything. And finally, the filtered list of products isn't state because it can be computed by combining the original list of products with the search text and value of the checkbox.

So finally, our state is:

  * The search text the user has entered
  * The value of the checkbox

## Step 4: Identify Where Your State Should Live {#step-4-identify-where-your-state-should-live}

<p data-height="600" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">See the Pen <a href="https://codepen.io/gaearon/pen/qPrNQZ">Thinking In React: Step 4</a> on <a href="https://codepen.io">CodePen</a>.</p>

OK, so we've identified what the minimal set of app state is. Next, we need to identify which component mutates, or *owns*, this state.

Remember: React is all about one-way data flow down the component hierarchy. It may not be immediately clear which component should own what state. **This is often the most challenging part for newcomers to understand,** so follow these steps to figure it out:

For each piece of state in your application:

  * Identify every component that renders something based on that state.
  * Find a common owner component (a single component above all the components that need the state in the hierarchy).
  * Either the common owner or another component higher up in the hierarchy should own the state.
  * If you can't find a component where it makes sense to own the state, create a new component simply for holding the state and add it somewhere in the hierarchy above the common owner component.

Let's run through this strategy for our application:

  * `ProductTable` needs to filter the product list based on state and `SearchBar` needs to display the search text and checked state.
  * The common owner component is `FilterableProductTable`.
  * It conceptually makes sense for the filter text and checked value to live in `FilterableProductTable`

Cool, so we've decided that our state lives in `FilterableProductTable`. First, add an instance property `this.state = {filterText: '', inStockOnly: false}` to `FilterableProductTable`'s `constructor` to reflect the initial state of your application. Then, pass `filterText` and `inStockOnly` to `ProductTable` and `SearchBar` as a prop. Finally, use these props to filter the rows in `ProductTable` and set the values of the form fields in `SearchBar`.

You can start seeing how your application will behave: set `filterText` to `"ball"` and refresh your app. You'll see that the data table is updated correctly.

## Step 5: Add Inverse Data Flow {#step-5-add-inverse-data-flow}

<p data-height="600" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js,result" data-user="rohan10" data-embed-version="2" data-pen-title="Thinking In React: Step 5" class="codepen">See the Pen <a href="https://codepen.io/gaearon/pen/LzWZvb">Thinking In React: Step 5</a> on <a href="https://codepen.io">CodePen</a>.</p>

So far, we've built an app that renders correctly as a function of props and state flowing down the hierarchy. Now it's time to support data flowing the other way: the form components deep in the hierarchy need to update the state in `FilterableProductTable`.

React makes this data flow explicit to make it easy to understand how your program works, but it does require a little more typing than traditional two-way data binding.

If you try to type or check the box in the current version of the example, you'll see that React ignores your input. This is intentional, as we've set the `value` prop of the `input` to always be equal to the `state` passed in from `FilterableProductTable`.

Let's think about what we want to happen. We want to make sure that whenever the user changes the form, we update the state to reflect the user input. Since components should only update their own state, `FilterableProductTable` will pass callbacks to `SearchBar` that will fire whenever the state should be updated. We can use the `onChange` event on the inputs to be notified of it. The callbacks passed by `FilterableProductTable` will call `setState()`, and the app will be updated.

Though this sounds complex, it's really just a few lines of code. And it's really explicit how your data is flowing throughout the app.

## And That's It {#and-thats-it}

Hopefully, this gives you an idea of how to think about building components and applications with React. While it may be a little more typing than you're used to, remember that code is read far more than it's written, and it's extremely easy to read this modular, explicit code. As you start to build large libraries of components, you'll appreciate this explicitness and modularity, and with code reuse, your lines of code will start to shrink. :)
