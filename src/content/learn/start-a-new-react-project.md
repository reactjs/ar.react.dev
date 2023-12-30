---
title: ابدأ مشروع React جديد 
---

<Intro>

إذا كنت تريد بناء تطبيق أو موقع جديد كلياً باستخدام React، ننصح بإختيار أحد إطارات العمل الخاصة بـReact الشعبية في مجتمع React. حيث أن إطارات العمل توفر ميزات قد يحتاجها أغلب التطبيقات والمواقع، تتضمن: التوجيه (routing) وجلب البيانات (data fetching) وتوليد HTML.

</Intro>

<Note>

**ستحتاج لتثبيت [Node.js](https://nodejs.org/en/) للتطوير المحلي.** يمكنك *أيضا* أن تختار استخدام Node.js في الإنتاج لكن لست بحاجة لذلك، حيث أن العديد من أطر عمل React تدعم تصدير مجلد ثابت (static) يحوي على HTML/CSS/JS.

</Note>

## أطر عمل React على درجة الإنتاج {/*production-grade-react-frameworks*/}

### Next.js {/*nextjs*/}

**[Next.js](https://nextjs.org/) هو إطار عمل React كامل (full-stack).** متعدد الاستخدامات حيث يمكّنك من إنشاء تطبيق React بأي حجم -  من مدونة أغلبها ثابت إلى تطبيق دايناميكي معقد. لإنشاء مشروع Next.js جديد، نفذ في موجه الأوامر (terminal):

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

لتعلّم Next.js، اطلع على [الدرس تعليمي لـ Next.js](https://nextjs.org/learn)

يتم الإشراف على Next.js من قبل [Vercel](https://vercel.com/). تستطيع [نشر تطبيق Next.js](https://nextjs.org/docs/app/building-your-application/deploying) على أي استضافة Node.js أو serverless، أو خادمك الخاص. [تطبيقات Next.js الثابتة بالكامل](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) يمكن نشرها على أي استضافة ثابتة.

### Remix {/*remix*/}

**[Remix](https://remix.run/) هو إطار عمل React كامل (full-stack) مع توجيه متداخل (nested routing).** يمكنك من تقسيم تطبيقك إلى أجزاء متداخلة تستطيع تحميل البيانات على التوازي والتحديث استجابةً لأفعال المستخدم. لإنشاء مشروع Remix جديد، نفذ:

<TerminalBlock>
npx create-remix
</TerminalBlock>

لتعلم Remix، اطلع على [درس المدونة](https://remix.run/docs/en/main/tutorials/blog) (قصير) [ودرس التطبيق](https://remix.run/docs/en/main/tutorials/jokes) (طويل).


يتم الإشراف على Remix من قبل [Shopify](https://www.shopify.com/). عند إنشاء مشروع Remix ستحتاج [لاختيار هدف النشر](https://remix.run/docs/en/main/guides/deployment). يمكنك نشر تطبيق Remix على أي استضافة Node.js أو serverless باستخدام أو كتابة [محول (adapter)](https://remix.run/docs/en/main/other-api/adapter).

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) هو إطار عمل React لمواقع إدارة المحتوى (CMS-backed) السريعة.** حيث يمتلك نظام إضافات (plugin) غني وطبقة بيانات GraphQL لتبسيط إدماج (integrating) المحتوى، والواجهات البرمجية (APIs)، والخدمات في موقع واحد. لإنشاء مشروع Gatsby جديد، نفذ: 

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

لتعلم Gatsby، اطلع على [الدرس التعليمي لـGatsby](https://www.gatsbyjs.com/docs/tutorial/)

تتم إدارة Gatsby من قبل [Netlify](https://www.netlify.com/). تستطيع [نشر موقع Gatsby ثابت بالكامل](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) على أي إستضافة ثابتة. إذا اخترت استخدام ميزات حصرية للخادم (server-only)، تأكد من دعم موّفر إستضافتك لهذه الخدمات لـGatsby.

### Expo (لتطبيقات native) {/*expo*/}

**[Expo](https://expo.dev/) هو إطار عمل React يمكّنك من إنشاء تطبيقات Android  وIOS، وويب شاملة مع واجهات مستخدم (UIs) حقاً أصلية (native).** يوفر مجموعة تطوير برمجيات (SDK) لـ[React Native](https://reactnative.dev/) التي تجعل الأجزاء الأصلية أسهل في الاستخدام. لإنشاء مشروع Expo جديد، نفذ:


<TerminalBlock>
npx create-expo-app
</TerminalBlock>

لتعلم Expo، اطلع على [الدرس التعليمي لـExpo](https://docs.expo.dev/tutorial/introduction/).

يتم إدارة Expo من قبل [Expo (الشركة)](https://expo.dev/about). بناء التطبيقات باستخدام Expo مجاني، ويمكنك رفعهم إلى متاجر Google وApple بدون قيود. Expo أيضاًَ يوفر اشتراك مدفوع للخدمات السحابية.

<DeepDive>

#### هل بإمكاني استخدام React بدون إطار عمل؟ {/*can-i-use-react-without-a-framework*/}

يمكنك بالتأكيد استخدام React بدون إطار عمل - كما يمكنك [استخدام React لجزء من صفحتك](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **لكن إذا كنت تريد بناء تطبيق أو موقع جديد باستخدام React كلياً، فننصح باستخدام إطار عمل.**

وسبب ذلك:

حتى لو كنت لا تحتاج توجيه (routing) أو جلب بيانات (data fetching) بالبداية، على الأرجح ستضيف مكتبات لأجلهم. مع نمو حزمة JavaScript الخاصة بك مع كل ميزة جديدة، قد تضطر إلى معرفة كيفية تقسيم الكود لكل مسار على حدة. مع ازدياد حاجة جلب البيانات لديك بالازدياد تعقيداً، فمن المحتمل أن تواجه شلالات شبكة من الخادم للعميل (server-client network waterfalls) ستجعل تطبيقك يظهر بطيئًا للغاية. مع نمو جمهورك سيضم المزيد من المستخدمين الذين يعانون من ظروف شبكة سيئة وأجهزة منخفضة الجودة، فقد تحتاج إلى توليد HTML للمكوّنات الخاصة بك لعرض المحتوى مبكرًا - إما على الخادم أو أثناء وقت البناء. قد يكون تغيير بنية مشروعك لتشغيل بعض التعليمات البرمجية على الخادم أو أثناء البناء أمرًا شائكاً للغاية.

**هذه المشاكل ليست محصورة على React فقط. لهذا Svelte لديها SvelteKit، وVue لديها Nuxt، وما إلى ذلك .** لحل هذه المشكلات بمفردك، ستحتاج إلى دمج الحزمة الخاصة بك مع جهاز توجيهك ومع مكتبتك لجلب البيانات. ليس من الصعب تشغيل الإعداد الأولي، ولكن هناك الكثير من التفاصيل الدقيقة المتضمنة في إنشاء تطبيق يتم تحميله بسرعة حتى مع نموه بمرور الوقت. سترغب في إرسال الحد الأدنى من كود التطبيق، ولكن برحلة ذهاب وإياب واحدة بين العميل والخادم، بالتوازي مع أي بيانات مطلوبة للصفحة. على الأرجح سترغب أن تكون الصفحة تفاعلية (interactive) قبل تشغيل أي كود JavaScript، وذلك لدعم التحسين التدريجي  (progressive enhancement). قد ترغب في إنشاء مجلد من ملفات HTML الثابتة تمامًا لصفحات التسويق الخاصة بك والتي يمكن استضافتها في أي مكان والتي تعمل حتى مع تعطيل JavaScript. بناء هذه القدرات بنفسك يتطلب عملاً جاداً.

**تقوم أطر عمل React في هذه الصفحة بحل مشكلات مثل هذه افتراضيًا، بدون أي عمل إضافي من جانبك.** حيث يتيحون لك البدء بمرونة شديدة ثم توسيع نطاق تطبيقك وفقًا لاحتياجاتك. يحتوي كل إطار عمل في React على مجتمع خاص به، لذا فإن العثور على إجابات للأسئلة وترقية الأدوات أسهل. توفر الأطر أيضًا بنية لكودك، مما يساعدك أنت والآخرين على الاحتفاظ بالسياق والمهارات بين المشاريع المختلفة. العكس بالعكس، مع بنية مشروع مخصصة سيكون من الأسهل أن تعلق على نسخة تبعية (dependency) غير مدعومة. وسينتهي بك الأمر فعلياً إلى إنشاء إطار العمل الخاص بك - وسيكون بدون مجتمع أو مسار ترقية (وفي حال كونه مشابه لما صنعناه في الماضي، سيكون تصميمه عشوائيًا بلا فائدة).

إذا كنت لا تزال غير مقتنع، أو أن تطبيقك به قيود غير معتادة لا تخدمها هذه الأطر جيدًا وتريد تشغيل إعداد مخصص خاص بك، لا يمكننا منعك - قم بذلك! أجلب `react` و`react-dom` من npm، قم بإعداد عملية بنائك المخصصة  باستخدام أداة تجميع (bundler) كـ[Vite](https://vitejs.dev/) أو [Parcel](https://parceljs.org/)، وقم بإضافة أدوات أخرى حسب حاجتك إليها للتوجيه أو التوليد الثابت (static generation) أو العرض من جانب الخادم (server-side rendering)، وما إلى ذلك.

</DeepDive>

## أطر React متطورة (bleeding-edge) {/*bleeding-edge-react-frameworks*/}

أثناء بحثنا لكيفية الاستمرار في تحسين React، أدركنا أن إدماج React بشكل أوثق مع أطر العمل (على وجه التحديد، مع تقنيات التوجيه والتجميع (bundling) والخادم) هو أكبر فرصة لنا لمساعدة مستخدمي React في بناء تطبيقات أفضل. وافق فريق Next.js على التعاون معنا في البحث والتطوير والإدماج والاختبار لميزات React حيادية الإطار مثل [مكوّنات المخدّم (Server Components) لـReact](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

تقترب هذه الميزات من أن تكون جاهزة للإنتاج كل يوم، ونحن نجري محادثات مع مطوري أدوات التجميع وأطر العمل الآخرين حول كيفية إدماجها. نأمل أن جميع الأطر المدرجة في هذه الصفحة ستقدم دعم كامل لهذه الميزات في غضون عام أو عامين. (إذا كنت مؤلف إطار عمل مهتمًا بالشراكة معنا لتجربة هذه الميزات، تواصل معنا!)

### Next.js (App Router) {/*nextjs-app-router*/}

**[موجه تطبيق Next.js](https://beta.nextjs.org/docs/getting-started) هو عبارة عن إعادة تصميم للواجهات البرمجية (APIs) الخاصة بـNext.js بهدف تحقيق رؤية فريق React للمعمارية الكاملة (full-stack).** يتيح لك جلب البيانات في مكوّنات غير متزامنة (asynchronous components) تعمل على الخادم أو حتى أثناء البناء.

يتم الإشراف على Next.js من قبل [Vercel](https://vercel.com/). تستطيع [نشر تطبيق Next.js](https://nextjs.org/docs/app/building-your-application/deploying) على أي استضافة Node.js أو serverless، أو خادمك الخاص. [تطبيقات Next.js الثابتة بالكامل](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) يمكن نشرها على أي استضافة ثابتة.

<DeepDive>

#### ماهي الميزات التي تكوّن رؤية فريق React للبنية الكاملة؟ {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

تقوم أداة تجميع (bundler) موجه التطبيق لـ Next.js بتطبيق [مواصفات مكوّنات الخادم لـReact](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) بشكل كامل. حيث تتيح لك المزج بين مكوّنات وقت البناء (build-time) ومكوّنات الخادم فقط (server-only) والمكوّنات التفاعلية في شجرة React واحدة.

على سبيل المثال، يمكنك كتابة مكوّن React خادم فقط كدالة غير متزامنة 'async' يقرأ من قاعدة بيانات أو من ملف. ثم يمكنك تمرير البيانات منه إلى مكوّناتك التفاعلية:

```js
// هذا المكّون يتم تنفيذه فقط على الخادم (أو خلال البناء)
async function Talks({ confId }) {
  // 1. أنت على الخادم، يمكنك التحدث إلى طبقة البيانات الخاصة بك، لا يوجد حاجة لنقطة نهاية (endpoint) ِAPI 
  const talks = await db.Talks.findAll({ confId });

  // 2. أضف اي كمية من منطق عرض (rendering logic). لأنها لن تجعل حزمة JavaScript أكبر.
  const videos = talks.map(talk => talk.video);

  // 3. مرر البيانات أسفلاً للمكوّنات التي سوف يتم تنفيذها في المتصفح
  return <SearchableVideoList videos={videos} />;
}
```

موجه التطبيق لـNext.js يقوم أيضاّ بإدماج [جلب البيانات مع التعليق (suspense)](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). يتيح لك هذا تحديد حالة تحميل (كعنصر بديل هيكلي) لأجزاء مختلفة من واجهة المستخدم مباشرةً في شجرة React:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

مكوّنات الخادم والتعليق هي ميزات React وليست ميزات Next.js. ومع ذلك، فإن تبَنِّيها على مستوى إطار العمل يتطلب دعمًا وعملًا تطبيقياً غير قليل. في الوقت الحالي، يعد موجه تطبيقات Next.js هو التطبيق الأكثر اكتمالاً. يعمل فريق React مع مطوري أدوات التجميع لتسهيل تطبيق هذه الميزات في الجيل التالي من أطر العمل.

</DeepDive>
