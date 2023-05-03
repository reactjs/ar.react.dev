---
title: ابدأ مشروع React جديد 
---

<Intro>

إذا كنت تريد بناء تطبيق أو موقع جديد كلياً باستخدام React ، ننصح بإختيار أحد إطارات العمل الخاصة بـReact الشعبية في مجتمع React. حيث أن إطارات العمل توفر ميزات سوف يحتاجها أغلب التطبيقات والمواقع ، تتضمن: التوجيه (routing) و جلب البيانات (data fetching) وتوليد HTML.

If you want to build a new app or a new website fully with React, we recommend picking one of the React-powered frameworks popular in the community. Frameworks provide features that most apps and sites eventually need, including routing, data fetching, and generating HTML.

</Intro>

<Note>

**ستحتاج لتنصيب [Node.js](https://nodejs.org/en/) للتطوير المحلي.** يمكنك *أيضا* أن تختار استخدام Node.js في الإنتاج لكن لست بحاجة لذلك ، حيث أن العديد من أطر عمل React تدعم تصدير مجلد ثابت (static) يحوي على HTML/CSS/JS.

**You need to install [Node.js](https://nodejs.org/en/) for local development.** You can *also* choose to use Node.js in production, but you don't have to. Many React frameworks support export to a static HTML/CSS/JS folder.

</Note>

## أطر عمل React على درجة الإنتاج {/*production-grade-react-frameworks*/}

## Production-grade React frameworks {/**/} {/*production-grade-react-frameworks-*/}

### Next.js {/*nextjs*/}

**[Next.js](https://nextjs.org/) هو إطار عمل React كامل (full-stack).** متعدد الاستخدامات حيث يمكّنك من إنشاء تطبيق React بأي حجم -  من مدونة أغلبها ثابت إلى تطبيق دايناميكي معقد. لإنشاء مشروع Next.js جديد ، نفذ في الـterminal:

**[Next.js](https://nextjs.org/) is a full-stack React framework.** It's versatile and lets you create React apps of any size--from a mostly static blog to a complex dynamic application. To create a new Next.js project, run in your terminal:

<TerminalBlock>
npx create-next-app
</TerminalBlock>

لتعلم Next.js ، إطلع على [الدرس تعليمي لـ Next.js](https://nextjs.org/learn/foundations/about-nextjs)


يتم الإشراف على Next.js من قبل [Vercel](https://vercel.com/). تستطيع [نشر تطبيق Next.js](https://nextjs.org/docs/deployment) على أي استضافة Node.js أو serverless ، أو مخدّمك الخاص. [تطبيقات Next.js الثابتة بالكامل](https://nextjs.org/docs/advanced-features/static-html-export) يمكن نشرها على أي استضافة ثابتة.

If you're new to Next.js, check out the [Next.js tutorial.](https://nextjs.org/learn/foundations/about-nextjs)

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/deployment) to any Node.js or serverless hosting, or to your own server. [Fully static Next.js apps](https://nextjs.org/docs/advanced-features/static-html-export) can be deployed to any static hosting.

### Remix {/*remix*/}

**[Remix](https://remix.run/) هو إطار عمل React كامل (full-stack) مع توجيه متداخل (nested routing).** يمكنك من تقسيم تطبيقك إلى أجزاء متداخلة تستطيع تحميل البيانات على التوازي والتحديث استجابةً لأفعال المستخدم. لإنشاء مشروع Remix جديد ، نفذ:

**[Remix](https://remix.run/) is a full-stack React framework with nested routing.** It lets you break your app into nested parts that can load data in parallel and refresh in response to the user actions. To create a new Remix project, run:

<TerminalBlock>
npx create-remix
</TerminalBlock>

لتعلم Remix ، إطلع على [درس المدونة](https://remix.run/docs/en/main/tutorials/blog) (قصير) [ودرس التطبيق](https://remix.run/docs/en/main/tutorials/jokes) (طويل).


يتم الإشراف على Remix من قبل [Shopify](https://www.shopify.com/). عند إنشاء مشروع Remix ستحتاج [لاختيار هدف النشر](https://remix.run/docs/en/main/guides/deployment). يمكنك نشر تطبيق Remix على أي استضافة Node.js أو serverless باستخدام أو كتابة [محول (adapter)](https://remix.run/docs/en/main/other-api/adapter).

If you're new to Remix, check out the Remix [blog tutorial](https://remix.run/docs/en/main/tutorials/blog) (short) and [app tutorial](https://remix.run/docs/en/main/tutorials/jokes) (long).

Remix is maintained by [Shopify](https://www.shopify.com/). When you create a Remix project, you need to [pick your deployment target](https://remix.run/docs/en/main/guides/deployment). You can deploy a Remix app to any Node.js or serverless hosting by using or writing an [adapter](https://remix.run/docs/en/main/other-api/adapter).

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) هو إطار عمل React لمواقع إدارة المحتوى (CMS-backed) السريعة.** حيث يمتلك نظام إضافات (plugin) غني وطبقة بيانات GraphQL لتبسيط إدماج (integrating) المحتوى ، والواجهات البرمجية (APIs) ، والخدمات في موقع واحد. لإنشاء مشروع Gatsby جديد ، نفذ: 


**[Gatsby](https://www.gatsbyjs.com/) is a React framework for fast CMS-backed websites.** Its rich plugin ecosystem and its GraphQL data layer simplify integrating content, APIs, and services into one website. To create a new Gatsby project, run:

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

لتعلم Gatsby ، إطلع على [الدرس التعليمي لـGatsby](https://www.gatsbyjs.com/docs/tutorial/)

تتم إدارة Gatsby من قبل [Netlify](https://www.netlify.com/). تستطيع [نشر موقع Gatsby ثابت بالكامل](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) على أي إستضافة ثابتة. إذا اخترت استخدام ميزات حصرية للمخدّم (server-only) ، تأكد من دعم موّفر إستضافتك لهذه الخدمات لـGatsby.

If you're new to Gatsby, check out the [Gatsby tutorial.](https://www.gatsbyjs.com/docs/tutorial/)

Gatsby is maintained by [Netlify](https://www.netlify.com/). You can [deploy a fully static Gatsby site](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) to any static hosting. If you opt into using server-only features, make sure your hosting provider supports them for Gatsby.

### Expo (لتطبيقات native) {/*expo*/}

### Expo (for native apps) {/*expoo*/}

**[Expo](https://expo.dev/) هو إطار عمل React يمكّنك من إنشاء تطبيقات Android ، وIOS ، وويب شاملة مع واجهات مستخدم (UIs) حقاً أصلية (native).** يوفر مجموعة تطوير برمجيات (SDK) لـ[React Native](https://reactnative.dev/) التي تجعل الأجزاء الأصلية أسهل الاستخدام. لإنشاء مشروع Expo جديد ، نفذ:

**[Expo](https://expo.dev/) is a React framework that lets you create universal Android, iOS, and web apps with truly native UIs.** It provides an SDK for [React Native](https://reactnative.dev/) that makes the native parts easier to use. To create a new Expo project, run:

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

لتعلم Expo ، إطلع على [الدرس التعليمي لـExpo](https://docs.expo.dev/tutorial/introduction/).

يتم إدارة Expo من قبل [Expo (الشركة)](https://expo.dev/about). بناء التطبيقات باستخدام Expo مجاني ، ويمكنك رفعهم إلى متاجر Google وApple بدون قيود. Expo أيضاًَ يوفر اشتراك مدفوع للخدمات السحابية.


If you're new to Expo, check out the [Expo tutorial](https://docs.expo.dev/tutorial/introduction/).

Expo is maintained by [Expo (the company)](https://expo.dev/about). Building apps with Expo is free, and you can submit them to the Google and Apple app stores without restrictions. Expo additionally provides opt-in paid cloud services.

<DeepDive>

#### هل بإمكاني استخدام React بدون إطار عمل؟ {/*can-i-use-react-without-a-framework*/}

#### Can I use React without a framework? {/*can-i-use-react-without-a-frameworkk*/}

يمكن بالتأكيد استخدام React بدون إطار عمل - هكذا  [ستستخدم React لجزء من صفحتك](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **لكن إذا كنت تريد بناء تطبيق أو موقع جديد باستخدام React كلياً ، فننصح باستخدام إطار عمل.**

You can definitely use React without a framework--that's how you'd [use React for a part of your page.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **However, if you're building a new app or a site fully with React, we recommend using a framework.**

والسبب لهذا:

حتى لو كنت لا تحتاج توجيه (routing) أو جلب بيانات (data fetching) بالبداية ، على الأرجح ستضيف مكتبات لأجلهم. مع نمو حزمة JavaScript الخاصة بك مع كل ميزة جديدة ، قد تضطر إلى معرفة كيفية تقسيم الكود لكل مسار على حدة. مع ازدياد حاجة جلب البيانات لديك بالازدياد تعقيداً ، فمن المحتمل أن تواجه شلالات شبكة من الخادم للعميل (server-client network waterfalls) ستجعل تطبيقك يظهر بطيئًا للغاية. مع نمو جمهورك سيضم المزيد من المستخدمين الذين يعانون من ظروف شبكة سيئة وأجهزة منخفضة الجودة ، فقد تحتاج إلى توليد HTML للمكوّنات الخاصة بك لعرض المحتوى مبكرًا - إما على الخادم أو أثناء وقت البناء. قد يكون تغيير بنية مشروعك لتشغيل بعض التعليمات البرمجية على الخادم أو أثناء البناء أمرًا شائكاً للغاية.

Here's why.

Even if you don't need routing or data fetching at first, you'll likely want to add some libraries for them. As your JavaScript bundle grows with every new feature, you might have to figure out how to split code for every route individually. As your data fetching needs get more complex, you are likely to encounter server-client network waterfalls that make your app feel very slow. As your audience includes more users with poor network conditions and low-end devices, you might need to generate HTML from your components to display content early--either on the server, or during the build time. Changing your setup to run some of your code on the server or during the build can be very tricky.

**هذه المشاكل ليست محصورة على React فقط. لهذا Svelte لديها SvelteKit ، و Vue لديها Nuxt ، وما إلى ذلك .** لحل هذه المشكلات بمفردك ، ستحتاج إلى دمج الحزمة الخاصة بك مع جهاز توجيهك ومع مكتبتك لجلب البيانات. ليس من الصعب تشغيل الإعداد الأولي ، ولكن هناك الكثير من التفاصيل الدقيقة المتضمنة في إنشاء تطبيق يتم تحميله بسرعة حتى مع نموه بمرور الوقت. سترغب في إرسال الحد الأدنى من كود التطبيق ، ولكن برحلة ذهاب وإياب واحدة بين العميل والخادم ، بالتوازي مع أي بيانات مطلوبة للصفحة. على الأرجح سترغب أن تكون الصفحة تفاعلية (interactive) قبل تشغيل أي كود JavaScript ، وذلك لدعم التحسين التدريجي  (progressive enhancement). قد ترغب في إنشاء مجلد من ملفات HTML الثابتة تمامًا لصفحات التسويق الخاصة بك والتي يمكن استضافتها في أي مكان والتي تعمل مع تعطيل JavaScript. بناء هذه القدرات بنفسك يتطلب عملاً جاداً.

**These problems are not React-specific. This is why Svelte has SvelteKit, Vue has Nuxt, and so on.** To solve these problems on your own, you'll need to integrate your bundler with your router and with your data fetching library. It's not hard to get an initial setup working, but there are a lot of subtleties involved in making an app that loads quickly even as it grows over time. You'll want to send down the minimal amount of app code but do so in a single client–server roundtrip, in parallel with any data required for the page. You'll likely want the page to be interactive before your JavaScript code even runs, to support progressive enhancement. You may want to generate a folder of fully static HTML files for your marketing pages that can be hosted anywhere and still work with JavaScript disabled. Building these capabilities yourself takes real work.

**تقوم أطر عمل React في هذه الصفحة بحل مشكلات كهؤلاء افتراضيًا ، بدون أي عمل إضافي من جانبك.** حيث يتيحون لك البدء بمرونة شديدة ثم توسيع نطاق تطبيقك وفقًا لاحتياجاتك. يحتوي كل إطار عمل في React على مجتمع خاص به ، لذا فإن العثور على إجابات للأسئلة وترقية الأدوات أسهل. توفر الأطر أيضًا بنية لكودك ، مما يساعدك أنت والآخرين على الاحتفاظ بالسياق والمهارات بين المشاريع المختلفة. العكس بالعكس ، مع بنية مشروع مخصصة سيكون من الأسهل أن تعلق على نسخة تبعية (dependency) غير مدعومة. وسينتهي بك الأمر فعلياً إلى إنشاء إطار العمل الخاص بك - وسيكون بدون مجتمع أو مسار ترقية (وفي حال كونه مشابه لما صنعناه في الماضي ، فسيتم تصميمه عشوائياً).

إذا كنت لا تزال غير مقتنع ، أو أن تطبيقك به قيود غير معتادة لا تخدمها هذه الأطر جيدًا وتريد تشغيل إعداد مخصص خاص بك ، لا يمكننا منعك - قم بذلك! أجلب `react` و `react-dom` من npm ، قم بإعداد عملية بنائك المخصصة  باستخدام أداة تجميع (bundler) كـ[Vite](https://vitejs.dev/) أو [Parcel](https://parceljs.org/) ، وقم بإضافة أدوات أخرى حسب حاجتك إليها للتوجيه أو التوليد الثابت (static generation) أو العرض من جانب الخادم (server-side rendering) ، وما إلى ذلك.

**React frameworks on this page solve problems like these by default, with no extra work from your side.** They let you start very lean and then scale your app with your needs. Each React framework has a community, so finding answers to questions and upgrading tooling is easier. Frameworks also give structure to your code, helping you and others retain context and skills between different projects. Conversely, with a custom setup it's easier to get stuck on unsupported dependency versions, and you'll essentially end up creating your own framework—albeit one with no community or upgrade path (and if it's anything like the ones we've made in the past, more haphazardly designed).

If you're still not convinced, or your app has unusual constraints not served well by these frameworks and you'd like to roll your own custom setup, we can't stop you--go for it! Grab `react` and `react-dom` from npm, set up your custom build process with a bundler like [Vite](https://vitejs.dev/) or [Parcel](https://parceljs.org/), and add other tools as you need them for routing, static generation or server-side rendering, and more.
</DeepDive>

## إطر React متطورة (bleeding-edge) {/*bleeding-edge-react-frameworks*/}

## Bleeding-edge React frameworks {/*bleeding-edge-react-frameworkss*/}

أثناء بحثنا لكيفية الاستمرار في تحسين React ، أدركنا أن إدماج React بشكل أوثق مع أطر العمل (على وجه التحديد ، مع تقنيات التوجيه والتجميع (bundling) والخادم) هو أكبر فرصة لنا لمساعدة مستخدمي React في بناء تطبيقات أفضل. وافق فريق Next.js على التعاون معنا في البحث والتطوير والإدماج والاختبار لميزات React حيادية الإطار مثل [مكوّنات المخدّم (Server Components) لـReact](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

تقترب هذه الميزات من أن تكون جاهزة للإنتاج كل يوم ، ونحن نجري محادثات مع مطوري أدوات التجميع وأطر العمل الآخرين حول كيفية إدماجها. نأمل أن جميع الأطر المدرجة في هذه الصفحة ستقدم دعم كامل لهذه الميزات في غضون عام أو عامين. (إذا كنت مؤلف إطار عمل مهتمًا بالشراكة معنا لتجربة هذه الميزات ، قم التواصل معنا!)

As we've explored how to continue improving React, we realized that integrating React more closely with frameworks (specifically, with routing, bundling, and server technologies) is our biggest opportunity to help React users build better apps. The Next.js team has agreed to collaborate with us in researching, developing, integrating, and testing framework-agnostic bleeding-edge React features like [React Server Components.](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

These features are getting closer to being production-ready every day, and we've been in talks with other bundler and framework developers about integrating them. Our hope is that in a year or two, all frameworks listed on this page will have full support for these features. (If you're a framework author interested in partnering with us to experiment with these features, please let us know!)

### Next.js (موجه التطبيق) {/*nextjs-app-router*/}

**[موجه تطبيق Next.js](https://beta.nextjs.org/docs/getting-started) هو عبارة عن إعادة تصميم للواجهات البرمجية (APIs) الخاصة بـNext.js بهدف تحقيق رؤية فريق React للمعمارية الكاملة (full-stack).** يتيح لك جلب البيانات في مكوّنات غير متزامنة (asynchronous components) تعمل على الخادم أو حتى أثناء البناء.

تتم إدارة Next.js من قبل [Vercel](https://vercel.com/). يمكنك [نشر تطبيق Next.js](https://nextjs.org/docs/deployment) على أي استضافة Node.js أو serverless ، أو مخدّمك الخاص. أيضا Next.js تدعم [التصدير الثابت (static export)](https://beta.nextjs.org/docs/configuring/static-export) والذي لا يحتاج إلى مخدّم.

### Next.js (App Router) {/*nextjs-app-routerr*/}

**[Next.js's App Router](https://beta.nextjs.org/docs/getting-started) is a redesign of the Next.js APIs aiming to fulfill the React team’s full-stack architecture vision.** It lets you fetch data in asynchronous components that run on the server or even during the build.

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/deployment) to any Node.js or serverless hosting, or to your own server. Next.js also supports [static export](https://beta.nextjs.org/docs/configuring/static-export) which doesn't require a server.
<Pitfall>

موجه تطبيق Next.js  **حاليًا في المرحلة التجريبية ولا ينصح باستخدامه بالإنتاج بعد** (مارس 2023). لتجربته في مشروع Next.js موجود ، [اتبع هذا الدليل للترحيل التدريجي](https://beta.nextjs.org/docs/upgrade-guide#migrating-from-pages-to-app).

Next.js's App Router is **currently in beta and is not yet recommended for production** (as of Mar 2023). To experiment with it in an existing Next.js project, [follow this incremental migration guide](https://beta.nextjs.org/docs/upgrade-guide#migrating-from-pages-to-app).

</Pitfall>

<DeepDive>

#### ماهي الميزات التي تكوّن رؤية فريق React للبنية الكاملة؟ {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

#### Which features make up the React team’s full-stack architecture vision? {/*which-features-make-up-the-react-teams-full-stack-architecture-visionn*/}

تقوم أداة تجميع (bundler) موجه التطبيق لـ Next.js بتطبيق [مواصفات مكوّنات المخدّم لـReact](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) بشكل كامل. حيث تتيح لك المزج بين مكوّنات وقت البناء و مكوّنات الخادم فقط (server-only) والمكوّنات التفاعلية في شجرة React واحدة.

على سبيل المثال ، يمكنك كتابة مكوّن React خادم فقط كتابع غير متزامن 'async' يقرأ من قاعدة بيانات أو من ملف. ثم يمكنك تمرير البيانات منه إلى مكوّناتك التفاعلية:

Next.js's App Router bundler fully implements the official [React Server Components specification](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). This lets you mix build-time, server-only, and interactive components in a single React tree.

For example, you can write a server-only React component as an `async` function that reads from a database or from a file. Then you can pass data down from it to your interactive components:
```js
// هذا المكّون يتم تنفيذه فقط على المخدّم (أو خلال البناء)
// This component runs *only* on the server (or during the build).
async function Talks({ confId }) {
  // 1. أنت على المخدّم ، يمكنك التحدث إلى طبقة البيانات الخاصة بك ، لا يوجد حاجة لنقطة نهاية (endpoint) ِAPI 
  // 1. You're on the server, so you can talk to your data layer. API endpoint not required.
  const talks = await db.Talks.findAll({ confId });

  // 2. أضف اي كمية من منطق عرض (rendering logic). لأنها لن تجعل حزمة JavaScript أكبر.
  // 2. Add any amount of rendering logic. It won't make your JavaScript bundle larger.
  const videos = talks.map(talk => talk.video);

  // 3. مرر البيانات أسفلاً للمكوّنات التي سوف يتم تنفيذها في المتصفح
  // 3. Pass the data down to the components that will run in the browser.
  return <SearchableVideoList videos={videos} />;
}
```

موجه التطبيق لـNext.js يقوم أيضاّ بإدماج [جلب البيانات مع التعليق (suspense)](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). يتيح لك هذا تحديد حالة تحميل (كعنصر نائب هيكلي) لأجزاء مختلفة من واجهة المستخدم مباشرةً في شجرة React:

Next.js's App Router also integrates [data fetching with Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). This lets you specify a loading state (like a skeleton placeholder) for different parts of your user interface directly in your React tree:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

مكوّنات الخادم والتعليق هي ميزات React وليست ميزات Next.js. ومع ذلك ، فإن تبنيها على مستوى إطار العمل يتطلب دعمًا وعملًا تطبيقياً غير تافه. في الوقت الحالي ، يعد موجه تطبيقات Next.js هو التطبيق الأكثر اكتمالاً. يعمل فريق React مع مطوري أدوات التجميع لتسهيل تطبيق هذه الميزات في الجيل التالي من أطر العمل.

Server Components and Suspense are React features rather than Next.js features. However, adopting them at the framework level requires buy-in and non-trivial implementation work. At the moment, the Next.js App Router is the most complete implementation. The React team is working with bundler developers to make these features easier to implement in the next generation of frameworks.

</DeepDive>
