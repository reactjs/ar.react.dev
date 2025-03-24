---
title: بداية سريعة
---

<Intro>

<<<<<<< HEAD
أهلا بك في مستندات react، هذه الصفحة ستعطيك مقدمة ل ٨٠٪ من مفاهيم React التي يتم استخدامها بشكل روتيني في مشاريع React.
=======
Welcome to the React documentation! This page will give you an introduction to 80% of the React concepts that you will use on a daily basis.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

</Intro>

<YouWillLearn>

- كيف تقوم بإنشاء ودمج المكوّنات.
- كيف تضيف تأثيرات على العناصر.
- كيف تقوم بعرض البيانات.
- كيف تستخدم الجمل الشرطية وتعرض عناصر القوائم.
- كيف تتجاوب مع الأحداث المختلفة وتحدث شاشة المستخدم بناءً عليها.
- كيف تشارك البيانات بين أكثر من مكوّن.


</YouWillLearn>

## إنشاء ودمج المكوّنات {/*components*/}
يتم صناعة تطبيقات React اعتمادا على ما يعرف بـ (المكوّنات - Components).
المكوّن هو جزء مستقل من واجهة المستخدم والتي لها المنطق البرمجي والشكل الخاص بها. يمكنك تشكيل المكوّن بالحجم والشكل المناسب فيتراوح من كونه صغيرا ليمثل (زر) أو كبيرا ليمثل صفحة كاملة.
المكوّنات ليست إلا دوال JavaScript والتي توفر (ترميزا مرئيا) كقيمة مرجعة من الدالة.


```js
function MyButton() {
  return (
    <button>أنا زر</button>
  );
}
```
الآن قمت ببناء مكوّن باسم `MyButton`، يمكنك الآن إدخاله في مكون آخر:


```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>مرحبًا بكم في تطبيقي</h1>
      <MyButton />
    </div>
  );
}
```

لاحظ كيف أن المكوّن `<MyButton />` يبدأ بحرف (كبير) في الإنجليزية (M)، وهي طريقة مستخدمة في React للتمييز ومعرفة أن هذه الدالة تمثل مكوّن. أسماء المكوّنات في React يجب أن تبدأ دائما بحرف كبير، بينما يجب أن تكون وسوم ال html المستخدمة بحرف صغير.

خذ نظرة سريعة على النتيجة:


<Sandpack>

```js
function MyButton() {
  return (
    <button>
      أنا زر
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>مرحبًا بكم في تطبيقي</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>


عبارة `export default` تحدد المكوّن الأساسي في الملف. إذا لم يكن لديك معرفة كافية عن طريقة بناء وكتابة الكود في JavaScript، فيمكنك الرجوع للمصادر التالية:
[MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export)
[javascript.info](https://javascript.info/import-export) 


## بناء الترميز المرئي للواجهة باستخدام JSX {/*writing-markup-with-jsx*/}



طريقة بناء جمل ترميز الواجهات الذي شاهدته في الأعلى هو ما يسمى بـ *JSX*. استخدام الـ JSX يعتبر اختياريا، لكن معظم مشاريع React تستخدم الـ JSX لسهولة التعامل معها. كل [الأدوات التي ننصح بها لبيئة التطوير](/learn/installation) تدعم الـ JSX.


تعتبر JSX أكثر صرامة من ال HTML. حيث يجب عليك إغلاق العلامات مثل `<br />`. وكذلك فإن المكوّن الذي تقوم بإنشائه لا يمكن أن يرجع لك مجموعة من علامات ال JSX، بل يجب عليك إحاطتهم بأبٍ مشترك مثل: `<div>...</div>` أو حتى غطاء `<>...</>` الفارغ.


```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>عنوان</h1>
      <p>مرحبًا جميعًا.<br />كيف حالكم?</p>
    </>
  );
}
```

إذا كان لديك الكثير من الأكواد المكتوبة بال HTML والتي ترغب في تحويلها إلى الـ JSX، فيمكنك استخدام [تحويل الـ HTML لـ JSX أون لاين.](https://transform.tools/html-to-jsx)


## إضافة أنماط تصميمية {/*adding-styles*/}
 في React يمكنك تحديد تصنيف باستخدام `className`. حيث أنها تعمل تماما كما تعمل خاصية [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) في الـ HTML:


```js
<img className="avatar" />
```

و بعد ذلك يمكنك كتابة قواعد الـ CSS لهذا التصنيف في ملف CSS منفصل:

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

React لا تحدد لك كيف يجب عليك إضافة ملفات الـ CSS  لملف الـ HTML.
ببساطة  يمكنك إضافة وسم [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) لملف الـ html الخاص بك. 
 إذا كنت تستخدم أداة بناء معينة أو إطار عمل فاستفسر عن طريقة إضافة ملفات الـ CSS لمشروعك من خلال المستندات الخاصة بالأداة. 


## عرض البيانات {/*displaying-data*/}

تمكنك الـ JSX من إدخال ترميز الواجهة بداخل JavaScript، ويمكنك من خلال الأقواس المعقوفة "الخروج من ترميز الواجهة" والعودة مرة أخرى إلى سياق JavaScript حتى تتمكن من تضمين متغير من أكوادك وعرضه للمستخدم، فمثلا الكود التالي سيُظهر `user.name` للمستخدم على الشاشة:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

يمكنك كذلك "الخروج إلى سياق JavaScript" من داخل خواص الـ JSX، لكن يجب عليك حينها استخدام الأقواس المعقوفة *بدلا من* علامات التنصيص. فمثلا `className="avatar"` تقوم بتمرير `"avatar"` على أنه التصنيف المستخدم في الـ CSS، ولكن `src={user.imageUrl}` تقوم بقراءة قيمة متغير JavaScript التالي: `user.imageUrl` ومن ثم تقوم بتمرير قيمته لتمثل خاصية الـ `src`:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

يمكنك كذلك وضع تعبيرات برمجية أكثر تعقيدا بداخل أقواس الـ JSX المعقوفة، مثلا [دمج النصوص](https://javascript.info/operators#string-concatenation-with-binary): 


<Sandpack>

```js
const user = {
  name: 'هايدي لامار',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

في المثال الموضح أعلاه `style={{}}` لا تمثل بناءً خاصا، بل هو كائن JavaScript المعروف `{}` والمعرف بداخل الأقواس المعقوفة الخاصة بال JSX بداخل `style={ }`. يمكنك استخدام خاصية `style` عندما يكون التصميم لديك معتمدا على متغير JavaScript.


## التصيير الشرطي {/*conditional-rendering*/}


في React، لا يوجد طريقة خاصة لكتابة العبارات الشرطية، وإنما يتم استخدام نفس الطرق المستخدمة في كتابة أكواد JavaScript الاعتيادية، فعلى سبيل المثال يمكنك استخدام عبارة [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) لإظهار الـ JSX بشكل شرطي:


```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```
و إذا كنت تفضل استخدام كود أكثر اختصارا فيمكنك استخدام [معامل `?` الشرطي](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) وتتميز بإمكانية استخدامها في داخل ال JSX على النقيض من `if` العادية.


```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

و في حالة عدم احتياجك لجزئية `else` فيمكنك استخدام [عبارة `&&` المنطقية](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation):


```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

كل الطرق المذكورة في الأعلى يمكن كذلك استخدامها لتحديد قيم الخواص بشكل شرطي. إذا كان هذا النوع من جمل JavaScript غير مألوفا لديك فيمكنك دائما استخدام عبارة `if...else` الاعتيادية.


## تصيير القوائم {/*rendering-lists*/}

ستحتاج إلى الاعتماد على ميزات Javascript مثل [`for` loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) وكذلك [دالة `map()` الخاصة بالمصفوفات](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)  لإظهار القوائم على المكوّنات.

على سبيل المثال، لنفترض أن لديك مصفوفة لمجموعة من المنتجات كالتالي:


```js
const products = [
  { title: 'ملفوف', id: 1 },
  { title: 'خضروات', id: 2 },
  { title: 'تفاح', id: 3 },
];
```
قم باستخدام دالة `map()` بداخل المكوّن الخاص بك لتحويل مصفوفة المنتجات إلى مصفوفة من عناصر الـ `<li>`:


```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

لاحظ أن كل `<li>` لديه خاصية باسم `key`. كل عنصر في أي قائمة يجب أن يتم تمرير رقم أو سلسلة نصية إليه لتميّزه عن كل العناصر الأخرى الموجودة في نفس القائمة. هذه الخاصية عادة ما يتم تعبئتها من صلب البيانات الخاصة بمشروعك مثل الـ ID الخاص بقاعدة البيانات. هذا المفتاح (key) يتم استخدامه من React ولمعرفة ما الذي حدث تحديدا في حال قمت لاحقا بإضافة، حذف أو إعادة ترتيب لعناصر القائمة.


<Sandpack>

```js
const products = [
  { title: 'ملفوف', isFruit: false, id: 1 },
  { title: 'خضروات', isFruit: false, id: 2 },
  { title: 'تفاح', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## الاستجابة للأحداث {/*responding-to-events*/}

يمكنك الاستجابة للأحداث عن طريق تعريف (معالج الحدث) أو الـ *event handler* بداخل المكوّن الخاص بك:


```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('لقد ضغطت هنا!');
  }

  return (
    <button onClick={handleClick}>
      اضغط هنا
    </button>
  );
}
```

لاحظ أن `onClick={handleClick}` لا تحتوي على أقواس الاستدعاء في النهاية! لا تقم _باستدعاء_ معالج الحدث، يكفيك أن تقوم بتمرير اسمها فقط. حيث أن React ستقوم باستدعاء دالة معالجة الحدث عندما يقوم المستخدم بالضغط على الزر.


## تحديث الشاشة {/*updating-the-screen*/}

غالبا ستحتاج أن "يتذكر" المكوّن المعلومات ويعرضها على الشاشة. فمثلا، قد تحتاج إلى عرض عدد المرات التي تم فيها الضغط على زر ما. لتنفيذ ذلك قم بإضافة ما يعرف ب *حالة* أو الـ *state* الخاصة بالمكون:


في البداية، قم باستيراد [`useState`](/reference/react/useState) من React:


```js
import { useState } from 'react';
```
والآن يمكنك تعريف *متغير الحالة* أو الـ *state variable* بداخل المكوّن:


```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

ستحصل على شيئين من دالة `useState`: الحالة الحالية (`count`)، وكذلك الدالة التي تمكنك من تحديث القيمة (`setCount`). يمكنك تسميتهما ما تشاء، ولكن المتعارف عليه أن يتم تسميتها بالشكل التالي: `[something, setSomething]`.

في المرة الأولى التي يظهر فيها الزر ستكون قيمة `coount` تساوي `0` وذلك لأنك قمت بتمرير `0` كبارامتر لدالة `useState()`. عندما تريد تغيير الحالة، قم باستدعاء `setCount()` وتمرير القيمة الجديدة لها. وبالتالي فإن الضغط على هذا الزر سيزيد العداد `count`.


```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

الآن ستقوم React باستدعاء المكوّن الخاص بك مجددا. في هذه المرة قيمة `count` ستكون `1`، ومن ثم ستكون `2`، وهكذا.
إذا قمت تصيير المكوّن عدة مرات فإن كل مرة ستكون لها الحالة المستقلة الخاصة بها. قم بتجربة الضغط على كل زر على حدة:

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>العدادات التي تتغير مستقلة</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

لاحظ كيف أن كل زر قادر على "تذكر" حالة الـ `count` الخاصة به دون أي تعارض مع حالة الزر الآخر.


## استخدام الخطاطيف {/*using-hooks*/}


الدوال التي تبدأ بـ `use` تسمى *الخطاطيف* أو *Hooks*. تعتبر `useState` أحد الخطاطيف المجهّزة والتي توفرها React. وبإمكانك العثور على قائمة الخطاطيف المختلفة التي توفرها React في [API مرجع.](/reference/react) ، يمكنك كذلك كتابة الخطاطيف الخاصة بك عن طريق الجمع بين الخطاطيف الجاهزة والموفّرة من React.

الخطاطيف أكثر صرامة من الدوال الأخرى. يمكنك استدعاء الخطاف في مقدمة المكوّن (أو في مقدمة أي خطاف آخر). إذا أردت استخدام `useState` في عبارة شرطية أو في حملة تكرار فقم ببناء مكوّن مستقل ومن ثم استخدامها هناك.



## مشاركة البيانات بين المكوّنات {/*sharing-data-between-components*/}

في المثال السابق، كل `MyButton` كان لديه حالة الـ `count` المستقلة الخاصة به، وعندما يتم الضغط على أي منهما حينها يتم تعديل الـ `count` الخاصة بذلك الزر فقط:

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="رسم تخطيطي يوضح شجرة من ثلاثة مكونات ، أحد الوالدين يسمى MyApp وطفلان يسمى MyButton.  يحتوي كلا المكونين MyButton على عدد بقيمة صفر.">

مبدئيا، حالة `count` الخاصة بكل زر تساوي `0`


</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="نفس الرسم التخطيطي كالسابق ، مع تمييز أول مكون MyButton فرعي يشير إلى نقرة مع زيادة قيمة العد إلى واحد.  لا يزال مكون MyButton الثاني يحتوي على القيمة صفر." >

مكوّن `MyButton` الأول سيقوم بتحديث حالة الـ `count` الخاصة به إلى `1`


</Diagram>

</DiagramGroup>

و بالرغم من ذلك، فإنك غالبا ستحتاج أن *تشارك المكوّنات البيانات وأن يتم تحديثها معا*
و لجعل كلا المكونين `MyButton` يقومان بعرض نفس الـ `count` ويتم تحديثهما معا فسنحتاج إلى نقل الحالة من كل زر بشكل مستقل "إلى الأعلى" لأقرب مكوّن يحوي كلا المكوّنين.
في هذا المثال `MyApp` يمثل هذا هذا المكون الأب الذي يحوي كل المكونين:


<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="رسم تخطيطي يوضح شجرة من ثلاثة مكونات ، أحد الوالدين يسمى MyApp وطفلان يسمى MyButton.  يحتوي MyApp على قيمة عد صفرية يتم تمريرها إلى كل من مكوني MyButton ، والتي تعرض أيضًا القيمة صفر." >

في البداية حالة الـ `count` الخاصة بال `MyApp` تساوي `0`، ويتم تمريرها للأسفل لكلا الابنين.


</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="نفس الرسم التخطيطي كالسابق ، مع إبراز عدد مكون MyApp الأصلي للإشارة إلى نقرة مع زيادة القيمة إلى واحد.  يتم أيضًا تمييز التدفق إلى كل من مكونات MyButton الأطفال ، ويتم تعيين قيمة العد في كل طفل على واحد يشير إلى أن القيمة قد تم تمريرها لأسفل." >

عند الضغط على أي من الزرين سيقوم ال `MyApp` بتحديث حالة الـ `count` الخاصة به إلى `1` ومن ثم يمرر القيمة إلى الأسفل لكلا الإبنين

</Diagram>

</DiagramGroup>

و الآن عند الضغط على أي من الزرين، فإن الـ `count` في `MyApp` ستتغير، وبالتالي سيغير ذلك بدوره كلا العدادين المتواجدين في `MyButton`. يمكنك تمثيل ذلك بالكود كالتالي:

في البداية قم *بنقل الحالة للأعلى* من `MyButton` إلى `MyApp`:


```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>العدادات التي تتغير مستقلة</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... نقلت كودا من هنا ...
}

```
و من ثم قم *بتمرير الحالة للأسفل* من `MyApp` لكلا مكوّني الـ `MyButton` بالإضافة إلى دالة معالجة الضغط على الزر (click handler). بإمكانك إرسال معلومات إلى `MyButton` باستخدام أقواس الـ JSX المعقوفة، تماما كما فعلت سابقا في الأوسمة الجاهزة مثل وسم `<img>`:


```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>العدادات التي تتغير معا</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

هذه المعلومات التي تقوم بتمريرها للأسفل تسمى _props_ أو _خواص المكوّن_. والآن مكون `MyApp` يحتوي على حالة الـ `count` بالإضافة لمعالج الحدث باسم `handleClick`، ويقوم *بإرسالهما للأسفل* لكلا الزرين.


أخيرا غيًر كود `MyButton` *ليقرأ* خواص المكوّن التي قمت بتمريرها إليه من مكوّن الأب:


```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      ضغطت {count} مرات
    </button>
  );
}
```

عندما تقوم بالضغط على الزر سيتم تشغيل معالج الحدث الذي يحمل اسم `onClick`. خاصية معالجة الحدث المرسلة لكلا الزرين والتي تحمل اسم `onClick` في كليهما هي في حقيقة الأمر تمثل دالة الـ `handleClick` المعرّفة بداخل الـ `MyApp`، وبالتالي سيتم تنفيذ الكود المعرّف بداخلها. ذلك الكود سيقوم باستدعاء `setCount(count + 1)`، والذي بدوره سيزيد حالة الـ `count`. ومن ثم فإن القيمة الجديدة للـ `count` سيتم تمريرها لكلي الزرين وبالتالي فإن كليهما سيُظهران نفس القيمة. هذا ما يعرف بـ "نقل الحالة للأعلى". بنقلك للحالة للأعلى تكون قد جعلت الحالة مشتركة بين المكوّنات.


<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>العدادات التي تتغير معًا</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      ضغطت {count} مرات
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## الخطوات القادمة {/*next-steps*/}

والآن أنت تعرف أساسيات بناء كود React!
اطّلع على [هذا الدرس التطبيقي](/learn/tutorial-tic-tac-toe) لتفعيل هذه الأساسيات بشكل عملي وبناء مشروعك المصغّر الأوّل باستخدام React.

