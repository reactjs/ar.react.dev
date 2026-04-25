---
title: "إنشاء بوابة (createPortal)"
---

<Intro>

تمكنك `createPortal` من تصيير بعض الأبناء في جزء آخر من DOM.


```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `createPortal(children, domNode, key?)` {/*createportal*/}

لإنشاء بوابة (portal)، استدعِ `createPortal` مع تمرير بعض JSX وعقدة DOM التي يجب أن تُصَيَّر فيها:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>هذا الابن وُضع داخل div الأب.</p>
  {createPortal(
    <p>هذا الابن وُضع في جسم المستند document.body.</p>,
    document.body
  )}
</div>
```

[المزيد من الأمثلة أدناه.](#usage)

تغيّر البوابة موضع العقدة في DOM فقط. في كل شيء آخر، يتصرّف JSX الذي تصيّره في البوابة كابن لمكوّن React الذي يصيّره. على سبيل المثال، يمكن للابن الوصول إلى السياق الذي يوفّره الأب، وتنتقل الأحداث من الأبناء إلى الآباء وفق شجرة React.

#### المعاملات {/*parameters*/}

* `children`: أي شيء يمكن تصييره بـ React، مثل JSX (مثل `<div />` أو `<SomeComponent />`)، أو [Fragment](/reference/react/Fragment) (`<>...</>`)، أو سلسلة أو رقمًا، أو مصفوفة منها.

* `domNode`: عقدة DOM، مثل ما تُرجعه `document.getElementById()`. يجب أن تكون العقدة موجودة مسبقًا. تمرير عقدة DOM مختلفة أثناء التحديث يعيد إنشاء محتوى البوابة.

* **اختياري** `key`: سلسلة أو رقم فريد يُستخدم كـ [key](/learn/rendering-lists#keeping-list-items-in-order-with-key) للبوابة.

#### القيمة المُرجَعة {/*returns*/}

تُرجِع `createPortal` عقدة React يمكن تضمينها في JSX أو إرجاعها من مكوّن React. إن واجهها React في مخرجات التصيير، يضع `children` داخل `domNode` المحدّد.

#### ملاحظات {/*caveats*/}

* أحداث البوابات تنتشر وفق شجرة React لا شجرة DOM. مثلاً، إن نقرت داخل بوابة والبوابة ملفوفة في `<div onClick>`، يُفعَّل معالج `onClick` ذلك. إن سبب ذلك مشاكل، إمّا أوقف انتشار الحدث من داخل البوابة أو انقل البوابة أعلى في شجرة React.

---

## الاستخدام {/*usage*/}

### التصيير إلى جزء مختلف من DOM {/*rendering-to-a-different-part-of-the-dom*/}

*البوابات* تسمح لمكوّناتك بتصيير بعض الأبناء في مكان آخر من DOM. يتيح ذلك «الخروج» من أي حاويات. على سبيل المثال، يمكن لمكوّن عرض نافذة حوار أو تلميح يظهر فوق الصفحة وخارجها.

لإنشاء بوابة، صيّر ناتج `createPortal` مع <CodeStep step={1}>بعض JSX</CodeStep> و<CodeStep step={2}>عقدة DOM الهدف</CodeStep>:

```js [[1, 8, "<p>هذا الابن وُضع في جسم المستند.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>هذا الابن وُضع داخل div الأب.</p>
      {createPortal(
        <p>هذا الابن وُضع في جسم المستند.</p>,
        document.body
      )}
    </div>
  );
}
```

سيضع React عقد DOM لـ <CodeStep step={1}>JSX الذي مرّرته</CodeStep> داخل <CodeStep step={2}>عقدة DOM التي زوّدتها</CodeStep>.

بدون بوابة، كان سيُوضَع `<p>` الثاني داخل `<div>` الأب، لكن البوابة «نقلته» إلى [`document.body`:](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>هذا الابن وُضع داخل div الأب.</p>
      {createPortal(
        <p>هذا الابن وُضع في جسم المستند.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

لاحظ أن الفقرة الثانية تظهر بصريًا خارج `<div>` الأب ذي الحدود. إن فحصت بنية DOM بأدوات المطوّر، سترى أن `<p>` الثاني وُضِع مباشرة في `<body>`:

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>هذا الابن وُضع داخل div الأب.</p>
      </div>
    ...
  </div>
  <p>هذا الابن وُضع في جسم المستند.</p>
</body>
```

تغيّر البوابة موضع العقدة في DOM فقط. في كل شيء آخر، يتصرّف JSX في البوابة كابن لمكوّن React الذي يصيّره. على سبيل المثال، يمكن للابن الوصول إلى السياق من الأب، وتنتقل الأحداث من الأبناء إلى الآباء وفق شجرة React.

---

### تصيير نافذة حوار مع بوابة {/*rendering-a-modal-dialog-with-a-portal*/}

يمكنك استخدام بوابة لإنشاء نافذة حوار تطفو فوق الصفحة حتى لو كان المكوّن الذي يستدعي الحوار داخل حاوية فيها `overflow: hidden` أو أنماط تعيق الحوار.

في هذا المثال، للحاويتين أنماط تعطل نافذة الحوار، لكن التي تُصَيَّر عبر بوابة لا تتأثر لأن الحوار في DOM ليس داخل عناصر JSX الأب.

<Sandpack>

```js src/App.js active
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample  />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

```js src/NoPortalExample.js
import { useState } from 'react';
import ModalContent from './ModalContent.js';

export default function NoPortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        إظهار الحوار بدون بوابة
      </button>
      {showModal && (
        <ModalContent onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

```js src/PortalExample.js active
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        إظهار الحوار باستخدام بوابة
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js src/ModalContent.js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>أنا نافذة حوار</div>
      <button onClick={onClose}>إغلاق</button>
    </div>
  );
}
```


```css src/styles.css
.clipping-container {
  position: relative;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  padding: 12px;
  width: 250px;
  height: 80px;
  overflow: hidden;
}

.modal {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
  background-color: white;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 12px;
  position:  absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

من المهم التأكد من إمكانية الوصول عند استخدام البوابات. قد تحتاج مثلاً لإدارة تركيز لوحة المفاتيح ليتحرك المستخدم داخل وخارج البوابة بشكل طبيعي.

اتبع [ممارسات تأليف النوافذ الحوارية WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal) عند إنشاء نوافذ حوارية. إن استخدمت حزمة مجتمعية، تأكد أنها قابلة للوصول وتتبع هذه الإرشادات.

</Pitfall>

---

### تصيير مكوّنات React في علامات من خادم غير React {/*rendering-react-components-into-non-react-server-markup*/}

تفيد البوابات إن كان جذر React جزءًا فقط من صفحة ثابتة أو مُصَيَّرة على الخادم غير مبنية بـ React. مثلاً، إن بُنيت الصفحة بإطار مثل Rails، يمكنك إنشاء مناطق تفاعلية داخل أقسام ثابتة كالشريط الجانبي. مقارنةً بـ [عدة جذور React منفصلة،](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) تتيح البوابات التعامل مع التطبيق كشجرة React واحدة بحالة مشتركة رغم أن أجزاءه تُصَيَّر في أماكن مختلفة من DOM.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>تطبيقي</title></head>
  <body>
    <h1>مرحبًا بتطبيقي المختلط</h1>
    <div class="parent">
      <div class="sidebar">
        هذه علامات من الخادم ليست React
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>هذا الجزء يُصَيَّر بواسطة React</p>;
}

function SidebarContent() {
  return <p>هذا الجزء أيضًا يُصَيَّر بواسطة React!</p>;
}
```

```css
.parent {
  display: flex;
  flex-direction: row;
}

#root {
  margin-top: 12px;
}

.sidebar {
  padding:  12px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  margin-right: 12px;
}

#sidebar-content {
  margin-top: 18px;
  display: block;
  background-color: white;
}

p {
  margin: 0;
}
```

</Sandpack>

---

### تصيير مكوّنات React في عقد DOM خارج React {/*rendering-react-components-into-non-react-dom-nodes*/}

يمكنك أيضًا استخدام بوابة لإدارة محتوى عقدة DOM تُدار خارج React. مثلاً، تكامل مع أداة خرائط غير React وتريد تصيير محتوى React داخل منبثقة. لذلك، صرّح بمتغير حالة `popupContainer` لتخزين العقدة التي ستصيّر فيها:

```js
const [popupContainer, setPopupContainer] = useState(null);
```

عند إنشاء الأداة الخارجية، خزّن عقدة DOM التي تُرجعها لتصيّر إليها:

```js {5-6}
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

يتيح لك ذلك استخدام `createPortal` لتصيير محتوى React في `popupContainer` عندما تصبح متاحة:

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>مرحبًا من React!</p>,
      popupContainer
    )}
  </div>
);
```

مثال كامل يمكن تجربته:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>مرحبًا من React!</p>,
        popupContainer
      )}
    </div>
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement('div');
  L.popup()
    .setLatLng([0, 0])
    .setContent(popupDiv)
    .openOn(map);
  return popupDiv;
}
```

```css
button { margin: 5px; }
```

</Sandpack>
