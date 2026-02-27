---
title: eslint-plugin-react-hooks
version: rc
---

<Intro>

يوفر `eslint-plugin-react-hooks` قواعد ESLint لفرض [قواعد React](/reference/rules).

</Intro>

يساعدك هذا الإضافة على اكتشاف انتهاكات قواعد React في وقت البناء، مما يضمن أن مكوناتك و hooks تتبع قواعد React للصحة والأداء. تغطي عمليات lint كلاً من أنماط React الأساسية (exhaustive-deps و rules-of-hooks) والمشاكل التي يبلغ عنها React Compiler. يتم عرض تشخيصات React Compiler تلقائيًا بواسطة إضافة ESLint هذه، ويمكن استخدامها حتى لو لم يتبنى تطبيقك المُجمّع بعد.

<Note>
عندما يبلغ المُجمّع عن تشخيص، فهذا يعني أن المُجمّع كان قادرًا على اكتشاف نمط بشكل ثابت غير مدعوم أو يخرق قواعد React. عندما يكتشف ذلك، فإنه **تلقائيًا** يتخطى تلك المكونات و hooks، مع الحفاظ على بقية تطبيقك مُجمّع. هذا يضمن التغطية المثلى للتحسينات الآمنة التي لن تكسر تطبيقك.

ما يعنيه هذا بالنسبة لـ linting، هو أنك لا تحتاج إلى إصلاح جميع الانتهاكات فورًا. عالجها بوتيرتك الخاصة لزيادة عدد المكونات المُحسّنة تدريجيًا.
</Note>

## القواعد الموصى بها {/*recommended*/}

يتم تضمين هذه القواعد في الإعداد المسبق `recommended` في `eslint-plugin-react-hooks`:

* [`exhaustive-deps`](/reference/eslint-plugin-react-hooks/lints/exhaustive-deps) - يتحقق من أن مصفوفات التبعية لـ React hooks تحتوي على جميع التبعيات الضرورية
* [`rules-of-hooks`](/reference/eslint-plugin-react-hooks/lints/rules-of-hooks) - يتحقق من أن المكونات و hooks تتبع قواعد Hooks
* [`component-hook-factories`](/reference/eslint-plugin-react-hooks/lints/component-hook-factories) - يتحقق من دوال الترتيب الأعلى التي تعرّف مكونات أو hooks متداخلة
* [`config`](/reference/eslint-plugin-react-hooks/lints/config) - يتحقق من خيارات تكوين المُجمّع
* [`error-boundaries`](/reference/eslint-plugin-react-hooks/lints/error-boundaries) - يتحقق من استخدام Error Boundaries بدلاً من try/catch لأخطاء الأطفال
* [`gating`](/reference/eslint-plugin-react-hooks/lints/gating) - يتحقق من تكوين وضع gating
* [`globals`](/reference/eslint-plugin-react-hooks/lints/globals) - يتحقق من عدم التعيين/التعديل للمتغيرات العامة أثناء render
* [`immutability`](/reference/eslint-plugin-react-hooks/lints/immutability) - يتحقق من عدم تعديل props و state والقيم الأخرى غير القابلة للتغيير
* [`incompatible-library`](/reference/eslint-plugin-react-hooks/lints/incompatible-library) - يتحقق من عدم استخدام مكتبات غير متوافقة مع memoization
* [`preserve-manual-memoization`](/reference/eslint-plugin-react-hooks/lints/preserve-manual-memoization) - يتحقق من الحفاظ على memoization اليدوية الموجودة بواسطة المُجمّع
* [`purity`](/reference/eslint-plugin-react-hooks/lints/purity) - يتحقق من أن المكونات/hooks نقية من خلال التحقق من الدوال غير النقية المعروفة
* [`refs`](/reference/eslint-plugin-react-hooks/lints/refs) - يتحقق من الاستخدام الصحيح لـ refs، وعدم القراءة/الكتابة أثناء render
* [`set-state-in-effect`](/reference/eslint-plugin-react-hooks/lints/set-state-in-effect) - يتحقق من عدم استدعاء setState بشكل متزامن في effect
* [`set-state-in-render`](/reference/eslint-plugin-react-hooks/lints/set-state-in-render) - يتحقق من عدم تعيين state أثناء render
* [`static-components`](/reference/eslint-plugin-react-hooks/lints/static-components) - يتحقق من أن المكونات ثابتة، ولا يتم إعادة إنشائها في كل render
* [`unsupported-syntax`](/reference/eslint-plugin-react-hooks/lints/unsupported-syntax) - يتحقق من عدم استخدام بناء جملة لا يدعمه React Compiler
* [`use-memo`](/reference/eslint-plugin-react-hooks/lints/use-memo) - يتحقق من استخدام hook `useMemo` بدون قيمة إرجاع
