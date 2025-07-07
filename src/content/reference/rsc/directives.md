---
<<<<<<< HEAD
title: "التوجيهات (Directives)"
canary: true
=======
title: Directives
>>>>>>> 341c312916e1b657262bbe14b134a6f1779fecf1
---

<RSC>

Directives are for use in [React Server Components](/reference/rsc/server-components).

</RSC>

<Intro>

<<<<<<< HEAD
تستخدم React علامتي توجيه، لإعلام أدوات التجميع (bundlers) بأن ملفاتك تحتوي على [مكونات من جانب الخادم RSC](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)، والتعليمات اللازمة لذلك.
=======
Directives provide instructions to [bundlers compatible with React Server Components](/learn/start-a-new-react-project#full-stack-frameworks).

>>>>>>> 341c312916e1b657262bbe14b134a6f1779fecf1
</Intro>

---

## توجيهات الكود {/*source-code-directives*/}

* [`'use client'`](/reference/rsc/use-client) تميز الملف بأن ما فيه مكون من جانب العميل (client-side).
* [`'use server'`](/reference/rsc/use-server) تميز الدوال من جانب الخادم (server-side) التي يمكن استدعاؤها من الكود من جانب العميل (client-side).
