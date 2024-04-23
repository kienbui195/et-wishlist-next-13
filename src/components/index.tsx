'use client'

import React, { lazy, Suspense, ReactElement } from 'react';
import { convertKeys } from '../utils/function';

const HeaderBarSingleContent = lazy(() => import('./HeaderBar/SingleContent'));
const HeaderBarMultiContent = lazy(() => import('./HeaderBar/MultiContent'));
const BannerImage = lazy(() => import('./TopBanner/BannerImage'));
const BannerText = lazy(() => import('./TopBanner/BannerText'));
const SidebarTag = lazy(() => import('./Sidebar/SidebarTag'));
const SidebarBanner = lazy(() => import('./Sidebar/SidebarBanner'));

interface IComponents {
  [key: string]: React.ElementType;
}

const Components: IComponents = {
  'shared.global-header-single': HeaderBarSingleContent,
  'shared.global-header-multi': HeaderBarMultiContent,
  'shared.top-banner-image': BannerImage,
  'shared.top-banner-text': BannerText,
  'shared.sidebar-tag': SidebarTag,
  'shared.sidebar-popular-tag': SidebarTag,
  'shared.sidebar-banner': SidebarBanner,
};

interface ComponentProps {
  __component: string;
  id: string;
  content: any; // Change the type as per your data structure
  options: any; // Change the type as per your data structure
}

const Component = (data: ComponentProps): ReactElement | null => {
  if (typeof Components[data.__component] !== 'undefined') {
    return React.createElement(Components[data.__component], {
      key: data.__component + data.id,
      componentId: data.__component,
      value: data.content,
      options: convertKeys(data.options),
    });
  }
  return null;
};

const WrapperComponent = (data: any): ReactElement | null => {
  return <Suspense fallback={<React.Fragment></React.Fragment>}>{Component(data)}</Suspense>;
};

export default WrapperComponent;
