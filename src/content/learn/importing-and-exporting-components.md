---
title: استيراد وتصدير المكونات
---

<Intro>

يكمن سحر المكونات في إمكانية إعادة استخدامها: يمكنك إنشاء مكونات تتكون من مكونات أخرى. ولكن كلما ضمّنتَ المزيد والمزيد من المكونات، فمن المنطقي في كثير من الأحيان البدء في تقسيمها إلى ملفات متعددة. يتيح لك هذا الأمر الاحتفاظ بملفاتك سهلة الفحص وإمكانية إعادة استخدام المكونات في أماكن أكثر.

</Intro>

<YouWillLearn>

* ما هو ملف المكون الأساسي
* كيفية استيراد وتصدير مكون
* متى يجب استخدام الاستيرادات والتصديرات الافتراضية والمسماة
* كيفية استيراد وتصدير عدة مكونات من ملف واحد
* كيفية تقسيم المكونات إلى ملفات متعددة

</YouWillLearn>

## ملف المكون الأساسي {/*the-root-component-file*/}

في [مكونك الأول](/learn/your-first-component)، أنشأت مكون `Profile` ومكون `Gallery` الذي يقوم بتقديمه:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="كاترين جونسون"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>علماء مذهلون</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

هؤلاء موجودون حاليًا في **ملف المكون الأساسي**، المسمى `App.js` في هذا المثال. اعتمادًا على إعدادك لبيئة العمل، قد يكون مكونك الجذري في ملف آخر. إذا كنت تستخدم إطار عمل مع توجيه معتمد على الملفات (File-based routing)، مثل Next.js، فسيكون مكونك الجذري مختلفًا لكل صفحة.

## تصدير واستيراد المكون {/*exporting-and-importing-a-component*/}

ماذا لو أردت تغيير الصفحة الرئيسية في المستقبل ووضع قائمة بكتب العلوم هناك؟ أو وضع جميع الملفات الشخصية في مكان آخر؟ من المنطقي تحريك `Gallery` و`Profile` من ملف المكون الجذري. سيجعلهما هذا أكثر مرونة وقابلة لإعادة الاستخدام في ملفات أخرى. يمكنك نقل المكون في ثلاث خطوات:

1. **أنشئ** ملف JS جديد لوضع المكونات فيه.
2. **تصدير** مكون الدالة الخاص بك من هذا الملف (باستخدام [التصدير الافتراضي](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) أو [التصدير المسمى](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports)).
3. **استيراده** في الملف الذي ستستخدم فيه المكون (باستخدام التقنية المقابلة لاستيراد [التصدير الافتراضي](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) أو [التصدير المسمى](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module)).

هنا تم نقل `Profile` و`Gallery` من `App.js` إلى ملف جديد يسمى `Gallery.js`. الآن يمكنك تغيير `App.js` لاستيراد `Gallery` من `Gallery.js`:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>علماء مذهلون</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

لاحظ كيف أن هذا المثال مقسم إلى ملفين للمكونات الآن:

1. `Gallery.js`:
     - ينشئ مكون `Profile` الذي يتم استخدامه فقط في نفس الملف ولا يتم تصديره.
     - يصدر مكون `Gallery` كـ **تصدير افتراضي**.
2. `App.js`:
     - يستورد `Gallery` كـ **استيراد افتراضي** من `Gallery.js`.
      - يصدر المكون الجذري `App` كـ **تصدير افتراضي**.


<Note>

ربما تواجه ملفات تترك امتداد الملف `.js` مثل هذا:

```js 
import Gallery from './Gallery';
```

كلا `'./Gallery.js'` أو `'./Gallery'` سيعملان مع React، على الرغم من أن الأولى أقرب إلى كيفية عمل [ES Modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) الأصلية.

</Note>

<DeepDive>

#### التصدير الافتراضي ضد التصدير المسمى {/*default-vs-named-exports*/}

هناك طريقتان رئيسيتان لتصدير القيم باستخدام JavaScript: التصدير الافتراضي والتصدير المسمى. حتى الآن، استخدمت أمثلتنا فقط التصدير الافتراضي. ولكن يمكنك استخدام واحد أو كلاهما في نفس الملف. **يمكن للملف أن يحتوي على تصدير واحد _افتراضي_ فقط، ولكن يمكن أن يحتوي على أي عدد من التصديرات _المسماة_.**

![التصديرات الافتراضية والمسماة](/images/docs/illustrations/i_import-export.svg)

كيفية تصدير مكونك تحدد كيفية استيراده. ستحصل على خطأ إذا حاولت استيراد تصدير افتراضي بنفس الطريقة التي تستورد بها تصديرًا مسمى! يمكن أن يساعدك هذا الرسم البياني على تتبع الأمور:

| طريقة الكتابة           | جملة التصدير                           | جملة الاستيراد                          |
| -----------      | -----------                                | -----------                               |
| الافتراضي  | `export default function Button() {}` | `import Button from './Button.js';`     |
| المسمى    | `export function Button() {}`         | `import { Button } from './Button.js';` |

عندما تستورد التصدير _الافتراضي_، يمكنك وضع أي اسم تريده بعد `import`. على سبيل المثال، يمكنك كتابة `import Banana from './Button.js'` بدلاً من ذلك وسيوفر لك نفس التصدير الافتراضي. على العكس من ذلك، مع الاستيرادات المسماة، يجب أن يتطابق الاسم على الجانبين. هذا هو السبب في أنها تسمى استيرادات _مسماة_!

**يستخدم المطورون عادة التصديرات الافتراضية عندما يكون في الملف مكون واحد فقط، ويستخدمون التصديرات المسماة عندما يكون مكونات وقيم متعددة** بغض النظر عن الأسلوب البرمجي الذي تفضله، دائمًا ما يجب أن تعطي أسماء معبرة لوظائف المكون والملفات التي تحتوي عليها. يُنصح بعدم استخدام المكونات بدون أسماء، مثل `export default () => {}`، لأنها تجعل عملية التصحيح أكثر صعوبة.

</DeepDive>

## تصدير مكونات متعددة من نفس الملف {/*exporting-and-importing-multiple-components-from-the-same-file*/}

ماذا لو أردت عرض ملف شخصي `Profile` واحد فقط بدلاً من معرض؟ يمكنك تصدير مكون `Profile` أيضًا. لكن `Gallery.js` لديه بالفعل تصدير *افتراضي*، ولا يمكنك أن تمتلك _اثنين_ من التصديرات الافتراضية. يمكنك إنشاء ملف جديد مع تصدير افتراضي، أو يمكنك إضافة تصدير *مسمى* لـ `Profile`. **يمكن للملف أن يحتوي على تصدير واحد فقط _افتراضي_، ولكن يمكن أن يحتوي على عدد كبير من التصديرات _المسماة_!**

<Note>

لتقليل الارتباك المحتمل بين التصديرات الافتراضية والمسماة، يختار بعض الفِرَق استخدام نمط واحد فقط (افتراضي أو مسمى)، أو تجنب مزجهما في ملف واحد. افعل ما يعمل بشكل أفضل بالنسبة لك!

</Note>

أولًا، **صدّر** `Profile` من `Gallery.js` باستخدام تصدير مسمى (بدون كلمة `default`):

```js
export function Profile() {
  // ...
}
```

ثم، **استورد** `Profile` من `Gallery.js` إلى `App.js` باستخدام استيراد مسمى (مع الأقواس المنحنية):

```js
import { Profile } from './Gallery.js';
```

أخيرًا، **اعرض** `<Profile />` من مكون `App`:

```js
export default function App() {
  return <Profile />;
}
```

الآن، يحتوي `Gallery.js` على تصديرين: تصدير `Gallery` الافتراضي، وتصدير `Profile` المسمى. يستورد `App.js` كليهما. جرب تعديل `<Profile />` إلى `<Gallery />` والعودة في هذا المثال:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js src/Gallery.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>علماء مذهلون</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

الآن، تستخدم مزيجًا من التصديرات الافتراضية والمسماة:

* `Gallery.js`:
  - يصدر مكون `Profile` كـ **تصدير مسمى يسمى `Profile`.**
  - يصدر مكون `Gallery` كـ **تصدير افتراضي.**
* `App.js`:
  - يستورد `Profile` **كاستيراد مسمى يسمى `Profile`** من `Gallery.js`.
  - يستورد `Gallery` **كاستيراد افتراضي** من `Gallery.js`.
  - يصدر مكون `App` الجذر كـ **تصدير افتراضي.**

<Recap>

في هذه الصفحة تعلمت:

* ما هو ملف المكون الجذري
* كيفية استيراد وتصدير مكون
* متى وكيفية استخدام الاستيرادات والتصديرات الافتراضية والمسماة
* كيفية تصدير عدة مكونات من نفس الملف

</Recap>



<Challenges>

#### تقسيم المكونات بشكل أعمق {/*split-the-components-further*/}

حاليًا، يصدر `Gallery.js` كل من `Profile` و `Gallery`، وهو أمر محير قليلاً.

انقل مكون `Profile` إلى `Profile.js` الخاص به، ثم غير مكون `App` ليقوم بعرض كل من `<Profile />` و `<Gallery />` بعد الآخر.

ربما تستخدم إما تصديرًا افتراضيًا أو مسمى لـ `Profile`، ولكن تأكد من استخدام بناء الجملة المستوردة المقابلة في كل من `App.js` و `Gallery.js`! يمكنك الرجوع إلى الجدول من النظرة الأعمق أعلاه:

| طريقة الكتابة           | جملة التصدير                           | جملة الاستيراد                          |
| -----------      | -----------                                | -----------                               |
| الافتراضي  | `export default function Button() {}` | `import Button from './Button.js';`     |
| المسمى    | `export function Button() {}`         | `import { Button } from './Button.js';` |

<Hint>

لا تنس استيراد المكونات الخاصة بك حيث يتم استدعاؤها. ألا يستخدم `Gallery` `Profile` أيضًا؟

</Hint>

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js src/Gallery.js active
// Move me to Profile.js!
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>علماء مذهلون</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

بعد أن تجعله يعمل مع نوع واحد من التصديرات، اجعله يعمل مع النوع الآخر.

<Solution>

هذه هو الحل مع التصديرات المسماة:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js src/Gallery.js
import { Profile } from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>علماء مذهلون</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

وهذا هو الحل مع التصديرات الافتراضية:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js src/Gallery.js
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>علماء مذهلون</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>
