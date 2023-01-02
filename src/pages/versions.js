/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import Layout from 'components/Layout';
import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import React from 'react';
import {urlRoot} from 'site-constants';
import {sharedStyles} from 'theme';

// $FlowFixMe This is a valid path
import versions from '../../content/versions.yml';

type Props = {
  location: Location,
};

const Versions = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>إصدارات React</Header>
          <TitleAndMetaTags
            canonicalUrl={`${urlRoot}/versions/`}
            title="React - الإصدارات"
          />
          <div css={sharedStyles.markdown}>
            <p>
              يمكنك ان تجد تاريخ الإصدارات الكامل لـ React{' '}
              <a
                href="https://github.com/facebook/react/releases"
                target="_blank"
                rel="noopener">
                عبر منصة Github
              </a>
              .<br />
<<<<<<< HEAD
              يمكن أيضًا العثور على الوثائق الخاصة بالإصدارات الحديثة أدناه.
=======
              Changelogs for recent releases can also be found below.
>>>>>>> e77ba1e90338ff18f965c9b94c733b034b3ac18f
            </p>
            <blockquote>
              <p>Note</p>
              <p>
                The current docs are for React 18. For React 17, see{' '}
                <a href="https://17.reactjs.org">https://17.reactjs.org.</a>
              </p>
            </blockquote>
            <p>
              راجع الأسئلة الشائعة الخاصة بنا للحصول على معلومات حول{' '}
              <a href="/docs/faq-versioning.html">
                سياسة الإصدار والالتزام بالاستقرار
              </a>
              .
            </p>
            {versions.map(version => (
              <div key={version.title}>
                <h3>{version.title}</h3>
                <ul>
                  <li>
                    <a href={version.changelog} target="_blank" rel="noopener">
                      سجل التغييرات
                    </a>
                  </li>
                  {version.path && (
                    <li>
                      <a href={version.path} rel="nofollow">
                        المستندات
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default Versions;
