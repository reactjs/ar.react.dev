---
title: "واجهات React القديمة"
---

<Intro>

يتم تصدير هذه الواجهات من حزمة `react`، لكن لا يُنصح باستخدامها في الكود المكتوب حديثًا. راجع صفحات الواجهات الفردية المرتبطة للحصول على البدائل المقترحة.

</Intro>

---

## الواجهات القديمة {/*legacy-apis*/}

* [`Children`](/reference/react/Children) تتيح لك التلاعب وتحويل JSX المُستَقبَل كـ prop `children`. [راجع البدائل.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) تتيح لك إنشاء عنصر React باستخدام عنصر آخر كنقطة بداية. [راجع البدائل.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) تتيح لك تعريف مكون React كـ class JavaScript. [راجع البدائل.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) تتيح لك إنشاء عنصر React. عادةً، ستستخدم JSX بدلاً من ذلك.
* [`createRef`](/reference/react/createRef) تنشئ كائن ref يمكن أن يحتوي على قيمة عشوائية. [راجع البدائل.](/reference/react/createRef#alternatives)
* [`isValidElement`](/reference/react/isValidElement) تتحقق مما إذا كانت القيمة عنصر React. عادةً تُستخدم مع [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) مشابه لـ [`Component`,](/reference/react/Component) لكنه يتخطى إعادة التصيير مع نفس props. [راجع البدائل.](/reference/react/PureComponent#alternatives)


---

## الواجهات المُهملة {/*deprecated-apis*/}

<Deprecated>

سيتم إزالة هذه الواجهات في إصدار رئيسي مستقبلي من React.

</Deprecated>

* [`createFactory`](/reference/react/createFactory) تتيح لك إنشاء دالة تنتج عناصر React من نوع معين.
