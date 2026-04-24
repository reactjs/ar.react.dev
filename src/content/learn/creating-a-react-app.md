---
title: إنشاء تطبيق React
---

<Intro>

إذا أردت بناء تطبيق أو موقع جديد بـ React، ننصحك بالبدء بإطار عمل (framework).

</Intro>

إذا كان تطبيقك يفرض قيوداً لا تلبّيها الإطارات الجاهزة بسهولة، أو تفضّل بناء إطارك الخاص، أو تريد فقط تعلّم أساسيات تطبيق React، يمكنك [بناء تطبيق React من الصفر](/learn/build-a-react-app-from-scratch).

## إطارات عمل كاملة المكدس {/*full-stack-frameworks*/}

تدعم هذه الإطارات الموصى بها الميزات التي تحتاجها لنشر تطبيقك وتوسيعه في الإنتاج. دمجت أحدث ميزات React وتستفيد من بنية React.

<Note>

#### إطارات العمل الكاملة لا تتطلّب خادماً. {/*react-frameworks-do-not-require-a-server*/}

كل الإطارات في هذه الصفحة تدعم التصيير على العميل ([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR))، وتطبيقات الصفحة الواحدة ([SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA))، وتوليد المواقع الساكنة ([SSG](https://developer.mozilla.org/en-US/docs/Glossary/SSG)). يمكن نشر هذه التطبيقات على [CDN](https://developer.mozilla.org/en-US/docs/Glossary/CDN) أو استضافة ساكنة دون خادم. كما تتيح لك الإطارات إضافة التصيير على الخادم لكل مسار عند الحاجة.

يمكنك البدء بتطبيق يعمل بالكامل على العميل، ثم إن تغيّرت احتياجاتك لاحقاً، تفعيل ميزات الخادم لمسارات معيّنة دون إعادة كتابة التطبيق بالكامل. راجع وثائق إطارك لضبط استراتيجية التصيير.

</Note>

### Next.js (App Router) {/*nextjs-app-router*/}

**[App Router في Next.js](https://nextjs.org/docs) إطار عمل React يستغل بنية React بالكامل لتمكين تطبيقات React كاملة المكدس.**

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Next.js تشرف عليه [Vercel](https://vercel.com/). يمكنك [نشر تطبيق Next.js](https://nextjs.org/docs/app/building-your-application/deploying) على أي مزوّد يدعم Node.js أو حاويات Docker، أو على خادمك. يدعم Next.js أيضاً [التصدير الساكن](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) دون الحاجة إلى خادم.

### React Router (v7) {/*react-router-v7*/}

**[React Router](https://reactrouter.com/start/framework/installation) أكثر مكتبات التوجيه شعبية لـ React ويمكن الجمع بينها وVite لإنشاء إطار React كامل المكدس.** يعتمد على واجهات الويب القياسية ويوفّر [قوالب جاهزة للنشر](https://github.com/remix-run/react-router-templates) لمختلف بيئات تشغيل JavaScript والمنصّات.

لإنشاء مشروع React Router جديد، نفّذ:

<TerminalBlock>
npx create-react-router@latest
</TerminalBlock>

React Router تشرف عليه [Shopify](https://www.shopify.com).

### Expo (للتطبيقات الأصلية) {/*expo*/}

**[Expo](https://expo.dev/) إطار عمل React يتيح إنشاء تطبيقات Android وiOS وويب بعناوين واجهة أصلية حقيقية.** يوفّر حزمة تطوير لـ [React Native](https://reactnative.dev/) تُسهّل استخدام الجزء الأصلي. لإنشاء مشروع Expo جديد:

<TerminalBlock>
npx create-expo-app@latest
</TerminalBlock>

إذا كنت جديداً على Expo، راجع [دليل Expo](https://docs.expo.dev/tutorial/introduction/).

Expo تشرف عليها [شركة Expo](https://expo.dev/about). بناء التطبيقات باستخدام Expo مجاني، ويمكنك إرسالها إلى متجرَي Google وApple دون قيود. تقدّم Expo أيضاً خدمات سحابية اختيارية مدفوعة.


## إطارات أخرى {/*other-frameworks*/}

هناك إطارات ناشئة تعمل نحو رؤيتنا لـ React كامل المكدس:

- [TanStack Start (Beta)](https://tanstack.com/start/): إطار React كامل المكدس يعتمد على TanStack Router، مع SSR كامل للمستند، وبث، ودوال خادم، وحزم، وأدوات مثل Nitro وVite.
- [RedwoodSDK](https://rwsdk.com/): إطار React كامل المكدس مع حزم وإعدادات مسبقة تُسهّل بناء تطبيقات ويب كاملة المكدس.

<DeepDive>

#### ما الميزات التي تشكّل رؤية فريق React لبنية كامل المكدس؟ {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

حزم App Router في Next.js تطبّق مواصفة [React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) رسمياً. يتيح لك ذلك خلط مكوّنات وقت البناء، ومكوّنات للخادم فقط، ومكوّنات تفاعلية في شجرة React واحدة.

مثلاً، يمكنك كتابة مكوّن React للخادم فقط كدالة `async` تقرأ من قاعدة بيانات أو ملف. ثم تمرّر البيانات إلى المكوّنات التفاعلية:

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

يدمج App Router أيضاً [جلب البيانات مع Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). يمكنك تحديد حالة تحميل (مثل هيكل عظمي) لأجزاء مختلفة من الواجهة مباشرة في شجرة React:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server Components وSuspense ميزات في React وليست خاصة بـ Next.js. لكن تبنّيها على مستوى الإطار يحتاج التزاماً وجهداً تنفيذياً. حالياً App Router في Next.js هو التطبيق الأكثر اكتمالاً. يعمل فريق React مع مطوّري الحزم لتسهيل تنفيذ هذه الميزات في الجيل القادم من الإطارات.

</DeepDive>

## البدء من الصفر {/*start-from-scratch*/}

إذا كان تطبيقك يفرض قيوداً لا تلبّيها الإطارات الجاهزة، أو تفضّل بناء إطارك الخاص، أو تريد فقط تعلّم أساسيات تطبيق React، فهناك خيارات أخرى للبدء من الصفر.

البدء من الصفر يمنحك مرونة أكبر، لكنه يتطلّب اختيار أدوات للتوجيه وجلب البيانات وأنماط الاستخدام الشائعة. يشبه إلى حدٍّ ما بناء إطارك الخاص بدلاً من استخدام إطار جاهز. [الإطارات التي ننصح بها](#full-stack-frameworks) تتضمّن حلولاً جاهزة لهذه المسائل.

إذا أردت بناء الحلول بنفسك، راجع [بناء تطبيق React من الصفر](/learn/build-a-react-app-from-scratch) لإعداد مشروع جديد بأداة بناء مثل [Vite](https://vite.dev/) أو [Parcel](https://parceljs.org/) أو [RSbuild](https://rsbuild.dev/).

-----

_إذا كنت مطوّر إطار عمل وترغب في إدراجه في هذه الصفحة، [أخبرنا](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)._
