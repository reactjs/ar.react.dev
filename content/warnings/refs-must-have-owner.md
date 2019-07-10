---
title: Refs Must Have Owner Warning
layout: single
permalink: warnings/refs-must-have-owner.html
---

 أنت على الأرجح هُنا بسبب رسائل الخطأ التالية:

*React 16.0.0 و أعلى*
> تحذير:
>
> Element ref was specified as a string (myRefName) but no owner was set. You may have multiple copies of React loaded. (details: https://fb.me/react-refs-must-have-owner).
>
> حُدِد مرجع العُنصر كسلسة نصّية "string" ولكن لم يتم تحديد المالِك "owner". من المُحتمل أن يكون لديك أكثر من نُسخة React مُحمّلة (تفاصيل: https://fb.me/react-refs-must-have-owner).

*النُسخ الأقدم من React*
> تحذير:
>
> addComponentAsRefTo(...): Only a ReactOwner can have refs. You might be adding a ref to a component that was not created inside a component's `render` method, or you have multiple copies of React loaded.
>
> addComponentAsRefTo(...): يحظى ReactOwner بالمراجع فقط. من المُحتمل أنك تُضيف مرجع إلى مُكوّن لم يُنشأ داخل تابع `render` أو أنه لديك أكثر من نُسخة React مُحملّة.

ذلك غالبًا يعني واحدًا من ثلاثة أشياء:

- تُحاول إضافة مرجع `ref` إلى مُكوّن دالّة.
- تُحالو إضافة مرجع `ref` إلى عُنصُر يتم إنشائهُ خارج تابع `render()`.
- لديك نُسخ مُتعددة من React مُحمّلة. (مثلما يكون الحال عند وجود إعتمادية مُعدّة بشكل غير صحيح)

## مراجع على مُكوّنات دالّة {#refs-on-function-components}

إن كان `<Foo>` مُكوّن دالّة فلا يُمكِنُك إضافة مرجع عليه:

```js
// Doesn't work if Foo is a function!
<Foo ref={foo} />
```

إن كُنت بحاجة إلى إضافة مرجع إلى مُكوّن قُم بتحويلِهِ أولًا إلى مُكوّن صنف أو خُذ بعين الاعتبار عدم استخدام المراجع بما أنهم من [النادر ضرورتهم](/docs/refs-and-the-dom.html#when-to-use-refs).

## مراجع السلاسل النصيّة خارج تابع التصيّير {#strings-refs-outside-the-render-method}

يعني هذا غالبًا أنك تُحاول إضافة مرجع إلى مُكوّن ليس لديه مالِك "owner" (أي أنه لم يُنشأ داخل تابع التصيير `render` لمُكوّن آخر). المثال أدناه لن يَعمل:

```js
// Doesn't work!
ReactDOM.render(<App ref="app" />, el);
```

قُم بتصيير هذا المُكوّن داخل مُكوّن جديد ذو المُستوى الأعلى "top-level" والذي سَيحمل المرجع. كطريقة بديلة، يُمكنك استخدام مرجع ردود النداء "callback ref":

```js
let app;
ReactDOM.render(
  <App ref={inst => {
    app = inst;
  }} />,
  el
);
```

تأمل [حاجتك لاستخدام مرجع](/docs/refs-and-the-dom.html#when-to-use-refs) جيدًا قبل استخدام هذا الأُسلوب.

## نُسخ مُتعددة من React {#multiple-copies-of-react}

يقوم Bower بعمل جيد من ناحية حل المُشكلات المُتعلقة بإزدواج الأعتماديات بنيما لا يقوم npm ذلك. إن كُنت لا تقوم بشئ (خيالي "fancy") في المراجع ، فإن المُشكلة على الأرجح ليست بالمراجع خاصتك بل بوجود نُسخ مُتعددة من React مُحمّلة إلى مَشروعك. في بعض الأحيان عند سحب "pull" واجهة "module" من الطرف الثالث من خلال npm فقد تَحصُل على نُسخة مُتكررة من مكتبة الإعتمادية وقد يؤدي ذلك إلى خلق مُشكلات.

إن كُنت تستخدم npm فإن أمرا `npm ls` و `npm ls react` قد يُساعدا في تسليط الضوء على المُشكلة.
