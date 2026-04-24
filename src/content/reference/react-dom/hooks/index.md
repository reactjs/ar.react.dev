---
title: "Hooks مدمجة في React DOM"
---

<Intro>

تحتوي حزمة `react-dom` على Hooks مدعومة لتطبيقات الويب فقط (التي تعمل في بيئة DOM في المتصفّح). لا تُدعم هذه الـ Hooks في بيئات غير المتصفّح مثل تطبيقات iOS أو Android أو Windows. إن كنت تبحث عن Hooks تعمل في المتصفّح *وفي بيئات أخرى*، راجع [صفحة Hooks في React](/reference/react/hooks). تسرد هذه الصفحة كل الـ Hooks في حزمة `react-dom`.

</Intro>

---

## Hooks للنماذج {/*form-hooks*/}

*النماذج* تتيح لك إنشاء عناصر تفاعلية لإرسال معلومات. لإدارة النماذج في مكوّناتك، استخدم أحد هذه الـ Hooks:

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) يتيح تحديث الواجهة بناءً على حالة نموذج.

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useActionState(increment, 0);
  return (
    <form action={action}>
      <button formAction={incrementFormAction}>Count: {count}</button>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      Submit
    </button>
  );
}
```
