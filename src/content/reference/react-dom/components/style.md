---
style: "مكوّن <style>"
---

<Intro>

يتيح لك [مكوّن `<style>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) إضافة أوراق أنماط CSS مضمّنة إلى مستندك.

```js
<style>{` p { color: red; } `}</style>
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `<style>` {/*style*/}

لإضافة أنماط مضمّنة إلى مستندك، صيّر [مكوّن `<style>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style). يمكنك تصيير `<style>` من أي مكوّن وسيضع React في [حالات معيّنة](#special-rendering-behavior) عنصر DOM المقابل في رأس المستند ويزيل التكرار للأنماط المتطابقة.

```js
<style>{` p { color: red; } `}</style>
```

[اطّلع على المزيد من الأمثلة في الأسفل.](#usage)

#### الخصائص {/*props*/}

يدعم `<style>` [جميع خصائص العناصر الشائعة.](/reference/react-dom/components/common#common-props)

* `children`: نص، مطلوب. محتوى ورقة الأنماط.
* `precedence`: نص. يخبر React بمكان ترتيب عقدة `<style>` في DOM نسبةً إلى غيرها في `<head>` للمستند، مما يحدد أي ورقة أنماط يمكنها تجاوز الأخرى. يستنتج React أن قيم `precedence` المكتشفة أولًا «أدنى» والمكتشفة لاحقًا «أعلى». يمكن لأنظمة أنماط كثيرة الاكتفاء بقيمة واحدة لأن القواعد ذرية. أوراق بنفس `precedence` تُجمَّع سواء كانت `<link>` أو `<style>` مضمّنة أو محمّلة عبر [`preinit`](/reference/react-dom/preinit).
* `href`: نص. يسمح لReact [بإزالة تكرار الأنماط](#special-rendering-behavior) التي لها نفس `href`.
* `media`: نص. يقيّد ورقة الأنماط بـ [استعلام وسائط](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) معيّن.
* `nonce`: نص. [nonce تشفيري للسماح بالمورد](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) عند استخدام سياسة أمان محتوى صارمة.
* `title`: نص. يحدد اسم [ورقة أنماط بديلة](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

خصائص **لا يُنصح** باستخدامها مع React:

* `blocking`: نص. إذا ضُبطت إلى `"render"`، يوجّه المتصفح بعدم تصيير الصفحة حتى تُحمَّل ورقة الأنماط. يوفّر React تحكمًا أدق باستخدام Suspense.

#### سلوك تصيير خاص {/*special-rendering-behavior*/}

يمكن لReact نقل مكوّنات `<style>` إلى `<head>` للمستند، وإزالة تكرار أوراق الأنماط المتطابقة، والتوقف مؤقتًا ([suspend](/reference/react/Suspense)) أثناء تحميل ورقة الأنماط.

لتفعيل هذا السلوك، مرِّر خاصيتي `href` و `precedence`. يزيل React التكرار إذا كان لها نفس `href`. تخبر خاصية `precedence` React بمكان ترتيب عقدة `<style>` نسبةً إلى غيرها في `<head>`.

يصحب هذا المعاملة الخاصة ثلاثة تحذيرات:

* React يتجاهل تغييرات الخصائص بعد تصيير النمط. (سيُصدِر تحذيرًا في وضع التطوير إذا حدث ذلك.)
* React يُسقِط كل الخصائص الزائدة عند استخدام خاصية `precedence` (ما عدا `href` و `precedence`).
* قد يبقي React النمط في DOM حتى بعد إلغاء تركيب المكوّن الذي صيّره.

---

## الاستخدام {/*usage*/}

### تصيير ورقة أنماط CSS مضمّنة {/*rendering-an-inline-css-stylesheet*/}

إذا اعتمد مكوّن على أنماط CSS معيّنة ليُعرض بشكل صحيح، يمكنك تصيير ورقة أنماط مضمّنة داخل المكوّن.

يجب أن تُعرّف خاصية `href` ورقة الأنماط بشكل فريد، لأن React يزيل التكرار للأوراق ذات نفس `href`.
إذا مرّرت خاصية `precedence`، يعيد React ترتيب أوراق الأنماط المضمّنة بحسب ترتيب ظهور هذه القيم في شجرة المكوّنات.

أوراق الأنماط المضمّنة **لا** تُطلِق حدود Suspense أثناء التحميل.
حتى إذا حمّلت موارد غير متزامنة مثل خطوط أو صور.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';
import { useId } from 'react';

function PieChart({data, colors}) {
  const id = useId();
  const stylesheet = colors.map((color, index) =>
    `#${id} .color-${index}: \{ color: "${color}"; \}`
  ).join();
  return (
    <>
      <style href={"PieChart-" + JSON.stringify(colors)} precedence="medium">
        {stylesheet}
      </style>
      <svg id={id}>
        …
      </svg>
    </>
  );
}

export default function App() {
  return (
    <ShowRenderedHTML>
      <PieChart data="..." colors={['red', 'green', 'blue']} />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
