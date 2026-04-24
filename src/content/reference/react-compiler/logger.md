---
title: logger
---

<Intro>

يوفّر خيار `logger` تسجيلاً مخصّصاً لأحداث React Compiler أثناء التجميع.

</Intro>

```js
{
  logger: {
    logEvent(filename, event) {
      console.log(`[Compiler] ${event.kind}: ${filename}`);
    }
  }
}
```

<InlineToc />

---

## المرجع {/*reference*/}

### `logger` {/*logger*/}

يضبط تسجيلاً مخصّصاً لتتبّع سلوك المُصرّف وتصحيح المشاكل.

#### النوع {/*type*/}

```
{
  logEvent: (filename: string | null, event: LoggerEvent) => void;
} | null
```

#### القيمة الافتراضية {/*default-value*/}

`null`

#### الدوال {/*methods*/}

- **`logEvent`**: تُستدعى لكل حدث تجميع مع اسم الملف وتفاصيل الحدث

#### أنواع الأحداث {/*event-types*/}

- **`CompileSuccess`**: نجح تجميع الدالة
- **`CompileError`**: تُرِكت الدالة بسبب أخطاء
- **`CompileDiagnostic`**: معلومات تشخيصية غير قاتلة
- **`CompileSkip`**: تُرِكت الدالة لأسباب أخرى
- **`PipelineError`**: خطأ تجميع غير متوقع
- **`Timing`**: معلومات توقيت الأداء

#### ملاحظات {/*caveats*/}

- قد يتغيّر شكل الحدث بين الإصدارات
- القواعد الكبيرة تُولّد عدداً كبيراً من السجلات

---

## الاستخدام {/*usage*/}

### تسجيل أساسي {/*basic-logging*/}

تتبّع نجاح التجميع والفشل:

```js
{
  logger: {
    logEvent(filename, event) {
      switch (event.kind) {
        case 'CompileSuccess': {
          console.log(`✅ Compiled: ${filename}`);
          break;
        }
        case 'CompileError': {
          console.log(`❌ Skipped: ${filename}`);
          break;
        }
        default: {}
      }
    }
  }
}
```

### تسجيل أخطاء مفصّل {/*detailed-error-logging*/}

احصل على تفاصيل فشل التجميع:

```js
{
  logger: {
    logEvent(filename, event) {
      if (event.kind === 'CompileError') {
        console.error(`\nCompilation failed: ${filename}`);
        console.error(`Reason: ${event.detail.reason}`);

        if (event.detail.description) {
          console.error(`Details: ${event.detail.description}`);
        }

        if (event.detail.loc) {
          const { line, column } = event.detail.loc.start;
          console.error(`Location: Line ${line}, Column ${column}`);
        }

        if (event.detail.suggestions) {
          console.error('Suggestions:', event.detail.suggestions);
        }
      }
    }
  }
}
```
