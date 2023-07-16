---
title: createRoot
---

<Intro>

تمكنك `createRoot` من إنشاء نقطة بداية (Root) لعرض مكونات React داخل عنصر DOM في المتصفح.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

استدعِ `createRoot` لإنشاء نقطة بداية React لعرض المحتوى داخل عنصر DOM في المتصفح.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

سيقوم React بإنشاء نقطة بداية لـ `domNode`، ويتولى إدارة العنصر DOM داخله. بعد إنشاء نقطة البداية، يتعين عليك استدعاء [`root.render`](#root-render) لعرض مكون React داخله:

```js
root.render(<App />);
```

يتم عادة إنشاء التطبيق بالكامل باستخدام React بنداء واحد فقط لـ `createRoot` لنقطة البداية. قد يحتوي الموقع الذي يستخدم React لأجزاء من الصفحة على عدد من نقاط البداية الفردية حسب الحاجة.

[انظر المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `domNode`: عنصر [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element) يقوم React بإنشاء نقطة بداية لهذا العنصر ويتيح لك استدعاء الدوال على نقطة البداية مثل `render` لعرض المحتوى المعروض بواسطة React.

* `options` **اختياري**: كائن يحتوي على خيارات لنقطة بداية React هذه.

  * `onRecoverableError` **اختياري**: استدعاء للتحكم عندما يقوم React بالتعافي تلقائيًا من الأخطاء.
  * `identifierPrefix` **اختياري**: بادئة نصيّة يستخدمها React للمعرفات الفريدة التي تنشأ عن طريق [`useId`](/reference/react/useId). مفيد لتجنب التعارض عند استخدام العديد من نقاط البداية في نفس الصفحة.

#### العائدات {/*returns*/}

يعيد `createRoot` كائنًا يحتوي على طريقتين: [`render`](#root-render) و [`unmount`](#root-unmount).

#### ملاحظات {/*caveats*/}
* إذا كان تطبيقك يتم عرضه من الخادم، فإن استخدام `createRoot()` غير مدعوم. استخدم [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) بدلاً من ذلك.
* من المرجح أن لديك استدعاء واحد فقط لـ `createRoot` في تطبيقك. إذا كنت تستخدم إطار عمل، فقد يقوم هذا الإطار الاستدعاء بالنيابة عنك.
* عندما ترغب في عرض جزء من JSX في جزء آخر من شجرة DOM التي ليست طفلًا للمكون الخاص بك (على سبيل المثال، نافذة محادثة، أو توضيح Tooltip)، استخدم [`createPortal`](/reference/react-dom/createPortal) بدلاً من `createRoot`.

