---
title: نظرة عامة على مرجع React
---

<Intro>

يوفّر هذا القسم مرجعاً تفصيلياً للعمل مع React. لمقدمة عن React، يُرجى زيارة قسم [التعلّم](/learn).

</Intro>

يُقسَّم مرجع React إلى أقسام فرعية وظيفية:

## React {/*react*/}

ميزات React البرمجية:

* [Hooks](/reference/react/hooks) - استخدام ميزات React المختلفة من مكوناتك.
* [Components](/reference/react/components) - مكونات مدمجة يمكنك استخدامها في JSX.
* [APIs](/reference/react/apis) - واجهات برمجية مفيدة لتعريف المكونات.
* [Directives](/reference/rsc/directives) - تعليمات لأدوات التجميع المتوافقة مع React Server Components.

## React DOM {/*react-dom*/}

يحتوي React DOM على ميزات مدعومة لتطبيقات الويب فقط (التي تعمل في بيئة DOM في المتصفح). يُقسَّم هذا القسم إلى ما يلي:

* [Hooks](/reference/react-dom/hooks) - خطافات لتطبيقات الويب التي تعمل في بيئة DOM في المتصفح.
* [Components](/reference/react-dom/components) - يدعم React جميع مكونات HTML وSVG المدمجة في المتصفح.
* [APIs](/reference/react-dom) - تحتوي حزمة `react-dom` على دوال مدعومة في تطبيقات الويب فقط.
* [Client APIs](/reference/react-dom/client) - واجهات `react-dom/client` تتيح لك تصيير مكونات React على العميل (في المتصفح).
* [Server APIs](/reference/react-dom/server) - واجهات `react-dom/server` تتيح لك تصيير مكونات React إلى HTML على الخادم.
* [Static APIs](/reference/react-dom/static) - واجهات `react-dom/static` تتيح لك توليد HTML ثابت لمكونات React.

## React Compiler {/*react-compiler*/}

يُعدّ React Compiler أداة تحسين تُشغَّل وقت البناء وتطبّق التخزين المؤقت (memoization) تلقائياً على مكونات React وقيمك:

* [Configuration](/reference/react-compiler/configuration) - خيارات إعداد React Compiler.
* [Directives](/reference/react-compiler/directives) - توجيهات على مستوى الدالة للتحكم في التجميع.
* [Compiling Libraries](/reference/react-compiler/compiling-libraries) - دليل لشحن شيفرة مكتبة مُجمَّعة مسبقاً.

## ESLint Plugin React Hooks {/*eslint-plugin-react-hooks*/}

[إضافة ESLint لخطافات React](/reference/eslint-plugin-react-hooks) تساعد على فرض قواعد React:

* [Lints](/reference/eslint-plugin-react-hooks) - توثيق تفصيلي لكل قاعدة تحقق (lint) مع أمثلة.

## Rules of React {/*rules-of-react*/}

لدى React صيغ — أو قواعد — لكيفية التعبير عن الأنماط بطريقة سهلة الفهم وتُنتِج تطبيقات عالية الجودة:

* [Components and Hooks must be pure](/reference/rules/components-and-hooks-must-be-pure) - النقاء يجعل شيفرتك أسهل للفهم والتصحيح، ويتيح لـ React تحسين مكوناتك وخطافاتك تلقائياً بشكل صحيح.
* [React calls Components and Hooks](/reference/rules/react-calls-components-and-hooks) - React مسؤول عن تصيير المكونات والخطافات عند الحاجة لتحسين تجربة المستخدم.
* [Rules of Hooks](/reference/rules/rules-of-hooks) - تُعرَّف الخطافات بدوال JavaScript، لكنها تمثّل نوعاً خاصاً من منطق واجهة المستخدم القابل لإعادة الاستخدام مع قيود على أماكن استدعائها.

## Legacy APIs {/*legacy-apis*/}

* [Legacy APIs](/reference/react/legacy) - تُصدَّر من حزمة `react`، لكنها غير مُوصى بها في الشيفرة الجديدة.
