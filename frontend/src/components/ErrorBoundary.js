import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // 다음 렌더링에서 폴백 UI를 보여주도록 상태 업데이트
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 리포트 로깅 등 추가 작업 가능
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 폴백 UI
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>앗, 문제가 발생했어요.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error?.toString()}
          </details>
          <button onClick={() => window.location.reload()}>
            다시 시도
          </button>
        </div>
      );
    }

    // 에러가 없으면 자식 컴포넌트 그대로 렌더링
    return this.props.children;
  }
}

export default ErrorBoundary;