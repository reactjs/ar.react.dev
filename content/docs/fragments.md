---
id: fragments
title: استخدام الأجزاء (Fragments)
permalink: docs/fragments.html
---

من الأنماط الشائعة في React هي إعادة المكوّن لعناصر متعددة. تتيح لك الأجزاء (Fragments) تجميع قائمة من العناصر الأبناء بدون إضافة عُقَد إضافيّة إلى DOM.

```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

هناك أيضًا [صياغة مختصرة](#short-syntax) جديدة للتصريح عنها.

## البداية {#motivation}

من الأنماط الشائعة للمكوّن هي إعادة قائمة من المكونات الأبناء. انظر إلى هذا المثال:

```jsx
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
  }
}
```

سيحتاج المكوّن `<Columns />` إلى إعادة عناصر `<td>` متعددة لكي تكون HTML المُصيَّرة صالحة. إن كان عنصر `div` الأب مُستخدمًا بداخل التابع `render()` للمكون `<Columns />`, فستكون HTML الناتجة غير صالحة:

```jsx
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Hello</td>
        <td>World</td>
      </div>
    );
  }
}
```

ينتج عنه جدول `<Table />`:

```jsx
<table>
  <tr>
    <div>
      <td>Hello</td>
      <td>World</td>
    </div>
  </tr>
</table>
```

وبهذا نقدم الأجزاء Fragments.

## الاستخدام {#usage}

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    );
  }
}
```

والذي ينتج عنه جدول صحيح `<Table />`:

```jsx
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```

### صياغة مختصرة {#short-syntax}

هنالك صياغة جديدة مختصرة أكثر بإمكانك استخدامها للتصريح عن الأجزاء. تبدو هذه الصياغة مثل العناصر الفارغة:

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```

بإمكانك استخدام`<></>` بنفس الطريقة التي تستخدم بها أي عنصر آخر عدا أنها لا تدعم المفاتيح أو الخاصيّات.

### Keyed Fragments {#keyed-fragments}

يُمكِن للأجزاء المُصرَّح عنها عن طريق الصياغة `<React.Fragment>` أن تمتلك مفاتيح. إحدى حالات الاستخدام لها هي ربط مجموعة إلى مصفوفة من الأجزاء، على سبيل المثال لإنشاء قائمة للوصف:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Without the `key`, React will fire a key warning
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

الخاصية الوحيدة التي يمكن تمريرها للأجزاء `Fragment` هي المفتاح `key`. قد نُضيف مستقبلًا دعم لخاصيّات إضافية مثل مُعالجات الأحداث.

### تجربة المثال {#live-demo}

بإمكانك تجربة صياغة الأجزاء الجديدة في JSX عن طريق هذا المثال في موقع  [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000).
