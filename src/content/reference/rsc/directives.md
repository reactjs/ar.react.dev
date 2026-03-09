---
<<<<<<< HEAD
title: "التوجيهات (Directives)"
=======
title: Directives
>>>>>>> 7c90c6eb4bb93a5eacb9cb4ad4ca496c32984636
---

<RSC>

Directives are for use in [React Server Components](/reference/rsc/server-components).

</RSC>

<Intro>

<<<<<<< HEAD
تستخدم React علامتي توجيه، لإعلام أدوات التجميع (bundlers) بأن ملفاتك تحتوي على [مكونات من جانب الخادم RSC](/learn/creating-a-react-app#full-stack-frameworks)، والتعليمات اللازمة لذلك.
=======
Directives provide instructions to [bundlers compatible with React Server Components](/learn/creating-a-react-app#full-stack-frameworks).

>>>>>>> 7c90c6eb4bb93a5eacb9cb4ad4ca496c32984636
</Intro>

---

## توجيهات الكود {/*source-code-directives*/}

* [`'use client'`](/reference/rsc/use-client) تميز الملف بأن ما فيه مكون من جانب العميل (client-side).
* [`'use server'`](/reference/rsc/use-server) تميز الدوال من جانب الخادم (server-side) التي يمكن استدعاؤها من الكود من جانب العميل (client-side).
