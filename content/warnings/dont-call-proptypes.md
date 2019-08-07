---
title: Don't Call PropTypes Warning
layout: single
permalink: warnings/dont-call-proptypes.html
---

> ملاحظة:
>
> تم ترحيل `React.PropTypes` إلى حزمة منفصلة منذ نسخة React v15.5. الرجاء استخدام  [مكتبة `prop-types`](https://www.npmjs.com/package/prop-types) عوضًا عن ذلك.
>
> نحن نوفر [a codemod script](/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes) لأتمَتَت التحويل.

في إصدار رئيسي مستقبلي من React ، سيتم إزالة الشيفرة التي تطبق دوال التحقق من انواع الخواص في نُسخة الإنتاج. عند حدوث ذلك ، أي شيفرة تستدعي هذه الدوال -التي لم يتم إزالتها في نسخة الإنتاج- يدويًا سيُحدث "يُلقي" خطأ.

### لا بأس بتصريح PropTypes {#declaring-proptypes-is-still-fine}

استخدام PropTypes الإعتيادي ما زال مدعومًا:

```javascript
Button.propTypes = {
  highlighted: PropTypes.bool
};
```

لا تغيّرات هنا.

### لا تستدعي PropTypes مباشرة {#dont-call-proptypes-directly}

استخدام PropTypes بأي طريقة أُخرى غير تعليقها بمُكوّن React لم يَعُد مدعومًا:

```javascript
var apiShape = PropTypes.shape({
  body: PropTypes.object,
  statusCode: PropTypes.number.isRequired
}).isRequired;

// Not supported!
var error = apiShape(json, 'response');
```

إن كُنتَ تَعتَمِد على استخدام PropTypes بهذه الطريقة ، فنحنُ نُشَجِّع على استخدام او عمل نسخة "fork" من PropTypes مثل [هاتين](https://github.com/aackerman/PropTypes) [الحزمتين](https://github.com/developit/proptypes).

ان لم تُصلِح التحذير فأن هذه الشيفرة ستنهار "crash" في نسخة الإصدار مع React 16.

### ان كنت لا تَستَدعي PropTypes مُباشرة ولكن التحذير لا زال يظهر {#if-you-dont-call-proptypes-directly-but-still-get-the-warning}

استعرض رَصّة "stack" المُنتَج من هذه التحذير. عند القيام بذلك ، ستجد تعريف المُكون المسؤل عن استدعاء PropTypes المُباشر. من المُرَجَّح ان المُشكلة تُعزى الى PropTypes الطرف الثالث "third-party" التي تُغَلِّف PropTypes من React. مثلًا:

```js
Button.propTypes = {
  highlighted: ThirdPartyPropTypes.deprecated(
    PropTypes.bool,
    'Use `active` prop instead'
  )
}
```

في هذه الحالة ، `ThirdPartyPropTypes.deprecated` مُغَلِّف "wrapper" يستدعي `PropTypes.bool`. لا بأس بهذا النمط لوحده ولكنه يُطلق إيجابية زائفة "false positive" لأن React تعتقد انك تستدعي PropTypes مُباشرة. المَقطع التالي سيشرح كيفية إصلاح هذه المُشكِلة لِمَكتبة تُطَبِق  شيئًا مِثل `ThirdPartyPropTypes`. إن لَم تَكُن مُؤَلِّف المكتبة يُمكِنُكَ تقديم طلب مُشكلة "issue" ضدها.

### إصلاح الإيجابيّة الزائفة في PropTypes الطرف الثالث {#fixing-the-false-positive-in-third-party-proptypes}

إن كُنت مُؤَلِّف مكتبة PropTypes طرف ثالث و كنت تسمح للمُستَخدمين بِتَغليف PropTypes من React الموجودة ، فقد يَرون هذا التحذير آتيًا من المكتبة خاصتك. يَحُدث هذا لأن React لا تَرى الوسيط "argument" الأخير "سريّ secret" [التي تُمَرِره](https://github.com/facebook/react/pull/7132) لِرَصد استدعائات PropTypes اليدوية.  

إليك كيفية إصلاحه. سوف نَستَخدِم `deprecated` من [react-bootstrap/react-prop-types](https://github.com/react-bootstrap/react-prop-types/blob/0d1cd3a49a93e513325e3258b28a82ce7d38e690/src/deprecated.js) كمثال. التطبيق الحالي يُمَرِر وسائط `props` و `propName` و `componentName` فقط:

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName) {
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName);
  };
}
```

لإصلاح الإيجابية السلبية تأكَّد من تمرير **جميع** الوسائط الى PropTypes المُغَلَّف. يَسهُل القيام بهذا عن طريق صيغة `...rest` من ES6:

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName, ...rest) { // Note ...rest here
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName, ...rest); // and here
  };
}
```

سَيُصمِت ذلك التحذير.
