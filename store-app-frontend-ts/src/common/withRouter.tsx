/**
 * withRouter 高阶组件
 * 为类组件提供 react-router-dom v6 的路由功能
 */

import React, { ComponentType } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { WithRouterProps, RouterObject } from '../types/components';

/**
 * withRouter 高阶组件
 * 将 react-router-dom v6 的 hooks 注入到类组件中
 *
 * @template P - 原组件的 Props 类型，必须包含 WithRouterProps
 * @param Component - 需要注入路由功能的组件
 * @returns 包装后的组件，自动注入 router prop
 * 
 * @example
 * ```tsx
 * interface MyComponentProps extends WithRouterProps {
 *   title: string;
 * }
 * 
 * class MyComponent extends React.Component<MyComponentProps> {
 *   handleClick = () => {
 *     this.props.router.navigate('/home');
 *   };
 *   
 *   render() {
 *     return <div>{this.props.title}</div>;
 *   }
 * }
 * 
 * export default withRouter(MyComponent);
 * ```
 */
export function withRouter<P extends WithRouterProps>(
  Component: ComponentType<P>
): ComponentType<Omit<P, keyof WithRouterProps>> {
  /**
   * 包装组件，使用 hooks 获取路由信息并注入到原组件
   */
  function ComponentWithRouterProp(
    props: Omit<P, keyof WithRouterProps>
  ): React.ReactElement {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const router: RouterObject = {
      location,
      navigate,
      params,
    };

    // 将router 对象与其他 props 合并传递给原组件
    return <Component {...(props as P)} router={router} />;
  }

  // 设置显示名称，便于调试
  const wrappedComponentName =
    Component.displayName || Component.name || 'Component';
  ComponentWithRouterProp.displayName = `withRouter(${wrappedComponentName})`;

  return ComponentWithRouterProp;
}

export default withRouter;