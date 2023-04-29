---
title: على طريقة React
---

<Intro>

قد يغير React من الطريقة التي ترى بها التصاميم أو تبني بها التطبيقات. عندما تقوم ببناء واجهة للمستخدم بـ React سيتوجب عليك أولا أن تفصلها لأجزاء تدعى *مكونات*. بعد ذلك، تقوم بوصف الحالات الظاهرية المختلفة لكل مكون على حدته. وأخيرا، تقوم بربط مكوناتك معا كي تسري البيانات خلالها بانسيابية. في هذا الدرس، سنخوض معك في عملية التفكير في بناء جدول بيانات لمنتجات، مع إمكانية البحث فيه.

</Intro>

## ابدأ بالنموذج التقريبي {/*start-with-the-mockup*/}

لنفرض أن لديك واجهة برمجة لـ JSON ونموذج تقريبي من أحد المصممين.

واجهة JSON البرمجية أعطتك البيانات التالية:

```json
[
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]
```

والنموذج التقريبي يبدو هكذا:

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

لتنفيذ واجهة مستخدم في React، ستسير عادة على نفس الخطوات الخمس التالية:

## الخطوة 1: قسم الواجهة إلى شجرة من المكونات {/*step-1-break-the-ui-into-a-component-hierarchy*/}

ابدأ برسم مربعات حول كل من المكونات ومكوناتها الفرعية في النموذج التقريبي، وقم بتسمية كل منها. إذا كنت تعمل مع مصمم، فلربما تجده قد قام بتسميتها بالفعل في البرامج التي يستخدمها، اسأله أولا!

قد تختلف طريقة التفكير في تقسيم التصميم لمكونات بناء على خلفيتك المهنية إلى عدة طرق؛ من حيث:

* **البرمجة**--استخدم نفس الطرائق لتقرر إذا ما كان عليك إنشاء دالة (function) أو كائن. إحدى الطرائق المقصودة هي [مبدأ المهمة الواحدة](https://ar.wikipedia.org/wiki/%D9%85%D8%A8%D8%AF%D8%A3_%D8%A7%D9%84%D9%85%D9%87%D9%85%D8%A9_%D8%A7%D9%84%D9%88%D8%A7%D8%AD%D8%AF%D8%A9)، والتي تشير إلى أنه في أحسن الأحوال، يكون للمكون الواحد وظيفة واحدة فقط. وكلما زادت مهمات المكون، يجب تقسيمها لمكونات فرعية أصغر.
* **التنسيق (CSS)**--فكر فيما ستقوم بتخصيص أسماء تصنيفات (classes) له. (مع أن المكونات أصلا يفترض أنها صغيرة الحجم).
* **التصميم**--فكر كيف ستقوم بترتيب تراص طبقات التصميم.

إذا كان الـJSON الذي تستخدمه مهيأ بشكل جيد، فكثيرا ما ستجده يطابق وصفك وتقسيمك لمكونات واجهتك بكل سلاسة. ذلك أن واجهة المستخدم ونماذج البيانات عادة ما يكون لهما نفس بنية المعلومات. بمعنى آخر، لهما نفس الشكل. فقسم واجهتك إلى مكونات، حيث يتماشى كل مكون مع إحدى 
أجزاء نموذج البيانات.

يوجد في هذه الصورة خمس مكونات:
<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable` (باللون الرمادي - جدول منتجات قابل للبحث) يحوي البرنامج بالكامل.
2. `SearchBar` (بالأزرق - مربع بحث) حيث يكتب فيه المستخدم.
3. `ProductTable` (بالبنفسجي - جدول المنتجات)  يعرض المنتجات ونتائج البحث فيها بحسب مدخلات المستخدم.
4. `ProductCategoryRow` (بالأخضر - سطر خاص بنوع المنتج) يعرض عنوان لكل نوع من المنتجات.
5. `ProductRow`	(بالأصفر - سطر المنتج) يعرض سطرا لكل منتج.

</CodeDiagram>

</FullWidth>

إذا ألقيت نظرة على جدول المنتجات (`ProductTable` - بالبنفسجي) ستجد أن رأس الجدول (الذي يحوي خانات "الاسم - Name" و"السعر - Price") ليس كائنا مستقلا بذاته. هذه مسألة تفضيل شخصي، حيث بإمكانك اتخاذ أي مسلك بين الاثنين. في هذا المثال هي جزء من مكون `جدول المنتجات`، لإنه يظهر داخل قائمة `جدول المنتجات`. على كل حال، إذا زادت مهام رأس الجدول تعقيدا (كأن تضيف لها خيار الترتيب) يمكنك حينها أن تنشئ له مكونا خاصا به، وليكن `ProductTableHeader` (`رأس جدول المنتجات`).

والآن بعد أن حددت مكونات النموذج التقريبي، قم بترتيبهم في شجرة تسلسلية؛ بحيث أن المكونات التي تظهر داخل مكونات أخرى في النموذج التقريبي يجب أن تبدو كفروع في الشجرة:

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## الخطوة 2: قم ببناء نموذج مصمت بـ React {/*step-2-build-a-static-version-in-react*/}

والآن بما أن لديك تقسيما متسلسلا للمكونات، حان الوقت لنبدأ التنفيذ. أكثر الطرق مباشرة؛ أن تبني نموذجا يعرض واجهة المستخدم من نموذج بياناتك، دون إضافة أي تفاعل... هذا بغض النظر عن أنه من الأيسر غالبا أن تبني النموذج المصمت أولا ثم تقوم لاحقا بإضافة إمكانية التفاعل عليه! بناء نموذج مصمت يتطلب الكثير من الكتابة دون أن تستلزم أي تفكير. بخلاف إضافة التفاعليات، التي تتطلب الكثير من التفكير وقدرًا أقل من الكتابة.

لبناء نموذج مصمت من تطبيقك يقوم بعرض البيانات المطلوبة، سيكون عليك بناء [مكونات](/learn/your-first-component) توظف مكونات أخرى، وتمرر البيانات إليها باستخدام [الخصائص](/learn/passing-props-to-a-component). الخصائص هي إحدى طرق تمرير البيانات من مكون لمكون فرعي داخله (إذا كان مبدأ [الحالات](/learn/state-a-components-memory) مألوفا لديك، فلا تستخدم الحالات مطلقا لبناء النسخة المصمتة. الحالات مخصصة أصلا للتفاعلات، ونعني بذلك البيانات التي تتغير بمرور الوقت. وبما أن هذا نموذج مصمت من التطبيق، فلا يفترض أننا نحتاجه).

يمكنك إما بناء التطبيق "من أعلاه لأسفله"؛ بالبدء ببناء المكونات الأعلى في الشجرة التسلسلية (كأن تبدأ بـ`FilterableProductTable`)، أو "من أسفله لأعلاه"؛ بأن تبدأ بالمكونات الدنيا (مثل `ProductRow`). إذا كان لدينا مثال أبسط من هذا، سيكون من الأيسرأن تبدأ من الأعلى لأسفل، أما في المشاريع الكبرى، عادة ما يكون من الأيسر أن نبدأ من الأدنى للأعلى.

<Sandpack>

```jsx App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>

(إذا شعرت بالقلق بسبب الكود السابق, قم بمراجعة قسم [البداية السريعة](/learn/) أولا!)

بعد بنائك لمكوناتك، أصبح لديك مكتبة من المكونات القابلة لإعادة الاستخدام التي تقوم بعرض أنموذج بياناتك. وبما أن هذا تطبيق مصمت، فمخرجات المكونات ستكون مجرد JSX. المكون الأعلى في التسلسل الشجري (`FilterableProductTable`) سيتلقى أنموذج البيانات كإحدى خصائصه. يدعى هذا بـ _سيل البيانات في اتجاه واحد_ لأن البيانات تسري لأسفل قادمة من مكون أعلى في التسلسل الشجري إلى مكونات دنيا في التسلسل.

<Pitfall>

إلى هذه المرحلة يجب ألا تكون قد استخدمت الحالات على الإطلاق. لأن هذا ما سنفعله في الخطوة التالية!

</Pitfall>

## الخطوة 3: حدد أبسط وأكمل تمثيل لحالات واجهة المستخدم {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

لجعل الواجهة تفاعلية؛ يجب أن تسمح للمستخدم بتعديل أنموذج بياناتك. لإنجاز ذلك، سيتعين عليك توظيف *الحالات*.

اعتبر الحالات كما لو أنها عدّتك من البيانات المتغيرة التي يجب أن يتذكرها تطبيقك. أهم مبدأ يجب أخذه في الاعتبار عند تحديد حالاتك هي أن تكون [فريدة](https://ar.wikipedia.org/wiki/%D9%84%D8%A7_%D8%AA%D9%83%D8%B1%D8%B1_%D9%86%D9%81%D8%B3%D9%83). حاول استنباط القدر الأدنى لتمثيل حالات تطبيقك المختلفة التي سيحتاجها، وقم باحتساب أي حالة أخرى تزيد على ذلك عند الحاجة. مثلا، إذا كنت تقوم ببناء قائمة مشتريات، يمكنك حفظ الأصناف كمصفوفة في حالة التطبيق. أما إذا احتجت لعرض عدد الأصناف في القائمة، فلا تقم بحفظ عدد الأصناف كحالة أخرى. عوضا عن ذلك؛ يمكنك دائما قراءة طول المصفوفة.

الآن فكر في كل ما قد تحتاجه من بيانات في تطبيقنا المفترض:

1. القائمة الأصلية للمنتجات.
2. كلمات البحث التي قام المستخدم بكتابتها.
3. حالة مربع الاختيار (الخاص بإظهار المنتجات التي لها رصيد فقط).
4. قائمة المنتجات بعد التصفية بكلمات البحث.

أيا مما سبق يعتبر حالة؟ يمكنك تمييزها بأنها لا تنطبق عليها المواصفات التالية:

* هل تبقى دائما **ثابتة** لا تتغير؟ إذا ليست حالة..
* هل **تم تمريرها من المكون الأب** عن طريق الخصائص؟ إذا ليست حالة.
* **هل يمكن اشتقاقها** من حالة أخرى أو إحدى خصاص المكون؟ إذا ليست حالة!

كل ما تبقى فهو غالبا يمكن وصفه بأنه حالة.

لنقم بمراجعتهم واحد تلو الآخر مرة أخرى:

1. القائمة الأصلية للمنتجات **يتم تمريرها ضمن الخصائص،فهي ليست حالة.** 
2. كلمات البحث تبدو كحالة بما أنها تتغير مع مرور الوقت ولا يمكن اشتقاقها من أي شيء آخر.
3. حالة مربع الاختيار تبدو كحالة بما أنها تتغير مع مرور الوقت ولا يمكن اشتقاقها من أي شيء آخر.
4. قائمة المنتجات بعد التصفية **ليست حالة إذ يمكن اشتقاقها** عبر تصفية قائمة المنتجات الأصلية وفقا لكلمات البحث وحالة مربع الاختيار.

هذا يعني أن كلمات البحث وحالة مربع الاختيار فقط هما ما يعتبران حالات محتملة للتطبيق! أحسنت عملا!

<DeepDive>

#### الخصائص والحالات {/*props-vs-state*/}

يعتبر كل منهما من أحد أنواع البيانات "النموذجية" في React: الخصائص والحالة. يختلف كلاهما عن الآخر بفارق كبير:

* [**الخصائص (Props)** تشبه المعطيات](/learn/passing-props-to-a-component) التي تقوم بتمريرها لإحدى الدوال. تتيح لمكون أعلى أن تمرر بيانات لمكون تابع له وتنسيق مظهره أيضا. فمثلا، مكون  `Form` يمكن أن يمرر خاصية `color` إلى `Button` لتغيير لونه.
* [**الحالة (State)** تشبه ذاكرة المكون.](/learn/state-a-components-memory) تتيح للمكون إمكانية أن يحاقظ على اطلاعه على بعض البيانات وأن يغيرها تجاوبا مع تفاعل المستخدم. فمثلا, يمكن للزر `Button` أن يبقى على اطلاع لحالة `isHovered`.

الخصائص والحالات أمران مختلفان، لكن يكملان بعضهما. قد يحتوي مكون ما على بعض البيانات في حالات (كي يتمكن من تغييرها) و *يمررها* لمكون تابع كخصائص لها. لا بأس إن كنت تشعر أن الفارق بينهما لا يزال غامضا. قد يستلزم الأمر بعض الممارسة لتتمكن من الإلمام به!

</DeepDive>

## Step 4: Identify where your state should live {/*step-4-identify-where-your-state-should-live*/}

After identifying your app’s minimal state data, you need to identify which component is responsible for changing this state, or *owns* the state. Remember: React uses one-way data flow, passing data down the component hierarchy from parent to child component. It may not be immediately clear which component should own what state. This can be challenging if you’re new to this concept, but you can figure it out by following these steps!

For each piece of state in your application:

1. Identify *every* component that renders something based on that state.
2. Find their closest common parent component--a component above them all in the hierarchy.
3. Decide where the state should live:
    1. Often, you can put the state directly into their common parent.
    2. You can also put the state into some component above their common parent.
    3. If you can't find a component where it makes sense to own the state, create a new component solely for holding the state and add it somewhere in the hierarchy above the common parent component.

In the previous step, you found two pieces of state in this application: the search input text, and the value of the checkbox. In this example, they always appear together, so it makes sense to put them into the same place.

Now let's run through our strategy for them:

1. **Identify components that use state:**
    * `ProductTable` needs to filter the product list based on that state (search text and checkbox value). 
    * `SearchBar` needs to display that state (search text and checkbox value).
1. **Find their common parent:** The first parent component both components share is `FilterableProductTable`.
2. **Decide where the state lives**: We'll keep the filter text and checked state values in `FilterableProductTable`.

So the state values will live in `FilterableProductTable`. 

Add state to the component with the [`useState()` Hook.](/reference/react/useState) Hooks are special functions that let you "hook into" React. Add two state variables at the top of `FilterableProductTable` and specify their initial state:

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);  
```

Then, pass `filterText` and `inStockOnly` to `ProductTable` and `SearchBar` as props:

```js
<div>
  <SearchBar 
    filterText={filterText} 
    inStockOnly={inStockOnly} />
  <ProductTable 
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

You can start seeing how your application will behave. Edit the `filterText` initial value from `useState('')` to `useState('fruit')` in the sandbox code below. You'll see both the search input text and the table update:

<Sandpack>

```jsx App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} />
      <ProductTable 
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Notice that editing the form doesn't work yet. There is a console error in the sandbox above explaining why:

<ConsoleBlock level="error">

You provided a \`value\` prop to a form field without an \`onChange\` handler. This will render a read-only field.

</ConsoleBlock>

In the sandbox above, `ProductTable` and `SearchBar` read the `filterText` and `inStockOnly` props to render the table, the input, and the checkbox. For example, here is how `SearchBar` populates the input value:

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
```

However, you haven't added any code to respond to the user actions like typing yet. This will be your final step.


## Step 5: Add inverse data flow {/*step-5-add-inverse-data-flow*/}

Currently your app renders correctly with props and state flowing down the hierarchy. But to change the state according to user input, you will need to support data flowing the other way: the form components deep in the hierarchy need to update the state in `FilterableProductTable`. 

React makes this data flow explicit, but it requires a little more typing than two-way data binding. If you try to type or check the box in the example above, you'll see that React ignores your input. This is intentional. By writing `<input value={filterText} />`, you've set the `value` prop of the `input` to always be equal to the `filterText` state passed in from `FilterableProductTable`. Since `filterText` state is never set, the input never changes.

You want to make it so whenever the user changes the form inputs, the state updates to reflect those changes. The state is owned by `FilterableProductTable`, so only it can call `setFilterText` and `setInStockOnly`. To let `SearchBar` update the `FilterableProductTable`'s state, you need to pass these functions down to `SearchBar`:

```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

Inside the `SearchBar`, you will add the `onChange` event handlers and set the parent state from them:

```js {5}
<input 
  type="text" 
  value={filterText} 
  placeholder="Search..." 
  onChange={(e) => onFilterTextChange(e.target.value)} />
```

Now the application fully works!

<Sandpack>

```jsx App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} 
        onFilterTextChange={setFilterText} 
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable 
        products={products} 
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} placeholder="Search..." 
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>

You can learn all about handling events and updating state in the [Adding Interactivity](/learn/adding-interactivity) section.

## Where to go from here {/*where-to-go-from-here*/}

This was a very brief introduction to how to think about building components and applications with React. You can [start a React project](/learn/installation) right now or [dive deeper on all the syntax](/learn/describing-the-ui) used in this tutorial.
