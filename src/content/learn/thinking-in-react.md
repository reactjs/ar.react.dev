---
title: التفكير على طريقة React
---

<Intro>

قد يغير React من الطريقة التي ترى بها التصاميم أو تبني بها التطبيقات. عندما تقوم ببناء واجهة للمستخدم بـ React سيتوجب عليك أولا أن تقسمها لأجزاء تدعى *مكونات*. بعد ذلك، تقوم بوصف الحالات الظاهرية المختلفة لكل مكون على حده. وأخيرا، تقوم بربط مكوناتك معا كي تسري البيانات خلالها بانسيابية. في هذا الدرس، سنخوض معك في طريقة التفكير في بناء جدول بيانات لمنتجات، مع إمكانية البحث فيه.

</Intro>

## ابدأ بالنموذج التقريبي {/*start-with-the-mockup*/}

لنفرض أن لديك واجهة برمجة API لـ JSON ونموذج تقريبي من أحد المصممين.

واجهة JSON البرمجية تعطتك البيانات التالية:

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

ابدأ برسم مربعات حول كلٍّ من المكونات ومكوناتها الفرعية في النموذج التقريبي، وقم بتسمية كل منها. إذا كنت تعمل مع مصمم، فلربما تجده قد قام بتسميتها بالفعل في البرامج التي يستخدمها، اسأله أولا!

قد تختلف طريقة التفكير في تقسيم التصميم لمكونات بناء على خلفيتك المهنية إلى عدة طرق؛ من حيث:

* **البرمجة**--استخدم نفس الأساليب لتقرر ما إذا كان عليك إنشاء دالة (function) أو كائن. أحد الأساليب هو [مبدأ المهمة الواحدة](https://ar.wikipedia.org/wiki/%D9%85%D8%A8%D8%AF%D8%A3_%D8%A7%D9%84%D9%85%D9%87%D9%85%D8%A9_%D8%A7%D9%84%D9%88%D8%A7%D8%AD%D8%AF%D8%A9)، والتي تشير إلى أنه في أحسن الأحوال، يكون للمكون الواحد وظيفة واحدة فقط. وكلما زادت مهمات المكون، يجب تقسيمها لمكونات فرعية أصغر.
* **التنسيق (CSS)**--فكر فيما ستقوم بتخصيص أسماء تصنيفات (classes) له. (مع أن المكونات أصلا يفترض أنها صغيرة الحجم).
* **التصميم**--فكر كيف ستقوم بتنظيم طبقات التصميم.

إذا كان الـJSON الذي تستخدمه مهيأ بشكل جيد، فكثيرا ما ستجده يطابق وصفك وتقسيمك لمكونات واجهتك بكل سلاسة. ذلك أن واجهة المستخدم ونماذج البيانات عادة ما يكون لهما نفس بنية المعلومات. بمعنى آخر، لهما نفس الشكل. فقسم واجهتك إلى مكونات، حيث يتماشى كل مكون مع أحد أجزاء نموذج البيانات.

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

إذا ألقيت نظرة على جدول المنتجات (`ProductTable` - بالبنفسجي) ستجد أن رأس الجدول (الذي يحوي خانات "الاسم - Name" و"السعر - Price") ليس كائنا مستقلا بذاته. هذه مسألة تفضيل شخصي، حيث بإمكانك اتخاذ أي مسلك بين الاثنين. في هذا المثال هي جزء من مكون `ProductTable`، لأنه يظهر داخل قائمة `ProductTable`. على كل حال، إذا زادت مهام رأس الجدول تعقيدا (كأن تضيف لها خيار الترتيب) يمكنك حينها أن تنشئ له مكونا خاصًا به، وليكن `ProductTableHeader` (`رأس جدول المنتجات`).

والآن بعد أن حددت مكونات النموذج التقريبي، قم بترتيبهم في شجرة تسلسلية؛ بحيث أن المكونات التي تظهر داخل مكونات أخرى في النموذج التقريبي يجب أن تبدو كفروع في الشجرة:

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## الخطوة 2: قم ببناء نموذج ثابت بـ React {/*step-2-build-a-static-version-in-react*/}

والآن بما أن لديك تقسيما متسلسلا للمكونات، حان الوقت لنبدأ التنفيذ. أكثر الطرق مباشرة؛ أن تبني نموذجا يعرض واجهة المستخدم من نموذج بياناتك، دون إضافة أي تفاعل... هذا بغض النظر عن أنه من الأيسر غالبا أن تبني النموذج الثابت أولا ثم تقوم لاحقا بإضافة إمكانية التفاعل عليه! بناء نموذج ثابت يتطلب الكثير من الكتابة دون أن تستلزم أي تفكير. بخلاف إضافة التفاعليات، التي تتطلب الكثير من التفكير وقدرًا أقل من الكتابة.

لبناء نموذج ثابت من تطبيقك يعرض البيانات المطلوبة، سيكون عليك بناء [مكونات](/learn/your-first-component) تحتوي مكونات أخرى، وتمرر البيانات إليها باستخدام [الخصائص](/learn/passing-props-to-a-component). الخصائص هي إحدى طرق تمرير البيانات من مكون لمكون فرعي داخله (إذا كان مبدأ [الحالة (state)](/learn/state-a-components-memory) مألوفا لديك، فلا تستخدم الحالات مطلقا لبناء النسخة الثابتة. الحالات مخصصة أصلا للتفاعلات، ونعني بذلك البيانات التي تتغير بمرور الوقت. وبما أن هذا نموذج ثابت من التطبيق، فلا يفترض أننا نحتاجه).

يمكنك إما بناء التطبيق "من أعلاه لأسفله"؛ بالبدء ببناء المكونات الأعلى في الشجرة التسلسلية (كأن تبدأ بـ`FilterableProductTable`)، أو "من أسفله لأعلاه"؛ بأن تبدأ بالمكونات الدنيا (مثل `ProductRow`). في الأمثلة الأبسط، سيكون من الأيسر أن تبدأ من الأعلى لأسفل، أما في المشاريع الكبرى، عادة ما يكون من الأيسر أن نبدأ من الأدنى للأعلى.

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
      <input type="text" placeholder="بحث..." />
      <label>
        <input type="checkbox" />
        {' '}
        عرض المنتجات المتوفرة فقط
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

(إذا كان هذا الكود غريبا عليك، قم بمراجعة قسم [البداية السريعة](/learn/) أولا!)

بعد بنائك لمكوناتك، أصبح لديك مكتبة من المكونات القابلة لإعادة الاستخدام التي تقوم بعرض نموذج بياناتك. وبما أن هذا تطبيق ثابت، فمخرجات المكونات ستكون مجرد JSX. المكون الأعلى في التسلسل الشجري (`FilterableProductTable`) سيتلقى نموذج البيانات كإحدى خصائصه. يدعى هذا بـ _سيل البيانات في اتجاه واحد_ لأن البيانات تسري لأسفل قادمة من مكون أعلى في التسلسل الشجري إلى مكونات دنيا في التسلسل.

<Pitfall>

إلى هذه المرحلة يجب ألا تكون قد استخدمت الحالات على الإطلاق. لأن هذا ما سنفعله في الخطوة التالية!

</Pitfall>

## الخطوة 3: حدد أبسط وأكمل تمثيل لحالات واجهة المستخدم {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

لجعل الواجهة تفاعلية؛ يجب أن تسمح للمستخدم بتعديل نموذج بياناتك. لإنجاز ذلك، سيتعين عليك استخدام *الحالات*.

اعتبر الحالات كما لو أنها عدّتك من البيانات المتغيرة التي يجب أن يتذكرها تطبيقك. أهم مبدأ يجب أخذه في الاعتبار عند تحديد حالاتك هو [عدم التكرار DRY](https://ar.wikipedia.org/wiki/%D9%84%D8%A7_%D8%AA%D9%83%D8%B1%D8%B1_%D9%86%D9%81%D8%B3%D9%83). حاول استنباط القدر الأدنى لتمثيل حالات تطبيقك المختلفة التي سيحتاجها، وقم باحتساب أي حالة أخرى تزيد على ذلك عند الحاجة. مثلا، إذا كنت تقوم ببناء قائمة مشتريات، يمكنك حفظ الأصناف كمصفوفة في حالة التطبيق. أما إذا احتجت لعرض عدد الأصناف في القائمة، فلا تقم بحفظ عدد الأصناف كحالة أخرى. عوضا عن ذلك؛ يمكنك دائما قراءة طول المصفوفة `Array.length`.

الآن فكر في كل ما قد تحتاجه من بيانات في تطبيقنا:

1. القائمة الأصلية للمنتجات.
2. كلمات البحث التي قام المستخدم بكتابتها.
3. حالة مربع الاختيار (الخاص بإظهار المنتجات التي لها رصيد فقط).
4. قائمة المنتجات بعد التصفية بكلمات البحث.

أي مما سبق يعتبر حالة؟ يمكنك تمييزها بأنها لا تنطبق عليها المواصفات التالية:

* هل تبقى دائما **ثابتة** لا تتغير؟ إذا ليست حالة..
* هل **تم تمريرها من المكون الأب** عن طريق الخصائص؟ إذا ليست حالة.
* **هل يمكن اشتقاقها** من حالة أخرى أو إحدى خصاص المكون؟ إذا ليست حالة!

كل ما تبقى فهو غالبا يمكن وصفه بأنه حالة.

لنقم بمراجعتهم واحد تلو الآخر مرة أخرى:

1. القائمة الأصلية للمنتجات **يتم تمريرها ضمن الخصائص، فهي ليست حالة.** 
2. كلمات البحث تبدو كحالة بما أنها تتغير مع مرور الوقت ولا يمكن اشتقاقها من أي شيء آخر.
3. حالة مربع الاختيار تبدو كحالة بما أنها تتغير مع مرور الوقت ولا يمكن اشتقاقها من أي شيء آخر.
4. قائمة المنتجات بعد التصفية **ليست حالة إذ يمكن اشتقاقها** عبر تصفية قائمة المنتجات الأصلية وفقا لكلمات البحث وحالة مربع الاختيار.

هذا يعني أن كلمات البحث وحالة مربع الاختيار فقط هما ما يعتبران حالات محتملة للتطبيق! أحسنت عملا!

<DeepDive>

#### الخصائص والحالات {/*props-vs-state*/}

هناك نوعان من البيانات "الافتراضية" في React: الخصائص والحالة. يختلف كلاهما عن الآخر بفارق كبير:

* [**الخصائص (Props)** تشبه المعطيات](/learn/passing-props-to-a-component) التي تقوم بتمريرها لإحدى الدوال. تتيح لمكون أعلى أن تمرر بيانات لمكون فرعي عنه وتنسيق مظهره أيضا. فمثلا، مكون `Form` يمكن أن يمرر خاصية `color` إلى `Button` لتغيير لونه.
* [**الحالة (State)** تشبه ذاكرة المكون.](/learn/state-a-components-memory) تتيح للمكون إمكانية أن يبقى مطلعًا على بعض البيانات وأن يغيرها تجاوبا مع تفاعل المستخدم. فمثلا, يمكن للزر `Button` أن يبقى على اطلاع لحالة `isHovered`.

الخصائص والحالات أمران مختلفان، لكن يكملان بعضهما. قد يحتوي مكون ما على بعض البيانات في حالات (كي يتمكن من تغييرها) و *يمررها* لمكون تابع كخصائص لها. لا بأس إن كنت تشعر أن الفارق بينهما لا يزال غامضا. قد يستلزم الأمر بعض الممارسة لتلمّ به!

</DeepDive>

## الخطوة 4: حدد أين تضع الحالات {/*step-4-identify-where-your-state-should-live*/}

بعد تحديد القدر الأدنى من بيانات الحالات اللازمة، عليك الآن أن تحدد أي المكونات مسئول عن تغيير كلٌّ من هذه الحالات، أو *يملك* تلك الحالة. تذكر أن React يستخدم سيل البيانات في اتجاه واحد، وهو تمرير البيانات من المكون الأب لمكون تابع له في التسلسل الشجري. قد لا يبدو واضحا من الوهلة الأولى أي مكون يجب أن يملك تلك "الحالة" ويكون مسؤولا عنها. ربما يكون هذا تحديا لك إن كان هذا المفهوم جديدا عليك، لكن ستتمكن من إيجاد الإجابة باتباع الخطوات التالية!

لكل حالة على حدة في تطبيقك:

1. حدد *جميع* المكونات التي تعرض أي شيء له علاقة بهذه الحالة.
2. حدد السلف المشترك الأقرب بينهم؛ مكون يكون أعلى منهم جميعا في التسلسل الشجري.
3. حدد أين يجب أن تتمركز الحالة:
    1. عادة، يمكنك وضع الحالة مباشرة في سلفهم المشترك.
    2. يمكنك أيضا أن تضع الحالة في مكون أعلى من السلف المشترك.
    3. إن لم يكن بإمكانك تحديد مكون حيث يبدو من المنطقي وضع الحالة فيه، قم بعمل مكون جديد خصيصا لحفظ تلك الحالة، وقم بوضعه في مكان ما في التسلسل الشجري يسبق سلفهم المشترك.

في الخطوة السابقة، وجدت حالتين في هذا التطبيق: نص البحث المكتوب، وحالة مربع الاختيار. في هذا المثال، يظهران دائما معا، فمن المنطقي وضعهم معا في نفس المكان.

حسنا، لنختبر طريقتنا عليهم:

1. **حدد المكونات التي تستخدم الحالة:**
    * مكون `ProductTable` (جدول المنتجات) يحتاج الحالة ليقوم بتصفية قائمة المنتجات (نص البحث وحالة مربع الاختيار). 
    * مكون `SearchBar` (خانة البحث) يقوم بعرض الحالة نفسها (نص البحث).
1. **حدد لهم سلفا مشتركا:** السلف المشترك للمكونين هو `FilterableProductTable`.
2. **حدد أين تضع الحالة**: سنضع نص البحث وحالة مربع الاختيار في المكون `FilterableProductTable`.

إذا، فقيم الحالات ستكون محفوظة لدى المكون `FilterableProductTable`. 

أضف الحالات للمكون باستخدام [خطاف `useState()`.](/reference/react/useState) الخطافات (Hooks) عبارة عن دوال خاصة تسمح لك أن "تربط" مكوناتك بنظام React. أضف متغيرا لكل حالة في بداية الكود الخاص بالمكون `FilterableProductTable` وحدد حالتهم الأولية:

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);  
```

ثم مرر المتغير `filterText` و`inStockOnly` للمكونين `ProductTable` و`SearchBar` كخاصية ضمن خصائص كل منهما:

```js
<div>
  <SearchBar 
    filterText={filterText} 
    inStockOnly={inStockOnly} />
  <ProductTable 
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} /></div>
```

قد يبدو واضحا لك من الآن كيف سيبدو سلوك تطبيقك. قم بتعديل قيمة `filterText` الأولية من `useState('')` إلى `useState('fruit')` في الكود التالي داخل الـsandbox المدرج. سترى نتيجة التعديل على كل من محتوى خانة البحث وجدول المنتجات:

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
        placeholder="بحث..."/>
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} />
        {' '}
        عرض المنتجات المتوفرة فقط
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

لاحظ أنك لو عدّلت مباشرة على نموذج البحث فلن يحدث شيء. هناك رسالة خطأ في الـsandbox أعلاه تخبرك لماذا:

<ConsoleBlock level="error">
  
You provided a \`value\` prop to a form field without an \`onChange\` handler. This will render a read-only field.

لقد قمت بتمرير \`قيمة\` إحدى الخصائص لإحدى خانات نموذج دون تحديد معالج لحدث تغير القيمة \`onChange\`. سينتج عن هذا خانة قابلة للقراءة فقط.

</ConsoleBlock>

في الـsandbox أعلاه؛ المكونان `ProductTable` و`SearchBar` يقرآن الخصائص `filterText` و`inStockOnly` لعرض الجدول، ومربع البحث، ومربع الاختيار. إليك مثلا كيف يقوم المكون `SearchBar` بكتابة محتوى مربع البحث:

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="بحث..."/>
```

ومع ذلك، فأنت لم تكتب بعد أي كود للتجاوب مع تفاعلات المستخدم (كالكتابة). هذه ستكون خطوتك الأخيرة.


## الخطوة 5: إضافة تدفق البيانات العكسي {/*step-5-add-inverse-data-flow*}

يعمل تطبيقك الآن بشكل صحيح، حيث تنساب الخصائص والحالات خلال شجرة المكونات. لكن لتغيير الحالة وفقًا لمدخلات المستخدم، سيكون لزامًا عليك أن تحسب حسابًا لدفق البيانات من الاتجاه الآخر: مكونات النموذج في أسفل الشجرة، تريد تعديل الحالة المتمركزة في المكون `FilterableProductTable`. 

يجعل React هذا النوع من تدفق البيانات بسيطا واضحا، لكنه يسلتزم قدرا أكبر من الكتابة مقارنة بالربط المزدوج للبيانات (two-way data binding). إذا ما حاولت الكتابة في خانة البحث أو التحديد على مربع الاختيار، ستجد أن React يتجاهل محاولاتك. وهذا أمر مقصود. بكتابتك `<input value={filterText} />`، فقد حددت خاصية القيمة (`value`) لخانة البحث `input` لأن تكون دوما مطابقة لقيمة الخاصية `filterText` الممررة من حالة المكون `FilterableProductTable`. وحيث أن الحالة `filterText` لم يتم تعديلها، فالخانة لن تتغير أبدأ.

عليك أن تجعل الأمر ليكون كلما قام المستخدم بتغيير مدخلات النموذج، يتم حينها تحديث الحالة لتعكس هذه التغييرات. المكون `FilterableProductTable` هو من يملك الحالة، فهو فقط من يمكنه استدعاء الدالتين `setFilterText` و`setInStockOnly`. للسماح للمكون `SearchBar` بأن يقوم بتحديث حالة المكون `FilterableProductTable`، سيكون عليك أيضا أن تمرر هذه الدوال للمكون `SearchBar`:

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

داخل المكون `SearchBar`، ستضيف معالجات حدث التغير `onChange` وتعدل من حالة المكون الأب عبرهما:

```js {5}
<input 
  type="text" 
  value={filterText} 
  placeholder="بحث..." 
  onChange={(e) => onFilterTextChange(e.target.value)} />
```

الآن يمكننا القول أن تطبيقنا يعمل بشكل كامل!

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
        value={filterText} placeholder="بحث..." 
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        عرض المنتجات المتوفرة فقط
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

يمكنك القراءة عن معالجة الأحداث وتعديل الحالات في قسم [إضافة التفاعلات](/learn/adding-interactivity).

## ماذا بعد؟ {/*where-to-go-from-here*/}

كانت هذه مقدمة مختصرة جدًا لكيفية التفكير في بناء المكونات والتطبيقات باستخدام React. يمكنك [البدء في كتابة مشروع بـ React](/learn/installation) فورا أو [أن تتعمق أكثر في الصيغ](/learn/describing-the-ui) المستخدمة في هذا الشرح.
