import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Welcome from './Welcome';
import Success from './Success';
import Error from './Error';

const ApiInfo = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [step, setStep] = useState('home');

  const tryAgain = async () => {
    router.push('/manage-api-subscription/');
    setMessage('');
    setSuccess(false);
  };

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      setSuccess(true);
      setSessionId(query.get('session_id'));
    }

    if (query.get('canceled')) {
      setSuccess(false);
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, [sessionId]);

  const handleStep = (newStep) => {
    setStep(newStep);
  };

  if (!success && message === '') {
    return <Welcome handleStep={handleStep} />;
  } else if (success && sessionId !== '') {
    return <Success sessionId={sessionId} />;
  } else {
    return <Error message={message} tryAgain={tryAgain} />;
  }
};

export default ApiInfo;
