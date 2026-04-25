---
title: "دالة createContext"
---

<Intro>

`createContext` تنشئ [سياقًا (context)](/learn/passing-data-deeply-with-context) يمكن للمكوّنات أن توفره أو تقرأه.

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

استدعِ `createContext` خارج أي مكوّن لإنشاء سياق.

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[اطلع على المزيد من الأمثلة أدناه.](#usage)

#### المعاملات {/*parameters*/}

* `defaultValue`: القيمة التي تريد للسياق أن يحملها عندما لا يوجد موفّر سياق مطابق في الشجرة فوق المكوّن الذي يقرأ السياق. إذا لم يكن لديك قيمة افتراضية ذات معنى، حدد `null`. القيمة الافتراضية ملاذ أخير؛ هي ثابتة ولا تتغير مع الزمن.

#### القيمة المُرجَعة {/*returns*/}

`createContext` تُرجع كائن سياق.

**كائن السياق نفسه لا يحمل معلومات.** يمثل _أي_ سياق تقرأه المكوّنات الأخرى أو توفره. عادةً ستستخدم [`SomeContext`](#provider) في المكوّنات الأعلى لتحديد قيمة السياق، وتستدعي [`useContext(SomeContext)`](/reference/react/useContext) في المكوّنات الأدنى لقراءتها. لكائن السياق بعض الخصائص:

* `SomeContext` يتيح تمرير قيمة السياق للمكوّنات.
* `SomeContext.Consumer` طريقة بديلة نادرة لقراءة قيمة السياق.
* `SomeContext.Provider` طريقة قديمة لتوفير قيمة السياق قبل React 19.

---

### موفّر `SomeContext` {/*provider*/}

لفّ مكوّناتك بموفّر سياق لتحديد قيمة هذا السياق لكل المكوّنات بداخله:

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext value={theme}>
      <Page />
    </ThemeContext>
  );
}
```

<Note>

بدءًا من React 19، يمكنك عرض `<SomeContext>` كموفّر.

في إصدارات React الأقدم، استخدم `<SomeContext.Provider>`.

</Note>

#### الخصائص {/*provider-props*/}

* `value`: القيمة التي تريد تمريرها لكل المكوّنات التي تقرأ هذا السياق داخل هذا الموفر، مهما كان عمقها. يمكن أن تكون قيمة السياق من أي نوع. المكوّن الذي يستدعي [`useContext(SomeContext)`](/reference/react/useContext) داخل الموفر يتلقى `value` لأقرب موفّر سياق مطابق فوقه.

---

### `SomeContext.Consumer` {/*consumer*/}

قبل وجود `useContext`، كانت هناك طريقة أقدم لقراءة السياق:

```js
function Button() {
  // 🟡 Legacy way (not recommended)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

رغم أن هذه الطريقة ما زالت تعمل، **يجب أن تقرأ السياق في الشيفرة الجديدة بـ [`useContext()`](/reference/react/useContext):**

```js
function Button() {
  // ✅ Recommended way
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### الخصائص {/*consumer-props*/}

* `children`: دالة. تستدعي React الدالة التي تمررها بقيمة السياق الحالية حسب نفس خوارزمية [`useContext()`](/reference/react/useContext)، وتعرض ما تُرجعه من الدالة. ستُعيد React تشغيل هذه الدالة وتحديث الواجهة عندما يتغيّر السياق من المكوّنات الأب.

---

## الاستخدام {/*usage*/}

### إنشاء سياق {/*creating-context*/}

السياق يتيح للمكوّنات [تمرير معلومات عميقًا](/learn/passing-data-deeply-with-context) دون تمرير خصائص صريحة.

استدعِ `createContext` خارج أي مكوّن لإنشاء سياق أو أكثر.

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` تُرجع <CodeStep step={1}>كائن سياق</CodeStep>. تقرأ المكوّنات السياق بتمريره إلى [`useContext()`](/reference/react/useContext):

```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

افتراضيًا، القيم التي تتلقاها ستكون <CodeStep step={3}>القيم الافتراضية</CodeStep> التي حددتها عند إنشاء السياقات. لكن هذا وحده غير مفيد لأن القيم الافتراضية لا تتغير أبدًا.

السياق مفيد لأنك يمكنك **توفير قيم ديناميكية أخرى من مكوّناتك:**

```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext value={theme}>
      <AuthContext value={currentUser}>
        <Page />
      </AuthContext>
    </ThemeContext>
  );
}
```

الآن مكوّن `Page` وأي مكوّنات بداخله، مهما كان العمق، «ترى» قيم السياق الممررة. إذا تغيّرت القيم الممررة، ستُعيد React عرض المكوّنات التي تقرأ السياق أيضًا.

[اقرأ المزيد عن قراءة السياق وتوفيره مع الأمثلة.](/reference/react/useContext)

---

### استيراد وتصدير السياق من ملف {/*importing-and-exporting-context-from-a-file*/}

غالبًا تحتاج مكوّنات في ملفات مختلفة لنفس السياق. لذلك شائع الإعلان عن السياقات في ملف منفصل. ثم تستخدم [عبارة `export`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) لتوفير السياق لملفات أخرى:

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

يمكن للمكوّنات في ملفات أخرى استخدام [عبارة `import`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import) لقراءة السياق أو توفيره:

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext value={theme}>
      <AuthContext value={currentUser}>
        <Page />
      </AuthContext>
    </ThemeContext>
  );
}
```

يعمل هذا مشابهًا [لاستيراد وتصدير المكوّنات.](/learn/importing-and-exporting-components)

---

## استكشاف الأخطاء {/*troubleshooting*/}

### لا أجد طريقة لتغيير قيمة السياق {/*i-cant-find-a-way-to-change-the-context-value*/}


شيفرة مثل هذه تحدد قيمة السياق *الافتراضية*:

```js
const ThemeContext = createContext('light');
```

هذه القيمة لا تتغير أبدًا. تستخدم React إياها فقط كملاذ إذا لم تجد موفّرًا مطابقًا فوقها.

لجعل السياق يتغير مع الزمن، [أضف حالة ولفّ المكوّنات بموفّر سياق.](/reference/react/useContext#updating-data-passed-via-context)
