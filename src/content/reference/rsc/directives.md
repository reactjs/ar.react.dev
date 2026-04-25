---
title: "التوجيهات (Directives)"
---

<RSC>

التوجيهات مخصّصة للاستخدام مع [مكوّنات خادم React](/reference/rsc/server-components).

</RSC>

<Intro>

تستخدم React علامتي توجيه لإعلام أدوات التجميع (bundlers) بأن ملفاتك تحتوي على [مكوّنات خادم React (RSC)](/learn/creating-a-react-app#full-stack-frameworks)، والتعليمات اللازمة لذلك.
</Intro>

---

## توجيهات الشيفرة {/*source-code-directives*/}

* [`'use client'`](/reference/rsc/use-client) يوسّم الملف بأن ما فيه يُنفَّذ على جانب العميل (client).
* [`'use server'`](/reference/rsc/use-server) يوسّم الدوال التي تعمل على الخادم ويمكن استدعاؤها من شيفرة العميل.
