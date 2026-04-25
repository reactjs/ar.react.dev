---
title: "دالة createRef"
---

<Pitfall>

`createRef` تُستخدم غالبًا مع [المكوّنات الصنفية.](/reference/react/Component) مكوّنات الدالة تعتمد عادةً على [`useRef`](/reference/react/useRef) بدلًا منها.

</Pitfall>

<Intro>

`createRef` تنشئ كائن [مرجع (ref)](/learn/referencing-values-with-refs) يمكن أن يحتوي على قيمة عشوائية.

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `createRef()` {/*createref*/}

استدعِ `createRef` للإعلان عن [مرجع](/learn/referencing-values-with-refs) داخل [مكوّن صنفي.](/reference/react/Component)

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

`createRef` لا تأخذ معاملات.

#### القيمة المُرجَعة {/*returns*/}

`createRef` تُرجع كائنًا بخاصية واحدة:

* `current`: في البداية تُضبط إلى `null`. يمكنك لاحقًا تعيينها لشيء آخر. إذا مررت كائن المرجع إلى React كسمة `ref` لعقدة JSX، ستضبط React خاصية `current`.

#### ملاحظات {/*caveats*/}

* `createRef` تُرجع دائمًا كائنًا *مختلفًا*. يعادل كتابة `{ current: null }` بنفسك.
* في مكوّن دالة، غالبًا تريد [`useRef`](/reference/react/useRef) التي تُرجع دائمًا نفس الكائن.
* `const ref = useRef()` يعادل `const [ref, _] = useState(() => createRef(null))`.

---

## الاستخدام {/*usage*/}

### الإعلان عن مرجع في مكوّن صنفي {/*declaring-a-ref-in-a-class-component*/}

للإعلان عن مرجع داخل [مكوّن صنفي،](/reference/react/Component) استدعِ `createRef` وعيّن ناتجها إلى حقل صنف:

```js {4}
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

إذا مررت `ref={this.inputRef}` إلى `<input>` في JSX، ستملأ React `this.inputRef.current` بعقدة DOM للإدخال. مثلًا، إليك زر يركّز الإدخل:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

<Pitfall>

`createRef` تُستخدم غالبًا مع [المكوّنات الصنفية.](/reference/react/Component) مكوّنات الدالة تعتمد عادةً على [`useRef`](/reference/react/useRef) بدلًا منها.

</Pitfall>

---

## البدائل {/*alternatives*/}

### الهجرة من صنف يستخدم `createRef` إلى دالة تستخدم `useRef` {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

نوصي باستخدام مكوّنات الدالة بدل الصنفية في الشيفرة الجديدة. إذا كان لديك مكوّنات صنفية تستخدم `createRef`، إليك التحويل. هذا هو الأصل:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

عند [تحويل المكوّن من صنف إلى دالة،](/reference/react/Component#alternatives) استبدل استدعاءات `createRef` باستدعاءات [`useRef`:](/reference/react/useRef)

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>
