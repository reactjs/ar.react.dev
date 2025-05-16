---
title: بدء مشروع React جديد
---

<Intro>

إذا كنت ترغب في بناء تطبيق جديد أو موقع ويب جديد بالكامل باستخدام React، نوصي باختيار أحد الأطر المدعومة بـ React والتي تحظى بشعبية في المجتمع.

</Intro>


يمكنك استخدام React بدون إطار عمل، ولكننا وجدنا أن معظم التطبيقات والمواقع في النهاية تبني حلولاً لمشاكل شائعة مثل تقسيم الكود، التوجيه، جلب البيانات، وتوليد HTML. هذه المشاكل شائعة لجميع مكتبات واجهات المستخدم، وليست مقتصرة على React فقط.

ببدء العمل بإطار عمل، يمكنك البدء بسرعة مع React، وتجنب بناء إطار عمل خاص بك لاحقاً.

<DeepDive>

#### هل يمكنني استخدام React بدون إطار عمل؟ {/*can-i-use-react-without-a-framework*/}

يمكنك بالتأكيد استخدام React بدون إطار عمل — هكذا يمكنك [استخدام React لجزء من صفحتك. ](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **ومع ذلك، إذا كنت تبني تطبيقًا جديدًا أو موقعًا بالكامل باستخدام React، فنوصي باستخدام إطار عمل.**

إليك السبب:

حتى إذا لم تكن بحاجة إلى routing  أو جلب البيانات في البداية، فستحتاج على الأرجح إلى إضافة بعض المكتبات لهذه الأمور. مع زيادة حجم حزمة JavaScript مع كل ميزة جديدة، قد تحتاج إلى معرفة كيفية تقسيم الكود لكل مسار على حدة. مع تزايد تعقيد احتياجات جلب البيانات، قد تواجه حالات من تدفقات الشبكة بين الخادم والعميل تجعل تطبيقك يبدو بطيئًا جدًا. ومع تزايد عدد المستخدمين الذين يعانون من ظروف شبكة ضعيفة وأجهزة منخفضة الأداء، قد تحتاج إلى توليد HTML من مكوناتك لعرض المحتوى مبكرًا — إما على الخادم أو أثناء وقت البناء. يمكن أن يكون تغيير إعداداتك لتشغيل بعض من كودك على الخادم أو أثناء البناء معقدًا جدًا.

**هذه المشاكل ليست خاصة بـ React. لهذا السبب، يحتوي Svelte على SvelteKit، وVue على Nuxt،** وهكذا. لحل هذه المشاكل بنفسك، ستحتاج إلى دمج أداة البناء الخاصة بك مع router الخاص بك ومع مكتبة جلب البيانات. ليس من الصعب الحصول على إعداد أولي يعمل، ولكن هناك الكثير من التفاصيل المتضمنة في جعل التطبيق يتحمل تحميلًا سريعًا حتى مع نموه بمرور الوقت. ستريد إرسال الحد الأدنى من كود التطبيق ولكن في جولة واحدة بين العميل والخادم، بالتوازي مع أي بيانات مطلوبة للصفحة. من المحتمل أن ترغب في أن تكون الصفحة تفاعلية قبل تشغيل كود JavaScript الخاص بك، لدعم التحسين التدريجي. قد ترغب في توليد مجلد من ملفات HTML ثابتة بالكامل لصفحات التسويق الخاصة بك التي يمكن استضافتها في أي مكان وتعمل حتى مع تعطيل JavaScript. بناء هذه القدرات بنفسك يتطلب عملًا حقيقيًا.

**تقوم أطر React على هذه الصفحة بحل مشاكل مثل هذه بشكل افتراضي، دون الحاجة إلى عمل إضافي من جانبك.** تتيح لك البدء بطريقة خفيفة ثم توسيع تطبيقك وفقًا لاحتياجاتك. لكل إطار عمل React مجتمع، لذا فإن العثور على إجابات للأسئلة وترقية الأدوات أسهل. توفر الأطر أيضًا بنية لكودك، مما يساعدك وأشخاص آخرين في الحفاظ على السياق والمهارات بين المشاريع المختلفة. على العكس من ذلك، مع إعداد مخصص، من الأسهل أن تعلق على إصدارات التبعية غير المدعومة، وستنتهي أساسًا بإنشاء إطار عمل خاص بك—رغم أنه بدون مجتمع أو مسار ترقية (وإذا كان مشابهًا لتلك التي قمنا بإنشائها في الماضي، سيكون أكثر تصميمًا عشوائيًا).

إذا كان لتطبيقك قيود غير عادية لا تلبيها هذه الأطر بشكل جيد، أو إذا كنت تفضل حل هذه المشاكل بنفسك، يمكنك  إعداد مخصص باستخدام React. احصل على react و react-dom من npm، واضبط عملية البناء المخصصة الخاصة بك باستخدام أداة بناء مثل [Vite](https://vitejs.dev/) أو [Parcel](https://parceljs.org/), وأضف أدوات أخرى حسب الحاجة للتوجيه أو التوليد الثابت أو التقديم من جانب الخادم، وأكثر.
</DeepDive>

## أطر React جاهزة للإنتاج {/*production-grade-react-frameworks*/}

تدعم هذه الأطر جميع الميزات التي تحتاجها لنشر وتوسيع تطبيقك في بيئة الإنتاج وتعمل على دعم  [full-stack architecture vision](#which-features-make-up-the-react-teams-full-stack-architecture-vision). لدينا. جميع الأطر التي نوصي بها مفتوحة المصدر ولها مجتمعات نشطة للدعم، ويمكن نشرها على خادمك الخاص أو مزود استضافة. إذا كنت مؤلف إطار عمل مهتمًا بأن تكون مدرجًا في هذه القائمة،[يرجى إبلاغنا.](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+).

### Next.js {/*nextjs-pages-router*/}

**[Router في Next.js ](https://nextjs.org/) هو إطار عمل React كامل النطاق.** إنه متعدد الاستخدامات ويسمح لك بإنشاء تطبيقات React بأي حجم — من مدونة ثابتة إلى تطبيق ديناميكي معقد. لإنشاء مشروع Next.js جديد، نفّذ الأمر التالي في نافذة الأوامر الخاصة بك:

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

إذا كنت جديدًا على Next.js، تحقق من  [ دورة تعلم Next.js.](https://nextjs.org/learn)

يتم صيانة Next.js بواسطة [Vercel](https://vercel.com/). يمكنك  [ استضافة تطبيق Next.js ](https://nextjs.org/docs/app/building-your-application/deploying) على أي استضافة Node.js أو استضافة بدون خادم، أو على خادمك الخاص. يدعم Next.js أيضً [تصدير ثابت](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)  لا يتطلب خادمًا.

### Remix {/*remix*/}

**[Remix](https://remix.run/) هو إطار عمل React كامل النطاق مع routing المتداخل. يتيح لك تقسيم تطبيقك إلى أجزاء متداخلة يمكنها** تحميل البيانات بشكل متوازٍ وتحديثها استجابةً لأفعال المستخدم. لإنشاء مشروع Remix جديد، نفّذ:

<TerminalBlock>
npx create-remix
</TerminalBlock>

إذا كنت جديدًا على Remix، تحقق من [دورة المدونةl](https://remix.run/docs/en/main/tutorials/blog) (قصير) و [دورة التطبيق](https://remix.run/docs/en/main/tutorials/jokes) (طويل).

يتم صيانة Remix بواسطة  [Shopify](https://www.shopify.com/). عند إنشاء مشروع Remix، تحتاج إلى [ اختيار هدف الاستضافة](https://remix.run/docs/en/main/guides/deployment) يمكنك استضافة تطبيق Remix على أي استضافة Node.js أو استضافة بدون خادم باستخدام أو كتابة [adapter](https://remix.run/docs/en/main/other-api/adapter).

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) هو إطار عمل React لمواقع الويب السريعة المدعومة بنظام إدارة المحتوى (CMS).**  تسهّل مجموعة الإضافات الغنية وطبقة بيانات GraphQL دمج المحتوى، وواجهات البرمجة، والخدمات في موقع واحد. لإنشاء مشروع Gatsby جديد، نفّذ:

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

إذا كنت جديدًا على Gatsby، تحقق من [دورة Gatsby التعليمية.](https://www.gatsbyjs.com/docs/tutorial/)

يتم صيانة Gatsby بواسطة[Netlify](https://www.netlify.com/). يمكنك  [ استضافة موقع Gatsby ثابت بالكامل](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting)  على أي استضافة ثابتة. إذا اخترت استخدام الميزات الخاصة بالخادم فقط، تأكد من أن مزود الاستضافة يدعمها لـ Gatsby.

### Expo (لتطبيقات الأجهزة المحمولة) {/*expo*/}

**[Expo](https://expo.dev/) هو إطار عمل React يتيح لك إنشاء تطبيقات عالمية لأنظمة Android وiOS والويب بواجهات مستخدم أصلية تمامًا.** يوفر SDK لـ[React Native](https://reactnative.dev/) مما يجعل الأجزاء الأصلية أسهل في الاستخدام. لإنشاء مشروع Expo جديد، نفّذ:

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

إذا كنت جديدًا على Expo، تحقق من [دورة Expo التعليمية](https://docs.expo.dev/tutorial/introduction/).

تتم صيانة Expo بواسطة  [Expo (الشركة)](https://expo.dev/about). بناء التطبيقات باستخدام Expo مجاني، ويمكنك تقديمها إلى متاجر تطبيقات Google وApple دون قيود. بالإضافة إلى ذلك، توفر Expo خدمات سحابية مدفوعة قابلة للتفعيل.

## أطر React المتقدمة للغاية {/*bleeding-edge-react-frameworks*/}

بينما استكشفنا كيفية تحسين React، أدركنا أن دمج React بشكل أكثر قربًا مع الأطر (خصوصًا، مع التوجيه ، والتجميع، وتقنيات الخادم) هو أكبر فرصة لدينا لمساعدة مستخدمي React على بناء تطبيقات أفضل. وافق فريق Next.js على التعاون معنا في البحث والتطوير والتكامل واختبار ميزات React المتقدمة المستقلة عن الأطر مثل [مكونات خادم React.](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

تقترب هذه الميزات من أن تكون جاهزة للإنتاج كل يوم، وقد كنا في محادثات مع مطوري أدوات التجميع والأطر الأخرى حول دمجها. أملنا هو أنه بعد عام أو عامين، ستدعم جميع الأطر المدرجة في هذه الصفحة هذه الميزات بالكامل. (إذا كنت مؤلف إطار عمل مهتمًا بالشراكة معنا لتجربة هذه الميزات، يرجى إبلاغنا!)

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js's App Router](https://nextjs.org/docs)هو إعادة تصميم لواجهات Next.js تهدف إلى تحقيق رؤية فريق React ل full-stack architecture**  يتيح لك جلب البيانات في مكونات غير متزامنة تعمل على الخادم أو حتى أثناء البناء.

يتم صيانة Next.js بواسطة [Vercel](https://vercel.com/). يمكنك  [ استضافة تطبيق Next.js](https://nextjs.org/docs/app/building-your-application/deploying) على أي استضافة Node.js أو استضافة بدون خادم، أو على خادمك الخاص. يدعم Next.js أيضًا[ التصدير الثابت](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)  الذي لا يتطلب خادمًا.
<DeepDive>

#### ما هي الميزات التي تشكل رؤية فريق React ل full-stack architecture ؟ {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

يطبق مجمع App Router في Next.js بالكامل [ مواصفات مكونات خادم React الرسمية](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md).  يتيح لك ذلك مزج المكونات الخاصة بالوقت البني، والمكونات الخاصة بالخادم فقط، والمكونات التفاعلية في شجرة React واحدة.

على سبيل المثال، يمكنك كتابة مكوّن React خاص بالخادم فقط كدالة `async` تقوم بقراءة البيانات من قاعدة بيانات أو من ملف. ثم يمكنك تمرير البيانات منه إلى مكوناتك التفاعلية:

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

مجمع App Router في Next.js يدمج أيضًا  [جلب البيانات مع Suspense.](/blog/2022/03/29/react-v18#suspense-in-data-frameworks).  يتيح لك ذلك تحديد حالة تحميل (مثل عنصر تحجيم مبدئي) لأجزاء مختلفة من واجهة المستخدم الخاصة بك مباشرة في شجرة React الخاصة بك:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

مكونات الخادم وSuspense هما ميزتان من React بدلاً من كونهما ميزتين في Next.js. ومع ذلك، فإن تبنيهما على مستوى الإطار يتطلب الموافقة وعملية تنفيذ غير بسيطة. في الوقت الحالي، يعتبر مجمع App Router في Next.js هو التنفيذ الأكثر اكتمالاً. يعمل فريق React مع مطوري أدوات التجميع لجعل هذه الميزات أسهل في التنفيذ في الجيل القادم من الأطار.

</DeepDive>