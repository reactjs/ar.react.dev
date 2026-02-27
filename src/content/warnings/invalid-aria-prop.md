---
title: تحذير خاصية ARIA غير صالحة
---

سيظهر هذا التحذير إذا حاولت تصيير عنصر DOM بخاصية `aria-*` غير موجودة في مواصفات [Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA)](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties).

1. إذا كنت تعتقد أنك تستخدم خاصية صالحة، فتحقق من الإملاء بعناية. غالبًا ما يتم تهجئة `aria-labelledby` و `aria-activedescendant` بشكل خاطئ.

2. إذا كتبت `aria-role`، فربما كنت تقصد `role`.

3. بخلاف ذلك، إذا كنت تستخدم أحدث إصدار من React DOM وتحققت من أنك تستخدم اسم خاصية صالح مُدرج في مواصفات ARIA، فيُرجى [الإبلاغ عن خطأ](https://github.com/facebook/react/issues/new/choose).
