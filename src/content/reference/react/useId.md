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

#### المعاملات (parameters) {/*parameters*/}

`useId` لا يقبل أي معاملات.

#### العائدات {/*returns*/}

`useId` يعيد نص فريد مرتبط باستدعاء `useId` المستخدم في هذا المكون تحديدا.

#### تنبيهات {/*caveats*/}

* `useId` هو خطاف، لذلك يمكنك استدعائه فقط **في المستوي الأعلي من مكونك** أو من خلال الخطاطيف الخاصة بك. لا يمكنك استدعاء الخطاف داخل الحلقات والشروط. إذا كنت بحاجة إلي ذلك، قم بإستخراج مكون جديد وقم بنقل الحالة إليه.

* `useId` **لا ينبغي استخدامه لتوليد المفاتيح** في القائمة. [يجب أن تتم إنشاء المفاتيح من البيانات الخاصة بك.](/learn/rendering-lists#where-to-get-your-key)

---

## الاستخدام {/*usage*/}

<Pitfall>

**لا تستدعِ `useId` لتوليد المفاتيح في القائمة.**  [يجب أن تتم إنشاء المفاتيح من البيانات الخاصة بك.](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### إنشاء معرفات فريدة لسمات إمكانية الوصول {/*generating-unique-ids-for-accessibility-attributes*/}

استدعِ `useId` في المستوي الأعلي من المكون الخاص بك لإنشاء معرف فريد:

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

في HTML العادي ستكتبه بهذا الشكل:

```html {5,8}
<label>
  Password:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  يجب أن تحتوي كلمة السر على 18 حرفًا على الأقل
</p>
```

مع ذلك، تضمين المعرفات بهذا الشكل ليس طريقة جيدة في React. يمكن أن يتم عرض المكون أكثر من مرة على الصفحة، ولكن يجب أن تكون المعرفات فريدة! بدلا من تضمين معرف ثابت، يمكنك توليد معرف فريد باستخدام `useId`:

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
        يجب أن تحتوي كلمة السر على 18 حرفًا على الأقل
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
        يجب أن تحتوي كلمة السر على 18 حرفًا على الأقل
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>أدخل كلمة سر</h2>
      <PasswordField />
      <h2>تأكيد كلمة السر</h2>
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

في [تصيير الخادم](/reference/react-dom/server), **يتطلب `useId` وجود نفس شجرة المكونات علي الخادم والعميل**. إذا لم تتطابق الشجرات التي تقوم بعرضها على الخادم والعميل حرفيا، فإن المعرفات المولدة لن تتطابق.

</Pitfall>

<DeepDive>

#### لماذا يعد useId أفضل من العداد المتزايد؟ {/*why-is-useid-better-than-an-incrementing-counter*/}

قد تتساءل لماذا `useId` أفضل من زيادة متغير عالمي مثل `nextId++`.

الفائدة الأساسية لـ `useId` هي أن React ستضمن أنه يعمل مع [تصيير الخادم.](/reference/react-dom/server) أثناء تصيير الخادم، يتم تحويل مكوناتك إلي عناصر HTML. في وقت لاحق، على العميل، [hydration](/reference/react-dom/client/hydrateRoot) يقوم بربط معالجات الأحداث الخاصة بك بعناصر HTML التي تم توليدها. لكي يعمل تحويل العناصر على العميل بشكل صحيح، يجب أن يتطابق إخراج العميل مع HTML الذي على الخادم.

<<<<<<< HEAD
من الصعب جدا ضمان ذلك باستخدام عداد متزايد لأن ترتيب تحويل المكونات على العميل قد لا يتطابق مع ترتيب إخراج HTML على الخادم. من خلال استدعاء `useId`، ستضمن أن عملية تحويل المكونات ستعمل بشكل صحيح، وسيتطابق الإخراج بين الخادم والعميل.
=======
This is very difficult to guarantee with an incrementing counter because the order in which the Client Components are hydrated may not match the order in which the server HTML was emitted. By calling `useId`, you ensure that hydration will work, and the output will match between the server and the client.
>>>>>>> fcd00068bd1bdd4eb37e3e0ab0488a9d093670bc

داخل React، يتم إنشاء `useId` من الـ "مسار الأب" للمكون الذي يستدعيه. وهذا هو السبب في أنه إذا كانت شجرة العميل وشجرة الخادم متطابقتين، سيتطابق "مسار لأب" بغض النظر عن ترتيب العرض.

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
      <label htmlFor={id + '-firstName'}>الاسم الأول:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>الاسم الأخير:</label>
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
  <head><title>تطبيقي</title></head>
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
        يجب أن تحتوي كلمة السر على 18 حرفًا على الأقل
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>أدخل كلمة السر</h2>
      <PasswordField />
    </>
  );
}
```

```js index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 createRoot(document.getElementById('root1'), {
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
