---
script: "مكوّن <script>"
---

<Intro>

يتيح لك [مكوّن `<script>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) إضافة نص برمجي إلى مستندك.

```js
<script> alert("hi!") </script>
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `<script>` {/*script*/}

لإضافة نصوص برمجية مضمّنة أو خارجية إلى مستندك، صيّر [مكوّن `<script>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script). يمكنك تصيير `<script>` من أي مكوّن وسيضع React في [حالات معيّنة](#special-rendering-behavior) عنصر DOM المقابل في رأس المستند ويزيل التكرار للنصوص المتطابقة.

```js
<script> alert("hi!") </script>
<script src="script.js" />
```

[اطّلع على المزيد من الأمثلة في الأسفل.](#usage)

#### الخصائص {/*props*/}

يدعم `<script>` [جميع خصائص العناصر الشائعة.](/reference/react-dom/components/common#common-props)

يجب أن يكون لديه *إما* `children` أو خاصية `src`.

* `children`: نص. شيفرة النص البرمجي المضمّن.
* `src`: نص. عنوان URL لنص برمجي خارجي.

خصائص مدعومة أخرى:

* `async`: قيمة منطقية. تسمح للمتصفح بتأجيل تنفيذ النص حتى تُعالج بقية المستند — السلوك المفضل للأداء.
*  `crossOrigin`: نص. [سياسة CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) المستخدمة. القيم المحتملة: `anonymous` و `use-credentials`.
* `fetchPriority`: نص. يتيح للمتصفح ترتيب أولوية النصوص عند جلب عدة نصوص معًا. يمكن أن تكون `"high"` أو `"low"` أو `"auto"` (الافتراضي).
* `integrity`: نص. تجزئة تشفيرية للنص، [للتحقق من سلامته](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
* `noModule`: قيمة منطقية. تعطّل النص في المتصفحات التي تدعم وحدات ES — لتوفير نص بديل للمتصفحات التي لا تدعمها.
* `nonce`: نص. [nonce تشفيري للسماح بالمورد](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) عند استخدام سياسة أمان محتوى صارمة.
* `referrer`: نص. يحدد [رأس Referer المرسل](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#referrerpolicy) عند جلب النص وأي موارد يجلبها النص لاحقًا. 
* `type`: نص. يحدد ما إذا كان النص [نصًا كلاسيكيًا أو وحدة ES أو خريطة استيراد](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type).

خصائص تعطّل [المعاملة الخاصة للنصوص](#special-rendering-behavior) في React:

* `onError`: دالة. تُستدعى عند فشل تحميل النص.
* `onLoad`: دالة. تُستدعى عند انتهاء تحميل النص.

خصائص **لا يُنصح** باستخدامها مع React:

* `blocking`: نص. إذا ضُبطت إلى `"render"`، يوجّه المتصفح بعدم تصيير الصفحة حتى يُحمَّل النص. يوفّر React تحكمًا أدق باستخدام Suspense.
* `defer`: نص. يمنع المتصفح من تنفيذ النص حتى انتهاء تحميل المستند. غير متوافق مع مكوّنات الخادم المعروضة بالبث. استخدم خاصية `async` بدلًا من ذلك.

#### سلوك تصيير خاص {/*special-rendering-behavior*/}

يمكن لReact نقل مكوّنات `<script>` إلى `<head>` للمستند وإزالة تكرار النصوص المتطابقة.

لتفعيل هذا السلوك، مرِّر خاصيتي `src` و `async={true}`. يزيل React التكرار إذا كان لها نفس `src`. يجب أن تكون `async` true ليسمح بنقل النصوص بأمان.

يصحب هذا المعاملة الخاصة تحذيران:

* React يتجاهل تغييرات الخصائص بعد تصيير النص. (سيُصدِر تحذيرًا في وضع التطوير إذا حدث ذلك.)
* قد يبقي React النص في DOM حتى بعد إلغاء تركيب المكوّن الذي صيّره. (لا أثر عملي لأن النصوص تُنفَّذ مرة واحدة عند إدراجها في DOM.)

---

## الاستخدام {/*usage*/}

### تصيير نص برمجي خارجي {/*rendering-an-external-script*/}

إذا اعتمد مكوّن على نصوص معيّنة ليُعرض بشكل صحيح، يمكنك تصيير `<script>` داخل المكوّن.
قد يُرسَم المكوّن قبل انتهاء تحميل النص.
يمكنك الاعتماد على محتوى النص بعد إطلاق حدث `load` مثلاً عبر خاصية `onLoad`.

يزيل React التكرار للنصوص ذات نفس `src`، ويُدرج واحدًا فقط في DOM حتى لو صيَّرته عدة مكوّنات.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Map({lat, long}) {
  return (
    <>
      <script async src="map-api.js" onLoad={() => console.log('script loaded')} />
      <div id="map" data-lat={lat} data-long={long} />
    </>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <Map />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

<Note>
عندما تريد استخدام نص برمجي، قد يكون مفيدًا استدعاء دالة [preinit](/reference/react-dom/preinit). قد يسمح ذلك للمتصفح ببدء الجلب أبكر من مجرد تصيير `<script>`، مثلاً عبر [استجابة HTTP Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).
</Note>

### تصيير نص برمجي مضمّن {/*rendering-an-inline-script*/}

لتضمين نص برمجي مضمّن، صيّر `<script>` مع شيفرة النص كأبناء. لا يُزال التكرار للنصوص المضمّنة ولا تُنقل إلى `<head>` للمستند.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Tracking() {
  return (
    <script>
      ga('send', 'pageview');
    </script>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <h1>My Website</h1>
      <Tracking />
      <p>Welcome</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
