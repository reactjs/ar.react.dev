---
id: how-to-contribute
title: دليل المساهمين
layout: contributing
permalink: docs/how-to-contribute.html
next: codebase-overview.html
redirect_from:
  - "contributing/how-to-contribute.html"
  - "tips/introduction.html"
---

تعتبر React من أوائل المشاريع المفتوحة المصدر من Facebook والتي ﻻزالت تحت التطوير المستمر والتي يتم استعمالها في شفرات برمجية للجميع في [facebook.com](https://www.facebook.com). ﻻزلنا مستمرّين في العمل على إصلاح العلل لجعل المُساهمة في هذا المشروع أسهل وأكثر شفافية قدر الإمكان. لم نبلغ ذلك حقّا، لكن نتمنى أن يوضّح هذا المستند مراحل المساهمة ويجيب عن الأسئلة التي يمكن أن تُراودك.

### [القواعد السلوكيّة](https://github.com/facebook/react/blob/master/CODE_OF_CONDUCT.md) {#code-of-conduct}

 قبل المشاركة، الرجاء منك [أن تقرأ قواعدنا السلوكية](https://github.com/facebook/react/blob/master/CODE_OF_CONDUCT.md)، لقد تبنّينا [ميثاق القواعد السلوكية للمساهمين](https://www.contributor-covenant.org/ar/version/1/4/code-of-conduct) ونتطلّع إلى أن يحترم أعضاء المجتمع قواعده.

### التطوير المفتوح {#open-development}

كل العمل على React يحدث عل موقع[GitHub](https://github.com/facebook/react). كل من الفريق الرئيسي والمساهمون الآخرون يساهمون بإرسال طلبات السحب (Pull requests) والتي تدخل نفس مراحل المراجعة.

### Semantic Versioning {#semantic-versioning}

تتبع React [الإدارة الدلالية لنُسخ البرمجيات](https://semver.org/lang/ar/). نُصدر اصدارات ترقيع (patch versions) عند القيام بإصلاحات للعلل والثغرات، اصدارات صُغرى عند إضافة ميزات ووظائف جديدة، وإصدارات جذرية عند القيام بتغيرات جذرية. عند القيام بتغيير جذري نقوم باستخدام تحذيرات بعدم الصلاحية (deprecation warnings) في الإصدارات الصغرى حتى يعلم مستخدمونا بالتغيرات التي ستطرأ وحتى يرقّوا شفراتهم البرمجية مُسبقا. تعرف على المزيد حول التزاماتنا في [سياسة الإصدارات](/docs/faq-versioning.html).

كل تغيير معتبر موثّق في [جدول التغييرات (changelog)](https://github.com/facebook/react/blob/master/CHANGELOG.md).

### تنظيم الفروع (Branch Organization) {#branch-organization}

ارفع كل التعديلات مباشرتاً للفرع الرئيسي [`master branch'](https://github.com/facebook/react/tree/master). نحن لا نستخدم أيتا فروعٍ اخرا في عملية التطوير أو عمل اصدارات جديدة. نحن نقوم بعمل اقصى جهد للمحافظة على الفرع `(master)الرئيسي `في احسن صورة بأجتياز كل الأختبارات المتاحة. 


الكود المضاف للفرع [`الفرع الرئيسي (master)`](https://github.com/facebook/react/tree/master) لابد ان يتلأم مع اخر اصدار مستقر. من الممكن أن يحتوي على بعض الخواص الأضافية ولاكن ليس تغيرات كبيرة. لابد أن نكون قادرين على اصدار اصدارات ذات تغيرات طفيفة من الفرع `(master)الرئيسي` في أي وقت.

### Feature Flags {#feature-flags}

للمحافظة على الفرع `(master)الرئيسي` في حالة تسمح بالاصدار، التغييرات الجذرية والخواص التجريبية لابد أن تُمرر من خلال راية الخواص.

رايات الخواص معرفة في [`packages/shared/ReactFeatureFlags.js`](https://github.com/facebook/react/blob/master/packages/shared/ReactFeatureFlags.js). بعض الاصدارات من React من الممكن أن تفعل بعض المجموعات من رايات الخواص على سبيل المثال، اصدار React Native ممكن أن يكون مُعد بشكل مختلف عن React DOM. هذه الرايات موجودة في [`packages/shared/forks`](https://github.com/facebook/react/tree/master/packages/shared/forks). رايات الخواص معرفة بشكل ثابت في (Flow)، لهذا يمكننا ان نشغل `yarn flow` لنؤكد اننا قد حدثنا كل الملفات اللازمة. 

بناء نظام React سيزيل كل فروع الخواص المعطلة قبل النشر. عملية الدمج المستمر تُفعل عند كل تسليم (commit) للتأكد ما أذا كان هناك أي تغيير في حجم الحزمة. يمكنك أن تستخدم التغير في الحجم على أنه أشارة بأن الخاصية قد مٌررة بشكل صحيح. 

### العلل (Bugs) {#bugs}

#### أين تجد المشاكل المعروفة {#where-to-find-known-issues}

نستعمل [GitHub Issues](https://github.com/facebook/react/issues) للمشاكل العامّة، نبقى على إطلاع على ذلك ونحاول أن نوضّح الأمر إن كنا بصدد عمل إصلاح داخلي. قبل طرح مهمّة جديدة، حاول أن تتأكد أنه لم يتم طرحها من قبل.

#### التبليغ عن مشكل جديد {#reporting-new-issues}

تقديم حالة اختبارية موجزة هي أفضل طريقة لإصلاح العلّة التي تواجهك. هذا [النموذج على JSFiddle](https://jsfiddle.net/Luktwrdm/) يُعدّ نقطة بداية مهمّة.

#### الثغرات الأمنية {#security-bugs}

لدى Facebook [برنامج مكفآت](https://ar-ar.facebook.com/whitehat/) للتبليغ الآمن عن الثغرات الأمنية. وبالتالي يرجى عدم التطرّق لذلك في العلن في (الـ issues). اذهب لتلك الصفحة واتبع الخطوات الموضحة هناك.

### سُبُل التواصل {#how-to-get-in-touch}

* IRC: [#reactjs on freenode](https://webchat.freenode.net/?channels=reactjs)
* [منتديات المُحادثة](/community/support.html#popular-discussion-forums)

هناك كذلك [مجتمع نشيط من مستخدمي React على منصّة Discord للمحادثة](https://www.reactiflux.com/) إذا ما احتجت للمساعدة فيما يتعلّق بـReact.

### اقتراح تغيير {#proposing-a-change}

إن أردت احداث تغيير بالواجهة البرمجية (API)، أو احداث أي تغييرات مُعتَبرة ننصحك [بأن تقدم طلب مُشكلة (issue)](https://github.com/facebook/react/issues/new). هذا يُمكننا من مناقشة اقتراحك قبل أن تستثمر جهدك فيه.

إن كنت تُقدم على إصلاح مشكلة فحسب، ﻻ بأس بإرسال طلب سحب (pull request) مباشرة، لكن من المهم أن تقدم طلب مُشكلة (issue) تُحدّد فيها بالتفصيل ما أنت بصدد إصلاحه. هذا مُهم في حالة ما إذا كنّا ﻻ نقبل ذاك الإصلاح بالتحديد لكن يمكننا الاستمرار في العمل على تلك المُشكلة.

### أول طلب سحب (Pull Request) لك {#your-first-pull-request}

هل تعمل على أول طلب سحب (Pull Request) لك؟ يمكنك أن تتعلّم  كيفية عمل ذلك من سلسلة الفيديوهات المجانيّة التالية:

<<<<<<< HEAD
**[كيف تُساهم في مشروع مفتوح المصدر على Github](https://app.egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)**
=======
**[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)**
>>>>>>> 1a641bb88e647186f260dd2a8e56f0b083f2e46b

حتى نساعدك في تَبليل قَدَمَيْك (الإنطلاق لأوّل مرّة) وحتى تَعتاد على نظام المُساهمة الخاص بنا، لدينا قائمة **[ببعض المشاكل السهلة على المبتدئين (good first issues)](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"good+first+issue")** والتي تحوي عِلَلا ذات نطاق محدود نسبيّا فتعتبَرُ مكانًا جيدا للإنطلاق منه.

إن قررت أن تُصلحَ مُشكلة (issue) قد تم طرحها، من فضلك ألقِ نظرة على النقاش في التعليقات لترى ما إذا كان أحدهم يعمل على إصلاحها. وإن لم يكن أي أحد يعمل عليها في ذلك الحين، الرجاء ترك تعليق بوضّح بأنك تريد العمل عليها حتى ﻻ يكرر الآخرون مَجهوداتك.

إن اقرّ أحدهم بأن هناك مشكلة ولم يعقّب على ذلك لأكثر من أسبوعين، ﻻ بأس أن تتناولها أنت لكن يجب عليك أن تَترُك تعليقًا على كلّ حال.

### إرسال طلب سحب (Pull Request) {#sending-a-pull-request}

يراقب الفريق الرئيسي طلبات السحب (pull requests). سنقوم بمراجعة طلب السحب الخاص بك وبعدها يمكنن أن ندمجه أو نطلب من أن تُحدث تغييرات به، أو يمكن أن نغلقه مع شرح الأسباب. أما التغيّرات التي تمسّ الواجهة البرمجية (API) قد تتطلب منا إحداث تغييرات وإصلاحات في استخدماتنا الداخلية في Facebook.com، والتي قد تُسبب تأخرًا. سنبذل قصارى جهدنا في تقديم التحديثات والنتائج المحصلّة خلال العمليّة.

**قبل تسجيل طلب السحب،** الرجاء التحقق من إتمام ما يلي:

1. قم باستنساخ المستودع [المستودع](https://github.com/facebook/react) (بعمل Fork) وبعدها أنشأ الفرع الخاص بك من الفرع الرئيسي `master`
2. نفّذ الأمل `yarn` في مجلّد المستودع.
3. إن أصلحت علّة أو أضفت شيفرة برمجية والتي تحتاج إلى اختبار، أضف الإختبارات.
4. تأكّد من نجاح سلسلة الإختبارات (`yarn test`). نصيحة: `yarn test --watch TestName` مفيدة أثناء التطوير.
5. نفّذ الأمر `yarn test --prod` للإختبار في وضع الإنتاج.
6. إن كنت تحتاج مُنقّحًا، نفّذ `yarn debug-test --watch TestName`، وافتح `chrome://inspect`، ثمّ اضغط على تفحّص(Inspect).
7. نظّم شيفرتك البرمجية مع [prettier](https://github.com/prettier/prettier) بالأمر (`yarn prettier`).
8. تأكّد من أن شيفرتك البرمجية متناسقة بالأمر (`yarn lint`). نصيحة: `yarn linc` للتحقق فقط من الملفّات المُتَغيّرة.
9. نفّذ [Flow](https://flowtype.org/) للتحقق من الأصناف (typechecks) بالأمر (`yarn flow`).
10. راجع اتفاقية ترخيص المساهم (CLA)، إن لم تقم بذلك بعد.

### اتفاقية ترخيص المساهم (CLA) {#contributor-license-agreement-cla}

حتى يتمّ قبول طلب السحب الخاص بك، يجب عليك أولا أن تقوم بتسجيل إتفاقية ترخيص المساهم (CLA). عليك أن تفعل ذلك مرّة واحدة فحسب، لذا لو أردت المشاركة في أحد المشاريع مفتوحة المصدر من Facebook، فستكون جاهزا للإنطلاق. إن كنت تقوم بتسجيل طلب سحب للمرّة الأولى، أخبرنا بأنك أكملت مراجعة الإتفاقية (CLA) وعندها يمكننا أن نتحقق من ذلك باسم المستخدم الخاص بك على Github.

**[أكمل الـCLA الخاصّة بك من هنا](https://code.facebook.com/cla)**

### مُتطلّبات للمساهمة {#contribution-prerequisites}

<<<<<<< HEAD
* لديك [Node](https://nodejs.org) مثبّت بنسخته الـv8.0.0+ و [Yarn](https://yarnpkg.com/en/) بالنسخة v1.2.0+.
* لديك [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html) مثبّت.
* لديك `gcc` مُثبّت أو أنت مُعتاد على تثبيت المُتَرجمات (compilers) إذا ما احتجتها. بعض الإعتماديات (dependencies) تحتاج إلى مرحلة تَرجَمة (compilation step). في نظام OS X, طرفية Xcode (Xcode Command Line Tools) ستتكفّل بذلك، على Ubuntu، أمر `apt-get install build-essential` سيثبّت الحزم المطلوبة، أوامر مشابة يمكن أن تشتغل على توزعات لينُكس الأخرى. نظام ويندوز (Windows) سيتطلّب مراحل إضافية، راجع [إرشادات تثبيت `node-gyp`](https://github.com/nodejs/node-gyp#installation) لمزيد من التفاصيل.
* أنت مُعتاد على Git.
=======
* You have [Node](https://nodejs.org) installed at LTS and [Yarn](https://yarnpkg.com/en/) at v1.2.0+.
* You have [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html) installed.
* You have `gcc` installed or are comfortable installing a compiler if needed. Some of our dependencies may require a compilation step. On OS X, the Xcode Command Line Tools will cover this. On Ubuntu, `apt-get install build-essential` will install the required packages. Similar commands should work on other Linux distros. Windows will require some additional steps, see the [`node-gyp` installation instructions](https://github.com/nodejs/node-gyp#installation) for details.
* You are familiar with Git.
>>>>>>> 1a641bb88e647186f260dd2a8e56f0b083f2e46b

### آليّة التطوير {#development-workflow}

بعد استنساخ مشروع React على جهازك، نفّذ الأمر `yarn` لتحميل كل إعتماديّاته.
بعدها يمكنك تنفيذ بعض الأوامر:

* `yarn lint` للتحقق من تنسيق الشيفرة البرمجية.
* `yarn linc` مثل `yarn lint` لكن أسرع ﻷنه يتحقق من الملفّات التي تغيّرت فحسب.
* `yarn test` يشغّل كل سلسلة الإختبارات.
* `yarn test --watch` يشغّل مُراقب الإختبارات التفاعلي (interactive tests watcher).
* `yarn test --prod` تشغّل الإختبارات في بيئة الإنتاج.
* `yarn test <(pattern)>` يشغلّ الإختبارات التي الموافقة لاسم الملف.
* `yarn debug-test` يُشابه الأمر `yarn test` لكن مع مُنَقّح. افتح `chrome://inspect` ثمّ اضغط على تفحّص(Inspect).
* `yarn flow` يشغّل آلية [Flow](https://flowtype.org/) للتحقق من الأصناف.
* `yarn build` ينشأ مجلّد بناء (`build`) مع كل الحُزم.
* `yarn build react/index,react-dom/index --type=UMD` ينشأ بنيات بناء (UMD) مُكوّنة من React و ReactDOM فقط.

ننصح باستعمال  الأمر `yarn test` (أو ما يُشابهه من الأوامر أعلاه) للتأكد من عدم إتلاف أي شيء بينما تعمل على التغييرات التي تقوم بها. على كلّ، سيكون من الأحسن أن تختبر نسختك المبنيّة من React في مشروع حقيقي.

أولا، شغّل الأمر `yarn build`. هذا الأمر سينتج حزما مبنيّة مسبقا في مجلد `build` وستقوم تحضير حزم npm داخل `build/packages`.

أسهل طريقة لتجربة التغييرات التي قمت بها هي بتشغل الأمر `yarn build react/index,react-dom/index --type=UMD` ثم بفتح `fixtures/packaging/babel-standalone/dev.html`. هذا الملف أصلا يستعمل `react.development.js` من مجلّد `build` حتى يُتابع التغييرات التي تقوم بها.

إن قررت أن تجرّب تغييراتك على مشروع React مُنشأ مسبقا، يمكنك نسخ `build/node_modules/react/umd/react.development.js` و `build/node_modules/react-dom/umd/react-dom.development.js` و أيّ من نواتج البناء (build products) ووضعها في تطبيقك ومن ثمّ استعمالها عِوضَ النسخة المستقرّة.

إن كان مشروعك يستعمل React من npm، يمكنك حذف `react` و `react-dom` من مُعتمديّاته ثم استعمل `yarn link` لربطها مع مسار مجلّد `build` المحلّي لديك. لاحظ أن **بدلا من `--type=UMD` سوف تحتاج إلى تمرير `--type=NODE` عند بناء المشروع**. ستحتاج أيضا إلى بناء رزمة `scheduler`:

```sh
cd ~/path_to_your_react_clone/
yarn build react/index,react/jsx,react-dom/index,scheduler --type=NODE

cd build/node_modules/react
yarn link
cd build/node_modules/react-dom
yarn link

cd ~/path/to/your/project
yarn link react react-dom
```

في كل مرّة تشغّل فيها الأمر `yarn build` في مجلّد React ستظهر النسخ المُحدّثة في مجلّد `node_modules` داخل مسار مشروعك. تستطيع عندها إعادة بناء مشروعك لتجربة التغييرات التي قُمت بها.

اذا كانت أحد الرزم مفقوده (علي سبيل المثال: ربما تستخدم `react-dom/server` في مشروعك), يمكنك دائما بناء مشروعك كامل بتشغيل الأمر `yarn build`. لاحظ أن الأمر `yarn build` بدون خيارات يستغرق وقت طويل.

نؤكّد مجددا أن يتوفّر طلب السحب (pull request) الخاص بك على وحدات اختبار ﻷي ميزة جديدة. بذلك نضمن أننا لن نُعطّل شيفرتك البرمجية في المستقبل.

### دليل التنسيق {#style-guide}

نستعمل مُنسّق شيفرات برمجية آلي يدعى [Prettier](https://prettier.io/).
شغّل الأمر `yarn prettier` بعد القيام بأية تعديلات تمسّ الشيفرة البرمجية.

عندها ستقوم أداة التنسيق (linter) الخاصة بنا بالتقاط أغلب المشاكل التي يمكن أن توجد بشيفرتك البرمجية.
يمكنك عبر الأمر `yarn linc` أن تتحقق من حالة تنسيق شيفرتك البرمجية.

يمكن لأداة التنسيق (linter) أن تفشل في التقاط بعض التنسيقات، إن كنت غير متأكد من شيء ما، راجع [دليل تنسيق Airbnb](https://github.com/airbnb/javascript) سيقوم بإرشادك إلى الاتجاه الصحيح.

### فيديو تمهيدي {#introductory-video}

قد تُهمّك مشاهدة [هذا الفيديو القصير](https://www.youtube.com/watch?v=wUpPsEcGsg8) (26 دقيقة) والذي يمكن أن يُعطيك مقدمّة عن المساهمة في React.

#### أبرز أجزاء الفيديو: {#video-highlights}

- [4:12](https://youtu.be/wUpPsEcGsg8?t=4m12s) - بناء واختبار React محليّا
- [6:07](https://youtu.be/wUpPsEcGsg8?t=6m7s) - إنشاء وإرسال طلبات السحب (pull requests)
- [8:25](https://youtu.be/wUpPsEcGsg8?t=8m25s) - تنظيم الشيفرة البرمجية
- [14:43](https://youtu.be/wUpPsEcGsg8?t=14m43s) - تسجيل React بـnpm (React npm registry)
- [19:15](https://youtu.be/wUpPsEcGsg8?t=19m15s) - إضافة ميزات جديدة لـ React

لنيل نظرة واقعية عن "ما هو الشعور" عن القيام بالمساهمة في React للمرة الأولى، شاهد [هذه المحاضرة الممتعة من ReactNYC](https://www.youtube.com/watch?v=GWCcZ6fnpn4).

### طلب التعليقات (RFC أو Request for Comments) {#request-for-comments-rfc}

الكثير من التغييرات بما فيه إصلاحات العلل أو تحسين التوثيق تخضع لنظام طلبات السحب من Github (Github pull request workflow).

على الرغم من أن بعض التغييرات "ضرورية" ، فإننا نطلب أن يتم إدخالها قليلاً إلى عملية التصميم وإيجاد توافق في الآراء بين فريق React الأساسي.

يوفّر نظام "طلب التعليقات" (RFC أو Request for Comments) مسارا ثابتا ومؤطّرا للميزات الجديدة لتضاف للمشروع. يمكنك المساهمة بزيارة [rfcs مستودع](https://github.com/reactjs/rfcs).

### الرخصة {#license}

بمساهمتك في React، أنت توافق على أن مُساهماتك ستكون تحت رخصة MIT.

### ماذا بعد؟ {#what-next}

إنتقل إلى [القسم التالي](/docs/codebase-overview.html) للتعرف على تنسيق وتنظيم قاعدة الشيفرة البرمجية.