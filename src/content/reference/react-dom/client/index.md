---
title: Client React DOM APIs
---

<Intro>

<<<<<<< HEAD
تسمح لك واجهات `react-dom/client` بتصيير مكونات React في طرف العميل (أي في المتصفح). تُستخدم هذه الواجهات عادة في المستوى الأعلى في تطبيقك لتهيئة شجرة React الخاصة بك. قد يقوم [إطار العمل الذي تستخدمه](/learn/creating-a-react-app#full-stack-frameworks) بالاتصال بهذه الواجهات بالنيابة عنك. ومعظم مكونات التطبيق لا تحتاج إلى استيرادها أو استخدامها.
=======
The `react-dom/client` APIs let you render React components on the client (in the browser). These APIs are typically used at the top level of your app to initialize your React tree. A [framework](/learn/creating-a-react-app#full-stack-frameworks) may call them for you. Most of your components don't need to import or use them.
>>>>>>> 2534424ec6c433cc2c811d5a0bd5a65b75efa5f0

</Intro>

---

## وظائف العميل {/*client-apis*/}

* تُمكنك [`createRoot`](/reference/react-dom/client/createRoot) من إنشاء نقطة بداية (Root) لعرض مكونات React داخل عنصر DOM في المتصفح.
* تُمكنك [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) من عرض مكونات React داخل عنصر DOM في المتصفح وتجديد محتوى HTML الذي تم إنشاؤه مسبقًا باستخدام [`react-dom/server`.](/reference/react-dom/server)

---

## دعم المتصفح {/*browser-support*/}

يدعم React جميع المتصفحات الشائعة، بما في ذلك Internet Explorer 9 والإصدارات الأحدث. وتضيف React بعض الحشوات (polyfills) لدعم المتصفحات القديمة مثل IE 9 و IE 10.
