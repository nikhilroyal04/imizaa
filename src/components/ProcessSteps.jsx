import React, { useEffect, useRef } from 'react';

const ProcessSteps = () => {
  const sectionRef = useRef(null);

  // Process steps data
  const steps = [
    {
      id: 1,
      title: 'Apply Online',
      description: 'Fill out our simple application form with your travel details and personal information.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Upload Documents',
      description: 'Upload your passport, photos, and other required documents securely to our platform.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Visa Processing',
      description: 'Our experts process your application and liaise with embassies and consulates on your behalf.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Receive Your Visa',
      description: 'Get your approved visa delivered electronically or by mail, ready for your journey!',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  // Animation for the steps on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const stepElements = document.querySelectorAll('.process-step');
    stepElements.forEach((el) => observer.observe(el));

    // Animate the single plane when the section is in view
    const planeElement = document.querySelector('.single-plane-animation');
    if (planeElement) {
      observer.observe(planeElement);
    }

    return () => {
      stepElements.forEach((el) => observer.unobserve(el));
      if (planeElement) {
        observer.unobserve(planeElement);
      }
    };
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 bg-gradient-to-b from-white to-[#fdf0f2]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-1 rounded-full text-sm bg-[#fdf0f2] text-[#b76e79] mb-4">
            <span className="mr-2">✈️</span>
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-4xl font-bold mb-3 text-[#4a3e42]">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Get your visa in 4 simple steps with our streamlined process
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="process-step opacity-0 transition-all duration-700 delay-300 transform translate-y-8 bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center relative z-10 border border-gray-100 hover:shadow-xl hover:-translate-y-1"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[#014421] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md">
                  {step.id}
                </div>
                <div className="mb-4 bg-[#fdf0f2] p-3 rounded-full">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-[#4a3e42]">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Connecting Lines with Single Animated Flight Path */}
          <div className="hidden md:block">
            {/* Continuous line across all steps */}
            <div className="absolute top-1/3 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-[#4299e1] via-[#4299e1] to-[#4299e1] rounded z-0">
              {/* Single airplane that travels across all steps */}
              <div className="single-plane-animation opacity-0 absolute top-1/2 transform -translate-y-1/2">
                <div className="relative">
                  <div className="absolute -top-5 -left-1 w-12 h-5 bg-[#fdf0f2] rounded-full opacity-40 animate-pulse"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#b76e79] transform rotate-45" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
