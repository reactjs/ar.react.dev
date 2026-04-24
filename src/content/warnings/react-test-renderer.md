---
title: تحذيرات إهمال react-test-renderer
---

## تحذير ReactTestRenderer.create() {/*reacttestrenderercreate-warning*/}

حزمة react-test-renderer مهملة. يظهر تحذير عند استدعاء `ReactTestRenderer.create()` أو `ReactShallowRender.render()`. ستبقى الحزمة على NPM لكن دون صيانة وقد تنكسر مع ميزات React الجديدة أو تغيّرات داخلية.

يُنصح بترحيل الاختبارات إلى [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) أو [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/start/intro) لتجربة اختبار حديثة ومدعومة.


## تحذير new ShallowRenderer() {/*new-shallowrenderer-warning*/}

لم تعد حزمة react-test-renderer تصدّر shallow renderer من `react-test-renderer/shallow`. كان ذلك إعادة تغليف لحزمة منفصلة: `react-shallow-renderer`. يمكنك الاستمرار بنفس الأسلوب بتثبيتها مباشرة. راجع [GitHub](https://github.com/enzymejs/react-shallow-renderer) / [NPM](https://www.npmjs.com/package/react-shallow-renderer).
