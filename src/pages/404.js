/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import Layout from 'components/Layout';
import React from 'react';
import {sharedStyles} from 'theme';

type Props = {
  location: Location,
};

const PageNotFound = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>الصفحة غير موجودة</Header>
          <TitleAndMetaTags title="React - Page Not Found" />
          <div css={sharedStyles.markdown}>
            <p>لم نتمكن من العثور على ما كنت تبحث عنه.</p>
            <p>
              يرجى الاتصال بمالك الموقع الذي ربطك بعنوان الـ URL الأصلي وإخباره بأن رابطه لا يعمل.
            </p>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default PageNotFound;
