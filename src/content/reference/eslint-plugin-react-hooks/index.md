---
title: eslint-plugin-react-hooks
version: rc
---

<Intro>

`eslint-plugin-react-hooks` يوفّر قواعد ESLint لتطبيق [قواعد React](/reference/rules).

</Intro>

تساعدك الإضافة على اكتشاف مخالفات قواعد React وقت البناء، لتلتزم المكوّنات والـ hooks بقواعد الصحة والأداء. تغطي التحذيرات أنماط React الأساسية (مثل exhaustive-deps وrules-of-hooks) ومسائل يبلّغ عنها React Compiler. تُعرَض تشخيصات المُصرّف تلقائياً عبر هذه الإضافة، ويمكن استخدامها حتى إن لم يكن المُصرّف مفعّلاً في تطبيقك بعد.

<Note>
عندما يبلّغ المُصرّف عن تشخيص، يعني أنه استطاع اكتشاف نمط غير مدعوم أو يخالف قواعد React. عندها **يتخطّى** تلقائياً تلك المكوّنات والـ hooks مع الإبقاء على بقية التطبيق مُجمَّعاً، لأقصى تغطية آمنة من التحسينات دون كسر التطبيق.

بالنسبة للـ lint، لا يلزمك إصلاح كل المخالفات فوراً. عالجها بوتيرتك لزيادة عدد المكوّنات المُحسَّنة تدريجياً.
</Note>

## القواعد الموصى بها {/*recommended*/}

هذه القواعد ضمن الإعداد `recommended` في `eslint-plugin-react-hooks`:

* [`exhaustive-deps`](/reference/eslint-plugin-react-hooks/lints/exhaustive-deps) — يتحقق أن مصفوفات تبعيات الـ hooks تتضمّن كل التبعيات اللازمة
* [`rules-of-hooks`](/reference/eslint-plugin-react-hooks/lints/rules-of-hooks) — يتحقق أن المكوّنات والـ hooks تتبع Rules of Hooks
* [`component-hook-factories`](/reference/eslint-plugin-react-hooks/lints/component-hook-factories) — دوال رتبة أعلى تُعرّف مكوّنات أو hooks متداخلة
* [`config`](/reference/eslint-plugin-react-hooks/lints/config) — صحة خيارات إعداد المُصرّف
* [`error-boundaries`](/reference/eslint-plugin-react-hooks/lints/error-boundaries) — استخدام Error Boundaries بدلاً من try/ccatch لأخطاء الأبناء
* [`gating`](/reference/eslint-plugin-react-hooks/lints/gating) — ضبط وضع gating
* [`globals`](/reference/eslint-plugin-react-hooks/lints/globals) — تجنّب إسناد/تعديل عامات أثناء التصيير
* [`immutability`](/reference/eslint-plugin-react-hooks/lints/immutability) — عدم تعديل props أو state أو قيم غير قابلة للتغيير
* [`incompatible-library`](/reference/eslint-plugin-react-hooks/lints/incompatible-library) — مكتبات غير متوافقة مع التذكّر
* [`preserve-manual-memoization`](/reference/eslint-plugin-react-hooks/lints/preserve-manual-memoization) — الإبقاء على التذكّر اليدوي عند المُصرّف
* [`purity`](/reference/eslint-plugin-react-hooks/lints/purity) — نقاء المكوّنات/الـ hooks عبر دوال معروفة بعدم النقاء
* [`refs`](/reference/eslint-plugin-react-hooks/lints/refs) — استخدام صحيح للـ refs دون قراءة/كتابة أثناء التصيير
* [`set-state-in-effect`](/reference/eslint-plugin-react-hooks/lints/set-state-in-effect) — عدم استدعاء setState متزامناً داخل effect
* [`set-state-in-render`](/reference/eslint-plugin-react-hooks/lints/set-state-in-render) — عدم ضبط الحالة أثناء التصيير
* [`static-components`](/reference/eslint-plugin-react-hooks/lints/static-components) — مكوّنات ثابتة لا تُعاد إنشاؤها كل تصيير
* [`unsupported-syntax`](/reference/eslint-plugin-react-hooks/lints/unsupported-syntax) — صياغة لا يدعمها React Compiler
* [`use-memo`](/reference/eslint-plugin-react-hooks/lints/use-memo) — استخدام `useMemo` دون قيمة مُرجَعة
