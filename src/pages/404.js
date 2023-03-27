/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

<<<<<<< HEAD
const PageNotFound = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>الصفحة غير موجودة</Header>
          <TitleAndMetaTags title="React - الصفحة غير موجودة" />
          <div css={sharedStyles.markdown}>
            <p>لم نتمكن من العثور على ما كنت تبحث عنه.</p>
            <p>
              يرجى الاتصال بمالك الموقع الذي ربطك بعنوان الـ URL الأصلي وإخباره
              بأن رابطه لا يعمل.
            </p>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default PageNotFound;
=======
export default function NotFound() {
  return (
    <Page toc={[]} meta={{title: 'Not Found'}} routeTree={sidebarLearn}>
      <MaxWidth>
        <Intro>
          <P>This page doesn’t exist.</P>
          <P>
            If this is a mistake{', '}
            <A href="https://github.com/reactjs/react.dev/issues/new">
              let us know
            </A>
            {', '}
            and we will try to fix it!
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
>>>>>>> e5fd79cdbb296b87cab7dff17c3b7feee5dba96b
