---
title: قواعد React
---

<Intro>
كما أن للغات البرمجة المختلفة طرقها الخاصة للتعبير عن المفاهيم، فإن React لديها لغتها الخاصة - أو قواعدها - لكيفية التعبير عن الأنماط بطريقة يسهل فهمها وتؤدي إلى تطبيقات عالية الجودة.
</Intro>

<InlineToc />

---

<Note>
لمعرفة المزيد عن التعبير عن واجهات المستخدم باستخدام React، نوصي بقراءة [التفكير بطريقة React](/learn/thinking-in-react).
</Note>

يصف هذا القسم القواعد التي تحتاج إلى اتباعها لكتابة كود React اصطلاحي. كتابة كود React اصطلاحي يمكن أن يساعدك في كتابة تطبيقات منظمة وآمنة وقابلة للتكوين. هذه الخصائص تجعل تطبيقك أكثر مرونة للتغييرات وتسهل العمل مع المطورين والمكتبات والأدوات الأخرى.

تُعرف هذه القواعد باسم **قواعد React**. إنها قواعد - وليست مجرد إرشادات - بمعنى أنه إذا تم كسرها، فمن المحتمل أن يحتوي تطبيقك على أخطاء. كما يصبح كودك غير اصطلاحي وأكثر صعوبة في الفهم والتفكير فيه.

نوصي بشدة باستخدام [Strict Mode](/reference/react/StrictMode) جنبًا إلى جنب مع [إضافة ESLint من React](https://www.npmjs.com/package/eslint-plugin-react-hooks) لمساعدة قاعدة كودك على اتباع قواعد React. من خلال اتباع قواعد React، ستتمكن من العثور على هذه الأخطاء ومعالجتها والحفاظ على تطبيقك قابلاً للصيانة.

---

## يجب أن تكون Components و Hooks نقية {/*components-and-hooks-must-be-pure*/}

[النقاء في Components و Hooks](/reference/rules/components-and-hooks-must-be-pure) هو قاعدة أساسية في React تجعل تطبيقك يمكن التنبؤ به، وسهل تصحيحه، وتسمح لـ React بتحسين كودك تلقائيًا.

* [يجب أن تكون Components متماثلة](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent) – يُفترض أن مكونات React تُرجع دائمًا نفس الإخراج فيما يتعلق بمدخلاتها - props و state والسياق.
* [يجب أن تعمل الآثار الجانبية خارج render](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) – يجب ألا تعمل الآثار الجانبية في render، حيث يمكن لـ React تصيير المكونات عدة مرات لإنشاء أفضل تجربة مستخدم ممكنة.
* [Props و state غير قابلة للتغيير](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) – props و state الخاصة بالمكون هي لقطات غير قابلة للتغيير فيما يتعلق بـ render واحد. لا تغيرها مباشرة أبدًا.
* [قيم الإرجاع والوسائط لـ Hooks غير قابلة للتغيير](/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable) – بمجرد تمرير القيم إلى Hook، يجب ألا تعدلها. مثل props في JSX، تصبح القيم غير قابلة للتغيير عند تمريرها إلى Hook.
* [القيم غير قابلة للتغيير بعد تمريرها إلى JSX](/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx) – لا تغير القيم بعد استخدامها في JSX. انقل التغيير قبل إنشاء JSX.

---

## React تستدعي Components و Hooks {/*react-calls-components-and-hooks*/}

[React مسؤولة عن تصيير المكونات و hooks عند الضرورة لتحسين تجربة المستخدم.](/reference/rules/react-calls-components-and-hooks) إنها تعريفية: أنت تخبر React بما تريد تصييره في منطق مكونك، وسيكتشف React أفضل طريقة لعرضه لمستخدمك.

* [لا تستدعِ دوال المكونات مباشرةً أبدًا](/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) – يجب استخدام المكونات فقط في JSX. لا تستدعها كدوال عادية.
* [لا تمرر hooks كقيم عادية أبدًا](/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values) – يجب استدعاء Hooks فقط داخل المكونات. لا تمررها أبدًا كقيمة عادية.

---

## قواعد Hooks {/*rules-of-hooks*/}

تُعرف Hooks باستخدام دوال JavaScript، لكنها تمثل نوعًا خاصًا من منطق واجهة المستخدم القابل لإعادة الاستخدام مع قيود على المكان الذي يمكن استدعاؤها فيه. تحتاج إلى اتباع [قواعد Hooks](/reference/rules/rules-of-hooks) عند استخدامها.

* [استدعِ Hooks فقط في المستوى الأعلى](/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level) – لا تستدعِ Hooks داخل الحلقات أو الشروط أو الدوال المتداخلة. بدلاً من ذلك، استخدم دائمًا Hooks في المستوى الأعلى من دالة React الخاصة بك، قبل أي عوائد مبكرة.
* [استدعِ Hooks فقط من دوال React](/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions) – لا تستدعِ Hooks من دوال JavaScript العادية.
