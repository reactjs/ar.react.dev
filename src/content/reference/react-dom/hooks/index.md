````markdown
---
title: "Hooks React DOM المدمجة"
---

<Intro>

تحتوي حزمة `react-dom` على Hooks المدعومة فقط لتطبيقات الويب (التي تعمل في بيئة المتصفح DOM). هذه Hooks غير مدعومة في بيئات غير المتصفح مثل تطبيقات iOS أو Android أو Windows. إذا كنت تبحث عن Hooks المدعومة في متصفحات الويب *والبيئات الأخرى*، راجع [صفحة React Hooks](/reference/react). تسرد هذه الصفحة جميع Hooks في حزمة `react-dom`.

</Intro>

---

## Form Hooks {/*form-hooks*/}

<Canary>

Form Hooks متاحة حاليًا فقط في قنوات canary و experimental الخاصة بـ React. تعرف على المزيد حول [قنوات إصدار React هنا](/community/versioning-policy#all-release-channels).

</Canary>

تتيح لك *Forms* إنشاء عناصر تحكم تفاعلية لإرسال المعلومات. لإدارة النماذج في مكوناتك، استخدم أحد هذه Hooks:

* يسمح لك [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) بإجراء تحديثات على واجهة المستخدم بناءً على حالة النموذج.

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

````