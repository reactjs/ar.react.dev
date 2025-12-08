---
<<<<<<< HEAD
title: "التوجيهات (Directives)"
=======
title: Directives
>>>>>>> e22544e68d6fffda33332771efe27034739f35a4
---

<RSC>

Directives are for use in [React Server Components](/reference/rsc/server-components).

</RSC>

<Intro>

<<<<<<< HEAD
تستخدم React علامتي توجيه، لإعلام أدوات التجميع (bundlers) بأن ملفاتك تحتوي على [مكونات من جانب الخادم RSC](/learn/creating-a-react-app#full-stack-frameworks)، والتعليمات اللازمة لذلك.
=======
Directives provide instructions to [bundlers compatible with React Server Components](/learn/creating-a-react-app#full-stack-frameworks).

>>>>>>> e22544e68d6fffda33332771efe27034739f35a4
</Intro>

---

## توجيهات الكود {/*source-code-directives*/}

* [`'use client'`](/reference/rsc/use-client) تميز الملف بأن ما فيه مكون من جانب العميل (client-side).
* [`'use server'`](/reference/rsc/use-server) تميز الدوال من جانب الخادم (server-side) التي يمكن استدعاؤها من الكود من جانب العميل (client-side).
