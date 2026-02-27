---
title: نظرة عامة على مرجع React
---

<Intro>

يوفر هذا القسم وثائق مرجعية تفصيلية للعمل مع React. للحصول على مقدمة عن React، يرجى زيارة قسم [التعلم](/learn).

</Intro>

تنقسم وثائق مرجع React إلى أقسام فرعية وظيفية:

## React {/*react*/}

ميزات React البرمجية:

* [Hooks](/reference/react/hooks) - استخدم ميزات React المختلفة من مكوناتك.
* [Components](/reference/react/components) - مكونات مدمجة يمكنك استخدامها في JSX الخاص بك.
* [APIs](/reference/react/apis) - واجهات برمجية مفيدة لتعريف المكونات.
* [Directives](/reference/rsc/directives) - توفر تعليمات لأدوات bundlers المتوافقة مع React Server Components.

## React DOM {/*react-dom*/}

يحتوي React-dom على ميزات مدعومة فقط لتطبيقات الويب (التي تعمل في بيئة DOM المتصفح). ينقسم هذا القسم إلى ما يلي:

* [Hooks](/reference/react-dom/hooks) - Hooks لتطبيقات الويب التي تعمل في بيئة DOM المتصفح.
* [Components](/reference/react-dom/components) - تدعم React جميع مكونات HTML و SVG المدمجة في المتصفح.
* [APIs](/reference/react-dom) - تحتوي حزمة `react-dom` على طرق مدعومة فقط في تطبيقات الويب.
* [Client APIs](/reference/react-dom/client) - تتيح لك واجهات `react-dom/client` تصيير مكونات React على العميل (في المتصفح).
* [Server APIs](/reference/react-dom/server) - تتيح لك واجهات `react-dom/server` تصيير مكونات React إلى HTML على الخادم.

## قواعد React {/*rules-of-react*/}

لدى React تعابير اصطلاحية — أو قواعد — لكيفية التعبير عن الأنماط بطريقة سهلة الفهم وتنتج تطبيقات عالية الجودة:

* [Components و Hooks يجب أن تكون نقية](/reference/rules/components-and-hooks-must-be-pure) – النقاء يجعل كودك أسهل في الفهم والتصحيح، ويسمح لـ React بتحسين مكوناتك و hooks تلقائيًا بشكل صحيح.
* [React تستدعي Components و Hooks](/reference/rules/react-calls-components-and-hooks) – React مسؤولة عن تصيير المكونات و hooks عند الضرورة لتحسين تجربة المستخدم.
* [قواعد Hooks](/reference/rules/rules-of-hooks) – يتم تعريف Hooks باستخدام دوال JavaScript، لكنها تمثل نوعًا خاصًا من منطق واجهة المستخدم القابل لإعادة الاستخدام مع قيود على أماكن استدعائها.

## الواجهات القديمة {/*legacy-apis*/}

* [الواجهات القديمة](/reference/react/legacy) - يتم تصديرها من حزمة `react`، لكن لا يُنصح باستخدامها في الكود المكتوب حديثًا.
