---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

تحذير 'invalid-aria-prop' سَيُطلَق إذا قُمت بمُحاولة تصيير عنصر DOM مع خاصية '*-aria' غير موجودة في [مواصفات](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) مبادرة إتاحة الويب "Web Accessibility Initiative WAI" وتطبيق إنترنت متاح غني "Accessible Rich Internet Application ARIA".

1. تأكَد من الإملاء بحذر ان كُنت تَظُنّ انك تستخدم خاصية صالحة. خاصيتا `aria-labelledby` و `aria-activedescendant` عادةً ما يُخطَأُ بِتَهجِئَتِهما.

2. لا تَتعرَّف React على الخاصية التي حَدَدتَها. سيتم إصلاح ذلك في إصدار مستقبلي من React على الأرجح. تُزيل React حاليًا جميع الخواص غير المُعَرَّفة ، لذلك تحديدهم في تطبيق React خاصَتِك لن يؤدي إلى تَصييرِهم.
