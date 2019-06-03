---
id: web-components
title: مكونات الويب 
permalink: docs/web-components.html
redirect_from:
  - "docs/webcomponents.html"
---

إنّ مكوّنات React و[مكوّنات الويب](https://developer.mozilla.org/en-US/docs/Web/Web_Components) مبنية لحل مشاكل مختلفة. حيث تُزوِّدنا مكوّنات الويب بتغليف قوي لمكوّنات قابلة لإعادة الاستخدام، بينما تُزوِّدنا مكوّنات React بمكتبة تصريحات تُبقي DOM على تزامن مع بياناتنا. يكون هذا الهدفان متكاملين، وكمُطوّر لك حرية استخدام React في مكوّنات الويب لديك، أو استخدام مكوّنات الويب في React أو كليهما معًا.

معظم من يستخدم React لا يستخدم مكوّنات الويب، ولكن قد ترغب في ذلك خاصة إذا كنت تستخدم مكوّنات لواجهة المستخدم من طرف ثالث والتي تكون مكتوبة باستخدام مكوّنات الويب.


## استخدام مكوّنات الويب في React {#using-web-components-in-react}

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>أهلًا <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

> ملاحظة:
>
>تعرض مكوّنات الويب عادة واجهة برمجة تطبيقات (API) إلزاميّة. على سبيل المثال قد يُعرِّض مكوّن الويب `video` الدالتين `play()`‎ و `pause()`، وللوصول إلى واجهة برمجة التطبيقات الإلزامية لمكوّنات الويب ستحتاج إلى استخدام مرجع للتفاعل مع عقدة DOM مباشرةً. إن كنت تستخدم مكوّنات ويب من طرف ثالث فالحل الأمثل هو كتابة مكوّن React يسلك سلوك غلاف لمكوّنات الويب لديك.
>
> الأحداث الصادرة من قبل مكوّن الويب قد لا تنتشر بشكل صحيح عبر شجرة تصيير React.
> ستحتاج إلى إرفاق معالج أحداث يدويًّا للتعامل مع هذه الأحداث ضمن مكوّنات React لديك.

إحدى الأمور التي من الشائع الخطأ بها هي استخدام مكوّنات الويب للخاصيّة "class" بدلًا من "className":

```javascript
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>الواجهة الأمامية</div>
      <div>الواجهة الخلفية</div>
    </brick-flipbox>
  );
}
```

## استخدام React في مكوّنات الويب لديك {#using-react-in-your-web-components}

```javascript
class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
  }
}
customElements.define('x-search', XSearch);
```

>ملاحظة:
>
> **لن** تعمل هذه الشيفرة إن نقلت الأصناف باستخدام Babel. انظر إلى هذه المشكلة [من هنا](https://github.com/w3c/webcomponents/issues/587). 
> يجب عليك تضمين [custom-elements-es5-adapter](https://github.com/webcomponents/webcomponentsjs#custom-elements-es5-adapterjs) قبل تحميل مكوّنات الويب لإصلاح هذه المشكلة.
