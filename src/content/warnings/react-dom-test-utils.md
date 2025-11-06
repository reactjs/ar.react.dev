---
title: تحذيرات إيقاف react-dom/test-utils
---

## تحذير ReactDOMTestUtils.act() {/*reactdomtestutilsact-warning*/}

تم إيقاف `act` من `react-dom/test-utils` لصالح `act` من `react`.

قبل:

```js
import {act} from 'react-dom/test-utils';
```

بعد:

```js
import {act} from 'react';
```

## بقية واجهات ReactDOMTestUtils البرمجية {/*rest-of-reactdomtestutils-apis*/}

تمت إزالة جميع الواجهات البرمجية باستثناء `act`.

يوصي فريق React بترحيل اختباراتك إلى [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) للحصول على تجربة اختبار حديثة ومدعومة بشكل جيد.

### ReactDOMTestUtils.renderIntoDocument {/*reactdomtestutilsrenderintodocument*/}

يمكن استبدال `renderIntoDocument` بـ `render` من `@testing-library/react`.

قبل:

```js
import {renderIntoDocument} from 'react-dom/test-utils';

renderIntoDocument(<Component />);
```

بعد:

```js
import {render} from '@testing-library/react';

render(<Component />);
```

### ReactDOMTestUtils.Simulate {/*reactdomtestutilssimulate*/}

يمكن استبدال `Simulate` بـ `fireEvent` من `@testing-library/react`.

قبل:

```js
import {Simulate} from 'react-dom/test-utils';

const element = document.querySelector('button');
Simulate.click(element);
```

بعد:

```js
import {fireEvent} from '@testing-library/react';

const element = document.querySelector('button');
fireEvent.click(element);
```

كن على علم بأن `fireEvent` يُرسل حدثًا فعليًا على العنصر ولا يستدعي مُعالج الحدث بشكل اصطناعي فقط.

### قائمة بجميع الواجهات البرمجية المحذوفة {/*list-of-all-removed-apis-list-of-all-removed-apis*/}

- `mockComponent()`
- `isElement()`
- `isElementOfType()`
- `isDOMComponent()`
- `isCompositeComponent()`
- `isCompositeComponentWithType()`
- `findAllInRenderedTree()`
- `scryRenderedDOMComponentsWithClass()`
- `findRenderedDOMComponentWithClass()`
- `scryRenderedDOMComponentsWithTag()`
- `findRenderedDOMComponentWithTag()`
- `scryRenderedComponentsWithType()`
- `findRenderedComponentWithType()`
- `renderIntoDocument`
- `Simulate`
