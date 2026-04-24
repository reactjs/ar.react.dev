---
title: قواعد React
---

<Intro>
كما أن لغات البرمجة المختلفة لها أساليبها في التعبير عن المفاهيم، لدى React صيغها — أو قواعدها — لكيفية التعبير عن الأنماط بطريقة سهلة الفهم وتُنتِج تطبيقات عالية الجودة.
</Intro>

<InlineToc />

---

<Note>
لمعرفة المزيد عن التعبير عن واجهات المستخدم باستخدام React، ننصح بقراءة [التفكير في React](/learn/thinking-in-react).
</Note>

يصف هذا القسم القواعد التي تحتاج إلى اتباعها لكتابة شيفرة React مألوفة (idiomatic). كتابة شيفرة بهذا الأسلوب يساعدك على بناء تطبيقات منظمة وآمنة وقابلة للتركيب. هذه الخصائص تجعل تطبيقك أكثر مرونة أمام التغييرات وأسهل للعمل عليه مع مطورين آخرين ومكتبات وأدوات.

تُعرَف هذه القواعد باسم **قواعد React**. هي قواعد — وليست مجرد إرشادات — بمعنى أن مخالفتها غالباً تعني وجود أخطاء في تطبيقك. كما تصبح شيفرتك أقل وضوحاً وأصعب للفهم والاستدلال عنها.

نوصي بشدة باستخدام [Strict Mode](/reference/react/StrictMode) مع [إضافة ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks) لـ React لمساعدة مشروعك على الالتزام بقواعد React. باتباع قواعد React يمكنك اكتشاف هذه الأخطاء ومعالجتها والحفاظ على قابلية صيانة تطبيقك.

---

## Components and Hooks must be pure {/*components-and-hooks-must-be-pure*/}

[النقاء في المكونات والخطافات](/reference/rules/components-and-hooks-must-be-pure) قاعدة أساسية في React تجعل تطبيقك قابلاً للتنبؤ، وسهل التصحيح، وتتيح لـ React تحسين شيفرتك تلقائياً.

* [Components must be idempotent](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent) - يُفترض أن تعيد مكونات React دائماً نفس المخرجات بالنسبة إلى مدخلاتها — props وstate وcontext.
* [Side effects must run outside of render](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) - لا ينبغي تنفيذ التأثيرات الجانبية أثناء التصيير، لأن React قد يصيّر المكونات أكثر من مرة لتحقيق أفضل تجربة ممكنة للمستخدم.
* [Props and state are immutable](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) - props وstate للمكون لقطات غير قابلة للتغيير بالنسبة إلى تصيير واحد. لا تُعدّلها مباشرة أبداً.
* [Return values and arguments to Hooks are immutable](/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable) - بعد تمرير قيم إلى Hook لا ينبغي تعديلها. كما في props داخل JSX، تصبح القيم غير قابلة للتغيير بعد تمريرها إلى Hook.
* [Values are immutable after being passed to JSX](/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx) - لا تُعدّل القيم بعد استخدامها في JSX. انقل التعديل إلى ما قبل إنشاء JSX.

---

## React calls Components and Hooks {/*react-calls-components-and-hooks*/}

[React مسؤول عن تصيير المكونات والخطافات عند الحاجة لتحسين تجربة المستخدم.](/reference/rules/react-calls-components-and-hooks) وهذا أسلوب تصريحي: تخبر React بما تريد تصييره في منطق المكون، وReact يحدد أفضل طريقة لعرضه للمستخدم.

* [Never call component functions directly](/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) - يجب استخدام المكونات في JSX فقط. لا تستدعها كدوال عادية.
* [Never pass around hooks as regular values](/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values) - يجب استدعاء الخطافات داخل المكونات فقط. لا تمرّرها كقيم عادية.

---

## Rules of Hooks {/*rules-of-hooks*/}

تُعرَّف الخطافات بدوال JavaScript، لكنها تمثّل نوعاً خاصاً من منطق واجهة المستخدم القابل لإعادة الاستخدام مع قيود على أماكن استدعائها. تحتاج إلى اتباع [Rules of Hooks](/reference/rules/rules-of-hooks) عند استخدامها.

* [Only call Hooks at the top level](/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level) - لا تستدعِ الخطافات داخل حلقات أو شروط أو دوال متدنية. استخدم الخطافات دائماً في المستوى الأعلى من دالة React، قبل أي `return` مبكر.
* [Only call Hooks from React functions](/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions) - لا تستدعِ الخطافات من دوال JavaScript عادية.

