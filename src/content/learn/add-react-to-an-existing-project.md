---
title: إضافة React إلى مشروع موجود بالفعل
---

<Intro>

إذا كنت تريد إضافة بعض التفاعلية إلى مشروعك الموجود بالفعل، فليس عليك إعادة كتابته في React. أضف React إلى مجموعة الأدوات الموجودة لديك، وقم بتقديم مكونات React التفاعلية في أي مكان.

</Intro>

<Note>

**تحتاج إلى تثبيت [Node.js](https://nodejs.org/ar) إلى بيئة التطوير المحلية الخاصة بك.** على الرغم من أنه يمكنك [تجربة React](/learn/installation#try-react) عبر الإنترنت أو باستخدام صفحة HTML بسيطة، إلا أن معظم أدوات JavaScript التي تريد استخدامها للتطوير تتطلب Node.js.

</Note>

## استخدام React لمسار فرعي كامل من موقع الويب الحالي الخاص بك {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

لنفترض أن لديك تطبيق ويب موجود على `example.com` مبني بتقنية خادم أخرى (مثل Rails)، وتريد تنفيذ جميع المسارات التي تبدأ بـ `example.com/some-app/` بالكامل مع React.

هنا ما نوصي به لإعداده:

1. **بناء الجزء الخاص بـ React في تطبيقك** باستخدام إحدى [الإطارات المبنية على React](/learn/start-a-new-react-project).
2. **حدد `/some-app` كـ *مسار أساسي*** في إعدادات إطار العمل الخاص بك (هنا كيف مع: [Next.js](https://nextjs.org/docs/api-reference/next.config.js/basepath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **قم بتكوين خادمك أو بروكسي** بحيث يتم التعامل مع جميع الطلبات تحت `/some-app/` من قبل تطبيق React الخاص بك.

يضمن هذا أن الجزء الخاص بـ React من تطبيقك يمكن أن يستفيد من [أفضل الممارسات](/learn/start-a-new-react-project#can-i-use-react-without-a-framework) المدمجة في تلك الإطارات.

العديد من الإطارات القائمة على React هي إطارات full-stack وتتيح لتطبيق React الخاص بك الاستفادة من الخادم. ومع ذلك، يمكنك استخدام نفس النهج حتى إذا لم تتمكن أو لا تريد تشغيل JavaScript على الخادم. في هذه الحالة 
، قم بتصدير HTML/CSS/JS ([`next export`](https://nextjs.org/docs/advanced-features/static-html-export) لـ Next.js ، هذا هو الافتراضي لـ Gatsby) في `/some-app/` بدلاً من ذلك.

## استخدام React لجزء من صفحتك الحالية {/*using-react-for-a-part-of-your-existing-page*/}

لنفترض أن لديك صفحة موجودة على `example.com` مبنية بتقنية أخرى (إما خادم مثل Rails أو عميل مثل Backbone)، وتريد تقديم مكونات React التفاعلية في أي مكان على تلك الصفحة. هذه هي الطريقة الشائعة لدمج React - في الواقع، هذا هو شكل معظم استخدام React في [Meta](https://about.meta.com/) لسنوات عديدة!

يمكنك القيام بذلك في خطوتين:

1. **إعداد بيئة JavaScript** والتي تمكنك من استخدام [بنية JSX](/learn/writing-markup-with-jsx)، وتقسيم الكود إلى وحدات باستخدام العبارات الأساسية [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)، واستخدام الحزم (على سبيل المثال ، React) من [مدير الحزم npm](https://www.npmjs.com/).
2. **قم بتصيير مكونات React** حيث تريد رؤيتها على الصفحة.

نفس النهج يعتمد على إعداد صفحتك الحالية، لذلك دعنا نتناول بعض التفاصيل.

### الخطوة 1: إعداد بيئة JavaScript معمارية (modular) {/*step-1-set-up-a-modular-javascript-environment*/}

بيئة JavaScript المعمارية تسمح لك بكتابة مكونات React في ملفات منفصلة، بدلاً من كتابة كل الكود في ملف واحد. كما تتيح لك استخدام جميع الحزم الرائعة التي نشرها مطورون آخرون على [مدير الحزم npm](https://www.npmjs.com/) - بما في ذلك React نفسه! كيفية القيام بذلك تعتمد على إعدادك الحالي:

* **إذا كان تطبيقك مقسم بالفعل إلى ملفات تستخدم عبارات `import`**، فحاول استخدام الإعداد الذي لديك بالفعل. تحقق مما إذا كان كتابة `<div />` في كود JS الخاص بك يسبب خطأ في البناء. إذا تسبب في خطأ في البناء، فقد تحتاج إلى [تحويل كود JavaScript الخاص بك باستخدام Babel](https://babeljs.io/setup)، وتمكين [Babel React preset](https://babeljs.io/docs/babel-preset-react) لاستخدام JSX.

* **إذا لم يكن لتطبيقك إعداد حالي لتجميع وحدات JavaScript**، فقم بإعداده مع [Vite](https://vitejs.dev/). تحتفظ مجتمع Vite بـ [العديد من التكاملات مع إطارات العمل الخلفية](https://github.com/vitejs/) ، بما في ذلك Rails و Django و Laravel. إذا لم يتم سرد إطار عمل الخلفية الخاص بك، [اتبع هذه الإرشادات](https://vitejs.dev/guide/backend-integration.html) لدمج بناء Vite يدويًا مع إطار عملك.

للتحقق مما إذا كان إعدادك يعمل، قم بتشغيل هذا الأمر في مجلد مشروعك:

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

ثم أضف هذه الأسطر من الكود في أعلى ملف JavaScript الرئيسي الخاص بك (قد يسمى `index.js` أو `main.js`):

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
  <head><title>تطبيقي</title></head>
  <body>
    <!-- محتوى صفحتك الحالي (في هذا المثال سيتم تبديله) -->
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

// إزالة محتوى HTML الحالي
document.body.innerHTML = '<div id="app"></div>';

// عرض مكون React بدلاً من ذلك
const root = createRoot(document.getElementById('app'));
root.render(<h1>مرحبًا بكم!</h1>);
```

</Sandpack>

إذا تم استبدال محتوى صفحتك بالكامل بـ "مرحبًا بكم!"، فقد نجحت العملية! استمر في القراءة.

<Note>

دمج بيئة JavaScript معمارية في مشروع موجود قد يبدو مرعبًا أول الأمر، ولكنه يستحق ذلك! إذا تعثرت ، جرب [السؤال في المجتمع](/community) أو [الدردشة في Vite](https://chat.vitejs.dev/).

</Note>

### الخطوة 2: عرض مكونات React في أي مكان على الصفحة {/*step-2-render-react-components-anywhere-on-the-page*/}

في الخطوة السابقة، وضعت هذا الكود في أعلى ملفك الرئيسي:


```js
import { createRoot } from 'react-dom/client';

// إزالة محتوى HTML الحالي
document.body.innerHTML = '<div id="app"></div>';

// عرض مكون React بدلاً من ذلك
const root = createRoot(document.getElementById('app'));
root.render(<h1>مرحبًا بكم!</h1>);
```

بالتأكيد لا تريد حذف محتوى HTML الحالي!

احذف هذا الكود.

بدلًا عن ذلك، ربما تريد عرض مكونات React الخاصة بك في أماكن محددة في HTML الخاص بك. افتح صفحة HTML الخاصة بك (أو قوالب الخادم التي تنشئها) وأضف معرفًا فريدًا [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) إلى أي علامة، على سبيل المثال:

```html
<!-- ... في مكان ما في ملف html ... -->
<nav id="navigation"></nav>
<!-- ... المزيد من html ... -->
```

هذا يتيح لك العثور على عنصر HTML باستخدام [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) وتمريره إلى [`createRoot`](/reference/react-dom/client/createRoot) حتى تتمكن من عرض مكون React الخاص بك داخله:

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>تطبيقي</title></head>
  <body>
    <p>فقرة من أجزاء HTML</p>
    <nav id="navigation"></nav>
    <p>وهذه الفقرة أيضًا من أجزاء HTML</p>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // مَهمّة: هذا المكون يعرض مكون شريط التنقل
  return <h1>مرحبًا من React</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

لاحظ كيف احتفظت بمحتوى HTML الحالي من `index.html`، ولكن مكون React الخاص بك `NavigationBar` الآن يظهر داخل `<nav id="navigation">` من HTML الخاص بك. اقرأ [وثائق استخدام `createRoot`](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) لمعرفة المزيد حول تصيير مكونات React داخل صفحة HTML موجودة.

عندما تضيف React في مشروع موجود، من الشائع أن تبدأ بمكونات تفاعلية صغيرة (مثل الأزرار)، ثم تستمر تدريجيًا في "النمو" حتى تصبح صفحتك بأكملها مبنية بـ React. إذا وصلت إلى هذه النقطة، فإننا نوصي بالانتقال إلى [إطار عمل لـ React](/learn/start-a-new-react-project) مباشرة بعد ذلك للاستفادة القصوى من React.

## استخدام React Native في تطبيق محمول أصلي موجود {/*using-react-native-in-an-existing-native-mobile-app*/}

يمكن أيضًا دمج [React Native](https://reactnative.dev/) في التطبيقات الأصلية الموجودة تدريجيًا. إذا كان لديك تطبيق أصلي موجود لنظام أندرويد (Java أو Kotlin) أو iOS (Objective-C أو Swift) ، [اتبع هذا الدليل](https://reactnative.dev/docs/integration-with-existing-apps) لإضافة شاشة React Native إليه.
