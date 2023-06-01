---
title: مكوّنك الأول
---

<Intro>

*المكونات* هي إحدى المفاهيم الرئيسية في React. هي الأساس الذي تبني عليها واجهات المستخدم. مما يجعلها المكان الصحيح لبدأ رحلتك مع React.

</Intro>

<YouWillLearn>

* ما هو المكوّن
* ما الدور الذي تلعبه المكوّنات في تطبيق React
* كيف تكتب أول مكوّن React

</YouWillLearn>

## المكونات: حجر بناء واجهة المستخدم {/*components-ui-building-blocks*/}

في الويب، تمكننا HTML من إنشاء وثائق مهيكلة غنية باستخدام مجموعة الوسوم المدمجة مثل `<h1>` و `<li>`:

```html
<article>
  <h1>مكوّني الأول</h1>
  <ol>
    <li>المكوّنات: حجر بناء واجهة المستخدم</li>
    <li>تعريف مكوّن</li>
    <li>إستخدام مكوّن</li>
  </ol>
</article>
```

يمثل هذا الترميز المرئي هذه المقالة `<article>`, عنوانها `<h1>`, وفهرس محتويات مختصر في شكل قائمة مرتبة `<ol>`. ترميز مرئي كهذا, مدمج مع CSS من أجل الأنماط التصميمية, و JavaScript من أجل التفاعلية, يكمن وراء كل شريط جانبي, صورة رمزية, نافذة, قائمة منسدلة - كل قطعة من واجهة مستخدم تراها في الويب.

تمكنك React من دمج الترميز المرئي, وCSS, وJavaScript في "مكونات" مخصصة, **عناصر واجهة المستخدم قابلة لإعادة الاستخدام لتطبيقك**. يمكن تحويل كود فهرس المحتوى الذي رأيته أعلاه الى مكوّن `<TableOfContents />` الذي يمكن تصييره في كل صفحة. لا يزال يستخدم هذا المكوّن تحت الخطاء وسوم مثل `<article>`, `<h1>`, إلخ.

تمامًا مثل الوسوم HTML، يمكنك تجميع وترتيب وتضمين المكوّنات لتصميم صفحات كاملة. على سبيل المثال، صفحة المستندات التي تقرأها مصنوعة من مكوّنات React.

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

مع نمو مشروعك, ستلاحظ انه يمكن تجميع العديد من تصاميمك بواسطة إعادة استخدام مكوّنات كتبتها مسبقا, مما يسرع عملية  التطوير. يمكن إضافة فهرس المحتويات أعلاه الى أي شاشة عن طريق `<TableOfContents />`! يمكنك أيضا الإنطلاق بسرعة في مشروعك باستخدام آلاف المكوّنات المشتركة من قبل مجتمع React مفتوحة المصدر مثل [Chakra UI](https://chakra-ui.com/) و [Material UI.](https://material-ui.com/).

## تعريف مكوّن {/*defining-a-component*/}

تقليديًا، عند إنشاء صفحات الويب، يقوم مطورو الويب بترميز المحتوى الخاص بهم ومن ثم يضيفون التفاعل عن طريق إضافة بعض JavaScript. نجح هذا بشكل رائع عندما كان التفاعل مجرد ميزة اضافية جيدة على الويب. الآن يُتوقع وجود التفاعل في العديد من المواقع وجميع التطبيقات. تضع React التفاعلية في المقام الأول مع الاستمرار في استخدام نفس التقنية: **مكوّن React هو دالة JavaScript يمكنك أن تُضف إليها ترميز مرئي.** هنا مثال لذلك (يمكنك تحرير المثال أدناه):

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

وهنا كيفية بناء مكوّن::

### خطوة 1: تصدير المكوّن {/*step-1-export-the-component*/}

البادئة `export default` هي جزء من [صيغة JavaScript القياسية](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) (ليست محددة لـ React). تتيح لك وضع علامة على الدالة الرئيسية في ملف بحيث يمكنك استيرادها لاحقًا من ملفات أخرى. (للمزيد عن الاستيراد، راجع موضوع [استيراد وتصدير المكوّنات](/learn/importing-and-exporting-components)!)

### خطوة 2: تعريف الدالة {/*step-2-define-the-function*/}

باستخدام الدالة `Profile() { }` ، تقوم بتعريف دالة JavaScript بإسم "Profile".

<Pitfall>

مكوّنات React هي عبارة عن دوال JavaScript عادية، ولكن يجب أن يبدأ اسماءها بحرف كبير، وإلا فلن تعمل بشكل صحيح!

</Pitfall>

### الخطوة 3: اضف الترميز المرئي {/*step-3-add-markup*/}

يقوم المكوّن بإرجاع عنصر `<img />` مع خواص `src` و `alt`. يتم كتابة `<img />` بنفس طريقة كتابة HTML، ولكنه في الواقع JavaScript تحت الغطاء! يُطلق على هذه الصيغة [JSX](/learn/writing-markup-with-jsx)، وتتيح لك تضمين ترميز مرئي داخل JavaScript.

يمكن كتابة عبارات الإرجاع في سطر واحد، كما في هذا المكوّن:

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="كاثرين جونسون" />;
```

But if your markup isn't all on the same line as the `return` keyword, you must wrap it in a pair of parentheses:

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Pitfall>

Without parentheses, any code on the lines after `return` [will be ignored](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

</Pitfall>

## Using a component {/*using-a-component*/}

Now that you've defined your `Profile` component, you can nest it inside other components. For example, you can export a `Gallery` component that uses multiple `Profile` components:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
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

### What the browser sees {/*what-the-browser-sees*/}

Notice the difference in casing:

* `<section>` is lowercase, so React knows we refer to an HTML tag.
* `<Profile />` starts with a capital `P`, so React knows that we want to use our component called `Profile`.

And `Profile` contains even more HTML: `<img />`. In the end, this is what the browser sees:

```html
<section>
  <h1>Amazing scientists</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### Nesting and organizing components {/*nesting-and-organizing-components*/}

Components are regular JavaScript functions, so you can keep multiple components in the same file. This is convenient when components are relatively small or tightly related to each other. If this file gets crowded, you can always move `Profile` to a separate file. You will learn how to do this shortly on the [page about imports.](/learn/importing-and-exporting-components)

Because the `Profile` components are rendered inside `Gallery`—even several times!—we can say that `Gallery` is a **parent component,** rendering each `Profile` as a "child". This is part of the magic of React: you can define a component once, and then use it in as many places and as many times as you like.

<Pitfall>

Components can render other components, but **you must never nest their definitions:**

```js {2-5}
export default function Gallery() {
  // 🔴 Never define a component inside another component!
  function Profile() {
    // ...
  }
  // ...
}
```

The snippet above is [very slow and causes bugs.](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state) Instead, define every component at the top level:

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ Declare components at the top level
function Profile() {
  // ...
}
```

When a child component needs some data from a parent, [pass it by props](/learn/passing-props-to-a-component) instead of nesting definitions.

</Pitfall>

<DeepDive>

#### Components all the way down {/*components-all-the-way-down*/}

Your React application begins at a "root" component. Usually, it is created automatically when you start a new project. For example, if you use [CodeSandbox](https://codesandbox.io/) or [Create React App](https://create-react-app.dev/), the root component is defined in `src/App.js`. If you use the framework [Next.js](https://nextjs.org/), the root component is defined in `pages/index.js`. In these examples, you've been exporting root components.

Most React apps use components all the way down. This means that you won't only use components for reusable pieces like buttons, but also for larger pieces like sidebars, lists, and ultimately, complete pages! Components are a handy way to organize UI code and markup, even if some of them are only used once.

[React-based frameworks](/learn/start-a-new-react-project) take this a step further. Instead of using an empty HTML file and letting React "take over" managing the page with JavaScript, they *also* generate the HTML automatically from your React components. This allows your app to show some content before the JavaScript code loads.

Still, many websites only use React to [add interactivity to existing HTML pages.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) They have many root components instead of a single one for the entire page. You can use as much—or as little—React as you need.

</DeepDive>

<Recap>

You've just gotten your first taste of React! Let's recap some key points.

* React lets you create components, **reusable UI elements for your app.**
* In a React app, every piece of UI is a component.
* React components are regular JavaScript functions except:

  1. Their names always begin with a capital letter.
  2. They return JSX markup.

</Recap>

<Challenges>

#### Export the component {/*export-the-component*/}

This sandbox doesn't work because the root component is not exported:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Try to fix it yourself before looking at the solution!

<Solution>

Add `export default` before the function definition like so:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

You might be wondering why writing `export` alone is not enough to fix this example. You can learn the difference between `export` and `export default` in [Importing and Exporting Components.](/learn/importing-and-exporting-components)

</Solution>

#### Fix the return statement {/*fix-the-return-statement*/}

Something isn't right about this `return` statement. Can you fix it?

<Hint>

You may get an "Unexpected token" error while trying to fix this. In that case, check that the semicolon appears *after* the closing parenthesis. Leaving a semicolon inside `return ( )` will cause an error.

</Hint>

<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

You can fix this component by moving the return statement to one line like so:

<Sandpack>

```js
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

Or by wrapping the returned JSX markup in parentheses that open right after `return`:

<Sandpack>

```js
export default function Profile() {
  return (
    <img 
      src="https://i.imgur.com/jA8hHMpm.jpg" 
      alt="Katsuko Saruhashi" 
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

#### Spot the mistake {/*spot-the-mistake*/}

Something's wrong with how the `Profile` component is declared and used. Can you spot the mistake? (Try to remember how React distinguishes components from the regular HTML tags!)

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
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

React component names must start with a capital letter.

Change `function profile()` to `function Profile()`, and then change every `<profile />` to `<Profile />`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
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

#### Your own component {/*your-own-component*/}

Write a component from scratch. You can give it any valid name and return any markup. If you're out of ideas, you can write a `Congratulations` component that shows `<h1>Good job!</h1>`. Don't forget to export it!

<Sandpack>

```js
// Write your component below!

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>Good job!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
