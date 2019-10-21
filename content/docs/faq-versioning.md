---
id: faq-versioning
title: سياسة الإصدارات
permalink: docs/faq-versioning.html
layout: docs
category: FAQ
---

تتبع React مبادئ [الإدارة الدلالية لنُسخ البرمجيات (SemVer)](https://semver.org/) في ترقيم إصداراتها.

هذا يعني أنَّه مع الإصدار ذي الرقم **x.y.z**:

<<<<<<< HEAD
* عند إصدار **تغييرات جذرية** (breaking changes)، نطلق **إصدارًا رئيسيًّا** عبر تغيير الرقم **x** (مثل الانتقال من 15.6.2 إلى 16.0.0).
* عند إصدار **ميزات جديدة**، نطلق **إصدارًا فرعيًّا** عبر تغيير الرقم **y** (مثل التغيير من 15.6.2 إلى 15.7.0).
* عند **تصحيح علل وثغرات** في الإصدار السابق، نطلق **إصدارًا مرقَّعًا** (patch release) عبر تغيير الرقم **z** (مثل تغيير 15.6.2 إلى 15.6.3).
=======
* When releasing **critical bug fixes**, we make a **patch release** by changing the **z** number (ex: 15.6.2 to 15.6.3).
* When releasing **new features** or **non-critical fixes**, we make a **minor release** by changing the **y** number (ex: 15.6.2 to 15.7.0).
* When releasing **breaking changes**, we make a **major release** by changing the **x** number (ex: 15.6.2 to 16.0.0).
>>>>>>> d2ade76cce133af47ab198188fa2de03fa51834b

قد تحوي الإصدارات الرئيسية على ميزات جديدة أيضًا، ويمكن أي يحوي أي إصدار على تصحيح لعللٍ وثغرات.

<<<<<<< HEAD
=======
Minor releases are the most common type of release.

### Breaking Changes {#breaking-changes}
>>>>>>> d2ade76cce133af47ab198188fa2de03fa51834b

### التغييرات الجذرية {#breaking-changes}

نعلم أنَّ التغييرات الجذرية غير محبَّبة لجميع الأشخاص، لذا نحاول قدر الإمكان تقليل عدد الإصدارات الرئيسية. على سبيل المثال، الإصدار 15 من React نُشِر في نيسان عام 2016 والإصدار 16 نُشِر في أيلول من العام 2017. ولا يتوقع نشر الإصدار 17 حتى العام 2019.

عوض ذلك، ننشر إصدارات فرعية تحوي الميزات الجديدة. هذا يعني أنَّ الإصدارات الفرعية هي التي تجذب الانتباه أكثر من الإصدارات الرئيسية.


### الالتزام بالاستقرار {#commitment-to-stability}

لمَّا كنا نعدِّل على React باستمرار، نحاول قدر المستطاع تقليل الجهد المطلوب للاستفادة من الميزات الجديدة. سنبقي الواجهات البرمجية القديمة قيد العمل عندما يكون ذلك ممكنًا حتى لو تطلَّب الأمر وضعها في حزمة منفصلة. على سبيل المثال،  [Mixins تعتبر ضارة](/blog/2016/07/13/mixins-considered-harmful.html) إلا أنَّها لا تزال مدعومةً إلى هذه اللحظة عبر  [create-react-class](/docs/react-without-es6.html#mixins) ، ولا تزال العديد من الشيفرات الأساسية (codebases) تستعملها في الشيفرة المستقرة والقديمة.

يستعمل React اليوم أكثر من مليون مطور؛ يعمل هؤلاء المطورين على صيانة ملايين المكونات. تحتوي الشيفرة الأساسية لفيسبوك مثلًا على أكثر من 50,000 مكون من مكونات React. هذا يعني أنَّه نحتاج إلى جعل عملية الترقية إلى إصدارات React الحديثة عمليةً سهلةً قدر الإمكان. إن أحدثنا تغييرات كبيرة دون توفير مسارٍ ينقلنا بسلاسةٍ إليها، فسيبقى الجميع عالقًا في الإصدارات القديمة.  نختبر مسارات الانتقال إلى الإصدارات الأحدث على فيسبوك بحد ذاته أولًا؛ فإن استطاع عشرة أفراد من فريقنا (وأقل) تحديث ما يزيد عن 50,000 مكون بمفردهم، نتأكد آنذاك من كون عملية الترقية قابلة للتطبيق والإدارة لأي شخص يستعمل React. نكتب في أغلب الحالات [شيفرة مؤتمتة](https://github.com/reactjs/react-codemod) لتحديث صياغة المكونات ثم ننشرها في إصدار مفتوح المصدر ليستعملها الجميع.

### الترقية التدريجية مقابل التحذيرات {#gradual-upgrades-via-warnings}

تتضمن الإصدارات التطويرية من React الكثير من التحذيرات المفيدة. نضيف تحذيرات للتحضير للتغييرات الجذرية المستقبلية متى ما أمكن ذلك. بهذه الطريقة، إن لم يُظهِر تطبيقك أية تحذيرات مع أحدث إصدار، فسيكون متوافقًا مع الإصدار الرئيسي المقبل.

لن تؤثر التحذيرات في الإصدارات التطويرية على سلوك تطبيقك في وقت التشغيل. بناءً على ذلك، يمكنك الوثوق من عمل تطبيقك في البيئة التطويرية والبيئة الإنتاجية دون أي اختلاف. الفرق الوحيد هو أنه لن تُسجَّل التحذيرات في البيئة الإنتاجية مما يزيد من فعالية تطبيقك. (إن لاحظت أي سلوك مخالف لما ذكرناه، أرجو أن تخبرنا به في أسرع وقت.)

### ما هي التغييرات التي تعدُّ بأنها جذرية؟ {#what-counts-as-a-breaking-change}

عمومًا، لا نغيِّر رقم الإصدار الرئيسي (الرقم x) فجأةً من أجل التغييرات التالية:

* التحذيرات في البيئة التطويرية: لمَّا كانت هذه التحذيرات لا تؤثر على البيئة الإنتاجية، فقد نضيف تحذيرات أو نعدِّل على أخرى موجودة مسبقًا بين الإصدارات الرئيسية. هذا ما يسمح لنا في الحقيقة بالتحذير بشكل موثوق بقدوم تغييرات جذرية مستقبلية.
* تبدأ الواجهات البرمجية مع الإصدارات غير المستقرة: تضاف الواجهات البرمجية الجديدة في الإصدارات غير المستقرة على أنَّها ميزات تجريبية، إذ لم نكن قد تأكدنا بعد منها. بعد إصدار مثل هذه الواجهات البرمجية في إصدارات تحوي السابقة `unstable_‎`، يمكننا نقلها بسرعة إلى الإصدار المستقر والحصول على الواجهة البرمجية المستقرة.
* الإصداران Alpha و Canary من React: نوفر الإصدارات Alpha من React من أجل اختبار الميزات الجديدة في وقت مبكر، إذ نريد مرونةً أكبر تسمح لنا بجعل التغييرات تعتمد على ما تعلمناه في هذه الإصدارات. إن كنت تستعمل أحد هذه الإصدارات، فانتبه إلى تغيِّر الواجهات البرمجية قبل نشرها في الإصدار المستقر.
* الواجهات البرمجية غير الموثَّقة وهيكلية البيانات الداخلية: إن وصلت إلى أسماء خاصيات داخلية مثل ‎`__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` أو `‎__reactInternalInstance$uk43rzhitjg`، فذلك لأنها متاحةٌ لك، إذ لك حرية التصرف والوصول.


صُمِّمَت هذه السياسة لتكون واقعية وعملية في الوقت نفسه؛ فلا نريد بالتأكيد أن نُسبِّب لك المزيد من الصداع. إن أطلقنا إصدارًا رئيسيًّا لكل تغيير من التغييرات السابقة فجأةً، فسينتهي بنا المطاف بإطلاق إصدارات رئيسية لا تحصى وإصابة المجتمع بداءٍ سقيمٍ يدعى "رهاب الإصدارات". أضف إلى ذلك أنَّه لن نتمكن آنذاك من تطوير React بالشكل التي نسير عليه الآن.

أخيرًا، إن كان ولابد من إطلاق إصدار ناتج عن تغيير في تلك القائمة وقد يتسبَّب في وقوع المستخدمين في مشاكل كثيرة، فسنبذل قصارى جهدنا لتوفير وسيلة تسمح بالانتقال التدريجي إليه.

<<<<<<< HEAD
=======
That said, if we expect that a change on this list will cause broad problems in the community, we will still do our best to provide a gradual migration path.

### If a Minor Release Includes No New Features, Why Isn't It a Patch? {#minors-versus-patches}

It's possible that a minor release will not include new features. [This is allowed by semver](https://semver.org/#spec-item-7), which states **"[a minor version] MAY be incremented if substantial new functionality or improvements are introduced within the private code. It MAY include patch level changes."**

However, it does raise the question of why these releases aren't versioned as patches instead.

The answer is that any change to React (or other software) carries some risk of breaking in unexpected ways. Imagine a scenario where a patch release that fixes one bug accidentally introduces a different bug. This would not only be disruptive to developers, but also harm their confidence in future patch releases. It's especially regrettable if the original fix is for a bug that is rarely encountered in practice.

We have a pretty good track record for keeping React releases free of bugs, but patch releases have an even higher bar for reliability because most developers assume they can be adopted without adverse consequences.

For these reasons, we reserve patch releases only for the most critical bugs and security vulnerabilities.

If a release includes non-essential changes — such as internal refactors, changes to implementation details, performance improvements, or minor bugfixes — we will bump the minor version even when there are no new features.
>>>>>>> d2ade76cce133af47ab198188fa2de03fa51834b
