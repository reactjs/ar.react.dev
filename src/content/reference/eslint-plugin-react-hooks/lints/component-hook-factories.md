---
title: component-hook-factories
---

<Intro>

يتحقق من عدم استخدام دوال رتبة أعلى تعرّف مكوّنات أو hooks متداخلة. يجب تعريف المكوّنات والـ hooks على مستوى الوحدة.

</Intro>

## تفاصيل القاعدة {/*rule-details*/}

تعريف مكوّنات أو hooks داخل دوال أخرى ينشئ نسخاً جديدة كل استدعاء. يعامل React كل نسخة كمكوّن مختلف تماماً، فيدمّر ويعيد إنشاء شجرة المكوّن بالكامل، يفقد كل الحالة، ويسبب مشاكل أداء.

### غير صالح {/*invalid*/}

أمثلة لشيفرة غير صحيحة لهذه القاعدة:

```js {expectedErrors: {'react-compiler': [14]}}
// ❌ دالة مصنع تُنشئ مكوّنات
function createComponent(defaultValue) {
  return function Component() {
    // ...
  };
}

// ❌ مكوّن معرّف داخل مكوّن
function Parent() {
  function Child() {
    // ...
  }

  return <Child />;
}

// ❌ دالة مصنع لـ hook
function createCustomHook(endpoint) {
  return function useData() {
    // ...
  };
}
```

### صالح {/*valid*/}

أمثلة لشيفرة صحيحة لهذه القاعدة:

```js
// ✅ مكوّن معرّف على مستوى الوحدة
function Component({ defaultValue }) {
  // ...
}

// ✅ hook مخصّص على مستوى الوحدة
function useData(endpoint) {
  // ...
}
```

## استكشاف الأعطال {/*troubleshooting*/}

### أحتاج سلوكاً ديناميكياً للمكوّن {/*dynamic-behavior*/}

قد تظن أنك تحتاج مصنعاً لإنشاء مكوّنات مخصّصة:

```js
// ❌ خطأ: نمط مصنع
function makeButton(color) {
  return function Button({children}) {
    return (
      <button style={{backgroundColor: color}}>
        {children}
      </button>
    );
  };
}

const RedButton = makeButton('red');
const BlueButton = makeButton('blue');
```

مرّر [JSX كأبناء](/learn/passing-props-to-a-component#passing-jsx-as-children) بدلاً من ذلك:

```js
// ✅ أفضل: مرّر JSX كأبناء
function Button({color, children}) {
  return (
    <button style={{backgroundColor: color}}>
      {children}
    </button>
  );
}

function App() {
  return (
    <>
      <Button color="red">Red</Button>
      <Button color="blue">Blue</Button>
    </>
  );
}
```
