---
title: بداية سريعة
---

<Intro>

أهلا بك في مستندات react، هذه الصفحة ستعطيك مقدمة ل ٨٠٪ من مفاهيم React التي يتم استخدامها بشكل روتيني في مشاريع React.


Welcome to the React documentation! This page will give you an introduction to the 80% of React concepts that you will use on a daily basis.

</Intro>

<YouWillLearn>

- كيف تقوم بإنشاء و دمج المكوّنات.
- كيف تضيف تأثيرات على العناصر.
- كيف تقوم بعرض البيانات.
- كيف تستخدم الجمل الشرطية و تعرض عناصر القوائم.
- كيف تتجاوب مع الأحداث المختلفة و تحدث شاشة المستخدم بناءً عليها.
- كيف تشارك البيانات بين أكثر من مكوّن.

---

- How to create and nest components
- How to add markup and styles
- How to display data
- How to render conditions and lists
- How to respond to events and update the screen
- How to share data between components

</YouWillLearn>

## إنشاء و دمج المكوّنات {/*components*/}
يتم صناعة تطبيقات React اعتمادا على ما يعرف بـ (المكوّنات - Components).
المكون هو جزء من مستقل من واجهة المستخدم و التي لها المنطق البرمجي و الشكل الخاص بها. يمكنك تشكيل المكوّن بالحجم و الشكل المناسب فيتراوح من كونه صغيرا ليمثل (زر) أو كبيرا ليمثل صفحة كاملة.
المكوّنات ليست إلا دوال جافاسكريبت و التي توفر (ترميزا مرئيا) كقيمة مرجعة من الدالة.

## Creating and nesting components  {/*creating-and-nesting-components*/}

React apps are made out of *components*. A component is a piece of the UI (user interface) that has its own logic and appearance. A component can be as small as a button, or as large as an entire page.

React components are JavaScript functions that return markup:

```js
function MyButton() {
  return (
    <button>I'm a button</button>
  );
}
```
الآن قمت ببناء مكوّن باسم `MyButton`، يمكنك الآن إدخاله في مكون آخر:

Now that you've declared `MyButton`, you can nest it into another component:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

لاحظ كيف أن المكوّن `<MyButton />` يبدأ بحرف (كبير) في الإنجليزية (B)، و هي طريقة مستخدمة في React للتمييز و معرفة أن هذه الدالة تمثل مكوّن. أسماء المكوّنات في React يجب أن تبدأ دائما بحرف كبير، بينما يجب أن تكون علامات ال html المستخدمة بحرف صغير.


Notice that `<MyButton />` starts with a capital letter. That's how you know it's a React component. React component names must always start with a capital letter, while HTML tags must be lowercase.

خذ نظرة سريعة على النتيجة:
Have a look at the result:

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>


عبارة `export default` تحدد المكوّن الأساسي في الملف. إذا لم يكن لديك معرفة كافية عن طريقة بناء و كتابة الكود في جافاسكريبت، فيمكنك الرجوع للمصادر التالية:
[MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export)
[javascript.info](https://javascript.info/import-export) 


The `export default` keywords specify the main component in the file. If you're not familiar with some piece of JavaScript syntax, [MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) and [javascript.info](https://javascript.info/import-export) have great references.


## بناء ترميز الواجهة باستخدام JSX {/*writing-markup-with-jsx*/}



طريقة بناء جمل ترميز الواجهات الذي شاهدته في الأعلى هو ما يسمى بـ *jsx*. استخدام الـ JSX يعتبر اختياريا، لكن معظم مشاريع React تستخدم الـ JSX لسهولة التعامل معها. كل [tools we recommend for local development](/learn/installation) تدعم الـ JSX 

The markup syntax you've seen above is called *JSX*. It is optional, but most React projects use JSX for its convenience. All of the [الأدوات التي ننصح بها في بيئة التطوير المحلية](/learn/installation) support JSX out of the box.

تعتبر JSX أكثر صرامة من ال HTML. حيث يجب عليك إغلاق العلامات مثل `<br />`. و كذلك فإن المكوّن الذي تقوم بإنشائه لا يمكن أن يرجع لك مجموعة من علامات ال JSX، بل يجب عليك إحاطتهم بأب مشترك مثل: `<div>...</div>` أو حتى غطاء `<>...</>` الفارغ.


JSX is stricter than HTML. You have to close tags like `<br />`. Your component also can't return multiple JSX tags. You have to wrap them into a shared parent, like a `<div>...</div>` or an empty `<>...</>` wrapper:

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}
```

إذا كان لديك الكثير من الأكواد المكتوبة بال HTML و التي ترغب في تحويلها إلى الـ JSX، فيمكنك استخدام [تحويل الـ HTML لـ JSX أون لاين.](https://transform.tools/html-to-jsx)


If you have a lot of HTML to port to JSX, you can use an [online converter.](https://transform.tools/html-to-jsx)

## إضافة أنماط تصميمية {/*adding-styles*/}
 في React يمكنك تحديد تصنيف باستخدام `className`. حيث أنها تعمل تماما كما تعمل خاصية [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) في الـ HTML

In React, you specify a CSS class with `className`. It works the same way as the HTML [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) attribute:

```js
<img className="avatar" />
```

و بعد ذلك يمكنك كتابة قواعد الـ CSS لهذا التصنيف في ملف CSS منفصل:
Then you write the CSS rules for it in a separate CSS file:

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

React لا تحدد لك كيف يجب عليك إضافة ملفات الـ CSS. [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) لملف الـ HTML. إذا كنت تستخدم أداة بناء معينة أو إطار عمل فاستفستر عن طريقة إضافة ملفات الـ CSS لمشروعك من خلال المستندات الخاصة بالأداة. يمكنك بكل بساطة إضافة علامة 

React does not prescribe how you add CSS files. In the simplest case, you'll add a [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) tag to your HTML. If you use a build tool or a framework, consult its documentation to learn how to add a CSS file to your project.

## عرض البيانات {/*displaying-data*/}

تمكنك الـ JSX من إدخال ترميز الواجهة بداخل الجافاسكريبت. يمكنك من خلال الأقواس المعقوفة "الخروج" من ترميز الواجهة و العودة مرة أخرى إلى سياق الجافاسكريبت حتى تتمكن من تضمين متغير من أكوادك و عرضه للمستخدم، فمثلا الكود التالي سيظهر `user.name` للمستخدم على الشاشة:

JSX lets you put markup into JavaScript. Curly braces let you "escape back" into JavaScript so that you can embed some variable from your code and display it to the user. For example, this will display `user.name`:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

يمكنك كذلك "الخروج إلى سياق الجافاسكريبت" من داخل خواص الـ JSX، لكن يجب عليك حينها استخدام الأقواس المعقوفة *بدلا من* علامات التنصيص. فمثلا `className="avatar"` تقوم بتمرير `"avatar"` على أنه التصنيف المستخدم في الـ CSS، و لكن `src={user.imageUrl}` تقوم بقراءة قيمة متغير الجافاسكريبت التالي: `user.imageUrl` و من ثم تقوم بتمرير قيمته لتمثل خاصية الـ `src`:

You can also "escape into JavaScript" from JSX attributes, but you have to use curly braces *instead of* quotes. For example, `className="avatar"` passes the `"avatar"` string as the CSS class, but `src={user.imageUrl}` reads the JavaScript `user.imageUrl` variable value, and then passes that value as the `src` attribute:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

يمكنك كذلك وضع تعبيرات برمجية أكثر تعقيدا بداخل أقواس الـ JSX المعقوفة، مثلا [دمج النصوص](https://javascript.info/operators#string-concatenation-with-binary): 


You can put more complex expressions inside the JSX curly braces too, for example, [string concatenation](https://javascript.info/operators#string-concatenation-with-binary):

<Sandpack>

```js
const user = {
  name: 'Hedy Lamarr',
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

في المثال الموضح أعلاه `style={{}}` تمثل بناءً خاصا، يحوي بداخله كائن جافاسكريبت المعروف `{}` و المعرف بداخل الأقواس المعقوفة الخاصة بال JSX بداخل `style={ }`. يمكنك استخدام خاصية `style` عندما يكون التصميم لديك معتمدا على متغير جافاسكريبت.


In the above example, `style={{}}` is not a special syntax, but a regular `{}` object inside the `style={ }` JSX curly braces. You can use the `style` attribute when your styles depend on JavaScript variables.

## الإظهار الشرطي {/*conditional-rendering*/}


في React، لا يوجد طريقة خاصة لكتابة العبارات الشرطية، و إنما يتم استخدام نفس الطرق المستخدمة في كتابة أكواد الجافاسكريبت الاعتيادية، فعلى سبيل المثال يمكنك استخدام عبارة [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) لإظهار الـ JSX بشكل شرطي:

In React, there is no special syntax for writing conditions. Instead, you'll use the same techniques as you use when writing regular JavaScript code. For example, you can use an [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) statement to conditionally include JSX:

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
و إذا كنت تفضل استخدام كود أكثر اختصارا فيمكنك استخدام [معامل `?` الشرطي](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) و تتميز بإمكانية استخدامها في داخل ال JSX على النقيض من `if` العادية.


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


When you don't need the `else` branch, you can also use a shorter [logical `&&` syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation):

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

كل الطرق المذكورة في الأعلى يمكن كذلك استخدامها لتحديد قيم الخواص بشكل شرطي، إذا كان هذا النوع من جمل الجافاسكريبت غير مألوفا لديك فيمكنك دائما استخدام عبارة `if...else` الاعتيادية.

All of these approaches also work for conditionally specifying attributes. If you're unfamiliar with some of this JavaScript syntax, you can start by always using `if...else`.

## إظهار القوائم {/*rendering-lists*/}
## Rendering listss {/*rendering-listss*/}

ستحتاج إلى الاعتماد على ميزات الجافاسكريبت مثل [`for` loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) و كذلك [دالة `map()` الخاصة بالمصفوفات](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)  لإظهار القوائم على المكوّنات.

على سبيل المثال، لنفترض أن لديك مصفوفة لمجموعة من المنتجات كالتالي:

You will rely on JavaScript features like [`for` loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) and the [array `map()` function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) to render lists of components.

For example, let's say you have an array of products:

```js
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```
قم باستخدام دالة `map()` بداخل المكوّن الخاص بك لتحويل مصفوفة المنتجات إلى مصفوفة من عناصر الـ `<li>`:

Inside your component, use the `map()` function to transform an array of products into an array of `<li>` items:

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

لاحظ أن كل `<li>` لديه خاصية باسم `key`. كل عنصر في أي قائمة يجب أن يتم تمرير رقم أو سلسلة نصية إليه لتميزه عن كل العناصر الأخرى الموجودة في نفس القائمة. هذه الخاصية عادة ما يتم تعبئتها من صلب البيانات الخاصة بمشروعك مثل الـ ID الخاص بقاعدة البيانات. هذا المفتاح (key) يتم استخدامه من React لمعرفة ما الذي حدث تحديدا في حال قمت لاحقا بإضافة، حذف> أو إعادة ترتيب لعناصر القائمة.

Notice how `<li>` has a `key` attribute. For each item in a list, you should pass a string or a number that uniquely identifies that item among its siblings. Usually, a key should be coming from your data, such as a database ID. React uses your keys to know what happened if you later insert, delete, or reorder the items.

<Sandpack>

```js
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
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
## Responding to eventss {/*responding-to-eventss*/}

يمكنك الاستجابة للأحداث عن طريق تعريف ما يعرف بدوال (معالج الحدث) أو الـ *event handler* بداخل المكوّن الخاص بك:

You can respond to events by declaring *event handler* functions inside your components:

```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

لاحظ أن `onClick={handleClick}` لا تحتوي على أقواس الاستدعاء في النهاية! لا تقم باستدعاء معالج الحدث، يكفيك أن تقوم بتمرير اسمها فقط. حيث أن React ستقوم باستدعاء دالة معالة الحدث عندما يقوم المستخدم بالضغط على الزر.

Notice how `onClick={handleClick}` has no parentheses at the end! Do not _call_ the event handler function: you only need to *pass it down*. React will call your event handler when the user clicks the button.

## تحديث الشاشة {/*updating-the-screen*/}
## Updating the screenn {/*updating-the-screenn*/}

غالبا ستكون بحاجة أن يقوم المكوّن "بتذكر" المعلومات و عرضها على الشاشة. فمثلا، قد تحتاج إلى عرض عدد المرات التي تم فيها الضغط على زر. لتنفيذ ذلك قم بإضافة ما يعرف ب *حالة* أو الـ *state* الخاصة بالمكون:

Often, you'll want your component to "remember" some information and display it. For example, maybe you want to count the number of times a button is clicked. To do this, add *state* to your component.

في البداية، قم باستيراد [`useState`](/reference/react/useState) من React:

First, import [`useState`](/reference/react/useState) from React:

```js
import { useState } from 'react';
```
و الآن يمكنك تعريف *متغير الحالة* أو الـ *state variable* بداخل المكوّن:

Now you can declare a *state variable* inside your component:

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

ستحصل على شيئين من دالة `useState`: الحالة الحالية (`count`)، و كذلك الدالة التي تمكنك من تحديث القيمة (`setCount`). يمكنك تسميتهما ما تشاء، و لكن المتعارف عليه أن يتم تسميتها بالشكل التالي: `[something, setSomething]`.

في المرة الأولى التي يظهر فيها الزر ستكون قيمة `coount` تساوي `0` و ذلك لأنك قمت بتمرير `0` كبارامتر لدالة `useState()`. عندما تريد تغيير الحالة، قم باستدعاء `setCount()` و تمرير القيمة الجديدة لها. و بالتالي فإن الضغط على هذا الزر سيزيد العداد `count`.


You’ll get two things from `useState`: the current state (`count`), and the function that lets you update it (`setCount`). You can give them any names, but the convention is to write `[something, setSomething]`.

The first time the button is displayed, `count` will be `0` because you passed `0` to `useState()`. When you want to change state, call `setCount()` and pass the new value to it. Clicking this button will increment the counter:

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

الآن ستقوم React باستدعاء المكوّن الخاص بك مجددا. في هذه المرة قيمة `count` ستكون `1`، و من ثم ستكون `2`، و هكذا.
إذا قمت بإظهار المكوّن عدة مرات فإن كل مرة ستكون لها الحالة المستقلة الخاصة بها. قم بتجربة الضغط على كل زر على حدة:

React will call your component function again. This time, `count` will be `1`. Then it will be `2`. And so on.

If you render the same component multiple times, each will get its own state. Click each button separately:

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Counters that update separately</h1>
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

Notice how each button "remembers" its own `count` state and doesn't affect other buttons.

## استخدام الخطافات {/*using-hooks*/}
## Using Hookss {/*using-hookss*/}

الدوال التي تبدأ بـ `use` تسمى *الخطافات* أو *Hooks*. تعتبر `useState` أحد الخطافات المجهزة و التي توفرها React. و بإمكانك العثور على قائمة الخطافات المختلفة التي توفرها React في [API reference.](/reference/react) ، يمكنك كذلك كتابة الخطافات الخاصة بك عن طريق الجمع بين الخطافات الجاهزة و الموفرة من React.

الخطافات أكثر صرامة من الدوال الأخرى. يمكنك استدعاء الخطاف في مقدمة المكوّن (أو في مقدمة أي خطاف آخر). إذا أردت استخدام `useState` في عبارة شرطية أو في حملة تكرار فقم ببناء مكوّن مستقل و من ثم استخدامها هناك.

Functions starting with `use` are called *Hooks*. `useState` is a built-in Hook provided by React. You can find other built-in Hooks in the [API reference.](/reference/react) You can also write your own Hooks by combining the existing ones.

Hooks are more restrictive than other functions. You can only call Hooks *at the top* of your components (or other Hooks). If you want to use `useState` in a condition or a loop, extract a new component and put it there.


## مشاركة البيانات بين المكوّنات {/*sharing-data-between-components*/}

في المثال السابق، كل `MyButton` كان لديه حالة الـ `count` المستقلة الخاصة به، و عندما يتم الضغط على أي منهما حينها يتم تعديل الـ `count` الخاصة بذلك الزر فقط:
In the previous example, each `MyButton` had its own independent `count`, and when each button was clicked, only the `count` for the button clicked changed:

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. Both MyButton components contain a count with value zero.">

مبدئيا، حالة `count` الخاصة بكل زر تساوي `0`

Initially, each `MyButton`'s `count` state is `0`

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="The same diagram as the previous, with the count of the first child MyButton component highlighted indicating a click with the count value incremented to one. The second MyButton component still contains value zero." >

مكوّن `MyButton` الأول سيقوم بتحديث حالة الـ `count` الخاصة به إلى `1`

The first `MyButton` updates its `count` to `1`

</Diagram>

</DiagramGroup>

و بالرغم من ذلك، فإنك غالبا ستحتاج أن تقوم بالمكوّنات بـ *مشاركة البيانات و أن يتم تحديثها معا*
و لجعل كلا المكونين `MyButton` يقومان بعرض نفس الـ `count` و يتم تحديثهما معا فسنحتاج إلى نقل الحالة من كل زر بشكل مستقل "إلى الأعلى" لأقرب مكوّن يحوي كلا المكوّنين.
في هذا المثال `MyApp` يمثل هذا هذا المكون الأب الذي يحوي كل المكونين:

However, often you'll need components to *share data and always update together*.

To make both `MyButton` components display the same `count` and update together, you need to move the state from the individual buttons "upwards" to the closest component containing all of them.

In this example, it is `MyApp`:

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. MyApp contains a count value of zero which is passed down to both of the MyButton components, which also show value zero." >

في البداية حالة الـ `count` الخاصة بال `MyApp` تساوي `0`، و يتم تمريرها للأسفل لكلا الإبنين.

Initially, `MyApp`'s `count` state is `0` and is passed down to both children

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="The same diagram as the previous, with the count of the parent MyApp component highlighted indicating a click with the value incremented to one. The flow to both of the children MyButton components is also highlighted, and the count value in each child is set to one indicating the value was passed down." >

عند الضغط على أي من الزرين سيقوم ال `MyApp` بتحديث حالة الـ `count` الخاصة به إلى `1` و من ثم يمرر القيمة إلى الأسفل لكلا الإبنين
On click, `MyApp` updates its `count` state to `1` and passes it down to both children

</Diagram>

</DiagramGroup>

و الآن عند الضغط على أي من الزرين، فإن الـ `count` في `MyApp` ستتغير، و بالتالي سيغير ذلك بدوره كلا العدادين المتواجدين في `MyButton`. يمكنك تمثيل ذلك بالكود كالتالي:
Now when you click either button, the `count` in `MyApp` will change, which will change both of the counts in `MyButton`. Here's how you can express this in code.

في البداية قم *بنقل الحالة للأعلى* من `MyButton` إلى `MyApp`:

First, *move the state up* from `MyButton` into `MyApp`:

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... we're moving code from here ...
}

```
و من ثم قم *بتمرير الحالة للأسفل* من `MyApp` لكلا مكوْني الـ `MyButton` بالإضافة إلى دالة معالجة الضغط على الزر (click handler). بإمكانك إسال معلومات إلى `MyButton` باستخدام أقواس الـ JSX المعقوفة، تماما كما فعلت سابقا في الأوسمة الجاهزة مثل وسم `<img>`:

Then, *pass the state down* from `MyApp` to each `MyButton`, together with the shared click handler. You can pass information to `MyButton` using the JSX curly braces, just like you previously did with built-in tags like `<img>`:

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

هذه المعلومات التي تقوم بتمريرها للأسفل تسمى _props_ أو _خواص المكوّن_. و الآن مكون `MyApp` يحتوي على حالة الـ `count` بالإضافة لمعالج الحدث باسم `handleClick`، و يقوم *بإرسالهما للأسفل* لكلا الزرين.

The information you pass down like this is called _props_. Now the `MyApp` component contains the `count` state and the `handleClick` event handler, and *passes both of them down as props* to each of the buttons.

أخيرا قم بتغيير كود `MyButton` ليقوم بـ *قراءة* خواص المكوّن التي قمت بتمريرها إليه من مكوّن الأب:

Finally, change `MyButton` to *read* the props you have passed from its parent component:

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

عندما تقوم بالضغط على الزر سيتم تشغيل معالج الحدث الذي يحمل اسم `onClick`. خاصية معالجة الحدث المرسلة لكلا الزرين و التي تحمل اسم `onClick` في كليهما هي في حقيقة الأمر تمثل دالة الـ `handleClick` المعرفة بداخل الـ `MyApp`، و بالتالي سيتم تنفيذ الكود المعرف بداخلها. ذلك الكود سيقوم باستدعاء `setCount(count + 1)`، و الذي بدوره سيزيد حالة الـ `count`. و من فإن القيمة الجديد للـ `count` سيتم تمريرها لكل الزرين و بالتالي فإن كليهما سيظهران نفس القيمة. هذا ما يعرف بـ "نقل الحالة للأعلى". بنقلك للحالة للأعلى تكون قد جعلت الحالة مشتركة بين المكوّنات.


When you click the button, the `onClick` handler fires. Each button's `onClick` prop was set to the `handleClick` function inside `MyApp`, so the code inside of it runs. That code calls `setCount(count + 1)`, incrementing the `count` state variable. The new `count` value is passed as a prop to each button, so they all show the new value. This is called "lifting state up". By moving state up, you've shared it between components.

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
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
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

## الخطوات القادمة {/*next-steps*/}
## Next Stepss {/*next-stepss*/}

و الآن أنت تعرف أساسيات بناء كود React!
اطلع على [هذا الدرس](/learn/tutorial-tic-tac-toe) لتفعيل هذه الأساسيات بشكل عملي و بناء مشروعك المصغّر الأوّل باستخدام React.

By now, you know the basics of how to write React code!
Check out the [Tutorial](/learn/tutorial-tic-tac-toe) to put them into practice and build your first mini-app with React.
