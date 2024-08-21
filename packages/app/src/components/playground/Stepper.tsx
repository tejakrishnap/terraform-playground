import React, { useState } from 'react';

interface StepperProps {
  steps: string[];
  clickHandlers: (() => Promise<void>)[];
}

const Stepper: React.FC<StepperProps> = ({ steps, clickHandlers }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleButtonClick = async (index: number) => {
    if (index === currentStep) {
      await clickHandlers[index]();
      if (index < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentStep(0);
      }
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#FFB130',
        height: 50,
        width: 600,
        borderRadius: 40,
        padding: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
      }}
    >
      {steps.map((step, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(index)}
          disabled={index !== currentStep}
          style={{
            backgroundColor: index === currentStep ? '#1B4F4A' : '#F5F3ED',
            color: index === currentStep ? '#F5F3ED' : '#1B4F4A',
            padding: '8px 36px',
            border: 'none',
            borderRadius: 16,
            fontSize: 14,
            fontWeight: 600,
            cursor: index === currentStep ? 'pointer' : 'not-allowed',
          }}
        >
          {step}
        </button>
      ))}
    </div>
  );
};

export default Stepper;
