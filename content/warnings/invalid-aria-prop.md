---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

تحذير 'invalid-aria-prop' سَيُطلَق إذا قُمت بمُحاولة تصيير عنصر DOM مع خاصية '*-aria' غير موجودة في [مواصفات](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) مبادرة إتاحة الويب "Web Accessibility Initiative WAI" وتطبيق إنترنت متاح غني "Accessible Rich Internet Application ARIA".

1. تأكَد من الإملاء بحذر ان كُنت تَظُنّ انك تستخدم خاصية صالحة. خاصيتا `aria-labelledby` و `aria-activedescendant` عادةً ما يُخطَأُ بِتَهجِئَتِهما.

<<<<<<< HEAD
2. لا تَتعرَّف React على الخاصية التي حَدَدتَها. سيتم إصلاح ذلك في إصدار مستقبلي من React على الأرجح. تُزيل React حاليًا جميع الخواص غير المُعَرَّفة ، لذلك تحديدهم في تطبيق React خاصَتِك لن يؤدي إلى تَصييرِهم.
=======
2. If you wrote `aria-role`, you may have meant `role`.

3. Otherwise, if you're on the latest version of React DOM and verified that you're using a valid property name listed in the ARIA specification, please [report a bug](https://github.com/facebook/react/issues/new/choose).
>>>>>>> d483aebbac6d3c8f059b52abf21240bc91d0b96e
