---
title: "<option>"
---

<Intro>

يتيح لك [مكون الـ `<option>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) عرض خيارات داخل عنصر الاختيار [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">بعض الخيارات</option>
  <option value="otherOption">خيارات أخرى</option>
</select>
```

</Intro>

<InlineToc />

---

## المرجع {/*reference*/}

### `<option>` {/*option*/}
يتيح لك عنصر [`<option>` المدمَج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) عرض خيار في عنصر الاختيار [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">بعض الخيارات</option>
  <option value="otherOption">خيارات أخرى</option>
</select>
```

[اطّلع على المزيد من الأمثلة في الأسفل.](#usage)

#### الخصائص {/*props*/}

تدعم `<option>` [جميع خصائص العناصر الشائعة.](/reference/react-dom/components/common#props)

بالإضافة إلى ذلك ، يدعم `<option>` هذه الخصائص:

* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#disabled): قيمة منطقية. إذا كانت `true`، فلن يكون الخيار قابلاً للتحديد وسيظهر باهت.

* [`label`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#label): نص. يحدد معنى الخيار. إذا لم يتم تحديده، فسيتم استخدام النص الموجود داخل الخيار.

* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#value): القيمة التي سيتم استخدامها [عند إرسال العنصر الأب `<select>` في النموذج](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form) إذا تم اختيار هذا الخيار.

#### تنبيه {/*caveats*/}

* لا تدعم React سمة `selected` في `<option>`. بدلاً من ذلك، مرِّر قيمة `value` هذا الخيار إلى العنصر الأب في [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option) لعنصر اختيار غير متحكم فيه، أو في [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable)  لمعنصر اختيار متحكم فيه.

---

## الاستخدام {/*usage*/}

### عرض عنصر الاختيار مع الخيارات {/*displaying-a-select-box-with-options*/}

قم بإنشاء `<select>` يتضمن داخله قائمة من مكونات `<option>` لعرض مربع تحديد. أعط كل `<option>` قيمة `value` تمثل البيانات التي سيتم رفعها مع النموذج.

[اقرأ المزيد حول عرض `<select>` بقائمة مكونات `<option>`.](/reference/react-dom/components/select)

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      اختر فاكهة:
      <select name="selectedFruit">
        <option value="apple">تفاح</option>
        <option value="banana">موز</option>
        <option value="orange">برتقال</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>
