---
id: create-a-new-react-app
title: إنشاء تطبيق React جديد
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

استعمل سلسلة الأدوات المدمجة (integrated toolchain) من أجل الحصول على أفضل تجربة استخدام وتطوير.

تشرح هذه الصفحة بعض سلاسل الأدوات المشهورة في React التي تساعد في مهام مثل:

* تغيير حجم العديد من الملفات والمكونات.
* استعمال مكتبات من طرف ثالث من npm.
* الاكتشاف المبكر عن الأخطاء الشائعة.
* التعديل المباشر (Live-editing) على شيفرة CSS و JavaScript في البيئة التطويرية.
* تحسين المخرجات للبيئة الإنتاجية.

لا تتطلب سلسلة الأدوات التي سيوصى باستعمالها في هذه الصفحة أي **ضبط مسبق لبدء استعمالها**.

## قد لا ترغب باستعمال سلسلة من الأدوات{#you-might-not-need-a-toolchain}

إن لم تكن لك سابق خبرة بالمشكلات التي ذُكرت آنفًا، أو لم تشعر بالراحة عند استعمال أدوات JavaScript بعد، [أضف React كوسوم `<script>` مجرَّدة في صفحة HTML](/docs/add-react-to-a-website.html), وافترض أنَّ [استعمال JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx) أمر اختياري.

هذه الطريقة أيضًا **هي أبسطة طريقة لدمج React مع صفحة ويب.** يمكن في أي وقت استعمال أي سلسلة من الأدوات مهما كانت ضخمة إن وجدت أنها مفيدة.

## سلسلة الأدوات المقترحة {#recommended-toolchains}

يوصي فريق React بشكل أساسي الحلول التالية:

- إن كنت **تتعلم React** أو **تريد إنشاء [تطبيق ذي صفحة واحدة](/docs/glossary.html#single-page-application) app,** إستعمل [البئية Create React App](#create-react-app).
- إن كنت تبني **موقعًا يصيَّر من طرف الخادم (server-rendered website) مع Node.js,** جرب استعمال [Next.js](#nextjs).
- إن كنت تبني **موقعًا ثابتًا يركز على المحتوى (static content-oriented website),** جرب استعمال [Gatsby](#gatsby).
- إن كنت تبني **مكتبة لمكون ما** or **دمج مع شيفرة أساسية (codebase)**, جرب استعمال [ سلاسل أدوات ذات مرونة أكبر](#more-flexible-toolchains).

### البيئة Create React App {#create-react-app}

إنَّ [Create React App](https://github.com/facebookincubator/create-react-app) هي بيئة مناسبة ومريحة **لتعلم React**, هي أفضل طريقة لبدء بناء تطبيق جديدة ذي **[صفحة وحيدة ](/docs/glossary.html#single-page-application)** في React.

يضبط الأمر `create-react-app` البيئة التطويرية الخاصة بك، وبذلك تستطيع استعمال أحدث ميزات JavaScript، والحصول على أفضل تجربة تطوير، بالإضافة إلى تحسين تطبيقك وتهيئته للإنتاج. ستحتاج إلى الإصدار 8.10 من Node.js أو ما بعده والإصدار 5.6 من npm أو ما بعده على جهازك. لإنشاء مشروع جديد، نفذ ما يلي:

```bash
npx create-react-app my-app
cd my-app
npm start
```

>ملاحظة
>
>الأمر `npx` ليس فيه أي خطأ كتابي، إذ هو أداة تشغيل للحزم تأتي مع [الإصدار 5.2 وما بعده من npm](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

إنشاء تطبيق React لا يملئ فراغ الواجهة الخلفية أو قواعد البيانات. جلَّ ما يحدث هو إنشاء أنبوب بناء واجهة أمامية (frontend build pipeline)، لذا تستطيع استعماله مع أية واجهة خلفية تريد؛ على أي حال، لا تحتاج الآن إلى معرفة أي شي عن الواجهات الخلفية. Under the hood, it uses [Babel](https://babeljs.io/) and [webpack](https://webpack.js.org/), but you don't need to know anything about them.

عندما تصبح جاهزًا للنشر على البيئة الإنتاجية، سينشئ تنفيذ الأمر `npm run build` نسخة مبنية محسَّنة من تطبيقك في المجلد `build`. ستطيع تعلم المزيد حول البيئة Create React App من ملف [اقرأني](https://github.com/facebookincubator/create-react-app#create-react-app--) (README) الخاص بها و [دليل المستخدم](https://facebook.github.io/create-react-app/).

### Next.js {#nextjs}

يعدُّ [Next.js](https://nextjs.org/) إطار عمل مشهور وخفيف لبناء **التطبيقات الثابتة والمصيرة من طرف الخادم** مع React. يتضمن **حلولًا غير تقليدية للتنسيق والتوجيه,** ويفترض أنَّك تستعمل [Node.js](https://nodejs.org/) بيئةً للخادم.

تعلم المزيد حول Next.js من [الدليل الرسمي](https://nextjs.org/learn/) الموجود على موقعه.

### Gatsby {#gatsby}

الأداة [Gatsby](https://www.gatsbyjs.org/)  هي أفضل وسيلة لإنشاء **مواقع ويب ساكنة** مع React. إذ تمكِّننا من استعمال مكونات React ولكن مع تصيير مخرجات HTML و CSS مسبقًا لضمان الحصول على أسرع زمن تحميل.

يمكنك تعلم الأداة Gatsby من [الدليل الرسمي](https://www.gatsbyjs.org/docs/) لها و [معرض عدة البدء](https://www.gatsbyjs.org/docs/gatsby-starters/).

### سلاسلة أدوات ذات مرونة أكبر {#more-flexible-toolchains}

سلاسل الأدوات التالية توفر مرونةً أكبر وخيارات أكثر. ننصح المستخدمين ذوي الخبرة باستعمالها:

- **[Neutrino](https://neutrinojs.org/)**  تدمج قوة [webpack](https://webpack.js.org/) مع بساطة الضبط المسبق الافتراضي (presets)، وتُضمِّن ضبطًا مسبقًا [لتطبيقات React](https://neutrinojs.org/packages/react/) و [مكونات React](https://neutrinojs.org/packages/react-components/).

- **[nwb](https://github.com/insin/nwb)** داة رائعةأ [لنشر مكونات React من أجل npm](https://github.com/insin/nwb/blob/master/docs/guides/ReactComponents.md#developing-react-components-and-libraries-with-nwb). [يمكن استعمالها](https://github.com/insin/nwb/blob/master/docs/guides/ReactApps.md#developing-react-apps-with-nwb) لإنشاء تطبيق React أيضًا. 

- **[Parcel](https://parceljs.org/)** أداة سريعة لتحزيم تطبيقات الويب التي [تعمل مع React](https://parceljs.org/recipes.html#react) دون أي ضبط.

- **[Razzle](https://github.com/jaredpalmer/razzle)**  هو إطار عمل تصيير من طرف الخادم ولا يتطلب أي ضبط ولكن يتسم بالمرونة أكثر من إطار العمل Next.js.

## إنشاء سلسلة أدوات (toolchain) من الصفر {#creating-a-toolchain-from-scratch}

سلسلة أدوات بناء شيفرة جافاسكريبت تتكون عادةً من:

* **مدير حزم** مثل [Yarn](https://yarnpkg.com/) أو [npm](https://www.npmjs.com/).يمكِّنك هذا المدير من الاستفادة قابلية اتساع بيئة العمل عبر تثبيت الحزم المتنوعة الموفرة من طرف ثالث وتحديثها بسهولة.

* **محزِّم** مثل [webpack](https://webpack.js.org/) أو [Parcel](https://parceljs.org/). يمكِّنك المحزِّم من كتابة شيفرة لوحدةٍ ما وتحزيمها في حُزَمٍ صغيرة لتحسين زمن التحميل.

* **مفسر** مثل [Babel](https://babeljs.io/). يمكِّنك المفسر من كتابة شيفرة جافاسكريبت بأحدث إصدار وتعمل في الإصدارات القديمة من المتصفحات.

إن كنت تفضِّل إعداد سلسلة أدوات جافاسكريبت الخاصة بك من الصفر، اطلع على [هذا الدليل](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) لذي يعيد إنشاء بعض وظائف البيئة Create React App.

لا تنسَ التأكد من [إعداد سلسلة أدواتك المخصصة من أجل الإنتاج بشكل جيد ومناسب](/docs/optimizing-performance.html#use-the-production-build).
