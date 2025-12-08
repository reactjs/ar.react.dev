/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const template = {
  '/src/index.js': {
    hidden: true,
    code: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
  },
  '/package.json': {
    hidden: true,
    code: JSON.stringify(
      {
        name: 'react.dev',
        version: '0.0.0',
        main: '/src/index.js',
        scripts: {
          start: 'react-scripts start',
          build: 'react-scripts build',
          test: 'react-scripts test --env=jsdom',
          eject: 'react-scripts eject',
        },
        dependencies: {
<<<<<<< HEAD
          react: '^19.2.0',
          'react-dom': '^19.2.0',
=======
          react: '^19.2.1',
          'react-dom': '^19.2.1',
>>>>>>> e22544e68d6fffda33332771efe27034739f35a4
          'react-scripts': '^5.0.0',
        },
      },
      null,
      2
    ),
  },
  '/public/index.html': {
    hidden: true,
    code: `<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body dir="rtl">
  <div id="root"></div>
</body>
</html>`,
  },
};
