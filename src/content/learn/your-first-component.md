---
title: Your First Component
العنوان : أول مكون لك
---

<مقدمة >

*المكونات* هي أحد المفاهيم الأساسية لرياكت.
 إنها الأساس الذي تبني عليه واجهات المستخدم (UI) ،
  مما يجعلها المكان المثالي لبدء رحلة رياكت الخاصة بك!

</مقدمة>

<سوف تتعلم>

* ماهي المكونات
* ماهو الدور الذي تلعبه المكونات في تطبيق رياكت 
* كيف تكتب اول مكون لك في رياكت

</سوف تتعلم>

## المكونات: UI building blocks {/*components-ui-building-blocks*/}

على الويب ، تتيح لنا 
HTML
 إنشاء مستندات منظمة غنية بمجموعة علاماتها المضمنة
  مثل `<h1>` و `<li> ':

```html
<article>
  <h1>My First Component</h1>
  <ol>
    <li>Components: UI Building Blocks</li>
    <li>Defining a Component</li>
    <li>Using a Component</li>
  </ol>
</article>
```

هذه العلامة تعرض هذه المقالة `<article>` ، انها تحتوي على `<h1>` ، وايضاً (تختصر) جدول من المحتويات كـلستة مرتبة <ol>`. العلامات كهذه ، يتم ربطها مع الـCSS لإضافة التنسيق عليها،
و JavaScript لإضافة التفاعل ، تقع خلف كل شريط جانبي ، بعد ، مشروط ، قائمة منسدلة — كل جزء من واجهة المستخدم تراه على الويب.

رياكت يسمح لك بدمج الترميز الخاص بك، CSS و JavaScript في "مكونات" مخصصة ، ** عناصر واجهة مستخدم قابلة لإعادة الاستخدام لتطبيقك. ** جدول المكونات الذي رأيته سابقًا يمكن اعادته الى `<TableOfContents />` مكون يمكنك اعادة استخدامه في كل صفحة. تحت الغطاء ، لا يزال يستخدم نفس علامات HTML مثل `<article>` ، `<h1>` ، إلخ.



تمامًا كما هو الحال مع علامات HTML 
، يمكنك إنشاء المكونات وترتيبها وتداخلها لتصميم صفحات كاملة.
 على سبيل المثال ، صفحة التوثيق التي تقرأها مصنوعة من مكونات رياكت .

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Docs</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```


مع نمو مشروعك ، ستلاحظ أنه يمكن تكوين العديد من تصميماتك عن طريق إعادة استخدام المكونات التي كتبتها بالفعل ، مما يؤدي إلى تسريع عملية التطوير. يمكن إضافة جدول المحتويات أعلاه إلى أي شاشة باستخدام <TableOfContents />` ! يمكنك أيضًا بدء مشروعك من خلال آلاف المكونات التي يشاركها مجتمع رياكت مفتوح المصدر مثل 
[Chakra UI](https://chakra-ui.com/) and [Material UI.](https://material-ui.com/)

## Defining a component {/*defining-a-component*/}

Traditionally when creating web pages, web developers marked up their content and then added interaction by sprinkling on some JavaScript. This worked great when interaction was a nice-to-have on the web. Now it is expected for many sites and all apps. React puts interactivity first while still using the same technology: **a React component is a JavaScript function that you can _sprinkle with markup_.** Here's what that looks like (you can edit the example below):

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

And here's how to build a component:

### Step 1: Export the component {/*step-1-export-the-component*/}

The `export default` prefix is a [standard JavaScript syntax](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) (not specific to React). It lets you mark the main function in a file so that you can later import it from other files. (More on importing in [Importing and Exporting Components](/learn/importing-and-exporting-components)!)

### Step 2: Define the function {/*step-2-define-the-function*/}

With `function Profile() { }` you define a JavaScript function with the name `Profile`.

<Pitfall>

React components are regular JavaScript functions, but **their names must start with a capital letter** or they won't work!

</Pitfall>

### Step 3: Add markup {/*step-3-add-markup*/}

The component returns an `<img />` tag with `src` and `alt` attributes. `<img />` is written like HTML, but it is actually JavaScript under the hood! This syntax is called [JSX](/learn/writing-markup-with-jsx), and it lets you embed markup inside JavaScript.

Return statements can be written all on one line, as in this component:

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
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
