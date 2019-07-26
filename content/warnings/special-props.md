---
title: Special Props Warning
layout: single
permalink: warnings/special-props.html
---

تُمرر معظم الخواص التي على JSX إلى المُكوّن ولكن هناك خاصيتان مُميزتان (`ref`و `key`) اللتان تُستخدما من قِبل React ولذلك لا يتم تمريرهما للمُكوّن.

على سبيل المثال، مُحاولة الوصول إلى `this.props.key` من مُكوّن (أي من دالّة التصيير أو [أنواع الخواص "propTypes"](/docs/typechecking-with-proptypes.html#proptypes)) غير مُعرّفة. إن كُنت بحاجة للوصول إلى نفس القيمة داخل المُكوّن الإبن فعليك بتمريرها كخاصية أُخرى (مثل: `<ListItemWrapper key={result.id} id={result.id} />`). بينما من المُمكن أن يبدو زائد عما ينبغي بل أنه من المُهم فصل منطقية التطبيق عن تلميحات المُصالحة "reconciling hints". 
