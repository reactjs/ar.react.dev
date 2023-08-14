---
<<<<<<< HEAD
title: "التوجيهات (Directives)"
=======
title: "Directives"
canary: true
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77
---

<Canary>

These directives are needed only if you're [using React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) or building a library compatible with them.

</Canary>

<Intro>

<<<<<<< HEAD
تستخدم React علامتي توجيه، لإعلام أدوات التجميع (bundlers) بأن ملفاتك تحتوي على [مكونات من جانب الخادم RSC](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)، والتعليمات اللازمة لذلك.
=======
Directives provide instructions to [bundlers compatible with React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77

</Intro>

---

## توجيهات الكود {/*source-code-directives*/}

* [`'use client'`](/reference/react/use-client) تميز الملف بأن ما فيه مكون من جانب العميل (client-side).
* [`'use server'`](/reference/react/use-server) تميز الدوال من جانب الخادم (server-side) التي يمكن استدعاؤها من الكود من جانب العميل (client-side).