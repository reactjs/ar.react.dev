---
title: تحذير خاصّية ARIA غير صالحة
---

يظهر هذا التحذير إذا حاولت تصيير عنصر DOM بخاصّية `aria-*` غير موجودة في مواصفة WAI-ARIA [الرسمية](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties).

1. إن كنت تعتقد أن الخاصّية صحيحة، تحقق من الإملاء بدقّة. يُخطأ كثيراً في `aria-labelledby` و`aria-activedescendant`.

2. إن كتبت `aria-role`، فربما تقصد `role`.

3. وإلا، إن كنت على أحدث إصدار من React DOM وتأكدت أن الاسم موجود في مواصفة ARIA، يُرجى [الإبلاغ عن خلل](https://github.com/facebook/react/issues/new/choose).
