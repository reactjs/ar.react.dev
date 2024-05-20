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

<<<<<<< HEAD:src/content/reference/react/directives.md
* [`'use client'`](/reference/react/use-client) تميز الملف بأن ما فيه مكون من جانب العميل (client-side).
* [`'use server'`](/reference/react/use-server) تميز الدوال من جانب الخادم (server-side) التي يمكن استدعاؤها من الكود من جانب العميل (client-side).
=======
* [`'use client'`](/reference/rsc/use-client) lets you mark what code runs on the client.
* [`'use server'`](/reference/rsc/use-server) marks server-side functions that can be called from client-side code.
>>>>>>> 9967ded394d85af74e0ecdbf00feeb7921a28142:src/content/reference/rsc/directives.md
