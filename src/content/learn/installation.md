---
title: التثبيت
---

<Intro>

تم تصميم React من البداية ليكون قابلاً للتبني التدريجي. يمكنك استخدام جزء قليل أو كثير من React، حسب الحاجة. سواء كنت ترغب في الحصول على تجربة من React، أو إضافة بعض التفاعلية إلى صفحة HTML، أو بدء تطبيق معقد يعتمد على React، فهذا القسم سيساعدك على البدء.

</Intro>

<<<<<<< HEAD
## جرب React {/*try-react*/}

لا يلزم تثبيت أي شيء لتجربة React. جرب تعديل هذا الـsandbox!
=======
## Try React {/*try-react*/}

You don't need to install anything to play with React. Try editing this sandbox!
>>>>>>> 2534424ec6c433cc2c811d5a0bd5a65b75efa5f0

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

تحتوي معظم الصفحات في توثيق React على sandboxes مثل هذا. وفيما عدا توثيق React، هناك العديد من الـsandboxes المتاحة عبر الإنترنت التي تدعم React: على سبيل المثال، [CodeSandbox](https://codesandbox.io/s/new)، [StackBlitz](https://stackblitz.com/fork/react)، أو [CodePen.](https://codepen.io/pen?template=QWYVwWN)

<<<<<<< HEAD
### جرب React محلياً {/*try-react-locally*/}

لتجربة React محلياً على جهازك، [حمّل صفحة ال HTML هذه.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) افتحها في محرر النصوص الخاص بك وفي متصفحك!

## أنشئ تطبيق React {/*creating-a-react-app*/}

إذا أردت بدء مشروع بReact يمكنك [إنشاء تطبيق](/learn/creating-a-react-app) بأحد إطارات العمل التي نرشحها
=======
To try React locally on your computer, [download this HTML page.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Open it in your editor and in your browser!

## Creating a React App {/*creating-a-react-app*/}

If you want to start a new React app, you can [create a React app](/learn/creating-a-react-app) using a recommended framework.

## Build a React App from Scratch {/*build-a-react-app-from-scratch*/}

If a framework is not a good fit for your project, you prefer to build your own framework, or you just want to learn the basics of a React app you can [build a React app from scratch](/learn/build-a-react-app-from-scratch).
>>>>>>> 2534424ec6c433cc2c811d5a0bd5a65b75efa5f0

## ابدأ مشروع React من الصفر {/*build-a-react-app-from-scratch*/}

<<<<<<< HEAD
إذا لم تكن إطارات العمل مناسبة لمشروعك أو تُفضل البدء من الصفر، يمكنك [بدء مشروع React من الصفر](/learn/build-a-react-app-from-scratch).
=======
If want to try using React in your existing app or a website, you can [add React to an existing project.](/learn/add-react-to-an-existing-project)


<Note>

#### Should I use Create React App? {/*should-i-use-create-react-app*/}

No. Create React App has been deprecated. For more information, see [Sunsetting Create React App](/blog/2025/02/14/sunsetting-create-react-app).

</Note>
>>>>>>> 2534424ec6c433cc2c811d5a0bd5a65b75efa5f0

## إضافة React إلى مشروع موجود {/*add-react-to-an-existing-project*/}

إذا كنت تريد تجربة استخدام React في تطبيق أو موقع ويب موجود، [إضافة React إلى مشروع موجود.](/learn/add-react-to-an-existing-project)

<Note>

#### هل يمكنني استخدام Create React App? {/*should-i-use-create-react-app*/}

لا. لقد أوقفنا دعم Create React App. لمزيد من المعلومات اقرأ [إيقاف دعم Create React App](/blog/2025/02/14/sunsetting-create-react-app).

</Note>

لمزيد من المعلومات اقرأ [إيقاف دعم Create React App](/blog/2025/02/14/sunsetting-create-react-app).


## الخطوات التالية {/*next-steps*/}

انتقل إلى دليل [البدء السريع](/learn) لجولة في أهم مفاهيم React التي ستواجهها يومياً.
