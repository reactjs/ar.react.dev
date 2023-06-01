---
title: "<option>"
---

<Intro>

يتيح لك [مكون الـ `<option>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) بعرض خيارات داخل مربع [`<select>`](/reference/react-dom/components/select).

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

يتيح لك [مكون الـ `<option>` المدمج في المتصفح](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) بعرض خيارات داخل مربع [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">بعض الخيارات</option>
  <option value="otherOption">خيارات أخرى</option>
</select>
```

[انظر الى المزيد من الأمثلة في الأسفل.](#usage)

#### الخصائص {/*props*/}

تدعم `<option>` [جميع خصائص العناصر الشائعة.](/reference/react-dom/components/common#props)

بالإضافة إلى ذلك ، يدعم `<option>` هذه الخصائص:

* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#disabled): قيمة منطقية. إذا كانت `true`، فلن يكون الخيار قابلاً للتحديد وسيظهر باهت.

* [`label`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#label): نص. يحدد معنى الخيار. إذا لم يتم تحديده ، فسيتم استخدام النص الموجود داخل الخيار.

* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#value): القيمة التي سيتم استخدامها [عند إرسال عنصر الأب `<select>` في النموذج](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form) إذا تم تحديد هذا الخيار.

#### تنبيه {/*caveats*/}

* لا تدعم React سمة `selected` في `<option>`. بدلاً من ذلك ، قم بتمرير `value` هذا الخيار إلى العنصر الأب [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option)  وذلك لمربع تحديد غير متحكم فيه، أو [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable)  لمربع تحديد متحكم فيه.

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
