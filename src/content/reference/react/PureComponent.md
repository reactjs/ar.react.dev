---
title: PureComponent
---

<Pitfall>

نوصي بتعريف المكوّنات كدوال بدل الصنوف. [اطلع على كيفية الترحيل.](#alternatives)

</Pitfall>

<Intro>

`PureComponent` مشابه لـ [`Component`](/reference/react/Component) لكنه يتخطى إعادة الرسم عند تطابق الـ props والحالة. ما زالت مكوّنات الصنف مدعومة في React، لكننا لا نوصي باستخدامها في كود جديد.

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `PureComponent` {/*purecomponent*/}

لتخطي إعادة رسم مكوّن صنف عند تطابق الـ props والحالة، ورّث `PureComponent` بدل [`Component`:](/reference/react/Component)

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`PureComponent` هو صنف فرعي من `Component` ويدعم [جميع واجهات `Component`.](/reference/react/Component#reference) وراثة `PureComponent` تكافئ تعريف دالة [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) مخصصة تقارن الـ props والحالة بشكل سطحي.


[اطلع على المزيد من الأمثلة أدناه.](#usage)

---

## Usage {/*usage*/}

### Skipping unnecessary re-renders for class components {/*skipping-unnecessary-re-renders-for-class-components*/}

يعيد React عادةً رسم المكوّن كلما أعاد الأب الرسم. كتحسين، يمكنك إنشاء مكوّن لا يعيد React رسمه عند إعادة رسم الأب طالما أن الـ props والحالة الجديدة مطابقة للقديمة. يمكن [لمكوّنات الصنف](/reference/react/Component) اختيار هذا السلوك بوراثة `PureComponent`:

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

يجب أن يكون لمكوّن React دائمًا [منطق رسم نقي.](/learn/keeping-components-pure) أي أنه يجب أن يُرجع نفس المخرجات إذا لم تتغيّر الـ props والحالة والسياق. باستخدام `PureComponent`، تخبر React أن مكوّنك يلتزم بهذا المطلوب، لذا لا يحتاج React لإعادة الرسم طالما أن الـ props والحالة لم تتغيّر. لكن المكوّن سيُعاد رسمه إذا تغيّر سياق يستخدمه.

في هذا المثال، لاحظ أن مكوّن `Greeting` يُعاد رسمه عند تغيّر `name` (لأنه أحد الـ props)، وليس عند تغيّر `address` (لأنه لا يُمرَّر إلى `Greeting` كـ prop):

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Pitfall>

نوصي بتعريف المكوّنات كدوال بدل الصنوف. [اطلع على كيفية الترحيل.](#alternatives)

</Pitfall>

---

## Alternatives {/*alternatives*/}

### Migrating from a `PureComponent` class component to a function {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

نوصي باستخدام مكوّنات الدالة بدل [مكوّنات الصنف](/reference/react/Component) في كود جديد. إذا كان لديك مكوّنات صنف قائمة تستخدم `PureComponent`، إليك كيفية تحويلها. هذا هو الكود الأصلي:

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

عند [تحويل هذا المكوّن من صنف إلى دالة،](/reference/react/Component#alternatives) لفّه بـ [`memo`:](/reference/react/memo)

<Sandpack>

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

على عكس `PureComponent`، [`memo`](/reference/react/memo) لا يقارن الحالة الجديدة بالقديمة. في مكوّنات الدالة، استدعاء [دالة `set`](/reference/react/useState#setstate) بنفس الحالة [يمنع إعادة الرسم افتراضيًا](/reference/react/memo#updating-a-memoized-component-using-state) حتى بدون `memo`.

</Note>
