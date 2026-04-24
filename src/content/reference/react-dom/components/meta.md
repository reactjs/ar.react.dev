---
meta: "مكوّن <meta>"
---

<Intro>

يتيح لك [مكوّن `<meta>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) إضافة بيانات وصفية إلى المستند.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `<meta>` {/*meta*/}

لإضافة بيانات وصفية للمستند، صيّر [مكوّن `<meta>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta). يمكنك تصيير `<meta>` من أي مكوّن وسيضع React دائمًا عنصر DOM المقابل في رأس المستند.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

[اطّلع على المزيد من الأمثلة في الأسفل.](#usage)

#### الخصائص {/*props*/}

يدعم `<meta>` [جميع خصائص العناصر الشائعة.](/reference/react-dom/components/common#common-props)

يجب أن يكون لديه *واحد بالضبط* من الخصائص التالية: `name`، أو `httpEquiv`، أو `charset`، أو `itemProp`. يفعل مكوّن `<meta>` شيئًا مختلفًا بحسب أي هذه الخصائص مُحدَّدة.

* `name`: نص. يحدد [نوع البيانات الوصفية](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name) المرفقة بالمستند. 
* `charset`: نص. يحدد مجموعة الأحرف المستخدمة في المستند. القيمة الصالحة الوحيدة هي `"utf-8"`.
* `httpEquiv`: نص. يحدد توجيهًا لمعالجة المستند.
* `itemProp`: نص. يحدد بيانات وصفية عن عنصر معيّن داخل المستند بدلًا من المستند ككل.
* `content`: نص. يحدد البيانات الوصفية المرفقة عند استخدام `name` أو `itemProp`، أو سلوك التوجيه عند استخدام `httpEquiv`.

#### سلوك تصيير خاص {/*special-rendering-behavior*/}

سيضع React دائمًا عنصر DOM المقابل لمكوّن `<meta>` داخل `<head>` للمستند، بغضّ النظر عن مكان تصييره في شجرة React. `<head>` هو المكان الصالح الوحيد لوجود `<meta>` في DOM، مع أنه من المريح أن يمثّل مكوّن الصفحة بياناته الوصفية بنفسه. 

يستثنى من ذلك: إذا كان لـ `<meta>` سمة [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop)، فلا يوجد سلوك خاص، لأن الحالة هنا لا تمثل بيانات وصفية عن المستند بل عن جزء معيّن من الصفحة. 

---

## الاستخدام {/*usage*/}

### إثراء المستند ببيانات وصفية {/*annotating-the-document-with-metadata*/}

يمكنك إثراء المستند ببيانات وصفية مثل الكلمات المفتاحية، أو ملخص، أو اسم المؤلف. سيضع React هذه البيانات داخل `<head>` للمستند بغضّ النظر عن مكان تصييرها في شجرة React. 

```html
<meta name="author" content="John Smith" />
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
<meta name="description" content="API reference for the <meta> component in React DOM" />
```

يمكنك تصيير مكوّن `<meta>` من أي مكوّن. سيضع React عقدة `<meta>` في `<head>` للمستند.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <meta name="keywords" content="React" />
      <meta name="description" content="A site map for the React website" />
      <h1>Site Map</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### إثراء عناصر محددة داخل المستند ببيانات وصفية {/*annotating-specific-items-within-the-document-with-metadata*/}

يمكنك استخدام مكوّن `<meta>` مع خاصية `itemProp` لإثراء عناصر محددة داخل المستند ببيانات وصفية. في هذه الحالة، *لن* يضع React هذه التعليقات داخل `<head>` بل يضعها كأي مكوّن React آخر. 

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <meta itemProp="description" content="API reference for using <meta> with itemProp" />
  <p>...</p>
</section>
```
