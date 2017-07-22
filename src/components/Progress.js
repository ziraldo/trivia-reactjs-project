import React from "react";
import { ProgressBar } from 'react-bootstrap';

class Progress extends React.Component {
  render() {
    let statusLabel;
    let statusProgress;
    if (this.props.currentStep === this.props.totalSteps) {
      statusProgress = 100;
      statusLabel = "Complete";
    } else {
      statusProgress = this.percentage(
        this.props.currentStep,
        this.props.totalSteps
      );
      statusLabel = statusProgress + "%";
    }
    return (
        <ProgressBar now={statusProgress} label={statusLabel} />
    );
  }

  percentage(num1, num2) {
    return (num1 / num2) * 100;
  }
}

export default Progress