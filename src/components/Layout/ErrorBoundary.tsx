/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from "react";

interface Props {
  postError?: (error: any, info: any) => void;
  errorText: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

//since ErrorBoundaries are currently not available as functional components ...
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: any, info: any) {
    this.setState({ hasError: true });
    this.props.postError && this.props.postError(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h4>{this.props.errorText || "Sorry, something went wrong."}</h4>;
    }
    return this.props.children;
  }
}
