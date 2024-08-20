import React, { useState } from 'react';

const Stepper = ({ steps, clickHandlers }) => {
    // const steps = ['1. Generate', '2. Plan', '3. Apply', '4. Push to Gitlab'];

    // const clickHandlers = [
    //   async () => {
    //     // await axios.get('/api/generate');
    //     alert('Generate step completed');
    //   },
    //   async () => {
    //     // await axios.get('/api/plan');
    //     alert('Plan step completed');
    //   },
    //   async () => {
    //     // await axios.get('/api/apply');
    //     alert('Apply step completed');
    //   },
    //   async () => {
    //     // await axios.get('/api/push-to-gitlab');
    //     alert('Push to Gitlab step completed');
    //   }
    // ];

    // <Stepper steps={steps} clickHandlers={clickHandlers} />
  const [currentStep, setCurrentStep] = useState(0);

  const handleButtonClick = async (index) => {
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
    <div style={{backgroundColor: '#FFB130', height: 60, width: 800, borderRadius: 16, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28}}>
      {steps.map((step, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(index)}
          disabled={index !== currentStep}
          style={{
            backgroundColor: index === currentStep ? '#1B4F4A' : '#F5F3ED',
            color: index === currentStep ? '#F5F3ED' : '#1B4F4A',
            padding: '12px 40px',
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
