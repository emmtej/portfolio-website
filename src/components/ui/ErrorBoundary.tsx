import React, { Component, ErrorInfo, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";
import { Text, Title } from "./Text";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryClass extends Component<Props & { t: any }, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    const { t, fallback, children } = this.props;

    if (this.state.hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="p-8 border border-it-red/20 bg-it-rose/10 flex flex-col items-center justify-center space-y-4 text-center">
          <Title className="text-it-red/60 uppercase">
            {t("common.error.title")}
          </Title>
          <Text className="text-sm max-w-md">
            {t("common.error.description")}
          </Text>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={this.handleReset}
            className="mt-4 border-it-red/20 hover:border-it-red/40 text-it-red/60"
          >
            {t("common.error.retry")}
          </Button>
        </div>
      );
    }

    return children;
  }
}

export function ErrorBoundary(props: Props) {
  const { t } = useTranslation();
  return <ErrorBoundaryClass {...props} t={t} />;
}
