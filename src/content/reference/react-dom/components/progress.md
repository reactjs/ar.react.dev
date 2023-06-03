---
title: "<progress>"
---

<Intro>

يتيح لك [مكون `<progress>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) عرض مؤشر التقدم

```js
<progress value={0.5} />
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `<progress>` {/*progress*/}

لعرض مؤشر التقدم، قم بتصيير مكون [`<progress>` المدمج في المتصفح ](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) 

```js
<progress value={0.5} />
```

[اطّلع على المزيد من الأمثلة في الأسفل.](#usage)

#  الخصائص {/*props*/}

يدعم `<progress>` جميع  [خصائص العناصر الشائعة](/reference/react-dom/components/common#props)

بالإضافة إلى ذالك، يدعم `<progress>` هذه الخصائص:

* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#attr-max): رقم. يحدد القيمة `value` القصوى. القيمة الافتراضية هي `1`.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#attr-value): رقم بين `0` و `max`، أو `null` للتقدم غير المحدد. يحدد مدى الانجاز.

---

## الاستخدام {/*usage*/}

### التحكم في مؤشر التقدم {/*controlling-a-progress-indicator*/}

لعرض مؤشر التقدم قم بتصيير مكون `<progress>`، يمكنك تمرير قيمة رقمية `value` بين `0` و القيمة القصوى `max` التي تحددها. إذا لم تمرر قيمة قصوى `max`، فبشكل افتراضي ستكون `1`.

إذا لم تكن العملية جارية، قم بتمرير `value={null}` لوضع مؤشر التقدم في حالة غير محددة.

<Sandpack>

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

```css
progress { display: block; }
```

</Sandpack>
