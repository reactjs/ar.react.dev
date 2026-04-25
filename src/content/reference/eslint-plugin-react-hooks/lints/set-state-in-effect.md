---
title: set-state-in-effect
---

<Intro>

يتحقق من عدم استدعاء setState متزامناً داخل effect، ما قد يؤدي إلى إعادة تصيير تُضعف الأداء.

</Intro>

## تفاصيل القاعدة {/*rule-details*/}

ضبط الحالة فوراً داخل effect يجبر React على إعادة تشغيل دورة التصيير بالكامل. عند تحديث الحالة في effect يجب أن يُعاد تصيير المكوّن وتطبيق التغييرات على DOM ثم تشغيل الـ effects مجدداً. ينتج عن ذلك مرور تصيير إضافي كان يمكن تجنّبه بتحويل البيانات مباشرة أثناء التصيير أو باشتقاق الحالة من الـ props. حوّل البيانات في أعلى مستوى المكوّن؛ ستُعاد الشيفرة طبيعياً عند تغيّر الـ props أو الحالة دون إطلاق دورات تصيير إضافية.

استدعاءات `setState` المتزامنة في الـ effects تطلق إعادة تصيير فورية قبل أن يرسم المتصفّح، ما يسبب مشاكل أداء وارتجاجاً بصرياً. يحتاج React إلى التصيير مرتين: مرة لتطبيق تحديث الحالة ثم مرة أخرى بعد تشغيل الـ effects. هذا التصيير المزدوج مُهدَر عندما يمكن تحقيق النتيجة بتصيير واحد.

في كثير من الحالات قد لا تحتاج إلى effect أصلاً. راجع [قد لا تحتاج إلى Effect](/learn/you-might-not-need-an-effect) لمزيد من التفاصيل.

## مخالفات شائعة {/*common-violations*/}

تلتقط هذه القاعدة عدة أنماط حيث يُستخدم setState متزامن دون داعٍ:

- ضبط حالة التحميل متزامناً
- اشتقاق الحالة من الـ props في الـ effects
- تحويل البيانات في الـ effects بدل التصيير

### غير صالح {/*invalid*/}

أمثلة لشيفرة غير صحيحة لهذه القاعدة:

```js
// ❌ setState متزامن في effect
function Component({data}) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(data); // تصيير إضافي؛ استخدم الحالة الابتدائية
  }, [data]);
}

// ❌ ضبط حالة التحميل متزامناً
function Component() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); // متزامن، يسبب تصييراً إضافياً
    fetchData().then(() => setLoading(false));
  }, []);
}

// ❌ تحويل البيانات في effect
function Component({rawData}) {
  const [processed, setProcessed] = useState([]);

  useEffect(() => {
    setProcessed(rawData.map(transform)); // يجب الاشتقاق في التصيير
  }, [rawData]);
}

// ❌ اشتقاق الحالة من الـ props
function Component({selectedId, items}) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(items.find(i => i.id === selectedId));
  }, [selectedId, items]);
}
```

### صالح {/*valid*/}

أمثلة لشيفرة صحيحة لهذه القاعدة:

```js
// ✅ setState في effect مقبول إذا جاءت القيمة من ref
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
}

// ✅ احسب أثناء التصيير
function Component({selectedId, items}) {
  const selected = items.find(i => i.id === selectedId);
  return <div>{selected?.name}</div>;
}
```

**عندما يمكن حساب شيء من الـ props أو الحالة الحالية، لا تضعه في state.** احسبه أثناء التصيير. يجعل شيفرتك أسرع وأبسط وأقل عرضة للأخطاء. تعلّم المزيد في [قد لا تحتاج إلى Effect](/learn/you-might-not-need-an-effect).
