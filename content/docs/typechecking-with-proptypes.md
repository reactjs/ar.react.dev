---
id: typechecking-with-proptypes
title: التحقق من الأنواع باستخدام PropTypes
permalink: docs/typechecking-with-proptypes.html
redirect_from:
  - "docs/react-api.html#typechecking-with-proptypes"
---

> تنبيه :
>
> `React.PropTypes` انتقلت إلى حزمة مختلفة منذ React v15.5. من فضلك استخدم [مكتبة `prop-types` عوضا](https://www.npmjs.com/package/prop-types).
>
> نحن نوفر [ سكريبت (script) ](/blog/2017/04/07/react-v15.5.0.html#migrating-from-reactproptypes) لتسهيل الإنتقال.

بينما يصبح تطبيقك أكثر توسعا، يمكنك تفادي الكثير من الأخطاء من خلال التحقق من الأنواع. بالنسبة لبعض التطبيقات، يمكنك استخدام ملحقات JavaScript مثل [Flow](https://flow.org/) أو [TypeScript](https://www.typescriptlang.org/) للتحقق من الأنواع. ولكن حتى لو كنت لا تستخدم هذه الملحقات، React لديه بعض الإضافات المدمجة التي لديها القدرة على التحقق من الأنواع. لتشغيل التحقق من الأنواع على الخاصيات (props) لمكوّن، يمكنك تعيين خاصية `propTypes` :

```javascript
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

في هذا المثال، نستخدم مكون فئة، ولكن يمكن أيضًا تطبيق نفس الوظيفة على مكونات الوظيفة، أو المكونات التي تم إنشاؤها بواسطة [`React.memo`](/docs/react-api.html#reactmemo) أو [`React.forwardRef`](/docs/react-api.html#reactforwardref).

`PropTypes` يصدر مجموعة من أدوات التحقق التي يمكن استخدامها للتأكد من صحة البيانات التي تتلقاها. في هذا المثال نحن نستعمل `PropTypes.string`. عندما يتم توفير قيمة غير مقبولة لخاصية (props)، سيظهر تحذير في وحدة التحكم (JavaScript Console). لأسباب تتعلق بأداء التطبيق، يتم التحقق من `propTypes` في وضع التطوير فقط (Development mode).

### PropTypes {#proptypes}

فيما يلي مثال يوضح مختلف أدوات التحقق المتوفرة:

```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // You can declare that a prop is a specific JS type. By default, these
  // are all optional.
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  optionalNode: PropTypes.node,

  // A React element.
  optionalElement: PropTypes.element,

  // A React element type (ie. MyComponent).
  optionalElementType: PropTypes.elementType,

  // You can also declare that a prop is an instance of a class. This uses
  // JS's instanceof operator.
  optionalMessage: PropTypes.instanceOf(Message),

  // You can ensure that your prop is limited to specific values by treating
  // it as an enum.
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // An object that could be one of many types
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // An array of a certain type
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // An object with property values of a certain type
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // An object taking on a particular shape
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // An object with warnings on extra properties
  optionalObjectWithStrictShape: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number
  }),   

  // You can chain any of the above with `isRequired` to make sure a warning
  // is shown if the prop isn't provided.
  requiredFunc: PropTypes.func.isRequired,

  // A required value of any data type
  requiredAny: PropTypes.any.isRequired,

  // You can also specify a custom validator. It should return an Error
  // object if the validation fails. Don't `console.warn` or throw, as this
  // won't work inside `oneOfType`.
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // You can also supply a custom validator to `arrayOf` and `objectOf`.
  // It should return an Error object if the validation fails. The validator
  // will be called for each key in the array or object. The first two
  // arguments of the validator are the array or object itself, and the
  // current item's key.
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
```

### استلزام مكون بنوي وحيد  {#requiring-single-child}

باستخدام `PropTypes.element` يمكنك تحديد أنه يمكن فقط نقل مكون وحيد إلى أحد المكونات بصفتها مكونات بنيوية.

```javascript
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // This must be exactly one element or it will warn.
    const children = this.props.children;
    return (
      <div>
        {children}
      </div>
    );
  }
}

MyComponent.propTypes = {
  children: PropTypes.element.isRequired
};
```

### قيم الخاصيات الإفتراضية {#default-prop-values}

يمكنك تحديد القيم الافتراضية للخاصيات `props` بتعيين خاصية `defaultProps` :

```javascript
class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

// Specifies the default values for props:
Greeting.defaultProps = {
  name: 'Stranger'
};

// Renders "Hello, Stranger":
ReactDOM.render(
  <Greeting />,
  document.getElementById('example')
);
```

<<<<<<< HEAD
إذا كنت تستخدم تحويلات Babel مثل [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/)، يمكنك أيضا تعيين `defaultProps` كخاصية ثابتة داخل صنف (class) مكون React. هذه الشفرة البرمجية لم يتم الإنتهاء منها بعد وستتطلب خطوة التحويل البرمجي (Compilation) للعمل داخل المتصفح. للمزيد من المعلومات، ألق نظرة على  [class fields proposal](https://github.com/tc39/proposal-class-fields).
=======
If you are using a Babel transform like [plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties/) (previously _plugin-transform-class-properties_), you can also declare `defaultProps` as static property within a React component class. This syntax has not yet been finalized though and will require a compilation step to work within a browser. For more information, see the [class fields proposal](https://github.com/tc39/proposal-class-fields).
>>>>>>> a11c2534062bd79cc1e6e34db0e149f928df35bb

```javascript
class Greeting extends React.Component {
  static defaultProps = {
    name: 'stranger'
  }

  render() {
    return (
      <div>Hello, {this.props.name}</div>
    )
  }
}
```

 تُستخدم `defaultProps` للتحقق من أن `this.props.name` سيكون لها قيمة إذا لم يتم تحديدها بواسطة المكون الأب. التحقق من الأنواع باستخدام `propTypes` يحدث بعد تعيين قيمة لـ `defaultProps`، ولهذا التحقق من الأنواع ستنطبق على `defaultProps` أيضا .

 ### مكونات وظيفية {#function-components}

إذا كنت تستخدم مكونات وظيفية في مشروعك، فقد ترغب في إجراء بعض التغييرات الصغيرة للسماح بتطبيق PropTypes بشكل صحيح.

لنفترض أن لديك مكونًا مثل هذا:

```javascript
export default function HelloWorldComponent({ name }) {
  return (
    <div>Hello, {name}</div>
  )
}
```

لإضافة PropTypes قد ترغب في تعريف المكون في دالة منفصلة قبل الاستخدام:

```javascript
function HelloWorldComponent({ name }) {
  return (
    <div>Hello, {name}</div>
  )
}

export default HelloWorldComponent
```

بعد ذلك ، يمكنك إضافة PropTypes مباشرةً إلى `HelloWorldComponent`:

```javascript
import PropTypes from 'prop-types'

function HelloWorldComponent({ name }) {
  return (
    <div>Hello, {name}</div>
  )
}

HelloWorldComponent.propTypes = {
  name: PropTypes.string
}

export default HelloWorldComponent
```
