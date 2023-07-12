---
title: "'use client'"
---

<Note>

هذه التوجيهات لازمة فقط إذا كنت [تستخدم RSC (مكونات الخادم)](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) أو تبني مكتبة متوافقة معها.

</Note>


<Intro>

`'use client'` تميز الملفات التي يتم تنفيذ مكوناتها من جانب العميل

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `'use client'` {/*use-client*/}

أضف `'use client'` في أعلى ملف لتمييز أن الملف (بما في ذلك أي مكونات فرعية يستخدمها) يتم تنفيذه على العميل، بغض النظر عن المكان الذي يتم استيراده منه.

```js
'use client';

import { useState } from 'react';

export default function RichTextEditor(props) {
  // ...
```

عند استيراد ملف معلّم بعبارة `'use client'` من عنصرٍ مكوّن في الخادم، ستعامل المجمّعات المتوافقة [bundlers](/learn/start-a-new-react-project#bleeding-edge-reace-frameworks) الاستيراد كـ"نقطة الفصل" بين كود الخادم وكود العميل. يمكن للمكونات الموجودة في هذه النقطة أو أسفلها في الرسم البياني للوحدة الأساسية استخدام ميزات React المخصصة للعميل مثل [`useState`](/reference/react/useState).

