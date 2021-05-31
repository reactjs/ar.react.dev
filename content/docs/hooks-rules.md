---
id: hooks-rules
title: قواعد استعمال الـ Hooks
permalink: docs/hooks-rules.html
next: hooks-custom.html
prev: hooks-effect.html
---

*الخطافات* هي إضافة جديدة إلى الإصدار 16.8 في React، إذ تسمح لك باستعمال ميزة الحالة وميزات React الأخرى دون كتابة أي صنف:

الخطافات هي دوال JavaScript، ولكن تحتاج إلى اتباع قاعدتين عند استعمالها. نوفر [إضافة تصحيح أخطاء الصياغة](https://www.npmjs.com/package/eslint-plugin-react-hooks) تجبرك على تطبيق هاتين القاعدتين تلقائيًّا.

### استدعي الخطافات في المستوى الأعلى فقط {#only-call-hooks-at-the-top-level}

<<<<<<< HEAD
**لا تستدعي الخطافات داخل حلقات التكرار، أو التعابير الشرطية، أو الدوال المتشعبة.** بدلًا من ذلك، استعمل الخطافات دومًا في المستوى الأعلى (top level) من دالة React. بتطبيق هذه القاعدة، تتأكد من أن الخطافات تُستدَعى بالترتيب نفسه في كل مرة يصيَّر فيها مكونٌ. هذا يسمح لـ React بحفظ حالة الخطافات بين الاستدعاءات `useState` و `useEffect` المتعددة بشكل صحيح. (إن شدَّك فضولك للتعلم أكثر، سنشرح هذا الأمر بالتفصيل في [الأسفل](#explanation).)
=======
**Don't call Hooks inside loops, conditions, or nested functions.** Instead, always use Hooks at the top level of your React function, before any early returns. By following this rule, you ensure that Hooks are called in the same order each time a component renders. That's what allows React to correctly preserve the state of Hooks between multiple `useState` and `useEffect` calls. (If you're curious, we'll explain this in depth [below](#explanation).)
>>>>>>> ec2d0adcb44d6394f4e6282d8bf52f0e25dbfec3

### استدعي الخطافات من دوال React فقط {#only-call-hooks-from-react-functions}

**لا تستدعي الخطافات من دوال JavaScript العادية.** بدلًا من ذلك، يمكنك:

* ✅ استدعاء الخطافات من مكونات دالة React.
* ✅ استدعاء الخطافات من خطافات مخصصة (سنتعرف عليهم في [الصفحة التالية](/docs/hooks-custom.html)).

باتباع هذه القاعدة، تتأكد من أنَّ الشيفرة ذات الحالة (stateful logic) في مكونٍ ما مرئيةٌ بوضوح من شيفرتها المصدرية.

## الإضافة ESLint {#eslint-plugin}

أطلقنا إضافةً لتصحيح الأخطاء تدعى [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) تجبر على تطبيق هاتين القاعدتين. يمكنك إضافة هذه الإضافة إلى مشروعك إن أحببت تجريبها:

يتم تضمين هذه المكونات بشكل افتراضي في [Create React App](/docs/create-a-new-react-app.html#create-react-app).

```bash
npm install eslint-plugin-react-hooks --save-dev
```

```js
// الخاص بك ESLint ضبط الإضافة
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn" // Checks effect dependencies
  }
}
```

**يمكنك تخطي بقية هذه الصفحة إلى الصفحة التالية: [بناء خطافات خاصة بك](/docs/hooks-custom.html) الآن.** إذ سنكمل شرح سبب وجود هاتين القاعدتين.

## الشرح {#explanation}

كما [تعلمنا سابقًا](/docs/hooks-state.html#tip-using-multiple-state-variables)، يمكننا استعمال خطافات حالة أو تأثير متعددة في مكون واحد:

```js
function Form() {
  // 1. نفسه name استعمال متغير الحالة 
  const [name, setName] = useState('Mary');

  // 2. استعمال تأثير من أجل استمرار النموذج
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3. surname استعمال متغير الحالة
  const [surname, setSurname] = useState('Poppins');

  // 4. استعمال تأثير من أجل تحديث العنوان
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ...
}
```

إذًا، كيف تعرف React أية حالة توافق أي استدعاء للخطاف `useState`؟ الجواب هو أنَّ **React تعتمد على الترتيب الذي استدعيت الخطافات به**. مثالنا السابق يعمل بشكل صحيح لأنَّ ترتيب استدعاء الخطافات هو نفسه في كل تصيير:

```js
// ------------
// أول تصيير
// ------------
useState('Mary')           // 1. 'Mary' إلى name ضبط متغير الحالة
useEffect(persistForm)     // 2. persistForm إضافى تأثير من أجل استمرار النموذج
useState('Poppins')        // 3. 'Poppins' إلى surname ضبط متغير الحالة
useEffect(updateTitle)     // 4. إضافة تأثير من أجل تحديث العنوان

// -------------
// ثاني تصيير
// -------------
useState('Mary')           // 1. (يتجاهل الوسيط) name قراءة متغير الحالة
useEffect(persistForm)     // 2. استبدال التأثير من أجل استمرار النموذج
useState('Poppins')        // 3. (يتجاهل الوسيط) surname قراءة متغير الحالة
useEffect(updateTitle)     // 4. استبدال التأثير من أجل تحديث العنوان

// ...
```

طالمًا أنَّ ترتيب استدعاءات الخطاف هو نفسه بين عمليات التصيير، تستطيع React ربط بعض الحالات المحلية مع بعضها. ولكن، ماذا يحصل إن وضعنا استدعاء خطاف (التأثير `persistForm` مثلًا) داخل تعبير شرطي؟

```js
  // 🔴 نكسر الآن القاعدة الأولى عبر استعمال خطاف داخل تعبير شرطي

  if (name !== '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });
  }
```

الشرط  `name !== ''` هو `true` في عملية التصيير الأولى، لذا يُنفَّذ هذا الخطاف. مع ذلك، في عملية التصيير التالية، قد يمسح المستخدم النموذج مما يؤدي إلى تغيِّر قيمة الشرط إلى `false`. الآن وبعد أن تخطينا هذا الخطاف أثناء عملية التصيير، أصبح ترتيب استدعاءات الخطاف مختلفًا:

```js
useState('Mary')           // 1. (يتجاهل الوسيط) name قراءة متغير الحالة
// useEffect(persistForm)  // 🔴 يُتخطَى هذا الخطاف
useState('Poppins')        // 🔴 2 (يجب أن تكون 3) surname فشل قراءة متغير الحالة
useEffect(updateTitle)     // 🔴 3 (فشل استبدال التأثير (يجب أن تكون 4
```

لن تعرف React ما الذي ستعيده من أجل استدعاء الخطاف `useState` الثاني. تتوقع React أن استدعاء الخطاف الثاني في هذا المكون يقابل التأثير `persistForm` مثل عملية التصيير السابقة، ولكن الحالة الآن لم تعد مشابه لها. بدءًا من تلك النقطة، كل استدعاء خطاف لاحق بعد ذلك الخطاف الذي جرى تخطيه سينزاح مرةً واحدةً مما يؤدي إلى حصول أخطاء.

**هذا هو سبب وجوب استدعاء الخطافات في المستوى الأعلى من مكوناتنا.** إن أردنا تنفيذ تأثير شرطيًّا، يمكننا وضع هذا الشرط *داخل* خطافنا:

```js
  useEffect(function persistForm() {
    // 👍 لم نخرق القاعدة الأولى
    if (name !== '') {
      localStorage.setItem('formData', name);
    }
  });
```

**لاحظ أنَّه لا داعي للقلق حول هذه المشكلة إن كنت تستعمل [إضافة التصحيح](https://www.npmjs.com/package/eslint-plugin-react-hooks).** الذي أشرنا إليها في الأعلى. على أية، أصبحت الآن تعرف سبب عمل الخطافات بهذه الطريقة، وما هي المشكلات التي تمنع القاعدة من حدوثها.

## الخطوات التالية {#next-steps}

أخيرًا، أصبحنا جاهزين لنتعلم كيفية [كتابة خطافات مخصصة](/docs/hooks-custom.html)! تخدم الغرض الذي نريد. الخطافات المخصصة تمكِّننا من دمج الخطافات التي توفرها React سويةً، وإعادة استعمال شيفرة شائعة ذات حالة بين مختلف المكونات.
