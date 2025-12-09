/**
 * 组件 Props 类型定义
 * 定义 React 组件的属性类型
 */

import type { ComponentType, ReactNode } from 'react';
import type { Location, NavigateFunction, Params } from 'react-router-dom';

// ============================================
// 通用组件 Props
// ============================================

/**
 * 带子元素的组件 Props
 */
export interface WithChildrenProps {
  /** 子元素 */
  children?: ReactNode;
}

/**
 * 带 className 的组件 Props
 */
export interface WithClassNameProps {
  /** CSS 类名 */
  className?: string;
}

// ============================================
// 错误消息组件 Props
// ============================================

/**
 * 错误消息组件 Props
 * 用于显示错误提示信息
 */
export interface ErrorMessageProps {
  /** 错误消息内容 */
  message: string;
  /** 关闭回调函数 */
  onClose: () => void;
}

// ============================================
// 导航栏组件 Props
// ============================================

/**
 * 导航栏组件 Props
 * 导航栏组件目前不需要外部 props，但保留接口以便扩展
 */
export interface NavbarProps {
  /** 可选的额外 CSS 类名 */
  className?: string;
}

// ============================================
// 路由相关 Props
// ============================================

/**
 * 路由器对象类型
 * 包含 react-router-dom 的路由信息
 */
export interface RouterObject {
  /** 当前位置信息 */
  location: Location;
  /** 导航函数 */
  navigate: NavigateFunction;
  /** URL 参数 */
  params: Readonly<Params<string>>;
}

/**
 * WithRouter HOC 注入的 Props
 * 用于类组件获取路由信息
 */
export interface WithRouterProps {
  /** 路由器对象 */
  router: RouterObject;
}

/**
 * WithRouter HOC 类型
 * 高阶组件类型定义
 * @template P - 原组件的 Props 类型
 */
export type WithRouterHOC = <P extends WithRouterProps>(
  Component: ComponentType<P>,
) => ComponentType<Omit<P, keyof WithRouterProps>>;

// ============================================
// 页面组件 Props
// ============================================

/**
 * 登录页面 Props
 */
export interface LoginPageProps extends WithClassNameProps {}

/**
 * 注册页面 Props
 */
export interface RegisterPageProps extends WithClassNameProps {}

/**
 * 用户资料页面 Props
 */
export interface UserProfilePageProps extends WithClassNameProps {}

/**
 * 订单信息页面 Props
 */
export interface OrderInfoPageProps extends WithClassNameProps {}

/**
 * 订单列表页面 Props
 */
export interface OrderListPageProps extends WithClassNameProps {}

/**
 * 支付信息页面 Props
 */
export interface PaymentInfoPageProps extends WithClassNameProps {}

/**
 * 产品列表页面 Props
 */
export interface ProductListPageProps extends WithClassNameProps {}

/**
 * 首页 Props
 */
export interface HomePageProps extends WithClassNameProps {}

// ============================================
// 表单事件类型
// ============================================

/**
 * 输入框变更事件处理函数类型
 */
export type InputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;

/**
 * 表单提交事件处理函数类型
 */
export type FormSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => void;

/**
 * 按钮点击事件处理函数类型
 */
export type ButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => void;

// ============================================
// 组件状态类型
// ============================================

/**
 * 加载状态
 */
export interface LoadingState {
  /** 是否正在加载 */
  loading: boolean;
}

/**
 * 错误状态
 */
export interface ErrorState {
  /** 错误消息，null 表示无错误 */
  error: string | null;
}

/**
 * 通用异步状态
 */
export interface AsyncState extends LoadingState, ErrorState {}
