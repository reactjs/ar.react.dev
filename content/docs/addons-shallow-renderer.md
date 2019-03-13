---
id: shallow-renderer
title: Shallow Renderer
permalink: docs/shallow-renderer.html
layout: docs
category: Reference
---

**Importing**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // ES5 with npm
```

## Overview {#overview}

عند كتابة وحدات اختبار لمكتبة React يكون التصيير السطحي مفيدًا لك. يُتيح لك التصيير السطحي تصيير مكوّن على عمق مستوى واحد وتوضيح الحقائق حول ما يُعيده تابع التصيير، بدون القلق حول سلوك المكوّنات الأبناء والتي لم تُصيَّر أو ينشأ عنها نسخة. لا يحتاج ذلك إلى DOM.

على سبيل المثال إن كان لديك المكوّن التالي:

```javascript
function MyComponent() {
  return (
    <div>
      <span className="heading">Title</span>
      <Subcomponent foo="bar" />
    </div>
  );
}
```

بإمكانك كتابة ما يلي:

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// in your test:
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">Title</span>,
  <Subcomponent foo="bar" />
]);
```

يمتلك الاختبار السطحي حاليًّا بعض المحدوديات، منها عدم دعم المراجع.

> ملاحظة:
>
> نوصي بالتحقق من واجهة[ واجهة برمجة تطبيق التصيير السطحي](https://airbnb.io/enzyme/docs/api/shallow.html). فهي تُزوِّدنا بواجهة برمجة تطبيق ذات مستوى أعلى وأفضل وبنفس الوظيفة.

## مرجع {#reference}

### `()shallowRenderer.render` {#shallowrendererrender}

بإمكانك التفكير بالتصيير السطحي كمكان لتصيير المكوّن الذي تختبره، والذي منه تستطيع استخراج ناتج المكوّن.

إنّ التابع `shallowRenderer.render()`‎ مشابه للتابع `ReactDOM.render()`‎ ولكنّه لا يتطلّب DOM ويُصيِّر فقط مستوى أدنى وحيد. يعني هذا أنّك تستطيع اختبار المكوّنات بشكل معزول عن مكوّناتها الأبناء.

### `()shallowRenderer.getRenderOutput` {#shallowrenderergetrenderoutput}

بعد استدعاء التابع `shallowRenderer.render()`‎ بإمكانك استخدام التابع `shallowRenderer.getRenderOutput()‎` للحصول على الناتج المُصيَّر.

بإمكانك بعدها البدء بتجميع الحقائق حول الناتج.

