---
title: التثبيت
---

<Intro>

تم تصميم React من البداية ليكون قابلاً للتبني التدريجي. يمكنك استخدام جزء قليل أو كثير من React، حسب الحاجة. سواء كنت ترغب في الحصول على تجربة من React، أو إضافة بعض التفاعلية إلى صفحة HTML، أو بدء تطبيق معقد يعتمد على React، فهذا القسم سيساعدك على البدء.

</Intro>

<YouWillLearn isChapter={true}>

* [كيفية بدء مشروع React جديد](/learn/start-a-new-react-project)
* [كيفية إضافة React إلى مشروع موجود](/learn/add-react-to-an-existing-project)
* [كيفية إعداد محرر النصوص الخاص بك](/learn/editor-setup)
* [كيفية تثبيت أدوات مطور React](/learn/react-developer-tools)

</YouWillLearn>

## جرب React {/*try-react*/}

لا يلزم تثبيت أي شيء لتجربة React. جرب تعديل هذا الـsandbox!

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```


</Sandpack>

يمكنك تعديله مباشرةً أو فتحه في علامة تبويب جديدة عن طريق الضغط على زر "Fork" (تفريع) في الزاوية العلوية اليمنى.

تحتوي معظم الصفحات في توثيق React على sandboxes مثل هذا. وفيما عدا توثيق React، هناك العديد من الـsandboxes المتاحة عبر الإنترنت التي تدعم React: على سبيل المثال، [CodeSandbox](https://codesandbox.io/s/new)، [StackBlitz](https://stackblitz.com/fork/react)، أو [CodePen.](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb)

### جرب React محلياً {/*try-react-locally*/}

جرب React محلياً على جهازك، [حمّل صفحة ال HTML هذه.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) افتحها في محرر النصوص الخاص بك وفي متصفحك!

## ابدأ مشروع React جديد {/*start-a-new-react-project*/}

إذا كنت ترغب في بناء تطبيق أو موقع ويب بالكامل باستخدام React، [ابدأ مشروع React جديد.](/learn/start-a-new-react-project)

## إضافة React إلى مشروع موجود {/*add-react-to-an-existing-project*/}

إذا كنت تريد تجربة استخدام React في تطبيق أو موقع ويب موجود، [إضافة React إلى مشروع موجود.](/learn/add-react-to-an-existing-project)

## الخطوات التالية {/*next-steps*/}

انتقل إلى دليل [البدء السريع](/learn) لجولة في أهم مفاهيم React التي ستواجهها يومياً.

