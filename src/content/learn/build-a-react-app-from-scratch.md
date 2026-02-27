---
title: بناء تطبيق React من الصفر
---

<Intro>

إذا كان تطبيقك يحتوي على قيود لا تخدمها أطر العمل الموجودة بشكل جيد، أو تفضل بناء إطار العمل الخاص بك، أو تريد فقط تعلم أساسيات تطبيق React، يمكنك بناء تطبيق React من الصفر.

</Intro>

<DeepDive>

#### فكر في استخدام إطار عمل {/*consider-using-a-framework*/}

البدء من الصفر هو طريقة سهلة للبدء في استخدام React، لكن المقايضة الرئيسية التي يجب أن تكون على دراية بها هي أن سلوك هذا الطريق غالبًا ما يكون مثل بناء إطار عمل خاص بك. مع تطور متطلباتك، قد تحتاج إلى حل مشاكل أكثر شبهاً بأطر العمل والتي لدى أطر العمل الموصى بها بالفعل حلول متطورة ومدعومة لها.

على سبيل المثال، إذا احتاج تطبيقك في المستقبل إلى دعم server-side rendering (SSR) أو static site generation (SSG) و/أو React Server Components (RSC)، سيتعين عليك تنفيذ ذلك بنفسك. وبالمثل، فإن ميزات React المستقبلية التي تتطلب التكامل على مستوى إطار العمل سيتعين عليك تنفيذها بنفسك إذا كنت تريد استخدامها.

تساعدك أطر العمل الموصى بها أيضًا في بناء تطبيقات ذات أداء أفضل. على سبيل المثال، تقليل أو إزالة الشلالات من طلبات الشبكة يجعل تجربة المستخدم أفضل. قد لا يكون هذا أولوية عالية عندما تبني مشروعًا تجريبيًا، ولكن إذا اكتسب تطبيقك مستخدمين، فقد ترغب في تحسين أدائه.

سلوك هذا الطريق يجعل أيضًا من الصعب الحصول على الدعم، حيث ستكون الطريقة التي تطور بها التوجيه وجلب البيانات والميزات الأخرى فريدة لحالتك. يجب عليك اختيار هذا الخيار فقط إذا كنت مرتاحًا لمعالجة هذه المشاكل بنفسك، أو إذا كنت واثقًا من أنك لن تحتاج أبدًا إلى هذه الميزات.

للحصول على قائمة بأطر العمل الموصى بها، راجع [إنشاء تطبيق React](/learn/creating-a-react-app).

</DeepDive>


## الخطوة 1: تثبيت أداة build {/*step-1-install-a-build-tool*/}

الخطوة الأولى هي تثبيت أداة build مثل `vite` أو `parcel` أو `rsbuild`. توفر أدوات build هذه ميزات لتعبئة الكود المصدري وتشغيله، وتوفير خادم تطوير للتطوير المحلي وأمر build لنشر تطبيقك على خادم الإنتاج.

### Vite {/*vite*/}

[Vite](https://vite.dev/) هي أداة build تهدف إلى توفير تجربة تطوير أسرع وأبسط لمشاريع الويب الحديثة.

<TerminalBlock>
{`npm create vite@latest my-app -- --template react`}
</TerminalBlock>

Vite لديها آراء محددة وتأتي مع إعدادات افتراضية معقولة خارج الصندوق. لدى Vite نظام بيئي غني من plugins لدعم fast refresh و JSX و Babel/SWC وميزات شائعة أخرى. راجع [React plugin](https://vite.dev/plugins/#vitejs-plugin-react) أو [React SWC plugin](https://vite.dev/plugins/#vitejs-plugin-react-swc) من Vite و [مثال مشروع React SSR](https://vite.dev/guide/ssr.html#example-projects) للبدء.

يتم استخدام Vite بالفعل كأداة build في أحد [أطر العمل الموصى بها](/learn/creating-a-react-app): [React Router](https://reactrouter.com/start/framework/installation).

### Parcel {/*parcel*/}

[Parcel](https://parceljs.org/) يجمع بين تجربة تطوير رائعة خارج الصندوق مع بنية قابلة للتوسع يمكن أن تأخذ مشروعك من مجرد البدء إلى تطبيقات إنتاج ضخمة.

<TerminalBlock>
{`npm install --save-dev parcel`}
</TerminalBlock>

يدعم Parcel fast refresh و JSX و TypeScript و Flow والتنسيق خارج الصندوق. راجع [وصفة React من Parcel](https://parceljs.org/recipes/react/#getting-started) للبدء.

### Rsbuild {/*rsbuild*/}

[Rsbuild](https://rsbuild.dev/) هي أداة build مدعومة بـ Rspack توفر تجربة تطوير سلسة لتطبيقات React. تأتي مع إعدادات افتراضية مضبوطة بعناية وتحسينات أداء جاهزة للاستخدام.

<TerminalBlock>
{`npx create-rsbuild --template react`}
</TerminalBlock>

يتضمن Rsbuild دعمًا مدمجًا لميزات React مثل fast refresh و JSX و TypeScript والتنسيق. راجع [دليل React من Rsbuild](https://rsbuild.dev/guide/framework/react) للبدء.

<Note>

#### Metro لـ React Native {/*react-native*/}

إذا كنت تبدأ من الصفر مع React Native، فستحتاج إلى استخدام [Metro](https://metrobundler.dev/)، وهو JavaScript bundler لـ React Native. يدعم Metro التجميع لمنصات مثل iOS و Android، لكنه يفتقر إلى العديد من الميزات مقارنة بالأدوات هنا. نوصي بالبدء بـ Vite أو Parcel أو Rsbuild ما لم يتطلب مشروعك دعم React Native.

</Note>

## الخطوة 2: بناء أنماط التطبيقات الشائعة {/*step-2-build-common-application-patterns*/}

أدوات build المدرجة أعلاه تبدأ بتطبيق client-only و single-page (SPA)، لكنها لا تتضمن أي حلول أخرى للوظائف الشائعة مثل التوجيه وجلب البيانات أو التنسيق.

يتضمن نظام React البيئي العديد من الأدوات لهذه المشاكل. لقد أدرجنا القليل منها التي تُستخدم على نطاق واسع كنقطة بداية، لكن لا تتردد في اختيار أدوات أخرى إذا كانت تعمل بشكل أفضل بالنسبة لك.

### التوجيه {/*routing*/}

يحدد التوجيه المحتوى أو الصفحات التي سيتم عرضها عندما يزور المستخدم URL معين. تحتاج إلى إعداد router لربط URLs بأجزاء مختلفة من تطبيقك. ستحتاج أيضًا إلى التعامل مع nested routes و route parameters و query parameters. يمكن تكوين Routers داخل كودك، أو تعريفها بناءً على مجلد المكونات وهياكل الملفات.

Routers هي جزء أساسي من التطبيقات الحديثة، وعادة ما تكون متكاملة مع جلب البيانات (بما في ذلك prefetching البيانات لصفحة كاملة لتحميل أسرع)، و code splitting (لتقليل أحجام حزم client)، وأساليب تصيير الصفحات (لتحديد كيفية إنشاء كل صفحة).

نقترح استخدام:

- [React Router](https://reactrouter.com/start/data/custom)
- [Tanstack Router](https://tanstack.com/router/latest)


### جلب البيانات {/*data-fetching*/}

جلب البيانات من خادم أو مصدر بيانات آخر هو جزء أساسي من معظم التطبيقات. القيام بذلك بشكل صحيح يتطلب التعامل مع حالات التحميل وحالات الخطأ وتخزين البيانات المجلوبة مؤقتًا، والذي يمكن أن يكون معقدًا.

مكتبات جلب البيانات المصممة لهذا الغرض تقوم بالعمل الشاق لجلب البيانات وتخزينها مؤقتًا نيابة عنك، مما يتيح لك التركيز على البيانات التي يحتاجها تطبيقك وكيفية عرضها. تُستخدم هذه المكتبات عادةً مباشرة في مكوناتك، ولكن يمكن أيضًا دمجها في router loaders لـ pre-fetching أسرع وأداء أفضل، وفي server rendering أيضًا.

لاحظ أن جلب البيانات مباشرة في المكونات يمكن أن يؤدي إلى أوقات تحميل أبطأ بسبب شلالات طلبات الشبكة، لذلك نوصي بـ prefetching البيانات في router loaders أو على server قدر الإمكان! يسمح هذا بجلب بيانات الصفحة دفعة واحدة أثناء عرض الصفحة.

إذا كنت تجلب البيانات من معظم backends أو REST-style APIs، فإننا نقترح استخدام:

- [React Query](https://react-query.tanstack.com/)
- [SWR](https://swr.vercel.app/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

إذا كنت تجلب البيانات من GraphQL API، فإننا نقترح استخدام:

- [Apollo](https://www.apollographql.com/docs/react)
- [Relay](https://relay.dev/)


### Code-splitting {/*code-splitting*/}

Code-splitting هي عملية تقسيم تطبيقك إلى حزم أصغر يمكن تحميلها عند الطلب. يزداد حجم كود التطبيق مع كل ميزة جديدة وتبعية إضافية. يمكن أن تصبح التطبيقات بطيئة في التحميل لأن كل الكود للتطبيق بأكمله يحتاج إلى إرساله قبل أن يمكن استخدامه. يمكن أن يساعد Caching وتقليل الميزات/التبعيات ونقل بعض الكود للتشغيل على server في تخفيف التحميل البطيء ولكنها حلول غير كاملة يمكن أن تضحي بالوظائف إذا تم الإفراط في استخدامها.

وبالمثل، إذا اعتمدت على التطبيقات التي تستخدم إطار العمل الخاص بك لتقسيم الكود، فقد تواجه مواقف يصبح فيها التحميل أبطأ مما لو لم يحدث تقسيم كود على الإطلاق. على سبيل المثال، [التحميل الكسول](/reference/react/lazy) لرسم بياني يؤخر إرسال الكود اللازم لتصيير الرسم البياني، مما يفصل كود الرسم البياني عن بقية التطبيق. [يدعم Parcel تقسيم الكود مع React.lazy](https://parceljs.org/recipes/react/#code-splitting). ومع ذلك، إذا كان الرسم البياني يحمل بياناته *بعد* أن يتم تصييره في البداية، فأنت الآن تنتظر مرتين. هذا شلال: بدلاً من جلب بيانات الرسم البياني وإرسال الكود لتصييره في نفس الوقت، يجب عليك انتظار كل خطوة لتكتمل واحدة تلو الأخرى.

تقسيم الكود حسب route، عند دمجه مع bundling وجلب البيانات، يمكن أن يقلل من وقت التحميل الأولي لتطبيقك والوقت الذي يستغرقه أكبر محتوى مرئي للتطبيق للتصيير ([Largest Contentful Paint](https://web.dev/articles/lcp)).

للحصول على تعليمات code-splitting، راجع مستندات أداة build الخاصة بك:
- [تحسينات build من Vite](https://vite.dev/guide/features.html#build-optimizations)
- [تقسيم الكود من Parcel](https://parceljs.org/features/code-splitting/)
- [تقسيم الكود من Rsbuild](https://rsbuild.dev/guide/optimization/code-splitting)

### تحسين أداء التطبيق {/*improving-application-performance*/}

نظرًا لأن أداة build التي تحددها تدعم فقط single page apps (SPAs)، ستحتاج إلى تنفيذ [أنماط تصيير](https://www.patterns.dev/vanilla/rendering-patterns) أخرى مثل server-side rendering (SSR) و static site generation (SSG) و/أو React Server Components (RSC). حتى إذا لم تكن بحاجة إلى هذه الميزات في البداية، في المستقبل قد تكون هناك بعض routes التي ستستفيد من SSR أو SSG أو RSC.

* **Single-page apps (SPA)** تحمل صفحة HTML واحدة وتحدّث الصفحة ديناميكيًا مع تفاعل المستخدم مع التطبيق. SPAs أسهل في البدء بها، لكن يمكن أن يكون لها أوقات تحميل أولية أبطأ. SPAs هي البنية الافتراضية لمعظم أدوات build.

* **Streaming Server-side rendering (SSR)** يصيّر صفحة على server ويرسل الصفحة المصيّرة بالكامل إلى client. يمكن أن يحسن SSR الأداء، لكنه يمكن أن يكون أكثر تعقيدًا في الإعداد والصيانة من تطبيق single-page. مع إضافة streaming، يمكن أن يكون SSR معقدًا جدًا في الإعداد والصيانة. راجع [دليل SSR من Vite]( https://vite.dev/guide/ssr).

* **Static site generation (SSG)** ينشئ ملفات HTML ثابتة لتطبيقك في وقت build. يمكن أن يحسن SSG الأداء، لكنه يمكن أن يكون أكثر تعقيدًا في الإعداد والصيانة من server-side rendering. راجع [دليل SSG من Vite](https://vite.dev/guide/ssr.html#pre-rendering-ssg).

* **React Server Components (RSC)** يتيح لك مزج مكونات build-time و server-only والمكونات التفاعلية في شجرة React واحدة. يمكن أن يحسن RSC الأداء، لكنه يتطلب حاليًا خبرة عميقة للإعداد والصيانة. راجع [أمثلة RSC من Parcel](https://github.com/parcel-bundler/rsc-examples).

تحتاج استراتيجيات التصيير الخاصة بك إلى التكامل مع router الخاص بك حتى تتمكن التطبيقات المبنية بإطار العمل الخاص بك من اختيار استراتيجية التصيير على مستوى كل route. سيمكن هذا من استراتيجيات تصيير مختلفة دون الحاجة إلى إعادة كتابة تطبيقك بالكامل. على سبيل المثال، قد تستفيد الصفحة المقصودة لتطبيقك من كونها مولدة بشكل ثابت (SSG)، بينما قد تعمل صفحة تحتوي على موجز محتوى بشكل أفضل مع server-side rendering.

يمكن أن يقلل استخدام استراتيجية التصيير الصحيحة لـ routes الصحيحة من الوقت الذي يستغرقه تحميل أول بايت من المحتوى ([Time to First Byte](https://web.dev/articles/ttfb))، وأول جزء من المحتوى للتصيير ([First Contentful Paint](https://web.dev/articles/fcp))، وأكبر محتوى مرئي للتطبيق للتصيير ([Largest Contentful Paint](https://web.dev/articles/lcp)).

### والمزيد... {/*and-more*/}

هذه مجرد أمثلة قليلة من الميزات التي سيحتاج التطبيق الجديد إلى النظر فيها عند البناء من الصفر. يمكن أن تكون العديد من القيود التي ستواجهها صعبة الحل حيث أن كل مشكلة مترابطة مع الأخرى ويمكن أن تتطلب خبرة عميقة في مجالات المشاكل التي قد لا تكون على دراية بها.

إذا كنت لا تريد حل هذه المشاكل بنفسك، يمكنك [البدء بإطار عمل](/learn/creating-a-react-app) يوفر هذه الميزات خارج الصندوق.
