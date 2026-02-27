---
title: إنشاء تطبيق React
---

<Intro>

إذا كنت تريد بناء تطبيق أو موقع ويب جديد باستخدام React، فإننا نوصي بالبدء بإطار عمل.

</Intro>

إذا كان تطبيقك يحتوي على قيود لا تخدمها أطر العمل الموجودة بشكل جيد، أو تفضل بناء إطار العمل الخاص بك، أو تريد فقط تعلم أساسيات تطبيق React، يمكنك [بناء تطبيق React من الصفر](/learn/build-a-react-app-from-scratch).

## أطر عمل Full-stack {/*full-stack-frameworks*/} {/*production-grade-react-frameworks*/}

تدعم أطر العمل الموصى بها هذه جميع الميزات التي تحتاجها لنشر تطبيقك وتوسيع نطاقه في الإنتاج. لقد دمجت أحدث ميزات React وتستفيد من بنية React.

<Note>

#### أطر عمل Full-stack لا تتطلب خادمًا. {/*react-frameworks-do-not-require-a-server*/}

جميع أطر العمل في هذه الصفحة تدعم client-side rendering ([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR))، وتطبيقات single-page ([SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA))، و static-site generation ([SSG](https://developer.mozilla.org/en-US/docs/Glossary/SSG)). يمكن نشر هذه التطبيقات على [CDN](https://developer.mozilla.org/en-US/docs/Glossary/CDN) أو خدمة استضافة ثابتة بدون خادم. بالإضافة إلى ذلك، تتيح لك أطر العمل هذه إضافة server-side rendering على أساس كل route، عندما يكون ذلك منطقيًا لحالتك الاستخدامية.

يتيح لك هذا البدء بتطبيق client-only، وإذا تغيرت احتياجاتك لاحقًا، يمكنك الاشتراك في استخدام ميزات server على routes فردية دون إعادة كتابة تطبيقك. راجع مستندات إطار العمل الخاص بك لتكوين استراتيجية التصيير.

</Note>

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js's App Router](https://nextjs.org/docs) هو إطار عمل React يستفيد بشكل كامل من بنية React لتمكين تطبيقات React full-stack.**

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

يتم صيانة Next.js بواسطة [Vercel](https://vercel.com/). يمكنك [نشر تطبيق Next.js](https://nextjs.org/docs/app/building-your-application/deploying) على أي مزود استضافة يدعم Node.js أو حاويات Docker، أو على خادمك الخاص. يدعم Next.js أيضًا [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) الذي لا يتطلب خادمًا.

### React Router (v7) {/*react-router-v7*/}

**[React Router](https://reactrouter.com/start/framework/installation) هي مكتبة التوجيه الأكثر شيوعًا لـ React ويمكن دمجها مع Vite لإنشاء إطار عمل React full-stack**. إنها تركز على Web APIs القياسية ولديها العديد من [القوالب الجاهزة للنشر](https://github.com/remix-run/react-router-templates) لـ runtimes و platforms مختلفة من JavaScript.

لإنشاء مشروع إطار عمل React Router جديد، قم بتشغيل:

<TerminalBlock>
npx create-react-router@latest
</TerminalBlock>

يتم صيانة React Router بواسطة [Shopify](https://www.shopify.com).

### Expo (للتطبيقات الأصلية) {/*expo*/}

**[Expo](https://expo.dev/) هو إطار عمل React يتيح لك إنشاء تطبيقات Android و iOS و web عالمية مع واجهات مستخدم أصلية حقًا.** يوفر SDK لـ [React Native](https://reactnative.dev/) مما يجعل الأجزاء الأصلية أسهل في الاستخدام. لإنشاء مشروع Expo جديد، قم بتشغيل:

<TerminalBlock>
npx create-expo-app@latest
</TerminalBlock>

إذا كنت جديدًا على Expo، تحقق من [دليل Expo التعليمي](https://docs.expo.dev/tutorial/introduction/).

يتم صيانة Expo بواسطة [Expo (الشركة)](https://expo.dev/about). بناء التطبيقات باستخدام Expo مجاني، ويمكنك تقديمها إلى متاجر Google و Apple بدون قيود. يوفر Expo أيضًا خدمات سحابية مدفوعة اختيارية.


## أطر عمل أخرى {/*other-frameworks*/} {/*bleeding-edge-react-frameworks*/}

هناك أطر عمل أخرى ناشئة تعمل نحو رؤيتنا لـ full stack React:

- [TanStack Start (Beta)](https://tanstack.com/): TanStack Start هو إطار عمل React full-stack مدعوم بـ TanStack Router. يوفر full-document SSR و streaming و server functions و bundling والمزيد باستخدام أدوات مثل Nitro و Vite.
- [RedwoodJS](https://redwoodjs.com/): Redwood هو إطار عمل React full stack مع العديد من الحزم والتكوينات المثبتة مسبقًا مما يجعل من السهل بناء تطبيقات ويب full-stack.

<DeepDive>

#### ما هي الميزات التي تشكل رؤية فريق React لبنية full-stack؟ {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

يطبق bundler في Next.js's App Router بشكل كامل [مواصفات React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) الرسمية. يتيح لك هذا مزج مكونات build-time و server-only والمكونات التفاعلية في شجرة React واحدة.

على سبيل المثال، يمكنك كتابة مكون React server-only كدالة `async` تقرأ من قاعدة بيانات أو من ملف. ثم يمكنك تمرير البيانات منها إلى مكوناتك التفاعلية:

```js
// This component runs *only* on the server (or during the build).
async function Talks({ confId }) {
  // 1. You're on the server, so you can talk to your data layer. API endpoint not required.
  const talks = await db.Talks.findAll({ confId });

  // 2. Add any amount of rendering logic. It won't make your JavaScript bundle larger.
  const videos = talks.map(talk => talk.video);

  // 3. Pass the data down to the components that will run in the browser.
  return <SearchableVideoList videos={videos} />;
}
```

يدمج Next.js's App Router أيضًا [جلب البيانات مع Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). يتيح لك هذا تحديد حالة تحميل (مثل skeleton placeholder) لأجزاء مختلفة من واجهة المستخدم مباشرة في شجرة React:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server Components و Suspense هي ميزات React وليست ميزات Next.js. ومع ذلك، فإن اعتمادها على مستوى إطار العمل يتطلب دعمًا وعملاً تنفيذيًا غير تافه. في الوقت الحالي، يعتبر Next.js App Router هو التطبيق الأكثر اكتمالاً. يعمل فريق React مع مطوري bundler لجعل هذه الميزات أسهل في التنفيذ في الجيل التالي من أطر العمل.

</DeepDive>

## ابدأ من الصفر {/*start-from-scratch*/} {/*can-i-use-react-without-a-framework*/}

إذا كان تطبيقك يحتوي على قيود لا تخدمها أطر العمل الموجودة بشكل جيد، أو تفضل بناء إطار العمل الخاص بك، أو تريد فقط تعلم أساسيات تطبيق React، هناك خيارات أخرى متاحة لبدء مشروع React من الصفر.

البدء من الصفر يمنحك مرونة أكبر، ولكنه يتطلب منك اتخاذ قرارات حول الأدوات التي ستستخدمها للتوجيه وجلب البيانات وأنماط الاستخدام الشائعة الأخرى. إنه يشبه كثيرًا بناء إطار العمل الخاص بك، بدلاً من استخدام إطار عمل موجود بالفعل. [أطر العمل التي نوصي بها](#full-stack-frameworks) لديها حلول مدمجة لهذه المشاكل.

إذا كنت تريد بناء الحلول الخاصة بك، راجع دليلنا [لبناء تطبيق React من الصفر](/learn/build-a-react-app-from-scratch) للحصول على تعليمات حول كيفية إعداد مشروع React جديد بدءًا من أداة build مثل [Vite](https://vite.dev/) أو [Parcel](https://parceljs.org/) أو [RSbuild](https://rsbuild.dev/).

-----

_إذا كنت مؤلف إطار عمل مهتمًا بإدراجه في هذه الصفحة، [يرجى إعلامنا](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)._
