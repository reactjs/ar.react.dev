---
title: ابدأ مشروع React جديد
---

<Intro>

إذا كنت تريد بناء تطبيق جديد أو موقع ويب جديد باستخدام React بشكل كامل، فنحن نوصي باختيار أحد الأُطر المبنية على React والشائعة في مجتمع المطورين.

</Intro>

يمكنك استخدام React بدون إطار عمل، لكننا وجدنا أن معظم التطبيقات والمواقع تنتهي بإنشاء حلول لمشاكل شائعة مثل تقسيم الشيفرة (code-splitting)، والتوجيه (routing)، وجلب البيانات (data fetching)، وتوليد ملفات HTML. هذه المشاكل شائعة بين جميع مكتبات واجهات المستخدم (UI libraries)، وليست خاصة بـ React فقط.

ومن خلال البدء باستخدام إطار عمل، يمكنك الانطلاق مع React بسرعة، وتجنب بناء إطار عمل خاص بك لاحقًا بشكل غير مقصود.

<DeepDive>

#### هل يمكنني استخدام React دون الحاجة الى إطار عمل {/*can-i-use-react-without-a-framework*/}

يمكنك بالتأكيد إستخدام React بدون إطار عمل - فهذه بالفعل هي الطريقة التي سوف تبدأ بها عادة عند إضافة React تدريجيا إلى موقع موجود [إستخدام React في جزء من صفحتك.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **ومع ذلك، إذا كنت تبني تطبيقًا جديدًا أو موقعًا كاملاً باستخدام React، فنحن نوصي بإستخدام إطار عمل.**

إليك السبب.

حتى لو لم تكن بحاجة إلى التوجيه (routing) أو جلب البيانات (data fetching) في البداية، فمن المحتمل أن ترغب لاحقًا في إضافة بعض المكتبات لذلك. ومع ازدياد حجم حزمة JavaScript الخاصة بك مع كل ميزة جديدة، قد تضطر إلى التفكير في كيفية تقسيم الشيفرة (split code) لكل مسار على حدة. ومع تعقد احتياجاتك لجلب البيانات (data fetching)، من المحتمل أن تواجه ما يُعرف بـ (server-client network waterfalls) بين الخادم والعميل، مما يجعل تطبيقك يبدو بطيئًا جدًا. ومع زيادة جمهورك ليشمل مستخدمين لديهم شبكات ضعيفة وأجهزة منخفضة الأداء، قد تحتاج إلى توليد HTML من عناصر خاصة بك لعرض محتوى مسبق - سواء على الخادم أو أثناء عملية البناء. تغيير إعداداتك لتشغيل بعض الشيفرات على الخادم أو أثناء البناء يمكن أن يكون معقدًا جدًا.

**هذه المشاكل ليست خاصة بـ React. لهذا السبب يحتوي Svelte على SvelteKit، وVue على Nuxt، الخ...** لحل هذه المشاكل بنفسك، سوف تحتاج إلى ربط أداة التجميع (bundler) الخاصة بك مع الموجه (router) ومكتبتك لجلب البيانات (data fetching). ليس من الصعب عمل إعداد أولي، لكن هناك العديد من التفاصيل الدقيقة لجل التطبيق يحمل بشكل أسرع حتى مع نمو التطبيق مع الوقت، قد ترغب في إرسال الحد الادنى من كود التطبيق لكن بطريقة تتيح رحلة واحدة بين السيرفر والعميل، بالتوازي مع أي بيانات مطلوبة للصفحة. من المحتمل أن ترغب في ان تكون الصفحة تفاعلية قبل ان يقوم JavaScript بالعمل، لدعم التحسين التدرجي (progressive enhancement). قد ترغب أيضًا في إنشاء مجلد يحتوي على ملفات HTML ثابة (static HTML files) لصفحات التسويق التي يمكن استضافتها في أي مكان وتعمل مع تعطيل JavaScript. بناء هذه القدرات بنفسك يتطلب جهد كبير.

**اطارت عمل React الموجودة في هذه الصفحة تحل هذه المشاكل بشكل افتراضي، دون أي جهد إضافي من جانبك.** تتيح لك هذه الاطارات البدء بطريقة بسيطة وخفيفة، ثم توسيع تطبيقك حسب احتياجاتك. لكل إطار React مجتمع خاص به، مما يسهل العثور على إجابات للأسئلة وتحديث الأدوات المستخدمة. كما تمنحك الأطارات بنية منظمة لكودك مما يساعدك أنت والآخرين على الاحتفاظ بالسياق والمهارات بين المشاريع المختلفة. بينما، مع الإعداد المخصص من الأسهل أن تواجه مشاكل مع إصدارات التبعيات غير المدعومة، وفي النهاية ستنتهي بإنشاء إطار عمل خاص بك—وإن كان بدون مجتمع داعم أو مسار ترقية، (وإذا كان مشابهًا لما أنشأناه في السابق، سيكون تصميمه أكثر عشوائية).

إذا كان لتطبيقك قيود غير معتادة لا تلبيها هذه الأطر جيدًا، أو كنت تفضل حل هذه المشاكل بنفسك، يمكنك إنشاء إعداد مخصص باستخدام React. قم بتثبيت `react` و `react-dom` من npm، وأعد إعداد عملية البناء الخاصة بك باستخدام أداة تجميع مثل [Vite](https://vitejs.dev/) أو [Parcel](https://parceljs.org/)، وأضف الأدوات الأخرى حسب حاجتك للتوجيه (routing)، أو التوليد الثابت (static generation)، أو العرض من جانب الخادم (server-side rendering)، والمزيد.

</DeepDive>

## إطارات React الجاهزة للإنتاج (Production-grade) {/*production-grade-react-frameworks*/}

تدعم هذه الإطارات جميع المميزات التي تحتاجها لنشر وتوسيع تطبيقك في بيئة الإنتاج، وتعمل على دعم رؤيتنا للمعمارية الكاملة للتطبيقات [full-stack architecture vision](#which-features-make-up-the-react-teams-full-stack-architecture-vision). جميع الأطر التي نوصي بها مفتوحة المصدر ولها مجتمعات نشطة لدعم المستخدمين، ويمكن نشرها على خادمك الخاص أو على مزود استضافة. إذا كنت مؤلفًا لإطار عمل وترغب في إضافته إلى هذه القائمة، [يرجى إعلامنا](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+).

### Next.js {/*nextjs-pages-router*/}

**[Next.js' Pages Router](https://nextjs.org/) هو إطار React كامل (full-stack).** يتميز بالمرونة ويتيح لك إنشاء تطبيقات React بأي حجم -- من مدونة ثابة الى تطبيق ديناميكي معقد.
لإنشاء مشروع Next.js جديد، قم بتنفيذ الأوامر التالية في terminal:

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

هل انت جديد على Next.js, إطلاع عليها [learn Next.js course.](https://nextjs.org/learn)

Next.js يتم المحافظة عليها من قبل [Vercel](https://vercel.com/). يمكنك [إطلاع تطبيق Next.js](https://nextjs.org/docs/app/building-your-application/deploying) على اي Node.js أو إستضافة بدون خادم (serverless hosting), أو سيرفرك الخاص. Next.js ايضا تدعم [static export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) والتي لا تتطلب سيرفر

### Remix {/*remix*/}

**[Remix](https://remix.run/)  هو إطار React كامل (full-stack) مع nested routing.** يتيح لك تقسيم تطبيقك إلى أجزاء متداخلة يمكنها تحميل البيانات بالتوازي (parallel) والتحديث لأستجابة (response) المستخدم.
لإنشاء مشروع Remix جديد، قم بتنفيذ الأوامر التالية في terminal:

<TerminalBlock>
npx create-remix
</TerminalBlock>

هل انت جديد على Remix, إطلاع عليها [blog tutorial](https://remix.run/docs/en/main/tutorials/blog) (قصير) و [app tutorial](https://remix.run/docs/en/main/tutorials/jokes) (مفصل).

Remix يتم المحافظة عليها من قبل [Shopify](https://www.shopify.com/). عندما تقوم بإنشاء مشروع Remix, تحتاج [لإختيار هدف النشر](https://remix.run/docs/en/main/guides/deployment).يمكنك إطلاق تطبيق Remix على اي Node.js  أو إستضافة بدون خادم (serverless hosting) عن طريق استخدام او كتابة [adapter](https://remix.run/docs/en/main/other-api/adapter).

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) هو إطار React لموقع CMS-backed سريع.** يُبسّط نظام الإضافات الغني فيه وطبقة البيانات GraphQL دمج المحتوى وواجهات برمجة التطبيقات (APIs) والخدمات المختلفة في موقع واحد.
لإنشاء مشروع Gatsby جديد، قم بتنفيذ الأوامر التالية في terminal:

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

هل انت جديد على Gatsby, إطلاع عليها [Gatsby tutorial.](https://www.gatsbyjs.com/docs/tutorial/)

Gatsby يتم المحافظة عليها من خلال [Netlify](https://www.netlify.com/). يمكنك [إطلاق موقع Gatsby ثابة بالكامل](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) لأي استضافة ثابة. إذا كنت قد اخترت إستخدام مميزات خاصة بالسيرفر فقط فتأكد من أن مزود الإستضافة الخاص بك يدعمها باستخدام Gatsby.

### Expo (لتطبيقات الأجهزة  – Native Apps) {/*expo*/}

**[Expo](https://expo.dev/) هو إطار عمل React يتيح لك إنشاء تطبيقات شاملة تعمل على أندرويد وiOS والويب، مع واجهات مستخدم أصلية (truly native UIs) بالكامل.** يوفر مجموعة أدوات تطوير برمجيات (SDK) لـ [React Native](https://reactnative.dev/) ويُسهّل التعامل مع الأجزاء الأصلية (native) داخل التطبيق.
لإنشاء مشروع Expo جديد، قم بتنفيذ الأوامر التالية في terminal:
<TerminalBlock>
npx create-expo-app
</TerminalBlock>

هل انت جديد على Expo, إطلاع عليها [Expo tutorial](https://docs.expo.dev/tutorial/introduction/).

Expo يتم المحافظة عليها من خلال [Expo (the company)](https://expo.dev/about). بناء التطبيقات مع Expo مجانا, ويمكنك من رفع تطبيقك على Google و Apple متجر التطبيقات دون التسجيل. Expo يوفر ايضا خدمات سحابية مدفوعة.

## إطارات React المتقدمة جدًا (Bleeding-edge) {/*bleeding-edge-react-frameworks*/}

بينما استكشفنا طرقًا لمواصلة تحسين React، أدركنا أن دمج React بشكل أعمق مع الأطر — خاصة فيما يتعلق بالتوجيه (routing)، والتجميع (bundling)، وتقنيات الخادم (server technologies) — يمثل أكبر فرصة لنا لمساعدة مستخدمي React على بناء تطبيقات أفضل. وقد وافق فريق Next.js على التعاون معنا في البحث والتطوير والدمج واختبار ميزات React المتقدمة جدًا وغير المرتبطة بأي إطار محدد، مثل [React Server Components.](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

تقترب هذه الميزات يومًا بعد يوم من أن تصبح جاهزة للإنتاج، وقد أجرينا محادثات مع مطوري أدوات التجميع (bundler) والأطر الأخرى حول دمجها. نأمل أنه خلال سنة أو سنتين، ستدعم جميع الأطر المدرجة في هذه الصفحة هذه الميزات بالكامل. (إذا كنت مؤلفًا لإطار عمل وترغب في التعاون معنا لتجربة هذه الميزات، يرجى إعلامنا!)

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js's App Router](https://nextjs.org/docs) هو إعادة تصميم لواجهات برمجة تطبيقات Next.js تهدف إلى تحقيق رؤية فريق React للمعمارية الكاملة للتطبيقات (full-stack architecture vision).** يتيح لك جلب البيانات في مكونات غير متزامنة (asynchronous components) تعمل على الخادم أو حتى أثناء عملية البناء (build).

Next.js يتم المحافظة عليها من قبل [Vercel](https://vercel.com/). يمكنك [إطلاق تطبيق Next.js](https://nextjs.org/docs/app/building-your-application/deploying) على اي Node.js أو إستضافة بدون خادم (serverless hosting), أو سيرفرك الخاص. Next.js  تدعم ايضا [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) والتي لا تحتاج الى سيرفر.

<DeepDive>

#### ما هي الميزات التي تُكوّن رؤية فريق React للمعمارية الكاملة للتطبيقات (full-stack architecture vision)؟ {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

أداة التجميع (bundler) في **Next.js App Router** تنفذ بالكامل المعايير الرسمية لـ [React Server Components specification](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). يتيح لك هذا دمج المكونات التي تُبنى أثناء وقت البناء (build-time)، والمكونات الخاصة بالخادم فقط (server-only)، والمكونات التفاعلية (interactive) ضمن شجرة React واحدة.

على سبيل المثال، يمكنك كتابة مكون React خاص بالخادم فقط (server-only) كمكون `async` دالة تقوم بالقراءة من قاعدة بيانات أو من ملف. بعد ذلك، يمكنك تمرير البيانات من هذه الدالة إلى مكوناتك التفاعلية:

```js
// يعمل هذا المكون **فقط** على الخادم (أو أثناء عملية البناء).
async function Talks({ confId }) {
  // 1. أنت تعمل على الخادم، لذا يمكنك التفاعل مباشرة مع طبقة البيانات الخاصة بك. لا حاجة لإنشاء نقطة نهاية واجهة التطبيقات.
  const talks = await db.Talks.findAll({ confId });

  // 2. أضف أي كمية من منطق العرض . هذا لن يزيد من حجم حزمة جافاسكربت الخاصة بك.
  const videos = talks.map(talk => talk.video);

  // 3. قم بتمرير البيانات إلى المكونات التي ستعمل في المتصفح.
  return <SearchableVideoList videos={videos} />;
}
```

Next.js's كما يدمج App Router أيضًا [data fetching with Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). يتيح لك ذلك تحديد حالة تحميل (مثل عنصر skeleton placeholder) لأجزاء مختلفة من واجهة المستخدم مباشرةً داخل شجرة React الخاصة بك:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

مكونات الخادم (Server Components) وميزة الانتظار (Suspense) هي ميزات تابعة لـ React وليست خاصة بـ Next.js. ومع ذلك، اعتمادها على مستوى الإطار يتطلب دعمًا وتنفيذًا غير بسيط. حاليًا، يُعد **Next.js App Router** أكثر تنفيذ كامل لهذه الميزات. يعمل فريق React مع مطوري أدوات التجميع (bundler) لتسهيل تنفيذ هذه الميزات في الجيل القادم من الأطر.

</DeepDive>