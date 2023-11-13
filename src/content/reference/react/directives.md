---
title: "التوجيهات (Directives)"
canary: true
---

<Canary>

These directives are needed only if you're [using React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) or building a library compatible with them.

</Canary>

<Intro>

تستخدم React علامتي توجيه، لإعلام أدوات التجميع (bundlers) بأن ملفاتك تحتوي على [مكونات من جانب الخادم RSC](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)، والتعليمات اللازمة لذلك.
</Intro>

---

## توجيهات الكود {/*source-code-directives*/}

<<<<<<< HEAD
* [`'use client'`](/reference/react/use-client) تميز الملف بأن ما فيه مكون من جانب العميل (client-side).
* [`'use server'`](/reference/react/use-server) تميز الدوال من جانب الخادم (server-side) التي يمكن استدعاؤها من الكود من جانب العميل (client-side).
=======
* [`'use client'`](/reference/react/use-client) lets you mark what code runs on the client.
* [`'use server'`](/reference/react/use-server) marks server-side functions that can be called from client-side code.
>>>>>>> fcd00068bd1bdd4eb37e3e0ab0488a9d093670bc
