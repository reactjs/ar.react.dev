---
title: createRoot
---

<Intro>

تمكنك `createRoot` من إنشاء نقطة بداية أو جذر (Root) لعرض مكونات React داخل عنصر DOM في المتصفح.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

استدعِ `createRoot` لإنشاء جذر React لعرض المحتوى داخل عنصر DOM في المتصفح.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

سيقوم React بإنشاء جذر لـ `domNode`، ويتولى إدارة العنصر DOM داخله. بعد إنشاء الجذر، يتعين عليك استدعاء [`root.render`](#root-render) لعرض مكون React داخله:

```js
root.render(<App />);
```

يتم عادة إنشاء التطبيق بالكامل باستخدام React بنداء واحد فقط لـ `createRoot` للمكون الجذر. قد يحتوي الموقع الذي يستخدم React لأجزاء من الصفحة على عدد من نقاط البداية الفردية حسب الحاجة.

[انظر المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `domNode`: عنصر [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element) يقوم React بإنشاء جذر لهذا العنصر ويتيح لك استدعاء الدوال على الجذر مثل `render` لعرض المحتوى المعروض بواسطة React.

* `options` **اختياري**: كائن يحتوي على خيارات لجذر React هذا.

  * `onRecoverableError` **اختياري**: دالة مرجعية تستدعى عندما يفيق React تلقائيًا من الأخطاء.
  * `identifierPrefix` **اختياري**: بادئة نصيّة يستخدمها React للمعرفات الفريدة التي تنشأ عن طريق [`useId`](/reference/react/useId). مفيد لتجنب التعارض عند استخدام العديد من نقاط البداية في نفس الصفحة.

#### العائدات {/*returns*/}

يعيد `createRoot` كائنًا يحتوي على طريقتين: [`render`](#root-render) و [`unmount`](#root-unmount).

#### ملاحظات {/*caveats*/}
* إذا كان تطبيقك يتم عرضه من الخادم، فإن استخدام `createRoot()` غير مدعوم. استخدم [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) بدلاً من ذلك.
* من المرجح أن لديك استدعاء واحد فقط لـ `createRoot` في تطبيقك. إذا كنت تستخدم إطار عمل، فقد يستدعيها الإطار نيابةً عنك.
* عندما ترغب في عرض جزء من JSX في جزء آخر من شجرة DOM التي ليست طفلًا للمكون الخاص بك (على سبيل المثال، نافذة محادثة، أو توضيح Tooltip)، استخدم [`createPortal`](/reference/react-dom/createPortal) بدلاً من `createRoot`.

---

### `root.render(reactNode)` {/*root-render*/}

استدعِ `root.render` لعرض جزء من [JSX](/learn/writing-markup-with-jsx) ("عنصر React") داخل عنصر DOM في جذر React.

```js
root.render(<App />);
```

سيعرض React `<App />` في الجذر، وسيتولى إدارة العنصر DOM داخله.

[انظر المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*root-render-parameters*/}

* `reactNode`: *عنصر React* الذي ترغب في عرضه. عادةً ما يكون هذا جزءًا من JSX مثل `<App />`، ولكن يمكنك أيضًا تمرير عنصر React المُنشأ باستخدام [`createElement()`](/reference/react/createElement)، أو نص أو رقم أو `null` أو `undefined`.


#### العائدات {/*root-render-returns*/}

يعيد `root.render` `undefined`.

#### ملاحظات {/*root-render-caveats*/}

* عندما تستدعي `root.render` للمرة الأولى، سيحذف React كل المحتوى الموجود داخل جذر React قبل عرض مكونات React فيه.

* إذا كان جذر عنصر DOM الخاص بك يحتوي على HTML أنشأته React على الخادم أو أثناء البناء، استخدم [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) بدلاً من ذلك، والتي تربط مستمعي الأحداث بـ HTML الموجود بالفعل.

* إذا استدعيت `render` في نفس الجذر أكثر من مرة، ستحدث React عناصر DOM اللازمة ليظهر أحدث JSX مررتها، ستقرر React أي أجزاء React يمكن إعادة استخدامها، ,أيها يحتاج لإعادة الإنشاء عن طريق ["مطابقتها"](/learn/preserving-and-resetting-state) مع الشجرة المعروضة سابقًا. استدعاء `render` في نفس الجذر مرة أخرى يشبه مناداة [دالة `set`](/reference/react/useState#setstate) في المكون الجذر: تتجنب React تحديثات DOM غير الضرورية.


---

