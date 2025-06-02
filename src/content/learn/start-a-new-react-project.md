---
title: بدء مشروع React جديد
---

<Intro>

إذا كنت تريد إنشاء تطبيق جديد أو موقع ويب جديد بالكامل باستخدام React، فنوصيك باختيار أحد الأطر المدعومة بـ React والتي تحظى بشعبية في المجتمع.

</Intro>


يمكنك استخدام React بدون إطار عمل، ولكننا وجدنا أن معظم التطبيقات والمواقع تبني في النهاية حلولاً لمشاكل شائعة مثل تقسيم التعليمات البرمجية والتوجيه وجلب البيانات وإنشاء HTML. هذه المشاكل شائعة في جميع مكتبات واجهة المستخدم، وليس فقط React.

من خلال البدء بإطار عمل، يمكنك البدء في استخدام React بسرعة، وتجنب بناء إطار العمل الخاص بك لاحقًا.

<DeepDive>

#### هل يمكنني استخدام React بدون إطار عمل؟ {/*can-i-use-react-without-a-framework*/}

يمكنك بالتأكيد استخدام React بدون إطار عمل - هكذا يمكنك [استخدم React لجزء من صفحتك.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **ومع ذلك، إذا كنت تقوم ببناء تطبيق جديد أو موقع كامل باستخدام React، فنوصيك باستخدام إطار عمل.**

إليك السبب.

حتى إذا لم تكن بحاجة إلى التوجيه أو جلب البيانات في البداية، فمن المحتمل أن ترغب في إضافة بعض المكتبات لها. ومع نمو حزمة JavaScript الخاصة بك مع كل ميزة جديدة، فقد تضطر إلى معرفة كيفية تقسيم التعليمات البرمجية لكل مسار على حدة. ومع تزايد تعقيد احتياجات جلب البيانات، فمن المحتمل أن تواجه شلالات شبكة الخادم والعميل التي تجعل تطبيقك يبدو بطيئًا للغاية. نظرًا لأن جمهورك يتضمن المزيد من المستخدمين الذين يعانون من ظروف شبكة سيئة وأجهزة منخفضة الأداء، فقد تحتاج إلى إنشاء HTML من مكوناتك لعرض المحتوى مبكرًا - إما على الخادم أو أثناء وقت البناء. قد يكون تغيير الإعداد لتشغيل بعض التعليمات البرمجية الخاصة بك على الخادم أو أثناء البناء أمرًا صعبًا للغاية.

**هذه المشاكل ليست خاصة بـ React. ولهذا السبب فإن Svelte لديه SvelteKit، وVue لديه Nuxt، وما إلى ذلك.** لحل هذه المشاكل بنفسك، ستحتاج إلى دمج bundler الخاص بك مع جهاز التوجيه الخاص بك ومع مكتبة جلب البيانات الخاصة بك. ليس من الصعب تشغيل الإعداد الأولي، ولكن هناك الكثير من التفاصيل الدقيقة المتضمنة في إنشاء تطبيق يتم تحميله بسرعة حتى مع نموه بمرور الوقت. ستحتاج إلى إرسال الحد الأدنى من كود التطبيق ولكن افعل ذلك في رحلة ذهاب وعودة واحدة بين العميل والخادم، بالتوازي مع أي بيانات مطلوبة للصفحة. من المحتمل أن ترغب في أن تكون الصفحة تفاعلية قبل تشغيل كود JavaScript الخاص بك، لدعم التحسين التدريجي. قد ترغب في إنشاء مجلد من ملفات HTML ثابتة تمامًا لصفحات التسويق الخاصة بك والتي يمكن استضافتها في أي مكان ولا تزال تعمل مع تعطيل JavaScript. إن بناء هذه القدرات بنفسك يتطلب عملاً حقيقيًا.

**تحل أطر عمل React الموجودة في هذه الصفحة مشكلات مثل هذه افتراضيًا، دون أي عمل إضافي من جانبك.** فهي تتيح لك البدء بشكل بسيط للغاية ثم توسيع نطاق تطبيقك بما يتناسب مع احتياجاتك. يحتوي كل إطار عمل React على مجتمع، لذا فإن العثور على إجابات للأسئلة وترقية الأدوات أسهل. كما تمنح الأطر هيكلًا لكودك، مما يساعدك أنت والآخرين على الاحتفاظ بالسياق والمهارات بين المشاريع المختلفة. وعلى العكس من ذلك، مع الإعداد المخصص، من الأسهل التعثر في إصدارات التبعية غير المدعومة، وستنتهي في الأساس إلى إنشاء إطار العمل الخاص بك - وإن كان بدون مجتمع أو مسار ترقية (وإذا كان يشبه تلك التي صنعناها في الماضي، فهو مصمم بشكل أكثر عشوائية).

إذا كان تطبيقك يحتوي على قيود غير عادية لا تخدمها هذه الأطر بشكل جيد، أو كنت تفضل حل هذه المشكلات بنفسك، فيمكنك إنشاء إعداد مخصص خاص بك باستخدام React. احصل على `react` و`react-dom` من npm، وقم بإعداد عملية البناء المخصصة الخاصة بك باستخدام حزمة مثل [Vite](https://vitejs.dev/) أو [Parcel](https://parceljs.org/)، وأضف أدوات أخرى حسب الحاجة إليها للتوجيه أو التوليد الثابت أو العرض من جانب الخادم، والمزيد.

</DeepDive>

## أطر عمل React المخصصة للإنتاج {/*production-grade-react-frameworks*/}

These frameworks support all the features you need to deploy and scale your app in production and are working towards supporting our [full-stack architecture vision](#which-features-make-up-the-react-teams-full-stack-architecture-vision). All of the frameworks we recommend are open source with active communities for support, and can be deployed to your own server or a hosting provider. If you’re a framework author interested in being included on this list, [please let us know](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+).

### Next.js {/*nextjs-pages-router*/}

**[Next.js' Pages Router](https://nextjs.org/) is a full-stack React framework.** It's versatile and lets you create React apps of any size--from a mostly static blog to a complex dynamic application. To create a new Next.js project, run in your terminal:

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

If you're new to Next.js, check out the [learn Next.js course.](https://nextjs.org/learn)

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/app/building-your-application/deploying) to any Node.js or serverless hosting, or to your own server. Next.js also supports a [static export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) which doesn't require a server.

### Remix {/*remix*/}

**[Remix](https://remix.run/) is a full-stack React framework with nested routing.** It lets you break your app into nested parts that can load data in parallel and refresh in response to the user actions. To create a new Remix project, run:

<TerminalBlock>
npx create-remix
</TerminalBlock>

If you're new to Remix, check out the Remix [blog tutorial](https://remix.run/docs/en/main/tutorials/blog) (short) and [app tutorial](https://remix.run/docs/en/main/tutorials/jokes) (long).

Remix is maintained by [Shopify](https://www.shopify.com/). When you create a Remix project, you need to [pick your deployment target](https://remix.run/docs/en/main/guides/deployment). You can deploy a Remix app to any Node.js or serverless hosting by using or writing an [adapter](https://remix.run/docs/en/main/other-api/adapter).

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) is a React framework for fast CMS-backed websites.** Its rich plugin ecosystem and its GraphQL data layer simplify integrating content, APIs, and services into one website. To create a new Gatsby project, run:

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

If you're new to Gatsby, check out the [Gatsby tutorial.](https://www.gatsbyjs.com/docs/tutorial/)

Gatsby is maintained by [Netlify](https://www.netlify.com/). You can [deploy a fully static Gatsby site](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) to any static hosting. If you opt into using server-only features, make sure your hosting provider supports them for Gatsby.

### Expo (for native apps) {/*expo*/}

**[Expo](https://expo.dev/) is a React framework that lets you create universal Android, iOS, and web apps with truly native UIs.** It provides an SDK for [React Native](https://reactnative.dev/) that makes the native parts easier to use. To create a new Expo project, run:

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

If you're new to Expo, check out the [Expo tutorial](https://docs.expo.dev/tutorial/introduction/).

Expo is maintained by [Expo (the company)](https://expo.dev/about). Building apps with Expo is free, and you can submit them to the Google and Apple app stores without restrictions. Expo additionally provides opt-in paid cloud services.

## Bleeding-edge React frameworks {/*bleeding-edge-react-frameworks*/}

As we've explored how to continue improving React, we realized that integrating React more closely with frameworks (specifically, with routing, bundling, and server technologies) is our biggest opportunity to help React users build better apps. The Next.js team has agreed to collaborate with us in researching, developing, integrating, and testing framework-agnostic bleeding-edge React features like [React Server Components.](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

These features are getting closer to being production-ready every day, and we've been in talks with other bundler and framework developers about integrating them. Our hope is that in a year or two, all frameworks listed on this page will have full support for these features. (If you're a framework author interested in partnering with us to experiment with these features, please let us know!)

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js's App Router](https://nextjs.org/docs) is a redesign of the Next.js APIs aiming to fulfill the React team’s full-stack architecture vision.** It lets you fetch data in asynchronous components that run on the server or even during the build.

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/app/building-your-application/deploying) to any Node.js or serverless hosting, or to your own server. Next.js also supports [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) which doesn't require a server.

<DeepDive>

#### Which features make up the React team’s full-stack architecture vision? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Next.js's App Router bundler fully implements the official [React Server Components specification](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). This lets you mix build-time, server-only, and interactive components in a single React tree.

For example, you can write a server-only React component as an `async` function that reads from a database or from a file. Then you can pass data down from it to your interactive components:

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

Next.js's App Router also integrates [data fetching with Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). This lets you specify a loading state (like a skeleton placeholder) for different parts of your user interface directly in your React tree:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server Components and Suspense are React features rather than Next.js features. However, adopting them at the framework level requires buy-in and non-trivial implementation work. At the moment, the Next.js App Router is the most complete implementation. The React team is working with bundler developers to make these features easier to implement in the next generation of frameworks.

</DeepDive>