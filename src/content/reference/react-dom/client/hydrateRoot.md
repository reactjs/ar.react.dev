---
title: hydrateRoot
---

<Intro>

تمكنك `hydrateRoot` من عرض مكونات React في عناصر DOM في المتصفح، التي تم توليدها سابقًا باستخدام [`react-dom/server`](/reference/react-dom/server).

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

استدعِ `hydrateRoot` لـ "ربط" React بـ HTML الحالي الذي تم عرضه بالفعل بواسطة React في بيئة الخادم.

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

سيقوم React بربط نفسه بالHTML الموجود داخل الـ `domNode` والاهتمام بإدارة DOM داخلها. التطبيق المبنى كاملًا بواسطة React سيكون لديه عادة استدعاء واحد فقط لـ `hydrateRoot` باستخدام مكوِّن الجذر الخاص به.

[شاهد المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `domNode`: عنصر [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element) الذي تم عرضه كعنصر جذر على الخادم.

* `reactNode`: "مُكوِّن React" المستخدم لعرض HTML الحالي. هذا عادةً ما يكون جزءًا من JSX مثل `<App />` الذي تم عرضه باستخدام طريقة `ReactDOM Server` مثل `renderToPipeableStream(<App />)`.

* `options` **اختياري**: كائن يحتوي على خيارات لجذر React هذا.

  * `onRecoverableError` **اختياري**: دالة مرجعية تُستدعى تلقائيًا عندما يفيق React من الأخطاء.
  * `identifierPrefix` **اختياري**: بادئة نصيّة يستخدمها React للمعرفات الفريدة التي تنشأ عن طريق [`useId`](/reference/react/useId). مفيد لتجنب التعارض عند استخدام العديد من الجذور في نفس الصفحة.


#### العائدات {/*returns*/}

تعيد `hydrateRoot` كائنًا يحتوي على طريقتين: [`render`](#root-render) و [`unmount`.](#root-unmount)

#### ملاحظات {/*caveats*/}

* `hydrateRoot()` يتوقع أن يكون المحتوى المعروض مطابقًا تمامًا للمحتوى المرسوم في الخادم. يجب عليك التعامل مع عدم التطابقات على أنها أخطاء وإصلاحها.
* في وضع التطوير، يحذر React من التطابقات أثناء الربط. لا يوجد ضمانات بأن الاختلافات في السمات ستكون مُصحَّحة في حالة التطابقات. هذا مهم لأسباب أداء لأنه في معظم التطبيقات، يكون الاختلافات نادرة، وبالتالي فإن التحقق من صحة جميع العلامات قد يكون صعبًا جدًا.
* من المرجح أن لديك استدعاء واحد فقط لـ `hydrateRoot` في تطبيقك. إذا كنت تستخدم إطار عمل، فقد يستدعيها الإطار نيابةً عنك.
* إذا كان تطبيقك يُرسم في جانب العميل، بدون أي محتوى HTML بالفعل، فاستخدام `hydrateRoot()` ليس مناسبًا. بدلاً من ذلك، استخدم [`createRoot()`](/reference/react-dom/client/createRoot).

---

### `root.render(reactNode)` {/*root-render*/}

استدعِ `root.render` لتحديث مكون React داخل جذر React في عنصر DOM في المتصفح.

```js
root.render(<App />);
```

ستحدث React <App /> في `root` المُجَمّع.

[شاهد المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*root-render-parameters*/}

* `reactNode`: *عنصر React* الذي ترغب في عرضه. عادةً ما يكون هذا جزءًا من JSX مثل `<App />`، ولكن يمكنك أيضًا تمرير عنصر React المُنشأ باستخدام [`createElement()`](/reference/react/createElement)، أو نص أو رقم أو `null` أو `undefined`.


#### العائدات {/*root-render-returns*/}

تعيد `root.render`: `undefined`.

#### ملاحظات {/*root-render-caveats*/}

* إذا استدعيت `root.render` قبل أن ينتهي الجذر من التجميع، فسيقوم React بمسح محتوى HTML المرسوم بالفعل من الخادم وتحويل الجذر بأكمله إلى الرسم  من جانب العميل.

---

