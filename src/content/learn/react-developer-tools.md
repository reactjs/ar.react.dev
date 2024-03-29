---
title: أدوات مطوري React
---

<Intro>

استخدم أدوات مطور React لفحص [المكونات](/learn/your-first-component)، وتعديل [الخصائص](/learn/passing-props-to-a-component) و[الحالة](/learn/state-a-components-memory) وتحديد مشاكل الأداء.

</Intro>

<YouWillLearn>

* كيفية تثبيت أدوات مطوري React

</YouWillLearn>

## إضافة للمتصفح {/*browser-extension*/}

أسهل طريقة لحل المشاكل البرمجية للمواقع المبنية بـ React أن تثبت إضافة أدوات مطوري React للمتصفح. وهي متوفرة لعدة متصفحات شهيرة:

* [تثبيت لـ **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=ar)
* [تثبيت لـ **Firefox**](https://addons.mozilla.org/ar/firefox/addon/react-devtools/)
* [تثبيت لـ **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

الآن، إن زرت موقعًا **مبنيًا باستخدام React** سترى نافذتي _المكونات (Components)_ و _المُحلل (Profiler)_ في أدوات المطور.

![إضافة أدوات مطوري React](/images/docs/react-devtools-extension.png)

## متصفح Safari والمتصفحات الأخرى {/*safari-and-other-browsers*/}

للمتصفحات الأخرى (مثل Safari)، قم بتثبيت حزمة npm [`react-devtools`](https://www.npmjs.com/package/react-devtools):

```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

ثم افتح أدوات المطور في موجه الأوامر (Terminal):

```bash
react-devtools
```

ثم اربط موقعك بإضافة عنصر `<script>` التالي إلى بداية `<head>` في موقعك:

```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

أعد تحميل موقعك الآن في المتصفح لتراه في أدوات المطور.

![أدوات مطوري React المستقلة](/images/docs/react-devtools-standalone.png)

## الهواتف (React Native) {/*mobile-react-native*/}

يمكن استخدام أدوات مطوري React لفحص التطبيقات المبنية بـ [React Native](https://reactnative.dev/).

أسهل طريقة لاستخدام أدوات مطوري React هي تثبيتها على نطاق عام:

```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

ثم افتح أدوات المطور في موجه الأوامر (Terminal):

```bash
react-devtools
```

من المفترض أنه سيتصل بأي تطبيق React Native محلي إن كان يعمل.

> جرب إعادة تحميل التطبيق إن لم تتصل أدوات المطور بعد ثوانٍ.

[تعرّف على المزيد حول تصحيح أخطاء React Native](https://reactnative.dev/docs/debugging).
