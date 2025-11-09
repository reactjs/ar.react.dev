---
title: تحذيرات إيقاف react-test-renderer
---

## تحذير ReactTestRenderer.create() {/*reacttestrenderercreate-warning*/}

تم إيقاف react-test-renderer. سيظهر تحذير عند استدعاء ReactTestRenderer.create() أو ReactShallowRender.render(). ستبقى حزمة react-test-renderer متاحة على NPM ولكن لن يتم صيانتها وقد تتعطل مع ميزات React الجديدة أو التغييرات في آليات React الداخلية.

يوصي فريق React بترحيل اختباراتك إلى [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) أو [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/start/intro) للحصول على تجربة اختبار حديثة ومدعومة بشكل جيد.


## تحذير new ShallowRenderer() {/*new-shallowrenderer-warning*/}

لم تعد حزمة react-test-renderer تُصدِّر shallow renderer في `react-test-renderer/shallow`. كان هذا مجرد إعادة تغليف لحزمة منفصلة تم استخراجها مسبقًا: `react-shallow-renderer`. لذلك يمكنك الاستمرار في استخدام shallow renderer بنفس الطريقة عن طريق تثبيته مباشرة. انظر [Github](https://github.com/enzymejs/react-shallow-renderer) / [NPM](https://www.npmjs.com/package/react-shallow-renderer).