
import { AnimatePresence, motion } from "framer-motion";
import { AlertBox } from "../components/alertbox/alert-box";
import { setTrigger, clearTrigger } from "./error-trigger";
import { Component } from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  message: string;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message };
  }

  componentDidMount() {
    setTrigger((error: Error) =>
      this.setState({ hasError: true, message: error.message })
    );
  }

  componentWillUnmount() {
    clearTrigger();
  }

  handleClose = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    return (
      <>
        <div className="fixed top-4 right-4 z-5000 mt-20">
          <AnimatePresence mode="wait">
            {this.state.hasError && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <AlertBox
                  message={this.state.message}
                  onClose={this.handleClose}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {this.props.children}
      </>
    );
  }
}
