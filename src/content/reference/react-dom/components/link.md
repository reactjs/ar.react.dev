---
link: "مكوّن <link>"
---

<Intro>

يتيح لك [مكوّن `<link>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) استخدام موارد خارجية مثل أوراق الأنماط، أو إثراء المستند ببيانات وصفية مرتبطة بالروابط.

```js
<link rel="icon" href="favicon.ico" />
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `<link>` {/*link*/}

لربط موارد خارجية مثل أوراق الأنماط والخطوط والأيقونات، أو لإثراء المستند ببيانات وصفية للروابط، صيّر [مكوّن `<link>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link). يمكنك تصيير `<link>` من أي مكوّن وسيضع React [في أغلب الحالات](#special-rendering-behavior) عنصر DOM المقابل في رأس المستند.

```js
<link rel="icon" href="favicon.ico" />
```

[اطّلع على المزيد من الأمثلة في الأسفل.](#usage)

#### الخصائص {/*props*/}

يدعم `<link>` [جميع خصائص العناصر الشائعة.](/reference/react-dom/components/common#common-props)

* `rel`: نص، مطلوب. يحدد [العلاقة بالمورد](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel). React [يتعامل مع الروابط ذات `rel="stylesheet"` بشكل مختلف](#special-rendering-behavior) عن غيرها.

تنطبق هذه الخصائص عندما يكون `rel="stylesheet"`:

* `precedence`: نص. يخبر React بمكان ترتيب عقدة `<link>` في DOM نسبةً إلى غيرها في `<head>` للمستند، مما يحدد أي ورقة أنماط يمكنها تجاوز الأخرى. يستنتج React أن قيم `precedence` التي يكتشفها أولًا «أدنى» والتي يكتشفها لاحقًا «أعلى». يمكن لأنظمة أنماط كثيرة الاكتفاء بقيمة `precedence` واحدة لأن قواعد الأنماط ذرية. أوراق الأنماط ذات نفس `precedence` تُجمَّع سواء كانت `<link>` أو وسوم `<style>` مضمّنة أو محمّلة عبر دوال [`preinit`](/reference/react-dom/preinit).
* `media`: نص. يقيّد ورقة الأنماط بـ [استعلام وسائط](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) معيّن.
* `title`: نص. يحدد اسم [ورقة أنماط بديلة](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

تنطبق هذه الخصائص عندما يكون `rel="stylesheet"` لكنها تعطّل [المعاملة الخاصة لأوراق الأنماط](#special-rendering-behavior) في React:

* `disabled`: قيمة منطقية. تعطّل ورقة الأنماط.
* `onError`: دالة. تُستدعى عند فشل تحميل ورقة الأنماط.
* `onLoad`: دالة. تُستدعى عند انتهاء تحميل ورقة الأنماط.

تنطبق هذه الخصائص عندما يكون `rel="preload"` أو `rel="modulepreload"`:

* `as`: نص. نوع المورد. القيم المحتملة: `audio`، `document`، `embed`، `fetch`، `font`، `image`، `object`، `script`، `style`، `track`، `video`، `worker`.
* `imageSrcSet`: نص. ينطبق فقط عندما يكون `as="image"`. يحدد [مجموعة مصادر الصورة](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
* `imageSizes`: نص. ينطبق فقط عندما يكون `as="image"`. يحدد [أحجام الصورة](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

تنطبق هذه الخصائص عندما يكون `rel="icon"` أو `rel="apple-touch-icon"`:

* `sizes`: نص. [أحجام الأيقونة](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

تنطبق هذه الخصائص في كل الحالات:

* `href`: نص. عنوان URL للمورد المرتبط.
*  `crossOrigin`: نص. [سياسة CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) المستخدمة. القيم المحتملة: `anonymous` و `use-credentials`. مطلوب عند تعيين `as` إلى `"fetch"`.
*  `referrerPolicy`: نص. [رأس Referrer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy) المرسل عند الجلب. القيم المحتملة: `no-referrer-when-downgrade` (الافتراضي)، `no-referrer`، `origin`، `origin-when-cross-origin`، و `unsafe-url`.
* `fetchPriority`: نص. يقترح أولوية نسبية لجلب المورد. القيم المحتملة: `auto` (الافتراضي)، `high`، و `low`.
* `hrefLang`: نص. لغة المورد المرتبط.
* `integrity`: نص. تجزئة تشفيرية للمورد، [للتحقق من سلامته](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
* `type`: نص. نوع MIME للمورد المرتبط.

خصائص **لا يُنصح** باستخدامها مع React:

* `blocking`: نص. إذا ضُبطت إلى `"render"`، يوجّه المتصفح بعدم تصيير الصفحة حتى تُحمَّل ورقة الأنماط. يوفّر React تحكمًا أدق باستخدام Suspense.

#### سلوك تصيير خاص {/*special-rendering-behavior*/}

سيضع React دائمًا عنصر DOM المقابل لمكوّن `<link>` داخل `<head>` للمستند، بغضّ النظر عن مكان تصييره في شجرة React. `<head>` هو المكان الصالح الوحيد لوجود `<link>` في DOM، مع أنه من المريح أن يمثّل مكوّن الصفحة روابطها بنفسه.

هناك بعض الاستثناءات:

* إذا كان لـ `<link>` خاصية `rel="stylesheet"`، فيجب أن يكون له أيضًا خاصية `precedence` للحصول على هذا السلوك الخاص. لأن ترتيب أوراق الأنماط في المستند مهم، فيحتاج React لمعرفة كيفية ترتيب هذه الورقة نسبةً إلى غيرها عبر `precedence`. إذا حُذفت `precedence`، لا يوجد سلوك خاص.
* إذا كان لـ `<link>` سمة [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop)، فلا يوجد سلوك خاص، لأن الحالة هنا لا تنطبق على المستند بل تمثل بيانات وصفية عن جزء معيّن من الصفحة.
* إذا كان لـ `<link>` خاصية `onLoad` أو `onError`، لأنك هنا تدير تحميل المورد يدويًا داخل مكوّن React.

#### سلوك خاص لأوراق الأنماط {/*special-behavior-for-stylesheets*/}

بالإضافة إلى ذلك، إذا كان `<link>` يشير إلى ورقة أنماط (أي `rel="stylesheet"` في خصائصه)، يعامل React الأمر كالتالي:

* المكوّن الذي يصيّر `<link>` سيتوقف مؤقتًا ([suspend](/reference/react/Suspense)) أثناء تحميل ورقة الأنماط.
* إذا صيَّرت عدة مكوّنات روابطًا لنفس ورقة الأنماط، سيزيل React التكرار ويضع رابطًا واحدًا فقط في DOM. يُعتبر الرابطان متطابقين إذا كان لهما نفس خاصية `href`.

هناك استثنان لهذا السلوك الخاص:

* إذا لم يكن للرابط خاصية `precedence`، فلا يوجد سلوك خاص، لأن ترتيب أوراق الأنماط مهم ويحتاج React لـ `precedence`.
* إذا مرّرت أيًا من `onLoad` أو `onError` أو `disabled`، فلا يوجد سلوك خاص، لأن هذه الخصائص تعني أنك تدير التحميل يدويًا.

يصحب هذا المعاملة الخاصة تحذيران:

* React يتجاهل تغييرات الخصائص بعد تصيير الرابط. (سيُصدِر React تحذيرًا في وضع التطوير إذا حدث ذلك.)
* قد يبقي React الرابط في DOM حتى بعد إلغاء تركيب المكوّن الذي صيّره.

---

## الاستخدام {/*usage*/}

### ربط موارد ذات صلة {/*linking-to-related-resources*/}

يمكنك إثراء المستند بروابط لموارد ذات صلة مثل أيقونة، أو عنوان URL أساسي (canonical)، أو pingback. سيضع React هذه البيانات داخل `<head>` للمستند بغضّ النظر عن مكان تصييرها في شجرة React.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function BlogPage() {
  return (
    <ShowRenderedHTML>
      <link rel="icon" href="favicon.ico" />
      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <h1>My Blog</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### ربط ورقة أنماط {/*linking-to-a-stylesheet*/}

إذا اعتمد مكوّن على ورقة أنماط معيّنة ليُعرض بشكل صحيح، يمكنك تصيير رابط لتلك الورقة داخل المكوّن. سيتوقف مؤقتًا ([suspend](/reference/react/Suspense)) المكوّن أثناء التحميل. يجب تمرير خاصية `precedence` التي تخبر React أين تضع هذه الورقة نسبةً إلى غيرها — أوراق بـ `precedence` أعلى يمكنها تجاوز الأدنى.

<Note>
عندما تريد استخدام ورقة أنماط، قد يكون مفيدًا استدعاء دالة [preinit](/reference/react-dom/preinit). قد يسمح ذلك للمتصفح ببدء جلب ورقة الأنماط أبكر من مجرد تصيير `<link>`، مثلاً عبر [استجابة HTTP Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).
</Note>

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <link rel="stylesheet" href="sitemap.css" precedence="medium" />
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### التحكم بأولوية أوراق الأنماط {/*controlling-stylesheet-precedence*/}

قد تتعارض أوراق الأنماط، وعندها يختار المتصفح التي تأتي لاحقًا في المستند. يتيح React التحكم بالترتيب عبر خاصية `precedence`. في هذا المثال، ثلاثة مكوّنات تصيّر أوراق أنماط، وتُجمَّع ذات نفس `precedence` معًا في `<head>`. 

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <FirstComponent />
      <SecondComponent />
      <ThirdComponent/>
      ...
    </ShowRenderedHTML>
  );
}

function FirstComponent() {
  return <link rel="stylesheet" href="first.css" precedence="first" />;
}

function SecondComponent() {
  return <link rel="stylesheet" href="second.css" precedence="second" />;
}

function ThirdComponent() {
  return <link rel="stylesheet" href="third.css" precedence="first" />;
}

```

</SandpackWithHTMLOutput>

لاحظ أن قيم `precedence` نفسها تعسّفية وتسميتها لك. يستنتج React أن القيم المكتشفة أولًا «أدنى» والمكتشفة لاحقًا «أعلى».

### تصيير ورقة أنماط دون تكرار {/*deduplicated-stylesheet-rendering*/}

إذا صيّرت نفس ورقة الأنماط من عدة مكوّنات، سيضع React `<link>` واحدًا فقط في رأس المستند.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <Component />
      <Component />
      ...
    </ShowRenderedHTML>
  );
}

function Component() {
  return <link rel="stylesheet" href="styles.css" precedence="medium" />;
}
```

</SandpackWithHTMLOutput>

### إثراء عناصر محددة داخل المستند بروابط {/*annotating-specific-items-within-the-document-with-links*/}

يمكنك استخدام مكوّن `<link>` مع خاصية `itemProp` لإثراء عناصر محددة داخل المستند بروابط لموارد ذات صلة. في هذه الحالة، *لن* يضع React هذه التعليقات في `<head>` بل يضعها كأي مكوّن React آخر.

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <link itemProp="author" href="http://example.com/" />
  <p>...</p>
</section>
```
