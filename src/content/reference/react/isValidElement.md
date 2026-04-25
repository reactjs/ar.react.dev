---
title: "دالة isValidElement"
---

<Intro>

`isValidElement` تتحقق مما إذا كانت قيمة ما عنصر React.

```js
const isElement = isValidElement(value)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

استدعِ `isValidElement(value)` للتحقق مما إذا كانت `value` عنصر React.

```js
import { isValidElement, createElement } from 'react';

// ✅ React elements
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ Not React elements
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `value`: القيمة التي تريد فحصها. يمكن أن تكون من أي نوع.

#### القيمة المُرجَعة {/*returns*/}

`isValidElement` تُرجع `true` إذا كانت `value` عنصر React. وإلا تُرجع `false`.

#### ملاحظات {/*caveats*/}

* **فقط [وسوم JSX](/learn/writing-markup-with-jsx) والكائنات التي تُرجعها [`createElement`](/reference/react/createElement) تُعتبر عناصر React.** مثلًا، الرقم `42` عقدة React صالحة (ويمكن إرجاعها من مكوّن)، لكنه ليس عنصر React صالحًا. المصفوفات والبوابات (portals) المُنشأة بـ [`createPortal`](/reference/react-dom/createPortal) أيضًا *لا* تُعتبر عناصر React.

---

## الاستخدام {/*usage*/}

### التحقق مما إذا كان شيء ما عنصر React {/*checking-if-something-is-a-react-element*/}

استدعِ `isValidElement` للتحقق مما إذا كانت قيمة ما *عنصر React*.

عناصر React هي:

- قيم تنتجها كتابة [وسم JSX](/learn/writing-markup-with-jsx)
- قيم تنتجها استدعاء [`createElement`](/reference/react/createElement)

لعناصر React، `isValidElement` تُرجع `true`:

```js
import { isValidElement, createElement } from 'react';

// ✅ JSX tags are React elements
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ Values returned by createElement are React elements
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

أي قيم أخرى، مثل السلاسل والأرقام أو كائنات ومصفوفات عشوائية، ليست عناصر React.

لها، `isValidElement` تُرجع `false`:

```js
// ❌ These are *not* React elements
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

نادرًا ما تحتاج `isValidElement`. تفيد غالبًا إذا استدعيت واجهة *تقبل عناصر فقط* (مثل [`cloneElement`](/reference/react/cloneElement)) وتريد تجنب خطأ عندما لا يكون المعامل عنصرًا.

ما لم يكن لديك سبب محدد جدًا لإضافة فحص `isValidElement`، غالبًا لا تحتاجه.

<DeepDive>

#### عناصر React مقابل عقد React {/*react-elements-vs-react-nodes*/}

عند كتابة مكوّن، يمكنك إرجاع أي نوع من *عقد React* منه:

```js
function MyComponent() {
  // ... you can return any React node ...
}
```

عقدة React يمكن أن تكون:

- عنصر React مُنشأ مثل `<div />` أو `createElement('div')`
- بوابة مُنشأة بـ [`createPortal`](/reference/react-dom/createPortal)
- سلسلة نصية
- رقم
- `true` أو `false` أو `null` أو `undefined` (ولا تُعرض)
- مصفوفة من عقد React أخرى

**لاحظ أن `isValidElement` تتحقق مما إذا كان المعامل *عنصر React*، وليس مما إذا كانت عقدة React.** مثلًا، `42` ليس عنصر React صالحًا، لكنه عقدة React صالحة تمامًا:

```js
function MyComponent() {
  return 42; // It's ok to return a number from component
}
```

لهذا لا يجب استخدام `isValidElement` للتحقق مما إذا كان شيء ما قابلًا للعرض.

</DeepDive>
