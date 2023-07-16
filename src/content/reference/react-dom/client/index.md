---
title: واجهات React DOM البرمجية للعميل
---

<Intro>

تسمح لك واجهات `react-dom/client` بتصيير مكونات React على العميل (في المتصفح). تُستخدم هذه الواجهات عادة في المستوى الأعلى في تطبيقك لتهيئة شجرة React الخاصة بك. قد يقوم [إطار العمل الذي تستخدمه](/learn/start-a-new-react-project#production-grade-react-frameworks) بالاتصال بهذه الواجهات بالنيابة عنك. ومعظم مكونات التطبيق لا تحتاج إلى استيرادها أو استخدامها.

</Intro>

---

## وظائف العميل {/*client-apis*/}

* تُمكنك [`createRoot`](/reference/react-dom/client/createRoot) من إنشاء نقطة بداية (Root) لعرض مكونات React داخل عنصر DOM في المتصفح.
* تُمكنك [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) من عرض مكونات React داخل عنصر DOM في المتصفح وتجديد محتوى HTML الذي تم إنشاؤه مسبقًا باستخدام [`react-dom/server`.](/reference/react-dom/server)

---

## دعم المتصفح {/*browser-support*/}

يدعم React جميع المتصفحات الشائعة، بما في ذلك Internet Explorer 9 والإصدارات الأحدث. تتطلب بعض البوليفيلز (polyfills) لدعم المتصفحات القديمة مثل IE 9 و IE 10.