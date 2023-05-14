---
title: useId
---

<Intro>

`useId` هو خطاف react يستخدم لإنشاء معرفات فريدة يمكن تمريرها إلى سمات إمكانية الوصول.

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `useId()` {/*useid*/}

استدع `useId` في المستوى الأعلى لمكونك لإنشاء معرف فريد

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[يرجى الإطلاع على المزيد من الأمثلة بالأسفل.](#usage)

#### المعاملات {/*parameters*/}

`useId` لا يستقبل أي معاملات.

#### العائدات {/*returns*/}

`useId` يعيد سلسلة بيانات فريدة مرتبطة باستدعاء `useId` المستخدم في هذا المكون تحديدا.

#### تنبيهات {/*caveats*/}

* `useId` هو خطاف, لذلك يمكنك استدعائه فقط **في المستوي الأعلي من مكونك** أو من خلال  الخطافات الخاصة بك. لا يمكنك استدعاء الخطاف داخل الحلقات والشروط. إذا كنت بحاجة إلي ذلك، قم بإستخراج مكون جديد وقم بنقل الحالة إليه.

* `useId` **لا ينبغي استخدامه لتوليد المفاتيح** في القائمة. [يجب أن تتم إنشاء المفاتيح من البيانات الخاصة بك.](/learn/rendering-lists#where-to-get-your-key)

---

## الإستخدام {/*usage*/}

<Pitfall>

**لا تستدعي `useId` لتوليد المفاتيح في القائمة.**  [يجب أن تتم إنشاء المفاتيح من البيانات الخاصة بك.](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### إنشاء معرفات فريدة لسمات إمكانية الوصول {/*generating-unique-ids-for-accessibility-attributes*/}

استدعي `useId` في المستوي الأعلي من المكون الخاص بك لإنشاء معرف فريد:

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

يمكنك بعد ذلك تمرير <CodeStep step={1}>المعرف الذى تم إنشاؤه</CodeStep> إلى سمات مختلفة:

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**دعنا نستعرض مثالا لمعرفة متى يكون ذلك مفيدا.**

[HTML accessibility attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) مثل [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) تتيح لك تحديد أن هناك علامتين مرتبطين ببعضهما البعض. على سبيل المثال، يمكنك تحديد أن العنصر (مثل صندوق الإدخال) يتم وصفه بواسطة عنصر آخر (مثل فقرة).

في HTML ستكتبه بهذا الشكل:

```html {5,8}
<label>
  Password:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  The password should contain at least 18 characters
</p>
```

مع ذلك، تضمين المعرفات بهذا الشكل ليس طريقة جيدة في ريأكت. يمكن أن يتم عرض المكون أكثر من مرة على الصفحة ولكن يجب أن تكون المعرفات فريدة! بدلا من تضمين معرف ثابت، يمكنك توليد معرف فريد باستخدام `useId`:

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}
```

الآن، حتى إذا كان `PasswordField` يظهر عدة مرات على الشاشة، لن تحدث تعارضات بين المعرفات المولدة.

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
      <h2>Confirm password</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

[شاهد هذا الفيديو](https://www.youtube.com/watch?v=0dNzNcuEuOo) لترى الفرق في تجربة المستخدم مع تقنيات المساعدة.

<Pitfall>

في [عرض الخادم](/reference/react-dom/server), **`useId` يتطلب وجود نفس شجرة المكونات علي الخادم والعميل**. إذا لم تتطابق الشجرات التي تقوم بعرضها على الخادم والعميل حرفيا، فإن المعرفات المولدة لن تتطابق.

</Pitfall>

<DeepDive>

#### لماذا يعد useId أفضل من العداد المتزايد؟ {/*why-is-useid-better-than-an-incrementing-counter*/}

قد تتساءل لماذا `useId` أفضل من زيادة متغير عالمي مثل `nextId++`.

الفائدة الأساسية لـ `useId` هي أن ريأكت ستضمن أنه يعمل مع [server rendering.](/reference/react-dom/server) أثناء عرض الخادم, يتم تحويل مكوناتك إلي عناصر HTML. في وقت لاحق، على العميل, [hydration](/reference/react-dom/client/hydrateRoot) يقوم بربط معالجات الأحداث الخاصة بك بعناصر HTML التي تم توليدها. لكي يعمل تحويل العناصر على العميل بشكل صحيح، يجب أن يتطابق إخراج العميل مع HTML الذي علي الخادم.

من الصعب جدا ضمان ذلك باستخدام عداد متزايد لأن ترتيب تحويل المكونات على العميل قد لا يتطابق مع ترتيب إخراج HTML على الخادم. من خلال استدعاء `useId`، ستضمن أن عملية تحويل المكونات ستعمل بشكل صحيح، وسيتطابق الإخراج بين الخادم والعميل.

داخل ريأكت، يتم إنشاء `useId` من الـ "parent path" للمكون الذي يستدعيه. وهذا هو السبب في أنه إذا كانت شجرة العميل وشجرة الخادم متطابقتين، سيتطابق الـ "parent path" بغض النظر عن ترتيب العرض.

</DeepDive>

---

### توليد معرفات لعدة عناصر ذات صلة {/*generating-ids-for-several-related-elements*/}

إذا كنت بحاجة إلى تعيين معرفات لعدة عناصر ذات صلة، يمكنك استدعاء `useId` لتوليد بادئة مشتركة لها: 

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>First Name:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Last Name:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

هذا يتيح لك تجنب استدعاء `useId` لكل عنصر يحتاج إلى معرف فريد.

---

### تحديد بادئة مشتركة لجميع المعرفات المولدة {/*specifying-a-shared-prefix-for-all-generated-ids*/}

إذا كنت تقوم بعرض عدة تطبيقات react مستقلة على صفحة واحدة, قم بتمرير `identifierPrefix` كخيار إلى استدعاءات [`createRoot`](/reference/react-dom/client/createRoot#parameters) أو [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) الخاصة بك. هذا يضمن عدم حدوث تعارض بين المعرفات المولدة بواسطة التطبيقين المختلفين لأن كل معرف تم إنشاؤه باستخدام `useId` سيبدأ بالبادئة المميزة التي حددتها.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Generated identifier:', passwordHintId)
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
    </>
  );
}
```

```js index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>

