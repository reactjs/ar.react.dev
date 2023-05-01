---
title: إضافة React إلى مشروع موجود بالفعل
---

<Intro>

إذا كنت تريد إضافة بعض التفاعلية إلى مشروعك الموجود بالفعل ، فليس عليك إعادة كتابته في React. أضف React إلى مجموعة الأدوات الموجودة لديك ، وقم بتقديم مكونات React التفاعلية في أي مكان.

</Intro>

<Note>

**تحتاج إلى تثبيت [Node.js](https://nodejs.org/ar) إلى بيئة التطوير المحلية الخاصة بك.** على الرغم من أنه يمكنك [تجربة React](/learn/installation#try-react) عبر الإنترنت أو باستخدام صفحة HTML بسيطة ، إلا أن معظم أدوات JavaScript التي تريد استخدامها للتطوير تتطلب Node.js.

</Note>

## استخدام React لمسار فرعي كامل من موقع الويب الحالي الخاص بك {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

لنفترض أن لديك تطبيق ويب موجود على `example.com` مبني بتقنية خادم أخرى (مثل Rails) ، وتريد تنفيذ جميع المسارات التي تبدأ بـ `example.com/some-app/` بالكامل مع React.

هنا ما نوصي به لإعداده:

1. **بناء الجزء الخاص بـ React في تطبيقك** باستخدام إحدى [الإطارات القائمة على React](/learn/start-a-new-react-project).
2. **حدد `/some-app` كـ *مسار أساسي*** في إعدادات إطار العمل الخاص بك (هنا كيف مع: [Next.js](https://nextjs.org/docs/api-reference/next.config.js/basepath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **قم بتكوين خادمك أو بروكسي** بحيث يتم التعامل مع جميع الطلبات تحت `/some-app/` من قبل تطبيق React الخاص بك.

يضمن هذا أن الجزء الخاص بـ React من تطبيقك يمكن أن يستفيد من [أفضل الممارسات](/learn/start-a-new-react-project#can-i-use-react-without-a-framework) المدمجة في تلك الإطارات.

العديد من الإطارات القائمة على React هي إطارات full-stack وتتيح لتطبيق React الخاص بك الاستفادة من الخادم. ومع ذلك ، يمكنك استخدام نفس النهج حتى إذا لم تتمكن أو لا تريد تشغيل JavaScript على الخادم. في هذه الحالة ، قم بتصدير HTML/CSS/JS ([`next export` output](https://nextjs.org/docs/advanced-features/static-html-export) لـ Next.js ، هذا هو الافتراضي لـ Gatsby) في `/some-app/` بدلاً من ذلك.

## استخدام React لجزء من صفحتك الحالية {/*using-react-for-a-part-of-your-existing-page*/}

لنفترض أن لديك صفحة موجودة على `example.com` مبنية بتقنية أخرى (إما خادم مثل Rails أو عميل مثل Backbone) ، وتريد تقديم مكونات React التفاعلية في أي مكان على تلك الصفحة. هذه هي الطريقة الشائعة لدمج React - في الواقع ، هذا هو شكل معظم استخدام React في [Meta](https://about.meta.com/) لسنوات عديدة!

يمكنك القيام بذلك في خطوتين:

1. **إعداد بيئة JavaScript** والتي تمكنك من استخدام [بنية JSX](/learn/writing-markup-with-jsx)، وتقسيم الكود إلى وحدات مع الكلمات المفتاحية [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) ، واستخدام الحزم (على سبيل المثال ، React) من [مدير الحزم npm](https://www.npmjs.com/).
2. **قم بتصيير مكونات React** حيث تريد رؤيتها على الصفحة.

نفس النهج يعتمد على إعداد صفحتك الحالية ، لذلك دعنا نتناول بعض التفاصيل.

### الخطوة 1: إعداد بيئة JavaScript معمارية (modular) {/*step-1-set-up-a-modular-javascript-environment*/}

بيئة JavaScript المعمارية تسمح لك بكتابة مكونات React في ملفات منفصلة، بدلاً من كتابة كل الكود في ملف واحد. كما تتيح لك استخدام جميع الحزم الرائعة التي نشرها مطورون آخرون على [مدير الحزم npm](https://www.npmjs.com/) - بما في ذلك React نفسه! كيفية القيام بذلك تعتمد على إعدادك الحالي:

* **إذا كان تطبيقك مقسم بالفعل إلى ملفات تستخدم عبارات `import`**، فحاول استخدام الإعداد الذي لديك بالفعل. تحقق مما إذا كان كتابة `<div />` في كود JS الخاص بك يسبب خطأ في البناء. إذا تسبب في خطأ في البناء، فقد تحتاج إلى [تحويل كود JavaScript الخاص بك باستخدام Babel](https://babeljs.io/setup)، وتمكين [Babel React preset](https://babeljs.io/docs/babel-preset-react) لاستخدام JSX.

* **إذا لم يكن لتطبيقك إعداد حالي لتجميع وحدات JavaScript**، فقم بإعداده مع [Vite](https://vitejs.dev/). تحتفظ مجتمع Vite بـ [العديد من التكاملات مع إطارات العمل الخلفية](https://github.com/vitejs/) ، بما في ذلك Rails و Django و Laravel. إذا لم يتم سرد إطار عمل الخلفية الخاص بك، [اتبع هذه الإرشادات](https://vitejs.dev/guide/backend-integration.html) لدمج بناء Vite يدويًا مع إطار عملك.

للتحقق مما إذا كان إعدادك يعمل، قم بتشغيل هذا الأمر في مجلد مشروعك:

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

Then add these lines of code at the top of your main JavaScript file (it might be called `index.js` or `main.js`):

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Your existing page content (in this example, it gets replaced) -->
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

If the entire content of your page was replaced by a "Hello, world!", everything worked! Keep reading.

<Note>

Integrating a modular JavaScript environment into an existing project for the first time can feel intimidating, but it's worth it! If you get stuck, try our [community resources](/community) or the [Vite Chat](https://chat.vitejs.dev/).

</Note>

### Step 2: Render React components anywhere on the page {/*step-2-render-react-components-anywhere-on-the-page*/}

In the previous step, you put this code at the top of your main file:

```js
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

Of course, you don't actually want to clear the existing HTML content!

Delete this code.

Instead, you probably want to render your React components in specific places in your HTML. Open your HTML page (or the server templates that generate it) and add a unique [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) attribute to any tag, for example:

```html
<!-- ... somewhere in your html ... -->
<nav id="navigation"></nav>
<!-- ... more html ... -->
```

This lets you find that HTML element with [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) and pass it to [`createRoot`](/reference/react-dom/client/createRoot) so that you can render your own React component inside:

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>This paragraph is a part of HTML.</p>
    <nav id="navigation"></nav>
    <p>This paragraph is also a part of HTML.</p>
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Actually implement a navigation bar
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

Notice how the original HTML content from `index.html` is preserved, but your own `NavigationBar` React component now appears inside the `<nav id="navigation">` from your HTML. Read the [`createRoot` usage documentation](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) to learn more about rendering React components inside an existing HTML page.

When you adopt React in an existing project, it's common to start with small interactive components (like buttons), and then gradually keep "moving upwards" until eventually your entire page is built with React. If you ever reach that point, we recommend migrating to [a React framework](/learn/start-a-new-react-project) right after to get the most out of React.

## Using React Native in an existing native mobile app {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) can also be integrated into existing native apps incrementally. If you have an existing native app for Android (Java or Kotlin) or iOS (Objective-C or Swift), [follow this guide](https://reactnative.dev/docs/integration-with-existing-apps) to add a React Native screen to it.
