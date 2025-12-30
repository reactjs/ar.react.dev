---
title: إنشاء تطبيق React
---

<Intro>

إذا رغبت في إنشاء تطبيق أو موقع جديد باستخدام React، فنوصي بالبدء باستخدام إطار عمل.

</Intro>

إذا كانت متطلبات تطبيقك لا تُلبَّى جيدًا بالأُطر الحالية، أو كنت تفضّل بناء إطارك الخاص، أو أردت فقط تعلم أساسيات تطبيق React، يمكنك [بناء تطبيق React من الصفر](/learn/build-a-react-app-from-scratch).

## الأُطر الشاملة (Full-stack) {/*full-stack-frameworks*/}

تدعم هذه الأُطر الموصى بها جميع الميزات التي تحتاجها لنشر تطبيقك وتوسيعه في بيئة الإنتاج. لقد دمجت أحدث ميزات React وتستفيد من بنية React.

<Note>

#### لا تتطلب الأُطر الشاملة وجود خادم. {/*react-frameworks-do-not-require-a-server*/}

تدعم جميع الأُطر المدرجة في هذه الصفحة التصيير على جانب العميل ([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR))، وتطبيقات الصفحة الواحدة ([SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA))، وتوليد المواقع الثابتة ([SSG](https://developer.mozilla.org/en-US/docs/Glossary/SSG)). يمكن نشر هذه التطبيقات على شبكة توصيل محتوى ([CDN](https://developer.mozilla.org/en-US/docs/Glossary/CDN)) أو على خدمات استضافة ثابتة دون الحاجة إلى خادم. بالإضافة إلى ذلك، تتيح هذه الأُطر إضافة التصيير على الخادم على مستوى المسار عندما يكون ذلك مناسبًا لحالة الاستخدام الخاصة بك.

هذا يمكّنك من البدء بتطبيق طرف-عميل فقط، وإذا تغيرت احتياجاتك لاحقًا يمكنك تفعيل ميزات الخادم لمسارات معينة دون إعادة كتابة التطبيق بأكمله. راجع وثائق إطار عملك لتكوين استراتيجية التصيير.

</Note>

### Next.js (App Router) {/*nextjs-app-router*/}

**[App Router في Next.js](https://nextjs.org/docs) هو إطار React يستفيد بالكامل من بنية React لتمكين تطبيقات React متكاملة (Full-stack).**

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

يُطوَّر Next.js ويُصان بواسطة [Vercel](https://vercel.com/). يمكنك [نشر تطبيق Next.js](https://nextjs.org/docs/app/building-your-application/deploying) إلى أي مزود استضافة يدعم Node.js أو حاويات Docker، أو إلى خادم خاص بك. كما يدعم Next.js أيضًا [التصدير الثابت](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) الذي لا يتطلب خادمًا.

### React Router (الإصدار 7) {/*react-router-v7*/}

**[React Router](https://reactrouter.com/start/framework/installation) هو أشهر مكتبة توجيه (routing) في React ويمكن ربطه مع Vite لإنشاء إطار React متكامل.** يركّز على واجهات برمجة الويب القياسية ويحتوي على عدة [قوالب جاهزة للنشر](https://github.com/remix-run/react-router-templates) لأنظمة تشغيل جافاسكربت ومنصات مختلفة.

لإنشاء مشروع إطار جديد باستخدام React Router، شغِّل:

<TerminalBlock>
npx create-react-router@latest
</TerminalBlock>

تُصان React Router بواسطة [Shopify](https://www.shopify.com).

### Expo (للتطبيقات الأصلية) {/*expo*/}

**[Expo](https://expo.dev/) هو إطار React يتيح لك إنشاء تطبيقات Android وiOS والويب بواجهات أصلية حقيقية.** يوفر Expo مجموعة أدوات SDK لـ [React Native](https://reactnative.dev/) تجعل الأجزاء الأصلية أسهل في الاستخدام. لإنشاء مشروع Expo جديد، شغّل:

<TerminalBlock>
npx create-expo-app@latest
</TerminalBlock>

إذا كنت جديدًا على Expo، اطلع على [دليل Expo التعليمي](https://docs.expo.dev/tutorial/introduction/).

يُصان Expo بواسطة [Expo (الشركة)](https://expo.dev/about). بناء التطبيقات باستخدام Expo مجاني، ويمكنك تقديمها إلى متاجر Google وApple بدون قيود. كما يوفر Expo خدمات سحابية مدفوعة اختيارية.


## أُطر أخرى {/*other-frameworks*/}

هناك أُطر ناشئة أخرى تعمل نحو رؤية React الشاملة (full-stack):

- [TanStack Start (Beta)](https://tanstack.com/start/): TanStack Start هو إطار React شامل يعتمد على TanStack Router. يوفر SSR كاملًا، والبث (streaming)، ودوال الخادم، والتجميع، والمزيد باستخدام أدوات مثل Nitro وVite.
- [RedwoodSDK](https://rwsdk.com/): Redwood هو إطار React شامل يأتي مع العديد من الحزم والتهيئات المسبقة التي تُسهِم في بناء تطبيقات ويب متكاملة بسهولة.

<DeepDive>

#### ما هي الميزات التي تشكّل رؤية فريق React لبنية Full-stack؟ {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

يقوم مُجمِّع App Router في Next.js بتنفيذ مواصفة [مكونات خادم React (React Server Components)](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) بشكل كامل. يتيح هذا مزج المكونات التي تعمل أثناء وقت البناء، والمكونات الخاصة بالخادم، والمكونات التفاعلية داخل شجرة React واحدة.

على سبيل المثال، يمكنك كتابة مكوّن يعمل على الخادم فقط كدالة `async` تقرأ من قاعدة بيانات أو من ملف، ثم تمرّر البيانات إلى مكوناتك التفاعلية:

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

يُدَوِّج App Router في Next.js أيضًا دمج [جلب البيانات مع Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). يتيح لك ذلك تحديد حالة تحميل (مثل عنصر نائب skeleton) لأجزاء مختلفة من واجهة المستخدم مباشرةً داخل شجرة React:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

تُعدّ مكونات الخادم وSuspense ميزات في React نفسها وليس ميزات حصرية لـ Next.js. ومع ذلك، يتطلب اعتمادها على مستوى الإطار موافقة وجهد تنفيذ غير تافه. في الوقت الحالي، يُعتبر App Router في Next.js التنفيذ الأكثر اكتمالًا. يعمل فريق React مع مطوّري المجمعات لتسهيل تنفيذ هذه الميزات في الجيل القادم من الأُطر.

</DeepDive>

## البدء من الصفر {/*start-from-scratch*/}

إذا كانت متطلبات تطبيقك لا تُلبَّى جيدًا بالأُطر الحالية، أو كنت تفضّل بناء إطارك الخاص، أو أردت تعلم أساسيات تطبيق React، فهناك خيارات متاحة لبدء مشروع React من الصفر.

البدء من الصفر يمنحك مرونة أكبر، لكنه يتطلب منك اتخاذ قرارات حول الأدوات التي ستستخدمها للتوجيه، وجلب البيانات، وأنماط الاستخدام الشائعة الأخرى. إنه يشبه إلى حد بعيد بناء إطار عمل بنفسك بدلًا من استخدام إطار جاهز. الأُطر التي نوصي بها لديها حلول مدمجة لهذه المشكلات.

إذا أردت بناء حلولك بنفسك، اطلع على دليلنا [لبناء تطبيق React من الصفر](/learn/build-a-react-app-from-scratch) للحصول على تعليمات حول إعداد مشروع React جديد بدءًا من أداة بناء مثل [Vite](https://vite.dev/)، أو [Parcel](https://parceljs.org/)، أو [Rsbuild](https://rsbuild.dev/).

-----

_إذا كنت مؤلف إطار عمل وترغب في إدراجه في هذه الصفحة، [نرجو إعلامنا](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)._
