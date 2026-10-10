import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("[ErrorBoundary caught error]:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "16px", color: "#fff", background: "rgba(0,0,0,0.6)", borderRadius: "8px", margin: "10px" }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{this.props.fallbackTitle || "Component Notice"}</p>
          <small style={{ opacity: 0.8 }}>Previewing default data while sensor stream initializes.</small>
        </div>
      );
    }
    return this.props.children;
  }
}
