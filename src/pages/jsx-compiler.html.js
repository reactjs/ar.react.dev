/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import Layout from 'components/Layout';
import Container from 'components/Container';
import Header from 'components/Header';
import React from 'react';
import {sharedStyles} from 'theme';

type Props = {
  location: Location,
};

const JsxCompiler = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>خدمة مترجم JSX</Header>
          <div css={sharedStyles.markdown}>
            <p>
              <strong>تمت إزالة الأداة JSXTransformer حيث تم إهمال .</strong>
            </p>
            <p>
              نوصي باستخدام أداة أخرى مثل{' '}
              <a href="https://babeljs.io/repl">the Babel REPL</a>.
            </p>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default JsxCompiler;
