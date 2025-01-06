---
<<<<<<< HEAD
title: "التوجيهات (Directives)"
canary: true
=======
title: Directives
>>>>>>> b1a249d597016c6584e4c186daa28b180cc9aafc
---

<RSC>

Directives are for use in [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).

</RSC>

<Intro>

تستخدم React علامتي توجيه، لإعلام أدوات التجميع (bundlers) بأن ملفاتك تحتوي على [مكونات من جانب الخادم RSC](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)، والتعليمات اللازمة لذلك.
</Intro>

---

## توجيهات الكود {/*source-code-directives*/}

* [`'use client'`](/reference/rsc/use-client) تميز الملف بأن ما فيه مكون من جانب العميل (client-side).
* [`'use server'`](/reference/rsc/use-server) تميز الدوال من جانب الخادم (server-side) التي يمكن استدعاؤها من الكود من جانب العميل (client-side).
